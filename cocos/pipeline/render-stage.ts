import { GFXCommandBuffer } from '../gfx/command-buffer';
import { IGFXColor, IGFXRect } from '../gfx/define';
import { GFXDevice } from '../gfx/device';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { GFXPipelineState } from '../gfx/pipeline-state';
import { Pass } from '../renderer';
import { RenderFlow } from './render-flow';
import { RenderPipeline } from './render-pipeline';
import { RenderView } from './render-view';

/**
 * @zh
 * 渲染阶段描述信息
 */
export interface IRenderStageInfo {
    name?: string;
    priority: number;
    framebuffer?: GFXFramebuffer;
}

/**
 * @zh
 * 渲染阶段
 */
export abstract class RenderStage {

    public get flow (): RenderFlow {
        return this._flow;
    }

    public get pipeline (): RenderPipeline {
        return this._pipeline;
    }

    public get priority (): number {
        return this._priority;
    }

    public get framebuffer (): GFXFramebuffer | null {
        return this._framebuffer;
    }

    /**
     * @zh
     * 渲染流程
     */
    protected _flow: RenderFlow;

    /**
     * @zh
     * 渲染管线
     */
    protected _pipeline: RenderPipeline;

    /**
     * @zh
     * GFX设备
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * 名称
     */
    protected _name: string = '';

    /**
     * @zh
     * 优先级
     */
    protected _priority: number = 0;

    /**
     * @zh
     * 渲染流程
     */
    protected _framebuffer: GFXFramebuffer | null = null;

    /**
     * @zh
     * 命令缓冲
     */
    protected _cmdBuff: GFXCommandBuffer | null = null;

    /**
     * @zh
     * 清空颜色数组
     */
    protected _clearColors: IGFXColor[];

    /**
     * @zh
     * 清空深度
     */
    protected _clearDepth: number = 1.0;

    /**
     * @zh
     * 清空模板
     */
    protected _clearStencil: number = 0;

    /**
     * @zh
     * 渲染区域
     */
    protected _renderArea: IGFXRect;

    /**
     * @zh
     * 着色过程
     */
    protected _pass: Pass | null = null;

    /**
     * @zh
     * GFX管线状态
     */
    protected _pso: GFXPipelineState | null = null;

    /**
     * @zh
     * 构造函数
     * @param flow 渲染流程
     */
    constructor (flow: RenderFlow) {
        this._flow = flow;
        this._pipeline = flow.pipeline;
        this._device = flow.device;

        if (!this._flow.pipeline.root.device) {
            throw new Error('');
        }

        this._device = this._flow.pipeline.root.device;
        this._clearColors = [{ r: 0.3, g: 0.6, b: 0.9, a: 1.0 }];
        this._renderArea = { x: 0, y: 0, width: 0, height: 0 };
    }

    /**
     * @zh
     * 初始化函数
     * @param info 渲染阶段描述信息
     */
    public abstract initialize (info: IRenderStageInfo): boolean;

    /**
     * @zh
     * 销毁函数
     */
    public abstract destroy ();

    /**
     * @zh
     * 渲染函数
     * @param view 渲染视图
     */
    public abstract render (view: RenderView);

    /**
     * @zh
     * 重置大小
     * @param width 屏幕宽度
     * @param height 屏幕高度
     */
    public abstract resize (width: number, height: number);

    /**
     * @zh
     * 重构函数
     */
    public abstract rebuild ();

    /**
     * @zh
     * 设置清空颜色
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
     * 设置清空颜色数组
     */
    public setClearColors (colors: IGFXColor[]) {
        this._clearColors = colors;
    }

    /**
     * @zh
     * 设置清空深度
     */
    public setClearDepth (depth: number) {
        this._clearDepth = depth;
    }

    /**
     * @zh
     * 设置清空模板
     */
    public setClearStencil (stencil: number) {
        this._clearStencil = stencil;
    }

    /**
     * @zh
     * 设置渲染区域
     */
    public setRenderArea (width: number, height: number) {
        this._renderArea.width = width;
        this._renderArea.height = height;
    }
}
