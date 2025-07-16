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
import { AnimationBlend, AnimationBlendEval, AnimationBlendItem } from './animation-blend';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import type { ReadonlyClipOverrideMap } from '../clip-overriding';
import { BindableNumber, bindOr, VariableType } from '../parametric';
import { AnimationGraphBindingContext } from '../animation-graph-context';

const { ccclass, serializable } = _decorator;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationBlendDirectItem`)
class AnimationBlendDirectItem extends AnimationBlendItem {
    @serializable
    public weight = new BindableNumber(0.0);

    public clone (): AnimationBlendDirectItem {
        const that = new AnimationBlendDirectItem();
        this._copyTo(that);
        return that;
    }

    protected _copyTo (that: AnimationBlendDirectItem): AnimationBlendDirectItem {
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

    get items (): AnimationBlendDirectItem[] {
        return this._items;
    }

    set items (value) {
        this._items = Array.from(value);
    }

    public clone (): AnimationBlendDirect {
        const that = new AnimationBlendDirect();
        this.copyTo(that);
        that._items = this._items.map((item) => item?.clone() ?? null);
        return that;
    }

    public [createEval] (
        context: AnimationGraphBindingContext,
        ignoreEmbeddedPlayers: boolean,
    ): AnimationBlendDirectEval {
        const myEval: AnimationBlendDirectEval = new AnimationBlendDirectEval(
            context,
            ignoreEmbeddedPlayers,
            this,
            this._items,
            new Array<number>(this._items.length).fill(0.0),
        );
        for (let iItem = 0; iItem < this._items.length; ++iItem) {
            const item = this._items[iItem];
            const initialValue = bindOr(
                context,
                item.weight,
                VariableType.FLOAT,
                myEval.setInput,
                myEval,
                iItem,
            );
            myEval.setInput(initialValue, iItem);
        }
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

    protected eval (weights: number[], inputs: readonly number[]): void {
        const nChildren = weights.length;
        for (let iChild = 0; iChild < nChildren; ++iChild) {
            weights[iChild] = inputs[iChild];
        }
    }
}
