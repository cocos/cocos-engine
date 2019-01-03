import { GFXDevice } from '../device';
import { WebGLGFXDevice } from './webgl-device';
import { GFXFramebuffer, GFXFramebufferInfo } from '../framebuffer';
import { WebGLGPUFramebuffer } from './webgl-gpu-objects';

export class WebGLGFXFramebuffer extends GFXFramebuffer {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXFramebufferInfo) : boolean {

        this._renderPass = info.renderPass;

        if(info.colorViews !== undefined) {
            this._colorViews = info.colorViews;
        }

        this._depthStencilView = info.depthStencilView !== undefined? info.depthStencilView : null;
        this._isOffscreen = info.isOffscreen !== undefined? info.isOffscreen : true;

        this._gpuFramebuffer = this.webGLDevice.emitCmdCreateGPUFramebuffer(info);

        return true;
    }

    public destroy() {

        if(this._gpuFramebuffer)
        {
            this.webGLDevice.emitCmdDestroyGPUFramebuffer(this._gpuFramebuffer);
            this._gpuFramebuffer = null;
        }
    }

    public get webGLDevice() : WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuFramebuffer() : WebGLGPUFramebuffer | null {
        return this._gpuFramebuffer;
    }

    private _gpuFramebuffer : WebGLGPUFramebuffer | null = null;
};
