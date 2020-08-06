import { GFXDescriptorSet, IGFXDescriptorSetInfo } from '../descriptor-set';
import { GFXDescriptorType, GFXStatus } from '../define';
import { WebGLBuffer } from './webgl-buffer';
import { IWebGLGPUDescriptorSet, IWebGLGPUDescriptor } from './webgl-gpu-objects';
import { WebGLSampler } from './webgl-sampler';
import { WebGLTexture } from './webgl-texture';
import { WebGLShader } from './webgl-shader';

export class WebGLDescriptorSet extends GFXDescriptorSet {

    get gpuDescriptorSet (): IWebGLGPUDescriptorSet {
        return this._gpuDescriptorSet as IWebGLGPUDescriptorSet;
    }

    private _gpuDescriptorSet: IWebGLGPUDescriptorSet | null = null;

    public initialize (info: IGFXDescriptorSetInfo): boolean {

        this._set = info.set;

        const gpuDescriptors: Record<number, IWebGLGPUDescriptor> = {};
        const gpuDescriptorArray: IWebGLGPUDescriptor[] = [];
        this._gpuDescriptorSet = { gpuDescriptors, gpuDescriptorArray };

        const shader = info.shader as WebGLShader;
        const { blocks, samplers } = shader.gpuShader;

        for (let i = 0; i < blocks.length; ++i) {
            const block = blocks[i];
            if (block.set === this._set) {
                this._descriptors.push({
                    binding: block.binding,
                    type: GFXDescriptorType.UNIFORM_BUFFER,
                    name: block.name,
                    buffer: null,
                    texture: null,
                    sampler: null,
                });
                gpuDescriptorArray.push(gpuDescriptors[block.gpuBinding] = {
                    type: GFXDescriptorType.UNIFORM_BUFFER,
                    name: block.name,
                    gpuBuffer: null,
                    gpuTexture: null,
                    gpuSampler: null,
                });
            }
        }
        for (let i = 0; i < samplers.length; ++i) {
            const sampler = samplers[i];
            if (sampler.set === this._set) {
                this._descriptors.push({
                    binding: sampler.binding,
                    type: GFXDescriptorType.SAMPLER,
                    name: sampler.name,
                    buffer: null,
                    texture: null,
                    sampler: null,
                });
                gpuDescriptorArray.push(gpuDescriptors[sampler.gpuBinding] = {
                    type: GFXDescriptorType.SAMPLER,
                    name: sampler.name,
                    gpuBuffer: null,
                    gpuTexture: null,
                    gpuSampler: null,
                });
            }
        }

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._descriptors.length = 0;
        this._gpuDescriptorSet = null;
        this._status = GFXStatus.UNREADY;
    }

    public update () {
        if (this._isDirty && this._gpuDescriptorSet) {
            for (let i = 0; i < this._descriptors.length; ++i) {
                const bindingUnit = this._descriptors[i];
                switch (bindingUnit.type) {
                    case GFXDescriptorType.UNIFORM_BUFFER: {
                        if (bindingUnit.buffer) {
                            this._gpuDescriptorSet.gpuDescriptorArray[i].gpuBuffer =
                                (bindingUnit.buffer as WebGLBuffer).gpuBuffer;
                        }
                        break;
                    }
                    case GFXDescriptorType.SAMPLER: {
                        if (bindingUnit.texture) {
                            this._gpuDescriptorSet.gpuDescriptorArray[i].gpuTexture =
                                (bindingUnit.texture as WebGLTexture).gpuTexture;
                        }
                        if (bindingUnit.sampler) {
                            this._gpuDescriptorSet.gpuDescriptorArray[i].gpuSampler =
                                (bindingUnit.sampler as WebGLSampler).gpuSampler;
                        }
                        break;
                    }
                    default:
                }
            }
            this._isDirty = false;
        }
    }
}
