import { GFXBindingLayout, GFXBindingUnit, IGFXBindingLayoutInfo } from '../binding-layout';
import { GFXDevice } from '../device';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUBindingLayout } from './webgl-gpu-objects';

export class WebGLGFXBindingLayout extends GFXBindingLayout {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

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

        this._gpuBindingLayout = this.webGLDevice.emitCmdCreateGPUBindingLayout(info);

        return true;
    }

    public destroy () {
        if (this._gpuBindingLayout) {
            this.webGLDevice.emitCmdDestroyGPUBindingLayout(this._gpuBindingLayout);
            this._gpuBindingLayout = null;
        }
    }

    public update () {
        if (this._isDirty) {
            this.webGLDevice.emitCmdUpdateGPUBindingLayout(this._gpuBindingLayout as WebGLGPUBindingLayout, this._bindingUnits);
            this._isDirty = false;
        }
    }
}
