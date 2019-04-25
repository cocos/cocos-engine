/****************************************************************************
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { Texture2D } from '../../assets';
import { Filter, PixelFormat } from '../../assets/texture-base';
import { Rect } from '../../core';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../core/data/class-decorator';
import { GFXDevice } from '../../gfx/device';
import { Mesh } from '../assets';
import { SkinningModelComponent } from './skinning-model-component';
import { GFXTextureCopy } from '../../gfx/define';

export interface IAvatarUnit {
    mesh: Mesh;
    region: Rect;
    albedoMap: Texture2D | null;
    alphaMap: Texture2D | null;
}

/**
 * !#en The Avatar Model Component
 * !#ch 换装模型组件
 */
@ccclass('cc.AvatarModelComponent')
@executionOrder(100)
@executeInEditMode
@menu('Components/AvatarModelComponent')
export class AvatarModelComponent extends SkinningModelComponent {

    @property
    private _combinedTexSize: number = 1024;

    private _combinedTex: Texture2D | null = null;

    private _units: Array<IAvatarUnit | null> = [];

    @property({ visible: false })
    get mesh (): Mesh | null {
        return this._mesh;
    }

    get parts (): Array<IAvatarUnit | null> {
        return this._units;
    }

    constructor () {
        super();
    }

    public onLoad () {
        super.onLoad();

        this._combinedTex = new Texture2D();
        this._combinedTex.setFilters(Filter.LINEAR, Filter.LINEAR);
        this.resizeCombiendTexture();
    }

    public update (dt) {
        super.update(dt);
    }

    public onDestroy () {
        if (this._combinedTex) {
            this._combinedTex.destroy();
            this._combinedTex = null;
        }
    }

    public combine () {

        const texImages: TexImageSource[] = [];
        const texImageRegions: GFXTextureCopy[] = [];
        const texBuffers: ArrayBuffer[] = [];
        const texBufferRegions: GFXTextureCopy[] = [];

        for (const unit of this._units) {
            if (unit) {
                const isValid = (unit.region.x > 0 && unit.region.y > 0) &&
                    (unit.region.width > 0 && unit.region.height > 0) &&
                    (unit.region.x + unit.region.width) <= this._combinedTexSize &&
                    (unit.region.y + unit.region.height) <= this._combinedTexSize;

                if (isValid && unit.albedoMap && unit.albedoMap.image && unit.albedoMap.image.data) {

                    const region = new GFXTextureCopy();

                    const data = unit.albedoMap.image.data;
                    if (data instanceof HTMLCanvasElement || data instanceof HTMLImageElement) {
                        texImages.push(data);
                        texImageRegions.push(region);
                    } else {
                        texBuffers.push(data.buffer);
                        texBufferRegions.push(region);
                    }
                }
            }
        }

        const gfxTex = this._combinedTex!.getGFXTexture();
        const device: GFXDevice = cc.director.root.device;
        for (const buff of texBuffers) {
            // device.copyBuffersToTexture(texBuffers, gfxTex!, );
        }
        // device.copyTexImagesToTexture();
    }

    private resizeCombiendTexture () {
        if (this._combinedTex) {
            this._combinedTex.destroy();
            this._combinedTex.create(this._combinedTexSize, this._combinedTexSize, PixelFormat.RGBA8888);
        }
    }
}
