class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }

    create() {
        const W = 800, H = 600;

        // Sky gradient background
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFFB6D4, 0xFFB6D4, 1);
        sky.fillRect(0, 0, W, H);

        // Green ground
        const ground = this.add.graphics();
        ground.fillGradientStyle(0x7DC855, 0x7DC855, 0x5FAA33, 0x5FAA33, 1);
        ground.fillRect(0, H - 120, W, 120);

        // Clouds
        this.drawCloud(90, 70);
        this.drawCloud(660, 55);
        this.drawCloud(380, 45);

        // Title banner
        this.add.rectangle(W / 2, 115, 640, 100, 0xffffff, 0.88)
            .setStrokeStyle(5, 0xFF44AA);

        this.add.text(W / 2, 88, "Daisee's Game", {
            fontSize: '54px',
            fontFamily: 'Georgia, serif',
            color: '#FF1493',
            stroke: '#ffffff',
            strokeThickness: 7,
        }).setOrigin(0.5);

        this.add.text(W / 2, 146, 'Woofie Finds His Way Home', {
            fontSize: '22px',
            fontFamily: 'Arial',
            fontStyle: 'italic',
            color: '#8833CC',
            stroke: '#ffffff',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Woofie big on title
        const woofie = this.add.image(280, 390, 'woofie').setScale(1.7);
        this.tweens.add({
            targets: woofie,
            y: 380,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Label under Woofie
        this.add.text(280, 470, 'Woofie', {
            fontSize: '20px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#884400', stroke: '#ffffff', strokeThickness: 3
        }).setOrigin(0.5);

        // Paw print decorations
        this.addPawPrints();

        // Sparkles
        for (let i = 0; i < 18; i++) {
            this.addSparkle(
                Phaser.Math.Between(20, 780),
                Phaser.Math.Between(20, 200)
            );
        }

        // Play button
        const btnBg = this.add.rectangle(W / 2 + 120, 400, 240, 72, 0xFF44AA)
            .setStrokeStyle(5, 0xCC0077)
            .setInteractive({ useHandCursor: true });

        const btnText = this.add.text(W / 2 + 120, 400, '▶  PLAY', {
            fontSize: '36px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#CC0077',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: [btnBg, btnText],
            scaleX: 1.07,
            scaleY: 1.07,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        btnBg.on('pointerover', () => btnBg.setFillStyle(0xFF0088));
        btnBg.on('pointerout', () => btnBg.setFillStyle(0xFF44AA));
        btnBg.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => this.scene.start('BedroomScene'));
        });

        // Story blurb
        this.add.text(W / 2 + 120, 460, 'Help Woofie find Daisee!', {
            fontSize: '16px', fontFamily: 'Arial', color: '#664488',
            stroke: '#ffffff', strokeThickness: 2
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(800);
    }

    drawCloud(x, y) {
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 0.85);
        g.fillCircle(x, y, 32);
        g.fillCircle(x + 28, y - 12, 26);
        g.fillCircle(x + 56, y, 32);
        g.fillCircle(x + 28, y + 6, 26);
        this.tweens.add({
            targets: g, x: '+=25',
            duration: 5000 + Math.random() * 3000,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
    }

    addSparkle(x, y) {
        const colors = ['#FFD700', '#FF69B4', '#87CEEB', '#9B4DCA', '#FF4444'];
        const t = this.add.text(x, y, '✦', {
            fontSize: Phaser.Math.Between(10, 22) + 'px',
            color: Phaser.Math.RND.pick(colors)
        });
        this.tweens.add({
            targets: t, alpha: 0.1,
            duration: Phaser.Math.Between(700, 2200),
            yoyo: true, repeat: -1,
            delay: Phaser.Math.Between(0, 2000)
        });
    }

    addPawPrints() {
        const positions = [[640, 280], [700, 340], [620, 380], [680, 430], [720, 290]];
        positions.forEach(([x, y]) => {
            this.add.text(x, y, '🐾', {
                fontSize: Phaser.Math.Between(18, 30) + 'px'
            }).setAlpha(0.4);
        });
    }
}
