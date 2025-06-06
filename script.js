// DotWave Cards
const card1 = new DotWave({
  container: '#card1',
  dotColor: '#ffffff',
  backgroundColor: '#000000',
  numDots: 200,
  dotMinSize: 2,
  dotMaxSize: 4,
  influenceRadius: 1000,
  influenceStrength: 0.25,
  dotStretchMult: 5
});

const card2 = new DotWave({
  container: '#card2',
  dotColor: '#000000',
  backgroundColor: '#BA1B1D',
  numDots: 800,
  dotMinSize: 1,
  dotMaxSize: 3,
  influenceRadius: 100,
  influenceStrength: 0.5,
  randomFactor: 0,
  rotSmoothing: false,
});

const card3 = new DotWave({
  container: '#card3',
  dotColor: '#ffffff',
  backgroundColor: '#04395E',
  numDots: 200,
  dotMinSize: 1,
  dotMaxSize: 5,
  randomFactor: 0.8,
  dotStretch: false,
  rotSmoothing: false,
  reactive: false
});