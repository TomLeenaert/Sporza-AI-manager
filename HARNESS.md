# Harness — loop-instructie (één iteratie)

Dit is de opdracht die de `/loop` telkens opnieuw uitvoert. Doel: de Wielermanager
Helper autonoom verbeteren tot de app "goed genoeg" is, één feature per ronde.

## Doe per iteratie exact dit
1. **Oriënteer** — lees `feature_list.json`, `claude-progress.txt` en `spec.md`.
2. **Smoke test** — start/gebruik de preview-server (`.claude/launch.json`, naam "app"),
   laad `index.html`, controleer dat de app nog opent zonder console-fouten.
3. **Kies één feature** — de hoogste in de prioriteitenlijst hieronder met `"passes": false`.
   Pak er precies één. Niet meer.
4. **Bouw ze** — implementeer volledig. Nieuwe agent = een JSON-signaal in `data/signals/`
   (de consolidator pikt het automatisch op) + zo nodig `node scripts/consolidate.mjs`.
5. **Verifieer als gebruiker** — via de preview: reset localStorage, laad verse data,
   `#autoBuild`, en controleer de uitkomst (exact 16 renners, ≤ budget, zinnige ploeg).
   Bij een agent: check dat de scores logisch veranderen.
6. **Laat een propere staat achter** — zet de feature op `"passes": true`, `git add -A`
   en `git commit`, en voeg één regel toe aan `claude-progress.txt`.

## Prioriteitenlijst (bouw in deze volgorde)
1. **Aspread** — Spreidings-agent: dwing dekking af per rittype (min. 1 topsprinter,
   klimmers, 1 tijdritspecialist) zodat de ploeg elke dag scoort i.p.v. enkel bergop.
2. **A6** — Historiek-agent: realistischer basispunten per rol/renner (fantasy-output),
   zodat waarde niet de enige motor is.
3. **A3** — Odds-agent: goksite-noteringen (geel/groen/ritzeges) als extra vorm-signaal.
4. **A1** — Uitslagen-agent: recente resultaten (juni/juli 2026) als vorm-signaal.
5. **Attt** — TTT-agent: goedkope ploegmaats van sterke ploegentijdrit-teams boosten
   voor de openingsrit.
6. **X1 Differential** — spot goede renners die weinig managers hebben (indien data).
7. **A7 Weer**, **A8 Ploegtactiek**, **A9 Blessures** — elk als signaalbestand.
8. **App 8** — dagelijkse cloud-run die `consolidate.mjs` draait en `ratings.json` ververst
   (opzetten via de scheduled-tasks; final activatie kan Toms bevestiging vragen).
9. **App 7** — deploy-klaar maken: bouw één zelfstandig `dist/index.html` met de data
   ingebакken, plus korte publiceer-instructie. (Echte publish = 1 klik van Tom.)

## Kwaliteitslat (wanneer stoppen)
Stop de loop wanneer alle items in `app` en de kern-agents (Aspread, A6, A3, A1, Attt)
op `"passes": true` staan én de voorgestelde ploeg gebalanceerd is (sprint + berg + TT
gedekt). Rapporteer dan een korte samenvatting i.p.v. verder te loopen.

## Veiligheidsregels
- Nooit meer dan één feature per ronde.
- Altijd committen voor je stopt — elke commit is Toms undo-knop.
- Verzin geen renners of cijfers: agent-data komt uit web-onderzoek of uit `riders.json`.
- Bij twijfel of een bouwkeuze Toms voorkeur raakt: noteer het in `claude-progress.txt`
  en kies de veilige, omkeerbare optie.
