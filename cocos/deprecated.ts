/**
 * @hidden
 */

import { js } from './core/utils/js';
import { errorID, error, warnID, warn } from './core/platform/CCDebug';

export interface IWrapOptions {
    oldTarget: Function | {};
    oldPrefix: string;
    pairs: string[][];
    newTarget?: Function | {};
    newPrefix?: string;
    custom?: Function;
}

export let deprecatedWrapper: (option: IWrapOptions) => void;
if (CC_DEBUG) {
    deprecatedWrapper = (option: IWrapOptions) => {
        let oldTarget = option.oldTarget;
        let newTarget = option.newTarget;
        let oldPrefix = option.oldPrefix;
        let newPrefix = option.newPrefix;
        let deprecatedProps = option.pairs;
        let custom = option.custom;

        let _t0: {};
        if (typeof oldTarget == 'function') {
            _t0 = oldTarget.prototype;
        } else {
            _t0 = oldTarget;
        }

        let _t1: {};
        if (newTarget) {
            if (typeof newTarget == 'function') {
                _t1 = newTarget.prototype;
            } else {
                _t1 = newTarget;
            }
        }

        deprecatedProps.forEach(function (prop: string[]) {
            let deprecatedProp = prop[0];
            let newProp: string;
            if (prop.length > 1) {
                newProp = prop[1];
            }

            let _print = () => {
                if (custom != null) {
                    // custom message
                    custom();
                } else if (newProp != null && newPrefix != null) {
                    // remove but provide a new
                    warn("'%s' is deprecated, please use '%s' instead.", `${oldPrefix}.${deprecatedProp}`, `${newPrefix}.${newProp}`);
                } else {
                    // remove only
                    error("'%s.%s' is removed", oldPrefix, deprecatedProp);
                }
            };

            Object.defineProperty(_t0, deprecatedProp, {
                /* eslint-disable-next-line */
                get: function () {
                    _print();
                    if (newProp != null && _t1 != null && _t1[newProp] != null) {
                        return _t1[newProp];
                    }
                },
                set: function (v: any) {
                    _print();
                    if (newProp != null && _t1 != null && _t1[newProp] != null) {
                        if (typeof _t1[newProp] !== 'function') {
                            _t1[newProp] = v;
                        }
                    }
                }
            });
        });
    };
} else {
    // for compatible
    deprecatedWrapper = () => { };
}

if (CC_DEBUG) {

    // just for testing cases
    cc.DEPRECATED_TESTING = {};

    deprecatedWrapper({
        oldTarget: cc.DEPRECATED_TESTING,
        oldPrefix: "cc.DEPRECATED_TESTING",
        newTarget: cc.math,
        newPrefix: "cc.math",
        pairs: [
            ["EPSILON", "EPSILON"],
            ["equals", "equals"],
            ["clamp", "clamp"],
            ["quat", "Quat"],
            ["rect", "Rect"],
            ["vec2", "Vec2"],
            ["vec3", "Vec3"],
            ["vec4", "Vec4"],
            ["mat3", "Mat3"],
        ]
    });

    deprecatedWrapper({
        oldTarget: cc.DEPRECATED_TESTING,
        oldPrefix: "cc.DEPRECATED_TESTING",
        pairs: [
            ["lerp", "lerp"]
        ]
    });
}

if (CC_DEBUG) {

    /// test cases ///

    cc.vmath = {};

    Object.defineProperty(cc.vmath, 'EPSILON', {
        get: function () {
            error("please use cc.math.EPSILON");
            return cc.math.EPSILON;
        }
    });

    Object.defineProperty(cc.vmath, 'random', {
        get: function () {
            error("please use cc.math.random");
            return cc.math.random;
        }
    });

    Object.defineProperty(cc.vmath, 'equals', {
        value: function (arg1, arg2) {
            error("please use cc.math.equals");
            return cc.math.equals(arg1, arg2);
        }
    });

    Object.defineProperty(cc.vmath, 'approx', {
        value: function (arg1, arg2, arg3) {
            error("please use cc.math.approx");
            return cc.math.approx(arg1, arg2, arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'clamp', {
        value: function (arg1, arg2, arg3) {
            error("please use cc.math.clamp");
            return cc.math.clamp(arg1, arg2, arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'clamp01', {
        value: function (arg) {
            error("please use cc.math.clamp01");
            return cc.math.clamp01(arg);
        }
    });

    Object.defineProperty(cc.vmath, 'lerp', {
        value: function (arg1, arg2, arg3) {
            error("please use cc.math.lerp");
            return cc.math.lerp(arg1, arg2, arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'toRadian', {
        value: function (arg) {
            error("please use cc.math.toRadian");
            return cc.math.toRadian(arg);
        }
    });

    Object.defineProperty(cc.vmath, 'toDegree', {
        value: function (args) {
            error("please use cc.math.toDegree");
            return cc.math.toDegree(args);
        }
    });

    Object.defineProperty(cc.vmath, 'randomRange', {
        value: function (arg1, arg2) {
            error("please use cc.math.randomRange");
            return cc.math.randomRange(arg1, arg2);
        }
    });

    Object.defineProperty(cc.vmath, 'randomRangeInt', {
        value: function (arg1, arg2) {
            error("please use cc.math.randomRangeInt");
            return cc.math.randomRangeInt(arg1, arg2);
        }
    });

    Object.defineProperty(cc.vmath, 'pseudoRandom', {
        value: function (args) {
            error("please use cc.math.pseudoRandom");
            return cc.math.pseudoRandom(args);
        }
    });

    Object.defineProperty(cc.vmath, 'pseudoRandomRange', {
        value: function (arg1, arg2, arg3) {
            error("please use cc.math.pseudoRandomRange");
            return cc.math.pseudoRandomRange(arg1, arg2, arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'pseudoRandomRangeInt', {
        value: function (arg1, arg2, arg3) {
            error("please use cc.math.pseudoRandomRangeInt");
            return cc.math.pseudoRandomRangeInt(arg1, arg2, arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'nextPow2', {
        value: function (args) {
            error("please use cc.math.nextPow2");
            return cc.math.nextPow2(args);
        }
    });

    Object.defineProperty(cc.vmath, 'repeat', {
        value: function (arg1, arg2) {
            error("please use cc.math.repeat");
            return cc.math.repeat(arg1, arg2);
        }
    });

    Object.defineProperty(cc.vmath, 'pingPong', {
        value: function (arg1, arg2) {
            error("please use cc.math.pingPong");
            return cc.math.pingPong(arg1, arg2);
        }
    });

    Object.defineProperty(cc.vmath, 'inverseLerp', {
        value: function (arg1, arg2, arg3) {
            error("please use cc.math.inverseLerp");
            return cc.math.inverseLerp(arg1, arg2, arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'vec3', {
        get: function () {
            error("please use cc.math.Vec3");
            return cc.math.Vec3;
        }
    });

    Object.defineProperty(cc.vmath, 'vec2', {
        get: function () {
            error("please use cc.math.Vec2");
            return cc.math.Vec2;
        }
    });

    Object.defineProperty(cc.vmath, 'vec4', {
        get: function () {
            error("please use cc.math.Vec4");
            return cc.math.Vec4;
        }
    });

    Object.defineProperty(cc.vmath, 'mat3', {
        get: function () {
            error("please use cc.math.Mat3");
            return cc.math.Mat3;
        }
    });

    Object.defineProperty(cc.vmath, 'mat4', {
        get: function () {
            error("please use cc.math.Mat4");
            return cc.math.Mat4;
        }
    });

    Object.defineProperty(cc.vmath, 'color4', {
        get: function () {
            error("please use cc.math.Color");
            return cc.math.Color;
        }
    });

    Object.defineProperty(cc.vmath, 'rect', {
        get: function () {
            error("please use cc.math.Rect");
            return cc.math.Rect;
        }
    });

    Object.defineProperty(cc.misc, 'clamp01', {
        value: function (args) {
            error("please use cc.math.clamp01");
            return cc.math.clamp01(args);
        }
    });

    Object.defineProperty(cc.misc, 'lerp', {
        value: function (arg1, arg2, arg3) {
            error("please use cc.math.lerp");
            return cc.math.lerp(arg1, arg2, arg3);
        }
    });

    Object.defineProperty(cc.misc, 'degreesToRadians', {
        value: function (args) {
            error("please use cc.math.toRadian");
            return cc.math.toRadian(args);
        }
    });

    Object.defineProperty(cc.misc, 'radiansToDegrees', {
        value: function (args) {
            error("please use cc.math.toDegree");
            return cc.math.toDegree(args);
        }
    });

    Object.defineProperty(cc.misc, 'clampf', {
        value: function (arg1, arg2, arg3) {
            error("please use cc.math.clamp");
            return cc.math.clamp(arg1, arg2, arg3);
        }
    });

}
