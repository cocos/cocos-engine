import { serializable } from 'cc.decorator';
import { ccclass } from '../../data/class-decorator';
import { createEval } from './create-eval';
import { BindableNumber, bindOr } from './parametric';
import { Pose, PoseEval, PoseEvalContext } from './pose';
import { PoseBlend, PoseBlendEval, validateBlendParam } from './pose-blend';
import { blend1D } from './blend-1d';
import { VariableType } from '.';
import { EditorExtendable } from '../../data/editor-extendable';

@ccclass('cc.animation.Blender1D')
export class PoseBlend1D extends EditorExtendable implements PoseBlend {
    @serializable
    protected _poses: (Pose | null)[] = [];

    @serializable
    private _thresholds: number[] = [];

    @serializable
    public param = new BindableNumber();

    get children () {
        return this._listChildren();
    }

    set children (children: Iterable<[Pose | null, number]>) {
        const sorted = [...children].sort(([, x], [, y]) => x - y);
        this._poses = sorted.map(([pose]) => pose);
        this._thresholds = sorted.map(([, threshold]) => threshold);
    }

    public [createEval] (context: PoseEvalContext) {
        const evaluation = new PoseBlend1DEval(context, this._poses, this._thresholds, 0.0);
        const initialValue = bindOr(
            context,
            this.param,
            VariableType.NUMBER,
            evaluation.setInput,
            evaluation,
            0,
        );
        evaluation.setInput(initialValue, 0);
        return evaluation;
    }

    private* _listChildren (): Iterable<[Pose | null, number]> {
        for (let iChild = 0; iChild < this._thresholds.length; ++iChild) {
            yield [
                this._poses[iChild],
                this._thresholds[iChild],
            ];
        }
    }
}

class PoseBlend1DEval extends PoseBlendEval {
    private declare _thresholds: readonly number[];

    constructor (context: PoseEvalContext, poses: Array<Pose | null>, thresholds: readonly number[], input: number) {
        super(context, poses, [input]);
        this._thresholds = thresholds;
        this.doEval();
    }

    protected eval (weights: number[], [value]: readonly [number]) {
        blend1D(weights, this._thresholds, value);
    }
}
