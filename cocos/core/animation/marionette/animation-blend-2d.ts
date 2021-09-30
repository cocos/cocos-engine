import { Vec2 } from '../../math';
import { property, ccclass } from '../../data/class-decorator';
import { ccenum } from '../../value-types/enum';
import { createEval } from './create-eval';
import { AnimationBlend, AnimationBlendEval, AnimationBlendItem, validateBlendParam } from './animation-blend';
import { Motion, MotionEvalContext } from './motion';
import { serializable, type } from '../../data/decorators';
import { BindableNumber, bindOr } from './parametric';
import { sampleFreeformCartesian, sampleFreeformDirectional, blendSimpleDirectional } from './blend-2d';
import { VariableType } from '.';
import { EditorExtendable } from '../../data/editor-extendable';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

enum Algorithm {
    SIMPLE_DIRECTIONAL,
    FREEFORM_CARTESIAN,
    FREEFORM_DIRECTIONAL,
}

ccenum(Algorithm);

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationBlend2DItem`)
export class AnimationBlend2DItem extends AnimationBlendItem {
    @serializable
    public threshold = new Vec2();

    public clone () {
        const that = new AnimationBlend2DItem();
        this._assign(that);
        return that;
    }

    protected _assign (that: AnimationBlend2DItem) {
        super._assign(that);
        Vec2.copy(that.threshold, this.threshold);
        return that;
    }
}

@ccclass('cc.animation.AnimationBlend2D')
export class AnimationBlend2D extends EditorExtendable implements AnimationBlend {
    public static Algorithm = Algorithm;

    @serializable
    public algorithm = Algorithm.SIMPLE_DIRECTIONAL;

    @serializable
    private _items: AnimationBlend2DItem[] = [];

    @serializable
    public paramX = new BindableNumber();

    @serializable
    public paramY = new BindableNumber();

    get items (): Iterable<AnimationBlend2DItem> {
        return this._items;
    }

    set items (items) {
        this._items = Array.from(items);
    }

    public clone () {
        const that = new AnimationBlend2D();
        that._items = this._items.map((item) => item?.clone() ?? null);
        that.paramX = this.paramX.clone();
        that.paramY = this.paramY.clone();
        return that;
    }

    public [createEval] (context: MotionEvalContext) {
        const evaluation = new AnimationBlend2DDEval(context, this._items, this._items.map(({ threshold }) => threshold), this.algorithm, [0.0, 0.0]);
        const initialValueX = bindOr(
            context,
            this.paramX,
            VariableType.NUMBER,
            evaluation.setInput,
            evaluation,
            0,
        );
        const initialValueY = bindOr(
            context,
            this.paramY,
            VariableType.NUMBER,
            evaluation.setInput,
            evaluation,
            1,
        );
        evaluation.setInput(initialValueX, 0);
        evaluation.setInput(initialValueY, 1);
        return evaluation;
    }
}

export declare namespace AnimationBlend2D {
    export type Algorithm = typeof Algorithm;
}

class AnimationBlend2DDEval extends AnimationBlendEval {
    private _thresholds: readonly Vec2[];
    private _algorithm: Algorithm;
    private _value = new Vec2();

    constructor (
        context: MotionEvalContext,
        items: AnimationBlendItem[],
        thresholds: readonly Vec2[],
        algorithm: Algorithm,
        inputs: [number, number],
    ) {
        super(context, items, inputs);
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
