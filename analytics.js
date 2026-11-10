/* Umami analytics (umami.tupt.dev)
 * - Pageview tự động cho mọi trang, kể cả đổi route kiểu #/... trong mock
 * - Event "link-click" cho mỗi lần bấm link: href, text, page
 * Chỉ cần sửa WEBSITE_ID bên dưới.
 */
(function () {
  var WEBSITE_ID = "cb551e8b-e8d8-48ef-8fbb-d52866fdfdf3";
  var HOST = "https://umami.tupt.dev";

  if (!WEBSITE_ID || WEBSITE_ID.indexOf("REPLACE") === 0) return;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;

  var s = document.createElement("script");
  s.defer = true;
  s.src = HOST + "/script.js";
  s.setAttribute("data-website-id", WEBSITE_ID);
  document.head.appendChild(s);

  function pageUrl() {
    return location.pathname + location.search + location.hash;
  }

  function track(name, data) {
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name, data);
    }
  }

  // Mock dùng hash routing (#/explore, #/b/...) — umami không tự bắt hashchange.
  var lastUrl = pageUrl();
  window.addEventListener("hashchange", function () {
    var prev = lastUrl;
    lastUrl = pageUrl();
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(function (p) {
        return Object.assign({}, p, { url: lastUrl, referrer: location.origin + prev, title: document.title });
      });
    }
  });

  // Ghi lại mọi click vào link (capture để chạy trước handler của trang).
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href === "#" || href.indexOf("javascript:") === 0) return;
    var text = (a.getAttribute("aria-label") || a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100);
    track("link-click", {
      href: a.href.slice(0, 500),
      text: text,
      page: pageUrl().slice(0, 500),
      outbound: a.host !== location.host
    });
  }, true);
})();
