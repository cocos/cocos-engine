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

var _currentProjectionMatrix = -1;

var macro = cc.macro;
var ENABLE_GL_STATE_CACHE = macro.ENABLE_GL_STATE_CACHE;

var MAX_ACTIVETEXTURE = 0,
    _currentShaderProgram = 0,
    _currentBoundTexture = null,
    _blendingSource = 0,
    _blendingDest = 0,
    _GLServerState = 0,
    _uVAO = 0;
if (ENABLE_GL_STATE_CACHE) {
    MAX_ACTIVETEXTURE = 16;
    _currentShaderProgram = -1;
    _currentBoundTexture = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    _blendingSource = -1;
    _blendingDest = -1;
    _GLServerState = 0;
    if(macro.TEXTURE_ATLAS_USE_VAO)
        _uVAO = 0;
}

// GL State Cache functions

cc.gl = {};

/*
 * Invalidates the GL state cache.<br/>
 * If cc.macro.ENABLE_GL_STATE_CACHE it will reset the GL state cache.
 * @function
 */
cc.gl.invalidateStateCache = function () {
    cc.math.glFreeAll();
    _currentProjectionMatrix = -1;
    if (ENABLE_GL_STATE_CACHE) {
        _currentShaderProgram = -1;
        for (var i = 0; i < MAX_ACTIVETEXTURE; i++) {
            _currentBoundTexture[i] = -1;
        }
        _blendingSource = -1;
        _blendingDest = -1;
        _GLServerState = 0;
    }
};

/*
 * Uses the GL program in case program is different than the current one.<br/>
 * If cc.macro.ENABLE_GL_STATE_CACHE is disabled, it will use glContext.useProgram() directly.
 * @function
 * @param {WebGLProgram} program
 */
cc.gl.useProgram = ENABLE_GL_STATE_CACHE ? function (program) {
    if (program !== _currentShaderProgram) {
        _currentShaderProgram = program;
        cc._renderContext.useProgram(program);
    }
} : function (program) {
    cc._renderContext.useProgram(program);
};

/*
 * Deletes the GL program. If it is the one that is being used, it invalidates it.<br/>
 * If cc.macro.ENABLE_GL_STATE_CACHE is disabled, it will use gl.deleteProgram() directly.
 * @function
 * @param {WebGLProgram} program
 */
cc.gl.deleteProgram = function (program) {
    if (ENABLE_GL_STATE_CACHE) {
        if (program === _currentShaderProgram)
            _currentShaderProgram = -1;
    }
    gl.deleteProgram(program);
};

/**
 * @function
 * @param {Number} sfactor
 * @param {Number} dfactor
 */
cc.gl.setBlending = function (sfactor, dfactor) {
    var gl = cc._renderContext;
    if ((sfactor === gl.ONE) && (dfactor === gl.ZERO)) {
        gl.disable(gl.BLEND);
    } else {
        gl.enable(gl.BLEND);
        gl.blendFunc(sfactor,dfactor);
        //TODO need fix for WebGL
        // gl.blendFuncSeparate(sfactor, dfactor, sfactor, dfactor);
    }
};

/*
 * Uses a blending function in case it not already used.<br/>
 * If cc.macro.ENABLE_GL_STATE_CACHE is disabled, it will use glContext.blendFunc() directly.
 * @function
 * @param {Number} sfactor
 * @param {Number} dfactor
 */
cc.gl.blendFunc = ENABLE_GL_STATE_CACHE ? function (sfactor, dfactor) {
    if ((sfactor !== _blendingSource) || (dfactor !== _blendingDest)) {
        _blendingSource = sfactor;
        _blendingDest = dfactor;
        cc.gl.setBlending(sfactor, dfactor);
    }
} : cc.gl.setBlending;

/**
 * @function
 * @param {Number} sfactor
 * @param {Number} dfactor
 */
cc.gl.blendFuncForParticle = function(sfactor, dfactor) {
    if ((sfactor !== _blendingSource) || (dfactor !== _blendingDest)) {
        _blendingSource = sfactor;
        _blendingDest = dfactor;
        var ctx = cc._renderContext;
        if ((sfactor === ctx.ONE) && (dfactor === ctx.ZERO)) {
            ctx.disable(ctx.BLEND);
        } else {
            ctx.enable(ctx.BLEND);
            // TODO need fix for WebGL
            // DO NOT TOUCH THIS, YOU MAY NOT BE ABLE TO FIX EVERYTHING
            ctx.blendFuncSeparate(ctx.SRC_ALPHA, dfactor, sfactor, dfactor);
        }
    }
};

/**
 * Resets the blending mode back to the cached state in case you used glBlendFuncSeparate() or glBlendEquation().<br/>
 * If cc.macro.ENABLE_GL_STATE_CACHE is disabled, it will just set the default blending mode using GL_FUNC_ADD.
 * @function
 */
cc.gl.blendResetToCache = function () {
    var ctx = cc._renderContext;
    ctx.blendEquation(ctx.FUNC_ADD);
    if (ENABLE_GL_STATE_CACHE)
        cc.gl.setBlending(_blendingSource, _blendingDest);
    else
        cc.gl.setBlending(ctx.BLEND_SRC, ctx.BLEND_DST);
};

/**
 * sets the projection matrix as dirty
 * @function
 */
cc.gl.setProjectionMatrixDirty = function () {
    _currentProjectionMatrix = -1;
};

/**
 * If the texture is not already bound, it binds it.<br/>
 * If cc.macro.ENABLE_GL_STATE_CACHE is disabled, it will call glBindTexture() directly.
 * @function
 * @param {Texture2D} textureId
 */
cc.gl.bindTexture2D = function (textureId) {
    cc.gl.bindTexture2DN(0, textureId);
};

/**
 * If the texture is not already bound to a given unit, it binds it.<br/>
 * If cc.macro.ENABLE_GL_STATE_CACHE is disabled, it will call glBindTexture() directly.
 * @function
 * @param {Number} textureUnit
 * @param {Texture2D} textureId
 */
cc.gl.bindTexture2DN = ENABLE_GL_STATE_CACHE ? function (textureUnit, textureId) {
    if (_currentBoundTexture[textureUnit] === textureId)
        return;
    _currentBoundTexture[textureUnit] = textureId;

    var ctx = cc._renderContext;
    ctx.activeTexture(ctx.TEXTURE0 + textureUnit);
    if(textureId)
        ctx.bindTexture(ctx.TEXTURE_2D, textureId._webTextureObj);
    else
        ctx.bindTexture(ctx.TEXTURE_2D, null);
} : function (textureUnit, textureId) {
    var ctx = cc._renderContext;
    ctx.activeTexture(ctx.TEXTURE0 + textureUnit);
    if(textureId)
        ctx.bindTexture(ctx.TEXTURE_2D, textureId._webTextureObj);
    else
        ctx.bindTexture(ctx.TEXTURE_2D, null);
};

/**
 * It will delete a given texture. If the texture was bound, it will invalidate the cached. <br/>
 * If cc.macro.ENABLE_GL_STATE_CACHE is disabled, it will call glDeleteTextures() directly.
 * @function
 * @param {Texture2D} textureId
 */
cc.gl.deleteTexture2D = function (textureId) {
    cc.gl.deleteTexture2DN(0, textureId);
};

/**
 * It will delete a given texture. If the texture was bound, it will invalidate the cached for the given texture unit.<br/>
 * If cc.macro.ENABLE_GL_STATE_CACHE is disabled, it will call glDeleteTextures() directly.
 * @function
 * @param {Number} textureUnit
 * @param {Texture2D} textureId
 */
cc.gl.deleteTexture2DN = function (textureUnit, textureId) {
    if (ENABLE_GL_STATE_CACHE) {
        if (textureId === _currentBoundTexture[ textureUnit ])
            _currentBoundTexture[ textureUnit ] = -1;
    }
    cc._renderContext.deleteTexture(textureId._webTextureObj);
};

/**
 * If the vertex array is not already bound, it binds it.<br/>
 * If cc.macro.ENABLE_GL_STATE_CACHE is disabled, it will call glBindVertexArray() directly.
 * @function
 * @param {Number} vaoId
 */
cc.gl.bindVAO = function (vaoId) {
    if (!macro.TEXTURE_ATLAS_USE_VAO)
        return;

    if (ENABLE_GL_STATE_CACHE) {
        if (_uVAO !== vaoId) {
            _uVAO = vaoId;
            //TODO need fixed
            //glBindVertexArray(vaoId);
        }
    } else {
        //glBindVertexArray(vaoId);
    }
};

/**
 * It will enable / disable the server side GL states.<br/>
 * If cc.macro.ENABLE_GL_STATE_CACHE is disabled, it will call glEnable() directly.
 * @function
 * @param {Number} flags
 */
cc.gl.enable = function (flags) {
    if (ENABLE_GL_STATE_CACHE) {
        /*var enabled;

         */
        /* GL_BLEND */
        /*
         if ((enabled = (flags & cc.GL_BLEND)) != (_GLServerState & cc.GL_BLEND)) {
         if (enabled) {
         cc._renderContext.enable(cc._renderContext.BLEND);
         _GLServerState |= cc.GL_BLEND;
         } else {
         cc._renderContext.disable(cc._renderContext.BLEND);
         _GLServerState &= ~cc.GL_BLEND;
         }
         }*/
    } else {
        /*if ((flags & cc.GL_BLEND))
         cc._renderContext.enable(cc._renderContext.BLEND);
         else
         cc._renderContext.disable(cc._renderContext.BLEND);*/
    }
};

