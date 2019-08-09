/**
 * @hidden
 */

import TWEEN from 'tween.js';
import { ITweenOption, ITweenProp } from './export-api';

export class TweenAction {
    private static _idCounter: number = 0;

    public readonly id: number;

    public readonly tween: TWEEN.Tween;

    private _opts: ITweenOption | undefined;

    private _props: ITweenProp;

    constructor (target: Object, duration: number, props: ITweenProp, opts?: ITweenOption) {
        this.id = TweenAction._idCounter++;
        this.tween = new TWEEN.Tween(target);
        this._props = props;
        this._opts = opts!;

        this.tween.to(props, duration);

        if (opts != null) {

            if (opts.delay != null) {
                this.tween.delay(opts.delay);
            }

            if (opts.repeat != null) {
                this.tween.repeat(opts.repeat);
            }

            if (opts.repeatDelay != null) {
                this.tween.repeatDelay(opts.repeatDelay);
            }

            if (opts.yoyo != null) {
                this.tween.yoyo(opts.yoyo);
            }

            if (opts.easing != null) {
                if (typeof opts.easing === 'string') {
                    // parse easing
                    const e = (opts.easing as string).split('-');
                    if (e.length >= 2) {
                        const e0 = e[0] as 'Linear' | 'Cubic';
                        const e1 = e[1] as 'None' | 'In' | 'Out' | 'InOut';
                        if (e0 === 'Linear') {
                            if (e1 === 'None') {
                                this.tween.easing(TWEEN.Easing[e0][e1]);
                            }
                        } else if (e1 === 'In' || e1 === 'Out' || e1 === 'InOut') {
                            this.tween.easing(TWEEN.Easing[e0][e1]);
                        }
                    }
                } else {
                    this.tween.easing(opts.easing as (k: number) => number);
                }
            }

            if (opts.interpolation != null) {
                if (typeof opts.interpolation === 'string') {
                    // parse interpolation
                    const i = (opts.interpolation as string).split('-');
                    if (i.length >= 1) {
                        const i0 = i[0] as 'Linear' | 'Bezier' | 'CatmullRom';
                        this.tween.interpolation(TWEEN.Interpolation[i0]);
                    }
                } else {
                    this.tween.interpolation(opts.interpolation as (v: number[], k: number) => number);
                }
            }

            if (opts.onStart != null) {
                this.tween.onStart(opts.onStart);
            }

            if (opts.onStop != null) {
                this.tween.onStop(opts.onStop);
            }

            if (opts.onUpdate != null) {
                this.tween.onUpdate(opts.onUpdate);
            }

            if (opts.onComplete != null) {
                this.tween.onComplete(opts.onComplete);
            }
        }
    }
}

cc.TweenAction = TweenAction;
window.TWEEN = TWEEN;
