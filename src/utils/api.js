// API Configuration and Utilities

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
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
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
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
