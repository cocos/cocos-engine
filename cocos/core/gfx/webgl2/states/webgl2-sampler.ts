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

import { SamplerInfo } from '../../base/define';
import { Sampler } from '../../base/states/sampler';
import { WebGL2CmdFuncCreateSampler, WebGL2CmdFuncDestroySampler } from '../webgl2-commands';
import { WebGL2DeviceManager } from '../webgl2-define';
import { IWebGL2GPUSampler } from '../webgl2-gpu-objects';

export class WebGL2Sampler extends Sampler {
    public get gpuSampler (): IWebGL2GPUSampler {
        return  this._gpuSampler!;
    }

    private _gpuSampler: IWebGL2GPUSampler | null = null;

    constructor (info: SamplerInfo, hash: number) {
        super(info, hash);

        this._gpuSampler = {
            glSampler: null,
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
        };

        WebGL2CmdFuncCreateSampler(WebGL2DeviceManager.instance, this._gpuSampler);
    }

    destroy () {
        if (this._gpuSampler) {
            WebGL2CmdFuncDestroySampler(WebGL2DeviceManager.instance, this._gpuSampler);
            this._gpuSampler = null;
        }
    }
}
