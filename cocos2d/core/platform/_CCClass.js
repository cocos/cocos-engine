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

/**
 * ClassManager
 */
var ClassManager = cc.ClassManager = {
    instanceId: (0 | (Math.random() * 998)),
    getNewInstanceId: function () {
        return this.instanceId++;
    }
};

/* Managed JavaScript Inheritance
 * Based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance/
 * MIT Licensed.
 */
var fnTest = /\b_super\b/;

/**
 * The base Class implementation (does nothing)
 * @class Class
 * @private
 */
var Class = function () {
};

/**
 * Create a new Class that inherits from this Class
 * @static
 * @param {Object} props
 * @return {Function}
 */
Class.extend = function (props) {
    var _super = this.prototype;

    // Instantiate a base Class (but only create the instance,
    // don't run the init constructor)
    var proto = Object.create(_super);

    // Copy the properties over onto the new prototype. We make function
    // properties non-eumerable as this makes typeof === 'function' check
    // unnecessary in the for...in loop used 1) for generating Class()
    // 2) for cc.clone and perhaps more. It is also required to make
    // these function properties cacheable in Carakan.
    var desc = { writable: true, enumerable: false, configurable: true };

    // The dummy Class constructor
    var TheClass;
    if (cc.game && cc.game.config && cc.game.config[cc.game.CONFIG_KEY.exposeClassName]) {
        var ctor =
            "return (function " + (props._className || "Class") + "(arg0,arg1,arg2,arg3,arg4) {\n" +
                "this.__instanceId = cc.ClassManager.getNewInstanceId();\n" +
                "if (this.ctor) {\n" +
                    "switch (arguments.length) {\n" +
                        "case 0: this.ctor(); break;\n" +
                        "case 1: this.ctor(arg0); break;\n" +
                        "case 2: this.ctor(arg0,arg1); break;\n" +
                        "case 3: this.ctor(arg0,arg1,arg2); break;\n" +
                        "case 4: this.ctor(arg0,arg1,arg2,arg3); break;\n" +
                        "case 5: this.ctor(arg0,arg1,arg2,arg3,arg4); break;\n" +
                        "default: this.ctor.apply(this, arguments);\n" +
                    "}\n" +
                "}\n" +
            "});";
        TheClass = Function(ctor)();
    }
    else {
        TheClass = CC_JSB ? function (...args) {
            this.__instanceId = ClassManager.getNewInstanceId();
            if (this.ctor) {
                switch (args.length) {
                    case 0: this.ctor(); break;
                    case 1: this.ctor(args[0]); break;
                    case 2: this.ctor(args[0], args[1]); break;
                    case 3: this.ctor(args[0], args[1], args[2]); break;
                    case 4: this.ctor(args[0], args[1], args[2], args[3]); break;
                    case 5: this.ctor(args[0], args[1], args[2], args[3], args[4]); break;
                    default: this.ctor.apply(this, args);
                }
            }
        } : function (arg0, arg1, arg2, arg3, arg4) {
            this.__instanceId = ClassManager.getNewInstanceId();
            if (this.ctor) {
                switch (arguments.length) {
                    case 0: this.ctor(); break;
                    case 1: this.ctor(arg0); break;
                    case 2: this.ctor(arg0, arg1); break;
                    case 3: this.ctor(arg0, arg1, arg2); break;
                    case 4: this.ctor(arg0, arg1, arg2, arg3); break;
                    case 5: this.ctor(arg0, arg1, arg2, arg3, arg4); break;
                    default: this.ctor.apply(this, arguments);
                }
            }
        };
    }

    // Populate our constructed prototype object
    TheClass.prototype = proto;

    // Enforce the constructor to be what we expect
    desc.value = TheClass;
    Object.defineProperty(proto, 'constructor', desc);

    for (var name in props) {
        var isFunc = (typeof props[name] === "function");
        var override = isFunc && (typeof _super[name] === "function");
        var hasSuperCall = override && fnTest.test(props[name]);
        
        if (hasSuperCall) {
            desc.value = (function (name, fn) {
                return CC_JSB ? function (...args) {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, args);
                    this._super = tmp;
                    return ret;
                } : function () {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-Class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, props[name]);
            Object.defineProperty(proto, name, desc);
        } else if (isFunc) {
            desc.value = props[name];
            Object.defineProperty(proto, name, desc);
        } else {
            proto[name] = props[name];
        }
    }

    // And make this Class extendable
    TheClass.extend = Class.extend;

    //add implementation method
    TheClass.implement = function (prop) {
        for (var name in prop) {
            proto[name] = prop[name];
        }
    };
    return TheClass;
};

/**
 * Common getter setter configuration function
 * @method defineGetterSetter
 * @param {Object}   proto      - A class prototype or an object to config<br/>
 * @param {String}   prop       - Property name
 * @param {Function} getter     - Getter function for the property
 * @param {Function} setter     - Setter function for the property
 * @param {String}   getterName - Name of getter function for the property
 * @param {String}   setterName - Name of setter function for the property
 */
cc.defineGetterSetter = function (proto, prop, getter, setter, getterName, setterName) {
    if (proto.__defineGetter__) {
        getter && proto.__defineGetter__(prop, getter);
        setter && proto.__defineSetter__(prop, setter);
    } else if (Object.defineProperty) {
        var desc = { configurable: true };     // enumerable is false by default
        getter && (desc.get = getter);
        setter && (desc.set = setter);
        Object.defineProperty(proto, prop, desc);
    } else {
        throw new Error("browser does not support getters");
    }
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

cc._Class = module.exports = Class;
