import { ccclass, property } from '../core/data/class-decorator';
import { GFXFormat } from '../gfx';
import { GFXDevice } from '../gfx/device';
import { GFXWindow } from '../gfx/window';
import { DepthStencilFormat, PixelFormat } from './asset-enum';
import { TextureBase } from './texture-base';

export interface IRenderTextureCreateInfo {
    width: number;
    height: number;
    colorFormat: PixelFormat;
    depthStencilFormat: DepthStencilFormat;
}

@ccclass('cc.RenderTexture')
export class RenderTexture extends TextureBase {
    private _window: GFXWindow | null = null;

    @property
    private _width: number = 0;

    @property
    private _height: number = 0;

    @property
    private _depthStencilFormat: DepthStencilFormat = DepthStencilFormat.NONE;

    @property
    get width () {
        return this._width;
    }

    set width (value) {
        this._width = value;
    }

    @property
    get height () {
        return this._height;
    }

    set height (value) {
        this._height = value;
    }

    @property
    get depthStencilFormat () {
        return this._depthStencilFormat;
    }

    set depthStencilFormat (value) {
        this._depthStencilFormat = value;
    }

    public getGFXWindow () {
        return this._window;
    }

    public getGFXTextureView () {
        return this._window ? this._window.colorTexView : null;
    }

    public reset (info?: IRenderTextureCreateInfo) {
        if (info) {
            this._width = info.width;
            this._height = info.height;
            this._depthStencilFormat = info.depthStencilFormat;
        }
        this._tryReset();
    }

    public destroy () {
        this._tryDestroyWindow();
        return super.destroy();
    }

    private _tryReset () {
        this._tryDestroyWindow();
        const device = this._getGFXDevice();
        if (!device) {
            return;
        }
        this._window = this._createWindow(device);
    }

    private _createWindow (device: GFXDevice) {
        return device.createWindow({
            isOffscreen: true,
            width: this._width,
            height: this._height,
            colorFmt: this._getGFXFormat(),
            depthStencilFmt: this._depthStencilFormat as unknown as GFXFormat,
        });
    }

    private _tryDestroyWindow () {
        if (this._window) {
            this._window.destroy();
        }
    }
}

cc.RenderTexture = RenderTexture;
