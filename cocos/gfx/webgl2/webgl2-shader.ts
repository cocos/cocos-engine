import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXShader, IGFXShaderInfo } from '../shader';
import { WebGL2CmdFuncCreateShader, WebGL2CmdFuncDestroyShader } from './webgl2-commands';
import { WebGL2GFXDevice } from './webgl2-device';
import { WebGL2GPUShader, WebGL2GPUShaderStage } from './webgl2-gpu-objects';

export class WebGL2GFXShader extends GFXShader {

    public get gpuShader (): WebGL2GPUShader {
        return  this._gpuShader!;
    }

    private _gpuShader: WebGL2GPUShader | null = null;

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

            gpuStages: new Array<WebGL2GPUShaderStage>(info.stages.length),
            glProgram: 0,
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
                glShader: 0,
            };
        }

        WebGL2CmdFuncCreateShader(this._device as WebGL2GFXDevice, this._gpuShader);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuShader) {
            WebGL2CmdFuncDestroyShader(this._device as WebGL2GFXDevice, this._gpuShader);
            this._gpuShader = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
