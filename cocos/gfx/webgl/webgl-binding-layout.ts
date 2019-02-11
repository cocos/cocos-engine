import { GFXBindingLayout, GFXBindingUnit, IGFXBindingLayoutInfo } from '../binding-layout';
import { GFXStatus, GFXBindingType } from '../define';
import { GFXDevice } from '../device';
import { WebGLGPUBindingLayout, WebGLGPUBinding } from './webgl-gpu-objects';
import { WebGLGFXBuffer } from './webgl-buffer';
import { WebGLGFXTextureView } from './webgl-texture-view';
import { WebGLGFXSampler } from './webgl-sampler';

export class WebGLGFXBindingLayout extends GFXBindingLayout {

    public get gpuBindingLayout (): WebGLGPUBindingLayout {
        return  this._gpuBindingLayout as WebGLGPUBindingLayout;
    }

    private _gpuBindingLayout: WebGLGPUBindingLayout | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXBindingLayoutInfo): boolean {

        this._bindingUnits = new Array<GFXBindingUnit>(info.bindings.length);
        for (let i = 0; i < info.bindings.length; ++i) {
            const binding = info.bindings[i];
            this._bindingUnits[i] = {
                binding: binding.binding,
                type: binding.type,
                name: binding.name,
                buffer: null,
                texView: null,
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
                type: binding.type,
                name: binding.name,
                gpuBuffer: null,
                gpuTexView: null,
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
                            this._gpuBindingLayout.gpuBindings[i].gpuBuffer = (bindingUnit.buffer as WebGLGFXBuffer).gpuBuffer;
                        }
                        break;
                    }
                    case GFXBindingType.SAMPLER: {
                        if (bindingUnit.texView) {
                            this._gpuBindingLayout.gpuBindings[i].gpuTexView = (bindingUnit.texView as WebGLGFXTextureView).gpuTextureView;
                        }
    
                        if (bindingUnit.sampler) {
                            this._gpuBindingLayout.gpuBindings[i].gpuSampler = (bindingUnit.sampler as WebGLGFXSampler).gpuSampler;
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
