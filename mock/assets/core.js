/* Toini mock – lõi dùng chung cho web khách, cổng quán, quản trị.
   Dữ liệu lưu trong localStorage của trình duyệt (key toini-mock-v1) để 3 app dùng chung và đồng bộ giữa các tab.
   Mọi dịch vụ ngoài (ZNS, SMS, email, Telegram, AI dịch, Grab, đăng nhập, OTP) đều là mô phỏng bằng dữ liệu cứng. */
(function () {
  var KEY = "toini-mock-v1";
  var SEED = window.TOINI_SEED;
  var T = window.T = {};
  var mem = null, subs = [];
  var MIN = 60000, HOUR = 3600000, DAY = 86400000;
  T.MIN = MIN; T.HOUR = HOUR; T.DAY = DAY;
  T.DEMO_OTP = "123456";

  /* ---------- tiện ích ---------- */
  T.esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  T.clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  T.uid = function (p) { return (p || "id") + Math.random().toString(36).slice(2, 8); };
  T.vnd = function (n) { return Math.round(n || 0).toLocaleString("vi-VN") + "đ"; };
  T.pad = function (n) { return (n < 10 ? "0" : "") + n; };
  T.iso = function (d) { d = new Date(d); return d.getFullYear() + "-" + T.pad(d.getMonth() + 1) + "-" + T.pad(d.getDate()); };
  T.hm = function (d) { d = new Date(d); return T.pad(d.getHours()) + ":" + T.pad(d.getMinutes()); };
  T.dmy = function (d) { d = new Date(typeof d === "string" && d.length === 10 ? d + "T00:00" : d); return T.pad(d.getDate()) + "/" + T.pad(d.getMonth() + 1) + "/" + d.getFullYear(); };
  T.dt = function (d) { return T.hm(d) + " " + T.dmy(d); };
  T.addDays = function (isoDate, n) { var d = new Date(isoDate + "T00:00"); d.setDate(d.getDate() + n); return T.iso(d); };
  T.wd = function (isoDate, lang) {
    var d = new Date(isoDate + "T00:00"), i = d.getDay();
    var W = { vi: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"], en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ko: ["일", "월", "화", "수", "목", "금", "토"], ru: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], zh: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], ja: ["日", "月", "火", "水", "木", "金", "土"] };
    return (W[lang] || W.vi)[i];
  };
  T.ago = function (ms) { var m = Math.round(ms / MIN); if (m < 1) return "vừa xong"; if (m < 60) return m + " phút trước"; var h = Math.round(m / 60); if (h < 24) return h + " giờ trước"; return Math.round(h / 24) + " ngày trước"; };
  T.normPhone = function (raw) {
    var s = String(raw || "").replace(/[^\d+]/g, "");
    if (!s) return "";
    if (s[0] === "0") s = "+84" + s.slice(1);
    if (s[0] !== "+") s = "+" + s;
    return s;
  };
  T.prettyPhone = function (e164) {
    if (!e164) return "";
    var m = e164.match(/^\+84(\d{3})(\d{3})(\d+)$/);
    return m ? "+84 " + m[1] + " " + m[2] + " " + m[3] : e164.replace(/^(\+\d{2})(\d{2,3})(\d{3,4})(\d+)$/, "$1 $2 $3 $4");
  };
  T.isVN = function (e164) { return /^\+84\d{9}$/.test(e164 || ""); };
  T.normEmail = function (e) { return String(e || "").trim().toLowerCase(); };

  /* ---------- lưu trữ ---------- */
  function read() { try { var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  var VER = 5; // tăng khi đổi dữ liệu mẫu để trình duyệt tự nạp lại
  T.state = function () { if (!mem) { mem = read(); if (!mem || mem.v !== VER) { mem = seed(); write(); } } return mem; };
  function write() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { } }
  T.save = function () { write(); subs.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); };
  T.on = function (f) { subs.push(f); };
  T.VER = VER;
  window.addEventListener("storage", function (e) { if (e.key === KEY) { var nx = read(); if (nx && nx.v !== VER) { location.reload(); return; } mem = nx || mem; subs.forEach(function (f) { try { f(); } catch (er) { console.error(er); } }); } });
  T.reset = function () { mem = seed(); T.save(); };

  /* ---------- đồng hồ giả lập ---------- */
  T.now = function () { return Date.now() + (T.state().clockOffset || 0); };
  T.today = function () { return T.iso(T.now()); };
  T.shiftClock = function (ms) { var s = T.state(); s.clockOffset = (s.clockOffset || 0) + ms; T.tick(true); T.save(); };

  /* ---------- tra cứu ---------- */
  T.venue = function (id) { return T.state().venues.filter(function (v) { return v.id === id || v.slug === id; })[0]; };
  T.booking = function (idOrCode) { return T.state().bookings.filter(function (b) { return b.id === idOrCode || b.code === idOrCode; })[0]; };
  T.offersOf = function (vid, onlyActive) { return T.state().offers.filter(function (o) { return o.venueId === vid && (!onlyActive || o.active); }); };
  T.isOpenNight = function (vid, date) { var o = T.state().open[vid] || {}; return o[date] !== false; };
  T.STATUS = { pending: "Chờ quán xác nhận", confirmed: "Đã xác nhận", rejected: "Quán từ chối", expired: "Quá hạn (tự hủy)", cancelled: "Đã hủy", arrived: "Đã tới quán", no_show: "Không đến", billed: "Đã có hóa đơn", settled: "Đã chốt kỳ" };
  T.ROLE = { gd: "Giám đốc", cs: "Sale/CSKH", kt: "Kế toán" };
  T.REJECT = ["Hết chỗ", "Không phục vụ được số khách này", "Giờ không phù hợp", "Lý do khác"];

  /* ---------- nhật ký thao tác (S07) ---------- */
  T.audit = function (actor, entity, entityId, action, before, after) {
    T.state().audit.unshift({ id: T.uid("a"), at: T.now(), actor: actor || "Hệ thống", entity: entity, entityId: entityId, action: action, before: before === undefined ? null : before, after: after === undefined ? null : after });
  };

  /* ---------- hoa hồng (A08, S03) ---------- */
  T.rateAt = function (vid, date) {
    var list = (T.state().commissions[vid] || []).slice().sort(function (a, b) { return a.from < b.from ? -1 : 1; });
    var r = 0; list.forEach(function (x) { if (x.from <= date) r = x.rate; }); return r;
  };
  T.grossCommission = function (b) { if (!b.invoice) return 0; return Math.round(b.invoice.amount * T.rateAt(b.venueId, b.date) / 100 / 1000) * 1000; };
  /* phần Toini tài trợ của deal siêu hời: pct = % giá trị hóa đơn, amount = voucher (không vượt hóa đơn) */
  T.dealSponsor = function (deal, amount) { if (!deal || !amount) return 0; return deal.type === "pct" ? Math.round(amount * deal.value / 100 / 1000) * 1000 : Math.min(deal.value, amount); };
  /* hoa hồng thực = hoa hồng gốc − phần Toini tài trợ; có thể âm (trừ vào công nợ của quán) */
  T.calcCommission = function (b) {
    if (!b.invoice) return 0;
    return T.grossCommission(b) - (b.invoice.sponsor || 0);
  };
  T.dealSnap = function (d) { return d ? { id: d.id, type: d.type, value: d.value, title: d.tr.vi.title } : null; };
  T.dealLabel = function (deal) { return deal ? (deal.type === "pct" ? "Giảm " + deal.value + "% hóa đơn" : "Voucher " + T.vnd(deal.value)) : ""; };
  T.superDeal = function (id) { return T.state().superDeals.filter(function (d) { return d.id === id; })[0]; };
  T.event = function (id) { return T.state().events.filter(function (e) { return e.id === id; })[0]; };
  T.dealUsed = function (id) { return T.state().bookings.filter(function (b) { return b.dealId === id && ["cancelled", "rejected", "expired"].indexOf(b.status) < 0; }).length; };
  T.ratingOf = function (vid) { var r = T.state().reviews.filter(function (x) { return x.venueId === vid && x.status === "approved"; }); return { count: r.length, avg: r.length ? Math.round(r.reduce(function (a, x) { return a + x.stars; }, 0) / r.length * 10) / 10 : 0 }; };

  /* ---------- gửi tin cho khách (S01, S06) ---------- */
  function counter() { var s = T.state(), d = T.today(); if (!s.counters || s.counters.date !== d) s.counters = { date: d, zns: 0, sms: 0, email: 0 }; return s.counters; }
  T.counter = counter;
  function tpl(type, b, extra) {
    var v = T.venue(b.venueId) || {};
    var map = {
      otp: "Mã xác minh Toini của bạn là " + T.DEMO_OTP + ". Hiệu lực 5 phút.",
      received: "Toini đã nhận đơn " + b.code + " tại " + v.name + " lúc " + b.time + " " + T.dmy(b.date) + ". Đang chờ quán xác nhận.",
      confirmed: v.name + " đã xác nhận đơn " + b.code + " lúc " + b.time + " " + T.dmy(b.date) + ". Xem đơn: toini.vn/b/" + b.code,
      rejected: v.name + " chưa nhận được đơn " + b.code + ". Lý do: " + ((extra && extra.reason) || "") + ".",
      expired: "Đơn " + b.code + " đã tự hủy vì quán chưa phản hồi. Xem quán khác còn nhận khách: toini.vn",
      changed: "Đơn " + b.code + " đổi sang " + b.time + " " + T.dmy(b.date) + ". Đang chờ quán xác nhận lại.",
      cancelled: "Đơn " + b.code + " đã được hủy.",
      review: "Cảm ơn bạn đã tới " + v.name + " qua Toini! Chia sẻ đánh giá của bạn (sao, bình luận, ảnh): toini.vn/b/" + b.code
    };
    return map[type] || type;
  }
  /* to: {phone, email}; trả về danh sách tin đã gửi */
  T.sendCustomer = function (to, type, b, extra) {
    var s = T.state(), c = counter(), caps = s.settings.caps, out = [], text = tpl(type, b || {}, extra);
    var blocked = s.settings.blocked.some(function (x) { return x.v === T.prettyPhone(to.phone) || x.v === to.phone || x.v === to.email; });
    function push(ch, ok, why) {
      var m = { id: T.uid("m"), at: T.now(), ch: ch, type: type, to: ch === "Email" ? to.email : T.prettyPhone(to.phone), text: text, ok: ok, why: why || "", code: b && b.code };
      s.outbox.unshift(m); out.push(m); if (b) (b.msgs = b.msgs || []).push(m);
      if (ok) c[ch === "Zalo ZNS" ? "zns" : ch === "SMS" ? "sms" : "email"]++;
      return m;
    }
    if (blocked) { push("—", false, "Số/email nằm trong danh sách chặn"); return out; }
    var phoneDone = false;
    if (to.phone && T.isVN(to.phone)) {
      if (c.zns >= caps.zns) push("Zalo ZNS", false, "Chạm trần ZNS trong ngày");
      else if (s.sim.znsFail) push("Zalo ZNS", false, "Số không dùng Zalo / Zalo báo lỗi (mô phỏng)");
      else { push("Zalo ZNS", true); phoneDone = true; }
      if (!phoneDone) {
        if (c.sms >= caps.sms) push("SMS", false, "Chạm trần SMS trong ngày");
        else { push("SMS", true); phoneDone = true; }
      }
    }
    var wantEmail = to.email && (type !== "otp" || !phoneDone);
    if (wantEmail) push("Email", true);
    if (!out.some(function (m) { return m.ok; }) && !out.length) push("—", false, "Không có kênh phù hợp – khách tự tra cứu trên web");
    checkCapAlerts();
    return out;
  };
  function checkCapAlerts() {
    var s = T.state(), c = counter(), caps = s.settings.caps;
    ["zns", "sms"].forEach(function (k) {
      [80, 100].forEach(function (p) {
        var key = c.date + k + p;
        if (c[k] >= caps[k] * p / 100 && !s.capAlerts[key]) {
          s.capAlerts[key] = 1;
          s.alerts.unshift({ id: T.uid("al"), at: T.now(), kind: "cap", text: "Số tin " + k.toUpperCase() + " hôm nay đã đạt " + p + "% trần (" + c[k] + "/" + caps[k] + ")", done: false });
        }
      });
    });
  }
  /* kiểm tra giới hạn gửi mã theo SĐT/email (A14) */
  T.otpAllowed = function (phone, email) {
    var s = T.state(), caps = s.settings.caps, today = T.today();
    var cnt = s.otpLog.filter(function (x) { return T.iso(x.at) === today && ((phone && x.phone === phone) || (email && x.email === email)); }).length;
    if (s.settings.blocked.some(function (x) { return x.v === T.prettyPhone(phone) || x.v === phone || x.v === email; })) return { ok: false, why: "blocked" };
    if (cnt >= Math.min(caps.perPhone, caps.perEmail)) return { ok: false, why: "limit" };
    return { ok: true };
  };
  T.logOtp = function (phone, email) { T.state().otpLog.push({ at: T.now(), phone: phone, email: email }); };

  /* ---------- Telegram (mô phỏng) ---------- */
  T.telegram = function (chat, text) { T.state().telegram.unshift({ id: T.uid("tg"), at: T.now(), chat: chat, text: text }); };
  T.notifyVenue = function (b, kind) {
    var v = T.venue(b.venueId);
    var head = { new: "🆕 ĐƠN MỚI", changed: "🔁 KHÁCH ĐỔI GIỜ", cancelled: "❌ KHÁCH HỦY ĐƠN" }[kind] || kind;
    T.telegram("venue:" + b.venueId, head + " · " + b.code + "\n" + b.name + " · " + b.pax + " khách\n" + T.wd(b.date, "vi") + " " + T.dmy(b.date) + " lúc " + b.time + (b.note ? "\nGhi chú: " + b.note : "") + (b.eventId && T.event(b.eventId) ? "\n🎶 Sự kiện: " + T.event(b.eventId).tr.vi.title : "") + (b.deal ? "\n⚡ Deal Toini: " + T.dealLabel(b.deal) + " (Toini tài trợ)" : "") + "\nMở đơn: cong.toini.vn/don/" + b.code);
    void v;
  };

  /* ---------- AI dịch (mô phỏng) ---------- */
  var AI = {
    en: "This is a sample English draft translated by AI. Toini staff should review and edit before approving.",
    ko: "AI가 번역한 한국어 초안 예시입니다. Toini 직원이 검토 후 승인해야 합니다.",
    ru: "Это пример черновика перевода на русский, сделанного ИИ. Сотрудник Toini должен проверить перед утверждением.",
    zh: "这是AI翻译的中文草稿示例。Toini员工需审核后再批准。",
    ja: "これはAIが翻訳した日本語の下書き例です。Toiniスタッフが確認してから承認してください。"
  };
  T.aiTranslate = function (text, lang) { return "[AI] " + (AI[lang] || text); };

  /* ---------- trạng thái đơn ---------- */
  T.setStatus = function (b, st, actor, note) {
    var before = b.status; b.status = st; b.statusAt = T.now();
    b.history.push({ at: T.now(), by: actor, action: T.STATUS[st] + (note ? " – " + note : "") });
    T.audit(actor, "Đơn", b.code, "Đổi trạng thái", T.STATUS[before], T.STATUS[st] + (note ? " (" + note + ")" : ""));
  };
  T.contactOf = function (b) { return { phone: b.phone, email: b.email }; };
  T.checkinWindow = function (b) {
    if (T.state().sim.skipWindow) return true;
    var start = new Date(b.date + "T" + b.time).getTime() - 2 * HOUR;
    var end = new Date(T.addDays(b.date, 1) + "T04:00").getTime();
    var n = T.now(); return n >= start && n <= end;
  };

  /* ---------- chốt kỳ tuần (S04) ---------- */
  T.lastBoundary = function (at) {
    var s = T.state(), d = new Date(at);
    var b = new Date(d.getFullYear(), d.getMonth(), d.getDate(), s.settings.closeHour, 0, 0);
    while (b.getDay() !== s.settings.closeDay || b.getTime() > at) b = new Date(b.getTime() - DAY);
    return b.getTime();
  };
  T.closePeriod = function (at, actor) {
    var s = T.state(), from = s.lastClose || (at - 7 * DAY);
    var id = "K" + T.iso(at).replace(/-/g, "");
    if (s.periods.some(function (p) { return p.id === id; })) return null;
    var lines = {};
    s.bookings.forEach(function (b) {
      if (b.status === "billed") {
        b.commission = T.calcCommission(b) + (b.commissionAdj || 0);
        (lines[b.venueId] = lines[b.venueId] || { venueId: b.venueId, bookings: [], amount: 0, adj: [] });
        lines[b.venueId].bookings.push(b.code); lines[b.venueId].amount += b.commission;
        b.periodId = id; b.status = "settled"; b.statusAt = at;
        b.history.push({ at: at, by: "Hệ thống", action: "Chốt kỳ " + id });
      } else if (b.status === "arrived" && !b.missingInvoice) {
        b.missingInvoice = true; b.history.push({ at: at, by: "Hệ thống", action: "Chốt kỳ: đánh dấu thiếu hóa đơn, chuyển kỳ sau" });
      }
    });
    (s.pendingAdj || []).forEach(function (a) {
      (lines[a.venueId] = lines[a.venueId] || { venueId: a.venueId, bookings: [], amount: 0, adj: [] });
      lines[a.venueId].amount += a.amount; lines[a.venueId].adj.push(a);
    });
    s.pendingAdj = [];
    var p = { id: id, from: from, to: at, closedAt: at, due: at + 7 * DAY, lines: Object.keys(lines).map(function (k) { return lines[k]; }) };
    s.periods.unshift(p); s.lastClose = at;
    T.audit(actor || "Hệ thống", "Kỳ đối soát", id, "Chốt kỳ tuần", null, p.lines.length + " quán · hạn trả " + T.dmy(p.due));
    return p;
  };
  T.debtOf = function (vid, pid) {
    var s = T.state(), p = s.periods.filter(function (x) { return x.id === pid; })[0];
    var line = p && p.lines.filter(function (l) { return l.venueId === vid; })[0];
    var amount = line ? line.amount : 0;
    var paid = s.payments.filter(function (x) { return x.venueId === vid && x.periodId === pid; }).reduce(function (a, x) { return a + x.amount; }, 0);
    return { amount: amount, paid: paid, left: amount - paid, due: p ? p.due : 0, overdue: !!(p && amount - paid > 0 && T.now() > p.due) };
  };

  /* ---------- việc tự động (S02, S04) ---------- */
  T.tick = function (silent) {
    var s = T.state(), n = T.now(), changed = false;
    s.bookings.forEach(function (b) {
      if (b.status === "pending") {
        var base = b.deadlineBase;
        if (n - base >= 15 * MIN && !b.lateAlerted) {
          b.lateAlerted = true; changed = true;
          s.alerts.unshift({ id: T.uid("al"), at: base + 15 * MIN, kind: "late", bookingId: b.id, text: "Đơn " + b.code + " (" + T.venue(b.venueId).name + ") đã chờ quán quá 15 phút – gọi quán", done: false });
          T.telegram("cskh", "⚠️ QUÁ 15 PHÚT · " + b.code + "\n" + T.venue(b.venueId).name + " chưa phản hồi. Gọi quán: " + T.venue(b.venueId).contact.phone);
          b.history.push({ at: base + 15 * MIN, by: "Hệ thống", action: "Quá 15 phút – đã cảnh báo CSKH" });
        }
        if (n - base >= 30 * MIN) {
          changed = true; T.setStatus(b, "expired", "Hệ thống", "quá 30 phút quán chưa phản hồi");
          T.sendCustomer(T.contactOf(b), "expired", b);
          s.alerts.forEach(function (a) { if (a.bookingId === b.id) a.done = true; });
        }
      } else if (["arrived", "billed", "settled"].indexOf(b.status) >= 0 && b.email && b.arrivedAt && !b.reviewInvited && !b.reviewId && n - b.arrivedAt >= 2 * HOUR) {
        b.reviewInvited = true; changed = true; T.sendCustomer({ email: b.email }, "review", b);
        b.history.push({ at: n, by: "Hệ thống", action: "Gửi email mời đánh giá" });
      } else if (b.status === "confirmed" && b.date < T.iso(n)) {
        changed = true; T.setStatus(b, "no_show", "Hệ thống", "hết ngày không ai báo đã tới");
      }
    });
    var bd = T.lastBoundary(n);
    if (s.lastClose && bd > s.lastClose) { T.closePeriod(bd, "Hệ thống"); changed = true; }
    if (changed && !silent) T.save();
    return changed;
  };

  /* ---------- tạo đơn ---------- */
  T.newCode = function () {
    var A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", c;
    do { c = "TN-"; for (var i = 0; i < 4; i++) c += A[Math.floor(Math.random() * A.length)]; } while (T.booking(c));
    return c;
  };

  /* ---------- dữ liệu mẫu ---------- */
  function seed() {
    var S = T.clone(SEED);
    var now = Date.now(), today = T.iso(now), y = T.addDays(today, -1), y2 = T.addDays(today, -2), tm = T.addDays(today, 1);
    var st = {
      v: VER, clockOffset: 0, sim: { znsFail: false, skipWindow: true },
      venues: S.venues, offers: S.offers, commissions: S.commissions, shopAccounts: S.shopAccounts, staff: S.staff,
      settings: S.settings, templates: S.templates, areas: S.areas, types: S.types,
      uiOverrides: {}, open: { v5: {} }, bookings: [], outbox: [], telegram: [], audit: [], alerts: [], capAlerts: {},
      otpLog: [], periods: [], payments: [], pendingAdj: [], myCodes: [],
      events: S.events.map(function (e) { var x = T.clone(e); x.date = T.addDays(today, e.d); delete x.d; x.active = true; return x; }),
      superDeals: S.superDeals,
      reviews: S.reviews.map(function (r, i) { var x = T.clone(r); x.id = "r" + (i + 1); x.at = now - r.d * DAY - (i + 1) * HOUR; delete x.d; return x; }), counters: { date: today, zns: 37, sms: 6, email: 21 },
      lastClose: 0, imports: []
    };
    st.open.v5[today] = false; // X8 tắt nhận khách tối nay để demo
    mem = st;
    function mk(o) {
      var b = Object.assign({ id: T.uid("b"), code: o.code, history: [], msgs: [], createdAt: now, statusAt: now, note: "", currency: "VND", email: "", phone: "" }, o);
      b.deadlineBase = b.createdAt;
      b.history.push({ at: b.createdAt, by: "Khách", action: "Tạo đơn (đã xác minh " + (b.phone && T.isVN(b.phone) ? "qua Zalo ZNS" : "qua email") + ")" });
      st.bookings.push(b); return b;
    }
    mk({ code: "TN-A7K2", venueId: "v1", date: today, time: "21:00", pax: 6, name: "Kim Min-ji", phone: "+821023456789", email: "minji.kim@example.com", lang: "ko", status: "pending", createdAt: now - 16 * MIN, note: "Sinh nhật bạn, xin bàn gần sân khấu" });
    mk({ code: "TN-B3M9", venueId: "v2", date: today, time: "19:30", pax: 2, name: "Nguyễn Hoàng Nam", phone: "+84905123456", lang: "vi", status: "pending", createdAt: now - 3 * MIN });
    var c1 = mk({ code: "TN-C5Q1", dealId: "d2", deal: { id: "d2", type: "amount", value: 100000, title: "Voucher 100K mỗi bàn" }, venueId: "v3", date: today, time: "20:00", pax: 4, name: "John Smith", phone: "+447700900123", email: "john@example.com", lang: "en", status: "confirmed", createdAt: now - 2 * HOUR });
    c1.history.push({ at: now - 110 * MIN, by: "bachdang.group", action: "Đã xác nhận" });
    var c2 = mk({ code: "TN-E2H6", eventId: "e1", dealId: "d1", deal: { id: "d1", type: "pct", value: 40, title: "Giảm 40% hóa đơn – Toini tài trợ" }, venueId: "v1", date: today, time: "22:00", pax: 4, name: "Park Ji-hoon", phone: "+821098765432", email: "jihoon@example.com", lang: "ko", status: "confirmed", createdAt: now - 3 * HOUR });
    c2.history.push({ at: now - 170 * MIN, by: "sky36.letan", action: "Đã xác nhận" });
    var r = mk({ code: "TN-F9W3", venueId: "v1", date: today, time: "23:00", pax: 10, name: "Li Wei", email: "liwei@example.com", lang: "zh", status: "rejected", createdAt: now - 4 * HOUR, reason: "Không phục vụ được số khách này" });
    r.history.push({ at: now - 230 * MIN, by: "sky36.letan", action: "Quán từ chối – Không phục vụ được số khách này" });
    mk({ code: "TN-G4P8", venueId: "v2", date: today, time: "18:30", pax: 2, name: "Trần Thu Hà", phone: "+84935111222", lang: "vi", status: "cancelled", createdAt: now - 5 * HOUR });
    mk({ code: "TN-H6T2", venueId: "v7", date: tm, time: "15:00", pax: 2, name: "Tanaka Yuki", email: "yuki.tanaka@example.com", lang: "ja", status: "confirmed", createdAt: now - 6 * HOUR });
    var a1 = mk({ code: "TN-J8N5", dealId: "d1", deal: { id: "d1", type: "pct", value: 40, title: "Giảm 40% hóa đơn – Toini tài trợ" }, venueId: "v1", date: y, time: "22:30", pax: 5, name: "Anna Ivanova", phone: "+79161234567", email: "anna.iv@example.com", lang: "ru", status: "arrived", createdAt: now - 26 * HOUR, arrivedAt: now - 22 * HOUR, arrivedBy: "khach", geo: true });
    a1.history.push({ at: now - 22 * HOUR, by: "Khách", action: "Tôi đã tới quán (có vị trí)" });
    var a2 = mk({ code: "TN-K2V7", venueId: "v4", date: y, time: "19:00", pax: 8, name: "Lê Văn Tài", phone: "+84914555666", lang: "vi", status: "billed", createdAt: now - 28 * HOUR, arrivedAt: now - 24 * HOUR, arrivedBy: "quan", invoice: { no: "HD-10293", amount: 3250000, pax: 8, photo: "", at: now - 21 * HOUR, by: "beman.thungan" } });
    a2.history.push({ at: now - 24 * HOUR, by: "beman.thungan", action: "Quán báo khách đã tới" }, { at: now - 21 * HOUR, by: "beman.thungan", action: "Nhập hóa đơn HD-10293 · 3.250.000đ" });
    var a3 = mk({ code: "TN-L5C1", venueId: "v7", date: y2, time: "16:00", pax: 2, name: "Sarah Lee", email: "sarah.lee@example.com", lang: "en", status: "billed", createdAt: now - 52 * HOUR, arrivedAt: now - 48 * HOUR, arrivedBy: "khach", invoice: { no: "GL-5521", amount: 1600000, pax: 2, photo: "", at: now - 46 * HOUR, by: "spa.letan" } });
    a3.history.push({ at: now - 46 * HOUR, by: "spa.letan", action: "Nhập hóa đơn GL-5521 · 1.600.000đ" });
    // đơn của khách mẫu John Smith – hiện sẵn trong “Đơn của tôi” trên web khách
    mk({ code: "TN-R2D5", venueId: "v6", date: tm, time: "15:00", pax: 2, name: "John Smith", phone: "+447700900123", email: "john@example.com", lang: "en", status: "pending", createdAt: now - 2 * MIN, note: "Couple massage, quiet room please" });
    var cx = mk({ code: "TN-Q4L9", venueId: "v2", date: y, time: "19:00", pax: 2, name: "John Smith", phone: "+447700900123", email: "john@example.com", lang: "en", status: "cancelled", createdAt: now - 30 * HOUR });
    cx.history.push({ at: now - 27 * HOUR, by: "Khách", action: "Đã hủy" });
    mk({ code: "TN-M3X9", venueId: "v5", date: y, time: "20:00", pax: 12, name: "Phạm Quốc Bảo", phone: "+84988777666", lang: "vi", status: "no_show", createdAt: now - 30 * HOUR });
    mk({ code: "TN-N7Q4", venueId: "v3", date: y, time: "21:00", pax: 3, name: "Mike Brown", email: "mike.b@example.com", lang: "en", status: "expired", createdAt: now - 27 * HOUR, lateAlerted: true });
    // kỳ trước đã chốt
    var bd = T.lastBoundary(now), pf = bd - 7 * DAY, pid = "K" + T.iso(bd).replace(/-/g, "");
    var old = [
      ["TN-P1A1", "v1", 9800000, 6], ["TN-P2B2", "v1", 14500000, 8], ["TN-P3C3", "v3", 2100000, 4], ["TN-P4D4", "v6", 1800000, 2], ["TN-P5E5", "v2", 3400000, 4], ["TN-P6F6", "v1", 4200000, 4]
    ].map(function (x, i) {
      var d = T.iso(bd - (2 + i) * DAY);
      var b = mk({ code: x[0], venueId: x[1], date: d, time: "21:00", pax: x[3], name: ["David Kim", "Choi Soo-a", "Tom Wilson", "Nguyễn Mai", "Olga Petrova", "John Smith"][i], email: i === 5 ? "john@example.com" : "khach" + (i + 1) + "@example.com", phone: i === 5 ? "+447700900123" : "", lang: ["ko", "ko", "en", "vi", "ru", "en"][i], status: "settled", createdAt: bd - (3 + i) * DAY, arrivedAt: bd - (2 + i) * DAY, arrivedBy: "khach", invoice: { no: "HD-" + (5000 + i), amount: x[2], pax: x[3], photo: "", at: bd - (2 + i) * DAY + 3 * HOUR, by: "Quán" }, reconciled: true, periodId: pid });
      if (i === 2) { b.dealId = "d2"; b.deal = { id: "d2", type: "amount", value: 100000, title: "Voucher 100K mỗi bàn" }; }
      if (i === 3) { b.dealId = "d3"; b.deal = { id: "d3", type: "pct", value: 30, title: "Giảm 30% liệu trình – Toini tài trợ" }; }
      b.invoice.sponsor = T.dealSponsor(b.deal, b.invoice.amount);
      b.commission = T.calcCommission(b); return b;
    });
    var lines = {}; old.forEach(function (b) { (lines[b.venueId] = lines[b.venueId] || { venueId: b.venueId, bookings: [], amount: 0, adj: [] }); lines[b.venueId].bookings.push(b.code); lines[b.venueId].amount += b.commission; });
    st.periods.push({ id: pid, from: pf, to: bd, closedAt: bd, due: bd + 7 * DAY, lines: Object.keys(lines).map(function (k) { return lines[k]; }) });
    st.payments.push({ id: "pay1", venueId: "v3", periodId: pid, amount: lines.v3.amount, at: bd + 2 * DAY, note: "CK Vietcombank", by: "Hà (Kế toán)" });
    st.payments.push({ id: "pay2", venueId: "v1", periodId: pid, amount: 2000000, at: bd + 3 * DAY, note: "CK một phần", by: "Hà (Kế toán)" });
    st.lastClose = bd;
    st.myCodes = ["TN-R2D5", "TN-C5Q1", "TN-Q4L9", "TN-P6F6"]; // các đơn đã đặt trên thiết bị này
    st.alerts = [];
    st.telegram.push({ id: "tg0", at: now - 3 * MIN, chat: "venue:v2", text: "🆕 ĐƠN MỚI · TN-B3M9\nNguyễn Hoàng Nam · 2 khách\n" + T.wd(today, "vi") + " " + T.dmy(today) + " lúc 19:30\nMở đơn: cong.toini.vn/don/TN-B3M9" });
    st.telegram.push({ id: "tg1", at: now - 16 * MIN, chat: "venue:v1", text: "🆕 ĐƠN MỚI · TN-A7K2\nKim Min-ji · 6 khách\n" + T.wd(today, "vi") + " " + T.dmy(today) + " lúc 21:00\nGhi chú: Sinh nhật bạn, xin bàn gần sân khấu\nMở đơn: cong.toini.vn/don/TN-A7K2" });
    st.audit.push({ id: "a0", at: now - 2 * DAY, actor: "Ngọc (Giám đốc)", entity: "Hoa hồng", entityId: "Sky36", action: "Thêm phiên bản tỷ lệ", before: "12% từ 01/10/2026", after: "15% từ 01/11/2026" });
    st.audit.push({ id: "a1", at: now - 3 * DAY, actor: "Vy (Sale/CSKH)", entity: "Tài khoản quán", entityId: "sky36.cu", action: "Khóa tài khoản", before: "Hoạt động", after: "Đã khóa" });
    st.audit.push({ id: "a2", at: now - 4 * DAY, actor: "Vy (Sale/CSKH)", entity: "Quán", entityId: "Sky36", action: "Duyệt bản dịch KO", before: "Bản nháp AI", after: "Đã duyệt" });
    st.bookings.sort(function (a, b) { return b.createdAt - a.createdAt; });
    return st;
  }

  /* ---------- UI dùng chung: toast, modal, demo panel ---------- */
  T.toast = function (html, kind, ms) {
    var box = document.getElementById("t-toasts");
    if (!box) { box = document.createElement("div"); box.id = "t-toasts"; document.body.appendChild(box); }
    var el = document.createElement("div"); el.className = "t-toast " + (kind || ""); el.innerHTML = html;
    box.appendChild(el); setTimeout(function () { el.classList.add("out"); setTimeout(function () { el.remove(); }, 400); }, ms || 4200);
  };
  /* hiện tin nhắn khách nhận được (mô phỏng điện thoại/hộp thư) */
  T.showDelivered = function (msgs) {
    msgs.forEach(function (m, i) {
      setTimeout(function () {
        var icon = m.ch === "Zalo ZNS" ? "💬" : m.ch === "SMS" ? "✉️" : m.ch === "Email" ? "📧" : "⛔";
        T.toast('<div class="t-sim">MÔ PHỎNG · ' + T.esc(m.ch) + (m.ok ? " → " + T.esc(m.to) : " · không gửi được") + '</div><div class="t-msg">' + icon + " " + T.esc(m.ok ? m.text : m.why) + "</div>", m.ok ? "msg" : "warn", 6500);
      }, i * 500);
    });
  };
  T.modal = function (title, bodyHtml, actions, opts) {
    T.closeModal();
    var w = document.createElement("div"); w.className = "t-modal-wrap" + (opts && opts.wide ? " wide" : ""); w.id = "t-modal";
    w.innerHTML = '<div class="t-modal" role="dialog" aria-modal="true" aria-label="' + T.esc(title) + '"><div class="t-modal-h"><b>' + T.esc(title) + '</b><button class="t-x" aria-label="Đóng" data-close>×</button></div><div class="t-modal-b">' + bodyHtml + '</div>' + (actions ? '<div class="t-modal-f">' + actions + "</div>" : "") + "</div>";
    w.addEventListener("click", function (e) { if (e.target === w || e.target.hasAttribute("data-close")) T.closeModal(); });
    document.body.appendChild(w); document.body.classList.add("t-noscroll");
    var f = w.querySelector("input,select,textarea,button.primary"); if (f && !(opts && opts.nofocus)) setTimeout(function () { f.focus(); }, 30);
    return w;
  };
  T.closeModal = function () { var m = document.getElementById("t-modal"); if (m) m.remove(); document.body.classList.remove("t-noscroll"); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") T.closeModal(); });
  T.ref = '<span class="t-ref" title="Giá trị tham khảo cho bản demo">* giá trị tham khảo</span>';

  T.demoPanel = function (app) {
    var root = app === "khach" ? "../" : "../";
    var btn = document.createElement("button"); btn.className = "t-demo-btn"; btn.type = "button"; btn.innerHTML = "⚙ Demo";
    btn.setAttribute("aria-label", "Mở bảng điều khiển demo");
    var pan = document.createElement("div"); pan.className = "t-demo"; pan.hidden = true;
    function render() {
      var s = T.state();
      pan.innerHTML = '<div class="t-demo-h"><b>Bảng điều khiển demo</b><button class="t-x" aria-label="Đóng">×</button></div>' +
        '<p class="t-demo-note">Bản mock: mọi dịch vụ ngoài là mô phỏng. Dữ liệu lưu trong trình duyệt, dùng chung cho 3 app.</p>' +
        '<div class="t-demo-row"><span>Giờ giả lập</span><b>' + T.dt(T.now()) + '</b></div>' +
        '<div class="t-demo-btns"><button data-sh="5">+5 phút</button><button data-sh="15">+15 phút</button><button data-sh="30">+30 phút</button><button data-sh="1440">+1 ngày</button><button data-sh="0">Về giờ thật</button></div>' +
        '<label class="t-demo-chk"><input type="checkbox" data-sim="znsFail"' + (s.sim.znsFail ? " checked" : "") + '> Giả lập Zalo ZNS lỗi (chuyển sang SMS)</label>' +
        '<label class="t-demo-chk"><input type="checkbox" data-sim="skipWindow"' + (s.sim.skipWindow ? " checked" : "") + '> Bỏ qua khung giờ khi bấm "Tôi đã tới quán"</label>' +
        '<div class="t-demo-btns"><button data-act="close">Chốt kỳ tuần ngay</button><button data-act="reset" class="danger">Khôi phục dữ liệu mẫu</button></div>' +
        '<div class="t-demo-links"><a href="' + root + 'khach/index.html">Web khách</a><a href="' + root + 'quan/index.html">Cổng quán</a><a href="' + root + 'quan-tri/index.html">Quản trị</a><a href="' + root + 'index.html">Hướng dẫn demo</a></div>';
    }
    pan.addEventListener("click", function (e) {
      var t = e.target;
      if (t.classList.contains("t-x")) { pan.hidden = true; return; }
      if (t.dataset.sh) { var m = +t.dataset.sh; if (m === 0) { T.state().clockOffset = 0; T.tick(true); T.save(); } else T.shiftClock(m * MIN); T.toast("Đã tua giờ giả lập tới <b>" + T.dt(T.now()) + "</b>"); render(); }
      if (t.dataset.act === "close") { var p = T.closePeriod(T.now(), "Demo"); T.save(); T.toast(p ? "Đã chốt kỳ " + p.id + " · " + p.lines.length + " quán" : "Kỳ này đã chốt rồi"); render(); }
      if (t.dataset.act === "reset" && confirm("Khôi phục toàn bộ dữ liệu mẫu? Các thao tác demo sẽ mất.")) { T.reset(); location.reload(); }
    });
    pan.addEventListener("change", function (e) { var k = e.target.dataset.sim; if (k) { T.state().sim[k] = e.target.checked; T.save(); } });
    btn.addEventListener("click", function () { pan.hidden = !pan.hidden; if (!pan.hidden) render(); });
    document.body.appendChild(btn); document.body.appendChild(pan);
  };

  /* chạy việc tự động mỗi 10 giây */
  T.startTicker = function () { T.tick(); setInterval(function () { T.tick(); }, 10000); };
})();
