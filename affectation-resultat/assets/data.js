/* Données des exercices et du quiz — énoncés tirés de vos applications et du TP, corrigés vérifiés par calcul */
var DATA = (function () {
  var RL5 = "5 % de la base, mais plafonné à ce qu'il reste à doter (10 % du capital − réserve légale déjà constituée).";

  /* ===== Exercice guidé (section « tableau ») : SARL LISE TAILOR — Application 4 ===== */
  var lt = {
    fields: [
      { label: "Nombre de parts de Mme Lise Tailor (40 % de 3 000 parts)", v: 1200, hint: "3 000 parts × 40 %" },
      { label: "Nombre de parts de M. Dubois (35 %)", v: 1050, hint: "3 000 parts × 35 %" },
      { label: "Nombre de parts de Mme Rey (25 %)", v: 750, hint: "3 000 parts × 25 %" },
      { label: "Plafond de la réserve légale (10 % du capital)", v: 30000, hint: "300 000 × 10 %" },
      { label: "Base de calcul de la réserve légale", v: 135000, hint: "Résultat 120 000 + report à nouveau créditeur 15 000", hl: 1 },
      { label: "Dotation à la réserve légale N", v: 6000, hint: RL5 + " Ici 5 % = 6 750 mais il ne reste que 30 000 − 24 000.", how: "5 % × 135 000 = 6 750, plafonné à 30 000 − 24 000 = 6 000", hl: 1 },
      { label: "Solde 1 du résultat distribuable", v: 129000, hint: "Base 135 000 − dotation" },
      { label: "Dividendes de Mme Lise Tailor (20 € × ses parts)", v: 24000, hint: "20 € × 1 200 parts" },
      { label: "Dividendes de M. Dubois", v: 21000, hint: "20 € × 1 050 parts" },
      { label: "Dividendes de Mme Rey", v: 15000, hint: "20 € × 750 parts" },
      { label: "Total des dividendes distribués", v: 60000, hint: "20 € × 3 000 parts" },
      { label: "Nouveau report à nouveau (solde)", v: 69000, hint: "129 000 − 60 000", hl: 1 }
    ]
  };
  var ltj = {
    journals: [
      { id: "od", title: "1) Affectation du résultat — AGO du 30/06/N+1",
        note: "Soldez le résultat et l'ancien report à nouveau, puis constatez chaque affectation.",
        lines: [
          { acc: "120000", d: 120000 }, { acc: "110000", d: 15000 },
          { acc: "106100", c: 6000 }, { acc: "110000", c: 69000 }, { acc: "457000", c: 60000 }
        ],
        why: "Total 135 000 = 120 000 (résultat) + 15 000 (ancien report). Le compte 110000 apparaît deux fois : l'ancien solde est soldé au débit, le nouveau est constaté au crédit." },
      { id: "cca", title: "2) Rémunération du compte courant de M. Dubois — 15/07/N+1",
        note: "C'est une charge financière, pas une affectation du résultat.",
        lines: [{ acc: "661500", d: 2000 }, { acc: "512000", c: 2000 }],
        why: "50 000 € × 4 % = 2 000 € (montant retenu par l'AGO)." },
      { id: "div", title: "3) Règlement des dividendes — 17/07/N+1",
        lines: [{ acc: "457000", d: 60000 }, { acc: "512000", c: 60000 }],
        why: "Dans votre corrigé, un sous-compte par associé est utilisé (457110, 457111, 457112) : tout compte 457… est accepté." }
    ]
  };

  /* ===== Cas A : SAS LISE TAILOR — Application 2 ===== */
  var A = {
    fields: [
      { label: "Plafond de la réserve légale (10 % du capital)", v: 5000, hint: "10 % du capital de 50 000 €" },
      { label: "Base de calcul de la réserve légale", v: 123400, hint: "Résultat 124 600 + report à nouveau DÉBITEUR (−1 200)", hl: 1 },
      { label: "Dotation à la réserve légale N", v: 1500, hint: RL5 + " 5 % = 6 170 mais il reste 5 000 − 3 500 à doter.", hl: 1 },
      { label: "Solde 1 du résultat distribuable", v: 121900, hint: "123 400 − 1 500" },
      { label: "Dotation à la réserve facultative (décision AGO)", v: 20000 },
      { label: "Solde 2 du résultat distribuable", v: 101900, hint: "121 900 − 20 000" },
      { label: "Dividendes (1,80 € × 5 000 actions)", v: 9000, hint: "1,80 × 5 000" },
      { label: "Nouveau report à nouveau", v: 92900, hint: "101 900 − 9 000", hl: 1 }
    ],
    journals: [
      { id: "od", title: "Écriture d'affectation du résultat", note: "Le report à nouveau antérieur est débiteur : il est apuré par le bénéfice.",
        lines: [
          { acc: "120000", d: 124600 }, { acc: ["119000", "110000"], c: 1200 },
          { acc: "106100", c: 1500 }, { acc: "106800", c: 20000 }, { acc: "110000", c: 92900 }, { acc: "457000", c: 9000 }
        ],
        why: "119000 est crédité pour apurer le solde débiteur de 1 200 (votre corrigé l'impute sur 110000, accepté aussi)." }
    ]
  };

  /* ===== Cas B : SAS SETAK — TP ===== */
  var B = {
    fields: [
      { label: "Plafond de la réserve légale", v: 4000, hint: "10 % de 40 000 €" },
      { label: "Base de calcul de la réserve légale", v: 149600, hint: "134 600 + 15 000", hl: 1 },
      { label: "Dotation à la réserve légale N", v: 2000, hint: RL5 + " 5 % = 7 480 mais il ne reste que 4 000 − 2 000.", hl: 1 },
      { label: "Solde 1 du résultat distribuable", v: 147600, hint: "149 600 − 2 000" },
      { label: "Dotation à la réserve facultative", v: 10000 },
      { label: "Solde 2 du résultat distribuable", v: 137600, hint: "147 600 − 10 000" },
      { label: "Dividendes (15 € × 4 000 parts)", v: 60000, hint: "15 × 4 000" },
      { label: "Nouveau report à nouveau", v: 77600, hint: "137 600 − 60 000", hl: 1 },
      { label: "Intérêts du compte courant (47 300 × 3,85 %)", v: 1821.05, tol: 0.011, hint: "47 300 × 3,85 % = 1 821,05" }
    ],
    journals: [
      { id: "od", title: "1) Affectation du résultat — AGO du 30/06/2024",
        lines: [
          { acc: "120000", d: 134600 }, { acc: "110000", d: 15000 },
          { acc: "106100", c: 2000 }, { acc: "106800", c: 10000 }, { acc: "110000", c: 77600 }, { acc: "457000", c: 60000 }
        ] },
      { id: "div", title: "2) Paiement des dividendes — 17/07/2024",
        lines: [{ acc: "457000", d: 60000 }, { acc: "512000", c: 60000 }] },
      { id: "cca", title: "3) Intérêts du compte courant — 15/07/2024",
        lines: [{ acc: "661500", d: 1821.05 }, { acc: "512000", c: 1821.05 }] }
    ]
  };

  /* ===== Cas C : SA DUKE — Application 2 bis (niveau GCF) ===== */
  var C = {
    fields: [
      { label: "Base de calcul de la réserve légale", v: 618000, hint: "Bénéfice 632 720 − report à nouveau débiteur 14 720", hl: 1 },
      { label: "Plafond de la réserve légale (10 % de 6 000 000)", v: 600000, hint: "10 % du capital" },
      { label: "Dotation à la réserve légale N", v: 30900, hint: "5 % × 618 000 (il reste 600 000 − 450 000 = 150 000 à doter, donc pas de plafonnement).", hl: 1 },
      { label: "Cumul de la réserve légale après répartition", v: 480900, hint: "450 000 + 30 900" },
      { label: "Solde 1 du résultat distribuable", v: 587100, hint: "618 000 − 30 900" },
      { label: "Dotation à la réserve statutaire", v: 50000, hint: "Article 7 des statuts" },
      { label: "Cumul de la réserve statutaire après répartition", v: 175000, hint: "125 000 + 50 000" },
      { label: "Dotation à la réserve facultative (AGO)", v: 50000 },
      { label: "Solde disponible avant dividendes", v: 487100, hint: "587 100 − 50 000 − 50 000" },
      { label: "Dividendes (24 € × 20 000 actions)", v: 480000, hint: "24 × 20 000" },
      { label: "Nouveau report à nouveau (reste « reporté à nouveau » selon les statuts)", v: 7100, hint: "487 100 − 480 000", hl: 1 }
    ],
    journals: [
      { id: "od", title: "Écriture d'affectation du résultat — AGO du 30/06/2023",
        lines: [
          { acc: "120000", d: 632720 }, { acc: ["119000", "110000"], c: 14720 },
          { acc: "106100", c: 30900 }, { acc: "106300", c: 50000 }, { acc: "106800", c: 50000 },
          { acc: "457000", c: 480000 }, { acc: "110000", c: 7100 }
        ],
        why: "Contrôle : 14 720 + 30 900 + 50 000 + 50 000 + 480 000 + 7 100 = 632 720 = le résultat." }
    ]
  };

  /* ===== Cas D : SARL DELON — Application 1 (niveau GCF) ===== */
  var D = {
    fields: [
      { label: "Nombre de parts (300 000 ÷ 300 €)", v: 1000 },
      { label: "Base de calcul de la réserve légale", v: 58600, hint: "56 000 + 2 600", hl: 1 },
      { label: "Dotation à la réserve légale N", v: 2930, hint: "5 % × 58 600 (il reste 30 000 − 18 000 = 12 000 à doter).", hl: 1 },
      { label: "Solde 1 du résultat distribuable", v: 55670, hint: "58 600 − 2 930" },
      { label: "Dotation à la réserve statutaire (3 % du capital)", v: 9000, hint: "300 000 × 3 %" },
      { label: "Dotation à la réserve facultative (AGO)", v: 12000 },
      { label: "Solde attribuable aux associés (superdividende)", v: 34670, hint: "55 670 − 9 000 − 12 000" },
      { label: "Superdividende unitaire, arrondi à l'euro inférieur", v: 34, hint: "34 670 ÷ 1 000 = 34,67 → 34 €" },
      { label: "Total distribué", v: 34000, hint: "34 € × 1 000 parts" },
      { label: "Nouveau report à nouveau", v: 670, hint: "34 670 − 34 000 (l'arrondi retourne en report)", hl: 1 }
    ],
    journals: [
      { id: "od", title: "Écriture d'affectation du résultat — AGO du 08/06/2023",
        lines: [
          { acc: "120000", d: 56000 }, { acc: "110000", d: 2600 },
          { acc: "106100", c: 2930 }, { acc: "106300", c: 9000 }, { acc: "106800", c: 12000 },
          { acc: "457000", c: 34000 }, { acc: "110000", c: 670 }
        ],
        why: "Contrôle : 2 930 + 9 000 + 12 000 + 34 000 + 670 = 58 600 = 56 000 + 2 600. Capitaux propres après répartition : capital 300 000 ; réserve légale 20 930 ; réserve statutaire 9 000 ; réserve facultative 35 000 ; report à nouveau 670." }
    ]
  };

  /* ===== Quiz final ===== */
  var quiz = [
    { q: "Qui approuve les comptes et décide de l'affectation du résultat ?", o: ["Le dirigeant seul", "L'assemblée générale ordinaire (AGO)", "L'expert-comptable", "Le commissaire aux comptes"], a: 1,
      e: "C'est l'AGO qui approuve les comptes et vote l'affectation. Les écritures d'affectation sont donc passées à la date de la décision de l'AGO." },
    { q: "Dans quel délai l'AGO doit-elle en principe statuer sur les comptes ?", o: ["Sous 1 mois", "Sous 3 mois", "Dans les 6 mois de la clôture de l'exercice", "Dans les 2 ans"], a: 2,
      e: "Dans les six mois suivant la clôture (prolongation possible par décision de justice). Pour un exercice clos au 31/12, c'est au plus tard le 30 juin." },
    { q: "Quel prélèvement la réserve légale impose-t-elle ?", o: ["10 % du bénéfice, sans limite", "5 % du bénéfice (après report), jusqu'à 10 % du capital", "5 % du chiffre d'affaires", "10 % du capital chaque année"], a: 1,
      e: "5 % du bénéfice diminué des pertes antérieures et augmenté du report créditeur, jusqu'à ce que la réserve atteigne 10 % du capital." },
    { q: "Capital 200 000 €, réserve légale 19 000 €, bénéfice 40 000 €, report à nouveau nul. Quelle dotation à la réserve légale ?", o: ["2 000 €", "1 000 €", "0 €", "4 000 €"], a: 1,
      e: "5 % × 40 000 = 2 000, mais il ne reste que 20 000 − 19 000 = 1 000 à doter : la dotation est plafonnée à 1 000 €." },
    { q: "Résultat 128 000 €, report à nouveau DÉBITEUR de 3 500 €. Quelle est la base de calcul de la réserve légale ?", o: ["131 500 €", "128 000 €", "124 500 €", "3 500 €"], a: 2,
      e: "La perte antérieure est imputée en priorité : 128 000 − 3 500 = 124 500 €." },
    { q: "Quel compte enregistre les dividendes votés mais pas encore payés ?", o: ["455 Associés – comptes courants", "457 Associés – dividendes à payer", "512 Banque", "106 Réserves"], a: 1,
      e: "On crédite le 457 lors de l'affectation, puis on le débite par le crédit du 512 lors du paiement." },
    { q: "Comment constate-t-on une PERTE de l'exercice lors de l'affectation ?", o: ["Débit 119 Report à nouveau (solde débiteur) / Crédit 129 Résultat (perte)", "Débit 129 / Crédit 119", "Débit 106 / Crédit 129", "Aucune écriture"], a: 0,
      e: "La perte est reportée : on la sort du résultat (crédit 129) et on la constate en report à nouveau débiteur (débit 119)." },
    { q: "Quelle formule donne le bénéfice distribuable ?", o: ["Résultat − réserve légale − réserve statutaire + report à nouveau créditeur (après imputation des pertes antérieures)", "Résultat + toutes les réserves", "Résultat − impôt", "Capital + résultat"], a: 0,
      e: "Bénéfice après impôt, après imputation des pertes antérieures, moins les réserves obligatoires (légale, statutaire), plus le report à nouveau créditeur." },
    { q: "Vrai ou faux : la rémunération du compte courant d'associé se prélève sur le bénéfice distribuable.", o: ["Vrai", "Faux : c'est une charge financière (compte 6615), pas une affectation"], a: 1,
      e: "Les intérêts de compte courant sont une charge de l'exercice (661500 / banque ou 455). Ils ne passent pas par la répartition du bénéfice." },
    { q: "Niveau GCF — Une société distribue un dividende alors que ses comptes ne dégagent aucun bénéfice distribuable. De quoi s'agit-il ?", o: ["D'un dividende exceptionnel, parfaitement licite", "D'un dividende fictif : irrégulier et pénalement sanctionné pour les dirigeants", "D'un acompte sur dividende", "D'une réduction de capital"], a: 1,
      e: "Distribuer sans bénéfice distribuable est un dividende fictif (délit pour les dirigeants, art. L241-3 et L242-6 du Code de commerce). Les sommes pourront être réclamées aux associés." },
    { q: "Niveau GCF — Statuts de la SA Delec 2000 : « premier dividende de 5 % du capital ». Capital 7 500 000 €. Quel premier dividende ?", o: ["150 000 €", "375 000 €", "750 000 €", "395 000 €"], a: 1,
      e: "5 % × 7 500 000 = 375 000 €. Le reliquat (970 000 − 200 000 − 375 000 = 395 000 €) reste à la disposition de l'AGO : superdividende, réserves ou report." },
    { q: "Niveau GCF — La holding AEL, actionnaire unique à 100 %, reçoit les dividendes de SETAK (SAS). Quel régime fiscal s'applique en principe côté holding ?", o: ["Imposition normale de la totalité à l'IS", "Régime mère-fille : dividende exonéré, sauf quote-part de frais et charges de 5 % réintégrée", "Exonération totale sans aucun retraitement", "Imposition à 30 % (PFU)"], a: 1,
      e: "Participation d'au moins 5 % détenue depuis 2 ans (ou engagement de conservation) : exonération d'IS, avec réintégration extra-comptable d'une quote-part de frais et charges de 5 % du dividende (art. 145 et 216 du CGI)." }
  ];

  return { lt: lt, ltj: ltj, A: A, B: B, C: C, D: D, quiz: quiz };
})();
