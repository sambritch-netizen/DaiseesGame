class HallwayScene extends Phaser.Scene {
    constructor() { super('HallwayScene'); }

    create() {
        this.dialogueActive = false;
        this.ivanMet = window.GAME_STATE.ivanMet || false;
        this.transitionStarted = false;

        this.drawRoom();
        this.setupPhysics();
        this.setupPlayer();
        this.setupIvan();
        this.setupInput();
        this.setupUI();

        setupMobileControls(this);
        this.cameras.main.fadeIn(500);
    }

    drawRoom() {
        const g = this.add.graphics();

        // Back wall (warm light beige/cream)
        g.fillStyle(0xF0E8D8);
        g.fillRect(0, 0, 800, 145);

        // Baseboard
        g.fillStyle(0xDDD0BA);
        g.fillRect(0, 128, 800, 17);
        g.lineStyle(2, 0xCCBDA8);
        g.lineBetween(0, 128, 800, 128);

        // Floor (darker wood)
        g.fillStyle(0xA87840);
        g.fillRect(0, 145, 800, 455);

        // Floor boards
        g.lineStyle(1, 0x906830, 0.5);
        for (let y = 165; y < 600; y += 45) {
            g.beginPath(); g.moveTo(0, y); g.lineTo(800, y); g.strokePath();
        }
        // Vertical board lines
        g.lineStyle(1, 0x906830, 0.2);
        for (let x = 80; x < 800; x += 80) {
            g.beginPath(); g.moveTo(x, 145); g.lineTo(x, 600); g.strokePath();
        }

        // Left wall (door to bedroom)
        g.fillStyle(0xF0E8D8);
        g.fillRect(0, 145, 20, 105);  // above door
        g.fillRect(0, 390, 20, 210);  // below door
        // Left door frame
        g.lineStyle(5, 0x886644);
        g.strokeRect(0, 250, 22, 140);
        // Open door (came from bedroom)
        g.fillStyle(0x222222);
        g.fillRect(0, 252, 20, 136);
        this.add.text(5, 290, '⬅', { fontSize: '18px', color: '#FFD700' });

        // Right wall (door to living room)
        g.fillStyle(0xF0E8D8);
        g.fillRect(780, 145, 20, 105);  // above door
        g.fillRect(780, 390, 20, 210);  // below door
        g.lineStyle(5, 0x886644);
        g.strokeRect(778, 250, 24, 140);
        // Right door (always unlocked in hallway)
        g.fillStyle(0x222222);
        g.fillRect(778, 252, 20, 136);
        this.add.text(783, 290, '➡', { fontSize: '18px', color: '#FFD700' });

        // Framed photos on back wall
        this.drawPicture(g, 160, 30, 80, 70, 0x8844AA, '🐕');
        this.drawPicture(g, 300, 25, 90, 75, 0x4488AA, '🏠');
        this.drawPicture(g, 460, 20, 100, 80, 0xAA6622, '❤️');
        this.drawPicture(g, 620, 28, 80, 70, 0x44AA88, '⭐');

        // Coat rack on left side
        g.fillStyle(0x886644);
        g.fillRect(55, 150, 8, 130);
        g.fillStyle(0x664422);
        g.fillEllipse(59, 148, 20, 10);
        // Hooks
        for (let i = 0; i < 3; i++) {
            g.fillStyle(0x886644);
            g.fillCircle(59 + i * 20, 170, 5);
            // Hanging item
            if (i === 1) {
                this.add.text(60 + i * 20, 182, '🎒', { fontSize: '18px' }).setOrigin(0.5);
            }
        }

        // Plant on right side
        g.fillStyle(0x886644);
        g.fillRect(700, 230, 20, 40);
        g.fillStyle(0x446622);
        g.fillCircle(710, 215, 28);
        g.fillCircle(692, 225, 20);
        g.fillCircle(728, 225, 20);
        g.fillStyle(0x558833);
        g.fillCircle(710, 200, 18);

        // Hallway rug (long runner)
        g.fillStyle(0x8844AA);
        g.fillRect(120, 380, 560, 60);
        g.lineStyle(3, 0xAA66CC);
        g.strokeRect(124, 384, 552, 52);
        // Rug pattern
        g.fillStyle(0xCC88EE);
        for (let x = 145; x < 680; x += 55) {
            g.fillEllipse(x, 410, 30, 20);
        }

        // Room label
        this.add.text(400, 565, 'Hallway', {
            fontSize: '14px', fontFamily: 'Arial', color: '#997755', alpha: 0.7
        }).setOrigin(0.5);
    }

    drawPicture(g, x, y, w, h, frameColor, emoji) {
        g.fillStyle(0xffffff);
        g.fillRect(x, y, w, h);
        g.lineStyle(5, frameColor);
        g.strokeRect(x, y, w, h);
        this.add.text(x + w / 2, y + h / 2, emoji, {
            fontSize: Math.min(w, h) * 0.5 + 'px'
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
        // Back wall
        addWall(0, 145, 800, 18);
        // Left wall (above/below door)
        addWall(0, 145, 20, 105);
        addWall(0, 390, 20, 210);
        // Right wall (above/below door)
        addWall(780, 145, 20, 105);
        addWall(780, 390, 20, 210);
        // Coat rack area
        addWall(45, 150, 35, 135);
        // Plant area
        addWall(690, 180, 50, 90);
    }

    setupPlayer() {
        this.player = this.physics.add.image(80, 320, 'woofie').setScale(0.75);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
        this.physics.add.collider(this.player, this.walls);
    }

    setupIvan() {
        // Ivan wanders back and forth in the hallway
        this.ivan = this.add.image(350, 340, 'ivan').setScale(0.82).setDepth(10);

        this.ivanTween = this.tweens.add({
            targets: this.ivan,
            x: 620,
            duration: 3500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onYoyo: () => this.ivan.setFlipX(false),
            onRepeat: () => this.ivan.setFlipX(true)
        });

        // Exclamation mark above Ivan
        // Tap Ivan directly to talk (mobile)
        this.ivan.setInteractive();
        this.ivan.on('pointerdown', () => {
            if (this.dialogueActive) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.ivan.x, this.ivan.y);
            if (dist < 180) this.talkToIvan();
        });

        this.ivanBubble = this.add.text(0, 0, '!', {
            fontSize: '32px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#FF4400', stroke: '#ffffff', strokeThickness: 4
        }).setOrigin(0.5).setDepth(20).setVisible(false);
    }

    setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    setupUI() {
        this.talkHint = this.add.text(400, 200, 'SPACE to talk!', {
            fontSize: '15px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#FF4400', backgroundColor: '#FFEECC',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setDepth(20).setVisible(false);
    }

    update() {
        if (this.dialogueActive) {
            this.player.setVelocity(0, 0);
            return;
        }

        const speed = 155;
        const left = this.cursors.left.isDown || this.wasd.A.isDown || this.dpad.left;
        const right = this.cursors.right.isDown || this.wasd.D.isDown || this.dpad.right;
        const up = this.cursors.up.isDown || this.wasd.W.isDown || this.dpad.up;
        const down = this.cursors.down.isDown || this.wasd.S.isDown || this.dpad.down;

        let vx = right ? speed : left ? -speed : 0;
        let vy = down ? speed : up ? -speed : 0;
        if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

        this.player.setVelocity(vx, vy);
        if (vx < 0) this.player.setFlipX(true);
        else if (vx > 0) this.player.setFlipX(false);

        this.ivanBubble.setPosition(this.ivan.x, this.ivan.y - 70);
        this.talkHint.setPosition(this.ivan.x, this.ivan.y - 95);

        const distToIvan = Phaser.Math.Distance.Between(
            this.player.x, this.player.y, this.ivan.x, this.ivan.y
        );

        const near = distToIvan < 90;
        this.ivanBubble.setVisible(near && !this.ivanMet);
        this.talkHint.setVisible(near);

        if (near && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.talkToIvan();
        }

        this.checkDoors();
    }

    talkToIvan() {
        if (this.dialogueActive) return;
        this.ivanTween.pause();
        const lines = this.ivanMet
            ? ["Ivan: *happy panting* Daisee went to the living room! Keep going right!", "Ivan: You've got this, Woofie! Woof!"]
            : ["Ivan: WOOFIE! There you are!", "Ivan: I saw Daisee go toward the living room!", "Ivan: She said something about the kitchen too!", "Ivan: Go through the door at the end of the hall!", "Ivan: *wags tail* You'll find her, I know it! 🐾"];

        this.showDialogue('Ivan', 0x3366CC, lines, () => {
            this.ivanMet = true;
            window.GAME_STATE.ivanMet = true;
            this.ivanTween.resume();
        });
    }

    checkDoors() {
        if (this.transitionStarted) return;
        // Right door → Living Room
        if (this.player.x > 760 && this.player.y > 250 && this.player.y < 390) {
            this.transitionStarted = true;
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => this.scene.start('LivingRoomScene'));
        }
        // Left door → back to Bedroom
        if (this.player.x < 40 && this.player.y > 250 && this.player.y < 390) {
            this.transitionStarted = true;
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => this.scene.start('BedroomScene'));
        }
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

        const advance = (pointer) => {
            if (pointer && pointer.x < 170 && pointer.y > 445) return;
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
