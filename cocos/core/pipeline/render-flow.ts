/**
 * @category pipeline
 */

import { Material } from '../assets/material';
import { ccclass, property } from '../data/class-decorator';
import { RenderFlowType } from './pipeline-serialization';
import { RenderPipeline } from './render-pipeline';
import { RenderStage } from './render-stage';
import { RenderView } from './render-view';
import { legacyCC } from '../global-exports';
import { GFXClearFlag, GFXRenderPass, GFXColorAttachment, GFXDepthStencilAttachment, GFXLoadOp, GFXTextureLayout } from '../gfx';
import { PipelineGlobal } from './global';

/**
 * @en Render flow information descriptor
 * @zh 渲染流程描述信息。
 */
export interface IRenderFlowInfo {
    name?: string;
    priority: number;
    material?: Material;
    type?: RenderFlowType;
}

/**
 * @en Render flow is a sub process of the [[RenderPipeline]], it dispatch the render task to all the [[RenderStage]]s.
 * @zh 渲染流程是渲染管线（[[RenderPipeline]]）的一个子过程，它将渲染任务派发到它的所有渲染阶段（[[RenderStage]]）中执行。
 */
@ccclass('RenderFlow')
export abstract class RenderFlow {

    /**
     * @en The pipeline that the current render flow belongs to.
     * @zh 当前渲染流程归属的渲染管线
     */
    public get pipeline (): RenderPipeline {
        return this._pipeline;
    }

    /**
     * @en The name of the render flow
     * @zh 渲染流程的名字
     */
    public get name (): string {
        return this._name;
    }

    /**
     * @en The priority of the render flow
     * @zh 渲染流程的优先级
     */
    public get priority (): number {
        return this._priority;
    }

    /**
     * @en All render stages of the current flow
     * @zh 渲染流程中的所有渲染阶段
     */
    public get stages (): RenderStage[] {
        return this._stages!;
    }

    /**
     * @en The material of the current flow
     * @zh 渲染流程使用的材质
     */
    public get material (): Material | null {
        return this._material;
    }

    /**
     * @en The type of the current flow
     * @zh 当前渲染流程的类型
     */
    public get type (): RenderFlowType {
        return this._type;
    }

    /**
     * @en The render pipeline which the current flow belongs to
     * @zh 当前渲染流程所属的渲染管线。
     */
    protected _pipeline: RenderPipeline = null!;

    @property({
        displayOrder: 0,
        visible: true,
    })
    protected _name: string = '';

    @property({
        displayOrder: 1,
        visible: true,
    })
    protected _priority: number = 0;

    @property({
        type: legacyCC.Material,
        displayOrder: 2,
        visible: true,
    })
    protected _material: Material | null = null;

    @property({
        type: RenderFlowType,
        displayOrder: 3,
        visible: true,
    })
    protected _type: RenderFlowType = RenderFlowType.SCENE;

    @property({
        type: [RenderStage],
        displayOrder: 4,
        visible: true,
    })
    protected _stages: RenderStage[] = [];

    private _renderPasses = new Map<GFXClearFlag, GFXRenderPass>();

    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render flow information
     */
    public initialize (info: IRenderFlowInfo) {
        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        if (info.material) {
            this._material = info.material;
        }

        if (info.type) {
            this._type = info.type;
        }
    }

    /**
     * @en Activate the current render flow in the given pipeline
     * @zh 为指定的渲染管线开启当前渲染流程
     * @param pipeline The render pipeline to activate this render flow
     */
    public activate (pipeline: RenderPipeline) {
        this._pipeline = pipeline;
        this._activateStages();
    }

    /**
     * @en Destroy function.
     * @zh 销毁函数。
     */
    public abstract destroy ();

    /**
     * @en Rebuild function.
     * @zh 重构函数。
     */
    public abstract rebuild ();

    /**
     * @en Reset the size.
     * @zh 重置大小。
     * @param width The screen width
     * @param height The screen height
     */
    public resize (width: number, height: number) {
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].resize(width, height);
        }
    }

    /**
     * @en Render function, it basically run all render stages in sequence for the given view.
     * @zh 渲染函数，对指定的渲染视图按顺序执行所有渲染阶段。
     * @param view Render view。
     */
    public render (view: RenderView) {
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].render(view);
        }
    }

    /**
     * @en Destroy all render stages
     * @zh 销毁全部渲染阶段。
     */
    public destroyStages () {
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].destroy();
        }
        this._stages = [];
    }

    public getRenderPass (clearFlags: GFXClearFlag) {
        let renderPass = this._renderPasses.get(clearFlags);
        if (renderPass) { return renderPass; }

        const device = PipelineGlobal.device;
        const colorAttachment = new GFXColorAttachment();
        const depthStencilAttachment = new GFXDepthStencilAttachment();
        colorAttachment.format = device.colorFormat;
        depthStencilAttachment.format = device.depthStencilFormat;

        if (!(clearFlags & GFXClearFlag.COLOR)) {
            colorAttachment.loadOp = GFXLoadOp.LOAD;
            colorAttachment.beginLayout = GFXTextureLayout.PRESENT_SRC;
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
        this._renderPasses.set(clearFlags, renderPass);
        return renderPass;
    }

    /**
     * @en Activate all render stages
     * @zh 启用所有渲染阶段
     */
    protected _activateStages () {
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].activate(this);
        }
        this._stages.sort((a, b) => {
            return a.priority - b.priority;
        });
    }
}

legacyCC.RenderFlow = RenderFlow;
