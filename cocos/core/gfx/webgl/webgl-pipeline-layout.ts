import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from '../pipeline-layout';
import { WebGLGPUPipelineLayout } from './webgl-gpu-objects';

export class WebGLGFXPipelineLayout extends GFXPipelineLayout {

    public get gpuPipelineLayout (): WebGLGPUPipelineLayout {
        return  this._gpuPipelineLayout!;
    }

    private _gpuPipelineLayout: WebGLGPUPipelineLayout | null = null;

    protected _initialize (info: IGFXPipelineLayoutInfo): boolean {
        return true;
    }

    protected _destroy () {
    }
}
