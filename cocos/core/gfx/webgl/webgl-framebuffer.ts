import { GFXStatus } from '../define';
import { GFXFramebuffer, IGFXFramebufferInfo } from '../framebuffer';
import { WebGLCmdFuncCreateFramebuffer, WebGLCmdFuncDestroyFramebuffer } from './webgl-commands';
import { WebGLDevice } from './webgl-device';
import { IWebGLGPUFramebuffer } from './webgl-gpu-objects';
import { WebGLRenderPass } from './webgl-render-pass';
import { IWebGLGPUTexture } from './webgl-gpu-objects';
import { WebGLTexture } from './webgl-texture';

export class WebGLFramebuffer extends GFXFramebuffer {

    get gpuFramebuffer (): IWebGLGPUFramebuffer {
        return  this._gpuFramebuffer!;
    }

    private _gpuFramebuffer: IWebGLGPUFramebuffer | null = null;

    public initialize (info: IGFXFramebufferInfo): boolean {

        this._renderPass = info.renderPass;
        this._colorTextures = info.colorTextures || [];
        this._depthStencilTexture = info.depthStencilTexture || null;

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

        const gpuColorTextures: IWebGLGPUTexture[] = [];
        if (info.colorTextures !== undefined) {
            for (const colorTexture of info.colorTextures) {
                if (colorTexture) {
                    gpuColorTextures.push((colorTexture as WebGLTexture).gpuTexture);
                }
            }
        }

        let gpuDepthStencilTexture: IWebGLGPUTexture | null = null;
        if (info.depthStencilTexture) {
            gpuDepthStencilTexture = (info.depthStencilTexture as WebGLTexture).gpuTexture;
        }

        this._gpuFramebuffer = {
            gpuRenderPass: (info.renderPass as WebGLRenderPass).gpuRenderPass,
            gpuColorTextures,
            gpuDepthStencilTexture,
            glFramebuffer: null,
        };

        WebGLCmdFuncCreateFramebuffer(this._device as WebGLDevice, this._gpuFramebuffer);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuFramebuffer) {
            WebGLCmdFuncDestroyFramebuffer(this._device as WebGLDevice, this._gpuFramebuffer);
            this._gpuFramebuffer = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
