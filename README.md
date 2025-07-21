<p align="center">
  <img src="/preview.png" style="width: 20rem; height: auto;" align="center" alt="Preview screenshot">
  <h1>This is DotWave,</h1>
  a lightweight JavaScript library for creating interactive and satisfying dot canvases.
  <div style="display: flex; gap: 1rem; padding-top: 1rem">
    <a href="https://github.com/jsem-nerad/DotWave.js/issues/new?labels=bug&template=bug-report---.md">Report a Bug</a>
    <a href="https://github.com/jsem-nerad/DotWave.js/issues/new?labels=enhancement&template=feature-request---.md">Request a Feature</a>
  </div>
</p>

### Try now on [dotwave.jsem-nerad.cz](https://dotwave.jsem-nerad.cz/)

## Features

- Parallax effect for depth perception
- Fully customizable (colors, sizes, behavior...)
- Dot stretching
- Dot rotation smoothing
- No dependencies
- Lightweight (~8kB minified)

## Importing DotWave

The most reliable and recommended way to import DotWave is by using the raw minified script directly from GitHub like this:
```xml
<script src="https://dotwave.jsem-nerad.cz/src/dotwave.min.js"></script>
```

Or You can also download the minified library [here](https://github.com/jsem-nerad/DotWave.js/blob/main/src/dotwave.min.js) and include it in Your HTML:
```xml
<script src="/path/to/dotwave.min.js"></script>
```

For modifying the library itself, download the [non-minified version](https://github.com/jsem-nerad/DotWave.js/blob/main/src/dotwave.js).

## Basic Usage
```xml
<!DOCTYPE html> 
<html lang="en"> 
<head> 
    <meta charset="UTF-8"> 
    <title>DotWave Basic Example</title> 
    <style> body {height: 100vh;} </style>
</head> 
<body> 
    <script src="https://dotwave.jsem-nerad.cz/src/dotwave.min.js"></script>
    <script>
        // Initialize with default options
        const dotwave = new DotWave({container: 'body'});
    </script>
</body> 
</html> 
```
If You're putting your script tags at the top of Your HTML with the **defer** property,
make sure to also do the same to the script containing the DotWave customization, otherwise it won't work.

### Configuration Options


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
*Note that `rotSmoothing: false` skips the rotation lerping calculations and is therefore more performant than using `rotSmoothingIntensity: 0`, same logic applies to `dotStretch`.*

### Methods
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
### While 60Hz works, it is still under development and higher refresh rates (for example 165Hz) are the more safe option.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or an issue.
