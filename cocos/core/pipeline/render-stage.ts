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

import { ccclass, displayOrder, serializable } from 'cc.decorator';
import { legacyCC } from '../global-exports';
import { RenderPipeline } from './render-pipeline';
import { RenderFlow } from './render-flow';
import { RenderQueueDesc } from './pipeline-serialization';
import { Camera } from '../renderer/scene';

/**
 * @en The render stage information descriptor
 * @zh 渲染阶段描述信息。
 */
export interface IRenderStageInfo {
    name: string;
    priority: number;
    tag?: number;
    renderQueues?: RenderQueueDesc[];
}

/**
 * @en The render stage actually renders render objects to the output window or other GFX [[FrameBuffer]].
 * Typically, a render stage collects render objects it's responsible for, clear the camera,
 * record and execute command buffer, and at last present the render result.
 * @zh 渲染阶段是实质上的渲染执行者，它负责收集渲染数据并执行渲染将渲染结果输出到屏幕或其他 GFX [[FrameBuffer]] 中。
 * 典型的渲染阶段会收集它所管理的渲染对象，按照 [[Camera]] 的清除标记进行清屏，记录并执行渲染指令缓存，并最终呈现渲染结果。
 */
@ccclass('RenderStage')
export abstract class RenderStage {
    /**
     * @en Name of the current stage
     * @zh 当前渲染阶段的名字。
     */
    public get name (): string {
        return this._name;
    }

    /**
     * @en Priority of the current stage
     * @zh 当前渲染阶段的优先级。
     */
    public get priority (): number {
        return this._priority;
    }

    /**
     * @en Tag of the current stage
     * @zh 当前渲染阶段的标签。
     */
    public get tag (): number {
        return this._tag;
    }

    /**
     * @en Name
     * @zh 名称。
     */
    @displayOrder(0)
    @serializable
    protected _name: string = '';

    /**
     * @en Priority
     * @zh 优先级。
     */
    @displayOrder(1)
    @serializable
    protected _priority: number = 0;

    /**
     * @en Type
     * @zh 类型。
     */
    @displayOrder(2)
    @serializable
    protected _tag: number = 0;
    protected _pipeline!: RenderPipeline;
    protected _flow!: RenderFlow;

    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render stage information
     */
    public initialize (info: IRenderStageInfo): boolean {
        this._name = info.name;
        this._priority = info.priority;
        if (info.tag) { this._tag = info.tag; }
        return true;
    }

    /**
     * @en Activate the current render stage in the given render flow
     * @zh 为指定的渲染流程开启当前渲染阶段
     * @param flow The render flow to activate this render stage
     */
    public activate (pipeline: RenderPipeline, flow: RenderFlow) {
        this._pipeline = pipeline;
        this._flow = flow;
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
    public abstract render (camera: Camera);
}

legacyCC.RenderStage = RenderStage;
