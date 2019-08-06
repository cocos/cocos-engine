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
var isPlainEmptyObj = require('./utils').isPlainEmptyObj_DEV;

const DELIMETER = '$_$';

function createAttrsSingle (owner, superAttrs) {
    var attrs = superAttrs ? Object.create(superAttrs) : {};
    js.value(owner, '__attrs__', attrs);
    return attrs;
}

// subclass should not have __attrs__
function createAttrs (subclass) {
    if (typeof subclass !== 'function') {
        // attributes only in instance
        let instance = subclass;
        return createAttrsSingle(instance, getClassAttrs(instance.constructor));
    }
    var superClass;
    var chains = cc.Class.getInheritanceChain(subclass);
    for (var i = chains.length - 1; i >= 0; i--) {
        var cls = chains[i];
        var attrs = cls.hasOwnProperty('__attrs__') && cls.__attrs__;
        if (!attrs) {
            superClass = chains[i + 1];
            createAttrsSingle(cls, superClass && superClass.__attrs__);
        }
    }
    superClass = chains[0];
    createAttrsSingle(subclass, superClass && superClass.__attrs__);
    return subclass.__attrs__;
}

// /**
//  * @class Class
//  */

//  *
//  * Tag the class with any meta attributes, then return all current attributes assigned to it.
//  * This function holds only the attributes, not their implementations.
//  *
//  * @method attr
//  * @param {Function|Object} ctor - the class or instance. If instance, the attribute will be dynamic and only available for the specified instance.
//  * @param {String} propName - the name of property or function, used to retrieve the attributes
//  * @param {Object} [newAttrs] - the attribute table to mark, new attributes will merged with existed attributes. Attribute whose key starts with '_' will be ignored.
//  * @static
//  * @private
function attr (ctor, propName, newAttrs) {
    var attrs = getClassAttrs(ctor);
    if (!CC_DEV || typeof newAttrs === 'undefined') {
        // get
        var prefix = propName + DELIMETER;
        var ret = {};
        for (let key in attrs) {
            if (key.startsWith(prefix)) {
                ret[key.slice(prefix.length)] = attrs[key];
            }
        }
        return ret;
    }
    else if (CC_DEV && typeof newAttrs === 'object') {
        // set
        cc.warn(`\`cc.Class.attr(obj, prop, { key: value });\` is deprecated, use \`cc.Class.Attr.setClassAttr(obj, prop, 'key', value);\` instead please.`);
        for (let key in newAttrs) {
            attrs[propName + DELIMETER + key] = newAttrs[key];
        }
    }
}

// returns a readonly meta object
function getClassAttrs (ctor) {
    return (ctor.hasOwnProperty('__attrs__') && ctor.__attrs__) || createAttrs(ctor);
}

function setClassAttr (ctor, propName, key, value) {
    getClassAttrs(ctor)[propName + DELIMETER + key] = value;
}

/**
 * @module cc
 */

function PrimitiveType (name, def) {
    this.name = name;
    this.default = def;
}
PrimitiveType.prototype.toString = function () {
    return this.name;
};

/**
 * Specify that the input value must be integer in Inspector.
 * Also used to indicates that the elements in array should be type integer.
 * @property {string} Integer
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Integer
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Integer
 * })
 * member = [];
 */
cc.Integer = new PrimitiveType('Integer', 0);

/**
 * Indicates that the elements in array should be type double.
 * @property {string} Float
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Float
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Float
 * })
 * member = [];
 */
cc.Float = new PrimitiveType('Float', 0);

if (CC_EDITOR) {
    js.get(cc, 'Number', function () {
        cc.warnID(3603);
        return cc.Float;
    });
}

/**
 * Indicates that the elements in array should be type boolean.
 * @property {string} Boolean
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Boolean
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Boolean
 * })
 * member = [];
 */
cc.Boolean = new PrimitiveType('Boolean', false);

/**
 * Indicates that the elements in array should be type string.
 * @property {string} String
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.String
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.String
 * })
 * member = [];
 */
cc.String = new PrimitiveType('String', '');

// Ensures the type matches its default value
function getTypeChecker (type, attrName) {
    return function (constructor, mainPropName) {
        var propInfo = '"' + js.getClassName(constructor) + '.' + mainPropName + '"';
        var mainPropAttrs = attr(constructor, mainPropName);
        if (!mainPropAttrs.saveUrlAsAsset) {
            var mainPropAttrsType = mainPropAttrs.type;
            if (mainPropAttrsType === cc.Integer || mainPropAttrsType === cc.Float) {
                mainPropAttrsType = 'Number';
            }
            else if (mainPropAttrsType === cc.String || mainPropAttrsType === cc.Boolean) {
                mainPropAttrsType = '' + mainPropAttrsType;
            }
            if (mainPropAttrsType !== type) {
                cc.warnID(3604, propInfo);
                return;
            }
        }
        if (!mainPropAttrs.hasOwnProperty('default')) {
            return;
        }
        var defaultVal = mainPropAttrs.default;
        if (typeof defaultVal === 'undefined') {
            return;
        }
        var isContainer = Array.isArray(defaultVal) || isPlainEmptyObj(defaultVal);
        if (isContainer) {
            return;
        }
        var defaultType = typeof defaultVal;
        var type_lowerCase = type.toLowerCase();
        if (defaultType === type_lowerCase) {
            if (!mainPropAttrs.saveUrlAsAsset) {
                if (type_lowerCase === 'object') {
                    if (defaultVal && !(defaultVal instanceof mainPropAttrs.ctor)) {
                        cc.warnID(3605, propInfo, js.getClassName(mainPropAttrs.ctor));
                    }
                    else {
                        return;
                    }
                }
                else if (type !== 'Number') {
                    cc.warnID(3606, attrName, propInfo, type);
                }
            }
        }
        else if (defaultType !== 'function') {
            if (type === cc.String && defaultVal == null) {
                if (!js.isChildClassOf(mainPropAttrs.ctor, cc.RawAsset)) {
                    cc.warnID(3607, propInfo);
                }
            }
            else {
                cc.warnID(3611, attrName, propInfo, defaultType);
            }
        }
        else {
            return;
        }
        delete mainPropAttrs.type;
    };
}

// Ensures the type matches its default value
function getObjTypeChecker (typeCtor) {
    return function (classCtor, mainPropName) {
        getTypeChecker('Object', 'type')(classCtor, mainPropName);
        // check ValueType
        var defaultDef = getClassAttrs(classCtor)[mainPropName + DELIMETER + 'default'];
        var defaultVal = require('./CCClass').getDefault(defaultDef);
        if (!Array.isArray(defaultVal) && js.isChildClassOf(typeCtor, cc.ValueType)) {
            var typename = js.getClassName(typeCtor);
            var info = cc.js.formatStr('No need to specify the "type" of "%s.%s" because %s is a child class of ValueType.',
                js.getClassName(classCtor), mainPropName, typename);
            if (defaultDef) {
                cc.log(info);
            }
            else {
                cc.warnID(3612, info, typename, js.getClassName(classCtor), mainPropName, typename);
            }
        }
    };
}

module.exports = {
    PrimitiveType,
    attr: attr,
    getClassAttrs: getClassAttrs,
    setClassAttr: setClassAttr,
    DELIMETER: DELIMETER,
    getTypeChecker_ET: ((CC_EDITOR && !Editor.isBuilder) || CC_TEST) && getTypeChecker,
    getObjTypeChecker_ET: ((CC_EDITOR && !Editor.isBuilder) || CC_TEST) && getObjTypeChecker,
    ScriptUuid: {},      // the value will be represented as a uuid string
};
