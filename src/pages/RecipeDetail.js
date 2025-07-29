import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipe(id);
  }, [id]);

  const fetchRecipe = async (recipeId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/recipes/${recipeId}`);
      
      if (!response.ok) {
        throw new Error('Recipe not found');
      }
      
      const data = await response.json();
      setRecipe(data.data);
    } catch (err) {
      setError('Recipe not found. It might have been eaten! 🍽️');
      console.error('Recipe fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    if (timeStr.includes('PT')) {
      let result = timeStr.replace('PT', '');
      result = result.replace('H', ' hour ').replace('M', ' min');
      return result.trim();
    }
    return timeStr;
  };

  const getHungieComment = (recipeName) => {
    const comments = [
      "This one's a real crowd-pleaser! 🎉",
      "Get ready for some serious flavor! 🔥",
      "Your kitchen is about to smell AMAZING! 👃",
      "This recipe never fails to impress! ⭐",
      "Prepare for compliments galore! 😍",
      "Warning: May cause uncontrollable drooling! 🤤"
    ];
    
    return comments[Math.floor(Math.random() * comments.length)];
  };

  if (loading) {
    return (
      <div className="recipe-detail">
        <div className="loading-container">
          <div className="loading-spinner">👨‍🍳</div>
          <h2>Preparing your recipe...</h2>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail">
        <div className="error-container">
          <h2>Oops! 😅</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="home-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Results
        </button>
        
        <div className="recipe-title-section">
          <h1 className="recipe-title">{recipe.name}</h1>
          <div className="hungie-comment">
            <p>🍴 <em>{getHungieComment(recipe.name)}</em></p>
          </div>
        </div>
      </div>

      <div className="recipe-content">
        {recipe.description && (
          <div className="recipe-description">
            <p>{recipe.description}</p>
          </div>
        )}

        <div className="recipe-meta-info">
          <div className="meta-item">
            <span className="meta-label">⏱️ Prep Time:</span>
            <span className="meta-value">{parseTime(recipe.prep_time)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">🔥 Cook Time:</span>
            <span className="meta-value">{parseTime(recipe.cook_time)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">⏰ Total Time:</span>
            <span className="meta-value">{parseTime(recipe.total_time)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">👥 Servings:</span>
            <span className="meta-value">{recipe.servings || 'N/A'}</span>
          </div>
        </div>

        {recipe.categories && recipe.categories.length > 0 && (
          <div className="recipe-categories">
            <h3>Categories:</h3>
            <div className="category-tags">
              {recipe.categories.map((category, index) => (
                <span key={index} className="category-tag">
                  {category.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="recipe-main-content">
          <div className="ingredients-section">
            <h2>🥗 Ingredients</h2>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <span className="ingredient-amount">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                    <span className="ingredient-name">
                      {ingredient.ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ingredients listed - but I'm sure it's delicious! 😅</p>
            )}
          </div>

          <div className="instructions-section">
            <h2>👨‍🍳 Instructions</h2>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              <ol className="instructions-list">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="instruction-item">
                    <span className="step-number">Step {instruction.step || index + 1}</span>
                    <p className="instruction-text">{instruction.text || instruction.instruction}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p>Instructions coming soon! In the meantime, trust your cooking instincts! 🤞</p>
            )}
          </div>
        </div>

        {recipe.nutrition && (
          <div className="nutrition-section">
            <h2>📊 Nutrition Info</h2>
            <div className="nutrition-grid">
              {recipe.nutrition.calories && (
                <div className="nutrition-item">
                  <span className="nutrition-label">Calories:</span>
                  <span className="nutrition-value">{recipe.nutrition.calories}</span>
                </div>
              )}
              {recipe.nutrition.protein && (
                <div className="nutrition-item">
                  <span className="nutrition-label">Protein:</span>
                  <span className="nutrition-value">{recipe.nutrition.protein}</span>
                </div>
              )}
              {recipe.nutrition.carbs && (
                <div className="nutrition-item">
                  <span className="nutrition-label">Carbs:</span>
                  <span className="nutrition-value">{recipe.nutrition.carbs}</span>
                </div>
              )}
              {recipe.nutrition.fat && (
                <div className="nutrition-item">
                  <span className="nutrition-label">Fat:</span>
                  <span className="nutrition-value">{recipe.nutrition.fat}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="recipe-footer">
          <div className="hungie-encouragement">
            <p>💪 <strong>You've got this!</strong> Remember, cooking is all about having fun and making it your own. Don't stress about perfection - just enjoy the process! 🎉</p>
          </div>
          
          {recipe.url && (
            <div className="original-source">
              <p>
                <strong>Original source:</strong>{' '}
                <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                  View Original Recipe
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
