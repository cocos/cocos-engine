import { Vec2 } from '../../math';
import { property, ccclass } from '../../data/class-decorator';
import { ccenum } from '../../value-types/enum';
import { createEval } from './create-eval';
import { PoseBlend, PoseBlendEval, validateBlendParam } from './pose-blend';
import { Pose, PoseEvalContext } from './pose';
import { serializable, type } from '../../data/decorators';
import { BindableNumber, bindOr } from './parametric';
import { sampleFreeformCartesian, sampleFreeformDirectional, blendSimpleDirectional } from './blend-2d';

enum Algorithm {
    SIMPLE_DIRECTIONAL,
    FREEFORM_CARTESIAN,
    FREEFORM_DIRECTIONAL,
}

ccenum(Algorithm);

@ccclass('cc.animation.Blender2D')
export class PoseBlend2D implements PoseBlend {
    public static Algorithm = Algorithm;

    @serializable
    public algorithm = Algorithm.SIMPLE_DIRECTIONAL;

    @serializable
    protected poses: (Pose | null)[] = [];

    @type([Vec2])
    private _thresholds: Vec2[] = [];

    @serializable
    public paramX = new BindableNumber();

    @serializable
    public paramY = new BindableNumber();

    get children () {
        return this._listChildren();
    }

    set children (children: Iterable<[Pose | null, Vec2]>) {
        const childArray = [...children];
        this.poses = childArray.map(([pose]) => pose);
        this._thresholds = childArray.map(([, threshold]) => threshold);
    }

    get thresholds () {
        return this._thresholds;
    }

    set thresholds (thresholds: readonly Vec2[]) {
        this._thresholds = thresholds.slice().map((threshold) => threshold.clone());
    }

    public [createEval] (context: PoseEvalContext) {
        const evaluation = new PoseBlend2DDEval(context, this.poses, this.thresholds, this.algorithm, [0.0, 0.0]);
        const initialValueX = bindOr(
            context,
            this.paramX,
            evaluation.setInput,
            evaluation,
            0,
        );
        const initialValueY = bindOr(
            context,
            this.paramY,
            evaluation.setInput,
            evaluation,
            1,
        );
        evaluation.setInput(initialValueX, 0);
        evaluation.setInput(initialValueY, 1);
        return evaluation;
    }

    private* _listChildren (): Iterable<[Pose | null, Vec2]> {
        for (let iChild = 0; iChild < this._thresholds.length; ++iChild) {
            yield [
                this.poses[iChild],
                this._thresholds[iChild],
            ];
        }
    }
}

export declare namespace PoseBlend2D {
    export type Algorithm = typeof Algorithm;
}

class PoseBlend2DDEval extends PoseBlendEval {
    private _thresholds: readonly Vec2[];
    private _algorithm: Algorithm;
    private _value = new Vec2();

    constructor (context: PoseEvalContext, poses: Array<Pose | null>, thresholds: readonly Vec2[], algorithm: Algorithm, inputs: [number, number]) {
        super(context, poses, inputs);
        this._thresholds = thresholds;
        this._algorithm = algorithm;
        this.doEval();
    }

    protected eval (weights: number[], [x, y]: [number, number]) {
        Vec2.set(this._value, x, y);
        weights.fill(0);
        switch (this._algorithm) {
        case Algorithm.SIMPLE_DIRECTIONAL:
            blendSimpleDirectional(weights, this._thresholds, this._value);
            break;
        case Algorithm.FREEFORM_CARTESIAN:
            sampleFreeformCartesian(weights, this._thresholds, this._value);
            break;
        case Algorithm.FREEFORM_DIRECTIONAL:
            sampleFreeformDirectional(weights, this._thresholds, this._value);
            break;
        default:
            break;
        }
    }
}
