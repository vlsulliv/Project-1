// get API key from spoonacular
var apiKey1 = "26555838e1c640c8909140566fd58a8e";
var apiKey = "05cf9b96da3f4148be6fb375f52b09f7";

// get main elements from HTML based on their id
var ingredientsBox = document.getElementById("userIngredients");
var generateBtn = document.getElementById("generate-recipe");
var autocompleteInput = document.getElementById("autocomplete-input");
var submitBtn = document.getElementById("searchBtn");
var ourRecipeCards = document.getElementById("ourRecipeCards")
// declare global variables
var autoCompleteListItem, search_value, obj;
var calories, carbs, fat, protein, satFat, sugar, sodium, recipeImgURL, recipeTitle, usedIngredientsArray;
var sourceURL, sourceName, recipeSummary, recipeInstr, recipeTime;
// define recipe results and individual ingredients
var individual_ingredients = "";
var recipeResults = [];
// create empty array to hold user input values
var userInputArray = [];
// add event listener to submit button
submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(autocompleteInput.value);
    // push user input value onto user input array
    userInputArray.push(autocompleteInput.value);
    console.log(userInputArray);
    // resetting value of user input box
    var ingredientsBtn = document.createElement("div");
    ingredientsBtn.textContent = autocompleteInput.value;
    ingredientsBtn.setAttribute("class", "chip");
	var closeIcon = document.createElement('i');
	closeIcon.setAttribute("class", "close material-icons");
	closeIcon.textContent = "delete_forever";
	ingredientsBtn.appendChild(closeIcon);
    ingredientsBox.appendChild(ingredientsBtn);
    autocompleteInput.value = "";
});
// function to generate an array of autocomplete list items
function autoCompleteApiCall(autoCompleteAPI) {
    $.ajax({
        url: autoCompleteAPI,
        method: "GET",
        // store API call into cache for quicker processing
        cache: true,
    }).then(function (response) {
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
            minLength: 1,
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
            individual_ingredients =
                individual_ingredients + ",+" + userInputArray[i];
        }
    }
    console.log(individual_ingredients);
}

var inputField = document.querySelector(".autocomplete");
var autoCompleteOptions = [];
// create key up event listener for autocomplete input
autocompleteInput.addEventListener("keyup", function () {
    console.log(autocompleteInput.value);
    // set the search value to be the current autocomplete input's value
    search_value = autocompleteInput.value;
    // create query string for API call with search value and api key
    var autoCompleteAPI = `https://api.spoonacular.com/food/ingredients/autocomplete?query=${search_value}&number=15&apiKey=${apiKey}`;
    // call autocomplete function
    autoCompleteApiCall(autoCompleteAPI);
});
// add event listener for generate button
generateBtn.addEventListener("click", generateRecipes);

function generateRecipes() {
    buildIngredientsQuery();
    // create dynamic recipe by ingredient api call
    var recipeByIngredient = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${individual_ingredients}&number=10&apiKey=${apiKey}&ranking=2`;
    // fetch the recipe based on ingredients from API
    fetch(recipeByIngredient)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            // accessing recipes in returned array of data
            for (var key in data) {
                console.log(data[`${key}`]);
                // if there are no missing ingredients
                if (data[`${key}`].missedIngredientCount === 0) {
                    // get each potential recipe from api data
                    var potentialRecipe = data[`${key}`];
                    console.log(potentialRecipe.title);
                    // push result onto an array
                    recipeResults.push(potentialRecipe);
                }
            }
            console.log(recipeResults);
            for (var i = 0; i < recipeResults.length; i++) {
                console.log(recipeResults[i]);
				// img url
                console.log(recipeResults[i].image);
				recipeImgURL = recipeResults[i].image;
				// title of recipe
                console.log(recipeResults[i].title);
				recipeTitle = recipeResults[i].title;
				// array of the ingredients used in recipe
                console.log(recipeResults[i].usedIngredients);
				usedIngredientsArray = recipeResults[i].usedIngredients;
            }
            // loop through the array of results
            for (var i = 0; i < recipeResults.length; i++) {
                // get recipe item/object
                var recipeItem = recipeResults[i];
                // extract recipe ID for nutrition info
                var recipeID = recipeItem.id;
                // call nutrition info function with recipe ID parameter
                console.log(recipeID);
                recipeNutritionInfo(recipeID);
            }
        });
}
// create function to display nutrition information for each recipe
function recipeNutritionInfo(ID) {
    // dynamically access nutrition info API
    var fetchRecipeNutrition = `https://api.spoonacular.com/recipes/${ID}/nutritionWidget.json?apiKey=${apiKey}`;
    // fetch data from the api
    fetch(fetchRecipeNutrition)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // get access to individual nutrition info data points of concern
            // console.log(data);
            console.log(data.calories);
			calories = data.calories;
            console.log(data.carbs);
			carbs = data.carbs;
            console.log(data.fat);
			fat = data.fat;
            console.log(data.protein);
			protein = data.protein;
			// sat fat
            console.log(`${data.bad["2"].title}: ${data.bad["2"].amount}`);
			satFat = data.bad["2"].amount;
			// sugar
            console.log(`${data.bad["4"].title}: ${data.bad["4"].amount}`);
			sugar = data.bad["4"].amount;
            // sodium
			console.log(`${data.bad["6"].title}: ${data.bad["6"].amount}`);
			sodium = data.bad["6"].amount;
			getRecipeInstructions(ID);
            // console.log(`${data.good["15"].title}: ${data.good["15"].amount}`)
            // console.log(`${data.good["9"].title}: ${data.good["9"].amount}`)
            // console.log(`${data.good["18"].title}: ${data.good["18"].amount}`)
            // TODO - They have a "good" array of nutrition info including fiber, iron, etc. (if we want to do that later ... it's kinda complicated)
        });
}

function getRecipeInstructions(ID) {
	var instrAPI = `https://api.spoonacular.com/recipes/${ID}/information?apiKey=${apiKey}`;
	console.log(instrAPI);
	fetch(instrAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
			console.log(data);
			// get source url
			console.log(data.sourceUrl);
			sourceURL = data.sourceUrl;
			console.log(data.sourceName);
			sourceName = data.sourceName;
			console.log(data.summary);
			recipeSummary = data.summary;
			console.log(data.instructions);
			recipeInstr = data.instructions;
			console.log(data.readyInMinutes);
			recipeTime = data.readyInMinutes;
			// TODO - specify food allergies with this API call
			displayRecipeCards();
		})
}
// populate recipe cards
function displayRecipeCards() {
	// create div element for the from of the recipe card
	var singleRecipeCard = document.createElement('div');
	singleRecipeCard.setAttribute("class", "card");
	// add inner HTML to use materialize components
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
		</div>`
		ourRecipeCards.appendChild(singleRecipeCard);
}
// api = '42753b9f905340ec9bec5c347c6f8ebd';


// event listener from materialize that opens the side drawer
document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems);
});

// event listener for the dropdown
document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems);
});
