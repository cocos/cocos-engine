import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXFramebuffer, IGFXFramebufferInfo } from '../framebuffer';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUFramebuffer, WebGLGPUTextureView } from './webgl-gpu-objects';
import { WebGLGFXRenderPass } from './webgl-render-pass';
import { WebGLGFXTextureView } from './webgl-texture-view';
import { WebGLCmdFuncCreateFramebuffer, WebGLCmdFuncDestroyFramebuffer } from './webgl-commands';

export class WebGLGFXFramebuffer extends GFXFramebuffer {

    public get gpuFramebuffer (): WebGLGPUFramebuffer {
        return  this._gpuFramebuffer!;
    }

    private _gpuFramebuffer: WebGLGPUFramebuffer | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXFramebufferInfo): boolean {

        this._renderPass = info.renderPass;
        this._colorViews = info.colorViews || [];
        this._depthStencilView = info.depthStencilView || null;
        this._isOffscreen = info.isOffscreen !== undefined? info.isOffscreen : false;

        if (this._isOffscreen) {

            const gpuColorViews: WebGLGPUTextureView[] = [];
            if (info.colorViews !== undefined) {
                for (const colorView of info.colorViews) {
                    gpuColorViews.push((colorView as WebGLGFXTextureView).gpuTextureView);
                }
            }

            let gpuDepthStencilView: WebGLGPUTextureView | null = null;
            if (info.depthStencilView !== undefined) {
                gpuDepthStencilView = (info.depthStencilView as WebGLGFXTextureView).gpuTextureView;
            }

            this._gpuFramebuffer = {
                gpuRenderPass: (info.renderPass as WebGLGFXRenderPass).gpuRenderPass,
                gpuColorViews,
                gpuDepthStencilView,
                isOffscreen: info.isOffscreen,
                glFramebuffer: 0,
            };

            WebGLCmdFuncCreateFramebuffer(this._device as WebGLGFXDevice, this._gpuFramebuffer);
        } else {
            this._gpuFramebuffer = {
                gpuRenderPass: (info.renderPass as WebGLGFXRenderPass).gpuRenderPass,
                gpuColorViews: [],
                gpuDepthStencilView: null,
                isOffscreen: info.isOffscreen,
                glFramebuffer: 0,
            };
        }

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._isOffscreen && this._gpuFramebuffer) {
            WebGLCmdFuncDestroyFramebuffer(this._device as WebGLGFXDevice, this._gpuFramebuffer);
        }
        this._gpuFramebuffer = null;
        this._status = GFXStatus.UNREADY;
    }
}
