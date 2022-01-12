/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
    FormatSurfaceSize,
    TextureInfo,
    IsPowerOf2,
    SwapchainInfo,
    TextureType,
    TextureFlagBit,
    TextureUsageBit,
    SampleCount,
    Format,
    VsyncMode,
    SurfaceTransform,
} from '../base/define';
import { Texture } from '../base/texture';
import { nativeLib } from './instantiated';
import { WebGPUDevice } from './webgpu-device';
import { Swapchain } from '../base/swapchain';
import { WebGPUTexture } from './webgpu-texture';

export class WebGPUSwapchain extends Swapchain {
    private _nativeSwapchain;

    get nativeSwapchain () {
        return this._nativeSwapchain;
    }

    public initialize (info: Readonly<SwapchainInfo>): void {
        const swapchainInfo = new nativeLib.SwapchainInfoInstance();
        if (info.windowHandle instanceof HTMLCanvasElement) {
            // native get surface itself
            swapchainInfo.setWindowHandle(0);
        } else {
            swapchainInfo.setWindowHandle(info.windowHandle);
        }

        const vsyncStr = VsyncMode[info.vsyncMode];
        swapchainInfo.setVsyncMode(nativeLib.VsyncMode[vsyncStr]);
        swapchainInfo.setWidth(info.width);
        swapchainInfo.setHeight(info.height);

        const nativeDevice = nativeLib.nativeDevice;
        this._nativeSwapchain = nativeDevice.createSwapchain(swapchainInfo);

        this._colorTexture = new WebGPUTexture();
        const colorTex = this._colorTexture as WebGPUTexture;
        colorTex.swapchain = this;
        const swapchainColorTexInfo = new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.COLOR_ATTACHMENT,
            Format.BGRA8,
            info.width,
            info.height,
            TextureFlagBit.NONE,
            1,
            1,
            SampleCount.ONE,
            1,
            0,
        );
        colorTex.initialize(swapchainColorTexInfo);

        this._depthStencilTexture = new WebGPUTexture();
        const dsTex = this._depthStencilTexture as WebGPUTexture;
        dsTex.swapchain = this;
        const swapchainDSTextureInfo = new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
            Format.DEPTH_STENCIL,
            info.width,
            info.height,
            TextureFlagBit.NONE,
            1,
            1,
            SampleCount.ONE,
            1,
            0,
        );
        dsTex.initialize(swapchainDSTextureInfo);
    }

    public resize (width: number, height: number): void {
        this._nativeSwapchain.resize(width, height, nativeLib.SurfaceTransform.IDENTITY);
    }

    public destroy (): void {
        this._nativeSwapchain.destroy();
        this._nativeSwapchain.delete();
    }
}
