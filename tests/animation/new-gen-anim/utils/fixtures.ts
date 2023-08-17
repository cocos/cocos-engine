import { Track, VectorTrack } from "../../../../cocos/animation/animation";
import { AnimationClip } from "../../../../cocos/animation/animation-clip";
import { ClipMotion, AnimationBlend1D } from "../../../../cocos/animation/marionette/motion";
import { blend1D } from "../../../../cocos/animation/marionette/motion/blend-1d";
import { WrapMode } from "../../../../cocos/animation/types";
import { lerp, RealCurve } from "../../../../cocos/core";

export interface CreateMotionContext {
    createClipMotion: (
        keyframes: [number, number][],
        options: {
        name?: string;
        duration: number;
        additive?: boolean;
        wrapMode?: WrapMode;
    }) => NonNullableClipMotion;
}

type NonNullableClipMotion = Omit<ClipMotion, 'clip'> & { 'clip': NonNullable<ClipMotion['clip']> };

export interface RealValueAnimationFixture {
    readonly duration: number;
    
    getExpected(time: number): number;

    createMotion(context: CreateMotionContext): NonNullableClipMotion;
}

export class LinearRealValueAnimationFixture implements RealValueAnimationFixture {
    constructor(public from: number, public to: number, public duration: number, private additive: boolean = false, private options: {
        loop?: boolean;
    } = {}) {
    }

    public getExpected(time: number) {
        const v = lerp(this.from, this.to, time / this.duration);
        if (this.additive) {
            return v - this.from;
        } else {
            return v;
        }
    }

    public createMotion(context: CreateMotionContext) {
        return context.createClipMotion(
            [
                [0.0, this.from],
                [this.duration, this.to],
            ],
            {
                duration: this.duration,
                additive: this.additive,
                wrapMode: this.options.loop ? WrapMode.Loop : WrapMode.Normal,
            },
        );
    }

    public setupCurve(curve: RealCurve) {
        curve.assignSorted([
            [0.0, this.from],
            [this.duration, this.to],
        ]);
    }
}

export class ConstantRealValueAnimationFixture implements RealValueAnimationFixture {
    constructor(public value: number, public duration = 1.0, private additive: boolean = false) {
    }

    public getExpected(_?: number) {
        return this.additive ? 0.0 : this.value;
    }

    public createMotion(context: CreateMotionContext) {
        return context.createClipMotion([[0.0, this.value]], {
            duration: this.duration,
            additive: this.additive,
        });
    }
}

export class AnimationBlend1DFixture {
    constructor(...items: {
        fixture: RealValueAnimationFixture;
        threshold: number;
    }[]) {
        this._items = items.slice();
    }

    public getExpected(time: number, param: number) {
        const weights = new Array<number>(this._items.length).fill(0.0);
        blend1D(weights, this._items.map(({ threshold }) => threshold), param);

        const duration = this._getDuration(weights);
        const ratio = time / duration;

        return weights.reduce((result, weight, index) =>
            result += weight * this._items[index].fixture.getExpected(ratio * this._items[index].fixture.duration), 0.0);
    }

    public createMotion(context: CreateMotionContext) {
        const motion = new AnimationBlend1D();
        motion.items = this._items.map(({ fixture: itemFixture, threshold }) => {
            const item = new AnimationBlend1D.Item();
            item.motion = itemFixture.createMotion(context);
            item.threshold = threshold;
            return item;
        });
        return motion;
    }

    private _items: {
        fixture: RealValueAnimationFixture;
        threshold: number;
    }[];

    private _getDuration(weights: readonly number[]) {
        let uniformDuration = 0.0;
        for (let iChild = 0; iChild < this._items.length; ++iChild) {
            uniformDuration += (this._items[iChild]?.fixture.duration ?? 0.0) * weights[iChild];
        }
        return uniformDuration;
    }
}