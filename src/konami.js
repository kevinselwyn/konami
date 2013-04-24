/*
 * Konami
 *
 *
 * Konami is a Javascript plugin that allows for custom functions to be
 * called when the user inputs the Konami Code using either the keyboard
 * or touch-based input.
 *
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function(window, document, undefined) {
	"use strict";

	var Konami = {
		trigger: "konami",
		sequence: ["UP", "UP", "DOWN", "DOWN",
				   "LEFT", "RIGHT", "LEFT", "RIGHT",
				   "B", "A", "START"],
		limit: false,
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
			var event = (typeof CustomEvent === "function") ? 
				new CustomEvent(this.trigger) : this.trigger, 
				pos = this.vars.pos, sequence = this.sequence;

			this.debugging(key);

			if (sequence[pos] === key) {
				pos += 1;
			} else {
				pos = 0;
				this.vars.coords = [0, 0];
				this.vars.touch = {};
			}

			if (pos === sequence.length && this.limit !== 0) {
				pos = 0;

				if (this.limit !== false) {
					this.limit -= 1;
				}

				if (typeof dispatchEvent === "function") {
					document.dispatchEvent(event);
				} else {
					document.documentElement[event] += 1;
				}
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
		listen: function (callback) {
			if (document.addEventListener) {
				document.addEventListener(Konami.trigger, callback);
			} else {
				document.documentElement.attachEvent("onpropertychange", function (e) {
					if (e.propertyName === Konami.trigger) {
						callback.call();
					}
				});
			}
		},
		listener: function (event, callback) {
			if (document.addEventListener) {
				document.addEventListener(event, callback);
			} else {
				document.attachEvent("on" + event, callback);
			}
		},
		events: function () {
			this.listener("keyup", this.key);
			this.listener("touchend", this.touch);

			return true;
		},
		debugging: function (key) {
			if (this.debug === false) {
				return false;
			}

			if (typeof console === "object") {
				console.log(key);
			} else {
				alert(key);
			}

			return true;
		}
	};

	window.Konami = Konami;
})(window, document);