/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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

var JS = require('./js');
var isPlainEmptyObj = require('./utils').isPlainEmptyObj_DEV;

// /**
//  * @class Class
//  */

// *
//  * Tag the class with any meta attributes, then return all current attributes assigned to it.
//  * This function holds only the attributes, not their implementations.
//  *
//  * @method attr
//  * @param {Function|Object} constructor - the class or instance. If instance, the attribute will be dynamic and only available for the specified instance.
//  * @param {String} propertyName - the name of property or function, used to retrieve the attributes
//  * @param {Object} [attributes] - the attribute table to mark, new attributes will merged with existed attributes. Attribute whose key starts with '_' will be ignored.
//  * @return {Object|Undefined} return all attributes associated with the property. if none undefined will be returned
//  * @static
//  * @private
//  * @example {@link utils/api/engine/docs/cocos2d/core/platform/attribute/attr.js}
 
function attr (constructor, propertyName, attributes) {
    var key = '_attr$' + propertyName;
    var instance, attrs, name;
    if (typeof constructor === 'function') {
        // attributes in class
        instance = constructor.prototype;
        attrs = instance[key];
        if (typeof attributes !== 'undefined') {
            // set
            if (typeof attributes === 'object') {
                if (!attrs) {
                    instance[key] = attrs = {};
                }
                for (name in attributes) {
                    if (name[0] !== '_') {
                        attrs[name] = attributes[name];
                    }
                }
            }
            else {
                instance[key] = attributes;
                return attributes;
            }
        }
        return attrs;
    }
    else {
        // attributes in instance
        instance = constructor;
        if (typeof attributes !== 'undefined') {
            // set
            if (typeof attributes === 'object') {
                if (instance.hasOwnProperty(key)) {
                    attrs = instance[key];
                }
                if (!attrs) {
                    instance[key] = attrs = {};
                }
                for (name in attributes) {
                    if (name[0] !== '_') {
                        attrs[name] = attributes[name];
                    }
                }
                return JS.addon({}, attrs, instance.constructor.prototype[key]);
            }
            else {
                instance[key] = attributes;
                return attributes;
            }
        }
        else {
            // get
            attrs = instance[key];
            if (typeof attrs === 'object') {
                return JS.addon({}, attrs, instance.constructor.prototype[key]);
            }
            else {
                return attrs;
            }
        }
    }
}

/**
 * @module cc
 */

/**
 * Specify that the input value must be integer in Inspector.
 * Also used to indicates that the elements in array should be type integer.
 * @property {string} Integer
 * @readonly
 */
cc.Integer = 'Integer';

/**
 * Indicates that the elements in array should be type double.
 * @property {string} Float
 * @readonly
 */
cc.Float = 'Float';

if (CC_EDITOR) {
    JS.get(cc, 'Number', function () {
        cc.warn('Use "cc.Float" or "cc.Integer" instead of "cc.Number" please. \uD83D\uDE02');
        return cc.Float;
    });
}

/**
 * Indicates that the elements in array should be type boolean.
 * @property {string} Boolean
 * @readonly
 */
cc.Boolean = 'Boolean';

/**
 * Indicates that the elements in array should be type string.
 * @property {string} String
 * @readonly
 */
cc.String = 'String';

/*
BuiltinAttributes: {
    default: defaultValue,
    _canUsedInGetter: true, (default true)
    _canUsedInSetter: false, (default false) (NYI)
}
Getter or Setter: {
    hasGetter: true,
    hasSetter: true,
}
Callbacks: {
    _onAfterProp: function (constructor, propName) {},
    _onAfterGetter: function (constructor, propName) {}, (NYI)
    _onAfterSetter: function (constructor, propName) {}, (NYI)
}
 */

var NonSerialized = {
    serializable: false,
    _canUsedInGetter: false
};

var EditorOnly = {
    editorOnly: true,
    _canUsedInGetter: false
};

function getTypeChecker (type, attrName) {
    if (CC_DEV) {
        return function (constructor, mainPropName) {
            var propInfo = '"' + JS.getClassName(constructor) + '.' + mainPropName + '"';
            var mainPropAttrs = cc.Class.attr(constructor, mainPropName) || {};
            if (!mainPropAttrs.saveUrlAsAsset) {
                var mainPropAttrsType = mainPropAttrs.type;
                if (mainPropAttrsType === cc.Integer || mainPropAttrsType === cc.Float) {
                    mainPropAttrsType = 'Number';
                }
                if (mainPropAttrsType !== type) {
                    cc.warn('Can only indicate one type attribute for %s.', propInfo);
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
                            cc.warn('The default value of %s is not instance of %s.',
                                propInfo, JS.getClassName(mainPropAttrs.ctor));
                        }
                        else {
                            return;
                        }
                    }
                    else if (type !== 'Number') {
                        cc.warn('No needs to indicate the "%s" attribute for %s, which its default value is type of %s.',
                            attrName, propInfo, type);
                    }
                }
            }
            else if (defaultType !== 'function') {
                if (type === cc.String && defaultVal == null) {
                    if (!cc.isChildClassOf(mainPropAttrs.ctor, cc.RawAsset)) {
                        cc.warn('The default value of %s must be an empty string.', propInfo);
                    }
                }
                else if (mainPropAttrs.ctor === String && (defaultType === 'string' || defaultVal == null)) {
                    mainPropAttrs.type = cc.String;
                    cc.warn('The type of %s must be cc.String, not String.', propInfo);
                }
                else if (mainPropAttrs.ctor === Boolean && defaultType === 'boolean') {
                    mainPropAttrs.type = cc.Boolean;
                    cc.warn('The type of %s must be cc.Boolean, not Boolean.', propInfo);
                }
                else if (mainPropAttrs.ctor === Number && defaultType === 'number') {
                    mainPropAttrs.type = cc.Float;
                    cc.warn('The type of %s must be cc.Float or cc.Integer, not Number.', propInfo);
                }
                else {
                    cc.warn('Can not indicate the "%s" attribute for %s, which its default value is type of %s.',
                        attrName, propInfo, defaultType);
                }
            }
            else {
                return;
            }
            delete mainPropAttrs.type;
        };
    }
}

function ObjectType (typeCtor) {
    return {
        type: 'Object',
        ctor: typeCtor,
        _onAfterProp: CC_DEV && function (classCtor, mainPropName) {
            getTypeChecker('Object', 'type')(classCtor, mainPropName);
            // check ValueType
            var mainPropAttrs = cc.Class.attr(classCtor, mainPropName) || {};
            var def = mainPropAttrs.default;
            if (typeof def === 'function') {
                try {
                    def = def();
                }
                catch (e) {
                    return;
                }
            }
            if (!Array.isArray(def) && cc.isChildClassOf(typeCtor, cc.ValueType)) {
                var typename = JS.getClassName(typeCtor);
                var info = cc.js.formatStr('No need to specify the "type" of "%s.%s" because %s is a child class of ValueType.',
                    JS.getClassName(classCtor), mainPropName, typename);
                if (mainPropAttrs.default) {
                    cc.log(info);
                }
                else {
                    cc.warn(info + ' Just set the default value to "new %s()" and it will be handled properly.',
                        typename, JS.getClassName(classCtor), mainPropName, typename);
                }
            }
        }
    };
}

function RawType (typename) {
    var NEED_EXT_TYPES = ['image', 'json', 'text', 'audio'];  // the types need to specify exact extname
    return {
        // type: 'raw',
        rawType: typename,
        serializable: false,
        // hideInInspector: true,
        _canUsedInGetter: false,

        _onAfterProp: function (constructor, mainPropName) {
            // check raw object
            var checked = !CC_DEV || (function checkRawType(constructor) {
                if (! cc.isChildClassOf(constructor, cc.Asset)) {
                    cc.error('RawType is only available for Assets');
                    return false;
                }
                var found = false;
                for (var p = 0; p < constructor.__props__.length; p++) {
                    var propName = constructor.__props__[p];
                    var attrs = cc.Class.attr(constructor, propName);
                    var rawType = attrs.rawType;
                    if (rawType) {
                        var containsUppercase = (rawType.toLowerCase() !== rawType);
                        if (containsUppercase) {
                            cc.error('RawType name cannot contain uppercase');
                            return false;
                        }
                        if (found) {
                            cc.error('Each asset cannot have more than one RawType');
                            return false;
                        }
                        found = true;
                    }
                }
                return true;
            })(constructor);
        }
    };
}

function Range (min, max) {
   return { min: min, max: max };
}

module.exports = {
    attr: attr,
    getTypeChecker: getTypeChecker,
    NonSerialized: NonSerialized,
    EditorOnly: EditorOnly,
    ObjectType: ObjectType,
    RawType: RawType,
    ScriptUuid: {},      // the value will be represented as a uuid string
    Range: Range
};
