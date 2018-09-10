// @copyright

// @ts-check

import { ccclass, property } from "../../core/data/CCClassDecorator";
import Font3D from "./CCFont3D";
import vec2 from "../../vmath/vec2";
import { Texture2D } from "../../../index";

@ccclass
export default class BitmapFont3D extends Font3D {
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