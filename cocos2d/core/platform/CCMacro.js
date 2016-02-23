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

/**
 * @property {Number} INVALID_INDEX
 * @readonly
 */
cc.INVALID_INDEX = -1;

/**
 * PI is the ratio of a circle's circumference to its diameter.
 * @property {Number} PI
 * @readonly
 */
cc.PI = Math.PI;

/**
 * @property {Number} FLT_MAX
 * @readonly
 */
cc.FLT_MAX = parseFloat('3.402823466e+38F');

/**
 * @property {Number} FLT_MIN
 * @readonly
 */
cc.FLT_MIN = parseFloat("1.175494351e-38F");

/**
 * @property {Number} RAD
 * @readonly
 */
cc.RAD = cc.PI / 180;

/**
 * @property {Number} DEG
 * @readonly
 */
cc.DEG = 180 / cc.PI;

/**
 * maximum unsigned int value
 * @property {Number} UINT_MAX
 * @readonly
 */
cc.UINT_MAX = 0xffffffff;

/**
 * <p>
 * simple macro that swaps 2 variables<br/>
 *  modified from c++ macro, you need to pass in the x and y variables names in string, <br/>
 *  and then a reference to the whole object as third variable
 * </p>
 * @param {String} x
 * @param {String} y
 * @param {Object} ref
 * @method swap
 * @deprecated since v3.0
 */
cc.swap = function (x, y, ref) {
    if (cc.js.isObject(ref) && !cc.js.isUndefined(ref.x) && !cc.js.isUndefined(ref.y)) {
        var tmp = ref[x];
        ref[x] = ref[y];
        ref[y] = tmp;
    } else
        cc.log(cc._LogInfos.swap);
};

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
 * returns a random float between 0 and 1
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
    return angle * cc.RAD;
};

/**
 * converts radians to degrees
 * @param {Number} angle
 * @return {Number}
 * @method radiansToDegrees
 */
cc.radiansToDegrees = function (angle) {
    return angle * cc.DEG;
};
/**
 * converts radians to degrees
 * @param {Number} angle
 * @return {Number}
 * @method radiansToDegress
 */
cc.radiansToDegress = function (angle) {
    cc.log(cc._LogInfos.radiansToDegress);
    return angle * cc.DEG;
};

/**
 * @property {Number} REPEAT_FOREVER
 * @readonly
 */
cc.REPEAT_FOREVER = cc.sys.isNative ? 0xffffffff : (Number.MAX_VALUE - 1);

/**
 * Helpful macro that setups the GL server state, the correct GL program and sets the Model View Projection matrix
 * @param {Node} node setup node
 * @method nodeDrawSetup
 */
cc.nodeDrawSetup = function (node) {
    //cc.glEnable(node._glServerState);
    if (node._shaderProgram) {
        //cc._renderContext.useProgram(node._shaderProgram._programObj);
        node._shaderProgram.use();
        node._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4();
    }
};

/**
 * <p>
 *     GL states that are enabled:<br/>
 *       - GL_TEXTURE_2D<br/>
 *       - GL_VERTEX_ARRAY<br/>
 *       - GL_TEXTURE_COORD_ARRAY<br/>
 *       - GL_COLOR_ARRAY<br/>
 * </p>
 * @method enableDefaultGLStates
 */
cc.enableDefaultGLStates = function () {
    //TODO OPENGL STUFF
    /*
     glEnableClientState(GL_VERTEX_ARRAY);
     glEnableClientState(GL_COLOR_ARRAY);
     glEnableClientState(GL_TEXTURE_COORD_ARRAY);
     glEnable(GL_TEXTURE_2D);*/
};

/**
 * <p>
 *   Disable default GL states:<br/>
 *     - GL_TEXTURE_2D<br/>
 *     - GL_TEXTURE_COORD_ARRAY<br/>
 *     - GL_COLOR_ARRAY<br/>
 * </p>
 * @method disableDefaultGLStates
 */
cc.disableDefaultGLStates = function () {
    //TODO OPENGL
    /*
     glDisable(GL_TEXTURE_2D);
     glDisableClientState(GL_COLOR_ARRAY);
     glDisableClientState(GL_TEXTURE_COORD_ARRAY);
     glDisableClientState(GL_VERTEX_ARRAY);
     */
};

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
 * @property {Number} FLT_EPSILON
 * @readonly
 */
cc.FLT_EPSILON = 0.0000001192092896;

/**
 * <p>
 *     On Mac it returns 1;<br/>
 *     On iPhone it returns 2 if RetinaDisplay is On. Otherwise it returns 1
 * </p>
 * @return {Number}
 * @method contentScaleFactor
 */
cc.contentScaleFactor = cc.IS_RETINA_DISPLAY_SUPPORTED ? function () {
    return cc.director.getContentScaleFactor();
} : function () {
    return 1;
};

/**
 * Converts a Point in points to pixels
 * @param {Vec2} points
 * @return {Vec2}
 * @method pointPointsToPixels
 */
cc.pointPointsToPixels = function (points) {
    var scale = cc.contentScaleFactor();
    return cc.p(points.x * scale, points.y * scale);
};

/**
 * Converts a Point in pixels to points
 * @param {Rect} pixels
 * @return {Vec2}
 * @method pointPixelsToPoints
 */
cc.pointPixelsToPoints = function (pixels) {
	var scale = cc.contentScaleFactor();
	return cc.p(pixels.x / scale, pixels.y / scale);
};

cc._pointPixelsToPointsOut = function(pixels, outPoint){
	var scale = cc.contentScaleFactor();
	outPoint.x = pixels.x / scale;
	outPoint.y = pixels.y / scale;
};

/**
 * Converts a Size in points to pixels
 * @param {Size} sizeInPoints
 * @return {Size}
 * @method sizePointsToPixels
 */
cc.sizePointsToPixels = function (sizeInPoints) {
    var scale = cc.contentScaleFactor();
    return cc.size(sizeInPoints.width * scale, sizeInPoints.height * scale);
};

/**
 * Converts a size in pixels to points
 * @param {Size} sizeInPixels
 * @return {Size}
 * @method sizePixelsToPoints
 */
cc.sizePixelsToPoints = function (sizeInPixels) {
    var scale = cc.contentScaleFactor();
    return cc.size(sizeInPixels.width / scale, sizeInPixels.height / scale);
};

cc._sizePixelsToPointsOut = function (sizeInPixels, outSize) {
    var scale = cc.contentScaleFactor();
    outSize.width = sizeInPixels.width / scale;
    outSize.height = sizeInPixels.height / scale;
};

/**
 * Converts a rect in pixels to points
 * @param {Rect} pixel
 * @return {Rect}
 * @method rectPixelsToPoints
 */
cc.rectPixelsToPoints = cc.IS_RETINA_DISPLAY_SUPPORTED ? function (pixel) {
    var scale = cc.contentScaleFactor();
    return cc.rect(pixel.x / scale, pixel.y / scale,
        pixel.width / scale, pixel.height / scale);
} : function (p) {
    return cc.rect(p);
};

/**
 * Converts a rect in points to pixels
 * @param {Rect} point
 * @return {Rect}
 * @method rectPointsToPixels
 */
cc.rectPointsToPixels = cc.IS_RETINA_DISPLAY_SUPPORTED ? function (point) {
   var scale = cc.contentScaleFactor();
    return cc.rect(point.x * scale, point.y * scale,
        point.width * scale, point.height * scale);
} : function (p) {
    return cc.rect(p);
};

//some gl constant variable
/**
 * @property {Number} ONE
 * @readonly
 */
cc.ONE = 1;

/**
 * @property {Number} ZERO
 * @readonly
 */
cc.ZERO = 0;

/**
 * @property {Number} SRC_ALPHA
 * @readonly
 */
cc.SRC_ALPHA = 0x0302;

/**
 * @property {Number} SRC_ALPHA_SATURATE
 * @readonly
 */
cc.SRC_ALPHA_SATURATE = 0x308;

/**
 * @property {Number} SRC_COLOR
 * @readonly
 */
cc.SRC_COLOR = 0x300;

/**
 * @property {Number} DST_ALPHA
 * @readonly
 */
cc.DST_ALPHA = 0x304;

/**
 * @property {Number} DST_COLOR
 * @readonly
 */
cc.DST_COLOR = 0x306;

/**
 * @property {Number} ONE_MINUS_SRC_ALPHA
 * @readonly
 */
cc.ONE_MINUS_SRC_ALPHA = 0x0303;

/**
 * @property {Number} ONE_MINUS_SRC_COLOR
 * @readonly
 */
cc.ONE_MINUS_SRC_COLOR = 0x301;

/**
 * @property {Number} ONE_MINUS_DST_ALPHA
 * @readonly
 */
cc.ONE_MINUS_DST_ALPHA = 0x305;

/**
 * @property {Number} ONE_MINUS_DST_COLOR
 * @readonly
 */
cc.ONE_MINUS_DST_COLOR = 0x0307;

/**
 * @property {Number} ONE_MINUS_CONSTANT_ALPHA
 * @readonly
 */
cc.ONE_MINUS_CONSTANT_ALPHA	= 0x8004;

/**
 * @property {Number} ONE_MINUS_CONSTANT_COLOR
 * @readonly
 */
cc.ONE_MINUS_CONSTANT_COLOR	= 0x8002;

/**
 * the constant variable equals gl.LINEAR for texture
 * @property {Number} LINEAR
 * @readonly
 */
cc.LINEAR	= 0x2601;

/**
 * default gl blend src function. Compatible with premultiplied alpha images.
 * @property {Number} BLEND_SRC
 * @readonly
 */
cc.defineGetterSetter(cc, "BLEND_SRC", function (){
    if (cc._renderType === cc.game.RENDER_TYPE_WEBGL
         && cc.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA) {
        return cc.ONE;
    }
    else {
        return cc.SRC_ALPHA;
    }
});

/**
 * default gl blend dst function. Compatible with premultiplied alpha images.
 * @property {Number} BLEND_DST
 * @readonly
 */
cc.BLEND_DST = 0x0303;

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

//Possible device orientations
/**
 * Device oriented vertically, home button on the bottom (UIDeviceOrientationPortrait)
 * @property {Number} DEVICE_ORIENTATION_PORTRAIT
 * @readonly
 */
cc.DEVICE_ORIENTATION_PORTRAIT = 0;

/**
 * Device oriented horizontally, home button on the right (UIDeviceOrientationLandscapeLeft)
 * @property {Number} DEVICE_ORIENTATION_LANDSCAPE_LEFT
 * @readonly
 */
cc.DEVICE_ORIENTATION_LANDSCAPE_LEFT = 1;

/**
 * Device oriented vertically, home button on the top (UIDeviceOrientationPortraitUpsideDown)
 * @property {Number} DEVICE_ORIENTATION_PORTRAIT_UPSIDE_DOWN
 * @readonly
 */
cc.DEVICE_ORIENTATION_PORTRAIT_UPSIDE_DOWN = 2;

/**
 * Device oriented horizontally, home button on the left (UIDeviceOrientationLandscapeRight)
 * @property {Number} DEVICE_ORIENTATION_LANDSCAPE_RIGHT
 * @readonly
 */
cc.DEVICE_ORIENTATION_LANDSCAPE_RIGHT = 3;

/**
 * In browsers, we only support 2 orientations by change window size.
 * @property {Number} DEVICE_MAX_ORIENTATIONS
 * @readonly
 */
cc.DEVICE_MAX_ORIENTATIONS = 2;


// ------------------- vertex attrib flags -----------------------------
/**
 * @property {Number} VERTEX_ATTRIB_FLAG_NONE
 * @readonly
 */
cc.VERTEX_ATTRIB_FLAG_NONE = 0;
/**
 * @property {Number} VERTEX_ATTRIB_FLAG_POSITION
 * @readonly
 */
cc.VERTEX_ATTRIB_FLAG_POSITION = 1 << 0;
/**
 * @property {Number} VERTEX_ATTRIB_FLAG_COLOR
 * @readonly
 */
cc.VERTEX_ATTRIB_FLAG_COLOR = 1 << 1;
/**
 * @property {Number} VERTEX_ATTRIB_FLAG_TEX_COORDS
 * @readonly
 */
cc.VERTEX_ATTRIB_FLAG_TEX_COORDS = 1 << 2;
/**
 * @property {Number} VERTEX_ATTRIB_FLAG_POS_COLOR_TEX
 * @readonly
 */
cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX = ( cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR | cc.VERTEX_ATTRIB_FLAG_TEX_COORDS );

/**
 * GL server side states
 * @property {Number} GL_ALL
 * @readonly
 */
cc.GL_ALL = 0;

//-------------Vertex Attributes-----------
/**
 * @property {Number} VERTEX_ATTRIB_POSITION
 * @readonly
 */
cc.VERTEX_ATTRIB_POSITION = 0;
/**
 * @property {Number} VERTEX_ATTRIB_COLOR
 * @readonly
 */
cc.VERTEX_ATTRIB_COLOR = 1;
/**
 * @property {Number} VERTEX_ATTRIB_TEX_COORDS
 * @readonly
 */
cc.VERTEX_ATTRIB_TEX_COORDS = 2;
/**
 * @property {Number} VERTEX_ATTRIB_MAX
 * @readonly
 */
cc.VERTEX_ATTRIB_MAX = 3;

//------------Uniforms------------------
/**
 * @property {Number} UNIFORM_PMATRIX
 * @readonly
 */
cc.UNIFORM_PMATRIX = 0;
/**
 * @property {Number} UNIFORM_MVMATRIX
 * @readonly
 */
cc.UNIFORM_MVMATRIX = 1;
/**
 * @property {Number} UNIFORM_MVPMATRIX
 * @readonly
 */
cc.UNIFORM_MVPMATRIX = 2;
/**
 * @property {Number} UNIFORM_TIME
 * @readonly
 */
cc.UNIFORM_TIME = 3;
/**
 * @property {Number} UNIFORM_SINTIME
 * @readonly
 */
cc.UNIFORM_SINTIME = 4;
/**
 * @property {Number} UNIFORM_COSTIME
 * @readonly
 */
cc.UNIFORM_COSTIME = 5;
/**
 * @property {Number} UNIFORM_RANDOM01
 * @readonly
 */
cc.UNIFORM_RANDOM01 = 6;
/**
 * @property {Number} UNIFORM_SAMPLER
 * @readonly
 */
cc.UNIFORM_SAMPLER = 7;
/**
 * @property {Number} UNIFORM_MAX
 * @readonly
 */
cc.UNIFORM_MAX = 8;

//------------Shader Name---------------
/**
 * @property {String} SHADER_POSITION_TEXTURECOLOR
 * @readonly
 */
cc.SHADER_POSITION_TEXTURECOLOR = "ShaderPositionTextureColor";
/**
 * @property {String} SHADER_POSITION_TEXTURECOLORALPHATEST
 * @readonly
 */
cc.SHADER_POSITION_TEXTURECOLORALPHATEST = "ShaderPositionTextureColorAlphaTest";
/**
 * @property {String} SHADER_POSITION_COLOR
 * @readonly
 */
cc.SHADER_POSITION_COLOR = "ShaderPositionColor";
/**
 * @property {String} SHADER_POSITION_TEXTURE
 * @readonly
 */
cc.SHADER_POSITION_TEXTURE = "ShaderPositionTexture";
/**
 * @property {String} SHADER_POSITION_TEXTURE_UCOLOR
 * @readonly
 */
cc.SHADER_POSITION_TEXTURE_UCOLOR = "ShaderPositionTexture_uColor";
/**
 * @property {String} SHADER_POSITION_TEXTUREA8COLOR
 * @readonly
 */
cc.SHADER_POSITION_TEXTUREA8COLOR = "ShaderPositionTextureA8Color";
/**
 * @property {String} SHADER_POSITION_UCOLOR
 * @readonly
 */
cc.SHADER_POSITION_UCOLOR = "ShaderPosition_uColor";
/**
 * @property {String} SHADER_POSITION_LENGTHTEXTURECOLOR
 * @readonly
 */
cc.SHADER_POSITION_LENGTHTEXTURECOLOR = "ShaderPositionLengthTextureColor";

//------------uniform names----------------
/**
 * @property {String} UNIFORM_PMATRIX_S
 * @readonly
 */
cc.UNIFORM_PMATRIX_S = "CC_PMatrix";
/**
 * @property {String} UNIFORM_MVMATRIX_S
 * @readonly
 */
cc.UNIFORM_MVMATRIX_S = "CC_MVMatrix";
/**
 * @property {String} UNIFORM_MVPMATRIX_S
 * @readonly
 */
cc.UNIFORM_MVPMATRIX_S = "CC_MVPMatrix";
/**
 * @property {String} UNIFORM_TIME_S
 * @readonly
 */
cc.UNIFORM_TIME_S = "CC_Time";
/**
 * @property {String} UNIFORM_SINTIME_S
 * @readonly
 */
cc.UNIFORM_SINTIME_S = "CC_SinTime";
/**
 * @property {String} UNIFORM_COSTIME_S
 * @readonly
 */
cc.UNIFORM_COSTIME_S = "CC_CosTime";
/**
 * @property {String} UNIFORM_RANDOM01_S
 * @readonly
 */
cc.UNIFORM_RANDOM01_S = "CC_Random01";
/**
 * @property {String} UNIFORM_SAMPLER_S
 * @readonly
 */
cc.UNIFORM_SAMPLER_S = "CC_Texture0";
/**
 * @property {String} UNIFORM_ALPHA_TEST_VALUE_S
 * @readonly
 */
cc.UNIFORM_ALPHA_TEST_VALUE_S = "CC_alpha_value";

//------------Attribute names--------------
/**
 * @property {String} ATTRIBUTE_NAME_COLOR
 * @readonly
 */
cc.ATTRIBUTE_NAME_COLOR = "a_color";
/**
 * @property {String} ATTRIBUTE_NAME_POSITION
 * @readonly
 */
cc.ATTRIBUTE_NAME_POSITION = "a_position";
/**
 * @property {String} ATTRIBUTE_NAME_TEX_COORD
 * @readonly
 */
cc.ATTRIBUTE_NAME_TEX_COORD = "a_texCoord";


/**
 * default size for font size
 * @property {Number} ITEM_SIZE
 * @readonly
 */
cc.ITEM_SIZE = 32;

/**
 * default tag for current item
 * @property {Number} CURRENT_ITEM
 * @readonly
 */
cc.CURRENT_ITEM = 0xc0c05001;
/**
 * default tag for zoom action tag
 * @property {Number} ZOOM_ACTION_TAG
 * @readonly
 */
cc.ZOOM_ACTION_TAG = 0xc0c05002;
/**
 * default tag for normal
 * @property {Number} NORMAL_TAG
 * @readonly
 */
cc.NORMAL_TAG = 8801;

/**
 * default selected tag
 * @property {Number} SELECTED_TAG
 * @readonly
 */
cc.SELECTED_TAG = 8802;

/**
 * default disabled tag
 * @property {Number} DISABLE_TAG
 * @readonly
 */
cc.DISABLE_TAG = 8803;
