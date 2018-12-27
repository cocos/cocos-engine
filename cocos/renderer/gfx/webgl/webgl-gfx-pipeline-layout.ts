import { GFXDevice } from '../gfx-device';
import { GFXPipelineLayout, GFXPipelineLayoutInfo } from '../gfx-pipeline-layout';
import { WebGLGFXDevice } from './webgl-gfx-device';
import { WebGLGPUPipelineLayout } from './webgl-gpu-objects';

export class WebGLGFXPipelineLayout extends GFXPipelineLayout {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXPipelineLayoutInfo): boolean {

        this._layouts = info.layouts;

        if(info.pushConstantsRanges) {
            this._pushConstantsRanges = info.pushConstantsRanges;
        }

        return true;
    }

    public destroy() {
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuPipelineLayout(): WebGLGPUPipelineLayout | null {
        return this._gpuPipelineLayout;
    }

    private _gpuPipelineLayout: WebGLGPUPipelineLayout | null = null;
};
