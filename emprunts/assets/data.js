/* Données du module « Les emprunts » — tous les montants sont calculés (et non recopiés) puis contrôlés avec vos corrigés */
var DATA = (function () {
  function r2(x) { return Math.round((x + 1e-9) * 100) / 100; }
  function D(y, m, d) { return Date.UTC(y, m - 1, d); }
  function ddays(a, b) { return Math.round((b - a) / 864e5); }
  function d360(a, b) {
    var A = new Date(a), B = new Date(b), d1 = Math.min(A.getUTCDate(), 30), d2 = Math.min(B.getUTCDate(), 30);
    return (B.getUTCFullYear() - A.getUTCFullYear()) * 360 + (B.getUTCMonth() - A.getUTCMonth()) * 30 + (d2 - d1);
  }

  /* échéancier : mode = fine | const | annuite ; r = taux PAR PÉRIODE ; n = nombre de périodes */
  function sched(V, r, n, mode) {
    var rows = [], crd = V, A = mode === "annuite" ? V * r / (1 - Math.pow(1 + r, -n)) : 0;
    for (var k = 1; k <= n; k++) {
      var it = crd * r, am = mode === "fine" ? (k === n ? V : 0) : mode === "const" ? V / n : A - it;
      rows.push({ k: k, crd: crd, int: it, am: am, ann: it + am });
      crd -= am;
    }
    return rows;
  }
  function tot(rows, key) { return rows.reduce(function (s, x) { return s + x[key]; }, 0); }
  function R(row) { return [r2(row.crd), r2(row.int), r2(row.am), r2(row.ann)]; }

  /* grille de saisie : picks = numéros de lignes demandées ; lab(k) = libellé de la période */
  function grid(rows, picks, lab, cols, opt) {
    opt = opt || {};
    var g = { title: opt.title, note: opt.note, first: opt.first || "Période", cols: cols, tol: opt.tol || 0.03, rows: [] };
    picks.forEach(function (k, i) {
      var row = { label: lab(k), vals: R(rows[k - 1]) };
      if (i === 0 && k === 1) row.given = { 0: r2(rows[0].crd) };
      g.rows.push(row);
    });
    if (opt.total) g.rows.push({ label: "Total", tot: 1, vals: [null, r2(tot(rows, "int")), r2(tot(rows, "am")), r2(tot(rows, "ann"))] });
    return g;
  }

  /* intérêts courus : plusieurs conventions de prorata sont acceptées */
  function icne(I, last, close, next, primary) {
    var real = ddays(last, close), per = ddays(last, next), e = d360(last, close), ep = d360(last, next);
    var c = { real: I * real / per, real1: I * (real + 1) / per, eu: I * e / ep, eu1: I * (e + 1) / ep };
    if (per >= 360 && per <= 366) { c.y365 = I * (real + 1) / 365; c.y365b = I * real / 365; }   // échéance annuelle uniquement
    var main = r2(c[primary]), alt = [];
    Object.keys(c).forEach(function (k) { var v = r2(c[k]); if (v !== main && alt.indexOf(v) < 0) alt.push(v); });
    return { v: main, alt: alt };
  }
  function icneJ(id, title, ic, note, debit, credit) {
    return { id: id, title: title, note: note, tol: 0.011,
      lines: [{ acc: debit || "661100", d: ic.v, alt: ic.alt }, { acc: credit || "168800", c: ic.v, alt: ic.alt }],
      why: "Plusieurs conventions de prorata sont acceptées (jours réels, mois de 30 jours…) : l'important est de rester cohérent avec le contrat." };
  }
  var COLS = ["Capital restant dû en début de période", "Intérêts", "Amortissement", "Annuité"];
  function cols(name) { return ["Capital restant dû en début de période", "Intérêts", "Amortissement", name]; }
  function fld(label, v, hint, extra) { var o = { label: label, v: v, hint: hint }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function ded(acc, am, int, ann) {
    return [{ acc: "164000", d: am }, { acc: "661100", d: int }, { acc: "512000", c: ann }];
  }
  function lineSet(rows, picks) {
    var out = [];
    picks.forEach(function (k) { var x = rows[k - 1]; out.push({ acc: "164000", d: r2(x.am) }, { acc: "661100", d: r2(x.int) }, { acc: "512000", c: r2(x.ann) }); });
    return out;
  }
  function deblocage(date, V) {
    return { id: "deb", title: "Déblocage de l'emprunt — " + date, note: "Journal de banque.", lines: [{ acc: "512000", d: V }, { acc: "164000", c: V }] };
  }

  var X = {};

  /* ===== Section 3 : tableaux d'amortissement ===== */
  var s5 = sched(20000, 0.065 / 12, 60, "const");
  X.t1 = {
    grids: [grid(s5, [1, 2, 60], function (k) { return "Mois " + k; }, cols("Mensualité"), { title: "Cas 5 — emprunt de 20 000 €, 6,5 % l'an, 5 ans, amortissements constants (mensuel)", note: "Taux mensuel proportionnel : 6,5 % ÷ 12. Remplissez les mois 1, 2 et 60." })],
    fields: [
      fld("Amortissement mensuel constant", r2(20000 / 60), "20 000 ÷ 60 mois"),
      fld("Total des intérêts payés sur toute la durée", r2(tot(s5, "int")), "Somme des intérêts des 60 mois (ou taux mensuel × capital × (60 + 1) ÷ 2)")
    ]
  };
  var s6 = sched(10000, 0.045 / 4, 20, "annuite");
  X.t2 = {
    grids: [grid(s6, [1, 2, 20], function (k) { return "Trimestre " + k; }, cols("Trimestrialité"), { title: "Cas 6 — emprunt de 10 000 €, 4,5 % l'an, 5 ans, trimestrialités constantes", note: "Taux trimestriel : 4,5 % ÷ 4 = 1,125 %. 20 trimestrialités. Commencez par la trimestrialité constante." })],
    fields: [fld("Trimestrialité constante", r2(s6[0].ann), "10 000 × 0,01125 ÷ (1 − 1,01125⁻²⁰)", { tol: 0.011 })]
  };

  /* ===== Section 4 : écritures — Cas 7 ===== */
  var s7 = sched(15000, 0.035, 5, "annuite");
  var ic7 = icne(s7[1].int, D(2024, 9, 14), D(2024, 12, 31), D(2025, 9, 14), "eu");
  X.e7 = {
    grids: [grid(s7, [1, 2, 3, 4, 5], function (k) { return "Année " + k; }, cols("Annuité"), { title: "Tableau d'amortissement — 15 000 €, 3,5 % l'an, 5 ans, annuités constantes" })],
    fields: [
      fld("Solde du compte 164000 au 31/12/N (avant tout remboursement)", 15000, "Fonds reçus le 14/09/N, rien n'est encore remboursé"),
      fld("Solde du compte 164000 au 31/12/N+1", r2(s7[1].crd), "Capital restant dû après le 1er remboursement du 14/09/N+1"),
      fld("Solde du compte 164000 au 31/12/N+2", r2(s7[2].crd), "Capital restant dû après le 2e remboursement")
    ],
    fieldsTitle: "Le compte 164000 au bilan",
    journals: [
      deblocage("14/09/N", 15000),
      { id: "r1", title: "1er remboursement — 14/09/N+1", note: "Journal de banque : amortissement, intérêts, annuité.", tol: 0.03, lines: lineSet(s7, [1]) },
      icneJ("icne", "Intérêts courus au 31/12/N+1", ic7, "Journal des OD. Intérêts de la 2e période, prorata sur 3 mois et 16 jours.")
    ]
  };

  /* ===== Section 5 : ICNE ===== */
  var ic1 = icne(2854.32, D(2023, 10, 1), D(2023, 12, 31), D(2024, 9, 30), "y365");
  X.i1 = {
    fields: [
      fld("Nombre de jours courus du 01/10/N au 31/12/N (jours de début et de fin compris)", 92, "Octobre 31 + novembre 30 + décembre 31", { alt: [91], soft: true }),
      fld("Intérêts courus non échus au 31/12/N", ic1.v, "Intérêts de la période du 01/10/N au 30/09/N+1 (ligne N+1 : 2 854,32 €) × jours courus ÷ 365", { alt: ic1.alt })
    ],
    journals: [icneJ("od", "Écriture au 31/12/N", ic1, "L'échéance est le 30/09 : à la clôture, trois mois d'intérêts sont déjà courus.")]
  };
  var ic2 = icne(241.19, D(2023, 12, 5), D(2023, 12, 31), D(2024, 1, 5), "real");
  X.i2 = {
    fields: [
      fld("Intérêts de la prochaine échéance (5 janvier N+1)", 241.19, "Lisez la ligne 25 du tableau : intérêts 241,19 €", { soft: true }),
      fld("Intérêts courus non échus au 31/12/N", ic2.v, "241,19 × 26 jours (du 5 au 31/12) ÷ 31 jours de la période", { alt: ic2.alt })
    ],
    journals: [icneJ("od", "Écriture au 31/12/N", ic2, "Dernière échéance payée : 5 décembre N. L'assurance est laissée de côté.")]
  };
  var ic3a = icne(2362, D(2023, 12, 1), D(2023, 12, 31), D(2024, 3, 1), "eu1");
  var ic3b = icne(469, D(2023, 8, 1), D(2023, 12, 31), D(2024, 2, 1), "real");
  X.i3 = {
    fields: [
      fld("ICNE sur l'emprunt BNP au 31/12/23", ic3a.v, "Intérêts de l'échéance du 01/03/24 (2 362 €) × 1 mois sur 3", { alt: ic3a.alt }),
      fld("Intérêts courus sur le prêt au salarié au 31/12/23", ic3b.v, "Intérêts de l'échéance du 01/02/24 (469 €) × jours écoulés depuis le 01/08/23 ÷ jours de la période", { alt: ic3b.alt })
    ],
    journals: [
      icneJ("bnp", "Emprunt BNP (charge à payer)", ic3a, "Dernière échéance : 01/12/23. Prochaine : 01/03/24."),
      icneJ("sal", "Prêt au salarié (produit à recevoir)", ic3b, "La société est ici la PRÊTEUSE : les intérêts courus sont un produit.", "276840", "762600")
    ]
  };

  /* ===== Section 6 : choisir son financement ===== */
  var f1 = sched(365000, 0.06, 4, "const"), f2 = sched(365000, 0.07, 6, "const");
  X.c1 = {
    grids: [grid(f1, [1, 2, 3, 4], function (k) { return "Année " + k; }, cols("Annuité"), { title: "Financement 1 — 365 000 € à 6 % sur 4 ans, amortissements constants", total: true })],
    fields: [
      fld("Financement 2 (7 %, 6 ans) : intérêts de l'année 1", r2(f2[0].int), "365 000 × 7 %"),
      fld("Financement 2 : annuité de l'année 1", r2(f2[0].ann), "Amortissement 365 000 ÷ 6 + intérêts de l'année 1"),
      fld("Financement 2 : total des intérêts", r2(tot(f2, "int")), "365 000 × 7 % × (6 + 1) ÷ 2"),
      fld("Numéro de l'offre la plus avantageuse (1 ou 2)", 1, "Comparez le total des intérêts : 54 750 € contre 89 425 €")
    ],
    fieldsTitle: "Comparer"
  };
  var h1 = sched(135000, 0.0575 / 2, 12, "fine"), h2 = sched(135000, 0.0575 / 2, 12, "const"), h3 = sched(135000, 0.0575 / 2, 12, "annuite");
  X.c2 = {
    fields: [
      fld("« In fine » : intérêts d'un semestre", r2(h1[0].int), "135 000 × 5,75 % ÷ 2"),
      fld("« In fine » : total des intérêts", r2(tot(h1, "int")), "12 semestres d'intérêts identiques"),
      fld("Amortissements constants : amortissement par semestre", r2(h2[0].am), "135 000 ÷ 12"),
      fld("Amortissements constants : 1re semestrialité", r2(h2[0].ann), "11 250 + 3 881,25"),
      fld("Amortissements constants : total des intérêts", r2(tot(h2, "int")), "135 000 × 2,875 % × (12 + 1) ÷ 2"),
      fld("Semestrialités constantes : montant de la semestrialité", r2(h3[0].ann), "135 000 × 0,02875 ÷ (1 − 1,02875⁻¹²)", { tol: 0.011 }),
      fld("Semestrialités constantes : total des intérêts", r2(tot(h3, "int")), "12 × semestrialité − 135 000"),
      fld("Numéro de la modalité la plus avantageuse (1 in fine, 2 amortissements constants, 3 semestrialités constantes)", 2, "Choisissez le total d'intérêts le plus faible")
    ],
    fieldsTitle: "Cas 3 — 135 000 €, 5,75 % l'an, 6 ans, remboursement semestriel"
  };
  var p1 = sched(150000, 0.06, 6, "annuite"), p2 = sched(150000, 0.07, 5, "annuite"), p3 = sched(150000, 0.065, 4, "const");
  X.c3 = {
    fields: [
      fld("Prêt 1 BNP : annuité constante", r2(p1[0].ann), "150 000 × 0,06 ÷ (1 − 1,06⁻⁶)", { tol: 0.011 }),
      fld("Prêt 1 BNP : total des intérêts", r2(tot(p1, "int")), "6 × annuité − 150 000"),
      fld("Prêt 2 CIC : annuité constante", r2(p2[0].ann), "150 000 × 0,07 ÷ (1 − 1,07⁻⁵)", { tol: 0.011 }),
      fld("Prêt 2 CIC : total des intérêts", r2(tot(p2, "int")), "5 × annuité − 150 000"),
      fld("Prêt 3 Crédit Agricole : total des intérêts", r2(tot(p3, "int")), "150 000 × 6,5 % × (4 + 1) ÷ 2"),
      fld("Prêt 1 : coût réel après impôt (IS 15 %)", r2(tot(p1, "int") * 0.85), "Intérêts × (1 − 15 %)"),
      fld("Prêt 2 : coût réel après impôt", r2(tot(p2, "int") * 0.85), "Intérêts × (1 − 15 %)"),
      fld("Prêt 3 : coût réel après impôt", r2(tot(p3, "int") * 0.85), "Intérêts × (1 − 15 %)"),
      fld("Numéro du prêt le plus avantageux (1 BNP, 2 CIC, 3 Crédit Agricole)", 3, "Le coût réel après impôt le plus faible")
    ],
    fieldsTitle: "Choix de financement — trois prêts de 150 000 €"
  };

  /* ===== Section 7 : cas d'entraînement ===== */
  // A — SIAB
  var sA = sched(55000, 0.065, 5, "const");
  var icA = icne(sA[0].int, D(2023, 5, 1), D(2023, 12, 31), D(2024, 5, 1), "y365");
  X.cA = {
    grids: [grid(sA, [1, 2, 3, 4, 5], function (k) { return "01/05/N+" + k; }, cols("Annuité"), { title: "Tableau d'emprunt", total: true })],
    journals: [deblocage("01/05/N", 55000), icneJ("icne", "Intérêts courus au 31/12/N", icA, "La première échéance est le 01/05/N+1 : huit mois d'intérêts de la 1re période sont courus.")]
  };
  // B — Amphénol (le corrigé d'origine part de 105 800 € ; l'énoncé impose 20 % d'autofinancement)
  var VB = r2(126960 / 1.2 * 0.8), sB = sched(VB, 0.09 / 12, 48, "annuite");
  var icB = icne(sB[5].int, D(2023, 12, 15), D(2023, 12, 31), D(2024, 1, 15), "real");
  X.cB = {
    fields: [
      fld("Prix d'achat HT du robot", r2(126960 / 1.2), "126 960 ÷ 1,20"),
      fld("Autofinancement exigé (20 % du HT)", r2(126960 / 1.2 * 0.2), "105 800 × 20 %"),
      fld("Montant de l'emprunt", VB, "Prix HT − autofinancement"),
      fld("Mensualité constante", r2(sB[0].ann), "Taux mensuel 9 % ÷ 12 = 0,75 % ; 48 mensualités", { tol: 0.011 })
    ],
    fieldsTitle: "Financement",
    grids: [grid(sB, [1, 2, 5], function (k) { return ["", "15/08/N", "15/09/N", "15/10/N", "15/11/N", "15/12/N"][k]; }, cols("Mensualité"), { title: "Tableau d'amortissement (lignes 1, 2 et 5)" })],
    journals: [
      deblocage("15/07/N", VB),
      { id: "m1", title: "Mensualité du 15/08/N", tol: 0.03, lines: lineSet(sB, [1]) },
      { id: "m5", title: "Mensualité du 15/12/N", tol: 0.03, lines: lineSet(sB, [5]) },
      icneJ("icne", "Intérêts courus au 31/12/N", icB, "Dernière échéance : 15/12/N ; prochaine : 15/01/N+1.")
    ]
  };
  // C — Cas 2 autoformation
  var sC = sched(150000, 0.045, 5, "annuite");
  var icC = icne(sC[1].int, D(2025, 6, 10), D(2025, 12, 31), D(2026, 6, 10), "eu");
  X.cC = {
    grids: [grid(sC, [1, 2, 3, 4, 5], function (k) { return "Année " + k; }, cols("Annuité"), { title: "Plan d'amortissement — 150 000 €, 4,5 % l'an, 5 ans, annuités constantes" })],
    journals: [
      deblocage("10/06/N", 150000),
      { id: "r1", title: "Remboursement de la 1re échéance — 10/06/N+1", tol: 0.03, lines: lineSet(sC, [1]) },
      icneJ("icne", "Intérêts courus au 31/12/N+1", icC, "Dernière échéance : 10/06/N+1. Intérêts de la 2e période à rattacher à l'exercice.")
    ]
  };
  // D — Cas 4 autoformation (trimestrialités)
  var sD = sched(125000, 0.0575 / 4, 20, "annuite");
  var icD = icne(sD[3].int, D(2023, 11, 20), D(2023, 12, 31), D(2024, 2, 20), "eu");
  X.cD = {
    fields: [fld("Trimestrialité constante", r2(sD[0].ann), "Taux trimestriel 5,75 % ÷ 4 = 1,4375 % ; 20 trimestrialités", { tol: 0.011 })],
    fieldsTitle: "Calcul de la trimestrialité",
    grids: [grid(sD, [1, 2, 3, 20], function (k) { return ["", "20/05/N", "20/08/N", "20/11/N"][k] || "Trimestre 20"; }, cols("Trimestrialité"), { title: "Plan d'amortissement (lignes 1, 2, 3 et 20)" })],
    journals: [
      deblocage("20/02/N", 125000),
      { id: "tr", title: "Les trois trimestrialités de l'année N — 20/05, 20/08 et 20/11", note: "Neuf lignes au total : trois fois (164000, 661100, 512000).", tol: 0.03, lines: lineSet(sD, [1, 2, 3]) },
      icneJ("icne", "Intérêts courus au 31/12/N", icD, "Dernière échéance : 20/11/N ; prochaine : 20/02/N+1.")
    ]
  };
  // E — Cas 8 autoformation (mensualités, taux mensuel donné)
  var sE = sched(35000, 0.0054, 60, "annuite");
  var icE = icne(sE[3].int, D(2023, 12, 8), D(2023, 12, 31), D(2024, 1, 8), "eu");
  X.cE = {
    fields: [fld("Mensualité constante", r2(sE[0].ann), "35 000 × 0,0054 ÷ (1 − 1,0054⁻⁶⁰)", { tol: 0.011 })],
    fieldsTitle: "Calcul de la mensualité",
    grids: [grid(sE, [1, 2, 3, 4], function (k) { return ["", "08/10/N", "08/11/N", "08/12/N", "08/01/N+1"][k]; }, cols("Mensualité"), { title: "Premières lignes du plan d'amortissement" })],
    journals: [
      { id: "men", title: "Les trois mensualités de l'année N — 08/10, 08/11 et 08/12", note: "Il n'y a pas de déblocage à enregistrer : on commence au remboursement.", tol: 0.03, lines: lineSet(sE, [1, 2, 3]) },
      icneJ("icne", "Intérêts courus au 31/12/N", icE, "Dernière échéance : 08/12/N ; prochaine : 08/01/N+1.")
    ]
  };

  /* ===== Quiz ===== */
  var quiz = [
    { q: "Qu'appelle-t-on un emprunt indivis ?", o: ["Un emprunt émis auprès d'un grand nombre de créanciers", "Un emprunt contracté auprès d'un seul prêteur", "Un emprunt sans intérêts", "Un emprunt remboursé uniquement à l'échéance"], a: 1,
      e: "L'emprunt indivis est conclu avec un seul prêteur (souvent une banque). L'emprunt obligataire, lui, est réparti entre de très nombreux créanciers." },
    { q: "L'annuité est égale à…", o: ["L'amortissement seul", "Les intérêts seuls", "L'amortissement + les intérêts (+ éventuellement l'assurance)", "Le capital emprunté ÷ la durée"], a: 2,
      e: "Annuité (ou mensualité, trimestrialité) = part du capital remboursée + intérêts de la période." },
    { q: "Emprunt de 100 à 10 % sur 4 ans, amortissements constants. Quelle est la 1re annuité ?", o: ["10", "25", "35", "31,55"], a: 2,
      e: "Amortissement 100 ÷ 4 = 25 ; intérêts 100 × 10 % = 10 ; annuité 35." },
    { q: "Même emprunt (100, 10 %, 4 ans) mais en annuités constantes. Quelle est l'annuité ?", o: ["25", "31,55", "35", "27,50"], a: 1,
      e: "A = 100 × 0,10 ÷ (1 − 1,10⁻⁴) = 31,55. La part d'intérêts baisse, la part d'amortissement augmente." },
    { q: "Emprunt in fine de 200 000 € à 5 % sur 6 ans. Que paie-t-on chaque année avant la dernière ?", o: ["Intérêts de 10 000 €", "Amortissement de 33 333 €", "Rien", "Annuité de 43 000 €"], a: 0,
      e: "In fine : seuls les intérêts sont payés chaque année (200 000 × 5 % = 10 000 €). Le capital est remboursé en totalité au terme." },
    { q: "À la réception des fonds, quelle écriture passe-t-on au journal de banque ?", o: ["Débit 164000 / Crédit 512000", "Débit 512000 / Crédit 164000", "Débit 661100 / Crédit 512000", "Débit 512000 / Crédit 168800"], a: 1,
      e: "La banque augmente : débit 512000. La dette est créée : crédit 164000 Emprunts auprès des établissements de crédit." },
    { q: "Lors d'un remboursement, quelle écriture est correcte ?", o: ["Débit 512000 / Crédit 164000 et 661100", "Débit 164000 et 661100 / Crédit 512000", "Débit 661100 / Crédit 164000", "Débit 164000 / Crédit 661100"], a: 1,
      e: "On débite la part de capital remboursée (164000) et les intérêts (661100) ; on crédite la banque (512000) du montant de l'annuité." },
    { q: "Dans quel compte enregistre-t-on la prime d'assurance liée à l'emprunt ?", o: ["661100", "616000", "164000", "168800"], a: 1,
      e: "La prime d'assurance est une charge d'exploitation (616000), distincte des intérêts. Elle s'ajoute à l'annuité payée à la banque." },
    { q: "Que sont les intérêts courus non échus (ICNE) ?", o: ["Des intérêts payés d'avance", "Des intérêts de la période en cours, déjà courus à la clôture mais pas encore payés", "Des intérêts de retard", "Le capital restant dû"], a: 1,
      e: "Ce sont les intérêts qui courent entre la dernière échéance payée et la clôture. Par le principe de rattachement des charges à l'exercice, il faut les comptabiliser." },
    { q: "Quelle écriture constate les ICNE d'un emprunt au 31/12 ?", o: ["Débit 661100 / Crédit 168800", "Débit 168800 / Crédit 661100", "Débit 164000 / Crédit 168800", "Débit 661100 / Crédit 512000"], a: 0,
      e: "Charge d'intérêts (661100) en contrepartie d'une dette (168800 Intérêts courus). L'écriture est passée au journal des opérations diverses." },
    { q: "Que fait-on de cette écriture le 1er jour de l'exercice suivant ?", o: ["Rien", "On l'extourne (écriture inverse)", "On la double", "On la déplace en capitaux propres"], a: 1,
      e: "L'extourne annule l'écriture de clôture : lors du paiement de l'échéance, la charge réelle est enregistrée en totalité sans doublon." },
    { q: "Intérêts de l'échéance suivante : 600 €. 2 mois sur 6 se sont écoulés depuis la dernière échéance. Quels intérêts courus ?", o: ["100 €", "200 €", "300 €", "400 €"], a: 1,
      e: "600 × 2 ÷ 6 = 200 €. C'est le principe du prorata temporis." },
    { q: "Une entreprise accorde un prêt à un salarié. À la clôture, comment constate-t-elle les intérêts courus ?", o: ["Débit 661100 / Crédit 168800", "Débit 276840 / Crédit 762600", "Débit 512000 / Crédit 762600", "Elle ne les constate pas"], a: 1,
      e: "L'entreprise est prêteuse : les intérêts courus sont un produit à recevoir (créance 276840 en contrepartie du produit 762600)." },
    { q: "Emprunt de 120 000 € à 5 %, amortissements constants sur 4 ans. Quels sont les intérêts de l'année 2 ?", o: ["6 000 €", "4 500 €", "3 000 €", "1 500 €"], a: 1,
      e: "Capital restant dû en début d'année 2 : 120 000 − 30 000 = 90 000 ; intérêts 90 000 × 5 % = 4 500 €." },
    { q: "Un emprunt de 40 000 € au taux de 9 % l'an est remboursé par mensualités. Quel taux mensuel proportionnel utilise-t-on ?", o: ["9 %", "0,75 %", "1,5 %", "0,09 %"], a: 1,
      e: "9 % ÷ 12 = 0,75 % par mois. La durée en mois se calcule aussi : 4 ans = 48 mensualités." },
    { q: "Deux prêts de même montant : intérêts totaux de 30 000 € et 28 000 €. Taux d'IS de 25 %. Quel est le coût réel après impôt du second ?", o: ["28 000 €", "21 000 €", "7 000 €", "35 000 €"], a: 1,
      e: "Les intérêts sont déductibles : coût réel = 28 000 × (1 − 25 %) = 21 000 €. L'économie d'impôt est de 7 000 €." },
    { q: "À la clôture, que contrôle-t-on pour le compte 164000 ?", o: ["Qu'il est égal au montant emprunté", "Qu'il correspond au capital restant dû du tableau d'amortissement de la banque", "Qu'il est nul", "Qu'il est égal aux intérêts payés"], a: 1,
      e: "Le solde de 164000 doit coïncider avec le capital restant dû au tableau de la banque à la même date. Sinon, on recherche l'erreur d'enregistrement." }
  ];

  return { X: X, quiz: quiz, VB: VB, mensB: r2(sB[0].ann), sched: sched, r2: r2 };
})();
