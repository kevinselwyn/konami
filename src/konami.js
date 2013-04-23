(function(window, document, undefined) {
    "use strict";

	var Konami = {
		sequence: ["UP", "UP", "DOWN", "DOWN",
				   "LEFT", "RIGHT", "LEFT", "RIGHT",
				   "B", "A", "START"],
		variance: 20,
		debug: false,
		vars: {
			pos: 0,
			coords: [0, 0],
			touch: {}
		},
		key: function (e) {
			var code = e.keyCode, key = "";

			switch (code) {
			case 13:
				key = "START";
				break;
			case 37:
				key = "LEFT";
				break;
			case 38:
				key = "UP";
				break;
			case 39:
				key = "RIGHT";
				break;
			case 40:
				key = "DOWN";
				break;
			case 66:
				key = "B";
				break;
			case 65:
				key = "A";
				break;
			default:
				key = "";
				break;
			}

			Konami.key_evaluate(key);

			return true;
		},
		key_evaluate: function (key) {
			var event = new CustomEvent("konami"), pos = this.vars.pos,
				sequence = this.sequence;

			this.debugging(key);

			if (sequence[pos] === key) {
				pos += 1;
			} else {
				pos = 0;
				this.vars.coords = [0, 0];
				this.vars.touch = {};
			}

			if (pos === sequence.length) {
				pos = 0;

				document.dispatchEvent(event);
			}

			this.vars.pos = pos;

			return true;
		},
		touch: function (e) {
			Konami.vars.coords = [e.changedTouches[0].clientX,
								  e.changedTouches[0].clientY];
			Konami.touch_evaluate();

			return false;
		},
		touch_evaluate: function () {
			var coords = this.vars.coords, key = "", pos = this.vars.pos,
				sequence = this.sequence, touch = this.vars.touch,
				variance = this.variance;

			if (pos === 0) {
				touch.up = touch.up || coords;
			}

			if (Math.abs(coords[0] - touch.up[0]) < variance &&
				Math.abs(coords[1] - touch.up[1]) < variance) {
				key = key || "UP";
			}

			if (coords[1] > touch.up[1] &&
				Math.abs(coords[1] - touch.up[1]) > variance &&
				Math.abs(coords[0] - touch.up[0]) < variance) {
				touch.down = touch.down || coords;
				key = key || "DOWN";
			}

			if (coords[0] < touch.up[0] &&
				Math.abs(coords[0] - touch.up[0]) > variance) {
				touch.left = touch.left || coords;
				key = key || "LEFT";
			}

			if (coords[0] > touch.up[0] &&
				Math.abs(coords[0] - touch.up[0]) > variance) {
				touch.right = touch.right || coords;
				key = key || "RIGHT";
			}

			if (["UP", "DOWN", "LEFT", "RIGHT"].indexOf(sequence[pos]) === -1) {
				key = sequence[pos];
			}

			this.vars.touch = touch;
			this.key_evaluate(key);

			return true;
		},
		init: function () {
			this.events();

			return true;
		},
		events: function () {
			document.addEventListener("keyup", this.key);
			document.addEventListener("touchend", this.touch);

			return true;
		},
		debugging: function (key) {
			if (this.debug === false) {
				return false;
			}

			console.log(key);

			return true;
		}
	};

	window.Konami = Konami;
})(window, document);