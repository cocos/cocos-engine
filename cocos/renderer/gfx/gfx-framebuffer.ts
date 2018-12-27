import { GFXDevice } from './gfx-device';
import { GFXTextureView } from './gfx-texture-view';
import { GFXRenderPass } from './gfx-render-pass';

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

    protected _device: GFXDevice;
    protected _colorViews: GFXTextureView[] = [];
    protected _depthStencilView: GFXTextureView | null = null;
    protected _isOffscreen: boolean = true;
};
