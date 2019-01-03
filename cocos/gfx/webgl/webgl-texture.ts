import { GFXDevice } from '../device';
import { WebGLGPUTexture } from './webgl-gpu-objects';
import { WebGLGFXDevice } from './webgl-device';
import { GFXTexture, GFXTextureInfo } from '../texture';
import { GFXFormatSurfaceSize, GFXTextureFlagBit } from '../define';

export class WebGLGFXTexture extends GFXTexture {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXTextureInfo): boolean {

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

        if (info.flags !== undefined) {
            this._flags = info.flags;
        }

        this._size = GFXFormatSurfaceSize(this._format, this.width, this.height, this.depth, this.mipLevel) * this._arrayLayer;

        if (this._flags & GFXTextureFlagBit.BAKUP_BUFFER) {
            this._buffer = new ArrayBuffer(this._size);
        }

        this._gpuTexture = this.webGLDevice.emitCmdCreateGPUTexture(info);

        return true;
    }

    public destroy() {

        if (this._gpuTexture) {
            this.webGLDevice.emitCmdDestroyGPUTexture(this._gpuTexture);
            this._gpuTexture = null;
        }
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuTexture(): WebGLGPUTexture {
        return <WebGLGPUTexture>this._gpuTexture;
    }

    private _gpuTexture: WebGLGPUTexture | null = null;
};
