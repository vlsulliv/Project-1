// get API key from spoonacular
var apiKey = "26555838e1c640c8909140566fd58a8e";
// practice search value
var search_value = "ban";
// dynamic auto complete API link
var autoCompleteAPI = `https://api.spoonacular.com/food/ingredients/autocomplete?query=${search_value}&number=15&apiKey=${apiKey}`;

// TODO - Create connection to HTML element for input so we can access the input's value on keydown events (we did something)
// Keydown event
// textAreaEl.addEventListener('keydown', function(event) {
// 	Access value of pressed key with key property
// 	var key = event.key.toLowerCase();
// 	var alphabetNumericCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789! '.split('');
// 	if (alphabetNumericCharacters.includes(key)) {
// 		for (var i = 0; i < elements.length; i++) {
// 			elements[i].textContent += event.key;
// 		}
// 	}
// });
document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.querySelector(".autocomplete");

    var instances = M.Autocomplete.init(inputField, {
        data: {
            // null values are display icons. We can add later.
            Google: null,
            Yahoo: null,
            Youtube: null,
            OstonCode: null,
        },
        limit: 10,
        minLength: 1,
    });
});

var generateBtn = document.getElementById("generate-recipe");
var autocompleteInput = document.getElementById("autocomplete-input");
var submitBtn = document.getElementById("searchBtn");
var userInputArray = [];

submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(autocompleteInput.value);
    userInputArray.push(autocompleteInput.value);
    console.log(userInputArray);
    autocompleteInput.value = "";
});

// call autocomplete function
autoCompleteApiCall();

// function to generate an array of autocomplete list items
var autoCompleteListItem = [];
function autoCompleteApiCall() {
    fetch(autoCompleteAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // loop over data returned from autocomplete api
            for (var i = 0; i < data.length; i++) {
                console.log(data[i].name);
                // push onto list of options array for autocomplete functionality
                autoCompleteListItem.push(data[i].name);
            }
        });
}

// temporary hard-code for ingredients
// var ingredients = [
//     "apples",
//     "flour",
//     "sugar",
//     "beef broth",
//     "pork tenderloin",
//     "sweet potatoes",
//     "pot roast",
// ];
// define recipe results and individual ingredients
var individual_ingredients = "";
var recipeResults = [];

function buildIngredientsQuery() {
    // build individual ingredients query string
    for (var i = 0; i < userInputArray.length; i++) {
        if (i === 0) {
            individual_ingredients = individual_ingredients + userInputArray[i];
        } else {
            individual_ingredients =
                individual_ingredients + ",+" + userInputArray[i];
        }
    }
    console.log(individual_ingredients);
}

generateBtn.addEventListener("click", generateRecipes);
function generateRecipes() {
    // create dynamic recipe by ingredient api call
    var recipeByIngredient = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${individual_ingredients}&number=20&apiKey=${apiKey}&ranking=2`;

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

    console.log(recipeResults);
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
            console.log(data);
            console.log(data.calories);
            console.log(data.carbs);
            console.log(data.fat);
            console.log(data.protein);
            console.log(`${data.bad["2"].title}: ${data.bad["2"].amount}`);
            console.log(`${data.bad["4"].title}: ${data.bad["4"].amount}`);
            console.log(`${data.bad["6"].title}: ${data.bad["6"].amount}`);
            // console.log(`${data.good["15"].title}: ${data.good["15"].amount}`)
            // console.log(`${data.good["9"].title}: ${data.good["9"].amount}`)
            // console.log(`${data.good["18"].title}: ${data.good["18"].amount}`)
            // TODO - They have a "good" array of nutrition info including fiber, iron, etc. (if we want to do that later ... it's kinda complicated)
        });
}
api = "42753b9f905340ec9bec5c347c6f8ebd";
