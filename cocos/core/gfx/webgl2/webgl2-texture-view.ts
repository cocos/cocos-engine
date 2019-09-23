import { GFXStatus, GFXTextureViewType } from '../define';
import { GFXDevice } from '../device';
import { GFXTextureView, IGFXTextureViewInfo } from '../texture-view';
import { WebGL2GPUTextureView } from './webgl2-gpu-objects';
import { WebGL2GFXTexture } from './webgl2-texture';

export class WebGL2GFXTextureView extends GFXTextureView {

    public get gpuTextureView (): WebGL2GPUTextureView {
        return  this._gpuTextureView as WebGL2GPUTextureView;
    }

    private _gpuTextureView: WebGL2GPUTextureView | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXTextureViewInfo): boolean {

        this._texture = info.texture;
        this._type = info.type;
        this._format = info.format;
        this._format = info.format;

        if (info.baseLevel !== undefined) {
            this._baseLevel = info.baseLevel;
        }

        if (info.levelCount !== undefined) {
            this._levelCount = info.levelCount;
        }

        if (info.baseLayer !== undefined) {
            this._baseLayer = info.baseLayer;
        }

        if (info.layerCount !== undefined) {
            this._layerCount = info.layerCount;
        }

        this._gpuTextureView = {
            gpuTexture: (info.texture as WebGL2GFXTexture).gpuTexture,
            type: info.type,
            format: info.format,
            baseLevel: info.baseLevel ? info.baseLevel : 0,
            levelCount: info.levelCount ? info.levelCount : 1,
        };

        const maxSize = this._type === GFXTextureViewType.CUBE ? this._device.maxCubeMapTextureSize : this._device.maxTextureSize;
        if (this._texture.width > maxSize || this._texture.height > maxSize) {
            console.warn(`texture size exceeds current device limits ${Math.max(this._texture.width, this._texture.height)}/${maxSize}`);
        }

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._gpuTextureView = null;
        this._texture = null;
        this._status = GFXStatus.UNREADY;
    }
}
