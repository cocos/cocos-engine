/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @module asset
 */

import { EDITOR, TEST } from 'internal:constants';
import { ccclass, serializable, editable } from 'cc.decorator';
import * as js from '../../core/utils/js';
import { Asset } from '../../core/assets';
import { SpriteFrame } from './sprite-frame';
import { legacyCC } from '../../core/global-exports';

interface ISpriteAtlasSerializeData{
    name: string;
    spriteFrames: string[];
}

interface ISpriteFrameList {
    [key: string]: SpriteFrame | null;
}

/**
 * @en
 * Class for sprite atlas handling.
 * @zh
 * 精灵图集资源类。
 */
@ccclass('cc.SpriteAtlas')
export class SpriteAtlas extends Asset {
    @serializable
    @editable
    public spriteFrames: ISpriteFrameList = js.createMap();

    /**
     * @en Get the [[Texture2D]] asset of the atlas.
     * @zh 获取精灵图集的贴图。请注意，由于结构调整优化，在 v1.1 版本之前，此函数的返回值为 imageAsset，在 v1.1 版本之后修正为 texture，想要获取 imageAsset 可使用 getTexture().image 获取
     * @returns The texture2d asset
     */
    public getTexture () {
        const keys = Object.keys(this.spriteFrames);
        if (keys.length > 0) {
            const spriteFrame = this.spriteFrames[keys[0]];
            return spriteFrame && spriteFrame.texture;
        } else {
            return null;
        }
    }

    /**
     * @en Gets the [[SpriteFrame]] correspond to the given key in sprite atlas.
     * @zh 根据键值获取精灵。
     *
     * @param key The SpriteFrame name
     * @returns The SpriteFrame asset
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
     * @en Returns all sprite frames in the sprite atlas.
     * @zh 获取精灵图集所有精灵。
     * @returns All sprite frames
     */
    public getSpriteFrames () {
        const frames: Array<SpriteFrame | null> = [];
        const spriteFrames = this.spriteFrames;

        for (const key of Object.keys(spriteFrames)) {
            frames.push(spriteFrames[key]);
        }

        return frames;
    }

    /**
     * @deprecated_to_user
     */
    public _serialize (ctxForExporting: any): any {
        if (EDITOR || TEST) {
            const frames: string[] = [];
            for (const key of Object.keys(this.spriteFrames)) {
                const spriteFrame = this.spriteFrames[key];
                let id = spriteFrame ? spriteFrame._uuid : '';
                if (id && ctxForExporting && ctxForExporting._compressUuid) {
                    id = EditorExtends.UuidUtils.compressUuid(id, true);
                }
                frames.push(key);
                frames.push(id);
            }

            return {
                name: this._name,
                spriteFrames: frames,
            };
        }
    }

    /**
     * @deprecated_to_user
     */
    public _deserialize (serializeData: any, handle: any) {
        const data = serializeData as ISpriteAtlasSerializeData;
        this._name = data.name;
        const frames = data.spriteFrames;
        this.spriteFrames = js.createMap();
        for (let i = 0; i < frames.length; i += 2) {
            handle.result.push(this.spriteFrames, frames[i], frames[i + 1], js._getClassId(SpriteFrame));
        }
    }
}

legacyCC.SpriteAtlas = SpriteAtlas;
