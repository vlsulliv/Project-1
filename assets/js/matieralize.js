// event listener for auto complete input
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

document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems);
});
