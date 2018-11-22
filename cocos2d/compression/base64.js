/*--
 Copyright 2009-2010 by Stefan Rusterholz.
 All rights reserved.
 You can choose between MIT and BSD-3-Clause license. License file will be added later.
 --*/

var misc = require('../core/utils/misc');
var strValue = misc.BASE64_VALUES;

/**
 * mixin cc.Codec.Base64
 */
var Base64 = {name:'Jacob__Codec__Base64'};

/**
 * <p>
 *    cc.Codec.Base64.decode(input[, unicode=false]) -> String (http://en.wikipedia.org/wiki/Base64).
 * </p>
 * @function
 * @param {String} input The base64 encoded string to decode
 * @return {String} Decodes a base64 encoded String
 * @example
 * //decode string
 * cc.Codec.Base64.decode("U29tZSBTdHJpbmc="); // => "Some String"
 */
Base64.decode = function Jacob__Codec__Base64__decode(input) {
    var output = [],
        chr1, chr2, chr3,
        enc1, enc2, enc3, enc4,
        i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
        enc1 = strValue[input.charCodeAt(i++)];
        enc2 = strValue[input.charCodeAt(i++)];
        enc3 = strValue[input.charCodeAt(i++)];
        enc4 = strValue[input.charCodeAt(i++)];

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output.push(String.fromCharCode(chr1));

        if (enc3 !== 64) {
            output.push(String.fromCharCode(chr2));
        }
        if (enc4 !== 64) {
            output.push(String.fromCharCode(chr3));
        }
    }

    output = output.join('');

    return output;
};

/**
 * <p>
 *    Converts an input string encoded in base64 to an array of integers whose<br/>
 *    values represent the decoded string's characters' bytes.
 * </p>
 * @function
 * @param {String} input The String to convert to an array of Integers
 * @param {Number} bytes
 * @return {Array}
 * @example
 * //decode string to array
 * var decodeArr = cc.Codec.Base64.decodeAsArray("U29tZSBTdHJpbmc=");
 */
Base64.decodeAsArray = function Jacob__Codec__Base64___decodeAsArray(input, bytes) {
    var dec = this.decode(input),
        ar = [], i, j, len;
    for (i = 0, len = dec.length / bytes; i < len; i++) {
        ar[i] = 0;
        for (j = bytes - 1; j >= 0; --j) {
            ar[i] += dec.charCodeAt((i * bytes) + j) << (j * 8);
        }
    }

    return ar;
};

module.exports = Base64;
