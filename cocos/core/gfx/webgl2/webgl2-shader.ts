import { GFXShader, GFXShaderInfo } from '../shader';
import { WebGL2CmdFuncCreateShader, WebGL2CmdFuncDestroyShader } from './webgl2-commands';
import { WebGL2Device } from './webgl2-device';
import { IWebGL2GPUShader, IWebGL2GPUShaderStage } from './webgl2-gpu-objects';
import { GFXStatus } from '../define';

export class WebGL2Shader extends GFXShader {

    get gpuShader (): IWebGL2GPUShader {
        return  this._gpuShader!;
    }

    private _gpuShader: IWebGL2GPUShader | null = null;

    public initialize (info: GFXShaderInfo): boolean {

        this._name = info.name;
        this._stages = info.stages;
        this._attributes = info.attributes;
        this._blocks = info.blocks;
        this._samplers = info.samplers;

        this._gpuShader = {
            name: info.name ? info.name : '',
            blocks: info.blocks !== undefined ? info.blocks : [],
            samplers: info.samplers !== undefined ? info.samplers : [],

            gpuStages: new Array<IWebGL2GPUShaderStage>(info.stages.length),
            glProgram: null,
            glInputs: [],
            glUniforms: [],
            glBlocks: [],
            glSamplers: [],
        };

        for (let i = 0; i < info.stages.length; ++i) {
            const stage = info.stages[i];
            this._gpuShader.gpuStages[i] = {
                type: stage.type,
                source: stage.source,
                glShader: null,
            };
        }

        WebGL2CmdFuncCreateShader(this._device as WebGL2Device, this._gpuShader, info.bindingMappingInfo);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuShader) {
            WebGL2CmdFuncDestroyShader(this._device as WebGL2Device, this._gpuShader);
            this._gpuShader = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
