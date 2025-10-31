// 便利関数
const c = el => document.createElement(el);
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function createPopup() {
  // === オーバーレイ作成 ===
  const overlay = c('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  // === モーダル作成 ===
  const div = c('div');
  div.className = 'overlayMenu';
  document.body.appendChild(div);
  function removeOverLay() {
    overlay.remove();
    div.remove();
  }

  return { div, removeOverLay };
}

export {c,$,$$,createPopup}
