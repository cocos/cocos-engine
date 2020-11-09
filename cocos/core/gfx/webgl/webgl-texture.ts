import { TextureFlagBit, FormatSurfaceSize } from '../define';
import { Texture, TextureInfo, TextureViewInfo, IsPowerOf2 } from '../texture';
import { WebGLCmdFuncCreateTexture, WebGLCmdFuncDestroyTexture, WebGLCmdFuncResizeTexture } from './webgl-commands';
import { WebGLDevice } from './webgl-device';
import { IWebGLGPUTexture } from './webgl-gpu-objects';

export class WebGLTexture extends Texture {

    get gpuTexture (): IWebGLGPUTexture {
        return  this._gpuTexture!;
    }

    private _gpuTexture: IWebGLGPUTexture | null = null;

    public initialize (info: TextureInfo | TextureViewInfo): boolean {
        if ('texture' in info) {
            console.log('WebGL does not support texture view.');
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

        if (this._flags & TextureFlagBit.BAKUP_BUFFER) {
            this._buffer = new ArrayBuffer(this._size);
        }

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

            glTarget: 0,
            glInternalFmt: 0,
            glFormat: 0,
            glType: 0,
            glUsage: 0,
            glTexture: null,
            glRenderbuffer: null,
            glWrapS: 0,
            glWrapT: 0,
            glMinFilter: 0,
            glMagFilter: 0,
        };

        WebGLCmdFuncCreateTexture(this._device as WebGLDevice, this._gpuTexture);

        this._device.memoryStatus.textureSize += this._size;

        return true;
    }

    public destroy () {
        if (this._gpuTexture) {
            WebGLCmdFuncDestroyTexture(this._device as WebGLDevice, this._gpuTexture);
            this._device.memoryStatus.textureSize -= this._size;
            this._gpuTexture = null;
        }
        this._buffer = null;
    }

    public resize (width: number, height: number) {

        const oldSize = this._size;
        this._width = width;
        this._height = height;
        this._size = FormatSurfaceSize(this._format, this.width, this.height,
            this.depth, this._levelCount) * this._layerCount;

        if (this._gpuTexture) {
            this._gpuTexture.width = width;
            this._gpuTexture.height = height;
            this._gpuTexture.size = this._size;
            WebGLCmdFuncResizeTexture(this._device as WebGLDevice, this._gpuTexture);
            this._device.memoryStatus.textureSize -= oldSize;
            this._device.memoryStatus.textureSize += this._size;
        }
    }
}
