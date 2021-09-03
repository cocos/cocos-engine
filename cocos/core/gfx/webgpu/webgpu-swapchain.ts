import {
    FormatSurfaceSize,
    TextureInfo,
    IsPowerOf2,
    SwapchainInfo,
} from '../base/define';
import { Texture } from '../base/texture';
import { wgpuWasmModule } from './webgpu-utils';
import { WebGPUDevice } from './webgpu-device';
import { Swapchain } from '../base/swapchain';

export class WebGPUSwapchain extends Swapchain {
    private _nativeSwapchain;

    get nativeSwapchain () {
        return this._nativeSwapchain;
    }

    public initialize (info: Readonly<SwapchainInfo>): void {
        const swapchainInfo = new wgpuWasmModule.SwapchainInfoInstance();
        swapchainInfo.windowHandle = info.windowHandle;
        swapchainInfo.vsyncMode = info.vsyncMode;
        swapchainInfo.width = info.width;
        swapchainInfo.height = info.height;

        const nativeDevice = wgpuWasmModule.nativeDevice;
        this._nativeSwapchain = nativeDevice.createSwapchain(swapchainInfo);
    }

    public resize (width: number, height: number): void {
        this._nativeSwapchain.resize(width, height);
    }

    public destroy (): void {
        this._nativeSwapchain.destroy();
        this._nativeSwapchain.delete();
    }
}
