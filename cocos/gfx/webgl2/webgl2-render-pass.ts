import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXRenderPass, IGFXRenderPassInfo } from '../render-pass';
import { WebGL2GFXDevice } from './webgl2-device';
import { WebGL2GPURenderPass } from './webgl2-gpu-objects';

export class WebGL2GFXRenderPass extends GFXRenderPass {

    public get gpuRenderPass (): WebGL2GPURenderPass {
        return  this._gpuRenderPass!;
    }

    private _gpuRenderPass: WebGL2GPURenderPass | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXRenderPassInfo): boolean {

        this._colorInfos = info.colorAttachments || [];
        this._depthStencilInfo = info.depthStencilAttachment || null;

        this._gpuRenderPass = {
            colorAttachments: this._colorInfos,
            depthStencilAttachment: this._depthStencilInfo,
        };

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._gpuRenderPass = null;
        this._status = GFXStatus.UNREADY;
    }
}
