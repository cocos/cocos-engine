
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

#include "CCRenderTexture.h"
#include <stdlib.h>
#include <string>
#include "base/ccMacros.h"
#include "base/CCConfiguration.h"
#include "platform/CCPlatformConfig.h"
#include "platform/CCApplication.h"

NS_CC_BEGIN

RenderTexture::RenderTexture(int width, int height)
: _deviceResolution( {(float)width, (float)height} )
{
}

RenderTexture::~RenderTexture()
{
    if (_program)
    {
        glDeleteProgram(_program);
        _program = 0;
    }
    
    if (_VBO[0])
    {
        glDeleteBuffers(1, _VBO);
        _VBO[0] = _VBO[1] = 0;
    }
    
    if (_texture)
    {
        glDeleteTextures(1, &_texture);
        _texture = 0;
    }
    
    if (_FBO)
    {
        glDeleteFramebuffers(1, &_FBO);
        _FBO = 0;
    }
    
    if (_depthBuffer)
    {
        glDeleteRenderbuffers(1, &_depthBuffer);
        _depthBuffer = 0;
    }
    
    if (_stencilBuffer)
    {
        glDeleteRenderbuffers(1, &_stencilBuffer);
        _stencilBuffer = 0;
    }
}

void RenderTexture::init(int factor)
{
    _width = _deviceResolution.x / factor;
    _height = _deviceResolution.y / factor;
    
    if (! initProgram())
        return;
    
    initTexture();
    
    if (Configuration::getInstance()->supportsShareableVAO())
        initVBOAndVAO();
    else
        initVBO();
    
    initFramebuffer();
}

void RenderTexture::prepare()
{
    glBindFramebuffer(GL_FRAMEBUFFER, _FBO);
    ccViewport(0, 0, _width, _height);
}

void RenderTexture::draw()
{
    bool supportsVAO = Configuration::getInstance()->supportsShareableVAO();

    recordPreviousGLStates(supportsVAO);

    glBindFramebuffer(GL_FRAMEBUFFER, _mainFBO);
    ccViewport(0, 0, _deviceResolution.x, _deviceResolution.y);
    
    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_FALSE);
    glDisable(GL_DEPTH_TEST);
    glDisable(GL_STENCIL_TEST);
    glDisable(GL_BLEND);
    glDisable(GL_CULL_FACE);
    glDisable(GL_SCISSOR_TEST);

    glActiveTexture(GL_TEXTURE0 + 0);
    glBindTexture(GL_TEXTURE_2D, _texture);
    
    glUseProgram(_program);
    glUniform1i(_fragUniformTextureLocation, 0);
    
    if (supportsVAO)
        glBindVertexArray(_VAO);
    else
    {
        glBindBuffer(GL_ARRAY_BUFFER, _VBO[0]);
        glEnableVertexAttribArray(_vertAttributePositionLocation);
        glVertexAttribPointer(_vertAttributePositionLocation, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (GLvoid*)0);
        glEnableVertexAttribArray(_vertAttributeTextureCoordLocation);
        glVertexAttribPointer(_vertAttributeTextureCoordLocation, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (GLvoid*)(2 * sizeof(float)));

        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _VBO[1]);
    }
    
    glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, (GLvoid*)0);
    
    CHECK_GL_ERROR_DEBUG();

    resetPreviousGLStates(supportsVAO);
}

//
// Private functions
//

void RenderTexture::recordPreviousGLStates(bool supportsVOA)
{
    if (!supportsVOA)
    {
        _prevPosLocInfo = getVertexAttribPointerInfo(_vertAttributePositionLocation);
        _prevTexCoordLocInfo = getVertexAttribPointerInfo(_vertAttributeTextureCoordLocation);
        _prevVBO = ccGetBoundVertexBuffer();
        _prevVIO = ccGetBoundIndexBuffer();
    }
    
    _preveBoundTextureInfo = getBoundTextureInfo(0);
    
    glGetBooleanv(GL_COLOR_WRITEMASK, _prevColorWriteMask);
    glGetBooleanv(GL_DEPTH_TEST, &_prevDepthTest);
    glGetBooleanv(GL_BLEND, &_prevBlendTest);
    glGetBooleanv(GL_CULL_FACE, &_prevCullFase);
    glGetBooleanv(GL_STENCIL_TEST, &_prevStencilTest);
    glGetBooleanv(GL_SCISSOR_TEST,&_prevScissorTest);
    glGetIntegerv(GL_CURRENT_PROGRAM, &_prevProgram);
}

void RenderTexture::resetPreviousGLStates(bool supportsVAO) const
{
    glUseProgram(_prevProgram);
    if (supportsVAO)
        glBindVertexArray(0);
    else
    {
        if (_prevPosLocInfo)
        {
            glBindBuffer(GL_ARRAY_BUFFER, _prevPosLocInfo->VBO);
            glVertexAttribPointer(_prevPosLocInfo->index,
                                  _prevPosLocInfo->size,
                                  _prevPosLocInfo->type,
                                  _prevPosLocInfo->normalized,
                                  _prevPosLocInfo->stride,
                                  _prevPosLocInfo->pointer);
        }
        if (_prevTexCoordLocInfo)
        {
            glBindBuffer(GL_ARRAY_BUFFER, _prevTexCoordLocInfo->VBO);
            glVertexAttribPointer(_prevTexCoordLocInfo->index,
                                  _prevTexCoordLocInfo->size,
                                  _prevTexCoordLocInfo->type,
                                  _prevTexCoordLocInfo->normalized,
                                  _prevTexCoordLocInfo->stride,
                                  _prevTexCoordLocInfo->pointer);
        }
        
        glBindBuffer(GL_ARRAY_BUFFER, _prevVBO);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _prevVIO);
    }
    glColorMask(_prevColorWriteMask[0], _prevColorWriteMask[1], _prevColorWriteMask[2], _prevColorWriteMask[3]);
    if (GL_TRUE == _prevDepthTest) glEnable(GL_DEPTH_TEST);
    if (GL_TRUE == _prevBlendTest) glEnable(GL_BLEND);
    if (GL_TRUE == _prevCullFase) glEnable(GL_CULL_FACE);
    if (GL_TRUE == _prevStencilTest) glEnable(GL_STENCIL_TEST);
    if (GL_TRUE == _prevScissorTest) glEnable(GL_SCISSOR_TEST);

    if(_preveBoundTextureInfo != nullptr) {
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(_preveBoundTextureInfo->target, _preveBoundTextureInfo->texture);
    }
}

namespace
{
    std::string logForOpenGLShader(GLuint shader)
    {
        GLint logLength = 0;
        
        glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &logLength);
        if (logLength < 1)
            return "";
        
        char *logBytes = (char*)malloc(sizeof(char) * logLength);
        glGetShaderInfoLog(shader, logLength, nullptr, logBytes);
        std::string ret(logBytes);
        
        free(logBytes);
        return ret;
    }
}

bool RenderTexture::parseVertexAttribs()
{
    _vertAttributePositionLocation = glGetAttribLocation(_program, "a_position");
    if (-1 == _vertAttributePositionLocation)
    {
        CCLOG("RenderTexture: %s: can not find vertex attribute of a_position", __FUNCTION__);
        return false;
    }
    
    _vertAttributeTextureCoordLocation = glGetAttribLocation(_program, "a_texCoord");
    if (-1 == _vertAttributeTextureCoordLocation)
    {
        CCLOG("RenderTexture: %s: can not find vertex attribute of a_texCoord", __FUNCTION__);
        return false;
    }
    
    return true;
}

bool RenderTexture::parseUniforms()
{
    _fragUniformTextureLocation = glGetUniformLocation(_program, "u_texture");
    if (-1 == _fragUniformTextureLocation)
    {
        CCLOG("RenderTexture: %s: can not find uniform location of u_texture", __FUNCTION__);
        return false;
    }
    else
        return true;
}

bool RenderTexture::compileShader(GLuint& shader, GLenum type, const GLchar* source) const
{
    shader = glCreateShader(type);
    glShaderSource(shader, 1, &source, nullptr);
    glCompileShader(shader);
    
    GLint status = 0;
    glGetShaderiv(shader, GL_COMPILE_STATUS, &status);
    if (! status)
    {
        CCLOG("RenderTexture: ERROR: Failed to compile shader:\n%s", source);
        CCLOG("RenderTexture: %s", logForOpenGLShader(shader).c_str());
        
        return false;
    }
    
    return (GL_TRUE == status);
}

bool RenderTexture::initProgram()
{
    GLuint vertShader = 0;
    GLuint fragShader = 0;
    
    // compile vertex shader
    const char* vert = R"(
#ifdef GL_ES
    precision highp float;
#endif
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main()
    {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = a_texCoord;
    }
    )";
    if (! compileShader(vertShader, GL_VERTEX_SHADER, vert))
    {
        CCLOG("RenderTexture: ERROR: Failed to compile vertex shader");
        return false;
    }
    
    // compile fragment shader
    const char* frag = R"(
#ifdef GL_ES
    precision highp float;
#endif
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    void main()
    {
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
    )";
    if (! compileShader(fragShader, GL_FRAGMENT_SHADER, frag))
    {
        CCLOG("RenderTexture: ERROR: Failed to compile fragment shader");
        glDeleteShader(vertShader);
        return false;
    }
    
    // create program
    _program = glCreateProgram();
    if (! _program)
    {
        glDeleteShader(vertShader);
        glDeleteShader(fragShader);
        return false;
    }
    glAttachShader(_program, vertShader);
    glAttachShader(_program, fragShader);
    glLinkProgram(_program);
    
    glDeleteShader(vertShader);
    glDeleteShader(fragShader);
    
    GLint status = 0;
    glGetProgramiv(_program, GL_LINK_STATUS, &status);
    if (GL_FALSE == status)
    {
        CCLOG("RenderTexture: ERROR: %s: failed to link program ", __FUNCTION__);
        glDeleteProgram(_program);
        _program = 0;
        return false;
    }
    
    if (! parseVertexAttribs())
        return false;
    
    if (! parseUniforms())
        return false;
    
    return true;
}

void RenderTexture::initTexture()
{
    glGenTextures(1, &_texture);
    
    glBindTexture(GL_TEXTURE_2D, _texture);
    unsigned char* texData = (unsigned char*)malloc(_width * _height * 3);
    memset(texData, 0, _width * _height * 3);

    GLint alignment = 1;
    int bytesPerRow = _width * 3;
    if (bytesPerRow % 8 == 0)
        alignment = 8;
    else if (bytesPerRow % 4 == 0)
        alignment = 4;
    else if (bytesPerRow % 2 == 0)
        alignment = 2;

    glPixelStorei(GL_UNPACK_ALIGNMENT, alignment);
    glTexImage2D(GL_TEXTURE_2D,
                 0,
                 GL_RGB,
                 _width,
                 _height,
                 0,
                 GL_RGB,
                 GL_UNSIGNED_BYTE,
                 texData);
    
    free(texData);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    glBindTexture(GL_TEXTURE_2D, 0);
    
    CHECK_GL_ERROR_DEBUG();
}

void RenderTexture::initVBO()
{
    glGenBuffers(2, _VBO);
    
    // vertex buffer
    glBindBuffer(GL_ARRAY_BUFFER, _VBO[0]);
    float vertices[] = {
        1.f,  1.f, 1.f, 1.f,  // top right
        1.f, -1.f, 1.f, 0.f,  // bottom right
        -1.f, -1.f, 0.f, 0.f,  // bottom left
        -1.f,  1.f, 0.f, 1.f,  // top left
    };
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    
    // index buffer
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _VBO[1]);
    unsigned int indices[] = { 0, 1, 3,
        1, 2, 3
    };
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
    
    CHECK_GL_ERROR_DEBUG();
}

void RenderTexture::initVBOAndVAO()
{
    glGenVertexArrays(1, &_VAO);
    glGenBuffers(2, _VBO);
    glBindVertexArray(_VAO);
    
    // vertex buffer
    glBindBuffer(GL_ARRAY_BUFFER, _VBO[0]);
    float vertices[] = {
        1.f,  1.f, 1.f, 1.f,  // top right
        1.f, -1.f, 1.f, 0.f,  // bottom right
        -1.f, -1.f, 0.f, 0.f,  // bottom left
        -1.f,  1.f, 0.f, 1.f,  // top left
    };
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
    
    // index buffer
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _VBO[1]);
    unsigned int indices[] = { 0, 1, 3,
        1, 2, 3
    };
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);
    
    // position attribute
    glEnableVertexAttribArray(_vertAttributePositionLocation);
    glVertexAttribPointer(_vertAttributePositionLocation, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (GLvoid*)0);
    // texture coord attribute
    glEnableVertexAttribArray(_vertAttributeTextureCoordLocation);
    glVertexAttribPointer(_vertAttributeTextureCoordLocation, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (GLvoid*)(2 * sizeof(float)));
    
    glBindVertexArray(0);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
    
    CHECK_GL_ERROR_DEBUG();
}

void RenderTexture::initFramebuffer()
{
    _mainFBO = Application::getInstance()->getMainFBO();
    glGenFramebuffers(1, &_FBO);
    glBindFramebuffer(GL_FRAMEBUFFER, _FBO);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, _texture, 0);

    ccActiveOffScreenFramebuffer(_FBO);

    // set up depth buffer and stencil buffer
#if(CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    if(Configuration::getInstance()->supportsOESPackedDepthStencil())
    {
        //create and attach depth buffer
        glGenRenderbuffers(1, &_depthBuffer);
        glBindRenderbuffer(GL_RENDERBUFFER, _depthBuffer);
        glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8, (GLsizei)_width, (GLsizei)_height);
        glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, _depthBuffer);
        glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, _depthBuffer);
    }
    else
    {
        glGenRenderbuffers(1, &_depthBuffer);
        glGenRenderbuffers(1, &_stencilBuffer);
        glBindRenderbuffer(GL_RENDERBUFFER, _depthBuffer);
        
        if(Configuration::getInstance()->supportsOESDepth24())
            glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT24_OES, (GLsizei)_width, (GLsizei)_height);
        else
            glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT16, (GLsizei)_width, (GLsizei)_height);
        
        glBindRenderbuffer(GL_RENDERBUFFER, _stencilBuffer);
        glRenderbufferStorage(GL_RENDERBUFFER, GL_STENCIL_INDEX8,  (GLsizei)_width, (GLsizei)_height);
        
        glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, _depthBuffer);
        glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, _stencilBuffer);
    }
#else
    //create and attach depth buffer
    glGenRenderbuffers(1, &_depthBuffer);
    glBindRenderbuffer(GL_RENDERBUFFER, _depthBuffer);
    glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8, (GLsizei)_width, (GLsizei)_height);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, _depthBuffer);
    
    // if depth format is the one with stencil part, bind same render buffer as stencil attachment
//    if (_depthAndStencilFormat == GL_DEPTH24_STENCIL8)
    {
        glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, _depthBuffer);
    }
#endif
    
    
    if(glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
        CCLOG("RenderTexture: %s : frame buffer is not complete.", __FUNCTION__);
    
    glBindFramebuffer(GL_FRAMEBUFFER, _mainFBO);
}

NS_CC_END
