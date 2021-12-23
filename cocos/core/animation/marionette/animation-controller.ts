import { Component } from '../../components';
import { AnimationGraph } from './animation-graph';
import type { AnimationGraphRunTime } from './animation-graph';
import { property, ccclass, menu } from '../../data/class-decorator';
import { AnimationGraphEval } from './graph-eval';
import type { MotionStateStatus, TransitionStatus, ClipStatus } from './graph-eval';
import { Value } from './variable';
import { assertIsNonNullable } from '../../data/utils/asserts';

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
 * 动画控制器组件应用动画图到它所附加到的结点。
 * 当控制器开始时，动画图会被实例化。接着，可以设置动画图实例中的变量或查询动画图的运作状态。
 */
@ccclass('cc.animation.AnimationController')
@menu('Animation/Animation Controller')
export class AnimationController extends Component {
    /**
     * @zh
     * 该控制器关联的动画图。
     * @en
     * The animation graph this controller associate with.
     */
    @property(AnimationGraph)
    public graph: AnimationGraphRunTime | null = null;

    private _graphEval: AnimationGraphEval | null = null;

    public start () {
        if (this.graph) {
            this._graphEval = new AnimationGraphEval(this.graph as AnimationGraph, this.node, this);
        }
    }

    public update (deltaTime: number) {
        this._graphEval?.update(deltaTime);
    }

    /**
     * @zh 获取动画图中的所有变量。
     * @en Gets variables of the animation graph.
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
     * @en Sets value of the specified variable.
     * @param name 变量名称。
     * @param value 要设置的值。
     */
    public setValue (name: string, value: Value) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        graphEval.setValue(name, value);
    }

    /**
     * @zh 获取动画图实例中变量的值。
     * @en Gets value of the specified variable.
     * @param name 变量名称。
     * @returns 变量当前的值。
     */
    public getValue (name: string) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getValue(name);
    }

    /**
     * @zh 获取动画图实例中当前动画状态的运作状态。
     * @en Gets the status of the current motion state.
     * @param layer 层级索引。（必须为 `0`）
     * @returns 当前的状态运作状态对象。
     */
    public getCurrentStateStatus (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentStateStatus(layer);
    }

    /**
     * @zh 获取动画图实例中当前状态上包含的所有动画剪辑的运作状态。
     * @en Gets the clip statuses contained in current motion state.
     * @param layer 层级索引。（必须为 `0`）
     * @returns 到动画剪辑运作状态的迭代器。
     */
    public getCurrentClipStatuses (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentClipStatuses(layer);
    }

    /**
     * @zh 获取动画图实例中当前正在进行的过渡的运作状态。
     * @en Gets the status of the current transition.
     * @param layer 层级索引。（必须为 `0`）
     * @returns 当前正在进行的过渡，若未在进行过渡，则返回 `null`。
     */
    public getCurrentTransition (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentTransition(layer);
    }

    /**
     * @zh 获取动画图实例中下一状态的运作状态。
     * @en Gets the status of the next motion state.
     * @param layer 层级索引。（必须为 `0`）
     * @returns 下一状态运作状态对象，若未在进行过渡，则返回 `null`。
     */
    public getNextStateStatus (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getNextStateStatus(layer);
    }

    /**
     * @zh 获取动画图实例中下一状态上包含的所有动画剪辑的运作状态。
     * @en Gets the clip statuses contained in current motion state.
     * @param layer 层级索引。（必须为 `0`）
     * @returns 到下一状态上包含的动画剪辑运作状态的迭代器，若未在进行过渡，则返回一个空的迭代器。
     */
    public getNextClipStatuses (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getNextClipStatuses(layer);
    }
}
