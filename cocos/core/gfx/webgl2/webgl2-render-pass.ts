import { GFXRenderPass, IGFXRenderPassInfo } from '../render-pass';
import { WebGL2GPURenderPass } from './webgl2-gpu-objects';

export class WebGL2GFXRenderPass extends GFXRenderPass {

    public get gpuRenderPass (): WebGL2GPURenderPass {
        return  this._gpuRenderPass!;
    }

    private _gpuRenderPass: WebGL2GPURenderPass | null = null;

    protected _initialize (info: IGFXRenderPassInfo): boolean {

        this._gpuRenderPass = {
            colorAttachments: this._colorInfos,
            depthStencilAttachment: this._depthStencilInfo,
        };

        return true;
    }

    protected _destroy () {
        this._gpuRenderPass = null;
    }
}
