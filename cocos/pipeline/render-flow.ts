/**
 * @category pipeline
 */

import { Material } from '../3d/assets/material';
import { ccclass, property } from '../core/data/class-decorator';
import { GFXDevice } from '../gfx/device';
import { RenderPipeline } from './render-pipeline';
import { IRenderStageInfo, RenderStage } from './render-stage';
import { RenderView } from './render-view';

/**
 * @zh
 * 渲染流程描述信息。
 */
export interface IRenderFlowInfo {
    name?: string;
    priority: number;
}

/**
 * @zh
 * 渲染流程。
 */
@ccclass('RenderFlow')
export abstract class RenderFlow {

    public get device (): GFXDevice {
        return this._device!;
    }

    public get pipeline (): RenderPipeline {
        return this._pipeline!;
    }

    public get name (): string {
        return this._name;
    }

    public get priority (): number {
        return this._priority;
    }

    public get stages (): RenderStage[] {
        return this._stages!;
    }

    public get material (): Material | null {
        return this._material;
    }

    /**
     * @zh
     * GFX设备。
     */
    protected _device: GFXDevice | null = null;

    /**
     * @zh
     * 渲染管线。
     */
    protected _pipeline: RenderPipeline | null = null;

    /**
     * @zh
     * 名称。
     */
    @property({
        displayOrder: 0,
    })
    protected _name: string = '';

    /**
     * @zh
     * 优先级。
     */
    @property({
        displayOrder: 1,
    })
    protected _priority: number = 0;

    /**
     * @zh
     * 材质。
     */
    @property({
        type: cc.Material,
        displayOrder: 2,
    })
    protected _material: Material | null = null;

    /**
     * @zh
     * 渲染阶段数组。
     */
    @property({
        type: [RenderStage],
        displayOrder: 3,
    })
    protected _stages: RenderStage[] = [];

    /**
     * 构造函数。
     * @param pipeline 渲染管线。
     */
    constructor () {
    }

    public setPipeline (pipeline: RenderPipeline) {
        this._device = pipeline.device;
        this._pipeline = pipeline;
    }

    /**
     * @zh
     * 初始化函数。
     * @param info 渲染流程描述信息。
     */
    public initialize (info: IRenderFlowInfo): boolean{
        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        return true;
    }

    /**
     * 把序列化数据转换成运行时数据
     */
    public activate () {
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].setFlow(this);
            this._stages[i].activate();
        }
    }

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy ();

    /**
     * @zh
     * 重构函数。
     */
    public abstract rebuild ();

    /**
     * @zh
     * 重置大小。
     * @param width 屏幕宽度。
     * @param height 屏幕高度。
     */
    public resize (width: number, height: number) {
        for (const stage of this._stages) {
            stage.resize(width, height);
        }
    }

    /**
     * @zh
     * 渲染函数。
     * @param view 渲染视图。
     */
    public render (view: RenderView) {
        for (const stage of this._stages) {
            stage.render(view);
        }
    }

    /**
     * @zh
     * 创建渲染阶段。
     * @param clazz 渲染阶段类。
     * @param info 渲染阶段描述信息。
     */
    public createStage<T extends RenderStage> (
        clazz: new() => T,
        info: IRenderStageInfo): RenderStage | null {

        const stage: RenderStage = new clazz();
        stage.setFlow(this);
        if (stage.initialize(info)) {
            this._stages.push(stage);
            this._stages.sort((a, b) => {
                return a.priority - b.priority;
            });

            return stage;
        } else {
            return null;
        }
    }

    /**
     * @zh
     * 销毁全部渲染阶段。
     */
    public destroyStages () {
        for (const stage of this._stages) {
            stage.destroy();
        }
        this._stages = [];
    }
}

cc.RenderFlow = RenderFlow;
