var dropdown_lang = document.getElementById("dropdown");

var target_language = dropdown_lang.value;

fetch(`https://google-translate1.p.rapidapi.com/language/translate/v2/languages?key=AIzaSyBi6c1JBkPmzh45xH8DRXjD_6P9q0w0zaU&target=${target_language}`, {
	"method": "GET",
	"headers": {
		"accept-encoding": "application/gzip",
		"x-rapidapi-key": "96f8e26371msh5ae2fe70d5a8e2fp1b484cjsn6f1f691de9ab",
		"x-rapidapi-host": "google-translate1.p.rapidapi.com"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.error(err);
});

