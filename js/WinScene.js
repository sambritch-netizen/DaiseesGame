class WinScene extends Phaser.Scene {
    constructor() { super('WinScene'); }

    create() {
        const W = 800, H = 600;

        // Bright gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xFFD4E8, 0xFFD4E8, 0xD4E8FF, 0xD4E8FF, 1);
        bg.fillRect(0, 0, W, H);

        // Confetti burst
        for (let i = 0; i < 60; i++) {
            this.launchConfetti();
        }

        // Big banner
        this.add.rectangle(W / 2, 110, 700, 120, 0xffffff, 0.92)
            .setStrokeStyle(6, 0xFF2266);

        this.add.text(W / 2, 75, 'You Did It!!! 🎉', {
            fontSize: '52px',
            fontFamily: 'Georgia, serif',
            color: '#FF2266',
            stroke: '#ffffff',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(W / 2, 142, 'Woofie found Daisee!', {
            fontSize: '26px',
            fontFamily: 'Arial',
            fontStyle: 'italic',
            color: '#8833CC',
            stroke: '#ffffff',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Woofie and Daisee together
        const woofieSprite = this.add.image(260, 360, 'woofie').setScale(1.5);
        const daiseeSprite = this.add.image(490, 360, 'daisee').setScale(1.25);

        // Woofie facing Daisee
        woofieSprite.setFlipX(false);

        // Happy bouncing
        this.tweens.add({
            targets: woofieSprite,
            y: 345,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: daiseeSprite,
            y: 350,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 150
        });

        // Heart between them
        const heart = this.add.text(W / 2, 330, '❤️', { fontSize: '40px' }).setOrigin(0.5);
        this.tweens.add({
            targets: heart,
            scale: 1.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Name labels
        this.add.text(260, 440, 'Woofie', {
            fontSize: '22px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#664400', stroke: '#ffffff', strokeThickness: 3
        }).setOrigin(0.5);
        this.add.text(490, 440, 'Daisee', {
            fontSize: '22px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#FF2266', stroke: '#ffffff', strokeThickness: 3
        }).setOrigin(0.5);

        // Ivan and Rocket in background
        const ivan = this.add.image(80, 400, 'ivan').setScale(0.72).setAlpha(0.85);
        const rocket = this.add.image(700, 400, 'rocket').setScale(0.72).setAlpha(0.85);
        ivan.setFlipX(false);
        rocket.setFlipX(true);

        this.tweens.add({ targets: ivan, y: 393, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: rocket, y: 393, duration: 850, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 200 });

        this.add.text(80, 435, 'Ivan', {
            fontSize: '16px', fontFamily: 'Arial', color: '#223366',
            stroke: '#ffffff', strokeThickness: 2
        }).setOrigin(0.5);
        this.add.text(700, 435, 'Rocket', {
            fontSize: '16px', fontFamily: 'Arial', color: '#663322',
            stroke: '#ffffff', strokeThickness: 2
        }).setOrigin(0.5);

        // Stars everywhere
        for (let i = 0; i < 20; i++) {
            this.addTwinklingStar(
                Phaser.Math.Between(0, W),
                Phaser.Math.Between(0, 200)
            );
        }

        // Pawprints along the bottom
        const paws = ['🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾'];
        paws.forEach((p, i) => {
            const pw = this.add.text(70 + i * 110, 500, p, {
                fontSize: '28px', alpha: 0.5
            });
            this.tweens.add({
                targets: pw, alpha: 0.9, duration: 600 + i * 100,
                yoyo: true, repeat: -1
            });
        });

        // Play Again button
        const btnBg = this.add.rectangle(W / 2, 556, 260, 60, 0xFF2266)
            .setStrokeStyle(4, 0xAA0044)
            .setInteractive({ useHandCursor: true });

        const btnText = this.add.text(W / 2, 556, '▶  Play Again', {
            fontSize: '28px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#ffffff', stroke: '#AA0044', strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: [btnBg, btnText],
            scaleX: 1.06, scaleY: 1.06,
            duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        btnBg.on('pointerover', () => btnBg.setFillStyle(0xFF0044));
        btnBg.on('pointerout', () => btnBg.setFillStyle(0xFF2266));
        btnBg.on('pointerdown', () => {
            // Reset game state
            window.GAME_STATE.bedroomPuzzleDone = false;
            window.GAME_STATE.ivanMet = false;
            window.GAME_STATE.rocketMet = false;
            window.GAME_STATE.livingRoomPuzzleDone = false;
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => this.scene.start('TitleScene'));
        });

        this.cameras.main.fadeIn(800);
    }

    launchConfetti() {
        const colors = ['#FF4488', '#FFD700', '#44AAFF', '#FF6644', '#88FF44', '#AA44FF', '#FF88CC'];
        const x = Phaser.Math.Between(0, 800);
        const conf = this.add.text(x, -20, Phaser.Math.RND.pick(['●', '■', '▲', '◆', '★']), {
            fontSize: Phaser.Math.Between(10, 18) + 'px',
            color: Phaser.Math.RND.pick(colors)
        });
        this.tweens.add({
            targets: conf,
            y: 650,
            x: x + Phaser.Math.Between(-80, 80),
            angle: Phaser.Math.Between(-360, 360),
            duration: Phaser.Math.Between(1800, 4000),
            delay: Phaser.Math.Between(0, 2000),
            ease: 'Linear',
            repeat: -1,
            onRepeat: () => conf.setX(Phaser.Math.Between(0, 800)).setY(-20)
        });
    }

    addTwinklingStar(x, y) {
        const colors = ['#FFD700', '#FF69B4', '#87CEEB', '#AA44FF'];
        const t = this.add.text(x, y, '✦', {
            fontSize: Phaser.Math.Between(12, 24) + 'px',
            color: Phaser.Math.RND.pick(colors)
        });
        this.tweens.add({
            targets: t, alpha: 0.1,
            duration: Phaser.Math.Between(600, 1800),
            yoyo: true, repeat: -1,
            delay: Phaser.Math.Between(0, 1500)
        });
    }
}
