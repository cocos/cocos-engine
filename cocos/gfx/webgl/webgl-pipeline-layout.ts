import { GFXDevice } from '../device';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUPipelineLayout } from './webgl-gpu-objects';
import { GFXPipelineLayout, GFXPipelineLayoutInfo } from '../pipeline-layout';

export class WebGLGFXPipelineLayout extends GFXPipelineLayout {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXPipelineLayoutInfo): boolean {

        this._layouts = info.layouts;

        if(info.pushConstantsRanges !== undefined) {
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
