import { Component } from '../../components';
import { PoseGraph } from './pose-graph';
import { property, ccclass, menu } from '../../data/class-decorator';
import { PoseGraphEval } from './graph-eval';
import { Value } from './variable';

@ccclass('cc.animation.NewGenAnim')
@menu('Components/animation/NewGenAnim')
export class NewGenAnim extends Component {
    @property(PoseGraph)
    public graph: PoseGraph | null = null;

    private _graphEval: PoseGraphEval | null = null;

    public start () {
        if (this.graph) {
            this._graphEval = new PoseGraphEval(this.graph, this.node);
        }
    }

    public update (deltaTime: number) {
        this._graphEval?.update(deltaTime);
    }

    public setValue (name: string, value: Value) {
        this._graphEval?.setValue(name, value);
    }
}
