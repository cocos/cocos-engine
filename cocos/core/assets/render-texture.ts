/*
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

import { ccclass, rangeMin, rangeMax, serializable } from 'cc.decorator';
import { Texture, Sampler, ColorAttachment, DepthStencilAttachment, AccessType, RenderPassInfo } from '../gfx';
import { legacyCC } from '../global-exports';
import { RenderWindow, IRenderWindowInfo } from '../renderer/core/render-window';

import { Root } from '../root';
import { Asset } from './asset';
import { samplerLib, defaultSamplerHash } from '../renderer/core/sampler-lib';
import { IDGenerator } from '../utils/js';
import { murmurhash2_32_gc } from '../utils/murmurhash2_gc';

const idGenerator = new IDGenerator('RenderTex');

export interface IRenderTextureCreateInfo {
    name?: string;
    width: number;
    height: number;
    passInfo?: RenderPassInfo;
}

const _colorAttachment = new ColorAttachment();
_colorAttachment.endAccesses = [AccessType.FRAGMENT_SHADER_READ_TEXTURE];
const _depthStencilAttachment = new DepthStencilAttachment();
const passInfo = new RenderPassInfo([_colorAttachment], _depthStencilAttachment);

const _windowInfo: IRenderWindowInfo = {
    width: 1,
    height: 1,
    renderPassInfo: passInfo,
};

/**
 * @en Render texture is a render target for [[Camera]] or [[Canvas]] component,
 * the render pipeline will use its [[RenderWindow]] as the target of the rendering process.
 * @zh 渲染贴图是 [[Camera]] 或 [[Canvas]] 组件的渲染目标对象，渲染管线会使用它的 [[RenderWindow]] 作为渲染的目标窗口。
 */
@ccclass('cc.RenderTexture')
export class RenderTexture extends Asset {
    @serializable
    @rangeMin(1)
    @rangeMax(2048)
    private _width = 1;

    @serializable
    @rangeMin(1)
    @rangeMax(2048)
    private _height = 1;

    private _textureHash = 0;
    private _id: string;

    private _window: RenderWindow | null = null;

    constructor () {
        super();
        this._id = idGenerator.getNewId();
        this._textureHash = murmurhash2_32_gc(this._id, 666);
    }

    public getHash () {
        return this._textureHash;
    }

    /**
     * @en The pixel width of the render texture
     * @zh 渲染贴图的像素宽度
     */
    get width () {
        return this._width;
    }

    /**
     * @en The pixel height of the render texture
     * @zh 渲染贴图的像素高度
     */
    get height () {
        return this._height;
    }

    /**
     * @en The render window for the render pipeline, it's created internally and cannot be modified.
     * @zh 渲染管线所使用的渲染窗口，内部逻辑创建，无法被修改。
     */
    get window () {
        return this._window;
    }

    public initialize (info: IRenderTextureCreateInfo) {
        this._name = info.name || '';
        this._width = info.width;
        this._height = info.height;
        this._initWindow(info);
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

    /**
     * @en Resize the render texture
     * @zh 修改渲染贴图的尺寸
     * @param width The pixel width
     * @param height The pixel height
     */
    public resize (width: number, height: number) {
        this._width = width;
        this._height = height;
        if (this._window) {
            this._window.resize(width, height);
        }
        this.emit('resize', this._window);
    }

    // To be compatible with material property interface
    /**
     * @en Gets the related [[Texture]] resource, it's also the color attachment for the render window
     * @zh 获取渲染贴图的 GFX 资源，同时也是渲染窗口所指向的颜色缓冲贴图资源
     */
    public getGFXTexture (): Texture | null {
        return this._window && this._window.framebuffer.colorTextures[0];
    }
    /**
     * @en Gets the sampler resource for the render texture
     * @zh 获取渲染贴图的采样器
     */
    public getGFXSampler (): Sampler {
        const root = legacyCC.director.root as Root;
        return samplerLib.getSampler(root.device, defaultSamplerHash);
    }

    /**
     * @en Gets the sampler hash for the render texture
     * @zh 获取渲染贴图的采样器哈希值
     */
    public getSamplerHash () {
        return defaultSamplerHash;
    }

    public onLoaded () {
        this._initWindow();
    }

    protected _initWindow (info?: IRenderTextureCreateInfo) {
        const root = legacyCC.director.root as Root;

        _windowInfo.title = this._name;
        _windowInfo.width = this._width;
        _windowInfo.height = this._height;
        _windowInfo.renderPassInfo = info && info.passInfo ? info.passInfo : passInfo;

        if (this._window) {
            this._window.destroy();
            this._window.initialize(root.device, _windowInfo);
        } else {
            this._window = root.createWindow(_windowInfo);
        }
    }

    public initDefault (uuid?: string) {
        super.initDefault(uuid);
        this._width = this._height = 1;
        this._initWindow();
    }

    public validate () {
        return this.width >= 1 && this.width <= 2048 && this.height >= 1 && this.height <= 2048;
    }
}

legacyCC.RenderTexture = RenderTexture;
