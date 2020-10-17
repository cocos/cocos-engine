import { GFXShader, GFXShaderInfo } from '../shader';
import { WebGPUCmdFuncCreateShader, WebGPUCmdFuncDestroyShader } from './WebGPU-commands';
import { WebGPUDevice } from './WebGPU-device';
import { IWebGPUGPUShader, IWebGPUGPUShaderStage } from './WebGPU-gpu-objects';

export class WebGPUShader extends GFXShader {

    get gpuShader (): IWebGPUGPUShader {
        return  this._gpuShader!;
    }

    private _gpuShader: IWebGPUGPUShader | null = null;

    public initialize (info: GFXShaderInfo): boolean {

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

    public destroy () {
        if (this._gpuShader) {
            WebGPUCmdFuncDestroyShader(this._device as WebGPUDevice, this._gpuShader);
            this._gpuShader = null;
        }
    }
}
