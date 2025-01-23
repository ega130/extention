// Toastメッセージ用のCSSを追加
const style = document.createElement("style");
style.innerHTML = `
  .custom-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #48BB78;
    color: white;
    font-size: 16px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease, top 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .custom-toast.show {
    opacity: 1;
    top: 40px;
  }
  .custom-toast button {
    background: transparent;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    margin-left: 15px;
    position: absolute;
    right: 0;
    top: 0;
  }
`;
document.head.appendChild(style);

function showToast({ message, linkText = "", linkUrl = "" }) {
  const toast = document.createElement("div");
  toast.className = "custom-toast";

  // メッセージとリンクを含むHTMLを生成
  toast.innerHTML = `<span>${message}</span>`;
  if (linkText && linkUrl) {
    toast.innerHTML += `<br />`;
    toast.innerHTML += `<a href="${linkUrl}" target="_blank" style="color: white; text-decoration: underline; margin-top: 10px;">${linkText}</a>`;
  }

  // 閉じるボタンを追加
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;"; // × のマーク
  closeButton.addEventListener("click", () => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  });

  toast.appendChild(closeButton);
  document.body.appendChild(toast);

  // すぐに表示するためのトリガー
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // 30秒後にToastを非表示にして削除
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }
  }, 30000);
}
