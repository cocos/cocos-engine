import { Framebuffer } from '../base/framebuffer';
import { IWebGPUGPUFramebuffer, IWebGPUTexture } from './webgpu-gpu-objects';
import { WebGPURenderPass } from './webgpu-render-pass';
import { WebGPUTexture } from './webgpu-texture';
import { FramebufferInfo } from '../base/define';

export class WebGPUFramebuffer extends Framebuffer {
    get gpuFramebuffer(): IWebGPUGPUFramebuffer {
        return this._gpuFramebuffer!;
    }

    private _gpuFramebuffer: IWebGPUGPUFramebuffer | null = null;
    public initialize(info: Readonly<FramebufferInfo>): void {
        this._renderPass = info.renderPass;
        this._colorTextures = info.colorTextures || [];
        this._depthStencilTexture = info.depthStencilTexture || null;

        const gpuColorTextures: IWebGPUTexture[] = [];
        let isOffscreen = true;
        for (let i = 0; i < info.colorTextures.length; i++) {
            const colorTexture = info.colorTextures[i] as WebGPUTexture;
            if (colorTexture) {
                const gpuTex = colorTexture.gpuTexture;
                gpuColorTextures.push(gpuTex);
                if(gpuTex.isSwapchainTexture) {
                    isOffscreen = false;
                }
            }
        }

        let gpuDepthStencilTexture: IWebGPUTexture | null = null;
        if (info.depthStencilTexture) {
            gpuDepthStencilTexture = (info.depthStencilTexture as WebGPUTexture).gpuTexture;
        }
        let width = Number.MAX_SAFE_INTEGER;
        let height = Number.MAX_SAFE_INTEGER;
        this._gpuFramebuffer = {
            gpuRenderPass: (info.renderPass as WebGPURenderPass).gpuRenderPass,
            gpuColorTextures,
            gpuDepthStencilTexture,
            glFramebuffer: null,
            isOffscreen: isOffscreen,
            get width (): number {
                if (this.gpuColorTextures.length > 0) {
                    return this.gpuColorTextures[0].width;
                } else if (this.gpuDepthStencilTexture) {
                    return this.gpuDepthStencilTexture.width;
                }
                return width;
            },
            set width (val) {
                width = val;
            },
            get height (): number {
                if (this.gpuColorTextures.length > 0) {
                    return this.gpuColorTextures[0].height;
                } else if (this.gpuDepthStencilTexture) {
                    return this.gpuDepthStencilTexture.height;
                }
                return height;
            },
            set height (val) {
                height = val;
            },
        };
        this._width = this._gpuFramebuffer.width;
        this._height = this._gpuFramebuffer.height;
    }

    public destroy() {
        if (this._gpuFramebuffer) {
            this._gpuFramebuffer = null;
        }
    }
}
