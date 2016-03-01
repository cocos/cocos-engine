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
    id : (0|(Math.random()*998)),

    instanceId : (0|(Math.random()*998)),

    getNewID : function(){
        return this.id++;
    },

    getNewInstanceId : function(){
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
    var prototype = Object.create(_super);

    var classId = ClassManager.getNewID();
    ClassManager[classId] = _super;
    // Copy the properties over onto the new prototype. We make function
    // properties non-eumerable as this makes typeof === 'function' check
    // unneccessary in the for...in loop used 1) for generating Class()
    // 2) for cc.clone and perhaps more. It is also required to make
    // these function properties cacheable in Carakan.
    var desc = { writable: true, enumerable: false, configurable: true };

    prototype.__instanceId = null;

    // The dummy Class constructor
    function _Class() {
	    this.__instanceId = ClassManager.getNewInstanceId();
	    // All construction is actually done in the init method
	    if (this.ctor)
		    this.ctor.apply(this, arguments);
    }

    _Class.id = classId;
    // desc = { writable: true, enumerable: false, configurable: true,
    //          value: XXX }; Again, we make this non-enumerable.
    desc.value = classId;
    Object.defineProperty(prototype, '__cid__', desc);

    // Populate our constructed prototype object
    _Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    desc.value = _Class;
    Object.defineProperty(_Class.prototype, 'constructor', desc);

    for(var idx = 0, li = arguments.length; idx < li; ++idx) {
        var prop = arguments[idx];
        for (var name in prop) {
            var isFunc = (typeof prop[name] === "function");
            var override = (typeof _super[name] === "function");
            var hasSuperCall = fnTest.test(prop[name]);

            if (isFunc && override && hasSuperCall) {
                desc.value = (function (name, fn) {
                    return function () {
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
                })(name, prop[name]);
                Object.defineProperty(prototype, name, desc);
            } else if (isFunc) {
                desc.value = prop[name];
                Object.defineProperty(prototype, name, desc);
            } else {
                prototype[name] = prop[name];
            }
        }
    }

    // And make this Class extendable
    _Class.extend = Class.extend;

    //add implementation method
    _Class.implement = function (prop) {
        for (var name in prop) {
            prototype[name] = prop[name];
        }
    };
    return _Class;
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
cc.defineGetterSetter = function (proto, prop, getter, setter, getterName, setterName){
    if (proto.__defineGetter__) {
        getter && proto.__defineGetter__(prop, getter);
        setter && proto.__defineSetter__(prop, setter);
    } else if (Object.defineProperty) {
        var desc = { enumerable: false, configurable: true };
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
        if (((typeof copy) === "object") && copy &&
            !(copy instanceof _ccsg.Node) && !(copy instanceof HTMLElement)) {
            newObj[key] = cc.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};

cc._Class = module.exports = Class;