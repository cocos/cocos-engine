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
    GFXTextureUsageBit } from '../gfx/define';
import { GFXDevice, GFXFeature } from '../gfx/device';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { GFXInputAssembler, IGFXAttribute } from '../gfx/input-assembler';
import { GFXRenderPass } from '../gfx/render-pass';
import { GFXTexture } from '../gfx/texture';
import { GFXTextureView } from '../gfx/texture-view';
import { Mat4, Vec3, Vec4 } from '../math';
import { Camera, Model, Light } from '../renderer';
import { IDefineMap } from '../renderer/core/pass-utils';
import { programLib } from '../renderer/core/program-lib';
import { SKYBOX_FLAG } from '../renderer/scene/camera';
import { Root } from '../root';
import { Layers } from '../scene-graph';
import { js } from '../utils/js';
import { IInternalBindingInst } from './define';
import { IRenderObject, RenderPassStage, UBOGlobal, UBOShadow, UNIFORM_ENVIRONMENT } from './define';
import { FrameBufferDesc, RenderFlowType, RenderPassDesc, RenderTextureDesc } from './pipeline-serialization';
import { RenderFlow } from './render-flow';
import { RenderView } from './render-view';
import { legacyCC } from '../global-exports';
import { RenderLightBatchedQueue } from './render-light-batched-queue'

const v3_1 = new Vec3();

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
    renderTextures?: RenderTextureDesc[];
    framebuffers?: FrameBufferDesc[];
    renderPasses?: RenderPassDesc[];
}

export interface IRenderPipelineDesc {
    root: Root;
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
        return  js.getClassName(this.constructor);
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
     * 启用动态合批。
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

    /**
     * @zh
     * get light batch queues
     */
    public abstract get lightBatchQueue () : RenderLightBatchedQueue;

    protected _root: Root = null!;
    protected _device: GFXDevice = null!;
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
    protected _defaultTexView: GFXTextureView | null = null;
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
    protected _textureViews: Map<string, GFXTextureView> = new Map<string, GFXTextureView>();
    protected _frameBuffers: Map<string, GFXFramebuffer> = new Map<string, GFXFramebuffer>();
    protected _renderPasses: Map<number, GFXRenderPass> = new Map<number, GFXRenderPass>();

    /**
     * 构造函数。
     * @param root Root类实例。
     */
    constructor () {
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
     * 初始化函数，用于不从资源加载RenderPipeline的情况。
     * @param info 渲染管线描述信息。
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
     * 当RenderPipeline资源加载完成后，启用相应的flow
     * @param desc
     */
    public activate (root: Root): boolean {
        this._root = root;
        this._device = root.device;

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
        for (let i = 0; i < view.flows.length; i++) {
            view.flows[i].render(view);
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

        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].resize(width, height);
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
     * 销毁全部渲染流程。
     */
    public destroyFlows () {
        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].destroy();
        }
        this._flows = [];
    }

    /**
     * @zh
     * 得到指定名称的渲染流程。
     * @param name 名称。
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
     * @zh
     * 更新宏定义。
     */
    public updateMacros () {
        programLib.destroyShaderByDefines(this._macros);
        this._macros.CC_USE_HDR = (this._isHDR);
        this._macros.CC_SUPPORT_FLOAT_TEXTURE = this.device.hasFeature(GFXFeature.TEXTURE_FLOAT);
        for (let i = 0; i < this._root.scenes.length; i++) {
            this._root.scenes[i].onGlobalPipelineStateChanged();
        }
    }

    /**
     * @zh
     * 更新指定渲染视图的UBO。
     * @param view 渲染视图。
     */
    public updateUBOs (view: RenderView) {

        const camera = view.camera;
        const scene = camera.scene!;
        const device = this._root.device;

        const mainLight = scene.mainLight;
        const ambient = scene.ambient;
        const fog = scene.fog;
        const fv = this._uboGlobal.view;

        // update UBOGlobal
        fv[UBOGlobal.TIME_OFFSET] = this._root.cumulativeTime;
        fv[UBOGlobal.TIME_OFFSET + 1] = this._root.frameTime;
        fv[UBOGlobal.TIME_OFFSET + 2] = legacyCC.director.getTotalFrames();

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

        Mat4.toArray(fv, camera.matView, UBOGlobal.MAT_VIEW_OFFSET);

        Mat4.toArray(fv, camera.node.worldMatrix, UBOGlobal.MAT_VIEW_INV_OFFSET);
        Mat4.toArray(fv, camera.matProj, UBOGlobal.MAT_PROJ_OFFSET);
        Mat4.toArray(fv, camera.matProjInv, UBOGlobal.MAT_PROJ_INV_OFFSET);
        Mat4.toArray(fv, camera.matViewProj, UBOGlobal.MAT_VIEW_PROJ_OFFSET);
        Mat4.toArray(fv, camera.matViewProjInv, UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET);
        Vec3.toArray(fv, camera.position, UBOGlobal.CAMERA_POS_OFFSET);

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
     * @zh
     * 场景裁剪。
     * @param view 渲染视图。
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
            planarShadows.updateCommandBuffers(camera.frustum, stamp);
        }
    }

    protected _initRenderResource () {

        if (this._usePostProcess) {
            if (this._device.hasFeature(GFXFeature.FORMAT_R11G11B10F) ||
                this._device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT) ||
                this._device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
                this._isHDRSupported = true;
            }

            this._fboCount = 1;

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
            } else if (this._device!.hasFeature(GFXFeature.COLOR_FLOAT) &&
                this._device!.hasFeature(GFXFeature.TEXTURE_FLOAT_LINEAR)) {
                if (this._device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
                    this._colorFmt = GFXFormat.RGBA32F;
                    this._isHDR = true;
                }
            }

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

        // colorFmt = GFXFormat.RGBA16F;

        // this._shadingScale = this._device.devicePixelRatio;
        this._shadingScale = 1.0;
        this._shadingWidth = Math.floor(this._device.width);
        this._shadingHeight = Math.floor(this._device.height);

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
            this._renderTextures.set(rtd.name, this._device.createTexture({
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
            this._textureViews.set(rtd.name, this._device.createTextureView({
                texture: rt,
                type: rtd.viewType,
                format: this._getTextureFormat(rtd.format, rtd.usage),
            }));
        }
        for (let i = 0; i < this.renderPasses.length; i++) {
            const rpd = this.renderPasses[i];
            this._renderPasses.set(rpd.index, this._device.createRenderPass({
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
            const tvs: GFXTextureView[] = [];
            for (let j = 0; j < fbd.colorViews.length; j++) {
                const tv = this._textureViews.get(fbd.colorViews[j]);
                if (tv == null) {
                    console.error('TextureView:' + fbd.colorViews[j] + ' not found!');
                    return false;
                }
                tvs.push(tv);
            }
            const dsv = this._textureViews.get(fbd.depthStencilView) as GFXTextureView | null;
            this._frameBuffers.set(fbd.name, this._device.createFramebuffer({
                renderPass: rp,
                colorViews: tvs,
                depthStencilView: dsv,
            }));
        }

        if (!this.createQuadInputAssembler()) {
            return false;
        }

        if (!this.createUBOs()) {
            return false;
        }

        const mainWindow = this._root.mainWindow;
        let windowPass: GFXRenderPass | null = null;

        if (mainWindow) {
            windowPass = mainWindow.renderPass;
        }

        if (!windowPass) {
            console.error('RenderPass of main window is null.');
            return false;
        }

        this.addRenderPass(RenderPassStage.DEFAULT, windowPass);

        // update global defines when all states initialized.
        this.updateMacros();

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

        const rtIter = this._renderTextures.values();
        let rtRes = rtIter.next();
        while (!rtRes.done) {
            rtRes.value.destroy();
            rtRes = rtIter.next();
        }

        const tvIter = this._textureViews.values();
        let tvRes = tvIter.next();
        while (!tvRes.done) {
            tvRes.value.destroy();
            tvRes = tvIter.next();
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
     * @zh
     * 重置帧缓冲大小。
     * @param width 屏幕宽度。
     * @param height 屏幕高度。
     */
    protected resizeFBOs (width: number, height: number) {

        this._shadingWidth = width;
        this._shadingHeight = height;

        for (let i = 0; i < this.renderTextures.length; i++) {
            const rt = this.renderTextures[i];
            this._renderTextures.get(rt.name)!.resize(width, height);
            this._textureViews.get(rt.name)!.destroy();
            this._textureViews.get(rt.name)!.initialize({
                texture: this._renderTextures.get(rt.name)!,
                type: rt.viewType,
                format: this._getTextureFormat(rt.format, rt.usage),
            });
        }

        for (let i = 0; i < this.framebuffers.length; i++) {
            const fb = this.framebuffers[i];
            this._frameBuffers.get(fb.name)!.destroy();
            this._frameBuffers.get(fb.name)!.initialize({
                renderPass: this._renderPasses.get(fb.renderPass)!,
                colorViews: fb.colorViews.map((value) => {
                    return this._textureViews.get(value)!;
                }, this),
                depthStencilView: this._textureViews.get(fb.depthStencilView)!,
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
     * 添加可见对象。
     * @param model 模型。
     * @param camera 相机。
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
     * 激活一个RenderFlow，将其添加到可执行的RenderFlow数组中
     * @param flow 运行时会执行的RenderFlow
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
