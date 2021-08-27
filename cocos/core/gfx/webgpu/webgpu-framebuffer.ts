import { Framebuffer } from '../base/framebuffer';
import { WebGPUDevice } from './webgpu-device';
import { WebGPUTexture } from './webgpu-texture';
import { FramebufferInfo } from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';
import { WebGPURenderPass } from './webgpu-render-pass';

export class WebGPUFramebuffer extends Framebuffer {
    private _nativeFramebuffer;

    get nativeObj () {
        return this._nativeFramebuffer;
    }

    public initialize (info: FramebufferInfo): boolean {
        const framebufferInfo = new wgpuWasmModule.FramebufferInfoInstance();
        framebufferInfo.setRenderPass((info.renderPass as WebGPURenderPass).nativeObj().getThis());
        const colors = new wgpuWasmModule.TextureList();
        const nativeDevice = (this._device as WebGPUDevice).nativeDevice();
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
        } else {
            framebufferInfo.setDepthStencilTexture(nativeDevice.swapchainDepthStencil);
        }

        this._nativeFramebuffer = (this._device as WebGPUDevice).nativeDevice.createFramebuffer(framebufferInfo);
        return true;
    }

    public destroy () {
        this._nativeFramebuffer.destroy();
        this._nativeFramebuffer.delete();
    }
}
