import { GFXDevice } from '../device';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUBindingLayout } from './webgl-gpu-objects';
import { GFXBindingLayout, GFXBindingLayoutInfo, GFXBindingUnit } from '../binding-layout';

export class WebGLGFXBindingLayout extends GFXBindingLayout {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXBindingLayoutInfo): boolean {

        this._bindingUnits = new Array<GFXBindingUnit>(info.bindings.length);
        for (let i = 0; i < info.bindings.length; ++i) {
            let binding = info.bindings[i];
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

    public destroy() {
        if (this._gpuBindingLayout) {
            this.webGLDevice.emitCmdDestroyGPUBindingLayout(this._gpuBindingLayout);
            this._gpuBindingLayout = null;
        }
    }

    public update() {
        if (this._gpuBindingLayout) {
            this.webGLDevice.emitCmdUpdateGPUBindingLayout(this._gpuBindingLayout, this._bindingUnits);
        }
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuBindingLayout(): WebGLGPUBindingLayout {
        return <WebGLGPUBindingLayout>this._gpuBindingLayout;
    }

    private _gpuBindingLayout: WebGLGPUBindingLayout | null = null;
};
