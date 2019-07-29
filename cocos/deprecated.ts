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

}
