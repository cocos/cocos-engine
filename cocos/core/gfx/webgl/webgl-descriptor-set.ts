import { GFXDescriptorSet, IGFXDescriptorSetInfo } from '../descriptor-set';
import { GFXDescriptorType, GFXStatus } from '../define';
import { WebGLGFXBuffer } from './webgl-buffer';
import { WebGLGPUDescriptorSet as WebGLGPUDescriptorSet, WebGLGPUDescriptor } from './webgl-gpu-objects';
import { WebGLGFXSampler } from './webgl-sampler';
import { WebGLGFXTexture } from './webgl-texture';
import { WebGLGFXShader } from './webgl-shader';

export class WebGLGFXDescriptorSet extends GFXDescriptorSet {

    get gpuDescriptorSet (): WebGLGPUDescriptorSet {
        return this._gpuDescriptorSet as WebGLGPUDescriptorSet;
    }

    private _gpuDescriptorSet: WebGLGPUDescriptorSet | null = null;

    public initialize (info: IGFXDescriptorSetInfo): boolean {

        this._setIndex = info.setIndex;

        const gpuDescriptors: WebGLGPUDescriptor[] = [];
        this._gpuDescriptorSet = { gpuDescriptors };

        const shader = info.shader as WebGLGFXShader;
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
                const bindingUnit = this._descriptors[i];
                switch (bindingUnit.type) {
                    case GFXDescriptorType.UNIFORM_BUFFER: {
                        if (bindingUnit.buffer) {
                            this._gpuDescriptorSet.gpuDescriptors[i].gpuBuffer =
                                (bindingUnit.buffer as WebGLGFXBuffer).gpuBuffer;
                        }
                        break;
                    }
                    case GFXDescriptorType.SAMPLER: {
                        if (bindingUnit.texture) {
                            this._gpuDescriptorSet.gpuDescriptors[i].gpuTexture =
                                (bindingUnit.texture as WebGLGFXTexture).gpuTexture;
                        }
                        if (bindingUnit.sampler) {
                            this._gpuDescriptorSet.gpuDescriptors[i].gpuSampler =
                                (bindingUnit.sampler as WebGLGFXSampler).gpuSampler;
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
