// ボタンを追加する関数
function addCopyButton() {
  const targetElement = document.querySelector("#rms-content-order-details-block-destination-1-1-options");

  if (targetElement) {
    // ボタンの作成
    const copyButton = document.createElement("button");
    copyButton.innerText = "名前と住所をコピー";
    copyButton.style.position = "absolute";
    copyButton.style.left = "94px";
    copyButton.style.top = "3px";
    copyButton.style.zIndex = "10";

    // ボタンのクリックイベント
    copyButton.addEventListener("click", () => {
      const fullname = document.querySelector(
        "#rms-content-order-details-block-destination-1-1-options .fullname"
      ).innerText;
      const address = document.querySelector(
        "#rms-content-order-details-block-destination-1-1-options .address"
      ).innerText;
      const textToCopy = `${fullname} ${address}`;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showToast({
            message: "クリップボードにコピーされました。",
            linkText: "クリックポストを開く",
            linkUrl: "https://clickpost.jp/mypage/index",
          });
        })
        .catch((err) => {
          showToast({ message: "コピーに失敗しました: " + err });
        });
    });

    // 送付先情報の近くにボタンを追加
    targetElement.insertBefore(copyButton, targetElement.firstChild);

    // 画面読み込み後1秒経過後に「crm-purchases-count」要素の回数をチェック
    setTimeout(() => {
      const countElement = document.querySelector(".crm-purchases-count");
      if (countElement) {
        // 例: "1回" や "2回" のような文字列から数字のみを抽出
        const count = parseInt(countElement.innerText.replace(/[^0-9]/g, ""), 10);
        if (count >= 2) {
          countElement.style.fontSize = "100px";
          countElement.style.fontWeight = "bold";
          countElement.style.display = "block";
        }
      }
    }, 1000);
  }
}

// ページの読み込み完了時にボタンを追加
window.addEventListener("load", addCopyButton);
