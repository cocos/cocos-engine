import { GFXFramebuffer, GFXFramebufferInfo } from '../framebuffer';
import { WebGPUCmdFuncCreateFramebuffer, WebGPUCmdFuncDestroyFramebuffer } from './WebGPU-commands';
import { WebGPUDevice } from './WebGPU-device';
import { IWebGPUGPUFramebuffer, IWebGPUGPUTexture } from './WebGPU-gpu-objects';
import { WebGPURenderPass } from './WebGPU-render-pass';
import { WebGPUTexture } from './WebGPU-texture';

export class WebGPUFramebuffer extends GFXFramebuffer {

    get gpuFramebuffer (): IWebGPUGPUFramebuffer {
        return  this._gpuFramebuffer!;
    }

    private _gpuFramebuffer: IWebGPUGPUFramebuffer | null = null;

    public initialize (info: GFXFramebufferInfo): boolean {

        this._renderPass = info.renderPass;
        this._colorTextures = info.colorTextures || [];
        this._depthStencilTexture = info.depthStencilTexture || null;

        if (info.depStencilMipmapLevel !== 0) {
            console.warn('The mipmap level of th texture image to be attached of depth stencil attachment should be 0. Convert to 0.');
        }
        for (let i = 0; i < info.colorMipmapLevels.length; ++i) {
            if (info.colorMipmapLevels[i] !== 0) {
                console.warn(`The mipmap level of th texture image to be attached of color attachment ${i} should be 0. Convert to 0.`);
            }
        }

        const gpuColorTextures: IWebGPUGPUTexture[] = [];
        for (let i = 0; i < info.colorTextures.length; i++) {
            const colorTexture = info.colorTextures[i];
            if (colorTexture) {
                gpuColorTextures.push((colorTexture as WebGPUTexture).gpuTexture);
            }
        }

        let gpuDepthStencilTexture: IWebGPUGPUTexture | null = null;
        if (info.depthStencilTexture) {
            gpuDepthStencilTexture = (info.depthStencilTexture as WebGPUTexture).gpuTexture;
        }

        this._gpuFramebuffer = {
            gpuRenderPass: (info.renderPass as WebGPURenderPass).gpuRenderPass,
            gpuColorTextures,
            gpuDepthStencilTexture,
            glFramebuffer: null,
        };

        WebGPUCmdFuncCreateFramebuffer(this._device as WebGPUDevice, this._gpuFramebuffer);

        return true;
    }

    public destroy () {
        if (this._gpuFramebuffer) {
            WebGPUCmdFuncDestroyFramebuffer(this._device as WebGPUDevice, this._gpuFramebuffer);
            this._gpuFramebuffer = null;
        }
    }
}
