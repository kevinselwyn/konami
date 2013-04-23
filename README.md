#Konami

Konami is a Javascript plugin that allows for custom functions to be called when the user inputs the [Konami Code](http://en.wikipedia.org/wiki/Konami_Code) using either the keyboard or touch-based input.

##The Konami Code

Traditionally, the Konami Code consists of 10 key or button presses as originally used in [Gradius](http://en.wikipedia.org/wiki/Gradius) for the [Nintendo Entertainment System](http://en.wikipedia.org/wiki/Nintendo_Entertainment_System).

The sequence goes:

![The Konami Code](http://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Konami_Code.svg/500px-Konami_Code.svg.png)

The last button is typically "START" because the code is frequently entered during a pause or start screen and the final "START" resumes or starts the game. For this reason, "START" ("ENTER") is included in the default Konami Code in this plugin.

##Usage

Include the following in the `<head>` of your document:

```html
<script type="text/javascript" src="dist/konami.min.js"></script>
```

To initialize the plugin, add the following to your document:

```html
<script type="text/javascript">
	Konami.init();
</script>
```

Whenever the correct code is entered, the plugin will trigger a custom event named `konami`.

Add an event listener to fire any time the code is entered:

```js
document.addEventListener("konami", function () {
	alert("999 Lives!")
});
```

##Configuration

There are a number of configurable aspects of this plugin.

###Sequence

The default sequence included in this plugin is:

```js
["UP", "UP", "DOWN", "DOWN", "LEFT", "RIGHT", "LEFT", "RIGHT", "B", "A", "START"]
```

`"START"` is alised to the `"Enter"` key.

You may create your own sequences to use with this plugin. For example, if you wanted to leave off the final `"START"`, this is how you would configure:

```js
Konami.sequence = ["UP", "UP", "DOWN", "DOWN", "LEFT", "RIGHT", "LEFT", "RIGHT", "B", "A"]
```

###Debug

Activating the debugger for this plugin may be useful for diagnosing some touch-related problems when meshing with your application.

```js
Konami.debug = true;
```

Turning the debugger on will `console.log` the button that has just been pressed.

###Variance

The variance is an important variable for determining the direction on touch-based devices. It is given as an integer that will be used in equations to judge how a tap should be categorized.

The default variance is `20`, which means `+/-20px` is used in directional calculations. For larger screens, use a larger variance.

```js
Konami.variance = 50;
```

By default, the first tap is `"UP"`. Based on those coordinates, the other directional taps can be determined. If the next button in the sequence is non-directional ("A", "B", "START"), any tap will suffice.

##Tested Environments

Tested and working on:

*	Google Chrome (Mac + PC)
*	Firefox (Mac + PC)
*	Safari (Mac)
*	Opera (Mac + PC)

IE 8+ support coming in the future.