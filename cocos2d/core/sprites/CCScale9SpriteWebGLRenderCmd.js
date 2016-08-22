/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

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

var ccgl = cc.gl;

cc.Scale9Sprite.WebGLRenderCmd = function (renderable) {
    _ccsg.Node.WebGLRenderCmd.call(this, renderable);
    if (this._node.loaded()) {
        this._needDraw = true;
    }
    else {
        this._needDraw = false;
    }

    this.vertexType = cc.renderer.VertexType.QUAD;
    this._color = new Uint32Array(1);
    this._dirty = false;
    this._shaderProgram = cc.shaderCache.programForKey(cc.macro.SHADER_SPRITE_POSITION_TEXTURECOLOR);
};

var Scale9Sprite = cc.Scale9Sprite;
var proto = Scale9Sprite.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
proto.constructor = Scale9Sprite.WebGLRenderCmd;

proto._uploadSliced = function (vertices, uvs, color, z, f32buffer, ui32buffer, offset) {
    var off;
    for (var r = 0; r < 3; ++r) {
        for (var c = 0; c < 3; ++c) {
            off = r*8 + c*2;
            // lb
            f32buffer[offset] = vertices[off];
            f32buffer[offset+1] = vertices[off+1];
            f32buffer[offset+2] = z;
            ui32buffer[offset+3] = color[0];
            f32buffer[offset+4] = uvs[off];
            f32buffer[offset+5] = uvs[off+1];
            offset += 6;
            // rb
            f32buffer[offset] = vertices[off+2];
            f32buffer[offset + 1] = vertices[off+3];
            f32buffer[offset + 2] = z;
            ui32buffer[offset + 3] = color[0];
            f32buffer[offset + 4] = uvs[off+2];
            f32buffer[offset + 5] = uvs[off+3];
            offset += 6;
            // lt
            f32buffer[offset] = vertices[off+8];
            f32buffer[offset + 1] = vertices[off+9];
            f32buffer[offset + 2] = z;
            ui32buffer[offset + 3] = color[0];
            f32buffer[offset + 4] = uvs[off+8];
            f32buffer[offset + 5] = uvs[off+9];
            offset += 6;
            // rt
            f32buffer[offset] = vertices[off+10];
            f32buffer[offset + 1] = vertices[off+11];
            f32buffer[offset + 2] = z;
            ui32buffer[offset + 3] = color[0];
            f32buffer[offset + 4] = uvs[off+10];
            f32buffer[offset + 5] = uvs[off+11];
            offset += 6;
        }
    }
    return 36;
};

proto.transform = function (parentCmd, recursive) {
    this.originTransform(parentCmd, recursive);
    this._node._rebuildQuads();
};

proto.uploadData = function (f32buffer, ui32buffer, vertexDataOffset){
    var node = this._node;
    if (this._displayedOpacity === 0) {
        return 0;
    }

    // Rebuild vertex data
    if (node._quadsDirty) {
        node._rebuildQuads();
    }

    if (node._distortionOffset && this._shaderProgram === Scale9Sprite.WebGLRenderCmd._distortionProgram) {
        this._shaderProgram.setUniformLocationWith2f(
            Scale9Sprite.WebGLRenderCmd._distortionOffset,
            node._distortionOffset.x, node._distortionOffset.y
        );
        this._shaderProgram.setUniformLocationWith2f(
            Scale9Sprite.WebGLRenderCmd._distortionTiling,
            node._distortionTiling.x, node._distortionTiling.y
        );
        cc.renderer._breakBatch();
    }

    // Color & z
    var opacity = this._displayedOpacity;
    var r = this._displayedColor.r,
        g = this._displayedColor.g,
        b = this._displayedColor.b;
    if (node._opacityModifyRGB) {
        var a = opacity / 255;
        r *= a;
        g *= a;
        b *= a;
    }
    this._color[0] = ((opacity<<24) | (b<<16) | (g<<8) | r);
    var z = node._vertexZ;

    // Upload data
    var vertices = node._vertices;
    var uvs = node._uvs;
    var types = Scale9Sprite.RenderingType;
    var offset = vertexDataOffset;
    var len = 0;
    switch (node._renderingType) {
    case types.SIMPLE:
    case types.TILED:
    case types.FILLED:
        // Inline for performance
        len = this._node._vertCount;
        for (var i = 0, srcOff = 0; i < len; i++, srcOff += 2) {
            f32buffer[offset] = vertices[srcOff];
            f32buffer[offset + 1] = vertices[srcOff+1];
            f32buffer[offset + 2] = z;
            ui32buffer[offset + 3] = this._color[0];
            f32buffer[offset + 4] = uvs[srcOff];
            f32buffer[offset + 5] = uvs[srcOff+1];
            offset += 6;
        }
        break;
    case types.SLICED:
        len = this._uploadSliced(vertices, uvs, this._color, z, f32buffer, ui32buffer, offset);
        break;
    }
    if (node._renderingType === types.FILLED && node._fillType === Scale9Sprite.FillType.RADIAL) {
        this.vertexType = cc.renderer.VertexType.TRIANGLE;
    }
    else {
        this.vertexType = cc.renderer.VertexType.QUAD;
    }
    return len;
};

proto.setState = function (state) {
    if (state === Scale9Sprite.state.NORMAL) {
        this._shaderProgram = cc.shaderCache.programForKey(cc.macro.SHADER_SPRITE_POSITION_TEXTURECOLOR);
    } else if (state === Scale9Sprite.state.GRAY) {
        this._shaderProgram = cc.Scale9Sprite.WebGLRenderCmd._getGrayShaderProgram();
    } else if (state === Scale9Sprite.state.DISTORTION) {
        this._shaderProgram = cc.Scale9Sprite.WebGLRenderCmd._getDistortionProgram();
    }
};

Scale9Sprite.WebGLRenderCmd._grayShaderProgram = null;
Scale9Sprite.WebGLRenderCmd._getGrayShaderProgram = function(){
    var grayShader = Scale9Sprite.WebGLRenderCmd._grayShaderProgram;
    if (grayShader)
        return grayShader;

    grayShader = new cc.GLProgram();
    grayShader.initWithVertexShaderByteArray(cc.PresetShaders.SPRITE_POSITION_TEXTURE_COLOR_VERT, cc.Scale9Sprite.WebGLRenderCmd._grayShaderFragment);
    grayShader.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
    grayShader.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
    grayShader.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
    grayShader.link();
    grayShader.updateUniforms();

    Scale9Sprite.WebGLRenderCmd._grayShaderProgram = grayShader;
    return grayShader;
};

Scale9Sprite.WebGLRenderCmd._grayShaderFragment =
    "precision lowp float;\n"
    + "varying vec4 v_fragmentColor; \n"
    + "varying vec2 v_texCoord; \n"
    + "void main() \n"
    + "{ \n"
    + "    vec4 c = texture2D(CC_Texture0, v_texCoord); \n"
    + "    gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b); \n"
    +"     gl_FragColor.w = c.w ; \n"
    + "}";

Scale9Sprite.WebGLRenderCmd._distortionProgram = null;
Scale9Sprite.WebGLRenderCmd._getDistortionProgram = function(){
    var shader = Scale9Sprite.WebGLRenderCmd._distortionProgram;
    if(shader)
        return shader;

    shader = new cc.GLProgram();
    shader.initWithVertexShaderByteArray(cc.PresetShaders.SPRITE_POSITION_TEXTURE_COLOR_VERT, distortionSpriteShader.fShader);
    shader.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
    shader.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
    shader.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
    shader.link();
    shader.updateUniforms();

    Scale9Sprite.WebGLRenderCmd._distortionProgram = shader;
    Scale9Sprite.WebGLRenderCmd._distortionOffset = shader.getUniformLocationForName('u_offset');
    Scale9Sprite.WebGLRenderCmd._distortionTiling = shader.getUniformLocationForName('u_offset_tiling');
    return shader;
};

var distortionSpriteShader = {
    shaderKey: 'cc.Sprite.Shader.Distortion',
    fShader:  "precision lowp float;\n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "uniform vec2 u_offset; \n"
        + "uniform vec2 u_offset_tiling; \n"
        + "const float PI = 3.14159265359;\n"
        + "void main() \n"
        + "{ \n"
        + "float halfPI = 0.5 * PI;\n"
        + "float maxFactor = sin(halfPI);\n"
        + "vec2 uv = v_texCoord;\n"
        + "vec2 xy = 2.0 * uv.xy - 1.0;\n"
        + "float d = length(xy);\n"
        + "if (d < (2.0-maxFactor)) {\n"
        + "d = length(xy * maxFactor);\n"
        + "float z = sqrt(1.0 - d * d);\n"
        + " float r = atan(d, z) / PI;\n"
        + "float phi = atan(xy.y, xy.x);\n"
        + "uv.x = r * cos(phi) + 0.5;\n"
        + "uv.y = r * sin(phi) + 0.5;\n"
        + "} else {\n"
        + "discard;\n"
        + "}\n"
        + "uv = uv * u_offset_tiling + u_offset;\n"
        + "uv = fract(uv); \n"
        + "gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, uv);\n"
        + "}"
};
