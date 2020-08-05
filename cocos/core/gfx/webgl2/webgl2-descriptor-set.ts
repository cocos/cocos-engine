import { GFXDescriptorSet, IGFXDescriptorSetInfo } from '../descriptor-set';
import { GFXDescriptorType, GFXStatus } from '../define';
import { WebGL2GFXBuffer } from './webgl2-buffer';
import { WebGL2GPUDescriptorSet, WebGL2GPUDescriptor } from './webgl2-gpu-objects';
import { WebGL2GFXSampler } from './webgl2-sampler';
import { WebGL2GFXTexture } from './webgl2-texture';
import { WebGL2GFXShader } from './webgl2-shader';

export class WebGL2GFXDescriptorSet extends GFXDescriptorSet {

    get gpuDescriptorSet (): WebGL2GPUDescriptorSet {
        return this._gpuDescriptorSet as WebGL2GPUDescriptorSet;
    }

    private _gpuDescriptorSet: WebGL2GPUDescriptorSet | null = null;

    public initialize (info: IGFXDescriptorSetInfo): boolean {

        this._setIndex = info.setIndex;

        const gpuDescriptors: WebGL2GPUDescriptor[] = [];
        this._gpuDescriptorSet = { gpuDescriptors };

        const shader = info.shader as WebGL2GFXShader;
        const { blocks, samplers } = shader.gpuShader;

        for (let i = 0; i < blocks.length; ++i) {
            const block = blocks[i];
            if (block.set === this._setIndex) {
                this._descriptors.push({
                    binding: block.binding,
                    type: GFXDescriptorType.UNIFORM_BUFFER,
                    name: block.name,
                    buffer: null,
                    texture: null,
                    sampler: null,
                });
                gpuDescriptors.push({
                    binding: block.gpuBinding,
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
            if (sampler.set === this._setIndex) {
                this._descriptors.push({
                    binding: sampler.binding,
                    type: GFXDescriptorType.SAMPLER,
                    name: sampler.name,
                    buffer: null,
                    texture: null,
                    sampler: null,
                });
                gpuDescriptors.push({
                    binding: sampler.gpuBinding,
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
                            this._gpuDescriptorSet.gpuDescriptors[i].gpuBuffer =
                                (descriptor.buffer as WebGL2GFXBuffer).gpuBuffer;
                        }
                        break;
                    }
                    case GFXDescriptorType.SAMPLER: {
                        if (descriptor.texture) {
                            this._gpuDescriptorSet.gpuDescriptors[i].gpuTexture =
                                (descriptor.texture as WebGL2GFXTexture).gpuTexture;
                        }
                        if (descriptor.sampler) {
                            this._gpuDescriptorSet.gpuDescriptors[i].gpuSampler =
                                (descriptor.sampler as WebGL2GFXSampler).gpuSampler;
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
