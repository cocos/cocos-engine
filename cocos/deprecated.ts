/**
 * @hidden
 */

import { js } from './core/utils/js';
import { errorID, error, warnID, warn } from './core/platform/CCDebug';


if (CC_DEBUG) {

    // let deprecateEnum = function deprecateEnum (obj: {}, oldPath: string, newPath: string, hasTypePrefixBefore: boolean) {
    //     if (!CC_SUPPORT_JIT) {
    //         return;
    //     }
    //     hasTypePrefixBefore = hasTypePrefixBefore !== false;
    //     var enumDef = Function('return ' + newPath)();
    //     var entries = Enum.getList(enumDef);
    //     var delimiter = hasTypePrefixBefore ? '_' : '.';
    //     for (var i = 0; i < entries.length; i++) {
    //         var entry: string = entries[i].name;
    //         var oldPropName: string;
    //         if (hasTypePrefixBefore) {
    //             var oldTypeName = oldPath.split('.').slice(-1)[0];
    //             oldPropName = oldTypeName + '_' + entry;
    //         } else {
    //             oldPropName = entry;
    //         }
    //         js.get(obj, oldPropName, async function (entry: string) {
    //             errorID(1400, oldPath + delimiter + entry, newPath + '.' + entry);
    //             return await enumDef[entry];
    //         }.bind(null, entry));
    //     }
    // };

    /// deprecated ///

    let markAsDeprecatedInFunction = (ctor: Function, deprecatedProps: string[][], ownerName?: string) => {
        if (!ctor) return;

        ownerName = ownerName || js.getClassName(ctor);
        let descriptors = Object.getOwnPropertyDescriptors(ctor.prototype);
        deprecatedProps.forEach(function (prop: string[]) {
            let deprecatedProp = prop[0];
            let newProp = prop[1];
            let descriptor = descriptors[deprecatedProp];

            // js.getset(ctor.prototype, deprecatedProp, function (this: any) {
            //     warnID(1400, `${ownerName}.${deprecatedProp}`, `${ownerName}.${newProp}`);
            //     if (descriptor.get) {
            //         return descriptor.get.call(this);
            //     }
            // }, function (this: any, v) {
            //     warnID(1400, `${ownerName}.${deprecatedProp}`, `${ownerName}.${newProp}`);
            //     if (descriptor.set) {
            //         descriptor.set.call(this, v);
            //     }
            // }, true, true);

            /* eslint-disable-next-line */
            ctor.prototype[deprecatedProp] = function (this: any, v: any) {
                warnID(1400, `${ownerName}.${deprecatedProp}`, `${ownerName}.${newProp}`);
                if (descriptor.get) {
                    return descriptor.get.call(this);
                } if (descriptor.set) {
                    descriptor.set.call(this, v);
                }
            };
        });
    };

    let markAsDeprecatedInObject = (obj: {}, deprecatedProps: string[][], ownerName?: string) => {
        if (!obj) return;

        ownerName = ownerName || js.getClassName(obj);
        let descriptors = Object.getOwnPropertyDescriptors(obj);
        deprecatedProps.forEach(function (prop: string[]) {
            let deprecatedProp = prop[0];
            let newProp = prop[1];
            let descriptor = descriptors[deprecatedProp];

            // js.getset(obj, deprecatedProp, async function (this: any) {
            //     warnID(1400, `${ownerName}.${deprecatedProp}`, `${ownerName}.${newProp}`);
            //     if (descriptor.get) {
            //         return await descriptor.get.call(this);
            //     }
            // }, function (this: any, v) {
            //     warnID(1400, `${ownerName}.${deprecatedProp}`, `${ownerName}.${newProp}`);
            //     if (descriptor.set) {
            //         descriptor.set.call(this, v);
            //     }
            // }, true, true);

            /* eslint-disable-next-line */
            obj[deprecatedProp] = function (this: any, v: any) {
                warnID(1400, `${ownerName}.${deprecatedProp}`, `${ownerName}.${newProp}`);
                if (descriptor.get) {
                    return descriptor.get.call(this);
                } if (descriptor.set) {
                    descriptor.set.call(this, v);
                }
            };
        });
    };


    let markAsDeprecatedInObject_2 = (obj: {}, deprecatedProps: string[][], ownerName?: string) => {
        if (!obj) return;

        ownerName = ownerName || js.getClassName(obj);
        let descriptors = Object.getOwnPropertyDescriptors(obj);
        deprecatedProps.forEach(function (prop: string[]) {
            let deprecatedProp = prop[0];
            let newProp = prop[1];

            /* eslint-disable-next-line */
            obj[deprecatedProp] = function (this: any, v: any) {
                errorID(1400, `${ownerName}.${deprecatedProp}`, `${ownerName}${newProp}`);
            };
        });
    };


    /**
     * @zh
     * 标志类或对象 API 的更新和废弃
     * @param ctor_or_obj 类或者对象
     * @param deprecatedProps 二维数组，例如 [ ['deprecatedAPI','newAPI'] , ... ]
     * @param ownerName 可选，类或者对象的名称
     */
    let markAsDeprecated = (ctor_or_obj: Function | {}, deprecatedProps: string[][], ownerName?: string) => {
        if (typeof ctor_or_obj == 'function') {
            markAsDeprecatedInFunction(ctor_or_obj, deprecatedProps, ownerName);
        } else if (typeof ctor_or_obj == 'object') {
            markAsDeprecatedInObject(ctor_or_obj, deprecatedProps, ownerName);
        }
    };

    /// Removed ///

    let markAsRemovedInFunction = (ctor: Function, removedProps: string[], ownerName?: string) => {
        if (!ctor) return;

        ownerName = ownerName || js.getClassName(ctor);
        removedProps.forEach(function (prop) {
            function _error () {
                errorID(1406, ownerName, prop);
            }
            ctor.prototype[prop] = _error;
            // js.getset(ctor.prototype, prop, _error, _error, true, true);
        });
    };

    let markAsRemovedInObject = (obj: {}, removedProps: string[], ownerName?: string) => {
        if (!obj) {
            // 可能被裁剪了
            return;
        }
        removedProps.forEach(function (prop) {
            function _error () {
                errorID(1406, ownerName, prop);
            }
            obj[prop] = _error;
            // js.getset(obj, prop, _error, _error, true, true);
        });
    };

    /**
     * @zh
     * 标志类或对象 API 的移除
     * @param ctor_or_obj 类或者对象
     * @param removedProps 一维数组，例如 ['moveTo', 'scaleBy']
     * @param ownerName 可选，类或者对象的名称
     */
    let markAsRemoved = (ctor_or_obj: Function | {}, removedProps: string[], ownerName?: string) => {
        if (typeof ctor_or_obj == 'function') {
            markAsRemovedInFunction(ctor_or_obj, removedProps, ownerName);
        } else if (typeof ctor_or_obj == 'object') {
            markAsRemovedInObject(ctor_or_obj, removedProps, ownerName);
        }
    };

    /// Warning ///

    let markAsWarningInFunction = (ctor: Function, propObj: {}, ownerName?: string) => {
        if (!ctor) return;

        ownerName = ownerName || js.getClassName(ctor);

        for (let prop in propObj) {
            (function () {
                let propName = prop;
                let originFunc = ctor.prototype[propName] as Function;
                if (!originFunc) return;

                /* eslint-disable-next-line */
                function _warn (this: any, ...args: any) {
                    warn('Sorry, %s.%s is deprecated. Please use %s instead', ownerName, propName, propObj[propName]);
                    return originFunc.apply(this, args);
                }
                ctor.prototype[propName] = _warn;
            })();
        }

    };

    let markFunctionWarning = markAsWarningInFunction;  // for compatibility

    let markAsWarningInObject = (obj: {}, propObj: {}, ownerName?: string) => {
        if (!obj) return;

        ownerName = ownerName || js.getClassName(obj);

        for (let prop in propObj) {
            (function () {
                let propName = prop;
                let originFunc = obj[propName] as Function;

                if (!originFunc) return;
                /* eslint-disable-next-line */
                function _warn (this: any, ...args: any) {
                    warn('Sorry, %s.%s is deprecated. Please use %s instead', ownerName, propName, propObj[propName]);
                    return originFunc.apply(this, args);
                }

                obj[propName] = _warn;
            })();
        }

    };

    /**
     * @zh
     * 标志类或对象 API 的警告
     * @param ctor_or_obj 类或者对象
     * @param propObj 一个对象，例如 { PI : "Math.PI" }
     * @param ownerName 可选，类或者对象的名称
     */
    let markAsWarning = (ctor_or_obj: Function | {}, propObj: {}, ownerName?: string) => {
        if (typeof ctor_or_obj == 'function') {
            markAsWarningInFunction(ctor_or_obj, propObj, ownerName);
        } else if (typeof ctor_or_obj == 'object') {
            markAsWarningInObject(ctor_or_obj, propObj, ownerName);
        }
    };

    /// orgin translate from cocos2d ///

    let provideClearError = (ctor_or_obj: Function | {}, propObj: {}, ownerName: string) => {
        if (!ctor_or_obj) {
            // 可能被裁剪了
            return;
        }
        var className = ownerName || js.getClassName(ctor_or_obj);
        var Info = 'Sorry, ' + className + '.%s is removed, please use %s instead.';
        for (var prop in propObj) {
            let define = function define (prop: string, getset: string | string[]) {
                function accessor (newProp: string | string[]) {
                    error(Info, prop, newProp);
                }
                if (!Array.isArray(getset)) {
                    getset = getset.split(',')
                        .map(function (x) {
                            return x.trim();
                        });
                }
                let get: Getter = accessor.bind(null, getset[0]);
                let set: Setter | undefined;
                if (getset[1] != null) {
                    set = accessor.bind(null, getset[1]);
                }
                try {
                    js.getset(ctor_or_obj, prop, get, set);
                } catch (e) { }
            };
            var getset = propObj[prop];
            if (prop.startsWith('*')) {
                // get set
                var etProp = prop.slice(1);
                define('g' + etProp, getset);
                define('s' + etProp, getset);
            } else {
                prop.split(',')
                    .map(function (x) {
                        return x.trim();
                    })
                    .forEach(function (x) {
                        define(x, getset);
                    });
            }
        }
    };

    /// test cases ///

    markAsDeprecated(cc.Texture2D, [['getHtmlElementObj', 'image.data'], ['releaseTexture', 'destroy']]);

    markAsRemoved(cc.misc, ['clampf', 'lerp'], 'cc.misc');

    markAsWarning(cc.AnimationComponent, {
        addClip: 'createState',
        removeClip: 'removeState',
        getAnimationState: 'getState'
    }, 'cc.AnimationComponent');

    cc.vmath = {};
    markAsDeprecatedInObject_2(cc.vmath,
        [['equals','cc.math.equals'],
        ['approx','cc.math.approx'],
        ['clamp','cc.math.clamp'],
        ['clamp01','cc.math.clamp01'],
        ['lerp','cc.math.lerp'],
        ['toRadian','cc.math.toRadian'],
        ['toDegree','cc.math.toDegree'],
        ['random','cc.math.random'],
        ['randomRange','cc.math.randomRange'],
        ['randomRangeInt','cc.math.randomRangeInt'],
        ['pseudoRandom','cc.math.pseudoRandom'],
        ['pseudoRandomRangeInt','cc.math.pseudoRandomRangeInt'],
        ['nextPow2','cc.math.nextPow2'],
        ['repeat','cc.math.repeat'],
        ['pingPong','cc.math.pingPong'],
        ['inverseLerp','cc.math.inverseLerp'],
        ['EPSILON','cc.math.EPSILON'],
        ['random','cc.math.random']]);

    Object.defineProperty(cc.vmath, 'EPSILON', {
        get: function () {
            error("please use the function in cc.math");
            return cc.math.EPSILON;
        }
    });

    Object.defineProperty(cc.vmath, 'random', {
        get: function () {
            error("please use the function in cc.math");
            return cc.math.random;
        }
    });

    Object.defineProperty(cc.vmath, 'equals', {
        value: function (arg1,arg2) {
            error("please use the function in cc.math");
            return cc.math.equals(arg1,arg2);
        }
    });

    Object.defineProperty(cc.vmath, 'approx', {
        value: function (arg1,arg2,arg3) {
            error("please use the function in cc.math");
            return cc.math.approx(arg1,arg2,arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'clamp', {
        value: function (arg1,arg2,arg3) {
            error("please use the function in cc.math");
            return cc.math.clamp(arg1,arg2,arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'clamp01', {
        value: function (arg) {
            error("please use the function in cc.math");
            return cc.math.clamp01(arg);
        }
    });

    Object.defineProperty(cc.vmath, 'lerp', {
        value: function (arg1,arg2,arg3) {
            error("please use the function in cc.math");
            return cc.math.lerp(arg1,arg2,arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'toRadian', {
        value: function (arg) {
            error("please use the function in cc.math");
            return cc.math.toRadian(arg);
        }
    });

    Object.defineProperty(cc.vmath, 'toDegree', {
        value: function (args) {
            error("please use the function in cc.math");
            return cc.math.toDegree(args);
        }
    });

    Object.defineProperty(cc.vmath, 'randomRange', {
        value: function (arg1,arg2) {
            error("please use the function in cc.math");
            return cc.math.randomRange(arg1,arg2);
        }
    });

    Object.defineProperty(cc.vmath, 'randomRangeInt', {
        value: function (arg1,arg2) {
            error("please use the function in cc.math");
            return cc.math.randomRangeInt(arg1,arg2);
        }
    });

    Object.defineProperty(cc.vmath, 'pseudoRandom', {
        value: function (args) {
            error("please use the function in cc.math");
            return cc.math.pseudoRandom(args);
        }
    });

    Object.defineProperty(cc.vmath, 'pseudoRandomRange', {
        value: function (arg1,arg2,arg3) {
            error("please use the function in cc.math");
            return cc.math.pseudoRandomRange(arg1,arg2,arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'pseudoRandomRangeInt', {
        value: function (arg1,arg2,arg3) {
            error("please use the function in cc.math");
            return cc.math.pseudoRandomRangeInt(arg1,arg2,arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'nextPow2', {
        value: function (args) {
            error("please use the function in cc.math");
            return cc.math.nextPow2(args);
        }
    });

    Object.defineProperty(cc.vmath, 'repeat', {
        value: function (arg1,arg2) {
            error("please use the function in cc.math");
            return cc.math.repeat(arg1,arg2);
        }
    });

    Object.defineProperty(cc.vmath, 'pingPong', {
        value: function (arg1,arg2) {
            error("please use the function in cc.math");
            return cc.math.pingPong(arg1,arg2);
        }
    });

    Object.defineProperty(cc.vmath, 'inverseLerp', {
        value: function (arg1,arg2,arg3) {
            error("please use the function in cc.math");
            return cc.math.inverseLerp(arg1,arg2,arg3);
        }
    });

    markAsDeprecatedInObject_2(cc.vmath,
        [['vec2','cc.math.Vec2'],
        ['vec3','cc.math.Vec3'],
        ['vec4','cc.math.Vec4'],
        ['mat3','cc.math.Mat3'],
        ['mat4','cc.math.Mat4'],
        ['color4','cc.math.Color'],
        ['rect','cc.math.Rect']]);

    Object.defineProperty(cc.vmath, 'vec3', {
        get: function () {
            error("please use the function in cc.math");
            return cc.math.Vec3;
        }
    });

    Object.defineProperty(cc.vmath, 'vec2', {
        get: function () {
            error("please use the function in cc.math");
            return cc.math.Vec2;
        }
    });

    Object.defineProperty(cc.vmath, 'vec4', {
        get: function () {
            error("please use the function in cc.math");
            return cc.math.Vec4;
        }
    });

    Object.defineProperty(cc.vmath, 'mat3', {
        get: function () {
            error("please use the function in cc.math");
            return cc.math.Mat3;
        }
    });

    Object.defineProperty(cc.vmath, 'mat4', {
        get: function () {
            error("please use the function in cc.math");
            return cc.math.Mat4;
        }
    });

    Object.defineProperty(cc.vmath, 'color4', {
        get: function () {
            error("please use the function in cc.math");
            return cc.math.Color;
        }
    });

    Object.defineProperty(cc.vmath, 'rect', {
        get: function () {
            error("please use the function in cc.math");
            return cc.math.Rect;
        }
    });

    markAsDeprecatedInObject_2(cc.misc,
        [['clampf','cc.math.clamp'],
        ['clamp01','cc.math.clamp01'],
        ['lerp','cc.math.lerp'],
        ['degreesToRadians','cc.math.toRadian'],
        ['radiansToDegrees','cc.math.toDegree']]);

    Object.defineProperty(cc.misc, 'clamp01', {
        value: function (args) {
            error("please use the function in cc.math");
            return cc.math.clamp01(args);
        }
    });

    Object.defineProperty(cc.vmath, 'lerp', {
        value: function (arg1,arg2,arg3) {
            error("please use the function in cc.math");
            return cc.math.lerp(arg1,arg2,arg3);
        }
    });

    Object.defineProperty(cc.vmath, 'degreesToRadians', {
        value: function (args) {
            error("please use the function in cc.math");
            return cc.math.toRadian(args);
        }
    });

    Object.defineProperty(cc.vmath, 'radiansToDegrees', {
        value: function (args) {
            error("please use the function in cc.math");
            return cc.math.toDegree(args);
        }
    });

    Object.defineProperty(cc.vmath, 'clampf', {
        value: function (arg1,arg2,arg3) {
            error("please use the function in cc.math");
            return cc.math.clamp(arg1,arg2,arg3);
        }
    });

}
