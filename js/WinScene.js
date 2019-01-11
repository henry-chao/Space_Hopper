var WinScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function FailScene () {
    Phaser.Scene.call(this, {key: 'WinScene' });
  },

  preload: function() {
    this.load.image('SelectionIndicator', 'assets/sprites/SelectionIndicator.png');
  },

  create: function ()
  {
    const win_message = [
      "You completely paid off the tuition amount, and are now",
      "debt free! Good job! Looks like you'll have a long career",
      "of space hopping ahead of you."
    ];

    this.add.text(100, 200,
      win_message,
      {fontSize: '28px', fill: '#ffffff'}
    );

    var restartBox = this.add.image(600, 600, 'SelectionIndicator').setInteractive();
    var restartText = this.add.text(600, 600,
      "Restart",
      {fontFamily: 'Orbitron', fontSize: '40px', fill: '#ffffff'}
    ).setOrigin(0.5)

    restartBox.on('pointerdown', () => {
      this.scene.stop('WinScene');
      this.scene.start('SpaceScene');
    });
  }
});
