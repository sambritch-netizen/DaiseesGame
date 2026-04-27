// On-screen D-pad for touch/mobile controls
function setupMobileControls(scene) {
    scene.dpad = { up: false, down: false, left: false, right: false };

    const cx = 90, cy = 505, gap = 54, r = 38;

    // Background ring
    scene.add.circle(cx, cy, r * 2.5, 0x000000, 0.18).setDepth(200);

    const dirs = [
        [cx, cy - gap, '▲', 'up'],
        [cx, cy + gap, '▼', 'down'],
        [cx - gap, cy, '◀', 'left'],
        [cx + gap, cy, '▶', 'right']
    ];

    dirs.forEach(([x, y, icon, dir]) => {
        const btn = scene.add.circle(x, y, r, 0xffffff, 0.22)
            .setStrokeStyle(2, 0xffffff, 0.45)
            .setDepth(200)
            .setInteractive();
        scene.add.text(x, y, icon, {
            fontSize: '24px', color: '#ffffffDD'
        }).setOrigin(0.5).setDepth(201);

        btn.on('pointerdown', () => { scene.dpad[dir] = true; });
        btn.on('pointerup', () => { scene.dpad[dir] = false; });
        btn.on('pointerout', () => { scene.dpad[dir] = false; });
    });

    // Centre dot
    scene.add.circle(cx, cy, 14, 0xffffff, 0.15).setDepth(200);
}
