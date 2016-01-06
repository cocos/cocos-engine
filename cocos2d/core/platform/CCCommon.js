/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

var cc = cc || {};
cc._tmp = cc._tmp || {};

/**
 * Function added for JS bindings compatibility. Not needed in cocos2d-html5.
 * @method associateWithNative
 * @param {Object} jsObj subclass
 * @param {Object} superclass
 */
cc.associateWithNative = function (jsObj, superclass) {
};

/**
 * Key map for keyboard event
 * @enum KEY
 * @readonly
 * @type {Object}
 * @example {@link utils/api/engine/docs/cocos2d/core/platform/CCCommon/KEY.js}
 */
cc.KEY = {
    /**
     * @property {Number} none
     * @readonly
     */
    none:0,

    // android
    /**
     * @property {Number} back
     * @readonly
     */
    back:6,
    /**
     * @property {Number} menu
     * @readonly
     */
    menu:18,

    /**
     * @property {Number} backspace
     * @readonly
     */
    backspace:8,
    /**
     * @property {Number} tab
     * @readonly
     */
    tab:9,

    /**
     * @property {Number} enter
     * @readonly
     */
    enter:13,

    /**
     * @property {Number} shift
     * @readonly
     */
    shift:16, //should use shiftkey instead
    /**
     * @property {Number} ctrl
     * @readonly
     */
    ctrl:17, //should use ctrlkey
    /**
     * @property {Number} alt
     * @readonly
     */
    alt:18, //should use altkey
    /**
     * @property {Number} pause
     * @readonly
     */
    pause:19,
    /**
     * @property {Number} capslock
     * @readonly
     */
    capslock:20,
    /**
     * @property {Number} escape
     * @readonly
     */
    escape:27,
    /**
     * @property {Number} space
     * @readonly
     */
    space:32,
    /**
     * @property {Number} pageup
     * @readonly
     */
    pageup:33,
    /**
     * @property {Number} pagedown
     * @readonly
     */
    pagedown:34,
    /**
     * @property {Number} end
     * @readonly
     */
    end:35,
    /**
     * @property {Number} home
     * @readonly
     */
    home:36,
    /**
     * @property {Number} left
     * @readonly
     */
    left:37,
    /**
     * @property {Number} up
     * @readonly
     */
    up:38,
    /**
     * @property {Number} right
     * @readonly
     */
    right:39,
    /**
     * @property {Number} down
     * @readonly
     */
    down:40,
    /**
     * @property {Number} select
     * @readonly
     */
    select:41,

    /**
     * @property {Number} insert
     * @readonly
     */
    insert:45,
    /**
     * @property {Number} Delete
     * @readonly
     */
    Delete:46,
    /**
     * @property {Number} 0
     * @readonly
     */
    0:48,
    /**
     * @property {Number} 1
     * @readonly
     */
    1:49,
    /**
     * @property {Number} 2
     * @readonly
     */
    2:50,
    /**
     * @property {Number} 3
     * @readonly
     */
    3:51,
    /**
     * @property {Number} 4
     * @readonly
     */
    4:52,
    /**
     * @property {Number} 5
     * @readonly
     */
    5:53,
    /**
     * @property {Number} 6
     * @readonly
     */
    6:54,
    /**
     * @property {Number} 7
     * @readonly
     */
    7:55,
    /**
     * @property {Number} 8
     * @readonly
     */
    8:56,
    /**
     * @property {Number} 9
     * @readonly
     */
    9:57,
    /**
     * @property {Number} a
     * @readonly
     */
    a:65,
    /**
     * @property {Number} b
     * @readonly
     */
    b:66,
    /**
     * @property {Number} c
     * @readonly
     */
    c:67,
    /**
     * @property {Number} d
     * @readonly
     */
    d:68,
    /**
     * @property {Number} e
     * @readonly
     */
    e:69,
    /**
     * @property {Number} f
     * @readonly
     */
    f:70,
    /**
     * @property {Number} g
     * @readonly
     */
    g:71,
    /**
     * @property {Number} h
     * @readonly
     */
    h:72,
    /**
     * @property {Number} i
     * @readonly
     */
    i:73,
    /**
     * @property {Number} j
     * @readonly
     */
    j:74,
    /**
     * @property {Number} k
     * @readonly
     */
    k:75,
    /**
     * @property {Number} l
     * @readonly
     */
    l:76,
    /**
     * @property {Number} m
     * @readonly
     */
    m:77,
    /**
     * @property {Number} n
     * @readonly
     */
    n:78,
    /**
     * @property {Number} o
     * @readonly
     */
    o:79,
    /**
     * @property {Number} p
     * @readonly
     */
    p:80,
    /**
     * @property {Number} q
     * @readonly
     */
    q:81,
    /**
     * @property {Number} r
     * @readonly
     */
    r:82,
    /**
     * @property {Number} s
     * @readonly
     */
    s:83,
    /**
     * @property {Number} t
     * @readonly
     */
    t:84,
    /**
     * @property {Number} u
     * @readonly
     */
    u:85,
    /**
     * @property {Number} v
     * @readonly
     */
    v:86,
    /**
     * @property {Number} w
     * @readonly
     */
    w:87,
    /**
     * @property {Number} x
     * @readonly
     */
    x:88,
    /**
     * @property {Number} y
     * @readonly
     */
    y:89,
    /**
     * @property {Number} z
     * @readonly
     */
    z:90,

    /**
     * @property {Number} num0
     * @readonly
     */
    num0:96,
    /**
     * @property {Number} num1
     * @readonly
     */
    num1:97,
    /**
     * @property {Number} num2
     * @readonly
     */
    num2:98,
    /**
     * @property {Number} num3
     * @readonly
     */
    num3:99,
    /**
     * @property {Number} num4
     * @readonly
    num4:100,
    /**
     * @property {Number} num5
     * @readonly
     */
    num5:101,
    /**
     * @property {Number} num6
     * @readonly
     */
    num6:102,
    /**
     * @property {Number} num7
     * @readonly
     */
    num7:103,
    /**
     * @property {Number} num8
     * @readonly
     */
    num8:104,
    /**
     * @property {Number} num9
     * @readonly
     */
    num9:105,
    /**
     * @property {Number} *
     * @readonly
     */
    '*':106,
    /**
     * @property {Number} +
     * @readonly
     */
    '+':107,
    /**
     * @property {Number} -
     * @readonly
     */
    '-':109,
    /**
     * @property {Number} numdel
     * @readonly
     */
    'numdel':110,
    /**
     * @property {Number} /
     * @readonly
     */
    '/':111,
    /**
     * @property {Number} f1
     * @readonly
     */
    f1:112, //f1-f12 dont work on ie
    /**
     * @property {Number} f2
     * @readonly
     */
    f2:113,
    /**
     * @property {Number} f3
     * @readonly
     */
    f3:114,
    /**
     * @property {Number} f4
     * @readonly
     */
    f4:115,
    /**
     * @property {Number} f5
     * @readonly
     */
    f5:116,
    /**
     * @property {Number} f6
     * @readonly
     */
    f6:117,
    /**
     * @property {Number} f7
     * @readonly
     */
    f7:118,
    /**
     * @property {Number} f8
     * @readonly
     */
    f8:119,
    /**
     * @property {Number} f9
     * @readonly
     */
    f9:120,
    /**
     * @property {Number} f10
     * @readonly
     */
    f10:121,
    /**
     * @property {Number} f11
     * @readonly
     */
    f11:122,
    /**
     * @property {Number} f12
     * @readonly
     */
    f12:123,

    /**
     * @property {Number} numlock
     * @readonly
     */
    numlock:144,
    /**
     * @property {Number} scrolllock
     * @readonly
     */
    scrolllock:145,

    /**
     * @property {Number} ;
     * @readonly
     */
    ';':186,
    /**
     * @property {Number} semicolon
     * @readonly
     */
    semicolon:186,
    /**
     * @property {Number} equal
     * @readonly
     */
    equal:187,
    /**
     * @property {Number} =
     * @readonly
     */
    '=':187,
    /**
     * @property {Number} ,
     * @readonly
     */
    ',':188,
    /**
     * @property {Number} comma
     * @readonly
     */
    comma:188,
    /**
     * @property {Number} dash
     * @readonly
     */
    dash:189,
    /**
     * @property {Number} .
     * @readonly
     */
    '.':190,
    /**
     * @property {Number} period
     * @readonly
     */
    period:190,
    /**
     * @property {Number} forwardslash
     * @readonly
     */
    forwardslash:191,
    /**
     * @property {Number} grave
     * @readonly
     */
    grave:192,
    /**
     * @property {Number} [
     * @readonly
     */
    '[':219,
    /**
     * @property {Number} openbracket
     * @readonly
     */
    openbracket:219,
    /**
     * @property {Number} backslash
     * @readonly
     */
    backslash:220,
    /**
     * @property {Number} ]
     * @readonly
     */
    ']':221,
    /**
     * @property {Number} closebracket
     * @readonly
     */
    closebracket:221,
    /**
     * @property {Number} quote
     * @readonly
     */
    quote:222,

    // gamepad controll
    /**
     * @property {Number} dpadLeft
     * @readonly
     */
    dpadLeft:1000,
    /**
     * @property {Number} dpadRight
     * @readonly
     */
    dpadRight:1001,
    /**
     * @property {Number} dpadUp
     * @readonly
     */
    dpadUp:1003,
    /**
     * @property {Number} dpadDown
     * @readonly
     */
    dpadDown:1004,
    /**
     * @property {Number} dpadCenter
     * @readonly
     */
    dpadCenter:1005
};

/**
 * @module cc
 */

/**
 * Image Format:JPG
 * @property {Number} FMT_JPG
 * @readonly
 */
cc.FMT_JPG = 0;

/**
 * Image Format:PNG
 * @property {Number} FMT_PNG
 * @readonly
 */
cc.FMT_PNG = 1;

/**
 * Image Format:TIFF
 * @property {Number} FMT_TIFF
 * @readonly
 */
cc.FMT_TIFF = 2;

/**
 * Image Format:RAWDATA
 * @property {Number} FMT_RAWDATA
 * @readonly
 */
cc.FMT_RAWDATA = 3;

/**
 * Image Format:WEBP
 * @property {Number} FMT_WEBP
 * @readonly
 */
cc.FMT_WEBP = 4;

/**
 * Image Format:UNKNOWN
 * @property {Number} FMT_UNKNOWN
 * @readonly
 */
cc.FMT_UNKNOWN = 5;

/**
 * get image format by image data
 * @method getImageFormatByData
 * @param {Array} imgData
 * @returns {Number}
 */
cc.getImageFormatByData = function (imgData) {
	// if it is a png file buffer.
    if (imgData.length > 8 && imgData[0] === 0x89
        && imgData[1] === 0x50
        && imgData[2] === 0x4E
        && imgData[3] === 0x47
        && imgData[4] === 0x0D
        && imgData[5] === 0x0A
        && imgData[6] === 0x1A
        && imgData[7] === 0x0A) {
        return cc.FMT_PNG;
    }

	// if it is a tiff file buffer.
    if (imgData.length > 2 && ((imgData[0] === 0x49 && imgData[1] === 0x49)
        || (imgData[0] === 0x4d && imgData[1] === 0x4d)
        || (imgData[0] === 0xff && imgData[1] === 0xd8))) {
        return cc.FMT_TIFF;
    }
	return cc.FMT_UNKNOWN;
};

/**
 * Another way to subclass: Using Google Closure.
 * The following code was copied + pasted from goog.base / goog.inherits
 * @method inherits
 * @param {Function} childCtor
 * @param {Function} parentCtor
 */
cc.inherits = function (childCtor, parentCtor) {
    function tempCtor() {}
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    childCtor.prototype.constructor = childCtor;

    // Copy "static" method, but doesn't generate subclasses.
// for( var i in parentCtor ) {
// childCtor[ i ] = parentCtor[ i ];
// }
};

/**
 * @deprecated since v3.0, please use cc._Class.extend and _super
 * @cc._Class.extend
 */
cc.base = function(me, opt_methodName, var_args) {
    var caller = arguments.callee.caller;
    if (caller.superClass_) {
        // This is a constructor. Call the superclass constructor.
        ret = caller.superClass_.constructor.apply( me, Array.prototype.slice.call(arguments, 1));
        return ret;
    }

    var args = Array.prototype.slice.call(arguments, 2);
    var foundCaller = false;
    for (var ctor = me.constructor; ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
        if (ctor.prototype[opt_methodName] === caller) {
            foundCaller = true;
        } else if (foundCaller) {
            return ctor.prototype[opt_methodName].apply(me, args);
        }
    }

    // If we did not find the caller in the prototype chain,
    // then one of two things happened:
    // 1) The caller is an instance method.
    // 2) This method was not called by the right caller.
    if (me[opt_methodName] === caller) {
        return me.constructor.prototype[opt_methodName].apply(me, args);
    } else {
        throw Error(
            'cc.base called from a method of one name ' +
                'to a method of a different name');
    }
};
