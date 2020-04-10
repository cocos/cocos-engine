import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXFramebuffer, IGFXFramebufferInfo } from '../framebuffer';
import { WebGLCmdFuncCreateFramebuffer, WebGLCmdFuncDestroyFramebuffer } from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUFramebuffer, WebGLGPUTextureView } from './webgl-gpu-objects';
import { WebGLGFXRenderPass } from './webgl-render-pass';
import { WebGLGFXTextureView } from './webgl-texture-view';

export class WebGLGFXFramebuffer extends GFXFramebuffer {

    public get gpuFramebuffer (): WebGLGPUFramebuffer {
        return  this._gpuFramebuffer!;
    }

    private _gpuFramebuffer: WebGLGPUFramebuffer | null = null;

    protected _initialize (info: IGFXFramebufferInfo): boolean {

        if (this._isOffscreen) {

            const gpuColorViews: WebGLGPUTextureView[] = [];
            if (info.colorViews !== undefined) {
                for (const colorView of info.colorViews) {
                    gpuColorViews.push((colorView as WebGLGFXTextureView).gpuTextureView);
                }
            }

            let gpuDepthStencilView: WebGLGPUTextureView | null = null;
            if (info.depthStencilView) {
                gpuDepthStencilView = (info.depthStencilView as WebGLGFXTextureView).gpuTextureView;
            }

            this._gpuFramebuffer = {
                gpuRenderPass: (info.renderPass as WebGLGFXRenderPass).gpuRenderPass,
                gpuColorViews,
                gpuDepthStencilView,
                isOffscreen: this._isOffscreen,
                glFramebuffer: null,
            };

            WebGLCmdFuncCreateFramebuffer(this._device as WebGLGFXDevice, this._gpuFramebuffer);
        } else {
            this._gpuFramebuffer = {
                gpuRenderPass: (info.renderPass as WebGLGFXRenderPass).gpuRenderPass,
                gpuColorViews: [],
                gpuDepthStencilView: null,
                isOffscreen: false,
                glFramebuffer: null,
            };
        }

        return true;
    }

    protected _destroy () {
        if (this._isOffscreen && this._gpuFramebuffer) {
            WebGLCmdFuncDestroyFramebuffer(this._device as WebGLGFXDevice, this._gpuFramebuffer);
        }
        this._gpuFramebuffer = null;
    }
}
