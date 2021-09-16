import { serializable } from 'cc.decorator';
import { ccclass } from '../../data/class-decorator';
import { createEval } from './create-eval';
import { Pose, PoseEval, PoseEvalContext } from './pose';
import { PoseBlend, PoseBlendEval } from './pose-blend';

@ccclass('cc.animation.PoseBlendDirect')
export class PoseBlendDirect implements PoseBlend {
    @serializable
    private _poseAndWeights: [(Pose | null), number][] = [];

    constructor () {
    }

    get children () {
        return this._poseAndWeights;
    }

    set children (children: Iterable<[Pose | null, number]>) {
        this._poseAndWeights = [...children];
    }

    public [createEval] (context: PoseEvalContext) {
        const myEval = new PoseBlendDirectEval(
            context,
            this._poseAndWeights.map(([pose]) => pose),
            this._poseAndWeights.map(([_, weight]) => weight),
        );
        return myEval;
    }
}

class PoseBlendDirectEval extends PoseBlendEval {
    constructor (...args: ConstructorParameters<typeof PoseBlendEval>) {
        super(...args);
        this.doEval();
    }

    protected eval (weights: number[], inputs: readonly number[]) {
        const nPoses = weights.length;
        for (let iPose = 0; iPose < nPoses; ++iPose) {
            weights[iPose] = inputs[iPose];
        }
    }
}
