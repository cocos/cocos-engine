// @copyright

// @ts-check
import { _decorator } from "../../core/data/index";
const {ccclass, property} = _decorator;
import Font from "./CCFont";
import vec2 from "../../vmath/vec2";
import Texture2D from "../../assets/CCTexture2D";

@ccclass
export class BitmapFont extends Font {
    /**
     * @typedef {{char: string, x: number, y: number, width: number, height: number, xoffset: number, yoffset: number, xadvance: number, uvs: vec2[]}} BitmapFontGlyph
     */

    constructor() {
        super();
        super._type = "bitmap";
    }

    /**
     * @return {Texture2D}
     */
    get texture() {
        return this._texture;
    }

    /**
     * @return {string}
     */
    get face() {
        return this._face;
    }

    /**
     * @type {Texture2D}
     */
    _texture = null;

    /**
     * @type {string}
     */
    _face = "";

    /**
     * @type {BitmapFontGlyph}
     */
    _defaultGlyph = {
        char: "",
        x: 0,
        y: 0,
        width: 16,
        height: 16,
        xoffset: 0,
        yoffset: 0,
        xadvance: 16,
        uvs: [
            vec2.create(0, 0),
            vec2.create(0, 0),
            vec2.create(0, 0),
            vec2.create(0, 0)
        ],
    };
}