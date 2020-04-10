import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from '../pipeline-layout';
import { WebGLGPUPipelineLayout } from './webgl-gpu-objects';
import { GFXStatus } from '../define';

export class WebGLGFXPipelineLayout extends GFXPipelineLayout {

    get gpuPipelineLayout (): WebGLGPUPipelineLayout {
        return  this._gpuPipelineLayout!;
    }

    private _gpuPipelineLayout: WebGLGPUPipelineLayout | null = null;

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
