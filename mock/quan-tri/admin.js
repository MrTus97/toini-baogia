/* Trang quản trị Toini – mock. UC-A01 … UC-A14 */
(function () {
  var esc = T.esc, app = document.getElementById("app");
  var SK = "toini-mock-admin-session";
  var ses = (function () { try { return JSON.parse(sessionStorage.getItem(SK)) || null; } catch (e) { return null; } })();
  var view = "dash", sub = {}; // sub: trạng thái phụ của từng màn hình
  var LANGS = [["vi", "Tiếng Việt"], ["en", "English"], ["ko", "한국어"], ["ru", "Русский"], ["zh", "中文"], ["ja", "日本語"]];
  function saveSes() { try { sessionStorage.setItem(SK, JSON.stringify(ses)); } catch (e) { } }
  function me() { return ses && T.state().staff.filter(function (s) { return s.id === ses.staff; })[0]; }
  function who() { return me().name; }
  function S() { return T.state(); }
  function vname(id) { var v = T.venue(id); return v ? v.name : id; }
  function stPill(st) { return '<span class="st ' + st + '">' + esc(T.STATUS[st]) + "</span>"; }

  /* ---------- menu theo vai trò ---------- */
  var NAV = [
    ["Vận hành", null],
    ["dash", "📊 Tổng quan", "gd,cs,kt", ""],
    ["bookings", "🎫 Đơn đặt bàn", "gd,cs,kt", "A06 · A07"],
    ["outbox", "📨 Tin đã gửi khách", "gd,cs", "S01"],
    ["tg", "✈️ Telegram CSKH", "gd,cs", "A07"],
    ["Quán & nội dung", null],
    ["venues", "🏪 Quán", "gd,cs", "A01"],
    ["offers", "⚡ Ưu đãi", "gd,cs", "A03"],
    ["import", "📥 Nhập dữ liệu quán", "gd,cs", "A02"],
    ["events", "🎶 Sự kiện", "gd,cs", "A15"],
    ["reviews", "⭐ Đánh giá", "gd,cs", "A16"],
    ["shopacc", "🔑 Tài khoản quán", "gd,cs", "A04"],
    ["content", "🌐 Nội dung & cấu hình", "gd,cs", "A12"],
    ["Tiền", null],
    ["commission", "％ Tỷ lệ hoa hồng", "gd", "A08"],
    ["deals", "⚡ Deal siêu hời", "gd", "A17"],
    ["recon", "🧮 Đối soát", "gd,kt", "A09"],
    ["debt", "💰 Công nợ", "gd,kt", "A10"],
    ["export", "📤 Xuất số liệu", "gd,kt", "A11"],
    ["Quản trị", null],
    ["staff", "👥 Nhân viên Toini", "gd", "A05"],
    ["audit", "🕵️ Nhật ký thao tác", "gd", "A13"],
    ["caps", "🛡 Trần gửi tin & chặn", "gd", "A14"]
  ];
  function can(v) { var n = NAV.filter(function (x) { return x[0] === v; })[0]; return n && n[2] && n[2].split(",").indexOf(me().role) >= 0; }

  /* ---------- đăng nhập ---------- */
  function login(msg) {
    var rows = S().staff.map(function (s) { return '<tr><td><button data-u="' + s.username + '">' + s.username + "</button></td><td>" + esc(T.ROLE[s.role]) + (s.locked ? ' <span class="tag bad">đã khóa</span>' : "") + "</td></tr>"; }).join("");
    app.innerHTML = '<div class="mockbar">BẢN MOCK · Trang quản trị Toini</div><div class="login"><form class="box" id="lf"><h1>Quản trị Toini</h1><p class="muted small" style="margin-top:0">Dành cho nhân viên Toini.</p><label class="field"><span>Tên đăng nhập ' + T.ref + '</span><input class="inp" name="u" value="giamdoc"></label><label class="field"><span>Mật khẩu ' + T.ref + '</span><input class="inp" type="password" name="p" value="demo123"></label><div class="err">' + esc(msg || "") + '</div><button class="btn primary block">Đăng nhập</button><div class="demo-acc"><b>Tài khoản demo</b> (mật khẩu <b>demo123</b>) – mỗi vai trò thấy menu khác nhau ' + T.ref + "<table>" + rows + "</table></div></form></div>";
    app.querySelectorAll("[data-u]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); app.querySelector("[name=u]").value = b.dataset.u; }); });
    document.getElementById("lf").addEventListener("submit", function (e) {
      e.preventDefault(); var fd = new FormData(e.target), s = S().staff.filter(function (x) { return x.username === String(fd.get("u")).trim(); })[0];
      if (!s || s.password !== fd.get("p")) return login("Sai tên đăng nhập hoặc mật khẩu.");
      if (s.locked) return login("Tài khoản đã bị khóa.");
      ses = { staff: s.id }; saveSes(); view = "dash"; T.audit(s.name, "Phiên đăng nhập", s.username, "Đăng nhập quản trị"); T.save(); render();
    });
  }

  /* ---------- khung ---------- */
  function render() {
    if (!ses || !me()) return login();
    if (me().locked) { ses = null; saveSes(); return login("Tài khoản đã bị khóa."); }
    if (!can(view)) view = "dash";
    var alerts = S().alerts.filter(function (a) { return !a.done; }).length, pend = S().bookings.filter(function (b) { return b.status === "pending"; }).length;
    app.innerHTML = '<div class="mockbar">BẢN MOCK · Quản trị Toini · dữ liệu dùng chung với web khách và cổng quán</div><header class="pt-top"><a class="brand" href="#">toini<small>Quản trị</small></a><span class="sp"></span><span class="who">👤 ' + esc(me().name) + '</span><button class="lo" id="logout">Đăng xuất</button></header><div class="pt-layout"><nav class="pt-nav" aria-label="Menu">' +
      NAV.map(function (n) {
        if (!n[1]) return '<span class="grp">' + esc(n[0]) + "</span>";
        if (n[2].split(",").indexOf(me().role) < 0) return "";
        var bd = n[0] === "dash" && alerts ? '<span class="bdg">' + alerts + "</span>" : n[0] === "bookings" && pend ? '<span class="bdg">' + pend + "</span>" : n[0] === "reviews" && S().reviews.filter(function (r) { return r.status === "pending"; }).length ? '<span class="bdg">' + S().reviews.filter(function (r) { return r.status === "pending"; }).length + "</span>" : "";
        return '<a href="#" data-nav="' + n[0] + '" class="' + (view === n[0] ? "on" : "") + '">' + n[1] + bd + "</a>";
      }).join("") + '</nav><main class="pt-main" id="main"></main></div>';
    VIEWS[view]();
  }
  function main(h) { document.getElementById("main").innerHTML = h; }
  function head(title, uc, extra) { return '<div class="pt-h"><h1>' + esc(title) + (uc ? '<span class="uc">UC-' + uc.replace(/ · /g, " · UC-") + "</span>" : "") + "</h1>" + (extra || "") + "</div>"; }
  function ucOf(v) { return (NAV.filter(function (x) { return x[0] === v; })[0] || [])[3]; }
  function askReason(title, cb, extraHtml) {
    T.modal(title, (extraHtml || "") + '<label class="field"><span>Lý do (bắt buộc, ghi vào nhật ký)</span><textarea class="inp" id="rsn" rows="2">Khách gọi hotline nhờ hỗ trợ</textarea></label>', '<button class="btn" data-close>Hủy</button><button class="btn primary" id="rok">Xác nhận</button>');
    document.getElementById("rok").addEventListener("click", function () { var r = document.getElementById("rsn").value.trim(); if (!r) { T.toast("Cần nhập lý do", "warn"); return; } cb(r); });
  }
  function download(name, text) { var b = new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" }), a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function csv(rows) { return rows.map(function (r) { return r.map(function (c) { c = String(c == null ? "" : c); return /[",\n;]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(","); }).join("\n"); }

  var VIEWS = {};

  /* ---------- Tổng quan ---------- */
  VIEWS.dash = function () {
    var s = S(), today = T.today(), bt = s.bookings.filter(function (b) { return b.date === today; }), c = T.counter();
    var al = s.alerts.filter(function (a) { return !a.done; });
    var h = head("Tổng quan · " + T.dmy(today)) + '<div class="kpis"><div class="kpi"><span>Đơn cho tối nay</span><b>' + bt.length + '</b></div><div class="kpi"><span>Đang chờ quán</span><b>' + s.bookings.filter(function (b) { return b.status === "pending"; }).length + '</b></div><div class="kpi"><span>Cảnh báo chưa xử lý</span><b style="color:' + (al.length ? "var(--bad)" : "inherit") + '">' + al.length + '</b></div><div class="kpi"><span>Tin hôm nay ZNS/SMS/Email</span><b style="font-size:1.1rem">' + c.zns + " / " + c.sms + " / " + c.email + "</b></div></div>";
    h += '<div class="panel ' + (al.length ? "alert" : "") + '"><h2>Cảnh báo</h2>' + (al.length ? al.map(function (a) {
      var b = a.bookingId && T.booking(a.bookingId);
      return '<div class="trow"><div class="trow-h"><b>' + (a.kind === "late" ? "⏱ " : "🛡 ") + esc(a.text) + '</b><span class="small muted">' + T.dt(a.at) + "</span></div>" + (b ? '<div class="small">Quán: <b>' + esc(vname(b.venueId)) + "</b> · Liên hệ: " + esc(T.venue(b.venueId).contact.name) + " · <a href=\"tel:" + esc(T.venue(b.venueId).contact.phone) + '">📞 ' + esc(T.venue(b.venueId).contact.phone) + "</a></div>" : "") + '<div class="acts" style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">' + (b && b.status === "pending" && can("bookings") ? '<button class="btn sm" data-bk="' + b.id + '">Mở đơn</button><button class="btn sm primary" data-help="confirm" data-id="' + b.id + '">Quán đồng ý qua điện thoại → xác nhận thay</button>' : "") + '<button class="btn sm ghost" data-aldone="' + a.id + '">Đánh dấu đã xử lý</button></div></div>';
    }).join("") : '<div class="empty2">Không có cảnh báo.</div>') + "</div>";
    var byV = {}; bt.forEach(function (b) { (byV[b.venueId] = byV[b.venueId] || []).push(b); });
    h += '<div class="panel"><h2>Tối nay theo quán</h2><table class="dt"><thead><tr><th>Quán</th><th>Nhận khách</th><th>Chờ</th><th>Đã xác nhận</th><th>Đã tới</th><th>Từ chối/Hủy</th></tr></thead><tbody>' + s.venues.map(function (v) {
      var l = byV[v.id] || [], cnt = function (f) { return l.filter(f).length; };
      return '<tr><td data-l="Quán"><b>' + esc(v.name) + '</b></td><td data-l="Nhận khách">' + (T.isOpenNight(v.id, today) ? '<span class="tag ok">Đang nhận</span>' : '<span class="tag bad">Đã tắt</span>') + '</td><td data-l="Chờ" class="n">' + cnt(function (b) { return b.status === "pending"; }) + '</td><td data-l="Đã xác nhận" class="n">' + cnt(function (b) { return b.status === "confirmed"; }) + '</td><td data-l="Đã tới" class="n">' + cnt(function (b) { return ["arrived", "billed", "settled"].indexOf(b.status) >= 0; }) + '</td><td data-l="Từ chối/Hủy" class="n">' + cnt(function (b) { return ["rejected", "cancelled", "expired"].indexOf(b.status) >= 0; }) + "</td></tr>";
    }).join("") + "</tbody></table></div>";
    main(h);
  };

  /* ---------- UC-A06/A07 đơn ---------- */
  VIEWS.bookings = function () {
    var f = sub.bk = sub.bk || { q: "", st: "", v: "", d: "" };
    var list = S().bookings.filter(function (b) {
      var q = f.q.trim().toLowerCase(), qp = T.normPhone(q.replace(/\s/g, ""));
      return (!f.st || b.status === f.st) && (!f.v || b.venueId === f.v) && (!f.d || b.date === f.d) && (!q || b.code.toLowerCase().indexOf(q) >= 0 || (b.email || "").indexOf(q) >= 0 || b.name.toLowerCase().indexOf(q) >= 0 || (qp.length > 5 && (b.phone || "").indexOf(qp.replace("+84", "")) >= 0));
    });
    var h = head("Đơn đặt bàn", ucOf("bookings")) + '<div class="toolbar"><input class="inp" id="bq" placeholder="Tìm mã, SĐT, email, tên khách…" value="' + esc(f.q) + '"><select class="inp" id="bv"><option value="">Mọi quán</option>' + S().venues.map(function (v) { return '<option value="' + v.id + '"' + (f.v === v.id ? " selected" : "") + ">" + esc(v.name) + "</option>"; }).join("") + '</select><select class="inp" id="bs"><option value="">Mọi trạng thái</option>' + Object.keys(T.STATUS).map(function (k) { return '<option value="' + k + '"' + (f.st === k ? " selected" : "") + ">" + esc(T.STATUS[k]) + "</option>"; }).join("") + '</select><input class="inp" type="date" id="bd" value="' + f.d + '" style="flex:0 1 160px"></div><p class="small muted">' + list.length + " đơn · tìm được theo SĐT/email nhờ thông tin liên hệ được chuẩn hóa (UC-S09)</p>";
    h += '<table class="dt"><thead><tr><th>Mã</th><th>Quán</th><th>Ngày giờ</th><th>Khách</th><th>Liên hệ</th><th>Số khách</th><th>Trạng thái</th><th></th></tr></thead><tbody>' + list.slice(0, 80).map(function (b) {
      return '<tr class="' + (b.lateAlerted && b.status === "pending" ? "hl" : "") + '"><td data-l="Mã"><b>' + esc(b.code) + '</b></td><td data-l="Quán">' + esc(vname(b.venueId)) + '</td><td data-l="Ngày giờ">' + T.dmy(b.date) + " " + esc(b.time) + '</td><td data-l="Khách">' + esc(b.name) + " · " + b.lang.toUpperCase() + '</td><td data-l="Liên hệ" class="small">' + esc(b.phone ? T.prettyPhone(b.phone) : "") + (b.phone && b.email ? "<br>" : "") + esc(b.email || "") + '</td><td data-l="Số khách" class="n">' + b.pax + '</td><td data-l="Trạng thái">' + stPill(b.status) + (b.lateAlerted && b.status === "pending" ? ' <span class="tag bad">&gt;15′</span>' : "") + '</td><td data-l=""><button class="btn sm" data-bk="' + b.id + '">Chi tiết</button></td></tr>';
    }).join("") + "</tbody></table>";
    main(h);
    var deb; document.getElementById("bq").addEventListener("input", function (e) { clearTimeout(deb); deb = setTimeout(function () { f.q = e.target.value; VIEWS.bookings(); var x = document.getElementById("bq"); x.focus(); x.setSelectionRange(x.value.length, x.value.length); }, 250); });
    ["bv", "bs", "bd"].forEach(function (id) { document.getElementById(id).addEventListener("change", function (e) { f[{ bv: "v", bs: "st", bd: "d" }[id]] = e.target.value; VIEWS.bookings(); }); });
  };
  function bookingDetail(id) {
    var b = T.booking(id), v = T.venue(b.venueId), cs = can("outbox");
    var acts = cs ? (b.status === "pending" ? '<button class="btn sm primary" data-help="confirm" data-id="' + b.id + '">Xác nhận thay quán</button><button class="btn sm red" data-help="reject" data-id="' + b.id + '">Từ chối thay quán</button>' : "") + ((b.status === "pending" || b.status === "confirmed") ? '<button class="btn sm" data-help="time" data-id="' + b.id + '">Đổi giờ</button><button class="btn sm" data-help="cancel" data-id="' + b.id + '">Hủy đơn</button>' : "") + '<button class="btn sm" data-help="resend" data-id="' + b.id + '">Gửi lại thông báo</button>' : '<span class="small muted">Vai trò Kế toán chỉ xem.</span>';
    var html = '<div class="fgrid"><div><p style="margin-top:0">' + stPill(b.status) + " " + (b.reason ? '<span class="small">Lý do: ' + esc(b.reason) + "</span>" : "") + '</p><table class="dt"><tbody>' + [["Quán", v.name], ["Ngày giờ", T.wd(b.date, "vi") + " " + T.dmy(b.date) + " " + b.time], ["Số khách", b.pax], ["Khách", b.name + " (" + b.lang.toUpperCase() + ")"], ["SĐT", b.phone ? T.prettyPhone(b.phone) : "—"], ["Email", b.email || "—"], ["Ghi chú", b.note || "—"], ["Báo đã tới", b.arrivedAt ? (b.arrivedBy === "quan" ? "Quán" : "Khách") + " · " + T.dt(b.arrivedAt) + (b.geo ? " · có vị trí" : "") : "—"], ["Hóa đơn", b.invoice ? b.invoice.no + " · " + T.vnd(b.invoice.amount) : "—"], ["Sự kiện", b.eventId && T.event(b.eventId) ? T.event(b.eventId).tr.vi.title : "—"], ["Deal siêu hời", b.deal ? T.dealLabel(b.deal) + (b.invoice ? " · Toini tài trợ " + T.vnd(b.invoice.sponsor || 0) : "") : "—"]].map(function (r) { return '<tr><td data-l="' + r[0] + '"><b>' + r[0] + '</b></td><td data-l="">' + esc(r[1]) + "</td></tr>"; }).join("") + '</tbody></table></div><div><h4 style="margin:0 0 6px">Lịch sử</h4><ul style="margin:0;padding-left:18px;font-size:.85rem">' + b.history.slice().reverse().map(function (x) { return "<li><span class=\"muted\">" + T.dt(x.at) + " · " + esc(x.by) + "</span><br>" + esc(x.action) + "</li>"; }).join("") + '</ul><h4 style="margin:12px 0 6px">Tin đã gửi khách</h4>' + ((b.msgs || []).length ? '<ul style="margin:0;padding-left:18px;font-size:.82rem">' + b.msgs.map(function (m) { return "<li>" + T.hm(m.at) + " · <b>" + esc(m.ch) + "</b> · " + esc(m.type) + " · " + (m.ok ? '<span class="tag ok">gửi được</span>' : '<span class="tag bad">' + esc(m.why) + "</span>") + "</li>"; }).join("") + "</ul>" : '<p class="small muted">Chưa có (đơn mẫu).</p>') + "</div></div>";
    T.modal("Đơn " + b.code, html, '<div style="display:flex;flex-wrap:wrap;gap:6px;flex:1">' + acts + '</div><button class="btn" data-close>Đóng</button>', { wide: true });
  }
  function help(kind, id) {
    var b = T.booking(id), done = function (msg, m) { T.save(); T.closeModal(); render(); T.toast(msg); if (m) T.showDelivered(m); };
    if (kind === "confirm") askReason("Xác nhận thay quán · " + b.code, function (r) { T.setStatus(b, "confirmed", who(), "CSKH xác nhận thay quán: " + r); S().alerts.forEach(function (a) { if (a.bookingId === b.id) a.done = true; }); done("Đã xác nhận đơn " + b.code, T.sendCustomer(T.contactOf(b), "confirmed", b)); }, "<p>Dùng khi quán đã đồng ý qua điện thoại.</p>");
    if (kind === "reject") askReason("Từ chối thay quán · " + b.code, function (r) { b.reason = "Hết chỗ"; T.setStatus(b, "rejected", who(), "CSKH từ chối thay quán: " + r); S().alerts.forEach(function (a) { if (a.bookingId === b.id) a.done = true; }); done("Đã từ chối", T.sendCustomer(T.contactOf(b), "rejected", b, { reason: b.reason })); });
    if (kind === "cancel") askReason("Hủy đơn " + b.code, function (r) { T.setStatus(b, "cancelled", who(), "CSKH hủy hộ khách: " + r); T.notifyVenue(b, "cancelled"); done("Đã hủy", T.sendCustomer(T.contactOf(b), "cancelled", b)); });
    if (kind === "resend") askReason("Gửi lại thông báo · " + b.code, function (r) { var type = { pending: "received", confirmed: "confirmed", rejected: "rejected", expired: "expired", cancelled: "cancelled" }[b.status] || "received"; b.history.push({ at: T.now(), by: who(), action: "Gửi lại thông báo – " + r }); T.audit(who(), "Đơn", b.code, "Gửi lại thông báo", null, r); done("Đã gửi lại", T.sendCustomer(T.contactOf(b), type, b, { reason: b.reason })); });
    if (kind === "time") askReason("Đổi giờ hộ khách · " + b.code, function (r) {
      var nd = document.getElementById("nd").value, nt = document.getElementById("nt").value, before = b.date + " " + b.time; b.date = nd; b.time = nt; b.deadlineBase = T.now(); b.lateAlerted = false;
      T.setStatus(b, "pending", who(), "CSKH đổi giờ từ " + before + " sang " + nd + " " + nt + ": " + r); T.notifyVenue(b, "changed"); done("Đã đổi giờ", T.sendCustomer(T.contactOf(b), "changed", b));
    }, '<div class="fgrid"><label class="field"><span>Ngày</span><input class="inp" type="date" id="nd" value="' + b.date + '"></label><label class="field"><span>Giờ</span><input class="inp" type="time" id="nt" value="' + b.time + '"></label></div>');
  }

  VIEWS.outbox = function () {
    var c = T.counter();
    main(head("Tin đã gửi khách", "S01") + '<div class="note">Mô phỏng nhật ký gửi tin qua Zalo ZNS → SMS → Email. Hôm nay: ZNS <b>' + c.zns + "</b> · SMS <b>" + c.sms + "</b> · Email <b>" + c.email + '</b></div><table class="dt"><thead><tr><th>Giờ</th><th>Kênh</th><th>Loại</th><th>Tới</th><th>Nội dung</th><th>Kết quả</th></tr></thead><tbody>' + S().outbox.slice(0, 100).map(function (m) { return '<tr><td data-l="Giờ">' + T.dt(m.at) + '</td><td data-l="Kênh"><b>' + esc(m.ch) + '</b></td><td data-l="Loại">' + esc(m.type) + '</td><td data-l="Tới">' + esc(m.to || "—") + '</td><td data-l="Nội dung" class="full small">' + esc(m.text) + '</td><td data-l="Kết quả">' + (m.ok ? '<span class="tag ok">Gửi được</span>' : '<span class="tag bad">' + esc(m.why) + "</span>") + "</td></tr>"; }).join("") + "</tbody></table>" + (S().outbox.length ? "" : '<div class="empty2">Chưa có tin. Thử đặt bàn ở web khách.</div>'));
  };
  VIEWS.tg = function () {
    var msgs = S().telegram.filter(function (m) { return m.chat === "cskh"; }).slice().reverse();
    main(head("Nhóm Telegram CSKH (mô phỏng)", "A07") + '<div class="note">Bot gửi cảnh báo khi quán quá 15 phút chưa phản hồi. Dùng Demo → “+15 phút” để thử.</div><div class="tg-feed">' + (msgs.length ? msgs.map(function (m) { return '<div class="tg-msg"><b class="bot">Toini Bot</b>' + esc(m.text) + "<time>" + T.dt(m.at) + "</time></div>"; }).join("") : '<div class="small muted">Chưa có tin.</div>') + "</div>");
  };

  /* ---------- dịch: dùng chung cho quán (A01) và ưu đãi (A03) ---------- */
  function trBlock(obj, fields, labels, key) {
    var vi = obj.tr.vi || {};
    var h = '<div class="note">Nhập nội dung gốc bằng tiếng Việt. Bấm <b>Dịch bằng AI</b> để tạo bản nháp, rồi xem, sửa và <b>Duyệt</b>. Chỉ bản đã duyệt mới hiện trên web khách; ngôn ngữ chưa có bản duyệt thì web hiện tiếng Anh. Phí dịch AI tính vào chi phí dịch vụ.</div>';
    h += '<div class="trow"><div class="trow-h"><b>🇻🇳 Tiếng Việt (gốc)</b><span class="tag ok">Nội dung gốc</span></div>' + fields.map(function (f, i) { return '<label class="field"><span>' + labels[i] + '</span><textarea class="inp" rows="' + (f === "desc" ? 3 : 1) + '" data-vi="' + f + '">' + esc(vi[f] || "") + "</textarea></label>"; }).join("") + '<button class="btn sm" data-savevi="' + key + '">Lưu nội dung gốc</button></div>';
    h += '<div class="toolbar" style="margin:14px 0 8px"><b>Dịch sang:</b>' + LANGS.slice(1).map(function (l) { return '<label class="chipf" style="display:inline-flex;gap:4px;align-items:center"><input type="checkbox" data-pick="' + l[0] + '"' + (!(obj.tr[l[0]] || {}).status || (obj.tr[l[0]] || {}).stale ? " checked" : "") + "> " + l[0].toUpperCase() + "</label>"; }).join("") + '<button class="btn sm dark" data-ai="' + key + '">✨ Dịch bằng AI</button></div>';
    LANGS.slice(1).forEach(function (l) {
      var x = obj.tr[l[0]] || {}, draft = x.draft, tag = draft ? '<span class="tag ai">Bản nháp ' + (x.draftBy === "ai" ? "AI" : "") + " – chờ duyệt</span>" : x.stale ? '<span class="tag warn">Cần dịch lại (nội dung gốc đã đổi)</span>' : x.status === "approved" ? '<span class="tag ok">Đã duyệt</span>' : '<span class="tag gray">Chưa có – web hiện tiếng Anh</span>';
      h += '<div class="trow"><div class="trow-h"><b>' + l[1] + "</b>" + tag + "</div>" + fields.map(function (f, i) {
        var val = draft ? draft[f] : x[f]; return '<label class="field"><span>' + labels[i] + (draft ? " (nháp)" : x.status === "approved" ? " (đang hiển thị)" : "") + '</span><textarea class="inp" rows="' + (f === "desc" ? 3 : 1) + '" data-tr="' + l[0] + '" data-f="' + f + '"' + (l[0] === "en" ? "" : "") + ">" + esc(val || "") + "</textarea></label>";
      }).join("") + '<div style="display:flex;gap:6px;flex-wrap:wrap">' + (draft ? '<button class="btn sm primary" data-approve="' + key + "|" + l[0] + '">✓ Duyệt bản dịch</button><button class="btn sm ghost" data-discard="' + key + "|" + l[0] + '">Bỏ bản nháp</button>' : '<button class="btn sm" data-manual="' + key + "|" + l[0] + '">Lưu thành bản nháp để duyệt</button>') + "</div></div>";
    });
    return h;
  }
  function trTarget(key) { var p = key.split(":");
    if (p[0] === "e") { var ev = T.event(p[1]); return { obj: ev, fields: ["title", "desc"], label: "Sự kiện " + ev.tr.vi.title, ent: "Sự kiện" }; }
    if (p[0] === "d") { var sd = T.superDeal(p[1]); return { obj: sd, fields: ["title", "cond"], label: "Deal " + sd.tr.vi.title, ent: "Deal siêu hời" }; }
    return p[0] === "v" ? { obj: T.venue(p[1]), fields: ["desc"], label: "Quán " + T.venue(p[1]).name, ent: "Quán" } : (function () { var o = S().offers.filter(function (x) { return x.id === p[1]; })[0]; return { obj: o, fields: ["title", "cond"], label: "Ưu đãi " + o.tr.vi.title, ent: "Ưu đãi" }; })(); }
  function trActions(el) {
    var t, k;
    if (el.dataset.savevi) {
      t = trTarget(el.dataset.savevi); var vi = t.obj.tr.vi = t.obj.tr.vi || {}, changed = false, before = JSON.stringify(vi);
      t.fields.forEach(function (f) { var v = document.querySelector('[data-vi="' + f + '"]').value.trim(); if (v !== (vi[f] || "")) changed = true; vi[f] = v; }); vi.status = "approved";
      if (changed) LANGS.slice(1).forEach(function (l) { var x = t.obj.tr[l[0]]; if (x && x.status === "approved") x.stale = true; });
      T.audit(who(), t.ent, t.label, "Sửa nội dung gốc (VI)", before, JSON.stringify(vi)); T.save(); T.toast(changed ? "Đã lưu. Các bản dịch đã duyệt được đánh dấu “cần dịch lại”." : "Không có thay đổi."); return true;
    }
    if (el.dataset.ai) {
      t = trTarget(el.dataset.ai); var picks = [].slice.call(document.querySelectorAll("[data-pick]:checked")).map(function (x) { return x.dataset.pick; });
      if (!picks.length) { T.toast("Chọn ít nhất 1 ngôn ngữ", "warn"); return true; }
      el.disabled = true; el.textContent = "✨ Đang dịch…";
      setTimeout(function () {
        picks.forEach(function (lg) { var x = t.obj.tr[lg] = t.obj.tr[lg] || {}; x.draft = {}; t.fields.forEach(function (f) { x.draft[f] = T.aiTranslate(t.obj.tr.vi[f], lg); }); x.draftBy = "ai"; });
        T.audit(who(), t.ent, t.label, "Dịch bằng AI (bản nháp)", null, picks.join(", ").toUpperCase()); T.save();
        T.toast('<div class="t-sim">MÔ PHỎNG · DỊCH VỤ DỊCH AI</div>Đã tạo bản nháp cho ' + picks.join(", ").toUpperCase() + ". Xem, sửa rồi bấm Duyệt.");
      }, 900); return true;
    }
    if (el.dataset.approve || el.dataset.discard || el.dataset.manual) {
      k = (el.dataset.approve || el.dataset.discard || el.dataset.manual).split("|"); t = trTarget(k[0]); var lg = k[1], x = t.obj.tr[lg] = t.obj.tr[lg] || {};
      if (el.dataset.discard) { x.draft = null; T.audit(who(), t.ent, t.label, "Bỏ bản nháp " + lg.toUpperCase()); }
      else {
        var vals = {}; t.fields.forEach(function (f) { vals[f] = document.querySelector('[data-tr="' + lg + '"][data-f="' + f + '"]').value.trim(); });
        if (el.dataset.manual) { x.draft = vals; x.draftBy = "manual"; T.audit(who(), t.ent, t.label, "Nhập tay bản dịch " + lg.toUpperCase() + " (nháp)"); }
        else { var before = t.fields.map(function (f) { return x[f] || ""; }).join(" | "); t.fields.forEach(function (f) { x[f] = vals[f]; }); x.status = "approved"; x.stale = false; x.draft = null; T.audit(who(), t.ent, t.label, "Duyệt bản dịch " + lg.toUpperCase(), before || "(chưa có)", t.fields.map(function (f) { return x[f]; }).join(" | ")); T.toast("Đã duyệt bản " + lg.toUpperCase() + ". Web khách hiển thị ngay."); }
      }
      T.save(); return true;
    }
    return false;
  }

  /* ---------- UC-A01 quán ---------- */
  VIEWS.venues = function () {
    if (sub.venue) return venueEdit(sub.venue);
    var h = head("Quán", "A01", '<button class="btn sm primary" id="newV">+ Thêm quán</button>') + '<table class="dt"><thead><tr><th></th><th>Quán</th><th>Loại · khu vực</th><th>Hợp đồng</th><th>Bản dịch</th><th>Hiển thị</th><th></th></tr></thead><tbody>' + S().venues.map(function (v) {
      var tr = LANGS.slice(1).map(function (l) { var x = v.tr[l[0]] || {}; return '<span class="tag ' + (x.draft ? "ai" : x.stale ? "warn" : x.status === "approved" ? "ok" : "gray") + '" title="' + l[1] + '">' + l[0].toUpperCase() + "</span>"; }).join(" ");
      return '<tr><td data-l=""><img class="mini-img" src="../assets/img/' + v.imgs[0] + '" alt=""></td><td data-l="Quán"><b>' + esc(v.name) + '</b><div class="small muted">' + esc(v.address) + '</div></td><td data-l="Loại · khu vực">' + esc(S().types[v.type].vi) + " · " + esc(v.area) + '</td><td data-l="Hợp đồng">' + esc(v.contact.contractNo) + '<div class="small muted">' + esc(v.contact.name) + '</div></td><td data-l="Bản dịch">' + tr + '</td><td data-l="Hiển thị">' + (v.visible ? '<span class="tag ok">Đang hiện</span>' : '<span class="tag gray">Đang ẩn</span>') + '</td><td data-l=""><button class="btn sm" data-ve="' + v.id + '">Sửa</button></td></tr>';
    }).join("") + "</tbody></table>";
    main(h);
  };
  function venueEdit(id) {
    var v = T.venue(id), tab = sub.vtab || "info";
    var h = head(v.name, "A01", '<button class="btn sm ghost" id="backV">← Danh sách quán</button>') + '<div class="note">Quán không tự sửa hồ sơ trong giai đoạn này. Toini trao đổi với quán rồi cập nhật trực tiếp tại đây. Mọi thay đổi được ghi nhật ký.</div><div class="tabs2">' + [["info", "Thông tin"], ["img", "Ảnh"], ["tr", "Bản dịch (AI)"], ["ct", "Hợp đồng & hiển thị"]].map(function (t) { return '<button data-vtab="' + t[0] + '" class="' + (tab === t[0] ? "on" : "") + '">' + t[1] + "</button>"; }).join("") + "</div>";
    if (tab === "info") {
      var f = function (k, l, val, type) { return '<label class="field"><span>' + l + '</span><input class="inp" data-k="' + k + '" value="' + esc(val) + '"' + (type ? ' type="' + type + '"' : "") + "></label>"; };
      h += '<div class="panel"><div class="fgrid">' + f("name", "Tên quán", v.name) + '<label class="field"><span>Loại hình</span><select class="inp" data-k="type">' + Object.keys(S().types).map(function (k) { return '<option value="' + k + '"' + (v.type === k ? " selected" : "") + ">" + esc(S().types[k].vi) + "</option>"; }).join("") + '</select></label><label class="field"><span>Khu vực</span><select class="inp" data-k="area">' + S().areas.map(function (a) { return "<option" + (v.area === a ? " selected" : "") + ">" + esc(a) + "</option>"; }).join("") + "</select></label>" + f("address", "Địa chỉ", v.address) + f("lat", "Vĩ độ (Google Maps / Grab) " + T.ref, v.lat) + f("lng", "Kinh độ " + T.ref, v.lng) + f("hours", "Giờ mở cửa", v.hours) + f("entry", "Phí vào cửa (đ)", v.entry, "number") + f("minSpend", "Chi tiêu tối thiểu (đ)", v.minSpend, "number") + f("priceFrom", "Giá từ (đ)", v.priceFrom, "number") + f("priceUnit", "Đơn vị giá", v.priceUnit) + f("taxNote", "Thuế & phí", v.taxNote) + f("dress", "Dress code", v.dress) + f("age", "Giới hạn tuổi (0 = không)", v.age, "number") + '<label class="field"><span>Mức giá</span><select class="inp" data-k="price">' + [1, 2, 3, 4].map(function (p) { return '<option value="' + p + '"' + (v.price === p ? " selected" : "") + ">" + "₫₫₫₫".slice(0, p) + "</option>"; }).join("") + '</select></label><div class="field span2"><span>Tiện ích (khách lọc được ở web khách) ' + '</span><div style="display:flex;flex-wrap:wrap;gap:6px">' + Object.keys(window.TOINI_I18N.tags).map(function (k) { return '<label class="chipf' + (v.tags.indexOf(k) >= 0 ? " on" : "") + '" style="display:inline-flex;gap:5px;align-items:center"><input type="checkbox" data-vtag="' + k + '"' + (v.tags.indexOf(k) >= 0 ? " checked" : "") + "> " + esc(window.TOINI_I18N.tags[k].vi) + "</label>"; }).join("") + '</div></div></div><iframe class="map" style="width:100%;height:220px;border:1px solid var(--line);border-radius:10px" loading="lazy" title="Bản đồ" src="https://maps.google.com/maps?q=' + encodeURIComponent(v.name + ", " + v.address) + '&z=16&output=embed"></iframe><p class="small muted">Bản đồ nhúng và nút Grab trên web khách dùng địa chỉ và tọa độ ở trên.</p><button class="btn primary" id="saveInfo">Lưu thông tin</button></div>';
    } else if (tab === "img") {
      h += '<div class="panel"><div class="imgs">' + v.imgs.map(function (p, i) { return '<figure><img src="../assets/img/' + p + '" alt=""><button data-rmimg="' + i + '" aria-label="Xóa ảnh">✕</button>' + (i === 0 ? '<figcaption class="small"><b>Ảnh đại diện</b></figcaption>' : '<figcaption><button class="btn sm ghost" style="position:static;background:none;color:var(--ink);padding:0" data-cover="' + i + '">Đặt làm đại diện</button></figcaption>') + "</figure>"; }).join("") + '</div><label class="field" style="margin-top:12px"><span>Thêm ảnh</span><input type="file" accept="image/*" multiple id="addimg"></label><p class="small muted">' + esc(v.credit) + "</p></div>";
    } else if (tab === "tr") {
      h += '<div class="panel">' + trBlock(v, ["desc"], ["Mô tả quán"], "v:" + v.id) + "</div>";
    } else {
      h += '<div class="panel"><div class="fgrid"><label class="field"><span>Số hợp đồng</span><input class="inp" data-c="contractNo" value="' + esc(v.contact.contractNo) + '"></label><label class="field"><span>Ngày hiệu lực</span><input class="inp" type="date" data-c="from" value="' + esc(v.contact.from) + '"></label><label class="field"><span>Người liên hệ</span><input class="inp" data-c="name" value="' + esc(v.contact.name) + '"></label><label class="field"><span>SĐT liên hệ (CSKH gọi khi quán chậm phản hồi)</span><input class="inp" data-c="phone" value="' + esc(v.contact.phone) + '"></label></div><label class="tg" style="display:flex;gap:8px;align-items:center;font-weight:800;margin:6px 0 14px"><input type="checkbox" id="vis"' + (v.visible ? " checked" : "") + '> Hiển thị quán trên web khách</label><button class="btn primary" id="saveCt">Lưu</button></div>';
    }
    main(h);
  }
  function newVenue() {
    T.modal("Thêm quán", '<label class="field"><span>Tên quán ' + T.ref + '</span><input class="inp" id="nvn" value="Quán mẫu mới"></label><label class="field"><span>Địa chỉ ' + T.ref + '</span><input class="inp" id="nva" value="99 Bạch Đằng, Hải Châu, Đà Nẵng"></label><p class="small muted">Quán mới mặc định <b>ẩn</b> cho tới khi nhập đủ thông tin và bật hiển thị.</p>', '<button class="btn" data-close>Hủy</button><button class="btn primary" id="nvok">Tạo</button>');
    document.getElementById("nvok").addEventListener("click", function () {
      var id = "v" + (S().venues.length + 1) + Math.random().toString(36).slice(2, 4), name = document.getElementById("nvn").value.trim();
      S().venues.push({ id: id, slug: id, name: name, type: "bar", area: "Hải Châu", address: document.getElementById("nva").value.trim(), lat: 16.07, lng: 108.22, price: 2, hours: "17:00 – 23:30", entry: 0, minSpend: 0, priceFrom: 100000, priceUnit: "ly", taxNote: "chưa gồm VAT", dress: "Thoải mái", age: 0, tags: [], rating: 0, reviews: 0, imgs: ["city/02.jpg"], credit: "Ảnh minh họa", contact: { name: "", phone: "", contractNo: "", from: T.today() }, visible: false, tr: { vi: { desc: "", status: "approved" } } });
      S().commissions[id] = [{ rate: 10, from: T.today(), by: who() }];
      T.audit(who(), "Quán", name, "Thêm quán", null, "Đang ẩn"); T.save(); T.closeModal(); sub.venue = id; sub.vtab = "info"; render();
    });
  }

  /* ---------- UC-A02 nhập dữ liệu ---------- */
  VIEWS.import = function () {
    var h = head("Nhập dữ liệu quán ban đầu", "A02") + '<div class="note">Nhập một lần khoảng 50 quán đầu tiên. Đội phát triển gửi file mẫu, Toini điền, đội phát triển tải lên. Hệ thống kiểm tra từng dòng và báo lỗi theo dòng.</div><div class="panel"><h2>Bước 1 · Tải file mẫu</h2><button class="btn" id="tpl">⬇ Tải file mẫu (CSV)</button></div><div class="panel"><h2>Bước 2 · Tải file đã điền lên</h2><input type="file" id="imf" accept=".csv,.xlsx,.xls"><p class="small muted">Bản mock không đọc nội dung file thật: chọn file bất kỳ để xem kết quả kiểm tra mô phỏng.</p><div id="imres"></div></div>';
    main(h);
  };

  /* ---------- UC-A03 ưu đãi ---------- */
  VIEWS.offers = function () {
    if (sub.offer) return offerEdit(sub.offer);
    var fv = sub.ofv || "";
    var list = S().offers.filter(function (o) { return !fv || o.venueId === fv; });
    var h = head("Ưu đãi của quán", "A03", '<button class="btn sm primary" id="newO">+ Thêm ưu đãi</button>') + '<div class="toolbar"><select class="inp" id="ofv"><option value="">Mọi quán</option>' + S().venues.map(function (v) { return '<option value="' + v.id + '"' + (fv === v.id ? " selected" : "") + ">" + esc(v.name) + "</option>"; }).join("") + "</select></div>" + '<table class="dt"><thead><tr><th>Quán</th><th>Ưu đãi</th><th>Khung giờ</th><th>Bản dịch</th><th>Trạng thái</th><th></th></tr></thead><tbody>' + list.map(function (o) {
      var tr = LANGS.slice(1).map(function (l) { var x = o.tr[l[0]] || {}; return '<span class="tag ' + (x.draft ? "ai" : x.stale ? "warn" : x.status === "approved" ? "ok" : "gray") + '">' + l[0].toUpperCase() + "</span>"; }).join(" ");
      return '<tr><td data-l="Quán">' + esc(vname(o.venueId)) + '</td><td data-l="Ưu đãi"><b>' + esc(o.tr.vi.title) + '</b><div class="small muted">' + esc(o.tr.vi.cond) + '</div></td><td data-l="Khung giờ">' + esc(o.from + "–" + o.to) + '<div class="small muted">đến ' + T.dmy(o.until) + '</div></td><td data-l="Bản dịch">' + tr + '</td><td data-l="Trạng thái">' + (o.active ? '<span class="tag ok">Đang chạy</span>' : '<span class="tag gray">Đã tắt</span>') + '</td><td data-l=""><button class="btn sm" data-oe="' + o.id + '">Sửa</button></td></tr>';
    }).join("") + "</tbody></table>";
    main(h);
  };
  function offerEdit(id) {
    var o = S().offers.filter(function (x) { return x.id === id; })[0], tab = sub.otab || "info";
    var D = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    var h = head("Ưu đãi · " + vname(o.venueId), "A03", '<button class="btn sm ghost" id="backO">← Danh sách ưu đãi</button>') + '<div class="tabs2"><button data-otab="info" class="' + (tab === "info" ? "on" : "") + '">Thông tin</button><button data-otab="tr" class="' + (tab === "tr" ? "on" : "") + '">Nội dung & bản dịch (AI)</button></div>';
    if (tab === "info") h += '<div class="panel"><div class="fgrid"><label class="field"><span>Quán</span><select class="inp" id="ov">' + S().venues.map(function (v) { return '<option value="' + v.id + '"' + (o.venueId === v.id ? " selected" : "") + ">" + esc(v.name) + "</option>"; }).join("") + '</select></label><label class="field"><span>Áp dụng đến</span><input class="inp" type="date" id="ou" value="' + o.until + '"></label><label class="field"><span>Từ giờ</span><input class="inp" type="time" id="of" value="' + o.from + '"></label><label class="field"><span>Đến giờ</span><input class="inp" type="time" id="ot" value="' + o.to + '"></label><div class="field span2"><span>Ngày áp dụng</span><div style="display:flex;flex-wrap:wrap;gap:6px">' + D.map(function (d, i) { return '<label class="chipf"><input type="checkbox" data-od="' + i + '"' + (o.days.indexOf(i) >= 0 ? " checked" : "") + "> " + d + "</label>"; }).join("") + '</div></div></div><label class="tg" style="display:flex;gap:8px;font-weight:800;margin-bottom:12px"><input type="checkbox" id="oa"' + (o.active ? " checked" : "") + '> Đang chạy</label><p class="small muted">Ưu đãi do quán chịu. Toini nhập theo thỏa thuận với quán.</p><button class="btn primary" id="saveO">Lưu</button></div>';
    else h += '<div class="panel">' + trBlock(o, ["title", "cond"], ["Tên ưu đãi", "Điều kiện"], "o:" + o.id) + "</div>";
    main(h);
  }

  /* ---------- UC-A04 tài khoản quán ---------- */
  VIEWS.shopacc = function () {
    var fv = sub.sav || "";
    var list = S().shopAccounts.filter(function (a) { return !fv || a.venueIds.indexOf(fv) >= 0; });
    var h = head("Tài khoản quán", "A04", '<button class="btn sm primary" id="newA">+ Tạo tài khoản</button>') + '<div class="note">Một quán có nhiều tài khoản, một tài khoản quản lý được nhiều quán. Trong quán không phân quyền: quán tự giao tài khoản cho nhân viên.</div><div class="toolbar"><select class="inp" id="sav"><option value="">Mọi quán</option>' + S().venues.map(function (v) { return '<option value="' + v.id + '"' + (fv === v.id ? " selected" : "") + ">" + esc(v.name) + " (" + S().shopAccounts.filter(function (a) { return a.venueIds.indexOf(v.id) >= 0; }).length + " tài khoản)</option>"; }).join("") + '</select></div><table class="dt"><thead><tr><th>Tên đăng nhập</th><th>Tên · email</th><th>Quán được gán</th><th>Trạng thái</th><th></th></tr></thead><tbody>' + list.map(function (a) {
      return '<tr><td data-l="Tên đăng nhập"><b>' + esc(a.username) + '</b></td><td data-l="Tên · email">' + esc(a.name) + '<div class="small muted">' + esc(a.email) + '</div></td><td data-l="Quán được gán">' + a.venueIds.map(function (id) { return '<span class="tag info">' + esc(vname(id)) + "</span>"; }).join(" ") + '</td><td data-l="Trạng thái">' + (a.locked ? '<span class="tag bad">Đã khóa</span>' : '<span class="tag ok">Hoạt động</span>') + (a.mustChange ? ' <span class="tag warn">Mật khẩu tạm</span>' : "") + '</td><td data-l=""><div class="acts"><button class="btn sm" data-ae="' + a.id + '">Sửa / gán quán</button><button class="btn sm" data-alock="' + a.id + '">' + (a.locked ? "Mở khóa" : "Khóa") + '</button><button class="btn sm ghost" data-areset="' + a.id + '">Cấp lại mật khẩu</button></div></td></tr>';
    }).join("") + "</tbody></table>";
    main(h);
  };
  function accForm(a) {
    var isNew = !a; a = a || { id: T.uid("sa"), username: "quan.moi", name: "Nhân viên mới", email: "nv@quan.example", password: "Tam@" + Math.floor(1000 + Math.random() * 9000), venueIds: [], locked: false, mustChange: true };
    T.modal(isNew ? "Tạo tài khoản quán" : "Sửa tài khoản " + a.username, '<div class="fgrid"><label class="field"><span>Tên đăng nhập ' + T.ref + '</span><input class="inp" id="au" value="' + esc(a.username) + '"' + (isNew ? "" : " disabled") + '></label><label class="field"><span>Tên hiển thị</span><input class="inp" id="an" value="' + esc(a.name) + '"></label><label class="field span2"><span>Email (để đặt lại mật khẩu)</span><input class="inp" id="ae" value="' + esc(a.email) + '"></label></div><div class="field"><span>Gán cho quán (chọn một hoặc nhiều)</span>' + S().venues.map(function (v) { return '<label style="display:flex;gap:8px;align-items:center;font-weight:600"><input type="checkbox" data-av="' + v.id + '"' + (a.venueIds.indexOf(v.id) >= 0 ? " checked" : "") + "> " + esc(v.name) + "</label>"; }).join("") + "</div>" + (isNew ? '<p class="small">Mật khẩu tạm: <b>' + esc(a.password) + "</b> " + T.ref + " – nhân viên phải đổi ở lần đăng nhập đầu.</p>" : ""), '<button class="btn" data-close>Hủy</button><button class="btn primary" id="asave">Lưu</button>');
    document.getElementById("asave").addEventListener("click", function () {
      var vids = [].slice.call(document.querySelectorAll("[data-av]:checked")).map(function (x) { return x.dataset.av; });
      if (!vids.length) { T.toast("Gán ít nhất 1 quán", "warn"); return; }
      var before = isNew ? null : a.venueIds.map(vname).join(", ");
      if (isNew) { a.username = document.getElementById("au").value.trim(); if (S().shopAccounts.some(function (x) { return x.username === a.username; })) { T.toast("Tên đăng nhập đã tồn tại", "warn"); return; } S().shopAccounts.push(a); }
      a.name = document.getElementById("an").value.trim(); a.email = document.getElementById("ae").value.trim(); a.venueIds = vids;
      T.audit(who(), "Tài khoản quán", a.username, isNew ? "Tạo tài khoản" : "Sửa / gán quán", before, vids.map(vname).join(", ")); T.save(); T.closeModal(); render();
      if (isNew) T.toast('<div class="t-sim">MÔ PHỎNG · EMAIL</div>Đã gửi thông tin đăng nhập tới ' + esc(a.email));
    });
  }

  /* ---------- UC-A05 nhân viên ---------- */
  VIEWS.staff = function () {
    main(head("Nhân viên Toini", "A05", '<button class="btn sm primary" id="newS">+ Thêm nhân viên</button>') + '<div class="note"><b>Giám đốc</b>: toàn quyền. <b>Sale/CSKH</b>: quán, ưu đãi, nội dung, đơn, tài khoản quán. <b>Kế toán</b>: đối soát, công nợ, xuất số liệu.</div><table class="dt"><thead><tr><th>Tên đăng nhập</th><th>Tên</th><th>Vai trò</th><th>Trạng thái</th><th></th></tr></thead><tbody>' + S().staff.map(function (s) {
      return '<tr><td data-l="Tên đăng nhập"><b>' + esc(s.username) + '</b></td><td data-l="Tên">' + esc(s.name) + '</td><td data-l="Vai trò"><select class="inp" style="min-height:34px;padding:3px 8px" data-role="' + s.id + '"' + (s.id === me().id ? " disabled" : "") + ">" + Object.keys(T.ROLE).map(function (r) { return '<option value="' + r + '"' + (s.role === r ? " selected" : "") + ">" + T.ROLE[r] + "</option>"; }).join("") + '</select></td><td data-l="Trạng thái">' + (s.locked ? '<span class="tag bad">Đã khóa</span>' : '<span class="tag ok">Hoạt động</span>') + '</td><td data-l="">' + (s.id === me().id ? '<span class="small muted">(bạn)</span>' : '<button class="btn sm" data-slock="' + s.id + '">' + (s.locked ? "Mở khóa" : "Khóa") + "</button>") + "</td></tr>";
    }).join("") + "</tbody></table>");
  };

  /* ---------- UC-A08 hoa hồng ---------- */
  VIEWS.commission = function () {
    main(head("Tỷ lệ hoa hồng", "A08") + '<div class="note">Mỗi đơn dùng tỷ lệ đang áp dụng vào ngày khách tới. Thêm phiên bản mới không làm đổi hoa hồng các đơn trước đó. Mỗi quán một tỷ lệ (chưa tách theo loại dịch vụ).</div><table class="dt"><thead><tr><th>Quán</th><th>Đang áp dụng</th><th>Lịch sử phiên bản</th><th></th></tr></thead><tbody>' + S().venues.map(function (v) {
      var vs = (S().commissions[v.id] || []).slice().sort(function (a, b) { return a.from < b.from ? 1 : -1; });
      return '<tr><td data-l="Quán"><b>' + esc(v.name) + '</b></td><td data-l="Đang áp dụng"><b style="font-size:1.1rem">' + T.rateAt(v.id, T.today()) + '%</b></td><td data-l="Lịch sử phiên bản" class="small">' + vs.map(function (x) { return x.rate + "% từ " + T.dmy(x.from) + " <span class=\"muted\">(" + esc(x.by) + ")</span>" + (x.from > T.today() ? ' <span class="tag info">sắp áp dụng</span>' : ""); }).join("<br>") + '</td><td data-l=""><button class="btn sm" data-cm="' + v.id + '">+ Phiên bản mới</button></td></tr>';
    }).join("") + "</tbody></table>");
  };

  /* ---------- UC-A09 đối soát ---------- */
  VIEWS.recon = function () {
    var f = sub.rf || "all", s = S();
    var rows = s.bookings.filter(function (b) { return b.status === "billed" || b.status === "arrived"; });
    var shown = rows.filter(function (b) { return f === "all" || (f === "noinv" && b.status === "arrived") || (f === "byq" && b.arrivedBy === "quan") || (f === "unrec" && b.status === "billed" && !b.reconciled); });
    var h = head("Đối soát kỳ đang mở", "A09", '<span class="small muted">Kỳ hiện tại từ ' + T.dt(s.lastClose) + "</span>") + '<div class="note">Đối chiếu giờ khách tới, số khách và giá trị hóa đơn. Lệch số thì liên hệ quán (ngoài hệ thống), rồi điều chỉnh có lý do. Kỳ tự chốt vào thứ Hai 12:00.</div><div class="toolbar">' + [["all", "Tất cả"], ["unrec", "Chưa khớp"], ["noinv", "Chưa có hóa đơn"], ["byq", "Quán báo đã tới"]].map(function (x) { return '<button class="chipf' + (f === x[0] ? " on" : "") + '" data-rf="' + x[0] + '">' + x[1] + " (" + rows.filter(function (b) { return x[0] === "all" || (x[0] === "noinv" && b.status === "arrived") || (x[0] === "byq" && b.arrivedBy === "quan") || (x[0] === "unrec" && b.status === "billed" && !b.reconciled); }).length + ")</button>"; }).join("") + "</div>";
    h += shown.length ? '<table class="dt"><thead><tr><th>Mã · quán</th><th>Khách tới</th><th>Khách đặt/thực</th><th>Hóa đơn</th><th>Giá trị</th><th>HH</th><th>Đối soát</th><th></th></tr></thead><tbody>' + shown.map(function (b) {
      var cm = b.invoice ? T.calcCommission(b) + (b.commissionAdj || 0) : 0;
      return '<tr class="' + (b.arrivedBy === "quan" || b.status === "arrived" ? "hl" : "") + '"><td data-l="Mã · quán"><b>' + esc(b.code) + '</b><div class="small">' + esc(vname(b.venueId)) + '</div></td><td data-l="Khách tới">' + T.dt(b.arrivedAt) + '<div><span class="tag ' + (b.arrivedBy === "quan" ? "warn" : "info") + '">' + (b.arrivedBy === "quan" ? "Quán báo" : "Khách bấm") + (b.geo ? " · có vị trí" : "") + '</span></div></td><td data-l="Khách đặt/thực" class="n">' + b.pax + " / " + (b.invoice ? b.invoice.pax : "—") + '</td><td data-l="Hóa đơn">' + (b.invoice ? esc(b.invoice.no) + (b.invoice.photo ? ' <a href="#" data-photo="' + b.id + '">🖼 ảnh</a>' : "") : '<span class="tag bad">Chưa có</span>' + (b.missingInvoice ? ' <span class="tag bad">từ kỳ trước</span>' : "")) + '</td><td data-l="Giá trị" class="n">' + (b.invoice ? T.vnd(b.invoice.amount) : "—") + '</td><td data-l="HH" class="n">' + (b.invoice ? '<span style="color:' + (cm < 0 ? "var(--info)" : "inherit") + '">' + T.vnd(cm) + "</span>" + '<div class="small muted">' + T.rateAt(b.venueId, b.date) + "%" + (b.invoice.sponsor ? " · Toini tài trợ −" + T.vnd(b.invoice.sponsor) : "") + (b.commissionAdj ? " · ĐC " + T.vnd(b.commissionAdj) : "") + "</div>" : "—") + '</td><td data-l="Đối soát">' + (b.reconciled ? '<span class="tag ok">Đã khớp</span>' : b.invoice ? '<span class="tag warn">Chưa khớp</span>' : "—") + '</td><td data-l="">' + (b.invoice ? '<div class="acts">' + (b.reconciled ? "" : '<button class="btn sm primary" data-rec="' + b.id + '">Đã khớp</button>') + '<button class="btn sm" data-adj="' + b.id + '">Điều chỉnh</button></div>' : "") + "</td></tr>";
    }).join("") + "</tbody></table>" : '<div class="empty2">Không có đơn.</div>';
    var settled = s.bookings.filter(function (b) { return b.status === "settled"; });
    h += '<div class="panel" style="margin-top:16px"><h2>Điều chỉnh đơn đã chốt kỳ</h2><p class="small muted">Kỳ đã chốt không bị sửa. Điều chỉnh được ghi thành một dòng riêng ở kỳ sau.</p><div class="toolbar"><select class="inp" id="adjS">' + settled.map(function (b) { return '<option value="' + b.id + '">' + esc(b.code + " · " + vname(b.venueId) + " · kỳ " + b.periodId + " · HH " + T.vnd(b.commission)) + "</option>"; }).join("") + '</select><button class="btn sm" id="adjSettled">Tạo điều chỉnh</button></div>' + ((s.pendingAdj || []).length ? '<table class="dt"><thead><tr><th>Đơn</th><th>Số tiền</th><th>Lý do</th><th>Người tạo</th></tr></thead><tbody>' + s.pendingAdj.map(function (a) { return '<tr><td data-l="Đơn">' + esc(a.code) + '</td><td data-l="Số tiền" class="n">' + T.vnd(a.amount) + '</td><td data-l="Lý do">' + esc(a.reason) + '</td><td data-l="Người tạo">' + esc(a.by) + "</td></tr>"; }).join("") + "</tbody></table>" : "") + "</div>";
    main(h);
  };
  function adjust(b) {
    var cm = T.calcCommission(b) + (b.commissionAdj || 0);
    T.modal("Điều chỉnh · " + b.code, '<div class="fgrid"><label class="field"><span>Giá trị hóa đơn (đ)</span><input class="inp" id="aam" inputmode="numeric" value="' + b.invoice.amount + '"></label><label class="field"><span>Điều chỉnh thêm vào hoa hồng (đ, có thể âm)</span><input class="inp" id="acm" inputmode="numeric" value="' + (b.commissionAdj || 0) + '"></label></div><p class="small">Hoa hồng hiện tại: <b>' + T.vnd(cm) + '</b></p><label class="field"><span>Lý do (bắt buộc) ' + T.ref + '</span><textarea class="inp" id="ars" rows="2">Quán gửi lại hóa đơn bổ sung, đã xác nhận qua Zalo</textarea></label>', '<button class="btn" data-close>Hủy</button><button class="btn primary" id="aok">Lưu điều chỉnh</button>');
    document.getElementById("aok").addEventListener("click", function () {
      var am = +String(document.getElementById("aam").value).replace(/[^\d]/g, ""), ad = +String(document.getElementById("acm").value).replace(/[^\d-]/g, ""), r = document.getElementById("ars").value.trim();
      if (!r) { T.toast("Cần nhập lý do", "warn"); return; }
      var before = T.vnd(b.invoice.amount) + " · HH " + T.vnd(cm);
      b.invoice.amount = am; b.invoice.sponsor = T.dealSponsor(b.deal, am); b.commissionAdj = ad; b.reconciled = true;
      b.history.push({ at: T.now(), by: who(), action: "Kế toán điều chỉnh: " + r });
      T.audit(who(), "Đối soát", b.code, "Điều chỉnh – " + r, before, T.vnd(am) + " · HH " + T.vnd(T.calcCommission(b) + ad)); T.save(); T.closeModal(); render();
    });
  }

  /* ---------- UC-A10 công nợ ---------- */
  VIEWS.debt = function () {
    var s = S(), rows = [];
    s.periods.forEach(function (p) { p.lines.forEach(function (l) { rows.push({ p: p, l: l, d: T.debtOf(l.venueId, p.id) }); }); });
    var tot = rows.reduce(function (a, r) { return a + r.d.left; }, 0), over = rows.filter(function (r) { return r.d.overdue; }).reduce(function (a, r) { return a + r.d.left; }, 0);
    var openSum = s.bookings.filter(function (b) { return b.status === "billed"; }).reduce(function (a, b) { return a + T.calcCommission(b) + (b.commissionAdj || 0); }, 0);
    var h = head("Công nợ", "A10") + '<div class="kpis"><div class="kpi"><span>Còn phải thu</span><b>' + T.vnd(tot) + '</b></div><div class="kpi"><span>Đã quá hạn</span><b style="color:' + (over ? "var(--bad)" : "inherit") + '">' + T.vnd(over) + '</b></div><div class="kpi"><span>Kỳ đang mở (tạm tính)</span><b>' + T.vnd(openSum) + '</b></div><div class="kpi"><span>Số kỳ đã chốt</span><b>' + s.periods.length + "</b></div></div>";
    h += rows.length ? '<table class="dt"><thead><tr><th>Kỳ</th><th>Quán</th><th>Phát sinh</th><th>Đã thu</th><th>Còn lại</th><th>Hạn trả</th><th></th></tr></thead><tbody>' + rows.map(function (r) {
      return '<tr class="' + (r.d.overdue ? "hl" : "") + '"><td data-l="Kỳ"><b>' + r.p.id + '</b><div class="small muted">' + T.dmy(r.p.from) + " – " + T.dmy(r.p.to) + '</div></td><td data-l="Quán">' + esc(vname(r.l.venueId)) + '</td><td data-l="Phát sinh" class="n">' + T.vnd(r.d.amount) + '</td><td data-l="Đã thu" class="n">' + T.vnd(r.d.paid) + '</td><td data-l="Còn lại" class="n"><b>' + T.vnd(r.d.left) + '</b></td><td data-l="Hạn trả">' + T.dmy(r.d.due) + " " + (r.d.amount < 0 && r.d.left < 0 ? '<span class="tag info">Toini trả quán</span>' : r.d.left <= 0 ? '<span class="tag ok">Đủ</span>' : r.d.overdue ? '<span class="tag bad">Quá hạn</span>' : '<span class="tag warn">Chưa đủ</span>') + '</td><td data-l=""><div class="acts">' + (r.d.left > 0 ? '<button class="btn sm primary" data-pay="' + r.l.venueId + "|" + r.p.id + '">Ghi nhận đã thu</button>' : r.d.left < 0 ? '<button class="btn sm" data-pay="' + r.l.venueId + "|" + r.p.id + '">Ghi nhận đã trả quán</button>' : "") + '<button class="btn sm" data-dd="' + r.l.venueId + "|" + r.p.id + '">Chi tiết</button></div></td></tr>';
    }).join("") + "</tbody></table>" : '<div class="empty2">Chưa có kỳ nào được chốt.</div>';
    main(h);
  };

  /* ---------- UC-A11 xuất số liệu ---------- */
  VIEWS.export = function () {
    var m = sub.exm || T.today().slice(0, 7);
    main(head("Xuất số liệu theo mẫu ThucTe", "A11") + '<div class="panel"><div class="toolbar"><label class="small"><b>Tháng</b> <input class="inp" type="month" id="exm" value="' + m + '" style="width:auto"></label><button class="btn primary" id="exBtn">⬇ Xuất file</button></div><p class="small muted">File gồm từng hóa đơn và bảng tổng hợp theo quán. Tên cột trong bản mock là ' + T.ref + '; bản thật theo đúng các cột tab ThucTe trong file kế hoạch tài chính Toini đã gửi. Bản mock xuất CSV mở được bằng Excel.</p></div>');
  };

  /* ---------- UC-A12 nội dung & cấu hình ---------- */
  VIEWS.content = function () {
    var tab = sub.ctab || "ui", s = S(), h = head("Nội dung & cấu hình", "A12") + '<div class="tabs2">' + [["ui", "Chữ giao diện"], ["tpl", "Mẫu tin & email"], ["terms", "Điều khoản"], ["chat", "Kênh chat"], ["cat", "Danh mục"]].map(function (t) { return '<button data-ctab="' + t[0] + '" class="' + (tab === t[0] ? "on" : "") + '">' + t[1] + "</button>"; }).join("") + "</div>";
    if (tab === "ui") {
      var lg = sub.uilg || "ko", I = window.TOINI_I18N.t, keys = ["tagline", "sub", "book", "openOnly", "deals", "noFee", "pendingHint", "arrived", "showStaff", "chat"];
      h += '<div class="panel"><div class="toolbar"><b>Sửa bản dịch ngôn ngữ:</b><select class="inp" id="uilg" style="flex:0 1 160px">' + LANGS.map(function (l) { return '<option value="' + l[0] + '"' + (lg === l[0] ? " selected" : "") + ">" + l[1] + "</option>"; }).join("") + '</select></div><p class="small muted">Chữ giao diện tách khỏi mã nguồn. Toini sửa ở đây, web khách đổi ngay (mock hiển thị 10 dòng tiêu biểu).</p><table class="dt"><thead><tr><th>Mã</th><th>Tiếng Việt</th><th>' + lg.toUpperCase() + "</th></tr></thead><tbody>" + keys.map(function (k) { var ov = (s.uiOverrides[k] || {})[lg]; return '<tr><td data-l="Mã" class="small">' + k + '</td><td data-l="Tiếng Việt" class="small">' + esc(I[k].vi) + '</td><td data-l="' + lg.toUpperCase() + '" class="full"><input class="inp" data-ui="' + k + '" value="' + esc(ov || I[k][lg]) + '"></td></tr>'; }).join("") + '</tbody></table><button class="btn primary" id="saveUi" style="margin-top:10px">Lưu bản dịch giao diện</button></div>';
    } else if (tab === "tpl") {
      h += '<div class="note">Mẫu tin Zalo ZNS và SMS brandname phải được Zalo/nhà mạng duyệt. Muốn đổi câu chữ phải gửi duyệt lại, không sửa ngay trên hệ thống. Nội dung email thì Toini sửa trực tiếp.</div><table class="dt"><thead><tr><th>Mẫu</th><th>Kênh</th><th>Nội dung (VI, không dấu cho SMS)</th><th>Trạng thái duyệt</th><th></th></tr></thead><tbody>' + s.templates.map(function (t, i) { return '<tr><td data-l="Mẫu"><b>' + t.k + '</b></td><td data-l="Kênh">' + esc(t.ch) + '</td><td data-l="Nội dung" class="full small">' + esc(t.vi) + '</td><td data-l="Trạng thái"><span class="tag ' + (/chờ/i.test(t.status) ? "warn" : "ok") + '">' + esc(t.status) + '</span></td><td data-l=""><button class="btn sm" data-tpl="' + i + '">Sửa email</button></td></tr>'; }).join("") + "</tbody></table>";
    } else if (tab === "terms") {
      h += '<div class="panel"><label class="field"><span>Điều khoản sử dụng & chính sách bảo mật (nội dung pháp lý do Toini cung cấp)</span><textarea class="inp" id="terms" rows="8">' + esc(s.settings.terms) + '</textarea></label><button class="btn primary" id="saveTerms">Lưu</button></div>';
    } else if (tab === "chat") {
      h += '<div class="panel"><p class="small muted">Nút chat nổi trên web khách. Kênh hợp với ngôn ngữ của khách được xếp lên đầu.</p><table class="dt"><thead><tr><th>Kênh</th><th>Link ' + T.ref + "</th><th>Ưu tiên cho ngôn ngữ</th></tr></thead><tbody>" + s.settings.chat.map(function (c, i) { return '<tr><td data-l="Kênh"><b>' + esc(c.name) + '</b></td><td data-l="Link" class="full"><input class="inp" data-chl="' + i + '" value="' + esc(c.link) + '"></td><td data-l="Ngôn ngữ"><input class="inp" data-chg="' + i + '" value="' + esc(c.langs.join(",")) + '" style="max-width:140px"></td></tr>'; }).join("") + '</tbody></table><button class="btn primary" id="saveChat" style="margin-top:10px">Lưu</button></div>';
    } else {
      h += '<div class="panel"><h2>Khu vực</h2><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">' + s.areas.map(function (a) { return '<span class="tag info">' + esc(a) + "</span>"; }).join("") + '</div><div class="toolbar"><input class="inp" id="newArea" value="Liên Chiểu"><button class="btn sm" id="addArea">+ Thêm khu vực</button></div><h2 style="margin-top:14px">Loại hình</h2><div style="display:flex;flex-wrap:wrap;gap:6px">' + Object.keys(s.types).map(function (k) { return '<span class="tag gray">' + s.types[k].icon + " " + esc(s.types[k].vi) + "</span>"; }).join("") + '</div><h2 style="margin-top:14px">Tiện ích</h2><div style="display:flex;flex-wrap:wrap;gap:6px">' + Object.keys(window.TOINI_I18N.tags).map(function (k) { var tg = window.TOINI_I18N.tags[k]; return '<span class="tag ok" title="' + esc(tg.en + " · " + tg.ko + " · " + tg.ru + " · " + tg.zh + " · " + tg.ja) + '">' + esc(tg.vi) + " · " + s.venues.filter(function (v) { return v.tags.indexOf(k) >= 0; }).length + " quán</span>"; }).join("") + '</div><p class="small muted">Mỗi tiện ích có tên ở 6 ngôn ngữ. Gắn tiện ích cho quán ở mục Quán → Thông tin.</p></div>';
    }
    main(h);
  };

  /* ---------- UC-A13 nhật ký ---------- */
  VIEWS.audit = function () {
    var f = sub.au = sub.au || { actor: "", ent: "", q: "" }, s = S();
    var actors = [], ents = []; s.audit.forEach(function (a) { if (actors.indexOf(a.actor) < 0) actors.push(a.actor); if (ents.indexOf(a.entity) < 0) ents.push(a.entity); });
    var list = s.audit.filter(function (a) { return (!f.actor || a.actor === f.actor) && (!f.ent || a.entity === f.ent) && (!f.q || (a.entityId + " " + a.action).toLowerCase().indexOf(f.q.toLowerCase()) >= 0); });
    main(head("Nhật ký thao tác", "A13") + '<div class="note">Ghi mọi thao tác tạo mới, chỉnh sửa, đổi trạng thái của nhân viên Toini, tài khoản quán, khách và hệ thống. Không ai sửa hoặc xóa được nhật ký.</div><div class="toolbar"><select class="inp" id="auA"><option value="">Mọi người</option>' + actors.map(function (x) { return "<option" + (f.actor === x ? " selected" : "") + ">" + esc(x) + "</option>"; }).join("") + '</select><select class="inp" id="auE"><option value="">Mọi đối tượng</option>' + ents.map(function (x) { return "<option" + (f.ent === x ? " selected" : "") + ">" + esc(x) + "</option>"; }).join("") + '</select><input class="inp" id="auQ" placeholder="Tìm mã đơn, tên quán…" value="' + esc(f.q) + '"></div><p class="small muted">' + list.length + ' dòng</p><table class="dt"><thead><tr><th>Thời điểm</th><th>Người làm</th><th>Đối tượng</th><th>Thao tác</th><th>Trước → Sau</th></tr></thead><tbody>' + list.slice(0, 150).map(function (a) { return '<tr><td data-l="Thời điểm" class="small">' + T.dt(a.at) + '</td><td data-l="Người làm">' + esc(a.actor) + '</td><td data-l="Đối tượng">' + esc(a.entity) + '<div class="small muted">' + esc(a.entityId) + '</div></td><td data-l="Thao tác">' + esc(a.action) + '</td><td data-l="Trước → Sau" class="full"><div class="diff">' + (a.before != null ? "<del>" + esc(a.before) + "</del> → " : "") + (a.after != null ? "<ins>" + esc(a.after) + "</ins>" : "") + "</div></td></tr>"; }).join("") + "</tbody></table>");
    document.getElementById("auA").addEventListener("change", function (e) { f.actor = e.target.value; VIEWS.audit(); });
    document.getElementById("auE").addEventListener("change", function (e) { f.ent = e.target.value; VIEWS.audit(); });
    document.getElementById("auQ").addEventListener("change", function (e) { f.q = e.target.value; VIEWS.audit(); });
  };

  /* ---------- UC-A14 trần gửi tin ---------- */
  VIEWS.caps = function () {
    var s = S(), c = T.counter(), cp = s.settings.caps;
    var bar = function (k, l) { var p = Math.min(100, Math.round(c[k] / cp[k] * 100)); return '<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between" class="small"><b>' + l + "</b><span>" + c[k] + " / " + cp[k] + " (" + p + '%)</span></div><div style="height:10px;background:#eee;border-radius:99px;overflow:hidden"><i style="display:block;height:100%;width:' + p + "%;background:" + (p >= 100 ? "var(--bad)" : p >= 80 ? "var(--warn)" : "var(--ok)") + '"></i></div></div>'; };
    var f = function (k, l) { return '<label class="field"><span>' + l + " " + T.ref + '</span><input class="inp" type="number" min="0" data-cap="' + k + '" value="' + cp[k] + '"></label>'; };
    main(head("Trần gửi tin & chặn lạm dụng", "A14") + '<div class="panel"><h2>Hôm nay</h2>' + bar("zns", "Zalo ZNS") + bar("sms", "SMS brandname") + '<p class="small muted">Email: ' + c.email + ' tin (không giới hạn). Cảnh báo khi đạt 80% và 100%. Chạm trần thì ngừng gửi kênh đó tới hết ngày; khách có email nhận qua email.</p><button class="btn sm ghost" id="simCap">Mô phỏng: đẩy ZNS lên sát trần</button></div><div class="panel"><h2>Giới hạn</h2><div class="fgrid">' + f("zns", "Trần ZNS / ngày (toàn hệ thống)") + f("sms", "Trần SMS / ngày (toàn hệ thống)") + f("perPhone", "Số lần gửi mã / SĐT / ngày") + f("perEmail", "Số lần gửi mã / email / ngày") + f("perIp", "Số lần gửi mã / IP / ngày") + '</div><button class="btn primary" id="saveCaps">Lưu giới hạn</button></div><div class="panel"><h2>Danh sách chặn</h2><table class="dt"><thead><tr><th>Giá trị</th><th>Loại</th><th>Ghi chú</th><th></th></tr></thead><tbody>' + s.settings.blocked.map(function (b, i) { return '<tr><td data-l="Giá trị"><b>' + esc(b.v) + '</b></td><td data-l="Loại">' + esc(b.kind) + '</td><td data-l="Ghi chú">' + esc(b.note) + '</td><td data-l=""><button class="btn sm" data-unblock="' + i + '">Bỏ chặn</button></td></tr>'; }).join("") + '</tbody></table><div class="toolbar" style="margin-top:10px"><input class="inp" id="blv" value="+84 988 000 111"><select class="inp" id="blk"><option value="phone">SĐT</option><option value="email">Email</option><option value="ip">IP</option></select><input class="inp" id="bln" value="Gửi mã liên tục"><button class="btn sm" id="addBlock">+ Chặn</button></div></div>');
  };

  /* ---------- A15 sự kiện ---------- */
  var TAGS = window.TOINI_I18N.tags;
  VIEWS.events = function () {
    if (sub.event) return eventEdit(sub.event);
    var f = sub.evf || "up", today = T.today();
    var list = S().events.filter(function (e) { return f === "all" || (f === "up" ? e.date >= today : e.date < today); }).sort(function (a, b) { return (a.date + a.from < b.date + b.from ? -1 : 1) * (f === "past" ? -1 : 1); });
    main(head("Sự kiện", "A15", '<button class="btn sm primary" id="newE">+ Thêm sự kiện</button>') + '<div class="note">Toini nhập sự kiện cho quán. Khách xem ở mục Sự kiện, lịch tháng và trang quán; bấm “Đặt bàn cho sự kiện” thì đơn được gắn với sự kiện. Chưa bán vé (giai đoạn 2).</div><div class="toolbar">' + [["up", "Sắp tới"], ["past", "Đã qua"], ["all", "Tất cả"]].map(function (x) { return '<button class="chipf' + (f === x[0] ? " on" : "") + '" data-evf="' + x[0] + '">' + x[1] + "</button>"; }).join("") + '</div><table class="dt"><thead><tr><th></th><th>Ngày giờ</th><th>Sự kiện</th><th>Quán</th><th>Số đơn</th><th>Bản dịch</th><th>Trạng thái</th><th></th></tr></thead><tbody>' + list.map(function (e) {
      var n = S().bookings.filter(function (b) { return b.eventId === e.id; }).length, tr = LANGS.slice(1).map(function (l) { var x = e.tr[l[0]] || {}; return '<span class="tag ' + (x.draft ? "ai" : x.stale ? "warn" : x.status === "approved" ? "ok" : "gray") + '">' + l[0].toUpperCase() + "</span>"; }).join(" ");
      return '<tr><td data-l=""><img class="mini-img" src="../assets/img/' + e.img + '" alt=""></td><td data-l="Ngày giờ"><b>' + T.wd(e.date, "vi") + " " + T.dmy(e.date) + '</b><div class="small muted">' + esc(e.from + "–" + e.to) + '</div></td><td data-l="Sự kiện"><b>' + esc(e.tr.vi.title) + '</b></td><td data-l="Quán">' + esc(vname(e.venueId)) + '</td><td data-l="Số đơn" class="n">' + n + '</td><td data-l="Bản dịch">' + tr + '</td><td data-l="Trạng thái">' + (e.active ? '<span class="tag ok">Đang hiện</span>' : '<span class="tag gray">Đang ẩn</span>') + '</td><td data-l=""><button class="btn sm" data-ee="' + e.id + '">Sửa</button></td></tr>';
    }).join("") + "</tbody></table>" + (list.length ? "" : '<div class="empty2">Không có sự kiện.</div>'));
  };
  function eventEdit(id) {
    var e = T.event(id), v = T.venue(e.venueId), tab = sub.etab || "info";
    var h = head("Sự kiện · " + e.tr.vi.title, "A15", '<button class="btn sm ghost" id="backE">← Danh sách sự kiện</button>') + '<div class="tabs2"><button data-etab="info" class="' + (tab === "info" ? "on" : "") + '">Thông tin</button><button data-etab="tr" class="' + (tab === "tr" ? "on" : "") + '">Nội dung & bản dịch (AI)</button></div>';
    if (tab === "info") h += '<div class="panel"><div class="fgrid"><label class="field"><span>Quán</span><select class="inp" id="eV">' + S().venues.map(function (x) { return '<option value="' + x.id + '"' + (x.id === e.venueId ? " selected" : "") + ">" + esc(x.name) + "</option>"; }).join("") + '</select></label><label class="field"><span>Ngày</span><input class="inp" type="date" id="eD" value="' + e.date + '"></label><label class="field"><span>Từ giờ</span><input class="inp" type="time" id="eF" value="' + e.from + '"></label><label class="field"><span>Đến giờ</span><input class="inp" type="time" id="eT" value="' + e.to + '"></label></div><div class="field"><span>Ảnh sự kiện (chọn từ ảnh của quán)</span><div class="imgs">' + v.imgs.map(function (p) { return '<label style="cursor:pointer"><input type="radio" name="eImg" value="' + p + '"' + (p === e.img ? " checked" : "") + '> <img class="mini-img" src="../assets/img/' + p + '" alt=""></label>'; }).join("") + '</div></div><div class="field"><span>Nhãn</span><div style="display:flex;flex-wrap:wrap;gap:6px">' + Object.keys(TAGS).map(function (k) { return '<label class="chipf' + ((e.tags || []).indexOf(k) >= 0 ? " on" : "") + '"><input type="checkbox" data-etag="' + k + '"' + ((e.tags || []).indexOf(k) >= 0 ? " checked" : "") + "> " + esc(TAGS[k].vi) + "</label>"; }).join("") + '</div></div><label class="tg" style="display:flex;gap:8px;font-weight:800;margin-bottom:12px"><input type="checkbox" id="eA"' + (e.active ? " checked" : "") + '> Hiện trên web khách</label><p class="small muted">Số đơn đặt cho sự kiện này: <b>' + S().bookings.filter(function (b) { return b.eventId === e.id; }).length + '</b></p><button class="btn primary" id="saveE">Lưu</button></div>';
    else h += '<div class="panel">' + trBlock(e, ["title", "desc"], ["Tên sự kiện", "Mô tả"], "e:" + e.id) + "</div>";
    main(h);
  }

  /* ---------- A16 kiểm duyệt đánh giá ---------- */
  VIEWS.reviews = function () {
    var f = sub.rvf || "pending", all = S().reviews, list = all.filter(function (r) { return r.status === f; }).sort(function (a, b) { return b.at - a.at; });
    var cnt = function (k) { return all.filter(function (r) { return r.status === k; }).length; };
    main(head("Đánh giá", "A16") + '<div class="note">Chỉ khách đã tới quán qua Toini mới đánh giá được (1–5 sao, bình luận, tối đa 3 ảnh). Đánh giá chỉ hiện trên web sau khi được duyệt.</div><div class="toolbar">' + [["pending", "Chờ duyệt"], ["approved", "Đã duyệt"], ["rejected", "Không duyệt"]].map(function (x) { return '<button class="chipf' + (f === x[0] ? " on" : "") + '" data-rvf="' + x[0] + '">' + x[1] + " (" + cnt(x[0]) + ")</button>"; }).join("") + "</div>" + (list.length ? list.map(function (r) {
      return '<div class="trow"><div class="trow-h"><div><b>' + esc(vname(r.venueId)) + "</b> · " + esc(r.name) + ' <span class="tag gray">' + r.lang.toUpperCase() + "</span>" + (r.bookingCode ? ' <span class="small muted">· đơn ' + esc(r.bookingCode) + "</span>" : "") + '</div><span><span style="color:var(--red);font-weight:800">' + "★★★★★".slice(0, r.stars) + '</span><span style="opacity:.25">' + "★★★★★".slice(r.stars) + '</span> <span class="small muted">' + T.dt(r.at) + '</span></span></div><p style="margin:4px 0 8px">' + esc(r.text) + "</p>" + (r.photos.length ? '<div class="imgs">' + r.photos.map(function (p, i) { return '<a href="#" data-rvph="' + r.id + "|" + i + '"><img class="mini-img" style="width:96px;height:72px" src="' + (/^data:/.test(p) ? p : "../assets/img/" + p) + '" alt=""></a>'; }).join("") + "</div>" : "") + (r.reason ? '<p class="small">Lý do không duyệt: ' + esc(r.reason) + "</p>" : "") + '<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">' + (r.status !== "approved" ? '<button class="btn sm primary" data-rvok="' + r.id + '">✓ Duyệt</button>' : "") + (r.status !== "rejected" ? '<button class="btn sm red" data-rvno="' + r.id + '">Không duyệt</button>' : "") + "</div></div>";
    }).join("") : '<div class="empty2">Không có đánh giá.</div>'));
  };

  /* ---------- A17 deal siêu hời ---------- */
  function sponsored(id) { return S().bookings.filter(function (b) { return b.dealId === id && b.invoice; }).reduce(function (a, b) { return a + (b.invoice.sponsor || 0); }, 0); }
  VIEWS.deals = function () {
    if (sub.deal) return dealEdit(sub.deal);
    main(head("Deal siêu hời", "A17", '<button class="btn sm primary" id="newD">+ Thêm deal</button>') + '<div class="note"><b>Cách tính:</b> Toini chịu toàn bộ phần giảm của deal và trừ vào hoa hồng của đơn. Ví dụ quán trả Toini 15%: deal <b>giảm 40%</b> hóa đơn 2.000.000đ → khách được giảm 800.000đ; hoa hồng của đơn = 300.000 − 800.000 = <b>−500.000đ</b> (Toini trả quán). Deal <b>voucher 100K</b> → hoa hồng = 300.000 − 100.000 = 200.000đ. Hoa hồng âm được trừ vào công nợ của quán trong kỳ.</div><table class="dt"><thead><tr><th>Quán</th><th>Deal</th><th>Mức</th><th>Khung giờ</th><th>Đã dùng</th><th>Toini đã tài trợ</th><th>Trạng thái</th><th></th></tr></thead><tbody>' + S().superDeals.map(function (d) {
      return '<tr><td data-l="Quán">' + esc(vname(d.venueId)) + '</td><td data-l="Deal"><b>' + esc(d.tr.vi.title) + '</b><div class="small muted">' + esc(d.tr.vi.cond) + '</div></td><td data-l="Mức"><span class="tag ai">' + esc(T.dealLabel(d)) + '</span></td><td data-l="Khung giờ">' + esc(d.from + "–" + d.to) + '<div class="small muted">đến ' + T.dmy(d.until) + '</div></td><td data-l="Đã dùng" class="n">' + T.dealUsed(d.id) + " / " + d.limit + '</td><td data-l="Toini đã tài trợ" class="n">' + T.vnd(sponsored(d.id)) + '</td><td data-l="Trạng thái">' + (d.active ? '<span class="tag ok">Đang chạy</span>' : '<span class="tag gray">Đã tắt</span>') + '</td><td data-l=""><button class="btn sm" data-de="' + d.id + '">Sửa</button></td></tr>';
    }).join("") + "</tbody></table>");
  };
  function dealEdit(id) {
    var d = T.superDeal(id), tab = sub.dtab || "info", Dn = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    var h = head("Deal siêu hời · " + vname(d.venueId), "A17", '<button class="btn sm ghost" id="backD">← Danh sách deal</button>') + '<div class="tabs2"><button data-dtab="info" class="' + (tab === "info" ? "on" : "") + '">Thông tin</button><button data-dtab="tr" class="' + (tab === "tr" ? "on" : "") + '">Nội dung & bản dịch (AI)</button></div>';
    if (tab === "info") h += '<div class="panel"><div class="fgrid"><label class="field"><span>Quán</span><select class="inp" id="dV">' + S().venues.map(function (x) { return '<option value="' + x.id + '"' + (x.id === d.venueId ? " selected" : "") + ">" + esc(x.name) + "</option>"; }).join("") + '</select></label><label class="field"><span>Loại deal</span><select class="inp" id="dType"><option value="pct"' + (d.type === "pct" ? " selected" : "") + '>Giảm % hóa đơn</option><option value="amount"' + (d.type === "amount" ? " selected" : "") + '>Voucher số tiền</option></select></label><label class="field"><span>Mức (% hoặc đ) ' + T.ref + '</span><input class="inp" type="number" id="dVal" value="' + d.value + '"></label><label class="field"><span>Số suất tối đa</span><input class="inp" type="number" id="dLim" value="' + d.limit + '"></label><label class="field"><span>Từ giờ</span><input class="inp" type="time" id="dF" value="' + d.from + '"></label><label class="field"><span>Đến giờ</span><input class="inp" type="time" id="dT" value="' + d.to + '"></label><label class="field"><span>Áp dụng đến</span><input class="inp" type="date" id="dU" value="' + d.until + '"></label><div class="field span2"><span>Ngày áp dụng</span><div style="display:flex;flex-wrap:wrap;gap:6px">' + Dn.map(function (x, i) { return '<label class="chipf"><input type="checkbox" data-dd="' + i + '"' + (d.days.indexOf(i) >= 0 ? " checked" : "") + "> " + x + "</label>"; }).join("") + '</div></div></div><div class="note" id="dEx"></div><label class="tg" style="display:flex;gap:8px;font-weight:800;margin-bottom:12px"><input type="checkbox" id="dA"' + (d.active ? " checked" : "") + '> Đang chạy</label><button class="btn primary" id="saveD">Lưu</button></div>';
    else h += '<div class="panel">' + trBlock(d, ["title", "cond"], ["Tên deal", "Điều kiện"], "d:" + d.id) + "</div>";
    main(h);
    if (tab === "info") dealExample();
  }
  function dealExample() {
    var el = document.getElementById("dEx"); if (!el) return;
    var vid = document.getElementById("dV").value, rate = T.rateAt(vid, T.today()), deal = { type: document.getElementById("dType").value, value: +document.getElementById("dVal").value || 0 }, bill = 2000000;
    var g = Math.round(bill * rate / 100 / 1000) * 1000, sp = T.dealSponsor(deal, bill), net = g - sp;
    el.innerHTML = "<b>Ví dụ</b> hóa đơn " + T.vnd(bill) + " tại " + esc(vname(vid)) + " (hoa hồng " + rate + "%): khách được giảm <b>" + T.vnd(sp) + "</b> · hoa hồng gốc " + T.vnd(g) + " → hoa hồng thực <b style=\"color:" + (net < 0 ? "var(--info)" : "inherit") + "\">" + T.vnd(net) + "</b>" + (net < 0 ? " (Toini trả quán " + T.vnd(-net) + ", trừ vào công nợ)" : "") + ".";
  }

  app.addEventListener("click", function (e) {
    var el = e.target.closest("button,a[data-nav],a[data-photo]"); if (!el) return;
    var d = el.dataset, s = S();
    if (el.id === "logout") { T.audit(who(), "Phiên đăng nhập", me().username, "Đăng xuất"); T.save(); ses = null; saveSes(); return login(); }
    if (d.nav) { e.preventDefault(); view = d.nav; sub.venue = null; sub.offer = null; render(); window.scrollTo(0, 0); return; }
    if (trActions(el)) return;
    if (d.evf) { sub.evf = d.evf; return VIEWS.events(); }
    if (d.ee) { sub.event = d.ee; sub.etab = "info"; return render(); }
    if (el.id === "backE") { sub.event = null; return render(); }
    if (d.etab) { sub.etab = d.etab; return render(); }
    if (el.id === "newE") { var ne = { id: T.uid("e"), venueId: s.venues[0].id, date: T.addDays(T.today(), 7), from: "20:00", to: "23:00", img: s.venues[0].imgs[0], tags: [], active: false, tr: { vi: { title: "Sự kiện mới (giá trị tham khảo)", desc: "Mô tả sự kiện…", status: "approved" } } }; s.events.push(ne); T.audit(who(), "Sự kiện", ne.tr.vi.title, "Tạo sự kiện", null, vname(ne.venueId) + " · đang ẩn"); T.save(); sub.event = ne.id; sub.etab = "info"; return render(); }
    if (el.id === "saveE") { var ev = T.event(sub.event), be = JSON.stringify([ev.venueId, ev.date, ev.from, ev.to, ev.img, ev.tags, ev.active]); ev.venueId = document.getElementById("eV").value; ev.date = document.getElementById("eD").value; ev.from = document.getElementById("eF").value; ev.to = document.getElementById("eT").value; var ci = document.querySelector("[name=eImg]:checked"); var nv = T.venue(ev.venueId); ev.img = ci && nv.imgs.indexOf(ci.value) >= 0 ? ci.value : nv.imgs[0]; ev.tags = [].slice.call(document.querySelectorAll("[data-etag]:checked")).map(function (x) { return x.dataset.etag; }); ev.active = document.getElementById("eA").checked; T.audit(who(), "Sự kiện", ev.tr.vi.title, "Sửa sự kiện", be, JSON.stringify([ev.venueId, ev.date, ev.from, ev.to, ev.img, ev.tags, ev.active])); T.save(); return T.toast("Đã lưu sự kiện. Web khách cập nhật ngay."); }
    if (d.rvf) { sub.rvf = d.rvf; return VIEWS.reviews(); }
    if (d.rvph) { e.preventDefault(); var pp2 = d.rvph.split("|"), rr = s.reviews.filter(function (x) { return x.id === pp2[0]; })[0], src = rr.photos[+pp2[1]]; return T.modal("Ảnh của khách · " + rr.name, '<img src="' + (/^data:/.test(src) ? src : "../assets/img/" + src) + '" alt="" style="max-height:60vh;margin:auto">', '<button class="btn" data-close>Đóng</button>'); }
    if (d.rvok) { var r1 = s.reviews.filter(function (x) { return x.id === d.rvok; })[0], b1 = r1.status; r1.status = "approved"; r1.reason = ""; T.audit(who(), "Đánh giá", vname(r1.venueId) + " · " + r1.name, "Duyệt đánh giá", b1, "Đã duyệt"); T.save(); return T.toast("Đã duyệt. Đánh giá hiện trên trang quán."); }
    if (d.rvno) { var r2 = s.reviews.filter(function (x) { return x.id === d.rvno; })[0]; return askReason("Không duyệt đánh giá của " + r2.name, function (rs) { var b2 = r2.status; r2.status = "rejected"; r2.reason = rs; T.audit(who(), "Đánh giá", vname(r2.venueId) + " · " + r2.name, "Không duyệt – " + rs, b2, "Không duyệt"); T.save(); T.closeModal(); render(); }); }
    if (d.de) { sub.deal = d.de; sub.dtab = "info"; return render(); }
    if (el.id === "backD") { sub.deal = null; return render(); }
    if (d.dtab) { sub.dtab = d.dtab; return render(); }
    if (el.id === "newD") { var nd = { id: T.uid("d"), venueId: s.venues[0].id, type: "pct", value: 20, days: [0, 1, 2, 3, 4, 5, 6], from: "18:00", to: "23:00", until: T.addDays(T.today(), 30), limit: 50, active: false, tr: { vi: { title: "Deal mới (giá trị tham khảo)", cond: "Đặt qua Toini", status: "approved" } } }; s.superDeals.push(nd); T.audit(who(), "Deal siêu hời", nd.tr.vi.title, "Tạo deal", null, vname(nd.venueId) + " · đang tắt"); T.save(); sub.deal = nd.id; sub.dtab = "info"; return render(); }
    if (el.id === "saveD") { var dl = T.superDeal(sub.deal), bd = T.dealLabel(dl) + " · " + dl.from + "–" + dl.to + " · " + dl.limit + " suất · " + (dl.active ? "chạy" : "tắt"); dl.venueId = document.getElementById("dV").value; dl.type = document.getElementById("dType").value; dl.value = +document.getElementById("dVal").value; dl.limit = +document.getElementById("dLim").value; dl.from = document.getElementById("dF").value; dl.to = document.getElementById("dT").value; dl.until = document.getElementById("dU").value; dl.days = [].slice.call(document.querySelectorAll("[data-dd]:checked")).map(function (x) { return +x.dataset.dd; }); dl.active = document.getElementById("dA").checked; T.audit(who(), "Deal siêu hời", dl.tr.vi.title, "Sửa deal", bd, T.dealLabel(dl) + " · " + dl.from + "–" + dl.to + " · " + dl.limit + " suất · " + (dl.active ? "chạy" : "tắt")); T.save(); return T.toast("Đã lưu deal."); }
    if (d.bk) return bookingDetail(d.bk);
    if (d.help) return help(d.help, d.id);
    if (d.aldone) { s.alerts.forEach(function (a) { if (a.id === d.aldone) a.done = true; }); T.audit(who(), "Cảnh báo", d.aldone, "Đánh dấu đã xử lý"); T.save(); return; }
    if (d.ve) { sub.venue = d.ve; sub.vtab = "info"; return render(); }
    if (el.id === "backV") { sub.venue = null; return render(); }
    if (d.vtab) { sub.vtab = d.vtab; return render(); }
    if (el.id === "newV") return newVenue();
    if (el.id === "saveInfo") {
      var v = T.venue(sub.venue), before = {}, after = {};
      document.querySelectorAll("[data-k]").forEach(function (i) { var k = i.dataset.k, val = i.type === "number" || k === "price" || k === "lat" || k === "lng" ? +i.value : i.value.trim(); if (String(v[k]) !== String(val)) { before[k] = v[k]; after[k] = val; v[k] = val; } });
      var nt = [].slice.call(document.querySelectorAll("[data-vtag]:checked")).map(function (x) { return x.dataset.vtag; });
      if (nt.slice().sort().join() !== v.tags.slice().sort().join()) { before.tags = v.tags.map(function (k) { return window.TOINI_I18N.tags[k].vi; }).join(", "); after.tags = nt.map(function (k) { return window.TOINI_I18N.tags[k].vi; }).join(", "); v.tags = nt; }
      if (!Object.keys(after).length) return T.toast("Không có thay đổi");
      T.audit(who(), "Quán", v.name, "Sửa thông tin quán", JSON.stringify(before), JSON.stringify(after)); T.save(); return T.toast("Đã lưu. Web khách hiển thị ngay.");
    }
    if (d.rmimg !== undefined) { var v1 = T.venue(sub.venue); if (v1.imgs.length <= 1) return T.toast("Quán cần ít nhất 1 ảnh", "warn"); var rm = v1.imgs.splice(+d.rmimg, 1); T.audit(who(), "Quán", v1.name, "Xóa ảnh", rm[0], null); T.save(); return; }
    if (d.cover !== undefined) { var v2 = T.venue(sub.venue), im = v2.imgs.splice(+d.cover, 1)[0]; v2.imgs.unshift(im); T.audit(who(), "Quán", v2.name, "Đổi ảnh đại diện", null, im); T.save(); return; }
    if (el.id === "saveCt") { var v3 = T.venue(sub.venue), b3 = JSON.stringify(v3.contact) + " · " + (v3.visible ? "hiện" : "ẩn"); document.querySelectorAll("[data-c]").forEach(function (i) { v3.contact[i.dataset.c] = i.value.trim(); }); v3.visible = document.getElementById("vis").checked; T.audit(who(), "Quán", v3.name, "Sửa hợp đồng / hiển thị", b3, JSON.stringify(v3.contact) + " · " + (v3.visible ? "hiện" : "ẩn")); T.save(); return T.toast("Đã lưu"); }
    if (el.id === "tpl") return download("toini-mau-nhap-quan.csv", csv([["ten_quan", "loai_hinh", "khu_vuc", "dia_chi", "vi_do", "kinh_do", "gio_mo_cua", "phi_vao_cua", "chi_tieu_toi_thieu", "thue_phi", "dress_code", "gioi_han_tuoi", "mo_ta_vi", "mo_ta_en", "link_anh", "uu_dai_vi"], ["Quán mẫu", "bar", "Hải Châu", "1 Bạch Đằng", "16.07", "108.22", "17:00 – 23:30", "0", "0", "chưa gồm VAT", "Thoải mái", "0", "Mô tả…", "Description…", "https://…/1.jpg|https://…/2.jpg", "Giảm 10%…"]]));
    if (d.oe) { sub.offer = d.oe; sub.otab = "info"; return render(); }
    if (el.id === "backO") { sub.offer = null; return render(); }
    if (d.otab) { sub.otab = d.otab; return render(); }
    if (el.id === "newO") { var o = { id: T.uid("o"), venueId: sub.ofv || s.venues[0].id, active: false, days: [0, 1, 2, 3, 4, 5, 6], from: "18:00", to: "21:00", until: T.addDays(T.today(), 30), tr: { vi: { title: "Ưu đãi mới " + "(giá trị tham khảo)", cond: "Đặt qua Toini", status: "approved" } } }; s.offers.push(o); T.audit(who(), "Ưu đãi", o.tr.vi.title, "Tạo ưu đãi", null, vname(o.venueId) + " · đang tắt"); T.save(); sub.offer = o.id; sub.otab = "info"; return render(); }
    if (el.id === "saveO") { var oo = s.offers.filter(function (x) { return x.id === sub.offer; })[0], bo = JSON.stringify([oo.venueId, oo.from, oo.to, oo.until, oo.days, oo.active]); oo.venueId = document.getElementById("ov").value; oo.until = document.getElementById("ou").value; oo.from = document.getElementById("of").value; oo.to = document.getElementById("ot").value; oo.days = [].slice.call(document.querySelectorAll("[data-od]:checked")).map(function (x) { return +x.dataset.od; }); oo.active = document.getElementById("oa").checked; T.audit(who(), "Ưu đãi", oo.tr.vi.title, "Sửa ưu đãi", bo, JSON.stringify([oo.venueId, oo.from, oo.to, oo.until, oo.days, oo.active])); T.save(); return T.toast("Đã lưu ưu đãi"); }
    if (el.id === "newA") return accForm(null);
    if (d.ae) return accForm(s.shopAccounts.filter(function (a) { return a.id === d.ae; })[0]);
    if (d.alock) { var a = s.shopAccounts.filter(function (x) { return x.id === d.alock; })[0]; a.locked = !a.locked; T.audit(who(), "Tài khoản quán", a.username, a.locked ? "Khóa tài khoản" : "Mở khóa", a.locked ? "Hoạt động" : "Đã khóa", a.locked ? "Đã khóa" : "Hoạt động"); T.save(); return T.toast(a.locked ? "Đã khóa – nếu đang đăng nhập sẽ bị đăng xuất ngay" : "Đã mở khóa"); }
    if (d.areset) { var a2 = s.shopAccounts.filter(function (x) { return x.id === d.areset; })[0]; a2.password = "Tam@" + Math.floor(1000 + Math.random() * 9000); a2.mustChange = true; T.audit(who(), "Tài khoản quán", a2.username, "Cấp lại mật khẩu"); T.save(); return T.modal("Mật khẩu tạm", "<p>Mật khẩu tạm của <b>" + esc(a2.username) + "</b>: <b>" + esc(a2.password) + "</b> " + T.ref + "</p><p class=\"small\">Đã gửi tới " + esc(a2.email) + " (mô phỏng). Nhân viên phải đổi khi đăng nhập.</p>", '<button class="btn" data-close>Đóng</button>'); }
    if (el.id === "newS") { T.modal("Thêm nhân viên Toini", '<label class="field"><span>Tên đăng nhập ' + T.ref + '</span><input class="inp" id="su" value="cskh2"></label><label class="field"><span>Tên</span><input class="inp" id="sn" value="Nhân viên CSKH 2"></label><label class="field"><span>Vai trò</span><select class="inp" id="sr">' + Object.keys(T.ROLE).map(function (r) { return '<option value="' + r + '"' + (r === "cs" ? " selected" : "") + ">" + T.ROLE[r] + "</option>"; }).join("") + "</select></label>", '<button class="btn" data-close>Hủy</button><button class="btn primary" id="sok">Tạo</button>'); document.getElementById("sok").addEventListener("click", function () { var st = { id: T.uid("st"), username: document.getElementById("su").value.trim(), name: document.getElementById("sn").value.trim(), role: document.getElementById("sr").value, password: "demo123", locked: false }; s.staff.push(st); T.audit(who(), "Nhân viên Toini", st.username, "Tạo tài khoản", null, T.ROLE[st.role]); T.save(); T.closeModal(); T.toast("Đã tạo. Mật khẩu demo: demo123"); }); return; }
    if (d.slock) { var st = s.staff.filter(function (x) { return x.id === d.slock; })[0]; st.locked = !st.locked; T.audit(who(), "Nhân viên Toini", st.username, st.locked ? "Khóa" : "Mở khóa"); T.save(); return; }
    if (d.cm) { var vv = T.venue(d.cm); T.modal("Phiên bản hoa hồng mới · " + vv.name, '<div class="fgrid"><label class="field"><span>Tỷ lệ (%) ' + T.ref + '</span><input class="inp" type="number" step="0.5" id="cr" value="' + T.rateAt(vv.id, T.today()) + '"></label><label class="field"><span>Áp dụng từ ngày</span><input class="inp" type="date" id="cf" value="' + T.addDays(T.today(), 1) + '"></label></div><p class="small muted">Đơn có ngày khách tới từ ngày này trở đi sẽ dùng tỷ lệ mới.</p>', '<button class="btn" data-close>Hủy</button><button class="btn primary" id="cok">Lưu phiên bản</button>'); document.getElementById("cok").addEventListener("click", function () { var r = +document.getElementById("cr").value, fr = document.getElementById("cf").value, bf = T.rateAt(vv.id, fr) + "%"; s.commissions[vv.id].push({ rate: r, from: fr, by: who() }); T.audit(who(), "Hoa hồng", vv.name, "Thêm phiên bản tỷ lệ", bf, r + "% từ " + T.dmy(fr)); T.save(); T.closeModal(); }); return; }
    if (d.rf) { sub.rf = d.rf; return VIEWS.recon(); }
    if (d.rec) { var rb = T.booking(d.rec); rb.reconciled = true; rb.history.push({ at: T.now(), by: who(), action: "Kế toán đánh dấu đã khớp" }); T.audit(who(), "Đối soát", rb.code, "Đánh dấu đã khớp", "Chưa khớp", "Đã khớp"); T.save(); return; }
    if (d.adj) return adjust(T.booking(d.adj));
    if (d.photo !== undefined) { e.preventDefault(); var pb = T.booking(d.photo); return T.modal("Ảnh hóa đơn " + pb.invoice.no, '<img src="' + pb.invoice.photo + '" alt="Ảnh hóa đơn" style="max-height:60vh;margin:auto">', '<button class="btn" data-close>Đóng</button>'); }
    if (el.id === "adjSettled") { var sb = T.booking(document.getElementById("adjS").value); if (!sb) return; T.modal("Điều chỉnh sau chốt kỳ · " + sb.code, '<label class="field"><span>Số tiền điều chỉnh hoa hồng (đ, có thể âm) ' + T.ref + '</span><input class="inp" id="pam" value="-200000"></label><label class="field"><span>Lý do (bắt buộc) ' + T.ref + '</span><textarea class="inp" id="prs" rows="2">Quán khiếu nại 1 món bị tính trùng, đã xác minh</textarea></label>', '<button class="btn" data-close>Hủy</button><button class="btn primary" id="pok">Tạo điều chỉnh cho kỳ sau</button>'); document.getElementById("pok").addEventListener("click", function () { var amt = +String(document.getElementById("pam").value).replace(/[^\d-]/g, ""), r = document.getElementById("prs").value.trim(); if (!r) return T.toast("Cần lý do", "warn"); s.pendingAdj.push({ code: sb.code, venueId: sb.venueId, amount: amt, reason: r, by: who(), at: T.now() }); T.audit(who(), "Đối soát", sb.code, "Điều chỉnh sau chốt kỳ – " + r, null, T.vnd(amt) + " vào kỳ sau"); T.save(); T.closeModal(); }); return; }
    if (d.pay) { var pp = d.pay.split("|"), dd = T.debtOf(pp[0], pp[1]); T.modal((dd.left < 0 ? "Ghi nhận Toini đã trả quán · " : "Ghi nhận đã thu · ") + vname(pp[0]) + " · " + pp[1], '<div class="fgrid"><label class="field"><span>Số tiền (đ)</span><input class="inp" id="pa" value="' + dd.left + '"></label><label class="field"><span>Ngày nhận</span><input class="inp" type="date" id="pd" value="' + T.today() + '"></label><label class="field span2"><span>Ghi chú / chứng từ ' + T.ref + '</span><input class="inp" id="pn" value="CK Vietcombank, nội dung TOINI ' + pp[1] + '"></label></div>', '<button class="btn" data-close>Hủy</button><button class="btn primary" id="pok2">Ghi nhận</button>'); document.getElementById("pok2").addEventListener("click", function () { var amt = +String(document.getElementById("pa").value).replace(/\D/g, ""); if (!amt) return; if (dd.left < 0) amt = -amt; s.payments.push({ id: T.uid("pay"), venueId: pp[0], periodId: pp[1], amount: amt, at: new Date(document.getElementById("pd").value + "T10:00").getTime(), note: document.getElementById("pn").value, by: who() }); T.audit(who(), "Công nợ", vname(pp[0]) + " · " + pp[1], "Ghi nhận đã thu", T.vnd(dd.left) + " còn lại", T.vnd(amt)); T.save(); T.closeModal(); }); return; }
    if (d.dd) { var q = d.dd.split("|"), per = s.periods.filter(function (x) { return x.id === q[1]; })[0], line = per.lines.filter(function (l) { return l.venueId === q[0]; })[0], pays = s.payments.filter(function (x) { return x.venueId === q[0] && x.periodId === q[1]; }); return T.modal("Kỳ " + q[1] + " · " + vname(q[0]), '<table class="dt"><thead><tr><th>Đơn</th><th>Ngày</th><th>Hóa đơn</th><th>Giá trị</th><th>HH</th></tr></thead><tbody>' + line.bookings.map(function (c) { var b = T.booking(c); return '<tr><td data-l="Đơn">' + esc(c) + '</td><td data-l="Ngày">' + T.dmy(b.date) + '</td><td data-l="Hóa đơn">' + esc(b.invoice.no) + '</td><td data-l="Giá trị" class="n">' + T.vnd(b.invoice.amount) + '</td><td data-l="HH" class="n">' + T.vnd(b.commission) + "</td></tr>"; }).join("") + line.adj.map(function (a) { return '<tr class="hl"><td data-l="Đơn">ĐC ' + esc(a.code) + '</td><td data-l="Ngày">' + T.dmy(a.at) + '</td><td data-l="Hóa đơn">' + esc(a.reason) + '</td><td></td><td data-l="HH" class="n">' + T.vnd(a.amount) + "</td></tr>"; }).join("") + '</tbody></table><h4>Đã thu</h4>' + (pays.length ? pays.map(function (x) { return '<div class="small">' + T.dmy(x.at) + " · " + T.vnd(x.amount) + " · " + esc(x.note) + " · " + esc(x.by) + "</div>"; }).join("") : '<p class="small muted">Chưa có.</p>'), '<button class="btn" data-close>Đóng</button>', { wide: true }); }
    if (el.id === "exBtn") {
      var mo = document.getElementById("exm").value; sub.exm = mo;
      var bs = s.bookings.filter(function (b) { return b.invoice && b.date.slice(0, 7) === mo; });
      var rows = [["Ngày", "Mã đơn", "Quán", "Số hóa đơn", "Số khách", "Doanh thu trước thuế phí", "Tỷ lệ HH", "Toini tài trợ (deal)", "Hoa hồng", "Kỳ", "Trạng thái"]].concat(bs.map(function (b) { return [T.dmy(b.date), b.code, vname(b.venueId), b.invoice.no, b.invoice.pax, b.invoice.amount, T.rateAt(b.venueId, b.date) + "%", b.invoice.sponsor || 0, b.commission || T.calcCommission(b) + (b.commissionAdj || 0), b.periodId || "đang mở", T.STATUS[b.status]]; }));
      rows.push([]); rows.push(["TỔNG HỢP THEO QUÁN"]); rows.push(["Quán", "Số đơn", "Doanh thu", "Hoa hồng"]);
      s.venues.forEach(function (v) { var l = bs.filter(function (b) { return b.venueId === v.id; }); if (l.length) rows.push([v.name, l.length, l.reduce(function (a, b) { return a + b.invoice.amount; }, 0), l.reduce(function (a, b) { return a + (b.commission || T.calcCommission(b)); }, 0)]); });
      download("toini-ThucTe-" + mo + ".csv", csv(rows)); T.audit(who(), "Xuất số liệu", mo, "Xuất file ThucTe", null, bs.length + " hóa đơn"); T.save(); return T.toast("Đã xuất " + bs.length + " hóa đơn tháng " + mo);
    }
    if (d.ctab) { sub.ctab = d.ctab; return VIEWS.content(); }
    if (el.id === "saveUi") { var lg = sub.uilg || "ko"; document.querySelectorAll("[data-ui]").forEach(function (i) { var k = i.dataset.ui, I = window.TOINI_I18N.t; if (i.value.trim() !== I[k][lg]) { (s.uiOverrides[k] = s.uiOverrides[k] || {})[lg] = i.value.trim(); } }); T.audit(who(), "Chữ giao diện", lg.toUpperCase(), "Sửa bản dịch giao diện"); T.save(); return T.toast("Đã lưu. Mở web khách ở ngôn ngữ " + lg.toUpperCase() + " để xem."); }
    if (d.tpl !== undefined) { var tp = s.templates[+d.tpl]; T.modal("Mẫu " + tp.k, '<label class="field"><span>Nội dung email (Toini sửa trực tiếp)</span><textarea class="inp" id="tpv" rows="4">' + esc(tp.vi) + '</textarea></label><p class="small muted">Với ZNS/SMS: lưu xong cần gửi Zalo/nhà mạng duyệt lại mẫu.</p>', '<button class="btn" data-close>Hủy</button><button class="btn primary" id="tpok">Lưu</button>'); document.getElementById("tpok").addEventListener("click", function () { var b0 = tp.vi; tp.vi = document.getElementById("tpv").value; tp.status = "Email đã cập nhật · ZNS/SMS chờ duyệt lại"; T.audit(who(), "Mẫu tin", tp.k, "Sửa mẫu", b0, tp.vi); T.save(); T.closeModal(); }); return; }
    if (el.id === "saveTerms") { var bt = s.settings.terms; s.settings.terms = document.getElementById("terms").value; T.audit(who(), "Điều khoản", "terms", "Sửa điều khoản", bt.slice(0, 60), s.settings.terms.slice(0, 60)); T.save(); return T.toast("Đã lưu"); }
    if (el.id === "saveChat") { document.querySelectorAll("[data-chl]").forEach(function (i) { s.settings.chat[+i.dataset.chl].link = i.value.trim(); }); document.querySelectorAll("[data-chg]").forEach(function (i) { s.settings.chat[+i.dataset.chg].langs = i.value.split(",").map(function (x) { return x.trim(); }).filter(Boolean); }); T.audit(who(), "Kênh chat", "cấu hình", "Sửa kênh chat"); T.save(); return T.toast("Đã lưu"); }
    if (el.id === "addArea") { var na = document.getElementById("newArea").value.trim(); if (na && s.areas.indexOf(na) < 0) { s.areas.push(na); T.audit(who(), "Danh mục", "Khu vực", "Thêm khu vực", null, na); T.save(); } return; }
    if (el.id === "saveCaps") { var bc = JSON.stringify(s.settings.caps); document.querySelectorAll("[data-cap]").forEach(function (i) { s.settings.caps[i.dataset.cap] = +i.value; }); T.audit(who(), "Trần gửi tin", "caps", "Sửa giới hạn", bc, JSON.stringify(s.settings.caps)); T.save(); return T.toast("Đã lưu giới hạn"); }
    if (el.id === "simCap") { var cc = T.counter(); cc.zns = s.settings.caps.zns - 1; T.save(); return T.toast("ZNS hôm nay = " + cc.zns + "/" + s.settings.caps.zns + ". Đặt thử 2 đơn bằng số VN ở web khách để thấy chuyển sang SMS và cảnh báo."); }
    if (d.unblock !== undefined) { var ub = s.settings.blocked.splice(+d.unblock, 1)[0]; T.audit(who(), "Danh sách chặn", ub.v, "Bỏ chặn"); T.save(); return; }
    if (el.id === "addBlock") { var bv = document.getElementById("blv").value.trim(); if (!bv) return; s.settings.blocked.push({ v: bv, kind: document.getElementById("blk").value, note: document.getElementById("bln").value }); T.audit(who(), "Danh sách chặn", bv, "Chặn"); T.save(); return; }
  });
  app.addEventListener("input", function (e) { if (e.target.id === "dVal") dealExample(); });
  app.addEventListener("change", function (e) {
    var t = e.target, s = S();
    if (t.dataset.vtag || t.dataset.etag) t.parentElement.classList.toggle("on", t.checked);
    if (t.id === "dType" || t.id === "dV") dealExample();
    if (t.id === "ofv") { sub.ofv = t.value; VIEWS.offers(); }
    if (t.id === "sav") { sub.sav = t.value; VIEWS.shopacc(); }
    if (t.id === "uilg") { sub.uilg = t.value; VIEWS.content(); }
    if (t.dataset.role) { var st = s.staff.filter(function (x) { return x.id === t.dataset.role; })[0], b = T.ROLE[st.role]; st.role = t.value; T.audit(who(), "Nhân viên Toini", st.username, "Đổi vai trò", b, T.ROLE[st.role]); T.save(); }
    if (t.id === "addimg") { var v = T.venue(sub.venue), files = [].slice.call(t.files); files.forEach(function (f) { var r = new FileReader(); r.onload = function () { var im = new Image(); im.onload = function () { var c = document.createElement("canvas"), k = Math.min(1, 900 / im.width); c.width = im.width * k; c.height = im.height * k; c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); v.imgs.push(c.toDataURL("image/jpeg", .7).replace(/^/, "")); T.audit(who(), "Quán", v.name, "Thêm ảnh", null, f.name); T.save(); }; im.src = r.result; }; r.readAsDataURL(f); }); }
    if (t.id === "imf" && t.files[0]) {
      var res = [["2", "Sky36", "ok", ""], ["3", "Golden Pine Pub", "ok", ""], ["4", "New Phương Đông", "err", "Thiếu giờ mở cửa"], ["5", "Hải sản Năm Đảnh", "ok", ""], ["6", "Karaoke Tiếng Tơ Đồng", "err", "Link ảnh số 2 không tải được"], ["7", "Charm Spa Grand", "err", "Khu vực “Q. Hải Châu” không có trong danh mục"]];
      document.getElementById("imres").innerHTML = '<p><b>' + esc(t.files[0].name) + '</b> · kết quả kiểm tra (mô phỏng) ' + T.ref + '</p><table class="dt"><thead><tr><th>Dòng</th><th>Quán</th><th>Kết quả</th></tr></thead><tbody>' + res.map(function (r) { return '<tr class="' + (r[2] === "err" ? "hl" : "") + '"><td data-l="Dòng">' + r[0] + '</td><td data-l="Quán">' + esc(r[1]) + '</td><td data-l="Kết quả">' + (r[2] === "ok" ? '<span class="tag ok">Hợp lệ</span>' : '<span class="tag bad">' + esc(r[3]) + "</span>") + "</td></tr>"; }).join("") + '</tbody></table><div class="toolbar" style="margin-top:10px"><button class="btn primary" id="imgo">Nhập 3 dòng hợp lệ</button><button class="btn" id="imerr">⬇ Tải danh sách lỗi để sửa</button></div>';
      document.getElementById("imgo").addEventListener("click", function () { T.audit(who(), "Nhập dữ liệu", t.files[0].name, "Nhập quán từ file", null, "3 dòng hợp lệ, 3 dòng lỗi (mô phỏng)"); T.save(); T.toast("Đã nhập 3 quán (mô phỏng – không thêm vào dữ liệu demo)."); });
      document.getElementById("imerr").addEventListener("click", function () { download("loi-nhap-quan.csv", csv([["Dòng", "Quán", "Lỗi"]].concat(res.filter(function (r) { return r[2] === "err"; }).map(function (r) { return [r[0], r[1], r[3]]; })))); });
    }
  });
  function typing() { var a = document.activeElement; return a && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && a.closest("#main") && a.type !== "checkbox" && a.type !== "file"; }
  T.on(function () { if (!document.getElementById("t-modal") && ses && !typing()) { var y = window.scrollY; render(); window.scrollTo(0, y); } });
  T.startTicker(); T.demoPanel("admin"); render();
})();
