import { GFXDevice } from '../device';
import { GFXTextureView, GFXTextureViewInfo } from '../texture-view';
import { WebGLGPUTextureView } from './webgl-gpu-objects';
import { WebGLGFXDevice } from './webgl-device';

export class WebGLGFXTextureView extends GFXTextureView {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXTextureViewInfo): boolean {

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

    public destroy() {
        if (this._gpuTextureView) {
            this.webGLDevice.emitCmdDestroyGPUTextureView(this._gpuTextureView);
            this._gpuTextureView = null;
        }
        this._texture = null;
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuTextureView(): WebGLGPUTextureView | null {
        return this._gpuTextureView;
    }

    private _gpuTextureView: WebGLGPUTextureView | null = null;
};
