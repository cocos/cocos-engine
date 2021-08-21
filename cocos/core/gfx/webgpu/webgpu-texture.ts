import {
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

export class WebGPUTexture extends Texture {

    private _nativeTexture;

    get nativeTexture () {
        return this._nativeTexture;
    }
    public initialize (info: TextureInfo | TextureViewInfo): boolean {

        return true;
    }


    public destroy () {

    }

    public resize (width: number, height: number) {

    }
}
