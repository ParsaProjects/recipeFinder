// Select DOM elements
const searchBtn = document.getElementById('search-btn');
const inputField = document.getElementById('ingredient-input');
const recipeContainer = document.getElementById('recipe-container');
const favoritesContainer = document.getElementById('favorites-container');
const randomRecipesContainer = document.getElementById('random-recipes-container');

// Fetch recipes based on user input
async function getRecipes(ingredients) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.meals) {
            displayRecipes(data.meals);
        } else {
            recipeContainer.innerHTML = '<p>No recipes found.</p>';
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeContainer.innerHTML = '<p>No recipes found.</p>';
    }
}

// Display fetched recipes
function displayRecipes(recipes) {
    recipeContainer.innerHTML = ''; // Clear previous results

    if (!recipes || recipes.length === 0) {
        recipeContainer.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.setAttribute('data-id', recipe.idMeal); // Set data-id attribute

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
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
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
        <button onclick="addToFavorites('${recipe.idMeal}', '${recipe.strMeal}', '${recipe.strMealThumb}')">Add to Favorites</button>
        <button onclick="location.reload()">Back to Search</button>
    `;
}

// Add recipe to favorites
function addToFavorites(id, name, thumb) {
    // Check if the recipe is already in favorites
    const existingFavorite = document.querySelector(`#favorites-container .recipe-card[data-id="${id}"]`);
    if (existingFavorite) return;

    // Create a new recipe card for favorites
    const favoriteCard = document.createElement('div');
    favoriteCard.classList.add('recipe-card');
    favoriteCard.innerHTML = `
        <h2>${name}</h2>
        <img src="${thumb}" alt="${name}" width="100">
        <button onclick="removeFromFavorites('${id}')">Remove from Favorites</button>
    `;
    favoriteCard.setAttribute('data-id', id); // Set data-id attribute

    // Append the new card to the favorites container
    favoritesContainer.appendChild(favoriteCard);
}

// Remove recipe from favorites
function removeFromFavorites(id) {
    const favoriteCard = document.querySelector(`#favorites-container .recipe-card[data-id="${id}"]`);
    if (favoriteCard) {
        favoritesContainer.removeChild(favoriteCard);
    }
}

// Fetch multiple random recipes
async function getRandomRecipes() {
    const numberOfRecipes = 5; // Number of random recipes you want to fetch
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/random.php`;

    const recipes = [];

    try {
        for (let i = 0; i < numberOfRecipes; i++) {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.meals) {
                recipes.push(...data.meals);
            }
        }
        displayRandomRecipes(recipes);
    } catch (error) {
        console.error('Error fetching random recipes:', error);
        randomRecipesContainer.innerHTML = '<p>No random recipes found.</p>';
    }
}

// Display random recipes
function displayRandomRecipes(recipes) {
    randomRecipesContainer.innerHTML = ''; // Clear previous results

    if (!recipes || recipes.length === 0) {
        randomRecipesContainer.innerHTML = '<p>No random recipes found.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.setAttribute('data-id', recipe.idMeal); // Set data-id attribute

        recipeCard.innerHTML = `
            <h2>${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="100">
            <button onclick="getRecipeDetails('${recipe.idMeal}')">View Recipe</button>
        `;
        randomRecipesContainer.appendChild(recipeCard);
    });
}

// Open tab
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-button[onclick="openTab('${tabId}')"]`).classList.add('active');
}

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const ingredients = inputField.value.trim();
    if (ingredients) {
        getRecipes(ingredients);
    } else {
        recipeContainer.innerHTML = '<p>Please enter an ingredient.</p>';
    }
});

// Initialize to show the search tab and load random recipes
openTab('search');
getRandomRecipes(); // Load random recipes on page load
