import { GFXStatus, GFXTextureViewType } from '../define';
import { GFXDevice } from '../device';
import { GFXTextureView, IGFXTextureViewInfo } from '../texture-view';
import { WebGLGPUTextureView } from './webgl-gpu-objects';
import { WebGLGFXTexture } from './webgl-texture';

export class WebGLGFXTextureView extends GFXTextureView {

    public get gpuTextureView (): WebGLGPUTextureView {
        return  this._gpuTextureView as WebGLGPUTextureView;
    }

    private _gpuTextureView: WebGLGPUTextureView | null = null;

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
            gpuTexture: (info.texture as WebGLGFXTexture).gpuTexture,
            type: info.type,
            format: info.format,
            baseLevel: info.baseLevel ? info.baseLevel : 0,
            levelCount: info.levelCount ? info.levelCount : 1,
        };

        const maxSizeLimit = this._type === GFXTextureViewType.CUBE ? this._device.maxCubeMapTextureSize : this._device.maxTextureSize;
        const maxSize = Math.max(this._texture.width, this._texture.height);
        if (maxSize > maxSizeLimit) {
            console.warn(`texture size exceeds current device limits ${maxSize}/${maxSizeLimit}`);
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
