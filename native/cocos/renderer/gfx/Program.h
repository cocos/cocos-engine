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

#include "../Macro.h"
#include "../Types.h"

#include "GraphicsHandle.h"

#include <string>
#include <vector>

RENDERER_BEGIN

class DeviceGraphics;

class Program final: public GraphicsHandle
{
public:
    struct Attribute
    {
        std::string name;
        GLsizei size;
        GLuint location;
        GLenum type;
    };

    struct Uniform
    {
        std::string name;
        GLsizei size;
        GLint location;
        GLenum type;
        void setUniform(const void* value, UniformElementType elementType) const;
        using SetUniformCallback = void (*)(GLint, GLsizei, const void*, UniformElementType); // location, count, value, elementType
    private:
        SetUniformCallback _callback;
        friend class Program;
    };

    RENDERER_DEFINE_CREATE_METHOD_3(Program, init, DeviceGraphics*, const char*, const char*)
    Program();
    virtual ~Program();

    bool init(DeviceGraphics* device, const char* vertSource, const char* fragSource);
    inline uint32_t getID() const { return _id; }
    inline const std::vector<Attribute>& getAttributes() const { return _attributes; }
    inline const std::vector<Uniform>& getUniforms() const { return _uniforms; }
    inline bool isLinked() const { return _linked; }
    void link();
private:
    DeviceGraphics* _device;
    std::vector<Attribute> _attributes;
    std::vector<Uniform> _uniforms;
    std::string _vertSource;
    std::string _fragSource;
    uint32_t _id;
    bool _linked;
};

RENDERER_END
