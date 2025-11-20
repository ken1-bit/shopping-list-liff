const API_BASE = "https://shopping-list-backend-chi.vercel.app/api";

// -----------------------------
//  データ取得
// -----------------------------
async function loadItems() {
  const resp = await fetch(`${API_BASE}/items`);
  return await resp.json();
}

// -----------------------------
//  チェック ON/OFF
// -----------------------------
async function toggleItem(id, done) {
  const resp = await fetch(`${API_BASE}/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, done })
  });
  return await resp.json();
}

// -----------------------------
//  削除
// -----------------------------
async function deleteItem(id) {
  const resp = await fetch(`${API_BASE}/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  return await resp.json();
}

// -----------------------------
//  追加（すでに動作済み）
// -----------------------------
async function addItem(name) {
  const resp = await fetch(`${API_BASE}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  return await resp.json();
}

// -----------------------------
//  表示更新
// -----------------------------
async function refreshList() {
  const data = await loadItems();

  if (!data.ok) {
    alert("取得エラー: " + JSON.stringify(data.error));
    return;
  }

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.items.forEach(item => {
    const li = document.createElement("li");
    li.className = "item-row";

    // チェックボックス
    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.checked = item.done;

    chk.addEventListener("change", async () => {
      await toggleItem(item.id, chk.checked);
      refreshList();
    });

    // テキスト
    const span = document.createElement("span");
    span.textContent = item.name;
    span.className = chk.checked ? "done" : "";

    // 削除ボタン
    const del = document.createElement("button");
    del.textContent = "🗑";
    del.className = "delete-btn";

    del.addEventListener("click", async () => {
      if (confirm(`「${item.name}」を削除しますか？`)) {
        await deleteItem(item.id);
        refreshList();
      }
    });

    li.appendChild(chk);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
}

// -----------------------------
//  LIFF 初期化
// -----------------------------
liff.init({ liffId: "YOUR_LIFF_ID" })
  .then(() => {
    refreshList();
  });
