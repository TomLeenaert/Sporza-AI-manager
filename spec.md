# Wielermanager Helper — Spec

## Wat is dit
Een mobielvriendelijke web-app die Tom helpt zijn ploeg samen te stellen en dagelijks
bij te sturen voor het spel **Sporza Wielermanager — Tour M 2026**
(https://wielermanager.sporza.be/tour-m-26/rules).

## Doel (in Toms woorden)
- Helpt mij mijn wielerploeg samenstellen volgens de Sporza-regels.
- Geeft dagelijks info en bijsturing (wissels), want je kan de ploeg veranderen.
- Adviseert; **ik pas de wissels zelf toe** in de Sporza-app (geen auto-login).
- **Volledig mobiel bruikbaar** — Tom is op reis, alleen telefoon.

## Regels (nog te bevestigen met echte Sporza-data — TODO)
> Deze waarden staan nu als instelbare velden in de app en worden bevestigd zodra
> we de echte regels/rennerslijst uit Sporza halen.
- Budget: TBD
- Aantal renners in ploeg: TBD
- Aantal transfers/wissels: TBD (per rit? totaal?)
- Wanneer wisselen mogelijk: TBD (deadline per rit)
- Puntentelling: TBD

## Kernfuncties (de checklist)
1. Regels instellen (budget, ploeggrootte, transfers) — instelbaar + opgeslagen op telefoon.
2. Rennerspool beheren: naam, ploeg, prijs, verwachte punten — met opslag.
3. Ploeg samenstellen: beste ploeg binnen budget en ploeggrootte (waarde-optimalisatie).
4. Wissel-advies: stel slimme wissels voor die punten verhogen binnen budget/transfers.
5. Rennersdata importeren uit Sporza (lijst + prijzen) i.p.v. handmatig.
6. Online zetten zodat Tom het op zijn telefoon opent.

## Niet-doelen (voorlopig)
- Geen automatisch inloggen op Sporza / geen wissels namens Tom uitvoeren.
- Geen account/login in de app zelf (data staat lokaal op de telefoon).

## Kwaliteitslat
Klaar als: Tom het op zijn telefoon opent, zijn budget/renners ingeeft, één tik
een geldige ploeg voorstelt binnen de regels, en dagelijks een wissel-advies toont.
