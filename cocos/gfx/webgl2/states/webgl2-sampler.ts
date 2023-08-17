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

import { SamplerInfo } from '../../base/define';
import { Sampler } from '../../base/states/sampler';
import { WebGL2CmdFuncDestroySampler, WebGL2CmdFuncPrepareSamplerInfo } from '../webgl2-commands';
import { WebGL2DeviceManager } from '../webgl2-define';
import { WebGL2Device } from '../webgl2-device';
import { IWebGL2GPUSampler } from '../webgl2-gpu-objects';

export class WebGL2Sampler extends Sampler {
    public get gpuSampler (): IWebGL2GPUSampler {
        return  this._gpuSampler!;
    }

    private _gpuSampler: IWebGL2GPUSampler | null = null;

    constructor (info: Readonly<SamplerInfo>, hash: number) {
        super(info, hash);

        this._gpuSampler = {
            glSamplers: new Map<number, WebGL2Sampler>(),
            minFilter: this._info.minFilter,
            magFilter: this._info.magFilter,
            mipFilter: this._info.mipFilter,
            addressU: this._info.addressU,
            addressV: this._info.addressV,
            addressW: this._info.addressW,

            glMinFilter: 0,
            glMagFilter: 0,
            glWrapS: 0,
            glWrapT: 0,
            glWrapR: 0,

            getGLSampler (device: WebGL2Device, minLod: number, maxLod: number) : WebGLSampler {
                const { gl } = device;
                const samplerHash = minLod << 16 | maxLod;
                if (!this.glSamplers.has(samplerHash)) {
                    const glSampler = gl.createSampler();
                    if (glSampler) {
                        this.glSamplers.set(samplerHash, glSampler);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_MIN_FILTER, this.glMinFilter);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_S, this.glWrapS);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_T, this.glWrapT);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_R, this.glWrapR);
                        gl.samplerParameterf(glSampler, gl.TEXTURE_MIN_LOD, minLod);
                        gl.samplerParameterf(glSampler, gl.TEXTURE_MAX_LOD, maxLod);
                    }
                }
                const sampler = this.glSamplers.get(samplerHash)!;
                return sampler;
            },
        };

        WebGL2CmdFuncPrepareSamplerInfo(WebGL2DeviceManager.instance, this._gpuSampler);
    }

    destroy (): void {
        if (this._gpuSampler) {
            WebGL2CmdFuncDestroySampler(WebGL2DeviceManager.instance, this._gpuSampler);
            this._gpuSampler = null;
        }
    }
}
