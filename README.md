

<p align="center">
  <img src="/preview.png" style="width: 20rem; height: auto;" align="center" alt="Preview screenshot">
  <h1>This is DotWave,</h1>
  a lightweight JavaScript library for creating interactive and satisfying dot canvases.
  <div style="display: flex; gap: 1rem; padding-top: 1rem">
    <a href="https://github.com/jsem-nerad/DotWave.js/issues/new?labels=bug&template=bug-report---.md">Report a Bug</a>
    <a href="https://github.com/jsem-nerad/DotWave.js/issues/new?labels=enhancement&template=feature-request---.md">Request a Feature</a>
  </div>
</p>

### Try now on [dotwave.vojtikdortik.eu](https://dotwave.vojtikdortik.eu/)

## Features

- Depth perception with a parallax effect
- Customizable (colors, sizes, behavior)
- Dot stretching
- Dot rotation smoothing
- No dependencies
- Lightweight (~8kB minified)

## Installation

Download the library [here](https://github.com/jsem-nerad/DotWave.js/blob/main/dotwave.min.js) and include it in your HTML:
```xml
<script src="dotwave.min.js"></script>
```
Or use it via a remote link like this:
```xml
<script src="https://dotwave.vojtikdortik.eu/src/dotwave.min.js"></script>
```
For modifying the library itself, download the [non-minified version](https://github.com/jsem-nerad/DotWave.js/blob/main/dotwave.js).

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
    <script src="https://dotwave.vojtikdortik.eu/src/dotwave.min.js"></script>
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
  numDots: 200,                // Number of dots
  dotColor: 'white',           // Dot color (CSS color)
  backgroundColor: 'black',    // Background color
  dotMinSize: 0.5,             // Minimum dot size
  dotMaxSize: 2.5,             // Maximum dot size
  dotMinOpacity: 0.5,          // Minimum dot opacity
  dotMaxOpacity: 1,            // Maximum dot opacity
  influenceRadius: 150,        // Mouse influence radius
  influenceStrength: 0.08,     // Mouse influence strength
  randomFactor: 0.03,          // Random movement factor
  friction: 0.97,              // Movement friction
  maxSpeed: 3,                 // Maximum dot speed
  responsive: true,            // Automatically resize with container
  zIndex: -1,                  // Canvas z-index
  mouseSpeedDecay: 0.85,       // How quickly mouse speed decays
  maxMouseSpeed: 15,           // Maximum mouse speed to prevent jumps
  dotStretch: true,            // Enable dot stretching based on velocity
  dotStretchMult: 3,           // How much to stretch dots (multiplier)
  dotMaxStretch: 20,           // Maximum stretch amount (prevents extreme stretching)
  rotSmoothing: true,          // Enable/disable rotation smoothing of dots
  rotSmoothingIntensity: 150   // Rotation smoothing duration in milliseconds
});
```
*Note that `rotSmoothing: false` skips the rotation lerping calculations and is therefore more performant than using `rotSmoothingIntensity: 0`*.

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

## Contributing
Contributions are welcome! Please feel free to submit a pull request or an issue.
