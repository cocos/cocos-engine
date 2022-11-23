import { _decorator } from '../../core';
import { createEval } from './create-eval';
import { MotionEvalContext } from './motion';
import { AnimationBlend, AnimationBlendEval, AnimationBlendItem } from './animation-blend';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { AnimationGraphLayerWideBindingContext } from './animation-graph-context';
import { ReadonlyClipOverrideMap } from './graph-eval';

const { ccclass, serializable } = _decorator;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationBlendDirectItem`)
class AnimationBlendDirectItem extends AnimationBlendItem {
    @serializable
    public weight = 0.0;

    public clone () {
        const that = new AnimationBlendDirectItem();
        this._copyTo(that);
        return that;
    }

    protected _copyTo (that: AnimationBlendDirectItem) {
        super._copyTo(that);
        that.weight = this.weight;
        return that;
    }
}

@ccclass('cc.animation.AnimationBlendDirect')
export class AnimationBlendDirect extends AnimationBlend {
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
        this.copyTo(that);
        that._items = this._items.map((item) => item?.clone() ?? null);
        return that;
    }

    public [createEval] (context: AnimationGraphLayerWideBindingContext, clipOverrides: ReadonlyClipOverrideMap | null) {
        const myEval = new AnimationBlendDirectEval(
            context,
            clipOverrides,
            this,
            this._items,
            this._items.map(({ weight }) => weight),
        );
        return myEval;
    }
}

export declare namespace AnimationBlendDirect {
    export type Item = AnimationBlendDirectItem;
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
