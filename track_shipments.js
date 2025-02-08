// 配送業者ごとのURLテンプレート
const CARRIER_URLS = {
  japanpost:
    "https://trackings.post.japanpost.jp/services/srv/search/direct?searchKind=S002&locale=ja&reqCodeNo1={number}",
  sagawa: "https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo={number}",
  yamato: "https://map.yahoo.co.jp/delivery?number={number}&fr=yamato_tracking_ymap",
};

// リンクのスタイル
const LINK_STYLES = {
  padding: "7px 6px 0",
  borderRadius: "4px",
  backgroundColor: "#e3f2fd",
  transition: "all 0.2s ease",
  display: "inline-flex",
  border: "1px solid #90caf9",
};

const LINK_HOVER_STYLES = {
  backgroundColor: "#bbdefb",
  textDecoration: "none",
  cursor: "pointer",
};

// 配送業者の表示名
const carrierNames = {
  japanpost: "日本郵便",
  sagawa: "佐川急便",
  yamato: "ヤマト運輸",
};

/**
 * 対象要素をリンク化する
 * すでにリンク化済み（親や先祖にリンクがある）であればスキップする
 */
function linkifyTrackingNumberElement(element, carrier) {
  // すでに作成したリンク（data-tracking-linkを付与している）に
  // 要素が含まれていれば何もしない
  if (element.closest("a[data-tracking-link]")) {
    return;
  }

  const number = element.textContent.trim();
  // 数字だけのとき以外はスキップする（例: "1234567890" は可、"AB123" や空文字は不可）
  if (!/^\d+$/.test(number)) {
    return;
  }

  const urlTemplate = CARRIER_URLS[carrier] || CARRIER_URLS.japanpost;
  const link = document.createElement("a");
  link.href = urlTemplate.replace("{number}", number);
  link.target = "_blank";
  link.setAttribute("data-tracking-link", "true"); // 「このリンクは追跡リンクである」マーカー

  // スタイルを適用
  Object.assign(link.style, LINK_STYLES);

  // ホバー効果の設定
  link.addEventListener("mouseenter", () => {
    Object.assign(link.style, LINK_HOVER_STYLES);
  });
  link.addEventListener("mouseleave", () => {
    Object.assign(link.style, LINK_STYLES);
  });

  // ツールチップ
  link.title = `${carrierNames[carrier] || carrierNames.japanpost}で追跡する`;

  // アイコンを先頭に追加
  const icon = document.createElement("span");
  icon.textContent = "📦";
  icon.style.fontSize = "14px";
  icon.style.marginRight = "2px";
  link.insertBefore(icon, null);

  // 元の要素の属性をコピー（style属性は除外）
  Array.from(element.attributes).forEach((attr) => {
    if (attr.name !== "style") {
      link.setAttribute(attr.name, attr.value);
    }
  });

  // リンクで要素をラップ
  element.parentNode.insertBefore(link, element);
  link.appendChild(element);

  // テキストの色を調整
  element.style.color = "#1976d2";
}

/**
 * ページ内の [data-sort-column="shippingNumber"] をリンク化
 */
function addTrackingLinks() {
  chrome.storage.sync.get("defaultCarrier", (result) => {
    const carrier = result.defaultCarrier || "japanpost";
    const elements = document.querySelectorAll('[data-sort-column="shippingNumber"]');
    elements.forEach((element) => linkifyTrackingNumberElement(element, carrier));
  });
}

/**
 * 指定した遅延時間のあとにリンク処理を実行
 */
function addLinksWithDelay(delay) {
  setTimeout(() => {
    addTrackingLinks();
  }, delay);
}

// 遅延ロードを想定して、複数のタイミングで実行
addLinksWithDelay(100); // 0.1秒後
addLinksWithDelay(500); // 0.5秒後
addLinksWithDelay(1000); // 1秒後
addLinksWithDelay(3000); // 3秒後
addLinksWithDelay(5000); // 5秒後
