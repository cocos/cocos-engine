/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { DEV, EDITOR, SUPPORT_JIT, TEST } from 'internal:constants';
import { errorID, warnID, error } from '../platform/debug';
import * as js from '../utils/js';
import { getSuper, isChildClassOf } from '../utils/js';
import { BitMask } from '../value-types';
import { Enum } from '../value-types/enum';
import * as attributeUtils from './utils/attribute';
import { IAcceptableAttributes } from './utils/attribute-defines';
import { preprocessAttrs } from './utils/preprocess-class';
import * as RF from './utils/requiring-frame';

import { legacyCC } from '../global-exports';
import { PropertyStash, PropertyStashInternalFlag } from './class-stash';
import { setPropertyEnumTypeOnAttrs } from './utils/attribute-internal';

const DELIMETER = attributeUtils.DELIMETER;
const CCCLASS_TAG = '__ctors__'; // Still use this historical name to avoid unsynchronized version issue

/**
 * @engineInternal
 */
export const ENUM_TAG = 'Enum';

/**
 * @engineInternal
 */
export const BITMASK_TAG = 'BitMask';

function pushUnique (array, item): void {
    if (array.indexOf(item) < 0) {
        array.push(item);
    }
}

// both getter and prop must register the name into `__props__` array
function appendProp (cls, name): void {
    if (DEV) {
        // if (!IDENTIFIER_RE.test(name)) {
        //    error('The property name "' + name + '" is not compliant with JavaScript naming standards');
        //    return;
        // }
        if (name.indexOf('.') !== -1) {
            errorID(3634);
            return;
        }
    }
    pushUnique(cls.__props__, name);
}

function defineProp (cls, className, propName, val): void {
    appendProp(cls, propName);

    // apply attributes
    parseAttributes(cls, val, className, propName, false);
    if ((EDITOR && !window.Build) || TEST) {
        for (let i = 0; i < onAfterProps_ET.length; i++) {
            onAfterProps_ET[i](cls, propName);
        }
        onAfterProps_ET.length = 0;
    }
}

function defineGetSet (cls, name, propName, val): void {
    if (val.get) {
        parseAttributes(cls, val, name, propName, true);
        if ((EDITOR && !window.Build) || TEST) {
            onAfterProps_ET.length = 0;
        }

        attributeUtils.setClassAttr(cls, propName, 'serializable', false);

        if (DEV) {
            // 不论是否 visible 都要添加到 props，否则 asset watcher 不能正常工作
            appendProp(cls, propName);
            attributeUtils.setClassAttr(cls, propName, 'hasGetter', true); // 方便 editor 做判断
        }
    }
    if (DEV && val.set) {
        attributeUtils.setClassAttr(cls, propName, 'hasSetter', true); // 方便 editor 做判断
    }
}

function getDefault (defaultVal): any {
    if (typeof defaultVal === 'function') {
        if (EDITOR) {
            try {
                return defaultVal();
            } catch (e) {
                legacyCC._throw(e);
                return undefined;
            }
        } else {
            return defaultVal();
        }
    }
    return defaultVal;
}

function define (cls, className, baseClass): any {
    const Component = legacyCC.Component;
    const frame = RF.peek();
    if (frame && isChildClassOf(baseClass, Component)) {
        // project component
        // if (DEV && frame.uuid && className) {
        //     warnID(3616, className);
        // }
        className = className || frame.script;
    }

    if (DEV) {
        // check ctor
        if (CCClass._isCCClass(cls)) {
            errorID(3618, className);
        }
    }

    js.value(cls, CCCLASS_TAG, true, true);

    if (baseClass) {
        cls.$super = baseClass;
    }

    js.setClassName(className, cls);

    if (EDITOR) {
        // for RenderPipeline, RenderFlow, RenderStage
        let renderName = '';
        if (isChildClassOf(baseClass, legacyCC.RenderPipeline)) {
            renderName = 'render_pipeline';
        } else if (isChildClassOf(baseClass, legacyCC.RenderFlow)) {
            renderName = 'render_flow';
        } else if (isChildClassOf(baseClass, legacyCC.RenderStage)) {
            renderName = 'render_stage';
        }
        if (renderName) {
            // 增加了 hidden: 开头标识，使它最终不会显示在 Editor inspector 的添加组件列表里
            window.EditorExtends && window.EditorExtends.Component.addMenu(cls, `hidden:${renderName}/${className}`, -1);
        }

        EditorExtends.emit('class-registered', cls, frame, className);
    }

    if (frame) {
        // project scripts
        if (isChildClassOf(baseClass, Component)) {
            if (DEV && isChildClassOf(frame.cls, Component)) {
                errorID(3615);
            } else {
                const uuid = frame.uuid;
                if (uuid) {
                    js._setClassId(uuid, cls);
                    if (EDITOR) {
                        cls.prototype.__scriptUuid = EditorExtends.UuidUtils.decompressUuid(uuid);
                    }
                }
                frame.cls = cls;
            }
        } else if (!isChildClassOf(frame.cls, Component)) {
            frame.cls = cls;
        }
    }
}

function getNewValueTypeCodeJit (value): string {
    const clsName = js.getClassName(value);
    const type = value.constructor;
    let res = `new ${clsName}(`;
    for (let i = 0; i < type.__props__.length; i++) {
        const prop = type.__props__[i];
        const propVal = value[prop];
        if (DEV && typeof propVal === 'object') {
            errorID(3641, clsName);
            return `new ${clsName}()`;
        }
        res += propVal;
        if (i < type.__props__.length - 1) {
            res += ',';
        }
    }
    return `${res})`;
}

// TODO - move escapeForJS, IDENTIFIER_RE, getNewValueTypeCodeJit to misc.js or a new source file

// convert a normal string including newlines, quotes and Unicode characters into a string literal
// ready to use in JavaScript source
function escapeForJS (s): string {
    return JSON.stringify(s)
        // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
}

// simple test variable name
const IDENTIFIER_RE = /^[A-Za-z_$][0-9A-Za-z_$]*$/;

function declareProperties (cls, className, properties, baseClass): void {
    cls.__props__ = [];

    if (baseClass && baseClass.__props__) {
        cls.__props__ = baseClass.__props__.slice();
    }

    if (properties) {
        // 预处理属性
        preprocessAttrs(properties, className, cls);

        for (const propName in properties) {
            const val = properties[propName];
            if (!val.get && !val.set) {
                defineProp(cls, className, propName, val);
            } else {
                defineGetSet(cls, className, propName, val);
            }
        }
    }

    const attrs = attributeUtils.getClassAttrs(cls);
    cls.__values__ = cls.__props__.filter((prop) => attrs[`${prop}${DELIMETER}serializable`] !== false);
}

interface ISealable {
    _sealed?: boolean;
}

export function CCClass<TFunction> (
    cls: TFunction & ISealable,
    base: null | (TFunction & { __props__?: any } & ISealable),
    name?: string,
    properties?: any,
    ): any {

    define(cls, name, base);
    if (!name) {
        name = legacyCC.js.getClassName(cls);
    }

    cls._sealed = true;
    if (base) {
        base._sealed = false;
    }

    // define Properties
    declareProperties(cls, name, properties, base);

    return cls;
}

/**
 * @en
 * Checks whether the constructor is initialized by `@ccclass`.
 * @zh
 * 检查构造函数是否经由 `@ccclass` 初始化。
 * @method _isCCClass
 * @param {Function} constructor
 * @return {Boolean}
 * @private
 */
CCClass._isCCClass = function isCCClass (constructor): boolean {
    // Does not support fastDefined class (ValueType).
    // Use `instanceof ValueType` if necessary.
    // eslint-disable-next-line no-prototype-builtins, @typescript-eslint/no-unsafe-return
    return constructor?.hasOwnProperty?.(CCCLASS_TAG);     // Remember, the static variable is not inheritable
};

//
// Optimized define function only for internal classes
//
// @method fastDefine
// @param {String} className
// @param {Function} constructor
// @param {Object} serializableFields
// @private
//
CCClass.fastDefine = function (className, constructor, serializableFields): void {
    js.setClassName(className, constructor);
    const props = constructor.__props__ = constructor.__values__ = Object.keys(serializableFields);
    const attrs = attributeUtils.getClassAttrs(constructor);
    for (let i = 0; i < props.length; i++) {
        const key = props[i];
        attrs[`${key + DELIMETER}visible`] = false;
        attrs[`${key + DELIMETER}default`] = serializableFields[key];
    }
};

CCClass.Attr = attributeUtils;
CCClass.attr = attributeUtils.attr;

/**
 * Returns if the class is a cc-class or is fast-defined.
 * @param constructor The constructor of the class.
 * @returns Judge result.
 * @engineInternal
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isCCClassOrFastDefined<T> (constructor: Constructor<T>): boolean {
    // eslint-disable-next-line no-prototype-builtins, @typescript-eslint/no-unsafe-return
    return  constructor?.hasOwnProperty?.('__values__');
}

CCClass.isCCClassOrFastDefined = isCCClassOrFastDefined;

/**
 * Return all super classes.
 * @param constructor The Constructor.
 */
function getInheritanceChain (constructor): any[] {
    const chain: any[] = [];
    for (; ;) {
        constructor = getSuper(constructor);
        if (!constructor) {
            break;
        }
        if (constructor !== Object) {
            chain.push(constructor);
        }
    }
    return chain;
}

CCClass.getInheritanceChain = getInheritanceChain;

const PrimitiveTypes = {
    // Specify that the input value must be integer in Properties.
    // Also used to indicates that the type of elements in array or the type of value in dictionary is integer.
    Integer: 'Number',
    // Indicates that the type of elements in array or the type of value in dictionary is double.
    Float: 'Number',
    Boolean: 'Boolean',
    String: 'String',
};

interface IParsedAttribute extends IAcceptableAttributes {
    ctor?: Function;
    enumList?: readonly any[];
    bitmaskList?: any[];
}
type OnAfterProp = (constructor: Function, mainPropertyName: string) => void;
const onAfterProps_ET: OnAfterProp[] = [];

function parseAttributes (constructor: Function, attributes: PropertyStash, className: string, propertyName: string, usedInGetter): void {
    let attrs: IParsedAttribute | null = null;
    let propertyNamePrefix = '';
    function initAttrs (): any {
        propertyNamePrefix = propertyName + DELIMETER;
        return attrs = attributeUtils.getClassAttrs(constructor);
    }

    if ((EDITOR && !window.Build) || TEST) {
        onAfterProps_ET.length = 0;
    }

    if (DEV && 'type' in attributes && typeof attributes.type === 'undefined') {
        warnID(3660, propertyName, className);
    }

    let warnOnNoDefault = true;

    const type = attributes.type;
    if (type) {
        const primitiveType = PrimitiveTypes[type];
        if (primitiveType) {
            (attrs || initAttrs())[`${propertyNamePrefix}type`] = type;
            if (((EDITOR && !window.Build) || TEST) && !attributes._short) {
                onAfterProps_ET.push(attributeUtils.getTypeChecker_ET(primitiveType, `cc.${type}`));
            }
        } else if (type === 'Object') {
            if (DEV) {
                errorID(3644, className, propertyName);
            }
        }
        // else if (type === Attr.ScriptUuid) {
        //     (attrs || initAttrs())[propertyNamePrefix + 'type'] = 'Script';
        //     attrs[propertyNamePrefix + 'ctor'] = cc.ScriptAsset;
        // }
        else if (typeof type === 'object') {
            if (Enum.isEnum(type)) {
                setPropertyEnumTypeOnAttrs(
                    attrs || initAttrs(),
                    propertyName,
                    type,
                );
            } else if (BitMask.isBitMask(type)) {
                (attrs || initAttrs())[`${propertyNamePrefix}type`] = BITMASK_TAG;
                attrs![`${propertyNamePrefix}bitmaskList`] = BitMask.getList(type);
            } else if (DEV) {
                errorID(3645, className, propertyName, type);
            }
        } else if (typeof type === 'function') {
            // Do not warn missing-default if the type is object
            warnOnNoDefault = false;
            (attrs || initAttrs())[`${propertyNamePrefix}type`] = 'Object';
            attrs![`${propertyNamePrefix}ctor`] = type;
            if (((EDITOR && !window.Build) || TEST) && !attributes._short) {
                onAfterProps_ET.push(attributeUtils.getObjTypeChecker_ET(type));
            }
        } else if (DEV) {
            errorID(3646, className, propertyName, type);
        }
    }

    if ('default' in attributes) {
        (attrs || initAttrs())[`${propertyNamePrefix}default`] = attributes.default;
    }
    // TODO: we close this warning for now:
    // issue: https://github.com/cocos/3d-tasks/issues/14887
    // else if (((EDITOR && !window.Build) || TEST) && warnOnNoDefault && !(attributes.get || attributes.set)) {
    //     warnID(3654, className, propertyName);
    // }

    const parseSimpleAttribute = (attributeName: keyof IAcceptableAttributes): void => {
        if (attributeName in attributes) {
            const val = attributes[attributeName];
            (attrs || initAttrs())[propertyNamePrefix + attributeName] = val;
        }
    };

    if (DEV && attributes.editorOnly) {
        if (usedInGetter) {
            errorID(3613, 'editorOnly', className, propertyName);
        } else {
            (attrs || initAttrs())[`${propertyNamePrefix}editorOnly`] = true;
        }
    }
    // parseSimpleAttr('preventDeferredLoad');
    if (DEV) {
        parseSimpleAttribute('displayName');
        parseSimpleAttribute('displayOrder');
        parseSimpleAttribute('multiline');
        parseSimpleAttribute('radian');
        parseSimpleAttribute('readonly');
        parseSimpleAttribute('tooltip');
        parseSimpleAttribute('group');
        parseSimpleAttribute('slide');
        parseSimpleAttribute('unit');
        parseSimpleAttribute('userData');
        parseSimpleAttribute('radioGroup');
    }

    const isStandaloneMode = attributes.__internalFlags & PropertyStashInternalFlag.STANDALONE;

    let normalizedSerializable: undefined | boolean;
    if (isStandaloneMode) {
        normalizedSerializable = attributes.serializable === true
            || (attributes.__internalFlags & PropertyStashInternalFlag.IMPLICIT_SERIALIZABLE) !== 0;
    } else if (attributes.serializable === false) {
        normalizedSerializable = false;
        if (DEV && usedInGetter) {
            errorID(3613, 'serializable', className, propertyName);
        }
    }
    if (typeof normalizedSerializable !== 'undefined') {
        (attrs || initAttrs())[`${propertyNamePrefix}serializable`] = normalizedSerializable;
    }

    parseSimpleAttribute('formerlySerializedAs');

    if (DEV) {
        parseSimpleAttribute('animatable');
    }

    if (DEV) {
        const visible = attributes.visible;

        let normalizedVisible: undefined | boolean | (() => boolean);
        switch (typeof visible) {
            case 'boolean':
            case 'function':
                normalizedVisible = visible;
                break;
            default: {
                if (isStandaloneMode) {
                    normalizedVisible = (attributes.__internalFlags & PropertyStashInternalFlag.IMPLICIT_VISIBLE) !== 0;
                } else {
                    const startsWithUS = (propertyName.charCodeAt(0) === 95);
                    if (startsWithUS) {
                        normalizedVisible = false;
                    }
                }
            }
        }

        if (typeof normalizedVisible !== 'undefined') {
            (attrs || initAttrs())[`${propertyNamePrefix}visible`] = normalizedVisible;
        }
    }

    if (DEV) {
        const range = attributes.range;
        if (range) {
            (attrs || initAttrs())[`${propertyNamePrefix}min`] = range[0];
            attrs![`${propertyNamePrefix}max`] = range[1];
            if (range.length > 2) {
                attrs![`${propertyNamePrefix}step`] = range[2];
            }
        }
        parseSimpleAttribute('min');
        parseSimpleAttribute('max');
        parseSimpleAttribute('step');
    }
}

CCClass.isArray = function (defaultVal): boolean {
    defaultVal = getDefault(defaultVal);
    return Array.isArray(defaultVal);
};

CCClass.getDefault = getDefault;
CCClass.escapeForJS = escapeForJS;
CCClass.IDENTIFIER_RE = IDENTIFIER_RE;
// NOTE: the type of getNewValueTypeCode can be ((value: any) => string) or boolean.
CCClass.getNewValueTypeCode = (SUPPORT_JIT && getNewValueTypeCodeJit) as any;

legacyCC.Class = CCClass;
