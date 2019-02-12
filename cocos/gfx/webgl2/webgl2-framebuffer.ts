import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXFramebuffer, IGFXFramebufferInfo } from '../framebuffer';
import { WebGL2CmdFuncCreateFramebuffer, WebGL2CmdFuncDestroyFramebuffer } from './webgl2-commands';
import { WebGL2GFXDevice } from './webgl2-device';
import { WebGL2GPUFramebuffer, WebGL2GPUTextureView } from './webgl2-gpu-objects';
import { WebGL2GFXRenderPass } from './webgl2-render-pass';
import { WebGL2GFXTextureView } from './webgl2-texture-view';

export class WebGL2GFXFramebuffer extends GFXFramebuffer {

    public get gpuFramebuffer (): WebGL2GPUFramebuffer {
        return  this._gpuFramebuffer!;
    }

    private _gpuFramebuffer: WebGL2GPUFramebuffer | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXFramebufferInfo): boolean {

        this._renderPass = info.renderPass;
        this._colorViews = info.colorViews || [];
        this._depthStencilView = info.depthStencilView || null;
        this._isOffscreen = info.isOffscreen !== undefined ? info.isOffscreen : false;

        if (this._isOffscreen) {

            const gpuColorViews: WebGL2GPUTextureView[] = [];
            if (info.colorViews !== undefined) {
                for (const colorView of info.colorViews) {
                    gpuColorViews.push((colorView as WebGL2GFXTextureView).gpuTextureView);
                }
            }

            let gpuDepthStencilView: WebGL2GPUTextureView | null = null;
            if (info.depthStencilView !== undefined) {
                gpuDepthStencilView = (info.depthStencilView as WebGL2GFXTextureView).gpuTextureView;
            }

            this._gpuFramebuffer = {
                gpuRenderPass: (info.renderPass as WebGL2GFXRenderPass).gpuRenderPass,
                gpuColorViews,
                gpuDepthStencilView,
                isOffscreen: info.isOffscreen,
                glFramebuffer: 0,
            };

            WebGL2CmdFuncCreateFramebuffer(this._device as WebGL2GFXDevice, this._gpuFramebuffer);
        } else {
            this._gpuFramebuffer = {
                gpuRenderPass: (info.renderPass as WebGL2GFXRenderPass).gpuRenderPass,
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
            WebGL2CmdFuncDestroyFramebuffer(this._device as WebGL2GFXDevice, this._gpuFramebuffer);
        }
        this._gpuFramebuffer = null;
        this._status = GFXStatus.UNREADY;
    }
}
