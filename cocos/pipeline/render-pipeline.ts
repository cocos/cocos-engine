/**
 * @category pipeline
 */

import { intersect } from '../3d/geom-utils';
import { Root } from '../core/root';
import { Mat4, Vec3, Vec4 } from '../core/value-types';
import { GFXBuffer } from '../gfx/buffer';
import {
    GFXBindingType,
    GFXBufferUsageBit,
    GFXFormat,
    GFXFormatInfos,
    GFXLoadOp,
    GFXMemoryUsageBit,
    GFXStoreOp,
    GFXTextureLayout,
    GFXTextureType,
    GFXTextureUsageBit,
    GFXTextureViewType} from '../gfx/define';
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
     * 深度模板纹理视图。
     */
    public get depthStencilTexView (): GFXTextureView {
        return this._depthStencilTexView!;
    }

    /**
     * @zh
     * 着色纹理视图数组的当前帧缓冲索引。
     */
    public get curShadingTexView (): GFXTextureView {
        return this._shadingTexViews[this._curIdx];
    }

    /**
     * @zh
     * 着色纹理视图数组的上一帧缓冲索引。
     */
    public get prevShadingTexView (): GFXTextureView {
        return this._shadingTexViews[this._prevIdx];
    }

    /**
     * @zh
     * 着色帧缓冲数组的当前帧缓冲索引。
     */
    public get curShadingFBO (): GFXFramebuffer {
        return this._shadingFBOs[this._curIdx];
    }

    /**
     * @zh
     * 着色帧缓冲数组的上一帧缓冲索引。
     */
    public get prevShadingFBO (): GFXFramebuffer {
        return this._shadingFBOs[this._prevIdx];
    }

    /**
     * @zh
     * MSAA着色帧缓冲。
     */
    public get msaaShadingFBO (): GFXFramebuffer {
        return this._msaaShadingFBO!;
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
     * SMAA边缘纹理视图。
     */
    public get smaaEdgeTexView (): GFXTextureView {
        return this._smaaEdgeTexView!;
    }

    /**
     * @zh
     * SMAA边缘帧缓冲。
     */
    public get smaaEdgeFBO (): GFXFramebuffer {
        return this._smaaEdgeFBO!;
    }

    /**
     * @zh
     * SMAA混合纹理视图。
     */
    public get smaaBlendTexView (): GFXTextureView {
        return this._smaaBlendTexView!;
    }

    /**
     * @zh
     * SMAA混合帧缓冲。
     */
    public get smaaBlendFBO (): GFXFramebuffer {
        return this._smaaBlendFBO!;
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
     * 渲染过程数组。
     */
    protected _renderPasses: Map<number, GFXRenderPass> = new Map();

    /**
     * @zh
     * 渲染流程数组。
     */
    protected _flows: RenderFlow[] = [];

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
     * 着色渲染过程。
     */
    protected _shadingPass: GFXRenderPass | null = null;

    /**
     * @zh
     * 帧缓冲数量。
     */
    protected _fboCount: number = 1;

    /**
     * @zh
     * MSAA着色纹理。
     */
    protected _msaaShadingTex: GFXTexture | null = null;

    /**
     * @zh
     * MSAA着色纹理视图。
     */
    protected _msaaShadingTexView: GFXTextureView | null = null;

    /**
     * @zh
     * MSAA深度模板纹理。
     */
    protected _msaaDepthStencilTex: GFXTexture | null = null;

    /**
     * @zh
     * MSAA深度模板纹理视图。
     */
    protected _msaaDepthStencilTexView: GFXTextureView | null = null;

    /**
     * @zh
     * MSAA着色帧缓冲。
     */
    protected _msaaShadingFBO: GFXFramebuffer | null = null;

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
     * 着色纹理数组。
     */
    protected _shadingTextures: GFXTexture[] = [];

    /**
     * @zh
     * 着色纹理视图数组。
     */
    protected _shadingTexViews: GFXTextureView[] = [];

    /**
     * @zh
     * 深度模板纹理。
     */
    protected _depthStencilTex: GFXTexture | null = null;

    /**
     * @zh
     * 深度模板纹理视图。
     */
    protected _depthStencilTexView: GFXTextureView | null = null;

    /**
     * @zh
     * 着色帧缓冲数组。
     */
    protected _shadingFBOs: GFXFramebuffer[] = [];

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
    protected _curIdx: number = 0;

    /**
     * @zh
     * 上一帧缓冲索引。
     */
    protected _prevIdx: number = 1;

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
     * SMAA渲染过程。
     */
    protected _smaaPass: GFXRenderPass | null = null;

    /**
     * @zh
     * SMAA边缘帧缓冲。
     */
    protected _smaaEdgeFBO: GFXFramebuffer | null = null;

    /**
     * @zh
     * SMAA边缘纹理。
     */
    protected _smaaEdgeTex: GFXTexture | null = null;

    /**
     * @zh
     * SMAA边缘纹理视图。
     */
    protected _smaaEdgeTexView: GFXTextureView | null = null;

    /**
     * @zh
     * SMAA混合帧缓冲。
     */
    protected _smaaBlendFBO: GFXFramebuffer | null = null;

    /**
     * @zh
     * SMAA混合纹理。
     */
    protected _smaaBlendTex: GFXTexture | null = null;

    /**
     * @zh
     * SMAA混合纹理视图。
     */
    protected _smaaBlendTexView: GFXTextureView | null = null;

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

    /**
     * 构造函数。
     * @param root Root类实例。
     */
    constructor (root: Root) {
        this._root = root;
        this._device = root.device;
    }

    /**
     * @zh
     * 初始化函数。
     * @param info 渲染管线描述信息。
     */
    public abstract initialize (info: IRenderPipelineInfo): boolean;

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy ();

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
        clazz: new (pipeline: RenderPipeline) => T,
        info: IRenderFlowInfo): RenderFlow | null {
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
    protected _initialize (info: IRenderPipelineInfo): boolean {

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
            this._shadingTextures = new Array<GFXTexture>(this._fboCount);
            this._shadingTexViews = new Array<GFXTextureView>(this._fboCount);
            this._shadingFBOs = new Array<GFXFramebuffer>(this._fboCount);

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

        this._shadingPass = this._device.createRenderPass({
            colorAttachments: [{
                format: this._colorFmt,
                loadOp: GFXLoadOp.CLEAR,
                storeOp: GFXStoreOp.STORE,
                sampleCount: 1,
                beginLayout: GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL,
                endLayout: GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL,
            }],
            depthStencilAttachment: {
                format : this._depthStencilFmt,
                depthLoadOp : GFXLoadOp.CLEAR,
                depthStoreOp : GFXStoreOp.STORE,
                stencilLoadOp : GFXLoadOp.CLEAR,
                stencilStoreOp : GFXStoreOp.STORE,
                sampleCount : 1,
                beginLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
                endLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
            },
        });

        if (this._useMSAA) {
            this._msaaShadingTex  = this._device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format: this._colorFmt,
                width: this._shadingWidth,
                height: this._shadingHeight,
            });
            this._msaaShadingTexView = this._device.createTextureView({
                texture : this._msaaShadingTex,
                type : GFXTextureViewType.TV2D,
                format : this._colorFmt,
            });
            this._msaaDepthStencilTex = this._device.createTexture({
                type : GFXTextureType.TEX2D,
                usage : GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format : this._depthStencilFmt,
                width : this._shadingWidth,
                height : this._shadingHeight,
            });
            this._msaaDepthStencilTexView = this._device.createTextureView({
                texture : this._msaaDepthStencilTex,
                type : GFXTextureViewType.TV2D,
                format : this._depthStencilFmt,
            });
            this._msaaShadingFBO = this._device.createFramebuffer({
                renderPass: this._shadingPass,
                colorViews: [ this._msaaShadingTexView ],
                depthStencilView: this._msaaDepthStencilTexView!,
            });
        }

        this._depthStencilTex = this._device.createTexture({
            type : GFXTextureType.TEX2D,
            usage : GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
            format : this._depthStencilFmt,
            width : this._shadingWidth,
            height : this._shadingHeight,
        });

        this._depthStencilTexView = this._device.createTextureView({
            texture : this._depthStencilTex,
            type : GFXTextureViewType.TV2D,
            format : this._depthStencilFmt,
        });

        for (let i = 0; i < this._fboCount; ++i) {
            this._shadingTextures[i] = this._device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format: this._colorFmt,
                width: this._shadingWidth,
                height: this._shadingHeight,
            });

            this._shadingTexViews[i] = this._device.createTextureView({
                texture : this._shadingTextures[i],
                type : GFXTextureViewType.TV2D,
                format : this._colorFmt,
            });

            this._shadingFBOs[i] = this._device.createFramebuffer({
                renderPass: this._shadingPass,
                colorViews: [ this._shadingTexViews[i] ],
                depthStencilView: this._depthStencilTexView!,
            });
        }

        // create smaa framebuffer
        if (this._useSMAA) {
            const smaaColorFmt = GFXFormat.RGBA8;

            this._smaaPass = this._device.createRenderPass({
                colorAttachments: [{
                    format: smaaColorFmt,
                    loadOp: GFXLoadOp.CLEAR,
                    storeOp: GFXStoreOp.STORE,
                    sampleCount: 1,
                    beginLayout: GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL,
                    endLayout: GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL,
                }],
            });

            this._smaaEdgeTex =  this._device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format: smaaColorFmt,
                width: this._shadingWidth,
                height: this._shadingHeight,
            });

            this._smaaEdgeTexView = this._device.createTextureView({
                texture : this._smaaEdgeTex,
                type : GFXTextureViewType.TV2D,
                format : smaaColorFmt,
            });

            this._smaaEdgeFBO = this._device.createFramebuffer({
                renderPass: this._smaaPass,
                colorViews: [ this._smaaEdgeTexView ],
                depthStencilView: null,
            });

            this._smaaBlendTex =  this._device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format: smaaColorFmt,
                width: this._shadingWidth,
                height: this._shadingHeight,
            });

            this._smaaBlendTexView = this._device.createTextureView({
                texture : this._smaaBlendTex,
                type : GFXTextureViewType.TV2D,
                format : smaaColorFmt,
            });

            this._smaaBlendFBO = this._device.createFramebuffer({
                renderPass: this._smaaPass,
                colorViews: [ this._smaaBlendTexView ],
                depthStencilView: null,
            });
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

        if (this._smaaEdgeTexView) {
            this._smaaEdgeTexView.destroy();
            this._smaaEdgeTexView = null;
        }

        if (this._smaaEdgeTex) {
            this._smaaEdgeTex.destroy();
            this._smaaEdgeTex = null;
        }

        if (this._smaaEdgeFBO) {
            this._smaaEdgeFBO.destroy();
            this._smaaEdgeFBO = null;
        }

        if (this._smaaBlendTexView) {
            this._smaaBlendTexView.destroy();
            this._smaaBlendTexView = null;
        }

        if (this._smaaBlendTex) {
            this._smaaBlendTex.destroy();
            this._smaaBlendTex = null;
        }

        if (this._smaaBlendFBO) {
            this._smaaBlendFBO.destroy();
            this._smaaBlendFBO = null;
        }

        if (this._msaaShadingTexView) {
            this._msaaShadingTexView.destroy();
            this._msaaShadingTexView = null;
        }
        if (this._msaaShadingTex) {
            this._msaaShadingTex.destroy();
            this._msaaShadingTex = null;
        }
        if (this._msaaDepthStencilTexView) {
            this._msaaDepthStencilTexView.destroy();
            this._msaaDepthStencilTexView = null;
        }
        if (this._msaaDepthStencilTex) {
            this._msaaDepthStencilTex.destroy();
            this._msaaDepthStencilTex = null;
        }
        if (this._msaaShadingFBO) {
            this._msaaShadingFBO.destroy();
            this._msaaShadingFBO = null;
        }

        for (let i = 0; i < this._shadingTexViews.length; ++i) {
            if (this._shadingTexViews[i]) {
                this._shadingTexViews[i].destroy();
            }

            if (this._shadingTextures[i]) {
                this._shadingTextures[i].destroy();
            }

            if (this._shadingFBOs[i]) {
                this._shadingFBOs[i].destroy();
            }
        }

        this._shadingTexViews.splice(0);
        this._shadingTextures.splice(0);
        this._shadingFBOs.splice(0);

        if (this._depthStencilTexView) {
            this._depthStencilTexView.destroy();
            this._depthStencilTexView = null;
        }
        if (this._depthStencilTex) {
            this._depthStencilTex.destroy();
            this._depthStencilTex = null;
        }

        if (this._shadingPass) {
            this._shadingPass.destroy();
            this._shadingPass = null;
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

        if (this._depthStencilTex) {
            this._depthStencilTex.resize(width, height);
            this._depthStencilTexView!.destroy();
            this._depthStencilTexView!.initialize({
                texture : this._depthStencilTex,
                type : GFXTextureViewType.TV2D,
                format : this._depthStencilFmt,
            });
        }

        for (let i = 0; i < this._fboCount; ++i) {
            this._shadingTextures[i].resize(width, height);
            this._shadingTexViews[i].destroy();
            this._shadingTexViews[i].initialize({
                texture : this._shadingTextures[i],
                type : GFXTextureViewType.TV2D,
                format : this._colorFmt,
            });

            this._shadingFBOs[i].destroy();
            this._shadingFBOs[i].initialize({
                renderPass: this._shadingPass!,
                colorViews: [ this._shadingTexViews[i] ],
                depthStencilView: this._depthStencilTexView!,
            });
        }

        if (this._useMSAA) {
            this._msaaShadingTex!.resize(width, height);
            this._msaaShadingTexView!.destroy();
            this._msaaShadingTexView!.initialize({
                texture : this._msaaShadingTex!,
                type : GFXTextureViewType.TV2D,
                format : this._colorFmt,
            });
            this._msaaDepthStencilTex!.resize(width, height);
            this._msaaDepthStencilTexView!.destroy();
            this._msaaDepthStencilTexView!.initialize({
                texture : this._msaaDepthStencilTex!,
                type : GFXTextureViewType.TV2D,
                format : this._depthStencilFmt,
            });
            this._msaaShadingFBO!.destroy();
            this._msaaShadingFBO!.initialize({
                renderPass: this._shadingPass!,
                colorViews: [ this._msaaShadingTexView! ],
                depthStencilView: this._msaaDepthStencilTexView!,
            });
        }

        if (this._useSMAA) {
            const smaaColorFmt = this._smaaEdgeTex!.format;
            this._smaaEdgeTex!.resize(width, height);
            this._smaaEdgeTexView!.destroy();
            this._smaaEdgeTexView!.initialize({
                texture : this._smaaEdgeTex!,
                type : GFXTextureViewType.TV2D,
                format : smaaColorFmt,
            });

            this._smaaEdgeFBO!.destroy();
            this._smaaEdgeFBO!.initialize({
                renderPass: this._smaaPass!,
                colorViews: [ this._smaaEdgeTexView! ],
                depthStencilView: null,
            });
            this._smaaBlendTex!.resize(width, height);
            this._smaaBlendTexView!.destroy();
            this._smaaBlendTexView!.initialize({
                texture : this._smaaBlendTex!,
                type : GFXTextureViewType.TV2D,
                format : smaaColorFmt,
            });
            this._smaaBlendFBO!.destroy();
            this._smaaBlendFBO!.initialize({
                renderPass: this._smaaPass!,
                colorViews: [ this._smaaBlendTexView! ],
                depthStencilView: null,
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
}
