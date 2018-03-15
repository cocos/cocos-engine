/*--
 Copyright 2009-2010 by Stefan Rusterholz.
 All rights reserved.
 You can choose between MIT and BSD-3-Clause license. License file will be added later.
 --*/

var codec = {name:'Jacob__Codec'};

codec.Base64 = require('./base64');
codec.GZip = require('./gzip');

/**
 * Unpack a gzipped byte array
 * @param {Array} input Byte array
 * @returns {String} Unpacked byte string
 */
codec.unzip = function () {
    return codec.GZip.gunzip.apply(codec.GZip, arguments);
};

/**
 * Unpack a gzipped byte string encoded as base64
 * @param {String} input Byte string encoded as base64
 * @returns {String} Unpacked byte string
 */
codec.unzipBase64 = function () {
    var buffer = codec.Base64.decode.apply(codec.Base64, arguments);
    try {
        return codec.GZip.gunzip.call(codec.GZip, buffer);
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
codec.unzipBase64AsArray = function (input, bytes) {
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
codec.unzipAsArray = function (input, bytes) {
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

cc.codec = module.exports = codec;