import { GFXRenderPass, IGFXRenderPassInfo } from '../render-pass';
import { IWebGL2GPURenderPass } from './webgl2-gpu-objects';
import { GFXStatus } from '../define';

export class WebGL2RenderPass extends GFXRenderPass {

    public get gpuRenderPass (): IWebGL2GPURenderPass {
        return  this._gpuRenderPass!;
    }

    private _gpuRenderPass: IWebGL2GPURenderPass | null = null;

    public initialize (info: IGFXRenderPassInfo): boolean {

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
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._gpuRenderPass = null;
        this._status = GFXStatus.UNREADY;
    }
}
