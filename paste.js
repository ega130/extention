function formatAddress(address) {
  const maxLength = 20; // 全角20文字 (半角40文字) の制限
  let result = "";
  let currentLine = "";

  for (let i = 0; i < address.length; i++) {
    const char = address[i];
    currentLine += char;

    if ([...currentLine].length > maxLength) {
      const lastSpaceIndex = currentLine.lastIndexOf(" ");
      if (lastSpaceIndex !== -1) {
        result += currentLine.slice(0, lastSpaceIndex).trim() + "\n";
        currentLine = currentLine.slice(lastSpaceIndex + 1);
      } else {
        result += currentLine.trim() + "\n";
        currentLine = "";
      }
    }
  }

  if (currentLine.length > 0) {
    result += currentLine.trim();
  }

  return result;
}

function pasteClipboardData() {
  navigator.clipboard
    .readText()
    .then((text) => {
      const fullnameMatch = text.match(/^[^\d〒]+/);
      const zipMatch = text.match(/〒\d{3}-?\d{4}/);
      const addressMatch = text.match(/〒\d{3}-?\d{4}\s+(.+)/);
      const fullname = fullnameMatch ? fullnameMatch[0].trim() : "";
      const zip = zipMatch ? zipMatch[0].replace("〒", "").trim() : "";
      const address = addressMatch ? addressMatch[1].trim() : "";

      document.getElementById("zip").value = zip;
      document.getElementById("package_receiver_address").value = formatAddress(address);
      document.getElementById("package_receiver_name").value = fullname;

      chrome.storage.sync.get(["saveToAddressBook"], (result) => {
        document.getElementById("package_save_address").checked = result.saveToAddressBook || false;
      });

      chrome.storage.sync.get(["contentItems"], (result) => {
        document.getElementById("package_print_title").value = result.contentItems || "";
      });

      showToast({ message: "クリップボードのデータが貼り付けられました。" });
    })
    .catch((err) => {
      console.error("クリップボードの読み取りに失敗しました: ", err);
    });
}

function addPasteButton() {
  const targetElement = document.getElementById("content");
  const inputFields = [
    document.getElementById("zip"),
    document.getElementById("package_receiver_address"),
    document.getElementById("package_receiver_name"),
    document.getElementById("package_save_address"),
    document.getElementById("package_print_title"),
  ];

  if (targetElement && inputFields.every((e) => !!e) && !document.getElementById("pasteButton")) {
    // ボタンがすでに存在しないか確認
    const pasteButton = document.createElement("div");

    pasteButton.id = "pasteButton";
    pasteButton.innerText = "クリップボードから貼り付け";

    pasteButton.style.margin = "10px";
    pasteButton.style.padding = "10px 20px";
    pasteButton.style.fontSize = "14px";
    pasteButton.style.color = "#ffffff";
    pasteButton.style.backgroundColor = "#4CAF50";
    pasteButton.style.border = "none";
    pasteButton.style.borderRadius = "5px";
    pasteButton.style.cursor = "pointer";
    pasteButton.style.boxShadow = "0 4px #999";
    pasteButton.style.width = "181px";

    pasteButton.onmouseover = function () {
      pasteButton.style.backgroundColor = "#45a049";
    };
    pasteButton.onmouseout = function () {
      pasteButton.style.backgroundColor = "#4CAF50";
    };

    pasteButton.addEventListener("click", pasteClipboardData);

    targetElement.appendChild(pasteButton);
  }
}

// 指定された時間後にボタンを表示する
function addButtonWithDelay(delay) {
  setTimeout(() => {
    // ボタンが既に存在しているか確認
    if (!document.getElementById("pasteButton")) {
      addPasteButton();
    }
  }, delay);
}

// 各タイミングでボタンを追加
addButtonWithDelay(100); // 0.1秒後
addButtonWithDelay(500); // 0.5秒後
addButtonWithDelay(1000); // 1秒後
addButtonWithDelay(3000); // 3秒後
addButtonWithDelay(5000); // 5秒後
