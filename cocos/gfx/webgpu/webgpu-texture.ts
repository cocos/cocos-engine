import {
    FormatSurfaceSize,
    TextureInfo,
    IsPowerOf2,
    TextureViewInfo,
    ISwapchainTextureInfo,
    TextureHandle,
    FormatInfos,
    TextureUsageBit
} from '../base/define';
import { Texture } from '../base/texture';
import { WebGPUDeviceManager } from './define';
import {
    WebGPUCmdFuncCreateTexture,
    WebGPUCmdFuncDestroyTexture,
    WebGPUCmdFuncResizeTexture,
} from './webgpu-commands';
import { WebGPUDevice } from './webgpu-device';
import { IWebGPUTexture } from './webgpu-gpu-objects';

export class WebGPUTexture extends Texture {
    public getTextureHandle(): TextureHandle {
        const gpuTexture = this._gpuTexture;
        if (!gpuTexture) {
            return 0;
        }
        if (gpuTexture.glTexture) {
            return gpuTexture.glTexture;
        }
        return 0;
    }
    public initAsSwapchainTexture(info: Readonly<ISwapchainTextureInfo>): void {
        const texInfo = new TextureInfo();
        texInfo.format = info.format;
        texInfo.usage = FormatInfos[info.format].hasDepth ? TextureUsageBit.DEPTH_STENCIL_ATTACHMENT : TextureUsageBit.COLOR_ATTACHMENT;
        texInfo.width = info.width;
        texInfo.height = info.height;
        this.initialize(texInfo, true);
    }
    get gpuTexture(): IWebGPUTexture {
        return this._gpuTexture!;
    }

    private _gpuTexture: IWebGPUTexture | null = null;
    private _texDescriptor: GPUTextureDescriptor | null = null;
    private _lodLevel = 0;
    get lodLevel (): number {
        return this._lodLevel;
    }
    public initialize(info: Readonly<TextureInfo> | Readonly<TextureViewInfo>, isSwapchainTexture?: boolean) {
        let texInfo = info as Readonly<TextureInfo>;
        const viewInfo = info as Readonly<TextureViewInfo>;
        if ('texture' in info) {
            texInfo = viewInfo.texture.info;
            this._isTextureView = true;
        }

        this._info.copy(texInfo);
        this._isPowerOf2 = IsPowerOf2(this._info.width) && IsPowerOf2(this._info.height);
        this._size = FormatSurfaceSize(this._info.format, this.width, this.height,
            this.depth, this._info.levelCount) * this._info.layerCount;
        if(!this._isTextureView) {
            this._gpuTexture = {
                type: texInfo.type,
                format: texInfo.format,
                usage: texInfo.usage,
                width: texInfo.width,
                height: texInfo.height,
                depth: texInfo.depth,
                size: this._size,
                arrayLayer: texInfo.layerCount,
                mipLevel: texInfo.levelCount,
                samples: texInfo.samples,
                flags: texInfo.flags,
                isPowerOf2: this._isPowerOf2,

                // default value, filled in when texture is created.
                glTarget: '2d',
                glInternalFmt: 'rgba8unorm',
                glFormat: 'rgba8unorm',
                glType: 0,
                glUsage: GPUTextureUsage.RENDER_ATTACHMENT,
                glTexture: undefined,
                glRenderbuffer: null,
                glWrapS: 'clamp-to-edge',
                glWrapT: 'clamp-to-edge',
                glMinFilter: 'linear',
                glMagFilter: 'linear',

                isSwapchainTexture: isSwapchainTexture || false,
            };
            if(!isSwapchainTexture) {
                const device = WebGPUDeviceManager.instance;
                WebGPUCmdFuncCreateTexture(device as WebGPUDevice, this._gpuTexture!);
                device.memoryStatus.textureSize += this._size;
            }
            this._viewInfo.texture = this;
            this._viewInfo.type = info.type;
            this._viewInfo.format = info.format;
            this._viewInfo.baseLevel = 0;
            this._viewInfo.levelCount = info.levelCount;
            this._viewInfo.baseLayer = 0;
            this._viewInfo.layerCount = info.layerCount;
        } else {
            this._viewInfo.copy(viewInfo);
            this._lodLevel = viewInfo.baseLevel;
            this._gpuTexture = (viewInfo.texture as WebGPUTexture)._gpuTexture;
        }
    }

    public getNativeTextureView() {
        if (this._gpuTexture?.glTexture) {
            return this._gpuTexture.glTexture.createView({
                dimension: this._gpuTexture.glTarget,
                mipLevelCount: this._gpuTexture.mipLevel,
                arrayLayerCount: this.viewInfo.layerCount,
                baseMipLevel: 0,
                baseArrayLayer: 0
              });
        }
    }

    public destroy() {
        if (!this._isTextureView && this._gpuTexture) {
            WebGPUCmdFuncDestroyTexture(this._gpuTexture);
            const device = WebGPUDeviceManager.instance;
            device.memoryStatus.textureSize -= this._size;
            this._gpuTexture = null;
        }
    }

    public resize(width: number, height: number) {
        if (this._info.width === width && this._info.height === height) {
            return;
        }
        if (this._info.levelCount === WebGPUTexture.getLevelCount(this._info.width, this._info.height)) {
            this._info.levelCount = WebGPUTexture.getLevelCount(width, height);
        } else if (this._info.levelCount > 1) {
            this._info.levelCount = Math.min(this._info.levelCount, WebGPUTexture.getLevelCount(width, height));
        }
        const oldSize = this._size;
        this._info.width = width;
        this._info.height = height;
        this._size = FormatSurfaceSize(this.info.format, this.width, this.height,
            this.depth, this.info.levelCount) * this.info.layerCount;

        if (!this._isTextureView && this._gpuTexture) {
            this._gpuTexture.width = width;
            this._gpuTexture.height = height;
            this._gpuTexture.size = this._size;
            if(!this._gpuTexture.isSwapchainTexture) {
                const device = WebGPUDeviceManager.instance;
                WebGPUCmdFuncResizeTexture(device as WebGPUDevice, this._gpuTexture);
                device.memoryStatus.textureSize -= oldSize;
                device.memoryStatus.textureSize += this._size;
            }
        }
    }
}
