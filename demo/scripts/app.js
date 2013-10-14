/*globals document, require, requirejs, window*/

(function (document, window, undefined) {
    "use strict";

    requirejs.config({
        baseUrl: ".",
        paths: {
            "konami": "../dist/konami.min"
        }
    });

    require(["konami"], function (Konami) {
        Konami.init();
    
        Konami.listen(function () {
            document.getElementById("message").className = "show";
        });
    
        /*
         * Prevent scrolling on iOS
         *
         * Source: http://www.smilingsouls.net/Blog/20110804114957.html
         */
        document.addEventListener("touchmove", function (e) {
            e.preventDefault();
        }, false);
    });
}(document, window));