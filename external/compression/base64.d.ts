/**
 * mixin cc.Codec.Base64
 */
export declare class Base64 {
    static name_: string;
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
    static decode(input: string): string;
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
    static decodeAsArray(input: string, bytes: number): number[];
}
export default Base64;
