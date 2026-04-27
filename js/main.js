window.GAME_STATE = {
    bedroomPuzzleDone: false,
    ivanMet: false,
    rocketMet: false,
    livingRoomPuzzleDone: false,
};

const config = {
    type: Phaser.CANVAS,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#1a1a2e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [BootScene, TitleScene, BedroomScene, HallwayScene, LivingRoomScene, KitchenScene, WinScene]
};

const game = new Phaser.Game(config);
const loadingEl = document.getElementById('loading-msg');
if (loadingEl) loadingEl.style.display = 'none';
