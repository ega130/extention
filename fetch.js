function fetchTransactionDates() {
  // /labels/で始まり、/use_refrainで終わる全てのリンクを取得する
  const refrainLinks = document.querySelectorAll('a[href^="/labels/"][href$="/use_refrain"]');

  refrainLinks.forEach((link) => {
    // 親行(tr)と「申込日時」のセル(td)を取得
    const parentTr = link.closest("tr");
    if (!parentTr) return;
    const registeredTd = parentTr.querySelector("td.col_registered_date[data-header='申込日時']");
    if (!registeredTd) return;

    // すでに追加済みの場合はfetchをスキップ
    if (registeredTd.querySelector("label.additional-info")) {
      return;
    }

    // fetchを実行して取引日の情報を取得
    fetch(link.href)
      .then((response) => response.text())
      .then((htmlText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        // テーブル内の全行から「取引日」の行を探す
        const trs = doc.querySelectorAll("table.edit_form tbody tr");
        let transactionDate = null;
        trs.forEach((tr) => {
          const headCell = tr.querySelector("td.edit_form_head");
          if (headCell && headCell.textContent.trim() === "取引日") {
            const valueCell = tr.querySelector("td.edit_form_input.confirm_output");
            if (valueCell) {
              transactionDate = valueCell.textContent.trim();
            }
          }
        });

        // 取引日情報を表示するlabel要素を作成
        const infoLabel = document.createElement("label");
        infoLabel.className = "additional-info";
        infoLabel.style.background = "rgb(255, 255, 255)";
        infoLabel.style.color = "black";
        infoLabel.style.padding = "2px 1px";
        infoLabel.style.display = "flex";

        // チェックボックス要素を作成
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (transactionDate === "-") {
          checkbox.disabled = true;
        }
        infoLabel.appendChild(checkbox);

        // 取引日のテキストを追加
        const textNode = document.createTextNode("取引日: " + transactionDate);
        infoLabel.appendChild(textNode);

        // 「申込日時」セルの下にlabel要素を追加
        registeredTd.appendChild(infoLabel);
      })
      .catch((error) => {
        console.error("追加情報の取得に失敗しました:", error);
      });
  });
}

document.addEventListener("turbo:load", function () {
  fetchTransactionDates();
});
