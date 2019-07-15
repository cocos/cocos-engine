/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

// const FIX_BABEL6 = true;

/**
 * !#en Some JavaScript decorators which can be accessed with "cc._decorator".
 * !#zh 一些 JavaScript 装饰器，目前可以通过 "cc._decorator" 来访问。
 * （这些 API 仍不完全稳定，有可能随着 JavaScript 装饰器的标准实现而调整）
 *
 * @submodule _decorator
 * @module _decorator
 * @main
 */

// inspired by toddlxt (https://github.com/toddlxt/Creator-TypeScript-Boilerplate)

require('./CCClass');
const Preprocess = require('./preprocess-class');
const js = require('./js');
const isPlainEmptyObj_DEV = CC_DEV && require('./utils').isPlainEmptyObj_DEV;

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
        if (CC_DEV && validator_DEV(target, decoratorName) === false) {
            return function () {
                return fNOP;
            };
        }
        return function (ctor) {
            return decorate(ctor, target);
        };
    };
}

var checkCompArgument = _checkNormalArgument.bind(null, CC_DEV && function (arg, decoratorName) {
    if (!cc.Class._isCCClass(arg)) {
        cc.error('The parameter for %s is missing.', decoratorName);
        return false;
    }
});

function _argumentChecker (type) {
    return _checkNormalArgument.bind(null, CC_DEV && function (arg, decoratorName) {
        if (arg instanceof cc.Component || arg === undefined) {
            cc.error('The parameter for %s is missing.', decoratorName);
            return false;
        }
        else if (typeof arg !== type) {
            cc.error('The parameter for %s must be type %s.', decoratorName, type);
            return false;
        }
    });
}
var checkStringArgument = _argumentChecker('string');
var checkNumberArgument = _argumentChecker('number');
// var checkBooleanArgument = _argumentChecker('boolean');


function getClassCache (ctor, decoratorName) {
    if (CC_DEV && cc.Class._isCCClass(ctor)) {
        cc.error('`@%s` should be used after @ccclass for class "%s"', decoratorName, js.getClassName(ctor));
        return null;
    }
    return getSubDict(ctor, CACHE_KEY);
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


function extractActualDefaultValues (ctor) {
    var dummyObj;
    try {
        dummyObj = new ctor();
    }
    catch (e) {
        if (CC_DEV) {
            cc.warnID(3652, js.getClassName(ctor), e);
        }
        return {};
    }
    return dummyObj;
}

function genProperty (ctor, properties, propName, options, desc, cache) {
    var fullOptions;
    if (options) {
        fullOptions = CC_DEV ? Preprocess.getFullFormOfProperty(options, propName, js.getClassName(ctor)) :
                               Preprocess.getFullFormOfProperty(options);
    }
    var existsProperty = properties[propName];
    var prop = js.mixin(existsProperty || {}, fullOptions || options || {});

    var isGetset = desc && (desc.get || desc.set);
    if (isGetset) {
        // typescript or babel
        if (CC_DEV && options && (options.get || options.set)) {
            var errorProps = getSubDict(cache, 'errorProps');
            if (!errorProps[propName]) {
                errorProps[propName] = true;
                cc.warnID(3655, propName, js.getClassName(ctor), propName, propName);
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
        if (CC_DEV && (prop.get || prop.set)) {
            // @property({
            //     get () { ... },
            //     set (...) { ... },
            // })
            // value;
            cc.errorID(3655, propName, js.getClassName(ctor), propName, propName);
            return;
        }
        // member variables
        var defaultValue = undefined;
        var isDefaultValueSpecified = false;
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
            var actualDefaultValues = cache.default || (cache.default = extractActualDefaultValues(ctor));
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

        if ((CC_EDITOR && !Editor.isBuilder) || CC_TEST) {
            if (!fullOptions && options && options.hasOwnProperty('default')) {
                cc.warnID(3653, propName, js.getClassName(ctor));
                // prop.default = options.default;
            }
            else if (!isDefaultValueSpecified) {
                cc.warnID(3654, js.getClassName(ctor), propName);
                // prop.default = fullOptions.hasOwnProperty('default') ? fullOptions.default : undefined;
            }
            if (cc.RawAsset.wasRawAssetType(prop.url) &&
                prop._short &&
                isDefaultValueSpecified &&
                defaultValue == null
            ) {
                // Avoid excessive warning when the ts decorator format is wrong
                if (typeof options !== 'function' || cc.RawAsset.isRawAssetType(options)) {
                    cc.warnID(3656, js.getClassName(ctor), propName);
                }
            }
        }
        prop.default = defaultValue;
    }

    properties[propName] = prop;
}

/**
 * !#en
 * Declare the standard [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
 * as CCClass, please see [Class](../../../manual/en/scripting/class.html) for details.
 * !#zh
 * 将标准写法的 [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 声明为 CCClass，具体用法请参阅[类型定义](../../../manual/zh/scripting/class.html)。
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
 * @typescript
 * ccclass(name?: string): Function
 * ccclass(_class?: Function): void
 */
var ccclass = checkCtorArgument(function (ctor, name) {
    // if (FIX_BABEL6) {
    //     eval('if(typeof _classCallCheck==="function"){_classCallCheck=function(){};}');
    // }
    var base = js.getSuper(ctor);
    if (base === Object) {
        base = null;
    }

    var proto = {
        name,
        extends: base,
        ctor,
        __ES6__: true,
    };
    var cache = ctor[CACHE_KEY];
    if (cache) {
        var decoratedProto = cache.proto;
        if (decoratedProto) {
            // decoratedProto.properties = createProperties(ctor, decoratedProto.properties);
            js.mixin(proto, decoratedProto);
        }
        ctor[CACHE_KEY] = undefined;
    }

    var res = cc.Class(proto);

    // validate methods
    if (CC_DEV) {
        var propNames = Object.getOwnPropertyNames(ctor.prototype);
        for (var i = 0; i < propNames.length; ++i) {
            var prop = propNames[i];
            if (prop !== 'constructor') {
                var desc = Object.getOwnPropertyDescriptor(ctor.prototype, prop);
                var func = desc && desc.value;
                if (typeof func === 'function') {
                    Preprocess.doValidateMethodWithProps_DEV(func, prop, js.getClassName(ctor), ctor, base);
                }
            }
        }
    }

    return res;
});

/**
 * !#en
 * Declare property for [CCClass](../../../manual/en/scripting/reference/attributes.html).
 * !#zh
 * 定义 [CCClass](../../../manual/zh/scripting/reference/attributes.html) 所用的属性。
 *
 * @method property
 * @param {Object} [options] - an object with some property attributes
 * @param {Any} [options.type]
 * @param {Boolean|Function} [options.visible]
 * @param {String} [options.displayName]
 * @param {String} [options.tooltip]
 * @param {Boolean} [options.multiline]
 * @param {Boolean} [options.readonly]
 * @param {Number} [options.min]
 * @param {Number} [options.max]
 * @param {Number} [options.step]
 * @param {Number[]} [options.range]
 * @param {Boolean} [options.slide]
 * @param {Boolean} [options.serializable]
 * @param {Boolean} [options.editorOnly]
 * @param {Boolean} [options.override]
 * @param {Boolean} [options.animatable]
 * @param {String} [options.formerlySerializedAs]
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
 *         this._width = value;
 *     }
 *
 *     &#64;property
 *     offset = new cc.Vec2(100, 100);
 *
 *     &#64;property(cc.Vec2)
 *     offsets = [];
 *
 *     &#64;property(cc.SpriteFrame)
 *     frame = null;
 * }
 *
 * // above is equivalent to (上面的代码相当于):
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
 *         offset: new cc.Vec2(100, 100)
 *
 *         offsets: {
 *             default: [],
 *             type: cc.Vec2
 *         }
 *
 *         frame: {
 *             default: null,
 *             type: cc.SpriteFrame
 *         },
 *     }
 * });
 * @typescript
 * property(options?: {type?: any; visible?: boolean|(() => boolean); displayName?: string; tooltip?: string; multiline?: boolean; readonly?: boolean; min?: number; max?: number; step?: number; range?: number[]; slide?: boolean; serializable?: boolean; formerlySerializedAs?: string; editorOnly?: boolean; override?: boolean; animatable?: boolean} | any[]|Function|cc.ValueType|number|string|boolean): Function
 * property(_target: Object, _key: any, _desc?: any): void
 */
function property (ctorProtoOrOptions, propName, desc) {
    var options = null;
    function normalized (ctorProto, propName, desc) {
        var cache = getClassCache(ctorProto.constructor);
        if (cache) {
            var ccclassProto = getSubDict(cache, 'proto');
            var properties = getSubDict(ccclassProto, 'properties');
            genProperty(ctorProto.constructor, properties, propName, options, desc, cache);
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

function createEditorDecorator (argCheckFunc, editorPropName, staticValue) {
    return argCheckFunc(function (ctor, decoratedValue) {
        var cache = getClassCache(ctor, editorPropName);
        if (cache) {
            var value = (staticValue !== undefined) ? staticValue : decoratedValue;
            var proto = getSubDict(cache, 'proto');
            getSubDict(proto, 'editor')[editorPropName] = value;
        }
    }, editorPropName);
}

function createDummyDecorator (argCheckFunc) {
    return argCheckFunc(fNOP);
}

/**
 * !#en
 * Makes a CCClass that inherit from component execute in edit mode.<br>
 * By default, all components are only executed in play mode,
 * which means they will not have their callback functions executed while the Editor is in edit mode.
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
 * @typescript
 * executeInEditMode(): Function
 * executeInEditMode(_class: Function): void
 */
var executeInEditMode = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'executeInEditMode', true);

/**
 * !#en
 * Automatically add required component as a dependency for the CCClass that inherit from component.
 * !#zh
 * 为声明为 CCClass 的组件添加依赖的其它组件。当组件添加到节点上时，如果依赖的组件不存在，引擎将会自动将依赖组件添加到同一个节点，防止脚本出错。该设置在运行时同样有效。
 *
 * @method requireComponent
 * @param {Component} requiredComponent
 * @example
 * const {ccclass, requireComponent} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;requireComponent(cc.Sprite)
 * class SpriteCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * requireComponent(requiredComponent: typeof cc.Component): Function
 */
var requireComponent = createEditorDecorator(checkCompArgument, 'requireComponent');

/**
 * !#en
 * The menu path to register a component to the editors "Component" menu. Eg. "Rendering/CameraCtrl".
 * !#zh
 * 将当前组件添加到组件菜单中，方便用户查找。例如 "Rendering/CameraCtrl"。
 *
 * @method menu
 * @param {String} path - The path is the menu represented like a pathname.
 *                        For example the menu could be "Rendering/CameraCtrl".
 * @example
 * const {ccclass, menu} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;menu("Rendering/CameraCtrl")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * menu(path: string): Function
 */
var menu = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'menu');

/**
 * !#en
 * The execution order of lifecycle methods for Component.
 * Those less than 0 will execute before while those greater than 0 will execute after.
 * The order will only affect onLoad, onEnable, start, update and lateUpdate while onDisable and onDestroy will not be affected.
 * !#zh
 * 设置脚本生命周期方法调用的优先级。优先级小于 0 的组件将会优先执行，优先级大于 0 的组件将会延后执行。优先级仅会影响 onLoad, onEnable, start, update 和 lateUpdate，而 onDisable 和 onDestroy 不受影响。
 *
 * @method executionOrder
 * @param {Number} order - The execution order of lifecycle methods for Component. Those less than 0 will execute before while those greater than 0 will execute after.
 * @example
 * const {ccclass, executionOrder} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executionOrder(1)
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * executionOrder(order: number): Function
 */
var executionOrder = createEditorDecorator(checkNumberArgument, 'executionOrder');

/**
 * !#en
 * Prevents Component of the same type (or subtype) to be added more than once to a Node.
 * !#zh
 * 防止多个相同类型（或子类型）的组件被添加到同一个节点。
 *
 * @method disallowMultiple
 * @example
 * const {ccclass, disallowMultiple} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;disallowMultiple
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * disallowMultiple(): Function
 * disallowMultiple(_class: Function): void
 */
var disallowMultiple = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'disallowMultiple');

/**
 * !#en
 * If specified, the editor's scene view will keep updating this node in 60 fps when it is selected, otherwise, it will update only if necessary.<br>
 * This property is only available if executeInEditMode is true.
 * !#zh
 * 当指定了 "executeInEditMode" 以后，playOnFocus 可以在选中当前组件所在的节点时，提高编辑器的场景刷新频率到 60 FPS，否则场景就只会在必要的时候进行重绘。
 *
 * @method playOnFocus
 * @example
 * const {ccclass, playOnFocus, executeInEditMode} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executeInEditMode
 * &#64;playOnFocus
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * playOnFocus(): Function
 * playOnFocus(_class: Function): void
 */
var playOnFocus = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'playOnFocus', true);

/**
 * !#en
 * Specifying the url of the custom html to draw the component in **Properties**.
 * !#zh
 * 自定义当前组件在 **属性检查器** 中渲染时所用的网页 url。
 *
 * @method inspector
 * @param {String} url
 * @example
 * const {ccclass, inspector} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;inspector("packages://inspector/inspectors/comps/camera-ctrl.js")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * inspector(path: string): Function
 */
var inspector = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'inspector');

/**
 * !#en
 * Specifying the url of the icon to display in the editor.
 * !#zh
 * 自定义当前组件在编辑器中显示的图标 url。
 *
 * @method icon
 * @param {String} url
 * @private
 * @example
 * const {ccclass, icon} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;icon("xxxx.png")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * icon(path: string): Function
 */
var icon = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'icon');

/**
 * !#en
 * The custom documentation URL.
 * !#zh
 * 指定当前组件的帮助文档的 url，设置过后，在 **属性检查器** 中就会出现一个帮助图标，用户点击将打开指定的网页。
 *
 * @method help
 * @param {String} url
 * @example
 * const {ccclass, help} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;help("app://docs/html/components/spine.html")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * help(path: string): Function
 */
var help = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'help');

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
 * @typescript
 * mixins(ctor: Function, ...rest: Function[]): Function
 */
function mixins () {
    var mixins = [];
    for (var i = 0; i < arguments.length; i++) {
        mixins[i] = arguments[i];
    }
    return function (ctor) {
        var cache = getClassCache(ctor, 'mixins');
        if (cache) {
            getSubDict(cache, 'proto').mixins = mixins;
        }
    }
}

cc._decorator = module.exports = {
    ccclass,
    property,
    executeInEditMode,
    requireComponent,
    menu,
    executionOrder,
    disallowMultiple,
    playOnFocus,
    inspector,
    icon,
    help,
    mixins,
};
