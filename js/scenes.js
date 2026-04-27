// All game scenes

// ─── TITLE ───────────────────────────────────────────────────────────────────
const TitleScene = {
  blink: 0,
  init() { fade.fadeIn(); },
  update(dt) { this.blink += dt; },
  draw() {
    ctx.fillStyle = '#1a0a2e';
    ctx.fillRect(0, 0, W, H);
    // stars
    ctx.fillStyle = '#fff';
    [[80,60],[200,40],[400,30],[600,55],[720,45],[150,120],[500,100],[700,130]].forEach(([sx,sy])=>{
      ctx.beginPath(); ctx.arc(sx,sy,2,0,Math.PI*2); ctx.fill();
    });
    ctx.fillStyle = '#FF69B4';
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Daisee's Game", W/2, 140);
    ctx.fillStyle = '#cc99ff';
    ctx.font = '24px Arial';
    ctx.fillText('Woofie Finds His Way Home', W/2, 185);
    drawWoofie(ctx, W/2, 330, 2.5);
    if (Math.floor(this.blink/600)%2===0) {
      ctx.fillStyle = '#ffe066';
      ctx.font = 'bold 22px Arial';
      ctx.fillText('Tap anywhere to start!', W/2, 500);
    }
  },
  onTap() {
    fade.fadeOut(() => setScene(BedroomScene));
  }
};

// ─── MATCHING MINI-GAME ───────────────────────────────────────────────────────
function makeMatchGame(pairs, onWin) {
  const symbols = [];
  for (let i = 0; i < pairs; i++) symbols.push(i, i);
  // shuffle
  for (let i = symbols.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [symbols[i],symbols[j]]=[symbols[j],symbols[i]];
  }
  // card icon drawing functions (no emoji - unreliable on mobile canvas)
  const iconColors = ['#FF69B4','#66aaff','#ffe066','#ff6655','#88dd44','#cc66ff'];
  function drawIcon(v, cx, cy) {
    ctx.save();
    ctx.fillStyle = iconColors[v];
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    if (v === 0) { // bone shape
      ctx.beginPath(); ctx.arc(cx-14,cy,7,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+14,cy,7,0,Math.PI*2); ctx.fill();
      ctx.fillRect(cx-14,cy-4,28,8);
      ctx.beginPath(); ctx.arc(cx-14,cy-8,5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+14,cy-8,5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx-14,cy+8,5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+14,cy+8,5,0,Math.PI*2); ctx.fill();
    } else if (v === 1) { // ball / circle with lines
      ctx.beginPath(); ctx.arc(cx,cy,18,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#fff4'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx,cy,18,0.5,2.5); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx,cy,18,Math.PI+0.5,Math.PI+2.5); ctx.stroke();
    } else if (v === 2) { // star
      ctx.beginPath();
      for (let i=0;i<5;i++) {
        const a = i*Math.PI*2/5 - Math.PI/2;
        const b = a + Math.PI/5;
        i===0 ? ctx.moveTo(cx+Math.cos(a)*20,cy+Math.sin(a)*20) : ctx.lineTo(cx+Math.cos(a)*20,cy+Math.sin(a)*20);
        ctx.lineTo(cx+Math.cos(b)*9,cy+Math.sin(b)*9);
      }
      ctx.closePath(); ctx.fill();
    } else if (v === 3) { // heart
      ctx.beginPath();
      ctx.moveTo(cx,cy+14);
      ctx.bezierCurveTo(cx-22,cy,cx-22,cy-16,cx,cy-8);
      ctx.bezierCurveTo(cx+22,cy-16,cx+22,cy,cx,cy+14);
      ctx.fill();
    } else if (v === 4) { // paw - circle + dots
      ctx.beginPath(); ctx.arc(cx,cy+6,12,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx-12,cy-6,6,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy-12,6,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx+12,cy-6,6,0,Math.PI*2); ctx.fill();
    } else { // diamond
      ctx.beginPath();
      ctx.moveTo(cx,cy-20); ctx.lineTo(cx+14,cy); ctx.lineTo(cx,cy+20); ctx.lineTo(cx-14,cy);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  const cols = pairs === 3 ? 3 : 4;
  const rows = 2;
  const cw = 90, ch = 90, gx = (W - cols*cw - (cols-1)*10)/2, gy = 160;
  const cards = symbols.map((v, i) => ({
    v, i,
    x: gx + (i%cols)*(cw+10),
    y: gy + Math.floor(i/cols)*(ch+10),
    flipped: false, matched: false
  }));
  let flipped = [], waiting = false, waitTimer = 0;
  return {
    active: true,
    update(dt) {
      if (waiting) {
        waitTimer -= dt;
        if (waitTimer <= 0) {
          flipped.forEach(c => c.flipped = false);
          flipped = []; waiting = false;
        }
      }
      if (cards.every(c => c.matched)) { this.active = false; onWin && onWin(); }
    },
    draw() {
      ctx.fillStyle = 'rgba(10,0,30,0.92)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#FF69B4';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Match the pairs!', W/2, 120);
      cards.forEach(c => {
        ctx.save();
        if (c.matched) {
          ctx.fillStyle = '#2a8a4a';
        } else if (c.flipped) {
          ctx.fillStyle = '#6a3aaa';
        } else {
          ctx.fillStyle = '#4a2a7a';
        }
        ctx.strokeStyle = '#cc66ff';
        ctx.lineWidth = 3;
        roundRect(ctx, c.x, c.y, cw, ch, 10);
        ctx.fill(); ctx.stroke();
        if (c.flipped || c.matched) {
          drawIcon(c.v, c.x+cw/2, c.y+ch/2);
        } else {
          ctx.fillStyle = '#cc66ff';
          ctx.font = 'bold 36px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', c.x+cw/2, c.y+ch/2);
        }
        ctx.restore();
      });
    },
    onTap(p) {
      if (waiting) return;
      const c = cards.find(c => !c.flipped && !c.matched && p.x>=c.x && p.x<=c.x+cw && p.y>=c.y && p.y<=c.y+ch);
      if (!c) return;
      c.flipped = true;
      flipped.push(c);
      if (flipped.length === 2) {
        if (flipped[0].v === flipped[1].v) {
          flipped.forEach(c => c.matched = true);
          flipped = [];
        } else {
          waiting = true; waitTimer = 900;
        }
      }
    }
  };
}

// ─── BEDROOM ─────────────────────────────────────────────────────────────────
const BedroomScene = {
  px: 200, py: 300, miniGame: null, introDone: false,
  init() {
    this.px=200; this.py=300; this.miniGame=null;
    fade.fadeIn();
    if (!this.introDone) {
      this.introDone = true;
      dlg.show([
        "Woofie woke up on the bed.",
        "Daisee is gone! I have to find her!",
        "Maybe someone in the house can help me.",
        "There's a puzzle board on the wall...",
      ]);
    }
  },
  walls: [
    {x:0,y:0,w:800,h:80},     // top wall
    {x:0,y:0,w:30,h:600},     // left wall
    {x:770,y:0,w:30,h:230},   // right wall top (above door)
    {x:770,y:400,w:30,h:200}, // right wall bottom (below door)
    {x:0,y:570,w:800,h:30},   // floor edge
    // bed
    {x:300,y:85,w:220,h:120},
    // dresser
    {x:30,y:150,w:70,h:100},
  ],
  update(dt) {
    if (this.miniGame) { this.miniGame.update(dt); if (!this.miniGame.active) this.miniGame=null; return; }
    if (dlg.active) return;
    let dx=0, dy=0, sp=3;
    if (keys['ArrowLeft']||keys['a']||keys['A']||dpad.left) dx=-sp;
    if (keys['ArrowRight']||keys['d']||keys['D']||dpad.right) dx=sp;
    if (keys['ArrowUp']||keys['w']||keys['W']||dpad.up) dy=-sp;
    if (keys['ArrowDown']||keys['s']||keys['S']||dpad.down) dy=sp;
    const nx=this.px+dx, ny=this.py+dy;
    const pr=18;
    if (!this.walls.some(w=>nx+pr>w.x&&nx-pr<w.x+w.w&&ny+pr>w.y&&ny-pr<w.y+w.h)) {
      this.px=nx; this.py=ny;
    } else {
      if (!this.walls.some(w=>nx+pr>w.x&&nx-pr<w.x+w.w&&this.py+pr>w.y&&this.py-pr<w.y+w.h)) this.px=nx;
      if (!this.walls.some(w=>this.px+pr>w.x&&this.px-pr<w.x+w.w&&ny+pr>w.y&&ny-pr<w.y+w.h)) this.py=ny;
    }
    // door exit
    if (STATE.bedroomPuzzleDone && this.px>750 && this.py>230 && this.py<400) {
      fade.fadeOut(() => setScene(HallwayScene));
    }
  },
  draw() {
    drawRoom('#7a4aaa', '#c8a878');
    // bed
    ctx.fillStyle = '#5a3a8a';
    ctx.fillRect(300, 85, 220, 120);
    ctx.fillStyle = '#fff';
    ctx.fillRect(310, 88, 200, 40);
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(310, 88, 200, 25);
    // dresser
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(30, 150, 70, 100);
    ctx.fillStyle = '#a07820';
    ctx.fillRect(40,165,20,18); ctx.fillRect(70,165,20,18);
    ctx.fillRect(40,195,20,18); ctx.fillRect(70,195,20,18);
    // window
    ctx.fillStyle = '#88ccff';
    ctx.fillRect(600, 95, 100, 80);
    ctx.strokeStyle = '#fff'; ctx.lineWidth=3;
    ctx.strokeRect(600,95,100,80);
    ctx.beginPath(); ctx.moveTo(650,95); ctx.lineTo(650,175); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(600,135); ctx.lineTo(700,135); ctx.stroke();
    // puzzle board
    drawPuzzleBoard(40, 280, STATE.bedroomPuzzleDone);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Tap!', 70, 355);
    // door
    drawDoor(770, 230, 30, 170, !STATE.bedroomPuzzleDone);
    // rug
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 4;
    ctx.strokeRect(250, 320, 300, 180);
    ctx.strokeStyle = '#cc66ff'; ctx.lineWidth=2;
    ctx.strokeRect(262, 332, 276, 156);
    drawWoofie(ctx, this.px, this.py, 1);
    drawDpad();
  },
  onTap(p) {
    if (this.miniGame) { this.miniGame.onTap(p); return; }
    if (dlg.active) { dlg.advance(); return; }
    // puzzle board tap
    if (p.x>30 && p.x<110 && p.y>270 && p.y<350 && !STATE.bedroomPuzzleDone) {
      this.miniGame = makeMatchGame(3, () => {
        STATE.bedroomPuzzleDone = true;
        dlg.show(["Great job! The door is now open!", "Go through the door on the right!"]);
      });
    }
  }
};

// ─── HALLWAY ─────────────────────────────────────────────────────────────────
const HallwayScene = {
  px: 120, py: 300, ivanX: 400, ivanDir: 1, ivanTimer: 0,
  init() {
    this.px=120; this.py=300;
    fade.fadeIn();
  },
  walls: [
    {x:0,y:0,w:800,h:80},
    {x:0,y:0,w:30,h:230},
    {x:0,y:400,w:30,h:200},
    {x:770,y:0,w:30,h:230},
    {x:770,y:400,w:30,h:200},
    {x:0,y:570,w:800,h:30},
  ],
  update(dt) {
    if (dlg.active) return;
    // ivan wander
    this.ivanTimer+=dt;
    if (this.ivanTimer>1200+Math.random()*800) { this.ivanDir*=-1; this.ivanTimer=0; }
    this.ivanX += this.ivanDir*1.2;
    if (this.ivanX<180) { this.ivanX=180; this.ivanDir=1; }
    if (this.ivanX>620) { this.ivanX=620; this.ivanDir=-1; }
    let dx=0, dy=0, sp=3;
    if (keys['ArrowLeft']||keys['a']||keys['A']||dpad.left) dx=-sp;
    if (keys['ArrowRight']||keys['d']||keys['D']||dpad.right) dx=sp;
    if (keys['ArrowUp']||keys['w']||keys['W']||dpad.up) dy=-sp;
    if (keys['ArrowDown']||keys['s']||keys['S']||dpad.down) dy=sp;
    const nx=this.px+dx, ny=this.py+dy, pr=18;
    if (!this.walls.some(w=>nx+pr>w.x&&nx-pr<w.x+w.w&&ny+pr>w.y&&ny-pr<w.y+w.h)) { this.px=nx; this.py=ny; }
    else {
      if (!this.walls.some(w=>nx+pr>w.x&&nx-pr<w.x+w.w&&this.py+pr>w.y&&this.py-pr<w.y+w.h)) this.px=nx;
      if (!this.walls.some(w=>this.px+pr>w.x&&this.px-pr<w.x+w.w&&ny+pr>w.y&&ny-pr<w.y+w.h)) this.py=ny;
    }
    // ivan meet
    if (!STATE.ivanMet && Math.hypot(this.px-this.ivanX, this.py-320) < 90) {
      STATE.ivanMet = true;
      dlg.show([
        "Ivan: Woof! Hi Woofie!",
        "Ivan: Daisee went to the living room!",
        "Ivan: She was playing with Rocket!",
        "Go through the door on the right!"
      ]);
    }
    // exits
    if (this.px < 30 && this.py>230 && this.py<400) fade.fadeOut(()=>setScene(BedroomScene));
    if (this.px > 760 && this.py>230 && this.py<400) fade.fadeOut(()=>setScene(LivingRoomScene));
  },
  draw() {
    drawRoom('#4a6aaa', '#b8a888');
    // wallpaper stripes
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    for (let i=0;i<W;i+=60) ctx.fillRect(i,0,30,80);
    // left door
    drawDoor(0, 230, 30, 170, false);
    // right door
    drawDoor(770, 230, 30, 170, false);
    // picture on wall
    ctx.fillStyle = '#fff'; ctx.fillRect(360,95,80,60);
    ctx.fillStyle = '#88aaff'; ctx.fillRect(365,100,70,50);
    ctx.strokeStyle='#8B6914'; ctx.lineWidth=3; ctx.strokeRect(360,95,80,60);
    // lamp
    ctx.fillStyle='#f0c040';
    ctx.beginPath(); ctx.moveTo(700,155); ctx.lineTo(680,195); ctx.lineTo(720,195); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#8B6914'; ctx.fillRect(697,195,6,50);
    ctx.fillStyle='#5a3a1a'; ctx.fillRect(685,240,30,8);
    drawIvan(ctx, this.ivanX, 310, 1.1);
    drawWoofie(ctx, this.px, this.py, 1);
    drawDpad();
  },
  onTap(p) {
    if (dlg.active) { dlg.advance(); return; }
    // tap near Ivan
    if (Math.hypot(p.x-this.ivanX, p.y-310) < 80 && !dlg.active) {
      dlg.show([
        "Ivan: Woof! Hi Woofie!",
        "Ivan: Daisee is in the living room!",
        "Ivan: Go through the door on the right!"
      ]);
    }
  }
};

// ─── LIVING ROOM ─────────────────────────────────────────────────────────────
const LivingRoomScene = {
  px: 120, py: 300, rocketX: 400, rocketDir: 1, rocketTimer: 0, miniGame: null,
  init() {
    this.px=120; this.py=300; this.miniGame=null;
    fade.fadeIn();
  },
  walls: [
    {x:0,y:0,w:800,h:80},
    {x:0,y:0,w:30,h:230},
    {x:0,y:400,w:30,h:200},
    {x:770,y:0,w:30,h:230},
    {x:770,y:400,w:30,h:200},
    {x:0,y:570,w:800,h:30},
    // couch
    {x:250,y:90,w:280,h:80},
  ],
  update(dt) {
    if (this.miniGame) { this.miniGame.update(dt); if (!this.miniGame.active) this.miniGame=null; return; }
    if (dlg.active) return;
    this.rocketTimer+=dt;
    if (this.rocketTimer>1000+Math.random()*1000) { this.rocketDir*=-1; this.rocketTimer=0; }
    this.rocketX+=this.rocketDir*1.3;
    if (this.rocketX<200) { this.rocketX=200; this.rocketDir=1; }
    if (this.rocketX<570) { this.rocketX+=0; }
    if (this.rocketX>570) { this.rocketX=570; this.rocketDir=-1; }
    let dx=0, dy=0, sp=3;
    if (keys['ArrowLeft']||keys['a']||keys['A']||dpad.left) dx=-sp;
    if (keys['ArrowRight']||keys['d']||keys['D']||dpad.right) dx=sp;
    if (keys['ArrowUp']||keys['w']||keys['W']||dpad.up) dy=-sp;
    if (keys['ArrowDown']||keys['s']||keys['S']||dpad.down) dy=sp;
    const nx=this.px+dx, ny=this.py+dy, pr=18;
    if (!this.walls.some(w=>nx+pr>w.x&&nx-pr<w.x+w.w&&ny+pr>w.y&&ny-pr<w.y+w.h)) { this.px=nx; this.py=ny; }
    else {
      if (!this.walls.some(w=>nx+pr>w.x&&nx-pr<w.x+w.w&&this.py+pr>w.y&&this.py-pr<w.y+w.h)) this.px=nx;
      if (!this.walls.some(w=>this.px+pr>w.x&&this.px-pr<w.x+w.w&&ny+pr>w.y&&ny-pr<w.y+w.h)) this.py=ny;
    }
    if (!STATE.rocketMet && Math.hypot(this.px-this.rocketX, this.py-320) < 90) {
      STATE.rocketMet = true;
      dlg.show([
        "Rocket: Hey Woofie! Looking for Daisee?",
        "Rocket: She's in the kitchen!",
        "Rocket: But the door is locked...",
        "Rocket: Solve the puzzle on the wall to open it!"
      ]);
    }
    if (this.px<30 && this.py>230 && this.py<400) fade.fadeOut(()=>setScene(HallwayScene));
    if (STATE.livingRoomPuzzleDone && this.px>760 && this.py>230 && this.py<400) fade.fadeOut(()=>setScene(KitchenScene));
  },
  draw() {
    drawRoom('#aa5a3a', '#c8b890');
    // couch
    ctx.fillStyle='#8B4513';
    ctx.fillRect(250,90,280,80);
    ctx.fillStyle='#a05020';
    ctx.fillRect(258,95,60,70); ctx.fillRect(326,95,60,70); ctx.fillRect(394,95,60,70);
    ctx.fillStyle='#c06030';
    ctx.fillRect(250,90,280,20);
    // tv
    ctx.fillStyle='#222'; ctx.fillRect(580,90,140,90);
    ctx.fillStyle='#1a1a3a'; ctx.fillRect(586,96,128,72);
    ctx.fillStyle='#333'; ctx.fillRect(640,180,20,20); ctx.fillRect(630,198,40,6);
    // puzzle board
    drawPuzzleBoard(40, 280, STATE.livingRoomPuzzleDone);
    ctx.fillStyle='#fff'; ctx.font='12px Arial'; ctx.textAlign='center';
    ctx.fillText('Tap!', 70, 355);
    // doors
    drawDoor(0, 230, 30, 170, false);
    drawDoor(770, 230, 30, 170, !STATE.livingRoomPuzzleDone);
    // plant
    ctx.fillStyle='#5a3a1a'; ctx.fillRect(698,380,14,60);
    ctx.fillStyle='#2a7a2a'; ctx.beginPath(); ctx.arc(705,370,28,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#3a9a3a'; ctx.beginPath(); ctx.arc(690,355,18,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(720,358,20,0,Math.PI*2); ctx.fill();
    drawRocket(ctx, this.rocketX, 320, 1.1);
    drawWoofie(ctx, this.px, this.py, 1);
    drawDpad();
  },
  onTap(p) {
    if (this.miniGame) { this.miniGame.onTap(p); return; }
    if (dlg.active) { dlg.advance(); return; }
    if (p.x>30 && p.x<110 && p.y>270 && p.y<350 && !STATE.livingRoomPuzzleDone) {
      this.miniGame = makeMatchGame(4, () => {
        STATE.livingRoomPuzzleDone = true;
        dlg.show(["Amazing! You solved the puzzle!", "The kitchen door is open!", "Go find Daisee!"]);
      });
    }
    if (Math.hypot(p.x-this.rocketX, p.y-320)<80 && !dlg.active) {
      dlg.show(["Rocket: Hi! Daisee is in the kitchen!", "Rocket: Solve the wall puzzle to open the door!"]);
    }
  }
};

// ─── KITCHEN ─────────────────────────────────────────────────────────────────
const KitchenScene = {
  px: 120, py: 300, daiseeX: 430, daiseeY: 350, met: false,
  init() { this.px=120; this.py=300; this.met=false; fade.fadeIn(); },
  walls: [
    {x:0,y:0,w:800,h:80},
    {x:0,y:0,w:30,h:230},
    {x:0,y:400,w:30,h:200},
    {x:770,y:0,w:30,h:600},
    {x:0,y:570,w:800,h:30},
    {x:100,y:85,w:200,h:70}, // counter
    {x:500,y:85,w:240,h:70}, // counter
  ],
  update(dt) {
    if (dlg.active) return;
    let dx=0, dy=0, sp=3;
    if (keys['ArrowLeft']||keys['a']||keys['A']||dpad.left) dx=-sp;
    if (keys['ArrowRight']||keys['d']||keys['D']||dpad.right) dx=sp;
    if (keys['ArrowUp']||keys['w']||keys['W']||dpad.up) dy=-sp;
    if (keys['ArrowDown']||keys['s']||keys['S']||dpad.down) dy=sp;
    const nx=this.px+dx, ny=this.py+dy, pr=18;
    if (!this.walls.some(w=>nx+pr>w.x&&nx-pr<w.x+w.w&&ny+pr>w.y&&ny-pr<w.y+w.h)) { this.px=nx; this.py=ny; }
    else {
      if (!this.walls.some(w=>nx+pr>w.x&&nx-pr<w.x+w.w&&this.py+pr>w.y&&this.py-pr<w.y+w.h)) this.px=nx;
      if (!this.walls.some(w=>this.px+pr>w.x&&this.px-pr<w.x+w.w&&ny+pr>w.y&&ny-pr<w.y+w.h)) this.py=ny;
    }
    if (!this.met && Math.hypot(this.px-this.daiseeX, this.py-this.daiseeY)<90) {
      this.met=true;
      dlg.show([
        "Daisee: WOOFIE! You found me!",
        "Daisee: I missed you so much!",
        "Daisee: You're the best dog ever!",
        "Woofie: *happy tail wags*",
        "You found Daisee! Hooray!"
      ], () => fade.fadeOut(()=>setScene(WinScene)));
    }
    if (this.px<30 && this.py>230 && this.py<400) fade.fadeOut(()=>setScene(LivingRoomScene));
  },
  draw() {
    drawRoom('#e8f0c0', '#f0e8c0');
    // counters
    ctx.fillStyle='#ddd';
    ctx.fillRect(100,85,200,70);
    ctx.fillRect(500,85,240,70);
    ctx.fillStyle='#bbb';
    ctx.fillRect(100,85,200,12);
    ctx.fillRect(500,85,240,12);
    // sink
    ctx.fillStyle='#aac';
    ctx.fillRect(140,97,80,40); ctx.strokeStyle='#888'; ctx.lineWidth=2; ctx.strokeRect(140,97,80,40);
    ctx.fillStyle='#aaa'; ctx.fillRect(173,88,14,14);
    // stove
    ctx.fillStyle='#555';
    ctx.fillRect(530,88,120,60);
    [[555,105],[585,105],[615,105],[570,130]].forEach(([bx,by])=>{
      ctx.strokeStyle='#f80'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(bx,by,12,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle='#fa0'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(bx,by,8,0,Math.PI*2); ctx.stroke();
    });
    // fridge
    ctx.fillStyle='#ddeeff';
    ctx.fillRect(690,85,80,180);
    ctx.strokeStyle='#aac'; ctx.lineWidth=2; ctx.strokeRect(690,85,80,180);
    ctx.beginPath(); ctx.moveTo(690,175); ctx.lineTo(770,175); ctx.stroke();
    ctx.fillStyle='#aac'; ctx.beginPath(); ctx.arc(764,130,4,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(764,215,4,0,Math.PI*2); ctx.fill();
    // table
    ctx.fillStyle='#c8a060';
    ctx.beginPath(); ctx.ellipse(350,430,120,60,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#a08040'; ctx.lineWidth=3; ctx.stroke();
    // door back
    drawDoor(0,230,30,170,false);
    drawDaisee(ctx, this.daiseeX, this.daiseeY, 1.2);
    drawWoofie(ctx, this.px, this.py, 1);
    drawDpad();
  },
  onTap(p) {
    if (dlg.active) { dlg.advance(); return; }
    if (Math.hypot(p.x-this.daiseeX, p.y-this.daiseeY)<90) {
      if (!this.met) {
        this.met=true;
        dlg.show([
          "Daisee: WOOFIE! You found me!",
          "Daisee: I missed you so much!",
          "Daisee: You're the best dog ever!",
          "Woofie: *happy tail wags*",
          "You found Daisee! Hooray!"
        ], ()=>fade.fadeOut(()=>setScene(WinScene)));
      }
    }
  }
};

// ─── WIN ─────────────────────────────────────────────────────────────────────
const WinScene = {
  particles: [], timer: 0,
  init() {
    fade.fadeIn();
    this.particles = [];
    this.timer = 0;
    for (let i=0;i<80;i++) {
      this.particles.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-0.5)*3, vy: -2-Math.random()*4,
        color: ['#FF69B4','#ffe066','#cc66ff','#66ccff','#ff8866'][Math.floor(Math.random()*5)],
        r: 4+Math.random()*6, life: 1
      });
    }
  },
  update(dt) {
    this.timer+=dt;
    this.particles.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.08;
      if (p.y>H) { p.y=0; p.x=Math.random()*W; p.vy=-2-Math.random()*4; }
    });
  },
  draw() {
    ctx.fillStyle='#1a0a2e';
    ctx.fillRect(0,0,W,H);
    this.particles.forEach(p=>{
      ctx.fillStyle=p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    ctx.fillStyle='#ffe066';
    ctx.font='bold 72px Arial';
    ctx.textAlign='center';
    ctx.fillText('You Win!', W/2, 130);
    ctx.fillStyle='#fff';
    ctx.font='28px Arial';
    ctx.fillText('Woofie found Daisee!', W/2, 185);
    ctx.font='20px Arial';
    ctx.fillStyle='#FF69B4';
    ctx.fillText('Together again!', W/2, 220);
    // draw all 4 characters
    drawWoofie(ctx, 140, 380, 1.6);
    drawIvan(ctx, 300, 380, 1.5);
    drawRocket(ctx, 460, 380, 1.5);
    drawDaisee(ctx, 630, 360, 1.8);
    // labels
    ctx.fillStyle='#fff'; ctx.font='16px Arial'; ctx.textAlign='center';
    ctx.fillText('Woofie', 140, 430);
    ctx.fillText('Ivan', 300, 430);
    ctx.fillText('Rocket', 460, 430);
    ctx.fillText('Daisee', 630, 430);
    // play again button
    ctx.fillStyle='#FF69B4';
    roundRect(ctx, W/2-110, 470, 220, 60, 14);
    ctx.fill();
    ctx.fillStyle='#fff';
    ctx.font='bold 24px Arial';
    ctx.fillText('Play Again!', W/2, 506);
  },
  onTap(p) {
    if (p.x>W/2-110 && p.x<W/2+110 && p.y>470 && p.y<530) {
      STATE.bedroomPuzzleDone=false;
      STATE.ivanMet=false;
      STATE.rocketMet=false;
      STATE.livingRoomPuzzleDone=false;
      BedroomScene.introDone=false;
      fade.fadeOut(()=>setScene(TitleScene));
    }
  }
};

// Start game
setScene(TitleScene);
