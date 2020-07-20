/**
 * @category pipeline
 */

import { ccclass, property } from '../data/class-decorator';
import { GFXFormat } from '../gfx/define';
import { GFXFeature } from '../gfx/device';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { GFXRenderPass } from '../gfx/render-pass';
import { GFXTexture } from '../gfx/texture';
import { IDefineMap } from '../renderer/core/pass-utils';
import { js } from '../utils/js';
import { IInternalBindingInst } from './define';
import { RenderPassStage} from './define';
import { FrameBufferDesc, RenderFlowType, RenderPassDesc, RenderTextureDesc } from './pipeline-serialization';
import { RenderFlow } from './render-flow';
import { RenderView } from './render-view';
import { legacyCC } from '../global-exports';
import { RenderContext } from './render-context';


/**
 * @en Render pipeline information descriptor
 * @zh 渲染流程描述信息。
 */
export interface IRenderPipelineInfo {
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
     * @en The default global bindings.
     * @zh 默认的全局绑定表。
     * @readonly
     */
    public get globalBindings (): Map<string, IInternalBindingInst> {
        return this._renderContext!.globalBindings;
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
     * @en The macros for this pipeline.
     * @zh 管线宏定义。
     * @readonly
     */
    public get macros (): IDefineMap {
        return this._macros;
    }

    /**
     * @en Whether use dynamic batching in this pipeline
     * @zh 是否启用动态合批。
     * @readonly
     */
    public get useDynamicBatching (): boolean {
        return this._useDynamicBatching;
    }

    @property({
        type: [RenderFlow],
        visible: true,
    })
    protected _flows: RenderFlow[] = [];

    protected _activeFlows: RenderFlow[] = [];
    protected _colorFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _depthStencilFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _defaultTex: GFXTexture | null = null;
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
    protected _renderContext: RenderContext | null = null;
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
        // Config Anti-Aliasing
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
    public activate (rctx: RenderContext): boolean {
        this._renderContext = rctx;
        this._renderContext.activate();
        if (!this._initRenderResource()) {
            console.error('RenderPipeline:' + this.name + ' startup failed!');
            return false;
        }

        for (let i = 0; i < this._flows.length; i++) {
            const flow = this._flows[i];
            if (flow.type === RenderFlowType.SCENE) {
                flow.activate(rctx);
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
            view.flows[i].render(this._renderContext!, view);
        }
    }

    /**
     * @en Reset the size of the render target
     * @zh 重置渲染目标的尺寸。
     * @param width The screen width
     * @param height The screen height
     */
    public resize (width: number, height: number) {
        const rctx = this._renderContext!;
        const w = Math.floor(width * rctx.shadingScale);
        const h = Math.floor(height * rctx.shadingScale);
        if (w > rctx.shadingWidth ||
            h > rctx.shadingHeight) {
            // this._shadingScale = Math.min(this._shadingWidth / width, this._shadingHeight / height);
            // console.info('Resizing shading scale: ' + this._shadingScale);

            this.resizeFBOs(w, h);
        }

        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].resize(width, height);
        }
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
    public addFlow (flow: RenderFlow) {
        for (let i = 0, len = this._flows.length; i < len; i++) {
            if (this._flows[i].name === flow.name) {
                return
            }
        }

        this._flows.push(flow);
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
    protected _initRenderResource () {
        const device = this._renderContext!.device;
        const rctx = this._renderContext!;

        for (let i = 0; i < this.renderTextures.length; i++) {
            const rtd = this.renderTextures[i];
            this._renderTextures.set(rtd.name, device.createTexture({
                type: rtd.type,
                usage: rtd.usage,
                format: rctx.getTextureFormat(rtd.format, rtd.usage),
                width: rtd.width === -1 ? rctx.shadingWidth : rtd.width,
                height: rtd.height === -1 ? rctx.shadingHeight : rtd.height,
            }));
            const rt = this._renderTextures.get(rtd.name);
            if (rt == null) {
                console.error('RenderTexture:' + rtd.name + ' not found!');
                return false;
            }

            this._textures.set(rtd.name, device.createTexture({
                type: rtd.type,
                usage: rtd.usage,
                format: rctx.getTextureFormat(rtd.format, rtd.usage),
                width: rt.width,
                height: rt.height,
                // FIXME: need other args?
            }));
        }
        for (let i = 0; i < this.renderPasses.length; i++) {
            const rpd = this.renderPasses[i];
            this._renderPasses.set(rpd.index, device.createRenderPass({
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
            this._frameBuffers.set(fbd.name, device.createFramebuffer({
                renderPass: rp,
                colorTextures: ts,
                colorMipmapLevels,
                depthStencilTexture: dsv,
                depStencilMipmapLevel: 0,
            }));
        }

        if (!rctx.createQuadInputAssembler()) {
            return false;
        }

        if (!rctx.createUBOs()) {
            return false;
        }

        const mainWindow = rctx.mainWindow;
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
        this._macros.CC_USE_HDR = (rctx.isHDR);
        this._macros.CC_SUPPORT_FLOAT_TEXTURE = device.hasFeature(GFXFeature.TEXTURE_FLOAT);

        return true;
    }

    /**
     * @en Internal destroy function
     * @zh 内部销毁函数。
     */
    protected _destroy () {
        this.destroyFlows();
        this.clearRenderPasses();
        if (this._renderContext) {
            this._renderContext.destroy();
        }
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
        const rctx = this._renderContext!;
        rctx.shadingWidth = width;
        rctx.shadingHeight = height;

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

        console.info('Resizing shading fbos: ' + width + 'x' + height);
    }

    /**
     * @en Activate a render flow.
     * @zh 激活一个 RenderFlow，将其添加到可执行的 RenderFlow 数组中
     * @param flow The render flow
     */
    private activateFlow (flow: RenderFlow) {
        let mFlow;
        for (let i = 0, len = this._flows.length; i < len; i++) {
            mFlow = this._flows[i];
            if (mFlow.name === flow.name) {
                this._activeFlows.push(flow);
                return
            }
        }

        this._activeFlows.sort((a: RenderFlow, b: RenderFlow) => {
            return a.priority - b.priority;
        });
    }
}
legacyCC.RenderPipeline = RenderPipeline;
