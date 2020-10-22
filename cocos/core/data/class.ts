/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @hidden
 */

// tslint:disable:only-arrow-functions
// tslint:disable:prefer-for-of
// tslint:disable:no-shadowed-variable
// tslint:disable:max-line-length
// tslint:disable:jsdoc-format
// tslint:disable:forin

import { errorID, warnID } from '../platform/debug';
import * as js from '../utils/js';
import { getSuper } from '../utils/js';
import { cloneable_DEV, isPlainEmptyObj_DEV } from '../utils/misc';
import { BitMask } from '../value-types';
import { Enum } from '../value-types/enum';
import * as attributeUtils from './utils/attribute';
import { IAcceptableAttributes } from './utils/attribute-defines';
import { preprocessAttrs } from './utils/preprocess-class';
import * as RF from './utils/requiring-frame';
import { error } from '../platform/debug';
import { DEV, EDITOR, SUPPORT_JIT, TEST } from 'internal:constants';
import { legacyCC } from '../global-exports';

const DELIMETER = attributeUtils.DELIMETER;

function pushUnique (array, item) {
    if (array.indexOf(item) < 0) {
        array.push(item);
    }
}

const deferredInitializer: any = {

    // Configs for classes which needs deferred initialization
    datas: null,

    // register new class
    // data - {cls: cls, cb: properties, mixins: options.mixins}
    push (data) {
        if (this.datas) {
            this.datas.push(data);
        }
        else {
            this.datas = [data];
            // start a new timer to initialize
            const self = this;
            setTimeout(function () {
                self.init();
            }, 0);
        }
    },

    init () {
        const datas = this.datas;
        if (datas) {
            for (let i = 0; i < datas.length; ++i) {
                const data = datas[i];
                const cls = data.cls;
                let properties = data.props;
                if (typeof properties === 'function') {
                    properties = properties();
                }
                const name = js.getClassName(cls);
                if (properties) {
                    declareProperties(cls, name, properties, cls.$super, data.mixins);
                }
                else {
                    errorID(3633, name);
                }
            }
            this.datas = null;
        }
    },
};

// both getter and prop must register the name into __props__ array
function appendProp (cls, name) {
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

const tmpArray = [];
function defineProp (cls, className, propName, val) {
    const defaultValue = val.default;

    if (DEV) {
        // check base prototype to avoid name collision
        if (CCClass.getInheritanceChain(cls)
            .some(function (x) { return x.prototype.hasOwnProperty(propName); })) {
            errorID(3637, className, propName, className);
            return;
        }
    }

    // set default value
    attributeUtils.setClassAttr(cls, propName, 'default', defaultValue);

    appendProp(cls, propName);

    // apply attributes
    const attrs = parseAttributes(cls, val, className, propName, false);
    if (attrs) {
        const onAfterProp: any[] = tmpArray;
        for (let i = 0; i < attrs.length; i++) {
            const attr: any = attrs[i];
            attributeUtils.attr(cls, propName, attr);
            // register callback
            if (attr._onAfterProp) {
                onAfterProp.push(attr._onAfterProp);
            }
        }
        // call callback
        for (let c = 0; c < onAfterProp.length; c++) {
            onAfterProp[c](cls, propName);
        }
        tmpArray.length = 0;
        attrs.length = 0;
    }
}

function defineGetSet (cls, name, propName, val) {
    const getter = val.get;
    const setter = val.set;
    const proto = cls.prototype;
    const d = Object.getOwnPropertyDescriptor(proto, propName);

    if (getter) {
        const attrs = parseAttributes(cls, val, name, propName, true);
        for (let i = 0; i < attrs.length; i++) {
            attributeUtils.attr(cls, propName, attrs[i]);
        }
        attrs.length = 0;

        attributeUtils.setClassAttr(cls, propName, 'serializable', false);

        if (DEV) {
            // 不论是否 visible 都要添加到 props，否则 asset watcher 不能正常工作
            appendProp(cls, propName);
        }

        if (EDITOR || DEV) {
            attributeUtils.setClassAttr(cls, propName, 'hasGetter', true); // 方便 editor 做判断
        }
    }

    if (setter) {
        if (EDITOR || DEV) {
            attributeUtils.setClassAttr(cls, propName, 'hasSetter', true); // 方便 editor 做判断
        }
    }
}

function getDefault (defaultVal) {
    if (typeof defaultVal === 'function') {
        if (EDITOR) {
            try {
                return defaultVal();
            }
            catch (e) {
                legacyCC._throw(e);
                return undefined;
            }
        }
        else {
            return defaultVal();
        }
    }
    return defaultVal;
}

function mixinWithInherited (dest, src, filter?) {
    for (const prop in src) {
        if (!dest.hasOwnProperty(prop) && (!filter || filter(prop))) {
            Object.defineProperty(dest, prop, js.getPropertyDescriptor(src, prop)!);
        }
    }
}

function doDefine (className, baseClass, mixins, options) {
    const ctor = options.ctor;

    if (DEV) {
        // check ctor
        if (CCClass._isCCClass(ctor)) {
            errorID(3618, className);
        }
    }

    const ctors = [ctor];
    const fireClass = ctor;

    js.value(fireClass, '__ctors__', ctors.length > 0 ? ctors : null, true);

    const prototype = fireClass.prototype;
    if (baseClass) {
        fireClass.$super = baseClass;
    }

    if (mixins) {
        for (let m = mixins.length - 1; m >= 0; m--) {
            const mixin = mixins[m];
            mixinWithInherited(prototype, mixin.prototype);

            // mixin attributes
            if (CCClass._isCCClass(mixin)) {
                mixinWithInherited(
                    attributeUtils.getClassAttrs(fireClass).constructor.prototype,
                    attributeUtils.getClassAttrs(mixin).constructor.prototype,
                );
            }
        }
        // restore constuctor overridden by mixin
        prototype.constructor = fireClass;
    }

    js.setClassName(className, fireClass);
    return fireClass;
}

function define (className, baseClass, mixins, options) {
    const Component = legacyCC.Component;
    const frame = RF.peek();

    if (frame && js.isChildClassOf(baseClass, Component)) {
        // project component
        if (js.isChildClassOf(frame.cls, Component)) {
            errorID(3615);
            return null;
        }
        if (DEV && frame.uuid && className) {
            // warnID(3616, className);
        }
        className = className || frame.script;
    }

    const cls = doDefine(className, baseClass, mixins, options);

    // for RenderPipeline, RenderFlow, RenderStage
    const isRenderPipeline = js.isChildClassOf(baseClass, legacyCC.RenderPipeline);
    const isRenderFlow = js.isChildClassOf(baseClass, legacyCC.RenderFlow);
    const isRenderStage = js.isChildClassOf(baseClass, legacyCC.RenderStage);

    const isRender = isRenderPipeline || isRenderFlow || isRenderStage || false;

    if (isRender) {
        let renderName = '';
        if (isRenderPipeline) {
            renderName = 'render_pipeline';
        } else if (isRenderFlow) {
            renderName = 'render_flow';
        } else if (isRenderStage) {
            renderName = 'render_stage';
        }

        if (renderName) {
            js._setClassId(className, cls);
            if (EDITOR) {
                // 增加了 hidden: 开头标识，使它最终不会显示在 Editor inspector 的添加组件列表里
                // @ts-ignore
                // tslint:disable-next-line:no-unused-expression
                window.EditorExtends && window.EditorExtends.Component.addMenu(cls, `hidden:${renderName}/${className}`, -1);
            }
        }
    }

    if (EDITOR) {
        // Note: `options.ctor` should be same as `cls` except if
        // cc-class is defined by `cc.Class({/* ... */})`.
        // In such case, `options.ctor` may be `undefined`.
        // So we can not use `options.ctor`. Instead we should use `cls` which is the "real" registered cc-class.
        EditorExtends.emit('class-registered', cls, frame, className);
    }

    if (frame) {
        // 基础的 ts, js 脚本组件
        if (js.isChildClassOf(baseClass, Component)) {
            const uuid = frame.uuid;
            if (uuid) {
                js._setClassId(uuid, cls);
                if (EDITOR) {
                    cls.prototype.__scriptUuid = EditorExtends.UuidUtils.decompressUuid(uuid);
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

function getNewValueTypeCodeJit (value) {
    const clsName = js.getClassName(value);
    const type = value.constructor;
    let res = 'new ' + clsName + '(';
    for (let i = 0; i < type.__props__.length; i++) {
        const prop = type.__props__[i];
        const propVal = value[prop];
        if (DEV && typeof propVal === 'object') {
            errorID(3641, clsName);
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

// simple test variable name
const IDENTIFIER_RE = /^[A-Za-z_$][0-9A-Za-z_$]*$/;

function declareProperties (cls, className, properties, baseClass, mixins) {
    cls.__props__ = [];

    if (baseClass && baseClass.__props__) {
        cls.__props__ = baseClass.__props__.slice();
    }

    if (mixins) {
        for (let m = 0; m < mixins.length; ++m) {
            const mixin = mixins[m];
            if (mixin.__props__) {
                cls.__props__ = cls.__props__.concat(mixin.__props__.filter(function (x) {
                    return cls.__props__.indexOf(x) < 0;
                }));
            }
        }
    }

    if (properties) {
        // 预处理属性
        preprocessAttrs(properties, className, cls);

        for (const propName in properties) {
            const val = properties[propName];
            if ('default' in val) {
                defineProp(cls, className, propName, val);
            }
            else {
                defineGetSet(cls, className, propName, val);
            }
        }
    }

    const attrs = attributeUtils.getClassAttrs(cls);
    cls.__values__ = cls.__props__.filter(function (prop) {
        return attrs[prop + DELIMETER + 'serializable'] !== false;
    });
}

export function CCClass<TFunction> (options: {
    name?: string;
    extends: null | (Function & { __props__?: any; _sealed?: boolean });
    ctor: TFunction;
    properties?: any;
    mixins?: (Function & { __props__?: any })[];
    editor?: any;
}) {
    let name = options.name;
    const base = options.extends/* || CCObject*/;
    const mixins = options.mixins;

    // create constructor
    const cls = define(name, base, mixins, options);
    if (!name) {
        name = legacyCC.js.getClassName(cls);
    }

    cls._sealed = true;
    if (base) {
        base._sealed = false;
    }

    // define Properties
    const properties = options.properties;
    if (typeof properties === 'function' ||
        (base && base.__props__ === null) ||
        (mixins && mixins.some(function (x) {
            return x.__props__ === null;
        }))
    ) {
        if (DEV) {
            error('not yet implement deferred properties.');
        }
        else {
            deferredInitializer.push({ cls, props: properties, mixins });
            cls.__props__ = cls.__values__ = null;
        }
    }
    else {
        declareProperties(cls, name, properties, base, options.mixins);
    }

    const editor = options.editor;
    if (editor) {
        if (js.isChildClassOf(base, legacyCC.Component)) {
            legacyCC.Component._registerEditorProps(cls, editor);
        }
        else if (DEV) {
            warnID(3623, name);
        }
    }

    return cls;
}

/**
 * @en
 * Checks whether the constructor is created by `Class`.
 * @zh
 * 检查构造函数是否由 `Class` 创建。
 * @method _isCCClass
 * @param {Function} constructor
 * @return {Boolean}
 * @private
 */
CCClass._isCCClass = function (constructor) {
    return constructor && constructor.hasOwnProperty &&
        constructor.hasOwnProperty('__ctors__');     // is not inherited __ctors__
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
CCClass.fastDefine = function (className, constructor, serializableFields) {
    js.setClassName(className, constructor);
    // constructor.__ctors__ = constructor.__ctors__ || null;
    const props = constructor.__props__ = constructor.__values__ = Object.keys(serializableFields);
    const attrProtos = attributeUtils.getClassAttrsProto(constructor);
    for (let i = 0; i < props.length; i++) {
        const key = props[i];
        attrProtos[key + DELIMETER + 'visible'] = false;
        attrProtos[key + DELIMETER + 'default'] = serializableFields[key];
    }
};
CCClass.Attr = attributeUtils;
CCClass.attr = attributeUtils.attr;

/**
 * Return all super classes.
 * @param constructor The Constructor.
 */
function getInheritanceChain (constructor) {
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

type OnAfterProp = (constructor: Function, mainPropertyName: string) => void;

interface IParsedAttribute {
    type: string;
    _onAfterProp?: OnAfterProp;
    ctor?: Function;
    enumList?: readonly any[];
    bitmaskList?: any[];
}
const tmpAttrs = [];

function parseAttributes (constructor: Function, attributes: IAcceptableAttributes, className: string, propertyName: string, usedInGetter) {
    const ERR_Type = DEV ? 'The %s of %s must be type %s' : '';

    let attrsProto = null;
    let attrsProtoKey = '';
    function getAttrsProto () {
        attrsProtoKey = propertyName + DELIMETER;
        return attrsProto = attributeUtils.getClassAttrsProto(constructor);
    }

    tmpAttrs.length = 0;
    const result: IParsedAttribute[] = tmpAttrs;

    if ('type' in attributes && typeof attributes.type === 'undefined') {
        warnID(3660, propertyName, className);
    }

    const type = attributes.type;
    if (type) {
        const primitiveType = PrimitiveTypes[type];
        if (primitiveType) {
            result.push({
                type,
                _onAfterProp: ((EDITOR && !window.Build) || TEST) && !attributes._short ?
                    attributeUtils.getTypeChecker(primitiveType, 'cc.' + type) :
                    undefined,
            });
        } else if (type === 'Object') {
            if (DEV) {
                errorID(3644, className, propertyName);
            }
        }
        // else if (type === Attr.ScriptUuid) {
        //     result.push({
        //         type: 'Script',
        //         ctor: cc.ScriptAsset,
        //     });
        // }
        else if (typeof type === 'object') {
            if (Enum.isEnum(type)) {
                result.push({
                    type: 'Enum',
                    enumList: Enum.getList(type),
                });
            }
            else if (BitMask.isBitMask(type)) {
                result.push({
                    type: 'BitMask',
                    bitmaskList: BitMask.getList(type),
                });
            }
            else if (DEV) {
                errorID(3645, className, propertyName, type);
            }
        } else if (typeof type === 'function') {
            let typeChecker: OnAfterProp | undefined;
            if (((EDITOR && !window.Build) || TEST) && !attributes._short) {
                typeChecker = attributes.url ?
                    attributeUtils.getTypeChecker('String', 'cc.String') :
                    attributeUtils.getObjTypeChecker(type);
            }
            result.push({
                type: 'Object',
                ctor: type,
                _onAfterProp: typeChecker,
            });
        } else if (DEV) {
            errorID(3646, className, propertyName, type);
        }
    }

    const parseSimpleAttribute = (attributeName: keyof IAcceptableAttributes, expectType: string) => {
        if (attributeName in attributes) {
            const val = attributes[attributeName];
            if (typeof val === expectType) {
                (attrsProto || getAttrsProto())[attrsProtoKey + attributeName] = val;
            } else if (DEV) {
                error(ERR_Type, attributeName, className, propertyName, expectType);
            }
        }
    };

    if (attributes.editorOnly) {
        if (DEV && usedInGetter) {
            errorID(3613, 'editorOnly', name, propertyName);
        }
        else {
            (attrsProto || getAttrsProto())[attrsProtoKey + 'editorOnly'] = true;
        }
    }
    // parseSimpleAttr('preventDeferredLoad', 'boolean');
    if (DEV) {
        parseSimpleAttribute('displayName', 'string');
        parseSimpleAttribute('displayOrder', 'number');
        parseSimpleAttribute('multiline', 'boolean');
        parseSimpleAttribute('radian', 'boolean');
        if (attributes.readonly) {
            (attrsProto || getAttrsProto())[attrsProtoKey + 'readonly'] = true;
        }
        parseSimpleAttribute('tooltip', 'string');
        parseSimpleAttribute('slide', 'boolean');
        parseSimpleAttribute('unit', 'string');
    }

    if (attributes.url) {
        (attrsProto || getAttrsProto())[attrsProtoKey + 'saveUrlAsAsset'] = true;
    }

    if (attributes.__noImplicit) {
        (attrsProto || getAttrsProto())[attrsProtoKey + 'serializable'] = attributes.serializable ?? false;
    } else {
        if (attributes.serializable === false) {
            if (DEV && usedInGetter) {
                errorID(3613, 'serializable', name, propertyName);
            }
            else {
                (attrsProto || getAttrsProto())[attrsProtoKey + 'serializable'] = false;
            }
        }
    }

    parseSimpleAttribute('formerlySerializedAs', 'string');

    if (EDITOR) {
        if ('animatable' in attributes) {
            (attrsProto || getAttrsProto())[attrsProtoKey + 'animatable'] = attributes.animatable;
        }
    }

    if (DEV) {
        if (attributes.__noImplicit) {
            (attrsProto || getAttrsProto())[attrsProtoKey + 'visible'] = attributes.visible ?? false;
        } else {
            const visible = attributes.visible;
            if (typeof visible !== 'undefined') {
                if (!visible) {
                    (attrsProto || getAttrsProto())[attrsProtoKey + 'visible'] = false;
                }
                else if (typeof visible === 'function') {
                    (attrsProto || getAttrsProto())[attrsProtoKey + 'visible'] = visible;
                }
            }
            else {
                const startsWithUS = (propertyName.charCodeAt(0) === 95);
                if (startsWithUS) {
                    (attrsProto || getAttrsProto())[attrsProtoKey + 'visible'] = false;
                }
            }
        }
    }

    const range = attributes.range;
    if (range) {
        if (Array.isArray(range)) {
            if (range.length >= 2) {
                (attrsProto || getAttrsProto())[attrsProtoKey + 'min'] = range[0];
                (attrsProto || getAttrsProto())[attrsProtoKey + 'max'] = range[1];
                if (range.length > 2) {
                    (attrsProto || getAttrsProto())[attrsProtoKey + 'step'] = range[2];
                }
            }
            else if (DEV) {
                errorID(3647);
            }
        }
        else if (DEV) {
            error(ERR_Type, 'range', className, propertyName, 'array');
        }
    }
    parseSimpleAttribute('min', 'number');
    parseSimpleAttribute('max', 'number');
    parseSimpleAttribute('step', 'number');

    return result;
}

CCClass.isArray = function (defaultVal) {
    defaultVal = getDefault(defaultVal);
    return Array.isArray(defaultVal);
};

CCClass.getDefault = getDefault;
CCClass.escapeForJS = escapeForJS;
CCClass.IDENTIFIER_RE = IDENTIFIER_RE;
CCClass.getNewValueTypeCode = (SUPPORT_JIT && getNewValueTypeCodeJit) as ((value: any) => string);

legacyCC.Class = CCClass;
