import CryptoJS from 'https://esm.sh/crypto-js';
import LZString from 'https://esm.sh/lz-string';

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

const cry = {
  encode(data, password) {
    return CryptoJS.AES.encrypt(data, password).toString();
  },
  decode(cipherText, password) {
    const bytes = CryptoJS.AES.decrypt(cipherText, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
  compression(data) {
    return LZString.compressToEncodedURIComponent(data);
  },
  decompression(data) {
    return LZString.decompressFromEncodedURIComponent(data);
  }
};

export {c,$,$$,createPopup,cry}
