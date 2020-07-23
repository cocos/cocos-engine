/**
 * @category pipeline
 */

import { ccclass, property } from '../data/class-decorator';
import { GFXFeature } from '../gfx/device';
import { IDefineMap } from '../renderer/core/pass-utils';
import { js } from '../utils/js';
import { IInternalBindingInst } from './define';
import { RenderFlowType, } from './pipeline-serialization';
import { RenderFlow } from './render-flow';
import { RenderView } from './render-view';
import { legacyCC } from '../global-exports';
import { RenderContext } from './render-context';
import { Root } from '../root';

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
     * @en The macros for this pipeline.
     * @zh 管线宏定义。
     * @readonly
     */
    public get macros (): IDefineMap {
        return this._macros;
    }
    @property({
        type: [RenderFlow],
        visible: true,
    })
    protected _flows: RenderFlow[] = [];
    @property({
        type: [RenderContext],
    })
    protected get renderContext () {
        return this._renderContext;
    }
    protected _renderContext: RenderContext = new RenderContext();
    protected _activeFlows: RenderFlow[] = [];
    protected _macros: IDefineMap = {};
    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render pipeline information
     */
    public initialize () {}

    /**
     * @en Activate the render pipeline after loaded, it mainly activate the flows
     * @zh 当渲染管线资源加载完成后，启用管线，主要是启用管线内的 flow
     */
    public activate (root: Root): boolean {
        this._renderContext.activate(root);
        if (!this._initRenderResource(this._renderContext)) {
            console.error('RenderPipeline:' + this.name + ' startup failed!');
            return false;
        }

        for (let i = 0; i < this._flows.length; i++) {
            const flow = this._flows[i];
            if (flow.type === RenderFlowType.SCENE) {
                flow.activate(this._renderContext);
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
            this.resizeFBOs(w, h);
        }

        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].resize(width, height);
        }
    }

    protected addFlow (flow: RenderFlow) {
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
    protected destroyFlows () {
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
    protected _initRenderResource (rctx: RenderContext) {
        const device = rctx.device!;

        if (!rctx.initialize()) {
            return false;
        }

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
        if (this._renderContext) {
            this._renderContext.destroy();
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

        const renderTextures = rctx.getRenderTextures();
        const iter = renderTextures.values();
        let rt = iter.next();
        while (!rt.done) {
            rt.value.resize(width, height);
            rt = iter.next();
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
