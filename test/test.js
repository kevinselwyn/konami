window.onload = function () {
	Konami.init();

	Konami.listen(function () {
		document.getElementById("message").className = "show";
	});

	/*
	 * Prevent scrolling on iOS
	 *
	 * Source: http://www.smilingsouls.net/Blog/20110804114957.html
	 */
	document.addEventListener('touchmove', function (e) {
		e.preventDefault();
	}, false);
};