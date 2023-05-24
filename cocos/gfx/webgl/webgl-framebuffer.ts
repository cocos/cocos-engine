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

    public initialize (info: Readonly<FramebufferInfo>) {
        this._renderPass = info.renderPass;
        this._colorTextures = info.colorTextures || [];
        this._depthStencilTexture = info.depthStencilTexture || null;

        let lodLevel = 0;

        const gpuColorTextures: IWebGLGPUTexture[] = [];
        for (let i = 0; i < info.colorTextures.length; ++i) {
            const colorTexture = info.colorTextures[i];
            if (colorTexture) {
                gpuColorTextures.push((colorTexture as WebGLTexture).gpuTexture);
                lodLevel = (colorTexture as WebGLTexture).lodLevel;
            }
        }

        let gpuDepthStencilTexture: IWebGLGPUTexture | null = null;
        if (info.depthStencilTexture) {
            gpuDepthStencilTexture = (info.depthStencilTexture as WebGLTexture).gpuTexture;
            lodLevel = (info.depthStencilTexture as WebGLTexture).lodLevel;
        }

        let width = Number.MAX_SAFE_INTEGER;
        let height = Number.MAX_SAFE_INTEGER;
        this._gpuFramebuffer = {
            gpuRenderPass: (info.renderPass as WebGLRenderPass).gpuRenderPass,
            gpuColorTextures,
            gpuDepthStencilTexture,
            glFramebuffer: null,
            isOffscreen: true,
            get width () {
                return this.isOffscreen ? width : this.gpuColorTextures[0].width;
            },
            set width (val) {
                width = val;
            },
            get height () {
                return this.isOffscreen ? height : this.gpuColorTextures[0].height;
            },
            set height (val) {
                height = val;
            },
            lodLevel,
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
