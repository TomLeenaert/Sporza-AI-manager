// Bundelaar: giet index.html + data/ratings.json samen tot één zelfstandig
// dist/index.html (geen server of data-map meer nodig). Draai na consolidate.mjs.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const ratings = readFileSync(join(root, "data/ratings.json"), "utf8");

// Zet de data als globale variabele net vóór het hoofd-script.
const inject = `<script>window.__RATINGS__ = ${ratings};</script>\n<script>`;
const out = html.replace(/<script>\nconst \$ = s =>/, inject + "\nconst $ = s =>");

if (out === html) { console.error("FOUT: injectiepunt niet gevonden"); process.exit(1); }
mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/index.html"), out);
console.log(`dist/index.html geschreven (${Math.round(out.length/1024)} KB, data ingebakken).`);
