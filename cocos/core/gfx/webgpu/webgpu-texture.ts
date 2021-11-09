/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
    FormatSurfaceSize,
    TextureInfo,
    TextureViewInfo,
    Format,
    ISwapchainTextureInfo,
    TextureType,
    SampleCount,
} from '../base/define';
import { Texture } from '../base/texture';
import { nativeLib } from './webgpu-utils';
import {
    toWGPUNativeFormat, toWGPUNativeTextureType, toWGPUNativeTextureUsage,
    toWGPUTextureFlag, toWGPUTextureSampleCount,
} from './webgpu-commands';
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
        const nativeDevice = nativeLib.nativeDevice;
        if ('texture' in info) {
            this._type = info.type;
            this._format = info.format;
            this._layerCount = info.layerCount;
            this._levelCount = info.layerCount;

            const texViewInfo = new nativeLib.TextureViewInfoInstance();
            texViewInfo.setTexture((info.texture as WebGPUTexture).nativeTexture());
            const typeStr = TextureType[info.type];
            texViewInfo.setType(nativeLib.TextureType[typeStr]);
            const formatStr = Format[info.format];
            texViewInfo.setFormat(nativeLib.Format[formatStr]);
            texViewInfo.setBaseLevel(info.baseLevel);
            texViewInfo.setLevelCount(info.levelCount);
            texViewInfo.setBaseLayer(info.baseLayer);
            texViewInfo.setLayerCount(info.layerCount);
            this._nativeTexture = nativeDevice.createTextureView(texViewInfo);
        } else {
            this._type = info.type;
            this._format = info.format;
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
                const texInfo = new nativeLib.TextureInfoInstance();
                const typeStr = TextureType[info.type];
                texInfo.setType(nativeLib.TextureType[typeStr]);
                texInfo.setUsage(info.usage);
                const formatStr = Format[info.format];
                texInfo.setFormat(nativeLib.Format[formatStr]);
                texInfo.setWidth(info.width);
                texInfo.setHeight(info.height);
                texInfo.setFlags(info.flags);
                texInfo.setLayerCount(info.layerCount);
                texInfo.setLevelCount(info.levelCount);
                const sampleStr = SampleCount[info.samples];
                texInfo.setSamples(nativeLib.SampleCount[sampleStr]);
                texInfo.setDepth(info.depth);
                texInfo.setImageBuffer(info.externalRes);
                this._nativeTexture = nativeDevice.createTexture(texInfo);
            }
        }

        return true;
    }

    protected initAsSwapchainTexture (info: ISwapchainTextureInfo) {
        console.log('init swapchain tex impling later');
    }

    public destroy () {
        this._nativeTexture.destroy();
        this._nativeTexture.delete();
    }

    public resize (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._nativeTexture.resize(width, height);
    }
}
