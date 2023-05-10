import { EDITOR } from 'internal:constants';

import { AccessType, AttachmentType, ComputeView, QueueHint, RasterView, ResourceResidency, SceneFlags } from '../../custom/types';
import { ClearFlagBit, Color, Format, LoadOp, StoreOp, Viewport } from '../../../gfx';
import { Pipeline, RasterPassBuilder } from '../../custom/pipeline';
import { Camera } from '../../../render-scene/scene';
import { Material } from '../../../asset/assets';
import { PostProcess } from '../components';
import { size, Vec2 } from '../../../core';

export class RenderTarget {
    set enable (val: boolean) {
        this._enable = val;
    }
    get enable() {
        return this._enable;
    }

    set rtName(val: string) {
        this._rtName = val;
        this._dsName = `${this._rtName}_DS`;
        this._dirty = true;
    }
    get rtName() {
        return this._rtName;
    }
    get dsName(){
        return this._dsName;
    }

    set tagName(val: string) {
        this._tagName = val;
    }
    get tagName() {
        return this._tagName;
    }

    set size(val: Vec2) {
        this._size = val;
        this._dirty = true;
    }
    get size() {
        return this._size;
    }

    set format(val: Format) {
        this._format = val;
        this._dirty = true;
    }
    get format() {
        return this._format;
    }

    set residency(val: ResourceResidency) {
        this._residency = val;
        this._dirty = true;
    }
    get residency() {
        return this._residency;
    }

    set isOffScreen(val: boolean) {
        this._isOffScreen = val;
        this._dirty = true;
    }
    get isOffScreen() {
        return this._isOffScreen;
    }

    set enableDS(val: boolean) {
        this._enableDS = val;
        this._dirty = true;
    }
    get enableDS() {
        return this._enableDS;
    }

    private _enable: boolean = false;
    private _rtName: string = '';
    private _dsName: string = '';
    private _tagName: string = '';
    private _size: Vec2 = new Vec2(1.0);
    private _format: Format = Format.RGBA8;
    private _filter: boolean = false;
    private _srgb: boolean = false;
    private _residency: ResourceResidency = ResourceResidency.MANAGED;
    private _isOffScreen: boolean = false;
    private _enableDS: boolean = true;
    private _dirty = true;

    constructor (rtName: string = '', tagName: string = '', size: Vec2 = new Vec2(1.0),
    format: Format = Format.RGBA8, enableDS: boolean = true, isOffScreen: boolean = false,
    residency: ResourceResidency = ResourceResidency.MANAGED
    ) {
        this._rtName = rtName;
        this._dsName = `${this._rtName}_DS`;
        this._tagName = tagName;
        this._size.set(size);
        this._format = format;
        this._enableDS = enableDS;
        this._isOffScreen = isOffScreen;
        this._residency = residency;
        this._dirty = true;
    }

    public addRasterView(ppl: Pipeline, camera: Camera) {
        const depthOnly = this._format === Format.DEPTH_STENCIL;
        if (this._enable && this._dirty) {
            if (depthOnly) {
                if (!ppl.containsResource(this._rtName)) {
                    ppl.addDepthStencil(this._rtName, Format.DEPTH_STENCIL, this._size.x, this._size.y, this._residency);
                }
                ppl.updateDepthStencil(this._rtName, this._size.x, this._size.y);
            } else {
                if(!ppl.containsResource(this._rtName)) {
                    if (!this._isOffScreen) {
                        ppl.addRenderWindow(this._rtName, this._format, this._size.x, this._size.y, camera.window);
                    } else {
                        ppl.addRenderTarget(this._rtName, this._format, this._size.x, this._size.y, this._residency);
                    }
                    if (this._enableDS) ppl.addDepthStencil(this._dsName, Format.DEPTH_STENCIL, this._size.x, this._size.y, this._residency);
                }

                if (!this._isOffScreen) {
                    ppl.updateRenderWindow(this._rtName, camera.window);
                } else {
                    ppl.updateRenderTarget(this._rtName, this._size.x, this._size.y);
                }
                if (this._enableDS) ppl.updateDepthStencil(this._dsName, this._size.x, this._size.y);
            }
        }
    }
}

export class PassContext {
    clearFlag: ClearFlagBit = ClearFlagBit.COLOR;
    clearColor = new Color()
    clearDepthColor = new Color()
    ppl: Pipeline| undefined
    camera: Camera| undefined
    material: Material| undefined
    pass: RasterPassBuilder| undefined
    rasterWidth = 0
    rasterHeight = 0
    layoutName = ''

    renderProfiler = false;
    passPathName = '';
    passVersion = 0;

    isFinalCamera = false;
    isFinalPass = false;

    forwardPass: any = undefined;
    postProcess: PostProcess | undefined;

    version () {
        if (!EDITOR) {
            this.passPathName += `_${this.pass!.name}_${this.layoutName}`;
            this.pass!.setVersion(this.passPathName, this.passVersion);
        }
        return this;
    }

    addRasterPass (width: number, height: number, layoutName: string, passName: string) {
        const pass = this.ppl!.addRasterPass(width, height, layoutName);
        pass.name = passName;
        this.pass = pass;
        this.rasterWidth = width;
        this.rasterHeight = height;
        this.layoutName = layoutName;
        return this;
    }
    setViewport (x: number, y: number, w: number, h: number) {
        this.pass!.setViewport(new Viewport(x, y, w, h));
        return this;
    }

    addRasterView (name: string, format: Format, offscreen = true, residency?: ResourceResidency) {
        const ppl = this.ppl;
        const camera = this.camera;
        const pass = this.pass;
        if (!ppl || !camera || !pass) {
            return this;
        }

        if (!ppl.containsResource(name)) {
            if (format === Format.DEPTH_STENCIL) {
                ppl.addDepthStencil(name, format, this.rasterWidth, this.rasterHeight, ResourceResidency.MANAGED);
            } else if (offscreen) {
                ppl.addRenderTarget(name, format, this.rasterWidth, this.rasterHeight, residency || ResourceResidency.MANAGED);
            } else {
                ppl.addRenderTexture(name, format, this.rasterWidth, this.rasterHeight, camera.window);
            }
        }

        if (format !== Format.DEPTH_STENCIL) {
            if (!offscreen) {
                ppl.updateRenderWindow(name, camera.window);
            } else {
                ppl.updateRenderTarget(name, this.rasterWidth, this.rasterHeight);
            }
        } else {
            ppl.updateDepthStencil(name, this.rasterWidth, this.rasterHeight);
        }

        const clearColor = new Color();
        let view: RasterView;
        if (format === Format.DEPTH_STENCIL) {
            clearColor.copy(this.clearDepthColor);

            const clearFlag = this.clearFlag & ClearFlagBit.DEPTH_STENCIL;
            let clearOp = LoadOp.CLEAR;
            if (clearFlag === ClearFlagBit.NONE) {
                clearOp = LoadOp.LOAD;
            }

            view = new RasterView('_',
                AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
                clearOp, StoreOp.STORE,
                clearFlag,
                clearColor);
        } else {
            clearColor.copy(this.clearColor);

            const clearFlag = this.clearFlag & ClearFlagBit.COLOR;
            let clearOp = LoadOp.CLEAR;
            if (clearFlag === ClearFlagBit.NONE) {
                clearOp = LoadOp.LOAD;
            }

            view = new RasterView('_',
                AccessType.WRITE, AttachmentType.RENDER_TARGET,
                clearOp,
                StoreOp.STORE,
                clearFlag,
                clearColor);
        }
        pass.addRasterView(name, view);
        return this;
    }

    addRenderTarget(rtName: string, tagName: string, loadOp: LoadOp = LoadOp.CLEAR, storeOp: StoreOp = StoreOp.STORE, clearColor: Color = new Color(0.0, 0.0, 0.0, 1.0)) {
        const ppl = this.ppl;
        const camera = this.camera;
        const pass = this.pass;
        if (!ppl || !camera || !pass) {
            return this;
        }

        pass.addRenderTarget(rtName, tagName, loadOp, storeOp, clearColor);
        return this;
    }

    addDepthStencil(rtName: string, tagName: string, loadOp: LoadOp = LoadOp.CLEAR, storeOp: StoreOp = StoreOp.STORE, depth: number = 1.0, stencil: number = 1, clearFlags: ClearFlagBit = ClearFlagBit.DEPTH_STENCIL) {
        const ppl = this.ppl;
        const camera = this.camera;
        const pass = this.pass;
        if (!ppl || !camera || !pass) {
            return this;
        }

        pass.addDepthStencil(rtName, tagName, loadOp, storeOp, depth, stencil, clearFlags);
        return this;
    }

    setPassInput (inputName: string, shaderName: string) {
        if (this.ppl!.containsResource(inputName)) {
            const computeView = new ComputeView();
            computeView.name = shaderName;
            this.pass!.addComputeView(inputName, computeView);
        }
        return this;
    }

    blitScreen (passIdx = 0) {
        this.pass!.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
            this.camera!, this.material!, passIdx,
            SceneFlags.NONE,
        );
        return this;
    }
}

export const passContext = new PassContext();
