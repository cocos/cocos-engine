import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from '../pipeline-layout';
import { WebGL2GPUPipelineLayout } from './webgl2-gpu-objects';

export class WebGL2GFXPipelineLayout extends GFXPipelineLayout {

    public get gpuPipelineLayout (): WebGL2GPUPipelineLayout {
        return  this._gpuPipelineLayout!;
    }

    private _gpuPipelineLayout: WebGL2GPUPipelineLayout | null = null;

    protected _initialize (info: IGFXPipelineLayoutInfo): boolean {
        return true;
    }

    protected _destroy () {
    }
}
