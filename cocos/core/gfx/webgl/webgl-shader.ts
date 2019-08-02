import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXShader, IGFXShaderInfo } from '../shader';
import { WebGLCmdFuncCreateShader, WebGLCmdFuncDestroyShader } from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUShader, WebGLGPUShaderStage } from './webgl-gpu-objects';

export class WebGLGFXShader extends GFXShader {

    public get gpuShader (): WebGLGPUShader {
        return  this._gpuShader!;
    }

    private _gpuShader: WebGLGPUShader | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXShaderInfo): boolean {

        this._name = info.name;
        this._stages = info.stages;

        if (info.blocks !== undefined) {
            this._blocks = info.blocks;
        }

        if (info.samplers !== undefined) {
            this._samplers = info.samplers;
        }

        this._gpuShader = {
            name: info.name ? info.name : '',
            blocks: (info.blocks !== undefined ? info.blocks : []),
            samplers: (info.samplers !== undefined ? info.samplers : []),

            gpuStages: new Array<WebGLGPUShaderStage>(info.stages.length),
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
                macros: stage.macros ? stage.macros : [],
                glShader: null,
            };
        }

        WebGLCmdFuncCreateShader(this._device as WebGLGFXDevice, this._gpuShader);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuShader) {
            WebGLCmdFuncDestroyShader(this._device as WebGLGFXDevice, this._gpuShader);
            this._gpuShader = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
