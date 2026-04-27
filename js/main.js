window.GAME_STATE = {
    bedroomPuzzleDone: false,
    ivanMet: false,
    rocketMet: false,
    livingRoomPuzzleDone: false,
};

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [BootScene, TitleScene, BedroomScene, HallwayScene, LivingRoomScene, KitchenScene, WinScene]
};

const game = new Phaser.Game(config);
