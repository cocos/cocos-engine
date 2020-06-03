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
 * @category core/_decorator
 * @en Some TypeScript decorators for class and data definition
 * @zh 一些用来定义类和数据的 TypeScript 装饰器
 */

// const FIX_BABEL6 = true;

// tslint:disable:only-arrow-functions
// tslint:disable:prefer-for-of
// tslint:disable:no-shadowed-variable
// tslint:disable:max-line-length
// tslint:disable:no-empty-interface

// inspired by @toddlxt (https://github.com/toddlxt/Creator-TypeScript-Boilerplate)

import * as js from '../utils/js';
import './class';
import { IExposedAttributes } from './utils/attribute-defines';
import { doValidateMethodWithProps_DEV, getFullFormOfProperty } from './utils/preprocess-class';
import { CCString, CCInteger, CCFloat, CCBoolean, PrimitiveType } from './utils/attribute';
import { error, errorID, warnID } from '../platform/debug';
import { DEV } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { Component } from '../components/component';

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
 * @en Declare a standard ES6 or TS Class as a CCClass, please refer to the [document](https://docs.cocos.com/creator3d/manual/zh/scripting/ccclass.html)
 * @zh 将标准写法的 ES6 或者 TS Class 声明为 CCClass，具体用法请参阅[类型定义](https://docs.cocos.com/creator3d/manual/zh/scripting/ccclass.html)。
 * @param name - The class name used for serialization.
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
export const ccclass: any | ((name?: string) => Function) = checkCtorArgument(function (ctor, name) {
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
 * @zh CCClass 属性选项。
 * @en CCClass property options
 */
export interface IPropertyOptions extends IExposedAttributes {
}

/**
 * @en Declare as a CCClass property with options
 * @zh 声明属性为 CCClass 属性。
 * @param options property options
 */
export function property (options?: IPropertyOptions): PropertyDecorator;

/**
 * @en Declare as a CCClass property with the property type
 * @zh 标注属性为 cc 属性。<br/>
 * 等价于`@property({type})`。
 * @param type A {{ccclass}} type or a {{ValueType}}
 */
export function property (type: PropertyType): PropertyDecorator;

/**
 * @en Declare as a CCClass property
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
 * @en Makes a CCClass that inherit from component execute in edit mode.<br/>
 * By default, all components are only executed in play mode,<br/>
 * which means they will not have their callback functions executed while the Editor is in edit mode.<br/>
 * @zh 允许继承自 Component 的 CCClass 在编辑器里执行。<br/>
 * 默认情况下，所有 Component 都只会在运行时才会执行，也就是说它们的生命周期回调不会在编辑器里触发。
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
 * @en Declare that the current component relies on another type of component. 
 * If the required component doesn't exist, the engine will create a new empty instance of the required component and add to the node.
 * @zh 为声明为 CCClass 的组件添加依赖的其它组件。当组件添加到节点上时，如果依赖的组件不存在，引擎将会自动将依赖组件添加到同一个节点，防止脚本出错。该设置在运行时同样有效。
 * @param requiredComponent The required component type
 * @example
 * ```typescript
 * import {_decorator, SpriteComponent, Component} from cc;
 * import {ccclass, requireComponent} from _decorator;
 *
 * @ccclass
 * @requireComponent(SpriteComponent)
 * class SpriteCtrl extends Component {
 *     // ...
 * }
 * ```
 */
export const requireComponent: (requiredComponent: Function) => Function = createEditorDecorator(checkCompArgument, 'requireComponent');

/**
 * @en Add the current component to the specific menu path in `Add Component` selector of the inspector panel
 * @zh 将当前组件添加到组件菜单中，方便用户查找。例如 "Rendering/CameraCtrl"。
 * @param path - The path is the menu represented like a pathname. For example the menu could be "Rendering/CameraCtrl".
 * @example
 * ```typescript
 * const {ccclass, menu} = cc._decorator;
 *
 * @ccclass
 * @menu("Rendering/CameraCtrl")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const menu: (path: string) => Function = (DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'menu');

/**
 * @en Set the component priority, it decides at which order the life cycle functions of components will be invoked. Smaller priority get invoked before larger priority.
 * This will affect `onLoad`, `onEnable`, `start`, `update` and `lateUpdate`, but `onDisable` and `onDestroy` won't be affected.
 * @zh 设置脚本生命周期方法调用的优先级。优先级小于 0 的组件将会优先执行，优先级大于 0 的组件将会延后执行。优先级仅会影响 onLoad, onEnable, start, update 和 lateUpdate，而 onDisable 和 onDestroy 不受影响。
 * @param priority - The execution order of life cycle methods for Component. Smaller priority get invoked before larger priority.
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
export const executionOrder: (priority: number) => Function = createEditorDecorator(checkNumberArgument, 'executionOrder');

/**
 * @en Forbid add multiple instances of the component to the same node.
 * @zh 防止多个相同类型（或子类型）的组件被添加到同一个节点。
 * @example
 * ```typescript
 * const {ccclass, disallowMultiple} = cc._decorator;
 *
 * @ccclass
 * @disallowMultiple
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const disallowMultiple = (DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'disallowMultiple');

/**
 * @en When {{executeInEditMode}} is set, this decorator will decide when a node with the component is on focus whether the editor should running in high FPS mode.
 * @zh 当指定了 "executeInEditMode" 以后，playOnFocus 可以在选中当前组件所在的节点时，提高编辑器的场景刷新频率到 60 FPS，否则场景就只会在必要的时候进行重绘。
 * @example
 * ```typescript
 * const {ccclass, playOnFocus, executeInEditMode} = cc._decorator;
 *
 * @ccclass
 * @executeInEditMode
 * @playOnFocus
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const playOnFocus = (DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'playOnFocus');

/**
 * @en Use a customized inspector page in the **inspector**
 * @zh 自定义当前组件在 **属性检查器** 中渲染时所用的 UI 页面描述。
 * @param url The url of the page definition in js
 * @example
 * ```typescript
 * const {ccclass, inspector} = cc._decorator;
 *
 * @ccclass
 * @inspector("packages://inspector/inspectors/comps/camera-ctrl.js")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const inspector: (url: string) => Function = (DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'inspector');

/**
 * @en Define the icon of the component.
 * @zh 自定义当前组件在编辑器中显示的图标 url。
 * @param url
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
export const icon: (url: string) => Function = (DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'icon');

/**
 * @en Define the help documentation url, if given, the component section in the **inspector** will have a help documentation icon reference to the web page given. 
 * @zh 指定当前组件的帮助文档的 url，设置过后，在 **属性检查器** 中就会出现一个帮助图标，用户点击将打开指定的网页。
 * @param url The url of the help documentation
 * @example
 * ```typescript
 * const {ccclass, help} = cc._decorator;
 *
 * @ccclass
 * @help("app://docs/html/components/spine.html")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * ```
 */
export const help: (url: string) => Function = (DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'help');

// Other Decorators

/**
 * @en Declare the property as integer
 * @zh 将该属性标记为整数。
 */
export const integer = type(CCInteger);

/**
 * @en Declare the property as float
 * @zh 将该属性标记为浮点数。
 */
export const float = type(CCFloat);

/**
 * @en Declare the property as boolean
 * @zh 将该属性标记为布尔值。
 */
export const boolean = type(CCBoolean);

/**
 * @en Declare the property as string
 * @zh 将该属性标记为字符串。
 */
export const string = type(CCString);

/**
 * @en Declare the property as the given type
 * @zh 标记该属性的类型。
 * @param type
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