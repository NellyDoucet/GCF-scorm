/* Enveloppe SCORM 1.2 — bascule sur localStorage si aucun LMS n'est trouvé (test hors ligne) */
var SCORM = (function () {
  var api = null, connected = false, store = {}, KEY = "gcf_affectation_resultat";

  function findAPI(win) {
    var n = 0;
    while (win && !win.API && win.parent && win.parent !== win && n < 12) { win = win.parent; n++; }
    return win && win.API ? win.API : null;
  }
  function loadLocal() { try { store = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { store = {}; } }
  function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }

  return {
    init: function () {
      api = findAPI(window) || (window.opener ? findAPI(window.opener) : null);
      if (api) { try { connected = String(api.LMSInitialize("")) === "true"; } catch (e) { connected = false; } }
      if (!connected) loadLocal();
      return connected;
    },
    isConnected: function () { return connected; },
    get: function (k) {
      if (connected) { try { return String(api.LMSGetValue(k)); } catch (e) { return ""; } }
      return store[k] == null ? "" : String(store[k]);
    },
    set: function (k, v) {
      if (connected) { try { api.LMSSetValue(k, String(v)); } catch (e) {} }
      else { store[k] = String(v); saveLocal(); }
    },
    commit: function () { if (connected) { try { api.LMSCommit(""); } catch (e) {} } },
    finish: function () {
      if (connected) { try { api.LMSCommit(""); api.LMSFinish(""); } catch (e) {} connected = false; }
    }
  };
})();
