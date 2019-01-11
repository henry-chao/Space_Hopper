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
    this.load.image('PlanetIndicator', 'assets/sprites/PlanetIndicator.png');
    this.load.image('ResourcesIndicator', 'assets/sprites/ResourcesIndicator.png');
    this.load.image('SelectionIndicator', 'assets/sprites/SelectionIndicator.png');
    this.load.image('Background', 'assets/sprites/Background.png');
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

    this.background = this.add.tileSprite(0, 0, 1200, 800, 'Background').setOrigin(0, 0);
    this.background.depth = -10;
    this.scrollBackground = false;

    this.playerShip = this.add.sprite(currentPlanetX, currentPlanetY, 'ship').setOrigin(0.5);
    this.rotatePlayerShip("rest");

    this.currentPlanet = this.generatePlanet(currentPlanetX, currentPlanetY);
    this.leftPlanet, this.rightPlanet, this.leftline, this.rightline;
    this.createGalaxy();

    this.planetIndicatorBG = this.add.image(0, 0, 'PlanetIndicator').setOrigin(0,0);
  	this.planetIndicator = this.add.text(16, 16,
  		"Planet Earth",
	  	{fontFamily: 'Orbitron', fontSize: '24px', fill: '#ffffff'}
  	);

    this.fuelIndicatorBG = this.add.image(20, 735, 'ResourcesIndicator').setOrigin(0,0);
    this.fuelIndicator = this.add.text(40, 750,
      this.displayFuel(),
      {fontFamily: 'Orbitron', fontSize: '24px', fill: '#ffffff'}
    );
    this.cargoIndicatorBG = this.add.image(290, 735, 'ResourcesIndicator').setOrigin(0,0);
    this.cargoIndicator = this.add.text(310, 750,
      this.displayCargo(),
      {fontFamily: 'Orbitron', fontSize: '24px', fill: '#ffffff'}
    );
    this.cargoIndicatorBG = this.add.image(560, 735, 'ResourcesIndicator').setOrigin(0,0);
    this.moneyIndicator = this.add.text(580, 750,
      this.displayMoney(),
      {fontFamily: 'Orbitron', fontSize: '24px', fill: '#ffffff'}
    );
  },

  update: function() {
    if (this.scrollBackground) {
      this.background.tilePositionX -= 0.2;
      this.background.tilePositionY -= 0.2;
    }
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
    this.tweens.add({
      targets: this.playerShip,
      angle: angle,
      duration: 1000,
      repeat: 0,
    });
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

        this.scrollBackground = true;
        this.tweens.add({
          targets: [this.currentPlanet, this.leftPlanet, this.rightPlanet],
          x: "-=" + x_offset,
          y: "+=" + y_offset,
          duration: 1300,
          onComplete: () => {
            this.scrollBackground = false;
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

    const fontConf = {fontFamily: 'Orbitron', fontSize: '20px', fill: '#ffffff'};

    this.scenarioDisplay = this.add.text(700, 100,
      "You visited the planet!", fontConf
    );

    this.selectionBuyFuel = this.add.image(650, 250, 'SelectionIndicator').setOrigin(0,0).setInteractive();
    this.selectionBuyFuelText = this.add.text(670, 265,
      "Buy fuel ( " + fuelAmount + " ): $ " + fuelAmount * fuelCost, fontConf
    );

    this.selectionBuyCargo = this.add.image(650, 350, 'SelectionIndicator').setOrigin(0,0).setInteractive();
    this.selectionBuyCargoText = this.add.text(670, 365,
      "Buy Cargo ( " + buyCargoAmount + " ): $ " + buyCargoAmount * buyCargoCost, fontConf
    );

    this.selectionSellCargo = this.add.image(650, 450, 'SelectionIndicator').setOrigin(0,0).setInteractive();
    this.selectionSellCargoText = this.add.text(670, 465,
      "Sell Cargo ( " + sellCargoAmount + " ): $ " + sellCargoAmount * sellCargoCost, fontConf
    );

    this.selectionNothing = this.add.image(650, 550, 'SelectionIndicator').setOrigin(0,0).setInteractive();
    this.selectionNothingText = this.add.text(670, 565,
      "Skip action", fontConf
    );

    this.selectionError = this.add.text(670, 670,
      "", {fontFamily: 'Orbitron', fontSize: '20px', fill: '#ff0000'}
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
      } else if (this.cargoCount >= sellCargoAmount) {
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
      this.selectionBuyFuelText.destroy();
      this.selectionBuyCargo.destroy();
      this.selectionBuyCargoText.destroy();
      this.selectionSellCargo.destroy();
      this.selectionSellCargoText.destroy();
      this.selectionNothing.destroy();
      this.selectionNothingText.destroy();
      this.selectionError.destroy();
      this.createGalaxy();
      this.rotatePlayerShip("rest");
    }
  },
});
