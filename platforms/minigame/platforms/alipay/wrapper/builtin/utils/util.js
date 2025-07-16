import { btoa } from "../Base64";

export function transformArrayBufferToBase64 (buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    for (var len = bytes.byteLength, i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function encode(str) {
    let encodings =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    const string = String(str);
    let result = '';
    let currentIndex = 0;
    let sum;
    while (
      string.charAt(0 | currentIndex) ||
      ((encodings = '='), currentIndex % 1)
    ) {
      currentIndex += 0.75; // 每次移动3/4个位置
      let currentCode = string.charCodeAt(currentIndex); // 获取code point
      if (currentCode > 255) {
        // 大于255无法处理
        throw new Error('"btoa" failed');
      }
      sum = (sum << 8) | currentCode; // 每次在上次的基础上左移8位再加上当前code point
      const encodeIndex = 63 & (sum >> (8 - (currentIndex % 1) * 8)); // 去除多余的位数，再去最后6位
      result += encodings.charAt(encodeIndex);
    }
  
    return result;
  }
  
  function decode(str) {
    const encodings =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let res = '';
    const string = String(str).replace(/[=]+$/, '');
    var o,
      r,
      i = 0,
      currentIndex = 0;
    while ((r = string.charAt(currentIndex))) {
      currentIndex = currentIndex + 1;
      r = encodings.indexOf(r);
      if (~r) {
        o = i % 4 ? 64 * o + r : r;
        if (i++ % 4) {
          res += String.fromCharCode(255 & (o >> ((-2 * i) & 6)));
        }
      }
    }
  
    return res;
  }
  
  export function arrayBufferToBase64(buffer) {
    let result = '';
    const uintArray = new Uint8Array(buffer);
    const byteLength = uintArray.byteLength;
    for (let i = 0; i < byteLength; i++) {
      result += String.fromCharCode(uintArray[i]);
    }
    return encode(result);
  }
  
  export function base64ToArrayBuffer(base64) {
    const string = decode(base64);
    const length = string.length;
    let uintArray = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      uintArray[i] = string.charCodeAt(i);
    }
    return uintArray.buffer;
  }

export let isIDE = window.navigator && /AlipayIDE/.test(window.navigator.userAgent);
