/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { TextureInfo, TextureViewInfo, ISwapchainTextureInfo, FormatSurfaceSize, IsPowerOf2 } from '../base/define';
import { Texture } from '../base/texture';

export class EmptyTexture extends Texture {
    public initialize (info: TextureInfo | TextureViewInfo, isSwapchainTexture?: boolean) {
        let texInfo = info as TextureInfo;
        const viewInfo = info as TextureViewInfo;

        if ('texture' in info) {
            texInfo = viewInfo.texture.info;
            this._isTextureView = true;
        }

        this._info.copy(texInfo);

        this._isPowerOf2 = IsPowerOf2(this._info.width) && IsPowerOf2(this._info.height);
        this._size = FormatSurfaceSize(this._info.format, this.width, this.height,
            this.depth, this._info.levelCount) * this._info.layerCount;

        if (!this._isTextureView) {
            this._viewInfo.texture = this;
            this._viewInfo.type = info.type;
            this._viewInfo.format = info.format;
            this._viewInfo.baseLevel = 0;
            this._viewInfo.levelCount = 1;
            this._viewInfo.baseLayer = 0;
            this._viewInfo.layerCount = 1;
        } else {
            this._viewInfo.copy(viewInfo);
        }
    }
    public destroy () {}
    public resize (width: number, height: number) {
        this._info.width = width;
        this._info.height = height;
    }
    protected initAsSwapchainTexture (info: ISwapchainTextureInfo) {}
}
