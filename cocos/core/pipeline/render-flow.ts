/**
 * @category pipeline
 */
import { ccclass, property } from '../data/class-decorator';
import { RenderFlowType } from './pipeline-serialization';
import { RenderStage } from './render-stage';
import { RenderView } from './render-view';
import { RenderContext } from './render-context';
import { legacyCC } from '../global-exports';
import { GFXClearFlag, GFXRenderPass, GFXColorAttachment, GFXDepthStencilAttachment, GFXLoadOp, GFXTextureLayout } from '../gfx';
import { SKYBOX_FLAG } from '../renderer';

/**
 * @en Render flow information descriptor
 * @zh 渲染流程描述信息。
 */
export interface IRenderFlowInfo {
    name?: string;
    priority: number;
    type?: RenderFlowType;
}

/**
 * @en Render flow is a sub process of the [[RenderPipeline]], it dispatch the render task to all the [[RenderStage]]s.
 * @zh 渲染流程是渲染管线（[[RenderPipeline]]）的一个子过程，它将渲染任务派发到它的所有渲染阶段（[[RenderStage]]）中执行。
 */
@ccclass('RenderFlow')
export abstract class RenderFlow {
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
     * @en The type of the current flow
     * @zh 当前渲染流程的类型
     */
    public get type (): RenderFlowType {
        return this._type;
    }

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

    protected _activeStages: RenderStage[] = [];

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

        if (info.type) {
            this._type = info.type;
        }
    }

    /**
     * @en Activate the current render flow in the given pipeline
     * @zh 为指定的渲染管线开启当前渲染流程
     * @param pipeline The render pipeline to activate this render flow
     */
    public activate (rctx: RenderContext) {
        this._activateStages(rctx);
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
    public abstract rebuild (rctx: RenderContext);

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
    public render (rctx: RenderContext, view: RenderView) {
        for (let i = 0, len = this._activeStages.length; i < len; i++) {
            this._activeStages[i].render(rctx, view);
        }
    }

    /**
     * @en Destroy all render stages
     * @zh 销毁全部渲染阶段。
     */
    public destroyStages () {
        for (let i = 0, len = this._stages.length; i < len; i++) {
            this._stages[i].destroy();
        }
        this._stages.length = 0;
        this._activeStages.length = 0;
    }

    public addStage (stage: RenderStage) {
        for (let i = 0, len = this._stages.length; i < len; i++) {
            if (this._stages[i].name === stage.name) {
                return
            }
        }

        this._stages.push(stage);
    }

    public activateStage (stage: RenderStage) {
        let mStage;
        for (let i = 0, len = this._stages.length; i < len; i++) {
            mStage = this._stages[i];
            if (mStage.name === stage.name) {
                this._activeStages.push(stage);
                return
            }
        }

        this._activeStages.sort((a, b) => {
            return a.priority - b.priority;
        });
    }

    /**
     * @en Activate all render stages
     * @zh 启用所有渲染阶段
     */
    protected _activateStages (rctx: RenderContext) {
        for (let i = 0, len = this._stages.length; i < len; i++) {
            this._stages[i].activate(rctx, this);
            this._activeStages.push(this._stages[i]);
        }
        this._activeStages.sort((a, b) => {
            return a.priority - b.priority;
        });
    }
}

legacyCC.RenderFlow = RenderFlow;
