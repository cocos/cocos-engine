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

import { Camera } from '../renderer/scene/camera';
import { CAMERA_DEFAULT_MASK, IRenderViewInfo } from './define';
import { RenderFlowTag } from './pipeline-serialization';
import { RenderFlow } from './render-flow';
import { legacyCC } from '../global-exports';
import { RenderWindow } from '../renderer/core/render-window';

/**
 * @en The predefined priority of render view
 * @zh 预设渲染视图优先级。
 */
export enum RenderViewPriority {
    GENERAL = 100,
}

/**
 * @en Render target information descriptor
 * @zh 渲染目标描述信息。
 */
export interface IRenderTargetInfo {
    width?: number;
    height?: number;
}

/**
 * @en Render view represents a view from its camera, it also manages a list of [[RenderFlow]]s which will be executed for it.
 * @zh 渲染视图代表了它的相机所拍摄的视图，它也管理一组在视图上执行的 [[RenderFlow]]。
 */
export class RenderView {

    /**
     * @en Name
     * @zh 名称。
     */
    get name () {
        return this._name;
    }

    /**
     * @en The GFX window
     * @zh GFX 窗口。
     */
    get window () {
        return this._window!;
    }

    set window (val) {
        this._window = val;
    }

    /**
     * @en The priority among other render views, used for sorting.
     * @zh 在所有 RenderView 中的优先级，用于排序。
     */
    get priority () {
        return this._priority;
    }

    set priority (val) {
        this._priority = val;
        if (legacyCC.director.root) {
            legacyCC.director.root.sortViews();
        }
    }

    /**
     * @en The visibility is a mask which allows nodes in the scene be seen by the current view if their [[Node.layer]] bit is included in this mask.
     * @zh 可见性是一个掩码，如果场景中节点的 [[Node.layer]] 位被包含在该掩码中，则对应节点对该视图是可见的。
     */
    set visibility (vis) {
        this._visibility = vis;
    }
    get visibility () {
        return this._visibility;
    }

    /**
     * @en The camera correspond to this render view
     * @zh 该视图对应的相机。
     * @readonly
     */
    get camera (): Camera {
        return this._camera!;
    }

    /**
     * @en Whether the view is enabled
     * @zh 是否启用。
     * @readonly
     */
    get isEnable (): boolean {
        return this._isEnable;
    }

    /**
     * @en Render flow list
     * @zh 渲染流程列表。
     * @readonly
     */
    get flows (): RenderFlow[] {
        return this._flows;
    }

    private _name: string = '';
    private _window: RenderWindow | null = null;
    private _priority: number = 0;
    private _visibility: number = CAMERA_DEFAULT_MASK;
    private _camera!: Camera;
    private _isEnable: boolean = false;
    private _flows: RenderFlow[] = [];

    /**
     * @en The constructor
     * @zh 构造函数。
     * @param camera
     */
    public constructor () {
    }

    /**
     * @en Initialization function with a render view information descriptor
     * @zh 使用一个渲染视图描述信息来初始化。
     * @param info Render view information descriptor
     */
    public initialize (info: IRenderViewInfo): boolean {
        this._camera = info.camera;
        this._name = info.name;
        this.priority = info.priority;
        this.setExecuteFlows(info.flows);

        return true;
    }

    /**
     * @en The destroy function
     * @zh 销毁函数。
     */
    public destroy () {
        this._window = null;
        this._priority = 0;
    }

    /**
     * @en Enable or disable this render view
     * @zh 启用或禁用该渲染视图。
     * @param isEnable Whether to enable or disable this view
     */
    public enable (isEnable: boolean) {
        this._isEnable = isEnable;
    }

    /**
     * @en Set the execution render flows with their names, the flows found in the pipeline will then be executed for this view in the render process
     * @zh 使用对应的名字列表设置需要执行的渲染流程，所有在渲染管线中找到的对应渲染流程都会用来对当前视图执行渲染。
     * @param flows The names of all [[RenderFlow]]s
     */
    public setExecuteFlows (flows: string[] | undefined) {
        this._flows.length = 0;
        const pipeline = legacyCC.director.root.pipeline;
        const pipelineFlows = pipeline.flows;
        if (flows && flows.length === 1 && flows[0] === 'UIFlow') {
            for (let i = 0; i < pipelineFlows.length; i++) {
                if (pipelineFlows[i].name === 'UIFlow') {
                    this._flows.push(pipelineFlows[i]);
                    break;
                }
            }
            return;
        }
        for (let i = 0; i < pipelineFlows.length; ++i) {
            const f = pipelineFlows[i];
            if (f.tag === RenderFlowTag.SCENE || (flows && flows.indexOf(f.name) !== -1)) {
                this._flows.push(f);
            }
        }
    }

    public onGlobalPipelineStateChanged () {
        const pipeline = legacyCC.director.root.pipeline;
        const pipelineFlows = pipeline.flows;
        for (let i = 0; i < this._flows.length; ++i) {
            const flow = this._flows[i];
            for (let j = 0; j < pipelineFlows.length; j++) {
                if (pipelineFlows[j].name === flow.name) {
                    this._flows[i] = pipelineFlows[j];
                    break;
                }
            }
        }
    }
}
