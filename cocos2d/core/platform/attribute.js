/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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

var JS = require('./js');
var isPlainEmptyObj = require('./utils').isPlainEmptyObj_DEV;

/**
 * @class Class
 */

/**
 * Tag the class with any meta attributes, then return all current attributes assigned to it.
 * This function holds only the attributes, not their implementations.
 *
 * @method attr
 * @param {Function|Object} constructor - the class or instance. If instance, the attribute will be dynamic and only available for the specified instance.
 * @param {String} propertyName - the name of property or function, used to retrieve the attributes
 * @param {Object} [attributes] - the attribute table to mark, new attributes will merged with existed attributes. Attribute whose key starts with '_' will be ignored.
 * @return {Object|Undefined} return all attributes associated with the property. if none undefined will be returned
 * @static
 * @private
 * @example {@link utils/api/engine/docs/cocos2d/core/platform/attribute/attr.js}
 */
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

function getTypeChecker (type, attrName, objectTypeCtor) {
    if (CC_DEV) {
        return function (constructor, mainPropName) {
            var mainPropAttrs = cc.Class.attr(constructor, mainPropName) || {};
            if (mainPropAttrs.type !== type) {
                cc.warn('Can only indicate one type attribute for %s.%s.', JS.getClassName(constructor),
                    mainPropName);
                return;
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
                if (type_lowerCase === 'object') {
                    if (defaultVal && !(defaultVal instanceof objectTypeCtor)) {
                        cc.warn('The default value of %s.%s is not instance of %s.',
                            JS.getClassName(constructor), mainPropName, JS.getClassName(objectTypeCtor));
                    }
                    else {
                        return;
                    }
                }
                else {
                    cc.warn('No needs to indicate the "%s" attribute for %s.%s, which its default value is type of %s.',
                        attrName, JS.getClassName(constructor), mainPropName, type);
                }
            }
            else {
                cc.warn('Can not indicate the "%s" attribute for %s.%s, which its default value is type of %s.',
                    attrName, JS.getClassName(constructor), mainPropName, defaultType);
            }
            delete mainPropAttrs.type;
        };
    }
}

function ObjectType (typeCtor) {
    return {
        type: 'Object',
        ctor: typeCtor,
        // _onAfterProp: (function () {
        //     if (CC_DEV) {
        //         return function (classCtor, mainPropName) {
        //             var check = getTypeChecker('Object', 'ObjectType', typeCtor);
        //             check(classCtor, mainPropName);
        //             // check ValueType
        //             var mainPropAttrs = cc.Class.attr(classCtor, mainPropName) || {};
        //             if (!Array.isArray(mainPropAttrs.default) && typeof typeCtor.prototype.clone === 'function') {
        //                 var typename = JS.getClassName(typeCtor);
        //                 var hasDefault = mainPropAttrs.default === null || mainPropAttrs.default === undefined;
        //                 if (hasDefault) {
        //                     cc.warn('%s is a ValueType, no need to specify the "type" of "%s.%s", ' +
        //                               'because the type information can obtain from its default value directly.',
        //                         typename, JS.getClassName(classCtor), mainPropName, typename);
        //                 }
        //                 else {
        //                     cc.warn('%s is a ValueType, no need to specify the "type" of "%s.%s", ' +
        //                               'just set the default value to "new %s()" and it will be handled properly.',
        //                         typename, JS.getClassName(classCtor), mainPropName, typename);
        //                 }
        //             }
        //         };
        //     }
        //     else {
        //         return undefined;
        //     }
        // })()
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
