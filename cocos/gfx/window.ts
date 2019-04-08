import { GFXFormat, GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXFramebuffer } from './framebuffer';
import { GFXRenderPass } from './render-pass';
import { GFXTexture } from './texture';
import { GFXTextureView } from './texture-view';

export interface IGFXWindowInfo {
    title?: string;
    left?: number;
    top?: number;
    width: number;
    height: number;
    colorFmt: GFXFormat;
    depthStencilFmt: GFXFormat;
    isOffscreen?: boolean;
}

export abstract class GFXWindow extends GFXObject {

    public get width (): number {
        return this._width;
    }

    public get height (): number {
        return this._height;
    }

    public get colorFormat (): GFXFormat {
        return this._colorFmt;
    }

    public get detphStencilFormat (): GFXFormat {
        return this._depthStencilFmt;
    }

    public get renderPass (): GFXRenderPass {
        return this._renderPass!;
    }

    public get colorTexView (): GFXTextureView | null {
        return this._colorTexView;
    }

    public get depthStencilTexView (): GFXTextureView | null {
        return this._depthStencilTexView;
    }

    public get framebuffer (): GFXFramebuffer {
        return this._framebuffer!;
    }

    protected _device: GFXDevice;
    protected _title: string = '';
    protected _left: number = 0;
    protected _top: number = 0;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _colorFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _depthStencilFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _isOffscreen: boolean = false;
    protected _renderPass: GFXRenderPass | null = null;
    protected _colorTex: GFXTexture | null = null;
    protected _colorTexView: GFXTextureView | null = null;
    protected _depthStencilTex: GFXTexture | null = null;
    protected _depthStencilTexView: GFXTextureView | null = null;
    protected _framebuffer: GFXFramebuffer | null = null;

    constructor (device: GFXDevice) {
        super(GFXObjectType.WINDOW);
        this._device = device;
    }

    public abstract initialize (info: IGFXWindowInfo): boolean;
    public abstract destroy ();
    public abstract resize (width: number, height: number);
}
