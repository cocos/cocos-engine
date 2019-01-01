import { GFXDevice } from './device';
import { GFXTextureView } from './texture-view';
import { GFXRenderPass } from './render-pass';

export interface GFXFramebufferInfo {
    renderPass: GFXRenderPass;
    colorViews?: GFXTextureView[];
    depthStencilView?: GFXTextureView;
    isOffscreen?: boolean;
};

export abstract class GFXFramebuffer {

    constructor(device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info: GFXFramebufferInfo): boolean;
    public abstract destroy(): void;

    public get renderPass(): GFXRenderPass | null {
        return this._renderPass;
    }

    public get colorViews(): GFXTextureView[] {
        return this._colorViews;
    }

    public get depthStencilView(): GFXTextureView | null {
        return this._depthStencilView;
    }

    protected _device: GFXDevice;
    protected _renderPass: GFXRenderPass | null = null;
    protected _colorViews: GFXTextureView[] = [];
    protected _depthStencilView: GFXTextureView | null = null;
    protected _isOffscreen: boolean = true;
};
