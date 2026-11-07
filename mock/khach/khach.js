/* Web khách – Toini mock. Bố cục theo mock cũ, chức năng theo UC-K01 … UC-K10, ảnh thật + Google Maps. */
(function () {
  var esc = T.esc, I = window.TOINI_I18N, app = document.getElementById("app");
  var LANGS = [["vi", "Tiếng Việt", "VI"], ["en", "English", "EN"], ["ko", "한국어", "KO"], ["ru", "Русский", "RU"], ["zh", "中文", "ZH"], ["ja", "日本語", "JA"]];
  var CURS = ["VND", "USD", "KRW", "RUB", "CNY", "JPY"];
  var PREF = "toini-mock-khach-pref";
  var S = (function () { try { return JSON.parse(localStorage.getItem(PREF)) || null; } catch (e) { return null; } })();
  if (!S) { var bl = (navigator.language || "en").slice(0, 2); S = { lang: ["vi", "en", "ko", "ru", "zh", "ja"].indexOf(bl) >= 0 ? bl : "en", cur: "VND", mapV: "" }; }
  function saveS() { try { localStorage.setItem(PREF, JSON.stringify(S)); } catch (e) { } }

  /* chữ bổ sung cho bố cục mới [vi, en, ko, ru, zh, ja] */
  var X = {
    nav_home: ["Khám phá", "Discover", "둘러보기", "Обзор", "发现", "探す"],
    nav_explore: ["Quán", "Venues", "업체", "Заведения", "店铺", "お店"],
    nav_deals: ["Ưu đãi", "Deals", "혜택", "Акции", "优惠", "特典"],
    nav_map: ["Bản đồ", "Map", "지도", "Карта", "地图", "地図"],
    nav_my: ["Đơn của tôi", "My bookings", "내 예약", "Мои брони", "我的预订", "予約"],
    hero_l1: ["Tối ni", "Where to", "오늘 밤", "Куда", "今晚", "今夜は"],
    hero_l2: ["đi mô?", "tonight?", "어디 가?", "сегодня?", "去哪儿？", "どこへ？"],
    sticker: ["Không phí đặt bàn", "No booking fee", "예약 수수료 0원", "Без комиссии", "免预订费", "予約手数料0円"],
    go: ["Tìm", "Go", "검색", "Найти", "搜索", "検索"],
    open_n: ["quán nhận khách tối nay", "venues taking guests tonight", "곳 오늘 밤 예약 가능", "заведений принимают сегодня", "家今晚可订", "軒が今夜予約可"],
    st_langs: ["ngôn ngữ", "languages", "개 언어", "языков", "种语言", "言語"],
    st_min: ["phút để đặt bàn", "minute to book", "분이면 예약", "минута на бронь", "分钟完成预订", "分で予約"],
    deals_tonight: ["Ưu đãi tối nay", "Tonight's deals", "오늘 밤 혜택", "Акции сегодня", "今晚优惠", "今夜の特典"],
    deals_sub: ["Chỉ áp dụng khi đặt bàn qua Toini", "Only when you book via Toini", "Toini로 예약할 때만 적용", "Только при брони через Toini", "仅限通过Toini预订", "Toini経由の予約のみ"],
    live_now: ["Đang diễn ra", "Live now", "진행 중", "Сейчас", "进行中", "実施中"],
    starts_in: ["Bắt đầu sau", "Starts in", "시작까지", "Начнётся через", "距开始", "開始まで"],
    ends_in: ["Kết thúc sau", "Ends in", "종료까지", "До конца", "距结束", "終了まで"],
    by_area: ["Theo khu vực", "By area", "지역별", "По районам", "按区域", "エリア別"],
    all_venues: ["Tất cả quán", "All venues", "전체 업체", "Все заведения", "全部店铺", "すべてのお店"],
    see_all: ["Xem tất cả", "See all", "전체 보기", "Все", "查看全部", "すべて見る"],
    results: ["kết quả", "results", "개 결과", "результатов", "个结果", "件"],
    reset: ["Xóa lọc", "Reset", "초기화", "Сбросить", "重置", "リセット"],
    sort_rec: ["Gợi ý", "Recommended", "추천순", "Рекомендуемые", "推荐", "おすすめ"],
    sort_rate: ["Đánh giá cao", "Top rated", "평점순", "По рейтингу", "评分最高", "評価順"],
    sort_price: ["Giá thấp", "Lowest price", "가격 낮은순", "Дешевле", "价格最低", "安い順"],
    map_title: ["Bản đồ quán", "Venue map", "업체 지도", "Карта заведений", "店铺地图", "お店マップ"],
    map_sub: ["Chọn quán để xem vị trí trên Google Maps, gọi Grab hoặc chỉ đường.", "Pick a venue to see it on Google Maps, call a Grab or get directions.", "업체를 선택하면 구글 지도 위치, Grab 호출, 길찾기를 볼 수 있어요.", "Выберите заведение: Google Карты, Grab или маршрут.", "选择店铺，在谷歌地图查看位置、叫Grab或导航。", "お店を選ぶとGoogleマップ・Grab・経路が見られます。"],
    deals_page_sub: ["Ưu đãi của các quán khi đặt bàn qua Toini. Đưa màn hình ưu đãi cho nhân viên khi tới quán.", "Venue deals when you book via Toini. Show the deal screen to staff when you arrive.", "Toini 예약 시 업체 혜택. 도착하면 혜택 화면을 직원에게 보여주세요.", "Акции при брони через Toini. Покажите экран акции персоналу.", "通过Toini预订可享店铺优惠，到店出示优惠页面。", "Toini予約時の特典。来店時に特典画面を見せてください。"],
    today: ["Hôm nay", "Today", "오늘", "Сегодня", "今天", "今日"],
    every_day: ["Mọi ngày", "Every day", "매일", "Каждый день", "每天", "毎日"],
    upcoming: ["Sắp tới", "Upcoming", "예정", "Предстоящие", "即将到来", "これから"],
    past: ["Đã qua", "Past", "지난 예약", "Прошедшие", "已结束", "過去"],
    my_empty: ["Chưa có đơn nào trên thiết bị này.", "No bookings on this device yet.", "이 기기에 예약이 없습니다.", "На этом устройстве броней нет.", "此设备上暂无预订。", "この端末に予約はありません。"],
    lookup_sub: ["Đặt trên thiết bị khác? Nhập mã đặt chỗ và SĐT/email đã dùng.", "Booked on another device? Enter the code and the phone/email you used.", "다른 기기에서 예약했나요? 예약번호와 연락처를 입력하세요.", "Бронировали с другого устройства? Введите код и телефон/email.", "在其他设备预订？输入预订码和所用电话/邮箱。", "別の端末で予約？予約番号と電話/メールを入力。"],
    step_when: ["Thời gian", "When", "날짜·시간", "Когда", "时间", "日時"],
    step_contact: ["Liên hệ", "Contact", "연락처", "Контакты", "联系方式", "連絡先"],
    step_verify: ["Xác minh", "Verify", "인증", "Подтверждение", "验证", "認証"],
    next: ["Tiếp tục", "Next", "다음", "Далее", "下一步", "次へ"],
    optional: ["không bắt buộc", "optional", "선택", "необязательно", "选填", "任意"],
    done: ["Đã gửi yêu cầu!", "Request sent!", "예약 요청 완료!", "Заявка отправлена!", "已提交预订！", "リクエスト送信！"],
    done_sub: ["Đang chờ quán xác nhận, thường trong 15 phút.", "Waiting for the venue – usually within 15 minutes.", "업체 확인 대기 중 (보통 15분 이내).", "Ждём подтверждения (обычно до 15 минут).", "等待店家确认（通常15分钟内）。", "店舗の確認待ち（通常15分以内）。"],
    view_bk: ["Xem đơn", "View booking", "예약 보기", "Открыть бронь", "查看预订", "予約を見る"],
    nt_title: ["Bạn sẽ biết kết quả qua:", "You'll hear back via:", "결과 안내 방법:", "Результат придёт через:", "您将通过以下方式获知结果：", "結果のお知らせ方法："],
    nt_page: ["Trang đơn này – luôn cập nhật, tự kiểm tra bất cứ lúc nào", "This booking page – always up to date", "이 예약 페이지 – 언제든 확인 가능", "Эта страница брони – всегда актуальна", "本预订页面（随时可查）", "この予約ページ（いつでも確認可）"],
    reply_in: ["Quán phản hồi trong", "Venue replies within", "업체 응답까지", "Ответ заведения через", "店家回复剩余", "店舗の返答まで"],
    deal_on: ["Mở màn hình ưu đãi", "Show my deal", "혜택 화면 열기", "Показать акцию", "打开优惠页面", "特典画面を開く"],
    close: ["Đóng", "Close", "닫기", "Закрыть", "关闭", "閉じる"],
    lang_t: ["Ngôn ngữ", "Language", "언어", "Язык", "语言", "言語"],
    cur_t: ["Loại tiền", "Currency", "통화", "Валюта", "货币", "通貨"],
    chat_t: ["Nhắn Toini", "Chat", "채팅", "Чат", "联系", "チャット"],
    f_help: ["Hỗ trợ", "Help", "도움말", "Помощь", "帮助", "ヘルプ"],
    f_legal: ["Pháp lý", "Legal", "법적 고지", "Правовая информация", "法律", "法的情報"],
    terms: ["Điều khoản · Chính sách", "Terms · Privacy", "이용약관 · 개인정보", "Условия · Конфиденциальность", "条款 · 隐私", "規約・プライバシー"],
    alts: ["Quán tương tự còn nhận khách", "Similar venues taking guests", "예약 가능한 비슷한 업체", "Похожие заведения с местами", "可预订的类似店铺", "予約可能な似たお店"],
    photos_t: ["ảnh", "photos", "장", "фото", "张", "枚"],
    nav_events: ["Sự kiện", "Events", "이벤트", "События", "活动", "イベント"],
    super_t: ["Deal siêu hời", "Super deals", "초특가 딜", "Супер-скидки", "超值优惠", "スーパーディール"],
    super_sub: ["Toini tài trợ – chỉ có khi đặt bàn qua Toini", "Sponsored by Toini – only when you book via Toini", "Toini 후원 – Toini 예약 시에만", "За счёт Toini – только при брони через Toini", "由Toini补贴，仅限通过Toini预订", "Toini負担 – Toini予約限定"],
    by_toini: ["Toini tài trợ", "Sponsored by Toini", "Toini 후원", "За счёт Toini", "Toini补贴", "Toini負担"],
    book_deal: ["Đặt bàn với deal này", "Book with this deal", "이 딜로 예약", "Бронь со скидкой", "使用此优惠预订", "このディールで予約"],
    slots_left: ["Còn {n} suất", "{n} left", "{n}개 남음", "Осталось {n}", "剩余{n}份", "残り{n}"],
    ev_sub: ["Nhạc sống, DJ, chiếu bóng đá… Chọn sự kiện và đặt bàn đúng tối đó.", "Live music, DJs, football screenings… Pick an event and book for that night.", "라이브 음악, DJ, 축구 중계… 이벤트를 고르고 그날 밤으로 예약하세요.", "Живая музыка, DJ, футбол… Выберите событие и бронируйте на этот вечер.", "现场音乐、DJ、足球直播……选择活动并预订当晚。", "ライブ、DJ、サッカー観戦…イベントを選んでその夜を予約。"],
    ev_tonight: ["Sự kiện tối nay", "Tonight's events", "오늘 밤 이벤트", "События сегодня", "今晚活动", "今夜のイベント"],
    tomorrow: ["Ngày mai", "Tomorrow", "내일", "Завтра", "明天", "明日"],
    week: ["7 ngày tới", "Next 7 days", "7일 이내", "7 дней", "未来7天", "7日間"],
    month: ["Lịch tháng", "Month", "월간", "Месяц", "月历", "月間"],
    book_event: ["Đặt bàn cho sự kiện", "Book for this event", "이벤트 예약", "Бронь на событие", "预订此活动", "イベントを予約"],
    no_events: ["Không có sự kiện.", "No events.", "이벤트가 없습니다.", "Нет событий.", "暂无活动。", "イベントはありません。"],
    upcoming_ev: ["Sự kiện sắp tới", "Upcoming events", "예정 이벤트", "Скоро", "即将举行", "今後のイベント"],
    reviews_t: ["Đánh giá", "Reviews", "리뷰", "Отзывы", "评价", "レビュー"],
    reviews_note: ["Chỉ khách đã tới quán qua Toini mới được đánh giá; Toini duyệt trước khi hiển thị.", "Only guests who visited via Toini can review; Toini moderates before publishing.", "Toini로 방문한 고객만 리뷰 가능, 게시 전 Toini 검토.", "Отзыв могут оставить только гости, пришедшие через Toini; модерация Toini.", "仅通过Toini到店的顾客可评价，Toini审核后发布。", "Toini経由で来店した方のみ投稿可。Toiniが確認後に公開。"],
    no_reviews: ["Chưa có đánh giá.", "No reviews yet.", "아직 리뷰가 없습니다.", "Пока нет отзывов.", "暂无评价。", "まだレビューはありません。"],
    write_review: ["Đánh giá trải nghiệm", "Rate your visit", "방문 리뷰 쓰기", "Оценить визит", "评价本次体验", "来店を評価"],
    rv_stars: ["Bạn chấm mấy sao?", "How many stars?", "별점을 선택하세요", "Сколько звёзд?", "几颗星？", "星の数"],
    rv_text: ["Cảm nhận của bạn", "Your review", "후기", "Ваш отзыв", "您的评价", "レビュー"],
    rv_photos: ["Ảnh (tối đa 3)", "Photos (up to 3)", "사진 (최대 3장)", "Фото (до 3)", "照片（最多3张）", "写真（最大3枚）"],
    rv_send: ["Gửi đánh giá", "Submit review", "리뷰 보내기", "Отправить", "提交评价", "送信"],
    rv_pending: ["Đánh giá đã gửi – chờ Toini duyệt", "Review sent – awaiting Toini approval", "리뷰 전송됨 – Toini 검토 중", "Отзыв отправлен – на модерации", "评价已提交，待Toini审核", "送信済み – 確認待ち"],
    rv_ok: ["Đánh giá của bạn đã được đăng", "Your review is published", "리뷰가 게시되었습니다", "Отзыв опубликован", "评价已发布", "レビューが公開されました"],
    rv_no: ["Đánh giá không được duyệt", "Review not approved", "리뷰가 승인되지 않았습니다", "Отзыв отклонён", "评价未通过", "レビューは承認されませんでした"],
    deal_none: ["Không dùng deal", "No deal", "딜 사용 안 함", "Без скидки", "不使用优惠", "使用しない"],
    for_event: ["Đặt cho sự kiện", "Booking for event", "이벤트 예약", "Бронь на событие", "活动预订", "イベント予約"],
    super_pick: ["Deal siêu hời áp dụng cho đơn", "Super deal for this booking", "이 예약에 적용할 딜", "Скидка для брони", "本次预订适用的优惠", "この予約のディール"],
    ended_today: ["Đã kết thúc hôm nay", "Ended today", "오늘 종료", "Сегодня завершено", "今日已结束", "本日終了"],
    near_title: ["Quán gần bạn", "Venues near you", "내 주변 업체", "Рядом с вами", "附近的店", "近くのお店"],
    near_sub: ["Chưa biết đi đâu? Chọn vị trí của bạn, Toini hiện các quán quanh đó. Bấm vào ghim để xem nhanh quán.", "No plan yet? Set where you are and see what's around. Tap a pin for a quick look.", "아직 계획이 없나요? 위치를 정하면 주변 업체를 보여드려요. 핀을 눌러 미리보기.", "Нет планов? Укажите, где вы, и смотрите, что рядом. Нажмите на метку.", "还没想好？设置位置，看看附近有什么。点击图钉快速查看。", "まだ決めていない？現在地を設定して周辺を探そう。ピンをタップで概要。"],
    use_gps: ["Dùng vị trí của tôi", "Use my location", "내 위치 사용", "Моё местоположение", "使用我的位置", "現在地を使う"],
    tap_map: ["Hoặc chạm lên bản đồ / kéo chấm tím để đặt vị trí.", "Or tap the map / drag the purple dot to set your spot.", "또는 지도를 탭하거나 보라색 점을 끌어 위치를 지정하세요.", "Или нажмите на карту / перетащите фиолетовую точку.", "或点击地图 / 拖动紫色圆点设置位置。", "地図をタップ / 紫の点をドラッグして位置を設定。"],
    you_here: ["Bạn ở đây", "You are here", "현재 위치", "Вы здесь", "您在这里", "現在地"],
    view_venue: ["Xem quán", "View venue", "업체 보기", "Открыть", "查看店铺", "お店を見る"],
    fit_all: ["Tất cả quán", "All venues", "전체 업체", "Все", "全部店铺", "全店"],
    nearest: ["Gần bạn nhất", "Nearest to you", "가까운 순", "Ближайшие", "离您最近", "近い順"],
    gps_ask: ["Cho phép Toini dùng vị trí của bạn một lần để tìm quán gần bạn. Vị trí chỉ dùng trên thiết bị này, không lưu lại.", "Allow Toini to use your location once to find venues nearby. It stays on this device and is not stored.", "주변 업체를 찾기 위해 위치를 한 번 사용하도록 허용할까요? 이 기기에서만 쓰이며 저장되지 않습니다.", "Разрешить Toini один раз использовать ваше местоположение? Оно не сохраняется.", "允许Toini使用一次您的位置以查找附近店铺？位置不会被保存。", "近くのお店を探すため現在地を一度だけ使いますか？保存はされません。"],
    allow: ["Cho phép", "Allow", "허용", "Разрешить", "允许", "許可"],
    gps_far: ["Bạn đang ở xa Đà Nẵng – bản demo giữ vị trí mẫu. Hãy chọn điểm hoặc chạm lên bản đồ.", "You seem far from Da Nang – the demo keeps the sample spot. Pick a spot or tap the map.", "다낭에서 멀리 있어요 – 데모는 샘플 위치를 유지합니다.", "Вы далеко от Дананга – в демо остаётся пример.", "您似乎不在岘港 – 演示保留示例位置。", "ダナンから離れています – デモはサンプル位置のままです。"],
    gps_fail: ["Không lấy được vị trí – hãy chọn điểm hoặc chạm lên bản đồ.", "Couldn't get your location – pick a spot or tap the map.", "위치를 가져오지 못했어요 – 지도에서 선택하세요.", "Не удалось определить местоположение – выберите на карте.", "无法获取位置 – 请在地图上选择。", "現在地を取得できません – 地図で選んでください。"],
    map_off: ["Không tải được bản đồ (cần kết nối mạng).", "The map couldn't load (internet needed).", "지도를 불러오지 못했어요 (인터넷 필요).", "Карта не загрузилась (нужен интернет).", "地图加载失败（需要网络）。", "地図を読み込めません（ネット接続が必要）。"]
  };
  var LI = { vi: 0, en: 1, ko: 2, ru: 3, zh: 4, ja: 5 };
  function t(k) { if (X[k]) return X[k][LI[S.lang]] || X[k][1]; var o = I.t[k]; if (!o) return k; var ov = (T.state().uiOverrides || {})[k]; if (ov && ov[S.lang]) return ov[S.lang]; return o[S.lang] || o.en || o.vi; }
  function typeName(k) { var o = T.state().types[k]; return o ? (o[S.lang] || o.en) : k; }
  function tagName(k) { var o = I.tags[k]; return o ? (o[S.lang] || o.en) : k; }
  function content(trObj, f) {
    var x = trObj[S.lang]; if (x && x.status === "approved" && x[f]) return { text: x[f], fb: false };
    var en = trObj.en; if (en && en.status === "approved" && en[f]) return { text: en[f], fb: S.lang !== "en" };
    return { text: (trObj.vi || {})[f] || "", fb: true };
  }
  function money(vnd) {
    var r = T.state().settings.rates, s = T.vnd(vnd); if (S.cur === "VND" || !vnd) return s;
    var v = vnd / r[S.cur], sym = { USD: "$", KRW: "₩", RUB: "₽", CNY: "¥", JPY: "¥" }[S.cur];
    return "≈ " + sym + (S.cur === "USD" || S.cur === "CNY" ? v.toFixed(2) : Math.round(v).toLocaleString());
  }
  function img(p) { return /^data:/.test(p) ? p : "../assets/img/" + p; }
  function V() { return T.state().venues.filter(function (v) { return v.visible; }); }
  function openTonight(v) { return T.isOpenNight(v.id, T.today()); }
  function isMobile() { return window.matchMedia("(pointer:coarse)").matches || window.innerWidth < 900; }
  function lvl(p) { return '<span style="font-weight:800;color:var(--ink)">' + "₫₫₫₫".slice(0, p) + '</span><span style="opacity:.3">' + "₫₫₫₫".slice(p) + "</span>"; }
  function dur(ms) { ms = Math.max(0, ms); var h = Math.floor(ms / 3600000), m = Math.floor(ms % 3600000 / 60000), s = Math.floor(ms % 60000 / 1000); return (h ? h + ":" + T.pad(m) : m) + ":" + T.pad(s); }
  function at(hhmm) { var d = new Date(T.now()); var p = hhmm.split(":"); d.setHours(+p[0], +p[1], 0, 0); return d.getTime(); }
  /* trạng thái ưu đãi trong ngày */
  /* trạng thái ưu đãi hôm nay; hỗ trợ khung qua nửa đêm (vd 20:00–02:00) */
  function offerState(o) {
    if (!o.active || o.until < T.today()) return null;
    var n = T.now(), dow = new Date(n).getDay(), a = at(o.from), b = at(o.to), cross = b <= a;
    if (cross && n < b && o.days.indexOf((dow + 6) % 7) >= 0) return { live: true, ms: b - n }; // khung của tối qua còn chạy
    if (o.days.indexOf(dow) < 0) return null;
    if (cross) b += T.DAY;
    if (n >= b) return { ended: true };
    return n >= a ? { live: true, ms: b - n } : { live: false, ms: a - n };
  }
  function stRank(s) { return !s ? 9 : s.live ? 0 : s.ended ? 2 : 1; }
  function bestOffer(v) { var os = T.offersOf(v.id, true); return os.filter(function (o) { var s = offerState(o); return s && !s.ended; })[0] || os[0]; }
  function wdLong(iso) { return new Intl.DateTimeFormat({ vi: "vi-VN", en: "en-GB", ko: "ko-KR", ru: "ru-RU", zh: "zh-CN", ja: "ja-JP" }[S.lang], { weekday: "short", day: "numeric", month: "short" }).format(new Date(iso + "T12:00")); }
  var REF = '<p class="small muted" style="margin-top:14px">' + T.ref + " Giá, ưu đãi, đánh giá trên bản mock là giá trị tham khảo.</p>";
  function icon(n) {
    var P = { home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', ev: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', deal: '<path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.5"/>', map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>', tk: '<path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3z"/><path d="M14 4v12" stroke-dasharray="2 2"/>' };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + P[n] + "</svg>";
  }

  /* ---------- khung trang ---------- */
  var NAV = [["#/", "nav_home", "home"], ["#/explore", "nav_explore", "search"], ["#/events", "nav_events", "ev"], ["#/map", "nav_map", "map"], ["#/my", "nav_my", "tk"]];
  function chrome(inner) {
    var r = (location.hash.split("?")[0].split("/")[1]) || "";
    var on = function (n) { return ("#/" + r) === n[0] || (r === "" && n[0] === "#/") || (r === "v" && n[0] === "#/explore") || (r === "b" && n[0] === "#/my"); };
    var l = LANGS.filter(function (x) { return x[0] === S.lang; })[0];
    document.documentElement.lang = S.lang;
    app.innerHTML = '<div class="mockbar"><div class="wrap"><span><span class="dot"></span>BẢN MOCK · dữ liệu mẫu, dịch vụ ngoài là mô phỏng</span></div></div>' +
      '<header class="top"><div class="wrap"><a class="logo" href="#/">toin<i>i</i><small>ĐÀ NẴNG</small></a><nav class="dnav">' + NAV.map(function (n) { return '<a href="' + n[0] + '" class="' + (on(n) ? "on" : "") + '">' + esc(t(n[1])) + "</a>"; }).join("") +
      '</nav><div class="tools"><button class="pill" id="langBtn" aria-label="' + esc(t("lang_t")) + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>' + l[2] + '</button><button class="pill" id="curBtn" aria-label="' + esc(t("cur_t")) + '">' + S.cur + "</button></div></div></header>" +
      "<main>" + inner + "</main>" +
      '<footer><div class="wrap fgrid"><div><a class="logo" href="#/">toin<i>i</i></a><p>' + esc(t("sub")) + '</p><p class="small">' + esc(t("rateNote")) + " " + esc(T.state().settings.rates.at) + "</p></div>" +
      "<div><h5>" + esc(t("nav_home")) + '</h5><a href="#/explore">' + esc(t("all_venues")) + '</a><a href="#/deals">' + esc(t("nav_deals")) + '</a><a href="#/events">' + esc(t("nav_events")) + '</a><a href="#/map">' + esc(t("nav_map")) + "</a></div>" +
      "<div><h5>" + esc(t("f_help")) + '</h5><a href="#/my">' + esc(t("nav_my")) + '</a><a href="#/my">' + esc(t("lookup")) + '</a><a href="#" data-chat>' + esc(t("chat")) + "</a></div>" +
      "<div><h5>" + esc(t("f_legal")) + '</h5><a href="#" data-terms>' + esc(t("terms")) + "</a><p>© 2026 Toini</p></div></div></footer>" +
      '<nav class="tabbar" aria-label="Menu">' + NAV.map(function (n) { return '<a href="' + n[0] + '" class="' + (on(n) ? "on" : "") + '">' + icon(n[2]) + "<span>" + esc(t(n[1])) + "</span></a>"; }).join("") + "</nav>" +
      '<button class="mo-fab" data-chat aria-label="' + esc(t("chat")) + '"><span class="face">💬</span><span class="tx">' + esc(t("chat_t")) + "</span></button>" +
      '<div class="backdrop" id="bd"></div><div class="sheet" id="sheet" role="dialog" aria-modal="true"></div>';
  }

  /* ---------- thẻ ---------- */
  function vcard(v) {
    var op = openTonight(v), o = bestOffer(v);
    return '<a class="vcard" href="#/v/' + v.slug + '"><div class="art"><img loading="lazy" src="' + img(v.imgs[0]) + '" alt="' + esc(v.name) + '"><span class="word">' + esc(v.name) + '</span><div class="tl"><span class="tag ink">' + T.state().types[v.type].icon + " " + esc(typeName(v.type)) + '</span></div><div class="tr"><span class="cnt">📷 ' + v.imgs.length + "</span></div></div>" +
      '<div class="body"><h3>' + esc(v.name) + '</h3><div class="meta">' + ratingHtml(v) + "<span>·</span><span>" + esc(v.area) + "</span><span>·</span>" + lvl(v.price) + "</div>" +
      (activeSuper(v)[0] ? '<div class="deal super"><span>⚡</span><span>' + esc(content(activeSuper(v)[0].tr, "title").text) + "</span></div>" : o ? '<div class="deal"><span>🎁</span><span>' + esc(content(o.tr, "title").text) + "</span></div>" : "") +
      '<div class="foot"><span class="avail' + (op ? "" : " full") + '"><i></i>' + esc(op ? t("open") : t("closed")) + '</span><span class="small muted">' + esc(t("from")) + ' <span class="price">' + money(v.priceFrom) + "</span></span></div></div></a>";
  }
  function gcard(o) {
    var v = T.venue(o.venueId), st = offerState(o) || {}, c = content(o.tr, "title");
    var days = o.days.length === 7 ? t("every_day") : o.days.map(function (d) { return T.wd(T.addDays("2026-11-01", d), S.lang); }).join(" · ");
    return '<a class="gcard' + (st.ended ? " ended" : "") + '" href="#/v/' + v.slug + '"><img class="bgimg" src="' + img(v.imgs[0]) + '" alt=""><div class="in"><div class="row">' + (st.live ? '<span class="live">' + esc(t("live_now")) + "</span>" : st.ended ? '<span class="tag">' + esc(t("ended_today")) + "</span>" : st.ms ? '<span class="tag lime">' + esc(t("starts_in")) + " " + esc(o.from) + "</span>" : '<span class="tag lime">' + esc(days) + "</span>") + '<span class="tag">' + esc(typeName(v.type)) + "</span></div><h3>" + esc(c.text) + "</h3><p>" + esc(v.name) + " · " + esc(v.area) + " · " + esc(o.from + "–" + o.to) + '</p><p class="small">' + esc(content(o.tr, "cond").text) + "</p>" +
      '<div class="row" style="margin-top:auto"><div>' + (st.ms ? '<div class="small" style="color:#bdb5a6">' + esc(st.live ? t("ends_in") : t("starts_in")) + '</div><div class="count" data-cd="' + o.id + '">' + dur(st.ms) + "</div>" : "") + '</div><span class="btn sm lime">' + esc(t("book")) + " →</span></div></div></a>";
  }

  /* ---------- UC-K02 Khám phá ---------- */
  function vHome() {
    var vs = V(), openN = vs.filter(openTonight).length;
    var tonight = []; vs.forEach(function (v) { T.offersOf(v.id, true).forEach(function (o) { var s = offerState(o); if (s && !s.ended) tonight.push(o); }); });
    tonight.sort(function (a, b) { var sa = offerState(a), sb = offerState(b); return (sb.live ? 1 : 0) - (sa.live ? 1 : 0) || sa.ms - sb.ms; });
    var wd = new Intl.DateTimeFormat({ vi: "vi-VN", en: "en-GB", ko: "ko-KR", ru: "ru-RU", zh: "zh-CN", ja: "ja-JP" }[S.lang], { weekday: "long", day: "numeric", month: "long" }).format(new Date(T.now()));
    var mq = [t("deals_tonight"), t("noFee"), "Bar · Rooftop · Club · Karaoke · Spa", t("near_title")];
    var mqs = mq.concat(mq).map(function (x) { return "<span>★ " + esc(x) + "</span>"; }).join("");
    var areas = T.state().areas.filter(function (a) { return vs.some(function (v) { return v.area === a; }); });
    var stack = vs.slice(0, 3);
    chrome('<section class="hero"><div class="wrap" style="position:relative"><div class="sticker">' + esc(t("sticker")) + '</div><div class="hstack">' + stack.map(vcard).join("") + "</div>" +
      '<span class="when"><b></b>' + esc(wd) + ' · <span data-clock>' + T.hm(T.now()) + "</span></span>" +
      '<h1 class="h-d"><span>' + esc(t("hero_l1")) + "</span><span><em>" + esc(t("hero_l2")) + '</em></span></h1><p class="lead">' + esc(t("sub")) + "</p>" +
      '<form class="search" id="hs"><span>🔎</span><input name="q" placeholder="' + esc(t("search")) + '" autocomplete="off" aria-label="' + esc(t("search")) + '"><button class="btn" type="submit">' + esc(t("go")) + "</button></form>" +
      '<div class="chips" style="margin-top:14px">' + areas.map(function (a) { return '<a class="chip" href="#/explore?area=' + encodeURIComponent(a) + '">📍 ' + esc(a) + "</a>"; }).join("") + Object.keys(T.state().types).map(function (k) { return '<a class="chip" href="#/explore?type=' + k + '">' + T.state().types[k].icon + " " + esc(typeName(k)) + "</a>"; }).join("") + "</div>" +
      '<div class="stats"><span><b>' + openN + "</b>" + esc(t("open_n")) + "</span><span><b>1</b>" + esc(t("st_min")) + "</span></div></div></section>" +
      '<div class="marquee"><div>' + mqs + "</div></div><div class=\"wrap\">" +
      (tonight.length ? '<section class="sec"><div class="sec-h"><div><h2 class="h-d">⏰ ' + esc(t("deals_tonight")) + "</h2><p>" + esc(t("deals_sub")) + '</p></div><a href="#/deals">' + esc(t("see_all")) + ' →</a></div><div class="rail">' + tonight.map(gcard).join("") + "</div></section>" : "") +
      (supersAll().length ? '<section class="sec"><div class="sec-h"><div><h2 class="h-d">⚡ ' + esc(t("super_t")) + "</h2><p>" + esc(t("super_sub")) + '</p></div><a href="#/deals">' + esc(t("see_all")) + ' →</a></div><div class="rail">' + supersAll().map(scard).join("") + "</div></section>" : "") +
      (eventsOn(T.today()).length ? '<section class="sec"><div class="sec-h"><div><h2 class="h-d">🎶 ' + esc(t("ev_tonight")) + "</h2><p>" + esc(t("ev_sub")) + '</p></div><a href="#/events">' + esc(t("see_all")) + ' →</a></div><div class="egrid">' + eventsOn(T.today()).map(ecard).join("") + "</div></section>" : "") +
      '<section class="sec"><div class="sec-h"><div><h2 class="h-d">📍 ' + esc(t("by_area")) + '</h2></div></div><div class="areas">' + areas.map(function (a) {
        var list = vs.filter(function (v) { return v.area === a; });
        return '<a class="area" href="#/explore?area=' + encodeURIComponent(a) + '"><img loading="lazy" src="' + img(list[0].imgs[0]) + '" alt=""><span>' + list.length + " " + esc(t("venues")) + "</span><b>" + esc(a) + "</b></a>";
      }).join("") + "</div></section>" +
      '<section class="sec"><div class="sec-h"><div><h2 class="h-d">' + esc(t("all_venues")) + '</h2></div><a href="#/explore">' + esc(t("see_all")) + ' →</a></div><div class="grid">' + vs.map(vcard).join("") + "</div></section>" + REF + "</div>");
    document.getElementById("hs").addEventListener("submit", function (e) { e.preventDefault(); location.hash = "#/explore?q=" + encodeURIComponent(new FormData(e.target).get("q")); });
  }

  /* ---------- UC-K02 danh sách + bộ lọc ---------- */
  var F = { q: "", area: "", type: "", price: 0, open: 0, tags: [], sort: "rec" };
  function vExplore(qs) {
    if (qs !== undefined) { F = { q: "", area: "", type: "", price: 0, open: 0, tags: [], sort: "rec" }; (qs || "").split("&").forEach(function (p) { var kv = p.split("="); if (kv[0] === "tags") F.tags = decodeURIComponent(kv[1] || "").split(",").filter(Boolean); else if (kv[0] in F) F[kv[0]] = kv[0] === "price" || kv[0] === "open" ? +kv[1] : decodeURIComponent(kv[1] || ""); }); }
    var ch = function (k, val, lbl) { return '<button class="chip' + (F[k] === val ? " on" : "") + '" data-f="' + k + '" data-v="' + esc(val) + '">' + esc(lbl) + "</button>"; };
    var st = T.state();
    chrome('<div class="wrap"><div class="ptitle"><h1 class="h-d">' + esc(t("all_venues")) + '</h1></div><div class="fbar"><form class="search" id="es"><span>🔎</span><input name="q" value="' + esc(F.q) + '" placeholder="' + esc(t("search")) + '" autocomplete="off" aria-label="' + esc(t("search")) + '"></form>' +
      '<div class="fgroup">' + ch("area", "", "📍 " + t("all")) + st.areas.filter(function (a) { return V().some(function (v) { return v.area === a; }); }).map(function (a) { return ch("area", a, a); }).join("") + '<span class="sep"></span>' + ch("type", "", t("all")) + Object.keys(st.types).map(function (k) { return ch("type", k, st.types[k].icon + " " + typeName(k)); }).join("") + "</div>" +
      '<div class="fgroup">' + [0, 1, 2, 3, 4].map(function (p) { return '<button class="chip' + (F.price === p ? " on" : "") + '" data-f="price" data-v="' + p + '">' + (p ? "₫₫₫₫".slice(0, p) : esc(t("price")) + ": " + esc(t("all"))) + "</button>"; }).join("") + '<span class="sep"></span><button class="chip' + (F.open ? " on" : "") + '" data-f="open" data-v="' + (F.open ? 0 : 1) + '">✅ ' + esc(t("openOnly")) + '</button></div>' + '<div class="fgroup"><span class="flbl">' + esc(t("tagsTitle")) + "</span>" + Object.keys(I.tags).map(function (k) { return '<button class="chip' + (F.tags.indexOf(k) >= 0 ? " on" : "") + '" data-tag="' + k + '">' + esc(tagName(k)) + "</button>"; }).join("") + '</div></div><div id="eres"></div>' + REF + "</div>");
    results();
    var inp = document.querySelector("#es input");
    inp.addEventListener("input", function () { F.q = inp.value; results(); });
    document.getElementById("es").addEventListener("submit", function (e) { e.preventDefault(); });
  }
  function results() {
    var q = F.q.trim().toLowerCase();
    var list = V().filter(function (v) {
      return (!F.area || v.area === F.area) && (!F.type || v.type === F.type) && (!F.price || v.price === F.price) && (!F.open || openTonight(v)) && F.tags.every(function (k) { return v.tags.indexOf(k) >= 0; }) && (!q || (v.name + " " + v.area + " " + typeName(v.type)).toLowerCase().indexOf(q) >= 0);
    });
    if (F.sort === "rate") list.sort(function (a, b) { return b.rating - a.rating; });
    if (F.sort === "price") list.sort(function (a, b) { return a.priceFrom - b.priceFrom; });
    var any = F.q || F.area || F.type || F.price || F.open || F.tags.length;
    document.getElementById("eres").innerHTML = '<div class="rbar"><b>' + list.length + " " + esc(t("results")) + "</b>" + (any ? '<button class="linkbtn" id="freset">' + esc(t("reset")) + "</button>" : "") + '<select id="fsort" aria-label="Sort"><option value="rec">' + esc(t("sort_rec")) + '</option><option value="rate">' + esc(t("sort_rate")) + '</option><option value="price">' + esc(t("sort_price")) + "</option></select></div>" +
      (list.length ? '<div class="grid">' + list.map(vcard).join("") + "</div>" : '<div class="empty">' + esc(t("noResult")) + "</div>");
    document.getElementById("fsort").value = F.sort;
  }

  /* ---------- UC-K03 trang quán + UC-K04 Grab / chỉ đường ---------- */
  function vVenue(slug) {
    var v = T.venue(slug); if (!v || !v.visible) return notFound();
    var op = openTonight(v), d = content(v.tr, "desc"), offs = T.offersOf(v.id, true);
    var facts = [["hours", v.hours], ["entry", v.entry ? money(v.entry) : esc(t("free"))], ["minSpend", v.minSpend ? money(v.minSpend) : esc(t("none"))], ["from", money(v.priceFrom) + ' <span class="small muted">/ ' + esc(v.priceUnit) + "</span>"], ["tax", esc(v.taxNote)], ["dress", esc(v.dress)], ["age", v.age ? v.age + "+" : esc(t("noAge"))]];
    var gm = "https://www.google.com/maps/dir/?api=1&destination=" + v.lat + "," + v.lng;
    document.body.classList.add("has-sticky", "sb");
    chrome('<section class="vhero"><div class="art" data-lb="0" role="button" aria-label="' + esc(t("viewAll")) + '"><img src="' + img(v.imgs[0]) + '" alt="' + esc(v.name) + '"><span class="word">' + esc(v.name) + '</span><div class="tl"><a class="tag" href="#/explore">← ' + esc(t("all_venues")) + '</a></div></div>' +
      '<div class="gal">' + v.imgs.slice(1, 4).map(function (p, i) { return '<button class="th" data-lb="' + (i + 1) + '" aria-label="Ảnh ' + (i + 2) + '"><img src="' + img(p) + '" alt=""></button>'; }).join("") + '<button class="more" data-lb="0">▦ ' + v.imgs.length + " " + esc(t("photos_t")) + "</button></div></section>" +
      '<div class="wrap"><div class="credit">' + esc(v.credit) + '</div><div class="vlayout"><div style="display:grid;gap:22px">' +
      '<div class="vtitle"><div class="meta" style="margin-bottom:8px"><span class="tag ink">' + T.state().types[v.type].icon + " " + esc(typeName(v.type)) + '</span><span class="tag">📍 ' + esc(v.area) + "</span>" + v.tags.slice(0, 3).map(function (k) { return '<span class="tag">' + esc(tagName(k)) + "</span>"; }).join("") + '</div><h1 class="h-d">' + esc(v.name) + '</h1><div class="meta">' + ratingHtml(v) + " · " + lvl(v.price) + ' · <span class="avail' + (op ? "" : " full") + '"><i></i>' + esc(op ? t("open") : t("closed")) + "</span></div></div>" +
      offs.map(function (o) { var c = content(o.tr, "title"), st = offerState(o); return '<div class="ticket"><div><span class="tag ink">🎁 ' + esc(t("deals")) + "</span><h4>" + esc(c.text) + '</h4><div class="small" style="font-weight:700">' + esc(content(o.tr, "cond").text) + " · " + esc(o.from + "–" + o.to) + (st && st.live ? ' · <span class="live" style="color:var(--ink)">' + esc(t("live_now")) + "</span>" : "") + "</div>" + (c.fb ? '<div class="fb">EN – chưa có bản dịch ' + S.lang.toUpperCase() + "</div>" : "") + '</div><div class="pct">🎁</div></div>'; }).join("") +
      activeSuper(v).map(function (sd) { return sticket(sd, true); }).join("") +
      '<div class="box"><h3>' + esc(t("about")) + '</h3><p style="margin:0;font-size:1.02rem">' + esc(d.text) + "</p>" + (d.fb ? '<div class="fb">Hiển thị tiếng Anh vì chưa có bản dịch ' + S.lang.toUpperCase() + " đã duyệt</div>" : "") + "</div>" +
      '<div class="box"><h3>' + esc(t("priceInfo")) + '</h3><div class="facts">' + facts.map(function (f) { return '<div class="fact"><small>' + esc(t(f[0])) + "</small><b>" + f[1] + "</b></div>"; }).join("") + '</div><p class="small muted" style="margin:10px 0 0">' + esc(t("rateNote")) + " " + esc(T.state().settings.rates.at) + "</p></div>" +
      (upcomingOf(v).length ? '<div><h3 class="h-d" style="font-size:1.5rem;margin:0 0 10px">🎶 ' + esc(t("upcoming_ev")) + '</h3><div class="egrid">' + upcomingOf(v).map(ecard).join("") + "</div></div>" : "") +
      '<div class="box"><h3>📍 ' + esc(t("location")) + '</h3><iframe class="mapframe" title="Google Maps ' + esc(v.name) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=' + encodeURIComponent(v.name + ", " + v.address) + "&hl=" + S.lang + '&z=16&output=embed"></iframe><p class="small" style="margin:10px 0 0;font-weight:700">' + esc(v.address) + '</p><div class="acts">' + (isMobile() ? '<button class="btn sm lime" data-grab="' + v.id + '">🚕 ' + esc(t("grab")) + "</button>" : "") + '<a class="btn sm ghost" href="' + gm + '" target="_blank" rel="noopener">🧭 ' + esc(t("directions")) + "</a></div></div>" + reviewsBox(v) + REF +
      '</div><aside class="vside"><div class="box" style="display:grid;gap:12px"><div class="h-d" style="font-size:1.6rem">' + esc(t("book")) + '</div><div class="small muted">' + esc(t("from")) + ' <b style="color:var(--ink);font-size:1.2rem">' + money(v.priceFrom) + "</b> / " + esc(v.priceUnit) + '</div><button class="btn block" data-book="' + v.id + '">' + esc(t("book")) + ' →</button><div class="small" style="font-weight:700">✓ ' + esc(t("noFee")) + "<br>✓ " + esc(t("pendingHint").split(".")[0]) + ".</div></div></aside></div></div>" +
      '<div class="stickybar"><div class="in"><div><b>' + esc(v.name) + '</b><span class="small muted">' + esc(t("from")) + " " + money(v.priceFrom) + '</span></div><button class="btn" data-book="' + v.id + '">' + esc(t("book")) + "</button></div></div>");
  }
  function lightbox(v, i) {
    var n = v.imgs.length, el = document.createElement("div"); el.className = "lb"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", v.name);
    function draw() { el.innerHTML = '<div class="lb-top"><span>' + esc(v.name) + " · " + (i + 1) + " / " + n + '</span><button aria-label="Đóng">×</button></div><div class="lb-main">' + (n > 1 ? '<button class="lb-nav p" aria-label="Trước">‹</button>' : "") + '<img src="' + img(v.imgs[i]) + '" alt="">' + (n > 1 ? '<button class="lb-nav n" aria-label="Sau">›</button>' : "") + '</div><div class="lb-cap">' + esc(v.credit) + '</div><div class="lb-th">' + v.imgs.map(function (p, k) { return '<button class="' + (k === i ? "on" : "") + '" data-k="' + k + '"><img src="' + img(p) + '" alt=""></button>'; }).join("") + "</div>"; var o = el.querySelector(".lb-th .on"); if (o) o.scrollIntoView({ inline: "center", block: "nearest" }); }
    function go(d) { i = (i + d + n) % n; draw(); }
    function close() { el.remove(); document.removeEventListener("keydown", key); document.body.classList.remove("lock"); }
    function key(e) { if (e.key === "Escape") close(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }
    el.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; if (b.classList.contains("p")) go(-1); else if (b.classList.contains("n")) go(1); else if (b.dataset.k) { i = +b.dataset.k; draw(); } else close(); });
    var sx = 0; el.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true }); el.addEventListener("touchend", function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); });
    document.addEventListener("keydown", key); document.body.appendChild(el); document.body.classList.add("lock"); draw();
  }
  function grab(v) {
    var dl = "grab://open?screenType=BOOKING&dropOffLatitude=" + v.lat + "&dropOffLongitude=" + v.lng + "&dropOffAddress=" + encodeURIComponent(v.name);
    openSheet(sh("🚕 " + t("grab"), '<div class="grab-sim"><div class="gh">Grab · đặt xe (mô phỏng)</div><div class="gb"><div class="pt"><span class="dot" style="background:#00b14f"></span><div><b>Điểm đón</b><div class="small muted">Vị trí hiện tại của bạn (Grab tự lấy)</div></div></div><div class="pt"><span class="dot" style="background:var(--red)"></span><div><b>' + esc(v.name) + '</b><div class="small muted">' + esc(v.address) + '</div></div></div></div></div><p class="small muted">Trên điện thoại thật, nút này mở app Grab bằng deeplink và điền sẵn điểm đến. Chưa cài Grab thì mở App Store / Google Play.</p><code class="small" style="word-break:break-all;display:block;background:var(--soft);padding:8px;border-radius:8px">' + esc(dl) + "</code>"));
  }

  /* ---------- Ưu đãi ---------- */
  function vDeals() {
    var f = S.dealf || "today", list = [];
    V().forEach(function (v) { T.offersOf(v.id, true).forEach(function (o) { if (f === "all" || offerState(o)) list.push(o); }); });
    list.sort(function (a, b) { var sa = offerState(a), sb = offerState(b); return stRank(sa) - stRank(sb) || ((sa && sa.ms) || 0) - ((sb && sb.ms) || 0); });
    chrome('<div class="wrap"><div class="ptitle"><h1 class="h-d">⚡ ' + esc(t("nav_deals")) + '</h1><p class="muted" style="margin:6px 0 0">' + esc(t("deals_page_sub")) + '</p></div><div class="chips" style="margin:10px 0 16px"><button class="chip' + (f === "today" ? " on" : "") + '" data-dealf="today">' + esc(t("today")) + '</button><button class="chip' + (f === "all" ? " on" : "") + '" data-dealf="all">' + esc(t("all")) + '</button></div>' + (supersAll().length ? '<h2 class="h-d" style="font-size:1.6rem;margin:6px 0 12px">⚡ ' + esc(t("super_t")) + '</h2><div class="grid" style="margin-bottom:26px">' + supersAll().map(scard).join("") + '</div><h2 class="h-d" style="font-size:1.6rem;margin:6px 0 12px">🎁 ' + esc(t("deals")) + "</h2>" : "") + '<div class="grid">' + (list.length ? list.map(gcard).join("") : '<div class="empty">—</div>') + "</div>" + REF + "</div>");
  }

  /* ---------- Bản đồ: quán gần tôi ---------- */
  var SPOTS = [
    { k: "mykhe", lat: 16.0614, lng: 108.2470, n: ["Biển Mỹ Khê", "My Khe Beach", "미케 비치", "Пляж Мишке", "美溪海滩", "ミーケービーチ"] },
    { k: "dragon", lat: 16.0612, lng: 108.2272, n: ["Cầu Rồng", "Dragon Bridge", "용다리", "Мост Дракона", "龙桥", "ドラゴン橋"] },
    { k: "hanmkt", lat: 16.0683, lng: 108.2243, n: ["Chợ Hàn", "Han Market", "한시장", "Рынок Хан", "韩市场", "ハン市場"] },
    { k: "anthuong", lat: 16.0498, lng: 108.2457, n: ["Phố An Thượng", "An Thuong", "안트엉", "Ан Тхыонг", "安上街", "アントゥオン"] }
  ];
  function me() { if (!S.me) S.me = { lat: SPOTS[0].lat, lng: SPOTS[0].lng, src: "spot", k: "mykhe" }; return S.me; }
  function km(a, b) { var R = 6371, dLa = (b.lat - a.lat) * Math.PI / 180, dLo = (b.lng - a.lng) * Math.PI / 180, x = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLo / 2) * Math.sin(dLo / 2); return 2 * R * Math.asin(Math.sqrt(x)); }
  function kmTxt(d) { return d < 1 ? Math.round(d * 1000 / 10) * 10 + " m" : (Math.round(d * 10) / 10).toLocaleString(S.lang === "vi" ? "vi-VN" : "en") + " km"; }
  function meLabel() { var m = me(); if (m.src === "spot") { var s = SPOTS.filter(function (x) { return x.k === m.k; })[0]; return s ? s.n[LI[S.lang]] : ""; } return m.src === "gps" ? t("use_gps") : t("you_here"); }
  var MAP = null, MK = {};
  function vMap() {
    var st = T.state(), ft = S.mapT || "", fo = !!S.mapO, m = me();
    chrome('<div class="wrap"><div class="ptitle"><h1 class="h-d">📍 ' + esc(t("near_title")) + '</h1><p class="muted" style="margin:6px 0 0">' + esc(t("near_sub")) + "</p></div>" +
      '<div class="nearbar"><button class="btn sm ink" id="gpsBtn">🎯 ' + esc(t("use_gps")) + '</button><div class="chips">' + SPOTS.map(function (s) { return '<button class="chip' + (m.src === "spot" && m.k === s.k ? " on" : "") + '" data-spot="' + s.k + '">🏨 ' + esc(s.n[LI[S.lang]]) + "</button>"; }).join("") + '</div><p class="small muted" style="margin:0">' + esc(t("tap_map")) + "</p></div>" +
      '<div class="chips" style="margin:6px 0 10px"><button class="chip' + (!ft ? " on" : "") + '" data-mapt="">' + esc(t("all")) + "</button>" + Object.keys(st.types).map(function (k) { return '<button class="chip' + (ft === k ? " on" : "") + '" data-mapt="' + k + '">' + st.types[k].icon + " " + esc(typeName(k)) + "</button>"; }).join("") + '<button class="chip' + (fo ? " on" : "") + '" data-mapo="1">✅ ' + esc(t("openOnly")) + "</button></div>" +
      '<div class="maplay"><div class="mapcol"><div class="lmapwrap"><div id="lmap" class="lmap" role="application" aria-label="' + esc(t("near_title")) + '"></div><button class="pill fitall" id="fitAll">⤢ ' + esc(t("fit_all")) + '</button></div><p class="small muted" style="margin:6px 0 0">Bản đồ nền: © OpenStreetMap ' + T.ref + "</p></div>" +
      '<div><div class="lbl" style="margin-top:0">' + esc(t("nearest")) + ' <span id="meLbl">📍 ' + esc(meLabel()) + '</span></div><div class="mlist" id="mlist"></div></div></div>' + REF + "</div>");
    initMap();
  }
  function mapList() { var ft = S.mapT || "", fo = !!S.mapO; return V().filter(function (v) { return (!ft || v.type === ft) && (!fo || openTonight(v)); }).map(function (v) { return { v: v, d: km(me(), v) }; }).sort(function (a, b) { return a.d - b.d; }); }
  function popHtml(v, d) {
    var op = openTonight(v), o = bestOffer(v);
    return '<a class="pthumb" href="#/v/' + v.slug + '"><img src="' + img(v.imgs[0]) + '" alt=""><div class="pt-b"><b>' + esc(v.name) + '</b><small>' + T.state().types[v.type].icon + " " + esc(typeName(v.type)) + " · 📍 " + kmTxt(d) + '</small><span class="avail' + (op ? "" : " full") + '"><i></i>' + esc(op ? t("open") : t("closed")) + "</span>" + (o ? '<span class="pt-deal">🎁 ' + esc(content(o.tr, "title").text) + "</span>" : "") + '<span class="pt-go">' + esc(t("view_venue")) + " →</span></div></a>";
  }
  function drawList() {
    var box = document.getElementById("mlist"); if (!box) return;
    var L2 = mapList(), ids = L2.map(function (x) { return x.v.id; });
    box.innerHTML = L2.length ? L2.map(function (x, i) { var v = x.v; return '<button class="mrow" data-mapv="' + v.id + '"><span class="rank">' + (i + 1) + '</span><img src="' + img(v.imgs[0]) + '" alt=""><div><b>' + esc(v.name) + "</b><small>" + T.state().types[v.type].icon + " " + esc(typeName(v.type)) + " · " + esc(v.area) + '</small><span class="avail' + (openTonight(v) ? "" : " full") + '"><i></i>' + esc(openTonight(v) ? t("open") : t("closed")) + '</span></div><span class="dist">' + kmTxt(x.d) + "</span></button>"; }).join("") : '<div class="empty">' + esc(t("noResult")) + "</div>";
    document.getElementById("meLbl").textContent = "📍 " + meLabel();
    if (!MAP) return;
    Object.keys(MK).forEach(function (id) { var on = ids.indexOf(id) >= 0, mk = MK[id]; if (on && !MAP.hasLayer(mk)) mk.addTo(MAP); if (!on && MAP.hasLayer(mk)) MAP.removeLayer(mk); if (on) mk.setPopupContent(popHtml(T.venue(id), km(me(), T.venue(id)))); });
  }
  function initMap() {
    MAP = null; MK = {};
    var el = document.getElementById("lmap");
    if (!window.L) { el.innerHTML = '<div class="empty" style="margin:20px">' + esc(t("map_off")) + "</div>"; drawList(); return; }
    var m = me();
    MAP = L.map(el, { zoomControl: true, attributionControl: true }).setView([m.lat, m.lng], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(MAP);
    var meIcon = L.divIcon({ className: "", html: '<div class="me-pin"><i></i><span>' + esc(t("you_here")) + "</span></div>", iconSize: [22, 22], iconAnchor: [11, 11] });
    var meMk = L.marker([m.lat, m.lng], { icon: meIcon, draggable: true, zIndexOffset: 1000, keyboard: false }).addTo(MAP);
    var ring = L.circle([m.lat, m.lng], { radius: 1500, color: "#7B2CFF", weight: 1.5, fillColor: "#7B2CFF", fillOpacity: .06, interactive: false }).addTo(MAP);
    function moveMe(lat, lng, src, k) { S.me = { lat: lat, lng: lng, src: src, k: k || "" }; saveS(); meMk.setLatLng([lat, lng]); ring.setLatLng([lat, lng]); document.querySelectorAll("[data-spot]").forEach(function (b) { b.classList.toggle("on", src === "spot" && b.dataset.spot === k); }); drawList(); }
    meMk.on("dragend", function () { var p = meMk.getLatLng(); moveMe(p.lat, p.lng, "pick"); });
    MAP.on("click", function (e) { moveMe(e.latlng.lat, e.latlng.lng, "pick"); });
    V().forEach(function (v) {
      var ic = L.divIcon({ className: "", html: '<div class="vpin' + (openTonight(v) ? "" : " off") + '"><span>' + T.state().types[v.type].icon + "</span></div>", iconSize: [38, 44], iconAnchor: [19, 42], popupAnchor: [0, -38] });
      MK[v.id] = L.marker([v.lat, v.lng], { icon: ic, title: v.name, riseOnHover: true }).bindPopup(popHtml(v, km(m, v)), { className: "vpop", maxWidth: 230, minWidth: 230, closeButton: true, autoPanPaddingTopLeft: [20, 20], autoPanPaddingBottomRight: [20, 60] });
    });
    drawList();
    var near = mapList().slice(0, 3).map(function (x) { return [x.v.lat, x.v.lng]; });
    if (near.length) MAP.fitBounds(L.latLngBounds(near.concat([[m.lat, m.lng]])), { padding: [40, 40], maxZoom: 15 });
    vMap.moveMe = moveMe;
  }
  function askGps() {
    openSheet(sh("🎯 " + esc(t("use_gps")), "<p>" + esc(t("gps_ask")) + '</p><div style="display:flex;gap:10px"><button class="btn ghost" style="flex:1" data-close>' + esc(t("back")) + '</button><button class="btn lime" style="flex:1" id="gpsOk">' + esc(t("allow")) + "</button></div>"));
    document.getElementById("gpsOk").addEventListener("click", function () {
      closeSheet();
      if (!navigator.geolocation) return T.toast(esc(t("gps_fail")), "warn");
      navigator.geolocation.getCurrentPosition(function (p) {
        var pos = { lat: p.coords.latitude, lng: p.coords.longitude };
        if (km(pos, { lat: 16.0544, lng: 108.2022 }) > 40) return T.toast(esc(t("gps_far")), "warn", 6000);
        if (vMap.moveMe) { vMap.moveMe(pos.lat, pos.lng, "gps"); MAP.setView([pos.lat, pos.lng], 15); }
      }, function () { T.toast(esc(t("gps_fail")), "warn"); }, { enableHighAccuracy: true, timeout: 8000 });
    });
  }

  /* ---------- Đơn của tôi + tra cứu (UC-K07) ---------- */
  function vMy() {
    var mine = T.state().myCodes.map(function (c) { return T.booking(c); }).filter(Boolean);
    var up = mine.filter(function (b) { return ["pending", "confirmed", "arrived"].indexOf(b.status) >= 0; }), past = mine.filter(function (b) { return up.indexOf(b) < 0; });
    function row(b) { var v = T.venue(b.venueId); return '<a class="bk" href="#/b/' + b.code + '"><img src="' + img(v.imgs[0]) + '" alt=""><div class="in"><span class="status ' + b.status + '">' + esc(t("st_" + b.status)) + "</span><h4>" + esc(v.name) + '</h4><div class="small muted">' + esc(wdLong(b.date)) + " · " + esc(b.time) + " · 👥 " + b.pax + '</div><div class="small"><b>' + esc(b.code) + "</b></div></div></a>"; }
    chrome('<div class="wrap"><div class="ptitle"><h1 class="h-d">' + esc(t("nav_my")) + "</h1></div>" +
      (mine.length ? "" : '<div class="empty">' + esc(t("my_empty")) + '<br><br><a class="btn" href="#/explore">' + esc(t("all_venues")) + "</a></div>") +
      (up.length ? '<div class="lbl">' + esc(t("upcoming")) + '</div><div class="grid">' + up.map(row).join("") + "</div>" : "") +
      (past.length ? '<div class="lbl" style="margin-top:26px">' + esc(t("past")) + '</div><div class="grid">' + past.map(row).join("") + "</div>" : "") +
      '<div class="box" style="margin-top:28px;max-width:560px"><h3>🔎 ' + esc(t("lookup")) + '</h3><p class="small muted" style="margin-top:-4px">' + esc(t("lookup_sub")) + '</p><form id="lf"><div class="lbl">' + esc(t("code")) + " " + T.ref + '</div><input class="inp" name="c" value="TN-C5Q1"><div class="lbl">' + esc(t("phoneOrEmail")) + " " + T.ref + '</div><input class="inp" name="k" value="john@example.com"><div class="err" id="lerr" role="alert" style="margin-top:8px"></div><button class="btn block" style="margin-top:12px">' + esc(t("find")) + "</button></form></div></div>");
    document.getElementById("lf").addEventListener("submit", function (e) {
      e.preventDefault(); var fd = new FormData(e.target), c = String(fd.get("c")).trim().toUpperCase(), k = String(fd.get("k")).trim(), b = T.booking(c);
      if (!(b && (T.normEmail(k) === b.email || (b.phone && T.normPhone(k.replace(/\s/g, "")) === b.phone)))) { document.getElementById("lerr").textContent = t("notFound"); return; }
      location.hash = "#/b/" + b.code;
    });
  }

  /* ---------- trang đơn: UC-K07, K08, K09 ---------- */
  function channels(b) {
    var c = []; if (b.phone && T.isVN(b.phone)) c.push("💬 Zalo ZNS / SMS → <b>" + esc(T.prettyPhone(b.phone)) + "</b>"); if (b.email) c.push("✉️ Email → <b>" + esc(b.email) + "</b>");
    return '<div class="hint" style="display:block"><b>' + esc(t("nt_title")) + '</b><div style="margin-top:6px">📄 ' + esc(t("nt_page")) + "</div>" + c.map(function (x) { return "<div>" + x + "</div>"; }).join("") + "</div>";
  }
  function vBooking(code) {
    var b = T.booking(code); if (!b) return notFound();
    var v = T.venue(b.venueId), st = b.status, flow = ["pending", "confirmed", "arrived"], idx = flow.indexOf(st === "billed" || st === "settled" ? "arrived" : st);
    var dead = ["cancelled", "rejected", "expired", "no_show"].indexOf(st) >= 0, canEdit = (st === "pending" || st === "confirmed") && new Date(b.date + "T" + b.time).getTime() > T.now();
    var left = st === "pending" ? b.deadlineBase + 15 * T.MIN - T.now() : 0, offs = T.offersOf(v.id, true);
    var alts = (st === "rejected" || st === "expired") ? V().filter(function (x) { return x.id !== v.id && T.isOpenNight(x.id, b.date); }).sort(function (a, c) { return (c.type === v.type) - (a.type === v.type); }).slice(0, 3) : [];
    chrome('<div class="wrap" style="max-width:760px"><div class="ptitle"><a href="#/my" class="small" style="font-weight:800">← ' + esc(t("nav_my")) + '</a></div><div class="box" style="padding:0;overflow:hidden"><div class="bkhero"><img src="' + img(v.imgs[0]) + '" alt=""><span class="word">' + esc(v.name) + '</span></div><div style="padding:16px">' +
      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><span class="status ' + st + '">' + esc(t("st_" + st)) + '</span><span class="small">' + esc(t("code")) + ' <b style="font-size:1.1rem">' + esc(b.code) + "</b></span></div>" +
      (dead ? "" : '<div class="steps">' + flow.map(function (s, i) { return '<div class="' + (i <= idx ? "on" : "") + (i === idx ? " cur" : "") + '">' + esc(t("st_" + s)) + "</div>"; }).join("") + "</div>") +
      '<div class="sum" style="margin-top:12px"><span>' + esc(t("date")) + "</span><b>" + esc(wdLong(b.date)) + "</b><span>" + esc(t("time")) + "</span><b>" + esc(b.time) + "</b><span>" + esc(t("pax")) + "</span><b>" + b.pax + "</b><span>" + esc(t("name")) + "</span><b>" + esc(b.name) + "</b>" + (b.phone ? "<span>" + esc(t("phone")) + "</span><b>" + esc(T.prettyPhone(b.phone)) + "</b>" : "") + (b.email ? "<span>Email</span><b>" + esc(b.email) + "</b>" : "") + (b.note ? "<span>" + esc(t("note")) + "</span><b>" + esc(b.note) + "</b>" : "") + "</div>" +
      (b.eventId && T.event(b.eventId) ? '<div class="hint">🎶 <span><b>' + esc(t("for_event")) + ":</b> " + esc(content(T.event(b.eventId).tr, "title").text) + " · " + esc(T.event(b.eventId).from + "–" + T.event(b.eventId).to) + "</span></div>" : "") +
      (b.deal && !dead ? '<div class="ticket super" style="margin-top:14px"><div><span class="tag lime">⚡ ' + esc(t("by_toini")) + "</span><h4>" + esc(dealTitle(b)) + '</h4><div class="small">' + esc(T.dealLabel(b.deal)) + '</div></div><div class="pct">' + (b.deal.type === "pct" ? "−" + b.deal.value + "%" : "−" + Math.round(b.deal.value / 1000) + "K") + "</div></div>" : "") +
      (st === "pending" ? '<div class="hint" style="align-items:center;flex-wrap:wrap"><span style="font-size:1.4rem">⏳</span><div style="flex:1">' + esc(t("reply_in")) + ' <b class="count" style="color:var(--red);font-size:1.4rem" data-pend="' + b.code + '">' + dur(left) + "</b></div></div>" + channels(b) : "") +
      (st === "rejected" ? '<div class="hint" style="background:#FFE7A3;border-style:solid">❌ <span><b>' + esc(t("reason")) + ":</b> " + esc(b.reason || "") + "</span></div>" : "") +
      (st === "confirmed" ? '<div style="margin-top:16px;display:grid;gap:10px"><button class="btn block bigarrive" data-arrive="' + b.code + '">📍 ' + esc(t("arrived")) + '</button><p class="small muted" style="margin:0;text-align:center">' + esc(t("showStaff")) + "</p></div>" : "") +
      (["arrived", "billed", "settled"].indexOf(st) >= 0 ? '<div style="margin-top:16px;display:grid;gap:10px"><button class="btn lime block" data-showdeal="' + b.code + '">🎁 ' + esc(t("deal_on")) + "</button>" + reviewState(b) + "</div>" : "") +
      (offs.length && !dead ? offs.map(function (o) { return '<div class="ticket" style="margin-top:18px"><div><span class="tag ink">🎁 ' + esc(t("yourDeal")) + "</span><h4>" + esc(content(o.tr, "title").text) + '</h4><div class="small">' + esc(content(o.tr, "cond").text) + '</div></div><div class="pct">🎁</div></div>'; }).join("") : "") +
      '<div class="acts" style="margin-top:16px">' + (isMobile() && !dead ? '<button class="btn sm lime" data-grab="' + v.id + '">🚕 ' + esc(t("grab")) + "</button>" : "") + (!dead ? '<a class="btn sm ghost" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + v.lat + "," + v.lng + '">🧭 ' + esc(t("directions")) + "</a>" : "") + "</div>" +
      (canEdit ? '<div style="display:flex;gap:10px;margin-top:12px"><button class="btn ghost" style="flex:1" data-change="' + b.code + '">🕘 ' + esc(t("changeTime")) + '</button><button class="btn ghost" style="flex:1" data-cancel="' + b.code + '">✕ ' + esc(t("cancel")) + "</button></div>" : "") +
      (!canEdit && (st === "pending" || st === "confirmed") ? '<p class="small muted">Đã quá giờ đặt: muốn đổi hoặc hủy, vui lòng nhắn Toini.</p>' : "") +
      (alts.length ? '<div class="lbl" style="margin-top:18px">' + esc(t("alts")) + '</div><div class="grid">' + alts.map(vcard).join("") + "</div>" : "") +
      '<div class="lbl" style="margin-top:18px">Lịch sử đơn</div><div class="sum">' + b.history.slice().reverse().map(function (h) { return "<span>" + T.hm(h.at) + '</span><b style="font-weight:600">' + esc(h.action) + ' <span class="small muted">· ' + esc(h.by) + "</span></b>"; }).join("") + "</div>" +
      "</div></div>" + REF + "</div>");
  }

  /* ---------- sheet ---------- */
  function openSheet(html) { var s = document.getElementById("sheet"); s.innerHTML = '<div class="grab"></div>' + html; s.classList.add("on"); document.getElementById("bd").classList.add("on"); document.body.classList.add("lock"); s.scrollTop = 0; }
  function closeSheet() { var s = document.getElementById("sheet"); if (!s) return; s.classList.remove("on"); document.getElementById("bd").classList.remove("on"); document.body.classList.remove("lock"); }
  function sh(title, body) { return '<div class="sh-h"><h3>' + title + '</h3><button class="xbtn" data-close aria-label="' + esc(t("close")) + '">✕</button></div>' + body; }
  function pickLang() { openSheet(sh(esc(t("lang_t")), LANGS.map(function (l) { return '<button class="opt' + (l[0] === S.lang ? " on" : "") + '" data-lang="' + l[0] + '"><span>' + l[1] + "</span><small>" + l[2] + "</small></button>"; }).join(""))); }
  function pickCur() { var r = T.state().settings.rates; openSheet(sh(esc(t("cur_t")), CURS.map(function (c) { return '<button class="opt' + (c === S.cur ? " on" : "") + '" data-cur="' + c + '"><span>' + c + "</span><small>" + (c === "VND" ? "" : "1 " + c + " = " + r[c].toLocaleString("vi-VN") + " ₫") + "</small></button>"; }).join("") + '<p class="small muted">' + esc(t("rateNote")) + " " + esc(r.at) + "</p>")); }

  /* ---------- UC-K05 + K06 đặt bàn 3 bước ---------- */
  var B = null;
  var PRESETS = { vn: ["Khách VN · Zalo ZNS", "Nguyễn Minh Anh", "+84", "0905 123 456", ""], kr: ["Khách Hàn · số NN + email", "Lee Seo-yeon", "+82", "10 3456 7890", "seoyeon.lee@example.com"], em: ["Chỉ email", "Emma Wilson", "+84", "", "emma.w@example.com"] };
  var CC = [["+84", "VN"], ["+82", "KR"], ["+1", "US"], ["+44", "UK"], ["+7", "RU"], ["+86", "CN"], ["+81", "JP"], ["+61", "AU"]];
  function slots(v, date) {
    var m = v.hours.match(/(\d\d):(\d\d)\s*–\s*(\d\d):(\d\d)/), a = +m[1] * 60 + +m[2], b = +m[3] * 60 + +m[4];
    var end = b <= a ? 23 * 60 + 30 : Math.min(b - 60, 23 * 60 + 30), out = [], min = 0;
    if (date === T.today()) { var n = new Date(T.now()); min = n.getHours() * 60 + n.getMinutes() + 15; }
    for (var x = Math.ceil(a / 30) * 30; x <= end; x += 30) if (x >= min) out.push(T.pad(Math.floor(x / 60)) + ":" + T.pad(x % 60));
    return out;
  }
  function nightOk(v, d) { return T.isOpenNight(v.id, d) && slots(v, d).length > 0; }
  function startBooking(id, opt) {
    opt = opt || {};
    var v = T.venue(id), first = ""; for (var i = 0; i < 7; i++) { var d = T.addDays(T.today(), i); if (nightOk(v, d)) { first = d; break; } }
    var p = PRESETS.vn, ev = opt.eventId && T.event(opt.eventId);
    B = { v: id, step: 1, date: first, time: "", pax: 4, note: "", name: p[1], cc: p[2], phone: p[3], email: p[4], agree: false, err: "", eventId: ev ? ev.id : "", dealId: opt.dealId };
    if (ev) { B.date = ev.date; var ts = slots(v, ev.date); B.time = ts.filter(function (x) { return x >= ev.from; })[0] || ts[ts.length - 1] || ""; }
    var sd = opt.dealId && T.superDeal(opt.dealId);
    if (sd) { /* chọn tối và giờ đầu tiên nằm trong khung deal */
      for (var k = 0; k < 7; k++) { var dd = T.addDays(T.today(), k); if (!nightOk(v, dd)) continue; var hit = slots(v, dd).filter(function (x) { return dealValid(sd, dd, x); })[0]; if (hit) { B.date = dd; B.time = hit; break; } }
    }
    renderBooking();
  }
  function dealsFor(v, date, time) { return T.state().superDeals.filter(function (d) { return d.venueId === v.id && dealValid(d, date, time); }); }
  function syncB() {
    var g = function (id) { var e = document.getElementById(id); return e ? e.value : null; };
    if (g("bNote") !== null) B.note = g("bNote");
    if (g("bName") !== null) { B.name = g("bName"); B.cc = g("bCc"); B.phone = g("bPhone"); B.email = g("bEmail"); B.agree = document.getElementById("bAgree").checked; }
  }
  function renderBooking() {
    var v = T.venue(B.v), body = "", prog = '<div class="prog">' + [1, 2, 3].map(function (i) { return '<i class="' + (i <= B.step ? "on" : "") + '"></i>'; }).join("") + "</div>";
    var vn = '<div class="small muted" style="margin-top:-8px;margin-bottom:10px;font-weight:700">' + esc(v.name) + " · " + esc(v.area) + "</div>";
    if (B.step === 1) {
      var days = ""; for (var i = 0; i < 7; i++) { var d = T.addDays(T.today(), i), ok = nightOk(v, d); days += '<button class="day' + (B.date === d ? " on" : "") + '" data-day="' + d + '"' + (ok ? "" : " disabled") + "><small>" + esc(i === 0 ? t("tonight") : T.wd(d, S.lang)) + "</small><b>" + +d.slice(8) + "</b>" + (ok ? "" : "<small>✕</small>") + "</button>"; }
      var ts = B.date ? slots(v, B.date) : []; if (!B.time || ts.indexOf(B.time) < 0) B.time = ts[Math.min(2, ts.length - 1)] || "";
      body = prog + vn + (B.eventId && T.event(B.eventId) ? '<div class="hint" style="margin:0 0 6px">🎶 <span><b>' + esc(t("for_event")) + ":</b> " + esc(content(T.event(B.eventId).tr, "title").text) + " · " + esc(T.event(B.eventId).from) + "</span></div>" : "") + '<div class="lbl">' + esc(t("date")) + '</div><div class="days">' + days + "</div>" + (T.isOpenNight(v.id, T.today()) ? "" : '<p class="small muted" style="margin:0">' + esc(t("closed")) + "</p>") +
        '<div class="lbl">' + esc(t("time")) + '</div><div class="times">' + ts.map(function (x) { return '<button class="chip' + (B.time === x ? " on" : "") + '" data-time="' + x + '">' + x + "</button>"; }).join("") + "</div>" +
        superPicker(v) +
        '<div class="lbl">' + esc(t("pax")) + '</div><div class="stepper"><button data-pax="-1" aria-label="-">−</button><b>' + B.pax + '</b><button data-pax="1" aria-label="+">+</button></div>' +
        '<div class="lbl">' + esc(t("note")) + " <span>" + esc(t("optional")) + '</span></div><textarea class="inp" rows="2" id="bNote">' + esc(B.note) + "</textarea>" +
        (v.minSpend || v.dress ? '<div class="hint">💡 <span>' + (v.minSpend ? esc(t("minSpend")) + ": <b>" + money(v.minSpend) + "</b> · " : "") + esc(t("dress")) + ": " + esc(v.dress) + "</span></div>" : "") +
        '<div style="margin-top:16px"><button class="btn block" data-bnext="2"' + (B.time && B.date ? "" : " disabled") + ">" + esc(t("next")) + " →</button></div>";
    } else if (B.step === 2) {
      body = prog + vn + '<div class="presets"><b>Điền mẫu ' + T.ref + "</b>" + Object.keys(PRESETS).map(function (k) { return '<button data-preset="' + k + '">' + esc(PRESETS[k][0]) + "</button>"; }).join("") + "</div>" +
        '<div class="lbl">' + esc(t("name")) + '</div><input class="inp" id="bName" value="' + esc(B.name) + '" autocomplete="name">' +
        '<div class="lbl">' + esc(t("phone")) + '</div><div class="phone"><select id="bCc" aria-label="Country code">' + CC.map(function (c) { return '<option value="' + c[0] + '"' + (c[0] === B.cc ? " selected" : "") + ">" + c[1] + " " + c[0] + "</option>"; }).join("") + '</select><input class="inp" id="bPhone" inputmode="tel" value="' + esc(B.phone) + '" autocomplete="tel-national"></div>' +
        '<div class="lbl">' + esc(t("email")) + '</div><input class="inp" id="bEmail" type="email" inputmode="email" value="' + esc(B.email) + '" autocomplete="email">' +
        '<div class="hint">📱 ' + esc(t("contactRule")) + "</div>" +
        '<label class="check"><input type="checkbox" id="bAgree"' + (B.agree ? " checked" : "") + "> <span>" + esc(t("agree")) + ' · <a href="#" data-terms>Xem</a></span></label>' +
        '<div class="err" role="alert" style="margin-top:8px">' + esc(B.err) + '</div><div style="display:flex;gap:10px;margin-top:12px"><button class="btn ghost" data-bnext="1" aria-label="' + esc(t("back")) + '">←</button><button class="btn" style="flex:1" id="bSend">' + esc(t("sendCode")) + "</button></div>";
    } else if (B.step === 3) {
      var ok = (B.sent || []).filter(function (m) { return m.ok; })[0], bad = (B.sent || []).filter(function (m) { return !m.ok; });
      body = prog + vn + '<div class="sum"><span>' + esc(t("date")) + "</span><b>" + esc(wdLong(B.date)) + " · " + esc(B.time) + "</b><span>" + esc(t("pax")) + "</span><b>" + B.pax + "</b><span>" + esc(t("name")) + "</span><b>" + esc(B.name) + "</b>" + (B.eventId ? "<span>🎶</span><b>" + esc(content(T.event(B.eventId).tr, "title").text) + "</b>" : "") + (chosenDeal() ? "<span>⚡</span><b>" + esc(content(chosenDeal().tr, "title").text) + "</b>" : "") + "</div>" +
        '<div class="lbl">' + esc(t("enterCode")) + " " + T.ref + '</div><p class="small" style="margin:-4px 0 10px">' + esc(t("sentVia")) + " <b>" + esc(ok ? ok.ch + " · " + ok.to : "—") + "</b>" + (bad.length ? '<br><span class="muted">' + bad.map(function (m) { return esc(m.ch + ": " + m.why); }).join("<br>") + "</span>" : "") + "</p>" +
        '<div class="otp" id="otp">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<input inputmode="numeric" maxlength="1" data-o="' + i + '" value="' + T.DEMO_OTP[i] + '" aria-label="OTP ' + (i + 1) + '">'; }).join("") + "</div>" +
        '<p class="small muted">🔑 Mã demo <b>' + T.DEMO_OTP + "</b> (đã điền sẵn) · hiệu lực 5 phút · sai tối đa 5 lần · <button class=\"linkbtn small\" id=\"bResend\">" + esc(t("resend")) + "</button></p>" +
        '<div class="err" role="alert">' + esc(B.err) + '</div><div style="display:flex;gap:10px;margin-top:10px"><button class="btn ghost" data-bnext="2">←</button><button class="btn" style="flex:1" id="bConfirm">' + esc(t("verify")) + "</button></div>";
    } else {
      var b = T.booking(B.code);
      body = '<div class="donebox"><div class="burst">🎉</div><h3 class="h-d" style="font-size:2rem;margin:0">' + esc(t("done")) + '</h3><p style="margin:8px auto;max-width:380px">' + esc(t("done_sub")) + '</p><div class="small" style="font-weight:800;text-transform:uppercase;letter-spacing:.06em">' + esc(t("code")) + '</div><div class="codebig">' + esc(b.code) + '</div><div style="text-align:left">' + channels(b) + '</div><div style="display:grid;gap:10px;margin-top:14px"><a class="btn block" href="#/b/' + b.code + '" data-close>' + esc(t("view_bk")) + " →</a></div></div>";
    }
    openSheet(sh(B.step === 4 ? "" : esc(t("book")) + " · " + esc([t("step_when"), t("step_contact"), t("step_verify")][B.step - 1]), body));
  }
  function sendCode() {
    syncB(); var v = T.venue(B.v), digits = B.phone.replace(/\D/g, "").replace(/^0/, "");
    var phone = digits ? T.normPhone(B.cc + digits) : "", email = T.normEmail(B.email), e = "";
    if (!B.name.trim()) e = t("name") + " *";
    else if (!phone && !email) e = t("contactRule");
    else if (phone && !T.isVN(phone) && !email) e = "Số nước ngoài không nhận được ZNS/SMS: vui lòng nhập thêm email.";
    else if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e = "Email chưa đúng định dạng.";
    else if (!B.agree) e = t("agree");
    else if (!T.isOpenNight(v.id, B.date)) e = t("closed");
    B.err = e; if (e) return renderBooking();
    var dup = T.state().bookings.filter(function (x) { return x.venueId === v.id && x.date === B.date && x.status === "pending" && ((phone && x.phone === phone) || (email && x.email === email)); })[0];
    if (dup) { closeSheet(); T.toast("Bạn đã có đơn đang chờ ở quán này cho tối đó – mở lại đơn cũ."); location.hash = "#/b/" + dup.code; return; }
    var chk = T.otpAllowed(phone, email);
    if (!chk.ok && !email) { B.err = "Đã gửi quá số lần cho phép hoặc số đang bị chặn. Thử lại sau hoặc nhắn Toini."; return renderBooking(); }
    B.to = { phone: phone, email: email }; B.sent = T.sendCustomer(chk.ok ? B.to : { email: email }, "otp", null); B.tries = 0;
    T.logOtp(phone, email); T.save(); T.showDelivered(B.sent); B.err = ""; B.step = 3; renderBooking();
  }
  function confirmCode() {
    var code = [].map.call(document.querySelectorAll("#otp input"), function (i) { return i.value; }).join("");
    if (code !== T.DEMO_OTP) { B.tries++; B.err = B.tries >= 5 ? "Sai quá 5 lần – mã đã hết hiệu lực, bấm Gửi lại mã." : "Mã chưa đúng (" + B.tries + "/5)."; renderBooking(); document.getElementById("otp").classList.add("err"); return; }
    var Sx = T.state(), n = T.now(), v = T.venue(B.v);
    var b = { id: T.uid("b"), code: T.newCode(), venueId: v.id, date: B.date, time: B.time, pax: B.pax, note: B.note.trim(), name: B.name.trim(), phone: B.to.phone, email: B.to.email, lang: S.lang, currency: S.cur, status: "pending", createdAt: n, statusAt: n, deadlineBase: n, history: [{ at: n, by: "Khách", action: "Tạo đơn (đã xác minh OTP)" }], msgs: [] };
    if (B.eventId) b.eventId = B.eventId;
    var cd = chosenDeal(); if (cd) { b.dealId = cd.id; b.deal = T.dealSnap(cd); }
    Sx.bookings.unshift(b); Sx.myCodes.unshift(b.code);
    T.audit("Khách (" + (b.phone ? T.prettyPhone(b.phone) : b.email) + ")", "Đơn", b.code, "Tạo đơn", null, v.name + " · " + b.date + " " + b.time + " · " + b.pax + " khách");
    var msgs = T.sendCustomer(B.to, "received", b); T.notifyVenue(b, "new"); T.save();
    B.code = b.code; B.step = 4; B.err = ""; renderBooking();
    T.showDelivered(msgs); setTimeout(function () { T.toast('<div class="t-sim">MÔ PHỎNG · TELEGRAM NHÓM QUÁN</div>🆕 Đơn mới ' + b.code + " đã gửi tới nhóm Telegram của " + esc(v.name), "msg"); }, 600);
  }
  function changeTime(b) {
    var v = T.venue(b.venueId), nights = []; for (var i = 0; i < 7; i++) { var d = T.addDays(T.today(), i); if (nightOk(v, d)) nights.push(d); }
    var d0 = nights.indexOf(b.date) >= 0 ? b.date : nights[0];
    var opts = function (d) { return slots(v, d).map(function (s) { return "<option" + (s === b.time ? " selected" : "") + ">" + s + "</option>"; }).join(""); };
    openSheet(sh("🕘 " + esc(t("changeTime")), '<div class="lbl">' + esc(t("date")) + '</div><select class="inp" id="nd">' + nights.map(function (d) { return '<option value="' + d + '"' + (d === d0 ? " selected" : "") + ">" + esc(wdLong(d)) + "</option>"; }).join("") + '</select><div class="lbl">' + esc(t("time")) + '</div><select class="inp" id="nt">' + opts(d0) + '</select><div class="hint">ℹ️ Đổi giờ thì đơn quay về “Chờ quán xác nhận”, quán có lại 15 phút để phản hồi.</div><button class="btn block" style="margin-top:14px" id="ctOk">OK</button>'));
    document.getElementById("nd").addEventListener("change", function (e) { document.getElementById("nt").innerHTML = opts(e.target.value); });
    document.getElementById("ctOk").addEventListener("click", function () {
      var nd = document.getElementById("nd").value, nt = document.getElementById("nt").value, before = b.date + " " + b.time;
      b.date = nd; b.time = nt; b.deadlineBase = T.now(); b.lateAlerted = false; T.setStatus(b, "pending", "Khách", "đổi giờ từ " + before + " sang " + nd + " " + nt);
      var m = T.sendCustomer(T.contactOf(b), "changed", b); T.notifyVenue(b, "changed"); T.save(); closeSheet(); route(); T.showDelivered(m);
    });
  }
  function cancelB(b) {
    openSheet(sh("✕ " + esc(t("cancel")), "<p>" + esc(b.code) + " · " + esc(T.venue(b.venueId).name) + '</p><div class="hint">ℹ️ Hủy trước giờ đặt không mất phí.</div><div style="display:flex;gap:10px;margin-top:14px"><button class="btn ghost" style="flex:1" data-close>' + esc(t("back")) + '</button><button class="btn" style="flex:1" id="cxOk">' + esc(t("cancel")) + "</button></div>"));
    document.getElementById("cxOk").addEventListener("click", function () { T.setStatus(b, "cancelled", "Khách"); var m = T.sendCustomer(T.contactOf(b), "cancelled", b); T.notifyVenue(b, "cancelled"); T.save(); closeSheet(); route(); T.showDelivered(m); });
  }
  function arrive(b) {
    if (!T.checkinWindow(b)) { openSheet(sh("📍 " + esc(t("arrived")), '<p>Chỉ bấm được trong khung giờ của đơn (từ 2 giờ trước giờ đặt). Mở ⚙ Demo → bật “Bỏ qua khung giờ” để thử.</p>')); return; }
    openSheet(sh("📍 " + esc(t("arrived")), '<p>Cho phép Toini lấy vị trí của bạn <b>một lần</b> để xác nhận đã tới quán? Bạn có thể từ chối, đơn vẫn được ghi nhận.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn ghost" style="flex:1" id="nogeo">Không cho phép</button><button class="btn lime" style="flex:1" id="geo">Cho phép 1 lần</button></div>'));
    function done(geo) { b.arrivedAt = T.now(); b.arrivedBy = "khach"; b.geo = geo; T.setStatus(b, "arrived", "Khách", geo ? "có vị trí (mô phỏng)" : "không chia sẻ vị trí"); T.save(); closeSheet(); route(); showDeal(b); }
    document.getElementById("geo").addEventListener("click", function () { done(true); });
    document.getElementById("nogeo").addEventListener("click", function () { done(false); });
  }
  var clk = null;
  function showDeal(b) {
    var v = T.venue(b.venueId), o = b.deal ? { tr: { vi: { title: dealTitle(b) + " · " + t("by_toini"), cond: T.dealLabel(b.deal), status: "approved" } } } : T.offersOf(v.id, true)[0], el = document.createElement("div"); el.className = "activated"; el.setAttribute("role", "dialog");
    el.innerHTML = '<div class="small" style="font-weight:800;text-transform:uppercase;letter-spacing:.08em">' + esc(t("showStaff")) + '</div><div class="clock" id="dclk">' + T.hm(T.now()) + ':00</div><div class="card"><span class="tag lime">' + esc(t("st_arrived")) + " · " + T.hm(b.arrivedAt || T.now()) + "</span><h3>" + esc(o ? content(o.tr, "title").text : v.name) + '</h3><div class="small">' + esc(o ? content(o.tr, "cond").text : "") + '</div><div style="margin-top:10px;font-weight:800">' + esc(v.name) + " · " + esc(b.name) + " · 👥 " + b.pax + " · " + esc(b.code) + '</div></div><button class="btn ink" id="dclose">' + esc(t("close")) + "</button>";
    document.body.appendChild(el); document.body.classList.add("lock");
    clearInterval(clk); clk = setInterval(function () { var c = document.getElementById("dclk"); if (!c) return clearInterval(clk); var d = new Date(T.now()); c.textContent = T.hm(d) + ":" + T.pad(d.getSeconds()); }, 1000);
    document.getElementById("dclose").addEventListener("click", function () { el.remove(); document.body.classList.remove("lock"); clearInterval(clk); });
  }
  /* UC-K10 nhắn Toini */
  var CHC = { zalo: "#0068ff", kakao: "#f9e000", whatsapp: "#25d366", line: "#06c755", wechat: "#07c160", telegram: "#229ed9", messenger: "#0084ff" };
  function chatSheet() {
    var list = T.state().settings.chat.slice().sort(function (a, b) { return (b.langs.indexOf(S.lang) >= 0) - (a.langs.indexOf(S.lang) >= 0); });
    openSheet(sh("💬 " + esc(t("chat")), "<p>" + esc(t("chatPick")) + '</p><div class="chans">' + list.map(function (c) { return '<button class="' + (c.langs.indexOf(S.lang) >= 0 ? "first" : "") + '" data-ch="' + c.k + '"><i style="background:' + (CHC[c.k] || "#333") + '"></i>' + esc(c.name) + "</button>"; }).join("") + '</div><p class="small muted">Nhân viên Toini trả lời trên ứng dụng bạn chọn. Nội dung chat không lưu trên web Toini.</p>'));
  }

  /* ---------- deal siêu hời, sự kiện, đánh giá ---------- */
  function inWin(time, from, to) { if (!time) return true; return to <= from ? (time >= from || time < to) : (time >= from && time < to); }
  function dealValid(d, date, time) { var dow = new Date(date + "T12:00").getDay(); return d.active && d.until >= date && d.days.indexOf(dow) >= 0 && T.dealUsed(d.id) < d.limit && inWin(time, d.from, d.to); }
  function activeSuper(v) { return T.state().superDeals.filter(function (d) { return d.venueId === v.id && d.active && d.until >= T.today() && T.dealUsed(d.id) < d.limit; }); }
  function supersAll() { var out = []; V().forEach(function (v) { out = out.concat(activeSuper(v)); }); return out; }
  function dealTitle(b) { var d = T.superDeal(b.deal.id); return d ? content(d.tr, "title").text : b.deal.title; }
  function chosenDeal() { if (!B || B.dealId === "") return null; var v = T.venue(B.v), list = dealsFor(v, B.date, B.time); if (!list.length) return null; return list.filter(function (d) { return d.id === B.dealId; })[0] || list[0]; }
  function superPicker(v) {
    var list = dealsFor(v, B.date, B.time);
    if (!list.length) { var any = activeSuper(v); return any.length ? '<div class="hint">⚡ <span>' + esc(t("super_t")) + ": " + any.map(function (d) { return esc(d.from + "–" + d.to); }).join(", ") + " – " + esc(t("time")) + " ≠</span></div>" : ""; }
    var cur = chosenDeal();
    return '<div class="lbl">⚡ ' + esc(t("super_pick")) + "</div>" + list.map(function (d) { return '<button class="opt' + (cur && cur.id === d.id ? " on" : "") + '" data-pickdeal="' + d.id + '"><span>⚡ ' + esc(content(d.tr, "title").text) + "</span><small>" + esc(t("by_toini")) + "</small></button>"; }).join("") + '<button class="opt' + (!cur ? " on" : "") + '" data-pickdeal=""><span>' + esc(t("deal_none")) + "</span></button>";
  }
  function scard(d) {
    var v = T.venue(d.venueId), left = d.limit - T.dealUsed(d.id);
    return '<div class="scard"><img class="bgimg" src="' + img(v.imgs[0]) + '" alt=""><div class="in"><div class="row"><span class="tag lime">⚡ ' + esc(t("by_toini")) + '</span><span class="tag">' + esc(t("slots_left").replace("{n}", left)) + '</span></div><div class="big">' + (d.type === "pct" ? "−" + d.value + "%" : "−" + Math.round(d.value / 1000) + "K") + "</div><h3>" + esc(content(d.tr, "title").text) + "</h3><p>" + esc(v.name) + " · " + esc(v.area) + " · " + esc(d.from + "–" + d.to) + '</p><p class="small">' + esc(content(d.tr, "cond").text) + '</p><div class="row" style="margin-top:auto"><a class="btn sm ghost" href="#/v/' + v.slug + '">' + esc(t("view_venue")) + '</a><button class="btn sm lime" data-bookdeal="' + d.id + '">' + esc(t("book_deal")) + " →</button></div></div></div>";
  }
  function sticket(d) {
    return '<div class="ticket super"><div><span class="tag lime">⚡ ' + esc(t("super_t")) + " · " + esc(t("by_toini")) + "</span><h4>" + esc(content(d.tr, "title").text) + '</h4><div class="small" style="font-weight:700">' + esc(content(d.tr, "cond").text) + " · " + esc(d.from + "–" + d.to) + '</div><button class="btn sm lime" style="margin-top:10px" data-bookdeal="' + d.id + '">' + esc(t("book_deal")) + ' →</button></div><div class="pct">' + (d.type === "pct" ? "−" + d.value + "%" : "−" + Math.round(d.value / 1000) + "K") + "</div></div>";
  }
  function eventsOn(date) { return T.state().events.filter(function (e) { return e.active && e.date === date && T.venue(e.venueId).visible; }).sort(function (a, b) { return a.from < b.from ? -1 : 1; }); }
  function upcomingOf(v) { return T.state().events.filter(function (e) { return e.active && e.venueId === v.id && e.date >= T.today(); }).sort(function (a, b) { return a.date < b.date ? -1 : 1; }).slice(0, 3); }
  function ecard(e) {
    var v = T.venue(e.venueId), d = new Date(e.date + "T12:00");
    return '<button class="ecard" data-ev="' + e.id + '"><div class="date"><img src="' + img(e.img) + '" alt=""><span>' + esc(T.wd(e.date, S.lang)) + "</span><b>" + d.getDate() + "</b><span>" + esc(e.from) + '</span></div><div class="info"><span class="small muted">' + T.state().types[v.type].icon + " " + esc(v.name) + " · " + esc(v.area) + "</span><h4>" + esc(content(e.tr, "title").text) + '</h4><div class="ft"><span class="small">' + esc(e.from + "–" + e.to) + '</span><span class="btn sm ghost">' + esc(t("book")) + "</span></div></div></button>";
  }
  function eventSheet(id) {
    var e = T.event(id), v = T.venue(e.venueId), c = content(e.tr, "desc"), past = e.date < T.today();
    openSheet(sh("🎶 " + esc(content(e.tr, "title").text), '<img src="' + img(e.img) + '" alt="" style="width:100%;height:200px;object-fit:cover;border-radius:14px;border:2.5px solid var(--ink)"><div class="sum" style="margin-top:12px"><span>📍</span><b>' + esc(v.name) + " · " + esc(v.area) + "</b><span>🗓</span><b>" + esc(wdLong(e.date)) + " · " + esc(e.from + "–" + e.to) + "</b></div><p>" + esc(c.text) + "</p>" + (e.tags || []).map(function (k) { return '<span class="tag" style="margin-right:6px">' + esc(tagName(k)) + "</span>"; }).join("") + '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">' + (past ? "" : '<button class="btn" style="flex:1" data-bookev="' + e.id + '">' + esc(t("book_event")) + " →</button>") + '<a class="btn ghost" style="flex:1" href="#/v/' + v.slug + '">' + esc(t("view_venue")) + "</a></div>"));
  }
  function vEvents() {
    var f = S.evf || "tonight", today = T.today(), list = [], cal = "";
    var all = T.state().events.filter(function (e) { return e.active && T.venue(e.venueId).visible; }).sort(function (a, b) { return a.date + a.from < b.date + b.from ? -1 : 1; });
    if (f === "tonight") list = eventsOn(today);
    else if (f === "tomorrow") list = eventsOn(T.addDays(today, 1));
    else if (f === "week") list = all.filter(function (e) { return e.date >= today && e.date <= T.addDays(today, 6); });
    else {
      var m = S.evm || today.slice(0, 7), first = new Date(m + "-01T12:00"), y = first.getFullYear(), mo = first.getMonth(), days = new Date(y, mo + 1, 0).getDate(), start = (first.getDay() + 6) % 7, sel = S.evday && S.evday.slice(0, 7) === m ? S.evday : (today.slice(0, 7) === m ? today : m + "-01");
      var cells = ""; for (var i = 0; i < start; i++) cells += '<span class="cd empty"></span>';
      for (var dd = 1; dd <= days; dd++) { var iso = m + "-" + T.pad(dd), n = all.filter(function (e) { return e.date === iso; }).length; cells += '<button class="cd' + (iso === sel ? " on" : "") + (iso === today ? " today" : "") + (iso < today ? " past" : "") + '" data-evday="' + iso + '"><b>' + dd + "</b>" + (n ? "<i>" + n + "</i>" : "") + "</button>"; }
      var mlabel = new Intl.DateTimeFormat({ vi: "vi-VN", en: "en-GB", ko: "ko-KR", ru: "ru-RU", zh: "zh-CN", ja: "ja-JP" }[S.lang], { month: "long", year: "numeric" }).format(first);
      var wdn = [1, 2, 3, 4, 5, 6, 0].map(function (k) { return T.wd(T.addDays("2026-11-01", k), S.lang); });
      cal = '<div class="cal"><div class="cal-h"><button class="pill" data-evm="-1" aria-label="prev">‹</button><b>' + esc(mlabel) + '</b><button class="pill" data-evm="1" aria-label="next">›</button></div><div class="cal-g">' + wdn.map(function (w) { return '<span class="cw">' + esc(w) + "</span>"; }).join("") + cells + "</div></div>";
      list = all.filter(function (e) { return e.date === sel; });
    }
    chrome('<div class="wrap"><div class="ptitle"><h1 class="h-d">🎶 ' + esc(t("nav_events")) + '</h1><p class="muted" style="margin:6px 0 0">' + esc(t("ev_sub")) + '</p></div><div class="chips" style="margin:10px 0 16px">' + [["tonight", t("tonight")], ["tomorrow", t("tomorrow")], ["week", t("week")], ["month", t("month")]].map(function (x) { return '<button class="chip' + (f === x[0] ? " on" : "") + '" data-evf="' + x[0] + '">' + esc(x[1]) + "</button>"; }).join("") + "</div>" + cal + '<div class="egrid">' + (list.length ? list.map(function (e) { return (f === "week" ? "" : "") + ecard(e); }).join("") : '<div class="empty">' + esc(t("no_events")) + "</div>") + "</div>" + REF + "</div>");
  }
  function stars(n) { return '<span class="star">' + "★★★★★".slice(0, Math.round(n)) + '<span style="opacity:.25">' + "★★★★★".slice(Math.round(n)) + "</span></span>"; }
  function ratingHtml(v) { var r = T.ratingOf(v.id); return r.count ? '<span class="star">★ ' + r.avg + '</span><span class="muted">(' + r.count + ")</span>" : '<span class="muted">' + esc(t("no_reviews")) + "</span>"; }
  function reviewsBox(v) {
    var list = T.state().reviews.filter(function (r) { return r.venueId === v.id && r.status === "approved"; }).sort(function (a, b) { return b.at - a.at; }), r = T.ratingOf(v.id);
    return '<div class="box"><h3>⭐ ' + esc(t("reviews_t")) + (r.count ? " · " + r.avg + "/5 · " + r.count : "") + '</h3><p class="small muted" style="margin:-4px 0 10px">✓ ' + esc(t("reviews_note")) + "</p>" + (list.length ? list.map(function (x) { return '<div class="rv"><div class="who"><span class="av">' + esc(x.name.charAt(0)) + "</span><div>" + esc(x.name) + ' <span class="cc">' + x.lang.toUpperCase() + '</span><div class="small muted">' + T.dmy(x.at) + "</div></div>" + stars(x.stars) + '</div><p style="margin:8px 0 0">' + esc(x.text) + "</p>" + (x.photos.length ? '<div class="rvph">' + x.photos.map(function (p, i) { return '<button data-rvlb="' + x.id + "|" + i + '"><img src="' + img(p) + '" alt=""></button>'; }).join("") + "</div>" : "") + "</div>"; }).join("") : '<p class="muted">' + esc(t("no_reviews")) + "</p>") + "</div>";
  }
  function reviewState(b) {
    var r = b.reviewId && T.state().reviews.filter(function (x) { return x.id === b.reviewId; })[0];
    if (!r) return '<button class="btn ink block" data-review="' + b.code + '">★ ' + esc(t("write_review")) + "</button>";
    return '<div class="hint">' + (r.status === "approved" ? "✅ " + esc(t("rv_ok")) : r.status === "rejected" ? "⛔ " + esc(t("rv_no")) + (r.reason ? " – " + esc(r.reason) : "") : "⏳ " + esc(t("rv_pending"))) + " · " + stars(r.stars) + "</div>";
  }
  var R = null;
  function reviewSheet(code) {
    var b = T.booking(code), v = T.venue(b.venueId);
    if (!R || R.code !== code) R = { code: code, stars: 5, text: "Không gian đẹp, nhân viên nhiệt tình, ưu đãi đúng như mô tả trên Toini.", photos: [] };
    openSheet(sh("★ " + esc(t("write_review")), '<div class="small muted" style="margin:-8px 0 8px;font-weight:700">' + esc(v.name) + " · " + esc(b.code) + '</div><div class="lbl">' + esc(t("rv_stars")) + '</div><div class="starpick">' + [1, 2, 3, 4, 5].map(function (n) { return '<button data-star="' + n + '" class="' + (n <= R.stars ? "on" : "") + '" aria-label="' + n + ' sao">★</button>'; }).join("") + '</div><div class="lbl">' + esc(t("rv_text")) + " " + T.ref + '</div><textarea class="inp" rows="3" id="rvText">' + esc(R.text) + '</textarea><div class="lbl">' + esc(t("rv_photos")) + '</div><div class="rvph">' + R.photos.map(function (p, i) { return '<span class="ph"><img src="' + img(p) + '" alt=""><button data-rvdel="' + i + '" aria-label="x">✕</button></span>'; }).join("") + "</div>" + (R.photos.length < 3 ? '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><label class="btn sm ghost">📷 + <input type="file" accept="image/*" multiple id="rvFile" style="display:none"></label><button class="btn sm ghost" id="rvSample">Dùng ảnh mẫu (demo)</button></div>' : "") + '<div class="hint">✓ ' + esc(t("reviews_note")) + '</div><button class="btn block" style="margin-top:14px" id="rvSend">' + esc(t("rv_send")) + "</button>"));
  }
  function sendReview() {
    var b = T.booking(R.code), n = T.now(); R.text = document.getElementById("rvText").value.trim();
    var r = { id: T.uid("r"), venueId: b.venueId, bookingCode: b.code, name: b.name, lang: S.lang, stars: R.stars, text: R.text, photos: R.photos.slice(), at: n, status: "pending" };
    T.state().reviews.unshift(r); b.reviewId = r.id; b.history.push({ at: n, by: "Khách", action: "Gửi đánh giá " + R.stars + " sao (chờ duyệt)" });
    T.audit("Khách (" + b.name + ")", "Đánh giá", b.code, "Gửi đánh giá", null, R.stars + " sao · " + R.photos.length + " ảnh");
    T.save(); R = null; closeSheet(); route(); T.toast("⏳ " + esc(t("rv_pending")));
  }

  /* ---------- điều hướng ---------- */
  function notFound() { chrome('<div class="wrap"><div class="empty" style="margin-top:30px">404 · <a href="#/">' + esc(t("back")) + "</a></div></div>"); }
  function route() {
    var h = location.hash.replace(/^#\/?/, ""), q = h.split("?"), p = q[0].split("/");
    document.body.classList.remove("has-sticky", "sb");
    if (p[0] === "v") vVenue(p[1]);
    else if (p[0] === "b") vBooking(p[1]);
    else if (p[0] === "explore") vExplore(q[1] || "");
    else if (p[0] === "deals") vDeals();
    else if (p[0] === "events") vEvents();
    else if (p[0] === "map") vMap();
    else if (p[0] === "my") vMy();
    else vHome();
  }
  function rerender() {
    if (document.getElementById("sheet") && document.getElementById("sheet").classList.contains("on")) return;
    if (document.querySelector(".lb,.activated")) return;
    var a = document.activeElement; if (a && /INPUT|TEXTAREA/.test(a.tagName)) return;
    var y = window.scrollY, h = location.hash.replace(/^#\/?/, "").split("?")[0].split("/")[0];
    if (h === "explore") { results(); return; }
    if (h === "map") { drawList(); return; } // giữ nguyên bản đồ, chỉ cập nhật danh sách
    route(); window.scrollTo(0, y);
  }
  window.addEventListener("hashchange", function () { closeSheet(); route(); window.scrollTo(0, 0); });
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-f],[data-book],[data-lb],[data-grab],[data-terms],[data-chat],[data-close],[data-lang],[data-cur],[data-day],[data-time],[data-pax],[data-bnext],[data-preset],[data-change],[data-cancel],[data-arrive],[data-showdeal],[data-dealf],[data-mapv],[data-spot],[data-mapt],[data-mapo],[data-ch],[data-tag],[data-ev],[data-bookev],[data-bookdeal],[data-pickdeal],[data-evf],[data-evday],[data-evm],[data-review],[data-star],[data-rvlb],[data-rvdel],#rvSend,#rvSample,#langBtn,#curBtn,#bd,#bSend,#bConfirm,#bResend,#freset,#gpsBtn,#fitAll");
    if (!el) return;
    var d = el.dataset;
    if (el.tagName === "A" && (d.terms !== undefined || d.chat !== undefined)) e.preventDefault();
    if (el.id === "langBtn") return pickLang();
    if (el.id === "curBtn") return pickCur();
    if (el.id === "bd" || d.close !== undefined) { closeSheet(); return; }
    if (d.lang) { S.lang = d.lang; saveS(); closeSheet(); return route(); }
    if (d.cur) { S.cur = d.cur; saveS(); closeSheet(); return route(); }
    if (d.terms !== undefined) return openSheet(sh(esc(t("terms")), "<p>" + esc(T.state().settings.terms) + "</p>"));
    if (d.chat !== undefined) return chatSheet();
    if (d.ch) { var c = T.state().settings.chat.filter(function (x) { return x.k === d.ch; })[0]; closeSheet(); return T.toast('<div class="t-sim">MÔ PHỎNG</div>Đang mở <b>' + esc(c.name) + "</b> tới tài khoản Toini: " + esc(c.link)); }
    if (d.f) { F[d.f] = d.f === "price" || d.f === "open" ? +d.v : d.v; return vExplore(); }
    if (el.id === "freset") { F = { q: "", area: "", type: "", price: 0, open: 0, tags: [], sort: F.sort }; return vExplore(); }
    if (d.tag) { var ix = F.tags.indexOf(d.tag); if (ix >= 0) F.tags.splice(ix, 1); else F.tags.push(d.tag); return vExplore(); }
    if (d.book) { e.preventDefault(); return startBooking(d.book); }
    if (d.lb !== undefined) { e.preventDefault(); var vv = T.venue(location.hash.split("/")[2]); return lightbox(vv, +d.lb); }
    if (d.grab) return grab(T.venue(d.grab));
    if (d.day) { syncB(); B.date = d.day; return renderBooking(); }
    if (d.time) { syncB(); B.time = d.time; return renderBooking(); }
    if (d.pax) { syncB(); B.pax = Math.max(1, Math.min(50, B.pax + +d.pax)); return renderBooking(); }
    if (d.bnext) { syncB(); B.err = ""; B.step = +d.bnext; return renderBooking(); }
    if (d.preset) { syncB(); var p = PRESETS[d.preset]; B.name = p[1]; B.cc = p[2]; B.phone = p[3]; B.email = p[4]; return renderBooking(); }
    if (el.id === "bSend") return sendCode();
    if (el.id === "bConfirm") return confirmCode();
    if (el.id === "bResend") { var useEmail = B.to.email && B.to.phone && confirm("Nhận mã qua email thay vì tin nhắn?"); B.sent = T.sendCustomer(useEmail ? { email: B.to.email } : B.to, "otp", null); T.logOtp(B.to.phone, B.to.email); T.save(); T.showDelivered(B.sent); return renderBooking(); }
    if (d.change) return changeTime(T.booking(d.change));
    if (d.cancel) return cancelB(T.booking(d.cancel));
    if (d.arrive) return arrive(T.booking(d.arrive));
    if (d.showdeal) return showDeal(T.booking(d.showdeal));
    if (d.dealf) { S.dealf = d.dealf; saveS(); return vDeals(); }
    if (d.ev) return eventSheet(d.ev);
    if (d.bookev) { var ev = T.event(d.bookev); closeSheet(); return startBooking(ev.venueId, { eventId: ev.id }); }
    if (d.bookdeal) { var sd = T.superDeal(d.bookdeal); return startBooking(sd.venueId, { dealId: sd.id }); }
    if (d.pickdeal !== undefined) { syncB(); B.dealId = d.pickdeal; return renderBooking(); }
    if (d.evf) { S.evf = d.evf; saveS(); return vEvents(); }
    if (d.evday) { S.evday = d.evday; saveS(); return vEvents(); }
    if (d.evm) { var cm = new Date((S.evm || T.today().slice(0, 7)) + "-01T12:00"); cm.setMonth(cm.getMonth() + +d.evm); S.evm = cm.getFullYear() + "-" + T.pad(cm.getMonth() + 1); saveS(); return vEvents(); }
    if (d.review) return reviewSheet(d.review);
    if (d.star) { R.text = document.getElementById("rvText").value; R.stars = +d.star; return reviewSheet(R.code); }
    if (d.rvdel !== undefined) { R.text = document.getElementById("rvText").value; R.photos.splice(+d.rvdel, 1); return reviewSheet(R.code); }
    if (el.id === "rvSample") { R.text = document.getElementById("rvText").value; var bv = T.venue(T.booking(R.code).venueId); R.photos.push(bv.imgs[R.photos.length % bv.imgs.length]); return reviewSheet(R.code); }
    if (el.id === "rvSend") return sendReview();
    if (d.rvlb) { var pr = d.rvlb.split("|"), rv = T.state().reviews.filter(function (x) { return x.id === pr[0]; })[0]; return lightbox({ name: rv.name, credit: "Ảnh của khách", imgs: rv.photos }, +pr[1]); }
    if (el.id === "gpsBtn") return askGps();
    if (el.id === "fitAll") { if (MAP) MAP.fitBounds(L.latLngBounds(V().map(function (v) { return [v.lat, v.lng]; }).concat([[me().lat, me().lng]])), { padding: [30, 30] }); return; }
    if (d.spot) { var sp = SPOTS.filter(function (x) { return x.k === d.spot; })[0]; if (vMap.moveMe && MAP) { vMap.moveMe(sp.lat, sp.lng, "spot", sp.k); MAP.setView([sp.lat, sp.lng], 15); } return; }
    if (d.mapt !== undefined) { S.mapT = d.mapt; saveS(); document.querySelectorAll("[data-mapt]").forEach(function (b) { b.classList.toggle("on", b.dataset.mapt === d.mapt); }); return drawList(); }
    if (d.mapo) { S.mapO = !S.mapO; saveS(); el.classList.toggle("on", S.mapO); return drawList(); }
    if (d.mapv) { var mk = MK[d.mapv]; if (MAP && mk) { if (window.innerWidth < 960) document.getElementById("lmap").scrollIntoView({ behavior: "smooth", block: "center" }); MAP.setView(mk.getLatLng(), 16); mk.openPopup(); } return; }
  });
  document.addEventListener("change", function (e) {
    if (e.target.id === "fsort") { F.sort = e.target.value; results(); }
    if (e.target.id === "rvFile") {
      R.text = document.getElementById("rvText").value;
      [].slice.call(e.target.files, 0, 3 - R.photos.length).forEach(function (f) { var rd = new FileReader(); rd.onload = function () { var im = new Image(); im.onload = function () { var c = document.createElement("canvas"), k = Math.min(1, 900 / im.width); c.width = im.width * k; c.height = im.height * k; c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); R.photos.push(c.toDataURL("image/jpeg", .7)); reviewSheet(R.code); }; im.src = rd.result; }; rd.readAsDataURL(f); });
    }
  });
  document.addEventListener("input", function (e) { if (e.target.dataset && e.target.dataset.o !== undefined && e.target.value) { var n = document.querySelector('[data-o="' + (+e.target.dataset.o + 1) + '"]'); if (n) n.focus(); } });
  /* đồng hồ, đếm ngược */
  setInterval(function () {
    document.querySelectorAll("[data-clock]").forEach(function (c) { c.textContent = T.hm(T.now()); });
    document.querySelectorAll("[data-cd]").forEach(function (c) { var o = T.state().offers.filter(function (x) { return x.id === c.dataset.cd; })[0], s = o && offerState(o); if (s && s.ms) c.textContent = dur(s.ms); });
    document.querySelectorAll("[data-pend]").forEach(function (c) { var b = T.booking(c.dataset.pend); if (b) c.textContent = dur(b.deadlineBase + 15 * T.MIN - T.now()); });
  }, 1000);
  T.on(rerender);
  T.startTicker(); T.demoPanel("khach"); route();
})();
