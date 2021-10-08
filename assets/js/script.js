// get API key from spoonacular
// var apiKey = '26555838e1c640c8909140566fd58a8e';
// var apiKey = '05cf9b96da3f4148be6fb375f52b09f7';
// var apiKey = "4a6a04aea236416ab98658ba50b78531";
var apiKey = "2a64281727af48ea8db7e73091d1ab74" 
// get main elements from HTML based on their id
var ingredientsBox = document.getElementById('userIngredients');
var generateBtn = document.getElementById('generate-recipe');
var autocompleteInput = document.getElementById('autocomplete-input');
var submitBtn = document.getElementById('searchBtn');
var ourRecipeCards = document.getElementById('ourRecipeCards');
var inputField = document.querySelector('.autocomplete');
// declare global variables
var autoCompleteListItem, potentialRecipe, search_value, obj;
var recipeImgURL, recipeTitle, calories, carbs, fat, protein, satFat, sugar, sodium, sourceURL, sourceName, recipeTime, usedIngredientsArray;
// define recipe results and individual ingredients
var individual_ingredients = '';
var recipeResults = [];
var userInputArray = [];
var autoCompleteOptions = [];
var recipeCollection = [];
// create empty array to hold user input values
var massiveDataStructure = [ Array(), Array(), Array() ];
// access local storage and populate saved ingredients if there is anything in local storage
var userStorageArray = JSON.parse(localStorage.getItem('userIngredients'));
if (userStorageArray !== null) {
	userInputArray = userStorageArray;
	for (var i = 0; i < userInputArray.length; i++) {
		populateIngredient(userInputArray[i]);
	}
}
// make function to add the ingredient to the ingredient list
function populateIngredient(ingredient) {
	// resetting value of user input box
	var ingredientsBtn = document.createElement('div');
	ingredientsBtn.setAttribute('class', 'chip');
	ingredientsBtn.setAttribute('style', 'line-height: 7.5px;');
	var paragraph = document.createElement('p');
	paragraph.textContent = ingredient;
	paragraph.setAttribute('style', 'display:inline-block; ');
	ingredientsBtn.appendChild(paragraph);
	var closeIcon = document.createElement('i');
	closeIcon.setAttribute('class', 'close material-icons');
	closeIcon.textContent = 'delete_forever';
	closeIcon.setAttribute('style', 'display:inline-block');
	closeIcon.addEventListener('click', function(event) {
		var newArray = [];
		for (var element of userInputArray) {
			console.log(event.target.parentElement.firstChild.textContent);
			if (element !== event.target.parentElement.firstChild.textContent) {
				newArray.push(element);
			}
			localStorage.removeItem('userIngredients');
			localStorage.setItem('userIngredients', JSON.stringify(newArray));
		}
	});
	ingredientsBtn.appendChild(closeIcon);
	ingredientsBox.appendChild(ingredientsBtn);
}
// function to generate an array of autocomplete list items
function autoCompleteApiCall(autoCompleteAPI) {
	$.ajax({
		url: autoCompleteAPI,
		method: 'GET',
		// store API call into cache for quicker processing
		cache: true
	}).then(function(response) {
		autoCompleteListItem = [];
		// loop over data returned from autocomplete api
		for (var i = 0; i < response.length; i++) {
			// push onto list of options array for autocomplete functionality
			autoCompleteListItem.push(response[i].name);
		}
		console.log(autoCompleteListItem);
		obj = autoCompleteListItem.reduce((a, v) => ({ ...a, [v]: null }), {});
		var instances = M.Autocomplete.init(inputField, {
			// we need to make this data dynamic
			data: obj,
			// limit autocomplete results to 6 items
			limit: 6,
			// make sure at least one item is displayed if autocomplete is working
			minLength: 1
		});
		// keep the autocomplete open for the user
		instances.open();
		// return instances object
		return instances;
	});
}
// build individual ingredients query string
function buildIngredientsQuery() {
	// loop through the array of user input values
	for (var i = 0; i < userInputArray.length; i++) {
		if (i === 0) {
			//add individual ingredient to query string for api call
			individual_ingredients = individual_ingredients + userInputArray[i];
		} else {
			individual_ingredients = individual_ingredients + ',+' + userInputArray[i];
		}
	}
	console.log(individual_ingredients);
}
// create function to generate recipes
function generateRecipes() {
	ourRecipeCards.innerHTML = '';
	buildIngredientsQuery();
	// create dynamic recipe by ingredient api call
	var recipeByIngredient = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${individual_ingredients}&number=10&ranking=2&apiKey=${apiKey}`;
	// fetch the recipe based on ingredients from API
	fetch(recipeByIngredient)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			console.log(data.length);
			// accessing recipes in returned array of data
			for (var element of data) {
				console.log(element);
				// if there are no missing ingredients
				if (element.missedIngredientCount === 0) {
					// get each potential recipe from api data
					potentialRecipe = element;
					console.log(potentialRecipe);
					// push result onto an array
					recipeResults.push(potentialRecipe);
					massiveDataStructure[0].push(potentialRecipe);
				}
			}
			// TODO - If we have time, show them recipes they are 1 item away from being able to make
			console.log(recipeResults);
			// massiveDataStructure.push(recipeResults);
			for (var i = 0; i < recipeResults.length; i++) {
				console.log(recipeResults[i]);
				// get recipe item/object
				var recipeItem = recipeResults[i];
				// extract recipe ID for nutrition info
				var recipeID = recipeItem.id;
				console.log(recipeID);
				// call nutrition info function with recipe ID parameter
				recipeNutritionInfo(recipeID);
			}
			setTimeout(displayRecipeCards,3000);
		});
}
// create function to display nutrition information for each recipe
function recipeNutritionInfo(ID) {
	// dynamically access nutrition info API
	var fetchRecipeNutrition = `https://api.spoonacular.com/recipes/${ID}/nutritionWidget.json?apiKey=${apiKey}`;
	// fetch data from the api
	fetch(fetchRecipeNutrition)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			massiveDataStructure[1].push(data);
			// get access to individual nutrition info data points of concern
			console.log(data);
			// TODO - They have a "good" array of nutrition info including fiber, iron, etc. (if we want to do that later ... it's kinda complicated)
		}).then( function(stuff) {
			getRecipeInstructions(ID)
		});
}
// create function to get the instructions for the recipe
function getRecipeInstructions(ID) {
	var instrAPI = `https://api.spoonacular.com/recipes/${ID}/information?apiKey=${apiKey}`;
	console.log(instrAPI);
	fetch(instrAPI)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			massiveDataStructure[2].push(data);
			console.log(data);
			// TODO - specify food allergies with this API call
		});
}
// populate recipe cards
function displayRecipeCards() {
	console.log(massiveDataStructure);
	for (let i = 0; i < massiveDataStructure[0].length; i++) {
		// create div element for the from of the recipe card
		var singleRecipeCard = document.createElement('div');
		singleRecipeCard.setAttribute('class', 'card');
		ourRecipeCards.appendChild(singleRecipeCard);
		
		for (let j = 0; j < massiveDataStructure.length; j++) {
			if (j === 0) {
				// TODO --> FIRST ITEM IN ARRAY
				// get title of recipe, image url, used ingredients
				recipeImgURL = massiveDataStructure[j][i].image;
				recipeTitle = massiveDataStructure[j][i].title;
				// usedIngredientsArray = massiveDataStructure[j][i].usedIngredients;
			} else if (j === 1) {
				//TODO --> SECOND ITEM IN ARRAY
				// get calories, carbs, fat, protein, saturated fat, sugar, sodium
				calories = massiveDataStructure[j][i].calories;
				carbs = massiveDataStructure[j][i].carbs;
				fat = massiveDataStructure[j][i].fat;
				protein = massiveDataStructure[j][i].protein;
				satFat = massiveDataStructure[j][i].bad['2'].amount;
				sugar = massiveDataStructure[j][i].bad['4'].amount;
				sodium = massiveDataStructure[j][i].bad['6'].amount;
			} else if (j === 2) {
				// TODO --> THIRD ITEM IN ARRAY
				// get sourceURL, sourceName, recipeTime
				sourceURL = massiveDataStructure[j][i].sourceUrl;
				sourceName = massiveDataStructure[j][i].sourceName;
				recipeTime = massiveDataStructure[j][i].readyInMinutes;
			}
			singleRecipeCard.innerHTML = `
			<div class="card-image waves-effect waves-block waves-light">
				<div class="col s12 m5">
					<img class="activator" src="${recipeImgURL}" />
				</div>
			</div>
			<div class="card-content">
				<span class="card-title activator">${recipeTitle}<i class="material-icons right">more_vert</i></span>
				<p><a href="${sourceURL}" target="_blank" id="linkToRecipe">See Full Recipe On ${sourceName}</a></p>
			</div>
			<div class="card-reveal">
				<span class="card-title">Nutritional Values<i class="material-icons right">close</i></span>
				<table class="striped">
					<thead>
						<tr>
						<th>Nutrition Facts</th>
						<th>Amount</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Calories</td>
							<td id="calVal">${calories}</td>
						</tr>
						<tr>
							<td>Carbs</td>
							<td id="carbVal">${carbs}</td>
						</tr>
						<tr>
							<td>Fat</td>
							<td id="fatVal">${fat}</td>
						</tr>
						<tr>
							<td>SaturatedFat</td>
							<td id="satFatVal">${satFat}</td>
						</tr>
						<tr>
							<td>Protein</td>
							<td id="proteinVal">${protein}</td>
						</tr>
						<tr>
							<td>Sugar</td>
							<td id="sugarVal">${sugar}</td>
						</tr>
						<tr>
							<td>Sodium</td>
							<td id="sodiumVal">${sodium}</td>
						</tr>
					</tbody>
				</table>
				<div>
					<ul id="cardFooter">
						<li class="prepTime">Estimated Prep + Cook Time: ${recipeTime}</li>
						<li class="sourceName">Source: <a href="${sourceURL}" target="_blank">${sourceName}</a></li>
					</ul>
				</div>
			</div>`;
		}
	}
}
// add event listener to submit button
submitBtn.addEventListener('click', function(e) {
	e.preventDefault();
	// push user input value onto user input array
	userInputArray.push(autocompleteInput.value);
	// push on array of options it gives us users ingredients we want to store that arrray in local storage
	localStorage.removeItem('userIngredients');
	localStorage.setItem('userIngredients', JSON.stringify(userInputArray));
	populateIngredient(autocompleteInput.value);
	autocompleteInput.value = '';
});
// add event listener for generate button
generateBtn.addEventListener('click', generateRecipes);
// create key up event listener for autocomplete input
autocompleteInput.addEventListener('keyup', function() {
	// set the search value to be the current autocomplete input's value
	search_value = autocompleteInput.value;
	// create query string for API call with search value and api key
	var autoCompleteAPI = `https://api.spoonacular.com/food/ingredients/autocomplete?query=${search_value}&number=15&apiKey=${apiKey}`;
	// call autocomplete function
	autoCompleteApiCall(autoCompleteAPI);
});
// event listener from materialize that opens the side drawer
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.sidenav');
	var instances = M.Sidenav.init(elems);
});
// event listener for the dropdown
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.modal');
	var instances = M.Modal.init(elems);
});
