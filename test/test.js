window.onload = function () {
	Konami.init();

	document.addEventListener("konami", function () {
		document.getElementById("message").style.display = "block";
	});
};