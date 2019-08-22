/**
 * @category asset
 */

import { ccclass, property } from '../core/data/class-decorator';
import { ccenum } from '../core/value-types/enum';
import { GFXFormat } from '../gfx';
import { GFXDevice } from '../gfx/device';
import { GFXWindow } from '../gfx/window';
import { Camera } from '../renderer';
import { DepthStencilFormat, PixelFormat } from './asset-enum';
import { TextureBase } from './texture-base';

export interface IRenderTextureCreateInfo {
    name?: string;
    width: number;
    height: number;
    colorFormat: PixelFormat;
    depthStencilFormat: DepthStencilFormat;
}

ccenum(DepthStencilFormat);

@ccclass('cc.RenderTexture')
export class RenderTexture extends TextureBase {
    public static DepthStencilFormat = DepthStencilFormat;
    private _window: GFXWindow | null = null;

    @property
    private _depthStencilFormat: DepthStencilFormat = DepthStencilFormat.NONE;

    private _cameras: Camera[] = [];

    @property
    get width () {
        return this._width;
    }

    set width (value) {
        this._width = value;
        this.reset();
    }

    @property
    get height () {
        return this._height;
    }

    set height (value) {
        this._height = value;
        this.reset();
    }

    @property
    get depthStencilFormat () {
        return this._depthStencilFormat;
    }

    set depthStencilFormat (value) {
        this._depthStencilFormat = value;
        this.reset();
    }

    constructor (info?: IRenderTextureCreateInfo) {
        super(true);
        if (info){
            this.reset(info);
        }
    }

    public getGFXWindow () {
        return this._window;
    }

    public getGFXTextureView () {
        return this._window ? this._window.colorTexView : null;
    }

    public getGFXStencilTexture (){
        return this._window ? this._window.depthStencilTexView : null;
    }

    public reset (info?: IRenderTextureCreateInfo) {
        if (info) {
            this._width = info.width;
            this._height = info.height;
            this._format = info.colorFormat;
            this._depthStencilFormat = info.depthStencilFormat;
        }
        this._tryReset();
    }

    public destroy () {
        if (this._window) {
            cc.director.root.destroyWindow(this._window);
            this._window = null;
        }
        this._cameras.forEach((ca) => {
            ca.changeTargetWindow();
        });
        this._cameras.length = 0;
        return super.destroy();
    }

    public addCamera (camera: Camera) {
        const findIdx = this._cameras.findIndex((ca) => {
            return ca === camera;
        });
        if (findIdx === -1) {
            this._cameras.push(camera);
        }
    }

    public removeCamera (camera: Camera) {
        const findIdx = this._cameras.findIndex((ca) => {
            return ca === camera;
        });

        this._cameras.splice(findIdx, 1);
    }

    public onLoaded (){
        this._tryReset();

        this.loaded = true;
        this.emit('load');
    }

    public _serialize (exporting?: any): any {
        return {
            base: super._serialize(),
            name: this._name,
            width: this._width,
            height: this._height,
            colorFormat: this._format,
            depthStencilFormat: this._depthStencilFormat,
        };
    }

    public _deserialize (serializeData: any, handle: any) {
        super._deserialize(serializeData.base, handle);
        const data = serializeData as IRenderTextureCreateInfo;
        this.name = data.name || '';
        this._width = data.width;
        this._height = data.height;
        this._format = data.colorFormat;
        this._depthStencilFormat = data.depthStencilFormat;
    }

    private _tryReset () {
        this._createWindow();
        this._tryDestroyWindow();
        const device = this._getGFXDevice();
        if (!device) {
            return;
        }
        this._window!.initialize({
            title: this.name,
            isOffscreen: true,
            width: this._width,
            height: this._height,
            colorFmt: this._format,
            depthStencilFmt: this._depthStencilFormat as unknown as GFXFormat,
        });
        this._cameras.forEach((ca) => {
            ca.changeTargetWindow(this._window);
        });
    }

    private _createWindow () {
        if (this._window) { return; }
        this._window = cc.director.root!.createWindow({
            title: this.name,
            isOffscreen: true,
            width: this._width,
            height: this._height,
            colorFmt: this._format,
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
