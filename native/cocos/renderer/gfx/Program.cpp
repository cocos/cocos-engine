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

#include "Program.h"
#include "GFXUtils.h"

#include <unordered_map>
#include <stdlib.h>
#include <string.h>

namespace {

    uint32_t _genID = 0;

    std::string logForOpenGLShader(GLuint shader)
    {
        GLint logLength = 0;

        GL_CHECK(glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &logLength));
        if (logLength < 1)
            return "";

        char *logBytes = (char*)malloc(sizeof(char) * logLength);
        GL_CHECK(glGetShaderInfoLog(shader, logLength, nullptr, logBytes));
        std::string ret(logBytes);

        free(logBytes);
        return ret;
    }

    std::string logForOpenGLProgram(GLuint program)
    {
        GLint logLength = 0;

        GL_CHECK(glGetProgramiv(program, GL_INFO_LOG_LENGTH, &logLength));
        if (logLength < 1)
            return "";

        char *logBytes = (char*)malloc(sizeof(char) * logLength);
        GL_CHECK(glGetProgramInfoLog(program, logLength, nullptr, logBytes));
        std::string ret(logBytes);

        free(logBytes);
        return ret;
    }

    bool _createShader(GLenum type, const std::string& src, GLuint* outShader)
    {
        assert(outShader != nullptr);
        GLuint shader = glCreateShader(type);
        const GLchar* sources[] = { src.c_str() };
        GL_CHECK(glShaderSource(shader, 1, sources, nullptr));
        GL_CHECK(glCompileShader(shader));

        GLint status;
        GL_CHECK(glGetShaderiv(shader, GL_COMPILE_STATUS, &status));

        if (!status)
        {
            GLsizei length;
            GL_CHECK(glGetShaderiv(shader, GL_SHADER_SOURCE_LENGTH, &length));
            GLchar* src = (GLchar *)malloc(sizeof(GLchar) * length);

            GL_CHECK(glGetShaderSource(shader, length, nullptr, src));
            RENDERER_LOGE("ERROR: Failed to compile shader:\n%s", src);

            std::string shaderLog = logForOpenGLShader(shader);
            RENDERER_LOGE("%s", shaderLog.c_str());

            free(src);

            *outShader = 0;
            return false;
        }

        *outShader = shader;
        return true;
    }

#define DEF_TO_INT(pointer)  (*(int*)(pointer))
#define DEF_TO_FLOAT(pointer)  (*(float*)(pointer))

    void setUniform1i(GLint location, GLsizei count , const void* value, cocos2d::renderer::UniformElementType elementType)
    {
        assert(count == 1);
        if (elementType == cocos2d::renderer::UniformElementType::INT)
        {
            glUniform1i(location, DEF_TO_INT(value));
        }
        else
        {
            float floatVal = *((float*)value);
            GLint intVal = (GLint)floatVal;
            glUniform1i(location, intVal);
        }
    }

    void setUniform1iv(GLint location, GLsizei count , const void* value, cocos2d::renderer::UniformElementType elementType)
    {
        glUniform1iv(location, count, (const GLint*)value);
    }

    void setUniform2iv(GLint location, GLsizei count , const void* value, cocos2d::renderer::UniformElementType elementType)
    {
        glUniform2iv(location, count, (const GLint*)value);
    }

    void setUniform3iv(GLint location, GLsizei count , const void* value, cocos2d::renderer::UniformElementType elementType)
    {
        glUniform3iv(location, count, (const GLint*)value);
    }

    void setUniform4iv(GLint location, GLsizei count , const void* value, cocos2d::renderer::UniformElementType elementType)
    {
        glUniform4iv(location, count, (const GLint*)value);
    }

    void setUniform1f(GLint location, GLsizei count , const void* value, cocos2d::renderer::UniformElementType elementType)
    {
        assert(count == 1);
        glUniform1f(location, DEF_TO_FLOAT(value));
    }

    void setUniform1fv(GLint location, GLsizei count , const void* value, cocos2d::renderer::UniformElementType elementType)
    {
        glUniform1fv(location, count, (const GLfloat*)value);
    }

    void setUniform2fv(GLint location, GLsizei count , const void* value, cocos2d::renderer::UniformElementType elementType)
    {
        glUniform2fv(location, count, (const GLfloat*)value);
    }

    void setUniform3fv(GLint location, GLsizei count , const void* value, cocos2d::renderer::UniformElementType elementType)
    {
        glUniform3fv(location, count, (const GLfloat*)value);
    }

    void setUniform4fv(GLint location, GLsizei count , const void* value, cocos2d::renderer::UniformElementType elementType)
    {
        glUniform4fv(location, count, (const GLfloat*)value);
    }

    void setUniformMatrix2fv(GLint location, GLsizei count, const void *value, cocos2d::renderer::UniformElementType elementType)
    {
        glUniformMatrix2fv(location, count, GL_FALSE, (const GLfloat*)value);
    }

    void setUniformMatrix3fv(GLint location, GLsizei count, const void *value, cocos2d::renderer::UniformElementType elementType)
    {
        glUniformMatrix3fv(location, count, GL_FALSE, (const GLfloat*)value);
    }

    void setUniformMatrix4fv(GLint location, GLsizei count, const void *value, cocos2d::renderer::UniformElementType elementType)
    {
        glUniformMatrix4fv(location, count, GL_FALSE, (const GLfloat*)value);
    }

    /**
     * _type2uniformCommit
     */
    std::unordered_map<GLenum, cocos2d::renderer::Program::Uniform::SetUniformCallback> _type2uniformCommit = {
        { GL_INT, setUniform1i },
        { GL_FLOAT, setUniform1f },
        { GL_FLOAT_VEC2, setUniform2fv },
        { GL_FLOAT_VEC3, setUniform3fv },
        { GL_FLOAT_VEC4, setUniform4fv },
        { GL_INT_VEC2, setUniform2iv },
        { GL_INT_VEC3, setUniform3iv },
        { GL_INT_VEC4, setUniform4iv },
        { GL_BOOL, setUniform1i },
        { GL_BOOL_VEC2, setUniform2iv },
        { GL_BOOL_VEC3, setUniform3iv },
        { GL_BOOL_VEC4, setUniform4iv },
        { GL_FLOAT_MAT2, setUniformMatrix2fv },
        { GL_FLOAT_MAT3, setUniformMatrix3fv },
        { GL_FLOAT_MAT4, setUniformMatrix4fv },
        { GL_SAMPLER_2D, setUniform1i },
        { GL_SAMPLER_CUBE, setUniform1i }
    };

    /**
     * _type2uniformArrayCommit
     */
    std::unordered_map<GLenum, cocos2d::renderer::Program::Uniform::SetUniformCallback> _type2uniformArrayCommit = {
        { GL_INT, setUniform1iv },
        { GL_FLOAT, setUniform1fv },
        { GL_FLOAT_VEC2, setUniform2fv },
        { GL_FLOAT_VEC3, setUniform3fv },
        { GL_FLOAT_VEC4, setUniform4fv },
        { GL_INT_VEC2, setUniform2iv },
        { GL_INT_VEC3, setUniform3iv },
        { GL_INT_VEC4, setUniform4iv },
        { GL_BOOL, setUniform1iv },
        { GL_BOOL_VEC2, setUniform2iv },
        { GL_BOOL_VEC3, setUniform3iv },
        { GL_BOOL_VEC4, setUniform4iv },
        { GL_FLOAT_MAT2, setUniformMatrix2fv },
        { GL_FLOAT_MAT3, setUniformMatrix3fv },
        { GL_FLOAT_MAT4, setUniformMatrix4fv },
        { GL_SAMPLER_2D, setUniform1iv },
        { GL_SAMPLER_CUBE, setUniform1iv }
    };
} // namespace {

RENDERER_BEGIN

void Program::Uniform::setUniform(const void* value, UniformElementType elementType) const
{
    GLsizei count = size == -1 ? 1 : size;
    _callback(location, count, value, elementType);
}

Program::Program()
: _device(nullptr)
, _id(0)
, _linked(false)
{

}

Program::~Program()
{
    GL_CHECK(glDeleteProgram(_glID));
}

bool Program::init(DeviceGraphics* device, const char* vertSource, const char* fragSource)
{
    assert(device);
    assert(vertSource);
    assert(fragSource);

    _device = device;
    _vertSource = vertSource;
    _fragSource = fragSource;
    _id = _genID++;
    _linked = false;
    return true;
}

void Program::link()
{
    if (_linked) {
        return;
    }

    GLuint vertShader;
    bool ok = _createShader(GL_VERTEX_SHADER, _vertSource, &vertShader);
    if (!ok)
        return;

    GLuint fragShader;
    ok = _createShader(GL_FRAGMENT_SHADER, _fragSource, &fragShader);
    if (!ok)
    {
        glDeleteShader(vertShader);
        return;
    }

    GLuint program = glCreateProgram();
    GL_CHECK(glAttachShader(program, vertShader));
    GL_CHECK(glAttachShader(program, fragShader));
    GL_CHECK(glLinkProgram(program));

    GLint status = GL_TRUE;
    GL_CHECK(glGetProgramiv(program, GL_LINK_STATUS, &status));

    if (status == GL_FALSE)
    {
        RENDERER_LOGE("ERROR: Failed to link program: %u", program);
        std::string programLog = logForOpenGLProgram(program);
        RENDERER_LOGE("%s", programLog.c_str());
        glDeleteShader(vertShader);
        glDeleteShader(fragShader);
        glDeleteProgram(program);
        return;
    }

    glDeleteShader(vertShader);
    glDeleteShader(fragShader);

    _glID = program;

    // parse attribute
    GLint numAttributes;
    glGetProgramiv(program, GL_ACTIVE_ATTRIBUTES, &numAttributes);

    if (numAttributes > 0)
    {
        GLint length;
        glGetProgramiv(program, GL_ACTIVE_ATTRIBUTE_MAX_LENGTH, &length);

        if (length > 0)
        {
            GLchar* attribName = (GLchar*) malloc(length + 1);
            Attribute attribute;
            for (GLint i = 0; i < numAttributes; ++i) {
                // Query attribute info.
                glGetActiveAttrib(program, i, length, nullptr, &attribute.size, &attribute.type, attribName);
                attribName[length] = '\0';
                attribute.name = attribName;
                // Query the pre-assigned attribute location
                attribute.location = glGetAttribLocation(program, attribName);

                _attributes.push_back(std::move(attribute));
            }
            free(attribName);
        }
    }

    // Query and store uniforms from the program.
    GLint activeUniforms;
    glGetProgramiv(program, GL_ACTIVE_UNIFORMS, &activeUniforms);
    if (activeUniforms > 0)
    {
        GLint length;
        glGetProgramiv(program, GL_ACTIVE_UNIFORM_MAX_LENGTH, &length);
        if (length > 0)
        {
            GLchar* uniformName = (GLchar*) malloc(length + 1);

            Uniform uniform;
            for (int i = 0; i < activeUniforms; ++i)
            {
                // Query uniform info.
                GL_CHECK(glGetActiveUniform(program, i, length, nullptr, &uniform.size, &uniform.type, uniformName));
                uniformName[length] = '\0';
                bool isArray = false;
                // remove possible array '[]' from uniform name
                if (length > 3)
                {
                    char* c = strrchr(uniformName, '[');
                    if (c)
                    {
                        *c = '\0';
                        isArray = true;
                    }
                }

                uniform.name = uniformName;
                uniform.hashName = std::hash<std::string>{}(uniformName);
                GL_CHECK(uniform.location = glGetUniformLocation(program, uniformName));

                GLenum err = glGetError();
                if (err != GL_NO_ERROR)
                {
                    RENDERER_LOGE("error: 0x%x  uniformName: %s", (int)err, uniformName);
                }
                assert(err == GL_NO_ERROR);

                if (!isArray)
                {
                    uniform.size = -1;
                    auto iter = _type2uniformCommit.find(uniform.type);
                    assert(iter != _type2uniformCommit.end());
                    uniform._callback = iter->second;
                }
                else
                {
                    auto iter = _type2uniformArrayCommit.find(uniform.type);
                    assert(iter != _type2uniformArrayCommit.end());
                    uniform._callback = iter->second;
                }
                _uniforms.push_back(std::move(uniform));
            }
            
            free(uniformName);
        }
    }

    _linked = true;
}

RENDERER_END
