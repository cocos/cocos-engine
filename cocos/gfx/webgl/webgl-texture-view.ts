import { GFXDevice } from '../device';
import { GFXTextureView, IGFXTextureViewInfo } from '../texture-view';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUTextureView } from './webgl-gpu-objects';

export class WebGLGFXTextureView extends GFXTextureView {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

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

        this._gpuTextureView = this.webGLDevice.emitCmdCreateGPUTextureView(info);

        return true;
    }

    public destroy () {
        if (this._gpuTextureView) {
            this.webGLDevice.emitCmdDestroyGPUTextureView(this._gpuTextureView);
            this._gpuTextureView = null;
        }
        this._texture = null;
    }
}
