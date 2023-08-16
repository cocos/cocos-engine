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

import { Vec2, _decorator, ccenum, assertIsTrue, editable } from '../../../core';
import { createEval } from '../create-eval';
import { AnimationBlend, AnimationBlendEval, AnimationBlendItem } from './animation-blend';
import { BindableNumber, bindOr, VariableType } from '../parametric';
import { sampleFreeformCartesian, blendSimpleDirectional, PolarSpaceGradientBandInterpolator2D } from './blend-2d';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import type { ReadonlyClipOverrideMap } from '../clip-overriding';
import { AnimationGraphBindingContext } from '../animation-graph-context';

const { ccclass, serializable } = _decorator;

enum Algorithm {
    SIMPLE_DIRECTIONAL,
    FREEFORM_CARTESIAN,
    FREEFORM_DIRECTIONAL,
}

ccenum(Algorithm);

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationBlend2DItem`)
class AnimationBlend2DItem extends AnimationBlendItem {
    @serializable
    public threshold = new Vec2();

    public clone (): AnimationBlend2DItem {
        const that = new AnimationBlend2DItem();
        this._copyTo(that);
        return that;
    }

    protected _copyTo (that: AnimationBlend2DItem): AnimationBlend2DItem {
        super._copyTo(that);
        Vec2.copy(that.threshold, this.threshold);
        return that;
    }
}

@ccclass('cc.animation.AnimationBlend2D')
export class AnimationBlend2D extends AnimationBlend {
    public static Algorithm = Algorithm;

    public static Item = AnimationBlend2DItem;

    @editable
    public get algorithm (): Algorithm {
        return this._algorithm;
    }

    public set algorithm (value) {
        if (value === this._algorithm) {
            return;
        }
        this._algorithm = value;
        this._tryReconstructPolarSpaceInterpolator();
    }

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
        this._tryReconstructPolarSpaceInterpolator();
    }

    /**
     * // TODO: HACK
     * @internal
     */
    __callOnAfterDeserializeRecursive (): void {
        this._tryReconstructPolarSpaceInterpolator();
    }

    public clone (): AnimationBlend2D {
        const that = new AnimationBlend2D();
        this.copyTo(that);
        that._items = this._items.map((item) => item?.clone() ?? null);
        that.paramX = this.paramX.clone();
        that.paramY = this.paramY.clone();
        that.algorithm = this._algorithm;
        return that;
    }

    public [createEval] (
        context: AnimationGraphBindingContext,
        ignoreEmbeddedPlayers: boolean,
    ): AnimationBlendEval {
        const { algorithm } = this;
        let evaluation: AnimationBlendEval;
        switch (algorithm) {
        case Algorithm.FREEFORM_DIRECTIONAL:
            assertIsTrue(this._polarSpaceGBI, `The polar space interpolator is not setup correctly!`);
            evaluation = new PolarSpaceGradientBandBlend2DEval(
                context,
                ignoreEmbeddedPlayers,
                this,
                this._items,
                this._polarSpaceGBI,
                [0.0, 0.0],
            );
            break;
        default:
            assertIsTrue(false);
            // fallthrough
        case Algorithm.SIMPLE_DIRECTIONAL:
        case Algorithm.FREEFORM_CARTESIAN:
            evaluation =  new AnimationBlend2DEval(
                context,
                ignoreEmbeddedPlayers,
                this,
                this._items,
                this._items.map(({ threshold }) => threshold),
                algorithm,
                [0.0, 0.0],
            );
            break;
        }

        const initialValueX = bindOr(
            context,
            this.paramX,
            VariableType.FLOAT,
            evaluation.setInput,
            evaluation,
            0,
        );
        const initialValueY = bindOr(
            context,
            this.paramY,
            VariableType.FLOAT,
            evaluation.setInput,
            evaluation,
            1,
        );
        evaluation.setInput(initialValueX, 0);
        evaluation.setInput(initialValueY, 1);
        return evaluation;
    }

    @serializable
    private _algorithm = Algorithm.SIMPLE_DIRECTIONAL;

    private _polarSpaceGBI: PolarSpaceGradientBandInterpolator2D | undefined = undefined;

    private _tryReconstructPolarSpaceInterpolator (): void {
        if (this._algorithm === Algorithm.FREEFORM_DIRECTIONAL) {
            this._polarSpaceGBI = new PolarSpaceGradientBandInterpolator2D(this._items.map((item) => item.threshold));
        } else {
            this._polarSpaceGBI = undefined;
        }
    }
}

export declare namespace AnimationBlend2D {
    export type Algorithm = typeof Algorithm;

    export type Item = AnimationBlend2DItem;
}

class AnimationBlend2DEval extends AnimationBlendEval {
    private _thresholds: readonly Vec2[];
    private _algorithm: Algorithm.SIMPLE_DIRECTIONAL | Algorithm.FREEFORM_CARTESIAN;
    private _value = new Vec2();

    constructor (
        context: AnimationGraphBindingContext,
        ignoreEmbeddedPlayers: boolean,
        base: AnimationBlend,
        items: AnimationBlendItem[],
        thresholds: readonly Vec2[],
        algorithm: Algorithm.SIMPLE_DIRECTIONAL | Algorithm.FREEFORM_CARTESIAN,
        inputs: [number, number],
    ) {
        super(context, ignoreEmbeddedPlayers, base, items, inputs);
        this._thresholds = thresholds;
        this._algorithm = algorithm;
        this.doEval();
    }

    protected eval (weights: number[], [x, y]: [number, number]): void {
        Vec2.set(this._value, x, y);
        weights.fill(0);
        switch (this._algorithm) {
        case Algorithm.SIMPLE_DIRECTIONAL:
            blendSimpleDirectional(weights, this._thresholds, this._value);
            break;
        case Algorithm.FREEFORM_CARTESIAN:
            sampleFreeformCartesian(weights, this._thresholds, this._value);
            break;
        default:
            break;
        }
    }
}

class PolarSpaceGradientBandBlend2DEval extends AnimationBlendEval {
    private _interpolator: PolarSpaceGradientBandInterpolator2D;
    private _value = new Vec2();

    constructor (
        context: AnimationGraphBindingContext,
        ignoreEmbeddedPlayers: boolean,
        base: AnimationBlend,
        items: AnimationBlendItem[],
        interpolator: PolarSpaceGradientBandInterpolator2D,
        inputs: [number, number],
    ) {
        super(context, ignoreEmbeddedPlayers, base, items, inputs);
        this._interpolator = interpolator;
        this.doEval();
    }

    protected eval (weights: number[], [x, y]: [number, number]): void {
        Vec2.set(this._value, x, y);
        weights.fill(0);
        this._interpolator.interpolate(weights, this._value);
    }
}
