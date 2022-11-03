import { Component } from '../../scene-graph/component';
import { AnimationGraph } from './animation-graph';
import type { AnimationGraphRunTime } from './animation-graph';
import { _decorator, assertIsNonNullable } from '../../core';
import { AnimationGraphEval } from './graph-eval';
import type { MotionStateStatus, TransitionStatus, ClipStatus } from './graph-eval';
import { Value } from './variable';

const { ccclass, menu, property } = _decorator;

export type {
    MotionStateStatus,
    ClipStatus,
    TransitionStatus,
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
export class AnimationController extends Component {
    /**
     * @zh
     * 动画控制器所关联的动画图。
     * @en
     * The animation graph associated with the animation controller.
     */
    @property(AnimationGraph)
    public graph: AnimationGraphRunTime | null = null;

    private _graphEval: AnimationGraphEval | null = null;

    public __preload () {
        if (this.graph) {
            this._graphEval = new AnimationGraphEval(this.graph as AnimationGraph, this.node, this);
        }
    }

    public update (deltaTime: number) {
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
    public getVariables () {
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
    public setValue (name: string, value: Value) {
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
    public getValue (name: string) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getValue(name);
    }

    /**
     * @zh 获取动画图实例中当前状态的运行状况。
     * @en Gets the running status of the current state in the animation graph instance.
     * @param layer @en Index of the layer. @zh 层级索引。
     * @returns @en The running status of the current state.
     *          @zh 当前的状态运作状态对象。
     */
    public getCurrentStateStatus (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentStateStatus(layer);
    }

    /**
     * @zh 获取动画图实例中当前状态上包含的所有动画剪辑的运行状况。
     * @en Gets the running status of all the animation clips added on the current state in the animation graph instance.
     * @param layer @en Index of the layer. @zh 层级索引。
     * @returns @en Iterable to the animation clip statuses on current state.
     *          @zh 到动画剪辑运作状态的迭代器。
     */
    public getCurrentClipStatuses (layer: number) {
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
    public getCurrentTransition (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentTransition(layer);
    }

    /**
     * @zh 获取动画图实例中下一个状态的运行状况。
     * @en Gets the running status of the next state in the animation graph instance.
     * @param layer @en Index of the layer. @zh 层级索引。
     * @returns @en The running status of the next state. `null` is returned in case of no transition.
     *          @zh 下一状态运作状态对象，若未在进行过渡，则返回 `null`。
     */
    public getNextStateStatus (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getNextStateStatus(layer);
    }

    /**
     * @zh 获取动画图实例中下一个状态上添加的所有动画剪辑的运行状况。
     * @en Gets the running status of all the animation clips added on the next state in the animation graph instance.
     * @param layer @en Index of the layer. @zh 层级索引。
     * @returns @en Iterable to the animation clip statuses on next state. An empty iterable is returned in case of no transition.
     *          @zh 到下一状态上包含的动画剪辑运作状态的迭代器，若未在进行过渡，则返回一个空的迭代器。
     */
    public getNextClipStatuses (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getNextClipStatuses(layer);
    }

    /**
     * @zh 获取层级权重。
     * @en Gets the weight of specified layer.
     * @param layer @en Index of the layer. @zh 层级索引。
     */
    public getLayerWeight (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getLayerWeight(layer);
    }

    /**
     * @zh 设置层级权重。
     * @en Sets the weight of specified layer.
     * @param layer @en Index of the layer. @zh 层级索引。
     */
    public setLayerWeight (layer: number, weight: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.setLayerWeight(layer, weight);
    }
}
