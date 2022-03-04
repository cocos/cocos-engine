/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @hidden
 */

import { easing } from '../core/animation';
import { warnID, warn } from '../core';
import { ActionInterval } from './actions/action-interval';
import { ITweenOption } from './export-api';
import { legacyCC, VERSION } from '../core/global-exports';

/** adapter */
function TweenEasingAdapter (easingName: string) {
    const initialChar = easingName.charAt(0);
    if (/[A-Z]/.test(initialChar)) {
        easingName = easingName.replace(initialChar, initialChar.toLowerCase());
        const arr = easingName.split('-');
        if (arr.length === 2) {
            const str0 = arr[0];
            if (str0 === 'linear') {
                easingName = 'linear';
            } else {
                const str1 = arr[1];
                switch (str0) {
                case 'quadratic':
                    easingName = `quad${str1}`;
                    break;
                case 'quartic':
                    easingName = `quart${str1}`;
                    break;
                case 'quintic':
                    easingName = `quint${str1}`;
                    break;
                case 'sinusoidal':
                    easingName = `sine${str1}`;
                    break;
                case 'exponential':
                    easingName = `expo${str1}`;
                    break;
                case 'circular':
                    easingName = `circ${str1}`;
                    break;
                default:
                    easingName = str0 + str1;
                    break;
                }
            }
        }
    }
    return easingName;
}

/** checker */
function TweenOptionChecker (opts: ITweenOption) {
    const header = ' [Tween:] ';
    const message = ` option is not support in v + ${VERSION}`;
    const _opts = opts as unknown as any;
    if (_opts.delay) {
        warn(`${header}delay${message}`);
    }
    if (_opts.repeat) {
        warn(`${header}repeat${message}`);
    }
    if (_opts.repeatDelay) {
        warn(`${header}repeatDelay${message}`);
    }
    if (_opts.interpolation) {
        warn(`${header}interpolation${message}`);
    }
    if (_opts.onStop) {
        warn(`${header}onStop${message}`);
    }
}

export class TweenAction extends ActionInterval {
    private _opts: any;
    private _props: any;
    private _originProps: any;

    constructor (duration: number, props: any, opts?: ITweenOption) {
        super();
        if (opts == null) {
            opts = Object.create(null);
        } else {
            /** checker */
            TweenOptionChecker(opts);

            /** adapter */
            if (opts.easing && typeof opts.easing === 'string') {
                opts.easing = TweenEasingAdapter(opts.easing) as any;
            }

            // global easing or progress used for this action
            if (!opts.progress) {
                opts.progress = this.progress;
            }
            if (opts.easing && typeof opts.easing === 'string') {
                const easingName = opts.easing as string;
                opts.easing = easing[easingName];

                if (!opts.easing) { warnID(1031, easingName); }
            }
        }
        this._opts = opts;

        this._props = Object.create(null);
        for (const name in props) {
            // filtering if
            // - it was not own property
            // - types was function / string
            // - it was undefined / null
            // eslint-disable-next-line no-prototype-builtins
            if (!props.hasOwnProperty(name)) continue;
            let value = props[name];
            if (typeof value === 'function') {
                value = value();
            }
            if (value == null || typeof value === 'string') continue;
            // property may have custom easing or progress function
            let customEasing: any; let progress: any;
            if (value.value !== undefined && (value.easing || value.progress)) {
                if (typeof value.easing === 'string') {
                    customEasing = easing[value.easing];
                    if (!customEasing) warnID(1031, value.easing);
                } else {
                    customEasing = value.easing;
                }
                progress = value.progress;
                value = value.value;
            }

            const prop = Object.create(null);
            prop.value = value;
            prop.easing = customEasing;
            prop.progress = progress;
            this._props[name] = prop;
        }

        this._originProps = props;
        this.initWithDuration(duration);
    }

    clone () {
        const action = new TweenAction(this._duration, this._originProps, this._opts);
        this._cloneDecoration(action);
        return action;
    }

    startWithTarget (target: Record<string, unknown>) {
        ActionInterval.prototype.startWithTarget.call(this, target);

        const relative = !!this._opts.relative;
        const props = this._props;
        for (const property in props) {
            const _t: any = target[property];
            if (_t === undefined) { continue; }

            const prop: any = props[property];
            const value = prop.value;
            if (typeof _t === 'number') {
                prop.start = _t;
                prop.current = _t;
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                prop.end = relative ? _t + value : value;
            } else if (typeof _t === 'object') {
                if (prop.start == null) {
                    prop.start = {}; prop.current = {}; prop.end = {};
                }

                for (const k in value) {
                    // filtering if it not a number
                    // eslint-disable-next-line no-restricted-globals
                    if (isNaN(_t[k])) continue;
                    prop.start[k] = _t[k];
                    prop.current[k] = _t[k];
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    prop.end[k] = relative ? _t[k] + value[k] : value[k];
                }
            }
        }
        if (this._opts.onStart) { this._opts.onStart(this.target); }
    }

    update (t: number) {
        const target = this.target;
        if (!target) return;

        const props = this._props;
        const opts = this._opts;

        let easingTime = t;
        if (opts.easing) easingTime = opts.easing(t);

        const progress = opts.progress;
        for (const name in props) {
            const prop = props[name];
            const time = prop.easing ? prop.easing(t) : easingTime;
            const interpolation = prop.progress ? prop.progress : progress;

            const start = prop.start;
            const end = prop.end;
            if (typeof start === 'number') {
                prop.current = interpolation(start, end, prop.current, time);
            } else if (typeof start === 'object') {
                // const value = prop.value;
                for (const k in start) {
                    // if (value[k].easing) {
                    //     time = value[k].easing(t);
                    // }
                    // if (value[k].progress) {
                    //     interpolation = value[k].easing(t);
                    // }
                    prop.current[k] = interpolation(start[k], end[k], prop.current[k], time);
                }
            }

            target[name] = prop.current;
        }
        if (opts.onUpdate) { opts.onUpdate(this.target, t); }
        if (t === 1 && opts.onComplete) { opts.onComplete(this.target); }
    }

    progress (start: number, end: number, current: number, t: number) {
        return current = start + (end - start) * t;
    }
}
