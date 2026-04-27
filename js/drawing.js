// All character and room drawing functions

function drawWoofie(ctx, x, y, scale) {
  scale = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // tail
  ctx.strokeStyle = '#c8c0b8'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(22, -5); ctx.quadraticCurveTo(40, -20, 30, -35); ctx.stroke();
  // body
  ctx.fillStyle = '#ddd8d0';
  ctx.beginPath(); ctx.ellipse(0, 0, 22, 17, 0, 0, Math.PI*2); ctx.fill();
  // fluffy chest
  ctx.fillStyle = '#f0ece8';
  ctx.beginPath(); ctx.ellipse(-8, 2, 14, 12, -0.3, 0, Math.PI*2); ctx.fill();
  // head
  ctx.fillStyle = '#ddd8d0';
  ctx.beginPath(); ctx.arc(-20, -10, 14, 0, Math.PI*2); ctx.fill();
  // ear left
  ctx.fillStyle = '#c8c0b8';
  ctx.beginPath(); ctx.ellipse(-28, -6, 7, 11, -0.5, 0, Math.PI*2); ctx.fill();
  // ear right
  ctx.beginPath(); ctx.ellipse(-14, -4, 6, 10, 0.4, 0, Math.PI*2); ctx.fill();
  // snout
  ctx.fillStyle = '#e8e0d8';
  ctx.beginPath(); ctx.ellipse(-24, -6, 7, 5, 0, 0, Math.PI*2); ctx.fill();
  // nose
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.ellipse(-25, -8, 3, 2, 0, 0, Math.PI*2); ctx.fill();
  // eye
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(-17, -13, 2.5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-16.5, -13.5, 1, 0, Math.PI*2); ctx.fill();
  // legs
  ctx.fillStyle = '#c8c0b8';
  [[-12, 14], [-4, 15], [6, 14], [14, 13]].forEach(([lx, ly]) => {
    ctx.beginPath(); ctx.ellipse(lx, ly, 4, 7, 0, 0, Math.PI*2); ctx.fill();
  });
  ctx.restore();
}

function drawIvan(ctx, x, y, scale) {
  scale = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // body
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.ellipse(0, 0, 22, 16, 0, 0, Math.PI*2); ctx.fill();
  // tan saddle
  ctx.fillStyle = '#8B6914';
  ctx.beginPath(); ctx.ellipse(4, -2, 14, 10, 0, 0, Math.PI*2); ctx.fill();
  // head
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(-20, -10, 13, 0, Math.PI*2); ctx.fill();
  // pointed ears
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.moveTo(-26,-20); ctx.lineTo(-22,-36); ctx.lineTo(-16,-22); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-17,-18); ctx.lineTo(-12,-33); ctx.lineTo(-7,-20); ctx.closePath(); ctx.fill();
  // tan inner ear
  ctx.fillStyle = '#8B6914';
  ctx.beginPath(); ctx.moveTo(-24,-22); ctx.lineTo(-21,-31); ctx.lineTo(-17,-23); ctx.closePath(); ctx.fill();
  // snout tan
  ctx.fillStyle = '#8B6914';
  ctx.beginPath(); ctx.ellipse(-24, -7, 7, 5, 0, 0, Math.PI*2); ctx.fill();
  // nose
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.ellipse(-25, -9, 3, 2, 0, 0, Math.PI*2); ctx.fill();
  // eye
  ctx.fillStyle = '#8B6914';
  ctx.beginPath(); ctx.arc(-16, -13, 3, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(-16, -13, 2, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-15.5, -13.5, 0.8, 0, Math.PI*2); ctx.fill();
  // collar
  ctx.strokeStyle = '#c00'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(-20, -10, 13, 0.6, 2); ctx.stroke();
  // legs
  ctx.fillStyle = '#8B6914';
  [[-10,14],[-2,15],[6,14],[14,13]].forEach(([lx,ly])=>{
    ctx.beginPath(); ctx.ellipse(lx,ly,4,7,0,0,Math.PI*2); ctx.fill();
  });
  ctx.restore();
}

function drawRocket(ctx, x, y, scale) {
  scale = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // body
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(0, 0, 20, 15, 0, 0, Math.PI*2); ctx.fill();
  // tan belly
  ctx.fillStyle = '#a07840';
  ctx.beginPath(); ctx.ellipse(2, 3, 12, 9, 0, 0, Math.PI*2); ctx.fill();
  // head
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(-18, -9, 12, 0, Math.PI*2); ctx.fill();
  // floppy ears
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath(); ctx.ellipse(-26, -5, 7, 13, -0.3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-10, -5, 6, 12, 0.3, 0, Math.PI*2); ctx.fill();
  // tan snout
  ctx.fillStyle = '#a07840';
  ctx.beginPath(); ctx.ellipse(-21, -6, 7, 5, 0, 0, Math.PI*2); ctx.fill();
  // nose
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.ellipse(-22, -8, 3, 2, 0, 0, Math.PI*2); ctx.fill();
  // eye
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(-14, -12, 2.5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-13.5, -12.5, 0.9, 0, Math.PI*2); ctx.fill();
  // legs
  ctx.fillStyle = '#a07840';
  [[-10,13],[-2,14],[6,13],[13,12]].forEach(([lx,ly])=>{
    ctx.beginPath(); ctx.ellipse(lx,ly,4,6,0,0,Math.PI*2); ctx.fill();
  });
  ctx.restore();
}

function drawDaisee(ctx, x, y, scale) {
  scale = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // jeans legs
  ctx.fillStyle = '#4a6fa5';
  ctx.fillRect(-12, 22, 10, 22);
  ctx.fillRect(2, 22, 10, 22);
  // shoes
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-7, 44, 7, 4, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(7, 44, 7, 4, 0, 0, Math.PI*2); ctx.fill();
  // pink shirt body
  ctx.fillStyle = '#FF69B4';
  roundRect(ctx, -15, 5, 30, 22, 4); ctx.fill();
  // arms
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(-24, 7, 10, 16);
  ctx.fillRect(14, 7, 10, 16);
  // hands
  ctx.fillStyle = '#f5c5a0';
  ctx.beginPath(); ctx.arc(-19, 23, 5, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(19, 23, 5, 0, Math.PI*2); ctx.fill();
  // head
  ctx.fillStyle = '#f5c5a0';
  ctx.beginPath(); ctx.arc(0, -8, 16, 0, Math.PI*2); ctx.fill();
  // hair base
  ctx.fillStyle = '#5c3a1a';
  ctx.beginPath(); ctx.arc(0, -12, 16, Math.PI, Math.PI*2); ctx.fill();
  ctx.fillRect(-16, -16, 32, 10);
  // pigtails
  ctx.beginPath(); ctx.ellipse(-20, -10, 6, 14, -0.4, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(20, -10, 6, 14, 0.4, 0, Math.PI*2); ctx.fill();
  // pigtail ties
  ctx.fillStyle = '#FF69B4';
  ctx.beginPath(); ctx.arc(-20, -4, 4, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(20, -4, 4, 0, Math.PI*2); ctx.fill();
  // eyes
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(-6, -9, 3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -9, 3, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-5.5, -9.5, 1, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(6.5, -9.5, 1, 0, Math.PI*2); ctx.fill();
  // smile
  ctx.strokeStyle = '#c0704a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, -5, 6, 0.2, Math.PI-0.2); ctx.stroke();
  ctx.restore();
}

// Room drawing helpers
function drawRoom(wallColor, floorColor) {
  // floor
  ctx.fillStyle = floorColor;
  ctx.fillRect(0, 80, W, H-80);
  // wall
  ctx.fillStyle = wallColor;
  ctx.fillRect(0, 0, W, 80);
  // baseboard
  ctx.fillStyle = '#fff8';
  ctx.fillRect(0, 75, W, 8);
  // wall/floor line
  ctx.strokeStyle = '#0003';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 80); ctx.lineTo(W, 80); ctx.stroke();
}

function drawDoor(x, y, w, h, locked) {
  ctx.fillStyle = locked ? '#888' : '#c8843c';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
  // panel
  ctx.strokeStyle = '#a06020';
  ctx.lineWidth = 2;
  ctx.strokeRect(x+6, y+6, w-12, (h-18)/2);
  ctx.strokeRect(x+6, y+12+(h-18)/2, w-12, (h-18)/2);
  // knob
  ctx.fillStyle = locked ? '#555' : '#f0c040';
  ctx.beginPath();
  ctx.arc(x + (w > 0 ? w-12 : 12), y + h/2, 5, 0, Math.PI*2);
  ctx.fill();
  if (locked) {
    // draw a simple padlock shape
    const lx = x + w/2, ly = y + h/2 - 22;
    ctx.fillStyle = '#c00';
    ctx.fillRect(lx-7, ly, 14, 11);
    ctx.strokeStyle = '#c00'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(lx, ly, 7, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(lx, ly+5, 2.5, 0, Math.PI*2); ctx.fill();
  }
}

function drawPuzzleBoard(x, y, solved) {
  ctx.fillStyle = solved ? '#4a9' : '#c84';
  ctx.strokeStyle = '#643';
  ctx.lineWidth = 3;
  roundRect(ctx, x, y, 60, 60, 6);
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (solved) {
    ctx.beginPath(); ctx.moveTo(x+14, y+30); ctx.lineTo(x+26, y+44); ctx.lineTo(x+48, y+16); ctx.stroke();
  } else {
    ctx.fillStyle = '#fff'; ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('?', x+30, y+30);
  }
}
