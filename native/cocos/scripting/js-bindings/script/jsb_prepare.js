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
var cc = cc || {};
/**
 * @namespace jsb
 * @name jsb
 */
var jsb = jsb || {};

/**
 * Iterate over an object or an array, executing a function for each matched element.
 * @param {object|array} obj
 * @param {function} iterator
 * @param {object} [context]
 */
cc.each = function (obj, iterator, context) {
    if (!obj)
        return;
    if (obj instanceof Array) {
        for (var i = 0, li = obj.length; i < li; i++) {
            if (iterator.call(context, obj[i], i) === false)
                return;
        }
    } else {
        for (var key in obj) {
            if (iterator.call(context, obj[key], key) === false)
                return;
        }
    }
};

/**
 * Copy all of the properties in source objects to target object and return the target object.
 * @param {object} target
 * @param {object} *sources
 * @returns {object}
 */
cc.extend = function(target) {
    var sources = arguments.length >= 2 ? Array.prototype.slice.call(arguments, 1) : [];

    cc.each(sources, function(src) {
        for(var key in src) {
            if (src.hasOwnProperty(key)) {
                target[key] = src[key];
            }
        }
    });
    return target;
};

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

//
// JSB supports 2 official ways to create subclasses
//
// 1) Google "subclasses" borrowed from closure library
// This is the recommended way to do it
//
cc.inherits = function (childCtor, parentCtor) {
    /** @constructor */
    function tempCtor() {};
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    childCtor.prototype.constructor = childCtor;

    // Copy "static" method, but doesn't generate subclasses.
//  for( var i in parentCtor ) {
//      childCtor[ i ] = parentCtor[ i ];
//  }
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
            this.ctor && this.ctor.apply(this, arguments);
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

jsb.registerNativeRef = function (owner, target) {
    if (owner && target && owner !== target) {
        var refs = owner.__nativeRefs;
        if (!refs) {
            refs = owner.__nativeRefs = [];
        }
        var index = refs.indexOf(target);
        if (index === -1) {
            owner.__nativeRefs.push(target);
        }
    }
};

jsb.unregisterNativeRef = function (owner, target) {
    if (owner && target && owner !== target) {
        var refs = owner.__nativeRefs;
        if (!refs) {
            return;
        }
        var index = refs.indexOf(target);
        if (index !== -1) {
            owner.__nativeRefs.splice(index, 1);
        }
    }
};

jsb.unregisterAllNativeRefs = function (owner) {
    if (!owner) return;
    owner.__nativeRefs.length = 0;
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
