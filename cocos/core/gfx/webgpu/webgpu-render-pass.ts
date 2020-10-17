import { GFXRenderPass, GFXRenderPassInfo } from '../render-pass';
import { IWebGPUGPURenderPass } from './WebGPU-gpu-objects';

export class WebGPURenderPass extends GFXRenderPass {

    public get gpuRenderPass (): IWebGPUGPURenderPass {
        return  this._gpuRenderPass!;
    }

    private _gpuRenderPass: IWebGPUGPURenderPass | null = null;

    public initialize (info: GFXRenderPassInfo): boolean {

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
