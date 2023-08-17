/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { DEBUG } from 'internal:constants';
import { Component } from '../../scene-graph/component';
import { AnimationGraph } from './animation-graph';
import type { AnimationGraphRunTime } from './animation-graph';
import { EventTarget, _decorator, assertIsNonNullable, assertIsTrue, warn } from '../../core';
import { AnimationGraphEval } from './graph-eval';
import type { MotionStateStatus, TransitionStatus, ClipStatus } from './state-machine/state-machine-eval';
import { PrimitiveValue, Value, VariableType } from './variable';
import { AnimationGraphVariant, AnimationGraphVariantRunTime } from './animation-graph-variant';
import { AnimationGraphLike } from './animation-graph-like';
import type { ReadonlyClipOverrideMap } from './clip-overriding';

const { ccclass, menu, help, type, serializable, editable, formerlySerializedAs } = _decorator;

export type {
    MotionStateStatus,
    ClipStatus,
    TransitionStatus,
    ReadonlyClipOverrideMap,
};

/**
 * @en
 * The animation controller component applies an animation graph
 * to the node which it's attached to.
 * When the controller starts, the animation graph is instantiated.
 * Then you may set variables or query the running statuses of the animation graph instance.
 * @zh
 * 将动画图应用到动画控制器组件所挂载的节点上。
 * 当动画控制器开始运行时，动画图会被实例化。然后便可以设置动画图实例中的变量或者查询动画图的运行状况。
 */
@ccclass('cc.animation.AnimationController')
@menu('Animation/Animation Controller')
@help('i18n:cc.animation.AnimationController')
export class AnimationController extends Component {
    /**
     * @zh
     * 动画控制器所关联的动画图。
     * @en
     * The animation graph associated with the animation controller.
     */
    @type(AnimationGraphLike)
    @editable
    public get graph (): AnimationGraphRunTime | AnimationGraphVariantRunTime | null {
        return this._graph;
    }

    public set graph (value) {
        this._graph = value;
    }

    @serializable
    @formerlySerializedAs('graph')
    private _graph: AnimationGraphRunTime | AnimationGraphVariantRunTime | null = null;

    private _graphEval: AnimationGraphEval | null = null;

    /**
     * @zh 获取动画图的层级数量。如果控制器没有指定动画图，则返回 0。
     * @en Gets the count of layers in the animation graph.
     * If no animation graph is specified, 0 is returned.
     */
    public get layerCount (): number {
        return this._graphEval?.layerCount ?? 0;
    }

    public __preload (): void {
        const { graph } = this;
        if (graph) {
            let originalGraph: AnimationGraph;
            let clipOverrides: ReadonlyClipOverrideMap | null = null;
            if (graph instanceof AnimationGraphVariant) {
                if (!graph.original) {
                    return;
                }
                originalGraph = graph.original;
                clipOverrides = graph.clipOverrides;
            } else {
                assertIsTrue(graph instanceof AnimationGraph);
                originalGraph = graph;
            }
            const graphEval = new AnimationGraphEval(
                originalGraph,
                this.node,
                this,
                clipOverrides,
            );
            this._graphEval = graphEval;
        }
    }

    public onDestroy (): void {
        this._graphEval?.destroy();
    }

    public update (deltaTime: number): void {
        this._graphEval?.update(deltaTime);
    }

    /**
     * @zh 获取动画图中的所有变量。
     * @en Gets all the variables in the animation graph.
     * @returns The iterator to the variables.
     * @example
     * ```ts
     * for (const [name, { type }] of animationController.getVariables()) {
     *   log(`Name: ${name}, Type: ${type}`);
     * }
     * ```
     */
    public getVariables (): Iterable<readonly [string, Readonly<{
        type: VariableType;
    }>]> {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getVariables();
    }

    /**
     * @zh 设置动画图实例中变量的值。
     * @en Sets the value of the variable in the animation graph instance.
     * @param name @en Variable's name. @zh 变量的名称。
     * @param value @en Variable's value. @zh 变量的值。
     * @example
     * ```ts
     * animationController.setValue('speed', 3.14);
     * animationController.setValue('crouching', true);
     * animationController.setValue('attack', true);
     * ```
     */
    public setValue (name: string, value: PrimitiveValue): void {
        return this.setValue_experimental(name, value);
    }

    /**
     * @zh 设置动画图实例中变量的值。
     * @en Sets the value of the variable in the animation graph instance.
     * @param name @en Variable's name. @zh 变量的名称。
     * @param value @en Variable's value. @zh 变量的值。
     * @example
     * ```ts
     * animationController.setValue('speed', 3.14);
     * animationController.setValue('crouching', true);
     * animationController.setValue('attack', true);
     * ```
     * @experimental
     */
    public setValue_experimental (name: string, value: Value): void {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        graphEval.setValue(name, value);
    }

    /**
     * @zh 获取动画图实例中变量的值。
     * @en Gets the value of the variable in the animation graph instance.
     * @param name @en Variable's name. @zh 变量的名称。
     * @returns @en Variable's value. @zh 变量的值。
     */
    public getValue (name: string): PrimitiveValue | undefined {
        const value = this.getValue_experimental(name);
        if (typeof value === 'object') {
            if (DEBUG) {
                warn(`Obtaining variable "${name}" is not of primitive type, `
                    + `which is currently supported experimentally and should be explicitly obtained through this.getValue_experimental()`);
            }
            return undefined;
        } else {
            return value;
        }
    }

    /**
     * @zh 获取动画图实例中变量的值。
     * @en Gets the value of the variable in the animation graph instance.
     * @param name @en Variable's name. @zh 变量的名称。
     * @returns @en Variable's value. @zh 变量的值。
     */
    public getValue_experimental (name: string): Value | undefined {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getValue(name);
    }

    /**
     * @zh 获取动画图实例中当前状态的运行状况。
     * @en Gets the running status of the current state in the animation graph instance.
     * @param layer @en Index of the layer. @zh 层级索引。
     * @returns @en The running status of the current state. `null` is returned if current state is not a motion state.
     *          @zh 当前的状态运作状态对象。如果当前的状态不是动作状态，则返回 `null`。
     */
    public getCurrentStateStatus (layer: number): Readonly<MotionStateStatus> | null {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentStateStatus(layer);
    }

    /**
     * @zh 获取动画图实例中当前状态上包含的所有动画剪辑的运行状况。
     * @en Gets the running status of all the animation clips added on the current state in the animation graph instance.
     * @param layer @en Index of the layer. @zh 层级索引。
     * @returns @en Iterable to the animation clip statuses on current state.
     *              An empty iterable is returned if current state is not a motion state.
     *          @zh 到动画剪辑运作状态的迭代器。若当前状态不是动画状态，则返回一个空的迭代器。
     */
    public getCurrentClipStatuses (layer: number): Iterable<Readonly<ClipStatus>> {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentClipStatuses(layer);
    }

    /**
     * @zh 获取动画图实例中当前正在进行的过渡的运行状况。
     * @en Gets the running status of the transition currently in progress in the animation graph instance.
     * @param layer @en Index of the layer. @zh 层级索引。
     * @returns @en Current transition status. `null` is returned in case of no transition.
     *          @zh 当前正在进行的过渡，若没有进行任何过渡，则返回 `null`。
     */
    public getCurrentTransition (layer: number): Readonly<TransitionStatus> | null {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentTransition(layer);
    }

    /**
     * @zh 获取动画图实例中下一个状态的运行状况。
     * @en Gets the running status of the next state in the animation graph instance.
     * @param layer @en Index of the layer. @zh 层级索引。
     * @returns @en The running status of the next state. `null` is returned in case of no transition or if next state is not a motion state.
     *          @zh 下一状态运作状态对象，若未在进行过渡或下一状态不是动画状态，则返回 `null`。
     */
    public getNextStateStatus (layer: number): Readonly<MotionStateStatus> | null {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getNextStateStatus(layer);
    }

    /**
     * @zh 获取动画图实例中下一个状态上添加的所有动画剪辑的运行状况。
     * @en Gets the running status of all the animation clips added on the next state in the animation graph instance.
     * @param layer @en Index of the layer. @zh 层级索引。
     * @returns @en Iterable to the animation clip statuses on next state.
     *              An empty iterable is returned in case of no transition or next state is not a motion state.
     *          @zh 到下一状态上包含的动画剪辑运作状态的迭代器，若未在进行过渡或下一状态不是动画状态，则返回一个空的迭代器。
     */
    public getNextClipStatuses (layer: number): Iterable<Readonly<ClipStatus>> {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getNextClipStatuses(layer);
    }

    /**
     * @zh 获取层级权重。
     * @en Gets the weight of specified layer.
     * @param layer @en Index of the layer. @zh 层级索引。
     */
    public getLayerWeight (layer: number): number {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getLayerWeight(layer);
    }

    /**
     * @zh 设置层级权重。
     * @en Sets the weight of specified layer.
     * @param layer @en Index of the layer. @zh 层级索引。
     */
    public setLayerWeight (layer: number, weight: number): void {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.setLayerWeight(layer, weight);
    }

    /**
     * @zh 覆盖动画图实例中的动画剪辑。
     * 对于每一对源剪辑、目标剪辑，
     * 动画图（实例）中的出现的所有源剪辑都会被替换为目标剪辑，就好像动画图中一开始就使用的是目标剪辑。
     * 不过，动画图当前的运转状态会依然保持不变，例如：
     *
     * - 若动作状态涉及的动画剪辑被替换，动作状态的播放进度百分比依然保持不变。
     *
     * - 若过渡的周期是相对的，即使在某一刻动画过渡的源头被替换，那么过渡的进度百分比也依然保持不变。
     *
     * 不管进行多少次覆盖，源剪辑应该一直指定为原始动画图中的动画剪辑。例如：
     *
     * ```ts
     * // `originalClip` 是原始动画图中的剪辑对象，第一次希望将原剪辑覆盖为 `newClip1`，第二次希望将原剪辑覆盖为 `newClip2`
     * animationController.overrideClips_experimental(new Map([ [originalClip, newClip1] ])); // 第一次覆盖
     * animationController.overrideClips_experimental(new Map([ [newClip1, newClip2] ])); // 错误：第二次覆盖
     * animationController.overrideClips_experimental(new Map([ [originalClip, newClip2] ])); // 正确：第二次覆盖
     * ```
     * @en Overrides the animation clips in animation graph instance.
     * TODO
     * @experimental
     */
    public overrideClips_experimental (overrides: ReadonlyClipOverrideMap): void {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        graphEval.overrideClips(overrides);
    }

    /**
     * @zh 获取指定辅助曲线的当前值。
     * @en Gets the current value of specified auxiliary curve.
     * @param curveName @en Name of the auxiliary curve. @zh 辅助曲线的名字。
     * @returns @zh 指定辅助曲线的当前值，如果指定辅助曲线不存在或动画图为空则返回 0。
     * @en The current value of specified auxiliary curve,
     * or 0 if specified adjoint curve does not exist or if the animation graph is null.
     * @experimental
     */
    public getAuxiliaryCurveValue_experimental (curveName: string): number {
        const { _graphEval: graphEval } = this;
        if (!graphEval) {
            return 0.0;
        }
        return graphEval.getAuxiliaryCurveValue(curveName);
    }
}
