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
		debug: false,
		vars: {
			pos: 0,
			touchstart: [0, 0],
			touchend: [0, 0]
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
			var event = this.trigger, pos = this.vars.pos, 
				sequence = this.sequence;

			this.debugging(key);

			pos = (sequence[pos] === key) ? pos + 1 : 0;

			if (pos === sequence.length && this.limit !== 0) {
				pos = 0;

				if (this.limit !== false) {
					this.limit -= 1;
				}

				if (typeof dispatchEvent === "function") {
					event = new CustomEvent(event);
					document.dispatchEvent(event);
				} else {
					document.documentElement[event] += 1;
				}
			}

			this.vars.pos = pos;

			return true;
		},
		touchstart: function (e) {
			Konami.vars.touchstart = [e.changedTouches[0].clientX,
									  e.changedTouches[0].clientY];

			return true;
		},
		touchend: function (e) {
			Konami.vars.touchend = [e.changedTouches[0].clientX,
									e.changedTouches[0].clientY];

			Konami.touch_evaluate();

			return true;
		},
		touch_evaluate: function () {
			var key = "", pos = this.vars.pos, sequence = this.sequence,
				touchstart = this.vars.touchstart,
				touchend = this.vars.touchend;

			if (Math.abs(touchstart[0] - touchend[0]) < 
				Math.abs(touchstart[1] - touchend[1])) {
				if (touchstart[1] > touchend[1]) {
					key = "UP";
				} else {
					key = "DOWN";
				}
			} else {
				if (touchstart[0] > touchend[0]) {
					key = "LEFT";
				} else {
					key = "RIGHT";
				}
			}

			if (["UP", "DOWN", "LEFT", "RIGHT"].indexOf(sequence[pos]) === -1) {
				key = sequence[pos];
			}

			this.key_evaluate(key);

			return true;
		},
		init: function () {
			this.events();

			return true;
		},
		listen: function (callback) {
			var d = document;

			if (d.addEventListener) {
				d.addEventListener(Konami.trigger, callback);
			} else {
				d.documentElement.attachEvent("onpropertychange", function (e) {
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
			this.listener("touchstart", this.touchstart);
			this.listener("touchend", this.touchend);

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