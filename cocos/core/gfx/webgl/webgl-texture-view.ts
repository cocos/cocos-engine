import { GFXTextureView, IGFXTextureViewInfo } from '../texture-view';
import { WebGLGPUTextureView } from './webgl-gpu-objects';
import { WebGLGFXTexture } from './webgl-texture';

export class WebGLGFXTextureView extends GFXTextureView {

    public get gpuTextureView (): WebGLGPUTextureView {
        return  this._gpuTextureView as WebGLGPUTextureView;
    }

    private _gpuTextureView: WebGLGPUTextureView | null = null;

    protected _initialize (info: IGFXTextureViewInfo): boolean {

        this._gpuTextureView = {
            gpuTexture: (info.texture as WebGLGFXTexture).gpuTexture,
            type: info.type,
            format: info.format,
            baseLevel: info.baseLevel ? info.baseLevel : 0,
            levelCount: info.levelCount ? info.levelCount : 1,
        };

        return true;
    }

    protected _destroy () {
        this._gpuTextureView = null;
    }
}
