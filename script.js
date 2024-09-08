// Select DOM elements
const searchBtn = document.getElementById('search-btn');
const inputField = document.getElementById('ingredient-input');
const recipeContainer = document.getElementById('recipe-container');

// Fetch recipes based on user input
async function getRecipes(ingredients) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayRecipes(data.meals);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeContainer.innerHTML = '<p>No recipes found.</p>';
    }
}

// Display fetched recipes
function displayRecipes(recipes) {
    recipeContainer.innerHTML = ''; // Clear previous results

    if (!recipes) {
        recipeContainer.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <h2>${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="100">
            <button onclick="getRecipeDetails('${recipe.idMeal}')">View Recipe</button>
        `;
        recipeContainer.appendChild(recipeCard);
    });
}

// Fetch detailed recipe info
async function getRecipeDetails(id) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const recipe = data.meals[0];
        displayRecipeDetails(recipe);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

// Display detailed recipe info
function displayRecipeDetails(recipe) {
    recipeContainer.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="200">
        <h3>Ingredients</h3>
        <ul>
            ${Object.keys(recipe)
                .filter(key => key.startsWith('strIngredient') && recipe[key])
                .map(key => `<li>${recipe[key]}</li>`)
                .join('')}
        </ul>
        <h3>Instructions</h3>
        <p>${recipe.strInstructions}</p>
        <button onclick="location.reload()">Back to Search</button>
    `;
}

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const ingredients = inputField.value.trim();
    if (ingredients) {
        getRecipes(ingredients);
    }
});
