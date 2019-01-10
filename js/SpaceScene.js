var SpaceScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function SpaceScene () {
    Phaser.Scene.call(this, {key: 'SpaceScene' });
  },

  preload: function ()
  {
      this.load.image('ship', 'assets/sprites/ship.png');
      this.load.image('PlanetA', 'assets/sprites/Planet_A.png');
      this.load.image('PlanetB', 'assets/sprites/Planet_B.png');
      this.load.image('PlanetC', 'assets/sprites/Planet_C.png');
  },

  create: function ()
  {
    this.planetIndicator;
    this.fuelIndicator;
    this.cargoIndicator;
    this.moneyIndicator;

    this.fuelCount = 20;
    this.cargoCount = 0;
    this.moneyCount = 1500;

    this.currentPlanet, this.leftPlanet, this.rightPlanet, this.leftline, this.rightline;
    this.playerShip;

    this.playerShip = this.add.sprite(currentPlanetX - 16, currentPlanetY - 16, 'ship').setOrigin(0, 0);
    this.rotatePlayerShip("rest");

    this.createGalaxy();
    this.currentPlanet = this.generatePlanet(currentPlanetX, currentPlanetY);

  	this.planetIndicator = this.add.text(16, 16,
  		"Planet Earth",
	  	{fontSize: '30px', fill: '#ffffff'}
  	);
    this.fuelIndicator = this.add.text(16, 740,
      this.displayFuel(),
      {fontSize: '30px', fill: '#ffffff'}
    );
    this.cargoIndicator = this.add.text(260, 740,
      this.displayCargo(),
      {fontSize: '30px', fill: '#ffffff'}
    );
    this.moneyIndicator = this.add.text(556, 740,
      this.displayMoney(),
      {fontSize: '30px', fill: '#ffffff'}
    );
  },

  updateIndicator: function() {
    this.fuelIndicator.setText(this.displayFuel());
    this.cargoIndicator.setText(this.displayCargo());
    this.moneyIndicator.setText(this.displayMoney());
  },

  displayFuel: function() {
    return "Fuel: " + this.fuelCount + "/" + fuelMax;
  },

  displayCargo: function() {
    return "Cargo: " + this.cargoCount + "/" + cargoMax;
  },

  displayMoney: function() {
    return "Money: $" + this.moneyCount;
  },

  rotatePlayerShip: function (position) {
    const leftAngle = Math.atan2(currentPlanetY - leftPlanetY, leftPlanetX - currentPlanetX) * 180 / Math.PI;
    const rightAngle = Math.atan2(currentPlanetY - rightPlanetY, rightPlanetX - currentPlanetY) * 180 / Math.PI;
    let angle = (position === "rest" ? 0 : (position === "left" ? 90 - leftAngle : 90 - rightAngle));
    this.playerShip.angle = angle;
    this.playerShip.depth = 10;
  },

  createGalaxy: function () {
    this.drawLines();

    this.leftPlanet = this.generatePlanet(leftPlanetX, leftPlanetY);
    this.rightPlanet = this.generatePlanet(rightPlanetX, rightPlanetY);
  },

  drawLines: function () {
    this.leftline = this.add.line(0, 0, currentPlanetX, currentPlanetY, leftPlanetX, leftPlanetY, 0xffff00).setOrigin(0,0);
    this.rightline = this.add.line(0, 0, currentPlanetX, currentPlanetY, rightPlanetX, rightPlanetY, 0xffff00).setOrigin(0,0);
    this.leftline.depth = -1;
    this.rightline.depth = -1;
  },

  generatePlanet: function (x, y) {
    var planet = this.add.image(x, y, Phaser.Math.RND.pick(planetImages));
    planet.setInteractive();

    planet.on('pointerdown', () => {
      let planetName = "Planet " + Phaser.Math.RND.pick(planetNames);

      let x_offset = (x === leftPlanetX) ? leftPlanetX - currentPlanetX : rightPlanetX - currentPlanetX;
      let y_offset = (y === leftPlanetY) ? currentPlanetY - leftPlanetY : currentPlanetY - rightPlanetY;

      if (planet != this.currentPlanet) {
        this.planetIndicator.setText(planetName);

        this.fuelCount -= 1;
        this.fuelIndicator.setText(this.displayFuel());

        this.leftline.destroy();
        this.rightline.destroy();
        (x === leftPlanetX) ? this.rotatePlayerShip("left") : this.rotatePlayerShip("right");

        this.tweens.add({
          targets: [this.currentPlanet, this.leftPlanet, this.rightPlanet],
          x: "-=" + x_offset,
          y: "+=" + y_offset,
          duration: 1300,
          onComplete: () => {
            this.currentPlanet.destroy();
            this.currentPlanet = planet;
            (x === leftPlanetX) ? this.rightPlanet.destroy() : this.leftPlanet.destroy();
            this.planetScenario();
          },
        });
      }
    });

    this.tweens.add({
      targets: planet,
      angle: 360,
      duration: 6000,
      repeat: -1,
    });

    return planet;
  },

  planetScenario: function() {
    const fuelAmount = Phaser.Math.RND.integerInRange(1, 5);
    const fuelCost = Phaser.Math.RND.integerInRange(100, 350);
    const buyCargoAmount = Phaser.Math.RND.integerInRange(10, 30);
    const buyCargoCost = Phaser.Math.RND.integerInRange(20, 45);
    const sellCargoAmount = Phaser.Math.RND.integerInRange(1, 50);
    const sellCargoCost = Phaser.Math.RND.integerInRange(15, 75);

    this.scenarioDisplay = this.add.text(700, 200,
      "You visited the planet!",
      {fontSize: '30px', fill: '#ffffff'}
    );

    this.selectionBuyFuel = this.add.text(700, 400,
      "Buy fuel (" + fuelAmount + "): $" + fuelAmount * fuelCost,
      {fontSize: '30px', fill: '#ffffff'}
    ).setInteractive();

    this.selectionBuyCargo = this.add.text(700, 450,
      "Buy Cargo (" + buyCargoAmount + "): $" + buyCargoAmount * buyCargoCost,
      {fontSize: '30px', fill: '#ffffff'}
    ).setInteractive();

    this.selectionSellCargo = this.add.text(700, 500,
      "Sell Cargo (" + sellCargoAmount + "): $" + sellCargoAmount * sellCargoCost,
      {fontSize: '30px', fill: '#ffffff'}
    ).setInteractive();
    this.selectionNothing = this.add.text(700, 550,
      "Skip action",
      {fontSize: '30px', fill: '#ffffff'}
    ).setInteractive();
    this.selectionError = this.add.text(700, 600,
      "",
      {fontSize: '30px', fill: '#ff0000'}
    );

    this.selectionBuyFuel.on('pointerdown', () => {
      if (this.moneyCount >= fuelAmount * fuelCost) {
        this.moneyCount -= fuelAmount * fuelCost;
        this.fuelCount = (fuelAmount + this.fuelCount > fuelMax) ? fuelMax : fuelAmount + this.fuelCount;
        this.postScenario();
      } else {
        this.displaySelectionError("Not enough money!");
      };
    });
    this.selectionBuyCargo.on('pointerdown', () => {
      if (this.cargoCount === cargoMax) {
        this.displaySelectionError("You can't carry any more cargo!");
      } else if (this.moneyCount >= buyCargoAmount * buyCargoCost) {
        this.moneyCount -= buyCargoAmount * buyCargoCost;
        this.cargoCount = (this.cargoCount + buyCargoAmount > cargoMax) ? cargoMax : this.cargoCount + buyCargoAmount;
        this.postScenario();
      } else {
        this.displaySelectionError("Not enough money!");
      };
    });
    this.selectionSellCargo.on('pointerdown', () => {
      if (this.cargoCount === 0) {
        this.displaySelectionError("You have nothing to sell!");
      } else if (this.cargoCount > sellCargoAmount) {
        this.cargoCount -= sellCargoAmount;
        this.moneyCount += sellCargoAmount * sellCargoCost;
        this.postScenario();
      } else {
        this.displaySelectionError("Not enough cargo to sell!");
      }
    });
    this.selectionNothing.on('pointerdown', () => {
      this.postScenario();
    });
  },

  displaySelectionError: function(text) {
    this.selectionError.setText(text);
  },

  postScenario: function() {
    if( this.moneyCount === 0 || this.fuelCount === 0){
      this.scene.stop('SpaceScene');
      this.scene.start('FailScene');
    } else if (this.moneyCount >= 8000){
      this.scene.stop('SpaceScene');
      this.scene.start('WinScene');
    } else {  
      this.updateIndicator();
      this.scenarioDisplay.destroy();
      this.selectionBuyFuel.destroy();
      this.selectionBuyCargo.destroy();
      this.selectionSellCargo.destroy();
      this.selectionNothing.destroy();
      this.selectionError.destroy();
      this.createGalaxy();
      this.rotatePlayerShip("rest");
    }
  },
});
