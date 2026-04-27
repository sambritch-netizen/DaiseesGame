class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }

    create() {
        this.createPixelTexture();
        this.createWoofieTexture();
        this.createIvanTexture();
        this.createRocketTexture();
        this.createDaiseeTexture();
        this.createCardTextures();
        this.scene.start('TitleScene');
    }

    createPixelTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffffff, 1);
        g.fillRect(0, 0, 4, 4);
        g.generateTexture('pixel', 4, 4);
        g.destroy();
    }

    // Woofie: fluffy white/gray stuffed dog, big black knit nose, round and shaggy
    createWoofieTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = 45, cy = 52;

        // Tail
        g.lineStyle(9, 0xBBBBBB);
        g.beginPath();
        g.moveTo(cx + 28, cy + 10);
        g.bezierCurveTo(cx + 58, cy - 8, cx + 62, cy + 18, cx + 46, cy + 30);
        g.strokePath();
        g.fillStyle(0xCCCCCC);
        g.fillCircle(cx + 46, cy + 30, 9);

        // Body base
        g.fillStyle(0xD0D0D0);
        g.fillEllipse(cx, cy + 18, 60, 48);

        // Body fluff puffs (shaggy texture)
        g.fillStyle(0xE2E2E2);
        g.fillCircle(cx - 20, cy + 10, 16);
        g.fillCircle(cx + 4, cy + 6, 15);
        g.fillCircle(cx + 22, cy + 13, 14);
        g.fillCircle(cx - 6, cy + 24, 13);
        g.fillCircle(cx + 20, cy + 27, 12);
        g.fillCircle(cx - 22, cy + 26, 13);
        g.fillCircle(cx + 2, cy + 34, 10);

        // Rear paws
        g.fillStyle(0xBCBCBC);
        g.fillEllipse(cx - 20, cy + 46, 24, 14);
        g.fillEllipse(cx + 20, cy + 46, 24, 14);
        g.fillStyle(0xAAAAAA);
        [-8, 0, 8].forEach(dx => {
            g.fillCircle(cx - 20 + dx, cy + 42, 4);
            g.fillCircle(cx + 20 + dx, cy + 42, 4);
        });

        // Head base
        g.fillStyle(0xD8D8D8);
        g.fillCircle(cx, cy - 16, 30);

        // Head fluff puffs
        g.fillStyle(0xEAEAEA);
        g.fillCircle(cx - 18, cy - 26, 18);
        g.fillCircle(cx + 10, cy - 30, 16);
        g.fillCircle(cx + 24, cy - 18, 14);
        g.fillCircle(cx - 2, cy - 38, 13);
        g.fillCircle(cx - 28, cy - 16, 12);

        // Floppy ears
        g.fillStyle(0xC0C0C0);
        g.fillEllipse(cx - 30, cy - 24, 20, 34);
        g.fillEllipse(cx + 30, cy - 24, 20, 34);
        g.fillStyle(0xD2D2D2);
        g.fillEllipse(cx - 30, cy - 24, 12, 22);
        g.fillEllipse(cx + 30, cy - 24, 12, 22);

        // Big black knit nose (characteristic of Woofie)
        g.fillStyle(0x111111);
        g.fillEllipse(cx, cy - 8, 22, 15);
        g.fillStyle(0x3A3A3A);
        g.fillEllipse(cx - 4, cy - 12, 8, 5);

        // Eyes
        g.fillStyle(0x111111);
        g.fillCircle(cx - 15, cy - 22, 6);
        g.fillCircle(cx + 15, cy - 22, 6);
        g.fillStyle(0xFFFFFF);
        g.fillCircle(cx - 12, cy - 25, 2.2);
        g.fillCircle(cx + 18, cy - 25, 2.2);

        // Happy mouth
        g.lineStyle(2.5, 0x555555);
        g.beginPath();
        g.arc(cx, cy - 2, 7, 0.25, Math.PI - 0.25);
        g.strokePath();

        // Front paws
        g.fillStyle(0xC4C4C4);
        g.fillEllipse(cx - 15, cy + 42, 20, 13);
        g.fillEllipse(cx + 15, cy + 42, 20, 13);
        g.fillStyle(0xAAAAAA);
        [-6, 0, 6].forEach(dx => {
            g.fillCircle(cx - 15 + dx, cy + 38, 3.5);
            g.fillCircle(cx + 15 + dx, cy + 38, 3.5);
        });

        g.generateTexture('woofie', 100, 100);
        g.destroy();
    }

    // Ivan: black German Shepherd, large pointed ears, tan markings, white chest
    createIvanTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = 44, cy = 55;

        // Tail (long, bushy, black)
        g.lineStyle(8, 0x111111);
        g.beginPath();
        g.moveTo(cx + 22, cy + 12);
        g.bezierCurveTo(cx + 52, cy - 2, cx + 62, cy - 20, cx + 50, cy - 32);
        g.strokePath();

        // Body (sleek black)
        g.fillStyle(0x101010);
        g.fillEllipse(cx, cy + 14, 56, 44);

        // White/cream chest
        g.fillStyle(0xE8E5D8);
        g.fillEllipse(cx - 4, cy + 8, 22, 32);

        // Tan saddle markings (subtle)
        g.fillStyle(0x2E1E0E);
        g.fillEllipse(cx + 4, cy + 8, 28, 20);

        // Rear paws (tan/rust)
        g.fillStyle(0xC07840);
        g.fillEllipse(cx - 17, cy + 38, 20, 12);
        g.fillEllipse(cx + 17, cy + 38, 20, 12);

        // Head (angular GSD-style)
        g.fillStyle(0x0E0E0E);
        g.fillEllipse(cx, cy - 16, 36, 34);

        // Tan cheek markings
        g.fillStyle(0xC07840);
        g.fillEllipse(cx - 11, cy - 10, 15, 20);
        g.fillEllipse(cx + 11, cy - 10, 15, 20);

        // Tan muzzle
        g.fillStyle(0xD09060);
        g.fillEllipse(cx, cy - 8, 22, 16);

        // Black back of muzzle / forehead
        g.fillStyle(0x0E0E0E);
        g.fillEllipse(cx, cy - 22, 24, 14);

        // Large pointed ears (iconic GSD feature)
        g.fillStyle(0x0A0A0A);
        const earPoints = [
            // Left ear
            [cx - 8, cy - 30], [cx - 26, cy - 68], [cx - 3, cy - 34],
            // Right ear
            [cx + 8, cy - 30], [cx + 26, cy - 68], [cx + 3, cy - 34]
        ];
        g.fillTriangle(cx - 8, cy - 30, cx - 26, cy - 68, cx - 3, cy - 34);
        g.fillTriangle(cx + 8, cy - 30, cx + 26, cy - 68, cx + 3, cy - 34);

        // Inner ear (pinkish-tan)
        g.fillStyle(0xC49080);
        g.fillTriangle(cx - 10, cy - 31, cx - 24, cy - 62, cx - 5, cy - 35);
        g.fillTriangle(cx + 10, cy - 31, cx + 24, cy - 62, cx + 5, cy - 35);

        // Tan dots above eyes (characteristic GSD marking)
        g.fillStyle(0xC07840);
        g.fillCircle(cx - 13, cy - 26, 4);
        g.fillCircle(cx + 13, cy - 26, 4);

        // Nose (black, wide)
        g.fillStyle(0x060606);
        g.fillEllipse(cx, cy - 4, 16, 10);
        g.fillStyle(0x2A2A2A);
        g.fillEllipse(cx - 2, cy - 7, 6, 3.5);

        // Eyes (warm amber/brown)
        g.fillStyle(0x7A4010);
        g.fillCircle(cx - 13, cy - 19, 5.5);
        g.fillCircle(cx + 13, cy - 19, 5.5);
        g.fillStyle(0x0A0A0A);
        g.fillCircle(cx - 13, cy - 19, 3.5);
        g.fillCircle(cx + 13, cy - 19, 3.5);
        g.fillStyle(0xFFFFFF);
        g.fillCircle(cx - 11, cy - 21, 1.5);
        g.fillCircle(cx + 15, cy - 21, 1.5);

        // Tongue (happy, peeking out)
        g.fillStyle(0xFF8888);
        g.fillEllipse(cx, cy, 11, 8);
        g.fillStyle(0xCC6666);
        g.fillRect(cx - 5, cy - 1, 10, 4);

        // Front paws (tan)
        g.fillStyle(0xC07840);
        g.fillEllipse(cx - 13, cy + 36, 18, 11);
        g.fillEllipse(cx + 13, cy + 36, 18, 11);

        g.generateTexture('ivan', 100, 100);
        g.destroy();
    }

    // Rocket: black and tan dog, floppy ears, compact body, Kelpie/Rottweiler mix
    createRocketTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = 42, cy = 54;

        // Tail (black, curves to side)
        g.lineStyle(7, 0x0A0A0A);
        g.beginPath();
        g.moveTo(cx + 24, cy + 8);
        g.bezierCurveTo(cx + 48, cy + 4, cx + 52, cy + 26, cx + 36, cy + 34);
        g.strokePath();

        // Body (compact, black)
        g.fillStyle(0x0C0C0C);
        g.fillEllipse(cx, cy + 12, 52, 42);

        // Tan/rust chest and belly markings
        g.fillStyle(0xC46A30);
        g.fillEllipse(cx - 2, cy + 14, 24, 32);
        g.fillStyle(0x0C0C0C);
        g.fillEllipse(cx - 2, cy + 4, 18, 14);

        // Rear paws (tan)
        g.fillStyle(0xC46A30);
        g.fillEllipse(cx - 16, cy + 36, 19, 11);
        g.fillEllipse(cx + 16, cy + 36, 19, 11);

        // Head (rounder than Ivan, not angular)
        g.fillStyle(0x0C0C0C);
        g.fillCircle(cx, cy - 15, 27);

        // Tan cheek markings
        g.fillStyle(0xC46A30);
        g.fillEllipse(cx - 10, cy - 10, 14, 18);
        g.fillEllipse(cx + 10, cy - 10, 14, 18);

        // Tan/cream muzzle
        g.fillStyle(0xD4885A);
        g.fillEllipse(cx, cy - 7, 20, 15);

        // Black back of muzzle
        g.fillStyle(0x0C0C0C);
        g.fillEllipse(cx, cy - 18, 20, 10);

        // Floppy ears (key difference from Ivan - they fold down)
        g.fillStyle(0x0A0A0A);
        g.fillEllipse(cx - 24, cy - 23, 17, 24);
        g.fillEllipse(cx + 24, cy - 23, 17, 24);
        g.fillStyle(0xC4805A);
        g.fillEllipse(cx - 24, cy - 23, 10, 15);
        g.fillEllipse(cx + 24, cy - 23, 10, 15);

        // Tan eyebrow dots
        g.fillStyle(0xC46A30);
        g.fillCircle(cx - 12, cy - 24, 3.5);
        g.fillCircle(cx + 12, cy - 24, 3.5);

        // Nose
        g.fillStyle(0x060606);
        g.fillEllipse(cx, cy - 4, 14, 9);
        g.fillStyle(0x282828);
        g.fillEllipse(cx - 2, cy - 6.5, 5, 3);

        // Eyes (dark warm brown, soulful)
        g.fillStyle(0x6A3010);
        g.fillCircle(cx - 12, cy - 17, 5);
        g.fillCircle(cx + 12, cy - 17, 5);
        g.fillStyle(0x080808);
        g.fillCircle(cx - 12, cy - 17, 3.5);
        g.fillCircle(cx + 12, cy - 17, 3.5);
        g.fillStyle(0xFFFFFF);
        g.fillCircle(cx - 10, cy - 19, 1.5);
        g.fillCircle(cx + 14, cy - 19, 1.5);

        // Slight smile
        g.lineStyle(2.5, 0x3A1A0A);
        g.beginPath();
        g.arc(cx, cy - 1, 6, 0.2, Math.PI - 0.2);
        g.strokePath();

        // Front paws (tan)
        g.fillStyle(0xC46A30);
        g.fillEllipse(cx - 12, cy + 34, 16, 10);
        g.fillEllipse(cx + 12, cy + 34, 16, 10);

        g.generateTexture('rocket', 90, 90);
        g.destroy();
    }

    // Daisee: young girl, brown pigtails, pink shirt, blue jeans
    createDaiseeTexture() {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = 35, cy = 58;

        // Legs (jeans)
        g.fillStyle(0x3A6EA5);
        g.fillRect(cx - 14, cy + 22, 11, 32);
        g.fillRect(cx + 3, cy + 22, 11, 32);

        // Shoes (red)
        g.fillStyle(0xCC3322);
        g.fillEllipse(cx - 8, cy + 57, 18, 10);
        g.fillEllipse(cx + 9, cy + 57, 18, 10);

        // Body - pink shirt
        g.fillStyle(0xFF80B0);
        g.fillRoundedRect(cx - 18, cy - 4, 36, 30, 4);

        // Shirt detail
        g.fillStyle(0xFF5590);
        g.fillEllipse(cx, cy - 2, 16, 7);

        // Arms
        g.fillStyle(0xFF80B0);
        g.fillRect(cx - 23, cy - 2, 8, 22);
        g.fillRect(cx + 15, cy - 2, 8, 22);

        // Hands
        g.fillStyle(0xFDC0A0);
        g.fillCircle(cx - 19, cy + 21, 7);
        g.fillCircle(cx + 19, cy + 21, 7);

        // Neck
        g.fillStyle(0xFDC0A0);
        g.fillRect(cx - 6, cy - 14, 12, 13);

        // Head
        g.fillStyle(0xFDC0A0);
        g.fillCircle(cx, cy - 27, 25);

        // Hair (brown, full top)
        g.fillStyle(0x6B3A0E);
        g.fillEllipse(cx, cy - 46, 46, 24);
        g.fillEllipse(cx - 13, cy - 36, 23, 28);
        g.fillEllipse(cx + 13, cy - 36, 23, 28);

        // Pigtails
        g.fillStyle(0x6B3A0E);
        g.fillEllipse(cx - 34, cy - 32, 15, 22);
        g.fillEllipse(cx + 34, cy - 32, 15, 22);

        // Hair ties (pink)
        g.fillStyle(0xFF2266);
        g.fillCircle(cx - 34, cy - 33, 5);
        g.fillCircle(cx + 34, cy - 33, 5);

        // Eyes
        g.fillStyle(0x3A2010);
        g.fillCircle(cx - 10, cy - 29, 5.5);
        g.fillCircle(cx + 10, cy - 29, 5.5);
        g.fillStyle(0x0A0A0A);
        g.fillCircle(cx - 10, cy - 29, 3.5);
        g.fillCircle(cx + 10, cy - 29, 3.5);
        g.fillStyle(0xFFFFFF);
        g.fillCircle(cx - 8, cy - 31, 1.5);
        g.fillCircle(cx + 12, cy - 31, 1.5);

        // Rosy cheeks
        g.fillStyle(0xFF9090);
        g.fillCircle(cx - 17, cy - 23, 5);
        g.fillCircle(cx + 17, cy - 23, 5);

        // Big smile
        g.lineStyle(3, 0xCC5540);
        g.beginPath();
        g.arc(cx, cy - 21, 9, 0.2, Math.PI - 0.2);
        g.strokePath();

        g.generateTexture('daisee', 72, 110);
        g.destroy();
    }

    createCardTextures() {
        // Card back
        const back = this.make.graphics({ x: 0, y: 0, add: false });
        back.fillStyle(0x5533AA);
        back.fillRoundedRect(0, 0, 78, 78, 10);
        back.fillStyle(0x7755CC);
        back.fillRoundedRect(5, 5, 68, 68, 8);
        back.lineStyle(1.5, 0x9977EE, 0.6);
        for (let i = 0; i < 4; i++) {
            back.strokeRoundedRect(7 + i * 7, 7 + i * 7, 64 - i * 14, 64 - i * 14, 4);
        }
        back.fillStyle(0xFFD700);
        this.drawStar(back, 39, 39, 5, 12, 6);
        back.generateTexture('card_back', 78, 78);
        back.destroy();

        // Card face base
        const face = this.make.graphics({ x: 0, y: 0, add: false });
        face.fillStyle(0xFFFBF5);
        face.fillRoundedRect(0, 0, 78, 78, 10);
        face.lineStyle(2, 0xDDCCBB);
        face.strokeRoundedRect(1, 1, 76, 76, 10);
        face.generateTexture('card_face_base', 78, 78);
        face.destroy();

        // Bone card
        const bone = this.make.graphics({ x: 0, y: 0, add: false });
        bone.fillStyle(0xFFFBF5);
        bone.fillRoundedRect(0, 0, 78, 78, 10);
        bone.fillStyle(0xE8D4A0);
        bone.fillRect(22, 32, 34, 14);
        bone.fillCircle(18, 27, 11); bone.fillCircle(18, 51, 11);
        bone.fillCircle(60, 27, 11); bone.fillCircle(60, 51, 11);
        bone.lineStyle(2, 0xBBA870);
        bone.strokeRect(22, 32, 34, 14);
        bone.generateTexture('card_bone', 78, 78);
        bone.destroy();

        // Ball card
        const ball = this.make.graphics({ x: 0, y: 0, add: false });
        ball.fillStyle(0xFFFBF5);
        ball.fillRoundedRect(0, 0, 78, 78, 10);
        ball.fillStyle(0xC8E820);
        ball.fillCircle(39, 39, 24);
        ball.lineStyle(3.5, 0xFFFFFF);
        ball.beginPath(); ball.arc(39, 39, 24, -0.7, 0.7); ball.strokePath();
        ball.beginPath(); ball.arc(39, 39, 24, Math.PI - 0.7, Math.PI + 0.7); ball.strokePath();
        ball.generateTexture('card_ball', 78, 78);
        ball.destroy();

        // Star card
        const star = this.make.graphics({ x: 0, y: 0, add: false });
        star.fillStyle(0xFFFBF5);
        star.fillRoundedRect(0, 0, 78, 78, 10);
        star.fillStyle(0xFFD700);
        this.drawStar(star, 39, 39, 5, 26, 11);
        star.lineStyle(2, 0xFFAA00);
        this.drawStarOutline(star, 39, 39, 5, 26, 11);
        star.generateTexture('card_star', 78, 78);
        star.destroy();

        // Heart card
        const heart = this.make.graphics({ x: 0, y: 0, add: false });
        heart.fillStyle(0xFFFBF5);
        heart.fillRoundedRect(0, 0, 78, 78, 10);
        heart.fillStyle(0xFF3377);
        heart.fillCircle(27, 32, 15);
        heart.fillCircle(51, 32, 15);
        heart.fillTriangle(12, 38, 66, 38, 39, 64);
        heart.generateTexture('card_heart', 78, 78);
        heart.destroy();

        // Paw card
        const paw = this.make.graphics({ x: 0, y: 0, add: false });
        paw.fillStyle(0xFFFBF5);
        paw.fillRoundedRect(0, 0, 78, 78, 10);
        paw.fillStyle(0xCC6644);
        paw.fillCircle(39, 48, 17);
        paw.fillCircle(22, 29, 10); paw.fillCircle(39, 24, 10); paw.fillCircle(56, 29, 10);
        paw.generateTexture('card_paw', 78, 78);
        paw.destroy();
    }

    drawStar(g, cx, cy, points, outerR, innerR) {
        const pts = [];
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
        }
        g.fillPoints(pts, true);
    }

    drawStarOutline(g, cx, cy, points, outerR, innerR) {
        const pts = [];
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
        }
        g.strokePoints(pts, true);
    }
}
