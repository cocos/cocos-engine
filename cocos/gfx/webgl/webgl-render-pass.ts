import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXRenderPass, IGFXRenderPassInfo } from '../render-pass';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPURenderPass } from './webgl-gpu-objects';

export class WebGLGFXRenderPass extends GFXRenderPass {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

    public get gpuRenderPass (): WebGLGPURenderPass {
        return  this._gpuRenderPass!;
    }

    private _gpuRenderPass: WebGLGPURenderPass | null = null;

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
