import { GFXDevice } from '../gfx-device';
import { WebGLGFXDevice } from './webgl-gfx-device';
import { GFXFramebuffer, GFXFramebufferInfo } from '../gfx-framebuffer';
import { WebGLGPUFramebuffer } from './webgl-gpu-objects';

export class WebGLGFXFramebuffer extends GFXFramebuffer {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXFramebufferInfo) : boolean {

        this._colorViews = info.colorViews;
        this._depthStencilView = info.depthStencilView;
        this._isOffscreen = info.isOffscreen;

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

    private _gpuFramebuffer : WebGLGPUFramebuffer | null = null;
};
