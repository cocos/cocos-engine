import { serializable } from 'cc.decorator';
import { ccclass } from '../../data/class-decorator';
import { createEval } from './create-eval';
import { BindingHost, parametricNum } from './parametric';
import { Pose, PoseEval, PoseEvalContext } from './pose';
import { PoseBlend, PoseBlendEval, validateBlendParam } from './pose-blend';
import { blend1D } from './blend-1d';

@ccclass('cc.animation.Blender1D')
export class PoseBlend1D extends BindingHost implements PoseBlend {
    @serializable
    protected _poses: (Pose | null)[] = [];

    @serializable
    private _thresholds: number[] = [];

    @serializable
    private _param = 0.0;

    constructor () {
        super();
    }

    get children () {
        return this._listChildren();
    }

    set children (children: Iterable<[Pose | null, number]>) {
        const sorted = [...children].sort(([, x], [, y]) => x - y);
        this._poses = sorted.map(([pose]) => pose);
        this._thresholds = sorted.map(([, threshold]) => threshold);
    }

    @parametricNum<[PoseBlend1DEval]>({
        notify: (value, host) => {
            validateBlendParam(value, 'param');
            host.setInput(value, 0);
        },
    })
    get param () {
        return this._param;
    }

    set param (value: number) {
        this._param = value;
    }

    public [createEval] (context: PoseEvalContext) {
        const param = context.getParam(this, 'param') ?? this._param;
        validateBlendParam(param, 'param');
        return new PoseBlend1DEval(context, this._poses, this._thresholds, param);
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
