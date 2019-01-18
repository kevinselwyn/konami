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

class Konami {
    constructor() {
        this.trigger = 'konami';
        this.sequence = [
            'UP',
            'UP',
            'DOWN',
            'DOWN',
            'LEFT',
            'RIGHT',
            'LEFT',
            'RIGHT',
            'B',
            'A',
            'START'
        ];
        this.limit = false;
        this.debug = false;
        this.pos = 0;
        this.touchstart = [0, 0];
        this.touchend = [0, 0];
        this.buttons = {
            13: 'START',
            37: 'LEFT',
            38: 'UP',
            39: 'RIGHT',
            40: 'DOWN',
            66: 'B',
            65: 'A'
        };
    }

    _keyup(e) {
        const key = this.buttons[e.keyCode];

        this.key_evaluate(key);

        return true;
    }

    key_evaluate(key) {
        let pos = this.pos;

        this.debugging(key);

        pos = (this.sequence[pos] === key) ? pos + 1 : 0;

        if (pos === this.sequence.length && this.limit !== 0) {
            pos = 0;

            if (this.limit !== false) {
                this.limit -= 1;
            }

            if (dispatchEvent) {
                document.dispatchEvent(new CustomEvent(this.trigger));
            } else {
                document.documentElement[this.trigger] += 1;
            }
        }

        this.pos = pos;

        return true;
    }

    _touchstart(e) {
        this.touchstart = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];

        return true;
    }

    _touchend(e) {
        this.touchend = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];

        this.touch_evaluate();

        return true;
    }

    touch_evaluate() {
        const tstart = this.touchstart;
        const tend = this.touchend;
        let key = '';

        if (Math.abs(tstart[0] - tend[0]) < Math.abs(tstart[1] - tend[1])) {
            key = (tstart[1] > tend[1]) ? 'UP' : 'DOWN';
        } else {
            key = (tstart[0] > tend[0]) ? 'LEFT' : 'RIGHT';
        }

        if (['UP', 'DOWN', 'LEFT', 'RIGHT'].indexOf(this.sequence[this.pos]) === -1) {
            key = this.sequence[this.pos];
        }

        this.key_evaluate(key);

        return true;
    }

    init() {
        this.events();

        return true;
    }

    listen(callback) {
        const d = document;

        if (d.addEventListener) {
            d.addEventListener(this.trigger, callback);
        } else {
            d.documentElement.attachEvent('onpropertychange', function (e) {
                if (e.propertyName === this.trigger) {
                    callback.call();
                }
            });
        }

        return true;
    }

    listener(event, callback) {
        if (document.addEventListener) {
            document.addEventListener(event, callback);
        } else {
            document.attachEvent('on' + event, callback);
        }

        return true;
    }

    events() {
        this.listener('keyup', (e) => {
            this._keyup(e);
        });
        this.listener('touchstart', (e) => {
            this._touchstart(e);
        });
        this.listener('touchend', (e) => {
            this._touchend(e);
        });

        return true;
    }

    debugging(key) {
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
}

module.exports = Konami;
