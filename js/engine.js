// Canvas setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = 800, H = 600;

function resize() {
  const scaleX = window.innerWidth / W;
  const scaleY = window.innerHeight / H;
  const scale = Math.min(scaleX, scaleY);
  canvas.width = W;
  canvas.height = H;
  canvas.style.width = (W * scale) + 'px';
  canvas.style.height = (H * scale) + 'px';
  canvas.style.left = ((window.innerWidth - W * scale) / 2) + 'px';
  canvas.style.top = ((window.innerHeight - H * scale) / 2) + 'px';
}
window.addEventListener('resize', resize);
resize();

// Input
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

const dpad = { up: false, down: false, left: false, right: false };

function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = W / rect.width;
  const scaleY = H / rect.height;
  const touch = e.touches ? e.touches[0] : e;
  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY
  };
}

const DPAD_BUTTONS = [
  { dir: 'up',    x: 90,  y: 490 },
  { dir: 'down',  x: 90,  y: 570 },
  { dir: 'left',  x: 40,  y: 530 },
  { dir: 'right', x: 140, y: 530 },
];
const DPAD_R = 30;

function dpadHit(px, py) {
  for (const b of DPAD_BUTTONS) {
    const dx = px - b.x, dy = py - b.y;
    if (dx*dx + dy*dy < DPAD_R*DPAD_R) return b.dir;
  }
  return null;
}

function updateDpad(e, active) {
  // reset all on new touch start
  if (active) { dpad.up=false; dpad.down=false; dpad.left=false; dpad.right=false; }
  const touches = e.touches || [e];
  for (const t of touches) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const px = (t.clientX - rect.left) * scaleX;
    const py = (t.clientY - rect.top) * scaleY;
    const dir = dpadHit(px, py);
    if (dir) dpad[dir] = active;
  }
}

canvas.addEventListener('touchstart', e => { e.preventDefault(); updateDpad(e, true); currentScene && currentScene.onTap && currentScene.onTap(getCanvasPos(e)); }, { passive: false });
canvas.addEventListener('touchend', e => { e.preventDefault(); dpad.up=false; dpad.down=false; dpad.left=false; dpad.right=false; updateDpad(e, false); }, { passive: false });
canvas.addEventListener('touchmove', e => { e.preventDefault(); dpad.up=false; dpad.down=false; dpad.left=false; dpad.right=false; updateDpad(e, true); }, { passive: false });
canvas.addEventListener('click', e => { currentScene && currentScene.onTap && currentScene.onTap(getCanvasPos(e)); });

function drawDpad() {
  for (const b of DPAD_BUTTONS) {
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#cc66ff';
    ctx.beginPath();
    ctx.arc(b.x, b.y, DPAD_R, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const arrows = { up:'▲', down:'▼', left:'◀', right:'▶' };
    ctx.fillText(arrows[b.dir], b.x, b.y);
    ctx.restore();
  }
}

// Scene manager
let currentScene = null;
function setScene(scene) {
  currentScene = scene;
  scene.init && scene.init();
}

// Dialogue system
const dlg = {
  active: false, lines: [], idx: 0, text: '', charIdx: 0, timer: 0,
  onDone: null,
  show(lines, onDone) {
    this.active = true; this.lines = lines; this.idx = 0;
    this.text = ''; this.charIdx = 0; this.timer = 0;
    this.onDone = onDone || null;
  },
  advance() {
    if (!this.active) return false;
    if (this.charIdx < this.lines[this.idx].length) {
      this.charIdx = this.lines[this.idx].length;
      this.text = this.lines[this.idx];
    } else {
      this.idx++;
      if (this.idx >= this.lines.length) {
        this.active = false;
        this.onDone && this.onDone();
      } else {
        this.text = ''; this.charIdx = 0; this.timer = 0;
      }
    }
    return true;
  },
  update(dt) {
    if (!this.active) return;
    this.timer += dt;
    if (this.timer > 40 && this.charIdx < this.lines[this.idx].length) {
      this.timer = 0;
      this.charIdx++;
      this.text = this.lines[this.idx].slice(0, this.charIdx);
    }
  },
  draw() {
    if (!this.active) return;
    ctx.save();
    ctx.fillStyle = 'rgba(20,0,40,0.88)';
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 3;
    roundRect(ctx, 30, 490, 740, 95, 14);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    // word wrap
    const words = this.text.split(' ');
    let line = '', lines = [], maxW = 700;
    for (const w of words) {
      const test = line + (line ? ' ' : '') + w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
      else line = test;
    }
    lines.push(line);
    lines.slice(0,3).forEach((l, i) => ctx.fillText(l, 50, 504 + i*26));
    ctx.fillStyle = '#FF69B4';
    ctx.font = '13px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Tap to continue', 760, 570);
    ctx.restore();
  }
};

// Fade
const fade = { alpha: 0, dir: 0, speed: 0.04, cb: null,
  fadeIn(cb) { this.alpha=1; this.dir=-1; this.cb=cb||null; },
  fadeOut(cb) { this.alpha=0; this.dir=1; this.cb=cb||null; },
  update() {
    if (!this.dir) return;
    this.alpha += this.dir * this.speed;
    if (this.alpha <= 0) { this.alpha=0; this.dir=0; this.cb&&this.cb(); this.cb=null; }
    if (this.alpha >= 1) { this.alpha=1; this.dir=0; this.cb&&this.cb(); this.cb=null; }
  },
  draw() {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,W,H);
    ctx.restore();
  }
};

// Utility
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y); ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Game state
const STATE = {
  bedroomPuzzleDone: false,
  ivanMet: false,
  rocketMet: false,
  livingRoomPuzzleDone: false,
};

// Main loop
let last = 0;
function loop(ts) {
  const dt = ts - last; last = ts;
  ctx.clearRect(0, 0, W, H);
  if (currentScene) {
    currentScene.update && currentScene.update(dt);
    currentScene.draw && currentScene.draw();
  }
  dlg.update(dt);
  dlg.draw();
  fade.update();
  fade.draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
