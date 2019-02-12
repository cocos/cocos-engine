import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from '../pipeline-layout';
import { WebGL2GPUPipelineLayout } from './webgl2-gpu-objects';

export class WebGL2GFXPipelineLayout extends GFXPipelineLayout {

    public get gpuPipelineLayout (): WebGL2GPUPipelineLayout {
        return  this._gpuPipelineLayout!;
    }

    private _gpuPipelineLayout: WebGL2GPUPipelineLayout | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXPipelineLayoutInfo): boolean {

        this._layouts = info.layouts;
        this._pushConstantsRanges = info.pushConstantsRanges || [];
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._status = GFXStatus.UNREADY;
    }
}
