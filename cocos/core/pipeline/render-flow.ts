/**
 * @category pipeline
 */

import { Material } from '../assets/material';
import { ccclass, property } from '../data/class-decorator';
import { GFXDevice } from '../gfx/device';
import { RenderPipeline } from './render-pipeline';
import { RenderStage } from './render-stage';
import { RenderView } from './render-view';

/**
 * @zh
 * 渲染流程描述信息。
 */
export interface IRenderFlowInfo {
    name?: string;
    priority: number;
    material?: Material;
}

/**
 * @zh
 * 渲染流程。
 */
@ccclass('RenderFlow')
export abstract class RenderFlow {

    public get device(): GFXDevice {
        return this._device!;
    }

    public get pipeline(): RenderPipeline {
        return this._pipeline!;
    }

    public get name(): string {
        return this._name;
    }

    public get priority(): number {
        return this._priority;
    }

    public get stages(): RenderStage[] {
        return this._stages!;
    }

    public get material(): Material | null {
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
        visible: true
    })
    protected _name: string = '';

    /**
     * @zh
     * 优先级。
     */
    @property({
        displayOrder: 1,
        visible: true
    })
    protected _priority: number = 0;

    /**
     * @zh
     * 材质。
     */
    @property({
        type: cc.Material,
        displayOrder: 2,
        visible: true
    })
    protected _material: Material | null = null;

    /**
     * @zh
     * 渲染阶段数组。
     */
    @property({
        type: [RenderStage],
        displayOrder: 3,
        visible: true
    })
    protected _stages: RenderStage[] = [];

    /**
     * 构造函数。
     * @param pipeline 渲染管线。
     */
    constructor() {
    }

    /**
     * @zh
     * 初始化函数。
     * @param info 渲染流程描述信息。
     */
    public initialize(info: IRenderFlowInfo) {
        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        if (info.material)
            this._material = info.material;
    }

    /**
     * 把序列化数据转换成运行时数据
     */
    public activate(pipeline: RenderPipeline) {
        this._device = pipeline.device;
        this._pipeline = pipeline;
        (pipeline as any).activateFlow(this);
        this._activateStages();
    }

    protected _activateStages() {
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].activate(this);
        }
        this._stages.sort((a, b) => {
            return a.priority - b.priority;
        })
    }

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy();

    /**
     * @zh
     * 重构函数。
     */
    public abstract rebuild();

    /**
     * @zh
     * 重置大小。
     * @param width 屏幕宽度。
     * @param height 屏幕高度。
     */
    public resize(width: number, height: number) {
        for (const stage of this._stages) {
            stage.resize(width, height);
        }
    }

    /**
     * @zh
     * 渲染函数。
     * @param view 渲染视图。
     */
    public render(view: RenderView) {
        for (const stage of this._stages) {
            stage.render(view);
        }
    }

    /**
     * @zh
     * 销毁全部渲染阶段。
     */
    public destroyStages() {
        for (const stage of this._stages) {
            stage.destroy();
        }
        this._stages = [];
    }
}

cc.RenderFlow = RenderFlow;
