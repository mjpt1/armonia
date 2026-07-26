/**
 * Armonia ERP shell helpers — nav active state, tabs, branch label sync
 */
(function () {
  "use strict";

  function setActiveNav() {
    var page = document.body.getAttribute("data-page");
    if (!page) return;
    document.querySelectorAll(".nav a[data-nav]").forEach(function (link) {
      var isActive = link.getAttribute("data-nav") === page;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (root) {
      var tabs = root.querySelectorAll(".tab");
      var panels = root.querySelectorAll(".tab-panel");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var id = tab.getAttribute("data-tab");
          tabs.forEach(function (t) {
            t.classList.toggle("active", t === tab);
            t.setAttribute("aria-selected", t === tab ? "true" : "false");
          });
          panels.forEach(function (p) {
            var match = p.getAttribute("data-panel") === id;
            p.classList.toggle("active", match);
            p.hidden = !match;
          });
        });
      });
    });
  }

  function syncBranchFoot() {
    var branch = document.getElementById("branch-switch");
    var foot = document.querySelector("[data-branch-label]");
    if (!branch || !foot) return;
    function update() {
      foot.textContent = branch.options[branch.selectedIndex].text;
    }
    branch.addEventListener("change", update);
    update();
  }

  function initFilters() {
    document.querySelectorAll("[data-filter-table]").forEach(function (wrap) {
      var input = wrap.querySelector("[data-filter-q]");
      var status = wrap.querySelector("[data-filter-status]");
      var table = wrap.querySelector("tbody");
      if (!table) return;

      function apply() {
        var q = (input && input.value ? input.value : "").trim().toLowerCase();
        var st = status ? status.value : "";
        table.querySelectorAll("tr").forEach(function (row) {
          var text = row.textContent.toLowerCase();
          var rowStatus = row.getAttribute("data-status") || "";
          var matchQ = !q || text.indexOf(q) !== -1;
          var matchS = !st || st === "all" || rowStatus === st;
          row.hidden = !(matchQ && matchS);
        });
      }

      if (input) input.addEventListener("input", apply);
      if (status) status.addEventListener("change", apply);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setActiveNav();
    initTabs();
    syncBranchFoot();
    initFilters();
  });
})();
