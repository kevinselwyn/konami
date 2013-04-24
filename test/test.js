window.onload = function () {
	Konami.init();

	Konami.listen(function () {
		document.getElementById("message").style.display = "block";
	});
};