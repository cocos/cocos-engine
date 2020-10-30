import { RenderPass, RenderPassInfo } from '../render-pass';
import { IWebGLGPURenderPass } from './webgl-gpu-objects';

export class WebGLRenderPass extends RenderPass {

    public get gpuRenderPass (): IWebGLGPURenderPass {
        return  this._gpuRenderPass!;
    }

    private _gpuRenderPass: IWebGLGPURenderPass | null = null;

    public initialize (info: RenderPassInfo): boolean {

        this._colorInfos = info.colorAttachments;
        this._depthStencilInfo = info.depthStencilAttachment;
        if (info.subPasses) {
            this._subPasses = info.subPasses;
        }

        this._gpuRenderPass = {
            colorAttachments: this._colorInfos,
            depthStencilAttachment: this._depthStencilInfo,
        };

        this._hash = this.computeHash();

        return true;
    }

    public destroy () {
        this._gpuRenderPass = null;
    }
}
