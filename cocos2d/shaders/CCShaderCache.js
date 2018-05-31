/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

var shaders = cc.PresetShaders;
var macro = cc.macro;

/**
 * cc.shaderCache is a singleton object that stores manages GL shaders
 * @class
 * @name cc.shaderCache
 */
cc.shaderCache = /** @lends cc.shaderCache# */{

    /**
     * Position Texture Color shader
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_POSITION_TEXTURECOLOR: 0,
    /**
     * Position Texture Color alpha test
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_POSITION_TEXTURECOLOR_ALPHATEST: 1,
    /**
     * Position, Color shader
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_POSITION_COLOR: 2,
    /**
     * Position Texture shader
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_POSITION_TEXTURE: 3,
    /**
     * Position, Texture attribs, 1 Color as uniform shader
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_POSITION_TEXTURE_UCOLOR: 4,
    /**
     * Position Texture A8 Color shader
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_POSITION_TEXTURE_A8COLOR: 5,
    /**
     * Position and 1 color passed as a uniform (to similate glColor4ub )
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_POSITION_UCOLOR: 6,
    /**
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_POSITION_LENGTH_TEXTURECOLOR: 7,
    /**
     * Sprite Position Texture Color shader
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_SPRITE_POSITION_TEXTURECOLOR: 8,
    /**
     * Sprite Position Texture Color alpha shader
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_SPRITE_POSITION_TEXTURECOLOR_ALPHATEST: 9,
    /**
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_SPRITE_POSITION_COLOR: 10,
    /**
     * @public
     * @constant
     * @type {Number}
     */
    TYPE_MAX: 10,

    _programs: {},

    _init: function () {
        this.loadDefaultShaders();
        return true;
    },

    _loadDefaultShader: function (program, type) {
        switch (type) {
            case macro.SHADER_POSITION_TEXTURECOLOR:
                program.initWithVertexShaderByteArray(shaders.POSITION_TEXTURE_COLOR_VERT, shaders.POSITION_TEXTURE_COLOR_FRAG);

                program.addAttribute(macro.ATTRIBUTE_NAME_POSITION, macro.VERTEX_ATTRIB_POSITION);
                program.addAttribute(macro.ATTRIBUTE_NAME_COLOR, macro.VERTEX_ATTRIB_COLOR);
                program.addAttribute(macro.ATTRIBUTE_NAME_TEX_COORD, macro.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case macro.SHADER_SPRITE_POSITION_TEXTURECOLOR:
                program.initWithVertexShaderByteArray(shaders.SPRITE_POSITION_TEXTURE_COLOR_VERT, shaders.POSITION_TEXTURE_COLOR_FRAG);
                program.addAttribute(macro.ATTRIBUTE_NAME_POSITION, macro.VERTEX_ATTRIB_POSITION);
                program.addAttribute(macro.ATTRIBUTE_NAME_COLOR, macro.VERTEX_ATTRIB_COLOR);
                program.addAttribute(macro.ATTRIBUTE_NAME_TEX_COORD, macro.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case macro.SHADER_POSITION_TEXTURECOLORALPHATEST:
                program.initWithVertexShaderByteArray(shaders.POSITION_TEXTURE_COLOR_VERT, shaders.POSITION_TEXTURE_COLOR_ALPHATEST_FRAG);

                program.addAttribute(macro.ATTRIBUTE_NAME_POSITION, macro.VERTEX_ATTRIB_POSITION);
                program.addAttribute(macro.ATTRIBUTE_NAME_COLOR, macro.VERTEX_ATTRIB_COLOR);
                program.addAttribute(macro.ATTRIBUTE_NAME_TEX_COORD, macro.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case macro.SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST:
                program.initWithVertexShaderByteArray(shaders.SPRITE_POSITION_TEXTURE_COLOR_VERT, shaders.POSITION_TEXTURE_COLOR_ALPHATEST_FRAG);
                program.addAttribute(macro.ATTRIBUTE_NAME_POSITION, macro.VERTEX_ATTRIB_POSITION);
                program.addAttribute(macro.ATTRIBUTE_NAME_COLOR, macro.VERTEX_ATTRIB_COLOR);
                program.addAttribute(macro.ATTRIBUTE_NAME_TEX_COORD, macro.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case macro.SHADER_POSITION_COLOR:
                program.initWithVertexShaderByteArray(shaders.POSITION_COLOR_VERT, shaders.POSITION_COLOR_FRAG);

                program.addAttribute(macro.ATTRIBUTE_NAME_POSITION, macro.VERTEX_ATTRIB_POSITION);
                program.addAttribute(macro.ATTRIBUTE_NAME_COLOR, macro.VERTEX_ATTRIB_COLOR);
                break;
            case macro.SHADER_SPRITE_POSITION_COLOR:
                program.initWithVertexShaderByteArray(shaders.SPRITE_POSITION_COLOR_VERT, shaders.POSITION_COLOR_FRAG);
                program.addAttribute(macro.ATTRIBUTE_NAME_POSITION, macro.VERTEX_ATTRIB_POSITION);
                program.addAttribute(macro.ATTRIBUTE_NAME_COLOR, macro.VERTEX_ATTRIB_COLOR);
                break;
            case macro.SHADER_POSITION_TEXTURE:
                program.initWithVertexShaderByteArray(shaders.POSITION_TEXTURE_VERT, shaders.POSITION_TEXTURE_FRAG);

                program.addAttribute(macro.ATTRIBUTE_NAME_POSITION, macro.VERTEX_ATTRIB_POSITION);
                program.addAttribute(macro.ATTRIBUTE_NAME_TEX_COORD, macro.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case macro.SHADER_POSITION_TEXTURE_UCOLOR:
                program.initWithVertexShaderByteArray(shaders.POSITION_TEXTURE_UCOLOR_VERT, shaders.POSITION_TEXTURE_UCOLOR_FRAG);

                program.addAttribute(macro.ATTRIBUTE_NAME_POSITION, macro.VERTEX_ATTRIB_POSITION);
                program.addAttribute(macro.ATTRIBUTE_NAME_TEX_COORD, macro.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case macro.SHADER_POSITION_TEXTUREA8COLOR:
                program.initWithVertexShaderByteArray(shaders.POSITION_TEXTURE_A8COLOR_VERT, shaders.POSITION_TEXTURE_A8COLOR_FRAG);

                program.addAttribute(macro.ATTRIBUTE_NAME_POSITION, macro.VERTEX_ATTRIB_POSITION);
                program.addAttribute(macro.ATTRIBUTE_NAME_COLOR, macro.VERTEX_ATTRIB_COLOR);
                program.addAttribute(macro.ATTRIBUTE_NAME_TEX_COORD, macro.VERTEX_ATTRIB_TEX_COORDS);
                break;
            case macro.SHADER_POSITION_UCOLOR:
                program.initWithVertexShaderByteArray(shaders.POSITION_UCOLOR_VERT, shaders.POSITION_UCOLOR_FRAG);
                program.addAttribute("aVertex", macro.VERTEX_ATTRIB_POSITION);
                break;
            case macro.SHADER_POSITION_LENGTHTEXTURECOLOR:
                program.initWithVertexShaderByteArray(shaders.POSITION_COLOR_LENGTH_TEXTURE_VERT, shaders.POSITION_COLOR_LENGTH_TEXTURE_FRAG);

                program.addAttribute(macro.ATTRIBUTE_NAME_POSITION, macro.VERTEX_ATTRIB_POSITION);
                program.addAttribute(macro.ATTRIBUTE_NAME_TEX_COORD, macro.VERTEX_ATTRIB_TEX_COORDS);
                program.addAttribute(macro.ATTRIBUTE_NAME_COLOR, macro.VERTEX_ATTRIB_COLOR);
                break;
            default:
                cc.logID(8105);
                return;
        }

        program.link();
        program.updateUniforms();

        //cc.checkGLErrorDebug();
    },

    _reloadShader: function (type) {
        var program = this.programForKey(type);
        program.reset();
        this._loadDefaultShader(program, type);
    },

    /**
     * loads the default shaders
     */
    loadDefaultShaders: function () {
    },

    /**
     * reload the default shaders
     */
    reloadDefaultShaders: function () {
        // reset all default programs and reload them
        this._reloadShader(macro.SHADER_POSITION_TEXTURECOLOR);
        this._reloadShader(macro.SHADER_SPRITE_POSITION_TEXTURECOLOR);
        this._reloadShader(macro.SHADER_POSITION_TEXTURECOLORALPHATEST);
        this._reloadShader(macro.SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST);
        this._reloadShader(macro.SHADER_POSITION_COLOR);
        this._reloadShader(macro.SHADER_POSITION_TEXTURE);
        this._reloadShader(macro.SHADER_POSITION_TEXTURE_UCOLOR);
        this._reloadShader(macro.SHADER_POSITION_TEXTUREA8COLOR);
        this._reloadShader(macro.SHADER_POSITION_UCOLOR);
    },

    /**
     * returns a GL program for a given key
     * @param {String} key
     */
    programForKey: function (key) {
        if (!this._programs[key]) {
            var program = new cc.GLProgram();
            this._loadDefaultShader(program, key);
            this._programs[key] = program;
        }

        return this._programs[key];
    },

    /**
     * returns a GL program for a shader name
     * @param {String} shaderName
     * @return {cc.GLProgram}
     */
    getProgram: function (shaderName) {
        return this.programForKey(shaderName);
    },

    /**
     * adds a CCGLProgram to the cache for a given name
     * @param {cc.GLProgram} program
     * @param {String} key
     */
    addProgram: function (program, key) {
        this._programs[key] = program;
    }
};
