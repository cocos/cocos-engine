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

// Some helper methods for compile instantiation code

var CCObject = require('./CCObject');
var Destroyed = CCObject.Flags.Destroyed;
var PersistentMask = CCObject.Flags.PersistentMask;
var Attr = require('./attribute');
var js = require('./js');
var CCClass = require('./CCClass');
var Compiler = require('./compiler');

var DEFAULT = Attr.DELIMETER + 'default';
var IDENTIFIER_RE = CCClass.IDENTIFIER_RE;
var escapeForJS = CCClass.escapeForJS;

const VAR = 'var ';
const LOCAL_OBJ = 'o';
const LOCAL_TEMP_OBJ = 't';
const LOCAL_ARRAY = 'a';
const LINE_INDEX_OF_NEW_OBJ = 0;

const DEFAULT_MODULE_CACHE = {
    'cc.Node': 'cc.Node',
    'cc.Sprite': 'cc.Sprite',
    'cc.Label': 'cc.Label',
    'cc.Button': 'cc.Button',
    'cc.Widget': 'cc.Widget',
    'cc.Animation': 'cc.Animation',
    'cc.ClickEvent': false,
    'cc.PrefabInfo': false
};

!Float32Array.name && (Float32Array.name = 'Float32Array');
!Uint32Array.name && (Uint32Array.name = 'Uint32Array');
!Int32Array.name && (Int32Array.name = 'Int32Array');
!Uint8Array.name && (Uint8Array.name = 'Uint8Array');

// HELPER CLASSES

// ('foo', 'bar')
// -> 'var foo = bar;'
function Declaration (varName, expression) {
    this.varName = varName;
    this.expression = expression;
}
Declaration.prototype.toString = function () {
    return VAR + this.varName + '=' + this.expression + ';';
};

// ('a =', 'var b = x')
// -> 'var b = a = x';
// ('a =', 'x')
// -> 'a = x';
function mergeDeclaration (statement, expression) {
    if (expression instanceof Declaration) {
        return new Declaration(expression.varName, statement + expression.expression);
    }
    else {
        return statement + expression;
    }
}

// ('a', ['var b = x', 'b.foo = bar'])
// -> 'var b = a = x;'
// -> 'b.foo = bar;'
// ('a', 'var b = x')
// -> 'var b = a = x;'
// ('a', 'x')
// -> 'a = x;'
function writeAssignment (codeArray, statement, expression) {
    if (Array.isArray(expression)) {
        expression[0] = mergeDeclaration(statement, expression[0]);
        codeArray.push(expression);
    }
    else {
        codeArray.push(mergeDeclaration(statement, expression) + ';');
    }
}

// ('foo', 'bar')
// -> 'targetExpression.foo = bar'
// ('foo1', 'bar1')
// ('foo2', 'bar2')
// -> 't = targetExpression;'
// -> 't.foo1 = bar1;'
// -> 't.foo2 = bar2;'
function Assignments (targetExpression) {
    this._exps = [];
    this._targetExp = targetExpression;
}
Assignments.prototype.append = function (key, expression) {
    this._exps.push([key, expression]);
};
Assignments.prototype.writeCode = function (codeArray) {
    var targetVar;
    if (this._exps.length > 1) {
        codeArray.push(LOCAL_TEMP_OBJ + '=' + this._targetExp + ';');
        targetVar = LOCAL_TEMP_OBJ;
    }
    else if (this._exps.length === 1) {
        targetVar = this._targetExp;
    }
    else {
        return;
    }
    for (var i = 0; i < this._exps.length; i++) {
        var pair = this._exps[i];
        writeAssignment(codeArray, targetVar + getPropAccessor(pair[0]) + '=', pair[1]);
    }
};

Assignments.pool = new js.Pool(function (obj) {
                                obj._exps.length = 0;
                                obj._targetExp = null;
                            }, 1);
Assignments.pool.get = function (targetExpression) {
    var cache = this._get() || new Assignments();
    cache._targetExp = targetExpression;
    return cache;
};

// HELPER FUNCTIONS

function equalsToDefault (def, value) {
    if (typeof def === 'function') {
        try {
            def = def();
        }
        catch (e) {
            return false;
        }
    }
    if (def === value) {
        return true;
    }
    if (def && value) {
        if (def instanceof cc.ValueType && def.equals(value)) {
            return true;
        }
        if ((Array.isArray(def) && Array.isArray(value)) ||
            (def.constructor === Object && value.constructor === Object)
        ) {
            try {
                return Array.isArray(def) && Array.isArray(value) && def.length === 0 && value.length === 0;
            }
            catch (e) {
            }
        }
    }
    return false;
}

function getPropAccessor (key) {
    return IDENTIFIER_RE.test(key) ? ('.' + key) : ('[' + escapeForJS(key) + ']');
}

//

/*
 * Variables:
 * {Object[]} O - objs list
 * {Function[]} F - constructor list
 * {Node} [R] - specify an instantiated prefabRoot that all references to prefabRoot in prefab will redirect to
 * {Object} o - current creating object
 */

/*
 * @param {Object} obj - the object to parse
 * @param {Node} [parent]
 */
function Parser (obj, parent) {
    this.parent = parent;

    this.objsToClear_iN$t = [];   // used to reset _iN$t variable
    this.codeArray = [];

    // datas for generated code
    this.objs = [];
    this.funcs = [];

    this.funcModuleCache = js.createMap();
    js.mixin(this.funcModuleCache, DEFAULT_MODULE_CACHE);

    // {String[]} - variable names for circular references,
    //              not really global, just local variables shared between sub functions
    this.globalVariables = [];
    // incremental id for new global variables
    this.globalVariableId = 0;
    // incremental id for new local variables
    this.localVariableId = 0;

    // generate codeArray
    //if (Array.isArray(obj)) {
    //    this.codeArray.push(this.instantiateArray(obj));
    //}
    //else {
        this.codeArray.push(VAR + LOCAL_OBJ + ',' + LOCAL_TEMP_OBJ + ';',
                           'if(R){',
                                LOCAL_OBJ + '=R;',
                           '}else{',
                                LOCAL_OBJ + '=R=new ' + this.getFuncModule(obj.constructor, true) + '();',
                           '}');
        js.value(obj, '_iN$t', { globalVar: 'R' }, true);
        this.objsToClear_iN$t.push(obj);
        this.enumerateObject(this.codeArray, obj);
    //}

    // generate code
    var globalVariablesDeclaration;
    if (this.globalVariables.length > 0) {
        globalVariablesDeclaration = VAR + this.globalVariables.join(',') + ';';
    }
    var code = Compiler.flattenCodeArray(['return (function(R){',
                                    globalVariablesDeclaration || [],
                                    this.codeArray,
                                    'return o;',
                                 '})']);

    // generate method and bind with objs
    this.result = Function('O', 'F', code)(this.objs, this.funcs);

    // if (CC_TEST && !isPhantomJS) {
    //     console.log(code);
    // }

    // cleanup
    for (var i = 0, len = this.objsToClear_iN$t.length; i < len; ++i) {
        this.objsToClear_iN$t[i]._iN$t = null;
    }
    this.objsToClear_iN$t.length = 0;
}

var proto = Parser.prototype;

proto.getFuncModule = function (func, usedInNew) {
    var clsName = js.getClassName(func);
    if (clsName) {
        var cache = this.funcModuleCache[clsName];
        if (cache) {
            return cache;
        }
        else if (cache === undefined) {
            var clsNameIsModule = clsName.indexOf('.') !== -1;
            if (clsNameIsModule) {
                try {
                    // ensure is module
                    clsNameIsModule = (func === Function('return ' + clsName)());
                    if (clsNameIsModule) {
                        this.funcModuleCache[clsName] = clsName;
                        return clsName;
                    }
                }
                catch (e) {}
            }
        }
    }
    var index = this.funcs.indexOf(func);
    if (index < 0) {
        index = this.funcs.length;
        this.funcs.push(func);
    }
    var res = 'F[' + index + ']';
    if (usedInNew) {
        res = '(' + res + ')';
    }
    this.funcModuleCache[clsName] = res;
    return res;
};

proto.getObjRef = function (obj) {
    var index = this.objs.indexOf(obj);
    if (index < 0) {
        index = this.objs.length;
        this.objs.push(obj);
    }
    return 'O[' + index + ']';
};

proto.setValueType = function (codeArray, defaultValue, srcValue, targetExpression) {
    var assignments = Assignments.pool.get(targetExpression);
    var fastDefinedProps = defaultValue.constructor.__props__;
    if (!fastDefinedProps) {
        fastDefinedProps = Object.keys(defaultValue);
    }
    for (var i = 0; i < fastDefinedProps.length; i++) {
        var propName = fastDefinedProps[i];
        var prop = srcValue[propName];
        if (defaultValue[propName] === prop) {
            continue;
        }
        var expression = this.enumerateField(srcValue, propName, prop);
        assignments.append(propName, expression);
    }
    assignments.writeCode(codeArray);
    Assignments.pool.put(assignments);
};

proto.enumerateCCClass = function (codeArray, obj, klass) {
    var props = klass.__values__;
    var attrs = Attr.getClassAttrs(klass);
    for (var p = 0; p < props.length; p++) {
        var key = props[p];
        var val = obj[key];
        var defaultValue = attrs[key + DEFAULT];
        if (equalsToDefault(defaultValue, val)) {
            continue;
        }
        if (typeof val === 'object' && val instanceof cc.ValueType) {
            defaultValue = CCClass.getDefault(defaultValue);
            if (defaultValue && defaultValue.constructor === val.constructor) {
                // fast case
                var targetExpression = LOCAL_OBJ + getPropAccessor(key);
                this.setValueType(codeArray, defaultValue, val, targetExpression);
                continue;
            }
        }
        this.setObjProp(codeArray, obj, key, val);
    }
};

proto.instantiateArray = function (value) {
    if (value.length === 0) {
        return '[]';
    }

    var arrayVar = LOCAL_ARRAY + (++this.localVariableId);
    var declaration = new Declaration(arrayVar, 'new Array(' + value.length + ')');
    var codeArray = [declaration];

    // assign a _iN$t flag to indicate that this object has been parsed.
    js.value(value, '_iN$t', {
        globalVar: '',      // the name of declared global variable used to access this object
        source: codeArray,  // the source code array for this object
    }, true);
    this.objsToClear_iN$t.push(value);

    for (var i = 0; i < value.length; ++i) {
        var statement = arrayVar + '[' + i + ']=';
        var expression = this.enumerateField(value, i, value[i]);
        writeAssignment(codeArray, statement, expression);
    }
    return codeArray;
};

proto.instantiateTypedArray = function (value) {
    let type = value.constructor.name;
    if (value.length === 0) {
        return 'new ' + type;
    }

    let arrayVar = LOCAL_ARRAY + (++this.localVariableId);
    let declaration = new Declaration(arrayVar, 'new ' + type + '(' + value.length + ')');
    let codeArray = [declaration];

    // assign a _iN$t flag to indicate that this object has been parsed.
    value._iN$t = {
        globalVar: '',      // the name of declared global variable used to access this object
        source: codeArray,  // the source code array for this object
    };
    this.objsToClear_iN$t.push(value);

    for (var i = 0; i < value.length; ++i) {
        if (value[i] !== 0) {
            var statement = arrayVar + '[' + i + ']=';
            writeAssignment(codeArray, statement, value[i]);
        }
    }
    return codeArray;
};

proto.enumerateField = function (obj, key, value) {
    if (typeof value === 'object' && value) {
        var _iN$t = value._iN$t;
        if (_iN$t) {
            // parsed
            var globalVar = _iN$t.globalVar;
            if (!globalVar) {
                // declare a global var
                globalVar = _iN$t.globalVar = 'v' + (++this.globalVariableId);
                this.globalVariables.push(globalVar);
                // insert assignment statement to assign to global var
                var line = _iN$t.source[LINE_INDEX_OF_NEW_OBJ];
                _iN$t.source[LINE_INDEX_OF_NEW_OBJ] = mergeDeclaration(globalVar + '=', line);
                // if (typeof line ==='string' && line.startsWith(VAR)) {
                //     // var o=xxx -> var o=global=xxx
                //     var LEN_OF_VAR_O = 5;
                //     _iN$t.source[LINE_INDEX_OF_NEW_OBJ] = line.slice(0, LEN_OF_VAR_O) + '=' + globalVar + line.slice(LEN_OF_VAR_O);
                // }
            }
            return globalVar;
        }
        else if (ArrayBuffer.isView(value)) {
            return this.instantiateTypedArray(value);
        }
        else if (Array.isArray(value)) {
            return this.instantiateArray(value);
        }
        else {
            return this.instantiateObj(value);
        }
    }
    else if (typeof value === 'function') {
        return this.getFuncModule(value);
    }
    else if (typeof value === 'string') {
        return escapeForJS(value);
    }
    else {
        if (key === '_objFlags' && (obj instanceof CCObject)) {
            value &= PersistentMask;
        }
        return value;
    }
};

proto.setObjProp = function (codeArray, obj, key, value) {
    var statement = LOCAL_OBJ + getPropAccessor(key) + '=';
    var expression = this.enumerateField(obj, key, value);
    writeAssignment(codeArray, statement, expression);
};

// codeArray - the source code array for this object
proto.enumerateObject = function (codeArray, obj) {
    var klass = obj.constructor;
    if (cc.Class._isCCClass(klass)) {
        this.enumerateCCClass(codeArray, obj, klass);
    }
    else {
        // primitive javascript object
        for (var key in obj) {
            if (!obj.hasOwnProperty(key) ||
                (key.charCodeAt(0) === 95 && key.charCodeAt(1) === 95 &&   // starts with "__"
                 key !== '__type__')
            ) {
                continue;
            }
            var value = obj[key];
            if (typeof value === 'object' && value && value === obj._iN$t) {
                continue;
            }
            this.setObjProp(codeArray, obj, key, value);
        }
    }
};

proto.instantiateObj = function (obj) {
    if (obj instanceof cc.ValueType) {
        return CCClass.getNewValueTypeCode(obj);
    }
    if (obj instanceof cc.Asset) {
        // register to asset list and just return the reference.
        return this.getObjRef(obj);
    }
    if (obj._objFlags & Destroyed) {
        // the same as cc.isValid(obj)
        return null;
    }

    var createCode;
    var ctor = obj.constructor;
    if (cc.Class._isCCClass(ctor)) {
        if (this.parent) {
            if (this.parent instanceof cc.Component) {
                if (obj instanceof cc._BaseNode || obj instanceof cc.Component) {
                    return this.getObjRef(obj);
                }
            }
            else if (this.parent instanceof cc._BaseNode) {
                if (obj instanceof cc._BaseNode) {
                    if (!obj.isChildOf(this.parent)) {
                        // should not clone other nodes if not descendant
                        return this.getObjRef(obj);
                    }
                }
                else if (obj instanceof cc.Component) {
                    if (!obj.node.isChildOf(this.parent)) {
                        // should not clone other component if not descendant
                        return this.getObjRef(obj);
                    }
                }
            }
        }
        createCode = new Declaration(LOCAL_OBJ, 'new ' + this.getFuncModule(ctor, true) + '()');
    }
    else if (ctor === Object) {
        createCode = new Declaration(LOCAL_OBJ, '{}');
    }
    else if (!ctor) {
        createCode = new Declaration(LOCAL_OBJ, 'Object.create(null)');
    }
    else {
        // do not clone unknown type
        return this.getObjRef(obj);
    }

    var codeArray = [createCode];

    // assign a _iN$t flag to indicate that this object has been parsed.
    js.value(obj, '_iN$t', {
        globalVar: '',      // the name of declared global variable used to access this object
        source: codeArray,  // the source code array for this object
        //propName: '',     // the propName this object defined in its source code,
        //                  // if defined, use LOCAL_OBJ.propName to access the obj, else just use o
    }, true);
    this.objsToClear_iN$t.push(obj);

    this.enumerateObject(codeArray, obj);
    return ['(function(){',
                codeArray,
            'return o;})();'];
};


function compile (node) {
    var root = (node instanceof cc._BaseNode) && node;
    var parser = new Parser(node, root);
    return parser.result;
}

module.exports = {
    compile: compile,
    equalsToDefault: equalsToDefault
};

if (CC_TEST) {
    cc._Test.IntantiateJit = module.exports;
}
