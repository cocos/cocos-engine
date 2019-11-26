/**
 * @hidden
 */

import { warnID, warn, easing } from '../core';
import { ActionInterval } from './actions/action-interval';
import { ITweenOption } from './export-api';

/** adapter */
function TweenEasinAdapter (easingName: string) {
    let initialChar = easingName.charAt(0);
    if (/[A-Z]/.test(initialChar)) {
        easingName = easingName.replace(initialChar, initialChar.toLowerCase());
        const arr = easingName.split('-');
        if (arr.length == 2) {
            const str0 = arr[0];
            if (str0 == 'linear') {
                easingName = 'linear';
            } else {
                const str1 = arr[1];
                switch (str0) {
                    case 'quadratic':
                        easingName = 'quad' + str1;
                        break;
                    case 'quartic':
                        easingName = 'quart' + str1;
                        break;
                    case 'quintic':
                        easingName = 'quint' + str1;
                        break;
                    case 'sinusoidal':
                        easingName = 'sine' + str1;
                        break;
                    case 'exponential':
                        easingName = 'expo' + str1;
                        break;
                    case 'circular':
                        easingName = 'circ' + str1;
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
    const message = ' option is not support in v' + cc.ENGINE_VERSION;
    if (opts['delay']) {
        warn(header + 'delay' + message);
    }
    if (opts['repeat']) {
        warn(header + 'repeat' + message);
    }
    if (opts['repeatDelay']) {
        warn(header + 'repeatDelay' + message);
    }
    if (opts['interpolation']) {
        warn(header + 'interpolation' + message);
    }
    if (opts['onStart']) {
        warn(header + 'onStart' + message);
    }
    if (opts['onStop']) {
        warn(header + 'onStop' + message);
    }
    if (opts['onUpdate']) {
        warn(header + 'onUpdate' + message);
    }
    if (opts['onComplete']) {
        warn(header + 'onComplete' + message);
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
                opts.easing = TweenEasinAdapter(opts.easing) as any;
            }

            // global easing or progress used for this action
            if (!opts.progress) {
                opts.progress = this.progress;
            }
            if (opts.easing && typeof opts.easing === 'string') {
                let easingName = opts.easing as string;
                opts.easing = easing[easingName];

                if (!opts.easing) { warnID(1031, easingName); }
            }
        }
        this._opts = opts;

        this._props = Object.create(null);
        for (let name in props) {
            let value = props[name];

            // property may have custom easing or progress function
            let easing, progress;
            if (value.value !== undefined && (value.easing || value.progress)) {
                if (typeof value.easing === 'string') {
                    easing = easing[value.easing];
                    !easing && warnID(1031, value.easing);
                }
                else {
                    easing = value.easing;
                }
                progress = value.progress;
                value = value.value;
            }

            let prop = Object.create(null);
            prop.value = value;
            prop.easing = easing;
            prop.progress = progress;
            this._props[name] = prop;
        }

        this._originProps = props;
        this.initWithDuration(duration);
    }

    clone () {
        var action = new TweenAction(this._duration, this._originProps, this._opts);
        this._cloneDecoration(action);
        return action;
    }

    startWithTarget (target: {}) {
        ActionInterval.prototype.startWithTarget.call(this, target);

        const relative = !!this._opts.relative;
        const props = this._props;
        for (var property in props) {
            const _t: any = target[property];
            if (_t === undefined) { continue; }

            const prop: any = props[property];
            const value = prop.value;
            if (typeof _t === "number") {
                prop.start = _t;
                prop.current = _t;
                prop.end = relative ? _t + value : value;
            } else if (typeof _t === "object") {
                if (prop.start == null) {
                    prop.start = {}; prop.current = {}; prop.end = {};
                }
                
                for (var k in value) {
                    prop.start[k] = _t[k];
                    prop.current[k] = _t[k];
                    prop.end[k] = relative ? _t[k] + value[k] : value[k];
                }
            }
        }
    }

    update (t: number) {
        const target = this.target;
        if (!target) return;

        const props = this._props;
        const opts = this._opts;

        let easingTime = t;
        if (opts.easing) easingTime = opts.easing(t);

        let progress = this._opts.progress;
        for (const name in props) {
            let prop = props[name];
            let time = prop.easing ? prop.easing(t) : easingTime;
            let interpolation = prop.progress ? prop.progress : progress;

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
    }

    progress (start: any, end: any, current: any, t: number) {
        return current = start + (end - start) * t;
    }
}