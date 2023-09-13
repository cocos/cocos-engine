/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { warnID, warn, easing, Color, log, Vec2, Vec3, Vec4, Size, Quat, Rect } from '../core';
import { ActionInterval } from './actions/action-interval';
import { ITweenOption } from './export-api';
import { VERSION } from '../core/global-exports';

/** adapter */
function TweenEasingAdapter (easingName: string): string {
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
function TweenOptionChecker (opts: ITweenOption): void {
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
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    if (!customEasing) warnID(1031, value.easing);
                } else {
                    customEasing = value.easing;
                }
                progress = value.progress;
                value = value.value;
            }

            const prop = Object.create(null);
            prop.value = value;
            prop.type = '';
            prop.easing = customEasing;
            prop.progress = progress;
            this._props[name] = prop;
        }

        this._originProps = props;
        this.initWithDuration(duration);
    }

    clone (): TweenAction {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const action = new TweenAction(this._duration, this._originProps, this._opts);
        this._cloneDecoration(action);
        return action;
    }

    startWithTarget (target: Record<string, unknown>): void {
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
            } else if (_t instanceof Color) {
                if (prop.start == null) {
                    prop.start = new Color(); prop.current = new Color(); prop.end = new Color();
                }
                prop.start.set(_t);
                prop.current.set(_t);
                if (relative) {
                    Color.add(prop.end, _t, value);
                } else {
                    prop.end.set(value);
                }
                prop.type = 'color';
            } else if (_t instanceof Rect) {
                if (prop.start == null) {
                    prop.start = new Rect(); prop.current = new Rect(); prop.end = new Rect();
                }
                prop.start.set(_t);
                prop.current.set(_t);
                if (relative) {
                    prop.end.xMin = _t.xMin + value.xMin;
                    prop.end.yMin = _t.yMin + value.yMin;
                    prop.end.z = _t.z + value.z;
                    prop.end.w = _t.w + value.w;
                } else {
                    prop.end.xMin = value.xMin;
                    prop.end.yMin = value.yMin;
                    prop.end.z = value.z;
                    prop.end.w = value.w;
                }
                prop.type = 'rect';
            } else if (_t instanceof Quat) {
                if (prop.start == null) {
                    prop.start = new Quat(); prop.current = new Quat(); prop.end = new Quat();
                }
                prop.start.set(_t);
                prop.current.set(_t);
                if (relative) {
                    Quat.multiply(prop.end, _t, value);
                } else {
                    prop.end.set(value);
                }
                prop.type = 'quat';
            } else if (typeof _t === 'object') {
                if (_t instanceof Vec2) {
                    if (prop.start == null) {
                        prop.start = new Vec2(); prop.current = new Vec2(); prop.end = new Vec2();
                    }
                    prop.type = 'vec2';
                } else if (_t instanceof Vec3) {
                    if (prop.start == null) {
                        prop.start = new Vec3(); prop.current = new Vec3(); prop.end = new Vec3();
                    }
                    prop.type = 'vec3';
                } else if (_t instanceof Vec4) {
                    if (prop.start == null) {
                        prop.start = new Vec4(); prop.current = new Vec4(); prop.end = new Vec4();
                    }
                    prop.type = 'vec4';
                } else if (_t instanceof Size) {
                    if (prop.start == null) {
                        prop.start = new Size(); prop.current = new Size(); prop.end = new Size();
                    }
                    prop.type = 'size';
                } else if (prop.start == null) {
                    prop.start = {}; prop.current = {}; prop.end = {};
                }

                for (const k in value) {
                    // filtering if it not a number
                    // eslint-disable-next-line no-restricted-globals
                    if (isNaN(_t[k] as number)) continue;
                    prop.start[k] = _t[k];
                    prop.current[k] = _t[k];
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    prop.end[k] = relative ? _t[k] + value[k] : value[k];
                }
            }
        }
        if (this._opts.onStart) { this._opts.onStart(this.target); }
    }

    update (t: number): void {
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
                if (prop.type && prop.type === 'color') {
                    prop.current.r = interpolation(start.r, end.r, prop.current.r, time);
                    prop.current.g = interpolation(start.g, end.g, prop.current.g, time);
                    prop.current.b = interpolation(start.b, end.b, prop.current.b, time);
                    prop.current.a = interpolation(start.a, end.a, prop.current.a, time);
                } else if (prop.type && prop.type === 'rect') {
                    prop.current.xMin = interpolation(start.xMin, end.xMin, prop.current.xMin, time);
                    prop.current.yMin = interpolation(start.yMin, end.yMin, prop.current.yMin, time);
                    prop.current.z = interpolation(start.z, end.z, prop.current.z, time);
                    prop.current.w = interpolation(start.w, end.w, prop.current.w, time);
                } else if (prop.type && prop.type === 'vec2') {
                    prop.current.x = interpolation(start.x, end.x, prop.current.x, time);
                    prop.current.y = interpolation(start.y, end.y, prop.current.y, time);
                } else if (prop.type && prop.type === 'vec3') {
                    prop.current.x = interpolation(start.x, end.x, prop.current.x, time);
                    prop.current.y = interpolation(start.y, end.y, prop.current.y, time);
                    prop.current.z = interpolation(start.z, end.z, prop.current.z, time);
                } else if (prop.type && prop.type === 'vec4') {
                    prop.current.x = interpolation(start.x, end.x, prop.current.x, time);
                    prop.current.y = interpolation(start.y, end.y, prop.current.y, time);
                    prop.current.z = interpolation(start.z, end.z, prop.current.z, time);
                    prop.current.w = interpolation(start.w, end.w, prop.current.w, time);
                } else if (prop.type && prop.type === 'size') {
                    prop.current.width = interpolation(start.width, end.width, prop.current.width, time);
                    prop.current.height = interpolation(start.height, end.height, prop.current.height, time);
                } else if (prop.type && prop.type === 'quat') {
                    Quat.slerp(prop.current, start, end, time as number);
                    if (prop.progress) {
                        warn('Quaternion only support slerp interpolation method.');
                    }
                } else {
                    for (const k in start) {
                        prop.current[k] = interpolation(start[k], end[k], prop.current[k], time);
                    }
                }
            }

            target[name] = prop.current;
        }
        if (opts.onUpdate) { opts.onUpdate(this.target, t); }
        if (t === 1 && opts.onComplete) { opts.onComplete(this.target); }
    }

    progress (start: number, end: number, current: number, t: number): number {
        return current = start + (end - start) * t;
    }
}
