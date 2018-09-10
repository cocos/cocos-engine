// @copyright

// @ts-check
import { ccclass, property } from "../../core/data/CCClassDecorator";
import { Asset } from "../../../index";
import vec2 from "../../vmath/vec2";

@ccclass
export default class Font3D extends Asset {
    /**
     * @typedef {"unknow" | "bitmap" | "opentype"} FontType
     * @typedef {{char: string, x: number, y: number, width: number, height: number, xoffset: number, yoffset: number, xadvance: number, uvs: vec2[]}} BitmapFontGlyph
     * @typedef {{id: number, x: number, y: number, width: number, height: number, xoffset: number, yoffset: number, xadvance: number, uvs: vec2[]}} OpentypeFontGlyph
     * @typedef {BitmapFontGlyph | OpentypeFontGlyph} Glyph
     */

    /**
     * @return {number}
     */
    get size() {
        return this._size;
    }

    /**
     * @return {number}
     */
    get lineHeight() {
        return this._lineHeight;
    }

    /**
     * @return {FontType}
     */
    get type() {
        return this._type;
    }

    /** Font size.
     * @type {number}
     */
    _size = 32;

    /** Font type.
     * @type {FontType}
     */
    _type = "unknow";

    /**
     * Line height.
     * @type {number}
     */
    _lineHeight = 32;

    /**
     * 
     * @type {boolean}
     */
    _useKerning = false;

    /**
     * @type {Glyph[]}
     */
    _glyphs = [];
}