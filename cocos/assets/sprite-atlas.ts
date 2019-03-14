/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import { ccclass, property } from '../core/data/class-decorator';
import { Asset } from './asset';
import { SpriteFrame } from './CCSpriteFrame';

/**
 * !#en Class for sprite atlas handling.
 * !#zh 精灵图集资源类。
 * @class SpriteAtlas
 * @extends Asset
 */

interface ISpriteAtlasSerializeData{
    name: string;
    spriteFrames: string[];
}

@ccclass('cc.SpriteAtlas')
export class SpriteAtlas extends Asset {
    @property
    public spriteFrames: Map<string, SpriteFrame | null> = new Map<string, SpriteFrame | null>();

    /**
     * Returns the texture of the sprite atlas
     * @method getTexture
     * @returns {Texture2D}
     */
    public getTexture () {
        const values = this.spriteFrames.values;
        if (values.length > 0) {
            const spriteFrame = values[0];
            return spriteFrame && spriteFrame.image ? spriteFrame.image : null;
        }
        else {
            return null;
        }
    }

    /**
     * Returns the sprite frame correspond to the given key in sprite atlas.
     * @method getSpriteFrame
     * @param {String} key
     * @returns {SpriteFrame}
     */
    public getSpriteFrame (key: string) {
        const sf = this.spriteFrames[key];
        if (!sf) {
            return null;
        }
        if (!sf.name) {
            sf.name = key;
        }
        return sf;
    }

    /**
     * Returns the sprite frames in sprite atlas.
     * @method getSpriteFrames
     * @returns {[SpriteFrame]}
     */
    public getSpriteFrames () {
        const frames: Array<SpriteFrame | null> = [];
        for (const spriteFrame of this.spriteFrames) {
            frames.push(spriteFrame[1]);
        }

        return frames;
    }

    public _serialize () {
        const frames: string[] = [];
        for (const spriteFrame of this.spriteFrames) {
            const id = spriteFrame[1] ? spriteFrame[1]._uuid : '';
            frames.push(spriteFrame[0]);
            frames.push(id);
        }

        return {
            name: this._name,
            spriteFrames: frames,
        };
    }

    public _deserialize (serializeData: any, handle: any){
        const data = serializeData as ISpriteAtlasSerializeData;
        this._name = data.name;
        const frames = data.spriteFrames;
        this.spriteFrames.clear();
        for (let i = 0; i < frames.length; i += 2) {
            this.spriteFrames.set(frames[i], new SpriteFrame());
            handle.result.push(this.spriteFrames, `${i}`, frames[i + 1]);
        }
    }
}

cc.SpriteAtlas = SpriteAtlas;
