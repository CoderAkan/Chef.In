const apiKey = 'babd05cb902bf210f6233b68df49282f';
const appId = '0bffc178';
const baseUrl = 'https://api.edamam.com/api/recipes/v2';

document.getElementById('search-bar').addEventListener('input', function(event) {
  document.getElementById('modal-search-bar').value = event.target.value; // Sync input values
  searchRecipes(event.target.value);
});

function searchRecipes(searchText) {
  const searchModal = document.getElementById('search-modal');
  const modalSearchBar = document.getElementById('modal-search-bar');
  modalSearchBar.placeholder = searchText; // Set placeholder to current search text
  if (searchText.length > 0) {
    fetch(`${baseUrl}?type=public&q=${searchText}&app_id=${appId}&app_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        displaySearchResults(data.hits);
        searchModal.style.display = 'flex';
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
        searchModal.style.display = 'none';
      });
  } else {
    searchModal.style.display = 'none';
  }
}

function clearSearch() {
  const modalSearchBar = document.getElementById('modal-search-bar');
  modalSearchBar.value = '';
  modalSearchBar.placeholder = 'Search recipes...'; // Reset placeholder after clear
}

function displaySearchResults(recipes) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '';
  recipes.forEach(recipe => {
    const searchItem = `<div class="search-item" onclick="displayRecipeDetails('${recipe.recipe.uri.split('_')[1]}')">
      <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
      <p>${recipe.recipe.label}</p>
    </div>`;
    resultsContainer.innerHTML += searchItem;
  });
}

function displayRecipeDetails(uri) {
  fetch(`${baseUrl}/${uri}?type=public&app_id=${appId}&app_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const recipe = data.recipe;
      const detailsContainer = document.getElementById('recipe-details');
      detailsContainer.innerHTML = `<img src="${recipe.image}" alt="${recipe.label}">
        <h1>${recipe.label}</h1>
        ${recipe.ingredients.map(ing => `<div class="ingredient">
          <img src="${ing.image || 'placeholder.png'}" alt="${ing.text}" style="width:10%;height:10%">
          <p>${ing.text}: ${Math.round(ing.quantity)} ${ing.measure}</p>
        </div>`).join('')}
        <p>Время приготовления: ${recipe.totalTime} минут</p>
        <p>Общая масса: ${Math.round(recipe.totalWeight)} грамм</p>`;
      document.getElementById('detail-modal').style.display = 'flex';
      document.getElementById('detail-modal').dataset.recipeUrl = recipe.url; // Storing recipe URL in modal dataset
    });
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function openRecipeUrl() {
  const recipeUrl = document.getElementById('detail-modal').dataset.recipeUrl;
  if (recipeUrl) {
    window.open(recipeUrl, '_blank');
  } else {
    alert('Recipe URL not available.');
  }
}

function fetchPopularRecipes() {
  fetch(`${baseUrl}?type=public&q=popular&app_id=${appId}&app_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const popularContainer = document.getElementById('popular-recipes');
      data.hits.forEach(recipe => {
        const totalW = Math.round(recipe.recipe.totalWeight);
        const recipeCard = `<div class="recipe-card" onclick="displayRecipeDetails('${recipe.recipe.uri.split('_')[1]}')">
          <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}" style="width: 100%;">
          <p class="mt-3">${recipe.recipe.label}</p>
          <div class="row justify-content-between">
            <div class="col">
              <div>${recipe.recipe.totalTime} мин</div>
            </div>
            <div class="col">
              <div>${totalW} г</div>
            </div>
          </div>
        </div>`;
        popularContainer.innerHTML += recipeCard;
      });
    });
}

fetchPopularRecipes();
