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
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*globals alert, console, CustomEvent, dispatchEvent, document, window*/

(function (window, document, undefined) {
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
			touchend: [0, 0],
			buttons: {
				13: "START",
				37: "LEFT",
				38: "UP",
				39: "RIGHT",
				40: "DOWN",
				66: "B",
				65: "A"
			}
		},
		keyup: function (e) {
			var key = Konami.vars.buttons[e.keyCode];

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

				if (dispatchEvent) {
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
				tstart = this.vars.touchstart,
				tend = this.vars.touchend;

			if (Math.abs(tstart[0] - tend[0]) < Math.abs(tstart[1] - tend[1])) {
				key = (tstart[1] > tend[1]) ? "UP" : "DOWN";
			} else {
				key = (tstart[0] > tend[0]) ? "LEFT" : "RIGHT";
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

			return true;
		},
		listener: function (event, callback) {
			if (document.addEventListener) {
				document.addEventListener(event, callback);
			} else {
				document.attachEvent("on" + event, callback);
			}

			return true;
		},
		events: function () {
			this.listener("keyup", this.keyup);
			this.listener("touchstart", this.touchstart);
			this.listener("touchend", this.touchend);

			return true;
		},
		debugging: function (key) {
			if (this.debug === false) {
				return false;
			}

			if (console) {
				console.log(key);
			} else {
				alert(key);
			}

			return true;
		}
	};

	window.Konami = Konami;
}(window, document));