function fetchTransactionDates() {
  // /labels/で始まり、/use_refrainで終わる全てのリンクを取得する
  const refrainLinks = document.querySelectorAll('a[href^="/labels/"][href$="/use_refrain"]');

  refrainLinks.forEach((link) => {
    fetch(link.href)
      .then((response) => response.text())
      .then((htmlText) => {
        // 取得したHTMLテキストをパースする
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

        // 親行(tr)内の「申込日時」のセル(td)を探す
        const parentTr = link.closest("tr");
        if (parentTr) {
          const registeredTd = parentTr.querySelector("td.col_registered_date[data-header='申込日時']");
          if (registeredTd) {
            // label要素を作成し、スタイルを設定する
            const infoLabel = document.createElement("label");
            infoLabel.className = "additional-info";
            infoLabel.style.background = "rgb(255, 255, 255)";
            infoLabel.style.color = "black";
            infoLabel.style.padding = "2px 1px";
            infoLabel.style.display = "flex";

            // checkbox要素を作成する
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            // 取引日が存在しなければdisabledにする
            if (transactionDate === "-") {
              checkbox.disabled = true;
            }
            infoLabel.appendChild(checkbox);

            // 取引日のテキストを追加する
            const textNode = document.createTextNode("取引日: " + transactionDate);
            infoLabel.appendChild(textNode);

            // 「申込日時」セルの下にlabel要素を追加する
            registeredTd.appendChild(infoLabel);
          }
        }
      })
      .catch((error) => {
        console.error("追加情報の取得に失敗しました:", error);
      });
  });
}

document.addEventListener("turbo:load", function () {
  fetchTransactionDates();
});
