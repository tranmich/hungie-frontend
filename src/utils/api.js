// API Configuration and Utilities

// Environment-based API URL with production fallback
const getApiUrl = () => {
  // Always use Railway backend for now to ensure it works
  return 'https://hungie-backend-production.up.railway.app';
  
  // TODO: Re-enable environment detection once local backend is set up
  // if (process.env.NODE_ENV === 'production') {
  //   return 'https://hungie-backend-production.up.railway.app';
  // }
  // return process.env.REACT_APP_API_URL || 'http://localhost:8000';
};

const API_BASE_URL = getApiUrl();

console.log('🚀 API Configuration [UPDATED]:', {
  API_BASE_URL,
  environment: process.env.NODE_ENV,
  production: process.env.NODE_ENV === 'production',
  envVar: process.env.REACT_APP_API_URL,
  finalUrl: API_BASE_URL,
  timestamp: new Date().toISOString()
});

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('📡 API Call:', { url, method: options.method || 'GET' });
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    console.log('📡 API Response:', { 
      url, 
      status: response.status, 
      statusText: response.statusText,
      contentType: response.headers.get('content-type')
    });
    
    if (!response.ok) {
      // Try to get error details
      const errorText = await response.text();
      console.error('❌ API Error Details:', { 
        status: response.status, 
        statusText: response.statusText,
        responseText: errorText.substring(0, 500),
        url: url
      });
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText.substring(0, 100)}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('❌ Non-JSON Response:', {
        contentType,
        url,
        responseText: textResponse.substring(0, 500),
        fullResponse: textResponse
      });
      throw new Error('Expected JSON response but got: ' + contentType + '. Response: ' + textResponse.substring(0, 100));
    }
    
    return await response.json();
  } catch (error) {
    console.error('💥 API call error:', error);
    throw error;
  }
};

export const api = {
  // Recipe endpoints
  getRecipe: (id) => apiCall(`/api/recipes/${id}`),
  searchRecipes: (query) => apiCall(`/api/search?q=${encodeURIComponent(query)}`),
  getCategories: () => apiCall('/api/categories'),
  
  // AI Chat endpoints
  smartSearch: (message, context = '') => apiCall('/api/smart-search', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  }),
  
  // Substitution endpoints
  getSubstitution: (ingredient, recipeContext = '') => apiCall('/api/substitutions', {
    method: 'POST',
    body: JSON.stringify({ ingredient, recipe_context: recipeContext }),
  }),
  
  getBulkSubstitutions: (ingredients, recipeContext = '') => apiCall('/api/substitutions/bulk', {
    method: 'POST',
    body: JSON.stringify({ ingredients, recipe_context: recipeContext }),
  }),
  
  browseSubstitutions: () => apiCall('/api/substitutions/browse'),
};

export default api;
