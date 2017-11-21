/*
 * Copyright (c) 2014-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Prepare JSB environment

var window = window || this;

// Hack JavaScriptCore begin


if (window.scriptEngineType == "JavaScriptCore") {
    window.__jsc_createArrayBufferObject = function(arr) {
        var len = arr.length;
        var buffer = new ArrayBuffer(len);
        var typedArr = new Uint8Array(buffer);
        for (var i = 0; i < len; ++i) {
            typedArr[i] = arr[i];
        }
        return buffer;
    };

    window.__jsc_getArrayBufferData = function(arrBuf) {
        var typedArr = new Uint8Array(arrBuf);
        var len = typedArr.length;
        var arr = new Array(len);
        for (var i = 0; i < len; ++i) {
            arr[i] = typedArr[i];
        }
        return arr;
    };

    window.__jsc_getTypedArrayData = function(typedArr) {
        var length = typedArr.byteLength;
        var offset = typedArr.byteOffset;
        var buf = typedArr.buffer;
        var uint8Arr = new Uint8Array(buf);
        var retArr = new Array(length);
        var arrIndex = 0;
        var bufIndex = offset;
        var bufEnd = offset + length;
        for (; bufIndex < bufEnd; ++bufIndex, ++arrIndex) {
            retArr[arrIndex] = uint8Arr[bufIndex];
        }
        return retArr;
    };

    window.__jscTypedArrayConstructor = Object.getPrototypeOf(Uint16Array.prototype).constructor;
}


// Hack JavaScriptCore end

var cc = cc || {};
/**
 * @namespace jsb
 * @name jsb
 */
var jsb = jsb || {};

/**
 * Common getter setter configuration function
 * @function
 * @param {Object}   proto      A class prototype or an object to config
 * @param {String}   prop       Property name
 * @param {function} getter     Getter function for the property
 * @param {function} setter     Setter function for the property
 */
cc.defineGetterSetter = function (proto, prop, getter, setter){
    var desc = { enumerable: false, configurable: true };
    getter && (desc.get = getter);
    setter && (desc.set = setter);
    Object.defineProperty(proto, prop, desc);
};

/**
 * Create a new object and copy all properties in an exist object to the new object
 * @method clone
 * @param {Object|Array} obj - The source object
 * @return {Array|Object} The created object
 */
cc.clone = function (obj) {
    // Cloning is better if the new object is having the same prototype chain
    // as the copied obj (or otherwise, the cloned object is certainly going to
    // have a different hidden class). Play with C1/C2 of the
    // PerformanceVirtualMachineTests suite to see how this makes an impact
    // under extreme conditions.
    //
    // Object.create(Object.getPrototypeOf(obj)) doesn't work well because the
    // prototype lacks a link to the constructor (Carakan, V8) so the new
    // object wouldn't have the hidden class that's associated with the
    // constructor (also, for whatever reasons, utilizing
    // Object.create(Object.getPrototypeOf(obj)) + Object.defineProperty is even
    // slower than the original in V8). Therefore, we call the constructor, but
    // there is a big caveat - it is possible that the this.init() in the
    // constructor would throw with no argument. It is also possible that a
    // derived class forgets to set "constructor" on the prototype. We ignore
    // these possibities for and the ultimate solution is a standardized
    // Object.clone(<object>).
    var newObj = (obj.constructor) ? new obj.constructor : {};
    
    // Assuming that the constuctor above initialized all properies on obj, the
    // following keyed assignments won't turn newObj into dictionary mode
    // becasue they're not *appending new properties* but *assigning existing
    // ones* (note that appending indexed properties is another story). See
    // CCClass.js for a link to the devils when the assumption fails.
    for (var key in obj) {
        var copy = obj[key];
        // Beware that typeof null == "object" !
        if (typeof copy === "object" &&
            copy &&
            !(copy instanceof _ccsg.Node) &&
            (CC_JSB || !(copy instanceof HTMLElement))) {
            newObj[key] = cc.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};


var ClassManager = {
    id : (0|(Math.random()*998)),

    instanceId : (0|(Math.random()*998)),

    getNewID : function(){
        return this.id++;
    },

    getNewInstanceId : function(){
        return this.instanceId++;
    }
};
//
// 2) Using "extend" subclassing
// Simple JavaScript Inheritance By John Resig http://ejohn.org/
//
cc.Class = function(){};
cc.Class.extend = function (prop) {
    var _super = this.prototype,
        prototype, Class, classId,
        className = prop._className || "",
        name, desc;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    prototype = Object.create(_super);
    initializing = false;
    fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // Copy the properties over onto the new prototype
    for (name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function (name, fn) {
                return function () {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
    }

    Class = function () {
        if (!initializing) {
            this.__instanceId = ClassManager.getNewInstanceId();
            if (this.ctor) {
                switch (arguments.length) {
                    case 0: this.ctor(); break;
                    case 1: this.ctor(arguments[0]); break;
                    case 2: this.ctor(arguments[0], arguments[1]); break;
                    case 3: this.ctor(arguments[0], arguments[1], arguments[2]); break;
                    case 4: this.ctor(arguments[0], arguments[1], arguments[2], arguments[3]); break;
                    case 5: this.ctor(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]); break;
                    default: this.ctor.apply(this, arguments);
                }
            }
        }
    };
    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = cc.Class.extend;

    classId = ClassManager.getNewID();
    ClassManager[classId] = _super;
    desc = { writable: true, enumerable: false, configurable: true };
    Class.id = classId;
    desc.value = classId;
    Object.defineProperty(prototype, '__pid', desc);

    return Class;
};

jsb.__obj_ref_id = 0;

jsb.registerNativeRef = function (owner, target) {
    if (owner && target && owner !== target) {
        var targetID = target.__jsb_ref_id;
        if (targetID === undefined)
            targetID = target.__jsb_ref_id = jsb.__obj_ref_id++;

        var refs = owner.__nativeRefs;
        if (!refs) {
            refs = owner.__nativeRefs = {};
        }

        refs[targetID] = target;
    }
};

jsb.unregisterNativeRef = function (owner, target) {
    if (owner && target && owner !== target) {
        var targetID = target.__jsb_ref_id;
        if (targetID === undefined)
            return;

        var refs = owner.__nativeRefs;
        if (!refs) {
            return;
        }

        delete refs[targetID];
    }
};

jsb.unregisterAllNativeRefs = function (owner) {
    if (!owner) return;
    delete owner.__nativeRefs;
};

jsb.unregisterChildRefsForNode = function (node, recursive) {
    if (!(node instanceof cc.Node)) return;
    recursive = !!recursive;
    var children = node.getChildren(), i, l, child;
    for (i = 0, l = children.length; i < l; ++i) {
        child = children[i];
        jsb.unregisterNativeRef(node, child);
        if (recursive) {
            jsb.unregisterChildRefsForNode(child, recursive);
        }
    }
};
