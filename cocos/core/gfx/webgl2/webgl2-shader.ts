import { GFXShader, IGFXShaderInfo } from '../shader';
import { WebGL2CmdFuncCreateShader, WebGL2CmdFuncDestroyShader } from './webgl2-commands';
import { WebGL2GFXDevice } from './webgl2-device';
import { WebGL2GPUShader, WebGL2GPUShaderStage, IWebGL2UniformBlock, IWebGL2UniformSampler } from './webgl2-gpu-objects';
import { GFXStatus } from '../define';

export class WebGL2GFXShader extends GFXShader {

    get gpuShader (): WebGL2GPUShader {
        return  this._gpuShader!;
    }

    private _gpuShader: WebGL2GPUShader | null = null;

    public initialize (info: IGFXShaderInfo): boolean {

        this._name = info.name;
        this._stages = info.stages;
        this._attributes = info.attributes;
        this._blocks = info.blocks;
        this._samplers = info.samplers;

        const bindingMapping = info.bindingMappingInfo;
        const blocks = (info.blocks !== undefined ? info.blocks : []) as IWebGL2UniformBlock[];
        const samplers = (info.samplers !== undefined ? info.samplers : []) as IWebGL2UniformSampler[];

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

            gpuStages: new Array<WebGL2GPUShaderStage>(info.stages.length),
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
