class BedroomScene extends Phaser.Scene {
    constructor() { super('BedroomScene'); }

    create() {
        this.dialogueActive = false;
        this.miniGameActive = false;
        this.puzzleDone = window.GAME_STATE.bedroomPuzzleDone || false;
        this.introShown = false;
        this.nearPuzzle = false;
        this.transitionStarted = false;

        this.drawRoom();
        this.setupPhysics();
        this.setupPlayer();
        this.setupInput();
        this.setupUI();

        setupMobileControls(this);
        this.cameras.main.fadeIn(600);

        // Show intro dialogue after fade
        this.time.delayedCall(700, () => this.showIntro());
    }

    drawRoom() {
        const g = this.add.graphics();

        // Back wall (pink/cream)
        g.fillStyle(0xFFD4DC);
        g.fillRect(0, 0, 800, 145);

        // Wallpaper border
        g.fillStyle(0xFFABC0);
        g.fillRect(0, 130, 800, 15);
        g.lineStyle(2, 0xFF88AA);
        for (let x = 0; x < 800; x += 40) {
            g.fillStyle(0xFF88AA);
            g.fillStar ? null : null;
            this.add.text(x + 8, 8, '✿', { fontSize: '22px', color: '#FF88AA' });
        }

        // Floor (warm tan wood)
        g.fillStyle(0xD4A96A);
        g.fillRect(0, 145, 800, 455);

        // Floor boards (subtle lines)
        g.lineStyle(1, 0xBB9055, 0.4);
        for (let y = 170; y < 600; y += 40) {
            g.beginPath(); g.moveTo(0, y); g.lineTo(800, y); g.strokePath();
        }

        // Right wall (door will be here)
        g.fillStyle(0xFFD4DC);
        g.fillRect(780, 145, 20, 105);   // above door
        g.fillRect(780, 390, 20, 210);   // below door

        // Door frame on right (y 250-390)
        g.lineStyle(6, 0x996644);
        g.strokeRect(776, 250, 24, 140);
        // Door itself (brown wood)
        if (!this.puzzleDone) {
            g.fillStyle(0xAA7744);
            g.fillRect(778, 252, 20, 136);
            // Door knob
            g.fillStyle(0xFFD700);
            g.fillCircle(782, 320, 5);
            // Lock icon
            this.add.text(783, 290, '🔒', { fontSize: '16px' });
        } else {
            // Open door (dark gap)
            g.fillStyle(0x222222);
            g.fillRect(778, 252, 20, 136);
            this.add.text(783, 290, '➡', { fontSize: '18px', color: '#FFD700' });
        }

        // Left wall
        g.fillStyle(0xFFD4DC);
        g.fillRect(0, 145, 20, 455);

        // Window on back wall
        g.fillStyle(0xAADDFF);
        g.fillRect(80, 20, 120, 90);
        g.lineStyle(4, 0x886644);
        g.strokeRect(80, 20, 120, 90);
        g.lineStyle(2, 0x886644);
        g.lineBetween(140, 20, 140, 110);
        g.lineBetween(80, 65, 200, 65);
        // Curtains
        g.fillStyle(0xFF88AA);
        g.fillTriangle(80, 20, 80, 110, 108, 65);
        g.fillTriangle(200, 20, 200, 110, 172, 65);

        // Star decorations on wall
        this.add.text(260, 15, '⭐', { fontSize: '24px' });
        this.add.text(310, 25, '⭐', { fontSize: '18px' });
        this.add.text(340, 10, '⭐', { fontSize: '22px' });
        this.add.text(460, 20, '🌙', { fontSize: '28px' });
        this.add.text(530, 12, '⭐', { fontSize: '20px' });

        // Bed (center-ish)
        g.fillStyle(0x9966AA);
        g.fillRect(280, 155, 220, 130);   // bed frame
        g.fillStyle(0xFFE0F0);
        g.fillRect(290, 165, 200, 110);   // mattress
        // Pillow
        g.fillStyle(0xFFFFFF);
        g.fillRoundedRect(310, 168, 160, 45, 10);
        g.lineStyle(2, 0xDDDDDD);
        g.strokeRoundedRect(310, 168, 160, 45, 10);
        // Blanket
        g.fillStyle(0xFF88CC);
        g.fillRect(290, 215, 200, 60);
        g.lineStyle(2, 0xFF66AA);
        g.lineBetween(290, 240, 490, 240);
        // Headboard
        g.fillStyle(0x7744AA);
        g.fillRoundedRect(280, 145, 220, 20, 5);

        // Nightstand
        g.fillStyle(0xAA8855);
        g.fillRect(520, 180, 70, 80);
        g.fillStyle(0xBB9966);
        g.fillRect(523, 183, 64, 30);
        // Lamp on nightstand
        g.fillStyle(0xFFEE88);
        g.fillTriangle(555, 158, 535, 183, 575, 183);
        g.fillStyle(0xAAAAAA);
        g.fillRect(552, 183, 6, 14);
        g.fillStyle(0x888866);
        g.fillEllipse(555, 200, 30, 8);

        // Dresser on left
        g.fillStyle(0xAA8855);
        g.fillRect(30, 155, 110, 150);
        g.fillStyle(0xBB9966);
        g.fillRect(33, 158, 104, 35);
        g.fillRect(33, 200, 104, 35);
        g.fillRect(33, 242, 104, 35);
        // Drawer handles
        g.fillStyle(0xFFD700);
        g.fillCircle(85, 178, 5); g.fillCircle(85, 220, 5); g.fillCircle(85, 262, 5);

        // Rug
        g.fillStyle(0xCC66AA);
        g.fillEllipse(400, 420, 320, 130);
        g.lineStyle(3, 0xFF88CC);
        g.strokeEllipse(400, 420, 300, 112);
        g.lineStyle(2, 0xFF88CC);
        g.strokeEllipse(400, 420, 270, 94);

        // Puzzle board (near door)
        if (!this.puzzleDone) {
            g.fillStyle(0xFFFFAA);
            g.fillRoundedRect(660, 280, 90, 70, 8);
            g.lineStyle(3, 0xFFAA00);
            g.strokeRoundedRect(660, 280, 90, 70, 8);
            this.add.text(705, 305, '🧩', { fontSize: '28px' }).setOrigin(0.5);
            this.puzzleSignText = this.add.text(705, 338, 'PUZZLE', {
                fontSize: '13px', fontFamily: 'Arial', fontStyle: 'bold',
                color: '#AA6600'
            }).setOrigin(0.5);
        }

        // Room label
        this.add.text(400, 565, 'Bedroom', {
            fontSize: '14px', fontFamily: 'Arial', color: '#996688', alpha: 0.7
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
            return wall;
        };
        // Back wall
        addWall(0, 145, 800, 15);
        // Left wall
        addWall(0, 145, 20, 455);
        // Right wall (above and below door)
        addWall(780, 145, 20, 105);
        addWall(780, 390, 20, 210);

        // Door lock wall (removed after puzzle)
        this.doorLockWall = this.walls.create(790, 320, 'pixel');
        this.doorLockWall.setDisplaySize(20, 140);
        this.doorLockWall.setVisible(false);
        this.doorLockWall.refreshBody();
        if (this.puzzleDone) {
            this.doorLockWall.disableBody(true, true);
        }

        // Bed collision
        addWall(280, 145, 220, 140);
        // Dresser collision
        addWall(30, 155, 110, 150);
        // Nightstand collision
        addWall(520, 178, 70, 82);
        // Puzzle board collision area (soft - just visual, interaction is distance-based)
    }

    setupPlayer() {
        this.player = this.physics.add.image(390, 242, 'woofie').setScale(0.75);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
        this.physics.add.collider(this.player, this.walls);
    }

    setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    setupUI() {
        // Puzzle hint text
        this.puzzleHint = this.add.text(705, 265, 'SPACE to play!', {
            fontSize: '13px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#FF6600', backgroundColor: '#FFFFCC',
            padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setDepth(20).setVisible(false);

        // Door hint
        this.doorHint = this.add.text(720, 240, 'Need to\nsolve puzzle!', {
            fontSize: '13px', fontFamily: 'Arial', color: '#CC4400',
            align: 'center', stroke: '#ffffff', strokeThickness: 2
        }).setOrigin(0.5).setDepth(20).setVisible(false);

        this.hintTimer = null;

        // Tap zone for puzzle board (mobile)
        const pTap = this.add.rectangle(705, 315, 100, 80, 0x000000, 0).setDepth(5).setInteractive();
        pTap.on('pointerdown', () => {
            if (!this.puzzleDone && !this.dialogueActive && !this.miniGameActive) this.startMatchingGame();
        });
    }

    showIntro() {
        if (this.introShown) return;
        this.introShown = true;
        this.showDialogue('Woofie', 0x9966AA, [
            'Yawwwn... *stretches and blinks*',
            "Where is everyone...? This doesn't look right!",
            "Oh no! I can't find Daisee anywhere!",
            "I need to explore the house and find her!",
            "Maybe there's a puzzle near that door on the right..."
        ], null);
    }

    update() {
        if (this.dialogueActive || this.miniGameActive) {
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

        this.checkPuzzleInteraction();
        this.checkDoor();
    }

    checkPuzzleInteraction() {
        if (this.puzzleDone) { this.puzzleHint.setVisible(false); return; }
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, 705, 315);
        const isNear = dist < 90;
        this.puzzleHint.setVisible(isNear);
        if (isNear && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.startMatchingGame();
        }
    }

    checkDoor() {
        if (this.transitionStarted) return;
        if (this.player.x > 760 && this.player.y > 250 && this.player.y < 390) {
            if (this.puzzleDone) {
                this.transitionStarted = true;
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.time.delayedCall(500, () => this.scene.start('HallwayScene'));
            } else {
                this.doorHint.setVisible(true);
                if (this.hintTimer) this.hintTimer.destroy();
                this.hintTimer = this.time.delayedCall(2200, () => this.doorHint.setVisible(false));
            }
        }
    }

    startMatchingGame() {
        this.miniGameActive = true;
        this.player.setVelocity(0, 0);

        const elements = [];

        // Overlay
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.75).setDepth(50);
        elements.push(overlay);

        // Panel
        const panel = this.add.rectangle(400, 300, 520, 380, 0xFFF8E8, 1)
            .setStrokeStyle(5, 0xFF9900).setDepth(51);
        elements.push(panel);

        this.add.text(400, 148, 'Match the Pairs!', {
            fontSize: '30px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#FF6600', stroke: '#ffffff', strokeThickness: 4
        }).setOrigin(0.5).setDepth(52);

        this.add.text(400, 182, 'Find 3 matching pairs to unlock the door!', {
            fontSize: '16px', fontFamily: 'Arial', color: '#664400'
        }).setOrigin(0.5).setDepth(52);

        const icons = ['card_bone', 'card_ball', 'card_star'];
        const types = Phaser.Utils.Array.Shuffle([...icons, ...icons]);
        const COLS = 3, ROWS = 2;
        const cw = 78, ch = 78, gap = 18;
        const startX = 400 - ((COLS * (cw + gap)) / 2) + cw / 2;
        const startY = 300 - ((ROWS * (ch + gap)) / 2) + ch / 2;

        let flipped = [];
        let matched = 0;
        let canFlip = true;
        const cards = [];

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const idx = r * COLS + c;
                const x = startX + c * (cw + gap);
                const y = startY + r * (ch + gap);

                const back = this.add.image(x, y, 'card_back').setDepth(52).setInteractive({ useHandCursor: true });
                const front = this.add.image(x, y, types[idx]).setDepth(52).setVisible(false);

                const card = { back, front, type: types[idx], flipped: false, matched: false, x, y };
                cards.push(card);
                elements.push(back);
                elements.push(front);

                back.on('pointerover', () => { if (!card.flipped && !card.matched) back.setTint(0xDDCCFF); });
                back.on('pointerout', () => back.clearTint());

                back.on('pointerdown', () => {
                    if (!canFlip || card.flipped || card.matched) return;
                    card.flipped = true;
                    back.setVisible(false);
                    front.setVisible(true);
                    this.tweens.add({ targets: front, scaleX: { from: 0.1, to: 1 }, scaleY: { from: 0.1, to: 1 }, duration: 200, ease: 'Back.out' });
                    flipped.push(card);

                    if (flipped.length === 2) {
                        canFlip = false;
                        if (flipped[0].type === flipped[1].type) {
                            flipped.forEach(cd => {
                                cd.matched = true;
                                this.tweens.add({
                                    targets: cd.front, alpha: 0, scale: 1.3,
                                    delay: 350, duration: 450,
                                    onComplete: () => { cd.front.destroy(); cd.back.destroy(); }
                                });
                            });
                            // Sparkle effect
                            this.time.delayedCall(200, () => {
                                this.add.text(flipped[0].x, flipped[0].y - 30, '✨', { fontSize: '24px' }).setDepth(55);
                                this.add.text(flipped[1].x, flipped[1].y - 30, '✨', { fontSize: '24px' }).setDepth(55);
                            });
                            flipped = [];
                            matched++;
                            canFlip = true;

                            if (matched === icons.length) {
                                this.time.delayedCall(700, () => {
                                    elements.forEach(e => { if (e && e.active) e.destroy(); });
                                    this.miniGameActive = false;
                                    this.onPuzzleWin();
                                });
                            }
                        } else {
                            this.time.delayedCall(900, () => {
                                flipped.forEach(cd => {
                                    cd.flipped = false;
                                    cd.front.setVisible(false);
                                    cd.back.setVisible(true);
                                    this.tweens.add({ targets: cd.back, x: cd.x + 6, duration: 55, yoyo: true, repeat: 3, onComplete: () => cd.back.setX(cd.x) });
                                });
                                flipped = [];
                                canFlip = true;
                            });
                        }
                    }
                });
            }
        }
    }

    onPuzzleWin() {
        this.puzzleDone = true;
        window.GAME_STATE.bedroomPuzzleDone = true;
        this.doorLockWall.disableBody(true, true);
        this.puzzleHint.setVisible(false);
        this.showDialogue('Woofie', 0x9966AA, [
            'I did it! The door is unlocked!',
            'Time to explore the hallway!'
        ], null);
        // Redraw door as open
        const dg = this.add.graphics().setDepth(5);
        dg.fillStyle(0x222222);
        dg.fillRect(778, 252, 20, 136);
        this.add.text(783, 290, '➡', { fontSize: '18px', color: '#FFD700' }).setDepth(6);
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
