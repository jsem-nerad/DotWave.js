<p align="center">
  <img src="/images/preview.png" style="width: 20rem; height: auto;" align="center" alt="Preview screenshot">
  <h1>This is DotWave,</h1>
  a lightweight JavaScript library for creating interactive and satisfying dot canvases.
  <div style="display: flex; gap: 1rem; padding-top: 1rem">
    <a href="https://github.com/jsem-nerad/DotWave.js/issues/new?labels=bug&template=bug-report---.md">Report a Bug</a>
    <a href="https://github.com/jsem-nerad/DotWave.js/issues/new?labels=enhancement&template=feature-request---.md">Request a Feature</a>
  </div>
</p>

### Try now on [dotwave.jsem-nerad.cz](https://dotwave.jsem-nerad.cz/)

# Features

- Parallax effect for depth perception
- Fully customizable (colors, sizes, behavior...)
- Dot stretching
- Dot rotation smoothing
- No dependencies
- Lightweight (~8kB minified)

# Importing

The recommended way to import DotWave is via the remote like this:
```xml
<script src="https://dotwave.jsem-nerad.cz/src/dotwave.min.js"></script>
```

Or You can also [download it](https://github.com/jsem-nerad/DotWave.js/blob/main/src/dotwave.min.js) and include it in Your HTML:
```xml
<script src="/path/to/dotwave.min.js"></script>
```

For modifying the library itself, download the [non-minified version](https://github.com/jsem-nerad/DotWave.js/blob/main/src/dotwave.js).

# Usage

## HTML element

To use DotWave as a HTML element, you will first need to additionally import the dotwave-element.min.js extension for the core dotwave library:
```xml
<script src="https://dotwave.jsem-nerad.cz/src/dotwave.min.js"></script>
<script src="https://dotwave.jsem-nerad.cz/src/dotwave-element.min.js"></script> <!-- extension library -->
```

Then you can use the DotWave element simply like this:

```xml
<!-- This code example creates a basic DotWave canvas with the default options -->
<dot-wave></dot-wave>
```

The DotWave element can be used and customised as every other HTML element. You can use it and style it as as a container for other HTML elements.
```css
/* Styling in CSS */
dot-wave {
  display: flex;
  align-items: center;
  justify-content: center;
}
```
```xml
<!-- Styling directly in the element style -->
<dot-wave style="width: 600px; height: 400px; border: 3px solid #33a6ed;">
  <!-- Using as a container for paragraph element -->
  <p style="color: #33a6ed;">This is DotWave element as a container with custom CSS.</p>
</dot-wave>
```

### Configuring DotWave attributes

To configure the DotWave element, use the element attributes.

```xml
<dot-wave 
  num-dots="200" 
  dot-color="#FF0000" 
  background-color="#FFFFFF"
  influence-radius="150"
  dot-stretch="true"
  dot-stretch-mult="5"
  style="height: 500px;">
</dot-wave>
```

You can find the [list of all available attributes here](#option-list).

### Configuring the DotWave element via JavaScript

In addition to the HTML element, you can still control the DotWave object using JavaScript including using functions and updating options

```JavaScript
// Get reference to the element
const dotWaveElement = document.querySelector('dot-wave');

// Update properties via JavaScript
dotWaveElement.numDots = 500;
dotWaveElement.dotColor = '#00FF00';
dotWaveElement.reactive = false;

// Control animation
dotWaveElement.pause();
dotWaveElement.resume();

// Access the underlying DotWave instance for advanced control
const dotwave = dotWaveElement.getDotWaveInstance();
if (dotwave) {
  // Use any original DotWave methods
  dotwave.updateOptions({ friction: 0.95 });
}

// Clean up when done
dotWaveElement.destroy();
```

The DotWave element also supports dynamic creation in JavaScript

```JavaScript
// Create element dynamically
const dotWave = document.createElement('dot-wave');
dotWave.setAttribute('num-dots', '300');
dotWave.setAttribute('dot-color', '#FF00FF');
dotWave.style.width = '100%';
dotWave.style.height = '500px';

document.body.appendChild(dotWave);
```

## JavaScript library

```xml
<div id="dotwave-container" style="height: 400px;"></div>

<script src="https://dotwave.jsem-nerad.cz/src/dotwave.min.js"></script>
<script>
  // Creating a new DotWave instance with custom configuration
  const dotwave = new DotWave({container: '#dotwave-container'});
</script>
```
> If you want to put your script tags at the top of Your HTML with the **defer** property,
make sure to also do the same to the script containing the DotWave customization, otherwise it won't work.

### Configuration Options

To configure DotWave when initializing, use the class options.

```xml
<script>
  // Creating a new DotWave instance with custom configuration
  const dotwave = new DotWave({
      container: '#dotwave-container', 
      numDots: 200,
      dotColor: '#FF0000',
      backgroundColor: '#FFFFFF',
      influenceRadius: 150,
      dotStretch: true,
      dotStretchMult: 5,
  });
</script>
```

You can find the [list of all available attributes here](#option-list).

# Methods

```JavaScript
// Initialize
const dotwave = new DotWave(options);

// Pause animation
dotwave.pause();

// Resume animation
dotwave.resume();

// Update options
dotwave.updateOptions({
  dotColor: 'blue',
  numDots: 300
});

// Clean up when done
dotwave.destroy();
```

# Option list

| HTML Attribute        | JavaScript option     | Type    | Default  | Description                                                 |
|-----------------------|-----------------------|---------|----------|-------------------------------------------------------------|
| -                     | container             | string  | body     | Container selector or DOM element                           |
| num-dots              | numDots               | number  | 400      | Total number of dots rendered                               |
| dot-color             | dotColor              | string  | "white"  | Dot color; supports named, hex, RGB/RGBa CSS color values   |
| background-color      | backgroundColor       | string  | "black"  | Canvas fill color; use "transparent" to disable fill        |
| dot-min-size          | dotMinSize            | number  | 1        | Minimum dot radius                                          |
| dot-max-size          | dotMaxSize            | number  | 3        | Maximum dot radius                                          |
| dot-min-opacity       | dotMinOpacity         | number  | 0.5      | Minimum dot opacity at far depth for fade effect            |
| dot-max-opacity       | dotMaxOpacity         | number  | 1        | Maximum dot opacity at near depth for vivid foreground      |
| influence-radius      | influenceRadius       | number  | 100      | Cursor effect radius in pixels for interactive push/pull    |
| influence-strength    | influenceStrength     | number  | 0.5      | Multiplier for cursor velocity influence on dots            |
| random-factor         | randomFactor          | number  | 0.05     | Random dot movement factor                                  |
| friction              | friction              | number  | 0.97     | Dot movement friction to slow dots down                     |
| max-speed             | maxSpeed              | number  | 3        | Clamp for dot speed after all influences                    |
| reactive              | reactive              | boolean | true     | Enables/disables cursor reactivity entirely                 |
| z-index               | zIndex                | number  | -1       | Canvas z-index                                              |
| mouse-speed-decay     | mouseSpeedDecay       | number  | 0.85     | How quickly mouse speed decays                              |
| max-mouse-speed       | maxMouseSpeed         | number  | 15       | Caps cursor velocity to avoid spikes                        |
| dot-stretch           | dotStretch: true      | boolean | true     | When enabled, dots stretch when moving                      |
| dot-stretch-mult      | dotStretchMult        | number  | 10       | How much to stretch dots                                    |
| dot-max-stretch       | dotMaxStretch         | number  | 20       | Maximum stretch amount                                      |
| rot-smoothing         | rotSmoothing          | boolean | false    | Smoothly rotates dots instead of snapping                   |
| rotsmoothingintensity | rotSmoothingIntensity | number  | 150      | Rotation smoothing duration (ms)                            |

## For HTML

```xml
<dot-wave 
  num-dots="400"
  dot-color="white"
  background-color="black"
  dot-min-size="1"
  dot-max-size="3"
  dot-min-opacity="0.5"
  dot-max-opacity="1"
  influence-radius="100"
  influence-strength="0.5"
  random-factor="0.05"
  friction="0.97"
  max-speed="3"
  reactive="true"
  z-index="-1"
  mouse-speed-decay="0.85"
  max-mouse-speed="15"
  dot-stretch="true"
  dot-stretch-mult="10"
  dot-max-stretch="20"
  rot-smoothing="false"
  rot-smoothing-intensity="150">
</dot-wave>
```

## For JavaScript

```JavaScript
const dotwave = new DotWave({
  container: 'body',           // Container selector or DOM element
  numDots: 400,                // Number of dots
  dotColor: 'white',           // Dot color (CSS color)
  backgroundColor: 'black',    // Background color
  dotMinSize: 1,               // Minimum dot size
  dotMaxSize: 3,               // Maximum dot size
  dotMinOpacity: 0.5,          // Minimum dot opacity
  dotMaxOpacity: 1,            // Maximum dot opacity
  influenceRadius: 100,        // Mouse influence radius
  influenceStrength: 0.5,      // Mouse influence strength
  randomFactor: 0.05,          // Random movement factor
  friction: 0.97,              // Movement friction
  maxSpeed: 3,                 // Maximum dot speed
  reactive: true,              // Toggle for cursor reactivity
  zIndex: -1,                  // Canvas z-index
  mouseSpeedDecay: 0.85,       // How quickly mouse speed decays
  maxMouseSpeed: 15,           // Maximum mouse speed to prevent jumps
  dotStretch: true,            // Enable dot stretching based on velocity
  dotStretchMult: 10,          // How much to stretch the dots
  dotMaxStretch: 20,           // Maximum stretch amount
  rotSmoothing: false,         // Toggle for rotation smoothing of dots
  rotSmoothingIntensity: 150   // Rotation smoothing duration in milliseconds
});
```
> *Note, that  `rotSmoothing: false` skips the rotation lerping calculations and is therefore more performant than using `rotSmoothingIntensity: 0`, same logic applies to `dotStretch`.*

# This is still WIP!

Currently, ***DotWave targets 100 FPS*** and adjusts to the client frame rate using delta time for smooth motion scaling. Lower frame rates *should* work.

# Contributing

Contributions are welcome! Please feel free to submit a pull request or an [issue](https://github.com/jsem-nerad/DotWave.js/issues/new?labels=bug&template=bug-report---.md). [Feature requests](https://github.com/jsem-nerad/DotWave.js/issues/new?labels=enhancement&template=feature-request---.md) are also welcome!

# AI usage declaration

Some parts of the code for this project were generated by an LLM to save time
