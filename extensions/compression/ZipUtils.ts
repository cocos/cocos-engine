/*--
 Copyright 2009-2010 by Stefan Rusterholz.
 All rights reserved.
 You can choose between MIT and BSD-3-Clause license. License file will be added later.
 --*/


import { Base64 as b64 } from "./base64";
import { GZip as gzip} from "./gzip";

export module codec {

    export const name = "Jacob__Codec";

    export const Base64 = b64;
    export const GZip = gzip;

    /**
     * Unpack a gzipped byte array
     * @param {Array} input Byte array
     * @returns {String} Unpacked byte string
     */
    export function unzip(args:string|number[]):string {
        return GZip.gunzip.apply(GZip, arguments as unknown as any);
    }

    /**
     * Unpack a gzipped byte string encoded as base64
     * @param {String} input Byte string encoded as base64
     * @returns {String} Unpacked byte string
     */
    export function unzipBase64(arg:string):string {
        var buffer:string = Base64.decode.apply(Base64, arguments as unknown as any);
        try {
            return GZip.gunzip.call(GZip, buffer);
        }
        catch (e) {
            // if not zipped, just skip
            return buffer.slice(7); // get image data
        }
    }

    /**
     * Unpack a gzipped byte string encoded as base64
     * @param {String} input Byte string encoded as base64
     * @param {Number} bytes Bytes per array item
     * @returns {Array} Unpacked byte array
     */
    export function unzipBase64AsArray(input:string, bytes?:number):number[] {
        bytes = bytes || 1;

        var dec = unzipBase64(input),
            ar:number[] = [], i:number, j:number, len:number;
        for (i = 0, len = dec.length / bytes; i < len; i++) {
            ar[i] = 0;
            for (j = bytes - 1; j >= 0; --j) {
                ar[i] += dec.charCodeAt((i * bytes) + j) << (j * 8);
            }
        }
        return ar;
    }
    /**
     * Unpack a gzipped byte array
     * @param {Array} input Byte array
     * @param {Number} bytes Bytes per array item
     * @returns {Array} Unpacked byte array
     */
    export function unzipAsArray(input:number[], bytes?:number):number[] {
        bytes = bytes || 1;

        var dec = unzip(input),
            ar:number[] = [], i:number, j:number, len:number;
        for (i = 0, len = dec.length / bytes; i < len; i++) {
            ar[i] = 0;
            for (j = bytes - 1; j >= 0; --j) {
                ar[i] += dec.charCodeAt((i * bytes) + j) << (j * 8);
            }
        }
        return ar;
    }

}