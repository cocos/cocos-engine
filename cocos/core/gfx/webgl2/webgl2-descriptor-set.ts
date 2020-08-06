import { GFXDescriptorSet, IGFXDescriptorSetInfo } from '../descriptor-set';
import { GFXDescriptorType, GFXStatus } from '../define';
import { WebGL2Buffer } from './webgl2-buffer';
import { IWebGL2GPUDescriptorSet, IWebGL2GPUDescriptor } from './webgl2-gpu-objects';
import { WebGL2Sampler } from './webgl2-sampler';
import { WebGL2Texture } from './webgl2-texture';
import { WebGL2Shader } from './webgl2-shader';

export class WebGL2DescriptorSet extends GFXDescriptorSet {

    get gpuDescriptorSet (): IWebGL2GPUDescriptorSet {
        return this._gpuDescriptorSet as IWebGL2GPUDescriptorSet;
    }

    private _gpuDescriptorSet: IWebGL2GPUDescriptorSet | null = null;

    public initialize (info: IGFXDescriptorSetInfo): boolean {

        this._set = info.set;

        const gpuDescriptors: Record<number, IWebGL2GPUDescriptor> = {};
        const gpuDescriptorArray: IWebGL2GPUDescriptor[] = [];
        this._gpuDescriptorSet = { gpuDescriptors, gpuDescriptorArray };

        const shader = info.shader as WebGL2Shader;
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
                const descriptor = this._descriptors[i];
                switch (descriptor.type) {
                    case GFXDescriptorType.UNIFORM_BUFFER: {
                        if (descriptor.buffer) {
                            this._gpuDescriptorSet.gpuDescriptorArray[i].gpuBuffer =
                                (descriptor.buffer as WebGL2Buffer).gpuBuffer;
                        }
                        break;
                    }
                    case GFXDescriptorType.SAMPLER: {
                        if (descriptor.texture) {
                            this._gpuDescriptorSet.gpuDescriptorArray[i].gpuTexture =
                                (descriptor.texture as WebGL2Texture).gpuTexture;
                        }
                        if (descriptor.sampler) {
                            this._gpuDescriptorSet.gpuDescriptorArray[i].gpuSampler =
                                (descriptor.sampler as WebGL2Sampler).gpuSampler;
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
