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

import { ShaderInfo } from '../base/define';
import { Shader } from '../base/shader';
import { WebGLCmdFuncCreateShader, WebGLCmdFuncDestroyShader } from './webgl-commands';
import { WebGLDeviceManager } from './webgl-define';
import { IWebGLGPUShader, IWebGLGPUShaderStage } from './webgl-gpu-objects';

export class WebGLShader extends Shader {
    get gpuShader (): IWebGLGPUShader {
        return  this._gpuShader!;
    }

    private _gpuShader: IWebGLGPUShader | null = null;

    public initialize (info: Readonly<ShaderInfo>) {
        this._name = info.name;
        this._stages = info.stages;
        this._attributes = info.attributes;
        this._blocks = info.blocks;
        this._samplers = info.samplers;

        this._gpuShader = {
            name: info.name,
            blocks: info.blocks.slice(),
            samplerTextures: info.samplerTextures.slice(),
            subpassInputs: info.subpassInputs.slice(),

            gpuStages: new Array<IWebGLGPUShaderStage>(info.stages.length),
            glProgram: null,
            glInputs: [],
            glUniforms: [],
            glBlocks: [],
            glSamplerTextures: [],
        };

        for (let i = 0; i < info.stages.length; ++i) {
            const stage = info.stages[i];
            this._gpuShader.gpuStages[i] = {
                type: stage.stage,
                source: stage.source,
                glShader: null,
            };
        }

        WebGLCmdFuncCreateShader(WebGLDeviceManager.instance, this._gpuShader);
    }

    public destroy () {
        if (this._gpuShader) {
            WebGLCmdFuncDestroyShader(WebGLDeviceManager.instance, this._gpuShader);
            this._gpuShader = null;
        }
    }
}
