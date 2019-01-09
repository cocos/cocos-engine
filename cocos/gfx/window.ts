import { GFXFormat } from './define';
import { GFXDevice } from './device';
import { GFXFramebuffer } from './framebuffer';
import { GFXRenderPass } from './render-pass';

export interface IGFXWindowInfo {
    title?: string;
    left?: number;
    top?: number;
    width: number;
    height: number;
    colorFmt: GFXFormat;
    depthStencilFmt: GFXFormat;
}

export abstract class GFXWindow {

    public get width (): number {
        return this._width;
    }

    public get height (): number {
        return this._height;
    }

    public get colorFormat (): GFXFormat | null {
        return this._colorFmt;
    }

    public get detphStencilFormat (): GFXFormat | null {
        return this._depthStencilFmt;
    }

    public get renderPass (): GFXRenderPass | null {
        return this._renderPass;
    }

    public get framebuffer (): GFXFramebuffer | null {
        return this._framebuffer;
    }

    protected _device: GFXDevice;
    protected _title: string = '';
    protected _left: number = 0;
    protected _top: number = 0;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _colorFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _depthStencilFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _renderPass: GFXRenderPass | null = null;
    // protected _colorTex: GFXTexture | null = null;
    // protected _colorTexView: GFXTextureView | null = null;
    // protected _depthStencilTex: GFXTexture | null = null;
    // protected _depthStencilTexView: GFXTextureView | null = null;
    protected _framebuffer: GFXFramebuffer | null = null;

    constructor (device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize (info: IGFXWindowInfo): boolean;
    public abstract destroy (): void;
}
