/*
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
*/

/**
 * @category asset
 */

import { ccclass, property } from '../data/class-decorator';
import { GFXTexture, GFXSampler, GFXColorAttachment, GFXDepthStencilAttachment, GFXTextureLayout } from '../gfx';
import { legacyCC } from '../global-exports';
import { RenderWindow } from '../pipeline';
import { IRenderWindowInfo } from '../pipeline/render-window';
import { Root } from '../root';
import { Asset } from './asset';
import { samplerLib, defaultSamplerHash } from '../renderer/core/sampler-lib';

export interface IRenderTextureCreateInfo {
    name?: string;
    width: number;
    height: number;
}

const _colorAttachment = new GFXColorAttachment();
_colorAttachment.endLayout = GFXTextureLayout.SHADER_READONLY_OPTIMAL;
const _depthStencilAttachment = new GFXDepthStencilAttachment();
const _windowInfo: IRenderWindowInfo = {
    width: 1,
    height: 1,
    renderPassInfo: {
        colorAttachments: [_colorAttachment],
        depthStencilAttachment: _depthStencilAttachment,
    }
};

@ccclass('cc.RenderTexture')
export class RenderTexture extends Asset {

    @property({
        min: 1,
        max: 2048,
        visible: true,
    })
    private _width = 1;

    @property({
        min: 1,
        max: 2048,
        visible: true,
    })
    private _height = 1;

    private _window: RenderWindow | null = null;

    get width () {
        return this._width;
    }

    get height () {
        return this._height;
    }

    get window () {
        return this._window;
    }

    public initialize (info: IRenderTextureCreateInfo) {
        this._name = info.name || '';
        this._width = info.width;
        this._height = info.height;
        this._initWindow();
    }
    public reset (info: IRenderTextureCreateInfo) { // to be consistent with other assets
        this.initialize(info);
    }

    public destroy () {
        if (this._window) {
            const root = legacyCC.director.root as Root;
            root.destroyWindow(this._window);
            this._window = null;
        }

        return super.destroy();
    }

    public resize (width: number, height: number) {
        this._width = width;
        this._height = height;
        if (this._window) {
            this._window.resize(width, height);
        }
        this.emit('resize', this._window);
    }

    // To be compatible with material property interface
    public getGFXTexture (): GFXTexture | null {
        return this._window && this._window.framebuffer.colorTextures[0];
    }
    public getGFXSampler (): GFXSampler {
        const root = legacyCC.director.root as Root;
        return samplerLib.getSampler(root.device, defaultSamplerHash);
    }

    public onLoaded () {
        this._initWindow();
        this.loaded = true;
        this.emit('load');
    }

    protected _initWindow () {
        const root = legacyCC.director.root as Root;
        _windowInfo.title = this._name;
        _windowInfo.width = this._width;
        _windowInfo.height = this._height;

        if (this._window) {
            this._window.destroy();
            this._window.initialize(_windowInfo);
        } else {
            this._window = root.createWindow(_windowInfo);
        }
    }
}

legacyCC.RenderTexture = RenderTexture;
