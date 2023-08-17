/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { _decorator } from '../../../core';
import { createEval } from '../create-eval';
import { BindableNumber, bindOr, VariableType } from '../parametric';
import { AnimationBlend, AnimationBlendEval, AnimationBlendItem } from './animation-blend';
import { blend1D } from './blend-1d';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import type { ReadonlyClipOverrideMap } from '../clip-overriding';
import { AnimationGraphBindingContext } from '../animation-graph-context';

const { ccclass, serializable } = _decorator;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationBlend1DItem`)
class AnimationBlend1DItem extends AnimationBlendItem {
    @serializable
    public threshold = 0.0;

    public clone (): AnimationBlend1DItem {
        const that = new AnimationBlend1DItem();
        this._copyTo(that);
        return that;
    }

    protected _copyTo (that: AnimationBlend1DItem): AnimationBlend1DItem {
        super._copyTo(that);
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

    public clone (): AnimationBlend1D {
        const that = new AnimationBlend1D();
        this.copyTo(that);
        that._items = this._items.map((item) => item.clone());
        that.param = this.param.clone();
        return that;
    }

    public [createEval] (
        context: AnimationGraphBindingContext,
        ignoreEmbeddedPlayers: boolean,
    ): any {
        const evaluation = new AnimationBlend1DEval(
            context,
            ignoreEmbeddedPlayers,
            this,
            this._items,
            this._items.map(({ threshold }) => threshold),
            0.0,
        );
        const initialValue = bindOr(
            context,
            this.param,
            VariableType.FLOAT,
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

    constructor (
        context: AnimationGraphBindingContext,
        ignoreEmbeddedPlayers: boolean,
        base: AnimationBlend,
        items: AnimationBlendItem[],
        thresholds: readonly number[],
        input: number,
    ) {
        super(context, ignoreEmbeddedPlayers, base, items, [input]);
        this._thresholds = thresholds;
        this.doEval();
    }

    protected eval (weights: number[], [value]: readonly [number]): void {
        blend1D(weights, this._thresholds, value);
    }
}
