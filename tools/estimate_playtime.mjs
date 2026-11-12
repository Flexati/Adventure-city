// Playtime ESTIMATE (not human duration) from the instrumented campaign runs of
// tools/verify_campaign_browser.cjs (CITY_VIRTUAL_TIME=1): report.json -> playtime.per_step / hubs.
//
// Every loop tick of the bot (130 ms of virtual game clock) is attributed to ONE activity:
//   action.foot                 combat/stealth missions on foot            -> combat factor
//   action.drive/escape/hold/openingWalk, hub walking                      -> navigation factor
//   passive_ms                  transitions and timed cinematics (no input) -> x1
//   ui_bot_ms                   bot time on dialogue/cards/choices          -> DROPPED, replaced by reading
// Reading = words / wpm + seconds per advance (lines, cards, results, choices, panels).
// Boss steps add a share on their action time (retries and learning, the bot's own retries are
// already inside its action time). Optional content (hub errands not required to leave, secrets,
// shop, Vortex races and challenges) is reported apart and never added to the campaign total.
//
// usage: node tools/estimate_playtime.mjs <out.json> <out.md> <report A> <report B> <report C>
import fs from 'node:fs';
import {RACES_V9} from '../game/racing-v9.mjs';
import {HUBS} from '../game/hubs.mjs';

export const MODELS = {
  min: {combat: 1.2, nav: 1.1, wpm: 250, advance_s: .8, boss: .10, choice_s: 0},
  probable: {combat: 1.6, nav: 1.3, wpm: 180, advance_s: 1.2, boss: .25, choice_s: 3},
  high: {combat: 2.2, nav: 1.6, wpm: 140, advance_s: 1.8, boss: .50, choice_s: 8},
};
const BOSS_STEPS = new Set(['blackout', 'breach', 'zero', 'archive', 'finale']);
const REQUIRED_HUB_JOBS = {moon: 2, cathedral: 2, toxic: 2, clockwork: 2}; // hubExit: one errand + preparation before leaving
// Measured bot pace on Ash Docks (time trial, gold, 13000 units in 25.8 s): used only for optional races.
const BOT_RACE_SPEED = 13000 / 25.85;

export function stepEstimate(t, model, step) {
  const s = ms => ms / 1000;
  const combat = s(t.action.foot) * model.combat;
  const nav = s(t.action.drive + t.action.escape + t.action.openingWalk + t.action.hold) * model.nav;
  const boss = BOSS_STEPS.has(step) ? (combat + nav) * model.boss : 0;
  const words = t.talk_words + t.card_words + t.choice_words + t.result_words + t.city_words;
  const advances = t.talk_lines + t.cards + t.results + t.choices + t.city_panels;
  const reading = words / model.wpm * 60 + advances * model.advance_s + t.choices * model.choice_s;
  const passive = s(t.passive_ms);
  return {combat_s: combat, navigation_s: nav, boss_extra_s: boss, reading_s: reading, passive_s: passive,
          total_s: combat + nav + boss + reading + passive, words, advances};
}

function hubEstimate(hubs, model) {
  const req = {}, opt = {};
  for (const [hub, h] of Object.entries(hubs)) {
    const jobs = HUBS[hub]?.jobs.map(j => 'job:' + j.id) || [];
    const need = REQUIRED_HUB_JOBS[hub] || 0;
    for (const [act, ms] of Object.entries(h.by_activity)) {
      const sec = ms / 1000 * model.nav;
      const required = act === 'exit' || act === 'preparation' || (act.startsWith('job:') && jobs.indexOf(act) < need);
      const into = required ? req : opt;
      into[hub] = (into[hub] || 0) + sec;
    }
    const panel = h.panel_words / model.wpm * 60 + h.panels * model.advance_s;
    // Panels serve both kinds; split them by the share of required activity time.
    const tot = (req[hub] || 0) + (opt[hub] || 0) || 1;
    req[hub] = (req[hub] || 0) + panel * (req[hub] || 0) / tot;
    opt[hub] = (opt[hub] || 0) + panel * (opt[hub] || 0) / tot;
  }
  return {required: req, optional: opt};
}

function racesEstimate(model) {
  // One run of each series race and of each unlocked challenge (time trial, elimination, rematch on
  // the three Ash Docks courses), at the bot pace, with intro and outro lines; medal retries excluded.
  const series = ['ash_docks', 'ash_slalom', 'ash_night'].filter(id => RACES_V9[id]);
  const runs = [];
  for (const id of series) for (const mode of ['series', 'tt', 'elim', 'rev']) {
    const r = RACES_V9[id];
    const sec = r.length / BOT_RACE_SPEED * model.nav;
    const read = 2 * (14 / model.wpm * 60 + model.advance_s); // intro + outro, ~14 words each (measured lines)
    runs.push({race: mode === 'series' ? id : `${mode}:${id}`, s: sec + read});
  }
  return {runs, total_s: runs.reduce((a, r) => a + r.s, 0)};
}

function main(outJson, outMd, ...reports) {
  const routes = {};
  for (const path of reports) {
    const r = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (!r.playtime) throw Error(path + ': no playtime block (run the instrumented verifier)');
    routes[r.strategy] = r;
  }
  const out = {label: 'ESTIMATE_NOT_HUMAN', models: MODELS, assumptions: [
    'Bot inputs come from tests/helpers/autoplay.mjs (reaction .3 s, dodge rate .65-.7): faster and more accurate than a new player; the factors scale its action time.',
    'Virtual clock: each 130 ms tick is attributed to one activity only; bot time on dialogue panels is dropped and replaced by the reading model, so text is never counted twice.',
    'Boss share covers retries and learning on the five boss steps; bot retries are already inside its action time.',
    'Hub: leaving Toxic and Clockwork requires one errand and the smith preparation (runtime hubExit); every other errand, secret and purchase is optional.',
    'Optional Vortex races are estimated from course length at the measured bot pace (Ash Docks time trial 25.8 s); medal retries excluded.',
    'Pauses, menus, settings, load screens and idle time are excluded. No human has played this build: no median exists.',
  ], routes: {}};
  for (const [route, r] of Object.entries(routes)) {
    const res = {};
    for (const [name, model] of Object.entries(MODELS)) {
      const steps = {};
      let total = 0;
      for (const [step, t] of Object.entries(r.playtime.per_step)) {
        if (step === '_menu') continue;
        const e = stepEstimate(t, model, step);
        steps[step] = e;
        total += e.total_s;
      }
      const hubs = hubEstimate(r.playtime.hubs, model);
      const hubReq = Object.values(hubs.required).reduce((a, b) => a + b, 0);
      const hubOpt = Object.values(hubs.optional).reduce((a, b) => a + b, 0);
      const races = racesEstimate(model);
      res[name] = {campaign_min: (total + hubReq) / 60, steps_min: total / 60, hubs_required_min: hubReq / 60,
                   optional: {hubs_min: hubOpt / 60, races_min: races.total_s / 60, races: races.runs},
                   per_step: steps, hubs};
    }
    out.routes[route] = {steps_seen: r.steps, bot_retries: Object.values(r.playtime.per_step).reduce((a, t) => a + t.retries, 0),
                         raw: r.playtime, estimate: res};
  }
  fs.writeFileSync(outJson, JSON.stringify(out, null, 1) + '\n');
  fs.writeFileSync(outMd, render(out));
  for (const [route, r] of Object.entries(out.routes))
    console.log(route, Object.fromEntries(Object.entries(r.estimate).map(([k, v]) => [k, +v.campaign_min.toFixed(1)])),
                'optional probable', +(r.estimate.probable.optional.hubs_min + r.estimate.probable.optional.races_min).toFixed(1));
}

const f1 = x => x.toFixed(1);
function render(out) {
  const L = ['# Stima della durata — ESTIMATE_NOT_HUMAN', '',
    'Ricavata dai giri automatici completi A/B/C con orologio virtuale e dal modello sotto. **Nessuna persona ha giocato questa build: non è una durata umana e non è una mediana.** `COMMERCIAL_RELEASE = BLOCKED`.', '',
    '## Modelli', '', '| Parametro | Minimo | Probabile (mandato) | Alto |', '|---|---:|---:|---:|'];
  const M = out.models;
  for (const [k, lab] of [['combat', 'Fattore combattimento (a piedi)'], ['nav', 'Fattore navigazione, guida, gare, hub'], ['wpm', 'Parole al minuto'], ['advance_s', 'Secondi per avanzamento'], ['boss', 'Quota extra boss'], ['choice_s', 'Secondi di riflessione per scelta']])
    L.push(`| ${lab} | ${M.min[k]} | ${M.probable[k]} | ${M.high[k]} |`);
  L.push('', '## Campagna principale (obbligatoria)', '', '| Rotta | Minimo | Probabile | Alto | Ritentativi del bot |', '|---|---:|---:|---:|---:|');
  for (const [route, r] of Object.entries(out.routes))
    L.push(`| ${route.toUpperCase()} | ${f1(r.estimate.min.campaign_min)} min | **${f1(r.estimate.probable.campaign_min)} min** | ${f1(r.estimate.high.campaign_min)} min | ${r.bot_retries} |`);
  L.push('', 'Obiettivo dell\'autore: almeno 105 minuti attivi, mediana progettuale circa 120. Il confronto è fra una **stima** e l\'obiettivo, non una verifica.', '',
    '## Facoltativi (mai sommati alla campagna)', '', '| Rotta | Incarichi, segreti, negozio | Gare e sfide Vortex (12 corse) |', '|---|---:|---:|');
  for (const [route, r] of Object.entries(out.routes))
    L.push(`| ${route.toUpperCase()} | ${f1(r.estimate.min.optional.hubs_min)}–${f1(r.estimate.high.optional.hubs_min)} min (prob. ${f1(r.estimate.probable.optional.hubs_min)}) | ${f1(r.estimate.min.optional.races_min)}–${f1(r.estimate.high.optional.races_min)} min (prob. ${f1(r.estimate.probable.optional.races_min)}) |`);
  const a = out.routes.a || Object.values(out.routes)[0];
  L.push('', '## Per tappa — rotta A, modello probabile', '', '| Tappa | Combattimento | Navigazione | Extra boss | Lettura | Passivo | Totale | Parole | Avanzamenti |', '|---|---:|---:|---:|---:|---:|---:|---:|---:|');
  for (const [step, e] of Object.entries(a.estimate.probable.per_step))
    L.push(`| ${step} | ${f1(e.combat_s / 60)} | ${f1(e.navigation_s / 60)} | ${f1(e.boss_extra_s / 60)} | ${f1(e.reading_s / 60)} | ${f1(e.passive_s / 60)} | **${f1(e.total_s / 60)}** | ${e.words} | ${e.advances} |`);
  L.push('', 'Valori in minuti. Hub obbligatori (rotta A, probabile): ' + Object.entries(a.estimate.probable.hubs.required).map(([h, s]) => `${h} ${f1(s / 60)}`).join(', ') + ' min.', '',
    '## Differenze fra le rotte', '', 'A: officina, scelte «verità/chiedimelo», passaggio diretto, cella a sé, EVE conservata, Ines accompagna. B: rifugio, scelte opposte, rotta di servizio, cella a Unità 9 (alleato nella Linea, un\'ondata in meno), EVE spenta, Lulù resta. C: combinazione mista. Le differenze di durata vengono dalle ondate e dai bonus delle scelte (`buildMission`).', '',
    '## Ipotesi e limiti', '', ...out.assumptions.map(x => '- ' + x),
    '- Il tempo «passivo» include dissolvenze e attese temporizzate: un umano le vive identiche.',
    '- La lettura usa le parole effettivamente mostrate nei pannelli che il bot ha attraversato (dialoghi, schede, risultati, scelte), non il copione intero.', '');
  return L.join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) main(...process.argv.slice(2));
