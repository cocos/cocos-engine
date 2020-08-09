import { GFXDescriptorSet, IGFXDescriptorSetInfo } from '../descriptor-set';
import { GFXDescriptorType, GFXStatus } from '../define';
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

        Array.prototype.push.apply(this._layout, info.layout);
        this._buffers = Array(this._layout.length).fill(null);
        this._textures = Array(this._layout.length).fill(null);
        this._samplers = Array(this._layout.length).fill(null);

        const gpuDescriptors: IWebGL2GPUDescriptor[] = [];
        this._gpuDescriptorSet = { gpuDescriptors };

        for (let i = 0; i < info.layout.length; ++i) {
            gpuDescriptors.push({
                type: info.layout[i],
                gpuBuffer: null,
                gpuTexture: null,
                gpuSampler: null,
            });
        }

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._layout.length = 0;
        this._gpuDescriptorSet = null;
        this._status = GFXStatus.UNREADY;
    }

    public update () {
        if (this._isDirty && this._gpuDescriptorSet) {
            for (let i = 0; i < this._layout.length; ++i) {
                switch (this._layout[i]) {
                    case GFXDescriptorType.UNIFORM_BUFFER: {
                        if (this._buffers[i]) {
                            this._gpuDescriptorSet.gpuDescriptors[i].gpuBuffer =
                                (this._buffers[i] as WebGL2Buffer).gpuBuffer;
                        }
                        break;
                    }
                    case GFXDescriptorType.SAMPLER: {
                        if (this._textures[i]) {
                            this._gpuDescriptorSet.gpuDescriptors[i].gpuTexture =
                                (this._textures[i] as WebGL2Texture).gpuTexture;
                        }
                        if (this._samplers[i]) {
                            this._gpuDescriptorSet.gpuDescriptors[i].gpuSampler =
                                (this._samplers[i] as WebGL2Sampler).gpuSampler;
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
