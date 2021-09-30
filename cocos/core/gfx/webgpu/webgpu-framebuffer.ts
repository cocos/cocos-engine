/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Framebuffer } from '../base/framebuffer';
import { WebGPUDevice } from './webgpu-device';
import { WebGPUTexture } from './webgpu-texture';
import { FramebufferInfo } from '../base/define';
import { nativeLib } from './webgpu-utils';
import { WebGPURenderPass } from './webgpu-render-pass';

export class WebGPUFramebuffer extends Framebuffer {
    private _nativeFramebuffer;

    get nativeFrameBuffer () {
        return this._nativeFramebuffer;
    }

    public initialize (info: FramebufferInfo): boolean {
        this._renderPass = info.renderPass;
        this._colorTextures = info.colorTextures.slice();
        this._depthStencilTexture = info.depthStencilTexture;
        const framebufferInfo = new nativeLib.FramebufferInfoInstance();
        framebufferInfo.setRenderPass((info.renderPass as WebGPURenderPass).nativeRenderPass);
        const colors = new nativeLib.TextureList();
        const nativeDevice = nativeLib.nativeDevice;
        for (let i = 0; i < info.colorTextures.length; i++) {
            if (info.colorTextures[i]) {
                colors.push_back((info.colorTextures[i] as WebGPUTexture).nativeTexture);
            } else {
                colors.push_back(nativeDevice.swapchainColor);
            }
        }
        framebufferInfo.setColorTextures(colors);

        if (info.depthStencilTexture) {
            framebufferInfo.setDepthStencilTexture((info.depthStencilTexture as WebGPUTexture).nativeTexture);
        }

        this._nativeFramebuffer = nativeLib.nativeDevice.createFramebuffer(framebufferInfo);
        return true;
    }

    public destroy () {
        this._nativeFramebuffer.destroy();
        this._nativeFramebuffer.delete();
    }
}
