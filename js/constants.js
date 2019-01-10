const currentPlanetX = 300;
const currentPlanetY = 500;
const leftPlanetX = 650;
const leftPlanetY = 200;
const rightPlanetX = 800;
const rightPlanetY = 400;
const fuelMax = 20;
const cargoMax = 150;
const planetNames = ["Mercury", "Venus", "Mars", "Earth", "Jupiter", "Pluto", "Saturn", "Neptune", "Uranus"];
const planetImages = ["PlanetA", "PlanetB", "PlanetC"];
const fuelAmount = Phaser.Math.RND.integerInRange(1, 5);
const fuelCost = Phaser.Math.RND.integerInRange(100, 350);
const buyCargoAmount = Phaser.Math.RND.integerInRange(10, 30);
const buyCargoCost = Phaser.Math.RND.integerInRange(20, 45);
const sellCargoAmount = Phaser.Math.RND.integerInRange(1, 50);
const sellCargoCost = Phaser.Math.RND.integerInRange(15, 75);

