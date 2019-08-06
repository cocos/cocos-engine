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

var js = require('./js');
var Enum = require('./CCEnum');
var utils = require('./utils');
var _isPlainEmptyObj_DEV = utils.isPlainEmptyObj_DEV;
var _cloneable_DEV = utils.cloneable_DEV;
var Attr = require('./attribute');
var DELIMETER = Attr.DELIMETER;
var preprocess = require('./preprocess-class');
require('./requiring-frame');

var BUILTIN_ENTRIES = ['name', 'extends', 'mixins', 'ctor', '__ctor__', 'properties', 'statics', 'editor', '__ES6__'];

var INVALID_STATICS_DEV = CC_DEV && ['name', '__ctors__', '__props__', 'arguments', 'call', 'apply', 'caller',
                       'length', 'prototype'];

function pushUnique (array, item) {
    if (array.indexOf(item) < 0) {
        array.push(item);
    }
}

var deferredInitializer = {

    // Configs for classes which needs deferred initialization
    datas: null,

    // register new class
    // data - {cls: cls, cb: properties, mixins: options.mixins}
    push: function (data) {
        if (this.datas) {
            this.datas.push(data);
        }
        else {
            this.datas = [data];
            // start a new timer to initialize
            var self = this;
            setTimeout(function () {
                self.init();
            }, 0);
        }
    },

    init: function () {
        var datas = this.datas;
        if (datas) {
            for (var i = 0; i < datas.length; ++i) {
                var data = datas[i];
                var cls = data.cls;
                var properties = data.props;
                if (typeof properties === 'function') {
                    properties = properties();
                }
                var name = js.getClassName(cls);
                if (properties) {
                    declareProperties(cls, name, properties, cls.$super, data.mixins);
                }
                else {
                    cc.errorID(3633, name);
                }
            }
            this.datas = null;
        }
    }
};

// both getter and prop must register the name into __props__ array
function appendProp (cls, name) {
    if (CC_DEV) {
        //if (!IDENTIFIER_RE.test(name)) {
        //    cc.error('The property name "' + name + '" is not compliant with JavaScript naming standards');
        //    return;
        //}
        if (name.indexOf('.') !== -1) {
            cc.errorID(3634);
            return;
        }
    }
    pushUnique(cls.__props__, name);
}

function defineProp (cls, className, propName, val, es6) {
    var defaultValue = val.default;

    if (CC_DEV) {
        if (!es6) {
            // check default object value
            if (typeof defaultValue === 'object' && defaultValue) {
                if (Array.isArray(defaultValue)) {
                    // check array empty
                    if (defaultValue.length > 0) {
                        cc.errorID(3635, className, propName, propName);
                        return;
                    }
                }
                else if (!_isPlainEmptyObj_DEV(defaultValue)) {
                    // check cloneable
                    if (!_cloneable_DEV(defaultValue)) {
                        cc.errorID(3636, className, propName, propName);
                        return;
                    }
                }
            }
        }

        // check base prototype to avoid name collision
        if (CCClass.getInheritanceChain(cls)
                   .some(function (x) { return x.prototype.hasOwnProperty(propName); }))
        {
            cc.errorID(3637, className, propName, className);
            return;
        }
    }

    // set default value
    Attr.setClassAttr(cls, propName, 'default', defaultValue);

    appendProp(cls, propName);

    // apply attributes
    parseAttributes(cls, val, className, propName, false);
    if ((CC_EDITOR && !Editor.isBuilder) || CC_TEST) {
        for (let i = 0; i < onAfterProps_ET.length; i++) {
            onAfterProps_ET[i](cls, propName);
        }
        onAfterProps_ET.length = 0;
    }
}

function defineGetSet (cls, name, propName, val, es6) {
    var getter = val.get;
    var setter = val.set;
    var proto = cls.prototype;
    var d = Object.getOwnPropertyDescriptor(proto, propName);
    var setterUndefined = !d;

    if (getter) {
        if (CC_DEV && !es6 && d && d.get) {
            cc.errorID(3638, name, propName);
            return;
        }

        parseAttributes(cls, val, name, propName, true);
        if ((CC_EDITOR && !Editor.isBuilder) || CC_TEST) {
            onAfterProps_ET.length = 0;
        }

        Attr.setClassAttr(cls, propName, 'serializable', false);

        if (CC_DEV) {
            // 不论是否 visible 都要添加到 props，否则 asset watcher 不能正常工作
            appendProp(cls, propName);
        }

        if (!es6) {
            js.get(proto, propName, getter, setterUndefined, setterUndefined);
        }

        if (CC_EDITOR || CC_DEV) {
            Attr.setClassAttr(cls, propName, 'hasGetter', true); // 方便 editor 做判断
        }
    }

    if (setter) {
        if (!es6) {
            if (CC_DEV && d && d.set) {
                return cc.errorID(3640, name, propName);
            }
            js.set(proto, propName, setter, setterUndefined, setterUndefined);
        }
        if (CC_EDITOR || CC_DEV) {
            Attr.setClassAttr(cls, propName, 'hasSetter', true); // 方便 editor 做判断
        }
    }
}

function getDefault (defaultVal) {
    if (typeof defaultVal === 'function') {
        if (CC_EDITOR) {
            try {
                return defaultVal();
            }
            catch (e) {
                cc._throw(e);
                return undefined;
            }
        }
        else {
            return defaultVal();
        }
    }
    return defaultVal;
}

function mixinWithInherited (dest, src, filter) {
    for (var prop in src) {
        if (!dest.hasOwnProperty(prop) && (!filter || filter(prop))) {
            Object.defineProperty(dest, prop, js.getPropertyDescriptor(src, prop));
        }
    }
}

function doDefine (className, baseClass, mixins, options) {
    var shouldAddProtoCtor;
    var __ctor__ = options.__ctor__;
    var ctor = options.ctor;
    var __es6__ = options.__ES6__;

    if (CC_DEV) {
        // check ctor
        var ctorToUse = __ctor__ || ctor;
        if (ctorToUse) {
            if (CCClass._isCCClass(ctorToUse)) {
                cc.errorID(3618, className);
            }
            else if (typeof ctorToUse !== 'function') {
                cc.errorID(3619, className);
            }
            else {
                if (baseClass && /\bprototype.ctor\b/.test(ctorToUse)) {
                    if (__es6__) {
                        cc.errorID(3651, className || "");
                    }
                    else {
                        cc.warnID(3600, className || "");
                        shouldAddProtoCtor = true;
                    }
                }
            }
            if (ctor) {
                if (__ctor__) {
                    cc.errorID(3649, className);
                }
                else {
                    ctor = options.ctor = _validateCtor_DEV(ctor, baseClass, className, options);
                }
            }
        }
    }

    var ctors;
    var fireClass;
    if (__es6__) {
        ctors = [ctor];
        fireClass = ctor;
    }
    else {
        ctors = __ctor__ ? [__ctor__] : _getAllCtors(baseClass, mixins, options);
        fireClass = _createCtor(ctors, baseClass, className, options);

        // extend - Create a new Class that inherits from this Class
        js.value(fireClass, 'extend', function (options) {
            options.extends = this;
            return CCClass(options);
        }, true);
    }

    js.value(fireClass, '__ctors__', ctors.length > 0 ? ctors : null, true);


    var prototype = fireClass.prototype;
    if (baseClass) {
        if (!__es6__) {
            js.extend(fireClass, baseClass);        // 这里会把父类的 __props__ 复制给子类
            prototype = fireClass.prototype;        // get extended prototype
        }
        fireClass.$super = baseClass;
        if (CC_DEV && shouldAddProtoCtor) {
            prototype.ctor = function () {};
        }
    }

    if (mixins) {
        for (var m = mixins.length - 1; m >= 0; m--) {
            var mixin = mixins[m];
            mixinWithInherited(prototype, mixin.prototype);

            // mixin statics (this will also copy editor attributes for component)
            mixinWithInherited(fireClass, mixin, function (prop) {
                return mixin.hasOwnProperty(prop) && (!CC_DEV || INVALID_STATICS_DEV.indexOf(prop) < 0);
            });

            // mixin attributes
            if (CCClass._isCCClass(mixin)) {
                mixinWithInherited(Attr.getClassAttrs(fireClass), Attr.getClassAttrs(mixin));
            }
        }
        // restore constuctor overridden by mixin
        prototype.constructor = fireClass;
    }

    if (!__es6__) {
        prototype.__initProps__ = compileProps;
    }

    js.setClassName(className, fireClass);
    return fireClass;
}

function define (className, baseClass, mixins, options) {
    var Component = cc.Component;
    var frame = cc._RF.peek();
    if (frame && js.isChildClassOf(baseClass, Component)) {
        // project component
        if (js.isChildClassOf(frame.cls, Component)) {
            cc.errorID(3615);
            return null;
        }
        if (CC_DEV && frame.uuid && className) {
            cc.warnID(3616, className);
        }
        className = className || frame.script;
    }

    var cls = doDefine(className, baseClass, mixins, options);

    if (frame) {
        if (js.isChildClassOf(baseClass, Component)) {
            var uuid = frame.uuid;
            if (uuid) {
                js._setClassId(uuid, cls);
                if (CC_EDITOR) {
                    Component._addMenuItem(cls, 'i18n:MAIN_MENU.component.scripts/' + className, -1);
                    cls.prototype.__scriptUuid = Editor.Utils.UuidUtils.decompressUuid(uuid);
                }
            }
            frame.cls = cls;
        }
        else if (!js.isChildClassOf(frame.cls, Component)) {
            frame.cls = cls;
        }
    }
    return cls;
}

function normalizeClassName_DEV (className) {
    var DefaultName = 'CCClass';
    if (className) {
        className = className.replace(/^[^$A-Za-z_]/, '_').replace(/[^0-9A-Za-z_$]/g, '_');
        try {
            // validate name
            Function('function ' + className + '(){}')();
            return className;
        }
        catch (e) {
            ;
        }
    }
    return DefaultName;
}

function getNewValueTypeCodeJit (value) {
    var clsName = js.getClassName(value);
    var type = value.constructor;
    var res = 'new ' + clsName + '(';
    for (var i = 0; i < type.__props__.length; i++) {
        var prop = type.__props__[i];
        var propVal = value[prop];
        if (CC_DEV && typeof propVal === 'object') {
            cc.errorID(3641, clsName);
            return 'new ' + clsName + '()';
        }
        res += propVal;
        if (i < type.__props__.length - 1) {
            res += ',';
        }
    }
    return res + ')';
}

// TODO - move escapeForJS, IDENTIFIER_RE, getNewValueTypeCodeJit to misc.js or a new source file

// convert a normal string including newlines, quotes and unicode characters into a string literal
// ready to use in JavaScript source
function escapeForJS (s) {
    return JSON.stringify(s).
        // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
        replace(/\u2028/g, '\\u2028').
        replace(/\u2029/g, '\\u2029');
}

function getInitPropsJit (attrs, propList) {
    // functions for generated code
    var F = [];
    var func = '';

    for (var i = 0; i < propList.length; i++) {
        var prop = propList[i];
        var attrKey = prop + DELIMETER + 'default';
        if (attrKey in attrs) {  // getter does not have default
            var statement;
            if (IDENTIFIER_RE.test(prop)) {
                statement = 'this.' + prop + '=';
            }
            else {
                statement = 'this[' + escapeForJS(prop) + ']=';
            }
            var expression;
            var def = attrs[attrKey];
            if (typeof def === 'object' && def) {
                if (def instanceof cc.ValueType) {
                    expression = getNewValueTypeCodeJit(def);
                }
                else if (Array.isArray(def)) {
                    expression = '[]';
                }
                else {
                    expression = '{}';
                }
            }
            else if (typeof def === 'function') {
                var index = F.length;
                F.push(def);
                expression = 'F[' + index + ']()';
                if (CC_EDITOR) {
                    func += 'try {\n' + statement + expression + ';\n}\ncatch(e) {\ncc._throw(e);\n' + statement + 'undefined;\n}\n';
                    continue;
                }
            }
            else if (typeof def === 'string') {
                expression = escapeForJS(def);
            }
            else {
                // number, boolean, null, undefined
                expression = def;
            }
            statement = statement + expression + ';\n';
            func += statement;
        }
    }

    // if (CC_TEST && !isPhantomJS) {
    //     console.log(func);
    // }

    var initProps;
    if (F.length === 0) {
        initProps = Function(func);
    }
    else {
        initProps = Function('F', 'return (function(){\n' + func + '})')(F);
    }

    return initProps;
}

function getInitProps (attrs, propList) {
    var advancedProps = [];
    var advancedValues = [];
    var simpleProps = [];
    var simpleValues = [];

    for (var i = 0; i < propList.length; ++i) {
        var prop = propList[i];
        var attrKey = prop + DELIMETER + 'default';
        if (attrKey in attrs) { // getter does not have default
            var def = attrs[attrKey];
            if ((typeof def === 'object' && def) || typeof def === 'function') {
                advancedProps.push(prop);
                advancedValues.push(def);
            }
            else {
                // number, boolean, null, undefined, string
                simpleProps.push(prop);
                simpleValues.push(def);
            }
        }
    }

    return function () {
        for (let i = 0; i < simpleProps.length; ++i) {
            this[simpleProps[i]] = simpleValues[i];
        }
        for (let i = 0; i < advancedProps.length; i++) {
            let prop = advancedProps[i];
            var expression;
            var def = advancedValues[i];
            if (typeof def === 'object') {
                if (def instanceof cc.ValueType) {
                    expression = def.clone();
                }
                else if (Array.isArray(def)) {
                    expression = [];
                }
                else {
                    expression = {};
                }
            }
            else {
                // def is function
                if (CC_EDITOR) {
                    try {
                        expression = def();
                    }
                    catch (err) {
                        cc._throw(e);
                        continue;
                    }
                }
                else {
                    expression = def();
                }
            }
            this[prop] = expression;
        }
    };
}

// simple test variable name
var IDENTIFIER_RE = /^[A-Za-z_$][0-9A-Za-z_$]*$/;
function compileProps (actualClass) {
    // init deferred properties
    var attrs = Attr.getClassAttrs(actualClass);
    var propList = actualClass.__props__;
    if (propList === null) {
        deferredInitializer.init();
        propList = actualClass.__props__;
    }

    // Overwite __initProps__ to avoid compile again.
    var initProps = CC_SUPPORT_JIT ? getInitPropsJit(attrs, propList) : getInitProps(attrs, propList);
    actualClass.prototype.__initProps__ = initProps;

    // call instantiateProps immediately, no need to pass actualClass into it anymore
    // (use call to manually bind `this` because `this` may not instanceof actualClass)
    initProps.call(this);
}

var _createCtor = CC_SUPPORT_JIT ? function (ctors, baseClass, className, options) {
    var superCallBounded = baseClass && boundSuperCalls(baseClass, options, className);

    var ctorName = CC_DEV ? normalizeClassName_DEV(className) : 'CCClass';
    var body = 'return function ' + ctorName + '(){\n';

    if (superCallBounded) {
        body += 'this._super=null;\n';
    }

    // instantiate props
    body += 'this.__initProps__(' + ctorName + ');\n';

    // call user constructors
    var ctorLen = ctors.length;
    if (ctorLen > 0) {
        var useTryCatch = CC_DEV && ! (className && className.startsWith('cc.'));
        if (useTryCatch) {
            body += 'try{\n';
        }
        var SNIPPET = '].apply(this,arguments);\n';
        if (ctorLen === 1) {
            body += ctorName + '.__ctors__[0' + SNIPPET;
        }
        else {
            body += 'var cs=' + ctorName + '.__ctors__;\n';
            for (var i = 0; i < ctorLen; i++) {
                body += 'cs[' + i + SNIPPET;
            }
        }
        if (useTryCatch) {
            body += '}catch(e){\n' +
                        'cc._throw(e);\n' +
                    '}\n';
        }
    }
    body += '}';

    return Function(body)();
} : function (ctors, baseClass, className, options) {
    var superCallBounded = baseClass && boundSuperCalls(baseClass, options, className);
    var ctorLen = ctors.length;

    var Class;

    if (ctorLen > 0) {
        if (superCallBounded) {
            if (ctorLen === 2) {
                // User Component
                Class = function () {
                    this._super = null;
                    this.__initProps__(Class);
                    ctors[0].apply(this, arguments);
                    ctors[1].apply(this, arguments);
                };
            }
            else {
                Class = function () {
                    this._super = null;
                    this.__initProps__(Class);
                    for (let i = 0; i < ctors.length; ++i) {
                        ctors[i].apply(this, arguments);
                    }
                };
            }
        }
        else {
            if (ctorLen === 3) {
                // Node
                Class = function () {
                    this.__initProps__(Class);
                    ctors[0].apply(this, arguments);
                    ctors[1].apply(this, arguments);
                    ctors[2].apply(this, arguments);
                };
            }
            else {
                Class = function () {
                    this.__initProps__(Class);
                    var ctors = Class.__ctors__;
                    for (let i = 0; i < ctors.length; ++i) {
                        ctors[i].apply(this, arguments);
                    }
                };
            }
        }
    }
    else {
        Class = function () {
            if (superCallBounded) {
                this._super = null;
            }
            this.__initProps__(Class);
        };
    }
    return Class;
};

function _validateCtor_DEV (ctor, baseClass, className, options) {
    if (CC_EDITOR && baseClass) {
        // check super call in constructor
        var originCtor = ctor;
        if (SuperCallReg.test(ctor)) {
            if (options.__ES6__) {
                cc.errorID(3651, className);
            }
            else {
                cc.warnID(3600, className);
                // suppresss super call
                ctor = function () {
                    this._super = function () {};
                    var ret = originCtor.apply(this, arguments);
                    this._super = null;
                    return ret;
                };
            }
        }
    }

    // check ctor
    if (ctor.length > 0 && (!className || !className.startsWith('cc.'))) {
        // To make a unified CCClass serialization process,
        // we don't allow parameters for constructor when creating instances of CCClass.
        // For advanced user, construct arguments can still get from 'arguments'.
        cc.warnID(3617, className);
    }

    return ctor;
}

function _getAllCtors (baseClass, mixins, options) {
    // get base user constructors
    function getCtors (cls) {
        if (CCClass._isCCClass(cls)) {
            return cls.__ctors__ || [];
        }
        else {
            return [cls];
        }
    }

    var ctors = [];
    // if (options.__ES6__) {
    //     if (mixins) {
    //         let baseOrMixins = getCtors(baseClass);
    //         for (let b = 0; b < mixins.length; b++) {
    //             let mixin = mixins[b];
    //             if (mixin) {
    //                 let baseCtors = getCtors(mixin);
    //                 for (let c = 0; c < baseCtors.length; c++) {
    //                     if (baseOrMixins.indexOf(baseCtors[c]) < 0) {
    //                         pushUnique(ctors, baseCtors[c]);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    // else {
    let baseOrMixins = [baseClass].concat(mixins);
    for (let b = 0; b < baseOrMixins.length; b++) {
        let baseOrMixin = baseOrMixins[b];
        if (baseOrMixin) {
            let baseCtors = getCtors(baseOrMixin);
            for (let c = 0; c < baseCtors.length; c++) {
                pushUnique(ctors, baseCtors[c]);
            }
        }
    }
    // }

    // append subclass user constructors
    var ctor = options.ctor;
    if (ctor) {
        ctors.push(ctor);
    }

    return ctors;
}

var SuperCallReg = /xyz/.test(function(){xyz}) ? /\b\._super\b/ : /.*/;
var SuperCallRegStrict = /xyz/.test(function(){xyz}) ? /this\._super\s*\(/ : /(NONE){99}/;
function boundSuperCalls (baseClass, options, className) {
    var hasSuperCall = false;
    for (var funcName in options) {
        if (BUILTIN_ENTRIES.indexOf(funcName) >= 0) {
            continue;
        }
        var func = options[funcName];
        if (typeof func !== 'function') {
            continue;
        }
        var pd = js.getPropertyDescriptor(baseClass.prototype, funcName);
        if (pd) {
            var superFunc = pd.value;
            // ignore pd.get, assume that function defined by getter is just for warnings
            if (typeof superFunc === 'function') {
                if (SuperCallReg.test(func)) {
                    hasSuperCall = true;
                    // boundSuperCall
                    options[funcName] = (function (superFunc, func) {
                        return function () {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method but on the super-Class
                            this._super = superFunc;

                            var ret = func.apply(this, arguments);

                            // The method only need to be bound temporarily, so we remove it when we're done executing
                            this._super = tmp;

                            return ret;
                        };
                    })(superFunc, func);
                }
                continue;
            }
        }
        if (CC_DEV && SuperCallRegStrict.test(func)) {
            cc.warnID(3620, className, funcName);
        }
    }
    return hasSuperCall;
}

function declareProperties (cls, className, properties, baseClass, mixins, es6) {
    cls.__props__ = [];

    if (baseClass && baseClass.__props__) {
        cls.__props__ = baseClass.__props__.slice();
    }

    if (mixins) {
        for (var m = 0; m < mixins.length; ++m) {
            var mixin = mixins[m];
            if (mixin.__props__) {
                cls.__props__ = cls.__props__.concat(mixin.__props__.filter(function (x) {
                    return cls.__props__.indexOf(x) < 0;
                }));
            }
        }
    }

    if (properties) {
        // 预处理属性
        preprocess.preprocessAttrs(properties, className, cls, es6);

        for (var propName in properties) {
            var val = properties[propName];
            if ('default' in val) {
                defineProp(cls, className, propName, val, es6);
            }
            else {
                defineGetSet(cls, className, propName, val, es6);
            }
        }
    }

    var attrs = Attr.getClassAttrs(cls);
    cls.__values__ = cls.__props__.filter(function (prop) {
        return attrs[prop + DELIMETER + 'serializable'] !== false;
    });
}

/**
 * @module cc
 */

/**
 * !#en Defines a CCClass using the given specification, please see [Class](/docs/editors_and_tools/creator-chapters/scripting/class.html) for details.
 * !#zh 定义一个 CCClass，传入参数必须是一个包含类型参数的字面量对象，具体用法请查阅[类型定义](/docs/creator/scripting/class.html)。
 *
 * @method Class
 *
 * @param {Object} [options]
 * @param {String} [options.name] - The class name used for serialization.
 * @param {Function} [options.extends] - The base class.
 * @param {Function} [options.ctor] - The constructor.
 * @param {Function} [options.__ctor__] - The same as ctor, but less encapsulated.
 * @param {Object} [options.properties] - The property definitions.
 * @param {Object} [options.statics] - The static members.
 * @param {Function[]} [options.mixins]
 *
 * @param {Object} [options.editor] - attributes for Component listed below.
 * @param {Boolean} [options.editor.executeInEditMode=false] - Allows the current component to run in edit mode. By default, all components are executed only at runtime, meaning that they will not have their callback functions executed while the Editor is in edit mode.
 * @param {Function} [options.editor.requireComponent] - Automatically add required component as a dependency.
 * @param {String} [options.editor.menu] - The menu path to register a component to the editors "Component" menu. Eg. "Rendering/Camera".
 * @param {Number} [options.editor.executionOrder=0] - The execution order of lifecycle methods for Component. Those less than 0 will execute before while those greater than 0 will execute after. The order will only affect onLoad, onEnable, start, update and lateUpdate while onDisable and onDestroy will not be affected.
 * @param {Boolean} [options.editor.disallowMultiple] - If specified to a type, prevents Component of the same type (or subtype) to be added more than once to a Node.
 * @param {Boolean} [options.editor.playOnFocus=false] - This property is only available when executeInEditMode is set. If specified, the editor's scene view will keep updating this node in 60 fps when it is selected, otherwise, it will update only if necessary.
 * @param {String} [options.editor.inspector] - Customize the page url used by the current component to render in the Properties.
 * @param {String} [options.editor.icon] - Customize the icon that the current component displays in the editor.
 * @param {String} [options.editor.help] - The custom documentation URL
 *
 * @param {Function} [options.update] - lifecycle method for Component, see {{#crossLink "Component/update:method"}}{{/crossLink}}
 * @param {Function} [options.lateUpdate] - lifecycle method for Component, see {{#crossLink "Component/lateUpdate:method"}}{{/crossLink}}
 * @param {Function} [options.onLoad] - lifecycle method for Component, see {{#crossLink "Component/onLoad:method"}}{{/crossLink}}
 * @param {Function} [options.start] - lifecycle method for Component, see {{#crossLink "Component/start:method"}}{{/crossLink}}
 * @param {Function} [options.onEnable] - lifecycle method for Component, see {{#crossLink "Component/onEnable:method"}}{{/crossLink}}
 * @param {Function} [options.onDisable] - lifecycle method for Component, see {{#crossLink "Component/onDisable:method"}}{{/crossLink}}
 * @param {Function} [options.onDestroy] - lifecycle method for Component, see {{#crossLink "Component/onDestroy:method"}}{{/crossLink}}
 * @param {Function} [options.onFocusInEditor] - lifecycle method for Component, see {{#crossLink "Component/onFocusInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.onLostFocusInEditor] - lifecycle method for Component, see {{#crossLink "Component/onLostFocusInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.resetInEditor] - lifecycle method for Component, see {{#crossLink "Component/resetInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.onRestore] - for Component only, see {{#crossLink "Component/onRestore:method"}}{{/crossLink}}
 * @param {Function} [options._getLocalBounds] - for Component only, see {{#crossLink "Component/_getLocalBounds:method"}}{{/crossLink}}
 *
 * @return {Function} - the created class
 *
 * @example

 // define base class
 var Node = cc.Class();

 // define sub class
 var Sprite = cc.Class({
     name: 'Sprite',
     extends: Node,

     ctor: function () {
         this.url = "";
         this.id = 0;
     },

     statics: {
         // define static members
         count: 0,
         getBounds: function (spriteList) {
             // compute bounds...
         }
     },

     properties {
         width: {
             default: 128,
             type: cc.Integer,
             tooltip: 'The width of sprite'
         },
         height: 128,
         size: {
             get: function () {
                 return cc.v2(this.width, this.height);
             }
         }
     },

     load: function () {
         // load this.url...
     };
 });

 // instantiate

 var obj = new Sprite();
 obj.url = 'sprite.png';
 obj.load();
 */
function CCClass (options) {
    options = options || {};

    var name = options.name;
    var base = options.extends/* || CCObject*/;
    var mixins = options.mixins;

    // create constructor
    var cls = define(name, base, mixins, options);
    if (!name) {
        name = cc.js.getClassName(cls);
    }

    cls._sealed = true;
    if (base) {
        base._sealed = false;
    }

    // define Properties
    var properties = options.properties;
    if (typeof properties === 'function' ||
        (base && base.__props__ === null) ||
        (mixins && mixins.some(function (x) {
            return x.__props__ === null;
        }))
    ) {
        if (CC_DEV && options.__ES6__) {
            cc.error('not yet implement deferred properties for ES6 Classes');
        }
        else {
            deferredInitializer.push({cls: cls, props: properties, mixins: mixins});
            cls.__props__ = cls.__values__ = null;
        }
    }
    else {
        declareProperties(cls, name, properties, base, options.mixins, options.__ES6__);
    }

    // define statics
    var statics = options.statics;
    if (statics) {
        var staticPropName;
        if (CC_DEV) {
            for (staticPropName in statics) {
                if (INVALID_STATICS_DEV.indexOf(staticPropName) !== -1) {
                    cc.errorID(3642, name, staticPropName,
                        staticPropName);
                }
            }
        }
        for (staticPropName in statics) {
            cls[staticPropName] = statics[staticPropName];
        }
    }

    // define functions
    for (var funcName in options) {
        if (BUILTIN_ENTRIES.indexOf(funcName) >= 0) {
            continue;
        }
        var func = options[funcName];
        if (!preprocess.validateMethodWithProps(func, funcName, name, cls, base)) {
            continue;
        }
        // use value to redefine some super method defined as getter
        js.value(cls.prototype, funcName, func, true, true);
    }


    var editor = options.editor;
    if (editor) {
        if (js.isChildClassOf(base, cc.Component)) {
            cc.Component._registerEditorProps(cls, editor);
        }
        else if (CC_DEV) {
            cc.warnID(3623, name);
        }
    }

    return cls;
}

/**
 * Checks whether the constructor is created by cc.Class
 *
 * @method _isCCClass
 * @param {Function} constructor
 * @return {Boolean}
 * @private
 */
CCClass._isCCClass = function (constructor) {
    return constructor &&
           constructor.hasOwnProperty('__ctors__');     // is not inherited __ctors__
};

//
// Optimized define function only for internal classes
//
// @method _fastDefine
// @param {String} className
// @param {Function} constructor
// @param {Object} serializableFields
// @private
//
CCClass._fastDefine = function (className, constructor, serializableFields) {
    js.setClassName(className, constructor);
    //constructor.__ctors__ = constructor.__ctors__ || null;
    var props = constructor.__props__ = constructor.__values__ = Object.keys(serializableFields);
    var attrs = Attr.getClassAttrs(constructor);
    for (var i = 0; i < props.length; i++) {
        var key = props[i];
        attrs[key + DELIMETER + 'visible'] = false;
        attrs[key + DELIMETER + 'default'] = serializableFields[key];
    }
};

CCClass.Attr = Attr;
CCClass.attr = Attr.attr;

/*
 * Return all super classes
 * @method getInheritanceChain
 * @param {Function} constructor
 * @return {Function[]}
 */
CCClass.getInheritanceChain = function (klass) {
    var chain = [];
    for (;;) {
        klass = js.getSuper(klass);
        if (!klass) {
            break;
        }
        if (klass !== Object) {
            chain.push(klass);
        }
    }
    return chain;
};

var PrimitiveTypes = {
    // Specify that the input value must be integer in Properties.
    // Also used to indicates that the type of elements in array or the type of value in dictionary is integer.
    Integer: 'Number',
    // Indicates that the type of elements in array or the type of value in dictionary is double.
    Float: 'Number',
    Boolean: 'Boolean',
    String: 'String',
};
var onAfterProps_ET = [];
function parseAttributes (cls, attributes, className, propName, usedInGetter) {
    var ERR_Type = CC_DEV ? 'The %s of %s must be type %s' : '';

    var attrs = null;
    var propNamePrefix = '';
    function initAttrs () {
        propNamePrefix = propName + DELIMETER;
        return attrs = Attr.getClassAttrs(cls);
    }

    if ((CC_EDITOR && !Editor.isBuilder) || CC_TEST) {
        onAfterProps_ET.length = 0;
    }

    var type = attributes.type;
    if (type) {
        var primitiveType = PrimitiveTypes[type];
        if (primitiveType) {
            (attrs || initAttrs())[propNamePrefix + 'type'] = type;
            if (((CC_EDITOR && !Editor.isBuilder) || CC_TEST) && !attributes._short) {
                onAfterProps_ET.push(Attr.getTypeChecker_ET(primitiveType, 'cc.' + type));
            }
        }
        else if (type === 'Object') {
            if (CC_DEV) {
                cc.errorID(3644, className, propName);
            }
        }
        else {
            if (type === Attr.ScriptUuid) {
                (attrs || initAttrs())[propNamePrefix + 'type'] = 'Script';
                attrs[propNamePrefix + 'ctor'] = cc.ScriptAsset;
            }
            else {
                if (typeof type === 'object') {
                    if (Enum.isEnum(type)) {
                        (attrs || initAttrs())[propNamePrefix + 'type'] = 'Enum';
                        attrs[propNamePrefix + 'enumList'] = Enum.getList(type);
                    }
                    else if (CC_DEV) {
                        cc.errorID(3645, className, propName, type);
                    }
                }
                else if (typeof type === 'function') {
                    (attrs || initAttrs())[propNamePrefix + 'type'] = 'Object';
                    attrs[propNamePrefix + 'ctor'] = type;
                    if (((CC_EDITOR && !Editor.isBuilder) || CC_TEST) && !attributes._short) {
                        onAfterProps_ET.push(attributes.url ? Attr.getTypeChecker_ET('String', 'cc.String') : Attr.getObjTypeChecker_ET(type));
                    }
                }
                else if (CC_DEV) {
                    cc.errorID(3646, className, propName, type);
                }
            }
        }
    }

    function parseSimpleAttr (attrName, expectType) {
        if (attrName in attributes) {
            var val = attributes[attrName];
            if (typeof val === expectType) {
                (attrs || initAttrs())[propNamePrefix + attrName] = val;
            }
            else if (CC_DEV) {
                cc.error(ERR_Type, attrName, className, propName, expectType);
            }
        }
    }

    if (attributes.editorOnly) {
        if (CC_DEV && usedInGetter) {
            cc.errorID(3613, "editorOnly", name, propName);
        }
        else {
            (attrs || initAttrs())[propNamePrefix + 'editorOnly'] = true;
        }
    }
    //parseSimpleAttr('preventDeferredLoad', 'boolean');
    if (CC_DEV) {
        parseSimpleAttr('displayName', 'string');
        parseSimpleAttr('multiline', 'boolean');
        if (attributes.readonly) {
            (attrs || initAttrs())[propNamePrefix + 'readonly'] = true;
        }
        parseSimpleAttr('tooltip', 'string');
        parseSimpleAttr('slide', 'boolean');
    }

    if (attributes.url) {
        (attrs || initAttrs())[propNamePrefix + 'saveUrlAsAsset'] = true;
    }
    if (attributes.serializable === false) {
        if (CC_DEV && usedInGetter) {
            cc.errorID(3613, "serializable", name, propName);
        }
        else {
            (attrs || initAttrs())[propNamePrefix + 'serializable'] = false;
        }
    }
    parseSimpleAttr('formerlySerializedAs', 'string');

    if (CC_EDITOR) {
        parseSimpleAttr('notifyFor', 'string');

        if ('animatable' in attributes) {
            (attrs || initAttrs())[propNamePrefix + 'animatable'] = !!attributes.animatable;
        }
    }

    if (CC_DEV) {
        var visible = attributes.visible;
        if (typeof visible !== 'undefined') {
            if (!visible) {
                (attrs || initAttrs())[propNamePrefix + 'visible'] = false;
            }
            else if (typeof visible === 'function') {
                (attrs || initAttrs())[propNamePrefix + 'visible'] = visible;
            }
        }
        else {
            var startsWithUS = (propName.charCodeAt(0) === 95);
            if (startsWithUS) {
                (attrs || initAttrs())[propNamePrefix + 'visible'] = false;
            }
        }
    }

    var range = attributes.range;
    if (range) {
        if (Array.isArray(range)) {
            if (range.length >= 2) {
                (attrs || initAttrs())[propNamePrefix + 'min'] = range[0];
                attrs[propNamePrefix + 'max'] = range[1];
                if (range.length > 2) {
                    attrs[propNamePrefix + 'step'] = range[2];
                }
            }
            else if (CC_DEV) {
                cc.errorID(3647);
            }
        }
        else if (CC_DEV) {
            cc.error(ERR_Type, 'range', className, propName, 'array');
        }
    }
    parseSimpleAttr('min', 'number');
    parseSimpleAttr('max', 'number');
    parseSimpleAttr('step', 'number');
}

cc.Class = CCClass;

module.exports = {
    isArray: function (defaultVal) {
        defaultVal = getDefault(defaultVal);
        return Array.isArray(defaultVal);
    },
    fastDefine: CCClass._fastDefine,
    getNewValueTypeCode: CC_SUPPORT_JIT && getNewValueTypeCodeJit,
    IDENTIFIER_RE,
    escapeForJS,
    getDefault: getDefault
};

if (CC_TEST) {
    js.mixin(CCClass, module.exports);
}
