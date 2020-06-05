import { GFXTextureFlagBit, GFXTextureType, GFXStatus, GFXFormatSurfaceSize } from '../define';
import { GFXTexture, IGFXTextureInfo, IGFXTextureViewInfo, IsPowerOf2 } from '../texture';
import { WebGLCmdFuncCreateTexture, WebGLCmdFuncDestroyTexture, WebGLCmdFuncResizeTexture } from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUTexture } from './webgl-gpu-objects';

export class WebGLGFXTexture extends GFXTexture {

    get gpuTexture (): WebGLGPUTexture {
        return  this._gpuTexture!;
    }

    private _gpuTexture: WebGLGPUTexture | null = null;

    public initialize (info: IGFXTextureInfo | IGFXTextureViewInfo): boolean {
        if ('texture' in info) {
            console.log('WebGL does not support texture view.');
            this._status = GFXStatus.FAILED
            return false;
        }

        this._type = info.type;
        this._usage = info.usage;
        this._format = info.format;
        this._width = info.width;
        this._height = info.height;

        if (info.depth !== undefined) {
            this._depth = info.depth;
        }

        if (info.arrayLayer !== undefined) {
            this._arrayLayer = info.arrayLayer;
        }

        if (info.mipLevel !== undefined) {
            this._mipLevel = info.mipLevel;
        }

        if (info.samples !== undefined) {
            this._samples = info.samples;
        }

        if (info.flags !== undefined) {
            this._flags = info.flags;
        }

        this._isPowerOf2 = IsPowerOf2(this._width) && IsPowerOf2(this._height);

        this._size = GFXFormatSurfaceSize(this._format, this.width, this.height,
            this.depth, this.mipLevel) * this._arrayLayer;

        if (this._flags & GFXTextureFlagBit.BAKUP_BUFFER) {
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
            arrayLayer: this._arrayLayer,
            mipLevel: this._mipLevel,
            samples: this._samples,
            flags: this._flags,
            isPowerOf2: this._isPowerOf2,

            glTarget: 0,
            glInternelFmt: 0,
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

        WebGLCmdFuncCreateTexture(this._device as WebGLGFXDevice, this._gpuTexture);

        this._device.memoryStatus.textureSize += this._size;
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuTexture) {
            WebGLCmdFuncDestroyTexture(this._device as WebGLGFXDevice, this._gpuTexture);
            this._device.memoryStatus.textureSize -= this._size;
            this._gpuTexture = null;
        }
        this._buffer = null;
        this._status = GFXStatus.UNREADY;
    }

    public resize (width: number, height: number) {

        const oldSize = this._size;
        this._width = width;
        this._height = height;
        this._size = GFXFormatSurfaceSize(this._format, this.width, this.height,
            this.depth, this.mipLevel) * this._arrayLayer;

        if (this._gpuTexture) {
            this._gpuTexture.width = width;
            this._gpuTexture.height = height;
            this._gpuTexture.size = this._size;
            WebGLCmdFuncResizeTexture(this._device as WebGLGFXDevice, this._gpuTexture);
            this._device.memoryStatus.textureSize -= oldSize;
            this._device.memoryStatus.textureSize += this._size;
        }
    }
}
