/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 * @category core/data
 */

// const FIX_BABEL6 = true;

// tslint:disable:only-arrow-functions
// tslint:disable:prefer-for-of
// tslint:disable:no-shadowed-variable
// tslint:disable:max-line-length
// tslint:disable:no-empty-interface

/**
 * Some JavaScript decorators which can be accessed with "cc._decorator".
 * 一些 JavaScript 装饰器，目前可以通过 "cc._decorator" 来访问。
 * （这些 API 仍不完全稳定，有可能随着 JavaScript 装饰器的标准实现而调整）
 *
 * @submodule _decorator
 * @module _decorator
 * @main
 */

// inspired by toddlxt (https://github.com/toddlxt/Creator-TypeScript-Boilerplate)

import * as js from '../utils/js';
import './class';
import { IExposedAttributes } from './utils/attribute-defines';
import { doValidateMethodWithProps_DEV, getFullFormOfProperty } from './utils/preprocess-class';
import { CCString, CCInteger, CCFloat, CCBoolean, PrimitiveType } from './utils/attribute';
import { error, errorID, warnID } from '../platform/debug';
import { DEV } from 'internal:constants';
import { legacyCC } from '../global-exports';

// caches for class construction
const CACHE_KEY = '__ccclassCache__';

function fNOP (ctor) {
    return ctor;
}

function getSubDict (obj, key) {
    return obj[key] || (obj[key] = {});
}

function checkCtorArgument (decorate) {
    return function (target) {
        if (typeof target === 'function') {
            // no parameter, target is ctor
            return decorate(target);
        }
        return function (ctor) {
            return decorate(ctor, target);
        };
    };
}

function _checkNormalArgument (validator_DEV, decorate, decoratorName) {
    return function (target) {
        if (DEV && validator_DEV(target, decoratorName) === false) {
            return function () {
                return fNOP;
            };
        }
        return function (ctor) {
            return decorate(ctor, target);
        };
    };
}

const checkCompArgument = _checkNormalArgument.bind(null, DEV && function (arg, decoratorName) {
    if (!legacyCC.Class._isCCClass(arg)) {
        error('The parameter for %s is missing.', decoratorName);
        return false;
    }
});

function _argumentChecker (type) {
    return _checkNormalArgument.bind(null, DEV && function (arg, decoratorName) {
        if (arg instanceof legacyCC.Component || arg === undefined) {
            error('The parameter for %s is missing.', decoratorName);
            return false;
        }
        else if (typeof arg !== type) {
            error('The parameter for %s must be type %s.', decoratorName, type);
            return false;
        }
    });
}
const checkStringArgument = _argumentChecker('string');
const checkNumberArgument = _argumentChecker('number');
// var checkBooleanArgument = _argumentChecker('boolean');

function getClassCache (ctor, decoratorName?) {
    if (DEV && legacyCC.Class._isCCClass(ctor)) {
        error('`@%s` should be used after @ccclass for class "%s"', decoratorName, js.getClassName(ctor));
        return null;
    }
    return getSubDict(ctor, CACHE_KEY);
}

function getDefaultFromInitializer (initializer) {
    let value;
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

function extractActualDefaultValues (ctor) {
    let dummyObj;
    try {
        dummyObj = new ctor();
    }
    catch (e) {
        if (DEV) {
            warnID(3652, js.getClassName(ctor), e);
        }
        return {};
    }
    return dummyObj;
}

function genProperty (ctor, properties, propName, options, desc, cache) {
    let fullOptions;
    if (options) {
        fullOptions = DEV ? getFullFormOfProperty(options, propName, js.getClassName(ctor)) :
            getFullFormOfProperty(options);
        fullOptions = fullOptions || options;
    }
    const existsProperty = properties[propName];
    const prop = js.mixin(existsProperty || {}, fullOptions || {});

    const isGetset = desc && (desc.get || desc.set);
    if (isGetset) {
        // typescript or babel
        if (DEV && options && (options.get || options.set)) {
            const errorProps = getSubDict(cache, 'errorProps');
            if (!errorProps[propName]) {
                errorProps[propName] = true;
                warnID(3655, propName, js.getClassName(ctor), propName, propName);
            }
        }
        if (desc.get) {
            prop.get = desc.get;
        }
        if (desc.set) {
            prop.set = desc.set;
        }
    }
    else {
        if (DEV && (prop.get || prop.set)) {
            // @property({
            //     get () { ... },
            //     set (...) { ... },
            // })
            // value;
            errorID(3655, propName, js.getClassName(ctor), propName, propName);
            return;
        }
        // member variables
        let defaultValue;
        let isDefaultValueSpecified = false;
        if (desc) {
            // babel
            if (desc.initializer) {
                // @property(...)
                // value = null;
                defaultValue = getDefaultFromInitializer(desc.initializer);
                isDefaultValueSpecified = true;
            }
            else {
                // @property(...)
                // value;
            }
        }
        else {
            // typescript
            const actualDefaultValues = cache.default || (cache.default = extractActualDefaultValues(ctor));
            if (actualDefaultValues.hasOwnProperty(propName)) {
                // @property(...)
                // value = null;
                defaultValue = actualDefaultValues[propName];
                isDefaultValueSpecified = true;
            }
            else {
                // @property(...)
                // value;
            }
        }

        if (DEV) {
            if (options && options.hasOwnProperty('default')) {
                warnID(3653, propName, js.getClassName(ctor));
                // prop.default = options.default;
            }
            else if (!isDefaultValueSpecified) {
                warnID(3654, js.getClassName(ctor), propName);
                // prop.default = fullOptions.hasOwnProperty('default') ? fullOptions.default : undefined;
            }
        }
        prop.default = defaultValue;
    }

    properties[propName] = prop;
}

/**
 * 将标准写法的 [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 声明为 CCClass，具体用法请参阅[类型定义](/docs/creator/scripting/class/)。
 *
 * @method ccclass
 * @param {String} [name] - The class name used for serialization.
 * @example
 * ```typescript
 * const {ccclass} = cc._decorator;
 *
 * // define a CCClass, omit the name
 *  @ccclass
 * class NewScript extends cc.Component {
 *     // ...
 * }
 *
 * // define a CCClass with a name
 *  @ccclass('LoginData')
 * class LoginData {
 *     // ...
 * }
 * ```
 */

export const ccclass = checkCtorArgument(function (ctor, name) {
    // if (FIX_BABEL6) {
    //     eval('if(typeof _classCallCheck==="function"){_classCallCheck=function(){};}');
    // }
    let base = js.getSuper(ctor);
    if (base === Object) {
        base = null;
    }

    const proto = {
        name,
        extends: base,
        ctor,
        __ES6__: true,
    };
    const cache = ctor[CACHE_KEY];
    if (cache) {
        const decoratedProto = cache.proto;
        if (decoratedProto) {
            // decoratedProto.properties = createProperties(ctor, decoratedProto.properties);
            js.mixin(proto, decoratedProto);
        }
        ctor[CACHE_KEY] = undefined;
    }

    const res = legacyCC.Class(proto);

    // validate methods
    if (DEV) {
        const propNames = Object.getOwnPropertyNames(ctor.prototype);
        for (let i = 0; i < propNames.length; ++i) {
            const prop = propNames[i];
            if (prop !== 'constructor') {
                const desc = Object.getOwnPropertyDescriptor(ctor.prototype, prop);
                const func = desc && desc.value;
                if (typeof func === 'function') {
                    doValidateMethodWithProps_DEV(func, prop, js.getClassName(ctor), ctor, base);
                }
            }
        }
    }

    return res;
});

export type SimplePropertyType = Function | string | typeof CCString | typeof CCInteger | typeof CCFloat | typeof CCBoolean;

export type PropertyType = SimplePropertyType | SimplePropertyType[];

/**
 * @zh cc 属性选项。
 */
export interface IPropertyOptions extends IExposedAttributes {
}

/**
 * @zh 标注属性为 cc 属性。
 * @param options 选项。
 */
export function property (options?: IPropertyOptions): PropertyDecorator;

/**
 * @zh 标注属性为 cc 属性。<br/>
 * 等价于`@property({type})`。
 * @param type cc 属性的类型。
 */
export function property (type: PropertyType): PropertyDecorator;

/**
 * @zh 标注属性为 cc 属性。<br/>
 * 等价于`@property()`。
 */
export function property (target: Object, propertyKey: string | symbol): void;

export function property (ctorProtoOrOptions?, propName?, desc?) {
    let options = null;
    function normalized (ctorProto, propName, desc) {
        const cache = getClassCache(ctorProto.constructor);
        if (cache) {
            const ccclassProto = getSubDict(cache, 'proto');
            const properties = getSubDict(ccclassProto, 'properties');
            genProperty(ctorProto.constructor, properties, propName, options, desc, cache);
        }
    }
    if (ctorProtoOrOptions === undefined) {
        // @property(undefined)
        return property({
            type: undefined,
        });
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

function createEditorDecorator (argCheckFunc, editorPropName, staticValue?) {
    return argCheckFunc(function (ctor, decoratedValue) {
        const cache = getClassCache(ctor, editorPropName);
        if (cache) {
            const value = (staticValue !== undefined) ? staticValue : decoratedValue;
            const proto = getSubDict(cache, 'proto');
            getSubDict(proto, 'editor')[editorPropName] = value;
        }
    }, editorPropName);
}

function createDummyDecorator (argCheckFunc) {
    return argCheckFunc(fNOP);
}

/**
 * Makes a CCClass that inherit from component execute in edit mode.<br/>
 * By default, all components are only executed in play mode,<br/>
 * which means they will not have their callback functions executed while the Editor is in edit mode.<br/>
 * 允许继承自 Component 的 CCClass 在编辑器里执行。<br/>
 * 默认情况下，所有 Component 都只会在运行时才会执行，也就是说它们的生命周期回调不会在编辑器里触发。
 *
 * @method executeInEditMode
 * @example
 * ```typescript
 * const {ccclass, executeInEditMode} = cc._decorator;
 *
 *  @ccclass
 *  @executeInEditMode
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const executeInEditMode = (DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'executeInEditMode', true);

/**
 * 为声明为 CCClass 的组件添加依赖的其它组件。当组件添加到节点上时，如果依赖的组件不存在，引擎将会自动将依赖组件添加到同一个节点，防止脚本出错。该设置在运行时同样有效。
 *
 * @method requireComponent
 * @param {Component} requiredComponent
 * @example
 * ```typescript
 * const {ccclass, requireComponent} = cc._decorator;
 *
 *  @ccclass
 *  @requireComponent(cc.SpriteComponent)
 * class SpriteCtrl extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const requireComponent = createEditorDecorator(checkCompArgument, 'requireComponent');

/**
 * 将当前组件添加到组件菜单中，方便用户查找。例如 "Rendering/CameraCtrl"。
 *
 * @method menu
 * @param {String} path - The path is the menu represented like a pathname.
 *                        For example the menu could be "Rendering/CameraCtrl".
 * @example
 * ```typescript
 * const {ccclass, menu} = cc._decorator;
 *
 *  @ccclass
 *  @menu("Rendering/CameraCtrl")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const menu = (DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'menu');

/**
 * 设置脚本生命周期方法调用的优先级。优先级小于 0 的组件将会优先执行，优先级大于 0 的组件将会延后执行。优先级仅会影响 onLoad, onEnable, start, update 和 lateUpdate，而 onDisable 和 onDestroy 不受影响。
 *
 * @method executionOrder
 * @param {Number} order - The execution order of lifecycle methods for Component. Those less than 0 will execute before while those greater than 0 will execute after.
 * @example
 * ```typescript
 * const {ccclass, executionOrder} = cc._decorator;
 *
 *  @ccclass
 *  @executionOrder(1)
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const executionOrder = createEditorDecorator(checkNumberArgument, 'executionOrder');

/**
 * 防止多个相同类型（或子类型）的组件被添加到同一个节点。
 *
 * @method disallowMultiple
 * @example
 * ```typescript
 * const {ccclass, disallowMultiple} = cc._decorator;
 *
 *  @ccclass
 *  @disallowMultiple
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const disallowMultiple = (DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'disallowMultiple');

/**
 * 当指定了 "executeInEditMode" 以后，playOnFocus 可以在选中当前组件所在的节点时，提高编辑器的场景刷新频率到 60 FPS，否则场景就只会在必要的时候进行重绘。
 *
 * @method playOnFocus
 * @example
 * ```typescript
 * const {ccclass, playOnFocus, executeInEditMode} = cc._decorator;
 *
 *  @ccclass
 *  @executeInEditMode
 *  @playOnFocus
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const playOnFocus = (DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'playOnFocus');

/**
 * 自定义当前组件在 **属性检查器** 中渲染时所用的网页 url。
 *
 * @method inspector
 * @param {String} url
 * @example
 * ```typescript
 * const {ccclass, inspector} = cc._decorator;
 *
 *  @ccclass
 *  @inspector("packages://inspector/inspectors/comps/camera-ctrl.js")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const inspector = (DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'inspector');

/**
 * 自定义当前组件在编辑器中显示的图标 url。
 *
 * @method icon
 * @param {String} url
 * @private
 * @example
 * ```typescript
 * const {ccclass, icon} = cc._decorator;
 *
 *  @ccclass
 *  @icon("xxxx.png")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const icon = (DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'icon');

/**
 * 指定当前组件的帮助文档的 url，设置过后，在 **属性检查器** 中就会出现一个帮助图标，用户点击将打开指定的网页。
 *
 * @method help
 * @param {String} url
 * @example
 * ```typescript
 * const {ccclass, help} = cc._decorator;
 *
 *  @ccclass
 *  @help("app://docs/html/components/spine.html")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const help = (DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'help');

// Other Decorators

/**
 * @en
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
 * @zh
 * *注意：<br>
 * 在cc.Class（ES5）中实现的旧mixin的行为与多重继承完全相同。
 * 但是从ES6开始，类构造函数不能被函数调用，类方法变得不可枚举，
 * 所以我们不能混合使用ES6类。<br>
 * 参看：<br>
 * [https://esdiscuss.org/topic/traits-are-now-impossible-in-es6-until-es7-since-rev32](https://esdiscuss.org/topic/traits-are-now-impossible-in-ES6-直到-ES7，因为-rev32）点击
 * 一种可能的解决方案（但对 IDE 不友好）：<br>
 * [http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/）结果
 * <br>
 * 注意：<br>
 * 您必须手动调用mixins构造函数，这与cc.Class（ES5）不同。
 *
 * @method mixins
 * @param {Function} ...ctor - constructors to mix, only support ES5 constructors or classes defined by using `cc.Class`,
 *                             not support ES6 Classes.
 * @example
 * ```typescript
 * const {ccclass, mixins} = cc._decorator;
 *
 * class Animal { ... }
 *
 * const Fly = cc.Class({
 *     constructor () { ... }
 * });
 *
 *  @ccclass
 *  @mixins(cc.EventTarget, Fly)
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
 * ```
 */
export function mixins (...constructors: Function[]) {
    const mixins: Function[] = [];
    for (let i = 0; i < constructors.length; i++) {
        mixins[i] = constructors[i];
    }
    return function (ctor) {
        const cache = getClassCache(ctor, 'mixins');
        if (cache) {
            getSubDict(cache, 'proto').mixins = mixins;
        }
    };
}

/**
 * 将该属性标记为 cc 整数。
 */
export const integer = type(CCInteger);

/**
 * 将该属性标记为 cc 浮点数。
 */
export const float = type(CCFloat);

/**
 * 将该属性标记为 cc 布尔值。
 */
export const boolean = type(CCBoolean);

/**
 * 将该属性标记为 cc 字符串。
 */
export const string = type(CCString);

/**
 * 标记该属性的类型。
 * @param type 指定类型。
 */
export function type (type: Function): PropertyDecorator;

export function type (type: [Function]): PropertyDecorator;

export function type<T> (type: PrimitiveType<T>): PropertyDecorator;

export function type<T> (type: [PrimitiveType<T>]): PropertyDecorator;

export function type<T> (type: PrimitiveType<T> | Function | [PrimitiveType<T>] | [Function]): PropertyDecorator {
    return property({
        type,
    });
}