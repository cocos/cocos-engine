import { Shader } from '../base/shader';
import { WebGPUCmdFuncCreateGPUShader, WebGPUCmdFuncDestroyShader } from './webgpu-commands';
import { IWebGPUGPUShader, IWebGPUGPUShaderStage } from './webgpu-gpu-objects';
import { ShaderInfo } from '../base/define';
import { WebGPUDeviceManager } from './define';

export class WebGPUShader extends Shader {
    get gpuShader(): IWebGPUGPUShader {
        return this._gpuShader!;
    }

    private _gpuShader: IWebGPUGPUShader | null = null;

    public initialize(info: Readonly<ShaderInfo>) {
        this._name = info.name;
        this._stages = info.stages;
        this._attributes = info.attributes;
        this._blocks = info.blocks;
        this._samplers = info.samplers;

        this._gpuShader = {
            name: info.name,
            blocks: info.blocks.slice(),
            samplers: info.samplers,

            gpuStages: new Array<IWebGPUGPUShaderStage>(info.stages.length),
            glProgram: null,
            glInputs: [],
            glUniforms: [],
            glBlocks: [],
            glSamplers: [],
            bindings: new Map<number, number[]>(),
        };

        for (let i = 0; i < info.stages.length; ++i) {
            const stage = info.stages[i];
            this._gpuShader.gpuStages[i] = {
                type: stage.stage,
                source: stage.source,
                glShader: null,
                bindings: [],
                attrs: new Map()
            };
        }
        const device = WebGPUDeviceManager.instance;
        WebGPUCmdFuncCreateGPUShader(device, this._gpuShader);
    }

    public destroy() {
        if (this._gpuShader) {
            const device = WebGPUDeviceManager.instance;
            WebGPUCmdFuncDestroyShader(device, this._gpuShader);
            this._gpuShader = null;
        }
    }
}
