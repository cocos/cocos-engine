import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from '../pipeline-layout';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUPipelineLayout } from './webgl-gpu-objects';

export class WebGLGFXPipelineLayout extends GFXPipelineLayout {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

    public get gpuPipelineLayout (): WebGLGPUPipelineLayout {
        return  this._gpuPipelineLayout as WebGLGPUPipelineLayout;
    }

    private _gpuPipelineLayout: WebGLGPUPipelineLayout | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXPipelineLayoutInfo): boolean {

        this._layouts = info.layouts;

        if (info.pushConstantsRanges !== undefined) {
            this._pushConstantsRanges = info.pushConstantsRanges;
        }
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._status = GFXStatus.UNREADY;
    }
}
