/* Module SCORM « Les emprunts » */
(function () {
  "use strict";
  var PASS = 70;

  /* plan comptable utile à ce module */
  E.ACC.length = 0;
  [["164000", "Emprunts auprès des établissements de crédit"], ["168800", "Intérêts courus sur emprunts"],
   ["512000", "Banque"], ["616000", "Primes d'assurances"], ["627000", "Services bancaires et assimilés"],
   ["661100", "Intérêts des emprunts et dettes"], ["276840", "Intérêts courus sur prêts"], ["762600", "Revenus des prêts"]]
    .forEach(function (a) { E.ACC.push(a); });

  /* énoncés téléchargeables */
  ["t1", "t2", "c1", "c2", "cC", "cD", "cE"].forEach(function (k) { E.docs[k] = "autoformation-enonces.pdf"; });
  ["i1", "i2", "i3"].forEach(function (k) { E.docs[k] = "icne-enonces.pdf"; });
  ["c3", "cA", "cB"].forEach(function (k) { E.docs[k] = "cas-emprunts.docx"; });
  E.docs.e7 = "autoformation-enonces.pdf";

  var f2 = function (n) { return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };

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
  function fld(id, label, val) { return '<label class="fld">' + label + '<input type="text" inputmode="decimal" class="amt calc" id="' + id + '" value="' + val + '"></label>'; }
  function tableHTML(rows, name, totals) {
    var h = '<div class="scroll"><table><thead><tr><th>Période</th><th class="num">Capital restant dû</th><th class="num">Intérêts</th><th class="num">Amortissement</th><th class="num">' + name + "</th></tr></thead><tbody>";
    rows.forEach(function (r) { h += "<tr><td>" + r.k + '</td><td class="num">' + f2(r.crd) + '</td><td class="num">' + f2(r.int) + '</td><td class="num">' + f2(r.am) + '</td><td class="num">' + f2(r.ann) + "</td></tr>"; });
    if (totals) {
      var t = function (k) { return rows.reduce(function (s, x) { return s + x[k]; }, 0); };
      h += '<tr class="tot"><td>Total</td><td></td><td class="num">' + f2(t("int")) + '</td><td class="num">' + f2(t("am")) + '</td><td class="num">' + f2(t("ann")) + "</td></tr>";
    }
    return h + "</tbody></table></div>";
  }
  function ex(id) { return E.exerciseHTML(id, DATA.X[id]); }

  var S = [];

  S.push({ t: "Bienvenue", r: function () {
    return '<h1>Les emprunts</h1>' +
      '<p class="lead">Une entreprise finance rarement un investissement avec sa seule trésorerie. Quel emprunt choisir, comment se rembourse-t-il, et comment l\'écrire en comptabilité jusqu\'à la clôture ?</p>' +
      '<div class="card yellow"><strong>Situation de départ.</strong> Votre entreprise veut acheter un nouveau local de 365 000 €. Une banque propose 6 % sur 4 ans, une autre 7 % sur 6 ans, tous deux en amortissements constants. Laquelle coûte le moins cher ? Et comment la comptabiliser le jour du déblocage, à chaque remboursement et au 31 décembre ?</div>' +
      '<h2>À la fin de ce module, vous saurez</h2><ul>' +
      '<li>distinguer les <strong>emprunts indivis et obligataires</strong> et les trois <strong>modalités de remboursement</strong> ;</li>' +
      '<li>construire un <strong>tableau d\'amortissement</strong>, quelle que soit la périodicité (annuelle, semestrielle, trimestrielle, mensuelle) ;</li>' +
      '<li>comptabiliser le <strong>déblocage</strong>, les <strong>remboursements</strong> et l\'<strong>assurance</strong> ;</li>' +
      '<li>calculer et comptabiliser les <strong>intérêts courus non échus</strong> (ICNE), puis les extourner ;</li>' +
      '<li><strong>comparer des offres</strong> de financement, y compris après impôt.</li></ul>' +
      '<div class="grid"><div class="sticker"><strong>Durée</strong><br>environ 2 heures</div>' +
      '<div class="sticker"><strong>Parcours</strong><br>10 étapes, dans l\'ordre ou à la carte</div>' +
      '<div class="sticker"><strong>Validation</strong><br>quiz final, réussite à partir de ' + PASS + ' %</div></div>' +
      '<div class="card"><strong>Comment s\'entraîner ?</strong> Les exercices se corrigent tout seuls. Pour les écritures, l\'<strong>ordre de vos lignes n\'a pas d\'importance</strong>. Vous pouvez télécharger l\'énoncé et une trame Excel, travailler hors du module, puis déposer votre fichier pour le faire corriger.</div>' +
      '<p><a class="btn alt" href="assets/enonces/cours-emprunts.pdf" download>⬇ Le cours en PDF</a></p>';
  } });

  S.push({ t: "Emprunts et modalités", r: function () {
    return '<h2>Les différents emprunts</h2>' +
      '<div class="grid"><div class="sticker"><strong>Emprunt indivis</strong><br>L\'emprunteur s\'adresse à <strong>un seul prêteur</strong> (le plus souvent une banque). C\'est le sujet de ce module.</div>' +
      '<div class="sticker"><strong>Emprunt obligataire</strong><br>Émis par une personne morale auprès d\'un <strong>grand nombre de créanciers</strong>, par fractionnement en obligations.</div></div>' +
      '<h3>Les caractéristiques d\'un emprunt</h3><ul><li>le <strong>montant</strong>,</li><li>le <strong>taux d\'intérêt</strong>,</li><li>la <strong>durée</strong>,</li>' +
      '<li>les <strong>modalités de remboursement</strong>, décrites dans le tableau d\'amortissement : pour chaque période, les <strong>intérêts</strong>, l\'<strong>amortissement</strong> (part du capital remboursée) et l\'<strong>annuité</strong> (intérêts + amortissement).</li></ul>' +
      '<h3>Les trois modalités de remboursement</h3>' +
      '<div class="grid"><div class="card"><strong>« In fine »</strong><br>Remboursement du capital <strong>en totalité au terme</strong>. Avant : seulement les intérêts.</div>' +
      '<div class="card"><strong>Amortissements constants</strong><br>Amortissement = V₀ ÷ n. L\'annuité <strong>diminue</strong> chaque période.</div>' +
      '<div class="card"><strong>Annuités constantes</strong><br>Annuité = V₀ × i ÷ (1 − (1 + i)<sup>−n</sup>). Les intérêts baissent, l\'amortissement <strong>augmente</strong>.</div></div>' +
      '<p class="small">V₀ = montant de l\'emprunt ; i = taux par période ; n = nombre de périodes.</p>' +
      '<div class="card yellow"><strong>Semestrialités, trimestrialités, mensualités</strong><br>Le calcul est identique, mais le <strong>taux est divisé</strong> par 2, 4 ou 12 et la <strong>durée en années est multipliée</strong> par 2, 4 ou 12. Exemple : 9 % sur 4 ans, remboursement mensuel → taux 0,75 % par mois, 48 mensualités.</div>' +
      mini("Un emprunt de 60 000 € à 6 % est remboursé par trimestrialités sur 5 ans. Quel taux et quel nombre de périodes ?", ["6 % et 5", "1,5 % et 20", "0,5 % et 60"], 1,
        "6 % ÷ 4 = 1,5 % par trimestre, et 5 ans × 4 = 20 trimestrialités.") +
      mini("Dans un emprunt in fine, l'annuité des premières années est égale…", ["aux intérêts seuls", "à capital ÷ durée", "à capital + intérêts"], 0,
        "Aucun capital n'est remboursé avant le terme : on ne paie que les intérêts, puis capital + intérêts à la dernière échéance.");
  } });

  S.push({ t: "Tableau d'amortissement", r: function () {
    var a = DATA.sched(100, 0.1, 4, "fine"), b = DATA.sched(100, 0.1, 4, "const"), c = DATA.sched(100, 0.1, 4, "annuite");
    return '<h2>Le tableau d\'amortissement</h2><p>Exemple du cours : emprunt de <strong>100</strong>, remboursable en <strong>4 ans</strong>, taux <strong>10 %</strong>. Voici les trois modalités.</p>' +
      tabs("am", [
        { t: "In fine", h: tableHTML(a, "Annuité", true) + '<p class="small">Intérêts : 100 × 10 % = 10 chaque année ; le capital est remboursé en totalité la 4e année (annuité de 110).</p>' },
        { t: "Amortissements constants", h: tableHTML(b, "Annuité", true) + '<p class="small">Amortissement : 100 ÷ 4 = 25. Intérêts calculés sur le capital restant dû en début d\'année.</p>' },
        { t: "Annuités constantes", h: tableHTML(c, "Annuité", true) + '<p class="small">A = 100 × 0,10 ÷ (1 − 1,10⁻⁴) = 31,55. Amortissement = annuité − intérêts.</p>' }
      ]) +
      '<div class="card yellow"><strong>La méthode, ligne par ligne</strong><ol class="steps">' +
      '<li><strong>Intérêts</strong> = capital restant dû en début de période × taux de la période.</li>' +
      '<li><strong>Amortissement</strong> : V₀ ÷ n (constants) ; annuité − intérêts (annuités constantes) ; 0, puis V₀ à la fin (in fine).</li>' +
      '<li><strong>Annuité</strong> = intérêts + amortissement.</li>' +
      '<li><strong>Capital restant dû suivant</strong> = capital restant dû − amortissement.</li></ol></div>' +
      '<h3>Simulateur</h3><p class="small">Modifiez les données pour générer n\'importe quel tableau.</p>' + simHTML() +
      '<h2>À vous de jouer</h2>' + ex("t1") + ex("t2");
  }, a: function () { sim(); } });

  function simHTML() {
    return '<div class="card"><div class="grid">' + fld("s_v", "Montant emprunté (€)", 35000) + fld("s_t", "Taux annuel (%)", 6.48) + fld("s_n", "Durée (années)", 5) +
      '<label class="fld">Remboursements par an<select id="s_p" class="calc"><option value="1">1 · annuel</option><option value="2">2 · semestriel</option><option value="4">4 · trimestriel</option><option value="12" selected>12 · mensuel</option></select></label>' +
      '<label class="fld">Modalité<select id="s_m" class="calc"><option value="annuite" selected>Annuités constantes</option><option value="const">Amortissements constants</option><option value="fine">In fine</option></select></label>' +
      '</div><div id="s_out" aria-live="polite"></div></div>';
  }
  function sim() {
    var o = document.getElementById("s_out"); if (!o) return;
    var g = function (id) { var v = E.parseNum(document.getElementById(id).value); return isNaN(v) ? 0 : v; };
    var V = g("s_v"), t = g("s_t") / 100, y = g("s_n"), p = parseInt(document.getElementById("s_p").value, 10), m = document.getElementById("s_m").value;
    var n = Math.round(y * p);
    if (V <= 0 || n < 1 || n > 360) { o.innerHTML = '<div class="fb info">Saisissez un montant positif et une durée raisonnable.</div>'; return; }
    var rows = DATA.sched(V, t / p, n, m);
    var tt = function (k) { return rows.reduce(function (s, x) { return s + x[k]; }, 0); };
    o.innerHTML = '<p>Taux par période : <strong>' + (t / p * 100).toLocaleString("fr-FR", { maximumFractionDigits: 4 }) + ' %</strong> · nombre de périodes : <strong>' + n + '</strong>' +
      (m === "annuite" ? ' · annuité constante : <strong>' + f2(rows[0].ann) + ' €</strong>' : "") + ' · total des intérêts : <strong>' + f2(tt("int")) + ' €</strong></p>' +
      '<div style="max-height:320px;overflow:auto">' + tableHTML(rows, "Remboursement", true) + "</div>";
  }

  S.push({ t: "Les écritures", r: function () {
    return '<h2>Comptabiliser l\'emprunt</h2>' +
      '<h3>1) Le déblocage des fonds</h3><p>À la date du versement, au journal de banque :</p>' +
      '<div class="scroll"><table><thead><tr><th>Compte</th><th class="num">Débit</th><th class="num">Crédit</th></tr></thead><tbody>' +
      '<tr><td>512000 Banque</td><td class="num">X</td><td></td></tr><tr><td>164000 Emprunts auprès des établissements de crédit</td><td></td><td class="num">X</td></tr></tbody></table></div>' +
      '<h3>2) Chaque remboursement</h3><p>Annuité (ou mensualité, trimestrialité) = amortissement + intérêts <em>(+ parfois assurance)</em>. Au journal de banque :</p>' +
      '<div class="scroll"><table><thead><tr><th>Compte</th><th class="num">Débit</th><th class="num">Crédit</th></tr></thead><tbody>' +
      '<tr><td>164000 Emprunts auprès des établissements de crédit</td><td class="num">amortissement</td><td></td></tr>' +
      '<tr><td>661100 Intérêts des emprunts</td><td class="num">intérêts</td><td></td></tr>' +
      '<tr><td>616000 Primes d\'assurances</td><td class="num">assurance</td><td></td></tr>' +
      '<tr><td>512000 Banque</td><td></td><td class="num">annuité</td></tr></tbody></table></div>' +
      '<h3>3) À la clôture</h3><ol class="steps">' +
      '<li><strong>Contrôler</strong> que le solde du compte 164000 correspond au capital restant dû du tableau remis par la banque à la même date. Sinon, chercher l\'erreur d\'enregistrement.</li>' +
      '<li><strong>Constater les intérêts courus non échus</strong> (étape suivante du module) : principe de rattachement des charges à l\'exercice.</li></ol>' +
      mini("Une annuité de 7 235,94 € comprend 1 796,88 € d'intérêts. Quel débit porte le compte 164000 ?", ["1 796,88 €", "5 439,06 €", "7 235,94 €"], 1,
        "Amortissement = annuité − intérêts = 7 235,94 − 1 796,88 = 5 439,06 €. La banque est créditée de 7 235,94 €.") +
      '<h2>Application guidée</h2><div class="card">Montant de l\'emprunt versé le <strong>14/09/N</strong> : <strong>15 000 €</strong>. Taux annuel : <strong>3,5 %</strong>. Remboursement par <strong>annuités constantes</strong> sur <strong>5 ans</strong>. Clôture au 31/12.<br>' +
      'Convention de calcul des intérêts courus : mois de 30 jours (année de 360 jours).</div>' + ex("e7") +
      gcf("Et la TVA ?", "<p>Un emprunt n'est pas une opération de livraison ni de prestation : <strong>aucune TVA</strong> sur le capital ni sur les intérêts. Elle ne concerne que l'investissement financé (le robot d'Amphénol, le local…).</p>");
  } });

  S.push({ t: "Intérêts courus (ICNE)", r: function () {
    return '<h2>Les intérêts courus non échus</h2>' +
      '<p>Une échéance tombe rarement le 31/12. Entre la <strong>dernière échéance payée</strong> et la <strong>clôture</strong>, des intérêts ont couru sans être payés : ce sont les <strong>ICNE</strong>. Par le principe d\'<strong>indépendance des exercices</strong>, ils appartiennent à l\'exercice qui se clôture.</p>' +
      '<div class="formula"><div class="l"><span>ICNE de l\'exercice</span><span>intérêts de la prochaine échéance × prorata temporis</span></div>' +
      '<div class="l"><span>Prorata temporis</span><span>durée écoulée depuis la dernière échéance ÷ durée de la période</span></div></div>' +
      '<h3>L\'écriture</h3><div class="scroll"><table><thead><tr><th>Date</th><th>Compte</th><th class="num">Débit</th><th class="num">Crédit</th></tr></thead><tbody>' +
      '<tr><td>31/12/N</td><td>661100 Intérêts des emprunts</td><td class="num">ICNE</td><td></td></tr>' +
      '<tr><td></td><td>168800 Intérêts courus</td><td></td><td class="num">ICNE</td></tr></tbody></table></div>' +
      '<p>Au <strong>1er jour de l\'exercice suivant</strong>, on <strong>extourne</strong> l\'écriture (écriture inverse). Ainsi, quand l\'échéance est payée, on enregistre la totalité des intérêts, sans doublon.</p>' +
      '<div class="card yellow"><strong>Exemple du cours.</strong> Mensualité du 15/01/24 : intérêts 763,52 €. Au 31/12/23, 16 jours sur 31 ont couru : 763,52 ÷ 31 × 16 = <strong>394,07 €</strong>. Débit 661100 / Crédit 168800 de 394,07 €.</div>' +
      gcf("Plusieurs conventions de prorata", "<p>Le contrat de prêt précise la convention : <strong>jours réels</strong> (sur 365 ou sur la durée de la période) ou <strong>mois de 30 jours</strong> (année de 360 jours). Les résultats diffèrent de quelques euros. Dans les exercices ci-dessous, les conventions usuelles sont acceptées ; l'important est de <strong>rester cohérent</strong> et de savoir <strong>justifier</strong> votre calcul.</p>") +
      '<h3>Quand c\'est vous le prêteur</h3><p>Si l\'entreprise a <strong>accordé</strong> un prêt (à un salarié, une filiale…), les intérêts courus sont un <strong>produit à recevoir</strong> : Débit <strong>276840</strong> Intérêts courus sur prêts / Crédit <strong>762600</strong> Revenus des prêts.</p>' +
      '<h3>Simulateur d\'ICNE</h3>' + icneCalcHTML() +
      '<h2>À vous de jouer</h2><p class="small">Les trois cas de l\'exercice « Intérêts courus non échus ».</p>' +
      tabs("icne", [
        { t: "Cas 1 · échéance annuelle", h: '<div class="card"><strong>Cas 1.</strong> Emprunt de <strong>105 000 €</strong>, taux <strong>3,25 %</strong>, durée <strong>15 ans</strong>, versé le <strong>01/10/N−3</strong>. Échéance annuelle de remboursement : <strong>30 septembre</strong>. Extrait du tableau, clôture au 31/12/N :' +
          '<div class="scroll"><table><thead><tr><th>Année</th><th class="num">Capital amorti</th><th class="num">Intérêts</th><th class="num">Capital restant dû</th><th class="num">Annuité</th></tr></thead><tbody>' +
          '<tr><td>N</td><td class="num">5 908,94</td><td class="num">3 046,36</td><td class="num">87 825,32</td><td class="num">8 955,30</td></tr>' +
          '<tr><td>N+1</td><td class="num">6 100,98</td><td class="num">2 854,32</td><td class="num">81 724,34</td><td class="num">8 955,30</td></tr></tbody></table></div>' +
          'Calculez les intérêts courus au 31/12/N sur la période du 01/10/N au 30/09/N+1.</div>' + ex("i1") },
        { t: "Cas 2 · mensualités", h: '<div class="card"><strong>Cas 2.</strong> La société Alpha clôture au <strong>31/12/N</strong>. Extrait du tableau d\'amortissement fourni par la banque :' +
          '<div class="scroll"><table><thead><tr><th>N°</th><th>Date</th><th class="num">Capital remboursé</th><th class="num">Intérêts</th><th class="num">Assurance</th><th class="num">Mensualité hors assurance</th></tr></thead><tbody>' +
          '<tr><td>24</td><td>5 déc. N</td><td class="num">17 306,04</td><td class="num">243,37</td><td class="num">41,67</td><td class="num">988,86</td></tr>' +
          '<tr><td>25</td><td>5 janv. N+1</td><td class="num">18 053,71</td><td class="num">241,19</td><td class="num">41,67</td><td class="num">988,86</td></tr></tbody></table></div>' +
          'Calculez les intérêts courus non échus au 31/12/N (hors assurance).</div>' + ex("i2") },
        { t: "Cas 3 · BNP et prêt salarié", h: '<div class="card"><strong>Cas 3.</strong> Clôture au <strong>31/12/23</strong>. <strong>Emprunt BNP</strong>, trimestrialités :' +
          '<div class="scroll"><table><thead><tr><th>Date</th><th class="num">Reste dû</th><th class="num">Remboursement</th><th class="num">Intérêts</th><th class="num">Trimestrialité</th></tr></thead><tbody>' +
          '<tr><td>01/12/2023</td><td class="num">326 250</td><td class="num">11 250</td><td class="num">2 447</td><td class="num">13 697</td></tr>' +
          '<tr><td>01/03/2024</td><td class="num">315 000</td><td class="num">11 250</td><td class="num">2 362</td><td class="num">13 612</td></tr></tbody></table></div>' +
          '<strong>Prêt consenti à un salarié</strong>, semestrialités :' +
          '<div class="scroll"><table><thead><tr><th>Date</th><th class="num">Reste dû</th><th class="num">Remboursement</th><th class="num">Intérêts</th></tr></thead><tbody>' +
          '<tr><td>01/08/2023</td><td class="num">50 000</td><td class="num">12 500</td><td class="num">625</td></tr>' +
          '<tr><td>01/02/2024</td><td class="num">37 500</td><td class="num">12 500</td><td class="num">469</td></tr></tbody></table></div>' +
          'Comptabilisez les intérêts courus des deux contrats.</div>' + ex("i3") }
      ]);
  }, a: function () { icneCalc(); } });

  function icneCalcHTML() {
    return '<div class="card"><div class="grid">' + fld("n_i", "Intérêts de la prochaine échéance (€)", 763.52) +
      '<label class="fld">Dernière échéance<input type="date" class="amt calc" id="n_a" value="2023-12-15"></label>' +
      '<label class="fld">Date de clôture<input type="date" class="amt calc" id="n_c" value="2023-12-31"></label>' +
      '<label class="fld">Prochaine échéance<input type="date" class="amt calc" id="n_b" value="2024-01-15"></label></div><div id="n_out" aria-live="polite"></div></div>';
  }
  function icneCalc() {
    var o = document.getElementById("n_out"); if (!o) return;
    var I = E.parseNum(document.getElementById("n_i").value), a = Date.parse(document.getElementById("n_a").value), c = Date.parse(document.getElementById("n_c").value), b = Date.parse(document.getElementById("n_b").value);
    if (isNaN(I) || isNaN(a) || isNaN(c) || isNaN(b) || !(a < c && c < b)) { o.innerHTML = '<div class="fb info">Renseignez des dates cohérentes : dernière échéance &lt; clôture &lt; prochaine échéance.</div>'; return; }
    var dd = function (x, y) { return Math.round((y - x) / 864e5); };
    var d360 = function (x, y) { var A = new Date(x), B = new Date(y), d1 = Math.min(A.getUTCDate(), 30), d2 = Math.min(B.getUTCDate(), 30); return (B.getUTCFullYear() - A.getUTCFullYear()) * 360 + (B.getUTCMonth() - A.getUTCMonth()) * 30 + d2 - d1; };
    var real = dd(a, c), per = dd(a, b), e = d360(a, c), ep = d360(a, b);
    o.innerHTML = '<table><thead><tr><th>Convention</th><th class="num">Prorata</th><th class="num">ICNE</th></tr></thead><tbody>' +
      '<tr><td>Jours réels sur la période</td><td class="num">' + real + " / " + per + '</td><td class="num">' + f2(I * real / per) + '</td></tr>' +
      '<tr><td>Mois de 30 jours</td><td class="num">' + e + " / " + ep + '</td><td class="num">' + f2(I * e / ep) + '</td></tr>' +
      '<tr><td>Jours réels sur 365 jours</td><td class="num">' + real + " / 365" + '</td><td class="num">' + f2(I * real / 365) + "</td></tr></tbody></table>";
  }

  S.push({ t: "Choisir son financement", r: function () {
    return '<h2>Comparer des offres de financement</h2>' +
      '<p>À montant égal, une offre se compare à son <strong>coût total</strong> : le <strong>total des intérêts</strong> (auquel s\'ajoutent l\'assurance et les frais). Mais les intérêts sont <strong>déductibles du résultat</strong> : le <strong>coût réel après impôt</strong> est plus faible.</p>' +
      '<div class="formula"><div class="l"><span>Coût réel après impôt</span><span>total des intérêts × (1 − taux d\'IS)</span></div>' +
      '<div class="l"><span>Économie d\'impôt</span><span>total des intérêts × taux d\'IS</span></div></div>' +
      '<div class="card yellow"><strong>Repères</strong><ul><li>À taux égal, plus la durée est longue, plus les intérêts totaux sont élevés.</li><li>À durée égale, les <strong>amortissements constants</strong> coûtent moins cher en intérêts que les <strong>annuités constantes</strong>, mais la charge de trésorerie est plus lourde au début.</li><li>L\'<strong>in fine</strong> est le plus coûteux : le capital reste dû en totalité jusqu\'au bout.</li></ul></div>' +
      tabs("ch", [
        { t: "Deux offres pour un local", h: '<div class="card"><strong>Local de 365 000 €.</strong> Financement 1 : 6 % l\'an, 4 ans, amortissements constants. Financement 2 : 7 % l\'an, 6 ans, amortissements constants. Présentez les deux plans et choisissez.</div>' + ex("c1") },
        { t: "Trois modalités", h: '<div class="card">Une société emprunte <strong>135 000 €</strong> au taux de <strong>5,75 %</strong> sur <strong>6 ans</strong>, remboursement <strong>semestriel</strong>. Comparez les trois modalités : in fine, amortissements constants, semestrialités constantes.</div>' + ex("c2") },
        { t: "Trois banques et l'IS", h: '<div class="card">Trois prêts de <strong>150 000 €</strong> : <strong>BNP</strong> 6 % sur 6 ans en annuités constantes ; <strong>CIC</strong> 7 % sur 5 ans en annuités constantes ; <strong>Crédit Agricole</strong> 6,5 % sur 4 ans en amortissements constants. Taux d\'IS : <strong>15 %</strong>. Justifiez votre choix.</div>' + ex("c3") }
      ]);
  } });

  S.push({ t: "Cas d'entraînement", r: function () {
    return '<h2>Cas complets</h2><p>Chaque cas associe tableau d\'amortissement et écritures, du déblocage à la clôture. Le prorata des intérêts courus accepte les conventions usuelles.</p>' +
      tabs("cas", [
        { t: "A · SIAB", h: '<div class="card"><strong>Cas SIAB.</strong> Vous établissez le tableau d\'emprunt ayant financé une machine, enregistrez le déblocage, puis calculez et enregistrez les intérêts courus (clôture le 31/12). Emprunt : <strong>55 000 €</strong> ; taux annuel : <strong>6,5 %</strong> ; durée : <strong>5 ans</strong> ; versé le <strong>01/05/N</strong> ; 1er remboursement le <strong>01/05/N+1</strong> ; <strong>amortissements constants</strong>.</div>' + ex("cA") },
        { t: "B · Amphénol", h: '<div class="card"><strong>Cas Amphénol.</strong> Achat d\'un robot industriel, <strong>126 960 € TTC</strong> (TVA 20 %). Emprunt bancaire : <strong>autofinancement exigé de 20 % du HT</strong>, <strong>4 ans</strong>, <strong>9 %</strong> l\'an, <strong>mensualités constantes</strong>, versé le <strong>15/07/N</strong>, 1re mensualité le 15/08/N. Déterminez le montant emprunté, présentez le tableau, enregistrez le déblocage, les mensualités jusqu\'au 31/12/N et les intérêts courus. Pour gagner du temps, enregistrez les mensualités du 15/08 et du 15/12.</div>' + ex("cB") },
        { t: "C · Annuités constantes", h: '<div class="card"><strong>Cas 2.</strong> Investissement de <strong>150 000 € HT</strong> financé par un emprunt au taux de <strong>4,5 %</strong> sur <strong>5 ans</strong>, <strong>annuités constantes</strong>. Fonds débloqués le <strong>10/06/N</strong>. Présentez le plan, enregistrez le déblocage, la 1re échéance du 10/06/N+1 et les intérêts courus au 31/12/N+1 (mois de 30 jours).</div>' + ex("cC") },
        { t: "D · Trimestrialités", h: '<div class="card"><strong>Cas 4.</strong> Machine de <strong>125 000 € HT</strong> sur <strong>5 ans</strong>. Emprunt à <strong>trimestrialités constantes</strong> au taux de <strong>5,75 %</strong> l\'an, versé le <strong>20/02/N</strong>. Présentez le plan, enregistrez le déblocage, les 3 trimestrialités de N (20/05, 20/08, 20/11) et les intérêts courus au 31/12/N.</div>' + ex("cD") },
        { t: "E · Mensualités", h: '<div class="card"><strong>Cas 8.</strong> Emprunt de <strong>35 000 €</strong> en N, taux <strong>mensuel</strong> de <strong>0,54 %</strong>, <strong>mensualités constantes</strong>, durée <strong>5 ans</strong>. La 1re mensualité est remboursée le <strong>08/10/N</strong>. Calculez la mensualité, comptabilisez les mensualités de N et les intérêts courus au 31/12/N.</div>' + ex("cE") }
      ]);
  } });

  S.push({ t: "Aller plus loin", r: function () {
    return '<h2>Aller plus loin</h2>' +
      gcf("Taux proportionnel ou taux équivalent ?", "<p>Dans ce module, le taux mensuel est <strong>proportionnel</strong> (9 % ÷ 12 = 0,75 %). Une banque peut aussi utiliser le taux <strong>équivalent</strong> : (1,09)<sup>1/12</sup> − 1 ≈ 0,7207 % par mois. Le contrat précise la méthode, et le <strong>TEG / TAEG</strong> intègre en plus l'assurance et les frais.</p>") +
      gcf("Frais de dossier, garanties et assurance", "<p>L'<strong>assurance emprunteur</strong> est une prime d'assurance (616000). Les <strong>frais de dossier</strong> et de garantie sont des frais bancaires (627000), ou peuvent être étalés sur la durée de l'emprunt selon l'option retenue par l'entreprise. Vérifiez le traitement retenu par le dossier de la société avant de comptabiliser.</p>") +
      gcf("Dettes à moins d'un an et informations en annexe", "<p>Une partie de chaque emprunt est remboursable dans l'année. Le solde du 164000 reste unique en comptabilité, mais l'<strong>échéancier des dettes</strong> (à moins d'un an, de 1 à 5 ans, à plus de 5 ans) doit être renseigné : état des échéances des créances et des dettes de la liasse fiscale (2057) et annexe.</p>") +
      gcf("Emprunt obligataire", "<p>Il se comptabilise en compte <strong>163</strong>. Le plus souvent, le <strong>prix d'émission est inférieur à la valeur nominale</strong> et le <strong>prix de remboursement supérieur au prix d'émission</strong> : la différence constitue une <strong>prime de remboursement</strong> (compte 169), amortie sur la durée de l'emprunt.</p>") +
      gcf("Incidence fiscale", "<p>Les intérêts d'emprunt sont des charges déductibles du résultat fiscal. Le coût réel après impôt d'un prêt est donc <strong>intérêts × (1 − taux d'IS)</strong>. Certaines limitations existent, par exemple pour les <strong>intérêts de comptes courants d'associés</strong> (plafond de taux) ou la <strong>limitation générale des charges financières</strong>.</p>") +
      gcf("Remboursement anticipé et différé", "<p>Un <strong>différé d'amortissement</strong> repousse le capital mais pas les intérêts. Un <strong>remboursement anticipé</strong> donne lieu à une indemnité, comptabilisée en charge financière. Dans les deux cas, le tableau d'amortissement de la banque fait foi.</p>") +
      '<p class="small">Les références comptables et fiscales de cette page sont données à titre de repère : contrôlez-les dans votre documentation à jour avant toute utilisation professionnelle.</p>';
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
      '<div class="formula"><div class="l"><span>Taux par période</span><span>taux annuel ÷ 2, 4 ou 12</span></div>' +
      '<div class="l"><span>Nombre de périodes</span><span>années × 2, 4 ou 12</span></div>' +
      '<div class="l"><span>Intérêts</span><span>capital restant dû × taux de la période</span></div>' +
      '<div class="l"><span>Amortissements constants</span><span>V₀ ÷ n</span></div>' +
      '<div class="l"><span>Annuités constantes</span><span>V₀ × i ÷ (1 − (1 + i)<sup>−n</sup>)</span></div>' +
      '<div class="l"><span>ICNE</span><span>intérêts de l\'échéance suivante × prorata temporis</span></div>' +
      '<div class="l tot"><span>Coût réel après impôt</span><span>intérêts × (1 − taux d\'IS)</span></div></div>' +
      '<div class="grid"><div class="sticker"><strong>Déblocage</strong><br>D 512000 / C 164000</div>' +
      '<div class="sticker"><strong>Remboursement</strong><br>D 164000 + 661100 (+ 616000) / C 512000</div>' +
      '<div class="sticker"><strong>ICNE</strong><br>D 661100 / C 168800, extourne au 1er jour</div>' +
      '<div class="sticker"><strong>Prêt consenti</strong><br>D 276840 / C 762600</div></div>' +
      '<div class="card yellow"><strong>Trois réflexes</strong><ol><li>Le solde du 164000 doit être égal au capital restant dû du tableau de la banque.</li><li>Capital et intérêts se séparent : seuls les intérêts sont une charge.</li><li>À la clôture, ne pas oublier les intérêts courus, puis les extourner.</li></ol></div>' +
      '<div class="row"><button class="btn alt" data-act="print">Imprimer cette fiche</button></div><p id="endmsg" class="lead"></p>';
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
    document.title = s.t + " — Les emprunts";
  }

  function gradeQuiz() {
    var ok = 0, n = DATA.quiz.length, unanswered = 0;
    DATA.quiz.forEach(function (q, i) {
      var sel = document.querySelector('input[name="q' + i + '"]:checked'), box = document.getElementById("q" + i), exb = box.querySelector(".ex");
      if (!sel) unanswered++;
      var good = sel && parseInt(sel.value, 10) === q.a;
      if (good) ok++;
      box.classList.toggle("good", !!good); box.classList.toggle("bad", !good);
      exb.innerHTML = (good ? '<span class="mark ok">✓ Juste.</span> ' : '<span class="mark ko">✗ Réponse attendue : ' + q.o[q.a] + ".</span> ") + q.e;
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
    var t = e.target.closest("[data-act]"); if (!t || (t.tagName === "INPUT" && t.type === "file")) return;
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
      case "chk-grid": E.checkGrid(t.getAttribute("data-ex"), parseInt(t.getAttribute("data-gi"), 10)); break;
      case "show-grid": E.showGrid(t.getAttribute("data-ex"), parseInt(t.getAttribute("data-gi"), 10)); break;
      case "chk-fields": E.checkFields(t.getAttribute("data-ex")); break;
      case "show-fields": E.showFields(t.getAttribute("data-ex")); break;
      case "chk-j": E.checkJournal(t.getAttribute("data-ex"), t.getAttribute("data-jid")); break;
      case "show-j": E.showJournal(t.getAttribute("data-ex"), t.getAttribute("data-jid")); break;
      case "trame": E.trame(t.getAttribute("data-ex")); break;
      case "add-row": E.addRow(t.getAttribute("data-j")); break;
      case "mini":
        var box = t.closest(".mini"), good = parseInt(t.getAttribute("data-i"), 10) === parseInt(box.getAttribute("data-ans"), 10), exm = box.querySelector(".ex");
        exm.innerHTML = (good ? '<span class="mark ok">✓ Exact.</span> ' : '<span class="mark ko">✗ Pas tout à fait.</span> ') + exm.getAttribute("data-ex");
        break;
      case "quiz": gradeQuiz(); break;
      case "print": window.print(); break;
    }
  });
  document.addEventListener("input", function (e) {
    if (e.target.classList.contains("calc")) { sim(); icneCalc(); }
    var jr = e.target.closest("table.jr"); if (jr) E.updateTotals(jr);
  });
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains("calc")) { sim(); icneCalc(); }
    if (t.getAttribute && t.getAttribute("data-act") === "upload" && t.files && t.files[0]) E.uploadCheck(t.getAttribute("data-ex"), t.files[0]);
    var jr = t.closest && t.closest("table.jr"); if (jr) E.updateTotals(jr);
  });

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
