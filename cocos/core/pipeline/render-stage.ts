/**
 * @category pipeline
 */

import { CCString } from '../data';
import { ccclass, property } from '../data/class-decorator';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { GFXCommandBufferType, IGFXColor, IGFXRect } from '../gfx/define';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { ccenum } from '../value-types/enum';
import { IRenderPass } from './define';
import { getPhaseID } from './pass-phase';
import { RenderFlow } from './render-flow';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from './render-queue';
import { RenderView } from './render-view';
import { IPSOCreateInfo } from '../renderer';
import { legacyCC } from '../global-exports';
import { RenderContext } from './render-context';

const _colors: IGFXColor[] = [ { r: 0, g: 0, b: 0, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

export enum RenderQueueSortMode {
    FRONT_TO_BACK,
    BACK_TO_FRONT,
}

ccenum(RenderQueueSortMode);

/**
 * @en The render stage information descriptor
 * @zh 渲染阶段描述信息。
 */
export interface IRenderStageInfo {
    name?: string;
    priority: number;
    renderQueues?: RenderQueueDesc[];
    framebuffer?: string;
}

/**
 * @en The render queue descriptor
 * @zh 渲染队列描述信息
 */
@ccclass('RenderQueueDesc')
class RenderQueueDesc {

    /**
     * @en Whether the render queue is a transparent queue
     * @zh 当前队列是否是半透明队列
     */
    @property
    public isTransparent: boolean = false;

    /**
     * @en The sort mode of the render queue
     * @zh 渲染队列的排序模式
     */
    @property({ type: RenderQueueSortMode })
    public sortMode: RenderQueueSortMode = RenderQueueSortMode.FRONT_TO_BACK;

    /**
     * @en The stages using this queue
     * @zh 使用当前渲染队列的阶段列表
     */
    @property({ type: [CCString] })
    public stages: string[] = [];
}

/**
 * @en The render stage actually renders render objects to the output window or other [[GFXFrameBuffer]].
 * Typically, a render stage collects render objects it's responsible for, clear the camera,
 * record and execute command buffer, and at last present the render result.
 * @zh 渲染阶段是实质上的渲染执行者，它负责收集渲染数据并执行渲染将渲染结果输出到屏幕或其他 [[GFXFrameBuffer]] 中。
 * 典型的渲染阶段会收集它所管理的渲染对象，按照 [[Camera]] 的清除标记进行清屏，记录并执行渲染指令缓存，并最终呈现渲染结果。
 */
@ccclass('RenderStage')
export abstract class RenderStage {
    /**
     * @en Priority of the current stage
     * @zh 当前渲染阶段的优先级。
     */
    public get priority (): number {
        return this._priority;
    }

    /**
     * @en The frame buffer used by the current stage
     * @zh 当前渲染阶段所使用的帧缓冲
     */
    public get framebuffer (): GFXFramebuffer | null {
        return this._framebuffer;
    }
    public get name (): string {
        return this._name;
    }

    /**
     * @en Name
     * @zh 名称。
     */
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
        displayOrder: 2,
        visible: true,
    })
    protected frameBuffer: string = '';

    @property({
        type: [RenderQueueDesc],
        displayOrder: 3,
        visible: true,
    })
    protected renderQueues: RenderQueueDesc[] = [];

    protected _renderQueues: RenderQueue[] = [];

    protected _framebuffer: GFXFramebuffer | null = null;

    /**
     * @en The list of clear colors
     * @zh 清空颜色数组。
     */
    protected _clearColors: IGFXColor[] | null = null;

    /**
     * @en The clear depth
     * @zh 清空深度。
     */
    protected _clearDepth: number = 1.0;

    /**
     * @en The clear stencil mask
     * @zh 清空模板。
     */
    protected _clearStencil: number = 0;

    /**
     * @en The render area rect
     * @zh 渲染区域。
     */
    protected _renderArea: IGFXRect | null = null;

    /**
     * @en The pipeline state object.
     * @zh GFX管线状态。
     */
    protected _psoCreateInfo: IPSOCreateInfo | null = null;

    /**
     * @en The command buffer
     * @zh 命令缓冲。
     */
    protected _cmdBuff: GFXCommandBuffer | null = null;

    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render stage information
     */
    public initialize (info: IRenderStageInfo): boolean {
        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        if (info.framebuffer) {
            this.frameBuffer = info.framebuffer;
        }

        if (info.renderQueues) {
            this.renderQueues = info.renderQueues;
        }

        return true;
    }

    /**
     * @en Activate the current render stage in the given render flow
     * @zh 为指定的渲染流程开启当前渲染阶段
     * @param flow The render flow to activate this render stage
     */
    public activate (rctx: RenderContext, flow: RenderFlow) {
        if (!rctx.device) {
            throw new Error('');
        }

        this._clearColors = [{ r: 0.3, g: 0.6, b: 0.9, a: 1.0 }];
        this._renderArea = { x: 0, y: 0, width: 0, height: 0 };

        for (let i = 0; i < this.renderQueues.length; i++) {
            let phase = 0;
            for (let j = 0; j < this.renderQueues[i].stages.length; j++) {
                phase |= getPhaseID(this.renderQueues[i].stages[j]);
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
            this._framebuffer = rctx.mainWindow!.framebuffer!;
        } else {
            this._framebuffer = rctx.getFrameBuffer(this.frameBuffer)!;
        }
    }

    /**
     * @en Destroy function
     * @zh 销毁函数。
     */
    public abstract destroy ();

    /**
     * @en Render function
     * @zh 渲染函数。
     * @param view The render view
     */
    public abstract render (rctx: RenderContext, view: RenderView);

    /**
     * @en Reset the size.
     * @zh 重置大小。
     * @param width The screen width
     * @param height The screen height
     */
    public abstract resize (width: number, height: number);

    /**
     * @en Rebuild function.
     * @zh 重构函数。
     */
    public abstract rebuild (rctx: RenderContext);

    /**
     * @en Set the clear color
     * @zh 设置清空颜色。
     * @param color The clear color
     */
    public setClearColor (color: IGFXColor) {
        if (this._clearColors!.length > 0) {
            this._clearColors![0] = color;
        } else {
            this._clearColors!.push(color);
        }
    }

    /**
     * @en The the entire list of clear colors
     * @zh 设置清空颜色数组。
     * @param colors The clear colors
     */
    public setClearColors (colors: IGFXColor[]) {
        this._clearColors = colors;
    }

    /**
     * @en Set clear depth
     * @zh 设置清空深度。
     * @param depth The clear depth
     */
    public setClearDepth (depth: number) {
        this._clearDepth = depth;
    }

    /**
     * @en Set clear stencil mask
     * @zh 设置清空模板。
     * @param stencil The clear stencil mask
     */
    public setClearStencil (stencil: number) {
        this._clearStencil = stencil;
    }

    /**
     * @en Set the render area rect size
     * @zh 设置渲染区域。
     * @param width The render area width
     * @param height The render area height
     */
    public setRenderArea (width: number, height: number) {
        this._renderArea!.width = width;
        this._renderArea!.height = height;
    }

    /**
     * @en Clear the given render queue
     * @zh 清空指定的渲染队列
     * @param rq The render queue
     */
    protected renderQueueClearFunc (rq: RenderQueue) {
        rq.clear();
    }

    /**
     * @en Sort the given render queue
     * @zh 对指定的渲染队列执行排序
     * @param rq The render queue
     */
    protected renderQueueSortFunc (rq: RenderQueue) {
        rq.sort();
    }
}

legacyCC.RenderStage = RenderStage;
