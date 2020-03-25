/**
 * @category pipeline
 */

import { Material } from '../assets/material';
import { ccclass, property } from '../data/class-decorator';
import { GFXDevice } from '../gfx/device';
import { RenderFlowType } from './pipeline-serialization';
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
    type?: RenderFlowType;
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
        return this._pipeline;
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

    public get type (): RenderFlowType {
        return this._type;
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
    protected _pipeline: RenderPipeline = null!;

    /**
     * @zh
     * 名称。
     */
    @property({
        displayOrder: 0,
        visible: true,
    })
    protected _name: string = '';

    /**
     * @zh
     * 优先级。
     */
    @property({
        displayOrder: 1,
        visible: true,
    })
    protected _priority: number = 0;

    /**
     * @zh
     * 材质。
     */
    @property({
        type: cc.Material,
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

    /**
     * @zh
     * 渲染阶段数组。
     */
    @property({
        type: [RenderStage],
        displayOrder: 4,
        visible: true,
    })
    protected _stages: RenderStage[] = [];

    /**
     * 构造函数。
     * @param pipeline 渲染管线。
     */
    constructor () {
    }

    /**
     * @zh
     * 初始化函数。
     * @param info 渲染流程描述信息。
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
     * 把序列化数据转换成运行时数据
     */
    public activate (pipeline: RenderPipeline) {
        this._device = pipeline.device;
        this._pipeline = pipeline;
        this._activateStages();
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
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].resize(width, height);
        }
    }

    /**
     * @zh
     * 渲染函数。
     * @param view 渲染视图。
     */
    public render (view: RenderView) {
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].render(view);
        }
    }

    /**
     * @zh
     * 销毁全部渲染阶段。
     */
    public destroyStages () {
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].destroy();
        }
        this._stages = [];
    }

    protected _activateStages () {
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].activate(this);
        }
        this._stages.sort((a, b) => {
            return a.priority - b.priority;
        });
    }
}

cc.RenderFlow = RenderFlow;
