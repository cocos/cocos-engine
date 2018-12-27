import { GFXDevice } from '../gfx-device';
import { WebGLGFXDevice } from './webgl-gfx-device';
import { WebGLGPUBindingLayout } from './webgl-gpu-objects';
import { GFXBindingLayout, GFXBindingLayoutInfo, GFXBindingUnit } from '../gfx-binding-layout';

export class WebGLGFXBindingLayout extends GFXBindingLayout {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXBindingLayoutInfo): boolean {

        this._bindingUnits = new Array<GFXBindingUnit>(info.bindings.length);
        for (let i = 0; i < info.bindings.length; ++i) {
            let binding = info.bindings[i];
            let bindingUnit = this._bindingUnits[i];
            bindingUnit.binding = binding.binding;
            bindingUnit.type = binding.type;
            bindingUnit.name = binding.name;
        }

        this._gpuBindingLayout = this.webGLDevice.emitCmdCreateGPUBindingLayout(info);

        return true;
    }

    public destroy() {
        if (this._gpuBindingLayout) {
            this.webGLDevice.emitCmdDestroyGPUBindingLayout(this._gpuBindingLayout);
            this._gpuBindingLayout = null;
        }
    }

    public update() {
        if (this._gpuBindingLayout) {
            this.webGLDevice.emitCmdUpdateGPUBindingLayout(this._gpuBindingLayout, this._bindingUnits);
            this._gpuBindingLayout = null;
        }
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuBindingLayout(): WebGLGPUBindingLayout | null {
        return this._gpuBindingLayout;
    }

    private _gpuBindingLayout: WebGLGPUBindingLayout | null = null;
};
