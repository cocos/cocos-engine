import { Shader } from '../base/shader';
import { WebGPUCmdFuncCreateShader, WebGPUCmdFuncDestroyShader } from './webgpu-commands';
import { WebGPUDevice } from './webgpu-device';
import { IWebGPUGPUShader, IWebGPUGPUShaderStage } from './webgpu-gpu-objects';
import { ShaderInfo } from '../base/define';

export class WebGPUShader extends Shader {
    get gpuShader(): IWebGPUGPUShader {
        return this._gpuShader!;
    }

    private _gpuShader: IWebGPUGPUShader | null = null;

    public initialize(info: ShaderInfo): boolean {
        this._name = info.name;
        this._stages = info.stages;
        this._attributes = info.attributes;
        this._blocks = info.blocks;
        this._samplers = info.samplers;

        this._gpuShader = {
            name: info.name,
            blocks: info.blocks,
            samplers: info.samplers,

            gpuStages: new Array<IWebGPUGPUShaderStage>(info.stages.length),
            glProgram: null,
            glInputs: [],
            glUniforms: [],
            glBlocks: [],
            glSamplers: [],
        };

        for (let i = 0; i < info.stages.length; ++i) {
            const stage = info.stages[i];
            this._gpuShader.gpuStages[i] = {
                type: stage.stage,
                source: stage.source,
                glShader: null,
            };
        }

        WebGPUCmdFuncCreateShader(this._device as WebGPUDevice, this._gpuShader);

        return true;
    }

    public destroy() {
        if (this._gpuShader) {
            WebGPUCmdFuncDestroyShader(this._device as WebGPUDevice, this._gpuShader);
            this._gpuShader = null;
        }
    }
}
