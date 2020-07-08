/**
 * @category pipeline
 */

import { ccclass, property } from '../data/class-decorator';
import { intersect } from '../geometry';
import { GFXBuffer } from '../gfx/buffer';
import {
    GFXBindingType,
    GFXBufferUsageBit,
    GFXFormat,
    GFXFormatInfos,
    GFXMemoryUsageBit,
    GFXTextureLayout,
    GFXTextureUsageBit,
    GFXLoadOp,
    GFXStoreOp} from '../gfx/define';
import { GFXFeature } from '../gfx/device';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { GFXInputAssembler, IGFXAttribute } from '../gfx/input-assembler';
import { GFXRenderPass, GFXColorAttachment, GFXDepthStencilAttachment } from '../gfx/render-pass';
import { GFXTexture } from '../gfx/texture';
import { Mat4, Vec3, Vec4 } from '../math';
import { Camera, Model, Light } from '../renderer';
import { IDefineMap } from '../renderer/core/pass-utils';
import { SKYBOX_FLAG } from '../renderer/scene/camera';
import { Layers } from '../scene-graph';
import { js } from '../utils/js';
import { IInternalBindingInst } from './define';
import { IRenderObject, RenderPassStage, UBOGlobal, UBOShadow, UNIFORM_ENVIRONMENT } from './define';
import { FrameBufferDesc, RenderFlowType, RenderPassDesc, RenderTextureDesc } from './pipeline-serialization';
import { RenderFlow } from './render-flow';
import { RenderView } from './render-view';
import { legacyCC } from '../global-exports';
import { PipelineGlobal } from './global';

const v3_1 = new Vec3();

/**
 * @en Render pipeline information descriptor
 * @zh 渲染流程描述信息。
 */
export interface IRenderPipelineInfo {
    enablePostProcess?: boolean;
    enableHDR?: boolean;
    enableMSAA?: boolean;
    enableSMAA?: boolean;
    enableIBL?: boolean;
    renderTextures?: RenderTextureDesc[];
    framebuffers?: FrameBufferDesc[];
    renderPasses?: RenderPassDesc[];
}

/**
 * @en Render pipeline describes how we handle the rendering process for all render objects in the related render scene root.
 * It contains some general pipeline configurations, necessary rendering resources and some [[RenderFlow]]s.
 * The rendering process function [[render]] is invoked by [[Root]] for all [[RenderView]]s.
 * @zh 渲染管线对象决定了引擎对相关渲染场景下的所有渲染对象实施的完整渲染流程。
 * 这个类主要包含一些通用的管线配置，必要的渲染资源和一些 [[RenderFlow]]。
 * 渲染流程函数 [[render]] 会由 [[Root]] 发起调用并对所有 [[RenderView]] 执行预设的渲染流程。
 */
@ccclass('RenderPipeline')
export abstract class RenderPipeline {

    /**
     * @en Name of the render pipeline.
     * @zh 名称。
     * @readonly
     */
    public get name (): string {
        return  js.getClassName(this.constructor);
    }

    /**
     * @en The list for render objects, only available after the scene culling of the current frame.
     * @zh 渲染对象数组，仅在当前帧的场景剔除完成后有效。
     * @readonly
     */
    public get renderObjects (): IRenderObject[] {
        return this._renderObjects;
    }

    /**
     * @en The list for render flows.
     * @zh 渲染流程数组。
     * @readonly
     */
    public get flows (): RenderFlow[] {
        return this._flows;
    }

    /**
     * @en Currently activated flows.
     * @zh 当前开启的渲染流程
     * @readonly
     */
    public get activeFlows (): RenderFlow[] {
        return this._activeFlows;
    }

    /**
     * @en Whether enable the post process phase.
     * @zh 是否启用后期处理。
     * @readonly
     */
    public get usePostProcess (): boolean {
        return this._usePostProcess;
    }

    /**
     * @en Whether support HDR in the current environment.
     * @zh 当前运行环境是否支持 HDR。
     * @readonly
     */
    public get isHDRSupported (): boolean {
        return this._isHDRSupported;
    }

    /**
     * @en Whether the current pipeline is HDR enabled pipeline.
     * @zh 当前渲染管线是否为启用了 HDR 的管线。
     * @readonly
     */
    public get isHDR (): boolean {
        return this._isHDR;
    }

    /**
     * @en The scale used for shading program.
     * @zh 着色尺寸缩放。
     * @readonly
     */
    public get shadingScale (): number {
        return this._shadingScale;
    }

    /**
     * @en The scale for the distance of light (in meter).
     * @zh 灯光距离缩放系数（以米为单位）。
     */
    public set lightMeterScale (scale: number) {
        this._lightMeterScale = scale;
    }

    public get lightMeterScale (): number {
        return this._lightMeterScale;
    }

    /**
     * @en Whether activate MSAA anti aliasing.
     * @zh 是否启用 MSAA 抗锯齿。
     * @readonly
     */
    public get useMSAA (): boolean {
        return this._useMSAA;
    }

    /**
     * @en Whether activate SMAA anti aliasing.
     * @zh 启用 SMAA 抗锯齿。
     * @readonly
     */
    public get useSMAA (): boolean {
        return this._useSMAA;
    }

    /**
     * @en The input assembler for quad.
     * @zh 四边形的渲染输入汇集器。
     * @readonly
     */
    public get quadIA (): GFXInputAssembler {
        return this._quadIA!;
    }

    /**
     * @en The default global bindings.
     * @zh 默认的全局绑定表。
     * @readonly
     */
    public get globalBindings (): Map<string, IInternalBindingInst> {
        return this._globalBindings;
    }

    /**
     * @en The default texture.
     * @zh 默认纹理。
     * @readonly
     */
    public get defaultTexture (): GFXTexture {
        return this._defaultTex!;
    }

    /**
     * @en The scale for float precision.
     * @zh 浮点精度缩放。
     * @readonly
     */
    public get fpScale (): number {
        return this._fpScale;
    }

    /**
     * @en The inverse scale of float precision.
     * @zh 浮点精度缩放的倒数。
     * @readonly
     */
    public get fpScaleInv (): number {
        return this._fpScaleInv;
    }

    /**
     * @en The macros for this pipeline.
     * @zh 管线宏定义。
     * @readonly
     */
    public get macros (): IDefineMap {
        return this._macros;
    }

    /**
     * @en The default global uniform buffer object data
     * @zh 默认的全局 UBO 数据。
     * @readonly
     */
    public get defaultGlobalUBOData (): Float32Array {
        return this._uboGlobal!.view;
    }

    /**
     * @en The current frame buffer id for shading
     * @zh 当前帧缓冲 id
     * @readonly
     */
    get currShading () {
        return this._curIdx;
    }

    /**
     * @en The previous frame buffer id for shading
     * @zh 前一个帧缓冲 id
     * @readonly
     */
    get prevShading () {
        return this._prevIdx;
    }

    /**
     * @en Whether use dynamic batching in this pipeline
     * @zh 是否启用动态合批。
     * @readonly
     */
    public get useDynamicBatching (): boolean {
        return this._useDynamicBatching;
    }

    /**
     * @zh
     * 获取参与渲染的灯光。
     */
    public abstract get validLights () : Light[];

    /**
     * @zh
     * 获取灯光索引偏移量数组。
     */
    public abstract get lightIndexOffsets () : number[];

    /**
     * @zh
     * 获取灯光索引数组。
     */
    public abstract get lightIndices () : number[];

    /**
     * @zh
     * 灯光GFXbuffer数组。
     */
    public abstract get lightBuffers () : GFXBuffer[];

    protected _renderObjects: IRenderObject[] = [];

    @property({
        type: [RenderFlow],
        visible: true,
    })
    protected _flows: RenderFlow[] = [];

    protected _activeFlows: RenderFlow[] = [];

    protected _isHDRSupported: boolean = false;
    protected _isHDR: boolean = false;
    protected _lightMeterScale: number = 10000.0;
    protected _fboCount: number = 0;
    protected _colorFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _depthStencilFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _shadingWidth: number = 0.0;
    protected _shadingHeight: number = 0.0;
    protected _shadingScale: number = 1.0;
    protected _curIdx: string = 'shading';
    protected _prevIdx: string = 'shading1';
    protected _usePostProcess: boolean = false;
    protected _useMSAA: boolean = false;
    protected _useSMAA: boolean = false;
    protected _quadVB: GFXBuffer | null = null;
    protected _quadIB: GFXBuffer | null = null;
    protected _quadIA: GFXInputAssembler | null = null;
    protected _uboGlobal: UBOGlobal = new UBOGlobal();
    protected _globalBindings: Map<string, IInternalBindingInst> = new Map<string, IInternalBindingInst>();
    protected _defaultTex: GFXTexture | null = null;
    protected _fpScale: number = 1.0 / 1024.0;
    protected _fpScaleInv: number = 1024.0;
    protected _macros: IDefineMap = {};
    protected _useDynamicBatching = false;

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
    protected _textures: Map<string, GFXTexture> = new Map<string, GFXTexture>();
    protected _frameBuffers: Map<string, GFXFramebuffer> = new Map<string, GFXFramebuffer>();
    protected _renderPasses: Map<number, GFXRenderPass> = new Map<number, GFXRenderPass>();

    /**
     * @en Fetch the [[Texture]] referred by the name in the current pipeline
     * @zh 获取当前管线中名字对应的 [[Texture]] 对象
     * @param name 名字
     */
    public getTexture (name: string) {
        return this._textures.get(name);
    }

    /**
     * @en Get the [[RenderTexture]] referred by the name in the current pipeline
     * @zh 获取当前管线中名字对应的 [[RenderTexture]] 对象
     * @param name 名字
     */
    public getRenderTexture (name: string) {
        return this._renderTextures.get(name);
    }

    /**
     * @en Get the [[FrameBuffer]] referred by the name in the current pipeline
     * @zh 获取当前管线中名字对应的 [[FrameBuffer]] 对象
     * @param name 名字
     */
    public getFrameBuffer (name: string) {
        return this._frameBuffers.get(name);
    }

    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render pipeline information
     */
    public initialize (info: IRenderPipelineInfo) {

        this._usePostProcess = (info.enablePostProcess !== undefined ? info.enablePostProcess : false);
        this._isHDR = (info.enableHDR !== undefined ? info.enableHDR : false);

        // Config Anti-Aliasing
        this._useSMAA = info.enableSMAA !== undefined ? info.enableSMAA : false;
        this._useMSAA = info.enableMSAA !== undefined ? info.enableMSAA : false;

        if (info.renderTextures) {
            this.renderTextures = info.renderTextures;
        }
        if (info.framebuffers) {
            this.framebuffers = info.framebuffers;
        }
        if (info.renderPasses) {
            this.renderPasses = info.renderPasses;
        }
    }

    /**
     * @en Activate the render pipeline after loaded, it mainly activate the flows
     * @zh 当渲染管线资源加载完成后，启用管线，主要是启用管线内的 flow
     */
    public activate (): boolean {
        if (!this._initRenderResource()) {
            console.error('RenderPipeline:' + this.name + ' startup failed!');
            return false;
        }

        for (let i = 0; i < this._flows.length; i++) {
            const flow = this._flows[i];
            if (flow.type === RenderFlowType.SCENE) {
                flow.activate(this);
                this.activateFlow(flow);
            }
        }
        return true;
    }

    /**
     * @en Destroy the pipeline.
     * @zh 销毁函数。
     */
    public abstract destroy ();

    /**
     * @en Render function, it basically run the render process of all flows in sequence for the given view.
     * @zh 渲染函数，对指定的渲染视图按顺序执行所有渲染流程。
     * @param view Render view。
     */
    public render (view: RenderView) {
        for (let i = 0; i < view.flows.length; i++) {
            view.flows[i].render(view);
        }
    }

    /**
     * @en Reset the size of the render target
     * @zh 重置渲染目标的尺寸。
     * @param width The screen width
     * @param height The screen height
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

        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].resize(width, height);
        }
    }

    /**
     * @en Swap the frame buffer.
     * @zh 交换帧缓冲。
     */
    public swapFBOs () {
        const temp = this._curIdx;
        this._curIdx = this._prevIdx;
        this._prevIdx = temp;
    }

    /**
     * @en Add a render pass.
     * @zh 添加渲染过程。
     * @param stage The render stage id
     * @param renderPass The render pass setting for the stage
     */
    public addRenderPass (stage: number, renderPass: GFXRenderPass) {
        if (renderPass) {
            this._renderPasses.set(stage, renderPass);
        }
    }

    /**
     * @en Get the render pass for the given stage
     * @zh 获取指定阶段的渲染过程。
     * @param stage The render stage id
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
     * @en Remove the render pass for a given stage id
     * @zh 移除指定阶段的渲染过程。
     * @param stage The render stage id
     */
    public removeRenderPass (stage: number) {
        this._renderPasses.delete(stage);
    }

    /**
     * @en Clear all render passes
     * @zh 清空渲染过程。
     */
    public clearRenderPasses () {
        this._renderPasses.clear();
    }

    /**
     * @en Destroy all render flows
     * @zh 销毁全部渲染流程。
     */
    public destroyFlows () {
        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].destroy();
        }
        this._flows = [];
    }

    /**
     * @en Get the flow with the given name
     * @zh 获取指定名称的渲染流程。
     * @param name The name of the flow
     */
    public getFlow (name: string): RenderFlow | null {
        for (let i = 0; i < this._flows.length; i++) {
            if (this._flows[i].name === name) {
                return this._flows[i];
            }
        }

        return null;
    }

    /**
     * @en Update all UBOs for the given render view
     * @zh 为指定的渲染视图更新所有 UBO。
     * @param view The render view
     */
    public updateUBOs (view: RenderView) {

        const camera = view.camera;
        const scene = camera.scene!;

        const mainLight = scene.mainLight;
        const ambient = scene.ambient;
        const fog = scene.fog;
        const fv = this._uboGlobal.view;

        // update UBOGlobal
        fv[UBOGlobal.TIME_OFFSET] = PipelineGlobal.root.cumulativeTime;
        fv[UBOGlobal.TIME_OFFSET + 1] = PipelineGlobal.root.frameTime;
        fv[UBOGlobal.TIME_OFFSET + 2] = legacyCC.director.getTotalFrames();

        fv[UBOGlobal.SCREEN_SIZE_OFFSET] = PipelineGlobal.device.width;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1] = PipelineGlobal.device.height;
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

        Mat4.toArray(fv, camera.matView, UBOGlobal.MAT_VIEW_OFFSET);

        Mat4.toArray(fv, camera.node.worldMatrix, UBOGlobal.MAT_VIEW_INV_OFFSET);
        Mat4.toArray(fv, camera.matProj, UBOGlobal.MAT_PROJ_OFFSET);
        Mat4.toArray(fv, camera.matProjInv, UBOGlobal.MAT_PROJ_INV_OFFSET);
        Mat4.toArray(fv, camera.matViewProj, UBOGlobal.MAT_VIEW_PROJ_OFFSET);
        Mat4.toArray(fv, camera.matViewProjInv, UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET);
        Vec3.toArray(fv, camera.position, UBOGlobal.CAMERA_POS_OFFSET);
        fv[UBOGlobal.CAMERA_POS_OFFSET + 3] = PipelineGlobal.device.screenSpaceSignY;

        const exposure = camera.exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET] = exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET + 1] = 1.0 / exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
        fv[UBOGlobal.EXPOSURE_OFFSET + 3] = this._fpScale / exposure;

        if (mainLight) {
            Vec3.toArray(fv, mainLight.direction, UBOGlobal.MAIN_LIT_DIR_OFFSET);
            Vec3.toArray(fv, mainLight.color, UBOGlobal.MAIN_LIT_COLOR_OFFSET);
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
            Vec3.toArray(fv, Vec3.UNIT_Z, UBOGlobal.MAIN_LIT_DIR_OFFSET);
            Vec4.toArray(fv, Vec4.ZERO, UBOGlobal.MAIN_LIT_COLOR_OFFSET);
        }

        const skyColor = ambient.skyColor;
        if (this._isHDR) {
            skyColor[3] = ambient.skyIllum * this._fpScale;
        } else {
            skyColor[3] = ambient.skyIllum * exposure;
        }
        this._uboGlobal.view.set(skyColor, UBOGlobal.AMBIENT_SKY_OFFSET);

        this._uboGlobal.view.set(ambient.groundAlbedo, UBOGlobal.AMBIENT_GROUND_OFFSET);

        this._uboGlobal.view.set(fog.fogColor, UBOGlobal.GLOBAL_FOG_COLOR_OFFSET);

        fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
        fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
        fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;

        fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
        fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
        fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;

        // update ubos
        this._globalBindings.get(UBOGlobal.BLOCK.name)!.buffer!.update(this._uboGlobal.view);
    }

    /**
     * @en Do scene culling based on the given render view.
     * @zh 基于指定渲染视图做场景裁剪。
     * @param view The render view
     */
    public sceneCulling (view: RenderView) {

        const camera = view.camera;
        const scene = camera.scene!;

        this._renderObjects.length = 0;

        const mainLight = scene.mainLight;
        const planarShadows = scene.planarShadows;
        if (mainLight) {
            mainLight.update();
            if (planarShadows.enabled && mainLight.node!.hasChangedFlags) {
                planarShadows.updateDirLight(mainLight);
            }
        }

        if (scene.skybox.enabled && (camera.clearFlag & SKYBOX_FLAG)) {
            this.addVisibleModel(scene.skybox, camera);
        }

        const models = scene.models;
        const stamp = legacyCC.director.getTotalFrames();

        for (let i = 0; i < models.length; i++) {
            const model = models[i];

            // filter model by view visibility
            if (model.enabled) {
                const vis = view.visibility & Layers.BitMask.UI_2D;
                if (vis) {
                    if ((model.node && (view.visibility === model.node.layer)) ||
                        view.visibility === model.visFlags) {
                        model.updateTransform(stamp);
                        model.updateUBOs(stamp);
                        this.addVisibleModel(model, camera);
                    }
                } else {
                    if (model.node && ((view.visibility & model.node.layer) === model.node.layer) ||
                        (view.visibility & model.visFlags)) {
                        model.updateTransform(stamp);

                        // frustum culling
                        if (model.worldBounds && !intersect.aabb_frustum(model.worldBounds, camera.frustum)) {
                            continue;
                        }

                        model.updateUBOs(stamp);
                        this.addVisibleModel(model, camera);
                    }
                }
            }
        }

        if (planarShadows.enabled) {
            planarShadows.updateShadowList(camera.frustum, stamp, (camera.visibility & Layers.BitMask.DEFAULT) !== 0);
        }
    }

    protected _initRenderResource () {

        if (this._usePostProcess) {
            if (PipelineGlobal.device.hasFeature(GFXFeature.FORMAT_R11G11B10F) ||
                PipelineGlobal.device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT) ||
                PipelineGlobal.device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
                this._isHDRSupported = true;
            }

            this._fboCount = 1;

            if (this._useMSAA) {
                this._useMSAA = PipelineGlobal.device.hasFeature(GFXFeature.MSAA);
            }
        }

        if (this._isHDR && this._isHDRSupported) {
            // Try to use HDR format
            if (PipelineGlobal.device.hasFeature(GFXFeature.COLOR_HALF_FLOAT) &&
                PipelineGlobal.device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT_LINEAR)) {
                if (PipelineGlobal.device.hasFeature(GFXFeature.FORMAT_R11G11B10F)) {
                    this._colorFmt = GFXFormat.R11G11B10F;
                    this._isHDR = true;
                } else if (PipelineGlobal.device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT)) {
                    this._colorFmt = GFXFormat.RGBA16F;
                    this._isHDR = true;
                }
            } else if (PipelineGlobal.device.hasFeature(GFXFeature.COLOR_FLOAT) &&
                       PipelineGlobal.device.hasFeature(GFXFeature.TEXTURE_FLOAT_LINEAR)) {
                if (PipelineGlobal.device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
                    this._colorFmt = GFXFormat.RGBA32F;
                    this._isHDR = true;
                }
            }

        }

        if (!this._isHDR) {
            this._colorFmt = GFXFormat.RGBA8;
        }

        this._depthStencilFmt = PipelineGlobal.device.depthStencilFormat;
        this._shadingScale = 1.0;
        this._shadingWidth = Math.floor(PipelineGlobal.device.width);
        this._shadingHeight = Math.floor(PipelineGlobal.device.height);

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

        for (let i = 0; i < this.renderTextures.length; i++) {
            const rtd = this.renderTextures[i];
            this._renderTextures.set(rtd.name, PipelineGlobal.device.createTexture({
                type: rtd.type,
                usage: rtd.usage,
                format: this._getTextureFormat(rtd.format, rtd.usage),
                width: rtd.width === -1 ? this._shadingWidth : rtd.width,
                height: rtd.height === -1 ? this._shadingHeight : rtd.height,
            }));
            const rt = this._renderTextures.get(rtd.name);
            if (rt == null) {
                console.error('RenderTexture:' + rtd.name + ' not found!');
                return false;
            }

            this._textures.set(rtd.name, PipelineGlobal.device.createTexture({
                type: rtd.type,
                usage: rtd.usage,
                format: this._getTextureFormat(rtd.format, rtd.usage),
                width: rtd.width,
                height: rtd.height,
                // FIXME: need other args?
            }));
        }
        for (let i = 0; i < this.renderPasses.length; i++) {
            const rpd = this.renderPasses[i];
            this._renderPasses.set(rpd.index, PipelineGlobal.device.createRenderPass({
                colorAttachments: rpd.colorAttachments,
                depthStencilAttachment: rpd.depthStencilAttachment,
            }));
        }

        for (let i = 0; i < this.framebuffers.length; i++) {
            const fbd = this.framebuffers[i];
            const rp = this._renderPasses.get(fbd.renderPass);
            if (rp == null) {
                console.error('RenderPass:' + fbd.renderPass + ' not found!');
                return false;
            }
            const ts: GFXTexture[] = [];
            for (let j = 0; j < fbd.colorTextures.length; j++) {
                const tv = this._textures.get(fbd.colorTextures[j]);
                if (tv == null) {
                    console.error('Texture:' + fbd.colorTextures[j] + ' not found!');
                    return false;
                }
                ts.push(tv);
            }
            const dsv = this._textures.get(fbd.depthStencilTexture) as GFXTexture | null;
            const colorMipmapLevels: number[] = [];
            this._frameBuffers.set(fbd.name, PipelineGlobal.device.createFramebuffer({
                renderPass: rp,
                colorTextures: ts,
                colorMipmapLevels,
                depthStencilTexture: dsv,
                depStencilMipmapLevel: 0,
            }));
        }

        if (!this.createQuadInputAssembler()) {
            return false;
        }

        if (!this.createUBOs()) {
            return false;
        }

        let colorAttachment = new GFXColorAttachment();
        let depthStencilAttachment = new GFXDepthStencilAttachment();
        colorAttachment.format = PipelineGlobal.device.colorFormat;
        depthStencilAttachment.format = PipelineGlobal.device.depthStencilFormat;
        depthStencilAttachment.depthStoreOp = GFXStoreOp.DISCARD;
        depthStencilAttachment.stencilStoreOp = GFXStoreOp.DISCARD;

        const windowPass = PipelineGlobal.device.createRenderPass({
            colorAttachments: [colorAttachment],
            depthStencilAttachment,
        });
        this.addRenderPass(RenderPassStage.DEFAULT, windowPass);

        colorAttachment = new GFXColorAttachment();
        colorAttachment.format = PipelineGlobal.device.colorFormat;
        colorAttachment.loadOp = GFXLoadOp.LOAD;
        colorAttachment.beginLayout = GFXTextureLayout.PRESENT_SRC;

        depthStencilAttachment = new GFXDepthStencilAttachment();
        depthStencilAttachment.format = PipelineGlobal.device.depthStencilFormat;
        depthStencilAttachment.depthStoreOp = GFXStoreOp.DISCARD;
        depthStencilAttachment.stencilStoreOp = GFXStoreOp.DISCARD;

        const uiPass = PipelineGlobal.device.createRenderPass({
            colorAttachments: [colorAttachment],
            depthStencilAttachment,
        });
        this.addRenderPass(RenderPassStage.UI, uiPass);

        // update global defines when all states initialized.
        this._macros.CC_USE_HDR = (this._isHDR);
        this._macros.CC_SUPPORT_FLOAT_TEXTURE =PipelineGlobal.device.hasFeature(GFXFeature.TEXTURE_FLOAT);

        return true;
    }

    /**
     * @en Internal destroy function
     * @zh 内部销毁函数。
     */
    protected _destroy () {

        this.destroyFlows();
        this.clearRenderPasses();
        this.destroyQuadInputAssembler();
        this.destroyUBOs();

        const rtIter = this._renderTextures.values();
        let rtRes = rtIter.next();
        while (!rtRes.done) {
            rtRes.value.destroy();
            rtRes = rtIter.next();
        }

        const textureIter = this._textures.values();
        let textureRes = textureIter.next();
        while (!textureRes.done) {
            textureRes.value.destroy();
            textureRes = textureIter.next();
        }

        const rpIter = this._renderPasses.values();
        let rpRes = rpIter.next();
        while (!rpRes.done) {
            rpRes.value.destroy();
            rpRes = rpIter.next();
        }

        const fbIter = this._frameBuffers.values();
        let fbRes = fbIter.next();
        while (!fbRes.done) {
            fbRes.value.destroy();
            fbRes = fbIter.next();
        }
    }

    /**
     * @en Resize all frame buffers
     * @zh 重置帧缓冲大小。
     * @param width The screen width
     * @param height The screen height
     */
    protected resizeFBOs (width: number, height: number) {

        this._shadingWidth = width;
        this._shadingHeight = height;

        for (let i = 0; i < this.renderTextures.length; i++) {
            const rt = this.renderTextures[i];
            this._renderTextures.get(rt.name)!.resize(width, height);
            this._textures.get(rt.name)!.resize(width, height)
        }

        for (let i = 0; i < this.framebuffers.length; i++) {
            const fb = this.framebuffers[i];
            this._frameBuffers.get(fb.name)!.destroy();
            this._frameBuffers.get(fb.name)!.initialize({
                renderPass: this._renderPasses.get(fb.renderPass)!,
                colorTextures: fb.colorTextures.map((value) => {
                    return this._textures.get(value)!;
                }, this),
                depthStencilTexture: this._textures.get(fb.depthStencilTexture)!,
            });
        }

        console.info('Resizing shading fbos: ' + this._shadingWidth + 'x' + this._shadingHeight);
    }

    /**
     * @en Create input assembler for quad
     * @zh 创建四边形输入汇集器。
     */
    protected createQuadInputAssembler (): boolean {

        // create vertex buffer

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;

        this._quadVB = PipelineGlobal.device.createBuffer({
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
        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        this._quadIB = PipelineGlobal.device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: ibSize,
            stride: ibStride,
        });

        if (!this._quadIB) {
            return false;
        }

        const indices = new Uint16Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;

        this._quadIB.update(indices);

        // create input assembler

        const attributes: IGFXAttribute[] = [
            { name: 'a_position', format: GFXFormat.RG32F },
            { name: 'a_texCoord', format: GFXFormat.RG32F },
        ];

        this._quadIA = PipelineGlobal.device.createInputAssembler({
            attributes,
            vertexBuffers: [this._quadVB],
            indexBuffer: this._quadIB,
        });

        return true;
    }

    /**
     * @en Destroy input assembler for quad
     * @zh 销毁四边形输入汇集器。
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
     * @en Create all UBOs.
     * @zh 创建所有 UBO。
     */
    protected createUBOs (): boolean {
        if (!this._globalBindings.get(UBOGlobal.BLOCK.name)) {
            const globalUBO = PipelineGlobal.device.createBuffer({
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
            const shadowUBO = PipelineGlobal.device.createBuffer({
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
     * @en Destroy all UBOs
     * @zh 销毁全部 UBO。
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
     * @en Add a visible model in the given camera as a render object in the pipeline
     * @zh 向当前管线添加指定摄像机中的可见对象。
     * @param model The visible model
     * @param camera The camera from which the model can be seen
     */
    protected addVisibleModel (model: Model, camera: Camera) {
        let depth = 0;
        if (model.node) {
            Vec3.subtract(v3_1, model.node.worldPosition, camera.position);
            depth = Vec3.dot(v3_1, camera.forward);
        }
        this._renderObjects.push({
            model,
            depth,
        });
    }

    /**
     * @en Activate a render flow.
     * @zh 激活一个 RenderFlow，将其添加到可执行的 RenderFlow 数组中
     * @param flow The render flow
     */
    private activateFlow (flow: RenderFlow) {
        this._activeFlows.push(flow);
        this._activeFlows.sort((a: RenderFlow, b: RenderFlow) => {
            return a.priority - b.priority;
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
legacyCC.RenderPipeline = RenderPipeline;
