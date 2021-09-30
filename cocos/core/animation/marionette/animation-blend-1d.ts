import { serializable } from 'cc.decorator';
import { ccclass } from '../../data/class-decorator';
import { createEval } from './create-eval';
import { BindableNumber, bindOr } from './parametric';
import { Motion, MotionEval, MotionEvalContext } from './motion';
import { AnimationBlend, AnimationBlendEval, AnimationBlendItem, validateBlendParam } from './animation-blend';
import { blend1D } from './blend-1d';
import { VariableType } from '.';
import { EditorExtendable } from '../../data/editor-extendable';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationBlend1DItem`)
class AnimationBlend1DItem extends AnimationBlendItem {
    @serializable
    public threshold = 0.0;

    public clone () {
        const that = new AnimationBlend1DItem();
        this._assign(that);
        return that;
    }

    protected _assign (that: AnimationBlend1DItem) {
        super._assign(that);
        that.threshold = this.threshold;
        return that;
    }
}

@ccclass('cc.animation.AnimationBlend1D')
export class AnimationBlend1D extends AnimationBlend {
    public static Item = AnimationBlend1DItem;

    @serializable
    private _items: AnimationBlend1DItem[] = [];

    @serializable
    public param = new BindableNumber();

    get items (): Iterable<AnimationBlend1DItem> {
        return this._items;
    }

    set items (value) {
        this._items = Array.from(value)
            .sort(({ threshold: lhs }, { threshold: rhs }) => lhs - rhs);
    }

    public clone () {
        const that = new AnimationBlend1D();
        that._items = this._items.map((item) => item.clone());
        that.param = this.param.clone();
        return that;
    }

    public [createEval] (context: MotionEvalContext) {
        const evaluation = new AnimationBlend1DEval(context, this._items, this._items.map(({ threshold }) => threshold), 0.0);
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
}

export declare namespace AnimationBlend1D {
    export type Item = AnimationBlend1DItem;
}

class AnimationBlend1DEval extends AnimationBlendEval {
    private declare _thresholds: readonly number[];

    constructor (context: MotionEvalContext, items: AnimationBlendItem[], thresholds: readonly number[], input: number) {
        super(context, items, [input]);
        this._thresholds = thresholds;
        this.doEval();
    }

    protected eval (weights: number[], [value]: readonly [number]) {
        blend1D(weights, this._thresholds, value);
    }
}
