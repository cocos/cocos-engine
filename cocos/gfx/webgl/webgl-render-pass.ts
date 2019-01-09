import { GFXDevice } from '../device';
import { GFXRenderPass, IGFXRenderPassInfo } from '../render-pass';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPURenderPass } from './webgl-gpu-objects';

export class WebGLGFXRenderPass extends GFXRenderPass {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

    public get gpuRenderPass (): WebGLGPURenderPass {
        return  this._gpuRenderPass as WebGLGPURenderPass;
    }

    private _gpuRenderPass: WebGLGPURenderPass | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXRenderPassInfo): boolean {

        if (info.colorAttachments !== undefined) {
            this._colorInfos = info.colorAttachments;
        }

        if (info.depthStencilAttachment !== undefined) {
            this._depthStencilInfo = info.depthStencilAttachment;
        }

        this._gpuRenderPass = this.webGLDevice.emitCmdCreateGPURenderPass(info);

        return true;
    }

    public destroy () {

        if (this._gpuRenderPass) {
            this.webGLDevice.emitCmdDestroyGPURenderPass(this._gpuRenderPass);
            this._gpuRenderPass = null;
        }
    }
}
