/**
 * @category pipeline
 */

import { CCString } from '../data';
import { ccclass, property } from '../data/class-decorator';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { GFXClearFlag, GFXCommandBufferType, IGFXColor, IGFXRect } from '../gfx/define';
import { GFXDevice } from '../gfx/device';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { Pass } from '../renderer/core/pass';
import { ccenum } from '../value-types/enum';
import { IRenderPass } from './define';
import { getPhaseID } from './pass-phase';
import { RenderFlow } from './render-flow';
import { RenderPipeline } from './render-pipeline';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from './render-queue';
import { RenderView } from './render-view';
import { IPSOCreateInfo } from '../renderer';
import { legacyCC } from '../global-exports';

const _colors: IGFXColor[] = [ { r: 0, g: 0, b: 0, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

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
    renderQueues?: RenderQueueDesc[];
    framebuffer?: string;
}

@ccclass('RenderQueueDesc')
class RenderQueueDesc {

    @property
    public isTransparent: boolean = false;

    @property({ type: RenderQueueSortMode })
    public sortMode: RenderQueueSortMode = RenderQueueSortMode.FRONT_TO_BACK;

    @property({ type: [CCString] })
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
        return this._flow;
    }

    /**
     * @zh
     * 渲染管线。
     */
    public get pipeline (): RenderPipeline {
        return this._pipeline;
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

    /**
     * @zh
     * 渲染流程。
     */
    protected _flow: RenderFlow = null!;

    /**
     * @zh
     * 渲染管线。
     */
    protected _pipeline: RenderPipeline = null!;

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
    protected _clearColors: IGFXColor[] | null = null;

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
    protected _renderArea: IGFXRect | null = null;

    /**
     * @zh
     * 着色过程。
     */
    protected _pass: Pass | null = null;

    /**
     * @zh
     * GFX管线状态。
     */
    protected _psoCreateInfo: IPSOCreateInfo | null = null;

    /**
     * 构造函数。
     * @param flow 渲染流程。
     */
    constructor () {
    }

    /**
     * @zh
     * 初始化函数，用于不从资源加载RenderPipeline时使用。
     * @param info 渲染阶段描述信息。
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
     * 把序列化数据转换成运行时数据
     */
    public activate (flow: RenderFlow) {
        this._flow = flow;
        this._pipeline = flow.pipeline;
        this._device = flow.device;

        if (!this._flow.pipeline.root.device) {
            throw new Error('');
        }

        this._device = this._flow.pipeline.root.device;

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
            this._framebuffer = this._flow.pipeline.root.mainWindow!.framebuffer!;
        } else {
            this._framebuffer = this._flow.pipeline.getFrameBuffer(this.frameBuffer)!;
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
        if (this._clearColors!.length > 0) {
            this._clearColors![0] = color;
        } else {
            this._clearColors!.push(color);
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
        this._renderArea!.width = width;
        this._renderArea!.height = height;
    }

    public sortRenderQueue () {
        this._renderQueues.forEach(this.renderQueueClearFunc);
        const renderObjects = this._pipeline.renderObjects;
        for (let i = 0; i < renderObjects.length; ++i) {
            const ro = renderObjects[i];
            for (let l = 0; l < ro.model.subModelNum; l++) {
                for (let j = 0; j < ro.model.getSubModel(l).passes.length; j++) {
                    for (let k = 0; k < this._renderQueues.length; k++) {
                        this._renderQueues[k].insertRenderPass(ro, l, j);
                    }
                }
            }
        }
        this._renderQueues.forEach(this.renderQueueSortFunc);
    }

    public executeCommandBuffer (view: RenderView) {
        const camera = view.camera;

        const cmdBuff = this._cmdBuff!;

        const vp = camera.viewport;
        this._renderArea!.x = vp.x * camera.width;
        this._renderArea!.y = vp.y * camera.height;
        this._renderArea!.width = vp.width * camera.width * this.pipeline!.shadingScale;
        this._renderArea!.height = vp.height * camera.height * this.pipeline!.shadingScale;

        if (camera.clearFlag & GFXClearFlag.COLOR) {
            _colors[0].a = camera.clearColor.a;
            _colors[0].r = camera.clearColor.r;
            _colors[0].g = camera.clearColor.g;
            _colors[0].b = camera.clearColor.b;
        }
        if (!this._framebuffer) {
            this._framebuffer = view.window!.framebuffer;
        }

        cmdBuff.begin();
        cmdBuff.beginRenderPass(this._framebuffer!, this._renderArea!,
            camera.clearFlag, _colors, camera.clearDepth, camera.clearStencil);

        for (let i = 0; i < this._renderQueues.length; i++) {
            this._renderQueues[i].recordCommandBuffer(this._device!, this._framebuffer.renderPass!, cmdBuff);
        }

        cmdBuff.endRenderPass();
        cmdBuff.end();
        bufs[0] = cmdBuff;
        this._device!.queue.submit(bufs);
    }

    public createCmdBuffer () {
        this._cmdBuff = this._device!.createCommandBuffer({
            allocator: this._device!.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });
    }

    protected renderQueueClearFunc (rq: RenderQueue) {
        rq.clear();
    }

    protected renderQueueSortFunc (rq: RenderQueue) {
        rq.sort();
    }
}

legacyCC.RenderStage = RenderStage;
