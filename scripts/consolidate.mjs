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
let formAdj = {}, notes = {}, coverage = {}, tiers = null, ttt = null, strat = null;
const excluded = new Set();   // opgegeven / niet-gestarte renners (research-agent)
const agentsMeta = [];
let recap = null;             // gisteren/vandaag-verhaal (research-agent)

for (const f of readdirSync(sigDir).filter(f => f.endsWith(".json"))) {
  const s = JSON.parse(readFileSync(join(sigDir, f), "utf8"));
  const type = s.type || (s.rolgewicht ? "parcours" : s.roles ? "roles" : "form");
  // Info-dragers (geen analist): sla apart op en sla de agent-registratie over.
  if (type === "recap") { recap = { gisteren: s.gisteren || "", vandaag: s.vandaag || "", datum: s.datum || "" }; continue; }
  // Korte samenvatting per agent voor het Agents-scherm in de app.
  let highlights = [];
  if (type === "form") highlights = Object.entries(s.signalen || {}).slice(0, 4).map(([n, x]) => `${n}: ${x.reden || ""}`);
  else if (type === "roles") highlights = [`${Object.keys(s.roles || {}).length} renners een profiel gegeven`];
  else if (type === "parcours") highlights = [Object.entries(s.samenstelling || {}).map(([k, v]) => `${v} ${k}`).join(", ")];
  else if (type === "coverage") highlights = [`Minimaal: ${Object.entries(s.min || {}).map(([k, v]) => `${v} ${k}`).join(", ")}`];
  else if (type === "baseline") highlights = ["Elites scoren onevenredig veel (tier-curve)"];
  else if (type === "ttt") highlights = [`Sterke teams: ${(s.strongTeams || []).join(", ")}`];
  else if (type === "strategy") highlights = (s.regels || []).slice(0, 6);
  agentsMeta.push({ agent: s.agent || f.replace(/\.json$/, ""), type, datum: s.datum || "", uitleg: s.uitleg || "", bron: s.bron || "", highlights });
  if (type === "parcours") {
    roleWeight = { ...roleWeight, ...(s.rolgewicht || {}) };
  } else if (type === "roles") {
    roleOf = { ...roleOf, ...(s.roles || {}) };
    if (s.default) defaultRole = s.default;
  } else if (type === "coverage") {
    for (const [rol, m] of Object.entries(s.min || {})) coverage[rol] = Math.max(coverage[rol] || 0, m);
  } else if (type === "baseline") {
    tiers = (s.tiers || []).slice().sort((a, b) => b.min - a.min); // hoog->laag
  } else if (type === "ttt") {
    ttt = { teams: new Set(s.strongTeams || []), maxValue: s.maxValue ?? 3, boost: s.cheapBoost ?? 1.5 };
  } else if (type === "exclude") {
    (s.names || []).forEach(n => excluded.add(n));
  } else if (type === "strategy") {
    strat = { arch: s.archetypeMult || {}, trap: s.trap || null };
  } else { // form: multipliers -> additieve aanpassing die stapelt en gedempt wordt
    for (const [naam, sig] of Object.entries(s.signalen || {})) {
      formAdj[naam] = (formAdj[naam] || 0) + ((sig.mult ?? 1) - 1);
      if (sig.reden) notes[naam] = sig.reden;
    }
  }
}

const BASE = 45;
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const tierMult = v => tiers ? (tiers.find(t => v >= t.min)?.mult ?? 1) : 1;

const ratings = riders.riders.map(r => {
  const rol = roleOf[r.n] || defaultRole;
  if (excluded.has(r.n)) return { name: r.n, team: r.t, price: r.v, rol, pts: 0, note: "niet gestart / opgegeven" };
  const rw = roleWeight[rol] ?? 1;
  const vorm = clamp(1 + (formAdj[r.n] || 0), 0.6, 1.6); // demping tegen ontploffing
  const tttMult = (ttt && ttt.teams.has(r.t) && r.v <= ttt.maxValue) ? ttt.boost : 1;
  // Meta-strategie: archetype-boost + "dure knecht = valstrik"-penalty (uit spelhistoriek).
  let stratMult = 1;
  if (strat) {
    stratMult *= (strat.arch[rol] ?? 1);
    const tr = strat.trap;
    if (tr && (tr.roles || []).includes(rol) && r.v >= (tr.minValue ?? 4)) stratMult *= (tr.mult ?? 1);
  }
  const pts = Math.round(r.v * BASE * rw * vorm * tierMult(r.v) * tttMult * stratMult);
  return { name: r.n, team: r.t, price: r.v, rol, pts, note: notes[r.n] || "" };
});

// Rittenschema meenemen (indien aanwezig).
let stages = null;
try { stages = JSON.parse(readFileSync(join(root, "data/stages-2026.json"), "utf8")); } catch { /* optioneel */ }

const out = {
  updated: process.env.RUN_DATE || riders.bron,
  budget: riders.budget, squad: riders.squad, freeTransfers: riders.freeTransfers,
  coverage,
  agents: agentsMeta,
  stages,
  recap,
  riders: ratings.sort((a, b) => b.pts - a.pts)
};
writeFileSync(join(root, "data/ratings.json"), JSON.stringify(out, null, 2));
console.log(`ratings.json: ${ratings.length} renners | rollen: ${Object.keys(roleOf).length} | vorm-signalen: ${Object.keys(formAdj).length}`);
