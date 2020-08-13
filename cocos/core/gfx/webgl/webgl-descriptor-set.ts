import { GFXDescriptorSet, IGFXDescriptorSetInfo, DESCRIPTOR_SAMPLER_TYPE, DESCRIPTOR_BUFFER_TYPE } from '../descriptor-set';
import { WebGLBuffer } from './webgl-buffer';
import { IWebGLGPUDescriptorSet, IWebGLGPUDescriptor } from './webgl-gpu-objects';
import { WebGLSampler } from './webgl-sampler';
import { WebGLTexture } from './webgl-texture';

export class WebGLDescriptorSet extends GFXDescriptorSet {

    get gpuDescriptorSet (): IWebGLGPUDescriptorSet {
        return this._gpuDescriptorSet as IWebGLGPUDescriptorSet;
    }

    private _gpuDescriptorSet: IWebGLGPUDescriptorSet | null = null;

    public initialize (info: IGFXDescriptorSetInfo): boolean {

        this._layout = info.layout;
        const bindings = info.layout.bindings;

        this._buffers = Array(bindings.length).fill(null);
        this._textures = Array(bindings.length).fill(null);
        this._samplers = Array(bindings.length).fill(null);

        const gpuDescriptors: IWebGLGPUDescriptor[] = [];
        this._gpuDescriptorSet = { gpuDescriptors };

        for (let i = 0; i < bindings.length; ++i) {
            gpuDescriptors.push({
                type: bindings[i].descriptorType,
                gpuBuffer: null,
                gpuTexture: null,
                gpuSampler: null,
            });
        }

        return true;
    }

    public destroy () {
        this._layout = null;
        this._gpuDescriptorSet = null;
    }

    public update () {
        if (this._isDirty && this._gpuDescriptorSet) {
            const bindings = this._layout!.bindings;
            for (let i = 0; i < bindings.length; ++i) {
                if (bindings[i].descriptorType & DESCRIPTOR_BUFFER_TYPE) {
                    const buffer = this._buffers[i] as WebGLBuffer | null;
                    if (buffer) {
                        this._gpuDescriptorSet.gpuDescriptors[i].gpuBuffer = buffer.gpuBuffer || buffer.gpuBufferView;
                    }
                } else if (bindings[i].descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
                    if (this._textures[i]) {
                        this._gpuDescriptorSet.gpuDescriptors[i].gpuTexture =
                            (this._textures[i] as WebGLTexture).gpuTexture;
                    }
                    if (this._samplers[i]) {
                        this._gpuDescriptorSet.gpuDescriptors[i].gpuSampler =
                            (this._samplers[i] as WebGLSampler).gpuSampler;
                    }
                }
            }
            this._isDirty = false;
        }
    }
}
