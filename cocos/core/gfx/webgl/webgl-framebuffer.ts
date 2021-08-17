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

import { FramebufferInfo } from '../base/define';
import { Framebuffer } from '../base/framebuffer';
import { WebGLCmdFuncCreateFramebuffer, WebGLCmdFuncDestroyFramebuffer } from './webgl-commands';
import { WebGLDeviceManager } from './webgl-define';
import { IWebGLGPUFramebuffer, IWebGLGPUTexture } from './webgl-gpu-objects';
import { WebGLRenderPass } from './webgl-render-pass';

import { WebGLTexture } from './webgl-texture';

export class WebGLFramebuffer extends Framebuffer {
    get gpuFramebuffer (): IWebGLGPUFramebuffer {
        return  this._gpuFramebuffer!;
    }

    private _gpuFramebuffer: IWebGLGPUFramebuffer | null = null;

    public initialize (info: FramebufferInfo) {
        this._renderPass = info.renderPass;
        this._colorTextures = info.colorTextures || [];
        this._depthStencilTexture = info.depthStencilTexture || null;

        const gpuColorTextures: IWebGLGPUTexture[] = [];
        for (let i = 0; i < info.colorTextures.length; ++i) {
            const colorTexture = info.colorTextures[i];
            if (colorTexture) {
                gpuColorTextures.push((colorTexture as WebGLTexture).gpuTexture);
            }
        }

        let gpuDepthStencilTexture: IWebGLGPUTexture | null = null;
        if (info.depthStencilTexture) {
            gpuDepthStencilTexture = (info.depthStencilTexture as WebGLTexture).gpuTexture;
        }

        this._gpuFramebuffer = {
            gpuRenderPass: (info.renderPass as WebGLRenderPass).gpuRenderPass,
            gpuColorTextures,
            gpuDepthStencilTexture,
            glFramebuffer: null,
        };

        WebGLCmdFuncCreateFramebuffer(WebGLDeviceManager.instance, this._gpuFramebuffer);
    }

    public destroy () {
        if (this._gpuFramebuffer) {
            WebGLCmdFuncDestroyFramebuffer(WebGLDeviceManager.instance, this._gpuFramebuffer);
            this._gpuFramebuffer = null;
        }
    }
}
