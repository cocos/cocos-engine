/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import IDGenerater from './id-generater';

let tempCIDGenerater = new IDGenerater('TmpCId.');

const REGEXP_NUM_OR_STR = /(%d)|(%s)/;
const REGEXP_STR = /%s/;

var _tmpValueDesc = {
    value: undefined,
    enumerable: false,
    writable: false,
    configurable: true
};

var _tmpGetSetDesc = {
    get: null,
    set: null,
    enumerable: false,
};

var _tmpSetDesc = {
    set: null,
    enumerable: false,
    configurable: false
};

/**
 * This module provides some JavaScript utilities.
 * All members can be accessed with "cc.js".
 * @submodule js
 * @module js
 */

/**
 * Check the obj whether is number or not
 * If a number is created by using 'new Number(10086)', the typeof it will be "object"...
 * Then you can use this function if you care about this case.
 * @method isNumber
 * @param {*} obj
 * @returns {Boolean}
 */
export function isNumber (obj) {
    return typeof obj === 'number' || obj instanceof Number;
};

/**
 * Check the obj whether is string or not.
 * If a string is created by using 'new String("blabla")', the typeof it will be "object"...
 * Then you can use this function if you care about this case.
 * @method isString
 * @param {*} obj
 * @returns {Boolean}
 */
export function isString (obj) {
    return typeof obj === 'string' || obj instanceof String;
};

/**
 * Get property descriptor in object and all its ancestors
 * @method getPropertyDescriptor
 * @param {Object} obj
 * @param {String} name
 * @return {Object}
 */
export function getPropertyDescriptor  (obj, name) {
    while (obj) {
        var pd = Object.getOwnPropertyDescriptor(obj, name);
        if (pd) {
            return pd;
        }
        obj = Object.getPrototypeOf(obj);
    }
    return null;
};

function _copyprop(name, source, target) {
    var pd = getPropertyDescriptor(source, name);
    Object.defineProperty(target, name, pd);
}

/**
 * Copy all properties not defined in obj from arguments[1...n]
 * @method addon
 * @param {Object} obj object to extend its properties
 * @param {Object} ...sourceObj source object to copy properties from
 * @return {Object} the result obj
 */
export function addon (obj) {
    'use strict';
    obj = obj || {};
    for (var i = 1, length = arguments.length; i < length; i++) {
        var source = arguments[i];
        if (source) {
            if (typeof source !== 'object') {
                cc.errorID(5402, source);
                continue;
            }
            for ( var name in source) {
                if ( !(name in obj) ) {
                    _copyprop( name, source, obj);
                }
            }
        }
    }
    return obj;
};

/**
 * copy all properties from arguments[1...n] to obj
 * @method mixin
 * @param {Object} obj
 * @param {Object} ...sourceObj
 * @return {Object} the result obj
 */
export function mixin (obj) {
    'use strict';
    obj = obj || {};
    for (var i = 1, length = arguments.length; i < length; i++) {
        var source = arguments[i];
        if (source) {
            if (typeof source !== 'object') {
                cc.errorID(5403, source);
                continue;
            }
            for ( var name in source) {
                _copyprop( name, source, obj);
            }
        }
    }
    return obj;
};

/**
 * Derive the class from the supplied base class.
 * Both classes are just native javascript constructors, not created by cc.Class, so
 * usually you will want to inherit using {{#crossLink "cc/Class:method"}}cc.Class {{/crossLink}} instead.
 * @method extend
 * @param {Function} cls
 * @param {Function} base - the baseclass to inherit
 * @return {Function} the result class
 */
export function extend (cls, base) {
    if (CC_DEV) {
        if (!base) {
            cc.errorID(5404);
            return;
        }
        if (!cls) {
            cc.errorID(5405);
            return;
        }
        if (Object.keys(cls.prototype).length > 0) {
            cc.errorID(5406);
        }
    }
    for (var p in base) if (base.hasOwnProperty(p)) cls[p] = base[p];
    cls.prototype = Object.create(base.prototype, {
        constructor: {
            value: cls,
            writable: true,
            configurable: true
        }
    });
    return cls;
};

/**
 * Get super class
 * @method getSuper
 * @param {Function} ctor - the constructor of subclass
 * @return {Function}
 */
export function getSuper (ctor) {
    var proto = ctor.prototype; // binded function do not have prototype
    var dunderProto = proto && Object.getPrototypeOf(proto);
    return dunderProto && dunderProto.constructor;
};

/**
 * Checks whether subclass is child of superclass or equals to superclass
 *
 * @method isChildClassOf
 * @param {Function} subclass
 * @param {Function} superclass
 * @return {Boolean}
 */
export function isChildClassOf (subclass, superclass) {
    if (subclass && superclass) {
        if (typeof subclass !== 'function') {
            return false;
        }
        if (typeof superclass !== 'function') {
            if (CC_DEV) {
                cc.warnID(3625, superclass);
            }
            return false;
        }
        if (subclass === superclass) {
            return true;
        }
        for (;;) {
            subclass = getSuper(subclass);
            if (!subclass) {
                return false;
            }
            if (subclass === superclass) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Removes all enumerable properties from object
 * @method clear
 * @param {any} obj
 */
export function clear (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        delete obj[keys[i]];
    }
};

/**
 * Define value, just help to call Object.defineProperty.<br>
 * The configurable will be true.
 * @method value
 * @param {Object} obj
 * @param {String} prop
 * @param {any} value
 * @param {Boolean} [writable=false]
 * @param {Boolean} [enumerable=false]
 */
export function value (obj, prop, value, writable, enumerable) {
    _tmpValueDesc.value = value;
    _tmpValueDesc.writable = writable;
    _tmpValueDesc.enumerable = enumerable;
    Object.defineProperty(obj, prop, _tmpValueDesc);
    _tmpValueDesc.value = undefined;
};

/**
 * Define get set accessor, just help to call Object.defineProperty(...)
 * @method getset
 * @param {Object} obj
 * @param {String} prop
 * @param {Function} getter
 * @param {Function} [setter=null]
 * @param {Boolean} [enumerable=false]
 * @param {Boolean} [configurable=false]
 */
export function getset (obj, prop, getter, setter, enumerable, configurable) {
    if (typeof setter !== 'function') {
        enumerable = setter;
        setter = undefined;
    }
    _tmpGetSetDesc.get = getter;
    _tmpGetSetDesc.set = setter;
    _tmpGetSetDesc.enumerable = enumerable;
    _tmpGetSetDesc.configurable = configurable;
    Object.defineProperty(obj, prop, _tmpGetSetDesc);
    _tmpGetSetDesc.get = null;
    _tmpGetSetDesc.set = null;
};


/**
 * Define get accessor, just help to call Object.defineProperty(...)
 * @method get
 * @param {Object} obj
 * @param {String} prop
 * @param {Function} getter
 * @param {Boolean} [enumerable=false]
 * @param {Boolean} [configurable=false]
 */
export function get (obj, prop, getter, enumerable, configurable) {
    tmpGetDesc.get = getter;
    tmpGetDesc.enumerable = enumerable;
    tmpGetDesc.configurable = configurable;
    Object.defineProperty(obj, prop, tmpGetDesc);
    tmpGetDesc.get = null;
};



/**
 * Define set accessor, just help to call Object.defineProperty(...)
 * @method set
 * @param {Object} obj
 * @param {String} prop
 * @param {Function} setter
 * @param {Boolean} [enumerable=false]
 * @param {Boolean} [configurable=false]
 */
export function set (obj, prop, setter, enumerable, configurable) {
    _tmpSetDesc.set = setter;
    _tmpSetDesc.enumerable = enumerable;
    _tmpSetDesc.configurable = configurable;
    Object.defineProperty(obj, prop, _tmpSetDesc);
    _tmpSetDesc.set = null;
};

/**
 * Get class name of the object, if object is just a {} (and which class named 'Object'), it will return "".
 * (modified from <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">the code from this stackoverflow post</a>)
 * @method getClassName
 * @param {Object|Function} objOrCtor - instance or constructor
 * @return {String}
 */
export function getClassName (objOrCtor) {
    if (typeof objOrCtor === 'function') {
        var prototype = objOrCtor.prototype;
        if (prototype && prototype.hasOwnProperty('__classname__') && prototype.__classname__) {
            return prototype.__classname__;
        }
        var retval = '';
        //  for browsers which have name property in the constructor of the object, such as chrome
        if (objOrCtor.name) {
            retval = objOrCtor.name;
        }
        if (objOrCtor.toString) {
            var arr, str = objOrCtor.toString();
            if (str.charAt(0) === '[') {
                // str is "[object objectClass]"
                arr = str.match(/\[\w+\s*(\w+)\]/);
            }
            else {
                // str is function objectClass () {} for IE Firefox
                arr = str.match(/function\s*(\w+)/);
            }
            if (arr && arr.length === 2) {
                retval = arr[1];
            }
        }
        return retval !== 'Object' ? retval : '';
    }
    else if (objOrCtor && objOrCtor.constructor) {
        return getClassName(objOrCtor.constructor);
    }
    return '';
};

function isTempClassId (id) {
    return typeof id !== 'string' || id.startsWith(tempCIDGenerater.prefix);
}

// id 注册
let _idToClass = {};
let _nameToClass = {};

/**
 * Register the class by specified id, if its classname is not defined, the class name will also be set.
 * @method _setClassId
 * @param {String} classId
 * @param {Function} constructor
 * @private
 */
export function _setClassId (id, constructor) {
    let key = '__cid__';
    let table = _idToClass;
    // deregister old
    if (constructor.prototype.hasOwnProperty(key)) {
        delete table[constructor.prototype[key]];
    }
    value(constructor.prototype, key, id);
    // register class
    if (id) {
        var registered = table[id];
        if (registered && registered !== constructor) {
            var error = 'A Class already exists with the same ' + key + ' : "' + id + '".';
            if (CC_TEST) {
                error += ' (This may be caused by error of unit test.) \
If you dont need serialization, you can set class id to "". You can also call \
cc.js.unregisterClass to remove the id of unused class';
            }
            cc.error(error);
        }
        else {
            table[id] = constructor;
        }
        //if (id === "") {
        //    console.trace("", table === _nameToClass);
        //}
    }
};

function doSetClassName (id, constructor) {
    let key = '__classname__';
    let table = _nameToClass;
    // deregister old
    if (constructor.prototype.hasOwnProperty(key)) {
        delete table[constructor.prototype[key]];
    }
    value(constructor.prototype, key, id);
    // register class
    if (id) {
        var registered = table[id];
        if (registered && registered !== constructor) {
            var error = 'A Class already exists with the same ' + key + ' : "' + id + '".';
            if (CC_TEST) {
                error += ' (This may be caused by error of unit test.) \
If you dont need serialization, you can set class id to "". You can also call \
cc.js.unregisterClass to remove the id of unused class';
            }
            cc.error(error);
        }
        else {
            table[id] = constructor;
        }
        //if (id === "") {
        //    console.trace("", table === _nameToClass);
        //}
    }
};

/**
 * Register the class by specified name manually
 * @method setClassName
 * @param {String} className
 * @param {Function} constructor
 */
export function setClassName (className, constructor) {
    doSetClassName(className, constructor);
    // auto set class id
    if (!constructor.prototype.hasOwnProperty('__cid__')) {
        var id = className || tempCIDGenerater.getNewId();
        if (id) {
            _setClassId(id, constructor);
        }
    }
};

/**
 * Unregister a class from fireball.
 *
 * If you dont need a registered class anymore, you should unregister the class so that Fireball will not keep its reference anymore.
 * Please note that its still your responsibility to free other references to the class.
 *
 * @method unregisterClass
 * @param {Function} ...constructor - the class you will want to unregister, any number of classes can be added
 */
export function unregisterClass () {
    for (var i = 0; i < arguments.length; i++) {
        var p = arguments[i].prototype;
        var classId = p.__cid__;
        if (classId) {
            delete _idToClass[classId];
        }
        var classname = p.__classname__;
        if (classname) {
            delete _nameToClass[classname];
        }
    }
};

/**
 * Get the registered class by id
 * @method _getClassById
 * @param {String} classId
 * @return {Function} constructor
 * @private
 */
export function _getClassById (classId) {
    return _idToClass[classId];
};

/**
 * Get the registered class by name
 * @method getClassByName
 * @param {String} classname
 * @return {Function} constructor
 */
export function getClassByName (classname) {
    return _nameToClass[classname];
};

/**
 * Get class id of the object
 * @method _getClassId
 * @param {Object|Function} obj - instance or constructor
 * @param {Boolean} [allowTempId=true] - can return temp id in editor
 * @return {String}
 * @private
 */
export function _getClassId (obj, allowTempId) {
    allowTempId = (typeof allowTempId !== 'undefined' ? allowTempId: true);

    var res;
    if (typeof obj === 'function' && obj.prototype.hasOwnProperty('__cid__')) {
        res = obj.prototype.__cid__;
        if (!allowTempId && (CC_DEV || CC_EDITOR) && isTempClassId(res)) {
            return '';
        }
        return res;
    }
    if (obj && obj.constructor) {
        var prototype = obj.constructor.prototype;
        if (prototype && prototype.hasOwnProperty('__cid__')) {
            res = obj.__cid__;
            if (!allowTempId && (CC_DEV || CC_EDITOR) && isTempClassId(res)) {
                return '';
            }
            return res;
        }
    }
    return '';
};

/**
 * Defines a polyfill field for obsoleted codes.
 * @method obsolete
 * @param {any} obj - YourObject or YourClass.prototype
 * @param {String} obsoleted - "OldParam" or "YourClass.OldParam"
 * @param {String} newExpr - "NewParam" or "YourClass.NewParam"
 * @param {Boolean} [writable=false]
 */
export function obsolete (obj, obsoleted, newExpr, writable) {
    var extractPropName = /([^.]+)$/;
    var oldProp = extractPropName.exec(obsoleted)[0];
    var newProp = extractPropName.exec(newExpr)[0];
    function get () {
        if (CC_DEV) {
            cc.warnID(5400, obsoleted, newExpr);
        }
        return this[newProp];
    }
    if (writable) {
        getset(obj, oldProp,
            get,
            function (value) {
                if (CC_DEV) {
                    cc.warnID(5401, obsoleted, newExpr);
                }
                this[newProp] = value;
            }
        );
    }
    else {
        get(obj, oldProp, get);
    }
};

/**
 * Defines all polyfill fields for obsoleted codes corresponding to the enumerable properties of props.
 * @method obsoletes
 * @param {any} obj - YourObject or YourClass.prototype
 * @param {any} objName - "YourObject" or "YourClass"
 * @param {Object} props
 * @param {Boolean} [writable=false]
 */
export function obsoletes (obj, objName, props, writable) {
    for (var obsoleted in props) {
        var newName = props[obsoleted];
        obsolete(obj, objName + '.' + obsoleted, newName, writable);
    }
};

/**
 * A string tool to construct a string with format string.
 * @method formatStr
 * @param {String|any} msg - A JavaScript string containing zero or more substitution strings (%s).
 * @param {any} ...subst - JavaScript objects with which to replace substitution strings within msg. This gives you additional control over the format of the output.
 * @returns {String}
 * @example
 * cc.js.formatStr("a: %s, b: %s", a, b);
 * cc.js.formatStr(a, b, c);
 */
export function formatStr () {
    var argLen = arguments.length;
    if (argLen === 0) {
        return '';
    }
    var msg = arguments[0];
    if (argLen === 1) {
        return '' + msg;
    }

    var hasSubstitution = typeof msg === 'string' && REGEXP_NUM_OR_STR.test(msg);
    if (hasSubstitution) {
        for (let i = 1; i < argLen; ++i) {
            var arg = arguments[i];
            var regExpToTest = typeof arg === 'number' ? REGEXP_NUM_OR_STR : REGEXP_STR;
            if (regExpToTest.test(msg))
                msg = msg.replace(regExpToTest, arg);
            else
                msg += ' ' + arg;
        }
    }
    else {
        for (let i = 1; i < argLen; ++i) {
            msg += ' ' + arguments[i];
        }
    }
    return msg;
};

// see https://github.com/petkaantonov/bluebird/issues/1389
export function shiftArguments () {
    var len = arguments.length - 1;
    var args = new Array(len);
    for(var i = 0; i < len; ++i) {
        args[i] = arguments[i + 1];
    }
    return args;
};

/**
 * !#en
 * A simple wrapper of `Object.create(null)` which ensures the return object have no prototype (and thus no inherited members). So we can skip `hasOwnProperty` calls on property lookups. It is a worthwhile optimization than the `{}` literal when `hasOwnProperty` calls are necessary.
 * !#zh
 * 该方法是对 `Object.create(null)` 的简单封装。`Object.create(null)` 用于创建无 prototype （也就无继承）的空对象。这样我们在该对象上查找属性时，就不用进行 `hasOwnProperty` 判断。在需要频繁判断 `hasOwnProperty` 时，使用这个方法性能会比 `{}` 更高。
 *
 * @method createMap
 * @param {Boolean} [forceDictMode=false] - Apply the delete operator to newly created map object. This causes V8 to put the object in "dictionary mode" and disables creation of hidden classes which are very expensive for objects that are constantly changing shape.
 * @return {Object}
 */
export function createMap (forceDictMode) {
    var map = Object.create(null);
    if (forceDictMode) {
        const INVALID_IDENTIFIER_1 = '.';
        const INVALID_IDENTIFIER_2 = '/';
        map[INVALID_IDENTIFIER_1] = true;
        map[INVALID_IDENTIFIER_2] = true;
        delete map[INVALID_IDENTIFIER_1];
        delete map[INVALID_IDENTIFIER_2];
    }
    return map;
};

// fix submodule pollute ...
/**
 * @submodule cc
 */
