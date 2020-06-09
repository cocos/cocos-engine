import { GFXStatus } from '../define';
import { GFXFramebuffer, IGFXFramebufferInfo } from '../framebuffer';
import { WebGLCmdFuncCreateFramebuffer, WebGLCmdFuncDestroyFramebuffer } from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUFramebuffer } from './webgl-gpu-objects';
import { WebGLGFXRenderPass } from './webgl-render-pass';
import { WebGLGPUTexture } from './webgl-gpu-objects';
import { WebGLGFXTexture } from './webgl-texture';

export class WebGLGFXFramebuffer extends GFXFramebuffer {

    get gpuFramebuffer (): WebGLGPUFramebuffer {
        return  this._gpuFramebuffer!;
    }

    private _gpuFramebuffer: WebGLGPUFramebuffer | null = null;

    public initialize (info: IGFXFramebufferInfo): boolean {

        this._renderPass = info.renderPass;
        this._colorTextures = info.colorTextures || [];
        this._depthStencilTexture = info.depthStencilTexture || null;
        this._isOffscreen = info.isOffscreen !== undefined ? info.isOffscreen : true;

        if (info.depStencilMipmapLevel && info.depStencilMipmapLevel !== 0) {
            console.warn('The mipmap level of th texture image to be attached of depth stencil attachment should be 0. Convert to 0.');
        }
        if (info.colorMipmapLevels && info.colorMipmapLevels.length > 0) {
            for (let i = 0; i < info.colorMipmapLevels.length; ++i) {
                if (info.colorMipmapLevels[i] !== 0) {
                    console.warn(`The mipmap level of th texture image to be attached of color attachment ${i} should be 0. Convert to 0.`);
                }
            }
        }

        if (this._isOffscreen) {

            const gpuColorTextures: WebGLGPUTexture[] = [];
            if (info.colorTextures !== undefined) {
                for (const colorTexture of info.colorTextures) {
                    gpuColorTextures.push((colorTexture as WebGLGFXTexture).gpuTexture);
                }
            }

            let gpuDepthStencilTexture: WebGLGPUTexture | null = null;
            if (info.depthStencilTexture) {
                gpuDepthStencilTexture = (info.depthStencilTexture as WebGLGFXTexture).gpuTexture;
            }

            this._gpuFramebuffer = {
                gpuRenderPass: (info.renderPass as WebGLGFXRenderPass).gpuRenderPass,
                gpuColorTextures,
                gpuDepthStencilTexture,
                isOffscreen: this._isOffscreen,
                glFramebuffer: null,
            };

            WebGLCmdFuncCreateFramebuffer(this._device as WebGLGFXDevice, this._gpuFramebuffer);
        } else {
            this._gpuFramebuffer = {
                gpuRenderPass: (info.renderPass as WebGLGFXRenderPass).gpuRenderPass,
                gpuColorTextures: [],
                gpuDepthStencilTexture: null,
                isOffscreen: false,
                glFramebuffer: null,
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
