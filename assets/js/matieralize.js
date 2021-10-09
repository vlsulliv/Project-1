var settings = {
	url: 'https://google-translate1.p.rapidapi.com/language/translate/v2?key=AIzaSyBi6c1JBkPmzh45xH8DRXjD_6P9q0w0zaU',
	method: 'POST',
	data: {
		source: 'en',
		q: '',
		target: ''
	}
};

function fetchTranslation() {
	$.ajax(settings).done(function(response) {
		console.log(response);

		var translatedText = response.data.translations[0].translatedText;

		updatePlaceholders(translatedText);
		console.log(translatedText);
	});
}

function updateDocumentText(updateString) {
	console.log(updateString);

	// $('form > input').each(function(idx) {
	// 	$(this).prop('placeholder', comp[idx + 1].trim());
	// });

	// $('#formHeading').html(comp[0]);
}

document.addEventListener('DOMContentLoaded', function() {
	var dropdowns = document.querySelectorAll('.dropdownItem');
	for (var element of dropdowns) {
		element.addEventListener('click', function(e) {
			if (e.target.getAttribute('tolang') !== 'en') {
				settings.data.target = e.target.getAttribute('tolang');
				fetchTranslation();
				console.log(settings.data.target);

				document.getElementById('current-language').innerHTML = e.target.innerHTML;
			} else {
				updatePlaceholders(settings.data.q);
				console.log();

				document.getElementById('langSel').innerHTML = `${e.target.getAttribute('tolang')}`;
			}
		});
	}
});

// <!-- Dropdown Trigger -->
// <a class="dropdown-trigger btn langSel" href="#" data-target="dropdown1" id="current-language">English</a>
// <!-- Dropdown Structure -->
// <ul id="dropdown1" class="dropdown-content">
//     <li class="dropdownItem" tolang="en">English</li>
//     <li class="dropdownItem" tolang="es">Spanish</li>
//     <li class="dropdownItem" tolang="it">Italian</li>
//     <li class="dropdownItem" tolang="fr">French</li>
//     <li class="dropdownItem" tolang="de">German</li>
// </ul>
