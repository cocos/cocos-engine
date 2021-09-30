import { serializable } from 'cc.decorator';
import { ccclass } from '../../data/class-decorator';
import { EditorExtendable } from '../../data/editor-extendable';
import { createEval } from './create-eval';
import { Motion, MotionEval, MotionEvalContext } from './motion';
import { AnimationBlend, AnimationBlendEval, AnimationBlendItem } from './animation-blend';
import { CLASS_NAME_PREFIX_ANIM } from '../define';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationBlendDirectItem`)
class AnimationBlendDirectItem extends AnimationBlendItem {
    @serializable
    public weight = 0.0;

    public clone () {
        const that = new AnimationBlendDirectItem();
        this._assign(that);
        return that;
    }

    protected _assign (that: AnimationBlendDirectItem) {
        super._assign(that);
        that.weight = this.weight;
        return that;
    }
}

@ccclass('cc.animation.AnimationBlendDirect')
export class AnimationBlendDirect extends EditorExtendable implements AnimationBlend {
    public static Item = AnimationBlendDirectItem;

    @serializable
    private _items: AnimationBlendDirectItem[] = [];

    get items () {
        return this._items;
    }

    set items (value) {
        this._items = Array.from(value);
    }

    public clone () {
        const that = new AnimationBlendDirect();
        that._items = this._items.map((item) => item?.clone() ?? null);
        return that;
    }

    public [createEval] (context: MotionEvalContext) {
        const myEval = new AnimationBlendDirectEval(
            context,
            this._items,
            this._items.map(({ weight }) => weight),
        );
        return myEval;
    }
}

export declare namespace AnimationBlendDirect {
    export type Item = typeof AnimationBlendDirectItem;
}

class AnimationBlendDirectEval extends AnimationBlendEval {
    constructor (...args: ConstructorParameters<typeof AnimationBlendEval>) {
        super(...args);
        this.doEval();
    }

    protected eval (weights: number[], inputs: readonly number[]) {
        const nChildren = weights.length;
        for (let iChild = 0; iChild < nChildren; ++iChild) {
            weights[iChild] = inputs[iChild];
        }
    }
}
