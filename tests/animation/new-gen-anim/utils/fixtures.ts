import { Track, VectorTrack } from "../../../../cocos/animation/animation";
import { AnimationClip } from "../../../../cocos/animation/animation-clip";
import { ClipMotion, AnimationBlend1D } from "../../../../cocos/animation/marionette/motion";
import { blend1D } from "../../../../cocos/animation/marionette/motion/blend-1d";
import { lerp, RealCurve } from "../../../../cocos/core";

export interface CreateMotionContext {
    createClipMotion: (
        keyframes: [number, number][],
        options: {
        name?: string;
        duration: number;
    }) => NonNullableClipMotion;
}

type NonNullableClipMotion = Omit<ClipMotion, 'clip'> & { 'clip': NonNullable<ClipMotion['clip']> };

export interface RealValueAnimationFixture {
    readonly duration: number;
    
    getExpected(time: number): number;

    getExpectedAdditive(time: number): number;

    createMotion(context: CreateMotionContext): NonNullableClipMotion;
}

export class LinearRealValueAnimationFixture implements RealValueAnimationFixture {
    constructor(public from: number, public to: number, public duration: number) {
    }

    public getExpected(time: number) {
        return lerp(this.from, this.to, time / this.duration);
    }

    public getExpectedAdditive(time: number) {
        return lerp(this.from, this.to, time / this.duration) - this.from;
    }

    public createMotion(context: CreateMotionContext) {
        return context.createClipMotion(
            [
                [0.0, this.from],
                [this.duration, this.to],
            ],
            {
                duration: this.duration,
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
    constructor(public value: number, public duration = 1.0) {
    }

    public getExpected(_?: number) {
        return this.value;
    }

    public getExpectedAdditive(_?: number) {
        return 0.0;
    }

    public createMotion(context: CreateMotionContext) {
        return context.createClipMotion([[0.0, this.value]], {
            duration: this.duration,
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

    public getExpectedAdditive(time: number, param: number) {
        const weights = new Array<number>(this._items.length).fill(0.0);
        blend1D(weights, this._items.map(({ threshold }) => threshold), param);

        const duration = this._getDuration(weights);
        const ratio = time / duration;

        return weights.reduce((result, weight, index) =>
            result += weight * this._items[index].fixture.getExpectedAdditive(ratio * this._items[index].fixture.duration), 0.0);
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