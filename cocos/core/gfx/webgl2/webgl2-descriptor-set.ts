import { GFXDescriptorSet, IGFXDescriptorSetInfo, DESCRIPTOR_BUFFER_TYPE, DESCRIPTOR_SAMPLER_TYPE } from '../descriptor-set';
import { WebGL2Buffer } from './webgl2-buffer';
import { IWebGL2GPUDescriptorSet, IWebGL2GPUDescriptor } from './webgl2-gpu-objects';
import { WebGL2Sampler } from './webgl2-sampler';
import { WebGL2Texture } from './webgl2-texture';

export class WebGL2DescriptorSet extends GFXDescriptorSet {

    get gpuDescriptorSet (): IWebGL2GPUDescriptorSet {
        return this._gpuDescriptorSet as IWebGL2GPUDescriptorSet;
    }

    private _gpuDescriptorSet: IWebGL2GPUDescriptorSet | null = null;

    public initialize (info: IGFXDescriptorSetInfo): boolean {

        this._layout = info.layout;
        const bindings = info.layout.bindings;

        this._buffers = Array(bindings.length).fill(null);
        this._textures = Array(bindings.length).fill(null);
        this._samplers = Array(bindings.length).fill(null);

        const gpuDescriptors: IWebGL2GPUDescriptor[] = [];
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
                    if (this._buffers[i]) {
                        this._gpuDescriptorSet.gpuDescriptors[i].gpuBuffer =
                            (this._buffers[i] as WebGL2Buffer).gpuBuffer;
                    }
                } else if (bindings[i].descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
                    if (this._textures[i]) {
                        this._gpuDescriptorSet.gpuDescriptors[i].gpuTexture =
                            (this._textures[i] as WebGL2Texture).gpuTexture;
                    }
                    if (this._samplers[i]) {
                        this._gpuDescriptorSet.gpuDescriptors[i].gpuSampler =
                            (this._samplers[i] as WebGL2Sampler).gpuSampler;
                    }
                }
            }
            this._isDirty = false;
        }
    }
}
