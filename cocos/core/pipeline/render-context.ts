import { ccclass, property } from '../data/class-decorator';
import { Root } from '../root';
import { GFXDevice, GFXFeature } from '../gfx/device';
import { IRenderObject, UBOGlobal, IInternalBindingInst, UBOShadow,
    UNIFORM_ENVIRONMENT, UBOForwardLight, RenderPassStage} from './define';
import { GFXBindingType, GFXBufferUsageBit, GFXMemoryUsageBit, GFXFormat, GFXStoreOp,
    GFXFormatInfos, GFXTextureUsageBit, GFXCommandBufferType, GFXClearFlag } from '../gfx/define';
import { GFXBuffer } from '../gfx/buffer';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { RenderTextureConfig, MaterialConfig } from './pipeline-serialization';
import { RenderTexture } from '../assets/render-texture';
import { Material } from '../assets/material';
import { GFXInputAssembler, IGFXAttribute } from '../gfx/input-assembler';
import { GFXColorAttachment, GFXDepthStencilAttachment, GFXRenderPass, GFXLoadOp, GFXTextureLayout } from '../gfx';
import { SKYBOX_FLAG } from '../renderer';
import { director } from '../director';
import { RenderView } from './render-view';
import { Mat4, Vec3, Vec4 } from '../math';

@ccclass('RenderContext')
export class RenderContext {
    @property({
        type: [RenderTextureConfig],
    })
    protected renderTextures: RenderTextureConfig[] = [];
    protected _renderTextures: Map<string, RenderTexture> = new Map<string, RenderTexture>();
    @property({
        type: [MaterialConfig],
    })
    protected materials: MaterialConfig[] = [];
    protected _materials: Map<string, Material> = new Map<string, Material>();
    protected root: Root | null = null;
    public device: GFXDevice | null = null;
    public get isHDR () {
        return this._isHDR;
    }
    public set isHDR (val) {
        if (this._isHDR === val) {
            return
        }

        this._isHDR = val;
        const defaultGlobalUBOData = this.uboGlobal.view;
        defaultGlobalUBOData[UBOGlobal.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
        const globalUBOBuffer = this.globalBindings.get(UBOGlobal.BLOCK.name)!.buffer!;
        globalUBOBuffer.update(defaultGlobalUBOData);
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
     * @en Whether enable the post process phase.
     * @zh 是否启用后期处理。
     * @readonly
     */
    public get usePostProcess (): boolean {
        return this._usePostProcess;
    }
    public set usePostProcess (val) {
        this._usePostProcess = val;
    }
    /**
     * @en Whether activate MSAA anti aliasing.
     * @zh 是否启用 MSAA 抗锯齿。
     * @readonly
     */
    public get useMSAA (): boolean {
        return this._useMSAA;
    }
    public set useMSAA (val) {
        this._useMSAA = val;
    }
    /**
     * @en Whether activate SMAA anti aliasing.
     * @zh 启用 SMAA 抗锯齿。
     * @readonly
     */
    public get useSMAA (): boolean {
        return this._useSMAA;
    }
    public set useSMAA (val) {
        this._useSMAA = val;
    }
    public get shadingScale (): number {
        return this._shadingScale;
    }
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
     * @en The ubo layout for all forward lights
     * @zh 全部前向光源的 UBO 结构描述。
     */
    public uboLight: UBOForwardLight = new UBOForwardLight();
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
     * @en The default global uniform buffer object data
     * @zh 默认的全局 UBO 数据。
     * @readonly
     */
    public get defaultGlobalUBOData (): Float32Array {
        return this.uboGlobal.view;
    }

    public get mainWindow () {
        return this.root!.mainWindow;
    }

    public get cumulativeTime () {
        return this.root!.cumulativeTime;
    }

    public get frameTime () {
        return this.root!.frameTime;
    }
    /**
     * @en The current frame buffer id for shading
     * @zh 当前帧缓冲 id
     * @readonly
     */
    public get currShading () {
        return this._curIdx;
    }
    /**
     * @en The previous frame buffer id for shading
     * @zh 前一个帧缓冲 id
     * @readonly
     */
    public get prevShading () {
        return this._prevIdx;
    }
    /**
     * @en The input assembler for quad.
     * @zh 四边形的渲染输入汇集器。
     * @readonly
     */
    public get quadIA (): GFXInputAssembler {
        return this._quadIA!;
    }
    public get shadingWidth (): number {
        return this._shadingWidth;
    }
    public set shadingWidth (val) {
        this._shadingWidth = val;
    }
    public get shadingHeight (): number {
        return this._shadingHeight;
    }
    public set shadingHeight (val) {
        this._shadingHeight = val;
    }
    public get colorFormat () {
        return this._colorFmt;
    }
    public get depthStencilFormat () {
        return this._depthStencilFmt;
    }
    /**
     * @en Whether use dynamic batching in this pipeline
     * @zh 是否启用动态合批。
     * @readonly
     */
    public get useDynamicBatching (): boolean {
        return this._useDynamicBatching;
    }
    protected _usePostProcess: boolean = false;
    protected _isHDR: boolean = false;
    protected _useMSAA: boolean = false;
    protected _useSMAA: boolean = false;
    protected _isHDRSupported: boolean = false;
    protected _lightMeterScale: number = 10000.0;
    protected _fboCount: number = 0;
    protected _colorFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _depthStencilFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _shadingWidth: number = 0.0;
    protected _shadingHeight: number = 0.0;
    protected _shadingScale: number = 1.0;
    protected _fpScale: number = 1.0 / 1024.0;
    protected _fpScaleInv: number = 1024.0;
    protected _curIdx: string = 'shading';
    protected _prevIdx: string = 'shading1';
    protected _quadVB: GFXBuffer | null = null;
    protected _quadIB: GFXBuffer | null = null;
    protected _quadIA: GFXInputAssembler | null = null;
    protected _useDynamicBatching: boolean = false;
    protected _renderPasses = new Map<GFXClearFlag, GFXRenderPass>();
    /**
     * @en The list for render objects, only available after the scene culling of the current frame.
     * @zh 渲染对象数组，仅在当前帧的场景剔除完成后有效。
     * @readonly
     */
    public renderObjects: IRenderObject[] = [];
    public uboGlobal: UBOGlobal = new UBOGlobal();
    public globalBindings: Map<string, IInternalBindingInst> = new Map<string, IInternalBindingInst>();
    public commandBuffers: GFXCommandBuffer[] = [];

    public initialize () {
        const device = this.device!;

        if (!this.createQuadInputAssembler()) {
            return false;
        }

        if (!this.createUBOs()) {
            return false;
        }

        // init textures
        for (let i = 0; i < this.renderTextures.length; i++) {
            const rtd = this.renderTextures[i];
            if (rtd.name !== '' && rtd.texture !== null) {
                this._renderTextures.set(rtd.name, rtd.texture);
            }
        }

        // init materials
        for (let i = 0; i < this.materials.length; i++) {
            const mats = this.materials[i];
            if (mats.name !== '' && mats.material !== null) {
                this._materials.set(mats.name, mats.material);
            }
        }

        // init feature
        if (this._usePostProcess) {
            if (device.hasFeature(GFXFeature.FORMAT_R11G11B10F) ||
                device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT) ||
                device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
                this._isHDRSupported = true;
            }

            this._fboCount = 1;

            if (this._useMSAA) {
                this._useMSAA = device.hasFeature(GFXFeature.MSAA);
            }
        }

        if (this._isHDR && this._isHDRSupported) {
            // Try to use HDR format
            if (device.hasFeature(GFXFeature.COLOR_HALF_FLOAT) &&
                device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT_LINEAR)) {
                if (device.hasFeature(GFXFeature.FORMAT_R11G11B10F)) {
                    this._colorFmt = GFXFormat.R11G11B10F;
                    this._isHDR = true;
                } else if (device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT)) {
                    this._colorFmt = GFXFormat.RGBA16F;
                    this._isHDR = true;
                }
            } else if (device.hasFeature(GFXFeature.COLOR_FLOAT) &&
                        device.hasFeature(GFXFeature.TEXTURE_FLOAT_LINEAR)) {
                if (device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
                    this._colorFmt = GFXFormat.RGBA32F;
                    this._isHDR = true;
                }
            }
        }

        if (!this._isHDR) {
            this._colorFmt = GFXFormat.RGBA8;
        }

        this._depthStencilFmt = device.depthStencilFormat;
        this._shadingScale = 1.0;
        this._shadingWidth = Math.floor(device.width);
        this._shadingHeight = Math.floor(device.height);

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

        this.commandBuffers[0] = device.createCommandBuffer({
            type: GFXCommandBufferType.PRIMARY,
            queue: device.queue,
        });

        let colorAttachment = new GFXColorAttachment();
        let depthStencilAttachment = new GFXDepthStencilAttachment();
        colorAttachment.format = device.colorFormat;
        depthStencilAttachment.format = device.depthStencilFormat;
        depthStencilAttachment.depthStoreOp = GFXStoreOp.DISCARD;
        depthStencilAttachment.stencilStoreOp = GFXStoreOp.DISCARD;

        const windowPass = device.createRenderPass({
            colorAttachments: [colorAttachment],
            depthStencilAttachment,
        });
        this.addRenderPass(RenderPassStage.DEFAULT, windowPass);

        colorAttachment = new GFXColorAttachment();
        colorAttachment.format = device.colorFormat;
        colorAttachment.loadOp = GFXLoadOp.LOAD;
        colorAttachment.beginLayout = GFXTextureLayout.PRESENT_SRC;

        depthStencilAttachment = new GFXDepthStencilAttachment();
        depthStencilAttachment.format = device.depthStencilFormat;
        depthStencilAttachment.depthStoreOp = GFXStoreOp.DISCARD;
        depthStencilAttachment.stencilStoreOp = GFXStoreOp.DISCARD;

        const uiPass = device.createRenderPass({
            colorAttachments: [colorAttachment],
            depthStencilAttachment,
        });
        this.addRenderPass(RenderPassStage.UI, uiPass);

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

    public getRenderTextures () {
        return this._renderTextures;
    }

    /**
     * @en Get the [[RenderTexture]] referred by the name in the current pipeline
     * @zh 获取当前管线中名字对应的 [[RenderTexture]] 对象
     * @param name 名字
     */
    public getRenderTexture (name: string) {
        const rt = this._renderTextures.get(name);
        if (!rt) {
            console.error('RenderTexture:' + name + ' not found!');
            return null;
        }
        return rt;
    }

    public addRenderTexture (name: string, rt: RenderTexture) {
        this._renderTextures.set(name, rt);
    }

    public getTexture (name: string) {
        const rt = this.getRenderTexture(name);
        return rt!.getGFXTexture();
    }

    public getFrameBuffer (name: string) {
        const rt = this.getRenderTexture(name);
        return rt!.window!.framebuffer;
    }

    public getRenderPass (clearFlags: GFXClearFlag): GFXRenderPass {
        let renderPass = this._renderPasses.get(clearFlags);
        if (renderPass) { return renderPass; }

        const device = this.device!;
        const colorAttachment = new GFXColorAttachment();
        const depthStencilAttachment = new GFXDepthStencilAttachment();
        colorAttachment.format = device.colorFormat;
        depthStencilAttachment.format = device.depthStencilFormat;

        if (!(clearFlags & GFXClearFlag.COLOR)) {
            if (clearFlags & SKYBOX_FLAG) {
                colorAttachment.loadOp = GFXLoadOp.DISCARD;
            } else {
                colorAttachment.loadOp = GFXLoadOp.LOAD;
                colorAttachment.beginLayout = GFXTextureLayout.PRESENT_SRC;
            }
        }

        if ((clearFlags & GFXClearFlag.DEPTH_STENCIL) !== GFXClearFlag.DEPTH_STENCIL) {
            if (!(clearFlags & GFXClearFlag.DEPTH)) depthStencilAttachment.depthLoadOp = GFXLoadOp.LOAD;
            if (!(clearFlags & GFXClearFlag.STENCIL)) depthStencilAttachment.stencilLoadOp = GFXLoadOp.LOAD;
            depthStencilAttachment.beginLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
        }

        renderPass = device.createRenderPass({
            colorAttachments: [colorAttachment],
            depthStencilAttachment,
        });
        this._renderPasses.set(clearFlags, renderPass!);

        return renderPass;
    }

    public getMaterial (name: string) {
        const mat = this._materials.get(name);
        if (!mat) {
            console.error('Material:' + name + ' not found!');
            return null;
        }
        return mat;
    }

    public activate (root: Root) {
        this.root = root;
        this.device = root.device;
    }

    public sceneCulling (view: RenderView) {
    }

    /**
     * @en Create all UBOs.
     * @zh 创建所有 UBO。
     */
    public createUBOs (): boolean {
        const device = this.device!;
        if (!this.globalBindings.get(UBOGlobal.BLOCK.name)) {
            const globalUBO = device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOGlobal.SIZE,
            });

            this.globalBindings.set(UBOGlobal.BLOCK.name, {
                type: GFXBindingType.UNIFORM_BUFFER,
                blockInfo: UBOGlobal.BLOCK,
                buffer: globalUBO,
            });
        }

        if (!this.globalBindings.get(UBOShadow.BLOCK.name)) {
            const shadowUBO = device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOShadow.SIZE,
            });

            this.globalBindings.set(UBOShadow.BLOCK.name, {
                type: GFXBindingType.UNIFORM_BUFFER,
                blockInfo: UBOShadow.BLOCK,
                buffer: shadowUBO,
            });
        }

        if (!this.globalBindings.get(UNIFORM_ENVIRONMENT.name)) {
            this.globalBindings.set(UNIFORM_ENVIRONMENT.name, {
                type: GFXBindingType.SAMPLER,
                samplerInfo: UNIFORM_ENVIRONMENT,
            });
        }

        return true;
    }

    public updateUBO (view: RenderView) {
        const camera = view.camera;
        const scene = camera.scene!;

        const mainLight = scene.mainLight;
        const ambient = scene.ambient;
        const fog = scene.fog;
        const uboGlobal = this.uboGlobal;
        const fv = uboGlobal.view;
        const device = this.device!;

        const shadingWidth = Math.floor(device.width);
        const shadingHeight = Math.floor(device.height);

        // update UBOGlobal
        fv[UBOGlobal.TIME_OFFSET] = this.cumulativeTime;
        fv[UBOGlobal.TIME_OFFSET + 1] = this.frameTime;
        fv[UBOGlobal.TIME_OFFSET + 2] = director.getTotalFrames();

        fv[UBOGlobal.SCREEN_SIZE_OFFSET] = device.width;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1] = device.height;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.SCREEN_SIZE_OFFSET];
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1];

        fv[UBOGlobal.SCREEN_SCALE_OFFSET] = camera.width / shadingWidth * this.shadingScale;
        fv[UBOGlobal.SCREEN_SCALE_OFFSET + 1] = camera.height / shadingHeight * this.shadingScale;
        fv[UBOGlobal.SCREEN_SCALE_OFFSET + 2] = 1.0 / fv[UBOGlobal.SCREEN_SCALE_OFFSET];
        fv[UBOGlobal.SCREEN_SCALE_OFFSET + 3] = 1.0 / fv[UBOGlobal.SCREEN_SCALE_OFFSET + 1];

        fv[UBOGlobal.NATIVE_SIZE_OFFSET] = shadingWidth;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1] = shadingHeight;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET];
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1];

        Mat4.toArray(fv, camera.matView, UBOGlobal.MAT_VIEW_OFFSET);

        Mat4.toArray(fv, camera.node.worldMatrix, UBOGlobal.MAT_VIEW_INV_OFFSET);
        Mat4.toArray(fv, camera.matProj, UBOGlobal.MAT_PROJ_OFFSET);
        Mat4.toArray(fv, camera.matProjInv, UBOGlobal.MAT_PROJ_INV_OFFSET);
        Mat4.toArray(fv, camera.matViewProj, UBOGlobal.MAT_VIEW_PROJ_OFFSET);
        Mat4.toArray(fv, camera.matViewProjInv, UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET);
        Vec3.toArray(fv, camera.position, UBOGlobal.CAMERA_POS_OFFSET);
        let projectionSignY = device.screenSpaceSignY;
        if (view.window.hasOffScreenAttachments) {
            projectionSignY *= device.UVSpaceSignY; // need flipping if drawing on render targets
        }
        fv[UBOGlobal.CAMERA_POS_OFFSET + 3] = projectionSignY;

        const exposure = camera.exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET] = exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET + 1] = 1.0 / exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET + 2] = this.isHDR ? 1.0 : 0.0;
        fv[UBOGlobal.EXPOSURE_OFFSET + 3] = this.fpScale / exposure;

        if (mainLight) {
            Vec3.toArray(fv, mainLight.direction, UBOGlobal.MAIN_LIT_DIR_OFFSET);
            Vec3.toArray(fv, mainLight.color, UBOGlobal.MAIN_LIT_COLOR_OFFSET);
            if (mainLight.useColorTemperature) {
                const colorTempRGB = mainLight.colorTemperatureRGB;
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
            }

            if (this.isHDR) {
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * this.fpScale;
            } else {
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * exposure;
            }
        } else {
            Vec3.toArray(fv, Vec3.UNIT_Z, UBOGlobal.MAIN_LIT_DIR_OFFSET);
            Vec4.toArray(fv, Vec4.ZERO, UBOGlobal.MAIN_LIT_COLOR_OFFSET);
        }

        const skyColor = ambient.skyColor;
        if (this.isHDR) {
            skyColor[3] = ambient.skyIllum * this.fpScale;
        } else {
            skyColor[3] = ambient.skyIllum * exposure;
        }
        fv.set(skyColor, UBOGlobal.AMBIENT_SKY_OFFSET);

        fv.set(ambient.groundAlbedo, UBOGlobal.AMBIENT_GROUND_OFFSET);

        fv.set(fog.fogColor, UBOGlobal.GLOBAL_FOG_COLOR_OFFSET);

        fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
        fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
        fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;

        fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
        fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
        fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;

        // update ubos
        this.globalBindings.get(UBOGlobal.BLOCK.name)!.buffer!.update(uboGlobal.view);
    }

    /**
     * @en Create input assembler for quad
     * @zh 创建四边形输入汇集器。
     */
    public createQuadInputAssembler (): boolean {
        const device = this.device!;
        // create vertex buffer

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;

        this._quadVB = device.createBuffer({
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

        this._quadIB = device.createBuffer({
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

        this._quadIA = device.createInputAssembler({
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

    public getTextureFormat (format: GFXFormat, usage: GFXTextureUsageBit) {
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

    /**
     * @en Destroy all UBOs
     * @zh 销毁全部 UBO。
     */
    protected destroyUBOs () {
        const globalUBO = this.globalBindings.get(UBOGlobal.BLOCK.name);
        if (globalUBO) {
            globalUBO.buffer!.destroy();
            this.globalBindings.delete(UBOGlobal.BLOCK.name);
        }
        const shadowUBO = this.globalBindings.get(UBOShadow.BLOCK.name);
        if (shadowUBO) {
            shadowUBO.buffer!.destroy();
            this.globalBindings.delete(UBOShadow.BLOCK.name);
        }
    }

    public destroy () {
        this.destroyUBOs();
        this.destroyQuadInputAssembler();

        const rtIter = this._renderTextures.values();
        let rtRes = rtIter.next();
        while (!rtRes.done) {
            rtRes.value.destroy();
            rtRes = rtIter.next();
        }

        const rpIter = this._renderPasses.values();
        let rpRes = rpIter.next();
        while (!rpRes.done) {
            rpRes.value.destroy();
            rpRes = rpIter.next();
        }
    }
};