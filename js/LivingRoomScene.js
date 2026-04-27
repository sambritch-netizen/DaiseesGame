class LivingRoomScene extends Phaser.Scene {
    constructor() { super('LivingRoomScene'); }

    create() {
        this.dialogueActive = false;
        this.miniGameActive = false;
        this.puzzleDone = window.GAME_STATE.livingRoomPuzzleDone || false;
        this.rocketMet = window.GAME_STATE.rocketMet || false;
        this.transitionStarted = false;

        this.drawRoom();
        this.setupPhysics();
        this.setupPlayer();
        this.setupRocket();
        this.setupInput();
        this.setupUI();

        this.cameras.main.fadeIn(500);
    }

    drawRoom() {
        const g = this.add.graphics();

        // Back wall (warm cream)
        g.fillStyle(0xFFF2DC);
        g.fillRect(0, 0, 800, 145);
        g.fillStyle(0xEEDDC0);
        g.fillRect(0, 128, 800, 17);
        g.lineStyle(2, 0xDDCCAA);
        g.lineBetween(0, 128, 800, 128);

        // Floor (medium warm brown)
        g.fillStyle(0xB07840);
        g.fillRect(0, 145, 800, 455);
        g.lineStyle(1, 0x986630, 0.4);
        for (let y = 170; y < 600; y += 42) {
            g.beginPath(); g.moveTo(0, y); g.lineTo(800, y); g.strokePath();
        }

        // Left wall (door to hallway - open)
        g.fillStyle(0xFFF2DC);
        g.fillRect(0, 145, 20, 105);
        g.fillRect(0, 390, 20, 210);
        g.lineStyle(5, 0x886644);
        g.strokeRect(0, 250, 22, 140);
        g.fillStyle(0x222222);
        g.fillRect(0, 252, 20, 136);
        this.add.text(5, 290, '⬅', { fontSize: '18px', color: '#FFD700' });

        // Right wall (door to kitchen)
        g.fillStyle(0xFFF2DC);
        g.fillRect(780, 145, 20, 105);
        g.fillRect(780, 390, 20, 210);
        g.lineStyle(5, 0x886644);
        g.strokeRect(778, 250, 24, 140);

        if (!this.puzzleDone) {
            g.fillStyle(0xAA7744);
            g.fillRect(778, 252, 20, 136);
            g.fillStyle(0xFFD700);
            g.fillCircle(782, 320, 5);
            this.add.text(783, 292, '🔒', { fontSize: '16px' });
        } else {
            g.fillStyle(0x222222);
            g.fillRect(778, 252, 20, 136);
            this.add.text(783, 290, '➡', { fontSize: '18px', color: '#FFD700' });
        }

        // TV on back wall (center)
        g.fillStyle(0x222222);
        g.fillRoundedRect(300, 15, 200, 120, 8);
        g.fillStyle(0x111111);
        g.fillRoundedRect(310, 22, 180, 100, 4);
        // TV screen
        g.fillStyle(0x1A6A8A);
        g.fillRoundedRect(315, 27, 170, 88, 3);
        // TV glow content
        g.fillStyle(0x2288AA);
        g.fillEllipse(400, 71, 80, 40);
        g.fillStyle(0x44AACC);
        g.fillCircle(400, 71, 20);
        // TV stand
        g.fillStyle(0x333333);
        g.fillRect(390, 135, 20, 10);
        g.fillRect(370, 143, 60, 6);

        // Bookshelf on left back wall
        g.fillStyle(0x886644);
        g.fillRect(30, 22, 110, 110);
        // Shelves
        g.lineStyle(3, 0x664422);
        g.lineBetween(30, 58, 140, 58);
        g.lineBetween(30, 92, 140, 92);
        // Books
        const bookColors = [0xFF4444, 0x4488FF, 0x44AA44, 0xFFAA00, 0xAA44AA, 0xFF8844];
        bookColors.forEach((c, i) => {
            g.fillStyle(c);
            g.fillRect(34 + i * 17, 26, 12, 28);
        });
        const bookColors2 = [0x44CCCC, 0xFF44AA, 0x888844, 0x4444AA, 0xCC4444, 0x44CC88];
        bookColors2.forEach((c, i) => {
            g.fillStyle(c);
            g.fillRect(34 + i * 17, 64, 12, 24);
        });

        // Couch (large, center-bottom area)
        g.fillStyle(0x778899);
        g.fillRoundedRect(150, 455, 500, 80, 12);
        // Couch back
        g.fillStyle(0x8899AA);
        g.fillRoundedRect(150, 420, 500, 45, 8);
        // Cushions
        g.fillStyle(0x9AABB8);
        g.fillRoundedRect(162, 424, 148, 36, 6);
        g.fillRoundedRect(326, 424, 148, 36, 6);
        g.fillRoundedRect(490, 424, 148, 36, 6);
        // Seat cushions
        g.fillStyle(0x8A9BAA);
        g.fillRoundedRect(162, 458, 148, 44, 4);
        g.fillRoundedRect(326, 458, 148, 44, 4);
        g.fillRoundedRect(490, 458, 148, 44, 4);
        // Armrests
        g.fillStyle(0x667788);
        g.fillRoundedRect(148, 422, 18, 115, 6);
        g.fillRoundedRect(634, 422, 18, 115, 6);

        // Coffee table
        g.fillStyle(0x886644);
        g.fillRoundedRect(300, 380, 200, 55, 6);
        g.fillStyle(0xAA8855);
        g.fillRoundedRect(304, 383, 192, 48, 4);
        // Items on table
        this.add.text(370, 398, '☕', { fontSize: '22px' });
        this.add.text(415, 398, '📚', { fontSize: '20px' });
        // Table legs
        g.fillStyle(0x775533);
        g.fillRect(308, 430, 10, 20);
        g.fillRect(482, 430, 10, 20);

        // Side lamp (right)
        g.fillStyle(0x886644);
        g.fillRect(720, 340, 12, 80);
        g.fillStyle(0x664422);
        g.fillEllipse(726, 430, 40, 10);
        g.fillStyle(0xFFEE88);
        g.fillTriangle(726, 300, 700, 342, 752, 342);
        // Lamp glow
        g.fillStyle(0xFFFF88, 0.3);
        g.fillCircle(726, 320, 50);

        // Plant (left side)
        g.fillStyle(0xAA8866);
        g.fillRect(55, 280, 22, 40);
        g.fillStyle(0x6B4422);
        g.fillEllipse(66, 325, 38, 18);
        g.fillStyle(0x226622);
        g.fillCircle(66, 260, 32);
        g.fillCircle(46, 274, 22);
        g.fillCircle(86, 274, 22);
        g.fillStyle(0x338833);
        g.fillCircle(66, 245, 20);

        // Puzzle board near right wall
        if (!this.puzzleDone) {
            g.fillStyle(0xFFFFAA);
            g.fillRoundedRect(665, 285, 90, 70, 8);
            g.lineStyle(3, 0xFFAA00);
            g.strokeRoundedRect(665, 285, 90, 70, 8);
            this.add.text(710, 310, '🧩', { fontSize: '28px' }).setOrigin(0.5);
            this.add.text(710, 344, 'PUZZLE', {
                fontSize: '13px', fontFamily: 'Arial', fontStyle: 'bold', color: '#AA6600'
            }).setOrigin(0.5);
        }

        // Rug under coffee table
        g.fillStyle(0xCC4422);
        g.fillEllipse(400, 415, 340, 110);
        g.lineStyle(3, 0xFF6644);
        g.strokeEllipse(400, 415, 318, 92);
        g.lineStyle(2, 0xFF8866);
        g.strokeEllipse(400, 415, 285, 78);

        // Room label
        this.add.text(400, 565, 'Living Room', {
            fontSize: '14px', fontFamily: 'Arial', color: '#997755', alpha: 0.7
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
        addWall(0, 145, 800, 18);
        addWall(0, 145, 20, 105);
        addWall(0, 390, 20, 210);
        addWall(780, 145, 20, 105);
        addWall(780, 390, 20, 210);
        // TV stand area
        addWall(300, 120, 200, 140);
        // Bookshelf
        addWall(28, 145, 116, 115);
        // Couch
        addWall(148, 415, 506, 130);
        // Coffee table
        addWall(298, 375, 204, 60);
        // Lamp
        addWall(710, 290, 50, 150);
        // Plant
        addWall(44, 245, 48, 130);

        this.doorLockWall = this.walls.create(790, 320, 'pixel');
        this.doorLockWall.setDisplaySize(20, 140);
        this.doorLockWall.setVisible(false);
        this.doorLockWall.refreshBody();
        if (this.puzzleDone) {
            this.doorLockWall.disableBody(true, true);
        }
    }

    setupPlayer() {
        this.player = this.physics.add.image(80, 320, 'woofie').setScale(0.75);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
        this.physics.add.collider(this.player, this.walls);
    }

    setupRocket() {
        this.rocket = this.add.image(380, 360, 'rocket').setScale(0.82).setDepth(11);
        this.rocketTween = this.tweens.add({
            targets: this.rocket,
            x: 580,
            duration: 2800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onYoyo: () => this.rocket.setFlipX(false),
            onRepeat: () => this.rocket.setFlipX(true)
        });

        this.rocketBubble = this.add.text(0, 0, '!', {
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

        this.puzzleHint = this.add.text(710, 270, 'SPACE to play!', {
            fontSize: '13px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#FF6600', backgroundColor: '#FFFFCC',
            padding: { x: 5, y: 3 }
        }).setOrigin(0.5).setDepth(20).setVisible(false);

        this.doorHint = this.add.text(720, 240, 'Solve the\npuzzle first!', {
            fontSize: '13px', fontFamily: 'Arial', color: '#CC4400',
            align: 'center', stroke: '#ffffff', strokeThickness: 2
        }).setOrigin(0.5).setDepth(20).setVisible(false);
        this.hintTimer = null;
    }

    update() {
        if (this.dialogueActive || this.miniGameActive) {
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

        // Rocket indicator
        this.rocketBubble.setPosition(this.rocket.x, this.rocket.y - 68);
        this.talkHint.setPosition(this.rocket.x, this.rocket.y - 96);
        const distToRocket = Phaser.Math.Distance.Between(
            this.player.x, this.player.y, this.rocket.x, this.rocket.y
        );
        const nearRocket = distToRocket < 90;
        this.rocketBubble.setVisible(nearRocket && !this.rocketMet);
        this.talkHint.setVisible(nearRocket);
        if (nearRocket && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.talkToRocket();
        }

        // Puzzle interaction
        if (!this.puzzleDone) {
            const distToPuzzle = Phaser.Math.Distance.Between(this.player.x, this.player.y, 710, 320);
            const nearPuzzle = distToPuzzle < 90;
            this.puzzleHint.setVisible(nearPuzzle);
            if (nearPuzzle && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                this.startMemoryGame();
            }
        } else {
            this.puzzleHint.setVisible(false);
        }

        this.checkDoors();
    }

    talkToRocket() {
        if (this.dialogueActive) return;
        this.rocketTween.pause();
        let lines;
        if (!this.rocketMet) {
            lines = [
                "Rocket: WOOFIE! Hey hey hey! Over here!",
                "Rocket: Are you looking for Daisee? Me too! She went to the kitchen!",
                "Rocket: But the kitchen door is stuck... unless...",
                "Rocket: Play the memory card game with me and maybe it'll open!",
                "Rocket: I LOVE card games! Match all the pairs! Go to the puzzle board!"
            ];
        } else if (!this.puzzleDone) {
            lines = [
                "Rocket: Match all the cards at the puzzle board to unlock the kitchen!",
                "Rocket: You can do it!"
            ];
        } else {
            lines = [
                "Rocket: Amazing! You did it! Daisee is definitely in the kitchen!",
                "Rocket: Go find her! *wiggles entire body*"
            ];
        }
        this.showDialogue('Rocket', 0xCC4422, lines, () => {
            this.rocketMet = true;
            window.GAME_STATE.rocketMet = true;
            this.rocketTween.resume();
        });
    }

    startMemoryGame() {
        this.miniGameActive = true;
        this.player.setVelocity(0, 0);
        this.rocketTween.pause();

        const elements = [];

        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.78).setDepth(50);
        elements.push(overlay);

        const panel = this.add.rectangle(400, 295, 580, 400, 0xFFF8E8, 1)
            .setStrokeStyle(5, 0xCC4422).setDepth(51);
        elements.push(panel);

        this.add.text(400, 112, "Memory Game!", {
            fontSize: '30px', fontFamily: 'Arial', fontStyle: 'bold',
            color: '#CC4422', stroke: '#ffffff', strokeThickness: 4
        }).setOrigin(0.5).setDepth(52);

        this.add.text(400, 146, 'Find 4 matching pairs to unlock the kitchen!', {
            fontSize: '15px', fontFamily: 'Arial', color: '#663300'
        }).setOrigin(0.5).setDepth(52);

        const icons = ['card_bone', 'card_ball', 'card_heart', 'card_paw'];
        const types = Phaser.Utils.Array.Shuffle([...icons, ...icons]);
        const COLS = 4, ROWS = 2;
        const cw = 78, ch = 78, gap = 14;
        const startX = 400 - ((COLS * (cw + gap)) / 2) + cw / 2;
        const startY = 295 - ((ROWS * (ch + gap)) / 2) + ch / 2;

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
                    this.tweens.add({
                        targets: front, scaleX: { from: 0.1, to: 1 }, scaleY: { from: 0.1, to: 1 },
                        duration: 200, ease: 'Back.out'
                    });
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
                                    this.tweens.add({
                                        targets: cd.back, x: cd.x + 6, duration: 55,
                                        yoyo: true, repeat: 3, onComplete: () => cd.back.setX(cd.x)
                                    });
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
        window.GAME_STATE.livingRoomPuzzleDone = true;
        this.doorLockWall.disableBody(true, true);
        this.puzzleHint.setVisible(false);
        this.rocketTween.resume();
        this.showDialogue('Rocket', 0xCC4422, [
            "Rocket: YEAH! You did it! Amazing!",
            "Rocket: The kitchen door is open!",
            "Rocket: Go find Daisee! She's waiting for you! 🐾"
        ], null);
        // Redraw door open
        const dg = this.add.graphics().setDepth(5);
        dg.fillStyle(0x222222);
        dg.fillRect(778, 252, 20, 136);
        this.add.text(783, 290, '➡', { fontSize: '18px', color: '#FFD700' }).setDepth(6);
    }

    checkDoors() {
        if (this.transitionStarted) return;
        if (this.player.x > 760 && this.player.y > 250 && this.player.y < 390) {
            if (this.puzzleDone) {
                this.transitionStarted = true;
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.time.delayedCall(500, () => this.scene.start('KitchenScene'));
            } else {
                this.doorHint.setVisible(true);
                if (this.hintTimer) this.hintTimer.destroy();
                this.hintTimer = this.time.delayedCall(2200, () => this.doorHint.setVisible(false));
            }
        }
        if (this.player.x < 40 && this.player.y > 250 && this.player.y < 390) {
            this.transitionStarted = true;
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => this.scene.start('HallwayScene'));
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
