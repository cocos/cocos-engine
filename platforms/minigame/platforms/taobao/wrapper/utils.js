const utils = {
    /**
     * @param {Object} target
     * @param {Object} origin
     * @param {String} methodName
     * @param {String} targetMethodName
     */
    cloneMethod (target, origin, methodName, targetMethodName) {
        if (origin[methodName]) {
            targetMethodName = targetMethodName || methodName;
            target[targetMethodName] = origin[methodName].bind(origin);
        }
    },

    /**
     *
     * @param {String} str
     * @returns
     */
    encode (str) {
        let encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        const string = String(str);
        let result = '';
        let currentIndex = 0;
        let sum = void 0;
        while (string.charAt(0 | currentIndex) || (encodings = '=', currentIndex % 1)) {
          currentIndex += 0.75;
          const currentCode = string.charCodeAt(currentIndex);
          if (currentCode > 255) {
            // Cannot handle when it is greater than 255
            throw new Error('"btoa" failed');
          }
          sum = sum << 8 | currentCode;
          const encodeIndex = 63 & sum >> 8 - currentIndex % 1 * 8;
          result += encodings.charAt(encodeIndex);
        }

        return result;
      },

    /**
     *
     * @param {String} str
     */
    decode (str) {
        const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let res = '';
        const string = String(str).replace(/[=]+$/, '');
        let o;
            let r;
            let i = 0;
            let currentIndex = 0;
        while (r = string.charAt(currentIndex)) {
          currentIndex += 1;
          r = encodings.indexOf(r);
          if (~r) {
            o = i % 4 ? 64 * o + r : r;
            if (i++ % 4) {
              res += String.fromCharCode(255 & o >> (-2 * i & 6));
            }
          }
        }

        return res;
    },

    /**
     *
     * @param {ArrayBuffer} buffer
     */
    arrayBufferToBase64 (buffer) {
        return utils.encode(utils.arrayBufferToString(buffer));
    },

    /**
     *
     * @param {String} base64
     */
    base64ToArrayBuffer (base64) {
        return utils.stringToArrayBuffer(utils.decode(base64));
    },

    /**
     *
     * @param {ArrayBuffer} buffer
     */
    arrayBufferToString (buffer) {
      let result = '';
      const uintArray = new Uint8Array(buffer);
      const byteLength = uintArray.byteLength;
      for (let i = 0; i < byteLength; i++) {
        result += String.fromCharCode(uintArray[i]);
      }
      return result;
    },

    /**
     *
     * @param {String} string
     */
    stringToArrayBuffer (string) {
      const length = string.length;
      const uintArray = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        uintArray[i] = string.charCodeAt(i);
      }
      return uintArray.buffer;
  },
};

module.exports = utils;
