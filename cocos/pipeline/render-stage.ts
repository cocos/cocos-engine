/**
 * @category pipeline
 */

import { ccclass, property } from '../core/data/class-decorator';
import { ccenum } from '../core/value-types/enum';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { IGFXColor, IGFXRect } from '../gfx/define';
import { GFXDevice } from '../gfx/device';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { GFXPipelineState } from '../gfx/pipeline-state';
import { Pass } from '../renderer';
import { IRenderPass } from './define';
import { getPhaseID } from './pass-phase';
import { RenderFlow } from './render-flow';
import { RenderPipeline } from './render-pipeline';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from './render-queue';
import { RenderView } from './render-view';

export enum RenderQueueSortMode {
    FRONT_TO_BACK,
    BACK_TO_FRONT,
}

ccenum(RenderQueueSortMode);

/**
 * @zh
 * 渲染阶段描述信息。
 */
export interface IRenderStageInfo {
    name?: string;
    priority: number;
    framebuffer?: GFXFramebuffer;
}

@ccclass('RenderQueueDesc')
class RenderQueueDesc {
    @property
    public isTransparent: boolean = false;
    @property({
        type: RenderQueueSortMode,
    })
    public sortMode: RenderQueueSortMode = RenderQueueSortMode.FRONT_TO_BACK;
    @property({
        type: [String],
    })
    public stages: string[] = [];
}

/**
 * @zh
 * 渲染阶段。
 */
@ccclass('RenderStage')
export abstract class RenderStage {

    /**
     * @zh
     * 渲染流程。
     */
    public get flow (): RenderFlow {
        return this._flow!;
    }

    /**
     * @zh
     * 渲染管线。
     */
    public get pipeline (): RenderPipeline {
        return this._pipeline!;
    }

    /**
     * @zh
     * 优先级。
     */
    public get priority (): number {
        return this._priority;
    }

    /**
     * @zh
     * 渲染流程。
     */
    public get framebuffer (): GFXFramebuffer | null {
        return this._framebuffer;
    }

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

    @property({
        displayOrder: 2,
    })
    protected frameBuffer: string = '';

    @property({
        type: [RenderQueueDesc],
        displayOrder: 3,
    })
    protected renderQueues: RenderQueueDesc[] = [];

    protected _renderQueues: RenderQueue[] = [];

    /**
     * @zh
     * 渲染流程。
     */
    protected _flow: RenderFlow | null = null;

    /**
     * @zh
     * 渲染管线。
     */
    protected _pipeline: RenderPipeline | null = null;

    /**
     * @zh
     * GFX设备。
     */
    protected _device: GFXDevice | null = null;

    /**
     * @zh
     * 渲染流程。
     */
    protected _framebuffer: GFXFramebuffer | null = null;

    /**
     * @zh
     * 命令缓冲。
     */
    protected _cmdBuff: GFXCommandBuffer | null = null;

    /**
     * @zh
     * 清空颜色数组。
     */
    protected _clearColors: IGFXColor[] = [];

    /**
     * @zh
     * 清空深度。
     */
    protected _clearDepth: number = 1.0;

    /**
     * @zh
     * 清空模板。
     */
    protected _clearStencil: number = 0;

    /**
     * @zh
     * 渲染区域。
     */
    protected _renderArea: IGFXRect;

    /**
     * @zh
     * 着色过程。
     */
    protected _pass: Pass | null = null;

    /**
     * @zh
     * GFX管线状态。
     */
    protected _pso: GFXPipelineState | null = null;

    /**
     * 构造函数。
     * @param flow 渲染流程。
     */
    constructor () {
        this._clearColors = [{ r: 0.3, g: 0.6, b: 0.9, a: 1.0 }];
        this._renderArea = { x: 0, y: 0, width: 0, height: 0 };
    }

    public setFlow (flow: RenderFlow) {
        this._device = flow.device;
        this._flow = flow;
        this._pipeline = flow.pipeline;

        if (!this._flow.pipeline.root.device) {
            throw new Error('');
        }
    }

    /**
     * @zh
     * 初始化函数。
     * @param info 渲染阶段描述信息。
     */
    public initialize (info: IRenderStageInfo): boolean {
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
        for (let i = 0; i < this.renderQueues.length; i++) {
            let phase = 0;
            for (const p of this.renderQueues[i].stages) {
                phase |= getPhaseID(p);
            }
            let sortFunc: (a: IRenderPass, b: IRenderPass) => number = opaqueCompareFn;
            switch (this.renderQueues[i].sortMode) {
                case RenderQueueSortMode.BACK_TO_FRONT:
                    sortFunc = transparentCompareFn;
                    break;
                case RenderQueueSortMode.FRONT_TO_BACK:
                    sortFunc = opaqueCompareFn;
                    break;
            }
            this._renderQueues[i] = new RenderQueue({
                isTransparent: this.renderQueues[i].isTransparent,
                phases: phase,
                sortFunc,
            });
        }

        if (this.frameBuffer === 'window') {
            this._framebuffer = this._flow!.pipeline.root.mainWindow!.framebuffer!;
        } else {
            this._framebuffer = this._flow!.pipeline.getFrameBuffer(this.frameBuffer)!;
        }
    }

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy ();

    /**
     * @zh
     * 渲染函数。
     * @param view 渲染视图。
     */
    public abstract render (view: RenderView);

    /**
     * @zh
     * 重置大小。
     * @param width 屏幕宽度。
     * @param height 屏幕高度。
     */
    public abstract resize (width: number, height: number);

    /**
     * @zh
     * 重构函数。
     */
    public abstract rebuild ();

    /**
     * @zh
     * 设置清空颜色。
     */
    public setClearColor (color: IGFXColor) {
        if (this._clearColors.length > 0) {
            this._clearColors[0] = color;
        } else {
            this._clearColors.push(color);
        }
    }

    /**
     * @zh
     * 设置清空颜色数组。
     */
    public setClearColors (colors: IGFXColor[]) {
        this._clearColors = colors;
    }

    /**
     * @zh
     * 设置清空深度。
     */
    public setClearDepth (depth: number) {
        this._clearDepth = depth;
    }

    /**
     * @zh
     * 设置清空模板。
     */
    public setClearStencil (stencil: number) {
        this._clearStencil = stencil;
    }

    /**
     * @zh
     * 设置渲染区域。
     */
    public setRenderArea (width: number, height: number) {
        this._renderArea.width = width;
        this._renderArea.height = height;
    }
}

cc.RenderStage = RenderStage;
