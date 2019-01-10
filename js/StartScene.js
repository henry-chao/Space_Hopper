var StartScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function StartScene () {
    Phaser.Scene.call(this, {key: 'StartScene' });
  },

  create: function ()
  {
    var title = this.add.text(600, 300,
      "Space Hopper",
      {fontSize: '80px', fill: '#ffffff'}
    ).setOrigin(0.5);

    var startText = this.add.text(600, 600,
      "Start",
      {fontSize: '40px', fill: '#ffffff'}
    ).setOrigin(0.5)
    
    startText.setInteractive();

    startText.on('pointerdown', () => {
      title.destroy();
      this.showPrologue();
    });
  },

  showPrologue: function() {
    const prologue = [
      "Congratulations on completing the United Federation Academy",
      "of Interplanetary Cargo Shipping training course!",
      "",
      "Per the contract you agreed to upon registration of the course,",
      "payment of your tuition is now expected. We will place you",
      "with one of our partner shipping companies to help you get",
      "started. Your tuition comes to $8,000.",
      "",
      "Travel to the various planets in the Sol system to buy and",
      "sell cargo and earn money. Keep an eye on your fuel levels",
      "and good luck!"
    ];

    this.add.text(100, 200,
      prologue,
      {fontSize: '28px', fill: '#ffffff'}
    );

    var startText = this.add.text(600, 600,
      "Start",
      {fontSize: '40px', fill: '#ffffff'}
    ).setOrigin(0.5)

    startText.setInteractive();

    startText.on('pointerdown', () => {
      this.scene.stop('StartScene');
      this.scene.start('SpaceScene');
    });
  }
});

