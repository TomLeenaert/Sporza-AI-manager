# Harness — loop-instructie (Sprint 3-4-5)

Dit is de opdracht die de `/loop` telkens opnieuw uitvoert. Doel: Sprint 3, 4 en 5 van de
Wielermanager Studio autonoom bouwen, één feature per ronde, tot de lijst af is.

## Doe per iteratie exact dit
1. **Oriënteer** — lees `feature_list.json`, `claude-progress.txt`, `spec.md` en deze backlog.
2. **Smoke test** — preview-server "app" (`.claude/launch.json`), laad `index.html`, geen console-fouten.
3. **Kies één feature** — de bovenste met status TODO uit de backlog hieronder. Precies één.
4. **Bouw ze volledig** — app-features in `index.html`; nieuwe scoring-signalen als JSON in
   `data/signals/` + zo nodig `scripts/consolidate.mjs` uitbreiden; daarna
   `node scripts/consolidate.mjs && node scripts/bundle.mjs`.
5. **Verifieer als gebruiker** — reset localStorage (`wm_studio_v1`), verse data, autoBuild;
   controleer: exact 16 renners, ≤ €100M, dekking sprint/berg/tijdrit, geen fouten, en dat de
   nieuwe feature echt zichtbaar/werkend is in de preview.
6. **Publiceer** — zet feature op done in dit bestand + `feature_list.json`, `git commit`,
   `git push`, en 1 regel in `claude-progress.txt`.

## Backlog (bouw in deze volgorde)

### Sprint 3 — slim tijdens de Tour
- [x] **S3.1 Vandaag-briefing** — DONE. Prominente kaart bovenaan: rit+type, kapitein, beste zet, deadline.
      (Bonus: verbeter-pass in buildBestTeam + coverage-guard in advies; ploeg nu echt optimaal.)
- [x] **S3.2 Deadline-info** — DONE. deadlineNote in stages + urgentie (vandaag/morgen/over N dagen)
      berekend uit datum; getoond op rit-kaart en Vandaag-briefing.
- [x] **S3.3 Rit-recap** — DONE. recap-2026.json (type "recap") -> "Koersverhaal"-kaart (Gisteren/Vandaag).
      Consolidator zet het in ratings.recap; recap-agent verschijnt NIET als analist. Research-agent vult later.

### Sprint 4 — extra analisten
- [x] **S4.1 Weer-agent** — DONE. weer-2026.json (type "weer") -> weerregel op rit-kaart (ratings.weer).
      Info-type, geen analist. Research-agent ververst dagelijks.
- [x] **S4.2 Ploegtactiek-agent** — DONE. type "teamboost" in consolidator; ploegtactiek-2026.json boost
      aanvallende teams (EF/Uno-X/Tudor…). Toont als 14e analist.
- [x] **S4.3 Differential-agent** — DONE. type "ownership"; lage eigenaarschap-% -> lichte boost (max 1.1)
      + 💎-badge op ploeg/renners. differential-2026.json seed (schatting), research vult echte %. 15e analist.
- [x] **S4.4 Voorbeschouwing- + vlucht-inzicht** — DONE. daily-research.md uitgebreid: dagelijkse agent
      onderhoudt nu ook weer, recap, ownership (differential) en voorbeschouwing/vluchtkansen.

### Sprint 5 — verfijning
- [ ] **S5.1 Scoreregels kalibreren** — zoek de exacte Sporza-puntentelling (punten tot plaats 30,
      trui-/klassementsbonus) en stem de model-constanten (BASE, tier-curve, rolgewichten) daarop af.
      Documenteer de keuze bovenaan `scripts/consolidate.mjs`. Ploeg moet geldig blijven.
- [ ] **S5.2 Rol-agent nauwkeuriger** — corrigeer resterende mislabels (vooral €4M+ renners die als
      "knecht" staan maar echte scorers zijn). Verifieer dat geen echte kopman op ~0 punten staat.

## Kwaliteitslat (wanneer stoppen)
Stop wanneer alle items hierboven op done staan én de app in de preview correct werkt (geldige ploeg,
geen fouten, alle nieuwe kaarten/agents zichtbaar). Rapporteer dan een samenvatting.

## Veiligheidsregels
- Eén feature per ronde. Altijd committen voor je stopt (elke commit = Toms undo-knop).
- Verzin geen data: seeds mogen placeholders zijn, echte cijfers komen uit web-onderzoek of bestaande data.
- Hou de bestaande motor (knapsack, pin/ban, coverage, dagelijkse workflow) intact.
- Bij een keuze die Toms voorkeur raakt: noteer in `claude-progress.txt` en kies de veilige, omkeerbare optie.
