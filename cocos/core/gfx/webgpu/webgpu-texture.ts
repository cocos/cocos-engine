/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
    FormatSurfaceSize,
    TextureInfo,
    IsPowerOf2,
    TextureViewInfo,
    Format,
} from '../base/define';
import { Texture } from '../base/texture';
import { wgpuWasmModule } from './webgpu-utils';
import { toWGPUNativeFormat } from './webgpu-commands';
import { WebGPUSwapchain } from './webgpu-swapchain';

export class WebGPUTexture extends Texture {
    private _nativeTexture;
    private _swapchain;

    set swapchain (swapchain: WebGPUSwapchain) {
        this._swapchain = swapchain;
    }

    get nativeTexture () {
        return this._nativeTexture;
    }

    public initialize (info: TextureInfo | TextureViewInfo): boolean {
        const nativeDevice = wgpuWasmModule.nativeDevice;
        if ('texture' in info) {
            this._type = info.type;
            this._format = info.format;
            this._layerCount = info.layerCount;
            this._levelCount = info.layerCount;

            const texViewInfo = new wgpuWasmModule.TextureViewInfoInstance();
            texViewInfo.setTexture((info.texture as WebGPUTexture).nativeTexture().getThis());
            texViewInfo.setType(info.type);
            texViewInfo.setFormat(info.format);
            texViewInfo.setBaseLevel(info.baseLevel);
            texViewInfo.setLevelCount(info.levelCount);
            texViewInfo.setBaseLayer(info.baseLayer);
            texViewInfo.setLayerCount(info.layerCount);
            this._nativeTexture = nativeDevice.createTextureView(texViewInfo);
        } else {
            this._type = info.type;
            this._format = toWGPUNativeFormat(info.format);
            this._width = info.width;
            this._height = info.height;
            this._usage = info.usage;
            this._flags = info.flags;
            this._layerCount = info.layerCount;
            this._levelCount = info.levelCount;
            this._samples = info.samples;
            this._depth = info.depth;

            if (this._swapchain) {
                this._nativeTexture = info.format === Format.DEPTH || info.format === Format.DEPTH_STENCIL
                    ? this._swapchain.nativeSwapchain.getDepthStencilTexture() : this._swapchain.nativeSwapchain.getColorTexture();
            } else {
                const texInfo = new wgpuWasmModule.TextureInfoInstance();
                texInfo.setType(info.type);
                texInfo.setUsage(info.usage);
                texInfo.setFormat(toWGPUNativeFormat(info.format));
                texInfo.setWidth(info.width);
                texInfo.setHeight(info.height);
                texInfo.setFlags(info.flags);
                texInfo.setLayerCount(info.layerCount);
                texInfo.setLevelCount(info.levelCount);
                texInfo.setSamples(info.samples);
                texInfo.setDepth(info.depth);
                texInfo.setImageBuffer(info.externalRes);
                this._nativeTexture = nativeDevice.createTexture(texInfo);
            }
        }

        return true;
    }

    public destroy () {
        this._nativeTexture.destroy();
        this._nativeTexture.delete();
    }

    public resize (width: number, height: number) {
        this._nativeTexture.resize(width, height);
    }
}
