import { GFXDevice } from '../gfx-device';
import { WebGLGFXDevice } from './webgl-gfx-device';
import { WebGLGPUBindingSetLayout } from './webgl-gpu-objects';
import { GFXBindingSetLayout, GFXBindingSetLayoutInfo, GFXBindingType } from '../gfx-binding-set-layout';
import { GFXBuffer } from '../gfx-buffer';
import { GFXSampler } from '../gfx-sampler';
import { GFXTextureView } from '../gfx-texture-view';

export class WebGLGFXBindingSetLayout extends GFXBindingSetLayout {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXBindingSetLayoutInfo): boolean {

        for (let i = 0; i < info.bindings.length; ++i) {
            let binding = info.bindings[i];

            this._bindingUnits.push({
                binding: binding.binding,
                type: binding.type,
                name: binding.name,
                buffer: null,
                texView: null,
                sampler: null,
            });
        }

        this._gpuBindingSetLayout = this.webGLDevice.emitCmdCreateGPUBindingSetLayout(info);

        return true;
    }

    public destroy() {
        if (this._gpuBindingSetLayout) {
            this.webGLDevice.emitCmdDestroyGPUBindingSetLayout(this._gpuBindingSetLayout);
            this._gpuBindingSetLayout = null;
        }
    }

    public update() {
        
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuBindingSetLayout(): WebGLGPUBindingSetLayout | null {
        return this._gpuBindingSetLayout;
    }

    private _gpuBindingSetLayout: WebGLGPUBindingSetLayout | null = null;
};
