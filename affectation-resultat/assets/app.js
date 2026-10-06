/* Module SCORM « L'affectation du résultat » */
(function () {
  "use strict";
  var PASS = 70, MOD_ID = "affectation";
  E.docs.lt = E.docs.ltj = "lise-tailor-sarl-application-4.docx";
  E.docs.cA = "lise-tailor-sas-application-2.docx";
  E.docs.cB = "setak-tp.docx";
  E.docs.cC = "sa-duke-application-2-bis.docx";
  E.docs.cD = "sarl-delon-application-1.docx";

  /* ---------- petits composants ---------- */
  function mini(q, opts, ans, expl) {
    var h = '<div class="q mini" data-ans="' + ans + '"><strong>' + q + '</strong><div class="row" style="margin-top:6px">';
    opts.forEach(function (o, i) { h += '<button class="btn alt" data-act="mini" data-i="' + i + '">' + o + "</button>"; });
    return h + '</div><div class="ex" aria-live="polite" data-ex="' + E.esc(expl) + '"></div></div>';
  }
  function gcf(t, body) { return '<div class="card gcf"><strong>' + t + "</strong>" + body + "</div>"; }
  function tabs(group, items) {
    var h = '<div class="tabs" role="tablist">';
    items.forEach(function (it, i) { h += '<button role="tab" aria-selected="' + (i === 0) + '" data-act="tab" data-g="' + group + '" data-i="' + i + '">' + it.t + "</button>"; });
    h += "</div>";
    items.forEach(function (it, i) { h += '<div class="panel" data-g="' + group + '" data-i="' + i + '"' + (i ? " hidden" : "") + ">" + it.h + "</div>"; });
    return h;
  }
  function fld(id, label, val) {
    return '<label class="fld">' + label + '<input type="text" inputmode="decimal" class="amt calc" id="' + id + '" value="' + val + '"></label>';
  }

  /* ---------- sections ---------- */
  var S = [];

  S.push({ t: "Bienvenue", r: function () {
    return '<h1>L\'affectation du résultat</h1>' +
      '<p class="lead">Chaque année, l\'entreprise a gagné (ou perdu) de l\'argent. <strong>Que devient ce résultat ?</strong> Qui décide, combien peut-on distribuer, et comment l\'écrire en comptabilité ?</p>' +
      '<div class="card yellow"><strong>Situation de départ.</strong> La société Poitrenaud (capital 1 000 000 €, 10 000 titres de 100 €) dégage un bénéfice de 128 000 € après impôt. Ses associés attendent des dividendes… mais la loi impose d\'abord de mettre de l\'argent de côté. Combien ira où ?</div>' +
      '<h2>À la fin de ce module, vous saurez</h2><ul>' +
      '<li>expliquer <strong>qui décide</strong> de l\'affectation et dans quel cadre juridique ;</li>' +
      '<li>calculer la <strong>réserve légale</strong> (avec son plafond) et le <strong>bénéfice distribuable</strong> ;</li>' +
      '<li>construire le <strong>tableau de répartition</strong> du résultat ;</li>' +
      '<li>passer les <strong>écritures</strong> d\'affectation, de paiement des dividendes et de rémunération du compte courant ;</li>' +
      '<li>présenter les <strong>capitaux propres avant et après répartition</strong>.</li></ul>' +
      '<div class="grid"><div class="sticker"><strong>Durée</strong><br>environ 1 h 30</div>' +
      '<div class="sticker"><strong>Parcours</strong><br>10 étapes, dans l\'ordre ou à la carte</div>' +
      '<div class="sticker"><strong>Validation</strong><br>quiz final, réussite à partir de ' + PASS + ' %</div></div>' +
      '<div class="card"><strong>Comment s\'entraîner ?</strong> Les exercices se corrigent tout seuls. Pour les écritures, l\'<strong>ordre de vos lignes n\'a pas d\'importance</strong>. Vous pouvez aussi déposer votre fichier Excel pour le faire corriger.</div>';
  } });

  S.push({ t: "Le cadre juridique", r: function () {
    return '<h2>Les obligations juridiques</h2>' +
      '<p>Lorsqu\'un associé ou un actionnaire investit dans une société, quel que soit son statut, la rentabilité de ses titres repose sur deux critères :</p>' +
      '<div class="grid"><div class="sticker">L\'<strong>espérance d\'une plus-value</strong> : la valeur des titres augmente dans le temps, on gagne à la revente.</div>' +
      '<div class="sticker">Le <strong>meilleur rendement possible</strong> : des dividendes aussi élevés que possible à la fin de chaque exercice.</div></div>' +
      '<h3>Le calendrier d\'un exercice clos au 31/12</h3><ol class="steps">' +
      '<li><strong>31/12 — Clôture</strong> : les travaux d\'inventaire sont terminés, le résultat est connu.</li>' +
      '<li><strong>Arrêté des comptes</strong> par la direction, rédaction du rapport de gestion et de la proposition d\'affectation.</li>' +
      '<li><strong>AGO — au plus tard le 30/06</strong> : les associés approuvent les comptes et <em>votent</em> l\'affectation.</li>' +
      '<li><strong>Écritures d\'affectation</strong>, datées de la décision de l\'AGO.</li>' +
      '<li><strong>Paiement des dividendes</strong>, dans les délais fixés par l\'AGO.</li></ol>' +
      gcf("Qui décide, avec quoi, dans quel délai ?",
        "<ul><li>Les comptes sont approuvés par l'<strong>AGO</strong> dans les <strong>6 mois</strong> de la clôture (art. L223-26 pour la SARL, L225-100 pour la SA).</li>" +
        "<li>La <strong>réserve légale</strong> est obligatoire en SARL et en SA (art. L232-10). En SAS, elle n'est pas imposée par la loi : elle dépend des statuts ou d'une décision des associés. Dans les énoncés que vous allez traiter, elle est appliquée.</li>" +
        "<li>Le dividende est un <strong>droit né de la décision de l'AGO</strong> : tant que l'AGO n'a pas voté, il n'est pas dû. C'est pourquoi on n'enregistre l'affectation qu'à ce moment-là.</li>" +
        "<li>Seul un <strong>bénéfice distribuable</strong> peut être distribué : sinon, c'est un dividende fictif, sanctionné pénalement pour les dirigeants (art. L241-3 SARL, L242-6 SA).</li></ul>") +
      mini("À quelle date comptabilise-t-on les dividendes ?", ["Au 31/12", "À la date de l'AGO", "Le jour du virement"], 1,
        "Le droit au dividende naît de la décision de l'AGO : c'est à cette date que l'on crédite le 457 « Dividendes à payer ». Le virement ne vient qu'ensuite.");
  } });

  S.push({ t: "Le bénéfice distribuable", r: function () {
    var cards = [
      ["1061", "Réserve légale", "5 % du bénéfice à affecter dans une réserve, dans la limite de 10 % du capital social."],
      ["1063", "Réserve statutaire", "Son affectation est obligatoire dès l'instant où les statuts en précisent les modalités."],
      ["110", "Report à nouveau créditeur", "Faibles sommes issues des arrondis antérieurs, ou part du bénéfice antérieur mise en réserve."],
      ["119", "Report à nouveau débiteur", "Pertes antérieures, imputées en priorité sur le bénéfice comptable."]
    ];
    var h = '<h2>Le calcul du bénéfice distribuable</h2>' +
      '<div class="formula" role="group" aria-label="Formule du bénéfice distribuable">' +
      '<div class="l"><span>Bénéfice comptable après impôts <small>et après imputation des déficits antérieurs</small></span><span></span></div>' +
      '<div class="l"><span>− Affectation obligatoire à la <strong>réserve légale</strong></span><span></span></div>' +
      '<div class="l"><span>− Affectation contractuelle à la <strong>réserve statutaire</strong></span><span></span></div>' +
      '<div class="l"><span>+ <strong>Report à nouveau</strong> créditeur</span><span></span></div>' +
      '<div class="l tot"><span>= Bénéfice distribuable</span><span></span></div></div>' +
      '<p class="small">Cliquez sur une carte pour la retourner.</p><div class="grid flip">';
    cards.forEach(function (c) {
      h += '<div><button data-act="flip" aria-pressed="false"><span class="front"><span class="acc">' + c[0] + "</span>" + c[1] + '<br><span class="small">cliquer pour la définition</span></span><span class="back"><strong>' + c[1] + "</strong><br>" + c[2] + "</span></button></div>";
    });
    h += "</div>" +
      gcf("Distribuable ≠ bénéfice de l'année",
        "<ul><li>Le dividende peut aussi être prélevé sur des <strong>réserves disponibles</strong> (autres que légale et statutaire), si l'AGO le décide expressément.</li>" +
        "<li>Les statuts peuvent prévoir un <strong>premier dividende</strong> (par exemple 5 % du capital) puis un <strong>superdividende</strong> sur le reliquat : c'est le cas de la SA Delec 2000 et de la SARL Delon.</li>" +
        "<li>Un <strong>acompte sur dividende</strong> peut être versé avant l'approbation des comptes, sous conditions strictes (bilan certifié, bénéfice réalisé depuis la dernière clôture).</li></ul>") +
      "<h3>À vous : associez chaque situation à son compte</h3>" + assocHTML();
    return h;
  } });

  var ASSOC = [
    ["Mise en réserve obligatoire de 5 % du bénéfice", "106100"],
    ["Réserve prévue par les statuts", "106300"],
    ["Réserve décidée librement par l'AGO", "106800"],
    ["Bénéfice reporté sur l'exercice suivant", "110000"],
    ["Pertes antérieures non encore absorbées", "119000"],
    ["Bénéfice de l'exercice, avant répartition", "120000"],
    ["Dividendes votés, pas encore payés", "457000"]
  ];
  function assocHTML() {
    var opts = '<option value="">— choisir —</option>' + E.ACC.map(function (a) { return '<option value="' + a[0] + '">' + a[0] + " " + a[1] + "</option>"; }).join("");
    var h = '<div class="scroll"><table><tbody>';
    ASSOC.forEach(function (a, i) { h += '<tr><td><label for="as' + i + '">' + a[0] + '</label></td><td><select id="as' + i + '" data-as="' + i + '">' + opts + "</select></td></tr>"; });
    return h + '</tbody></table></div><div class="row"><button class="btn" data-act="assoc">Vérifier</button></div><div id="assoc_fb" aria-live="polite"></div>';
  }

  S.push({ t: "La réserve légale", r: function () {
    var ex = tabs("poit", [
      { t: "Cas 1 — report débiteur", h:
        '<p>Report à nouveau <strong>débiteur</strong> de 3 500 € : il vient en <em>déduction</em> du résultat.</p>' +
        '<table><tr><th>Éléments</th><th class="num">Montant</th></tr><tr><td>Capital social</td><td class="num">1 000 000</td></tr><tr><td>Report à nouveau</td><td class="num">− 3 500</td></tr><tr><td>Résultat comptable N</td><td class="num">128 000</td></tr><tr class="tot"><td>Base de calcul de la réserve légale</td><td class="num">124 500</td></tr></table>' +
        '<table><tr><th>Calcul</th><th class="num">Cas 1</th></tr><tr><td>Plafond (capital × 10 %)</td><td class="num">100 000</td></tr><tr><td>Cumul avant répartition</td><td class="num">90 000</td></tr><tr class="hl"><td>Reste à doter</td><td class="num">10 000</td></tr><tr><td>5 % × 124 500</td><td class="num">6 225</td></tr><tr class="tot"><td>Dotation N (entièrement dotée)</td><td class="num">6 225</td></tr><tr><td>Cumul après répartition</td><td class="num">96 225</td></tr></table>' },
      { t: "Cas 2 — report créditeur", h:
        '<p>Report à nouveau <strong>créditeur</strong> de 5 000 € : il vient en <em>addition</em> du résultat.</p>' +
        '<table><tr><th>Éléments</th><th class="num">Montant</th></tr><tr><td>Capital social</td><td class="num">1 000 000</td></tr><tr><td>Report à nouveau</td><td class="num">+ 5 000</td></tr><tr><td>Résultat comptable N</td><td class="num">128 000</td></tr><tr class="tot"><td>Base de calcul de la réserve légale</td><td class="num">133 000</td></tr></table>' +
        '<table><tr><th>Calcul</th><th class="num">Cas 2</th></tr><tr><td>Plafond (capital × 10 %)</td><td class="num">100 000</td></tr><tr><td>Cumul avant répartition</td><td class="num">95 000</td></tr><tr class="hl"><td>Reste à doter</td><td class="num">5 000</td></tr><tr><td>5 % × 133 000</td><td class="num">6 650</td></tr><tr class="tot"><td>Dotation N (plafonnée)</td><td class="num">5 000</td></tr><tr><td>Cumul après répartition</td><td class="num">100 000</td></tr></table>' +
        '<div class="sticker">5 % donnerait 6 650 €, mais il ne reste que <strong>5 000 €</strong> à doter : la dotation est <strong>plafonnée à 5 000 €</strong>.</div>' }
    ]);
    return '<h2>La réserve légale</h2>' +
      '<div class="card yellow"><strong>La règle en deux temps</strong><ol>' +
      '<li><strong>Base</strong> = résultat de l\'exercice <strong>±</strong> report à nouveau antérieur (− s\'il est débiteur, + s\'il est créditeur).</li>' +
      '<li><strong>Dotation</strong> = 5 % de la base, <strong>sans dépasser</strong> ce qui reste à doter : 10 % du capital − réserve légale déjà constituée.</li></ol></div>' +
      '<h3>Exemple : la société Poitrenaud</h3><p>Capital 1 000 000 €, bénéfice net d\'impôt 128 000 €, pas de réserve statutaire.</p>' + ex +
      '<h3>Simulateur</h3><p class="small">Changez les chiffres pour tester d\'autres situations (report débiteur : saisissez un nombre négatif).</p>' + calcHTML() +
      mini("Capital 40 000 €, réserve légale 2 000 €, résultat 134 600 €, report créditeur 15 000 €. La dotation est…", ["7 480 €", "2 000 €", "6 730 €"], 1,
        "5 % × 149 600 = 7 480 €, mais le plafond est 4 000 € et il y a déjà 2 000 € : il ne reste que 2 000 € à doter.") +
      gcf("Pièges classiques", "<ul><li>Oublier que le report à nouveau <strong>débiteur</strong> se déduit <em>avant</em> de calculer les 5 %.</li><li>Calculer 5 % sur le capital au lieu du bénéfice.</li><li>Continuer à doter une fois le plafond de 10 % atteint : la dotation est alors nulle.</li></ul>");
  }, a: function () { calc(); } });

  function calcHTML() {
    return '<div class="card"><div class="grid">' +
      fld("c_cap", "Capital social (€)", 1000000) + fld("c_rl", "Réserve légale avant répartition (€)", 90000) +
      fld("c_res", "Résultat de l'exercice (€)", 128000) + fld("c_ran", "Report à nouveau (± €)", -3500) +
      fld("c_stat", "Réserve statutaire à doter (€)", 0) + fld("c_fac", "Réserve facultative décidée par l'AGO (€)", 0) +
      '</div><div id="c_out" aria-live="polite"></div></div>';
  }
  function calc() {
    var g = function (id) { var el = document.getElementById(id); var v = el ? E.parseNum(el.value) : 0; return isNaN(v) ? 0 : v; };
    var o = document.getElementById("c_out"); if (!o) return;
    var cap = g("c_cap"), rl = g("c_rl"), res = g("c_res"), ran = g("c_ran"), st = g("c_stat"), fa = g("c_fac");
    var base = res + ran, plaf = cap * 0.1, reste = Math.max(0, plaf - rl), five = Math.max(0, base) * 0.05;
    var dot = Math.round(Math.min(five, reste) * 100) / 100, dist = base - dot - st, apres = dist - fa, f = E.fmt;
    o.innerHTML = '<table><tbody>' +
      '<tr><td>Base de calcul (résultat ± report)</td><td class="num">' + f(base) + '</td></tr>' +
      '<tr><td>Plafond de la réserve légale (10 % du capital)</td><td class="num">' + f(plaf) + '</td></tr>' +
      '<tr><td>Reste à doter (plafond − réserve déjà constituée)</td><td class="num">' + f(reste) + '</td></tr>' +
      '<tr><td>5 % de la base</td><td class="num">' + f(five) + '</td></tr>' +
      '<tr class="tot"><td>Dotation à la réserve légale ' + (five > reste ? "(plafonnée)" : "") + '</td><td class="num">' + f(dot) + '</td></tr>' +
      '<tr class="hl"><td>Bénéfice distribuable (base − réserve légale − réserve statutaire)</td><td class="num">' + f(dist) + '</td></tr>' +
      '<tr><td>Après réserve facultative : disponible pour dividendes et report</td><td class="num">' + f(apres) + '</td></tr></tbody></table>';
  }

  S.push({ t: "Le tableau de répartition", r: function () {
    return '<h2>Construire le tableau de répartition</h2>' +
      '<p>Toujours la même trame, dans le même ordre. Elle vous évite d\'oublier un plafond ou un report.</p><ol class="steps">' +
      '<li><strong>Base de la réserve légale</strong> : résultat ± report à nouveau antérieur.</li>' +
      '<li><strong>Dotation à la réserve légale</strong> : 5 %, dans la limite du reste à doter.</li>' +
      '<li><strong>Solde 1</strong> = base − réserve légale.</li>' +
      '<li><strong>Réserve statutaire</strong>, si les statuts la prévoient.</li>' +
      '<li><strong>Réserve facultative</strong>, si l\'AGO la décide.</li>' +
      '<li><strong>Dividendes</strong> = montant par titre × nombre de titres, ou premier dividende puis superdividende.</li>' +
      '<li><strong>Report à nouveau</strong> = ce qui reste.</li>' +
      '<li><strong>Contrôle</strong> : réserves + dividendes + report = base de départ.</li></ol>' +
      '<h3>Application : la SARL Lise Tailor</h3>' +
      '<div class="card">Capital <strong>300 000 €</strong> en <strong>3 000 parts</strong>, réparti entre Mme Lise Tailor (40 %), M. Dubois (35 %) et Mme Rey (25 %). Réserve légale avant affectation : <strong>24 000 €</strong>. Résultat N : <strong>120 000 €</strong>. Report à nouveau créditeur : <strong>15 000 €</strong>.<br>' +
      'L\'AGO du 30/06/N+1 décide : un <strong>dividende de 20 € par part</strong> ; le solde est reporté à nouveau.</div>' +
      E.exerciseHTML("lt", DATA.lt) +
      gcf("Avant / après répartition", "<p>Le bilan peut présenter les capitaux propres <strong>avant</strong> répartition (le résultat y figure encore) ou <strong>après</strong> répartition (le résultat est à zéro, les réserves et le report sont mis à jour, les dividendes passent en dettes). Les deux colonnes apparaissent dans le cas SA Delec 2000.</p>");
  } });

  S.push({ t: "Les écritures", r: function () {
    return '<h2>Comptabiliser l\'affectation</h2>' +
      '<h3>Résultat déficitaire</h3><div class="scroll"><table><thead><tr><th>Compte</th><th class="num">Débit</th><th class="num">Crédit</th></tr></thead><tbody>' +
      '<tr><td>119000 Report à nouveau (solde débiteur)</td><td class="num">X</td><td></td></tr><tr><td>129000 Résultat de l\'exercice (perte)</td><td></td><td class="num">X</td></tr></tbody></table></div>' +
      '<h3>Résultat bénéficiaire</h3><div class="scroll"><table><thead><tr><th>Compte</th><th class="num">Débit</th><th class="num">Crédit</th></tr></thead><tbody>' +
      '<tr><td>120000 Résultat de l\'exercice</td><td class="num">X</td><td></td></tr>' +
      '<tr><td>110000 Report à nouveau créditeur N-1</td><td class="num">X</td><td></td></tr>' +
      '<tr><td>119000 Report à nouveau (solde débiteur) N-1</td><td></td><td class="num">X</td></tr>' +
      '<tr><td>106100 Réserve légale</td><td></td><td class="num">X</td></tr>' +
      '<tr><td>106800 Autres réserves (facultatives)</td><td></td><td class="num">X</td></tr>' +
      '<tr><td>110000 Report à nouveau (créditeur)</td><td></td><td class="num">X</td></tr>' +
      '<tr><td>457000 Associés – Dividendes à payer</td><td></td><td class="num">X</td></tr></tbody></table></div>' +
      '<p class="small">On ne passe que les lignes utiles. Le total débit est toujours égal au résultat ± l\'ancien report à nouveau.</p>' +
      '<h3>Paiement des dividendes</h3><div class="scroll"><table><thead><tr><th>Compte</th><th class="num">Débit</th><th class="num">Crédit</th></tr></thead><tbody>' +
      '<tr><td>457000 Associés – Dividendes à payer</td><td class="num">X</td><td></td></tr><tr><td>512000 Banque</td><td></td><td class="num">X</td></tr></tbody></table></div>' +
      '<div class="card yellow">Les associés peuvent demander que leurs dividendes soient versés sur un <strong>compte courant</strong> ouvert à leur nom dans la société : on débite alors le 457000 en créditant le <strong>455000 Associé – compte courant</strong>. La société garde la trésorerie, mais ces sommes <strong>sont rémunérées</strong>.</div>' +
      '<h3>Rémunération d\'un compte courant d\'associé</h3><p>C\'est une <strong>charge financière</strong> de l\'exercice, <em>pas</em> une affectation du résultat : 661500 Intérêts des comptes courants et dépôts créditeurs / 512000 Banque.</p>' +
      gcf("Intérêts de compte courant : la limite fiscale", "<p>Ces intérêts ne sont déductibles que dans la limite d'un <strong>taux plafond publié chaque année</strong> et si le capital est entièrement libéré (art. 39-1-3° du CGI). Au-delà, l'excédent est réintégré au résultat fiscal.</p>") +
      '<h3>À vous : la SARL Lise Tailor, suite</h3><p>Passez les trois écritures avec les chiffres du tableau précédent (réserve légale 6 000 €, report à nouveau 69 000 €, dividendes 60 000 €). La rémunération du compte courant de M. Dubois est de 2 000 € (50 000 € × 4 %).</p>' +
      E.exerciseHTML("ltj", DATA.ltj);
  } });

  S.push({ t: "Cas d'entraînement", r: function () {
    function box(id, intro, ex) { return intro + E.exerciseHTML(id, ex); }
    return '<h2>Entraînez-vous sur des cas complets</h2><p>Quatre cas de difficulté croissante. Les cas C et D sont les plus complets.</p>' +
      tabs("cas", [
        { t: "A · Lise Tailor (SAS)", h: box("cA",
          '<div class="card"><strong>Application 2.</strong> SAS, capital <strong>50 000 €</strong> (5 000 actions). Réserve légale avant affectation : <strong>3 500 €</strong>. Report à nouveau <strong>débiteur</strong> : −1 200 €. Résultat N : <strong>124 600 €</strong>. Pas de réserve statutaire. AGO du 30/06/N+1 : réserve facultative de <strong>20 000 €</strong> et dividende de <strong>1,80 € par action</strong>.</div>', DATA.A) },
        { t: "B · SETAK (SAS)", h: box("cB",
          '<div class="card"><strong>TP.</strong> SAS SETAK, capital <strong>40 000 €</strong> en 4 000 parts, associée unique : la holding AEL. Résultat 2023 : <strong>134 600 €</strong>. Report à nouveau créditeur : <strong>15 000 €</strong>. Réserve légale antérieure : <strong>2 000 €</strong>. AGO du 30/06/2024 : réserve légale par prélèvement de 5 %, réserve facultative de <strong>10 000 €</strong>, dividende de <strong>15 € par part</strong>, solde en report à nouveau. Le compte courant d\'associé est créditeur de <strong>47 300 €</strong>, rémunéré à <strong>3,85 %</strong> (année pleine, sans mouvement). Dividendes payés le 17/07/2024, intérêts le 15/07/2024.</div>', DATA.B) },
        { t: "C · SA Duke", h: box("cC",
          '<div class="card gcf"><strong>Application 2 bis.</strong> SA DUKE, capital <strong>6 000 000 €</strong> en 20 000 actions de 300 €. Bénéfice de l\'exercice clos le 31/12/2022 : <strong>632 720 €</strong>. Réserve légale avant répartition : <strong>450 000 €</strong>. Report à nouveau <strong>débiteur</strong> : <strong>14 720 €</strong>. Réserve statutaire avant répartition : <strong>125 000 €</strong>.<br>Article 7 des statuts : « sur les bénéfices après prise en compte d\'un report à nouveau, il sera prélevé la réserve légale, une dotation à la réserve statutaire de 50 000 €, une réserve facultative par décision de l\'AGO ; le solde sera reporté à nouveau ».<br>L\'AGO du 30/06/2023 porte <strong>50 000 €</strong> en réserve facultative ; le dividende net doit être de <strong>24 € par action</strong>.</div>', DATA.C) },
        { t: "D · SARL Delon", h: box("cD",
          '<div class="card gcf"><strong>Application 1.</strong> SARL Delon peinture au 31/12/2022. Capital <strong>300 000 €</strong> (nominal 300 €). Réserve légale <strong>18 000 €</strong>, réserve facultative <strong>23 000 €</strong>, report à nouveau créditeur <strong>2 600 €</strong>, résultat <strong>56 000 €</strong>.<br>Statuts, art. 11 : « après affectation à la réserve légale, il sera prélevé sur le solde 3 % du capital social, porté en réserve statutaire. Le solde, après affectation à la réserve facultative, sera attribué aux associés à titre de superdividende ».<br>L\'AGO du 08/06/2023 : dotation à la réserve facultative de <strong>12 000 €</strong> ; superdividende unitaire arrondi à l\'euro inférieur.</div>', DATA.D) }
      ]);
  } });

  S.push({ t: "Aller plus loin", r: function () {
    return '<h2>Aller plus loin : le regard du gestionnaire comptable et fiscal</h2>' +
      gcf("Dividendes versés à une personne physique", "<p>Les dividendes sont imposés au <strong>prélèvement forfaitaire unique</strong> (12,8 % d'impôt sur le revenu + prélèvements sociaux), ou, sur option globale, au <strong>barème progressif</strong> après un abattement de 40 %. Le taux des prélèvements sociaux a évolué : vérifiez-le pour l'année concernée avant de calculer.</p>") +
      gcf("Dividendes versés à une société (régime mère-fille)", "<p>Si la mère détient au moins <strong>5 %</strong> du capital de la filiale, depuis 2 ans (ou s'engage à les conserver), le dividende est <strong>exonéré d'IS</strong>, sauf une <strong>quote-part de frais et charges de 5 %</strong> réintégrée extra-comptablement (art. 145 et 216 du CGI). C'est le cas de la holding AEL, associée unique de SETAK.</p>") +
      gcf("Dividende fictif et responsabilité", "<p>Distribuer sans bénéfice distribuable expose les dirigeants (délit, art. L241-3 et L242-6 du Code de commerce) et oblige les associés de mauvaise foi à restituer. Votre rôle : <strong>vérifier le calcul avant l'AGO</strong>.</p>") +
      gcf("Où retrouver l'affectation dans la liasse fiscale ?", "<p>Le tableau d'affectation du résultat figure sur l'imprimé <strong>2058-C</strong> (régime réel normal) : résultat, réserves, dividendes et report à nouveau doivent concorder avec votre tableau de répartition.</p>") +
      gcf("Acomptes sur dividendes", "<p>Versés avant l'approbation des comptes, ils exigent un <strong>bilan intermédiaire certifié</strong> faisant apparaître un bénéfice, après déduction des pertes antérieures et des réserves obligatoires. Ils s'imputent ensuite sur le dividende voté.</p>") +
      gcf("Premier dividende et superdividende", "<p>Cas <strong>SA Delec 2000</strong> : bénéfice 900 000 € + report 70 000 € = <strong>970 000 € distribuable</strong> (la réserve légale est déjà à 10 % du capital, donc aucune dotation). L'AGO dote 200 000 € de réserve facultative, verse un <strong>premier dividende de 5 % du capital</strong> (375 000 €), puis dispose du <strong>reliquat de 395 000 €</strong> : superdividende, réserves ou report.</p><p><a class=\"btn alt\" href=\"assets/enonces/sa-delec-2000-application-3.docx\" download>⬇ Énoncé complet SA Delec 2000 (Word)</a></p>") +
      '<p class="small">Les références légales sont données à titre de repère : contrôlez-les dans votre documentation à jour avant toute utilisation professionnelle.</p>';
  } });

  S.push({ t: "Quiz final", r: function () {
    var h = '<h2>Quiz final</h2><p>' + DATA.quiz.length + ' questions. Il faut <strong>' + PASS + ' %</strong> pour valider le module. Vous pouvez recommencer.</p><div id="quizbox">';
    DATA.quiz.forEach(function (q, i) {
      h += '<fieldset class="q" id="q' + i + '" style="border:2px solid var(--pink)"><legend><strong>' + (i + 1) + ". " + q.q + "</strong></legend>";
      q.o.forEach(function (o, j) { h += '<label><input type="radio" name="q' + i + '" value="' + j + '"> ' + o + "</label>"; });
      h += '<div class="ex"></div></fieldset>';
    });
    return h + '</div><div class="row"><button class="btn" data-act="quiz">Valider mes réponses</button></div><div id="quizres" aria-live="polite"></div>';
  } });

  S.push({ t: "À retenir", r: function () {
    return '<h2>À retenir</h2>' +
      '<div class="formula"><div class="l"><span>Base réserve légale</span><span>résultat ± report à nouveau</span></div>' +
      '<div class="l"><span>Réserve légale</span><span>5 % de la base, dans la limite de 10 % du capital</span></div>' +
      '<div class="l"><span>Bénéfice distribuable</span><span>base − réserve légale − réserve statutaire</span></div>' +
      '<div class="l"><span>Report à nouveau</span><span>ce qui reste après réserves et dividendes</span></div>' +
      '<div class="l tot"><span>Contrôle</span><span>réserves + dividendes + report = base</span></div></div>' +
      '<div class="grid"><div class="sticker"><strong>106100</strong><br>Réserve légale</div><div class="sticker"><strong>106300</strong><br>Réserve statutaire</div>' +
      '<div class="sticker"><strong>106800</strong><br>Autres réserves</div><div class="sticker"><strong>110000 / 119000</strong><br>Report à nouveau créditeur / débiteur</div>' +
      '<div class="sticker"><strong>120000 / 129000</strong><br>Résultat bénéfice / perte</div><div class="sticker"><strong>457000</strong><br>Dividendes à payer</div>' +
      '<div class="sticker"><strong>661500</strong><br>Intérêts de compte courant (charge)</div></div>' +
      '<div class="card yellow"><strong>Trois réflexes</strong><ol><li>Pas de dividende avant le vote de l\'AGO.</li><li>Le report à nouveau débiteur se déduit <em>avant</em> les 5 %.</li><li>Les intérêts de compte courant ne passent pas par l\'affectation.</li></ol></div>' +
      '<div class="row"><button class="btn alt" data-act="print">Imprimer cette fiche</button></div>' +
      '<p id="endmsg" class="lead"></p>';
  }, a: function () {
    var m = document.getElementById("endmsg");
    if (m) m.textContent = state.quiz && state.quiz.passed ? "Bravo, module validé avec " + state.quiz.score + " % !" : "Passez le quiz final pour valider le module.";
  } });

  /* ---------- état & suivi SCORM ---------- */
  var state = { cur: 0, vis: {}, quiz: null };
  var $main, $nav, $bar, $pct;

  function save() {
    SCORM.set("cmi.core.lesson_location", String(state.cur));
    SCORM.set("cmi.suspend_data", JSON.stringify({ c: state.cur, v: Object.keys(state.vis), q: state.quiz }));
    SCORM.commit();
  }
  function progress() { return Math.round(Object.keys(state.vis).length / S.length * 100); }

  function buildNav() {
    var h = "<ol>";
    S.forEach(function (s, i) { h += '<li><button data-act="go" data-i="' + i + '"><span class="n"><span>' + (i + 1) + "</span></span>" + s.t + "</button></li>"; });
    $nav.innerHTML = h + "</ol>";
  }
  function refreshNav() {
    $nav.querySelectorAll("button").forEach(function (b, i) {
      b.classList.toggle("done", !!state.vis[i]);
      if (i === state.cur) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    });
    var p = progress(); $bar.style.width = p + "%"; $pct.textContent = p + " %";
    $bar.parentNode.setAttribute("aria-valuenow", p);
  }
  function show(i) {
    i = Math.max(0, Math.min(S.length - 1, i));
    state.cur = i; state.vis[i] = 1;
    var s = S[i];
    $main.innerHTML = '<div id="content">' + s.r() + '</div><div class="pager">' +
      (i > 0 ? '<button class="btn alt" data-act="prev">← Précédent</button>' : "<span></span>") +
      (i < S.length - 1 ? '<button class="btn" data-act="next">Suivant →</button>' : "<span></span>") + "</div>";
    if (s.a) s.a();
    refreshNav(); save();
    window.scrollTo(0, 0); $main.focus({ preventScroll: true });
    document.title = s.t + " — L'affectation du résultat";
  }

  /* ---------- quiz ---------- */
  function gradeQuiz() {
    var ok = 0, n = DATA.quiz.length, unanswered = 0;
    DATA.quiz.forEach(function (q, i) {
      var sel = document.querySelector('input[name="q' + i + '"]:checked'), box = document.getElementById("q" + i), ex = box.querySelector(".ex");
      if (!sel) { unanswered++; }
      var good = sel && parseInt(sel.value, 10) === q.a;
      if (good) ok++;
      box.classList.toggle("good", !!good); box.classList.toggle("bad", !good);
      ex.innerHTML = (good ? '<span class="mark ok">✓ Juste.</span> ' : '<span class="mark ko">✗ Réponse attendue : ' + q.o[q.a] + ".</span> ") + q.e;
    });
    var score = Math.round(ok / n * 100), passed = score >= PASS;
    state.quiz = { score: score, passed: passed || (state.quiz && state.quiz.passed) };
    SCORM.set("cmi.core.score.min", "0"); SCORM.set("cmi.core.score.max", "100"); SCORM.set("cmi.core.score.raw", String(score));
    SCORM.set("cmi.core.lesson_status", state.quiz.passed ? "passed" : "failed");
    save();
    document.getElementById("quizres").innerHTML = '<div class="fb ' + (passed ? "ok" : "ko") + '"><span class="score">' + score + ' %</span><br>' +
      ok + " bonne(s) réponse(s) sur " + n + ". " + (unanswered ? unanswered + " question(s) sans réponse. " : "") +
      (passed ? "Module validé. Bravo !" : "Seuil de " + PASS + " % non atteint : relisez les corrections ci-dessus, puis revalidez.") + "</div>";
    refreshNav();
  }

  /* ---------- événements ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act]"); if (!t || t.tagName === "INPUT" && t.type === "file") return;
    var a = t.getAttribute("data-act");
    switch (a) {
      case "go": show(parseInt(t.getAttribute("data-i"), 10)); break;
      case "next": show(state.cur + 1); break;
      case "prev": show(state.cur - 1); break;
      case "tab":
        var g = t.getAttribute("data-g"), i = t.getAttribute("data-i");
        document.querySelectorAll('.tabs [data-g="' + g + '"]').forEach(function (b) { b.setAttribute("aria-selected", b === t); });
        document.querySelectorAll('.panel[data-g="' + g + '"]').forEach(function (p) { p.hidden = p.getAttribute("data-i") !== i; });
        break;
      case "flip": var on = t.classList.toggle("on"); t.setAttribute("aria-pressed", on); break;
      case "chk-fields": E.checkFields(t.getAttribute("data-ex")); break;
      case "show-fields": E.showFields(t.getAttribute("data-ex")); break;
      case "chk-j": E.checkJournal(t.getAttribute("data-ex"), t.getAttribute("data-jid")); break;
      case "show-j": E.showJournal(t.getAttribute("data-ex"), t.getAttribute("data-jid")); break;
      case "trame": E.trame(t.getAttribute("data-ex")); break;
      case "add-row": E.addRow(t.getAttribute("data-j")); break;
      case "mini":
        var box = t.closest(".mini"), good = parseInt(t.getAttribute("data-i"), 10) === parseInt(box.getAttribute("data-ans"), 10), ex = box.querySelector(".ex");
        ex.innerHTML = (good ? '<span class="mark ok">✓ Exact.</span> ' : '<span class="mark ko">✗ Pas tout à fait.</span> ') + ex.getAttribute("data-ex");
        break;
      case "assoc":
        var okc = 0;
        ASSOC.forEach(function (as, k) { var s = document.getElementById("as" + k), good2 = s.value === as[1]; s.classList.toggle("ok", good2); s.classList.toggle("ko", !good2); if (good2) okc++; });
        document.getElementById("assoc_fb").innerHTML = '<div class="fb ' + (okc === ASSOC.length ? "ok" : "ko") + '">' + okc + " bonne(s) association(s) sur " + ASSOC.length + (okc === ASSOC.length ? ". Parfait !" : ". Corrigez les lignes en rouge.") + "</div>";
        break;
      case "quiz": gradeQuiz(); break;
      case "print": window.print(); break;
    }
  });
  document.addEventListener("input", function (e) {
    if (e.target.classList.contains("calc")) calc();
    var jr = e.target.closest("table.jr"); if (jr) E.updateTotals(jr);
  });
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.getAttribute && t.getAttribute("data-act") === "upload" && t.files && t.files[0]) E.uploadCheck(t.getAttribute("data-ex"), t.files[0]);
    var jr = t.closest && t.closest("table.jr"); if (jr) E.updateTotals(jr);
  });

  /* ---------- démarrage ---------- */
  function start() {
    SCORM.init();
    $main = document.getElementById("main"); $nav = document.getElementById("nav"); $bar = document.getElementById("barfill"); $pct = document.getElementById("pct");
    $main.setAttribute("tabindex", "-1");
    try {
      var sd = JSON.parse(SCORM.get("cmi.suspend_data") || "{}");
      (sd.v || []).forEach(function (k) { state.vis[k] = 1; });
      if (sd.q) state.quiz = sd.q;
      if (typeof sd.c === "number") state.cur = sd.c;
    } catch (x) {}
    var st = SCORM.get("cmi.core.lesson_status");
    if (!st || st === "not attempted") SCORM.set("cmi.core.lesson_status", "incomplete");
    buildNav(); show(state.cur);
    function bye() { SCORM.set("cmi.core.exit", state.quiz && state.quiz.passed ? "" : "suspend"); SCORM.finish(); }
    window.addEventListener("pagehide", bye);
    window.addEventListener("beforeunload", bye);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
