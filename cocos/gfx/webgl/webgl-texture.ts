import { GFXFormatSurfaceSize, GFXStatus, GFXTextureFlagBit, GFXTextureType, GFXTextureViewType } from '../define';
import { GFXDevice } from '../device';
import { GFXTexture, IGFXTextureInfo } from '../texture';
import { WebGLCmdFuncCreateTexture, WebGLCmdFuncDestroyTexture } from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUTexture } from './webgl-gpu-objects';

function IsPowerOf2 (x: number): boolean{
    return x > 0 && (x & (x - 1)) === 0;
}

export class WebGLGFXTexture extends GFXTexture {

    public get gpuTexture (): WebGLGPUTexture {
        return  this._gpuTexture!;
    }

    private _gpuTexture: WebGLGPUTexture | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXTextureInfo): boolean {

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

        this._isPowerOf2 = IsPowerOf2(this._width) && IsPowerOf2(this._height);

        this._size = GFXFormatSurfaceSize(this._format, this.width, this.height,
            this.depth, this.mipLevel) * this._arrayLayer;

        if (this._flags & GFXTextureFlagBit.BAKUP_BUFFER) {
            this._buffer = new ArrayBuffer(this._size);
        }

        let viewType: GFXTextureViewType;

        switch (info.type) {
            case GFXTextureType.TEX1D: {

                if (info.arrayLayer) {
                    viewType = info.arrayLayer <= 1 ? GFXTextureViewType.TV1D : GFXTextureViewType.TV1D_ARRAY;
                } else {
                    viewType = GFXTextureViewType.TV1D;
                }

                break;
            }
            case GFXTextureType.TEX2D: {
                let flags = GFXTextureFlagBit.NONE;
                if (info.flags) {
                    flags = info.flags;
                }

                if (info.arrayLayer) {
                    if (info.arrayLayer <= 1) {
                        viewType = GFXTextureViewType.TV2D;
                    } else if (flags & GFXTextureFlagBit.CUBEMAP) {
                        viewType = GFXTextureViewType.CUBE;
                    } else {
                        viewType = GFXTextureViewType.TV2D_ARRAY;
                    }
                } else {
                    viewType = GFXTextureViewType.TV2D;
                }

                break;
            }
            case GFXTextureType.TEX3D: {
                viewType = GFXTextureViewType.TV3D;
                break;
            }
            default: {
                viewType = GFXTextureViewType.TV2D;
            }
        }

        this._gpuTexture = {
            type: info.type,
            viewType,
            format: info.format,
            usage: info.usage,
            width: info.width,
            height: info.height,
            depth: Math.max(info.depth || 1, 1),
            arrayLayer: Math.max(info.arrayLayer || 1, 1),
            mipLevel: Math.max(info.mipLevel || 1, 1),
            flags: info.flags || GFXTextureFlagBit.NONE,
            isPowerOf2: this._isPowerOf2,

            glTarget: 0,
            glInternelFmt: 0,
            glFormat: 0,
            glType: 0,
            glUsage: 0,
            glTexture: 0,
            glWrapS: 0,
            glWrapT: 0,
            glMinFilter: 0,
            glMagFilter: 0,
        };

        WebGLCmdFuncCreateTexture(this._device as WebGLGFXDevice, this._gpuTexture);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuTexture) {
            WebGLCmdFuncDestroyTexture(this._device as WebGLGFXDevice, this._gpuTexture);
            this._gpuTexture = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
