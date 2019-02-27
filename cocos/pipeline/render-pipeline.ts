import { intersect } from '../3d/geom-utils';
import { Root } from '../core/root';
import { Mat4 } from '../core/value-types';
import { mat4, vec3 } from '../core/vmath';
import { GFXBuffer } from '../gfx/buffer';
import {
    GFXBufferUsageBit,
    GFXFormat,
    GFXFormatInfos,
    GFXLoadOp,
    GFXMemoryUsageBit,
    GFXObjectType,
    GFXStoreOp,
    GFXTextureLayout,
    GFXType } from '../gfx/define';
import { GFXAPI, GFXDevice, GFXFeature } from '../gfx/device';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { GFXInputAssembler, IGFXInputAttribute } from '../gfx/input-assembler';
import { GFXRenderPass } from '../gfx/render-pass';
import { GFXTexture } from '../gfx/texture';
import { GFXTextureView } from '../gfx/texture-view';
import { UBOGlobal } from './define';
import { IGlobalBindingDesc } from './define';
import { IRenderFlowInfo, RenderFlow } from './render-flow';
import { RenderQueue } from './render-queue';
import { RenderView } from './render-view';

const _vec4Array = new Float32Array(4);
const _mat4Array = new Float32Array(16);
const _outMat = new Mat4();

export abstract class RenderPipeline {

    public get root (): Root {
        return this._root;
    }

    public get device (): GFXDevice {
        return this._device;
    }

    public get queue (): RenderQueue {
        return this._queue;
    }

    public get flows (): RenderFlow[] {
        return this._flows;
    }

    public get shadingTexView (): GFXTextureView {
        return this._shadingTexView!;
    }

    public get shadingFBO (): GFXFramebuffer {
        return this._shadingFBO!;
    }

    public get depthStencilTexView (): GFXTextureView {
        return this._depthStencilTexView!;
    }

    public get quadIA (): GFXInputAssembler {
        return this._quadIA!;
    }

    public static get globalBindings (): Map<string, IGlobalBindingDesc> {
        return this._globalBindings;
    }

    public get defaultTexture (): GFXTexture {
        return this._defaultTex!;
    }

    protected _root: Root;
    protected _device: GFXDevice;
    protected _queue: RenderQueue = new RenderQueue();
    protected _renderPasses: Map<number, GFXRenderPass> = new Map();
    protected _flows: RenderFlow[] = [];
    protected _isHDR: boolean = false;
    protected _shadingPass: GFXRenderPass | null = null;
    protected _shadingTex: GFXTexture | null = null;
    protected _shadingTexView: GFXTextureView | null = null;
    protected _depthStencilTex: GFXTexture | null = null;
    protected _depthStencilTexView: GFXTextureView | null = null;
    protected _shadingFBO: GFXFramebuffer | null = null;
    protected _quadVB: GFXBuffer | null = null;
    protected _quadIB: GFXBuffer | null = null;
    protected _quadIA: GFXInputAssembler | null = null;
    protected static _defaultUboGlobal: UBOGlobal | null = null;
    protected static _globalBindings: Map<string, IGlobalBindingDesc> = new Map<string, IGlobalBindingDesc>();
    protected _defaultTex: GFXTexture | null = null;
    protected _defaultTexView: GFXTextureView | null = null;

    constructor (root: Root) {
        this._root = root;
        this._device = root.device;
    }

    public abstract initialize (): boolean;
    public abstract destroy ();

    public resize (width: number, height: number) {
        for (const flow of this._flows) {
            flow.resize(width, height);
        }
    }

    public render (view: RenderView) {

        view.camera.update();

        this.sceneCulling(view);

        this.updateUBOs(view);

        for (const flow of this._flows) {
            flow.render(view);
        }
    }

    public addRenderPass (stage: number, renderPass: GFXRenderPass) {
        if (renderPass) {
            this._renderPasses.set(stage, renderPass);
        }
    }

    public getRenderPass (stage: number): GFXRenderPass | null {
        const renderPass = this._renderPasses.get(stage);
        if (renderPass) {
            return renderPass;
        } else {
            return null;
        }
    }

    public removeRenderPass (stage: number) {
        this._renderPasses.delete(stage);
    }

    public clearRenderPasses () {
        this._renderPasses.clear();
    }

    public createFlow<T extends RenderFlow> (
        clazz: new (pipeline: RenderPipeline) => T,
        info: IRenderFlowInfo,
    ): RenderFlow | null {
        const flow: RenderFlow = new clazz(this);
        if (flow.initialize(info)) {
            this._flows.push(flow);
            this._flows.sort((a: RenderFlow, b: RenderFlow) => {
                return a.priority - b.priority;
            });

            return flow;
        } else {
            return null;
        }
    }

    public destroyFlows () {
        for (const flow of this._flows) {
            flow.destroy();
        }
        this._flows = [];
    }

    protected createShadingTarget (): boolean {

        let colorFmt: GFXFormat;
        let depthFmt: GFXFormat;

        // Try to use HDR format
        if (this._device.hasFeature(GFXFeature.FORMAT_R11G11B10F)) {
            colorFmt = GFXFormat.R11G11B10F;
            this._isHDR = true;
        } else if (this._device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT)) {
            colorFmt = GFXFormat.RGB16F;
            this._isHDR = true;
        } else if (this._device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
            colorFmt = GFXFormat.RGB32F;
            this._isHDR = true;
        } else { // Fallback to LDR
            colorFmt = GFXFormat.RGBA8;
            this._isHDR = false;
        }

        if (this._device.hasFeature(GFXFeature.FORMAT_D24S8)) {
            depthFmt = GFXFormat.D24S8;
        } else {
            depthFmt = GFXFormat.D16;
        }

        console.info('Shading Color Format: ' + GFXFormatInfos[colorFmt].name);
        console.info('Shading Depth Format: ' + GFXFormatInfos[depthFmt].name);

        this._shadingTex = this._device.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
            format: colorFmt,
            width: this._device.nativeWidth,
            height: this._device.nativeHeight,
        });

        this._shadingTexView = this._device.createTextureView({
            texture : this._shadingTex,
            type : GFXTextureViewType.TV2D,
            format : colorFmt,
        });

        this._shadingPass = this._device.createRenderPass({
            colorAttachments: [{
                format: colorFmt,
                loadOp: GFXLoadOp.CLEAR,
                storeOp: GFXStoreOp.STORE,
                sampleCount: 1,
                beginLayout: GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL,
                endLayout: GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL,
            }],
            depthStencilAttachment: {
                format : depthFmt,
                depthLoadOp : GFXLoadOp.CLEAR,
                depthStoreOp : GFXStoreOp.STORE,
                stencilLoadOp : GFXLoadOp.CLEAR,
                stencilStoreOp : GFXStoreOp.STORE,
                sampleCount : 1,
                beginLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
                endLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
            },
        });

        this._shadingFBO = this._device.createFramebuffer({
            renderPass: this._shadingPass,
            colorViews: [ this._shadingTexView ],
            depthStencilView: this._depthStencilTexView!,
        });

        return true;
    }

    protected destroyShadingTarget () {
        if (this._shadingTexView) {
            this._shadingTexView.destroy();
            this._shadingTexView = null;
        }

        if (this._shadingTex) {
            this._shadingTex.destroy();
            this._shadingTex = null;
        }

        if (this._shadingFBO) {
            this._shadingFBO.destroy();
            this._shadingFBO = null;
        }

        if (this._shadingPass) {
            this._shadingPass.destroy();
            this._shadingPass = null;
        }
    }

    protected createQuadInputAssembler (): boolean {

        // create vertex buffer

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;

        this._quadVB = this._device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: vbSize,
            stride: vbStride,
        });

        if (!this._quadVB) {
            return false;
        }

        const verts = new Float32Array(4 * 4);
        let n = 0;
        verts[n++] = -1.0; verts[n++] = -1.0; verts[n++] = 0.0; verts[n++] = 0.0;
        verts[n++] = 1.0; verts[n++] = -1.0; verts[n++] = 1.0; verts[n++] = 0.0;
        verts[n++] = -1.0; verts[n++] = 1.0; verts[n++] = 0.0; verts[n++] = 1.0;
        verts[n++] = 1.0; verts[n++] = 1.0; verts[n++] = 1.0; verts[n++] = 1.0;

        this._quadVB.update(verts);

        // create index buffer
        const ibStride = Uint8Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        this._quadIB = this._device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: ibSize,
            stride: ibStride,
        });

        if (!this._quadIB) {
            return false;
        }

        const indices = new Uint8Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;

        this._quadIB.update(indices);

        // create input assembler

        const attributes: IGFXInputAttribute[] = [
            { name: 'a_position', format: GFXFormat.RG32F },
            { name: 'a_texCoord', format: GFXFormat.RG32F },
        ];

        this._quadIA = this._device.createInputAssembler({
            attributes,
            vertexBuffers: [this._quadVB],
            indexBuffer: this._quadIB,
        });

        return true;
    }

    protected destroyQuadInputAssembler () {
        if (this._quadVB) {
            this._quadVB.destroy();
            this._quadVB = null;
        }

        if (this._quadIB) {
            this._quadIB.destroy();
            this._quadIB = null;
        }

        if (this._quadIA) {
            this._quadIA.destroy();
            this._quadIA = null;
        }
    }

    protected createUBOs (): boolean {
        if (!RenderPipeline._globalBindings.get(UBOGlobal.BLOCK.name)) {
            const globalUBO = this._root.device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOGlobal.SIZE,
            });

            if (!globalUBO) {
                return false;
            }

            RenderPipeline._defaultUboGlobal = new UBOGlobal();

            RenderPipeline._globalBindings.set(UBOGlobal.BLOCK.name, {
                type: GFXObjectType.BUFFER,
                blockInfo: UBOGlobal.BLOCK,
                uniformBuffer: globalUBO,
            });
        }

        return true;
    }

    protected destroyUBOs () {
        const defaultUBO = RenderPipeline._globalBindings.get(UBOGlobal.BLOCK.name);
        if (defaultUBO) {
            defaultUBO.uniformBuffer!.destroy();
        }
    }

    protected updateUBOs (view: RenderView) {

        // update UBOGlobal
        _vec4Array[0] = this._root.frameTime;
        _vec4Array[1] = 0.0;
        _vec4Array[2] = 0.0;
        _vec4Array[3] = 0.0;
        RenderPipeline._defaultUboGlobal!.view.set(_vec4Array, UBOGlobal.TIME_OFFSET);

        _vec4Array[0] = this._root.device.width;
        _vec4Array[1] = this._root.device.height;
        _vec4Array[2] = 1.0 / _vec4Array[0];
        _vec4Array[3] = 1.0 / _vec4Array[1];
        RenderPipeline._defaultUboGlobal!.view.set(_vec4Array, UBOGlobal.SCREEN_SIZE_OFFSET);

        _vec4Array[0] = 1.0;
        _vec4Array[1] = 1.0;
        _vec4Array[2] = 1.0;
        _vec4Array[3] = 1.0;
        RenderPipeline._defaultUboGlobal!.view.set(_vec4Array, UBOGlobal.SCREEN_SCALE_OFFSET);

        const camera = view.camera;
        mat4.array(_mat4Array, camera.matView);
        RenderPipeline._defaultUboGlobal!.view.set(_mat4Array, UBOGlobal.MAT_VIEW_OFFSET);

        mat4.invert(_outMat, camera.matView);
        mat4.array(_mat4Array, _outMat);
        RenderPipeline._defaultUboGlobal!.view.set(_mat4Array, UBOGlobal.MAT_VIEW_INV_OFFSET);

        mat4.array(_mat4Array, camera.matProj);
        RenderPipeline._defaultUboGlobal!.view.set(_mat4Array, UBOGlobal.MAT_PROJ_OFFSET);

        mat4.invert(_outMat, camera.matProj);
        mat4.array(_mat4Array, _outMat);
        RenderPipeline._defaultUboGlobal!.view.set(_mat4Array, UBOGlobal.MAT_PROJ_INV_OFFSET);

        mat4.array(_mat4Array, camera.matViewProj);
        RenderPipeline._defaultUboGlobal!.view.set(_mat4Array, UBOGlobal.MAT_VIEW_PROJ_OFFSET);

        mat4.array(_mat4Array, camera.matViewProjInv);
        RenderPipeline._defaultUboGlobal!.view.set(_mat4Array, UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET);

        vec3.array(_vec4Array, camera.position);
        _vec4Array[3] = 1.0;
        RenderPipeline._defaultUboGlobal!.view.set(_vec4Array, UBOGlobal.CAMERA_POS_OFFSET);

        // update ubos
        RenderPipeline._globalBindings.get(UBOGlobal.BLOCK.name)!.uniformBuffer!.update(RenderPipeline._defaultUboGlobal!.view.buffer);
    }

    protected sceneCulling (view: RenderView) {

        const camera = view.camera;
        const scene = camera.scene;

        this._queue.clear();

        for (const model of scene.models) {

            // filter model by view visibility
            if (view.visibility > 0 && model.viewID !== view.visibility || !model.enabled) {
                continue;
            }

            model._updateTransform();

            // frustum culling
            if (model.worldBounds && !intersect.aabb_frustum(model.worldBounds, camera.frustum)) {
                // console.log('model is not in view frustum.');
                continue;
            }

            model.updateUBOs();

            // add model pass to render queue
            this._queue.add(model, camera);
        }

        this._queue.sort();
    }
}
