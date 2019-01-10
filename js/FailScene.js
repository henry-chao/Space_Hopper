var FailScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function FailScene () {
    Phaser.Scene.call(this, {key: 'FailScene' });
  },

  create: function ()
  {
    const fail_message = [
      "Looks like the stress of the job got to you. Don't worry",
      "though, there's still plenty of planetside jobs to keep",
      "you going."
    ];

    this.add.text(100, 200,
      fail_message,
      {fontSize: '28px', fill: '#ffffff'}
    );

    var restartText = this.add.text(600, 600,
      "Restart",
      {fontSize: '40px', fill: '#ffffff'}
    ).setOrigin(0.5)

    restartText.setInteractive();

    restartText.on('pointerdown', () => {
      this.scene.stop('FailScene');
      this.scene.start('SpaceScene');
    });
  }
});

