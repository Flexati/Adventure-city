import { LEVELS, type Theme } from "./levels";

export const T = 16, VW = 480, VH = 272;
const GRAV = 980, RUN = 120, ACC = 1100, DEC = 1400, JUMP = 340, COYOTE = 0.1, BUFFER = 0.12;

export type Hero = "nox" | "lulu";
export interface Input { left: boolean; right: boolean; jump: boolean; action: boolean; time: boolean; switchHero: boolean }
export interface GameEvents { onWin(level: number, shards: number, total: number): void; onGameOver(): void }

interface Ent { x: number; y: number; w: number; h: number; vx: number; vy: number; hp: number; type: string; t: number; dir: number; dead?: boolean; ox?: number; oy?: number }
interface Part { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; s: number }

const PAL: Record<Theme, { sky: [string, string]; far: string; mid: string; tile: string; top: string; plat: string }> = {
  desert: { sky: ["#2a1240", "#f08a4b"], far: "#7a3b52", mid: "#4a2340", tile: "#c9894a", top: "#f2c46d", plat: "#8a5a2b" },
  neon: { sky: ["#05061a", "#2b1060"], far: "#1a1f4a", mid: "#0f1233", tile: "#1e2a4f", top: "#26f0ff", plat: "#ff3ea5" },
  clock: { sky: ["#0b0b14", "#3a2a12"], far: "#2a2216", mid: "#1a150d", tile: "#5a4a32", top: "#f5c542", plat: "#b08a3a" },
};

export class Game {
  ctx: CanvasRenderingContext2D;
  level = 0; grid: string[] = []; W = 0; H = 0; theme: Theme = "desert";
  p = { x: 0, y: 0, vx: 0, vy: 0, w: 10, h: 14, face: 1, ground: false, coyote: 0, buffer: 0, inv: 0, hp: 5, jumps: 0, dash: 0, dashCd: 0, shootCd: 0, anim: 0, squash: 1 };
  hero: Hero = "nox"; chronos = 100; slow = false;
  ents: Ent[] = []; bolts: Ent[] = []; parts: Part[] = []; shards = new Set<string>(); totalShards = 0;
  cp = { x: 0, y: 0 }; exit: { x: number; y: number; open: boolean } | null = null; boss: Ent | null = null;
  cam = { x: 0, y: 0 }; shake = 0; hitstop = 0; time = 0; prev: Partial<Input> = {}; done = false; paused = false;
  banner = 0;

  constructor(private canvas: HTMLCanvasElement, public input: Input, private ev: GameEvents) {
    this.ctx = canvas.getContext("2d")!;
  }

  load(i: number) {
    this.level = i; const def = LEVELS[i]!; this.theme = def.theme;
    const w = Math.max(...def.map.map((r) => r.length));
    this.grid = def.map.map((r) => r.padEnd(w, " ")); this.W = w; this.H = this.grid.length;
    this.ents = []; this.bolts = []; this.parts = []; this.shards.clear(); this.totalShards = 0; this.boss = null; this.exit = null;
    this.grid = this.grid.map((row, y) => row.split("").map((c, x) => {
      const px = x * T, py = y * T;
      if (c === "P") { this.cp = { x: px + 3, y: py + 2 }; return " "; }
      if (c === "o") { this.totalShards++; return c; }
      if (c === "E") this.ents.push({ x: px, y: py + 4, w: 14, h: 12, vx: -30, vy: 0, hp: 2, type: "walker", t: 0, dir: -1 });
      if (c === "F") this.ents.push({ x: px, y: py, w: 14, h: 12, vx: 0, vy: 0, hp: 1, type: "flier", t: Math.random() * 6, dir: 1, ox: px, oy: py });
      if (c === "X") { this.exit = { x: px, y: py - 8, open: true }; return " "; }
      if (c === "B") { this.boss = { x: px - 8, y: py - 16, w: 32, h: 32, vx: 0, vy: 0, hp: 40, type: "boss", t: 0, dir: -1 }; return " "; }
      return c === "C" ? c : c === "E" || c === "F" ? " " : c;
    }).join(""));
    this.respawn(true); this.done = false; this.banner = 2.5; this.chronos = 100;
  }

  respawn(full = false) {
    Object.assign(this.p, { x: this.cp.x, y: this.cp.y, vx: 0, vy: 0, inv: 1.2, dash: 0 });
    if (full) this.p.hp = 5;
    this.cam.x = Math.max(0, this.p.x - VW / 2);
  }

  tile(x: number, y: number) { const tx = Math.floor(x / T), ty = Math.floor(y / T); if (tx < 0 || tx >= this.W) return "#"; if (ty < 0) return " "; return this.grid[ty]?.[tx] ?? " "; }
  solid(x: number, y: number) { return this.tile(x, y) === "#"; }
  setTile(tx: number, ty: number, c: string) { const r = this.grid[ty] ?? ""; this.grid[ty] = r.slice(0, tx) + c + r.slice(tx + 1); }

  burst(x: number, y: number, c: string, n = 10, sp = 120) {
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = Math.random() * sp; this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, life: 0.5, max: 0.5, c, s: 1 + Math.random() * 2 }); }
  }

  hurt() {
    const p = this.p; if (p.inv > 0 || p.dash > 0) return;
    p.hp--; p.inv = 1.2; p.vy = -220; p.vx = -p.face * 140; this.shake = 6; this.hitstop = 0.08;
    this.burst(p.x + 5, p.y + 7, "#ff4d6d", 14);
    if (p.hp <= 0) { this.ev.onGameOver(); this.done = true; }
  }

  pressed(k: keyof Input) { return this.input[k] && !this.prev[k]; }

  update(rdt: number) {
    if (this.done || this.paused) return;
    if (this.hitstop > 0) { this.hitstop -= rdt; return; }
    this.time += rdt; this.banner -= rdt;
    const p = this.p, inp = this.input;
    // Chronos: slow the world, not the heroes
    this.slow = inp.time && this.chronos > 0;
    this.chronos = Math.max(0, Math.min(100, this.chronos + (this.slow ? -35 : 15) * rdt));
    const wdt = this.slow ? rdt * 0.3 : rdt, dt = rdt;

    if (this.pressed("switchHero")) { this.hero = this.hero === "nox" ? "lulu" : "nox"; this.burst(p.x + 5, p.y + 7, this.hero === "nox" ? "#7cf3ff" : "#ff9be0", 16); }

    // horizontal with accel / decel
    const dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
    if (p.dash > 0) { p.dash -= dt; p.vx = p.face * 320; p.vy = 0; if (Math.random() < 0.8) this.parts.push({ x: p.x + 5, y: p.y + 7, vx: 0, vy: 0, life: 0.25, max: 0.25, c: "#ff9be0", s: 4 }); }
    else {
      if (dir) { p.vx += dir * ACC * dt; p.face = dir; } else { const d = DEC * dt; p.vx = Math.abs(p.vx) <= d ? 0 : p.vx - Math.sign(p.vx) * d; }
      p.vx = Math.max(-RUN, Math.min(RUN, p.vx));
      p.vy += GRAV * dt * (p.vy > 0 ? 1.4 : 1); if (p.vy > 420) p.vy = 420;
    }
    // jump: coyote time + buffer + variable height + Lulú double jump
    p.coyote = p.ground ? COYOTE : p.coyote - dt;
    p.buffer = this.pressed("jump") ? BUFFER : p.buffer - dt;
    if (p.ground) p.jumps = this.hero === "lulu" ? 1 : 0;
    if (p.buffer > 0 && (p.coyote > 0 || p.jumps > 0)) {
      if (p.coyote <= 0) { p.jumps--; this.burst(p.x + 5, p.y + 14, "#ff9be0", 8, 60); }
      p.vy = -JUMP; p.coyote = 0; p.buffer = 0; p.squash = 0.7;
    }
    if (!inp.jump && p.vy < -120) p.vy = -120;

    // actions
    p.shootCd -= dt; p.dashCd -= dt;
    if (this.pressed("action")) {
      if (this.hero === "nox" && p.shootCd <= 0) {
        p.shootCd = 0.22; const mx = p.face > 0 ? p.x + p.w + 2 : p.x - 8;
        this.bolts.push({ x: mx, y: p.y + 5, w: 8, h: 4, vx: p.face * 360, vy: 0, hp: 1, type: "bolt", t: 0.7, dir: p.face });
        this.burst(mx + 4, p.y + 7, "#7cf3ff", 4, 50);
      } else if (this.hero === "lulu" && p.dashCd <= 0) { p.dash = 0.18; p.dashCd = 0.5; this.shake = 2; }
    }

    this.moveP(dt);
    p.squash += (1 - p.squash) * Math.min(1, dt * 12);
    p.inv -= dt; p.anim += dt * (Math.abs(p.vx) > 10 ? 12 : 3);

    // tiles under player
    const cx = p.x + p.w / 2, cy = p.y + p.h / 2, tc = this.tile(cx, cy), tx = Math.floor(cx / T), ty = Math.floor(cy / T);
    if (tc === "o") { this.setTile(tx, ty, " "); this.shards.add(`${tx},${ty}`); this.burst(cx, cy, "#f5c542", 12); this.chronos = Math.min(100, this.chronos + 20); }
    if (tc === "C" && (this.cp.x !== tx * T + 3)) { this.cp = { x: tx * T + 3, y: ty * T }; this.burst(cx, cy, "#7cf3ff", 20); }
    if (this.tile(cx, p.y + p.h - 2) === "^") this.hurt();
    if (p.y > this.H * T + 20) { p.hp--; this.shake = 5; if (p.hp <= 0) { this.ev.onGameOver(); this.done = true; } else this.respawn(); }

    this.updateEnts(wdt);
    this.updateBoss(wdt);

    for (const b of this.bolts) {
      b.x += b.vx * dt; b.t -= dt;
      if (this.solid(b.x + 4, b.y + 2)) { b.dead = true; this.burst(b.x + 4, b.y + 2, "#7cf3ff", 5, 60); }
      for (const e of [...this.ents, ...(this.boss ? [this.boss] : [])]) if (!e.dead && !b.dead && this.hit(b, e)) { b.dead = true; this.damage(e, 1); }
      if (b.t <= 0) b.dead = true;
    }
    this.bolts = this.bolts.filter((b) => !b.dead);
    for (const q of this.parts) { q.x += q.vx * wdt; q.y += q.vy * wdt; q.vy += 300 * wdt; q.life -= rdt; }
    this.parts = this.parts.filter((q) => q.life > 0);

    if (this.exit?.open && Math.abs(cx - (this.exit.x + 8)) < 12 && Math.abs(cy - (this.exit.y + 12)) < 18) {
      this.done = true; this.burst(cx, cy, "#f5c542", 40, 200);
      setTimeout(() => this.ev.onWin(this.level, this.shards.size, this.totalShards), 400);
    }

    // camera with lookahead
    const tx2 = p.x + p.face * 40 - VW / 2, ty2 = p.y - VH / 2;
    this.cam.x += (tx2 - this.cam.x) * Math.min(1, dt * 5); this.cam.y += (ty2 - this.cam.y) * Math.min(1, dt * 5);
    this.cam.x = Math.max(0, Math.min(this.W * T - VW, this.cam.x)); this.cam.y = Math.max(0, Math.min(this.H * T - VH, this.cam.y));
    this.shake *= 0.85;
    this.prev = { ...inp };
  }

  moveP(dt: number) {
    const p = this.p;
    p.x += p.vx * dt;
    for (const yy of [p.y + 1, p.y + p.h - 1]) {
      if (p.vx > 0 && this.solid(p.x + p.w, yy)) { p.x = Math.floor((p.x + p.w) / T) * T - p.w - 0.01; p.vx = 0; }
      if (p.vx < 0 && this.solid(p.x, yy)) { p.x = Math.floor(p.x / T) * T + T; p.vx = 0; }
    }
    const was = p.ground; const oldBottom = p.y + p.h; p.y += p.vy * dt; p.ground = false;
    for (const xx of [p.x + 1, p.x + p.w - 1]) {
      const below = this.tile(xx, p.y + p.h);
      const plat = below === "=" && p.vy >= 0 && oldBottom <= Math.floor((p.y + p.h) / T) * T + 1;
      if (p.vy >= 0 && (below === "#" || plat)) { p.y = Math.floor((p.y + p.h) / T) * T - p.h; p.vy = 0; p.ground = true; }
      if (p.vy < 0 && this.solid(xx, p.y)) { p.y = Math.floor(p.y / T) * T + T; p.vy = 0; }
    }
    if (p.ground && !was) { p.squash = 1.3; this.burst(p.x + 5, p.y + p.h, "#ffffff55", 4, 40); }
  }

  hit(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  damage(e: Ent, n: number) {
    e.hp -= n; this.hitstop = 0.03; this.burst(e.x + e.w / 2, e.y + e.h / 2, "#ffffff", 6);
    if (e.hp <= 0 && !e.dead) {
      e.dead = true; this.shake = e.type === "boss" ? 14 : 4; this.burst(e.x + e.w / 2, e.y + e.h / 2, "#f5c542", e.type === "boss" ? 80 : 18, 180);
      if (e.type === "boss") { this.hitstop = 0.4; this.exit = { x: Math.floor(this.W / 2) * T, y: 9 * T, open: true }; this.boss = null; }
    }
  }

  updateEnts(dt: number) {
    const p = this.p;
    for (const e of this.ents) {
      if (e.dead) continue; e.t += dt;
      if (e.type === "walker") {
        const ahead = e.vx > 0 ? e.x + e.w + 1 : e.x - 1;
        if (this.solid(ahead, e.y + 6) || !this.solid(ahead, e.y + e.h + 2)) e.vx *= -1;
        e.x += e.vx * dt;
      } else {
        e.x = e.ox! + Math.sin(e.t * 1.2) * 40; e.y = e.oy! + Math.sin(e.t * 2.4) * 16;
        // swoop when close
        if (Math.abs(p.x - e.x) < 80) e.y += Math.min(30, (p.y - e.y) * 0.3);
      }
      if (this.hit(p, e)) {
        if (p.dash > 0) this.damage(e, 3);
        else if (p.vy > 60 && p.y + p.h - e.y < 8) { this.damage(e, 3); p.vy = -280; p.jumps = this.hero === "lulu" ? 1 : 0; }
        else this.hurt();
      }
    }
    this.ents = this.ents.filter((e) => !e.dead);
  }

  updateBoss(dt: number) {
    const b = this.boss, p = this.p; if (!b) return;
    const phase = b.hp > 26 ? 1 : b.hp > 12 ? 2 : 3;
    b.t += dt;
    const cycle = phase === 3 ? 2.2 : 3;
    const s = b.t % cycle;
    if (s < 0.6) { b.vx = 0; } // telegraph
    else if (s < 1.6) { b.vx = b.dir * (phase === 3 ? 220 : 160); }
    else b.vx *= 0.9;
    if (s >= 1.6 && s - dt < 1.6) {
      b.dir = p.x < b.x ? -1 : 1;
      if (phase >= 2) for (let i = -2; i <= 2; i++) {
        const a = Math.atan2(p.y - b.y, p.x - b.x) + i * 0.3;
        this.ents.push({ x: b.x + 12, y: b.y + 12, w: 8, h: 8, vx: Math.cos(a) * 110, vy: Math.sin(a) * 110, hp: 99, type: "gear", t: 0, dir: 1 });
      }
    }
    b.x += b.vx * dt;
    if (this.solid(b.x, b.y + 16) || this.solid(b.x + b.w, b.y + 16)) { b.vx = 0; b.dir *= -1; b.x = Math.max(T, Math.min((this.W - 1) * T - b.w, b.x)); this.shake = 4; }
    if (this.hit(p, b)) { if (p.dash > 0) { this.damage(b, 3); p.dash = 0; p.vx = -p.face * 200; } else this.hurt(); }
    for (const g of this.ents) if (g.type === "gear") { g.x += g.vx * dt - g.vx * 0; g.y += g.vy * dt; if (this.solid(g.x + 4, g.y + 4)) g.dead = true; }
  }

  // ---------- render ----------
  render() {
    const c = this.ctx, pal = PAL[this.theme], t = this.time;
    const sx = (Math.random() - 0.5) * this.shake, sy = (Math.random() - 0.5) * this.shake;
    const g = c.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, pal.sky[0]); g.addColorStop(1, pal.sky[1]);
    c.fillStyle = g; c.fillRect(0, 0, VW, VH);
    this.drawBackdrop(pal);

    c.save(); c.translate(Math.round(-this.cam.x + sx), Math.round(-this.cam.y + sy));
    const x0 = Math.floor(this.cam.x / T) - 1, x1 = x0 + VW / T + 3, y0 = Math.floor(this.cam.y / T) - 1, y1 = y0 + VH / T + 3;
    for (let y = Math.max(0, y0); y < Math.min(this.H, y1); y++) for (let x = Math.max(0, x0); x < Math.min(this.W, x1); x++) {
      const ch = this.grid[y]?.[x] ?? " ", px = x * T, py = y * T;
      if (ch === "#") {
        c.fillStyle = pal.tile; c.fillRect(px, py, T, T);
        if (this.grid[y - 1]?.[x] !== "#") { c.fillStyle = pal.top; c.fillRect(px, py, T, 3); }
        c.fillStyle = "#00000022"; if ((x + y) % 3 === 0) c.fillRect(px + 4, py + 7, 4, 3);
      } else if (ch === "=") { c.fillStyle = pal.plat; c.fillRect(px, py, T, 5); c.fillStyle = pal.top; c.fillRect(px, py, T, 1); }
      else if (ch === "^") { c.fillStyle = "#d8d8e8"; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(px + i * 4, py + T); c.lineTo(px + i * 4 + 2, py + 6); c.lineTo(px + i * 4 + 4, py + T); c.fill(); } }
      else if (ch === "o") { const bob = Math.sin(t * 4 + x) * 2; c.fillStyle = "#f5c542"; c.save(); c.translate(px + 8, py + 8 + bob); c.rotate(t * 2); c.fillRect(-3, -3, 6, 6); c.restore(); c.fillStyle = "#f5c54233"; c.fillRect(px + 2, py + 2 + bob, 12, 12); }
      else if (ch === "C") { const on = this.cp.x === px + 3; c.fillStyle = "#555"; c.fillRect(px + 7, py, 2, T); c.fillStyle = on ? "#7cf3ff" : "#888"; c.beginPath(); c.arc(px + 8, py + 2, 4, 0, 7); c.fill(); }
    }
    if (this.exit) { const e = this.exit; for (let i = 0; i < 3; i++) { c.strokeStyle = ["#f5c542", "#7cf3ff", "#ff9be0"][i] ?? "#fff"; c.lineWidth = 2; c.beginPath(); c.ellipse(e.x + 8, e.y + 12, 9 - i * 2 + Math.sin(t * 5 + i) , 14 - i * 3, 0, 0, 7); c.stroke(); } }

    for (const e of this.ents) this.drawEnt(e);
    if (this.boss) this.drawBoss(this.boss);
    for (const b of this.bolts) { c.fillStyle = "#7cf3ff"; c.fillRect(b.x, b.y, b.w, b.h); c.fillStyle = "#ffffff"; c.fillRect(b.x + (b.dir > 0 ? 5 : 0), b.y + 1, 3, 2); }
    this.drawHero();
    for (const q of this.parts) { c.globalAlpha = q.life / q.max; c.fillStyle = q.c; c.fillRect(q.x, q.y, q.s, q.s); }
    c.globalAlpha = 1;
    c.restore();

    if (this.slow) { c.fillStyle = "#3a6bff22"; c.fillRect(0, 0, VW, VH); c.strokeStyle = "#7cf3ff55"; c.lineWidth = 4; c.strokeRect(2, 2, VW - 4, VH - 4); }
    this.drawHud();
  }

  drawBackdrop(pal: (typeof PAL)[Theme]) {
    const c = this.ctx, cx = this.cam.x;
    if (this.theme === "desert") { c.fillStyle = "#ffd28a"; c.beginPath(); c.arc(360, 90, 30, 0, 7); c.fill(); }
    if (this.theme === "clock") { c.strokeStyle = "#f5c54233"; c.lineWidth = 3; c.beginPath(); c.arc(240, 110, 80, 0, 7); c.stroke(); c.save(); c.translate(240, 110); c.rotate(this.time * 0.5); c.fillStyle = "#f5c54255"; c.fillRect(-2, -70, 4, 70); c.restore(); }
    if (this.theme === "neon") for (let i = 0; i < 40; i++) { c.fillStyle = "#ffffff55"; c.fillRect((i * 97 - cx * 0.05) % VW, (i * 53) % 120, 1, 1); }
    for (const [layer, k, hgt] of [[pal.far, 0.2, 110], [pal.mid, 0.45, 70]] as const) {
      c.fillStyle = layer;
      for (let i = -1; i < 12; i++) {
        const w = 60, x = i * w - ((cx * k) % w), seed = Math.abs(Math.sin((i + Math.floor((cx * k) / w)) * 12.9)) ;
        const h = hgt * (0.5 + seed * 0.6);
        if (this.theme === "desert") { c.beginPath(); c.moveTo(x, VH); c.lineTo(x + w / 2, VH - h); c.lineTo(x + w, VH); c.fill(); }
        else if (this.theme === "neon") { c.fillRect(x + 6, VH - h - 40, w - 12, h + 40); c.fillStyle = "#ff3ea533"; c.fillRect(x + 12, VH - h - 30, 4, 4); c.fillStyle = layer; }
        else { c.fillRect(x + 20, VH - h - 20, 14, h + 20); }
      }
    }
  }

  drawHero() {
    const c = this.ctx, p = this.p;
    if (p.inv > 0 && Math.floor(p.inv * 20) % 2 === 0) return;
    const nox = this.hero === "nox", bob = p.ground ? Math.abs(Math.sin(p.anim)) * 1 : 0;
    const w = p.w * (2 - p.squash), h = p.h * p.squash, x = p.x + (p.w - w) / 2, y = p.y + p.h - h - bob;
    c.fillStyle = nox ? "#1b2a6b" : "#7a1f5c"; c.fillRect(x, y + h * 0.35, w, h * 0.65); // body / cloak
    c.fillStyle = "#f3d2b3"; c.fillRect(x + 1, y, w - 2, h * 0.4); // head
    c.fillStyle = nox ? "#0a0f2a" : "#ff9be0"; c.fillRect(x, y - 2, w, 4); // hair
    if (!nox) { c.fillRect(p.face > 0 ? x - 3 : x + w, y, 3, 6); }
    c.fillStyle = "#111"; c.fillRect(p.face > 0 ? x + w - 4 : x + 2, y + 3, 2, 2); // eye
    c.fillStyle = nox ? "#7cf3ff" : "#ff9be0"; c.fillRect(x + w / 2 - 1, y + h * 0.5, 2, 2); // chrono gem
    if (nox) { c.fillStyle = "#9aa"; c.fillRect(p.face > 0 ? x + w : x - 5, y + h * 0.45, 5, 2); } // time pistol at muzzle
  }

  drawEnt(e: Ent) {
    const c = this.ctx;
    if (e.type === "walker") { c.fillStyle = "#3a3a4a"; c.fillRect(e.x, e.y + 2, e.w, e.h - 2); c.fillStyle = "#f5c542"; c.fillRect(e.x + (e.vx > 0 ? 9 : 2), e.y + 4, 3, 3); c.fillStyle = "#222"; c.fillRect(e.x + 1 + Math.sin(e.t * 12) * 1, e.y + e.h - 2, 4, 2); c.fillRect(e.x + 9 - Math.sin(e.t * 12), e.y + e.h - 2, 4, 2); }
    else if (e.type === "flier") { c.fillStyle = "#6a2a8a"; c.fillRect(e.x + 3, e.y + 3, 8, 8); c.fillStyle = "#cfa8ff"; const f = Math.sin(e.t * 20) * 4; c.fillRect(e.x - 2, e.y + 4 + f, 5, 2); c.fillRect(e.x + 11, e.y + 4 + f, 5, 2); c.fillStyle = "#ff4d6d"; c.fillRect(e.x + 6, e.y + 6, 2, 2); }
    else { c.save(); c.translate(e.x + 4, e.y + 4); c.rotate(this.time * 10); c.fillStyle = "#f5c542"; c.fillRect(-4, -4, 8, 8); c.fillStyle = "#5a4a32"; c.fillRect(-1.5, -1.5, 3, 3); c.restore(); }
  }

  drawBoss(b: Ent) {
    const c = this.ctx, s = b.t % (b.hp > 12 ? 3 : 2.2), tele = s < 0.6;
    c.fillStyle = tele && Math.floor(this.time * 20) % 2 ? "#ff4d6d" : "#5a4a32"; c.fillRect(b.x, b.y, b.w, b.h);
    c.strokeStyle = "#f5c542"; c.lineWidth = 2; c.beginPath(); c.arc(b.x + 16, b.y + 14, 10, 0, 7); c.stroke();
    c.save(); c.translate(b.x + 16, b.y + 14); c.rotate(this.time * 3); c.fillStyle = "#f5c542"; c.fillRect(-1, -9, 2, 9); c.restore();
    c.fillStyle = "#ff4d6d"; c.fillRect(b.x + 4, b.y + 4, 4, 3); c.fillRect(b.x + 24, b.y + 4, 4, 3);
  }

  drawHud() {
    const c = this.ctx, p = this.p;
    for (let i = 0; i < 5; i++) { c.fillStyle = i < p.hp ? "#ff4d6d" : "#ffffff22"; c.fillRect(8 + i * 11, 8, 8, 8); }
    c.fillStyle = "#00000066"; c.fillRect(8, 20, 62, 6); c.fillStyle = this.chronos > 20 ? "#7cf3ff" : "#ff4d6d"; c.fillRect(9, 21, this.chronos * 0.6, 4);
    c.font = "8px Silkscreen, monospace"; c.fillStyle = "#f5c542"; c.textAlign = "right";
    c.fillText(`◆ ${this.shards.size}/${this.totalShards}`, VW - 8, 15);
    c.fillStyle = this.hero === "nox" ? "#7cf3ff" : "#ff9be0"; c.fillText(this.hero === "nox" ? "NOX" : "LULÚ", VW - 8, 27);
    if (this.boss) { c.textAlign = "center"; c.fillStyle = "#00000088"; c.fillRect(140, VH - 18, 200, 8); c.fillStyle = "#f5c542"; c.fillRect(141, VH - 17, (this.boss.hp / 40) * 198, 6); c.fillText("ARCHON", VW / 2, VH - 22); }
    if (this.banner > 0) { const d = LEVELS[this.level]!; c.globalAlpha = Math.min(1, this.banner); c.textAlign = "center"; c.font = "16px Silkscreen, monospace"; c.fillStyle = "#ffffff"; c.fillText(d.name, VW / 2, 90); c.font = "8px Silkscreen, monospace"; c.fillStyle = "#f5c542"; c.fillText(d.era, VW / 2, 104); c.globalAlpha = 1; }
    c.textAlign = "left";
  }
}
