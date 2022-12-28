/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { BaseObject, TextureAtlasData, TextureData } from '@cocos/dragonbones-js';
import { SpriteFrame } from '../2d';
import { TextureBase } from '../asset/assets/texture-base';
import { Rect, _decorator } from '../core';

const { ccclass } = _decorator;

/**
* @deprecated since v3.5.1, this is an engine private interface that will be removed in the future.
*/
@ccclass('dragonBones.CCTextureAtlasData')
export class CCTextureAtlasData extends TextureAtlasData {
    get renderTexture () {
        return this._renderTexture;
    }

    set renderTexture (value) {
        this._renderTexture = value;
        if (value) {
            for (const k in this.textures) {
                const textureData = this.textures[k] as CCTextureData;
                if (!textureData.spriteFrame) {
                    let rect: Rect | null = null;
                    if (textureData.rotated) {
                        rect = new Rect(textureData.region.x, textureData.region.y,
                            textureData.region.height, textureData.region.width);
                    } else {
                        rect = new Rect(textureData.region.x, textureData.region.y,
                            textureData.region.width, textureData.region.height);
                        // }
                        // const offset = new Vec2(0, 0);
                        // const size = new Size(rect.width, rect.height);
                        // setTexture(value, rect, false, offset, size);
                        textureData.spriteFrame = new SpriteFrame();
                        textureData.spriteFrame.texture = value;
                        textureData.spriteFrame.rect = rect;
                    }
                }
            }
        } else {
            for (const k in this.textures) {
                const textureData = this.textures[k] as CCTextureData;
                textureData.spriteFrame = null;
            }
        }
    }

    protected _renderTexture: TextureBase | null = null;

    static toString () {
        return '[class dragonBones.CCTextureAtlasData]';
    }

    createTexture () {
        return BaseObject.borrowObject(CCTextureData);
    }

    _onClear () {
        super._onClear();
        this.renderTexture = null;
    }
}

/**
* @deprecated since v3.5.1, this is an engine private interface that will be removed in the future.
*/
@ccclass('dragonBones.CCTextureData')
export class CCTextureData extends TextureData {
    spriteFrame: SpriteFrame | null = null

    static toString () {
        return '[class dragonBones.CCTextureData]';
    }

    _onClear () {
        super._onClear();
        this.spriteFrame = null;
    }
}
