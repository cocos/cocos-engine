import {
    TextureFlagBit,
    FormatSurfaceSize,
    TextureInfo,
    IsPowerOf2,
    TextureViewInfo
} from '../base/define';
import { Texture } from '../base/texture';
import {
    WebGPUCmdFuncCreateTexture,
    WebGPUCmdFuncDestroyTexture,
    WebGPUCmdFuncResizeTexture,
    GFXTextureToWebGPUTexture,
    GFXTextureUsageToNative,
} from './webgpu-commands';
import { WebGPUDevice } from './webgpu-device';
import { IWebGPUGPUTexture } from './webgpu-gpu-objects';

export class WebGPUTexture extends Texture {
    get gpuTexture(): IWebGPUGPUTexture {
        return this._gpuTexture!;
    }

    private _gpuTexture: IWebGPUGPUTexture | null = null;
    private _texDescriptor: GPUTextureDescriptor | null = null;

    public initialize(info: TextureInfo | TextureViewInfo): boolean {
        if ('texture' in info) {
            console.log('WebGPU does not support texture view.');
            return false;
        }

        this._type = info.type;
        this._usage = info.usage;
        this._format = info.format;
        this._width = info.width;
        this._height = info.height;
        this._depth = info.depth;
        this._layerCount = info.layerCount;
        this._levelCount = info.levelCount;
        this._samples = info.samples;
        this._flags = info.flags;
        this._isPowerOf2 = IsPowerOf2(this._width) && IsPowerOf2(this._height);
        this._size = FormatSurfaceSize(this._format, this.width, this.height,
            this.depth, this._levelCount) * this._layerCount;

        this._gpuTexture = {
            type: this._type,
            format: this._format,
            usage: this._usage,
            width: this._width,
            height: this._height,
            depth: this._depth,
            size: this._size,
            arrayLayer: this._layerCount,
            mipLevel: this._levelCount,
            samples: this._samples,
            flags: this._flags,
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
        };

        WebGPUCmdFuncCreateTexture(this._device as WebGPUDevice, this._gpuTexture!);
        this._device.memoryStatus.textureSize += this._size;
        return true;
    }

    public getNativeTextureView() {
        if (this._gpuTexture?.glTexture) {
            return this._gpuTexture.glTexture.createView();
        }
    }

    public destroy() {
        if (this._gpuTexture) {
            WebGPUCmdFuncDestroyTexture(this._gpuTexture);
            this._device.memoryStatus.textureSize -= this._size;
            this._gpuTexture = null;
        }
    }

    public resize(width: number, height: number) {
        const oldSize = this._size;
        this._width = width;
        this._height = height;
        this._size = FormatSurfaceSize(this._format, this.width, this.height,
            this.depth, this._levelCount) * this._layerCount;

        if (this._gpuTexture) {
            this._gpuTexture.width = width;
            this._gpuTexture.height = height;
            this._gpuTexture.size = this._size;
            WebGPUCmdFuncResizeTexture(this._device as WebGPUDevice, this._gpuTexture);
            this._device.memoryStatus.textureSize -= oldSize;
            this._device.memoryStatus.textureSize += this._size;
        }
    }
}
