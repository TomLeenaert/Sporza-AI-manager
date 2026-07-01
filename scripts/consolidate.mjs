// Consolidator (A11): bundelt riders.json + alle agent-signalen (data/signals/*.json)
// tot 1 verwachte-punten-score per renner -> schrijft data/ratings.json.
// De app leest dat bestand. De dagelijkse cloud-agent draait dit script opnieuw.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const riders = JSON.parse(readFileSync(join(root, "data/riders.json"), "utf8"));

// Verzamel alle signaal-bestanden (elke agent dropt hier een JSON).
const sigDir = join(root, "data/signals");
let mult = {}, notes = {};
for (const f of readdirSync(sigDir).filter(f => f.endsWith(".json"))) {
  const sig = JSON.parse(readFileSync(join(sigDir, f), "utf8"));
  for (const [naam, s] of Object.entries(sig.signalen || {})) {
    mult[naam] = (mult[naam] ?? 1) * (s.mult ?? 1);   // multipliers stapelen
    if (s.reden) notes[naam] = s.reden;
  }
}

// Basisscore: de Sporza-waarde prijst talent al in. Zet om naar puntenschaal,
// pas dan de agent-multipliers toe. (v1-model; specialist-agents verfijnen dit.)
const BASE = 45;
const ratings = riders.riders.map(r => {
  const m = mult[r.n] ?? 1;
  return {
    name: r.n, team: r.t, price: r.v,
    pts: Math.round(r.v * BASE * m),
    note: notes[r.n] || ""
  };
});

const out = {
  updated: process.env.RUN_DATE || riders.bron,
  budget: riders.budget, squad: riders.squad, freeTransfers: riders.freeTransfers,
  riders: ratings.sort((a, b) => b.pts - a.pts)
};
writeFileSync(join(root, "data/ratings.json"), JSON.stringify(out, null, 2));
console.log(`ratings.json geschreven: ${ratings.length} renners, ${Object.keys(mult).length} met signaal.`);
