import { GFXTextureFlagBit, GFXTextureType, GFXTextureViewType } from '../define';
import { GFXTexture, IGFXTextureInfo } from '../texture';
import { WebGL2CmdFuncCreateTexture, WebGL2CmdFuncDestroyTexture, WebGL2CmdFuncResizeTexture } from './webgl2-commands';
import { WebGL2GFXDevice } from './webgl2-device';
import { WebGL2GPUTexture } from './webgl2-gpu-objects';

export class WebGL2GFXTexture extends GFXTexture {

    public get gpuTexture (): WebGL2GPUTexture {
        return  this._gpuTexture!;
    }

    private _gpuTexture: WebGL2GPUTexture | null = null;

    protected _initialize (info: IGFXTextureInfo): boolean {

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
            type: this._type,
            viewType,
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

        WebGL2CmdFuncCreateTexture(this._device as WebGL2GFXDevice, this._gpuTexture);

        return true;
    }

    protected _destroy () {
        if (this._gpuTexture) {
            WebGL2CmdFuncDestroyTexture(this._device as WebGL2GFXDevice, this._gpuTexture);
            this._gpuTexture = null;
        }
    }

    protected _resize (width: number, height: number) {
        if (this._gpuTexture) {
            this._gpuTexture.width = width;
            this._gpuTexture.height = height;
            this._gpuTexture.size = this._size;
            WebGL2CmdFuncResizeTexture(this._device as WebGL2GFXDevice, this._gpuTexture);
        }
    }
}
