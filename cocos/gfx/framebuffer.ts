import { GFXDevice } from './device';
import { GFXRenderPass } from './render-pass';
import { GFXTextureView } from './texture-view';

export interface IGFXFramebufferInfo {
    renderPass: GFXRenderPass;
    colorViews?: GFXTextureView[];
    depthStencilView?: GFXTextureView;
    isOffscreen?: boolean;
}

export abstract class GFXFramebuffer {

    public get renderPass (): GFXRenderPass | null {
        return this._renderPass;
    }

    public get colorViews (): GFXTextureView[] {
        return this._colorViews;
    }

    public get depthStencilView (): GFXTextureView | null {
        return this._depthStencilView;
    }

    public get isOffscreen (): boolean {
        return this._isOffscreen;
    }

    protected _device: GFXDevice;
    protected _renderPass: GFXRenderPass | null = null;
    protected _colorViews: GFXTextureView[] = [];
    protected _depthStencilView: GFXTextureView | null = null;
    protected _isOffscreen: boolean = true;

    constructor (device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize (info: IGFXFramebufferInfo): boolean;
    public abstract destroy (): void;
}
