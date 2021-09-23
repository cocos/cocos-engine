import { Component } from '../../components';
import { PoseGraph } from './pose-graph';
import { property, ccclass, menu } from '../../data/class-decorator';
import { PoseGraphEval, PoseNodeStats, TransitionStatus, PoseStatus } from './graph-eval';
import { Value } from './variable';
import { assertIsNonNullable } from '../../data/utils/asserts';

export type {
    PoseNodeStats,
    PoseStatus,
    TransitionStatus,
};

@ccclass('cc.animation.AutomataAnimation')
@menu('Components/Animation/Automata Animation')
export class AutomataAnimation extends Component {
    @property(PoseGraph)
    public graph: PoseGraph | null = null;

    private _graphEval: PoseGraphEval | null = null;

    public start () {
        if (this.graph) {
            this._graphEval = new PoseGraphEval(this.graph, this.node, this);
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

    public getCurrentPoseNodeStats (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentPoseNodeStats(layer);
    }

    public getCurrentPoses (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentPoses(layer);
    }

    public getCurrentTransition (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getCurrentTransition(layer);
    }

    public getNextPoseNodeStats (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getNextPoseNodeStats(layer);
    }

    public getNextPoses (layer: number) {
        const { _graphEval: graphEval } = this;
        assertIsNonNullable(graphEval);
        return graphEval.getNextPoses(layer);
    }
}

export {
    AutomataAnimation as NewGenAnim,
};
