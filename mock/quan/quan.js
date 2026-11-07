/* Cổng quán – Toini mock. UC-Q01 … UC-Q08 */
(function () {
  var esc = T.esc, app = document.getElementById("app");
  var SK = "toini-mock-quan-session";
  var ses = (function () { try { return JSON.parse(sessionStorage.getItem(SK)) || null; } catch (e) { return null; } })();
  var view = "orders", day = null, stFilter = "";
  function saveSes() { try { sessionStorage.setItem(SK, JSON.stringify(ses)); } catch (e) { } }
  function acc() { return ses && T.state().shopAccounts.filter(function (a) { return a.id === ses.acc; })[0]; }
  function V() { return T.venue(ses.venue); }
  function myBookings() { return T.state().bookings.filter(function (b) { return b.venueId === ses.venue; }); }
  function who() { return acc().username; }
  function stPill(b) { return '<span class="st ' + b.status + '">' + esc(T.STATUS[b.status]) + "</span>" + (b.missingInvoice && b.status === "arrived" ? ' <span class="tag bad">Thiếu hóa đơn</span>' : ""); }
  function extra(b) { var e = b.eventId && T.event(b.eventId); return (e ? ' <span class="tag info">🎶 ' + esc(e.tr.vi.title) + "</span>" : "") + (b.deal ? ' <span class="tag ai">⚡ Deal Toini: ' + esc(T.dealLabel(b.deal)) + "</span>" : ""); }
  function langFlag(l) { return '<span class="tag gray" title="Ngôn ngữ của khách">' + String(l || "").toUpperCase() + "</span>"; }

  /* ---------- UC-Q01 đăng nhập ---------- */
  function login(msg) {
    var rows = T.state().shopAccounts.map(function (a) {
      return "<tr><td><button data-u=\"" + a.username + '">' + a.username + "</button></td><td>" + a.venueIds.map(function (id) { return esc(T.venue(id).name); }).join(", ") + (a.locked ? ' <span class="tag bad">đã khóa</span>' : "") + (a.mustChange ? ' <span class="tag warn">đổi mật khẩu lần đầu</span>' : "") + "</td></tr>";
    }).join("");
    app.innerHTML = '<div class="mockbar">BẢN MOCK · Cổng quán</div><div class="login"><form class="box" id="lf"><h1>Cổng quán Toini</h1><p class="muted small" style="margin-top:0">Đăng nhập bằng tài khoản Toini cấp cho quán.</p>' +
      '<label class="field"><span>Tên đăng nhập ' + T.ref + '</span><input class="inp" name="u" value="sky36.letan" autocomplete="username"></label>' +
      '<label class="field"><span>Mật khẩu ' + T.ref + '</span><input class="inp" name="p" type="password" value="demo123" autocomplete="current-password"></label>' +
      '<div class="err" role="alert">' + esc(msg || "") + '</div><button class="btn primary block">Đăng nhập</button>' +
      '<p class="small" style="text-align:center"><a href="#" id="forgot">Quên mật khẩu?</a></p>' +
      '<div class="demo-acc"><b>Tài khoản demo</b> (mật khẩu đều là <b>demo123</b>) ' + T.ref + '<table>' + rows + "</table></div></form></div>";
    app.querySelectorAll("[data-u]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); app.querySelector("[name=u]").value = b.dataset.u; app.querySelector("[name=p]").value = "demo123"; }); });
    document.getElementById("forgot").addEventListener("click", function (e) { e.preventDefault(); T.modal("Quên mật khẩu", '<p>Hệ thống gửi link đặt lại mật khẩu tới email của tài khoản. Nếu không nhận được, liên hệ Toini để được cấp lại.</p><label class="field"><span>Tên đăng nhập hoặc email ' + T.ref + '</span><input class="inp" value="sky36.letan"></label>', '<button class="btn" data-close>Đóng</button><button class="btn primary" id="fp">Gửi link</button>'); document.getElementById("fp").addEventListener("click", function () { T.closeModal(); T.toast('<div class="t-sim">MÔ PHỎNG · EMAIL</div>Đã gửi link đặt lại mật khẩu tới letan@sky36.example'); }); });
    document.getElementById("lf").addEventListener("submit", function (e) {
      e.preventDefault(); var fd = new FormData(e.target), u = String(fd.get("u")).trim(), p = String(fd.get("p"));
      var a = T.state().shopAccounts.filter(function (x) { return x.username === u; })[0];
      if (!a || a.password !== p) return login("Sai tên đăng nhập hoặc mật khẩu.");
      if (a.locked) return login("Tài khoản đã bị khóa. Liên hệ Toini.");
      ses = { acc: a.id, venue: a.venueIds[0] }; saveSes();
      T.audit(a.username, "Phiên đăng nhập", a.username, "Đăng nhập cổng quán"); T.save();
      if (a.mustChange) return changePass(true);
      if (a.venueIds.length > 1) return pickVenue();
      render();
    });
  }
  function changePass(first) {
    var a = acc();
    app.innerHTML = '<div class="mockbar">BẢN MOCK · Cổng quán</div><div class="login"><form class="box" id="cf"><h1>' + (first ? "Đổi mật khẩu lần đầu" : "Đổi mật khẩu") + '</h1><p class="muted small">Tài khoản <b>' + esc(a.username) + '</b>' + (first ? " đang dùng mật khẩu tạm do Toini cấp." : "") + '</p><label class="field"><span>Mật khẩu mới ' + T.ref + '</span><input class="inp" name="p1" type="password" value="Quan@2026"></label><label class="field"><span>Nhập lại ' + T.ref + '</span><input class="inp" name="p2" type="password" value="Quan@2026"></label><div class="err" id="ce"></div><button class="btn primary block">Lưu mật khẩu</button></form></div>';
    document.getElementById("cf").addEventListener("submit", function (e) {
      e.preventDefault(); var fd = new FormData(e.target);
      if (String(fd.get("p1")).length < 8) return (document.getElementById("ce").textContent = "Mật khẩu tối thiểu 8 ký tự.");
      if (fd.get("p1") !== fd.get("p2")) return (document.getElementById("ce").textContent = "Hai mật khẩu chưa khớp.");
      a.password = String(fd.get("p1")); a.mustChange = false; T.audit(a.username, "Tài khoản quán", a.username, "Đổi mật khẩu"); T.save();
      T.toast("Đã đổi mật khẩu. (Demo: mật khẩu mới là " + esc(a.password) + ")");
      if (first && a.venueIds.length > 1) return pickVenue(); render();
    });
  }
  function pickVenue() {
    var a = acc();
    app.innerHTML = '<div class="mockbar">BẢN MOCK · Cổng quán</div><div class="login"><div class="box"><h1>Chọn quán</h1><p class="muted small">Tài khoản <b>' + esc(a.username) + "</b> được gán " + a.venueIds.length + " quán. Bạn đổi quán bất cứ lúc nào ở đầu trang.</p>" + a.venueIds.map(function (id) { var v = T.venue(id); return '<button class="btn block" style="margin-bottom:8px;justify-content:flex-start" data-v="' + id + '"><img class="mini-img" style="width:44px;height:32px" src="../assets/img/' + v.imgs[0] + '" alt=""> ' + esc(v.name) + "</button>"; }).join("") + "</div></div>";
    app.querySelectorAll("[data-v]").forEach(function (b) { b.addEventListener("click", function () { ses.venue = b.dataset.v; saveSes(); render(); }); });
  }

  /* ---------- khung ---------- */
  var NAV = [["orders", "🔔 Đơn cần xử lý"], ["calendar", "📅 Lịch đơn theo ngày"], ["nights", "🌙 Nhận khách theo tối"], ["invoices", "🧾 Hóa đơn"], ["debt", "💰 Công nợ hoa hồng"], ["telegram", "✈️ Telegram (mô phỏng)"], ["profile", "🏪 Hồ sơ quán"], ["account", "👤 Tài khoản"]];
  function render() {
    if (!ses || !acc()) return login();
    if (acc().locked) { ses = null; saveSes(); return login("Tài khoản đã bị khóa. Bạn đã bị đăng xuất."); }
    var a = acc(), v = V(), pend = myBookings().filter(function (b) { return b.status === "pending"; }).length;
    var noInv = myBookings().filter(function (b) { return b.status === "arrived"; }).length;
    var sel = a.venueIds.length > 1 ? '<select id="venueSel" aria-label="Chọn quán">' + a.venueIds.map(function (id) { return '<option value="' + id + '"' + (id === ses.venue ? " selected" : "") + ">" + esc(T.venue(id).name) + "</option>"; }).join("") + "</select>" : '<b style="font-size:.9rem">' + esc(v.name) + "</b>";
    app.innerHTML = '<div class="mockbar">BẢN MOCK · Cổng quán · dữ liệu dùng chung với web khách và quản trị</div><header class="pt-top"><a class="brand" href="#">toini<small>Cổng quán</small></a>' + sel + '<span class="sp"></span><span class="who">👤 ' + esc(a.username) + '</span><button class="lo" id="logout">Đăng xuất</button></header>' +
      '<div class="pt-layout"><nav class="pt-nav" aria-label="Menu">' + NAV.map(function (n) {
        var bd = n[0] === "orders" && pend ? '<span class="bdg">' + pend + "</span>" : n[0] === "invoices" && noInv ? '<span class="bdg">' + noInv + "</span>" : "";
        return '<a href="#" data-nav="' + n[0] + '" class="' + (view === n[0] ? "on" : "") + '">' + n[1] + bd + "</a>";
      }).join("") + '</nav><main class="pt-main" id="main"></main></div>';
    ({ orders: orders, calendar: calendar, nights: nights, invoices: invoices, debt: debt, telegram: telegram, profile: profile, account: account })[view]();
  }
  function main(h) { document.getElementById("main").innerHTML = h; }
  function head(title, uc, extra) { return '<div class="pt-h"><h1>' + esc(title) + (uc ? '<span class="uc">' + uc + "</span>" : "") + "</h1>" + (extra || "") + "</div>"; }

  /* ---------- UC-Q03/Q04 đơn cần xử lý ---------- */
  function left(b) { var ms = b.deadlineBase + 15 * T.MIN - T.now(); var m = Math.floor(Math.abs(ms) / T.MIN), s = Math.floor(Math.abs(ms) % T.MIN / 1000); return { late: ms < 0, txt: (ms < 0 ? "Quá " : "Còn ") + m + ":" + T.pad(s) }; }
  function orders() {
    var bs = myBookings(), pend = bs.filter(function (b) { return b.status === "pending"; }).sort(function (a, b) { return a.deadlineBase - b.deadlineBase; });
    var today = bs.filter(function (b) { return b.status === "confirmed" && b.date === T.today(); });
    var h = head("Đơn cần xử lý", "UC-Q03 · Q04 · Q06") + '<div class="note">Quán có <b>15 phút</b> để phản hồi. Quá 15 phút Toini sẽ gọi cho quán, quá 30 phút đơn tự hủy.</div>';
    h += pend.length ? pend.map(function (b) { var l = left(b); return '<div class="ordercard' + (l.late ? " late" : "") + '"><div><h3>' + esc(b.code) + " · " + esc(b.name) + ' <span class="cnt-down' + (l.late ? " late" : "") + '" data-cd="' + b.id + '">⏱ ' + l.txt + "</span></h3><div class=\"small\">" + T.wd(b.date, "vi") + " " + T.dmy(b.date) + " · <b>" + esc(b.time) + "</b> · 👥 " + b.pax + " · " + langFlag(b.lang) + (b.phone ? " · " + esc(T.prettyPhone(b.phone)) : "") + "</div>" + (b.note ? '<div class="small">📝 ' + esc(b.note) + "</div>" : "") + (extra(b) ? '<div class="small">' + extra(b) + "</div>" : "") + (b.history.some(function (x) { return /đổi giờ/.test(x.action); }) ? '<span class="tag info">Khách vừa đổi giờ</span>' : "") + '</div><div class="acts"><button class="btn sm red" data-rej="' + b.id + '">Từ chối</button><button class="btn sm primary" data-ok="' + b.id + '">Xác nhận</button></div></div>'; }).join("") : '<div class="empty2">Không có đơn nào đang chờ. 🎉</div>';
    h += '<h2 style="font-size:1.1rem;margin:20px 0 10px">Tối nay đã xác nhận (' + today.length + ")</h2>";
    h += today.length ? '<table class="dt"><thead><tr><th>Giờ</th><th>Mã</th><th>Khách</th><th>Số khách</th><th>Ghi chú</th><th></th></tr></thead><tbody>' + today.map(function (b) { return '<tr><td data-l="Giờ"><b>' + esc(b.time) + '</b></td><td data-l="Mã">' + esc(b.code) + '</td><td data-l="Khách">' + esc(b.name) + " " + langFlag(b.lang) + '</td><td data-l="Số khách">' + b.pax + '</td><td data-l="Ghi chú">' + esc(b.note || "—") + '</td><td data-l=""><div class="acts"><button class="btn sm" data-arr="' + b.id + '">Khách đã tới</button></div></td></tr>'; }).join("") + "</tbody></table>" : '<div class="empty2">Chưa có đơn đã xác nhận cho tối nay.</div>';
    main(h);
  }
  function confirmB(b) {
    T.setStatus(b, "confirmed", who()); T.state().alerts.forEach(function (a) { if (a.bookingId === b.id) a.done = true; });
    var m = T.sendCustomer(T.contactOf(b), "confirmed", b); T.save(); render(); T.toast("Đã xác nhận đơn " + esc(b.code)); T.showDelivered(m);
  }
  function rejectB(b) {
    T.modal("Từ chối đơn " + b.code, '<div class="field"><span>Lý do</span>' + T.REJECT.map(function (r, i) { return '<label style="display:flex;gap:8px;align-items:center;font-weight:600"><input type="radio" name="rr" value="' + esc(r) + '"' + (i === 0 ? " checked" : "") + "> " + esc(r) + "</label>"; }).join("") + '</div><label class="field"><span>Ghi chú thêm (khách sẽ thấy)</span><textarea class="inp" id="rn" rows="2"></textarea></label>', '<button class="btn" data-close>Hủy</button><button class="btn red" id="rj">Từ chối đơn</button>');
    document.getElementById("rj").addEventListener("click", function () {
      var r = document.querySelector("[name=rr]:checked").value, n = document.getElementById("rn").value.trim();
      if (r === "Lý do khác" && !n) { T.toast("Nhập ghi chú cho lý do khác", "warn"); return; }
      b.reason = r + (n ? " – " + n : ""); T.setStatus(b, "rejected", who(), b.reason); T.state().alerts.forEach(function (a) { if (a.bookingId === b.id) a.done = true; });
      var m = T.sendCustomer(T.contactOf(b), "rejected", b, { reason: b.reason }); T.save(); T.closeModal(); render(); T.showDelivered(m);
    });
  }
  function arrivedB(b) {
    T.modal("Khách đã tới?", "<p>Xác nhận khách <b>" + esc(b.name) + "</b> (" + esc(b.code) + ") đã tới quán. Đơn sẽ được ghi là <b>quán báo đã tới</b>.</p>", '<button class="btn" data-close>Hủy</button><button class="btn primary" id="ay">Khách đã tới</button>');
    document.getElementById("ay").addEventListener("click", function () { b.arrivedAt = T.now(); b.arrivedBy = "quan"; T.setStatus(b, "arrived", who(), "quán báo"); T.save(); T.closeModal(); render(); T.toast("Đã ghi nhận khách tới. Nhớ nhập hóa đơn sau khi khách thanh toán."); });
  }

  /* ---------- UC-Q05 lịch đơn ---------- */
  function calendar() {
    day = day || T.today();
    var bs = myBookings().filter(function (b) { return b.date === day && (!stFilter || b.status === stFilter); }).sort(function (a, b) { return a.time < b.time ? -1 : 1; });
    var sts = ["", "pending", "confirmed", "arrived", "billed", "rejected", "cancelled", "expired", "no_show"];
    var h = head("Lịch đơn theo ngày", "UC-Q05") + '<div class="toolbar"><button class="btn sm" data-day="-1">‹</button><input class="inp" type="date" id="dayp" value="' + day + '" style="flex:0 1 170px"><button class="btn sm" data-day="1">›</button><button class="btn sm ghost" data-day="0">Hôm nay</button></div>' +
      '<div class="toolbar">' + sts.map(function (s) { return '<button class="chipf' + (stFilter === s ? " on" : "") + '" data-sf="' + s + '">' + (s ? esc(T.STATUS[s]) : "Tất cả") + "</button>"; }).join("") + "</div>";
    h += bs.length ? '<table class="dt"><thead><tr><th>Giờ</th><th>Mã</th><th>Khách</th><th>Số khách</th><th>SĐT</th><th>Ngôn ngữ</th><th>Ghi chú</th><th>Trạng thái</th><th></th></tr></thead><tbody>' + bs.map(function (b) {
      var act = b.status === "pending" ? '<button class="btn sm primary" data-ok="' + b.id + '">Xác nhận</button><button class="btn sm red" data-rej="' + b.id + '">Từ chối</button>' : b.status === "confirmed" ? '<button class="btn sm" data-arr="' + b.id + '">Khách đã tới</button>' : b.status === "arrived" ? '<button class="btn sm primary" data-inv="' + b.id + '">Nhập hóa đơn</button>' : "";
      return '<tr><td data-l="Giờ"><b>' + esc(b.time) + '</b></td><td data-l="Mã">' + esc(b.code) + '</td><td data-l="Khách">' + esc(b.name) + '</td><td data-l="Số khách">' + b.pax + '</td><td data-l="SĐT">' + esc(b.phone ? T.prettyPhone(b.phone) : "—") + '</td><td data-l="Ngôn ngữ">' + langFlag(b.lang) + '</td><td data-l="Ghi chú">' + esc(b.note || "—") + '</td><td data-l="Trạng thái">' + stPill(b) + '</td><td data-l=""><div class="acts">' + act + "</div></td></tr>";
    }).join("") + "</tbody></table>" : '<div class="empty2">Không có đơn.</div>';
    main(h);
    document.getElementById("dayp").addEventListener("change", function (e) { day = e.target.value || T.today(); calendar(); });
  }

  /* ---------- UC-Q02 nhận khách theo tối ---------- */
  function nights() {
    var v = V(), S = T.state(), h = head("Nhận khách theo tối", "UC-Q02") + '<div class="note">Tắt một tối: khách không đặt được tối đó, quán vẫn hiển thị trên web. Đơn đã có không bị hủy.</div><div class="panel">';
    for (var i = 0; i < 14; i++) {
      var d = T.addDays(T.today(), i), on = T.isOpenNight(v.id, d), cnt = myBookings().filter(function (b) { return b.date === d && (b.status === "pending" || b.status === "confirmed"); }).length;
      h += '<div class="nightrow"><div><b>' + T.wd(d, "vi") + " " + T.dmy(d) + "</b>" + (i === 0 ? ' <span class="tag info">Tối nay</span>' : "") + '<div class="small muted">' + cnt + " đơn chờ/đã xác nhận · " + (on ? "Đang nhận khách" : "Đã tắt nhận khách") + '</div></div><label class="sw"><input type="checkbox" data-night="' + d + '"' + (on ? " checked" : "") + ' aria-label="Nhận khách ' + d + '"><span></span></label></div>';
    }
    main(h + "</div>");
    void S;
  }

  /* ---------- UC-Q07 hóa đơn ---------- */
  function invoices() {
    var bs = myBookings(), need = bs.filter(function (b) { return b.status === "arrived"; }), billed = bs.filter(function (b) { return b.status === "billed"; });
    var h = head("Hóa đơn", "UC-Q07") + '<div class="note">Nhập tổng tiền <b>trước thuế và phí</b>, sau khi đã trừ ưu đãi của quán. Sửa được tới khi chốt kỳ tuần.</div>';
    h += '<div class="panel"><h2>Cần nhập hóa đơn (' + need.length + ")</h2>" + (need.length ? '<table class="dt"><thead><tr><th>Mã</th><th>Ngày</th><th>Khách</th><th>Số khách</th><th>Báo tới</th><th></th></tr></thead><tbody>' + need.map(function (b) { return '<tr class="' + (b.missingInvoice ? "hl" : "") + '"><td data-l="Mã">' + esc(b.code) + (b.missingInvoice ? ' <span class="tag bad">Thiếu từ kỳ trước</span>' : "") + '</td><td data-l="Ngày">' + T.dmy(b.date) + " " + esc(b.time) + '</td><td data-l="Khách">' + esc(b.name) + '</td><td data-l="Số khách">' + b.pax + '</td><td data-l="Báo tới">' + (b.arrivedBy === "quan" ? "Quán" : "Khách") + " · " + T.hm(b.arrivedAt) + '</td><td data-l=""><div class="acts"><button class="btn sm primary" data-inv="' + b.id + '">Nhập hóa đơn</button></div></td></tr>'; }).join("") + "</tbody></table>" : '<div class="empty2">Không có đơn cần nhập.</div>') + "</div>";
    h += '<div class="panel"><h2>Đã nhập, kỳ chưa chốt (' + billed.length + ")</h2>" + (billed.length ? '<table class="dt"><thead><tr><th>Mã</th><th>Số HĐ</th><th>Giá trị</th><th>Tỷ lệ</th><th>Toini tài trợ</th><th>Hoa hồng tạm tính</th><th></th></tr></thead><tbody>' + billed.map(function (b) { return '<tr><td data-l="Mã">' + esc(b.code) + '</td><td data-l="Số HĐ">' + esc(b.invoice.no) + '</td><td data-l="Giá trị" class="n">' + T.vnd(b.invoice.amount) + '</td><td data-l="Tỷ lệ" class="n">' + T.rateAt(b.venueId, b.date) + '%</td><td data-l="Toini tài trợ" class="n">' + (b.invoice.sponsor ? "−" + T.vnd(b.invoice.sponsor) : "—") + '</td><td data-l="Hoa hồng tạm tính" class="n"><b>' + T.vnd(T.calcCommission(b) + (b.commissionAdj || 0)) + '</b></td><td data-l=""><div class="acts"><button class="btn sm" data-inv="' + b.id + '">Sửa</button></div></td></tr>'; }).join("") + "</tbody></table>" : '<div class="empty2">Chưa có.</div>') + "</div>";
    main(h);
  }
  function invoiceForm(b) {
    var inv = b.invoice || { no: "HD-" + (10000 + Math.floor(Math.random() * 9000)), amount: 2500000, pax: b.pax, photo: "" };
    T.modal("Hóa đơn · " + b.code, '<p class="small muted" style="margin-top:0">' + esc(b.name) + " · " + T.dmy(b.date) + " " + esc(b.time) + " · đặt " + b.pax + ' khách</p><div class="fgrid"><label class="field"><span>Số hóa đơn ' + T.ref + '</span><input class="inp" id="ino" value="' + esc(inv.no) + '"></label><label class="field"><span>Số khách thực tế</span><input class="inp" id="ipx" type="number" min="1" value="' + inv.pax + '"></label><label class="field span2"><span>Tổng tiền trước thuế & phí (sau ưu đãi của quán) ' + T.ref + '</span><input class="inp" id="iam" inputmode="numeric" value="' + inv.amount + '"></label></div><div class="field"><span>Ảnh hóa đơn</span><input type="file" accept="image/*" capture="environment" id="iph"><div id="iprev" style="margin-top:6px">' + (inv.photo ? '<img class="mini-img" src="' + inv.photo + '" alt="">' : "") + '</div><button type="button" class="btn sm ghost" id="isample" style="align-self:flex-start">Dùng ảnh mẫu (demo)</button></div>' + (b.deal ? '<div class="note">⚡ <b>Đơn dùng deal siêu hời Toini: ' + esc(T.dealLabel(b.deal)) + '</b>. Nhập giá trị hóa đơn <b>trước khi trừ deal</b> (trước thuế phí). Quán giảm cho khách đúng số tiền deal; Toini chịu toàn bộ phần giảm và trừ vào hoa hồng của đơn.</div>' : "") + '<div class="kpis" style="grid-template-columns:repeat(2,minmax(0,1fr))"><div class="kpi"><span>Hoa hồng gốc (' + T.rateAt(b.venueId, b.date) + '%)</span><b id="icg" style="font-size:1.1rem"></b></div>' + (b.deal ? '<div class="kpi"><span>Khách được giảm / Toini tài trợ</span><b id="isp" style="font-size:1.1rem"></b></div><div class="kpi"><span>Khách trả quán (trước thuế phí)</span><b id="ipay" style="font-size:1.1rem"></b></div>' : "") + '<div class="kpi"><span>Hoa hồng thực của đơn</span><b id="icm" style="font-size:1.1rem"></b></div></div>', '<button class="btn" data-close>Hủy</button><button class="btn primary" id="isave">Lưu hóa đơn</button>');
    var photo = inv.photo;
    function cm() { var a = +String(document.getElementById("iam").value).replace(/\D/g, "") || 0, g = Math.round(a * T.rateAt(b.venueId, b.date) / 100 / 1000) * 1000, sp = T.dealSponsor(b.deal, a), net = g - sp; document.getElementById("icg").textContent = T.vnd(g); if (b.deal) { document.getElementById("isp").textContent = T.vnd(sp); document.getElementById("ipay").textContent = T.vnd(a - sp); } var el = document.getElementById("icm"); el.textContent = net < 0 ? T.vnd(net) + " (Toini trả quán " + T.vnd(-net) + ")" : T.vnd(net); el.style.color = net < 0 ? "var(--info)" : ""; }
    cm(); document.getElementById("iam").addEventListener("input", cm);
    document.getElementById("iph").addEventListener("change", function (e) { var f = e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { var im = new Image(); im.onload = function () { var c = document.createElement("canvas"), k = Math.min(1, 480 / im.width); c.width = im.width * k; c.height = im.height * k; c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); photo = c.toDataURL("image/jpeg", .6); document.getElementById("iprev").innerHTML = '<img class="mini-img" src="' + photo + '" alt="">'; }; im.src = r.result; }; r.readAsDataURL(f); });
    document.getElementById("isample").addEventListener("click", function () { photo = "../assets/img/" + T.venue(b.venueId).imgs[0]; document.getElementById("iprev").innerHTML = '<img class="mini-img" src="' + photo + '" alt=""> <span class="small muted">ảnh mẫu thay cho ảnh chụp hóa đơn</span>'; });
    document.getElementById("isave").addEventListener("click", function () {
      var a = +String(document.getElementById("iam").value).replace(/\D/g, ""), no = document.getElementById("ino").value.trim(), px = +document.getElementById("ipx").value;
      if (!no || !a || !px) { T.toast("Nhập đủ số hóa đơn, số tiền, số khách", "warn"); return; }
      if (!photo) { T.toast("Cần chụp hoặc tải ảnh hóa đơn (hoặc bấm Dùng ảnh mẫu)", "warn"); return; }
      var before = b.invoice ? b.invoice.no + " · " + T.vnd(b.invoice.amount) : null;
      b.invoice = { no: no, amount: a, pax: px, photo: photo, at: T.now(), by: who(), sponsor: T.dealSponsor(b.deal, a) }; b.missingInvoice = false;
      if (b.status === "arrived") T.setStatus(b, "billed", who(), "hóa đơn " + no + " · " + T.vnd(a));
      else b.history.push({ at: T.now(), by: who(), action: "Sửa hóa đơn " + no + " · " + T.vnd(a) });
      T.audit(who(), "Hóa đơn", b.code, before ? "Sửa hóa đơn" : "Nhập hóa đơn", before, no + " · " + T.vnd(a) + " · " + px + " khách");
      T.save(); T.closeModal(); render(); T.toast("Đã lưu hóa đơn. Hoa hồng tạm tính " + T.vnd(T.calcCommission(b)));
    });
  }

  /* ---------- UC-Q08 công nợ ---------- */
  function debt() {
    var S = T.state(), v = V();
    var periods = S.periods.filter(function (p) { return p.lines.some(function (l) { return l.venueId === v.id; }); });
    var open = myBookings().filter(function (b) { return b.status === "billed"; }), openSum = open.reduce(function (a, b) { return a + T.calcCommission(b) + (b.commissionAdj || 0); }, 0);
    var tot = periods.reduce(function (a, p) { return a + T.debtOf(v.id, p.id).left; }, 0);
    var h = head("Công nợ hoa hồng", "UC-Q08") + '<div class="kpis"><div class="kpi"><span>Còn phải trả</span><b>' + T.vnd(tot) + '</b></div><div class="kpi"><span>Kỳ đang mở (tạm tính)</span><b>' + T.vnd(openSum) + '</b></div><div class="kpi"><span>Tỷ lệ hiện tại</span><b>' + T.rateAt(v.id, T.today()) + '%</b></div><div class="kpi"><span>Chốt kỳ</span><b style="font-size:1rem">Thứ 2 · 12:00</b></div></div><div class="note">Quán chuyển khoản cho Toini trong 7 ngày sau ngày chốt kỳ. Kế toán Toini ghi nhận khoản đã thu.</div>';
    h += periods.length ? '<table class="dt"><thead><tr><th>Kỳ</th><th>Thời gian</th><th>Số đơn</th><th>Phải trả</th><th>Đã trả</th><th>Còn lại</th><th>Hạn trả</th><th></th></tr></thead><tbody>' + periods.map(function (p) {
      var d = T.debtOf(v.id, p.id), line = p.lines.filter(function (l) { return l.venueId === v.id; })[0];
      return '<tr class="' + (d.overdue ? "hl" : "") + '"><td data-l="Kỳ"><b>' + p.id + '</b></td><td data-l="Thời gian">' + T.dmy(p.from) + " – " + T.dmy(p.to) + '</td><td data-l="Số đơn" class="n">' + line.bookings.length + (line.adj.length ? " + " + line.adj.length + " ĐC" : "") + '</td><td data-l="Phải trả" class="n">' + T.vnd(d.amount) + '</td><td data-l="Đã trả" class="n">' + T.vnd(d.paid) + '</td><td data-l="Còn lại" class="n"><b>' + T.vnd(d.left) + '</b></td><td data-l="Hạn trả">' + T.dmy(d.due) + " " + (d.amount < 0 && d.left < 0 ? '<span class="tag info">Toini trả quán</span>' : d.left <= 0 ? '<span class="tag ok">Đã trả đủ</span>' : d.overdue ? '<span class="tag bad">Quá hạn</span>' : '<span class="tag warn">Chưa trả đủ</span>') + '</td><td data-l=""><button class="btn sm" data-pd="' + p.id + '">Chi tiết</button></td></tr>';
    }).join("") + "</tbody></table>" : '<div class="empty2">Chưa có kỳ nào được chốt.</div>';
    var pays = S.payments.filter(function (x) { return x.venueId === v.id; });
    h += '<div class="panel" style="margin-top:14px"><h2>Lịch sử thanh toán</h2>' + (pays.length ? '<table class="dt"><thead><tr><th>Ngày</th><th>Kỳ</th><th>Số tiền</th><th>Ghi chú</th></tr></thead><tbody>' + pays.map(function (x) { return '<tr><td data-l="Ngày">' + T.dmy(x.at) + '</td><td data-l="Kỳ">' + x.periodId + '</td><td data-l="Số tiền" class="n">' + T.vnd(x.amount) + '</td><td data-l="Ghi chú">' + esc(x.note) + "</td></tr>"; }).join("") + "</tbody></table>" : '<div class="empty2">Chưa có.</div>') + "</div>";
    main(h);
  }
  function periodDetail(pid) {
    var S = T.state(), v = V(), p = S.periods.filter(function (x) { return x.id === pid; })[0], line = p.lines.filter(function (l) { return l.venueId === v.id; })[0];
    var rows = line.bookings.map(function (c) { var b = T.booking(c); return '<tr><td data-l="Mã">' + esc(c) + '</td><td data-l="Ngày">' + T.dmy(b.date) + '</td><td data-l="Hóa đơn">' + esc(b.invoice.no) + '</td><td data-l="Giá trị" class="n">' + T.vnd(b.invoice.amount) + '</td><td data-l="Hoa hồng" class="n">' + T.vnd(b.commission) + "</td></tr>"; }).join("") + line.adj.map(function (a) { return '<tr class="hl"><td data-l="Mã">Điều chỉnh ' + esc(a.code) + '</td><td data-l="Ngày">' + T.dmy(a.at) + '</td><td data-l="Hóa đơn">' + esc(a.reason) + '</td><td data-l="Giá trị"></td><td data-l="Hoa hồng" class="n">' + T.vnd(a.amount) + "</td></tr>"; }).join("");
    T.modal("Kỳ " + pid + " · " + v.name, '<table class="dt"><thead><tr><th>Mã</th><th>Ngày</th><th>Hóa đơn</th><th>Giá trị</th><th>Hoa hồng</th></tr></thead><tbody>' + rows + "</tbody></table>", '<button class="btn" data-close>Đóng</button>', { wide: true });
  }

  /* ---------- Telegram mô phỏng ---------- */
  function telegram() {
    var msgs = T.state().telegram.filter(function (m) { return m.chat === "venue:" + ses.venue; }).slice().reverse();
    var h = head("Nhóm Telegram của quán (mô phỏng)", "UC-Q03") + '<div class="note">Trên thực tế, bot Toini gửi tin vào nhóm Telegram của nhân viên quán. Tin chỉ để báo; xác nhận/từ chối làm trên cổng quán.</div><div class="tg-feed">' + (msgs.length ? msgs.map(function (m) { return '<div class="tg-msg"><b class="bot">Toini Bot</b>' + esc(m.text) + "<time>" + T.dt(m.at) + "</time></div>"; }).join("") : '<div class="small muted">Chưa có tin.</div>') + "</div>";
    main(h); var f = document.querySelector(".tg-feed"); f.scrollTop = f.scrollHeight;
  }
  function profile() {
    var v = V();
    var rows = [["Tên quán", v.name], ["Loại hình", T.state().types[v.type].vi], ["Khu vực", v.area], ["Địa chỉ", v.address], ["Giờ mở cửa", v.hours], ["Phí vào cửa", v.entry ? T.vnd(v.entry) : "Miễn phí"], ["Chi tiêu tối thiểu", v.minSpend ? T.vnd(v.minSpend) : "Không"], ["Thuế & phí", v.taxNote], ["Dress code", v.dress], ["Giới hạn tuổi", v.age ? v.age + "+" : "Không"], ["Ưu đãi đang chạy", T.offersOf(v.id, true).map(function (o) { return o.tr.vi.title; }).join("; ") || "—"], ["Deal siêu hời Toini", T.state().superDeals.filter(function (d) { return d.venueId === v.id && d.active; }).map(function (d) { return d.tr.vi.title + " (" + d.from + "–" + d.to + ")"; }).join("; ") || "—"], ["Sự kiện sắp tới", T.state().events.filter(function (e) { return e.venueId === v.id && e.date >= T.today(); }).map(function (e) { return T.dmy(e.date) + " " + e.from + " · " + e.tr.vi.title; }).join("; ") || "—"]];
    main(head("Hồ sơ quán", "chỉ xem") + '<div class="note">Trong giai đoạn này quán không tự sửa hồ sơ. Muốn thay đổi thông tin, ảnh hay ưu đãi, vui lòng liên hệ Toini để được cập nhật.</div><div class="panel"><div class="imgs" style="margin-bottom:12px">' + v.imgs.map(function (p) { return '<figure><img src="../assets/img/' + p + '" alt=""></figure>'; }).join("") + '</div><table class="dt"><tbody>' + rows.map(function (r) { return '<tr><td data-l="' + esc(r[0]) + '" style="width:200px"><b>' + esc(r[0]) + '</b></td><td data-l="">' + esc(r[1]) + "</td></tr>"; }).join("") + "</tbody></table></div>");
  }
  function account() {
    var a = acc();
    main(head("Tài khoản", "UC-Q01") + '<div class="panel"><p><b>' + esc(a.name) + "</b> · " + esc(a.username) + " · " + esc(a.email) + '</p><p class="small">Quán được gán: ' + a.venueIds.map(function (id) { return esc(T.venue(id).name); }).join(", ") + '</p><p class="small muted">Mọi tài khoản của quán có quyền như nhau. Quán tự giao tài khoản cho nhân viên.</p><button class="btn" id="cp">Đổi mật khẩu</button></div>');
    document.getElementById("cp").addEventListener("click", function () { changePass(false); });
  }

  /* ---------- sự kiện ---------- */
  app.addEventListener("click", function (e) {
    var el = e.target.closest("[data-nav],[data-ok],[data-rej],[data-arr],[data-inv],[data-day],[data-sf],[data-pd],#logout");
    if (!el) return;
    e.preventDefault();
    var B = function (id) { return T.booking(id); };
    if (el.id === "logout") { T.audit(who(), "Phiên đăng nhập", who(), "Đăng xuất"); T.save(); ses = null; saveSes(); return login(); }
    if (el.dataset.nav) { view = el.dataset.nav; render(); window.scrollTo(0, 0); }
    else if (el.dataset.ok) confirmB(B(el.dataset.ok));
    else if (el.dataset.rej) rejectB(B(el.dataset.rej));
    else if (el.dataset.arr) arrivedB(B(el.dataset.arr));
    else if (el.dataset.inv) invoiceForm(B(el.dataset.inv));
    else if (el.dataset.pd) periodDetail(el.dataset.pd);
    else if (el.dataset.day) { var n = +el.dataset.day; day = n === 0 ? T.today() : T.addDays(day, n); calendar(); }
    else if (el.dataset.sf !== undefined) { stFilter = el.dataset.sf; calendar(); }
  });
  app.addEventListener("change", function (e) {
    if (e.target.id === "venueSel") { ses.venue = e.target.value; saveSes(); render(); }
    if (e.target.dataset.night) {
      var S = T.state(), d = e.target.dataset.night, on = e.target.checked; (S.open[ses.venue] = S.open[ses.venue] || {})[d] = on;
      T.audit(who(), "Nhận khách theo tối", V().name + " " + T.dmy(d), on ? "Bật nhận khách" : "Tắt nhận khách", on ? "Tắt" : "Bật", on ? "Bật" : "Tắt"); T.save(); T.toast((on ? "Đã bật" : "Đã tắt") + " nhận khách tối " + T.dmy(d)); nights();
    }
  });
  setInterval(function () { document.querySelectorAll("[data-cd]").forEach(function (el) { var b = T.booking(el.dataset.cd); if (!b) return; var l = left(b); el.textContent = "⏱ " + l.txt; el.classList.toggle("late", l.late); }); }, 1000);
  T.on(function () { var a = document.activeElement, typing = a && /INPUT|TEXTAREA/.test(a.tagName) && a.type !== "checkbox"; if (!document.getElementById("t-modal") && ses && !typing) { var y = window.scrollY; render(); window.scrollTo(0, y); } });
  T.startTicker(); T.demoPanel("quan"); render();
})();
