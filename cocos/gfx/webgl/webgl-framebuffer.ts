import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXFramebuffer, IGFXFramebufferInfo } from '../framebuffer';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUFramebuffer } from './webgl-gpu-objects';

export class WebGLGFXFramebuffer extends GFXFramebuffer {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

    public get gpuFramebuffer (): WebGLGPUFramebuffer {
        return  this._gpuFramebuffer as WebGLGPUFramebuffer;
    }

    private _gpuFramebuffer: WebGLGPUFramebuffer | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXFramebufferInfo): boolean {

        this._renderPass = info.renderPass;

        if (info.colorViews !== undefined) {
            this._colorViews = info.colorViews;
        }

        this._depthStencilView = info.depthStencilView !== undefined ? info.depthStencilView : null;
        this._isOffscreen = info.isOffscreen !== undefined ? info.isOffscreen : true;

        this._gpuFramebuffer = this.webGLDevice.emitCmdCreateGPUFramebuffer(info);
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {

        if (this._gpuFramebuffer) {
            this.webGLDevice.emitCmdDestroyGPUFramebuffer(this._gpuFramebuffer);
            this._gpuFramebuffer = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
