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

// Some helper methods for compile instantiation code

var CCObject = require('./CCObject');
var Destroyed = CCObject.Flags.Destroyed;
var PersistentMask = CCObject.Flags.PersistentMask;
var Attr = require('./attribute');
var JS = require('./js');
var cleanEval = require('../utils/misc').cleanEval;
var CCClass = require('./CCClass');

var SERIALIZABLE = Attr.DELIMETER + 'serializable';
var DEFAULT = Attr.DELIMETER + 'default';
var IDENTIFIER_RE = CCClass.IDENTIFIER_RE;
var escapeForJS = CCClass.escapeForJS;

var VAR = 'var ';
var LOCAL_OBJ = 'o';
var LINE_INDEX_OF_NEW_OBJ = 0;

function Declaration (varName, expression) {
    this.varName = varName;
    this.expression = expression;
}
Declaration.prototype.toString = function () {
    return VAR + this.varName + '=' + this.expression + ';';
};

function mergeDeclaration (statement, expression) {
    if (expression instanceof Declaration) {
        return new Declaration(expression.varName, statement + expression.expression);
    }
    else {
        return statement + expression;
    }
}

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
                return JSON.stringify(def) === JSON.stringify(value);
            }
            catch (e) {
            }
        }
    }
    return false;
}

function flattenCodeArray (array, separator) {
    var strList = [];
    (function deepFlatten (array) {
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (Array.isArray(item)) {
                deepFlatten(item);
            }
            // else if (item instanceof Declaration) {
            //     strList.push(item.toString());
            // }
            else {
                strList.push(item);
            }
        }
    })(array);
    return strList.join(separator);
}

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
        this.codeArray.push(VAR + LOCAL_OBJ + ';',
                           'if(R){',
                                LOCAL_OBJ + '=R;',
                           '}else{',
                                LOCAL_OBJ + '=R=new ' + this.getFuncModule(obj.constructor, true) + '();',
                           '}');
        obj._iN$t = { globalVar: 'R' };
        this.objsToClear_iN$t.push(obj);
        this.enumerateObject(this.codeArray, obj);
    //}

    // generate code
    var globalVariablesDeclaration;
    if (this.globalVariables.length > 0) {
        globalVariablesDeclaration = VAR + this.globalVariables.join(',') + ';';
    }
    var code = flattenCodeArray(['(function(O,F,R){',
                                     globalVariablesDeclaration || [],
                                     this.codeArray,
                                 'return o;})'], CC_DEV ? '\n' : '');

    // generate method and bind with objs
    var createFunction = cleanEval(code);
    this.result = createFunction.bind(null, this.objs, this.funcs);

    if (CC_TEST && !isPhantomJS) {
        console.log(code);
    }

    // cleanup
    for (var i = 0, len = this.objsToClear_iN$t.length; i < len; ++i) {
        this.objsToClear_iN$t[i]._iN$t = null;
    }
    this.objsToClear_iN$t.length = 0;
}

JS.mixin(Parser.prototype, {

    getFuncModule: function (func, usedInNew) {
        var clsName = JS.getClassName(func);
        var clsNameIsModule = clsName.indexOf('.') !== -1;
        if (clsNameIsModule) {
            try {
                // ensure is module
                clsNameIsModule = (func === cleanEval(clsName));
                if (clsNameIsModule) {
                    return clsName;
                }
            }
            catch (e) {}
        }
        var index = this.funcs.indexOf(func);
        if (index < 0) {
            index = this.funcs.length;
            this.funcs.push(func);
        }
        var res = 'F[' + index + ']';
        return usedInNew ? '(' + res + ')' : res;
    },

    getObjRef: function (obj) {
        var index = this.objs.indexOf(obj);
        if (index < 0) {
            index = this.objs.length;
            this.objs.push(obj);
        }
        return 'O[' + index + ']';
    },

    enumerateCCClass: function (codeArray, obj, klass) {
        var props = klass.__props__;
        var attrs = Attr.getClassAttrs(klass);
        for (var p = 0; p < props.length; p++) {
            var key = props[p];
            if (CC_EDITOR && key === '_id') {
                if (obj instanceof cc._BaseNode || obj instanceof cc.Component) {
                    continue;
                }
            }
            if (attrs[key + SERIALIZABLE] !== false) {
                var val = obj[key];
                if (equalsToDefault(attrs[key + DEFAULT], val)) {
                    continue;
                }
                this.writeObjectField(codeArray, obj, key, val);
            }
        }
    },

    instantiateArray: function (value) {
        if (value.length === 0) {
            return '[]';
        }

        var arrayVar = 't' + (++this.localVariableId);
        var declaration = new Declaration(arrayVar, 'new Array(' + value.length + ')');
        var codeArray = [declaration];

        // assign a _iN$t flag to indicate that this object has been parsed.
        value._iN$t = {
            globalVar: '',      // the name of declared global variable used to access this object
            source: codeArray,  // the source code array for this object
        };
        this.objsToClear_iN$t.push(value);

        for (var i = 0; i < value.length; ++i) {
            var statement = arrayVar + '[' + i + ']=';
            this.writeFiled(codeArray, statement, value, i, value[i]);
        }
        return codeArray;
    },

    enumerateField: function (obj, key, value) {
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
            if (key === '_objFlags' && obj instanceof CCObject) {
                value &= PersistentMask;
            }
            return value;
        }
    },

    writeObjectField: function (codeArray, obj, key, value) {
        var statement;
        if (IDENTIFIER_RE.test(key)) {
            statement = LOCAL_OBJ + '.' + key + '=';
        }
        else {
            statement = LOCAL_OBJ + '[' + escapeForJS(key) + ']=';
        }
        this.writeFiled(codeArray, statement, obj, key, value);
    },

    writeFiled: function (codeArray, statement, obj, key, value) {
        var expression = this.enumerateField(obj, key, value);
        if (Array.isArray(expression)) {
            expression[0] = mergeDeclaration(statement, expression[0]);
            codeArray.push(expression);
        }
        else {
            codeArray.push(mergeDeclaration(statement, expression) + ';');
        }
    },

    // codeArray - the source code array for this object
    enumerateObject: function (codeArray, obj) {
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
                this.writeObjectField(codeArray, obj, key, value);
            }
        }
    },

    instantiateObj: function (obj) {
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
        else {
            // do not clone unknown type
            return this.getObjRef(obj);
        }

        var codeArray = [createCode];

        // assign a _iN$t flag to indicate that this object has been parsed.
        obj._iN$t = {
            globalVar: '',      // the name of declared global variable used to access this object
            source: codeArray,  // the source code array for this object
            //propName: '',     // the propName this object defined in its source code,
            //                  // if defined, use LOCAL_OBJ.propName to access the obj, else just use o
        };
        this.objsToClear_iN$t.push(obj);

        this.enumerateObject(codeArray, obj);
        return ['(function(){',
                    codeArray,
                'return o;})();'];
    },
});


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
