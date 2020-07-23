/**
 * @category pipeline
 */

import { ccclass, property } from '../data/class-decorator';
import { RenderFlow } from './render-flow';
import { RenderView } from './render-view';
import { legacyCC } from '../global-exports';
import { IDefineMap } from '../renderer/core/pass-utils';
import { GFXDevice } from '../gfx/device';
import { IInternalBindingInst } from './define';
import { Asset } from '../assets/asset';

/**
 * @en Render pipeline information descriptor
 * @zh 渲染管线描述信息。
 */
export interface IRenderPipelineInfo {
    flows: RenderFlow[];
    tag?: number;
}

/**
 * @en Render pipeline describes how we handle the rendering process for all render objects in the related render scene root.
 * It contains some general pipeline configurations, necessary rendering resources and some [[RenderFlow]]s.
 * The rendering process function [[render]] is invoked by [[Root]] for all [[RenderView]]s.
 * @zh 渲染管线对象决定了引擎对相关渲染场景下的所有渲染对象实施的完整渲染流程。
 * 这个类主要包含一些通用的管线配置，必要的渲染资源和一些 [[RenderFlow]]。
 * 渲染流程函数 [[render]] 会由 [[Root]] 发起调用并对所有 [[RenderView]] 执行预设的渲染流程。
 */
@ccclass('cc.RenderPipeline')
export abstract class RenderPipeline extends Asset {
    /**
     * @en The default global bindings.
     * @zh 默认的全局绑定表。
     * @readonly
     */
    public get globalBindings () {
        return this._globalBindings;
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
     * @en The flows of pipeline.
     * @zh 管线的渲染流程列表。
     * @readonly
     */
    public get flows (): RenderFlow[] {
        return this._flows;
    }

    /**
     * @en The tag of pipeline.
     * @zh 管线的标签。
     * @readonly
     */
    public get tag (): number {
        return this._tag;
    }

    /**
     * @en Tag
     * @zh 标签
     * @readonly
     */
    @property({
        displayOrder: 0,
        visible: true,
    })
    protected _tag: number = 0;

    /**
     * @en Flows
     * @zh 渲染流程列表
     * @readonly
     */
    @property({
        displayOrder: 1,
        type: [RenderFlow],
        visible: true,
    })
    protected _flows: RenderFlow[] = [];
    protected _globalBindings: Map<string, IInternalBindingInst> = new Map<string, IInternalBindingInst>();
    protected _macros: IDefineMap = {};
    public device!: GFXDevice;

    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render pipeline information
     */
    public initialize (info?: IRenderPipelineInfo): boolean {
        if (info) {
            for (let i = 0; i < info.flows.length; i++) {
                this._flows[i] = info.flows[i];
            }

            if (info.tag) {
                this._tag = info.tag;
            }
        }

        return true;
    }

    /**
     * @en Activate the render pipeline after loaded, it mainly activate the flows
     * @zh 当渲染管线资源加载完成后，启用管线，主要是启用管线内的 flow
     */
    public activate (): boolean {
        this.device = legacyCC.director.root.device;

        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].activate(this);
        }

        return true;
    }

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
     * @en Internal destroy function
     * @zh 内部销毁函数。
     */
    public destroy (): boolean {
        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].destroy();
        }
        this._flows.length = 0;

        return super.destroy();
    }
}

legacyCC.RenderPipeline = RenderPipeline;
