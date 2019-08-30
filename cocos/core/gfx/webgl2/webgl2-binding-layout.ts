import { GFXBindingLayout, GFXBindingUnit, IGFXBindingLayoutInfo } from '../binding-layout';
import { GFXBindingType, GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { WebGL2GFXBuffer } from './webgl2-buffer';
import { WebGL2GPUBinding, WebGL2GPUBindingLayout } from './webgl2-gpu-objects';
import { WebGL2GFXSampler } from './webgl2-sampler';
import { WebGL2GFXTextureView } from './webgl2-texture-view';

export class WebGL2GFXBindingLayout extends GFXBindingLayout {

    public get gpuBindingLayout (): WebGL2GPUBindingLayout {
        return  this._gpuBindingLayout as WebGL2GPUBindingLayout;
    }

    private _gpuBindingLayout: WebGL2GPUBindingLayout | null = null;

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
            gpuBindings: new Array<WebGL2GPUBinding>(info.bindings.length),
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
                            this._gpuBindingLayout.gpuBindings[i].gpuBuffer =
                                (bindingUnit.buffer as WebGL2GFXBuffer).gpuBuffer;
                        }
                        break;
                    }
                    case GFXBindingType.SAMPLER: {
                        if (bindingUnit.texView) {
                            this._gpuBindingLayout.gpuBindings[i].gpuTexView =
                                (bindingUnit.texView as WebGL2GFXTextureView).gpuTextureView;
                        }
                        if (bindingUnit.sampler) {
                            this._gpuBindingLayout.gpuBindings[i].gpuSampler =
                                (bindingUnit.sampler as WebGL2GFXSampler).gpuSampler;
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
