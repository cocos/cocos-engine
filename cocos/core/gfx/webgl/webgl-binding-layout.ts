import { GFXBindingLayout, IGFXBindingLayoutInfo, GFXBindingUnit } from '../binding-layout';
import { GFXBindingType, GFXStatus } from '../define';
import { WebGLGFXBuffer } from './webgl-buffer';
import { WebGLGPUBinding, WebGLGPUBindingLayout } from './webgl-gpu-objects';
import { WebGLGFXSampler } from './webgl-sampler';
import { WebGLGFXTexture } from './webgl-texture';

export class WebGLGFXBindingLayout extends GFXBindingLayout {

    get gpuBindingLayout (): WebGLGPUBindingLayout {
        return this._gpuBindingLayout as WebGLGPUBindingLayout;
    }

    private _gpuBindingLayout: WebGLGPUBindingLayout | null = null;

    public initialize (info: IGFXBindingLayoutInfo): boolean {

        this._bindingUnits = new Array<GFXBindingUnit>(info.bindings.length);

        for (let i = 0; i < info.bindings.length; ++i) {
            const binding = info.bindings[i];
            this._bindingUnits[i] = {
                binding: binding.binding,
                type: binding.bindingType,
                name: binding.name,
                buffer: null,
                texture: null,
                sampler: null,
            };
        }

        this._gpuBindingLayout = {
            gpuBindings: new Array<WebGLGPUBinding>(info.bindings.length),
        };

        for (let i = 0; i < info.bindings.length; ++i) {
            const binding = info.bindings[i];
            this._gpuBindingLayout.gpuBindings[i] = {
                binding: binding.binding,
                type: binding.bindingType,
                name: binding.name,
                gpuBuffer: null,
                gpuTexture: null,
                gpuSampler: null,
            };
        }

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._gpuBindingLayout = null;
        this._status = GFXStatus.UNREADY;
    }

    public update () {
        if (this._isDirty && this._gpuBindingLayout) {
            for (let i = 0; i < this._bindingUnits.length; ++i) {
                const bindingUnit = this._bindingUnits[i];
                switch (bindingUnit.type) {
                    case GFXBindingType.UNIFORM_BUFFER: {
                        if (bindingUnit.buffer) {
                            this._gpuBindingLayout.gpuBindings[i].gpuBuffer =
                                (bindingUnit.buffer as WebGLGFXBuffer).gpuBuffer;
                        }
                        break;
                    }
                    case GFXBindingType.SAMPLER: {
                        if (bindingUnit.texture) {
                            this._gpuBindingLayout.gpuBindings[i].gpuTexture =
                                (bindingUnit.texture as WebGLGFXTexture).gpuTexture;
                        }
                        if (bindingUnit.sampler) {
                            this._gpuBindingLayout.gpuBindings[i].gpuSampler =
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
