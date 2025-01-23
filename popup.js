document.addEventListener("DOMContentLoaded", () => {
  const saveToAddressBookCheckbox = document.getElementById("saveToAddressBook");
  const contentItemsTextarea = document.getElementById("contentItems");

  // チェックボックスと内容品の初期状態をChromeのストレージから読み込む
  chrome.storage.sync.get(["saveToAddressBook", "contentItems"], (data) => {
    saveToAddressBookCheckbox.checked = data.saveToAddressBook || false;
    contentItemsTextarea.value = data.contentItems || "";
  });

  // チェックボックスの状態が変わったら保存する
  saveToAddressBookCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({ saveToAddressBook: saveToAddressBookCheckbox.checked });
    document.getElementById("status").innerText = "設定が保存されました。";
  });

  // テキストエリアの内容が変更されたら保存する
  contentItemsTextarea.addEventListener("input", () => {
    chrome.storage.sync.set({ contentItems: contentItemsTextarea.value });
    document.getElementById("status").innerText = "内容品が保存されました。";
  });
});
