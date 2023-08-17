/**
 * See cc.Codec.GZip.gunzip.
 * @param {Array | String} data The bytestream to decompress
 * Constructor
 */
declare class HufNode {
    b0: number;
    b1: number;
    jump: any;
    jumppos: number;
}
export declare class GZip {
    constructor(data: string | number[]);
    /**
 * Unzips the gzipped data of the 'data' argument.
 * @param string  The bytestream to decompress. Either an array of Integers between 0 and 255, or a String.
 * @return {String}
 */
    static gunzip(string: string | number[]): string;
    static HufNode: typeof HufNode;
    /**
  * @constant
  * @type Number
  */
    static LITERALS: number;
    /**
     * @constant
     * @type Number
     */
    static NAMEMAX: number;
    static bitReverse: number[];
    /**
     * gunzip
     * @return {Array}
     */
    gunzip(): string[][];
    readByte_array(): number;
    readByte_string(): number;
    byteAlign(): void;
    readBit(): number;
    readBits(a: number): number;
    flushBuffer(): void;
    addBuffer(a: number): void;
    IsPat(): number;
    Rec(): number;
    CreateTree(currentTree: any, numval: any, lengths: any, show: any): number;
    DecodeValue(currentTree: any): any;
    DeflateLoop(): number;
    unzipFile(name: string): string;
    nextFile(): void;
    skipdir(): number;
}

export default GZip;