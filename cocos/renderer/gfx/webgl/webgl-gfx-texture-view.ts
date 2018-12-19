import { GFXDevice } from '../gfx-device';
import { GFXTextureView, GFXTextureViewInfo } from '../gfx-texture-view';
import { WebGLGPUTextureView } from './webgl-gpu-objects';
import { WebGLGFXDevice } from './webgl-gfx-device';

export class WebGLGFXTextureView extends GFXTextureView {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXTextureViewInfo) : boolean {

        this._texture = info.texture;
        this._type = info.type;
        this._format = info.format;
        this._baseLevel = info.baseLevel;
        this._format = info.format;
        this._levelCount = info.levelCount;
        this._baseLayer = info.baseLayer;
        this._layerCount = info.layerCount;

        this.webGLDevice.emitCmdCreateGPUTextureView(info);

        return true;
    }

    public destroy() {
        this._gpuTextureView = null;
        this._texture = null;
    }

    public get webGLDevice() : WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuTextureView() : WebGLGPUTextureView | null  {
        return this._gpuTextureView;
    }

    private _gpuTextureView : WebGLGPUTextureView | null = null;
};
