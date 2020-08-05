import { GFXShader, IGFXShaderInfo } from '../shader';
import { WebGLCmdFuncCreateShader, WebGLCmdFuncDestroyShader } from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUShader, WebGLGPUShaderStage, IWebGLUniformBlock, IWebGLUniformSampler } from './webgl-gpu-objects';
import { GFXStatus } from '../define';

export class WebGLGFXShader extends GFXShader {

    get gpuShader (): WebGLGPUShader {
        return  this._gpuShader!;
    }

    private _gpuShader: WebGLGPUShader | null = null;

    public initialize (info: IGFXShaderInfo): boolean {

        this._name = info.name;
        this._stages = info.stages;
        this._attributes = info.attributes;
        this._blocks = info.blocks;
        this._samplers = info.samplers;

        const bindingMapping = info.bindingMappingInfo;
        const blocks = (info.blocks !== undefined ? info.blocks : []) as IWebGLUniformBlock[];
        const samplers = (info.samplers !== undefined ? info.samplers : []) as IWebGLUniformSampler[];

        if (bindingMapping) {
            const bcounts = bindingMapping.buffer.counts;
            const boffsets = bindingMapping.buffer.offsets;
            const soffsets = bindingMapping.sampler.offsets;
            const activeBlockCounts = Array(bcounts.length).fill(0);
            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i]; // buffer bindings starts at 0 and grows upward
                activeBlockCounts[block.set]++;
                block.gpuBinding = block.binding + boffsets[block.set];
            }
            for (let i = 0; i < samplers.length; i++) {
                const sampler = samplers[i]; // sampler bindings starts at -1 and grows downward
                const bcount = bcounts[sampler.set] || activeBlockCounts[sampler.set];
                sampler.gpuBinding = bcount - sampler.binding + soffsets[sampler.set];
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
