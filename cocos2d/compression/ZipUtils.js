/*--
 Copyright 2009-2010 by Stefan Rusterholz.
 All rights reserved.
 You can choose between MIT and BSD-3-Clause license. License file will be added later.
 --*/

/**
 * mixin cc.Codec
 */
cc.Codec = {name:'Jacob__Codec'};

cc.Codec.Base64 = require('./base64');
cc.Codec.GZip = require('./gzip');

/**
 * Unpack a gzipped byte array
 * @param {Array} input Byte array
 * @returns {String} Unpacked byte string
 */
cc.Codec.unzip = function () {
    return cc.Codec.GZip.gunzip.apply(cc.Codec.GZip, arguments);
};

/**
 * Unpack a gzipped byte string encoded as base64
 * @param {String} input Byte string encoded as base64
 * @returns {String} Unpacked byte string
 */
cc.Codec.unzipBase64 = function () {
    var buffer = cc.Codec.Base64.decode.apply(cc.Codec.Base64, arguments);
    try {
        return cc.Codec.GZip.gunzip.call(cc.Codec.GZip, buffer);
    }
    catch(e) {
        // if not zipped, just skip
        return buffer.slice(7); // get image data
    }
};

/**
 * Unpack a gzipped byte string encoded as base64
 * @param {String} input Byte string encoded as base64
 * @param {Number} bytes Bytes per array item
 * @returns {Array} Unpacked byte array
 */
cc.Codec.unzipBase64AsArray = function (input, bytes) {
    bytes = bytes || 1;

    var dec = this.unzipBase64(input),
        ar = [], i, j, len;
    for (i = 0, len = dec.length / bytes; i < len; i++) {
        ar[i] = 0;
        for (j = bytes - 1; j >= 0; --j) {
            ar[i] += dec.charCodeAt((i * bytes) + j) << (j * 8);
        }
    }
    return ar;
};

/**
 * Unpack a gzipped byte array
 * @param {Array} input Byte array
 * @param {Number} bytes Bytes per array item
 * @returns {Array} Unpacked byte array
 */
cc.Codec.unzipAsArray = function (input, bytes) {
    bytes = bytes || 1;

    var dec = this.unzip(input),
        ar = [], i, j, len;
    for (i = 0, len = dec.length / bytes; i < len; i++) {
        ar[i] = 0;
        for (j = bytes - 1; j >= 0; --j) {
            ar[i] += dec.charCodeAt((i * bytes) + j) << (j * 8);
        }
    }
    return ar;
};
