/**
 * @category pipeline
 */

import { legacyCC } from '../global-exports';
import { Asset } from '../assets/asset';
import { ccclass, property } from '../data/class-decorator';
import { RenderFlow } from './render-flow';
import { RenderView } from './render-view';
import { IDefineMap } from '../renderer/core/pass-utils';
import { GFXDevice, GFXDescriptorType, GFXUniformBlock, GFXUniformSampler, GFXDescriptorSet, GFXCommandBuffer } from '../gfx';

/**
 * @en Render pipeline information descriptor
 * @zh 渲染管线描述信息。
 */
export interface IRenderPipelineInfo {
    flows: RenderFlow[];
    tag?: number;
}

export interface IDescriptorSetLayout {
    descriptors: GFXDescriptorType[];
    layouts: Record<string, GFXUniformBlock | GFXUniformSampler>;
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
     * @en Layout of the pipeline-global descriptor set.
     * @zh 管线层的全局描述符集布局。
     * @readonly
     */
    get globalDescriptorSetLayout (): Readonly<IDescriptorSetLayout> {
        return this._globalDescriptorSetLayout;
    }

    /**
     * @en Layout of the model-local descriptor set.
     * @zh 逐模型的描述符集布局。
     * @readonly
     */
    get localDescriptorSetLayout (): Readonly<IDescriptorSetLayout> {
        return this._localDescriptorSetLayout;
    }

    /**
     * @en The macros for this pipeline.
     * @zh 管线宏定义。
     * @readonly
     */
    get macros (): IDefineMap {
        return this._macros;
    }

    /**
     * @en The flows of pipeline.
     * @zh 管线的渲染流程列表。
     * @readonly
     */
    get flows (): RenderFlow[] {
        return this._flows;
    }

    /**
     * @en The tag of pipeline.
     * @zh 管线的标签。
     * @readonly
     */
    get tag (): number {
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

    protected _globalDescriptorSetLayout: IDescriptorSetLayout = { descriptors: [], layouts: {} };
    protected _localDescriptorSetLayout: IDescriptorSetLayout = { descriptors: [], layouts: {} };
    protected _macros: IDefineMap = {};

    get device () {
        return this._device;
    }

    get descriptorSet () {
        return this._descriptorSet;
    }

    get commandBuffers () {
        return this._commandBuffers;
    }

    protected _device!: GFXDevice;
    protected _descriptorSet!: GFXDescriptorSet;
    protected _commandBuffers: GFXCommandBuffer[] = [];

    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render pipeline information
     */
    public initialize (info: IRenderPipelineInfo): boolean {
        this._flows = info.flows;
        if (info.tag) { this._tag = info.tag; }
        return true;
    }

    /**
     * @en Activate the render pipeline after loaded, it mainly activate the flows
     * @zh 当渲染管线资源加载完成后，启用管线，主要是启用管线内的 flow
     */
    public activate (): boolean {
        this._device = legacyCC.director.root.device;

        this._descriptorSet = this._device.createDescriptorSet({
            layout: this._globalDescriptorSetLayout.descriptors,
        });

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

        if (this._descriptorSet) {
            this._descriptorSet.destroy();
            this._descriptorSet = null!;
        }

        for (let i = 0; i < this._commandBuffers.length; i++) {
            this._commandBuffers[i].destroy();
        }
        this._commandBuffers.length = 0;

        return super.destroy();
    }
}
