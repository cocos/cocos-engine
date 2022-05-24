/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module pipeline
 */
import { ccclass, displayOrder, serializable, type } from 'cc.decorator';
import { RenderStage } from './render-stage';
import { RenderPipeline } from './render-pipeline';
import { legacyCC } from '../global-exports';
import { Camera } from '../renderer/scene';

/**
 * @en Render flow information descriptor
 * @zh 渲染流程描述信息。
 */
export interface IRenderFlowInfo {
    name: string;
    priority: number;
    stages: RenderStage[];
    tag?: number;
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
     * @en Priority of the current flow
     * @zh 当前渲染流程的优先级。
     */
    public get priority (): number {
        return this._priority;
    }

    /**
     * @en Tag of the current flow
     * @zh 当前渲染流程的标签。
     */
    public get tag (): number {
        return this._tag;
    }

    /**
     * @en The stages of flow.
     * @zh 渲染流程 stage 列表。
     * @readonly
     */
    public get stages (): RenderStage[] {
        return this._stages;
    }

    @displayOrder(0)
    @serializable
    protected _name = '';

    @displayOrder(1)
    @serializable
    protected _priority = 0;

    @displayOrder(2)
    @serializable
    protected _tag = 0;

    @displayOrder(3)
    @type([RenderStage])
    @serializable
    protected _stages: RenderStage[] = [];
    protected _pipeline!: RenderPipeline;

    /**
     * @en Get pipeline
     * @zh 获取pipeline
     */
    public get pipeline (): RenderPipeline {
        return this._pipeline;
    }

    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render flow information
     */
    public initialize (info: IRenderFlowInfo): boolean {
        this._name = info.name;
        this._priority = info.priority;
        this._stages = info.stages;
        if (info.tag) { this._tag = info.tag; }
        return true;
    }

    /**
     * @en Activate the current render flow in the given pipeline
     * @zh 为指定的渲染管线开启当前渲染流程
     * @param pipeline The render pipeline to activate this render flow
     */
    public activate (pipeline: RenderPipeline) {
        this._pipeline = pipeline;
        this._stages.sort((a, b) => a.priority - b.priority);

        for (let i = 0, len = this._stages.length; i < len; i++) {
            this._stages[i].activate(pipeline, this);
        }
    }

    /**
     * @en Render function, it basically run all render stages in sequence for the given view.
     * @zh 渲染函数，对指定的渲染视图按顺序执行所有渲染阶段。
     * @param view Render view。
     */
    public render (camera: Camera) {
        for (let i = 0, len = this._stages.length; i < len; i++) {
            if (this._stages[i].enabled) this._stages[i].render(camera);
        }
    }

    /**
     * @en Destroy function.
     * @zh 销毁函数。
     */
    public destroy () {
        for (let i = 0, len = this._stages.length; i < len; i++) {
            this._stages[i].destroy();
        }

        this._stages.length = 0;
    }
}

legacyCC.RenderFlow = RenderFlow;
