/****************************************************************************
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

var ccgl = cc.gl;

if (_ccsg.Node.WebGLRenderCmd) {
    cc.Scale9Sprite.WebGLRenderCmd = function (renderable) {
        _ccsg.Node.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._cachedParent = null;
        this._cacheDirty = false;
        this._quadWebBuffer = cc._renderContext.createBuffer();
        this._quadIndexBuffer = cc._renderContext.createBuffer();
        this._indices = new Int16Array(54);
        this._colorOpacityDirty = false;
    };

    var proto = cc.Scale9Sprite.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.Scale9Sprite.WebGLRenderCmd;

    proto.rendering = function (ctx){
        var node = this._node;

        var locTexture = null;
        if(node._spriteFrame) locTexture = node._spriteFrame._texture;
        if (!node.loaded() || this._displayedOpacity === 0)
            return;
        var needRebuildWebBuffer = false;

        if(node._quadsDirty){
            node._rebuildQuads();
            this._colorOpacityDirty = false;
            needRebuildWebBuffer = true;
        }
        if(this._colorOpacityDirty) {
            node._onColorOpacityDirty();
            this._colorOpacityDirty = false;
            needRebuildWebBuffer = true;
        }
        var gl = ctx || cc._renderContext ;

        if(locTexture != null)
        {
            this._shaderProgram.use();
            this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
            if(this._shaderProgram === cc.Scale9Sprite.WebGLRenderCmd._distortionProgram && this._node._distortionOffset) {
                this._shaderProgram.setUniformLocationWith2f(
                  cc.Scale9Sprite.WebGLRenderCmd._distortionOffset,
                  this._node._distortionOffset.x, this._node._distortionOffset.y
                );
                this._shaderProgram.setUniformLocationWith2f(
                  cc.Scale9Sprite.WebGLRenderCmd._distortionTiling,
                  this._node._distortionTiling.x, this._node._distortionTiling.y
                );
            }
            ccgl.blendFunc(node._blendFunc.src, node._blendFunc.dst);
            //optimize performance for javascript
            ccgl.bindTexture2DN(0, locTexture);                   // = cc.gl.bindTexture2D(locTexture);
            ccgl.enableVertexAttribs(cc.macro.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);

            gl.bindBuffer(gl.ARRAY_BUFFER, this._quadWebBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._quadIndexBuffer);
            var quads = node._quads;
            var bufferOffset = 0;
            var quadsLength = quads.length;
            var requiredIndicesLength = quadsLength * (node._isTriangle ? 3 : 6);
            if (quadsLength === 0) return;
            if (needRebuildWebBuffer)
            {
                //reallocate indices if indices is not enought or is too big
                var indices = this._indices;
                if((indices.length < requiredIndicesLength) || (indices.length > requiredIndicesLength + 128)) {
                    indices = this._indices = new Int16Array(requiredIndicesLength + 64);
                }

                var indiceIndex = 0;
                gl.bufferData(gl.ARRAY_BUFFER,quads[0].arrayBuffer.byteLength * quads.length, gl.DYNAMIC_DRAW);
                for(var i = 0; i < quads.length; ++i) {
                    gl.bufferSubData(gl.ARRAY_BUFFER, bufferOffset,quads[i].arrayBuffer);
                    bufferOffset = bufferOffset + quads[i].arrayBuffer.byteLength;
                    if(node._isTriangle === true) {
                        indices[indiceIndex] = i * 4;
                        indices[indiceIndex+1] = i * 4 + 1;
                        indices[indiceIndex+2] = i * 4 + 2;
                        indiceIndex += 3;
                    } else {
                        indices[indiceIndex] = i * 4;
                        indices[indiceIndex+1] = i * 4 + 1;
                        indices[indiceIndex+2] = i * 4 + 2;
                        indices[indiceIndex+3] = i * 4 + 3;
                        indices[indiceIndex+4] = i * 4 + 2;
                        indices[indiceIndex+5] = i * 4 + 1;
                        indiceIndex += 6;
                    }
                }
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices, gl.DYNAMIC_DRAW);

            }
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);                   //cc.macro.VERTEX_ATTRIB_POSITION
            gl.vertexAttribPointer(1, 4, gl.UNSIGNED_BYTE, true, 24, 12);           //cc.macro.VERTEX_ATTRIB_COLOR
            gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 24, 16);                  //cc.macro.VERTEX_ATTRIB_TEX_COORDS

            gl.drawElements(gl.TRIANGLES, (node._isTriangle ? 3 : 6) * quadsLength,gl.UNSIGNED_SHORT,0);


            cc.g_NumberOfDraws += 1;

        }

    };

    proto._syncDisplayOpacity = function (parentOpacity) {
        _ccsg.Node.WebGLRenderCmd.prototype._syncDisplayOpacity.call(this, parentOpacity);
        this._colorOpacityDirty = true;
    };

    proto._updateDisplayOpacity = function(parentOpacity){
        _ccsg.Node.WebGLRenderCmd.prototype._updateDisplayOpacity.call(this, parentOpacity);
        this._colorOpacityDirty = true;
    };

    proto._syncDisplayColor = function (parentColor) {
        _ccsg.Node.WebGLRenderCmd.prototype._syncDisplayColor.call(this, parentColor);
        this._colorOpacityDirty = true;
    };

    proto._updateDisplayColor = function(parentColor){
        _ccsg.Node.WebGLRenderCmd.prototype._updateDisplayColor.call(this, parentColor);
        this._colorOpacityDirty = true;
    };

    proto.setState = function (state) {
        var node = this._node;
        if (state === cc.Scale9Sprite.state.NORMAL) {
            node.setShaderProgram(cc.shaderCache.programForKey(cc.macro.SHADER_POSITION_TEXTURECOLOR));
        } else if (state === cc.Scale9Sprite.state.GRAY) {
            node.setShaderProgram(cc.Scale9Sprite.WebGLRenderCmd._getGrayShaderProgram());
        } else if (state === cc.Scale9Sprite.state.DISTORTION) {
            node.setShaderProgram(cc.Scale9Sprite.WebGLRenderCmd._getDistortionProgram());
        }
    };

    cc.Scale9Sprite.WebGLRenderCmd._grayShaderProgram = null;
    cc.Scale9Sprite.WebGLRenderCmd._getGrayShaderProgram = function(){
        var grayShader = cc.Scale9Sprite.WebGLRenderCmd._grayShaderProgram;
        if(grayShader)
            return grayShader;

        grayShader = new cc.GLProgram();
        grayShader.initWithVertexShaderByteArray(cc.PresetShaders.POSITION_TEXTURE_COLOR_VERT, cc.Scale9Sprite.WebGLRenderCmd._grayShaderFragment);
        grayShader.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
        grayShader.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
        grayShader.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        grayShader.link();
        grayShader.updateUniforms();

        cc.Scale9Sprite.WebGLRenderCmd._grayShaderProgram = grayShader;
        return grayShader;
    };

    cc.Scale9Sprite.WebGLRenderCmd._grayShaderFragment =
        "precision lowp float;\n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    vec4 c = texture2D(CC_Texture0, v_texCoord); \n"
        + "    gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b); \n"
        +"     gl_FragColor.w = c.w ; \n"
        + "}";

    cc.Scale9Sprite.WebGLRenderCmd._distortionProgram = null;
    cc.Scale9Sprite.WebGLRenderCmd._getDistortionProgram = function(){
        var shader = cc.Scale9Sprite.WebGLRenderCmd._distortionProgram;
        if(shader)
            return shader;

        shader = new cc.GLProgram();
        shader.initWithVertexShaderByteArray(cc.PresetShaders.POSITION_TEXTURE_COLOR_VERT, distortionSpriteShader.fShader);
        shader.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
        shader.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
        shader.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        shader.link();
        shader.updateUniforms();

        cc.Scale9Sprite.WebGLRenderCmd._distortionProgram = shader;
        cc.Scale9Sprite.WebGLRenderCmd._distortionOffset = shader.getUniformLocationForName('u_offset');
        cc.Scale9Sprite.WebGLRenderCmd._distortionTiling = shader.getUniformLocationForName('u_offset_tiling');
        return shader;
    };

    var distortionSpriteShader = {
    };
    distortionSpriteShader.shaderKey = 'cc.Sprite.Shader.Distortion';
    distortionSpriteShader.fShader =  "precision lowp float;\n"
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
        + "}";
}
