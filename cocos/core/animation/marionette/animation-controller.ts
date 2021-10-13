import { Component } from '../../components';
import { AnimationGraph } from './animation-graph';
import { property, ccclass, menu } from '../../data/class-decorator';
import { AnimationGraphEval } from './graph-eval';
import type { StateStatus, TransitionStatus, ClipStatus } from './graph-eval';
import { Value } from './variable';
import { assertIsNonNullable } from '../../data/utils/asserts';

export type {
    StateStatus,
    ClipStatus,
    TransitionStatus,
};

@ccclass('cc.animation.AnimationController')
@menu('Components/Animation/Animation Controller')
export class AnimationController extends Component {
    @property(AnimationGraph)
    public graph: AnimationGraph | null = null;

    private _graphEval: AnimationGraphEval | null = null;

    public start () {
        if (this.graph) {
            this._graphEval = new AnimationGraphEval(this.graph, this.node, this);
        }
    }

    public update (deltaTime: number) {
        this._graphEval?.update(deltaTime);
    }

    public setValue (name: string, value: Value) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        graphEval.setValue(name, value);
    }

    public getCurrentStateStatus (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentStateStatus(layer);
    }

    public getCurrentClipStatuses (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentClipStatuses(layer);
    }

    public getCurrentTransition (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentTransition(layer);
    }

    public getNextStateStatus (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getNextStateStatus(layer);
    }

    public getNextClipStatuses (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getNextClipStatuses(layer);
    }
}
