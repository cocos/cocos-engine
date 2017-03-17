/****************************************************************************
 Copyright (c) 2013-2017 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

// const FIX_BABEL6 = true;

/**
 * !#en Some JavaScript decorators which can be accessed with "cc._decorator".
 * !#zh 一些 JavaScript 装饰器，目前可以通过 "cc._decorator" 来访问。
 * （这些 API 仍不完全稳定，有可能随着 JavaScript 装饰器的标准实现而调整）
 *
 * @submodule _decorator
 * @module _decorator
 */

// inspired by toddlxt (https://github.com/toddlxt/Creator-TypeScript-Boilerplate)

require('./CCClass');
const Preprocess = require('./preprocess-class');
const JS = require('./js');

function getSubDict (obj, key) {
    var res = obj[key];
    if (!res) {
        res = obj[key] = {};
    }
    return res;
}

function normalizeCtorDecorator (transformFunc, env) {
    if (env === false) {
        return function () {};
    }
    return function (target) {
        if (typeof target === 'function') {
            return transformFunc(target);
        }
        return function (ctor) {
            return transformFunc(ctor, target);
        };
    }
}

function getClassProto (ctor, decoratorName) {
    if (CC_DEV && cc.Class._isCCClass(ctor)) {
        cc.error('@%s should be used after @ccclass for class "%s"', decoratorName, JS.getClassName(ctor));
        return null;
    }
    return getSubDict(ctor, '__ccclassProto__');
}

function getDefaultFromInitializer (initializer) {
    var value;
    try {
        value = initializer();
    }
    catch (e) {
        // just lazy initialize by CCClass
        return initializer;
    }
    if (typeof value !== 'object' || value === null) {
        // string boolean number function undefined null
        return value;
    }
    else {
        // The default attribute will not be used in ES6 constructor actually,
        // so we dont need to simplify into `{}` or `[]` or vec2 completely.
        return initializer;
    }
}

/**
 * !#en
 * Declare the standard [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
 * as CCClass, please see [Class](/docs/editors_and_tools/creator-chapters/scripting/class/) for details.
 * !#zh
 * 将标准写法的 [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 声明为 CCClass，具体用法请参阅[类型定义](/docs/creator/scripting/class/)。
 *
 * @method ccclass
 * @param {String} [name] - The class name used for serialization.
 * @example
 * const {ccclass} = cc._decorator;
 *
 * // define a CCClass, omit the name
 * &#64;ccclass
 * class NewScript extends cc.Component {
 *     // ...
 * }
 *
 * // define a CCClass with a name
 * &#64;ccclass('LoginData')
 * class LoginData {
 *     // ...
 * }
 */
var ccclass = normalizeCtorDecorator(function (ctor, name) {
    // if (FIX_BABEL6) {
    //     eval('if(typeof _classCallCheck==="function"){_classCallCheck=function(){};}');
    // }
    var base = JS.getSuper(ctor);
    if (base === Object) {
        base = null;
    }
    var proto = {
        name,
        extends: base,
        ctor,
        __ES6__: true,
    };
    var decoratedProto = ctor.__ccclassProto__;
    if (decoratedProto) {
        JS.mixin(proto, decoratedProto);
        ctor.__ccclassProto__ = undefined;
    }
    var res = cc.Class(proto);
    // if (FIX_BABEL6) {
    //     for (var method in Object.getOwnPropertyNames(ctor.prototype)) {
    //     }
    // }
    return res;
});

/**
 * !#en
 * Declare property for [CCClass](/docs/editors_and_tools/creator-chapters/scripting/class/).
 * !#zh
 * 定义 [CCClass](/docs/creator/scripting/class/) 所用的属性。
 *
 * @method property
 * @param {Object} [options] - an object with some property attributes
 * @example
 * const {ccclass, property} = cc._decorator;
 *
 * &#64;ccclass
 * class NewScript extends cc.Component {
 *     &#64;property({
 *         type: cc.Node
 *     })
 *     targetNode1 = null;
 *
 *     &#64;property(cc.Node)
 *     targetNode2 = null;
 *
 *     &#64;property(cc.Button)
 *     targetButton = null;
 *
 *     &#64;property
 *     _width = 100;
 *
 *     &#64;property
 *     get width () {
 *         return this._width;
 *     }
 *
 *     &#64;property
 *     set width (value) {
 *         return this._width = value;
 *     }
 *
 *     &#64;property
 *     offset = new cc.Vec2(100, 100);
 *
 *     &#64;property(cc.Texture2D)
 *     texture = "";
 * }
 *
 * // above is equivalent to...
 *
 * var NewScript = cc.Class({
 *     properties: {
 *         targetNode1: {
 *             default: null,
 *             type: cc.Node
 *         },
 *
 *         targetNode2: {
 *             default: null,
 *             type: cc.Node
 *         },
 *
 *         targetButton: {
 *             default: null,
 *             type: cc.Button
 *         },
 *
 *         _width: 100,
 *
 *         width: {
 *             get () {
 *                 return this._width;
 *             },
 *             set (value) {
 *                 this._width = value;
 *             }
 *         },
 *
 *         texture: {
 *             default: "",
 *             url: cc.Texture2D
 *         },
 *     }
 * });
 */
function property (ctorProtoOrOptions, propName, desc) {
    var options = null;
    function normalized (ctorProto, propName, desc) {
        var ccclassProto = getClassProto(ctorProto.constructor);
        if (ccclassProto) {
            var props = getSubDict(ccclassProto, 'properties');
            var prop = props[propName];
            var fullOptions = options && (Preprocess.getFullFormOfProperty(options) || options);
            // if (options && prop && (typeof prop !== 'object')) {
            //     if (CC_DEV && prop) {
            //         cc.error('Can not merge decorator %s with %s for property %s of Class "%s"',
            //             prop, options, propName, JS.getClassName(ctorProto.constructor));
            //     }
            //     prop = options;
            // }
            prop = JS.mixin(prop || {}, fullOptions || {});
            if (desc.initializer) {
                if (CC_DEV && options && options.default) {
                    cc.warnID(3650, 'default', propName, JS.getClassName(ctorProto.constructor));
                }

                prop.default = getDefaultFromInitializer(desc.initializer);
            }
            else {
                if (desc.value) {
                    console.error('TS?');
                }
                if (desc.get) {
                    if (CC_DEV && options && options.get) {
                        cc.warnID(3650, 'get', propName, JS.getClassName(ctorProto.constructor));
                    }
                    prop.get = desc.get;
                }
                if (desc.set) {
                    if (CC_DEV && options && options.set) {
                        cc.warnID(3650, 'set', propName, JS.getClassName(ctorProto.constructor));
                    }
                    prop.set = desc.set;
                }
            }
            props[propName] = prop;
        }
    }
    if (typeof propName === 'undefined') {
        options = ctorProtoOrOptions;
        return normalized;
    }
    else {
        normalized(ctorProtoOrOptions, propName, desc);
    }
}

// Editor Decorators

function createEditorDecorator (impl) {
    return normalizeCtorDecorator(function (ctor) {
        var proto = getClassProto(ctor, 'executeInEditMode');
        if (proto) {
            impl(getSubDict(proto, 'editor'));
        }
    }, CC_DEV);
}

/**
 * !#en
 * Makes a CCClass that inherit from component execute in edit mode.<br>
 * By default, all components are only executed in play mode, which means they will not have their callback functions executed while the Editor is in edit mode.
 * !#zh
 * 允许继承自 Component 的 CCClass 在编辑器里执行。<br>
 * 默认情况下，所有 Component 都只会在运行时才会执行，也就是说它们的生命周期回调不会在编辑器里触发。
 *
 * @method executeInEditMode
 * @example
 * const {ccclass, executeInEditMode} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executeInEditMode
 * class NewScript extends cc.Component {
 *     // ...
 * }
 */
var executeInEditMode = createEditorDecorator(function (editorProto) {
    editorProto.executeInEditMode = true;
});

// Other Decorators

/**
 * NOTE:<br>
 * The old mixins implemented in cc.Class(ES5) behaves exact the same as multiple inheritance.
 * But since ES6, class constructor can't be function-called and class methods become non-enumerable,
 * so we can not mix in ES6 Classes.<br>
 * See:<br>
 * [https://esdiscuss.org/topic/traits-are-now-impossible-in-es6-until-es7-since-rev32](https://esdiscuss.org/topic/traits-are-now-impossible-in-es6-until-es7-since-rev32)<br>
 * One possible solution (but IDE unfriendly):<br>
 * [http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)<br>
 * <br>
 * NOTE:<br>
 * You must manually call mixins constructor, this is different from cc.Class(ES5).
 *
 * @method mixins
 * @param {Function} ...ctor - constructors to mix, only support ES5 constructors or classes defined by using `cc.Class`,
 *                             not support ES6 Classes.
 * @example
 * const {ccclass, mixins} = cc._decorator;
 *
 * class Animal { ... }
 *
 * const Fly = cc.Class({
 *     constructor () { ... }
 * });
 *
 * &#64;ccclass
 * &#64;mixins(cc.EventTarget, Fly)
 * class Bird extends Animal {
 *     constructor () {
 *         super();
 *
 *         // You must manually call mixins constructor, this is different from cc.Class(ES5)
 *         cc.EventTarget.call(this);
 *         Fly.call(this);
 *     }
 *     // ...
 * }
 */
function mixins () {
    var mixins = [];
    for (var i = 0; i < arguments.length; i++) {
        mixins[i] = arguments[i];
    }
    return function (ctor) {
        var proto = getClassProto(ctor, 'mixins');
        if (proto) {
            proto.mixins = mixins;
        }
    }
}

cc._decorator = module.exports = {
    ccclass,
    property,
    executeInEditMode,
    mixins,
};

// if (CC_EDITOR) {
//     ccclass.reset = function () {
//         currentProperties = {};
//         defined = {};
//         definedClass = {};
//     };
// }

// declare interface IProperty {
//     type?: any;
//     visible?: boolean;
//     displayName?: string;
//     tooltip?: string;
//     multiline?: boolean;
//     readonly?: boolean;
//     min?: number;
//     max?: number;
//     step?: number;
//     range?: Array<number>;
//     slide?: boolean;
//     serializable?: boolean;
//     editorOnly?: boolean;
//     url?: any;
//     override?: boolean;
//     animatable?: boolean;
// }
//
// declare interface IEditor {
//     requireComponent?: cc.Component;
//     disallowMultiple?: cc.Component;
//     menu?: string;
//     executionOrder?: number;
//     executeInEditMode?: boolean;
//     playOnFocus?: boolean;
//     inspector?: string;
//     icon?: string;
//     help?: string;
// }
