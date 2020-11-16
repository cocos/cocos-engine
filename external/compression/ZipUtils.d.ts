import b64 from "./base64";
import gzip  from "./gzip";
export declare module codec {
    const name = "Jacob__Codec";
    export const Base64: typeof b64;
    export const GZip: typeof gzip;
    /**
     * Unpack a gzipped byte array
     * @param {Array} input Byte array
     * @returns {String} Unpacked byte string
     */
    export function unzip(args: string | number[]): string;
    /**
     * Unpack a gzipped byte string encoded as base64
     * @param {String} input Byte string encoded as base64
     * @returns {String} Unpacked byte string
     */
    export function unzipBase64(arg: string): string;
    /**
     * Unpack a gzipped byte string encoded as base64
     * @param {String} input Byte string encoded as base64
     * @param {Number} bytes Bytes per array item
     * @returns {Array} Unpacked byte array
     */
    export function unzipBase64AsArray(input: string, bytes?: number): number[];
    /**
     * Unpack a gzipped byte array
     * @param {Array} input Byte array
     * @param {Number} bytes Bytes per array item
     * @returns {Array} Unpacked byte array
     */
    export function unzipAsArray(input: number[], bytes?: number): number[];
}

export default codec;