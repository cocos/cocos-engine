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

require('./_CCClass');

cc._tmp = cc._tmp || {};

/**
 * Key map for keyboard event
 * @enum KEY
 * @readonly
 * @type {Object}
 * @example {@link utils/api/engine/docs/cocos2d/core/platform/CCCommon/KEY.js}
 */
cc.KEY = {
    /**
     * @property none
     * @type {Number}
     * @readonly
     */
    none:0,

    // android
    /**
     * @property back
     * @type {Number}
     * @readonly
     */
    back:6,
    /**
     * @property menu
     * @type {Number}
     * @readonly
     */
    menu:18,

    /**
     * @property backspace
     * @type {Number}
     * @readonly
     */
    backspace:8,
    /**
     * @property tab
     * @type {Number}
     * @readonly
     */
    tab:9,

    /**
     * @property enter
     * @type {Number}
     * @readonly
     */
    enter:13,

    /**
     * @property shift
     * @type {Number}
     * @readonly
     */
    shift:16, //should use shiftkey instead
    /**
     * @property ctrl
     * @type {Number}
     * @readonly
     */
    ctrl:17, //should use ctrlkey
    /**
     * @property alt
     * @type {Number}
     * @readonly
     */
    alt:18, //should use altkey
    /**
     * @property pause
     * @type {Number}
     * @readonly
     */
    pause:19,
    /**
     * @property capslock
     * @type {Number}
     * @readonly
     */
    capslock:20,
    /**
     * @property escape
     * @type {Number}
     * @readonly
     */
    escape:27,
    /**
     * @property space
     * @type {Number}
     * @readonly
     */
    space:32,
    /**
     * @property pageup
     * @type {Number}
     * @readonly
     */
    pageup:33,
    /**
     * @property pagedown
     * @type {Number}
     * @readonly
     */
    pagedown:34,
    /**
     * @property end
     * @type {Number}
     * @readonly
     */
    end:35,
    /**
     * @property home
     * @type {Number}
     * @readonly
     */
    home:36,
    /**
     * @property left
     * @type {Number}
     * @readonly
     */
    left:37,
    /**
     * @property up
     * @type {Number}
     * @readonly
     */
    up:38,
    /**
     * @property right
     * @type {Number}
     * @readonly
     */
    right:39,
    /**
     * @property down
     * @type {Number}
     * @readonly
     */
    down:40,
    /**
     * @property select
     * @type {Number}
     * @readonly
     */
    select:41,

    /**
     * @property insert
     * @type {Number}
     * @readonly
     */
    insert:45,
    /**
     * @property Delete
     * @type {Number}
     * @readonly
     */
    Delete:46,
    /**
     * @property 0
     * @type {Number}
     * @readonly
     */
    0:48,
    /**
     * @property 1
     * @type {Number}
     * @readonly
     */
    1:49,
    /**
     * @property 2
     * @type {Number}
     * @readonly
     */
    2:50,
    /**
     * @property 3
     * @type {Number}
     * @readonly
     */
    3:51,
    /**
     * @property 4
     * @type {Number}
     * @readonly
     */
    4:52,
    /**
     * @property 5
     * @type {Number}
     * @readonly
     */
    5:53,
    /**
     * @property 6
     * @type {Number}
     * @readonly
     */
    6:54,
    /**
     * @property 7
     * @type {Number}
     * @readonly
     */
    7:55,
    /**
     * @property 8
     * @type {Number}
     * @readonly
     */
    8:56,
    /**
     * @property 9
     * @type {Number}
     * @readonly
     */
    9:57,
    /**
     * @property a
     * @type {Number}
     * @readonly
     */
    a:65,
    /**
     * @property b
     * @type {Number}
     * @readonly
     */
    b:66,
    /**
     * @property c
     * @type {Number}
     * @readonly
     */
    c:67,
    /**
     * @property d
     * @type {Number}
     * @readonly
     */
    d:68,
    /**
     * @property e
     * @type {Number}
     * @readonly
     */
    e:69,
    /**
     * @property f
     * @type {Number}
     * @readonly
     */
    f:70,
    /**
     * @property g
     * @type {Number}
     * @readonly
     */
    g:71,
    /**
     * @property h
     * @type {Number}
     * @readonly
     */
    h:72,
    /**
     * @property i
     * @type {Number}
     * @readonly
     */
    i:73,
    /**
     * @property j
     * @type {Number}
     * @readonly
     */
    j:74,
    /**
     * @property k
     * @type {Number}
     * @readonly
     */
    k:75,
    /**
     * @property l
     * @type {Number}
     * @readonly
     */
    l:76,
    /**
     * @property m
     * @type {Number}
     * @readonly
     */
    m:77,
    /**
     * @property n
     * @type {Number}
     * @readonly
     */
    n:78,
    /**
     * @property o
     * @type {Number}
     * @readonly
     */
    o:79,
    /**
     * @property p
     * @type {Number}
     * @readonly
     */
    p:80,
    /**
     * @property q
     * @type {Number}
     * @readonly
     */
    q:81,
    /**
     * @property r
     * @type {Number}
     * @readonly
     */
    r:82,
    /**
     * @property s
     * @type {Number}
     * @readonly
     */
    s:83,
    /**
     * @property t
     * @type {Number}
     * @readonly
     */
    t:84,
    /**
     * @property u
     * @type {Number}
     * @readonly
     */
    u:85,
    /**
     * @property v
     * @type {Number}
     * @readonly
     */
    v:86,
    /**
     * @property w
     * @type {Number}
     * @readonly
     */
    w:87,
    /**
     * @property x
     * @type {Number}
     * @readonly
     */
    x:88,
    /**
     * @property y
     * @type {Number}
     * @readonly
     */
    y:89,
    /**
     * @property z
     * @type {Number}
     * @readonly
     */
    z:90,

    /**
     * @property num0
     * @type {Number}
     * @readonly
     */
    num0:96,
    /**
     * @property num1
     * @type {Number}
     * @readonly
     */
    num1:97,
    /**
     * @property num2
     * @type {Number}
     * @readonly
     */
    num2:98,
    /**
     * @property num3
     * @type {Number}
     * @readonly
     */
    num3:99,
    /**
     * @property num4
     * @type {Number}
     * @readonly
     */
    num4:100,
    /**
     * @property num5
     * @type {Number}
     * @readonly
     */
    num5:101,
    /**
     * @property num6
     * @type {Number}
     * @readonly
     */
    num6:102,
    /**
     * @property num7
     * @type {Number}
     * @readonly
     */
    num7:103,
    /**
     * @property num8
     * @type {Number}
     * @readonly
     */
    num8:104,
    /**
     * @property num9
     * @type {Number}
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
     * @property numdel
     * @type {Number}
     * @readonly
     */
    'numdel':110,
    /**
     * @property {Number} /
     * @readonly
     */
    '/':111,
    /**
     * @property f1
     * @type {Number}
     * @readonly
     */
    f1:112, //f1-f12 dont work on ie
    /**
     * @property f2
     * @type {Number}
     * @readonly
     */
    f2:113,
    /**
     * @property f3
     * @type {Number}
     * @readonly
     */
    f3:114,
    /**
     * @property f4
     * @type {Number}
     * @readonly
     */
    f4:115,
    /**
     * @property f5
     * @type {Number}
     * @readonly
     */
    f5:116,
    /**
     * @property f6
     * @type {Number}
     * @readonly
     */
    f6:117,
    /**
     * @property f7
     * @type {Number}
     * @readonly
     */
    f7:118,
    /**
     * @property f8
     * @type {Number}
     * @readonly
     */
    f8:119,
    /**
     * @property f9
     * @type {Number}
     * @readonly
     */
    f9:120,
    /**
     * @property f10
     * @type {Number}
     * @readonly
     */
    f10:121,
    /**
     * @property f11
     * @type {Number}
     * @readonly
     */
    f11:122,
    /**
     * @property f12
     * @type {Number}
     * @readonly
     */
    f12:123,

    /**
     * @property numlock
     * @type {Number}
     * @readonly
     */
    numlock:144,
    /**
     * @property scrolllock
     * @type {Number}
     * @readonly
     */
    scrolllock:145,

    /**
     * @property {Number} ;
     * @readonly
     */
    ';':186,
    /**
     * @property semicolon
     * @type {Number}
     * @readonly
     */
    semicolon:186,
    /**
     * @property equal
     * @type {Number}
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
     * @property comma
     * @type {Number}
     * @readonly
     */
    comma:188,
    /**
     * @property dash
     * @type {Number}
     * @readonly
     */
    dash:189,
    /**
     * @property {Number} .
     * @readonly
     */
    '.':190,
    /**
     * @property period
     * @type {Number}
     * @readonly
     */
    period:190,
    /**
     * @property forwardslash
     * @type {Number}
     * @readonly
     */
    forwardslash:191,
    /**
     * @property grave
     * @type {Number}
     * @readonly
     */
    grave:192,
    /**
     * @property {Number} [
     * @readonly
     */
    '[':219,
    /**
     * @property openbracket
     * @type {Number}
     * @readonly
     */
    openbracket:219,
    /**
     * @property backslash
     * @type {Number}
     * @readonly
     */
    backslash:220,
    /**
     * @property {Number} ]
     * @readonly
     */
    ']':221,
    /**
     * @property closebracket
     * @type {Number}
     * @readonly
     */
    closebracket:221,
    /**
     * @property quote
     * @type {Number}
     * @readonly
     */
    quote:222,

    // gamepad controll
    /**
     * @property dpadLeft
     * @type {Number}
     * @readonly
     */
    dpadLeft:1000,
    /**
     * @property dpadRight
     * @type {Number}
     * @readonly
     */
    dpadRight:1001,
    /**
     * @property dpadUp
     * @type {Number}
     * @readonly
     */
    dpadUp:1003,
    /**
     * @property dpadDown
     * @type {Number}
     * @readonly
     */
    dpadDown:1004,
    /**
     * @property dpadCenter
     * @type {Number}
     * @readonly
     */
    dpadCenter:1005
};

/**
 * @module cc
 */

/**
 * Image formats
 * @enum ImageFormat
 * @static
 * @namespace cc
 */
cc.ImageFormat = cc.Enum({
    /**
     * Image Format:JPG
     * @property JPG
     * @type {Number}
     * @static
     */
    JPG: 0,
    /**
     * Image Format:PNG
     * @property PNG
     * @type {Number}
     * @static
     */
    PNG: 1,
    /**
     * Image Format:TIFF
     * @property TIFF
     * @type {Number}
     * @static
     */
    TIFF: 2,
    /**
     * Image Format:WEBP
     * @property WEBP
     * @type {Number}
     * @static
     */
    WEBP: 3,
    /**
     * Image Format:PVR
     * @property PVR
     * @type {Number}
     * @static
     */
    PVR: 4,
    /**
     * Image Format:ETC
     * @property ETC
     * @type {Number}
     * @static
     */
    ETC: 5,
    /**
     * Image Format:S3TC
     * @property S3TC
     * @type {Number}
     * @static
     */
    S3TC: 6,
    /**
     * Image Format:ATITC
     * @property ATITC
     * @type {Number}
     * @static
     */
    ATITC: 7,
    /**
     * Image Format:TGA
     * @property TGA
     * @type {Number}
     * @static
     */
    TGA: 8,
    /**
     * Image Format:RAWDATA
     * @property RAWDATA
     * @type {Number}
     * @static
     */
    RAWDATA: 9,
    /**
     * Image Format:UNKNOWN
     * @property UNKNOWN
     * @type {Number}
     * @static
     */
    UNKNOWN: 10
});

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
        return cc.ImageFormat.PNG;
    }

    // if it is a tiff file buffer.
    if (imgData.length > 2 && ((imgData[0] === 0x49 && imgData[1] === 0x49)
        || (imgData[0] === 0x4d && imgData[1] === 0x4d)
        || (imgData[0] === 0xff && imgData[1] === 0xd8))) {
        return cc.ImageFormat.TIFF;
    }
    return cc.ImageFormat.UNKNOWN;
};

/**
 * Predefined constants
 * @enum Macro
 * @static
 * @type {Object}
 * @namespace cc
 */
cc.macro = {
    /**
     * @property INVALID_INDEX
     * @type {Number}
     * @readonly
     */
    INVALID_INDEX: -1,

    /**
     * Default Node tag
     * @property NODE_TAG_INVALID
     * @type {Number}
     * @readonly
     */
    NODE_TAG_INVALID: -1,

    /**
     * PI is the ratio of a circle's circumference to its diameter.
     * @property PI
     * @type {Number}
     * @readonly
     */
    PI: Math.PI,

    /**
     * PI * 2
     * @property PI2
     * @type {Number}
     * @readonly
     */
    PI2: Math.PI * 2,

    /**
     * Maximum float value
     * @property FLT_MAX
     * @type {Number}
     * @readonly
     */
    FLT_MAX: parseFloat('3.402823466e+38F'),

    /**
     * Minimum float value
     * @property FLT_MIN
     * @type {Number}
     * @readonly
     */
    FLT_MIN: parseFloat("1.175494351e-38F"),

    /**
     * PI / 180
     * @property RAD
     * @type {Number}
     * @readonly
     */
    RAD: Math.PI / 180,

    /**
     * One degree
     * @property DEG
     * @type {Number}
     * @readonly
     */
    DEG: 180 / Math.PI,

    /**
     * Maximum unsigned int value
     * @property UINT_MAX
     * @type {Number}
     * @readonly
     */
    UINT_MAX: 0xffffffff,

    /**
     * @property REPEAT_FOREVER
     * @type {Number}
     * @readonly
     */
    REPEAT_FOREVER: CC_JSB ? 0xffffffff : (Number.MAX_VALUE - 1),

    /**
     * @property FLT_EPSILON
     * @type {Number}
     * @readonly
     */
    FLT_EPSILON: 0.0000001192092896,

    //some gl constant variable
    /**
     * @property ONE
     * @type {Number}
     * @readonly
     */
    ONE: 1,

    /**
     * @property ZERO
     * @type {Number}
     * @readonly
     */
    ZERO: 0,

    /**
     * @property SRC_ALPHA
     * @type {Number}
     * @readonly
     */
    SRC_ALPHA: 0x0302,

    /**
     * @property SRC_ALPHA_SATURATE
     * @type {Number}
     * @readonly
     */
    SRC_ALPHA_SATURATE: 0x308,

    /**
     * @property SRC_COLOR
     * @type {Number}
     * @readonly
     */
    SRC_COLOR: 0x300,

    /**
     * @property DST_ALPHA
     * @type {Number}
     * @readonly
     */
    DST_ALPHA: 0x304,

    /**
     * @property DST_COLOR
     * @type {Number}
     * @readonly
     */
    DST_COLOR: 0x306,

    /**
     * @property ONE_MINUS_SRC_ALPHA
     * @type {Number}
     * @readonly
     */
    ONE_MINUS_SRC_ALPHA: 0x0303,

    /**
     * @property ONE_MINUS_SRC_COLOR
     * @type {Number}
     * @readonly
     */
    ONE_MINUS_SRC_COLOR: 0x301,

    /**
     * @property ONE_MINUS_DST_ALPHA
     * @type {Number}
     * @readonly
     */
    ONE_MINUS_DST_ALPHA: 0x305,

    /**
     * @property ONE_MINUS_DST_COLOR
     * @type {Number}
     * @readonly
     */
    ONE_MINUS_DST_COLOR: 0x0307,

    /**
     * @property ONE_MINUS_CONSTANT_ALPHA
     * @type {Number}
     * @readonly
     */
    ONE_MINUS_CONSTANT_ALPHA: 0x8004,

    /**
     * @property ONE_MINUS_CONSTANT_COLOR
     * @type {Number}
     * @readonly
     */
    ONE_MINUS_CONSTANT_COLOR: 0x8002,

    /**
     * the constant variable equals gl.LINEAR for texture
     * @property LINEAR
     * @type {Number}
     * @readonly
     */
    LINEAR: 0x2601,

    /**
     * default gl blend dst function. Compatible with premultiplied alpha images.
     * @property BLEND_DST
     * @type {Number}
     * @readonly
     */
    BLEND_DST: 0x0303,


    //Possible device orientations

    /**
     * Device oriented vertically, home button on the bottom (UIDeviceOrientationPortrait)
     * @property WEB_ORIENTATION_PORTRAIT
     * @type {Number}
     * @readonly
     */
    WEB_ORIENTATION_PORTRAIT: 0,

    /**
     * Device oriented horizontally, home button on the right (UIDeviceOrientationLandscapeLeft)
     * @property WEB_ORIENTATION_LANDSCAPE_LEFT
     * @type {Number}
     * @readonly
     */
    WEB_ORIENTATION_LANDSCAPE_LEFT: -90,

    /**
     * Device oriented vertically, home button on the top (UIDeviceOrientationPortraitUpsideDown)
     * @property WEB_ORIENTATION_PORTRAIT_UPSIDE_DOWN
     * @type {Number}
     * @readonly
     */
    WEB_ORIENTATION_PORTRAIT_UPSIDE_DOWN: 180,

    /**
     * Device oriented horizontally, home button on the left (UIDeviceOrientationLandscapeRight)
     * @property WEB_ORIENTATION_LANDSCAPE_RIGHT
     * @type {Number}
     * @readonly
     */
    WEB_ORIENTATION_LANDSCAPE_RIGHT: 90,

    /**
     * Oriented vertically
     * @property ORIENTATION_PORTRAIT
     * @type {Number}
     * @readonly
     */
    ORIENTATION_PORTRAIT: 1,

    /**
     * Oriented horizontally
     * @property ORIENTATION_LANDSCAPE
     * @type {Number}
     * @readonly
     */
    ORIENTATION_LANDSCAPE: 2,

    /**
     * Oriented automatically
     * @property ORIENTATION_AUTO
     * @type {Number}
     * @readonly
     */
    ORIENTATION_AUTO: 3,


    DENSITYDPI_DEVICE: 'device-dpi',
    DENSITYDPI_HIGH: 'high-dpi',
    DENSITYDPI_MEDIUM: 'medium-dpi',
    DENSITYDPI_LOW: 'low-dpi',


    // ------------------- vertex attrib flags -----------------------------
    /**
     * @property VERTEX_ATTRIB_FLAG_NONE
     * @type {Number}
     * @readonly
     */
    VERTEX_ATTRIB_FLAG_NONE: 0,
    /**
     * @property VERTEX_ATTRIB_FLAG_POSITION
     * @type {Number}
     * @readonly
     */
    VERTEX_ATTRIB_FLAG_POSITION: 1 << 0,
    /**
     * @property VERTEX_ATTRIB_FLAG_COLOR
     * @type {Number}
     * @readonly
     */
    VERTEX_ATTRIB_FLAG_COLOR: 1 << 1,
    /**
     * @property VERTEX_ATTRIB_FLAG_TEX_COORDS
     * @type {Number}
     * @readonly
     */
    VERTEX_ATTRIB_FLAG_TEX_COORDS: 1 << 2,
    /**
     * @property VERTEX_ATTRIB_FLAG_POS_COLOR_TEX
     * @type {Number}
     * @readonly
     */
    VERTEX_ATTRIB_FLAG_POS_COLOR_TEX: ( (1 << 0) | (1 << 1) | (1 << 2) ),

    /**
     * GL server side states
     * @property GL_ALL
     * @type {Number}
     * @readonly
     */
    GL_ALL: 0,

    //-------------Vertex Attributes-----------
    /**
     * @property VERTEX_ATTRIB_POSITION
     * @type {Number}
     * @readonly
     */
    VERTEX_ATTRIB_POSITION: 0,
    /**
     * @property VERTEX_ATTRIB_COLOR
     * @type {Number}
     * @readonly
     */
    VERTEX_ATTRIB_COLOR: 1,
    /**
     * @property VERTEX_ATTRIB_TEX_COORDS
     * @type {Number}
     * @readonly
     */
    VERTEX_ATTRIB_TEX_COORDS: 2,
    /**
     * @property VERTEX_ATTRIB_MAX
     * @type {Number}
     * @readonly
     */
    VERTEX_ATTRIB_MAX: 3,

    //------------Uniforms------------------
    /**
     * @property UNIFORM_PMATRIX
     * @type {Number}
     * @readonly
     */
    UNIFORM_PMATRIX: 0,
    /**
     * @property UNIFORM_MVMATRIX
     * @type {Number}
     * @readonly
     */
    UNIFORM_MVMATRIX: 1,
    /**
     * @property UNIFORM_MVPMATRIX
     * @type {Number}
     * @readonly
     */
    UNIFORM_MVPMATRIX: 2,
    /**
     * @property UNIFORM_TIME
     * @type {Number}
     * @readonly
     */
    UNIFORM_TIME: 3,
    /**
     * @property UNIFORM_SINTIME
     * @type {Number}
     * @readonly
     */
    UNIFORM_SINTIME: 4,
    /**
     * @property UNIFORM_COSTIME
     * @type {Number}
     * @readonly
     */
    UNIFORM_COSTIME: 5,
    /**
     * @property UNIFORM_RANDOM01
     * @type {Number}
     * @readonly
     */
    UNIFORM_RANDOM01: 6,
    /**
     * @property UNIFORM_SAMPLER
     * @type {Number}
     * @readonly
     */
    UNIFORM_SAMPLER: 7,
    /**
     * @property UNIFORM_MAX
     * @type {Number}
     * @readonly
     */
    UNIFORM_MAX: 8,

    //------------Shader Name---------------
    /**
     * @property SHADER_POSITION_TEXTURECOLOR
     * @type {String}
     * @readonly
     */
    SHADER_POSITION_TEXTURECOLOR: "ShaderPositionTextureColor",
    /**
     * @property SHADER_POSITION_TEXTURECOLORALPHATEST
     * @type {String}
     * @readonly
     */
    SHADER_POSITION_TEXTURECOLORALPHATEST: "ShaderPositionTextureColorAlphaTest",
    /**
     * @property SHADER_POSITION_COLOR
     * @type {String}
     * @readonly
     */
    SHADER_POSITION_COLOR: "ShaderPositionColor",
    /**
     * @property SHADER_POSITION_TEXTURE
     * @type {String}
     * @readonly
     */
    SHADER_POSITION_TEXTURE: "ShaderPositionTexture",
    /**
     * @property SHADER_POSITION_TEXTURE_UCOLOR
     * @type {String}
     * @readonly
     */
    SHADER_POSITION_TEXTURE_UCOLOR: "ShaderPositionTexture_uColor",
    /**
     * @property SHADER_POSITION_TEXTUREA8COLOR
     * @type {String}
     * @readonly
     */
    SHADER_POSITION_TEXTUREA8COLOR: "ShaderPositionTextureA8Color",
    /**
     * @property SHADER_POSITION_UCOLOR
     * @type {String}
     * @readonly
     */
    SHADER_POSITION_UCOLOR: "ShaderPosition_uColor",
    /**
     * @property SHADER_POSITION_LENGTHTEXTURECOLOR
     * @type {String}
     * @readonly
     */
    SHADER_POSITION_LENGTHTEXTURECOLOR: "ShaderPositionLengthTextureColor",

    //------------uniform names----------------
    /**
     * @property UNIFORM_PMATRIX_S
     * @type {String}
     * @readonly
     */
    UNIFORM_PMATRIX_S: "CC_PMatrix",
    /**
     * @property UNIFORM_MVMATRIX_S
     * @type {String}
     * @readonly
     */
    UNIFORM_MVMATRIX_S: "CC_MVMatrix",
    /**
     * @property UNIFORM_MVPMATRIX_S
     * @type {String}
     * @readonly
     */
    UNIFORM_MVPMATRIX_S: "CC_MVPMatrix",
    /**
     * @property UNIFORM_TIME_S
     * @type {String}
     * @readonly
     */
    UNIFORM_TIME_S: "CC_Time",
    /**
     * @property UNIFORM_SINTIME_S
     * @type {String}
     * @readonly
     */
    UNIFORM_SINTIME_S: "CC_SinTime",
    /**
     * @property UNIFORM_COSTIME_S
     * @type {String}
     * @readonly
     */
    UNIFORM_COSTIME_S: "CC_CosTime",
    /**
     * @property UNIFORM_RANDOM01_S
     * @type {String}
     * @readonly
     */
    UNIFORM_RANDOM01_S: "CC_Random01",
    /**
     * @property UNIFORM_SAMPLER_S
     * @type {String}
     * @readonly
     */
    UNIFORM_SAMPLER_S: "CC_Texture0",
    /**
     * @property UNIFORM_ALPHA_TEST_VALUE_S
     * @type {String}
     * @readonly
     */
    UNIFORM_ALPHA_TEST_VALUE_S: "CC_alpha_value",

    //------------Attribute names--------------
    /**
     * @property ATTRIBUTE_NAME_COLOR
     * @type {String}
     * @readonly
     */
    ATTRIBUTE_NAME_COLOR: "a_color",
    /**
     * @property ATTRIBUTE_NAME_POSITION
     * @type {String}
     * @readonly
     */
    ATTRIBUTE_NAME_POSITION: "a_position",
    /**
     * @property ATTRIBUTE_NAME_TEX_COORD
     * @type {String}
     * @readonly
     */
    ATTRIBUTE_NAME_TEX_COORD: "a_texCoord",


    /**
     * default size for font size
     * @property ITEM_SIZE
     * @type {Number}
     * @readonly
     */
    ITEM_SIZE: 32,

    /**
     * default tag for current item
     * @property CURRENT_ITEM
     * @type {Number}
     * @readonly
     */
    CURRENT_ITEM: 0xc0c05001,
    /**
     * default tag for zoom action tag
     * @property ZOOM_ACTION_TAG
     * @type {Number}
     * @readonly
     */
    ZOOM_ACTION_TAG: 0xc0c05002,
    /**
     * default tag for normal
     * @property NORMAL_TAG
     * @type {Number}
     * @readonly
     */
    NORMAL_TAG: 8801,

    /**
     * default selected tag
     * @property SELECTED_TAG
     * @type {Number}
     * @readonly
     */
    SELECTED_TAG: 8802,

    /**
     * default disabled tag
     * @property DISABLE_TAG
     * @type {Number}
     * @readonly
     */
    DISABLE_TAG: 8803,

    // General configurations
    /**
     * <p>
     *   If enabled, the texture coordinates will be calculated by using this formula: <br/>
     *      - texCoord.left = (rect.x*2+1) / (texture.wide*2);                  <br/>
     *      - texCoord.right = texCoord.left + (rect.width*2-2)/(texture.wide*2); <br/>
     *                                                                                 <br/>
     *  The same for bottom and top.                                                   <br/>
     *                                                                                 <br/>
     *  This formula prevents artifacts by using 99% of the texture.                   <br/>
     *  The "correct" way to prevent artifacts is by using the spritesheet-artifact-fixer.py or a similar tool.<br/>
     *                                                                                  <br/>
     *  Affected nodes:                                                                 <br/>
     *      - _ccsg.Sprite / cc.SpriteBatchNode and subclasses: cc.LabelBMFont, _ccsg.TMXTiledMap <br/>
     *      - cc.LabelAtlas                                                              <br/>
     *      - cc.QuadParticleSystem                                                      <br/>
     *      - cc.TileMap                                                                 <br/>
     *                                                                                  <br/>
     *  To enabled set it to 1. Disabled by default.<br/>
     *  To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     *
     * @property {Number} FIX_ARTIFACTS_BY_STRECHING_TEXEL
     * @readonly
     */
    FIX_ARTIFACTS_BY_STRECHING_TEXEL: 1,

    /**
     * Position of the FPS (Default: 0,0 (bottom-left corner))<br/>
     * To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * @property {Vec2} DIRECTOR_STATS_POSITION
     * @readonly
     */
    DIRECTOR_STATS_POSITION: cc.p(0, 0),

    /**
     * <p>
     *   Seconds between FPS updates.<br/>
     *   0.5 seconds, means that the FPS number will be updated every 0.5 seconds.<br/>
     *   Having a bigger number means a more reliable FPS<br/>
     *   <br/>
     *   Default value: 0.1f<br/>
     *   To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} DIRECTOR_FPS_INTERVAL
     * @readonly
     */
    DIRECTOR_FPS_INTERVAL: 0.5,

    /**
     * <p>
     *    If enabled, the ccsg.Node objects (_ccsg.Sprite, _ccsg.Label,etc) will be able to render in subpixels.<br/>
     *    If disabled, integer pixels will be used.<br/>
     *    <br/>
     *    To enable set it to 1. Enabled by default.<br/>
     *    To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} COCOSNODE_RENDER_SUBPIXEL
     * @readonly
     */
    COCOSNODE_RENDER_SUBPIXEL: 1,

    /**
     * <p>
     *   If enabled, the _ccsg.Sprite objects rendered with cc.SpriteBatchNode will be able to render in subpixels.<br/>
     *   If disabled, integer pixels will be used.<br/>
     *   <br/>
     *   To enable set it to 1. Enabled by default.<br/>
     *   To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} SPRITEBATCHNODE_RENDER_SUBPIXEL
     * @readonly
     */
    SPRITEBATCHNODE_RENDER_SUBPIXEL: 1,

    /**
     * <p>
     *     Automatically premultiply alpha for PNG resources
     * </p>
     * @property {Number} AUTO_PREMULTIPLIED_ALPHA_FOR_PNG
     * @readonly
     */
    AUTO_PREMULTIPLIED_ALPHA_FOR_PNG: 0,

    /**
     * <p>
     *     If most of your images have pre-multiplied alpha, set it to 1 (if you are going to use .PNG/.JPG file images).<br/>
     *     Only set to 0 if ALL your images by-pass Apple UIImage loading system (eg: if you use libpng or PVR images)<br/>
     *     <br/>
     *     To enable set it to a value different than 0. Enabled by default.<br/>
     *     To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA
     * @readonly
     */
    OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA: 0,

    /**
     * <p>
     *   Use GL_TRIANGLE_STRIP instead of GL_TRIANGLES when rendering the texture atlas.<br/>
     *   It seems it is the recommend way, but it is much slower, so, enable it at your own risk<br/>
     *   <br/>
     *   To enable set it to a value different than 0. Disabled by default.<br/>
     *   To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} TEXTURE_ATLAS_USE_TRIANGLE_STRIP
     * @readonly
     */
    TEXTURE_ATLAS_USE_TRIANGLE_STRIP: 0,

    /**
     * <p>
     *    By default, cc.TextureAtlas (used by many cocos2d classes) will use VAO (Vertex Array Objects).<br/>
     *    Apple recommends its usage but they might consume a lot of memory, specially if you use many of them.<br/>
     *    So for certain cases, where you might need hundreds of VAO objects, it might be a good idea to disable it.<br/>
     *    <br/>
     *    To disable it set it to 0. disable by default.(Not Supported on WebGL)<br/>
     *    To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @property {Number} TEXTURE_ATLAS_USE_VAO
     * @readonly
     */
    TEXTURE_ATLAS_USE_VAO: 0,

    /**
     * <p>
     *  If enabled, NPOT textures will be used where available. Only 3rd gen (and newer) devices support NPOT textures.<br/>
     *  NPOT textures have the following limitations:<br/>
     *     - They can't have mipmaps<br/>
     *     - They only accept GL_CLAMP_TO_EDGE in GL_TEXTURE_WRAP_{S,T}<br/>
     *  <br/>
     *  To enable set it to a value different than 0. Disabled by default. <br/>
     *  <br/>
     *  This value governs only the PNG, GIF, BMP, images.<br/>
     *  This value DOES NOT govern the PVR (PVR.GZ, PVR.CCZ) files. If NPOT PVR is loaded, then it will create an NPOT texture ignoring this value.<br/>
     *  To modify it, in Web engine please refer to CCMacro.js, in JSB please refer to CCConfig.h
     * </p>
     * @readonly
     * @type {Number}
     * @deprecated This value will be removed in 1.1 and NPOT textures will be loaded by default if the device supports it.
     */
    TEXTURE_NPOT_SUPPORT: 0,

    /**
     * <p>
     *     If enabled, it will use LA88 (Luminance Alpha 16-bit textures) for CCLabelTTF objects. <br/>
     *     If it is disabled, it will use A8 (Alpha 8-bit textures).                              <br/>
     *     LA88 textures are 6% faster than A8 textures, but they will consume 2x memory.         <br/>
     *                                                                                            <br/>
     *     This feature is enabled by default.
     * </p>
     * @property {Number} USE_LA88_LABELS
     * @readonly
     */
    USE_LA88_LABELS: 1,

    /**
     * <p>
     *   If enabled, all subclasses of _ccsg.Sprite will draw a bounding box<br/>
     *   Useful for debugging purposes only. It is recommend to leave it disabled.<br/>
     *   <br/>
     *   To enable set it to a value different than 0. Disabled by default:<br/>
     *      0 -- disabled<br/>
     *      1 -- draw bounding box<br/>
     *      2 -- draw texture box
     * </p>
     * @property {Number} SPRITE_DEBUG_DRAW
     * @readonly
     */
    SPRITE_DEBUG_DRAW: 0,

    /**
     * <p>
     *   If enabled, all subclasses of cc.LabelBMFont will draw a bounding box <br/>
     *   Useful for debugging purposes only. It is recommend to leave it disabled.<br/>
     *   <br/>
     *   To enable set it to a value different than 0. Disabled by default.<br/>
     * </p>
     * @property {Number} LABELBMFONT_DEBUG_DRAW
     * @readonly
     */
    LABELBMFONT_DEBUG_DRAW: 0,

    /**
     * <p>
     *    If enabled, all subclasses of cc.LabelAtlas will draw a bounding box<br/>
     *    Useful for debugging purposes only. It is recommend to leave it disabled.<br/>
     *    <br/>
     *    To enable set it to a value different than 0. Disabled by default.
     * </p>
     * @property {Number} LABELATLAS_DEBUG_DRAW
     * @readonly
     */
    LABELATLAS_DEBUG_DRAW: 0,

    /**
     * <p>
     *    If enabled, actions that alter the position property (eg: CCMoveBy, CCJumpBy, CCBezierBy, etc..) will be stacked.                  <br/>
     *    If you run 2 or more 'position' actions at the same time on a node, then end position will be the sum of all the positions.        <br/>
     *    If disabled, only the last run action will take effect.
     * </p>
     * @property {Number} ENABLE_STACKABLE_ACTIONS
     * @readonly
     */
    ENABLE_STACKABLE_ACTIONS: 1,

    /**
     * <p>
     *      If enabled, cocos2d will maintain an OpenGL state cache internally to avoid unnecessary switches.                                     <br/>
     *      In order to use them, you have to use the following functions, instead of the the GL ones:                                             <br/>
     *          - cc.gl.useProgram() instead of glUseProgram()                                                                                      <br/>
     *          - cc.gl.deleteProgram() instead of glDeleteProgram()                                                                                <br/>
     *          - cc.gl.blendFunc() instead of glBlendFunc()                                                                                        <br/>
     *                                                                                                                                            <br/>
     *      If this functionality is disabled, then cc.gl.useProgram(), cc.gl.deleteProgram(), cc.gl.blendFunc() will call the GL ones, without using the cache.              <br/>
     *      It is recommend to enable whenever possible to improve speed.                                                                        <br/>
     *      If you are migrating your code from GL ES 1.1, then keep it disabled. Once all your code works as expected, turn it on.
     * </p>
     * @property {Number} ENABLE_GL_STATE_CACHE
     * @readonly
     */
    ENABLE_GL_STATE_CACHE: 1
};

/**
 * default gl blend src function. Compatible with premultiplied alpha images.
 * @property BLEND_SRC
 * @type {Number}
 * @readonly
 */
cc.defineGetterSetter(cc.macro, "BLEND_SRC", function (){
    if (cc._renderType === cc.game.RENDER_TYPE_WEBGL
         && cc.macro.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA) {
        return cc.macro.ONE;
    }
    else {
        return cc.macro.SRC_ALPHA;
    }
});

/**
 * <p>
 *     Linear interpolation between 2 numbers, the ratio sets how much it is biased to each end
 * </p>
 * @param {Number} a number A
 * @param {Number} b number B
 * @param {Number} r ratio between 0 and 1
 * @method lerp
 * @example {@link utils/api/engine/docs/cocos2d/core/platform/CCMacro/lerp.js}
 */
cc.lerp = function (a, b, r) {
    return a + (b - a) * r;
};

/**
 * get a random number from 0 to 0xffffff
 * @method rand
 * @returns {Number}
 */
cc.rand = function () {
	return Math.random() * 0xffffff;
};

/**
 * returns a random float between -1 and 1
 * @return {Number}
 * @method randomMinus1To1
 */
cc.randomMinus1To1 = function () {
    return (Math.random() - 0.5) * 2;
};

/**
 * returns a random float between 0 and 1, use Math.random directly
 * @return {Number}
 * @method random0To1
 */
cc.random0To1 = Math.random;

/**
 * converts degrees to radians
 * @param {Number} angle
 * @return {Number}
 * @method degreesToRadians
 */
cc.degreesToRadians = function (angle) {
    return angle * cc.macro.RAD;
};

/**
 * converts radians to degrees
 * @param {Number} angle
 * @return {Number}
 * @method radiansToDegrees
 */
cc.radiansToDegrees = function (angle) {
    return angle * cc.macro.DEG;
};

/**
 * Helpful macro that setups the GL server state, the correct GL program and sets the Model View Projection matrix
 * @param {Node} node setup node
 * @method nodeDrawSetup
 */
cc.nodeDrawSetup = function (node) {
    //cc.gl.enable(node._glServerState);
    if (node._shaderProgram) {
        //cc._renderContext.useProgram(node._shaderProgram._programObj);
        node._shaderProgram.use();
        node._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4();
    }
};

/*
 * <p>
 *     GL states that are enabled:<br/>
 *       - GL_TEXTURE_2D<br/>
 *       - GL_VERTEX_ARRAY<br/>
 *       - GL_TEXTURE_COORD_ARRAY<br/>
 *       - GL_COLOR_ARRAY<br/>
 * </p>
 * @method enableDefaultGLStates
 */
// cc.enableDefaultGLStates = function () {
    //TODO OPENGL STUFF
    /*
     glEnableClientState(GL_VERTEX_ARRAY);
     glEnableClientState(GL_COLOR_ARRAY);
     glEnableClientState(GL_TEXTURE_COORD_ARRAY);
     glEnable(GL_TEXTURE_2D);*/
// };

/*
 * <p>
 *   Disable default GL states:<br/>
 *     - GL_TEXTURE_2D<br/>
 *     - GL_TEXTURE_COORD_ARRAY<br/>
 *     - GL_COLOR_ARRAY<br/>
 * </p>
 * @method disableDefaultGLStates
 */
// cc.disableDefaultGLStates = function () {
    //TODO OPENGL
    /*
     glDisable(GL_TEXTURE_2D);
     glDisableClientState(GL_COLOR_ARRAY);
     glDisableClientState(GL_TEXTURE_COORD_ARRAY);
     glDisableClientState(GL_VERTEX_ARRAY);
     */
// };

/**
 * <p>
 *  Increments the GL Draws counts by one.<br/>
 *  The number of calls per frame are displayed on the screen when the CCDirector's stats are enabled.<br/>
 * </p>
 * @param {Number} addNumber
 * @method incrementGLDraws
 */
cc.incrementGLDraws = function (addNumber) {
    cc.g_NumberOfDraws += addNumber;
};

/**
 * Check webgl error.Error will be shown in console if exists.
 * @method checkGLErrorDebug
 */
cc.checkGLErrorDebug = function () {
    if (cc.renderMode === cc.game.RENDER_TYPE_WEBGL) {
        var _error = cc._renderContext.getError();
        if (_error) {
            cc.log(cc._LogInfos.checkGLErrorDebug, _error);
        }
    }
};
