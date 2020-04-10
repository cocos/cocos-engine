import { GFXRenderPass, IGFXRenderPassInfo } from '../render-pass';
import { WebGLGPURenderPass } from './webgl-gpu-objects';

export class WebGLGFXRenderPass extends GFXRenderPass {

    public get gpuRenderPass (): WebGLGPURenderPass {
        return  this._gpuRenderPass!;
    }

    private _gpuRenderPass: WebGLGPURenderPass | null = null;

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
