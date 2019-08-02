if (typeof CustomEvent === 'undefined') {
    CustomEvent = function () {

    }
}

if (typeof Set === 'undefined') {
    // very simple polyfill
    Set = function () {
        this.values = [];
    };
    Set.prototype.has = function (value) {
        return this.values.indexOf(value) !== -1;
    };
    Set.prototype.add = function (value) {
        this.values.push(value);
    };
}

if (typeof setImmediate === 'undefined') {
    window.setImmediate = function (func) {
        'use strict';
        console.assert(arguments.length <= 1, 'not support params');
        return setTimeout(func, 0);
    };
    window.clearImmediate = function (immediateID) {
        clearTimeout(immediateID);
    };
}

// http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind.html
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        //return function () {};
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        // test this.prototype in case of native functions binding:
        //  - https://gist.github.com/jacomyal/4b7ae101a1cf6b985c60
        if (this.prototype)
            fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

var isPhantomJS = window.navigator.userAgent.indexOf('PhantomJS') !== -1;
if (isPhantomJS) {
    QUnit.config.notrycatch = true;
    window.onerror = function (msg, url, line, column, error) {
        if (error) {
            console.error(error.stack);
        }
        else {
            console.error(msg + '.\n' + url + ':' + line);
        }
    };
    // polyfill
    var video = document.createElement('video');
    video.constructor.prototype.canPlayType = function () { return ''; };

    (function () {
        var MAX_SINGLE_LEN = 110;
        var MAX_TOTAL_LEN = 1000;
        ['log', 'warn', 'error'].forEach(function (method) {
            var originalMethod = console[method];
            console[method] = function () {
                var str = '' + arguments[0];
                if ( !str || str.length <= MAX_SINGLE_LEN ) {
                    originalMethod.apply(console, arguments);
                    return;
                }
                var tooLong = false;
                if (str.length > MAX_TOTAL_LEN) {
                    tooLong = true;
                    str = str.slice(0, MAX_TOTAL_LEN);
                }
                var lines = str.split('\n');
                for (var l = 0; l < lines.length; l++) {
                    var line = lines[l];
                    if (line.length > MAX_SINGLE_LEN) {
                        for (var i = 0; i < line.length; i += MAX_SINGLE_LEN) {
                            originalMethod.call(console, line.substr(i, MAX_SINGLE_LEN));
                        }
                    }
                    else {
                        originalMethod.call(console, line);
                    }
                }
                if (tooLong) {
                    originalMethod.call(console, '...Can not output this too long ' + method);
                }
            };
        });
    })();
}

if (typeof WebGLRenderingContext === 'undefined') {
    window.WebGLRenderingContext = function () {};
}

if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }
    
            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);
        
                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });

    if (!Object.getOwnPropertyDescriptors) {
        Object.defineProperty(Object, 'getOwnPropertyDescriptors', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (target) {
                var res = {};
                var props = Object.getOwnPropertyNames(target);
                for (var i = 0; i < props.length; i++) {
                    var name = props[i];
                    res[name] = Object.getOwnPropertyDescriptor(target, name);
                }
                return res;
            }
        });
    }
}

if (!Object.getOwnPropertyDescriptors) {
    Object.defineProperty(Object, 'getOwnPropertyDescriptors', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            var res = {};
            var props = Object.getOwnPropertyNames(target);
            for (var i = 0; i < props.length; i++) {
                var name = props[i];
                res[name] = Object.getOwnPropertyDescriptor(target, name);
            }
            return res;
        }
    });
}

if (!Object.getOwnPropertySymbols) {
    Object.getOwnPropertySymbols = function () {
        return [];
    };
}

Number.parseFloat = Number.parseFloat || parseFloat;
Number.parseInt = Number.parseInt || parseInt;

Array.from = Array.from || function (obj) {
    var array = new Array(obj.length);
    for (var i = 0; i < obj.length; ++i) {
        array[i] = obj[i];
    }
    return array;
};

Float32Array.name = 'Float32Array';
Uint32Array.name = 'Uint32Array';
Int32Array.name = 'Int32Array';
Uint8Array.name = 'Uint8Array';
