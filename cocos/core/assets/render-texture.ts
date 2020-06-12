/**
 * @category asset
 */

import { ccclass, property } from '../data/class-decorator';
import { GFXFormat, GFXTexture, GFXColorAttachment, GFXDepthStencilAttachment, GFXTextureLayout } from '../gfx';
import { GFXDevice } from '../gfx/device';
import { ccenum } from '../value-types/enum';
import { DepthStencilFormat, PixelFormat } from './asset-enum';
import { TextureBase } from './texture-base';
import { legacyCC } from '../global-exports';
import { RenderWindow } from '../pipeline';
import { IRenderWindowInfo } from '../pipeline/render-window';

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
    private _window: RenderWindow | null = null;

    @property
    private _depthStencilFormat: DepthStencilFormat = DepthStencilFormat.NONE;

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

    @property({
        type: DepthStencilFormat,
    })
    get depthStencilFormat () {
        return this._depthStencilFormat;
    }

    set depthStencilFormat (value) {
        this._depthStencilFormat = value;
        this.reset();
    }

    public getGFXWindow () {
        return this._window;
    }

    public getGFXTexture (): GFXTexture | null {
        return this._window ? this._window.colorTextures[0] : null;
    }

    public getGFXStencilTexture (): GFXTexture | null {
        return this._window ? this._window.depthStencilTexture : null;
    }

    public reset (info?: IRenderTextureCreateInfo) {
        if (info) {
            this._width = info.width;
            this._height = info.height;
            if (info.colorFormat){
                this._format = info.colorFormat;
            }

            if (info.depthStencilFormat){
                this._depthStencilFormat = info.depthStencilFormat;
            }

            this._tryResetWindow();
            this.emit('resize', this);
        }
    }

    public destroy () {
        if (this._window) {
            legacyCC.director.root!.destroyWindow(this._window);
            this._window = null;
        }

        return super.destroy();
    }

    public onLoaded (){
        this._tryResetWindow();
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

    protected _tryResetWindow () {
        const device = this._getGFXDevice();
        if (!device) {
            return;
        }

        if (this._window) {
            this._window.destroy();
        }

        this._createWindow(device);
    }

    protected _createWindow (device: GFXDevice) {
        const colorAttachment = new GFXColorAttachment();
        colorAttachment.format = this._format;
        colorAttachment.endLayout = GFXTextureLayout.SHADER_READONLY_OPTIMAL;
        const depthStencilAttachment = new GFXDepthStencilAttachment();
        depthStencilAttachment.format = this._depthStencilFormat as unknown as GFXFormat;

        const config: IRenderWindowInfo = {
            title: this.name,
            isOffscreen: true,
            width: this._width,
            height: this._height,
            renderPassInfo: {
                colorAttachments: [colorAttachment],
                depthStencilAttachment,
            }
        };

        if (this._window) {
            this._window.initialize(config);
            return this._window;
        }

        this._window = legacyCC.director.root!.createWindow(config);
        this.loaded = true;
        this.emit('load');
    }
}

legacyCC.RenderTexture = RenderTexture;
