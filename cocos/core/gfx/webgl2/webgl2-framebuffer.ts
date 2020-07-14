import { GFXStatus } from '../define';
import { GFXFramebuffer, IGFXFramebufferInfo } from '../framebuffer';
import { WebGL2CmdFuncCreateFramebuffer, WebGL2CmdFuncDestroyFramebuffer } from './webgl2-commands';
import { WebGL2GFXDevice } from './webgl2-device';
import { WebGL2GPUFramebuffer, WebGL2GPUTexture } from './webgl2-gpu-objects';
import { WebGL2GFXRenderPass } from './webgl2-render-pass';
import { WebGL2GFXTexture } from './webgl2-texture';

export class WebGL2GFXFramebuffer extends GFXFramebuffer {

    get gpuFramebuffer (): WebGL2GPUFramebuffer {
        return  this._gpuFramebuffer!;
    }

    private _gpuFramebuffer: WebGL2GPUFramebuffer | null = null;

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

        const gpuColorTextures: WebGL2GPUTexture[] = [];
        if (info.colorTextures !== undefined) {
            for (const colorTexture of info.colorTextures) {
                if (colorTexture) {
                    gpuColorTextures.push((colorTexture as WebGL2GFXTexture).gpuTexture);
                }
            }
        }

        let gpuDepthStencilTexture: WebGL2GPUTexture | null = null;
        if (info.depthStencilTexture) {
            gpuDepthStencilTexture = (info.depthStencilTexture as WebGL2GFXTexture).gpuTexture;
        }

        this._gpuFramebuffer = {
            gpuRenderPass: (info.renderPass as WebGL2GFXRenderPass).gpuRenderPass,
            gpuColorTextures,
            gpuDepthStencilTexture,
            glFramebuffer: null,
        };

        WebGL2CmdFuncCreateFramebuffer(this._device as WebGL2GFXDevice, this._gpuFramebuffer);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuFramebuffer) {
            WebGL2CmdFuncDestroyFramebuffer(this._device as WebGL2GFXDevice, this._gpuFramebuffer);
            this._gpuFramebuffer = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
