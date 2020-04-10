import { GFXTextureView, IGFXTextureViewInfo } from '../texture-view';
import { WebGL2GPUTextureView } from './webgl2-gpu-objects';
import { WebGL2GFXTexture } from './webgl2-texture';

export class WebGL2GFXTextureView extends GFXTextureView {

    public get gpuTextureView (): WebGL2GPUTextureView {
        return  this._gpuTextureView as WebGL2GPUTextureView;
    }

    private _gpuTextureView: WebGL2GPUTextureView | null = null;

    protected _initialize (info: IGFXTextureViewInfo): boolean {

        this._gpuTextureView = {
            gpuTexture: (info.texture as WebGL2GFXTexture).gpuTexture,
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
