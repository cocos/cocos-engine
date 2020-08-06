import { GFXShader, GFXShaderInfo } from '../shader';
import { WebGLCmdFuncCreateShader, WebGLCmdFuncDestroyShader } from './webgl-commands';
import { WebGLDevice } from './webgl-device';
import { IWebGLGPUShader, IWebGLGPUShaderStage, IWebGLUniformBlock, IWebGLUniformSampler } from './webgl-gpu-objects';
import { GFXStatus } from '../define';

export class WebGLShader extends GFXShader {

    get gpuShader (): IWebGLGPUShader {
        return  this._gpuShader!;
    }

    private _gpuShader: IWebGLGPUShader | null = null;

    public initialize (info: GFXShaderInfo): boolean {

        this._name = info.name;
        this._stages = info.stages;
        this._attributes = info.attributes;
        this._blocks = info.blocks;
        this._samplers = info.samplers;

        const bindingMapping = info.bindingMappingInfo;
        const blocks = (info.blocks !== undefined ? info.blocks : []) as IWebGLUniformBlock[];
        const samplers = (info.samplers !== undefined ? info.samplers : []) as IWebGLUniformSampler[];

        if (bindingMapping) {
            const boffsets = bindingMapping.bufferOffsets;
            const soffsets = bindingMapping.samplerOffsets;
            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i]; // buffer bindings starts at 0 and grows upward
                block.gpuBinding = block.binding + boffsets[block.set];
            }
            for (let i = 0; i < samplers.length; i++) {
                const sampler = samplers[i]; // sampler bindings starts at -1 and grows downward
                sampler.gpuBinding = -(sampler.binding - soffsets[sampler.set]) - 1;
            }
        } else {
            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i];
                block.gpuBinding = block.binding;
            }
            for (let i = 0; i < samplers.length; i++) {
                const sampler = samplers[i];
                sampler.gpuBinding = sampler.binding;
            }
        }

        this._gpuShader = {
            name: info.name ? info.name : '',
            blocks,
            samplers,

            gpuStages: new Array<IWebGLGPUShaderStage>(info.stages.length),
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

        WebGLCmdFuncCreateShader(this._device as WebGLDevice, this._gpuShader);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuShader) {
            WebGLCmdFuncDestroyShader(this._device as WebGLDevice, this._gpuShader);
            this._gpuShader = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
