import { useEffect, useRef, useState } from "react";
import { Game, VW, VH, type Input } from "@/game/engine";
import { LEVELS } from "@/game/levels";

type Screen = "title" | "play" | "win" | "over" | "end";
const SAVE = "chronos-remix-progress";

export function ChronosGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const input = useRef<Input>({ left: false, right: false, jump: false, action: false, time: false, switchHero: false });
  const [screen, setScreen] = useState<Screen>("title");
  const [unlocked, setUnlocked] = useState(1);
  const [result, setResult] = useState({ level: 0, shards: 0, total: 0 });
  const [paused, setPaused] = useState(false);

  useEffect(() => { const v = Number(localStorage.getItem(SAVE) || 1); setUnlocked(Math.max(1, Math.min(LEVELS.length, v))); }, []);

  useEffect(() => {
    const cv = canvasRef.current!; cv.width = VW; cv.height = VH;
    const g = new Game(cv, input.current, {
      onWin: (level, shards, total) => {
        setResult({ level, shards, total });
        const next = Math.min(LEVELS.length, level + 2);
        setUnlocked((u) => { const n = Math.max(u, next); localStorage.setItem(SAVE, String(n)); return n; });
        setScreen(level === LEVELS.length - 1 ? "end" : "win");
      },
      onGameOver: () => setScreen("over"),
    });
    gameRef.current = g; g.load(0); g.done = true;
    let last = performance.now(), raf = 0;
    const loop = (now: number) => { const dt = Math.min(0.033, (now - last) / 1000); last = now; g.update(dt); g.render(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const map: Record<string, keyof Input> = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", Space: "jump", ArrowUp: "jump", KeyW: "jump", KeyJ: "action", KeyX: "action", KeyK: "time", KeyC: "time", KeyQ: "switchHero", ShiftLeft: "switchHero" };
    const kd = (e: KeyboardEvent) => { const k = map[e.code]; if (k) { input.current[k] = true; e.preventDefault(); } if (e.code === "Escape" || e.code === "KeyP") togglePause(); };
    const ku = (e: KeyboardEvent) => { const k = map[e.code]; if (k) input.current[k] = false; };
    const vis = () => { if (document.hidden) { g.paused = true; setPaused(true); } };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku); document.addEventListener("visibilitychange", vis);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); document.removeEventListener("visibilitychange", vis); };
  }, []);

  const togglePause = () => { const g = gameRef.current; if (!g || g.done) return; g.paused = !g.paused; setPaused(g.paused); };
  const start = (i: number) => { const g = gameRef.current!; g.load(i); g.paused = false; setPaused(false); setScreen("play"); };

  const btn = (k: keyof Input, label: string, cls = "") => (
    <button
      aria-label={label}
      className={`touch-btn ${cls}`}
      onPointerDown={(e) => { e.preventDefault(); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); input.current[k] = true; }}
      onPointerUp={() => (input.current[k] = false)}
      onPointerCancel={() => (input.current[k] = false)}
      onPointerLeave={() => (input.current[k] = false)}
      onContextMenu={(e) => e.preventDefault()}
    >{label}</button>
  );

  return (
    <div className="game-shell">
      <div className="game-frame">
        <canvas ref={canvasRef} className="game-canvas" />
        {screen === "play" && <button className="pause-btn" aria-label="Pausa" onClick={togglePause}>❚❚</button>}

        {screen === "title" && (
          <div className="overlay">
            <p className="kicker">Vanta · Remix</p>
            <h1 className="title-glow">Chronos Adventure</h1>
            <p className="subtitle">Nox &amp; Lulú</p>
            <div className="level-list">
              {LEVELS.map((l, i) => (
                <button key={l.name} disabled={i >= unlocked} className="level-btn" onClick={() => start(i)}>
                  <span>{i + 1}. {l.name}</span><small>{i >= unlocked ? "Bloccato" : l.era}</small>
                </button>
              ))}
            </div>
            <p className="hint">← → muovi · Spazio salta · J attacca · K rallenta il tempo · Q cambia eroe</p>
          </div>
        )}
        {paused && screen === "play" && (
          <div className="overlay"><h2 className="title-glow">Pausa</h2>
            <button className="cta" onClick={togglePause}>Riprendi</button>
            <button className="ghost" onClick={() => { gameRef.current!.done = true; setScreen("title"); }}>Menu</button></div>
        )}
        {screen === "win" && (
          <div className="overlay"><p className="kicker">Distretto liberato</p><h2 className="title-glow">{LEVELS[result.level]?.name}</h2>
            <p className="subtitle">Frammenti ◆ {result.shards}/{result.total}</p>
            <button className="cta" onClick={() => start(result.level + 1)}>Avanti</button>
            <button className="ghost" onClick={() => setScreen("title")}>Menu</button></div>
        )}
        {screen === "over" && (
          <div className="overlay"><h2 className="title-glow">Il tempo si è fermato</h2>
            <button className="cta" onClick={() => start(gameRef.current!.level)}>Riprova</button>
            <button className="ghost" onClick={() => setScreen("title")}>Menu</button></div>
        )}
        {screen === "end" && (
          <div className="overlay"><p className="kicker">Archon è caduto</p><h2 className="title-glow">Vanta respira</h2>
            <p className="subtitle">Nox ha trovato una risposta. Lulú ha salvato tutti — questa volta.</p>
            <button className="cta" onClick={() => setScreen("title")}>Menu</button></div>
        )}
      </div>

      {screen === "play" && (
        <div className="touch-pad">
          <div className="touch-group">{btn("left", "◀")}{btn("right", "▶")}</div>
          <div className="touch-group">{btn("switchHero", "⇄", "small")}{btn("time", "⏳", "time")}{btn("action", "✦", "act")}{btn("jump", "▲", "jump")}</div>
        </div>
      )}
    </div>
  );
}
