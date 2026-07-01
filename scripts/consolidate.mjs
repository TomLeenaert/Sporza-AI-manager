// Consolidator (A11): bundelt riders.json + alle agent-signalen (data/signals/*.json)
// tot 1 verwachte-punten-score per renner -> schrijft data/ratings.json.
//
// Model: score = value * BASE * rolgewicht(rol, parcours) * vorm-multiplier
//  - value  : Sporza-marktwaarde (prijst talent/kopmanschap al in)
//  - rol     : van de rol-agent (gc/klimmer/sprinter/... ; onbekend = knecht)
//  - rolgewicht: van de parcours-agent (weegt rollen naar het parcours van dit jaar)
//  - vorm    : stapelende +/- uit vorm/uitslagen-signalen (gedempt, geen ontploffing)
//
// Elke agent dropt een JSON in data/signals/ met een "type": parcours | roles | form.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const riders = JSON.parse(readFileSync(join(root, "data/riders.json"), "utf8"));
const sigDir = join(root, "data/signals");

let roleWeight = {}, roleOf = {}, defaultRole = "knecht";
let formAdj = {}, notes = {};

for (const f of readdirSync(sigDir).filter(f => f.endsWith(".json"))) {
  const s = JSON.parse(readFileSync(join(sigDir, f), "utf8"));
  const type = s.type || (s.rolgewicht ? "parcours" : s.roles ? "roles" : "form");
  if (type === "parcours") {
    roleWeight = { ...roleWeight, ...(s.rolgewicht || {}) };
  } else if (type === "roles") {
    roleOf = { ...roleOf, ...(s.roles || {}) };
    if (s.default) defaultRole = s.default;
  } else { // form: multipliers -> additieve aanpassing die stapelt en gedempt wordt
    for (const [naam, sig] of Object.entries(s.signalen || {})) {
      formAdj[naam] = (formAdj[naam] || 0) + ((sig.mult ?? 1) - 1);
      if (sig.reden) notes[naam] = sig.reden;
    }
  }
}

const BASE = 45;
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

const ratings = riders.riders.map(r => {
  const rol = roleOf[r.n] || defaultRole;
  const rw = roleWeight[rol] ?? 1;
  const vorm = clamp(1 + (formAdj[r.n] || 0), 0.6, 1.6); // demping tegen ontploffing
  const pts = Math.round(r.v * BASE * rw * vorm);
  return { name: r.n, team: r.t, price: r.v, rol, pts, note: notes[r.n] || "" };
});

const out = {
  updated: process.env.RUN_DATE || riders.bron,
  budget: riders.budget, squad: riders.squad, freeTransfers: riders.freeTransfers,
  riders: ratings.sort((a, b) => b.pts - a.pts)
};
writeFileSync(join(root, "data/ratings.json"), JSON.stringify(out, null, 2));
console.log(`ratings.json: ${ratings.length} renners | rollen: ${Object.keys(roleOf).length} | vorm-signalen: ${Object.keys(formAdj).length}`);
