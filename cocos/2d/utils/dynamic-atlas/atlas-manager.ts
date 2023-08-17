/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { EDITOR_NOT_IN_PREVIEW } from 'internal:constants';
import { System, macro, js, cclegacy } from '../../../core';
import { Filter } from '../../../asset/assets/asset-enum';
import { Atlas, DynamicAtlasTexture } from './atlas';
import { director } from '../../../game';

/**
 * @en The dynamic atlas manager which manages all runtime dynamic packed atlas texture for UI rendering.
 * It generates a maximum of [[maxAtlasCount]] atlas texture, all atlas texture have the size of [[textureSize]].
 * Normally the [[Root.batcher2D]] is in charge of submitting sprite frames to the dynamic atlas manager, the process is transparent to user.
 * Note that the first committed sprite frame will define the filter settings of the atlas textures,
 * only sprite frame with the same setting will be accepted afterward.
 * @zh 动态合图的管理器，管理所有运行时动态合成的图集，主要用于 UI 渲染。
 * 该管理器支持生成 [[maxAtlasCount]] 张动态合图，并且所有合图都有同样的 [[textureSize]] 像素尺寸。
 * 一般来说 [[Root.batcher2D]] 负责提交 [[SpriteFrame]] 到动态合图管理器中，这个过程对于开发者是透明的。
 * 需要注意的是，第一个提交的 [[SpriteFrame]] 会决定图集的过滤器参数，在此之后只有同样参数的贴图才会被管理器接受。
 */
export class DynamicAtlasManager extends System {
    public static instance: DynamicAtlasManager;

    private _atlases: Atlas[] = [];
    private _atlasIndex = -1;

    private _maxAtlasCount = 5;
    private _textureSize = 2048;
    private _maxFrameSize = 512;
    private _textureBleeding = true;

    private _enabled = false;

    /**
     * @en
     * Enable or disable the dynamic atlas.
     *
     * @zh
     * 开启或关闭动态图集。
     */
    get enabled (): boolean {
        return this._enabled;
    }
    set enabled (value) {
        if (this._enabled === value) return;

        if (value) {
            this.reset();
            cclegacy.director.on(cclegacy.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLoad, this);
        } else {
            this.reset();
            cclegacy.director.off(cclegacy.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLoad, this);
        }

        this._enabled = value;
    }

    /**
     * @en
     * The maximum number of atlases that can be created.
     *
     * @zh
     * 可以创建的最大图集数量。
     */
    get maxAtlasCount (): number {
        return this._maxAtlasCount;
    }
    set maxAtlasCount (value) {
        this._maxAtlasCount = value;
    }

    /**
     * @en
     * Get the current created atlas count.
     *
     * @zh
     * 获取当前已经创建的图集数量。
     */
    get atlasCount (): number {
        return this._atlases.length;
    }

    /**
     * @en
     * Whether to enable textureBleeding.
     *
     * @zh
     * 是否开启 textureBleeding。
     */
    get textureBleeding (): boolean {
        return this._textureBleeding;
    }
    set textureBleeding (enable) {
        this._textureBleeding = enable;
    }

    /**
     * @en
     * The size of the created atlas.
     *
     * @zh
     * 创建的图集的宽高。
     */
    get textureSize (): number {
        return this._textureSize;
    }
    set textureSize (value) {
        this._textureSize = value;
    }

    /**
     * @en
     * The maximum size of the picture that can be added to the atlas.
     *
     * @zh
     * 可以添加进图集的图片的最大尺寸。
     */
    get maxFrameSize (): number {
        return this._maxFrameSize;
    }
    set maxFrameSize (value) {
        this._maxFrameSize = value;
    }

    private newAtlas (): Atlas {
        let atlas = this._atlases[++this._atlasIndex];
        if (!atlas) {
            atlas = new Atlas(this._textureSize, this._textureSize);
            this._atlases.push(atlas);
        }
        return atlas;
    }

    private beforeSceneLoad (): void {
        this.reset();
    }

    /**
     * @internal
     */
    public init (): void {
        this.enabled = !macro.CLEANUP_IMAGE_CACHE;
    }

    /**
     * @en
     * Append a sprite frame into the dynamic atlas.
     *
     * @zh
     * 添加碎图进入动态图集。
     *
     * @method insertSpriteFrame
     * @param spriteFrame  the sprite frame that will be inserted in the atlas.
     */
    public insertSpriteFrame (spriteFrame):  {
        x: number;
        y: number;
        texture: DynamicAtlasTexture;
    } | null {
        if (EDITOR_NOT_IN_PREVIEW) return null;
        if (!this._enabled || this._atlasIndex === this._maxAtlasCount
            || !spriteFrame || spriteFrame._original) return null;

        if (!spriteFrame.packable) return null;

        // hack for pixel game,should pack to different sampler atlas
        const sampler = spriteFrame.texture.getSamplerInfo();
        if (sampler.minFilter !== Filter.LINEAR || sampler.magFilter !== Filter.LINEAR || sampler.mipFilter !== Filter.NONE) {
            return null;
        }

        let atlas = this._atlases[this._atlasIndex];
        if (!atlas) {
            atlas = this.newAtlas();
        }

        const frame = atlas.insertSpriteFrame(spriteFrame);
        if (!frame && this._atlasIndex !== this._maxAtlasCount) {
            atlas = this.newAtlas();
            return atlas.insertSpriteFrame(spriteFrame);
        }
        return frame;
    }

    /**
     * @en
     * Reset all dynamic atlases, and all existing ones will be destroyed.
     *
     * @zh
     * 重置所有动态图集，已有的动态图集会被销毁。
     *
     * @method reset
    */
    public reset (): void {
        for (let i = 0, l = this._atlases.length; i < l; i++) {
            this._atlases[i].destroy();
        }
        this._atlases.length = 0;
        this._atlasIndex = -1;
    }

    /**
     * @en
     * Delete a sprite from the atlas.
     *
     * @zh
     * 从动态图集中删除某张碎图。
     *
     * @method deleteAtlasSpriteFrame
     * @param spriteFrame  the sprite frame that will be removed from the atlas.
     */
    public deleteAtlasSpriteFrame (spriteFrame): void {
        if (!spriteFrame._original) return;

        let atlas;
        for (let i = this._atlases.length - 1; i >= 0; i--) {
            atlas = this._atlases[i];
            js.array.fastRemove(atlas._innerSpriteFrames, spriteFrame);
        }
        const texture = spriteFrame._original._texture;
        this.deleteAtlasTexture(texture);
    }

    /**
     * @en
     * Delete a texture from the atlas.
     *
     * @zh
     * 从动态图集中删除某张纹理。
     *
     * @method deleteAtlasTexture
     * @param texture  the texture that will be removed from the atlas.
     */
    public deleteAtlasTexture (texture): void {
        if (texture) {
            for (let i = this._atlases.length - 1; i >= 0; i--) {
                this._atlases[i].deleteInnerTexture(texture);

                if (this._atlases[i].isEmpty()) {
                    this._atlases[i].destroy();
                    this._atlases.splice(i, 1);
                    this._atlasIndex--;
                }
            }
        }
    }

    /**
     * @en
     * Pack the sprite in the dynamic atlas and update the atlas information of the sprite frame.
     *
     * @zh
     * 将图片打入动态图集，并更新该图片的图集信息。
     *
     * @method packToDynamicAtlas
     * @param frame  the sprite frame that will be packed in the dynamic atlas.
     */
    public packToDynamicAtlas (comp, frame): void {
        if (EDITOR_NOT_IN_PREVIEW || !this._enabled) return;

        if (frame && !frame._original && frame.packable && frame.texture && frame.texture.width > 0 && frame.texture.height > 0) {
            const packedFrame = this.insertSpriteFrame(frame);
            if (packedFrame) {
                frame._setDynamicAtlasFrame(packedFrame);
            }
        }
    }
}

/**
 * @en The singleton instance of [[DynamicAtlasManager]], please use [[DynamicAtlasManager.instance]] instead.
 * @zh [[DynamicAtlasManager]] 的单例对象，请直接使用 [[DynamicAtlasManager.instance]]。
 * @deprecated since v3.7
 */
export const dynamicAtlasManager: DynamicAtlasManager = DynamicAtlasManager.instance = new DynamicAtlasManager();

director.registerSystem('dynamicAtlasManager', dynamicAtlasManager, 0);

cclegacy.internal.dynamicAtlasManager = dynamicAtlasManager;
