const CARRIER_URLS = {
  japanpost:
    "https://trackings.post.japanpost.jp/services/srv/search/direct?searchKind=S002&locale=ja&reqCodeNo1={number}",
  sagawa: "https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo={number}",
  yamato: "https://map.yahoo.co.jp/delivery?number={number}&fr=yamato_tracking_ymap",
};

document.addEventListener("DOMContentLoaded", () => {
  const saveToAddressBookCheckbox = document.getElementById("saveToAddressBook");
  const contentItemsTextarea = document.getElementById("contentItems");
  const defaultCarrierSelect = document.getElementById("defaultCarrier");

  // 全ての設定をChromeのストレージから読み込む
  chrome.storage.sync.get(["saveToAddressBook", "contentItems", "defaultCarrier"], (data) => {
    saveToAddressBookCheckbox.checked = data.saveToAddressBook || false;
    contentItemsTextarea.value = data.contentItems || "";
    defaultCarrierSelect.value = data.defaultCarrier || "";
  });

  // チェックボックスの状態が変わったら保存する
  saveToAddressBookCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({ saveToAddressBook: saveToAddressBookCheckbox.checked });
    showStatus("設定が保存されました。");
  });

  // テキストエリアの内容が変更されたら保存する
  contentItemsTextarea.addEventListener("input", () => {
    chrome.storage.sync.set({ contentItems: contentItemsTextarea.value });
    showStatus("内容品が保存されました。");
  });

  // 配送業者の選択が変更されたら保存する
  defaultCarrierSelect.addEventListener("change", () => {
    chrome.storage.sync.set({ defaultCarrier: defaultCarrierSelect.value });
    showStatus("デフォルトの配送業者が保存されました。");
  });

  // ステータスメッセージを表示して3秒後に消す
  function showStatus(message) {
    const status = document.getElementById("status");
    status.innerText = message;
    setTimeout(() => {
      status.innerText = "";
    }, 3000);
  }
});

// Content Script用の処理を追加
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTrackingUrl") {
    chrome.storage.sync.get("defaultCarrier", (data) => {
      const carrier = data.defaultCarrier || "japanpost"; // デフォルトは日本郵便
      const url = CARRIER_URLS[carrier];
      sendResponse({ url: url });
    });
    return true; // 非同期レスポンスのために必要
  }
});
