/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 
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
#pragma once

#include "base/ccMacros.h"
#include "math/Vec2.h"
#include "platform/CCGL.h"
#include "base/CCGLUtils.h"

NS_CC_BEGIN

struct VertexAttributePointerInfo;

class RenderTexture
{
public:
    RenderTexture(int width, int height);
    ~RenderTexture();
    
    void init(int factor);
    
    /** Do some work before draw, such as:
      * - bind frame buffer
      * - set viewport
      * This function should be invoked at the begin of rendering the frame.
     */
    void prepare();
    void draw();
    
private:
    bool initProgram();
    void initTexture();
    bool compileShader(GLuint& shader, GLenum type, const GLchar* source) const;
    bool parseVertexAttribs();
    bool parseUniforms();
    void initVBOAndVAO();
    void initVBO();
    void initFramebuffer();
    void recordPreviousGLStates(bool supportsVAO);
    void resetPreviousGLStates(bool supportsVAO) const;
    
    GLuint _texture = 0;
    GLint _mainFBO = -1;
    GLuint _FBO = 0;
    GLuint _VBO[2] = {0, 0};
    GLuint _VAO = 0;
    GLuint _depthBuffer = 0;
    GLuint _stencilBuffer = 0;
    
    GLuint _program = 0;
    GLint _vertAttributePositionLocation = -1;
    GLint _vertAttributeTextureCoordLocation = -1;
    GLint _fragUniformTextureLocation = -1;

    // the size of the render texture
    int _width = 0;
    int _height = 0;
    
    // device resolution
    Vec2 _deviceResolution;
    
    // record previous gl states
    GLint _prevVBO = 0;
    GLint _prevVIO = 0;
    const VertexAttributePointerInfo* _prevPosLocInfo = nullptr;
    const VertexAttributePointerInfo* _prevTexCoordLocInfo = nullptr;
    GLboolean _prevColorWriteMask[4] = {GL_FALSE};
    GLboolean _prevDepthTest = GL_FALSE;
    GLboolean _prevBlendTest = GL_FALSE;
    GLboolean _prevCullFase = GL_FALSE;
    GLboolean _prevStencilTest = GL_FALSE;
    GLboolean _prevScissorTest = GL_FALSE;
    GLint _prevProgram = 0;
    BoundTextureInfo* _preveBoundTextureInfo = nullptr;
};

NS_CC_END
