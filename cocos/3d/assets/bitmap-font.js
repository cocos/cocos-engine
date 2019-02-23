/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// @ts-check
import { _decorator } from "../../core/data/index";
const { ccclass, property } = _decorator;
import Font from "./font";
import vec2 from "../../core/vmath/vec2";
import { Texture2D } from "../../assets/texture-2d";

// @ccclass('cc.BitmapFont')
export class BitmapFont extends Font {
    /**
     * @type {Texture2D}
     */
    @property(Texture2D)
    _texture = null;

    constructor() {
        super();
        super._type = "bitmap";

        /**
         * @type {string}
         */
        this._face = "";

        /**
         * @type {cc.d3.font.BitmapFontGlyph}
         */
        this._defaultGlyph = {
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
}

// cc.BitmapFont = BitmapFont;
