/**
 * @category pipeline
 */

import { intersect } from '../3d/geom-utils';
import { ccclass, property } from '../core/data/class-decorator';
import { Root } from '../core/root';
import { Mat4, Vec3, Vec4 } from '../core/math';
import { GFXBuffer } from '../gfx/buffer';
import {
    GFXBindingType,
    GFXBufferUsageBit,
    GFXFormat,
    GFXFormatInfos,
    GFXMemoryUsageBit,
    GFXTextureUsageBit } from '../gfx/define';
import { GFXDevice, GFXFeature } from '../gfx/device';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { GFXInputAssembler, IGFXAttribute } from '../gfx/input-assembler';
import { GFXRenderPass } from '../gfx/render-pass';
import { GFXTexture } from '../gfx/texture';
import { GFXTextureView } from '../gfx/texture-view';
import { Camera, Model } from '../renderer';
import { IDefineMap } from '../renderer/core/pass';
import { programLib } from '../renderer/core/program-lib';
import { IRenderObject, UBOGlobal, UBOShadow, UNIFORM_ENVIRONMENT } from './define';
import { IInternalBindingInst } from './define';
import { FrameBufferDesc, RenderPassDesc, RenderTextureDesc } from './pipeline-serialization';
import { IRenderFlowInfo, RenderFlow } from './render-flow';
import { RenderView } from './render-view';

const _vec4Array = new Float32Array(4);
const _outMat = new Mat4();
const _v3tmp = new Vec3();
const _v4Zero = new Vec4(0.0, 0.0, 0.0, 0.0);

/**
 * @zh
 * 渲染流程描述信息。
 */
export interface IRenderPipelineInfo {
    enablePostProcess?: boolean;
    enableHDR?: boolean;
    enableMSAA?: boolean;
    enableSMAA?: boolean;
    enableIBL?: boolean;
}

/**
 * @zh
 * 渲染流程。
 */
@ccclass('RenderPipeline')
export abstract class RenderPipeline {

    /**
     * @zh
     * Root类对象。
     */
    public get root (): Root {
        return this._root;
    }

    /**
     * @zh
     * GFX设备。
     */
    public get device (): GFXDevice {
        return this._device;
    }

    /**
     * @zh
     * 名称。
     */
    public get name (): string {
        return this._name;
    }

    /**
     * @zh
     * 渲染对象数组。
     */
    public get renderObjects (): IRenderObject[] {
        return this._renderObjects;
    }

    /**
     * @zh
     * 渲染流程数组。
     */
    public get flows (): RenderFlow[] {
        return this._flows;
    }

    public get activeFlows (): RenderFlow[] {
        return this._activeFlows;
    }

    /**
     * @zh
     * 启用后期处理。
     */
    public get usePostProcess (): boolean {
        return this._usePostProcess;
    }

    /**
     * @zh
     * 是否支持HDR。
     */
    public get isHDRSupported (): boolean {
        return this._isHDRSupported;
    }

    /**
     * @zh
     * 是否为HDR管线。
     */
    public get isHDR (): boolean {
        return this._isHDR;
    }

    /**
     * @zh
     * 着色尺寸缩放。
     */
    public get shadingScale (): number {
        return this._shadingScale;
    }

    /**
     * @zh
     * 灯光距离缩放系数（以米为单位）。
     */
    public set lightMeterScale (scale: number) {
        this._lightMeterScale = scale;
    }

    public get lightMeterScale (): number {
        return this._lightMeterScale;
    }

    /**
     * @zh
     * 启用MSAA。
     */
    public get useMSAA (): boolean {
        return this._useMSAA;
    }

    /**
     * @zh
     * 启用SMAA。
     */
    public get useSMAA (): boolean {
        return this._useSMAA;
    }

    /**
     * @zh
     * 四边形输入汇集器。
     */
    public get quadIA (): GFXInputAssembler {
        return this._quadIA!;
    }

    /**
     * @zh
     * 默认的全局绑定表。
     */
    public get globalBindings (): Map<string, IInternalBindingInst> {
        return this._globalBindings;
    }

    /**
     * @zh
     * 默认纹理。
     */
    public get defaultTexture (): GFXTexture {
        return this._defaultTex!;
    }

    /**
     * @zh
     * 浮点精度缩放。
     */
    public get fpScale (): number {
        return this._fpScale;
    }

    /**
     * @zh
     * 浮点精度缩放的倒数。
     */
    public get fpScaleInv (): number {
        return this._fpScaleInv;
    }

    /**
     * @zh
     * 管线宏定义。
     */
    public get macros (): IDefineMap {
        return this._macros;
    }

    /**
     * @zh
     * 默认的全局UBO。
     */
    public get defaultGlobalUBOData (): Float32Array {
        return this._uboGlobal!.view;
    }

    get currShading () {
        return this._curIdx;
    }

    get prevShading () {
        return this._prevIdx;
    }

    /**
     * @zh
     * Root类对象。
     */
    protected _root: Root;

    /**
     * @zh
     * GFX设备。
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * 名称。
     */
    protected _name: string = 'BasePipeline';

    /**
     * @zh
     * 渲染对象数组。
     */
    protected _renderObjects: IRenderObject[] = [];

    /**
     * @zh
     * 渲染流程数组。
     */
    @property({
        type: [RenderFlow],
    })
    protected _flows: RenderFlow[] = [];

    protected _activeFlows: RenderFlow[] = [];

    /**
     * @zh
     * 是否支持 HDR。
     */
    protected _isHDRSupported: boolean = false;

    /**
     * @zh
     * 是否为 HDR 管线。
     */
    protected _isHDR: boolean = false;

    /**
     * @zh
     * 灯光距离缩放系数（以米为单位）。
     */
    protected _lightMeterScale: number = 10000.0;

    /**
     * @zh
     * 帧缓冲数量。
     */
    protected _fboCount: number = 0;

    /**
     * @zh
     * 颜色格式。
     */
    protected _colorFmt: GFXFormat = GFXFormat.UNKNOWN;

    /**
     * @zh
     * 深度模板格式。
     */
    protected _depthStencilFmt: GFXFormat = GFXFormat.UNKNOWN;

    /**
     * @zh
     * 着色尺寸宽度。
     */
    protected _shadingWidth: number = 0.0;

    /**
     * @zh
     * 着色尺寸高度。
     */
    protected _shadingHeight: number = 0.0;

    /**
     * @zh
     * 着色尺寸缩放。
     */
    protected _shadingScale: number = 1.0;

    /**
     * @zh
     * 当前帧缓冲索引。
     */
    protected _curIdx: string = 'shading';

    /**
     * @zh
     * 上一帧缓冲索引。
     */
    protected _prevIdx: string = 'shading1';

    /**
     * @zh
     * 启用后期处理。
     */
    protected _usePostProcess: boolean = false;

    /**
     * @zh
     * 启用MSAA。
     */
    protected _useMSAA: boolean = false;

    /**
     * @zh
     * 启用SMAA。
     */
    protected _useSMAA: boolean = false;

    /**
     * @zh
     * 四边形顶点缓冲。
     */
    protected _quadVB: GFXBuffer | null = null;

    /**
     * @zh
     * 四边形索引缓冲。
     */
    protected _quadIB: GFXBuffer | null = null;

    /**
     * @zh
     * 四边形输入汇集器。
     */
    protected _quadIA: GFXInputAssembler | null = null;

    /**
     * @zh
     * 默认的全局UBO。
     */
    protected _uboGlobal: UBOGlobal = new UBOGlobal();

    /**
     * @zh
     * 默认的全局绑定表。
     */
    protected _globalBindings: Map<string, IInternalBindingInst> = new Map<string, IInternalBindingInst>();

    /**
     * @zh
     * 默认纹理。
     */
    protected _defaultTex: GFXTexture | null = null;

    /**
     * @zh
     * 默认纹理视图。
     */
    protected _defaultTexView: GFXTextureView | null = null;

    /**
     * @zh
     * 浮点精度缩放。
     */
    protected _fpScale: number = 1.0 / 1024.0;

    /**
     * @zh
     * 浮点精度缩放的倒数。
     */
    protected _fpScaleInv: number = 1024.0;

    /**
     * @zh
     * 管线宏定义。
     */
    protected _macros: IDefineMap = {};

    @property({
        type: [RenderTextureDesc],
    })
    protected renderTextures: RenderTextureDesc[] = [];
    @property({
        type: [FrameBufferDesc],
    })
    protected framebuffers: FrameBufferDesc[] = [];
    @property({
        type: [RenderPassDesc],
    })
    protected renderPasses: RenderPassDesc[] = [];
    protected _renderTextures: Map<string, GFXTexture> = new Map<string, GFXTexture>();
    protected _textureViews: Map<string, GFXTextureView> = new Map<string, GFXTextureView>();
    protected _frameBuffers: Map<string, GFXFramebuffer> = new Map<string, GFXFramebuffer>();
    protected _renderPasses: Map<number, GFXRenderPass> = new Map<number, GFXRenderPass>();

    /**
     * 构造函数。
     * @param root Root类实例。
     */
    constructor () {
        this._root = cc.director.root;
        this._device = this._root.device;
    }

    public getTextureView (name: string) {
        return this._textureViews.get(name);
    }

    public getRenderTexture (name: string) {
        return this._renderTextures.get(name);
    }

    public getFrameBuffer (name: string) {
        return this._frameBuffers.get(name);
    }

    /**
     * @zh
     * 初始化函数。
     * @param info 渲染管线描述信息。
     */
    public initialize () {
    }

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy ();

    /**
     * @zh
     * 渲染函数。
     * @param view 渲染视图。
     */
    public render (view: RenderView) {

        view.camera.update();

        this.sceneCulling(view);

        this.updateUBOs(view);

        for (const flow of view.flows) {
            flow.render(view);
        }
    }

    /**
     * @zh
     * 重构函数。
     */
    public rebuild () {
        this.updateMacros();
    }

    /**
     * @zh
     * 重置大小。
     * @param width 屏幕宽度。
     * @param height 屏幕高度。
     */
    public resize (width: number, height: number) {
        const w = Math.floor(width * this._shadingScale);
        const h = Math.floor(height * this._shadingScale);
        if (w > this._shadingWidth ||
            h > this._shadingHeight) {
            // this._shadingScale = Math.min(this._shadingWidth / width, this._shadingHeight / height);
            // console.info('Resizing shading scale: ' + this._shadingScale);

            this.resizeFBOs(w, h);
        }

        for (const flow of this._flows) {
            flow.resize(width, height);
        }
    }

    /**
     * @zh
     * 交换帧缓冲。
     */
    public swapFBOs () {
        const temp = this._curIdx;
        this._curIdx = this._prevIdx;
        this._prevIdx = temp;
    }

    /**
     * @zh
     * 添加渲染过程。
     * @param stage 渲染阶段。
     * @param renderPass 渲染过程。
     */
    public addRenderPass (stage: number, renderPass: GFXRenderPass) {
        if (renderPass) {
            this._renderPasses.set(stage, renderPass);
        }
    }

    /**
     * @zh
     * 得到指定阶段的渲染过程。
     * @param stage 渲染阶段。
     */
    public getRenderPass (stage: number): GFXRenderPass | null {
        const renderPass = this._renderPasses.get(stage);
        if (renderPass) {
            return renderPass;
        } else {
            return null;
        }
    }

    /**
     * @zh
     * 移除指定阶段的渲染过程。
     * @param stage 渲染阶段。
     */
    public removeRenderPass (stage: number) {
        this._renderPasses.delete(stage);
    }

    /**
     * @zh
     * 清空渲染过程。
     */
    public clearRenderPasses () {
        this._renderPasses.clear();
    }

    /**
     * @zh
     * 创建渲染流程。
     */
    public createFlow<T extends RenderFlow> (
        clazz: new () => T,
        info: IRenderFlowInfo): RenderFlow | null {
        const flow: RenderFlow = new clazz();
        flow.setPipeline(this);
        if (flow.initialize(info)) {
            this.activateFlow(flow);
            return flow;
        } else {
            return null;
        }
    }

    /**
     * 激活一个RenderFlow，将其添加到可执行的RenderFlow数组中
     * @param flow 运行时会执行的RenderFlow
     */
    public activateFlow (flow: RenderFlow) {
        flow.setPipeline(this);
        flow.activate();
        this._activeFlows.push(flow);
        this._activeFlows.sort((a: RenderFlow, b: RenderFlow) => {
            return a.priority - b.priority;
        });
    }

    /**
     * @zh
     * 销毁全部渲染流程。
     */
    public destroyFlows () {
        for (const flow of this._flows) {
            flow.destroy();
        }
        this._flows = [];
    }

    /**
     * @zh
     * 得到指定名称的渲染流程。
     * @param name 名称。
     */
    public getFlow (name: string): RenderFlow | null {
        for (const flow of this._flows) {
            if (flow.name === name) {
                return flow;
            }
        }

        return null;
    }

    /**
     * @zh
     * 更新宏定义。
     */
    public updateMacros () {
        programLib.destroyShaderByDefines(this._macros);
        this._macros.CC_USE_HDR = (this._isHDR);
        for (const scene of this._root.scenes) {
            scene.onPipelineChange();
        }
    }

    /**
     * @zh
     * 内部初始化函数。
     * @param info 渲染流程描述信息。
     */
    protected _initialize (): boolean {

        const info: IRenderPipelineInfo = {};
        if (info.enablePostProcess !== undefined) {
            this._usePostProcess = info.enablePostProcess;
        } else {
            // We disable post process now, post process will be enabled in furture.
            this._usePostProcess = false;
        }

        if (this._usePostProcess) {
            if (this._device.hasFeature(GFXFeature.FORMAT_R11G11B10F) ||
                this._device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT) ||
                this._device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
                this._isHDRSupported = true;
            }

            // this._isHDRSupported = false;
            this._fboCount = 1;

            this._isHDR = (info.enableHDR !== undefined ? info.enableHDR : true);

            // Config Anti-Aliasing
            this._useSMAA = info.enableSMAA !== undefined ? info.enableSMAA : false;
            this._useMSAA = info.enableMSAA !== undefined ? info.enableMSAA : false;
            if (this._useMSAA) {
                this._useMSAA = this.device.hasFeature(GFXFeature.MSAA);
            }
        }

        if (this._isHDR && this._isHDRSupported) {
            // Try to use HDR format
            if (this._device.hasFeature(GFXFeature.COLOR_HALF_FLOAT) &&
                this._device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT_LINEAR)) {
                if (this._device.hasFeature(GFXFeature.FORMAT_R11G11B10F)) {
                    this._colorFmt = GFXFormat.R11G11B10F;
                    this._isHDR = true;
                } else if (this._device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT)) {
                    this._colorFmt = GFXFormat.RGBA16F;
                    this._isHDR = true;
                }
            } else if (this._device.hasFeature(GFXFeature.COLOR_FLOAT) &&
                this._device.hasFeature(GFXFeature.TEXTURE_FLOAT_LINEAR)) {
                if (this._device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
                    this._colorFmt = GFXFormat.RGBA32F;
                    this._isHDR = true;
                }
            }

            this._isHDR = false;
        }

        if (!this._isHDR) {
            this._colorFmt = GFXFormat.RGBA8;
        }

        if (this._device.depthBits === 24) {
            if (this._device.stencilBits === 8) {
               this._depthStencilFmt = GFXFormat.D24S8;
            } else {
               this._depthStencilFmt = GFXFormat.D24;
            }
        } else {
            this._depthStencilFmt = GFXFormat.D16;
        }

        this.updateMacros();

        // colorFmt = GFXFormat.RGBA16F;

        // this._shadingScale = this._device.devicePixelRatio;
        this._shadingScale = 1.0;
        this._shadingWidth = Math.floor(this._device.nativeWidth);
        this._shadingHeight = Math.floor(this._device.nativeHeight);

        console.info('USE_POST_PROCESS: ' + this._usePostProcess);
        if (this._usePostProcess) {
            console.info('USE_MSAA: ' + this._useMSAA);
            console.info('USE_SMAA: ' + this._useSMAA);
            console.info('USE_HDR: ' + this._isHDR);
        }
        console.info('SHADING_SIZE: ' + this._shadingWidth + ' x ' + this._shadingHeight);
        console.info('SHADING_SCALE: ' + this._shadingScale.toFixed(4));
        console.info('SHADING_COLOR_FORMAT: ' + GFXFormatInfos[this._colorFmt].name);
        console.info('SHADING_DEPTH_FORMAT: ' + GFXFormatInfos[this._depthStencilFmt].name);

        for (const rtd of this.renderTextures) {
            this._renderTextures.set(rtd.name, this._device.createTexture({
                type: rtd.type,
                usage: rtd.usage,
                format: this._getTextureFormat(rtd.format, rtd.usage),
                width: rtd.width === -1 ? this._shadingWidth : rtd.width,
                height: rtd.height === -1 ? this._shadingHeight : rtd.height,
            }));
            this._textureViews.set(rtd.name, this._device.createTextureView({
                texture: this._renderTextures.get(rtd.name)!,
                type: rtd.viewType,
                format: this._getTextureFormat(rtd.format, rtd.usage),
            }));
        }

        for (const rpd of this.renderPasses) {
            this._renderPasses.set(rpd.index, this._device.createRenderPass({
                colorAttachments: rpd.colorAttachments,
                depthStencilAttachment: rpd.depthStencilAttachment,
            }));
        }


        for (const fbd of this.framebuffers) {
            this._frameBuffers.set(fbd.name, this._device.createFramebuffer({
                renderPass: this._renderPasses.get(fbd.renderPass)!,
                colorViews: fbd.colorViews.map((value) => {
                    return this._textureViews.get(value)!;
                }, this),
                depthStencilView: this._textureViews.get(fbd.depthStencilView)!,
            }));
        }

        if (!this.createQuadInputAssembler()) {
            return false;
        }

        if (!this.createUBOs()) {
            return false;
        }

        return true;
    }

    /**
     * @zh
     * 内部销毁函数。
     */
    protected _destroy () {

        this.destroyFlows();
        this.clearRenderPasses();
        this.destroyQuadInputAssembler();
        this.destroyUBOs();

        for (const rt of this._renderTextures.values()) {
            rt.destroy();
        }

        for (const tv of this._textureViews.values()) {
            tv.destroy();
        }

        for (const rp of this._renderPasses.values()) {
            rp.destroy();
        }

        for (const fb of this._frameBuffers.values()) {
            fb.destroy();
        }
    }

    /**
     * @zh
     * 重置帧缓冲大小。
     * @param width 屏幕宽度。
     * @param height 屏幕高度。
     */
    protected resizeFBOs (width: number, height: number) {

        this._shadingWidth = width;
        this._shadingHeight = height;

        for (const rtd of this.renderTextures.values()) {
            this._renderTextures.get(rtd.name)!.resize(width, height);
            this._textureViews.get(rtd.name)!.destroy();
            this._textureViews.get(rtd.name)!.initialize({
                texture: this._renderTextures.get(rtd.name)!,
                type: rtd.viewType,
                format: this._getTextureFormat(rtd.format, rtd.usage),
            });
        }

        for (const fbd of this.framebuffers.values()) {
            this._frameBuffers.get(fbd.name)!.destroy();
            this._frameBuffers.get(fbd.name)!.initialize({
                renderPass: this._renderPasses.get(fbd.renderPass)!,
                colorViews: fbd.colorViews.map((value) => {
                    return this._textureViews.get(value)!;
                }, this),
                depthStencilView: this._textureViews.get(fbd.depthStencilView)!,
            });
        }

        console.info('Resizing shading fbos: ' + this._shadingWidth + 'x' + this._shadingHeight);
    }

    /**
     * @zh
     * 创建四边形输入汇集器。
     */
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

        const attributes: IGFXAttribute[] = [
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

    /**
     * @zh
     * 销毁四边形输入汇集器。
     */
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

    /**
     * @zh
     * 创建所有UBO。
     */
    protected createUBOs (): boolean {
        if (!this._globalBindings.get(UBOGlobal.BLOCK.name)) {
            const globalUBO = this._root.device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOGlobal.SIZE,
            });

            this._globalBindings.set(UBOGlobal.BLOCK.name, {
                type: GFXBindingType.UNIFORM_BUFFER,
                blockInfo: UBOGlobal.BLOCK,
                buffer: globalUBO,
            });
        }

        if (!this._globalBindings.get(UBOShadow.BLOCK.name)) {
            const shadowUBO = this._root.device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOShadow.SIZE,
            });

            this._globalBindings.set(UBOShadow.BLOCK.name, {
                type: GFXBindingType.UNIFORM_BUFFER,
                blockInfo: UBOShadow.BLOCK,
                buffer: shadowUBO,
            });
        }

        if (!this._globalBindings.get(UNIFORM_ENVIRONMENT.name)) {
            this._globalBindings.set(UNIFORM_ENVIRONMENT.name, {
                type: GFXBindingType.SAMPLER,
                samplerInfo: UNIFORM_ENVIRONMENT,
            });
        }

        return true;
    }

    /**
     * @zh
     * 销毁全部UBO。
     */
    protected destroyUBOs () {
        const globalUBO = this._globalBindings.get(UBOGlobal.BLOCK.name);
        if (globalUBO) {
            globalUBO.buffer!.destroy();
            this._globalBindings.delete(UBOGlobal.BLOCK.name);
        }
        const shadowUBO = this._globalBindings.get(UBOShadow.BLOCK.name);
        if (shadowUBO) {
            shadowUBO.buffer!.destroy();
            this._globalBindings.delete(UBOShadow.BLOCK.name);
        }
    }

    /**
     * @zh
     * 更新指定渲染视图的UBO。
     * @param view 渲染视图。
     */
    protected updateUBOs (view: RenderView) {

        const camera = view.camera;
        const scene = camera.scene;
        const device = this._root.device;

        const mainLight = scene.mainLight;
        const ambient = scene.ambient;
        const fv = this._uboGlobal.view;

        // update UBOGlobal
        fv[UBOGlobal.TIME_OFFSET] = this._root.cumulativeTime;

        fv[UBOGlobal.SCREEN_SIZE_OFFSET] = device.width;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1] = device.height;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.SCREEN_SIZE_OFFSET];
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1];

        fv[UBOGlobal.SCREEN_SCALE_OFFSET] = camera.width / this._shadingWidth * this._shadingScale;
        fv[UBOGlobal.SCREEN_SCALE_OFFSET + 1] = camera.height / this._shadingHeight * this._shadingScale;
        fv[UBOGlobal.SCREEN_SCALE_OFFSET + 2] = 1.0 / fv[UBOGlobal.SCREEN_SCALE_OFFSET];
        fv[UBOGlobal.SCREEN_SCALE_OFFSET + 3] = 1.0 / fv[UBOGlobal.SCREEN_SCALE_OFFSET + 1];

        fv[UBOGlobal.NATIVE_SIZE_OFFSET] = this._shadingWidth;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1] = this._shadingHeight;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET];
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1];

        Mat4.array(fv, camera.matView, UBOGlobal.MAT_VIEW_OFFSET);

        Mat4.invert(_outMat, camera.matView);
        Mat4.array(fv, _outMat, UBOGlobal.MAT_VIEW_INV_OFFSET);
        Mat4.array(fv, camera.matProj, UBOGlobal.MAT_PROJ_OFFSET);
        Mat4.invert(_outMat, camera.matProj);
        Mat4.array(fv, _outMat, UBOGlobal.MAT_PROJ_INV_OFFSET);
        Mat4.array(fv, camera.matViewProj, UBOGlobal.MAT_VIEW_PROJ_OFFSET);
        Mat4.array(fv, camera.matViewProjInv, UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET);
        Vec3.array(fv, camera.position, UBOGlobal.CAMERA_POS_OFFSET);

        const exposure = camera.exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET] = exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET + 1] = 1.0 / exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
        fv[UBOGlobal.EXPOSURE_OFFSET + 3] = this._fpScale / exposure;

        Vec3.array(fv, mainLight.direction, UBOGlobal.MAIN_LIT_DIR_OFFSET);

        if (mainLight.enabled) {
            Vec3.array(fv, mainLight.color, UBOGlobal.MAIN_LIT_COLOR_OFFSET);
            if (mainLight.useColorTemperature) {
                const colorTempRGB = mainLight.colorTemperatureRGB;
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
            }

            if (this._isHDR) {
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * this._fpScale;
            } else {
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * exposure;
            }
        } else {
            Vec4.array(fv, _v4Zero, UBOGlobal.MAIN_LIT_COLOR_OFFSET);
        }

        _vec4Array.set(ambient.skyColor);
        if (this._isHDR) {
            _vec4Array[3] = ambient.skyIllum * this._fpScale;
        } else {
            _vec4Array[3] = ambient.skyIllum * exposure;
        }
        this._uboGlobal.view.set(_vec4Array, UBOGlobal.AMBIENT_SKY_OFFSET);

        this._uboGlobal.view.set(ambient.groundAlbedo, UBOGlobal.AMBIENT_GROUND_OFFSET);

        // update ubos
        this._globalBindings.get(UBOGlobal.BLOCK.name)!.buffer!.update(this._uboGlobal.view.buffer);
    }

    /**
     * @zh
     * 场景裁剪。
     * @param view 渲染视图。
     */
    protected sceneCulling (view: RenderView) {

        const camera = view.camera;
        const scene = camera.scene;

        this._renderObjects.splice(0);

        const mainLight = scene.mainLight;
        if (mainLight && mainLight.enabled) {
            mainLight.update();
        }

        const planarShadows = scene.planarShadows;
        if (planarShadows.enabled && mainLight.node.hasChanged) {
            planarShadows.updateDirLight(mainLight);
        }

        if (scene.skybox.enabled) {
            this.addVisibleModel(scene.skybox, camera);
        }

        for (const model of scene.models) {

            model._resetUBOUpdateFlag();
            // filter model by view visibility
            if (view.visibility > 0 && model.viewID !== view.visibility || !model.enabled) {
                continue;
            }

            model.updateTransform();

            // frustum culling
            if (model.worldBounds && !intersect.aabb_frustum(model.worldBounds, camera.frustum)) {
                continue;
            }

            model.updateUBOs();
            this.addVisibleModel(model, camera);
        }

        if (planarShadows.enabled) {
            planarShadows.updateCommandBuffers();
        }
    }

    /**
     * @zh
     * 添加可见对象。
     * @param model 模型。
     * @param camera 相机。
     */
    protected addVisibleModel (model: Model, camera: Camera) {
        let depth = 0;
        if (model.node) {
            model.node.getWorldPosition(_v3tmp);
            Vec3.subtract(_v3tmp, _v3tmp, camera.position);
            depth = Vec3.dot(_v3tmp, camera.forward);
        }
        this._renderObjects.push({
            model,
            depth,
        });
    }

    private _getTextureFormat (format: GFXFormat, usage: GFXTextureUsageBit) {
        if (format === GFXFormat.UNKNOWN) {
            if (usage & GFXTextureUsageBit.COLOR_ATTACHMENT) {
                return this._colorFmt;
            } else if (usage & GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT) {
                return this._depthStencilFmt;
            } else {
                return GFXFormat.UNKNOWN;
            }
        } else {
            return format;
        }
    }
}
cc.RenderPipeline = RenderPipeline;
