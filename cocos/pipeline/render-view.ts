import { Root } from '../core/root';
import { GFXFormat, GFXLoadOp, GFXStoreOp, GFXTextureLayout, GFXTextureType, GFXTextureUsageBit, GFXTextureViewType } from '../gfx/define';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { GFXRenderPass } from '../gfx/render-pass';
import { GFXTexture } from '../gfx/texture';
import { GFXTextureView } from '../gfx/texture-view';
import { GFXWindow } from '../gfx/window';
import { Camera } from '../renderer/scene/camera';

export enum RenderViewPriority {
    GENERAL = 100,
}

export interface IRenderViewInfo {
    camera: Camera;
    name: string;
    priority: number;
    isUI: boolean;
}

export interface IRenderTargetInfo {
    width?: number;
    height?: number;
}

export class RenderView {

    public get name () {
        return this._name;
    }

    public get window () {
        return this._window;
    }

    public set window (val) {
        this._window = val;

        if (!this._isOffscreen) {
            this._framebuffer = this._window!.framebuffer;
        }
    }

    public get priority () {
        return this._priority;
    }

    public set priority (val: number) {
        this._priority = val;
    }

    public set visibility (vis) {
        this._visibility = vis;
    }
    public get visibility () {
        return this._visibility;
    }

    public get camera (): Camera {
        return this._camera!;
    }

    public get isEnable (): boolean {
        return this._isEnable;
    }

    public get isUI (): boolean {
        return this._isUI;
    }

    public get isOffscreen (): boolean {
        return this._isOffscreen;
    }

    public get framebuffer (): GFXFramebuffer {
        return this._framebuffer!;
    }

    public static registerCreateFunc (root: Root) {
        root._createViewFun = (_root: Root, _camera: Camera): RenderView => new RenderView(_root, _camera);
    }

    private _root: Root;
    private _name: string = '';
    private _window: GFXWindow | null = null;
    private _priority: number = 0;
    private _visibility: number = 0;
    private _camera: Camera;
    private _isEnable: boolean = true;
    private _isUI: boolean = false;
    private _isOffscreen: boolean = false;

    // For offscreen
    private _renderPass: GFXRenderPass | null = null;
    private _renderTex: GFXTexture | null = null;
    private _renderTexView: GFXTextureView | null = null;
    private _depthStencilTex: GFXTexture | null = null;
    private _depthStencilTexView: GFXTextureView | null = null;
    private _framebuffer: GFXFramebuffer | null = null;

    private constructor (root: Root, camera: Camera) {
        this._root = root;
        this._camera = camera;
    }

    public initialize (info: IRenderViewInfo): boolean {

        this._name = info.name;
        this._isUI = info.isUI;
        this._priority = info.priority;

        return true;
    }

    public destroy () {
        this._window = null;
        this._priority = 0;
        this.destroyRenderTarget();
    }

    public createRenderTarget (info: IRenderTargetInfo): boolean {
        this._isOffscreen = true;
        const device = this._root.device;
        const colorFmt = GFXFormat.RGBA8;
        const width = (info.width !== undefined ? info.width : this._camera.width);
        const height = (info.height !== undefined ? info.height : this._camera.height);

        if (this._renderTex) {
            this._renderTex.destroy();
        }

        this._renderTex = device.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
            format: colorFmt,
            width,
            height,
        });

        if (this._renderTexView) {
            this._renderTexView.destroy();
        }

        this._renderTexView = device.createTextureView({
            texture : this._renderTex,
            type : GFXTextureViewType.TV2D,
            format : colorFmt,
        });

        if (this._renderPass) {
            this._renderPass.destroy();
        }

        this._renderPass = device.createRenderPass({
            colorAttachments: [{
                format: colorFmt,
                loadOp: GFXLoadOp.CLEAR,
                storeOp: GFXStoreOp.STORE,
                sampleCount: 1,
                beginLayout: GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL,
                endLayout: GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL,
            }],
        });

        if (this._framebuffer) {
            this._framebuffer.destroy();
        }

        this._framebuffer = device.createFramebuffer({
            renderPass: this._renderPass,
            colorViews: [ this._renderTexView ],
            isOffscreen: true,
        });

        return true;
    }

    public destroyRenderTarget () {
        if (this._renderTex) {
            this._renderTex.destroy();
        }

        if (this._renderTexView) {
            this._renderTexView.destroy();
        }

        if (this._depthStencilTex) {
            this._depthStencilTex.destroy();
        }

        if (this._depthStencilTexView) {
            this._depthStencilTexView.destroy();
        }

        if (this._framebuffer && this._isOffscreen) {
            this._framebuffer.destroy();
        }

        this._renderTex = null;
        this._renderTexView = null;
        this._depthStencilTex = null;
        this._depthStencilTexView = null;
        this._framebuffer = null;
        this._isOffscreen = false;
    }

    public enable (isEnable: boolean) {
        this._isEnable = isEnable;
    }
}
