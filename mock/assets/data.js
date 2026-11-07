/* Toini mock – dữ liệu mẫu (giá trị tham khảo). Quán và địa chỉ là quán thật ở Đà Nẵng; giá, ưu đãi, số liệu là giá trị tham khảo cho demo. */
window.TOINI_SEED = {
  areas: ["Hải Châu", "Sơn Trà", "Ngũ Hành Sơn", "Thanh Khê"],
  types: {
    rooftop: { vi: "Rooftop bar", en: "Rooftop bar", ko: "루프탑 바", ru: "Руфтоп-бар", zh: "屋顶酒吧", ja: "ルーフトップバー", icon: "🌃" },
    club: { vi: "Club", en: "Club", ko: "클럽", ru: "Клуб", zh: "夜店", ja: "クラブ", icon: "🎧" },
    bar: { vi: "Bar / Pub", en: "Bar / Pub", ko: "바 / 펍", ru: "Бар / Паб", zh: "酒吧", ja: "バー / パブ", icon: "🍺" },
    nhau: { vi: "Quán nhậu", en: "Local eatery & beer", ko: "현지 술집", ru: "Местная пивная", zh: "当地餐酒馆", ja: "ローカル居酒屋", icon: "🦐" },
    karaoke: { vi: "Karaoke", en: "Karaoke", ko: "노래방", ru: "Караоке", zh: "KTV", ja: "カラオケ", icon: "🎤" },
    spa: { vi: "Spa & massage", en: "Spa & massage", ko: "스파 & 마사지", ru: "Спа и массаж", zh: "水疗按摩", ja: "スパ・マッサージ", icon: "💆" }
  },
  priceLevels: { 1: "₫", 2: "₫₫", 3: "₫₫₫", 4: "₫₫₫₫" },
  venues: [
    {
      id: "v1", slug: "sky36", name: "Sky36", type: "club", area: "Hải Châu",
      address: "Tầng 36, Novotel Danang Premier Han River, 36 Bạch Đằng, Hải Châu, Đà Nẵng",
      lat: 16.0776, lng: 108.2236, price: 4, hours: "18:00 – 02:00", entry: 0, minSpend: 5000000, priceFrom: 250000,
      priceUnit: "ly cocktail", taxNote: "chưa gồm 10% VAT và 5% phí phục vụ", dress: "Smart casual – không dép lê, không quần short (nam)", age: 18,
      tags: ["view", "dj", "card", "en_menu", "group"], rating: 4.6, reviews: 2310,
      imgs: ["sky36/01.jpg", "sky36/02.jpg", "sky36/03.jpg", "sky36/04.jpg", "sky36/05.jpg", "sky36/06.jpg", "sky36/07.jpg", "sky36/08.jpg"],
      credit: "Ảnh: sky36.vn",
      contact: { name: "Anh Minh (quản lý)", phone: "0905 000 036", contractNo: "HĐ-2026-001", from: "2026-10-01" },
      visible: true,
      tr: {
        vi: { desc: "Club trên tầng 36, một trong những rooftop cao nhất Việt Nam. Nhìn thẳng xuống sông Hàn và cầu Rồng, DJ quốc tế mỗi tối, sân khấu ánh sáng và hiệu ứng CO2 vào khung giờ cao điểm.", status: "approved" },
        en: { desc: "A club on the 36th floor – one of the highest rooftops in Vietnam. Overlooks the Han River and Dragon Bridge, international DJs every night, light shows and CO2 effects at peak hours.", status: "approved" },
        ko: { desc: "36층에 위치한 클럽으로 베트남에서 가장 높은 루프탑 중 하나입니다. 한강과 용다리가 내려다보이며 매일 밤 해외 DJ 공연이 열립니다.", status: "approved" }
      }
    },
    {
      id: "v2", slug: "brilliant-top-bar", name: "Brilliant Top Bar", type: "rooftop", area: "Hải Châu",
      address: "Tầng 17, Brilliant Hotel, 162 Bạch Đằng, Hải Châu, Đà Nẵng",
      lat: 16.0689, lng: 108.2246, price: 3, hours: "17:00 – 23:30", entry: 0, minSpend: 0, priceFrom: 150000,
      priceUnit: "ly cocktail", taxNote: "chưa gồm 10% VAT và 5% phí phục vụ", dress: "Lịch sự, không mặc đồ bơi", age: 0,
      tags: ["view", "live", "card", "en_menu"], rating: 4.5, reviews: 1180,
      imgs: ["brilliant/01.jpg", "brilliant/02.jpg", "brilliant/03.jpg", "brilliant/04.jpg", "brilliant/05.jpg"],
      credit: "Ảnh: brillianthotel.vn",
      contact: { name: "Chị Hạnh (F&B)", phone: "0905 000 162", contractNo: "HĐ-2026-002", from: "2026-10-05" },
      visible: true,
      tr: {
        vi: { desc: "Quầy bar trên tầng thượng khách sạn Brilliant, ngay bờ sông Hàn. Ngắm hoàng hôn và cầu Rồng phun lửa tối cuối tuần, nhạc acoustic từ 20:00.", status: "approved" },
        en: { desc: "Rooftop bar of Brilliant Hotel right on the Han River. Catch the sunset and the fire-breathing Dragon Bridge on weekend nights, acoustic music from 8 pm.", status: "approved" }
      }
    },
    {
      id: "v3", slug: "bamboo2-bar", name: "Bamboo2 Bar", type: "bar", area: "Hải Châu",
      address: "216 Bạch Đằng, Hải Châu, Đà Nẵng",
      lat: 16.066, lng: 108.2245, price: 2, hours: "10:00 – 02:00", entry: 0, minSpend: 0, priceFrom: 45000,
      priceUnit: "chai bia", taxNote: "đã gồm thuế", dress: "Thoải mái", age: 0,
      tags: ["sport", "live", "en_menu", "group", "pool"], rating: 4.4, reviews: 960,
      imgs: ["bamboo2/01.jpg", "bamboo2/02.jpg", "bamboo2/03.jpg", "bamboo2/04.jpg", "bamboo2/05.jpg", "bamboo2/06.jpg", "bamboo2/07.jpg", "bamboo2/08.jpg"],
      credit: "Ảnh: bamboo2bar.com",
      contact: { name: "Anh Tuấn", phone: "0905 000 216", contractNo: "HĐ-2026-003", from: "2026-10-10" },
      visible: true,
      tr: {
        vi: { desc: "Sports bar lâu năm trên đường Bạch Đằng, đông khách quốc tế. Chiếu bóng đá và thể thao trực tiếp, bàn bi-a, đồ ăn Âu – Việt và bia lạnh giá mềm.", status: "approved" },
        en: { desc: "A long-running sports bar on Bach Dang street, popular with international guests. Live football and sports, pool table, Western & Vietnamese food and cheap cold beer.", status: "approved" }
      }
    },
    {
      id: "v4", slug: "hai-san-be-man", name: "Hải sản Bé Mặn", type: "nhau", area: "Sơn Trà",
      address: "Lô 9 Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng",
      lat: 16.0715, lng: 108.2459, price: 2, hours: "08:30 – 22:30", entry: 0, minSpend: 0, priceFrom: 80000,
      priceUnit: "món", taxNote: "chưa gồm VAT", dress: "Thoải mái", age: 0,
      tags: ["group", "sea", "local"], rating: 4.3, reviews: 3420,
      imgs: ["bemann/01.jpg", "city/03.jpg"],
      credit: "Ảnh minh họa: Wikimedia Commons",
      contact: { name: "Chị Mặn", phone: "0905 000 009", contractNo: "HĐ-2026-004", from: "2026-10-12" },
      visible: true,
      tr: {
        vi: { desc: "Quán hải sản bình dân sát biển Mỹ Khê, sức chứa lớn, chọn hải sản tươi sống tại bể rồi chế biến theo ý. Giờ cao điểm 18:00 – 21:00 thường kín bàn, nên đặt trước.", status: "approved" },
        en: { desc: "A casual seafood spot next to My Khe beach with plenty of seats. Pick live seafood from the tanks and choose how it's cooked. Peak hours 6–9 pm are usually full – book ahead.", status: "approved" }
      }
    },
    {
      id: "v5", slug: "x8-ktv", name: "X8 KTV", type: "karaoke", area: "Sơn Trà",
      address: "02 Đinh Thị Hòa, Sơn Trà, Đà Nẵng",
      lat: 16.065, lng: 108.238, price: 3, hours: "14:00 – 24:00", entry: 0, minSpend: 0, priceFrom: 250000,
      priceUnit: "giờ / phòng", taxNote: "chưa gồm VAT", dress: "Thoải mái", age: 0,
      tags: ["group", "vip"], rating: 4.2, reviews: 410,
      imgs: ["x8ktv/01.jpg"],
      credit: "Ảnh minh họa: Wikimedia Commons",
      contact: { name: "Anh Long", phone: "0905 000 008", contractNo: "HĐ-2026-005", from: "2026-10-15" },
      visible: true,
      tr: {
        vi: { desc: "Karaoke 8 tầng với 10 phòng VIP, phòng lớn nhất chứa tới 50 người, có sân khấu và 2 màn hình lớn. Hợp cho sinh nhật, liên hoan công ty.", status: "approved" },
        en: { desc: "An 8-floor karaoke with 10 VIP rooms – the largest fits up to 50 people with a stage and two big screens. Great for birthdays and company parties.", status: "approved" }
      }
    },
    {
      id: "v6", slug: "herbal-spa", name: "Herbal Spa", type: "spa", area: "Sơn Trà",
      address: "201 Dương Đình Nghệ, An Hải Bắc, Sơn Trà, Đà Nẵng",
      lat: 16.061, lng: 108.242, price: 2, hours: "09:00 – 22:30", entry: 0, minSpend: 0, priceFrom: 450000,
      priceUnit: "liệu trình 60 phút", taxNote: "đã gồm thuế, chưa gồm tip", dress: "Không yêu cầu", age: 0,
      tags: ["card", "en_menu", "kids"], rating: 4.8, reviews: 5120,
      imgs: ["herbal/01.jpg", "herbal/02.jpg", "herbal/03.jpg", "herbal/04.jpg", "herbal/05.jpg", "herbal/06.jpg", "herbal/07.jpg"],
      credit: "Ảnh: herbalspa.vn",
      contact: { name: "Chị Thảo (lễ tân)", phone: "0905 000 201", contractNo: "HĐ-2026-006", from: "2026-10-20" },
      visible: true,
      tr: {
        vi: { desc: "Spa thảo dược hơn 10 năm ở Đà Nẵng. Massage đá nóng, massage chân, chăm sóc da; có khu nghỉ sau massage và khu chờ cho trẻ em. Đưa đón miễn phí trong bán kính 3 km.", status: "approved" },
        en: { desc: "A herbal spa with 10+ years in Da Nang. Hot stone massage, foot massage and facials; relaxing lounge after treatments and a kids' corner. Free pick-up within 3 km.", status: "approved" }
      }
    },
    {
      id: "v7", slug: "golden-lotus-spa", name: "Golden Lotus Spa", type: "spa", area: "Hải Châu",
      address: "209 Trần Phú, Phước Ninh, Hải Châu, Đà Nẵng",
      lat: 16.0665, lng: 108.222, price: 2, hours: "10:00 – 22:00", entry: 0, minSpend: 0, priceFrom: 400000,
      priceUnit: "liệu trình 60 phút", taxNote: "đã gồm thuế", dress: "Không yêu cầu", age: 0,
      tags: ["card", "en_menu"], rating: 4.7, reviews: 2890,
      imgs: ["goldenlotus/01.jpg", "goldenlotus/02.jpg", "goldenlotus/03.jpg"],
      credit: "Ảnh minh họa: Wikimedia Commons",
      contact: { name: "Chị Lan", phone: "0905 000 209", contractNo: "HĐ-2026-007", from: "2026-10-25" },
      visible: true,
      tr: {
        vi: { desc: "Spa phong cách phương Đông gần chợ Hàn: xông thảo dược, massage đá nóng, ép thảo mộc và tẩy da chết toàn thân. Khách vào lần cuối lúc 20:00.", status: "approved" },
        en: { desc: "Oriental-style spa near Han Market: herbal steam, hot stone massage, herbal compress and body scrub. Last entry 8 pm.", status: "approved" }
      }
    }
  ],
  /* Ưu đãi mẫu phủ cả ngày lẫn đêm (kể cả khung qua nửa đêm) để lúc nào demo cũng có ưu đãi "hôm nay" */
  offers: [
    { id: "o1", venueId: "v1", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "20:00", to: "02:00", until: "2026-12-31",
      tr: { vi: { title: "Tặng 1 tháp bia cho bàn từ 6 khách", cond: "Đặt qua Toini, áp dụng cả đêm", status: "approved" }, en: { title: "Free beer tower for tables of 6+", cond: "Book via Toini, valid all night", status: "approved" } } },
    { id: "o1b", venueId: "v1", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "18:00", to: "22:00", until: "2026-12-31",
      tr: { vi: { title: "Tặng 1 shot chào mừng mỗi khách", cond: "Tới trước 22:00, đưa màn hình ưu đãi cho nhân viên", status: "approved" }, en: { title: "Free welcome shot for every guest", cond: "Arrive before 10 pm and show the deal screen", status: "approved" } } },
    { id: "o2", venueId: "v2", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "17:00", to: "19:00", until: "2026-12-31",
      tr: { vi: { title: "Giờ vàng hoàng hôn: mua 1 tặng 1 cocktail", cond: "Áp dụng cocktail trong menu Signature", status: "approved" }, en: { title: "Sunset hour: buy 1 get 1 cocktail", cond: "Signature cocktail menu only", status: "approved" } } },
    { id: "o2b", venueId: "v2", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "21:00", to: "23:30", until: "2026-12-31",
      tr: { vi: { title: "Giảm 15% hóa đơn sau 21:00", cond: "Bàn từ 2 khách, không cộng dồn ưu đãi khác", status: "approved" }, en: { title: "15% off your bill after 9 pm", cond: "Tables of 2+, not combinable", status: "approved" } } },
    { id: "o3", venueId: "v3", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "16:00", to: "20:00", until: "2026-12-31",
      tr: { vi: { title: "Giảm 20% bia tháp giờ chiều", cond: "Tối đa 2 tháp mỗi bàn", status: "approved" }, en: { title: "20% off beer towers (afternoon)", cond: "Max 2 towers per table", status: "approved" } } },
    { id: "o3b", venueId: "v3", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "20:00", to: "02:00", until: "2026-12-31",
      tr: { vi: { title: "Mua 2 tặng 1 bia khi xem bóng đá", cond: "Trong giờ có trận chiếu trực tiếp", status: "approved" }, en: { title: "Buy 2 get 1 beer during live matches", cond: "While a match is on screen", status: "approved" } } },
    { id: "o4", venueId: "v4", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "10:00", to: "22:00", until: "2026-12-31",
      tr: { vi: { title: "Tặng đĩa nghêu hấp sả cho bàn từ 4 khách", cond: "Hóa đơn từ 800.000đ", status: "approved" }, en: { title: "Free steamed clams for tables of 4+", cond: "Bill from 800,000 VND", status: "approved" } } },
    { id: "o5", venueId: "v6", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "09:00", to: "16:00", until: "2026-12-31",
      tr: { vi: { title: "Giảm 15% liệu trình 90 phút buổi ngày", cond: "Đặt qua Toini, đến trước 16:00", status: "approved" }, en: { title: "15% off 90-min treatments (daytime)", cond: "Book via Toini, arrive before 4 pm", status: "approved" } } },
    { id: "o5b", venueId: "v6", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "16:00", to: "22:30", until: "2026-12-31",
      tr: { vi: { title: "Tặng 20 phút ngâm chân thảo dược", cond: "Khi làm liệu trình từ 60 phút", status: "approved" }, en: { title: "Free 20-min herbal foot soak", cond: "With any 60-min+ treatment", status: "approved" } } },
    { id: "o6", venueId: "v5", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "14:00", to: "18:00", until: "2026-12-31",
      tr: { vi: { title: "Tặng thêm 1 giờ hát khi đặt từ 2 giờ", cond: "Trước 18:00", status: "approved" }, en: { title: "Book 2 hours, get 1 more free", cond: "Before 6 pm", status: "approved" } } },
    { id: "o6b", venueId: "v5", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "21:00", to: "24:00", until: "2026-12-31",
      tr: { vi: { title: "Giảm 20% phòng VIP sau 21:00", cond: "Phòng từ 10 khách", status: "approved" }, en: { title: "20% off VIP rooms after 9 pm", cond: "Rooms for 10+ guests", status: "approved" } } },
    { id: "o7", venueId: "v7", active: true, days: [0, 1, 2, 3, 4, 5, 6], from: "10:00", to: "22:00", until: "2026-12-31",
      tr: { vi: { title: "Giảm 10% + tặng trà gừng", cond: "Mọi liệu trình, khách vào lần cuối 20:00", status: "approved" }, en: { title: "10% off + free ginger tea", cond: "All treatments, last entry 8 pm", status: "approved" } } }
  ],
  /* Sự kiện – ngày tính tương đối so với hôm nay (d = số ngày) */
  events: [
    { id: "e1", venueId: "v1", d: 0, from: "21:30", to: "01:00", img: "sky36/03.jpg", tags: ["dj"],
      tr: { vi: { title: "Night Shift – DJ quốc tế", desc: "DJ khách mời từ Seoul, sân khấu ánh sáng và hiệu ứng CO2 từ 23:00.", status: "approved" }, en: { title: "Night Shift – international DJ", desc: "Guest DJ from Seoul, light show and CO2 effects from 11 pm.", status: "approved" }, ko: { title: "나이트 시프트 – 해외 DJ", desc: "서울에서 온 게스트 DJ, 밤 11시부터 조명 쇼와 CO2 효과.", status: "approved" } } },
    { id: "e2", venueId: "v2", d: 0, from: "20:00", to: "22:00", img: "brilliant/01.jpg", tags: ["live"],
      tr: { vi: { title: "Acoustic hoàng hôn trên sông Hàn", desc: "Ban nhạc acoustic chơi nhạc Việt và pop quốc tế, nhìn thẳng ra cầu Rồng.", status: "approved" }, en: { title: "Sunset acoustic on the Han River", desc: "Acoustic band playing Vietnamese and international pop, facing Dragon Bridge.", status: "approved" } } },
    { id: "e3", venueId: "v3", d: 1, from: "19:00", to: "23:30", img: "bamboo2/05.jpg", tags: ["sport"],
      tr: { vi: { title: "Chiếu trực tiếp Ngoại hạng Anh", desc: "2 trận liên tiếp trên màn hình lớn, tháp bia giá đặc biệt trong giờ trận.", status: "approved" }, en: { title: "Premier League live screening", desc: "Two back-to-back matches on the big screen, special beer tower prices during the games.", status: "approved" } } },
    { id: "e4", venueId: "v5", d: 2, from: "20:00", to: "23:00", img: "x8ktv/01.jpg", tags: ["group"],
      tr: { vi: { title: "Karaoke Battle – giải 2 triệu", desc: "Thi hát theo nhóm, ban giám khảo là khách tại quán, nhóm thắng nhận 2 triệu tiền phòng.", status: "approved" }, en: { title: "Karaoke Battle – 2M VND prize", desc: "Group singing contest judged by the crowd; the winning group gets 2M VND room credit.", status: "approved" } } },
    { id: "e5", venueId: "v4", d: 3, from: "18:00", to: "21:00", img: "bemann/01.jpg", tags: ["live", "local"],
      tr: { vi: { title: "Đêm hải sản nướng & nhạc đường phố", desc: "Hải sản nướng tại bàn, nhóm nhạc đường phố chơi từ 19:00.", status: "approved" }, en: { title: "Grilled seafood & street music night", desc: "Table-side grilled seafood, street band from 7 pm.", status: "approved" } } },
    { id: "e6", venueId: "v6", d: 4, from: "16:00", to: "20:00", img: "herbal/04.jpg", tags: [],
      tr: { vi: { title: "Workshop xông thảo dược", desc: "Tìm hiểu cách pha thảo dược xông, tặng túi thảo dược mang về.", status: "approved" }, en: { title: "Herbal steam workshop", desc: "Learn how herbal steam blends are made; take a herbal pouch home.", status: "approved" } } },
    { id: "e7", venueId: "v1", d: 6, from: "22:00", to: "02:00", img: "sky36/05.jpg", tags: ["dj"],
      tr: { vi: { title: "Foam Party cuối tuần", desc: "Tiệc bọt xà phòng trên tầng 36, dress code trắng.", status: "approved" }, en: { title: "Weekend Foam Party", desc: "Foam party on the 36th floor, white dress code.", status: "approved" } } },
    { id: "e8", venueId: "v2", d: 9, from: "20:00", to: "22:30", img: "brilliant/03.jpg", tags: ["live"],
      tr: { vi: { title: "Saxophone Night", desc: "Saxophone và piano, cocktail signature giảm giá trong giờ biểu diễn.", status: "approved" }, en: { title: "Saxophone Night", desc: "Saxophone and piano, signature cocktails discounted during the show.", status: "approved" } } },
    { id: "e9", venueId: "v3", d: 13, from: "19:00", to: "23:00", img: "bamboo2/03.jpg", tags: ["sport", "live"],
      tr: { vi: { title: "Đêm nhạc rock & bi-a", desc: "Ban nhạc rock cover, giải bi-a mini cho khách.", status: "approved" }, en: { title: "Rock & pool night", desc: "Rock cover band and a mini pool tournament for guests.", status: "approved" } } },
    { id: "e10", venueId: "v1", d: -3, from: "22:00", to: "02:00", img: "sky36/06.jpg", tags: ["dj"],
      tr: { vi: { title: "Halloween Afterparty", desc: "Đã diễn ra.", status: "approved" }, en: { title: "Halloween Afterparty", desc: "Past event.", status: "approved" } } }
  ],
  /* Deal siêu hời – Toini tài trợ, trừ vào hoa hồng của đơn (có thể âm). type: pct = giảm % hóa đơn, amount = voucher số tiền */
  superDeals: [
    { id: "d1", venueId: "v1", type: "pct", value: 40, days: [0, 1, 2, 3, 4, 5, 6], from: "21:00", to: "02:00", until: "2026-12-31", limit: 50, active: true,
      tr: { vi: { title: "Giảm 40% hóa đơn – Toini tài trợ", cond: "Bàn từ 4 khách, đặt qua Toini, tới trong khung giờ deal", status: "approved" }, en: { title: "40% off your bill – sponsored by Toini", cond: "Tables of 4+, booked via Toini, arrive within the deal hours", status: "approved" } } },
    { id: "d2", venueId: "v3", type: "amount", value: 100000, days: [0, 1, 2, 3, 4, 5, 6], from: "18:00", to: "23:00", until: "2026-12-31", limit: 100, active: true,
      tr: { vi: { title: "Voucher 100K mỗi bàn", cond: "Trừ thẳng vào hóa đơn, hóa đơn từ 300K", status: "approved" }, en: { title: "100K VND voucher per table", cond: "Deducted from your bill, min. bill 300K", status: "approved" } } },
    { id: "d3", venueId: "v6", type: "pct", value: 30, days: [0, 1, 2, 3, 4, 5, 6], from: "10:00", to: "20:00", until: "2026-12-31", limit: 40, active: true,
      tr: { vi: { title: "Giảm 30% liệu trình – Toini tài trợ", cond: "Liệu trình từ 90 phút", status: "approved" }, en: { title: "30% off treatments – sponsored by Toini", cond: "Treatments of 90 min or more", status: "approved" } } },
    { id: "d4", venueId: "v5", type: "amount", value: 200000, days: [0, 1, 2, 3, 4, 5, 6], from: "18:00", to: "24:00", until: "2026-12-31", limit: 30, active: true,
      tr: { vi: { title: "Tặng 200K tiền phòng", cond: "Phòng từ 6 khách", status: "approved" }, en: { title: "200K VND room credit", cond: "Rooms for 6+ guests", status: "approved" } } }
  ],
  /* Đánh giá đã duyệt / chờ duyệt (d = số ngày trước) */
  reviews: [
    { venueId: "v1", name: "Park S.", lang: "ko", stars: 5, d: 3, text: "View sông Hàn ban đêm tuyệt đẹp, DJ chơi rất sung. Nhân viên nói tiếng Anh tốt.", photos: ["sky36/04.jpg"], status: "approved" },
    { venueId: "v1", name: "Emily R.", lang: "en", stars: 4, d: 8, text: "Great rooftop vibe, a bit pricey but worth it for the view. Booking through Toini was instant.", photos: [], status: "approved" },
    { venueId: "v1", name: "Trần Minh", lang: "vi", stars: 5, d: 12, text: "Đặt qua Toini có bàn đẹp gần sân khấu, được tặng tháp bia đúng như ưu đãi.", photos: [], status: "approved" },
    { venueId: "v2", name: "Olga P.", lang: "ru", stars: 5, d: 5, text: "Лучший закат в Дананге. Коктейли отличные.", photos: ["brilliant/02.jpg"], status: "approved" },
    { venueId: "v2", name: "Lê Hằng", lang: "vi", stars: 4, d: 9, text: "Nhạc acoustic dễ chịu, cocktail ổn, nên tới trước 18:00 để ngắm hoàng hôn.", photos: [], status: "approved" },
    { venueId: "v3", name: "Tom W.", lang: "en", stars: 4, d: 4, text: "Cold beer, football on every screen, friendly staff.", photos: ["bamboo2/04.jpg"], status: "approved" },
    { venueId: "v3", name: "Choi J.", lang: "ko", stars: 5, d: 10, text: "축구 보기 좋은 펍. 음식도 맛있어요.", photos: [], status: "approved" },
    { venueId: "v4", name: "Nguyễn Tài", lang: "vi", stars: 5, d: 2, text: "Hải sản tươi, giá niêm yết rõ, nhóm 8 người ngồi thoải mái.", photos: ["bemann/01.jpg"], status: "approved" },
    { venueId: "v4", name: "Wang L.", lang: "zh", stars: 4, d: 7, text: "海鲜新鲜，价格合理。", photos: [], status: "approved" },
    { venueId: "v5", name: "Phạm Bảo", lang: "vi", stars: 4, d: 6, text: "Phòng VIP rộng, âm thanh tốt, hợp đi sinh nhật.", photos: [], status: "approved" },
    { venueId: "v6", name: "Yuki T.", lang: "ja", stars: 5, d: 2, text: "とても丁寧なマッサージ。また来たいです。", photos: ["herbal/05.jpg"], status: "approved" },
    { venueId: "v6", name: "Sarah L.", lang: "en", stars: 5, d: 11, text: "Best hot stone massage I've had. Free pick-up was a nice touch.", photos: [], status: "approved" },
    { venueId: "v7", name: "Kim H.", lang: "ko", stars: 4, d: 3, text: "깨끗하고 친절해요. 생강차 맛있어요.", photos: [], status: "approved" },
    { venueId: "v7", name: "Anna I.", lang: "ru", stars: 5, d: 1, text: "Очень расслабляет, рекомендую!", photos: ["goldenlotus/01.jpg"], status: "pending" },
    { venueId: "v3", name: "Mike B.", lang: "en", stars: 2, d: 0, text: "Too loud and the staff ignored us for 20 minutes.", photos: ["bamboo2/02.jpg", "bamboo2/06.jpg"], status: "pending" }
  ],
  commissions: {
    v1: [{ rate: 12, from: "2026-10-01", by: "Giám đốc" }, { rate: 15, from: "2026-11-01", by: "Giám đốc" }],
    v2: [{ rate: 12, from: "2026-10-05", by: "Giám đốc" }], v3: [{ rate: 10, from: "2026-10-10", by: "Giám đốc" }],
    v4: [{ rate: 8, from: "2026-10-12", by: "Giám đốc" }], v5: [{ rate: 12, from: "2026-10-15", by: "Giám đốc" }],
    v6: [{ rate: 15, from: "2026-10-20", by: "Giám đốc" }], v7: [{ rate: 15, from: "2026-10-25", by: "Giám đốc" }]
  },
  shopAccounts: [
    { id: "sa1", username: "sky36.letan", name: "Lễ tân Sky36", email: "letan@sky36.example", password: "demo123", venueIds: ["v1"], locked: false, mustChange: false },
    { id: "sa2", username: "bachdang.group", name: "Quản lý chuỗi Bạch Đằng", email: "ql@bachdang.example", password: "demo123", venueIds: ["v1", "v2", "v3"], locked: false, mustChange: false },
    { id: "sa3", username: "beman.thungan", name: "Thu ngân Bé Mặn", email: "thungan@beman.example", password: "demo123", venueIds: ["v4"], locked: false, mustChange: true },
    { id: "sa4", username: "x8.quanly", name: "Quản lý X8", email: "ql@x8.example", password: "demo123", venueIds: ["v5"], locked: false, mustChange: false },
    { id: "sa5", username: "spa.letan", name: "Lễ tân spa", email: "letan@spa.example", password: "demo123", venueIds: ["v6", "v7"], locked: false, mustChange: false },
    { id: "sa6", username: "sky36.cu", name: "Nhân viên cũ Sky36", email: "cu@sky36.example", password: "demo123", venueIds: ["v1"], locked: true, mustChange: false }
  ],
  staff: [
    { id: "st1", username: "giamdoc", name: "Ngọc (Giám đốc)", role: "gd", password: "demo123", locked: false },
    { id: "st2", username: "cskh", name: "Vy (Sale/CSKH)", role: "cs", password: "demo123", locked: false },
    { id: "st3", username: "ketoan", name: "Hà (Kế toán)", role: "kt", password: "demo123", locked: false }
  ],
  settings: {
    caps: { zns: 500, sms: 200, perPhone: 5, perEmail: 5, perIp: 20 },
    otp: { len: 6, ttl: 5, max: 5, resend: 60 },
    closeDay: 1, closeHour: 12,
    rates: { USD: 25400, KRW: 18.5, RUB: 270, CNY: 3510, JPY: 168, at: "07/11/2026 08:00" },
    chat: [
      { k: "zalo", name: "Zalo", link: "https://zalo.me/toini-demo", langs: ["vi"] },
      { k: "kakao", name: "KakaoTalk", link: "https://open.kakao.com/o/toini-demo", langs: ["ko"] },
      { k: "whatsapp", name: "WhatsApp", link: "https://wa.me/84900000000", langs: ["en", "ru"] },
      { k: "line", name: "LINE", link: "https://line.me/R/ti/p/@toini-demo", langs: ["ja"] },
      { k: "wechat", name: "WeChat", link: "weixin://toini-demo", langs: ["zh"] },
      { k: "telegram", name: "Telegram", link: "https://t.me/toini_demo", langs: ["ru"] },
      { k: "messenger", name: "Messenger", link: "https://m.me/toini.demo", langs: [] }
    ],
    blocked: [{ v: "+84 999 999 999", kind: "phone", note: "Spam OTP 30/10" }],
    terms: "Điều khoản sử dụng và chính sách bảo mật của Toini (nội dung do Toini cung cấp – đây là văn bản giữ chỗ cho bản mock)."
  },
  templates: [
    { k: "otp", ch: "ZNS/SMS/Email", vi: "Toini: Ma xac minh cua ban la {code}. Hieu luc 5 phut.", status: "Đã duyệt (Zalo, nhà mạng)" },
    { k: "received", ch: "ZNS/SMS/Email", vi: "Toini: Da nhan don {code} tai {venue} luc {time}. Cho quan xac nhan.", status: "Đã duyệt" },
    { k: "confirmed", ch: "ZNS/SMS/Email", vi: "Toini: {venue} da xac nhan don {code} luc {time}. Xem: toini.vn/b/{code}", status: "Đã duyệt" },
    { k: "rejected", ch: "ZNS/SMS/Email", vi: "Toini: {venue} chua nhan duoc don {code}. Ly do: {reason}.", status: "Đã duyệt" },
    { k: "expired", ch: "ZNS/SMS/Email", vi: "Toini: Don {code} da tu huy do quan chua phan hoi. Goi y quan khac: toini.vn", status: "Đã duyệt" },
    { k: "changed", ch: "ZNS/SMS/Email", vi: "Toini: Don {code} doi sang {time}. Cho quan xac nhan lai.", status: "Đang chờ Zalo duyệt" },
    { k: "cancelled", ch: "ZNS/SMS/Email", vi: "Toini: Don {code} da huy theo yeu cau.", status: "Đã duyệt" },
    { k: "review", ch: "Email", vi: "Cảm ơn bạn đã tới {venue} qua Toini! Chia sẻ đánh giá của bạn: toini.vn/b/{code}", status: "Email – Toini tự sửa" }
  ]
};

/* Chữ giao diện web khách – 6 ngôn ngữ (bản dịch giao diện do Toini cung cấp; đây là bản tham khảo) */
window.TOINI_I18N = {
  langs: [["vi", "Tiếng Việt"], ["en", "English"], ["ko", "한국어"], ["ru", "Русский"], ["zh", "中文"], ["ja", "日本語"]],
  t: {
    tagline: { vi: "Tối ni đi mô?", en: "Where to tonight?", ko: "오늘 밤 어디 갈까?", ru: "Куда сегодня вечером?", zh: "今晚去哪儿？", ja: "今夜はどこへ？" },
    sub: { vi: "Bar, rooftop, club, karaoke, quán nhậu và spa ở Đà Nẵng. Giá rõ ràng, đặt bàn 1 phút, không mất phí.", en: "Bars, rooftops, clubs, karaoke, local eateries and spas in Da Nang. Clear prices, book in 1 minute, no fee.", ko: "다낭의 바, 루프탑, 클럽, 노래방, 현지 술집, 스파. 가격 투명, 1분 예약, 수수료 없음.", ru: "Бары, руфтопы, клубы, караоке, местные пивные и спа Дананга. Честные цены, бронь за 1 минуту, без комиссии.", zh: "岘港的酒吧、屋顶、夜店、KTV、餐酒馆和水疗。价格透明，1分钟预订，免手续费。", ja: "ダナンのバー、ルーフトップ、クラブ、カラオケ、居酒屋、スパ。明朗価格、1分で予約、手数料なし。" },
    search: { vi: "Tìm theo tên quán…", en: "Search venue name…", ko: "업체 이름 검색…", ru: "Поиск по названию…", zh: "搜索店名…", ja: "店名で検索…" },
    all: { vi: "Tất cả", en: "All", ko: "전체", ru: "Все", zh: "全部", ja: "すべて" },
    area: { vi: "Khu vực", en: "Area", ko: "지역", ru: "Район", zh: "区域", ja: "エリア" },
    type: { vi: "Loại hình", en: "Type", ko: "유형", ru: "Тип", zh: "类型", ja: "タイプ" },
    price: { vi: "Mức giá", en: "Price", ko: "가격대", ru: "Цены", zh: "价位", ja: "価格帯" },
    openOnly: { vi: "Còn nhận khách tối nay", en: "Taking guests tonight", ko: "오늘 밤 예약 가능", ru: "Принимает сегодня", zh: "今晚可预订", ja: "今夜予約可" },
    open: { vi: "Còn nhận khách", en: "Taking guests", ko: "예약 가능", ru: "Есть места", zh: "可预订", ja: "予約可" },
    closed: { vi: "Tối nay đã kín", en: "Full tonight", ko: "오늘 밤 마감", ru: "Сегодня мест нет", zh: "今晚已满", ja: "今夜は満席" },
    from: { vi: "Từ", en: "From", ko: "최저", ru: "От", zh: "起价", ja: "から" },
    venues: { vi: "quán", en: "venues", ko: "곳", ru: "заведений", zh: "家", ja: "件" },
    noResult: { vi: "Không có quán nào khớp. Thử bỏ bớt bộ lọc.", en: "No venues match. Try removing some filters.", ko: "조건에 맞는 곳이 없습니다. 필터를 줄여 보세요.", ru: "Ничего не найдено. Уберите часть фильтров.", zh: "没有符合的店，请减少筛选条件。", ja: "該当なし。条件を減らしてください。" },
    deals: { vi: "Ưu đãi khi đặt qua Toini", en: "Deals when you book via Toini", ko: "Toini 예약 혜택", ru: "Акции при брони через Toini", zh: "通过Toini预订的优惠", ja: "Toini予約特典" },
    book: { vi: "Đặt bàn", en: "Book a table", ko: "예약하기", ru: "Забронировать", zh: "预订", ja: "予約する" },
    grab: { vi: "Đi Grab", en: "Grab there", ko: "Grab 호출", ru: "Вызвать Grab", zh: "叫Grab", ja: "Grabで行く" },
    directions: { vi: "Chỉ đường", en: "Directions", ko: "길찾기", ru: "Маршрут", zh: "导航", ja: "経路" },
    hours: { vi: "Giờ mở cửa", en: "Opening hours", ko: "영업시간", ru: "Часы работы", zh: "营业时间", ja: "営業時間" },
    entry: { vi: "Phí vào cửa", en: "Entry fee", ko: "입장료", ru: "Вход", zh: "入场费", ja: "入場料" },
    free: { vi: "Miễn phí", en: "Free", ko: "무료", ru: "Бесплатно", zh: "免费", ja: "無料" },
    minSpend: { vi: "Chi tiêu tối thiểu", en: "Minimum spend", ko: "최소 주문", ru: "Мин. чек", zh: "最低消费", ja: "最低利用額" },
    none: { vi: "Không có", en: "None", ko: "없음", ru: "Нет", zh: "无", ja: "なし" },
    tax: { vi: "Thuế & phí", en: "Tax & service", ko: "세금 및 봉사료", ru: "Налоги и сбор", zh: "税费", ja: "税・サービス料" },
    dress: { vi: "Dress code", en: "Dress code", ko: "드레스 코드", ru: "Дресс-код", zh: "着装要求", ja: "ドレスコード" },
    age: { vi: "Giới hạn tuổi", en: "Age limit", ko: "연령 제한", ru: "Возраст", zh: "年龄限制", ja: "年齢制限" },
    noAge: { vi: "Không giới hạn", en: "No limit", ko: "제한 없음", ru: "Без ограничений", zh: "不限", ja: "制限なし" },
    photos: { vi: "ảnh", en: "photos", ko: "장", ru: "фото", zh: "张照片", ja: "枚" },
    viewAll: { vi: "Xem tất cả ảnh", en: "View all photos", ko: "사진 모두 보기", ru: "Все фото", zh: "查看全部照片", ja: "写真をすべて見る" },
    location: { vi: "Vị trí", en: "Location", ko: "위치", ru: "Расположение", zh: "位置", ja: "場所" },
    about: { vi: "Giới thiệu", en: "About", ko: "소개", ru: "О заведении", zh: "简介", ja: "紹介" },
    priceInfo: { vi: "Giá & quy định", en: "Prices & rules", ko: "가격 및 규정", ru: "Цены и правила", zh: "价格与规定", ja: "料金・ルール" },
    date: { vi: "Tối nào", en: "Which night", ko: "날짜", ru: "Дата", zh: "日期", ja: "日付" },
    time: { vi: "Giờ đến", en: "Arrival time", ko: "도착 시간", ru: "Время", zh: "到达时间", ja: "到着時間" },
    pax: { vi: "Số khách", en: "Guests", ko: "인원", ru: "Гостей", zh: "人数", ja: "人数" },
    note: { vi: "Ghi chú", en: "Note", ko: "메모", ru: "Комментарий", zh: "备注", ja: "メモ" },
    name: { vi: "Tên của bạn", en: "Your name", ko: "이름", ru: "Ваше имя", zh: "您的姓名", ja: "お名前" },
    phone: { vi: "Số điện thoại", en: "Phone number", ko: "전화번호", ru: "Телефон", zh: "电话", ja: "電話番号" },
    email: { vi: "Email", en: "Email", ko: "이메일", ru: "Email", zh: "电子邮件", ja: "メール" },
    contactRule: { vi: "Cần số điện thoại hoặc email (ít nhất 1). Số nước ngoài cần thêm email.", en: "Phone or email required (at least one). Foreign numbers also need an email.", ko: "전화번호 또는 이메일 중 하나 이상 필요. 해외 번호는 이메일도 필요합니다.", ru: "Нужен телефон или email (хотя бы одно). Для иностранного номера нужен email.", zh: "至少填写电话或邮箱之一。境外号码还需填写邮箱。", ja: "電話かメールのどちらか必須。海外番号はメールも必要です。" },
    agree: { vi: "Tôi đồng ý Điều khoản sử dụng và Chính sách bảo mật", en: "I agree to the Terms of Use and Privacy Policy", ko: "이용약관 및 개인정보 처리방침에 동의합니다", ru: "Я принимаю Условия и Политику конфиденциальности", zh: "我同意使用条款和隐私政策", ja: "利用規約とプライバシーポリシーに同意します" },
    sendCode: { vi: "Gửi mã xác minh", en: "Send verification code", ko: "인증번호 받기", ru: "Получить код", zh: "发送验证码", ja: "認証コードを送信" },
    verify: { vi: "Xác minh", en: "Verify", ko: "인증", ru: "Подтвердить", zh: "验证", ja: "認証" },
    enterCode: { vi: "Nhập mã 6 số", en: "Enter the 6-digit code", ko: "6자리 코드 입력", ru: "Введите 6-значный код", zh: "输入6位验证码", ja: "6桁のコードを入力" },
    resend: { vi: "Gửi lại mã", en: "Resend code", ko: "재전송", ru: "Отправить снова", zh: "重新发送", ja: "再送信" },
    sentVia: { vi: "Đã gửi mã qua", en: "Code sent via", ko: "코드 전송:", ru: "Код отправлен через", zh: "验证码已通过以下方式发送：", ja: "コード送信先：" },
    noFee: { vi: "Không mất phí đặt bàn. Trả tiền tại quán.", en: "No booking fee. Pay at the venue.", ko: "예약 수수료 없음. 현장 결제.", ru: "Без комиссии. Оплата на месте.", zh: "免预订费，到店付款。", ja: "予約手数料なし。お支払いは店頭で。" },
    myBookings: { vi: "Đơn của tôi", en: "My bookings", ko: "내 예약", ru: "Мои брони", zh: "我的预订", ja: "予約一覧" },
    lookup: { vi: "Tra cứu đơn", en: "Find booking", ko: "예약 조회", ru: "Найти бронь", zh: "查询预订", ja: "予約照会" },
    code: { vi: "Mã đặt chỗ", en: "Booking code", ko: "예약 번호", ru: "Код брони", zh: "预订码", ja: "予約番号" },
    phoneOrEmail: { vi: "SĐT hoặc email đã dùng khi đặt", en: "Phone or email used for booking", ko: "예약 시 사용한 전화번호 또는 이메일", ru: "Телефон или email из брони", zh: "预订时使用的电话或邮箱", ja: "予約時の電話番号またはメール" },
    find: { vi: "Tìm đơn", en: "Find", ko: "조회", ru: "Найти", zh: "查询", ja: "検索" },
    notFound: { vi: "Không tìm thấy đơn. Kiểm tra lại mã và thông tin liên hệ.", en: "Booking not found. Check the code and contact.", ko: "예약을 찾을 수 없습니다.", ru: "Бронь не найдена.", zh: "未找到预订。", ja: "予約が見つかりません。" },
    changeTime: { vi: "Đổi giờ", en: "Change time", ko: "시간 변경", ru: "Изменить время", zh: "改时间", ja: "時間変更" },
    cancel: { vi: "Hủy đơn", en: "Cancel booking", ko: "예약 취소", ru: "Отменить", zh: "取消预订", ja: "キャンセル" },
    arrived: { vi: "Tôi đã tới quán", en: "I'm at the venue", ko: "도착했어요", ru: "Я на месте", zh: "我已到店", ja: "到着しました" },
    showStaff: { vi: "Đưa màn hình này cho nhân viên quán", en: "Show this screen to the staff", ko: "이 화면을 직원에게 보여주세요", ru: "Покажите этот экран персоналу", zh: "请向店员出示此页面", ja: "この画面をスタッフに見せてください" },
    yourDeal: { vi: "Ưu đãi của bạn", en: "Your deal", ko: "내 혜택", ru: "Ваша акция", zh: "您的优惠", ja: "あなたの特典" },
    chat: { vi: "Nhắn Toini", en: "Chat with Toini", ko: "Toini 채팅", ru: "Чат с Toini", zh: "联系Toini", ja: "Toiniに連絡" },
    chatPick: { vi: "Chọn ứng dụng chat bạn dùng", en: "Pick the chat app you use", ko: "사용하는 채팅 앱을 선택하세요", ru: "Выберите мессенджер", zh: "选择您使用的聊天应用", ja: "使っているチャットアプリを選択" },
    st_pending: { vi: "Chờ quán xác nhận", en: "Waiting for venue", ko: "업체 확인 대기", ru: "Ждём подтверждения", zh: "等待店家确认", ja: "店舗確認待ち" },
    st_confirmed: { vi: "Đã xác nhận", en: "Confirmed", ko: "확정", ru: "Подтверждено", zh: "已确认", ja: "確定" },
    st_rejected: { vi: "Quán từ chối", en: "Declined by venue", ko: "업체 거절", ru: "Отклонено", zh: "店家拒绝", ja: "店舗が辞退" },
    st_expired: { vi: "Quá hạn – đã tự hủy", en: "Expired – auto-cancelled", ko: "기한 만료 – 자동 취소", ru: "Истекло – отменено", zh: "已超时自动取消", ja: "期限切れ・自動キャンセル" },
    st_cancelled: { vi: "Đã hủy", en: "Cancelled", ko: "취소됨", ru: "Отменено", zh: "已取消", ja: "キャンセル済み" },
    st_arrived: { vi: "Đã tới quán", en: "Arrived", ko: "도착", ru: "На месте", zh: "已到店", ja: "到着済み" },
    st_no_show: { vi: "Không đến", en: "No-show", ko: "노쇼", ru: "Не пришли", zh: "未到店", ja: "来店なし" },
    st_billed: { vi: "Đã tới quán", en: "Arrived", ko: "도착", ru: "На месте", zh: "已到店", ja: "到着済み" },
    st_settled: { vi: "Đã tới quán", en: "Arrived", ko: "도착", ru: "На месте", zh: "已到店", ja: "到着済み" },
    pendingHint: { vi: "Quán thường phản hồi trong 15 phút. Bạn sẽ nhận tin báo kết quả, hoặc tự xem lại tại trang này.", en: "Venues usually reply within 15 minutes. You'll get a message, or check back on this page.", ko: "보통 15분 내 답변합니다. 메시지를 받거나 이 페이지에서 확인하세요.", ru: "Обычно ответ в течение 15 минут. Придёт сообщение, или проверьте эту страницу.", zh: "店家通常15分钟内回复。您会收到通知，也可在本页查看。", ja: "通常15分以内に返信があります。通知またはこのページで確認できます。" },
    reason: { vi: "Lý do", en: "Reason", ko: "사유", ru: "Причина", zh: "原因", ja: "理由" },
    otherVenues: { vi: "Xem quán khác còn nhận khách", en: "See other venues taking guests", ko: "다른 업체 보기", ru: "Другие заведения", zh: "查看其他可预订的店", ja: "他の店を見る" },
    back: { vi: "Quay lại", en: "Back", ko: "뒤로", ru: "Назад", zh: "返回", ja: "戻る" },
    rateNote: { vi: "Giá quy đổi chỉ để tham khảo. Tỷ giá cập nhật lúc", en: "Converted prices are for reference. Rates updated", ko: "환산 가격은 참고용입니다. 환율 업데이트:", ru: "Пересчёт справочный. Курс от", zh: "换算价格仅供参考。汇率更新于", ja: "換算価格は参考値です。為替更新：" },
    tonight: { vi: "Tối nay", en: "Tonight", ko: "오늘 밤", ru: "Сегодня", zh: "今晚", ja: "今夜" },
    tagsTitle: { vi: "Tiện ích", en: "Highlights", ko: "특징", ru: "Особенности", zh: "特色", ja: "特徴" }
  },
  tags: {
    view: { vi: "View sông Hàn", en: "River view", ko: "리버뷰", ru: "Вид на реку", zh: "河景", ja: "リバービュー" },
    dj: { vi: "DJ", en: "DJ", ko: "DJ", ru: "DJ", zh: "DJ", ja: "DJ" },
    live: { vi: "Nhạc sống", en: "Live music", ko: "라이브 음악", ru: "Живая музыка", zh: "现场音乐", ja: "生演奏" },
    card: { vi: "Nhận thẻ", en: "Cards accepted", ko: "카드 가능", ru: "Карты", zh: "可刷卡", ja: "カード可" },
    en_menu: { vi: "Menu tiếng Anh", en: "English menu", ko: "영어 메뉴", ru: "Меню на англ.", zh: "英文菜单", ja: "英語メニュー" },
    group: { vi: "Hợp nhóm đông", en: "Good for groups", ko: "단체 가능", ru: "Для компаний", zh: "适合聚会", ja: "団体向け" },
    sport: { vi: "Chiếu thể thao", en: "Live sports", ko: "스포츠 중계", ru: "Спорт", zh: "体育直播", ja: "スポーツ中継" },
    pool: { vi: "Bi-a", en: "Pool table", ko: "당구", ru: "Бильярд", zh: "台球", ja: "ビリヤード" },
    sea: { vi: "Gần biển", en: "Near the beach", ko: "해변 근처", ru: "У моря", zh: "近海滩", ja: "ビーチ近く" },
    local: { vi: "Đậm chất địa phương", en: "Local favourite", ko: "현지인 맛집", ru: "Местный колорит", zh: "本地人最爱", ja: "地元の人気店" },
    vip: { vi: "Phòng VIP", en: "VIP rooms", ko: "VIP룸", ru: "VIP-комнаты", zh: "VIP包间", ja: "VIPルーム" },
    kids: { vi: "Có chỗ cho trẻ em", en: "Kids' corner", ko: "키즈존", ru: "Детский уголок", zh: "儿童区", ja: "キッズスペース" }
  }
};
