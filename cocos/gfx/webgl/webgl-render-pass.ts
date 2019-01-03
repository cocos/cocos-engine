import { GFXDevice } from '../device';
import { WebGLGPURenderPass } from './webgl-gpu-objects';
import { WebGLGFXDevice } from './webgl-device';
import { GFXRenderPass, GFXRenderPassInfo } from '../render-pass';

export class WebGLGFXRenderPass extends GFXRenderPass {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXRenderPassInfo): boolean {

        if (info.colorAttachments !== undefined) {
            this._colorInfos = info.colorAttachments;
        }

        if (info.depthStencilAttachment !== undefined) {
            this._depthStencilInfo = info.depthStencilAttachment;
        }

        this._gpuRenderPass = this.webGLDevice.emitCmdCreateGPURenderPass(info);

        return true;
    }

    public destroy() {

        if (this._gpuRenderPass) {
            this.webGLDevice.emitCmdDestroyGPURenderPass(this._gpuRenderPass);
            this._gpuRenderPass = null;
        }
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuRenderPass(): WebGLGPURenderPass {
        return <WebGLGPURenderPass>this._gpuRenderPass;
    }

    private _gpuRenderPass: WebGLGPURenderPass | null = null;
};
