class KitchenScene extends Phaser.Scene {
    constructor() { super('KitchenScene'); }

    create() {
        this.dialogueActive = false;
        this.daiseeMet = false;
        this.transitionStarted = false;

        this.drawRoom();
        this.setupPhysics();
        this.setupPlayer();
        this.setupDaisee();
        this.setupInput();
        this.setupUI();

        this.cameras.main.fadeIn(600);
    }

    drawRoom() {
        const g = this.add.graphics();

        // Back wall (light mint/fresh)
        g.fillStyle(0xD8F4EC);
        g.fillRect(0, 0, 800, 145);
        g.fillStyle(0xC4E8DA);
        g.fillRect(0, 128, 800, 17);
        g.lineStyle(2, 0xAAD8C8);
        g.lineBetween(0, 128, 800, 128);

        // Tile floor (light, clean)
        for (let row = 0; row < 12; row++) {
            for (let col = 0; col < 10; col++) {
                const x = col * 80;
                const y = 145 + row * 40;
                g.fillStyle((row + col) % 2 === 0 ? 0xF8F8F8 : 0xEEEEEE);
                g.fillRect(x, y, 80, 40);
            }
        }
        g.lineStyle(1, 0xCCCCCC, 0.5);
        for (let x = 0; x <= 800; x += 80) {
            g.beginPath(); g.moveTo(x, 145); g.lineTo(x, 600); g.strokePath();
        }
        for (let y = 145; y <= 600; y += 40) {
            g.beginPath(); g.moveTo(0, y); g.lineTo(800, y); g.strokePath();
        }

        // Left wall (door to living room - open)
        g.fillStyle(0xD8F4EC);
        g.fillRect(0, 145, 20, 105);
        g.fillRect(0, 390, 20, 210);
        g.lineStyle(5, 0x886644);
        g.strokeRect(0, 250, 22, 140);
        g.fillStyle(0x222222);
        g.fillRect(0, 252, 20, 136);
        this.add.text(5, 290, '⬅', { fontSize: '18px', color: '#FFD700' });

        // Right wall (no door - final room)
        g.fillStyle(0xD8F4EC);
        g.fillRect(780, 145, 20, 455);

        // Kitchen cabinets (back wall, upper)
        g.fillStyle(0xCC9966);
        g.fillRoundedRect(20, 5, 760, 85, 4);
        g.lineStyle(2, 0xAA7744);
        // Cabinet doors
        for (let i = 0; i < 8; i++) {
            const cx = 24 + i * 94;
            g.fillStyle(0xDDAA77);
            g.fillRoundedRect(cx, 8, 88, 78, 3);
            g.lineStyle(2, 0xBB8855);
            g.strokeRoundedRect(cx, 8, 88, 78, 3);
            // Handle
            g.fillStyle(0xFFD700);
            g.fillCircle(cx + 44, 50, 5);
        }

        // Counter (back wall)
        g.fillStyle(0x778899);
        g.fillRect(20, 100, 760, 50);
        g.fillStyle(0x8899AA);
        g.fillRect(20, 100, 760, 8);
        g.lineStyle(2, 0x667788);
        g.strokeRect(20, 100, 760, 50);

        // Sink
        g.fillStyle(0x889BAB);
        g.fillRoundedRect(100, 110, 110, 32, 5);
        g.fillStyle(0x667788);
        g.fillRoundedRect(108, 116, 94, 20, 3);
        // Faucet
        g.fillStyle(0xCCDDDD);
        g.fillRect(151, 102, 6, 15);
        g.fillRect(148, 102, 12, 5);

        // Stove/oven
        g.fillStyle(0x666666);
        g.fillRect(580, 100, 120, 50);
        g.fillStyle(0x444444);
        g.fillRoundedRect(588, 108, 104, 34, 4);
        // Burners
        g.lineStyle(3, 0x888888);
        g.strokeCircle(606, 120, 10);
        g.strokeCircle(632, 120, 10);
        g.strokeCircle(658, 120, 10);
        g.strokeCircle(684, 120, 10);

        // Items on counter
        this.add.text(260, 108, '🍎', { fontSize: '22px' });
        this.add.text(310, 108, '🍌', { fontSize: '22px' });
        this.add.text(360, 108, '🥛', { fontSize: '22px' });
        this.add.text(480, 108, '🍞', { fontSize: '20px' });

        // Kitchen table (center of room)
        g.fillStyle(0xAA8855);
        g.fillRoundedRect(250, 260, 300, 130, 10);
        g.fillStyle(0xBB9966);
        g.fillRoundedRect(256, 266, 288, 118, 8);
        // Table legs
        g.fillStyle(0x996644);
        g.fillRect(262, 386, 14, 30);
        g.fillRect(524, 386, 14, 30);
        g.fillRect(262, 258, 14, 20);
        g.fillRect(524, 258, 14, 20);
        // Items on table
        this.add.text(330, 300, '🍪', { fontSize: '26px' });
        this.add.text(385, 300, '🥤', { fontSize: '24px' });
        this.add.text(445, 300, '🍪', { fontSize: '26px' });

        // Chairs
        g.fillStyle(0x996644);
        g.fillRoundedRect(190, 270, 55, 100, 6);
        g.fillStyle(0xAA7755);
        g.fillRect(193, 310, 49, 50);
        g.fillRect(195, 357, 45, 18);

        g.fillStyle(0x996644);
        g.fillRoundedRect(555, 270, 55, 100, 6);
        g.fillStyle(0xAA7755);
        g.fillRect(558, 310, 49, 50);
        g.fillRect(560, 357, 45, 18);

        // Refrigerator (left side, prominent)
        g.fillStyle(0xDDDDDD);
        g.fillRoundedRect(30, 155, 90, 260, 8);
        g.lineStyle(2, 0xBBBBBB);
        g.strokeRoundedRect(30, 155, 90, 260, 8);
        // Fridge doors
        g.lineStyle(2, 0xCCCCCC);
        g.lineBetween(30, 265, 120, 265);
        // Handles
        g.fillStyle(0xAAAAAA);
        g.fillRect(108, 195, 6, 35);
        g.fillRect(108, 290, 6, 35);
        // Magnets/decor
        this.add.text(58, 195, '🌟', { fontSize: '20px' });
        this.add.text(80, 225, '🐾', { fontSize: '18px' });
        this.add.text(55, 280, '❤️', { fontSize: '18px' });

        // Microwave
        g.fillStyle(0x555555);
        g.fillRoundedRect(680, 148, 98, 60, 6);
        g.fillStyle(0x333333);
        g.fillRoundedRect(686, 154, 72, 48, 4);
        // Microwave screen
        g.fillStyle(0x224422);
        g.fillRect(688, 158, 50, 38);
        this.add.text(713, 168, '12:00', {
            fontSize: '13px', fontFamily: 'Arial', color: '#44FF44'
        }).setOrigin(0.5);

        // Window above sink
        g.fillStyle(0x88CCFF);
        g.fillRect(100, 15, 110, 60);
        g.lineStyle(4, 0x886644);
        g.strokeRect(100, 15, 110, 60);
        g.lineStyle(2, 0x886644);
        g.lineBetween(155, 15, 155, 75);
        g.lineBetween(100, 45, 210, 45);
        // Curtains
        g.fillStyle(0x88DDAA);
        g.fillTriangle(100, 15, 100, 75, 122, 45);
        g.fillTriangle(210, 15, 210, 75, 188, 45);

        // Flowers on windowsill
        this.add.text(120, 68, '🌸', { fontSize: '18px' });
        this.add.text(170, 68, '🌻', { fontSize: '18px' });

        // Room label
        this.add.text(400, 565, 'Kitchen', {
            fontSize: '14px', fontFamily: 'Arial', color: '#449977', alpha: 0.7
        }).setOrigin(0.5);
    }

    setupPhysics() {
        this.physics.world.setBounds(0, 145, 800, 455);
        this.walls = this.physics.add.staticGroup();
        const addWall = (x, y, w, h) => {
            const wall = this.walls.create(x + w / 2, y + h / 2, 'pixel');
            wall.setDisplaySize(w, h);
            wall.setVisible(false);
            wall.refreshBody();
        };
        addWall(0, 145, 800, 18);
        addWall(0, 145, 20, 105);
        addWall(0, 390, 20, 210);
        addWall(780, 145, 20, 455);
        // Counter
        addWall(20, 100, 760, 60);
        // Fridge
        addWall(28, 148, 96, 275);
        // Table
        addWall(248, 254, 308, 140);
        // Chairs
        addWall(188, 268, 60, 105);
        addWall(553, 268, 60, 105);
        // Stove area
        addWall(578, 98, 126, 60);
        // Microwave area
        addWall(678, 146, 102, 65);
    }

    setupPlayer() {
        this.player = this.physics.add.image(80, 320, 'woofie').setScale(0.75);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
        this.physics.add.collider(this.player, this.walls);
    }

    setupDaisee() {
        // Daisee stands near the table, facing the player
        this.daisee = this.add.image(430, 450, 'daisee').setScale(0.88).setDepth(11);

        // Gentle idle bounce
        this.tweens.add({
            targets: this.daisee,
            y: 443,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Exclamation above Daisee
        this.daiseeBubble = this.add.text(430, 390, '! 💕', {
            fontSize: '26px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#FF2266', stroke: '#ffffff', strokeThickness: 3
        }).setOrigin(0.5).setDepth(20);

        this.tweens.add({
            targets: this.daiseeBubble,
            y: 384,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    setupUI() {
        this.talkHint = this.add.text(430, 370, 'SPACE to talk!', {
            fontSize: '15px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#FF2266', backgroundColor: '#FFEEEE',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setDepth(20).setVisible(false);
    }

    update() {
        if (this.dialogueActive) {
            this.player.setVelocity(0, 0);
            return;
        }

        const speed = 155;
        const left = this.cursors.left.isDown || this.wasd.A.isDown;
        const right = this.cursors.right.isDown || this.wasd.D.isDown;
        const up = this.cursors.up.isDown || this.wasd.W.isDown;
        const down = this.cursors.down.isDown || this.wasd.S.isDown;

        let vx = right ? speed : left ? -speed : 0;
        let vy = down ? speed : up ? -speed : 0;
        if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

        this.player.setVelocity(vx, vy);
        if (vx < 0) this.player.setFlipX(true);
        else if (vx > 0) this.player.setFlipX(false);

        const distToDaisee = Phaser.Math.Distance.Between(
            this.player.x, this.player.y, this.daisee.x, this.daisee.y
        );
        const near = distToDaisee < 110;
        this.talkHint.setVisible(near && !this.daiseeMet);

        if (near && !this.daiseeMet && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.meetDaisee();
        }

        // Back door
        if (!this.transitionStarted && this.player.x < 40 && this.player.y > 250 && this.player.y < 390) {
            this.transitionStarted = true;
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => this.scene.start('LivingRoomScene'));
        }
    }

    meetDaisee() {
        this.daiseeMet = true;
        this.talkHint.setVisible(false);
        this.daiseeBubble.setVisible(false);

        // Woofie runs to Daisee
        this.player.setVelocity(0, 0);
        this.tweens.add({
            targets: this.player,
            x: this.daisee.x - 60,
            y: this.daisee.y,
            duration: 600,
            ease: 'Sine.easeOut',
            onComplete: () => {
                // Happy jump
                this.tweens.add({
                    targets: [this.player, this.daisee],
                    y: '-=20',
                    duration: 300,
                    yoyo: true,
                    repeat: 2
                });
                this.time.delayedCall(400, () => {
                    this.showDialogue('Daisee', 0xFF2266, [
                        "WOOFIE!!! You found me!!!",
                        "I was looking EVERYWHERE for you!",
                        "I'm SO happy you're here! 💕",
                        "Come on, I have your favorite snack ready!",
                        "I love you so much, Woofie! 🦴❤️"
                    ], () => {
                        this.time.delayedCall(500, () => {
                            this.cameras.main.fadeOut(800, 255, 255, 255);
                            this.time.delayedCall(800, () => this.scene.start('WinScene'));
                        });
                    });
                });
            }
        });
    }

    showDialogue(speaker, color, lines, onComplete) {
        this.dialogueActive = true;
        const colorHex = '#' + color.toString(16).padStart(6, '0');
        const elements = [];

        const bg = this.add.rectangle(400, 545, 762, 112, 0xFFFAF0, 0.96)
            .setStrokeStyle(4, color).setDepth(90);
        elements.push(bg);

        const nameText = this.add.text(28, 492, speaker + ':', {
            fontSize: '20px', fontFamily: 'Arial', fontStyle: 'bold', color: colorHex
        }).setDepth(91);
        elements.push(nameText);

        const bodyText = this.add.text(28, 516, '', {
            fontSize: '17px', fontFamily: 'Arial', color: '#1a1a1a',
            wordWrap: { width: 736 }
        }).setDepth(91);
        elements.push(bodyText);

        const arrow = this.add.text(752, 573, '▼', {
            fontSize: '16px', color: '#888888'
        }).setDepth(91).setVisible(false);
        elements.push(arrow);

        let lineIndex = 0, typing = false, timer = null;

        const typeLine = (line) => {
            typing = true;
            arrow.setVisible(false);
            bodyText.setText('');
            let i = 0;
            timer = this.time.addEvent({
                delay: 22,
                callback: () => {
                    i++;
                    bodyText.setText(line.slice(0, i));
                    if (i >= line.length) {
                        typing = false;
                        arrow.setVisible(true);
                        if (timer) { timer.destroy(); timer = null; }
                    }
                },
                repeat: line.length - 1
            });
        };

        const advance = () => {
            if (typing) {
                if (timer) { timer.destroy(); timer = null; }
                bodyText.setText(lines[lineIndex]);
                typing = false;
                arrow.setVisible(true);
                return;
            }
            lineIndex++;
            if (lineIndex < lines.length) {
                typeLine(lines[lineIndex]);
            } else {
                elements.forEach(e => e.destroy());
                this.dialogueActive = false;
                this.input.off('pointerdown', advance);
                if (onComplete) onComplete();
            }
        };

        typeLine(lines[0]);
        this.input.on('pointerdown', advance);
    }
}
