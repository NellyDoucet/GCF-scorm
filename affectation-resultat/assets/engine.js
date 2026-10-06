/* Moteur d'exercices : champs chiffrés, écritures comptables (ordre des lignes libre), dépôt .xlsx */
var E = (function () {
  var reg = {};          // exercices enregistrés : id -> {fields:[], journals:[]}
  var TOL = 0.011;

  var ACC = [
    ["101000", "Capital"],
    ["106100", "Réserve légale"],
    ["106300", "Réserves statutaires"],
    ["106800", "Autres réserves (facultatives)"],
    ["110000", "Report à nouveau (solde créditeur)"],
    ["119000", "Report à nouveau (solde débiteur)"],
    ["120000", "Résultat de l'exercice (bénéfice)"],
    ["129000", "Résultat de l'exercice (perte)"],
    ["455000", "Associés – comptes courants"],
    ["457000", "Associés – dividendes à payer"],
    ["512000", "Banque"],
    ["661500", "Intérêts des comptes courants et dépôts créditeurs"]
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function parseNum(s) {
    if (typeof s === "number") return s;
    s = String(s == null ? "" : s).replace(/[\s  €]/g, "").replace(/[−–]/g, "-").replace(",", ".");
    if (!/^[-+]?\d*\.?\d+$/.test(s)) return NaN;
    return parseFloat(s);
  }
  function fmt(n) {
    var dec = Math.abs(n - Math.round(n)) < 0.005 ? 0 : 2;
    return n.toLocaleString("fr-FR", { minimumFractionDigits: dec, maximumFractionDigits: 2 });
  }
  function near(a, b, t) { return Math.abs(a - b) <= (t == null ? TOL : t); }
  function accName(code) { for (var i = 0; i < ACC.length; i++) if (ACC[i][0] === code) return ACC[i][1]; return ""; }

  function accEq(exp, got) {
    if (!got) return false;
    got = String(got).trim();
    if (got.length < 6) got = (got + "000000").slice(0, 6);
    var list = Array.isArray(exp) ? exp : [exp];
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.indexOf("457") === 0 && got.indexOf("457") === 0) return true;
      if (e === got) return true;
    }
    return false;
  }

  /* ---------- HTML ---------- */
  function fieldsHTML(id, fields) {
    var h = '<div class="scroll"><table><thead><tr><th>Éléments</th><th class="num">Votre réponse</th><th>Retour</th></tr></thead><tbody>';
    fields.forEach(function (f, i) {
      h += '<tr' + (f.hl ? ' class="hl"' : '') + '><td><label for="' + id + '_f' + i + '">' + f.label + '</label></td>' +
        '<td class="num"><input type="text" inputmode="decimal" autocomplete="off" class="amt" id="' + id + '_f' + i + '" data-ex="' + id + '" data-f="' + i + '"></td>' +
        '<td class="small" id="' + id + '_r' + i + '" aria-live="polite"></td></tr>';
    });
    h += '</tbody></table></div>' +
      '<div class="row"><button class="btn" data-act="chk-fields" data-ex="' + id + '">Vérifier le tableau</button>' +
      '<button class="btn alt" data-act="show-fields" data-ex="' + id + '">Voir la correction</button></div>' +
      '<div class="fb-zone" id="' + id + '_fb" aria-live="polite"></div>';
    return h;
  }

  function journalHTML(exId, j) {
    var jid = exId + "_" + j.id, n = j.rows || j.lines.length;
    var opts = '<option value="">— compte —</option>' + ACC.map(function (a) { return '<option value="' + a[0] + '">' + a[0] + ' ' + a[1] + '</option>'; }).join("");
    var h = '<h3>' + j.title + '</h3>' + (j.note ? '<p class="small">' + j.note + '</p>' : '') +
      '<div class="scroll"><table class="jr" id="' + jid + '"><thead><tr><th>Compte</th><th class="num">Débit</th><th class="num">Crédit</th></tr></thead><tbody>';
    for (var i = 0; i < n; i++) h += jrow(opts);
    h += '</tbody><tfoot><tr class="tot"><td>Totaux</td><td class="num" data-t="d">0</td><td class="num" data-t="c">0</td></tr></tfoot></table></div>' +
      '<div class="row"><button class="btn alt" data-act="add-row" data-j="' + jid + '">+ Ajouter une ligne</button>' +
      '<button class="btn" data-act="chk-j" data-ex="' + exId + '" data-jid="' + j.id + '">Vérifier l\'écriture</button>' +
      '<button class="btn alt" data-act="show-j" data-ex="' + exId + '" data-jid="' + j.id + '">Voir la correction</button></div>' +
      '<div class="fb-zone" id="' + jid + '_fb" aria-live="polite"></div>';
    return h;
  }
  function jrow(opts) {
    return '<tr><td><select aria-label="Compte">' + opts + '</select></td>' +
      '<td class="num"><input type="text" inputmode="decimal" class="amt" aria-label="Débit" data-side="d"></td>' +
      '<td class="num"><input type="text" inputmode="decimal" class="amt" aria-label="Crédit" data-side="c"></td></tr>';
  }
  function uploadHTML(id) {
    return '<div class="upl"><strong>Vous avez travaillé sur Excel ?</strong> Déposez votre fichier <code>.xlsx</code> : il est lu dans votre navigateur (rien n\'est envoyé) et corrigé quel que soit l\'ordre de vos lignes.' +
      '<div class="row" style="margin-top:8px"><input type="file" accept=".xlsx,.xlsm" data-act="upload" data-ex="' + id + '" aria-label="Déposer un fichier Excel"></div>' +
      '<p class="small">Pour les écritures, gardez des colonnes titrées « Débit » et « Crédit » et le numéro de compte à gauche.</p>' +
      '<div id="' + id + '_up" aria-live="polite"></div></div>';
  }
  function exerciseHTML(id, ex) {
    reg[id] = ex;
    var h = "";
    if (ex.fields && ex.fields.length) h += '<h3>Tableau de répartition</h3>' + fieldsHTML(id, ex.fields);
    (ex.journals || []).forEach(function (j) { h += journalHTML(id, j); });
    return h + uploadHTML(id);
  }

  /* ---------- corrections ---------- */
  function fb(el, cls, html) { el.className = "fb-zone"; el.innerHTML = '<div class="fb ' + cls + '">' + html + '</div>'; }

  function checkFields(id) {
    var ex = reg[id], ok = 0, tot = ex.fields.length;
    ex.fields.forEach(function (f, i) {
      var inp = document.getElementById(id + "_f" + i), r = document.getElementById(id + "_r" + i);
      var v = parseNum(inp.value), good = !isNaN(v) && near(v, f.v, f.tol);
      inp.classList.toggle("ok", good); inp.classList.toggle("ko", !good);
      r.innerHTML = good ? '<span class="mark ok">✓</span>' : '<span class="mark ko">✗</span> ' + (isNaN(v) ? "À compléter." : (f.hint || "À revoir."));
      if (good) ok++;
    });
    var z = document.getElementById(id + "_fb");
    fb(z, ok === tot ? "ok" : "ko", ok === tot ? "<strong>Bravo, tableau juste !</strong>" : ok + " ligne(s) juste(s) sur " + tot + ". Lisez les indices, corrigez, puis revérifiez.");
    return ok === tot;
  }
  function showFields(id) {
    reg[id].fields.forEach(function (f, i) {
      var inp = document.getElementById(id + "_f" + i);
      inp.value = fmt(f.v); inp.classList.add("ok"); inp.classList.remove("ko");
      document.getElementById(id + "_r" + i).innerHTML = f.how ? f.how : "";
    });
  }

  function readJournal(jid) {
    var out = [];
    document.querySelectorAll("#" + jid + " tbody tr").forEach(function (tr) {
      var acc = tr.querySelector("select").value, d = parseNum(tr.querySelector('[data-side="d"]').value), c = parseNum(tr.querySelector('[data-side="c"]').value);
      if (!acc && isNaN(d) && isNaN(c)) return;
      out.push({ acc: acc, d: isNaN(d) ? 0 : d, c: isNaN(c) ? 0 : c });
    });
    return out;
  }
  function compareJournal(exp, got) {
    var used = {}, missing = [], okc = 0;
    exp.forEach(function (e) {
      var side = e.d != null ? "d" : "c", other = side === "d" ? "c" : "d", amt = e[side], hit = -1;
      for (var i = 0; i < got.length; i++) {
        if (used[i]) continue;
        var g = got[i];
        if (accEq(e.acc, g.acc) && near(g[side], amt) && !(g[other] > 0)) { hit = i; break; }
      }
      if (hit < 0 && String(Array.isArray(e.acc) ? e.acc[0] : e.acc).indexOf("457") === 0) {
        /* dividendes ventilés par associé (457110, 457111…) : les lignes 457 se cumulent */
        var idx = [], sum = 0;
        got.forEach(function (g, i) { if (!used[i] && g.acc && String(g.acc).indexOf("457") === 0 && g[side] > 0 && !(g[other] > 0)) { idx.push(i); sum += g[side]; } });
        if (idx.length > 1 && near(sum, amt)) { idx.forEach(function (i) { used[i] = 1; }); okc++; return; }
      }
      if (hit >= 0) { used[hit] = 1; okc++; } else missing.push(e);
    });
    var extra = [];
    got.forEach(function (g, i) { if (!used[i]) extra.push(g); });
    return { ok: okc, missing: missing, extra: extra };
  }
  function journalFeedbackHTML(exp, got, res) {
    var td = 0, tc = 0; got.forEach(function (g) { td += g.d; tc += g.c; });
    if (!res.missing.length && !res.extra.length) return { cls: "ok", html: "<strong>Écriture juste</strong> : " + res.ok + " ligne(s) correcte(s), total " + fmt(td) + " € au débit comme au crédit." };
    var h = "<strong>Pas encore.</strong> " + res.ok + " ligne(s) juste(s) sur " + exp.length + ".<ul>";
    res.extra.forEach(function (g) {
      var near_ = res.missing.some(function (e) { return accEq(e.acc, g.acc); });
      if (!g.acc) h += "<li>Une ligne n'a pas de compte.</li>";
      else if (g.d > 0 && g.c > 0) h += "<li>Compte " + g.acc + " : un seul sens par ligne (débit ou crédit).</li>";
      else if (near_) h += "<li>Compte " + g.acc + " : le compte est attendu, mais vérifiez le <b>montant</b> ou le <b>sens</b> (débit/crédit).</li>";
      else h += "<li>Compte " + g.acc + " " + esc(accName(g.acc)) + " : cette ligne n'est pas attendue ici.</li>";
    });
    var manque = res.missing.length - res.extra.filter(function (g) { return res.missing.some(function (e) { return accEq(e.acc, g.acc); }); }).length;
    if (manque > 0) h += "<li>Il manque encore " + manque + " ligne(s).</li>";
    h += "</ul>";
    if (Math.abs(td - tc) > TOL) h += "<p>Attention : total débit " + fmt(td) + " ≠ total crédit " + fmt(tc) + ".</p>";
    return { cls: "ko", html: h };
  }
  function checkJournal(exId, jidShort) {
    var j = reg[exId].journals.filter(function (x) { return x.id === jidShort; })[0];
    var jid = exId + "_" + jidShort, got = readJournal(jid), res = compareJournal(j.lines, got);
    var f = journalFeedbackHTML(j.lines, got, res);
    fb(document.getElementById(jid + "_fb"), f.cls, f.html);
    return !res.missing.length && !res.extra.length;
  }
  function showJournal(exId, jidShort) {
    var j = reg[exId].journals.filter(function (x) { return x.id === jidShort; })[0];
    var h = '<div class="scroll"><table><thead><tr><th>Compte</th><th class="num">Débit</th><th class="num">Crédit</th></tr></thead><tbody>';
    j.lines.forEach(function (l) {
      var a = Array.isArray(l.acc) ? l.acc[0] : l.acc;
      h += "<tr><td>" + a + " " + esc(accName(a)) + "</td><td class=\"num\">" + (l.d != null ? fmt(l.d) : "") + "</td><td class=\"num\">" + (l.c != null ? fmt(l.c) : "") + "</td></tr>";
    });
    h += "</tbody></table></div>" + (j.why ? '<p class="small">' + j.why + "</p>" : "");
    var z = document.getElementById(exId + "_" + jidShort + "_fb");
    z.innerHTML = '<div class="fb info"><strong>Correction</strong>' + h + "</div>";
  }
  function updateTotals(table) {
    var td = 0, tc = 0;
    table.querySelectorAll("tbody tr").forEach(function (tr) {
      var d = parseNum(tr.querySelector('[data-side="d"]').value), c = parseNum(tr.querySelector('[data-side="c"]').value);
      if (!isNaN(d)) td += d; if (!isNaN(c)) tc += c;
    });
    table.querySelector('[data-t="d"]').textContent = fmt(td);
    table.querySelector('[data-t="c"]').textContent = fmt(tc);
  }
  function addRow(jid) {
    var t = document.getElementById(jid), first = t.querySelector("tbody tr select");
    var opts = first.innerHTML;
    t.querySelector("tbody").insertAdjacentHTML("beforeend", jrow(opts));
  }

  /* ---------- dépôt .xlsx ---------- */
  function sheetsFromFile(file, cb, err) {
    if (typeof XLSX === "undefined") return err("La bibliothèque de lecture Excel n'est pas chargée.");
    var fr = new FileReader();
    fr.onload = function (e) {
      try {
        var wb = XLSX.read(new Uint8Array(e.target.result), { type: "array" }), sheets = [];
        wb.SheetNames.forEach(function (n) { sheets.push(XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, raw: true, defval: "" })); });
        cb(sheets);
      } catch (x) { err("Fichier illisible. Enregistrez-le au format .xlsx et recommencez."); }
    };
    fr.onerror = function () { err("Impossible de lire le fichier."); };
    fr.readAsArrayBuffer(file);
  }
  function journalLinesFromRows(rows) {
    var out = [], dc = -1, cc = -1;
    rows.forEach(function (r) {
      var cells = r.map(function (x) { return x == null ? "" : String(x).trim(); });
      var di = -1, ci = -1;
      cells.forEach(function (c, i) { if (/^d[ée]bit$/i.test(c)) di = i; if (/^cr[ée]dit$/i.test(c)) ci = i; });
      if (di >= 0 && ci >= 0) { dc = di; cc = ci; return; }
      if (dc < 0) return;
      var left = cells.slice(0, Math.min(dc, cc));
      var acc = left.filter(function (c) { return /^\d{6}$/.test(c); })[0] || left.filter(function (c) { return /^[1-7]\d{2,3}$/.test(c); })[0];
      var d = parseNum(r[dc]), c = parseNum(r[cc]);
      if (acc && ((d > 0) || (c > 0))) out.push({ acc: acc, d: isNaN(d) ? 0 : d, c: isNaN(c) ? 0 : c });
    });
    return out;
  }
  function uploadCheck(exId, file) {
    var z = document.getElementById(exId + "_up"), ex = reg[exId];
    z.innerHTML = '<div class="fb info">Lecture du fichier…</div>';
    sheetsFromFile(file, function (sheets) {
      var lines = [], nums = [];
      sheets.forEach(function (rows) {
        lines = lines.concat(journalLinesFromRows(rows));
        rows.forEach(function (r) { r.forEach(function (c) { var n = parseNum(c); if (!isNaN(n)) nums.push(Math.abs(n)); }); });
      });
      var h = "", allOk = true;
      if (ex.fields && ex.fields.length) {
        var miss = ex.fields.filter(function (f) { return !nums.some(function (n) { return near(n, Math.abs(f.v), f.tol); }); });
        if (miss.length) { allOk = false; h += '<div class="fb ko"><strong>Tableau :</strong> ' + (ex.fields.length - miss.length) + "/" + ex.fields.length + " montants retrouvés. Je ne retrouve pas :<ul>" +
          miss.map(function (f) { return "<li>" + f.label + "</li>"; }).join("") + "</ul></div>"; }
        else h += '<div class="fb ok"><strong>Tableau :</strong> tous les montants attendus sont présents.</div>';
      }
      (ex.journals || []).forEach(function (j) {
        var res = compareJournal(j.lines, lines);
        var okj = !res.missing.length;
        if (!okj) allOk = false;
        h += '<div class="fb ' + (okj ? "ok" : "ko") + '"><strong>' + j.title + " :</strong> " + res.ok + "/" + j.lines.length + " ligne(s) retrouvée(s)" +
          (res.missing.length ? ".<ul>" + res.missing.map(function (e) {
            var a = Array.isArray(e.acc) ? e.acc[0] : e.acc;
            return "<li>Manque ou montant/sens incorrect : compte " + a + " " + esc(accName(a)) + " au " + (e.d != null ? "débit" : "crédit") + "</li>";
          }).join("") + "</ul>" : " — parfait.") + "</div>";
      });
      if (!lines.length && (ex.journals || []).length) h += '<div class="fb info">Aucune ligne d\'écriture détectée : vérifiez les colonnes « Débit » / « Crédit » et les numéros de compte (6 chiffres).</div>';
      z.innerHTML = h;
      if (allOk) document.dispatchEvent(new CustomEvent("exdone", { detail: exId }));
    }, function (msg) { z.innerHTML = '<div class="fb ko">' + msg + "</div>"; });
  }

  return {
    reg: reg, ACC: ACC, esc: esc, parseNum: parseNum, fmt: fmt, near: near,
    exerciseHTML: exerciseHTML, fieldsHTML: fieldsHTML, journalHTML: journalHTML,
    checkFields: checkFields, showFields: showFields, checkJournal: checkJournal, showJournal: showJournal,
    updateTotals: updateTotals, addRow: addRow, uploadCheck: uploadCheck,
    compareJournal: compareJournal, accEq: accEq, journalLinesFromRows: journalLinesFromRows
  };
})();
