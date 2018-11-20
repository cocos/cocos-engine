/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#include "jsb_opengl_manual.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/manual/jsb_opengl_utils.hpp"
#include "platform/CCGL.h"
#include "cocos/base/CCGLUtils.h"

#include <regex>

using namespace cocos2d;

#if 0
#define LOG_GL_COMMAND(...) SE_LOGD(__VA_ARGS__)
#else
#define LOG_GL_COMMAND(...) 
#endif

#ifndef OPENGL_PARAMETER_CHECK
#define OPENGL_PARAMETER_CHECK 1
#endif

namespace {

    const uint32_t GL_COMMAND_ACTIVE_TEXTURE = 0;
    const uint32_t GL_COMMAND_ATTACH_SHADER = 1;
//    const uint32_t GL_COMMAND_BIND_ATTRIB_LOCATION = 2;
    const uint32_t GL_COMMAND_BIND_BUFFER = 3;
    const uint32_t GL_COMMAND_BIND_FRAME_BUFFER = 4;
    const uint32_t GL_COMMAND_BIND_RENDER_BUFFER = 5;
    const uint32_t GL_COMMAND_BIND_TEXTURE = 6;
    const uint32_t GL_COMMAND_BLEND_COLOR = 7;
    const uint32_t GL_COMMAND_BLEND_EQUATION = 8;
    const uint32_t GL_COMMAND_BLEND_EQUATION_SEPARATE = 9;
    const uint32_t GL_COMMAND_BLEND_FUNC = 10;
    const uint32_t GL_COMMAND_BLEND_FUNC_SEPARATE = 11;
//    const uint32_t GL_COMMAND_BUFFER_DATA = 12;
//    const uint32_t GL_COMMAND_BUFFER_SUB_DATA = 13;
    const uint32_t GL_COMMAND_CLEAR = 14;
    const uint32_t GL_COMMAND_CLEAR_COLOR = 15;
    const uint32_t GL_COMMAND_CLEAR_DEPTH = 16;
    const uint32_t GL_COMMAND_CLEAR_STENCIL = 17;
    const uint32_t GL_COMMAND_COLOR_MASK = 18;
//    const uint32_t GL_COMMAND_COMMIT = 19;
    const uint32_t GL_COMMAND_COMPILE_SHADER = 20;
//    const uint32_t GL_COMMAND_COMPRESSED_TEX_IMAGE_2D = 21;
//    const uint32_t GL_COMMAND_COMPRESSED_TEX_SUB_IMAGE_2D = 22;
    const uint32_t GL_COMMAND_COPY_TEX_IMAGE_2D = 23;
    const uint32_t GL_COMMAND_COPY_TEX_SUB_IMAGE_2D = 24;
    const uint32_t GL_COMMAND_CULL_FACE = 25;
    const uint32_t GL_COMMAND_DELETE_BUFFER = 26;
    const uint32_t GL_COMMAND_DELETE_FRAME_BUFFER = 27;
    const uint32_t GL_COMMAND_DELETE_PROGRAM = 28;
    const uint32_t GL_COMMAND_DELETE_RENDER_BUFFER = 29;
    const uint32_t GL_COMMAND_DELETE_SHADER = 30;
    const uint32_t GL_COMMAND_DELETE_TEXTURE = 31;
    const uint32_t GL_COMMAND_DEPTH_FUNC = 32;
    const uint32_t GL_COMMAND_DEPTH_MASK = 33;
    const uint32_t GL_COMMAND_DEPTH_RANGE = 34;
    const uint32_t GL_COMMAND_DETACH_SHADER = 35;
    const uint32_t GL_COMMAND_DISABLE = 36;
    const uint32_t GL_COMMAND_DISABLE_VERTEX_ATTRIB_ARRAY = 37;
    const uint32_t GL_COMMAND_DRAW_ARRAYS = 38;
    const uint32_t GL_COMMAND_DRAW_ELEMENTS = 39;
    const uint32_t GL_COMMAND_ENABLE = 40;
    const uint32_t GL_COMMAND_ENABLE_VERTEX_ATTRIB_ARRAY = 41;
    const uint32_t GL_COMMAND_FINISH = 42;
    const uint32_t GL_COMMAND_FLUSH = 43;
    const uint32_t GL_COMMAND_FRAME_BUFFER_RENDER_BUFFER = 44;
    const uint32_t GL_COMMAND_FRAME_BUFFER_TEXTURE_2D = 45;
    const uint32_t GL_COMMAND_FRONT_FACE = 46;
    const uint32_t GL_COMMAND_GENERATE_MIPMAP = 47;
    const uint32_t GL_COMMAND_HINT = 48;
    const uint32_t GL_COMMAND_LINE_WIDTH = 49;
    const uint32_t GL_COMMAND_LINK_PROGRAM = 50;
    const uint32_t GL_COMMAND_PIXEL_STOREI = 51;
    const uint32_t GL_COMMAND_POLYGON_OFFSET = 52;
    const uint32_t GL_COMMAND_RENDER_BUFFER_STORAGE = 53;
    const uint32_t GL_COMMAND_SAMPLE_COVERAGE = 54;
    const uint32_t GL_COMMAND_SCISSOR = 55;
//    const uint32_t GL_COMMAND_SHADER_SOURCE = 56;
    const uint32_t GL_COMMAND_STENCIL_FUNC = 57;
    const uint32_t GL_COMMAND_STENCIL_FUNC_SEPARATE = 58;
    const uint32_t GL_COMMAND_STENCIL_MASK = 59;
    const uint32_t GL_COMMAND_STENCIL_MASK_SEPARATE = 60;
    const uint32_t GL_COMMAND_STENCIL_OP = 61;
    const uint32_t GL_COMMAND_STENCIL_OP_SEPARATE = 62;
//    const uint32_t GL_COMMAND_TEX_IMAGE_2D = 63;
    const uint32_t GL_COMMAND_TEX_PARAMETER_F = 64;
    const uint32_t GL_COMMAND_TEX_PARAMETER_I = 65;
//    const uint32_t GL_COMMAND_TEX_SUB_IMAGE_2D = 66;
    const uint32_t GL_COMMAND_UNIFORM_1F = 67;
    const uint32_t GL_COMMAND_UNIFORM_1FV = 68;
    const uint32_t GL_COMMAND_UNIFORM_1I = 69;
    const uint32_t GL_COMMAND_UNIFORM_1IV = 70;
    const uint32_t GL_COMMAND_UNIFORM_2F = 71;
    const uint32_t GL_COMMAND_UNIFORM_2FV = 72;
    const uint32_t GL_COMMAND_UNIFORM_2I = 73;
    const uint32_t GL_COMMAND_UNIFORM_2IV = 74;
    const uint32_t GL_COMMAND_UNIFORM_3F = 75;
    const uint32_t GL_COMMAND_UNIFORM_3FV = 76;
    const uint32_t GL_COMMAND_UNIFORM_3I = 77;
    const uint32_t GL_COMMAND_UNIFORM_3IV = 78;
    const uint32_t GL_COMMAND_UNIFORM_4F = 79;
    const uint32_t GL_COMMAND_UNIFORM_4FV = 80;
    const uint32_t GL_COMMAND_UNIFORM_4I = 81;
    const uint32_t GL_COMMAND_UNIFORM_4IV = 82;
    const uint32_t GL_COMMAND_UNIFORM_MATRIX_2FV = 83;
    const uint32_t GL_COMMAND_UNIFORM_MATRIX_3FV = 84;
    const uint32_t GL_COMMAND_UNIFORM_MATRIX_4FV = 85;
    const uint32_t GL_COMMAND_USE_PROGRAM = 86;
    const uint32_t GL_COMMAND_VALIDATE_PROGRAM = 87;
    const uint32_t GL_COMMAND_VERTEX_ATTRIB_1F = 88;
    const uint32_t GL_COMMAND_VERTEX_ATTRIB_2F = 89;
    const uint32_t GL_COMMAND_VERTEX_ATTRIB_3F = 90;
    const uint32_t GL_COMMAND_VERTEX_ATTRIB_4F = 91;
    const uint32_t GL_COMMAND_VERTEX_ATTRIB_1FV = 92;
    const uint32_t GL_COMMAND_VERTEX_ATTRIB_2FV = 93;
    const uint32_t GL_COMMAND_VERTEX_ATTRIB_3FV = 94;
    const uint32_t GL_COMMAND_VERTEX_ATTRIB_4FV = 95;
    const uint32_t GL_COMMAND_VERTEX_ATTRIB_POINTER = 96;
    const uint32_t GL_COMMAND_VIEW_PORT = 97;

    const uint32_t GL_FLOAT_ARRAY = 1;
    const uint32_t GL_INT_ARRAY = 2;
    const uint32_t GL_BOOL_ARRAY = 3;
    const uint32_t GL_MAX_STRIDE = 255;

    GLint __defaultFbo = 0;

    GLuint __glErrorCode = GL_NO_ERROR;

    se::Class* __jsb_WebGLObject_class = nullptr;
    se::Class* __jsb_WebGLTexture_class = nullptr;
    se::Class* __jsb_WebGLBuffer_class = nullptr;
    se::Class* __jsb_WebGLRenderbuffer_class = nullptr;
    se::Class* __jsb_WebGLFramebuffer_class = nullptr;
    se::Class* __jsb_WebGLProgram_class = nullptr;
    se::Class* __jsb_WebGLShader_class = nullptr;
    se::Class* __jsb_WebGLActiveInfo_class = nullptr;
//    se::Class* __jsb_WebGLUniformLocation_class = nullptr;

    std::unordered_map<GLuint, se::Value> __shaders;

    class WebGLObject;

    using WebGLObjectMap = std::unordered_map<GLuint, WebGLObject*>;
    WebGLObjectMap __webglTextureMap;
    WebGLObjectMap __webglBufferMap;
    WebGLObjectMap __webglRenderbufferMap;
    WebGLObjectMap __webglFramebufferMap;
    WebGLObjectMap __webglProgramMap;
    WebGLObjectMap __webglShaderMap;

    inline void WEBGL_framebufferRenderbuffer(GLenum target, GLenum attachment, GLenum renderbuffertarget, GLuint renderbuffer)
    {
        if (attachment == GL_DEPTH_STENCIL_ATTACHMENT)
        {
            glFramebufferRenderbuffer(target, GL_DEPTH_ATTACHMENT, renderbuffertarget, renderbuffer);
            glFramebufferRenderbuffer(target, GL_STENCIL_ATTACHMENT, renderbuffertarget, renderbuffer);
        }
        else
        {
            glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer);
        }
    }

    inline void WEBGL_renderbufferStorage(GLenum target, GLenum internalformat, GLsizei width, GLsizei height)
    {
        if (internalformat == GL_DEPTH_STENCIL )
            internalformat = GL_DEPTH24_STENCIL8;

        glRenderbufferStorage(target, internalformat, width, height);
    }

    class WebGLObject : public cocos2d::Ref
    {
    public:
        enum class Type {
            TEXTURE,
            BUFFER,
            RENDER_BUFFER,
            FRAME_BUFFER,
            PROGRAM,
            SHADER
        };

    protected:
        WebGLObject(Type type, GLuint id)
        : _type(type)
        , _id(id)
        {}

    public:
        virtual ~WebGLObject()
        {}

        GLuint _id;
        Type _type;
    };

    void safeRemoveElementFromGLObjectMap(WebGLObjectMap& map, GLuint id)
    {
        auto iter = map.find(id);
        if (iter != map.end()) {
            if (iter->second->_type == WebGLObject::Type::FRAME_BUFFER)
                iter->second->_id = __defaultFbo;
            else
                iter->second->_id = 0;
            map.erase(iter);
        }
    }

    class WebGLTexture final : public WebGLObject
    {
    public:
        WebGLTexture(GLuint id)
        : WebGLObject(Type::TEXTURE, id)
        {
            __webglTextureMap.emplace(id, this);
        }
        virtual ~WebGLTexture()
        {
            if (_id != 0)
            {
                SE_LOGD("Destroy WebGLTexture (%u) by GC\n", _id);
                JSB_GL_CHECK_VOID(glDeleteTextures(1, &_id));
                safeRemoveElementFromGLObjectMap(__webglTextureMap, _id);
            }
        }
    };

    class WebGLBuffer final : public WebGLObject
    {
    public:
        WebGLBuffer(GLuint id)
        : WebGLObject(Type::BUFFER, id)
        {
            __webglBufferMap.emplace(id, this);
        }
        virtual ~WebGLBuffer()
        {
            if (_id != 0)
            {
                SE_LOGD("Destroy WebGLBuffer (%u) by GC\n", _id);
                JSB_GL_CHECK_VOID(ccDeleteBuffers(1, &_id));
                safeRemoveElementFromGLObjectMap(__webglBufferMap, _id);
            }
        }
    };

    class WebGLRenderbuffer final : public WebGLObject
    {
    public:
        WebGLRenderbuffer(GLuint id)
        : WebGLObject(Type::RENDER_BUFFER, id)
        {
            __webglRenderbufferMap.emplace(id, this);
        }
        virtual ~WebGLRenderbuffer()
        {
            if (_id != 0)
            {
                SE_LOGD("Destroy WebGLRenderbuffer (%u) by GC\n", _id);
                JSB_GL_CHECK_VOID(glDeleteRenderbuffers(1, &_id));
                safeRemoveElementFromGLObjectMap(__webglRenderbufferMap, _id);
            }
        }
    };

    class WebGLFramebuffer final : public WebGLObject
    {
    public:
        WebGLFramebuffer(GLuint id)
        : WebGLObject(Type::FRAME_BUFFER, id)
        {
            __webglFramebufferMap.emplace(id, this);
        }
        virtual ~WebGLFramebuffer()
        {
            if (_id != __defaultFbo)
            {
                SE_LOGD("Destroy WebGLFramebuffer (%u) by GC\n", _id);
                JSB_GL_CHECK_VOID(glDeleteFramebuffers(1, &_id));
                safeRemoveElementFromGLObjectMap(__webglFramebufferMap, _id);
            }
        }
    };

    class WebGLProgram final : public WebGLObject
    {
    public:
        WebGLProgram(GLuint id)
        : WebGLObject(Type::PROGRAM, id)
        {
            __webglProgramMap.emplace(id, this);
        }
        virtual ~WebGLProgram()
        {
            if (_id != 0)
            {
                SE_LOGD("Destroy WebGLProgram (%u) by GC\n", _id);
                JSB_GL_CHECK_VOID(glDeleteProgram(_id));
                safeRemoveElementFromGLObjectMap(__webglProgramMap, _id);
            }
        }
    };

    class WebGLShader final : public WebGLObject
    {
    public:
        WebGLShader(GLuint id)
        : WebGLObject(Type::SHADER, id)
        {
            __webglShaderMap.emplace(id, this);
        }
        virtual ~WebGLShader()
        {
            if (_id != 0)
            {
                SE_LOGD("Destroy WebGLShader (%u) by GC\n", _id);
                JSB_GL_CHECK_VOID(glDeleteShader(_id));
                safeRemoveElementFromGLObjectMap(__webglShaderMap, _id);
            }
        }
    };

    template<typename T>
    class GLData
    {
    public:
        GLData()
        : _data(nullptr)
        , _count(0)
        , _isOwnData(false)
        {
        }

        ~GLData()
        {
            if (_isOwnData)
            {
                free(_data);
            }
        }

        void setData(T* data, size_t count, bool isOwnData)
        {
            _data = data;
            _count = count;
            _isOwnData = isOwnData;
        }

        T* data() const { return _data; }
        size_t count() const { return _count; }

    private:

        // Disable copy/move constructor, copy/move assigment
        GLData(const GLData&);
        GLData(GLData&&);
        GLData& operator=(const GLData&);
        GLData& operator=(GLData&&);

        T* _data;
        size_t _count;
        bool _isOwnData;
    };

}

template<typename T>
static bool JSB_jsval_typedarray_to_data(const se::Value& v, GLData<T>& data)
{
    if (v.isObject())
    {
        se::Object* obj = v.toObject();
        if (obj->isArray())
        {
            uint32_t length = 0;
            if (obj->getArrayLength(&length) && length > 0)
            {
                T* d = (T*)malloc(length * sizeof(T));
                se::Value tmp;
                for (uint32_t i = 0; i < length; ++i)
                {
                    if (obj->getArrayElement(i, &tmp))
                    {
                        if (std::is_same<T, int32_t>::value)
                        {
                            d[i] = tmp.toInt32();
                        }
                        else if (std::is_same<T, float>::value)
                        {
                            d[i] = tmp.toFloat();
                        }
                    }
                }
                data.setData(d, length, true);
                return true;
            }
            SE_LOGE("Failed to get array data");
        }
        else if (obj->isTypedArray())
        {
            size_t bytes = 0;
            uint8_t* ptr = nullptr;

            if (obj->getTypedArrayData(&ptr, &bytes) && bytes > 0)
            {
                data.setData((T*)ptr, bytes / sizeof(T), false);
                return true;
            }

            SE_LOGE("Failed to get typed array data");
        }
        else if (obj->isArrayBuffer())
        {
            size_t bytes = 0;
            uint8_t* ptr = nullptr;

            if (obj->getArrayBufferData(&ptr, &bytes) && bytes > 0)
            {
                data.setData((T*)ptr, bytes / sizeof(T), false);
                return true;
            }

            SE_LOGE("Failed to get typed array data");
        }
    }

    return false;
}

static bool JSB_get_arraybufferview_dataptr(const se::Value& v, GLsizei *count, GLvoid **data)
{
    assert(count != nullptr && data != nullptr);

    if (v.isObject())
    {
        uint8_t* ptr = nullptr;
        size_t length = 0;
        se::Object* obj = v.toObject();
        if (obj->isTypedArray())
        {
            if (obj->getTypedArrayData(&ptr, &length))
            {
                *data = ptr;
                *count = (GLsizei)length;
                return true;
            }
            else
            {
                assert(false);
            }
        }
        else if (obj->isArrayBuffer())
        {
            if (obj->getArrayBufferData(&ptr, &length))
            {
                *data = ptr;
                *count = (GLsizei)length;
                return true;
            }
            else
            {
                assert(false);
            }
        }
        else
        {
            SE_LOGE("JSB_get_arraybufferview_dataptr: isn't a typed array!\n");
        }
    }
    else if (v.isNullOrUndefined())
    {
        *count = 0;
        *data = nullptr;
        return true;
    }
    else
    {
        assert(false);
    }
    return false;
}

// Arguments: GLenum
// Ret value: void
static bool JSB_glActiveTexture(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(ccActiveTexture((GLenum)arg0));

    return true;
}
SE_BIND_FUNC(JSB_glActiveTexture)

// Arguments: GLuint, GLuint
// Ret value: void
static bool JSB_glAttachShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLProgram* arg0;
    WebGLShader* arg1;
    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_native_ptr(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLuint programId = arg0 != nullptr ? arg0->_id : 0;
    GLuint shaderId = arg1 != nullptr ? arg1->_id : 0;
    JSB_GL_CHECK(glAttachShader(programId, shaderId));

    return true;
}
SE_BIND_FUNC(JSB_glAttachShader)

// Arguments: GLuint, GLuint, char*
// Ret value: void
static bool JSB_glBindAttribLocation(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLProgram* arg0;
    uint32_t arg1;
    std::string arg2;

    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_uint32(args[1], &arg1);
    ok &= seval_to_std_string(args[2], &arg2);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLuint programId = arg0 != nullptr ? arg0->_id : 0;
    JSB_GL_CHECK(glBindAttribLocation(programId, (GLuint)arg1 , arg2.c_str()));

    return true;
}
SE_BIND_FUNC(JSB_glBindAttribLocation)

static bool JSB_glBindBuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;
    WebGLBuffer* arg1;
    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_native_ptr(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint bufferId = arg1 != nullptr ? arg1->_id : 0;
    JSB_GL_CHECK(ccBindBuffer((GLenum)arg0 , bufferId));
    return true;
}
SE_BIND_FUNC(JSB_glBindBuffer)

// Arguments: GLenum, GLuint
// Ret value: void
static bool JSB_glBindFramebuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; WebGLFramebuffer* arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_native_ptr(args[1], &arg1);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint frameBufferId = arg1 != nullptr ? arg1->_id : __defaultFbo;
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_FRAMEBUFFER, false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(ccBindFramebuffer((GLenum)arg0 , frameBufferId));
    return true;
}
SE_BIND_FUNC(JSB_glBindFramebuffer)

// Arguments: GLenum, GLuint
// Ret value: void
static bool JSB_glBindRenderbuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;
    WebGLRenderbuffer* arg1;

    ok &= seval_to_uint32(args[0], &arg0);
    ok &= seval_to_native_ptr(args[1], &arg1);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint renderBufferId = arg1 != nullptr ? arg1->_id : 0;
    JSB_GL_CHECK(glBindRenderbuffer((GLenum)arg0, renderBufferId));
    return true;
}
SE_BIND_FUNC(JSB_glBindRenderbuffer)

// Arguments: GLenum, GLuint
// Ret value: void
static bool JSB_glBindTexture(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;
    WebGLTexture* arg1 = nullptr;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_native_ptr(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_TEXTURE_2D || arg0 == GL_TEXTURE_CUBE_MAP, false, GL_INVALID_ENUM);
#endif
    GLuint textureId = arg1 != nullptr ? arg1->_id : 0;
    JSB_GL_CHECK(ccBindTexture((GLenum)arg0 , textureId));
    return true;
}
SE_BIND_FUNC(JSB_glBindTexture)

// Arguments: GLclampf, GLclampf, GLclampf, GLclampf
// Ret value: void
static bool JSB_glBlendColor(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    float arg0; float arg1; float arg2; float arg3;

    ok &= seval_to_float(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    ok &= seval_to_float(args[2], &arg2 );
    ok &= seval_to_float(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glBlendColor((GLclampf)arg0 , (GLclampf)arg1 , (GLclampf)arg2 , (GLclampf)arg3  ));

    return true;
}
SE_BIND_FUNC(JSB_glBlendColor)

// Arguments: GLenum
// Ret value: void
static bool JSB_glBlendEquation(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_FUNC_ADD || arg0 == GL_FUNC_SUBTRACT || arg0 == GL_FUNC_REVERSE_SUBTRACT,
                     false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(glBlendEquation((GLenum)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glBlendEquation)

// Arguments: GLenum, GLenum
// Ret value: void
static bool JSB_glBlendEquationSeparate(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_FUNC_ADD || arg0 == GL_FUNC_SUBTRACT || arg0 == GL_FUNC_REVERSE_SUBTRACT,
                     false, GL_INVALID_ENUM);

    SE_PRECONDITION4(arg1 == GL_FUNC_ADD || arg1 == GL_FUNC_SUBTRACT || arg1 == GL_FUNC_REVERSE_SUBTRACT,
                     false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(glBlendEquationSeparate((GLenum)arg0 , (GLenum)arg1  ));

    return true;
}
SE_BIND_FUNC(JSB_glBlendEquationSeparate)

// Arguments: GLenum, GLenum
// Ret value: void
static bool JSB_glBlendFunc(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(!((arg0 == GL_CONSTANT_COLOR && arg1 == GL_CONSTANT_ALPHA) || (arg0 == GL_ONE_MINUS_CONSTANT_COLOR && arg1 == GL_CONSTANT_ALPHA)
                          || (arg0 == GL_CONSTANT_COLOR && arg1 == GL_ONE_MINUS_CONSTANT_ALPHA) || (arg0 == GL_ONE_MINUS_CONSTANT_COLOR && arg1 == GL_ONE_MINUS_CONSTANT_ALPHA)
                          ||  (arg0 == GL_CONSTANT_ALPHA && arg1 == GL_CONSTANT_COLOR) || (arg0 == GL_CONSTANT_ALPHA && arg1 == GL_ONE_MINUS_CONSTANT_COLOR)
                          || (arg0 == GL_ONE_MINUS_CONSTANT_ALPHA && arg1 == GL_CONSTANT_COLOR) || (arg0 == GL_ONE_MINUS_CONSTANT_ALPHA && arg1 == GL_ONE_MINUS_CONSTANT_COLOR)), false, GL_INVALID_OPERATION );
#endif
    JSB_GL_CHECK(glBlendFunc((GLenum)arg0 , (GLenum)arg1  ));

    return true;
}
SE_BIND_FUNC(JSB_glBlendFunc)

// Arguments: GLenum, GLenum, GLenum, GLenum
// Ret value: void
static bool JSB_glBlendFuncSeparate(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; uint32_t arg2; uint32_t arg3;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    ok &= seval_to_uint32(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(!((arg0 == GL_CONSTANT_COLOR && arg1 == GL_CONSTANT_ALPHA) || (arg0 == GL_ONE_MINUS_CONSTANT_COLOR && arg1 == GL_CONSTANT_ALPHA)
                      || (arg0 == GL_CONSTANT_COLOR && arg1 == GL_ONE_MINUS_CONSTANT_ALPHA) || (arg0 == GL_ONE_MINUS_CONSTANT_COLOR && arg1 == GL_ONE_MINUS_CONSTANT_ALPHA)
                      ||  (arg0 == GL_CONSTANT_ALPHA && arg1 == GL_CONSTANT_COLOR) || (arg0 == GL_CONSTANT_ALPHA && arg1 == GL_ONE_MINUS_CONSTANT_COLOR)
                      || (arg0 == GL_ONE_MINUS_CONSTANT_ALPHA && arg1 == GL_CONSTANT_COLOR) || (arg0 == GL_ONE_MINUS_CONSTANT_ALPHA && arg1 == GL_ONE_MINUS_CONSTANT_COLOR)), false, GL_INVALID_OPERATION );
#endif
    JSB_GL_CHECK(glBlendFuncSeparate((GLenum)arg0 , (GLenum)arg1 , (GLenum)arg2 , (GLenum)arg3  ));

    return true;
}
SE_BIND_FUNC(JSB_glBlendFuncSeparate)

// Arguments: GLenum, ArrayBufferView, GLenum
// Ret value: void
static bool JSB_glBufferData(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0 = 0;
    void* arg1 = nullptr;
    uint32_t arg2 = 0;
    GLsizei count = 0;
    ok &= seval_to_uint32(args[0], &arg0 );
    if (args[1].isNumber())
    {
        ok &= seval_to_int32(args[1], &count);
    }
    else
    {
        ok &= JSB_get_arraybufferview_dataptr(args[1], &count, &arg1);
    }
    ok &= seval_to_uint32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_ARRAY_BUFFER || arg0 == GL_ELEMENT_ARRAY_BUFFER, false, GL_INVALID_ENUM);

    SE_PRECONDITION4(arg2 == GL_STREAM_DRAW || arg2 == GL_STATIC_DRAW || arg2 == GL_DYNAMIC_DRAW, false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(glBufferData((GLenum)arg0 , count, (GLvoid*)arg1 , (GLenum)arg2  ));

    return true;
}
SE_BIND_FUNC(JSB_glBufferData)

// Arguments: GLenum, GLintptr, ArrayBufferView
// Ret value: void
static bool JSB_glBufferSubData(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0 = 0;
    int32_t arg1 = 0;
    void* arg2 = nullptr;
    GLsizei count = 0;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= JSB_get_arraybufferview_dataptr(args[2], &count, &arg2);

    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glBufferSubData((GLenum)arg0 , (GLintptr)arg1 , count, (GLvoid*)arg2  ));

    return true;
}
SE_BIND_FUNC(JSB_glBufferSubData)

// Arguments: GLenum
// Ret value: GLenum
static bool JSB_glCheckFramebufferStatus(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLenum ret_val;
#if OPENGL_PARAMETER_CHECK
    s.rval().setUint32(0);
    SE_PRECONDITION4(arg0 == GL_FRAMEBUFFER, false, GL_INVALID_ENUM);
#endif
    ret_val = glCheckFramebufferStatus((GLenum)arg0);
    s.rval().setUint32((uint32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glCheckFramebufferStatus)

// Arguments: GLbitfield
// Ret value: void
static bool JSB_glClear(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glClear((GLbitfield)arg0));
    return true;
}
SE_BIND_FUNC(JSB_glClear)

// Arguments: GLclampf, GLclampf, GLclampf, GLclampf
// Ret value: void
static bool JSB_glClearColor(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    float arg0; float arg1; float arg2; float arg3;

    ok &= seval_to_float(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    ok &= seval_to_float(args[2], &arg2 );
    ok &= seval_to_float(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glClearColor((GLclampf)arg0 , (GLclampf)arg1 , (GLclampf)arg2 , (GLclampf)arg3  ));

    return true;
}
SE_BIND_FUNC(JSB_glClearColor)

// Arguments: GLclampf
// Ret value: void
static bool JSB_glClearDepthf(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    float arg0;

    ok &= seval_to_float(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glClearDepthf((GLclampf)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glClearDepthf)

// Arguments: GLint
// Ret value: void
static bool JSB_glClearStencil(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glClearStencil((GLint)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glClearStencil)

// Arguments: GLboolean, GLboolean, GLboolean, GLboolean
// Ret value: void
static bool JSB_glColorMask(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    uint16_t arg0; uint16_t arg1; uint16_t arg2; uint16_t arg3;

    ok &= seval_to_uint16(args[0], &arg0 );
    ok &= seval_to_uint16(args[1], &arg1 );
    ok &= seval_to_uint16(args[2], &arg2 );
    ok &= seval_to_uint16(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glColorMask((GLboolean)arg0 , (GLboolean)arg1 , (GLboolean)arg2 , (GLboolean)arg3  ));

    return true;
}
SE_BIND_FUNC(JSB_glColorMask)

// Arguments: GLuint
// Ret value: void
static bool JSB_glCompileShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLShader* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint shaderId = arg0 != nullptr ? arg0->_id : 0;
    JSB_GL_CHECK(glCompileShader(shaderId));
    return true;
}
SE_BIND_FUNC(JSB_glCompileShader)

// Arguments: GLenum, GLint, GLenum, GLsizei, GLsizei, GLint, GLsizei, ArrayBufferView
// Ret value: void
static bool JSB_glCompressedTexImage2D(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 7, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; uint32_t arg2; int32_t arg3; int32_t arg4; int32_t arg5; void* arg6;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    ok &= seval_to_int32(args[5], &arg5 );
    GLsizei count;
    ok &= JSB_get_arraybufferview_dataptr(args[6], &count, &arg6);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glCompressedTexImage2D((GLenum)arg0 , (GLint)arg1 , (GLenum)arg2 , (GLsizei)arg3 , (GLsizei)arg4 , (GLint)arg5 , (GLsizei)count , (GLvoid*)arg6  ));

    return true;
}
SE_BIND_FUNC(JSB_glCompressedTexImage2D)

// Arguments: GLenum, GLint, GLint, GLint, GLsizei, GLsizei, GLenum, GLsizei, ArrayBufferView
// Ret value: void
static bool JSB_glCompressedTexSubImage2D(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 9, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; int32_t arg2; int32_t arg3; int32_t arg4; int32_t arg5; uint32_t arg6; int32_t arg7; void* arg8;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    ok &= seval_to_int32(args[5], &arg5 );
    ok &= seval_to_uint32(args[6], &arg6 );
    ok &= seval_to_int32(args[7], &arg7 );
    GLsizei count;
    ok &= JSB_get_arraybufferview_dataptr(args[8], &count, &arg8);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glCompressedTexSubImage2D((GLenum)arg0 , (GLint)arg1 , (GLint)arg2 , (GLint)arg3 , (GLsizei)arg4 , (GLsizei)arg5 , (GLenum)arg6 , (GLsizei)arg7 , (GLvoid*)arg8  ));

    return true;
}
SE_BIND_FUNC(JSB_glCompressedTexSubImage2D)

// Arguments: GLenum, GLint, GLenum, GLint, GLint, GLsizei, GLsizei, GLint
// Ret value: void
static bool JSB_glCopyTexImage2D(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 8, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; uint32_t arg2; int32_t arg3; int32_t arg4; int32_t arg5; int32_t arg6; int32_t arg7;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    ok &= seval_to_int32(args[5], &arg5 );
    ok &= seval_to_int32(args[6], &arg6 );
    ok &= seval_to_int32(args[7], &arg7 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg2 == GL_ALPHA || arg2 == GL_RGB || arg2 == GL_RGBA || arg2 == GL_LUMINANCE || arg2 == GL_LUMINANCE_ALPHA,
                     false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(glCopyTexImage2D((GLenum)arg0 , (GLint)arg1 , (GLenum)arg2 , (GLint)arg3 , (GLint)arg4 , (GLsizei)arg5 , (GLsizei)arg6 , (GLint)arg7  ));

    return true;
}
SE_BIND_FUNC(JSB_glCopyTexImage2D)

// Arguments: GLenum, GLint, GLint, GLint, GLint, GLint, GLsizei, GLsizei
// Ret value: void
static bool JSB_glCopyTexSubImage2D(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 8, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; int32_t arg2; int32_t arg3; int32_t arg4; int32_t arg5; int32_t arg6; int32_t arg7;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    ok &= seval_to_int32(args[5], &arg5 );
    ok &= seval_to_int32(args[6], &arg6 );
    ok &= seval_to_int32(args[7], &arg7 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glCopyTexSubImage2D((GLenum)arg0 , (GLint)arg1 , (GLint)arg2 , (GLint)arg3 , (GLint)arg4 , (GLint)arg5 , (GLsizei)arg6 , (GLsizei)arg7  ));

    return true;
}
SE_BIND_FUNC(JSB_glCopyTexSubImage2D)

static bool JSB_glCreateProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 0, false, "Invalid number of arguments" );
    GLuint id = glCreateProgram();

    auto obj = se::Object::createObjectWithClass(__jsb_WebGLProgram_class);
    s.rval().setObject(obj, true);
    obj->setProperty("_id", se::Value(id));
    auto cobj = new (std::nothrow) WebGLProgram(id);
    obj->setPrivateData(cobj);
    return true;
}
SE_BIND_FUNC(JSB_glCreateProgram)

static bool JSB_glProgramFinalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (WebGLProgram)", s.nativeThisObject());
    WebGLProgram* cobj = (WebGLProgram*) s.nativeThisObject();
    if (se::ScriptEngine::getInstance()->isInCleanup())
        cobj->release();
    else
        cobj->autorelease();
    return true;
}
SE_BIND_FINALIZE_FUNC(JSB_glProgramFinalize)

// Arguments: GLenum
// Ret value: GLuint
static bool JSB_glCreateShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_VERTEX_SHADER || arg0 == GL_FRAGMENT_SHADER, false, GL_INVALID_ENUM);
#endif
    GLuint ret_val = glCreateShader((GLenum)arg0);

    se::Object* obj = se::Object::createObjectWithClass(__jsb_WebGLShader_class);
    s.rval().setObject(obj, true);
    obj->setProperty("_id", se::Value(ret_val));
    WebGLShader* shader = new (std::nothrow) WebGLShader(ret_val);
    obj->setPrivateData(shader);
    __shaders.emplace(shader->_id, s.rval());
    return true;
}
SE_BIND_FUNC(JSB_glCreateShader)

static bool JSB_glShaderFinalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (WebGLShader)", s.nativeThisObject());
    WebGLShader* cobj = (WebGLShader*) s.nativeThisObject();
    auto iter = __shaders.find(cobj->_id);
    if (iter != __shaders.end())
        __shaders.erase(iter);

    if (se::ScriptEngine::getInstance()->isInCleanup())
        cobj->release();
    else
        cobj->autorelease();
    return true;
}
SE_BIND_FINALIZE_FUNC(JSB_glShaderFinalize)

// Arguments: GLenum
// Ret value: void
static bool JSB_glCullFace(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glCullFace((GLenum)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glCullFace)

// Arguments: GLuint
// Ret value: void
static bool JSB_glDeleteProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLProgram* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLuint id = arg0 != nullptr ? arg0->_id : 0;
    JSB_GL_CHECK(glDeleteProgram(id));
    safeRemoveElementFromGLObjectMap(__webglProgramMap, id);
    if (arg0 != nullptr) arg0->_id = 0;
    return true;
}
SE_BIND_FUNC(JSB_glDeleteProgram)

// Arguments: GLuint
// Ret value: void
static bool JSB_glDeleteShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLShader* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint shaderId = arg0 != nullptr ? arg0->_id : 0;
    JSB_GL_CHECK(glDeleteShader(shaderId));
    if (arg0 != nullptr) arg0->_id = 0;

    auto iter = __shaders.find(shaderId);
    if (iter != __shaders.end())
        __shaders.erase(iter);

    safeRemoveElementFromGLObjectMap(__webglShaderMap, shaderId);

    return true;
}
SE_BIND_FUNC(JSB_glDeleteShader)

// Arguments: GLenum
// Ret value: void
static bool JSB_glDepthFunc(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glDepthFunc((GLenum)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glDepthFunc)

// Arguments: GLboolean
// Ret value: void
static bool JSB_glDepthMask(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint16_t arg0;

    ok &= seval_to_uint16(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glDepthMask((GLboolean)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glDepthMask)

// Arguments: GLclampf, GLclampf
// Ret value: void
static bool JSB_glDepthRangef(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    float arg0; float arg1;

    ok &= seval_to_float(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 <= arg1, false, GL_INVALID_OPERATION);
#endif
    JSB_GL_CHECK(glDepthRangef((GLclampf)arg0 , (GLclampf)arg1  ));

    return true;
}
SE_BIND_FUNC(JSB_glDepthRangef)

// Arguments: GLuint, GLuint
// Ret value: void
static bool JSB_glDetachShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;

    WebGLProgram* arg0;
    WebGLShader* arg1;
    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_native_ptr(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLuint programId = arg0 != nullptr ? arg0->_id : 0;
    GLuint shaderId = arg1 != nullptr ? arg1->_id : 0;

    JSB_GL_CHECK(glDetachShader(programId , shaderId  ));

    return true;
}
SE_BIND_FUNC(JSB_glDetachShader)

// Arguments: GLenum
// Ret value: void
static bool JSB_glDisable(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glDisable((GLenum)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glDisable)

// Arguments: GLuint
// Ret value: void
static bool JSB_glDisableVertexAttribArray(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(ccDisableVertexAttribArray((GLuint)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glDisableVertexAttribArray)

// Arguments: GLenum, GLint, GLsizei
// Ret value: void
static bool JSB_glDrawArrays(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; int32_t arg2;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg1 >= 0, false, GL_INVALID_VALUE);

    int buffer = 0;
    JSB_GL_CHECK(glGetIntegerv(GL_CURRENT_PROGRAM, &buffer));

    SE_PRECONDITION4(buffer > 0, false, GL_INVALID_OPERATION);

    GLint data = 0;
    glGetBufferParameteriv(GL_ARRAY_BUFFER, GL_BUFFER_SIZE, &data);
    int64_t size = ccGetBufferDataSize(), first = arg1;
    int64_t total = (int64_t)(size * (arg2 > 0 ? first + arg2 : arg2));
    SE_PRECONDITION4(total <= data, false, GL_INVALID_OPERATION);
#endif
    JSB_GL_CHECK(glDrawArrays((GLenum)arg0 , (GLint)arg1 , (GLsizei)arg2  ));

    return true;
}
SE_BIND_FUNC(JSB_glDrawArrays)

// Arguments: GLenum, GLsizei, GLenum, ArrayBufferView
// Ret value: void
static bool JSB_glDrawElements(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; uint32_t arg2; void* arg3 = nullptr;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );

    const se::Value& offsetVal = args[3];
    int offset = 0;

    if (offsetVal.isNumber())
    {
        ok &= seval_to_int32(offsetVal, &offset);
        arg3 = (void*)(intptr_t)offset;
    }

    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg2 == GL_UNSIGNED_BYTE || arg2 == GL_UNSIGNED_SHORT, false, GL_INVALID_ENUM);

    SE_PRECONDITION4(arg1 >= 0 && offset >= 0, false, GL_INVALID_VALUE);

    int size = 0;

    switch (arg2)
    {
        case GL_UNSIGNED_BYTE:
            size = sizeof(GLbyte);
            break;
        case GL_UNSIGNED_SHORT:
            size = sizeof(GLshort);
            break;
    }

    SE_PRECONDITION4(offset % size == 0, false, GL_INVALID_OPERATION);

    int buffer = 0;
    JSB_GL_CHECK(glGetIntegerv(GL_CURRENT_PROGRAM, &buffer));
    SE_PRECONDITION4(buffer > 0, false, GL_INVALID_OPERATION);

    JSB_GL_CHECK(glGetIntegerv(GL_ELEMENT_ARRAY_BUFFER_BINDING, &buffer));
    SE_PRECONDITION4(buffer > 0, false, GL_INVALID_OPERATION);

    GLint elementSize = 0;
    glGetBufferParameteriv(GL_ELEMENT_ARRAY_BUFFER, GL_BUFFER_SIZE, &elementSize);
    SE_PRECONDITION4(arg1 == 0 || ((elementSize > offset) && arg1 <= ((elementSize - offset) / size)), false, GL_INVALID_OPERATION);
#endif
    JSB_GL_CHECK(glDrawElements((GLenum)arg0 , (GLsizei)arg1 , (GLenum)arg2 , (GLvoid*)arg3  ));

    return true;
}
SE_BIND_FUNC(JSB_glDrawElements)

// Arguments: GLenum
// Ret value: void
static bool JSB_glEnable(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(!args[0].isNullOrUndefined(), false, GL_INVALID_ENUM);
#endif
    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_BLEND || arg0 == GL_CULL_FACE || arg0 == GL_DEPTH_TEST || arg0 == GL_DITHER ||
            arg0 == GL_POLYGON_OFFSET_FILL || arg0 == GL_SAMPLE_ALPHA_TO_COVERAGE || arg0 == GL_SAMPLE_COVERAGE
        || arg0 == GL_SCISSOR_TEST || arg0 == GL_STENCIL_TEST, false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(glEnable((GLenum)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glEnable)

// Arguments: GLuint
// Ret value: void
static bool JSB_glEnableVertexAttribArray(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(ccEnableVertexAttribArray((GLuint)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glEnableVertexAttribArray)

// Arguments:
// Ret value: void
static bool JSB_glFinish(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 0, false, "Invalid number of arguments" );
    JSB_GL_CHECK(glFinish( ));

    return true;
}
SE_BIND_FUNC(JSB_glFinish)

// Arguments:
// Ret value: void
static bool JSB_glFlush(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 0, false, "Invalid number of arguments" );
    JSB_GL_CHECK(glFlush( ));

    return true;
}
SE_BIND_FUNC(JSB_glFlush)

// Arguments: GLenum, GLenum, GLenum, GLuint
// Ret value: void
static bool JSB_glFramebufferRenderbuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; uint32_t arg2; WebGLRenderbuffer* arg3;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    ok &= seval_to_native_ptr(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint renderBufferId = arg3 != nullptr ? arg3->_id : 0;
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_FRAMEBUFFER, false, GL_INVALID_ENUM);
    SE_PRECONDITION4(arg1 == GL_COLOR_ATTACHMENT0 || arg1 == GL_DEPTH_ATTACHMENT || arg1 == GL_STENCIL_ATTACHMENT ||
                             arg1 == GL_DEPTH_STENCIL_ATTACHMENT, false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(WEBGL_framebufferRenderbuffer((GLenum)arg0 , (GLenum)arg1 , (GLenum)arg2 , renderBufferId));
    return true;
}
SE_BIND_FUNC(JSB_glFramebufferRenderbuffer)

// Arguments: GLenum, GLenum, GLenum, GLuint, GLint
// Ret value: void
static bool JSB_glFramebufferTexture2D(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 5, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; uint32_t arg2; WebGLTexture* arg3; int32_t arg4;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    ok &= seval_to_native_ptr(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLuint textureId = arg3 != nullptr ? arg3->_id : 0;
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_FRAMEBUFFER, false, GL_INVALID_ENUM);
    SE_PRECONDITION4(arg1 == GL_COLOR_ATTACHMENT0 || arg1 == GL_DEPTH_ATTACHMENT || arg1 == GL_STENCIL_ATTACHMENT, false, GL_INVALID_ENUM);
    SE_PRECONDITION4(arg4 == 0, false, GL_INVALID_VALUE);
#endif
    JSB_GL_CHECK(glFramebufferTexture2D((GLenum)arg0 , (GLenum)arg1 , (GLenum)arg2 , textureId , (GLint)arg4  ));

    return true;
}
SE_BIND_FUNC(JSB_glFramebufferTexture2D)

// Arguments: GLenum
// Ret value: void
static bool JSB_glFrontFace(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glFrontFace((GLenum)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glFrontFace)

// Arguments: GLenum
// Ret value: void
static bool JSB_glGenerateMipmap(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glGenerateMipmap((GLenum)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glGenerateMipmap)

// Arguments: GLuint, char*
// Ret value: int
static bool JSB_glGetAttribLocation(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLProgram* arg0;
    std::string arg1;
    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_std_string(args[1], &arg1);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint programId = arg0 != nullptr ? arg0->_id : 0;
    int ret_val = glGetAttribLocation(programId, arg1.c_str());
    JSB_GL_CHECK_ERROR();
    s.rval().setInt32(ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glGetAttribLocation)

// Arguments:
// Ret value: GLenum
static bool JSB_glGetError(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 0, false, "Invalid number of arguments" );
    GLenum ret_val;
    if (__glErrorCode == GL_NO_ERROR) {
        ret_val = glGetError();
    } else {
        ret_val = __glErrorCode;
        __glErrorCode = GL_NO_ERROR;
    }

    s.rval().setUint32((uint32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glGetError)

// Arguments: GLuint, char*
// Ret value: int
static bool JSB_glGetUniformLocation(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLProgram* arg0;
    std::string arg1;

    ok &= seval_to_native_ptr(args[0], &arg0 );
    ok &= seval_to_std_string(args[1], &arg1 );
    s.rval().setNull();
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    int ret_val = 0;

    GLuint programId = arg0 != nullptr ? arg0->_id : 0;
    ret_val = glGetUniformLocation(programId , arg1.c_str());
    JSB_GL_CHECK_ERROR();
    if(ret_val >= 0)
    {
        s.rval().setInt32(ret_val);
    }
    return true;
}
SE_BIND_FUNC(JSB_glGetUniformLocation)

// Arguments: GLenum, GLenum
// Ret value: void
static bool JSB_glHint(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glHint((GLenum)arg0 , (GLenum)arg1  ));

    return true;
}
SE_BIND_FUNC(JSB_glHint)

// Arguments: GLuint
// Ret value: GLboolean
static bool JSB_glIsBuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLObject* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val = GL_FALSE;

    if (dynamic_cast<WebGLBuffer*>(arg0))
        ret_val = glIsBuffer(arg0->_id);

    s.rval().setBoolean(ret_val == GL_TRUE);
    return true;
}
SE_BIND_FUNC(JSB_glIsBuffer)

// Arguments: GLenum
// Ret value: GLboolean
static bool JSB_glIsEnabled(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val;

    ret_val = glIsEnabled((GLenum)arg0);
    s.rval().setBoolean(ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glIsEnabled)

// Arguments: GLuint
// Ret value: GLboolean
static bool JSB_glIsFramebuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLObject* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val = GL_FALSE;

    if (dynamic_cast<WebGLFramebuffer*>(arg0))
    {
        GLuint frameBufferId = arg0 != nullptr ? arg0->_id : __defaultFbo;
        ret_val = glIsFramebuffer(frameBufferId);
    }

    s.rval().setBoolean(ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glIsFramebuffer)

// Arguments: GLuint
// Ret value: GLboolean
static bool JSB_glIsProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLObject* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val = GL_FALSE;
    if (dynamic_cast<WebGLProgram*>(arg0))
    {
        GLuint id = arg0 != nullptr ? arg0->_id : 0;
        ret_val = glIsProgram(id);
    }
    s.rval().setBoolean(ret_val == GL_TRUE);
    return true;
}
SE_BIND_FUNC(JSB_glIsProgram)

// Arguments: GLuint
// Ret value: GLboolean
static bool JSB_glIsRenderbuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLObject* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLboolean ret_val = GL_FALSE;

    if (dynamic_cast<WebGLRenderbuffer*>(arg0))
        ret_val = glIsRenderbuffer(arg0->_id);

    s.rval().setBoolean(ret_val == GL_TRUE);
    return true;
}
SE_BIND_FUNC(JSB_glIsRenderbuffer)

// Arguments: GLuint
// Ret value: GLboolean
static bool JSB_glIsShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLObject* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val = GL_FALSE;
    if (dynamic_cast<WebGLShader*>(arg0) != nullptr)
    {
        GLuint id = arg0 != nullptr ? arg0->_id : 0;
        ret_val = glIsShader(id);
    }
    s.rval().setBoolean(ret_val == GL_TRUE);
    return true;
}
SE_BIND_FUNC(JSB_glIsShader)

// Arguments: GLuint
// Ret value: GLboolean
static bool JSB_glIsTexture(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLObject* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val = GL_FALSE;

    if (dynamic_cast<WebGLTexture*>(arg0))
    {
        GLuint textureId = arg0 != nullptr ? arg0->_id : 0;
        ret_val = glIsTexture(textureId);
    }
    s.rval().setBoolean(ret_val == GL_TRUE);
    return true;
}
SE_BIND_FUNC(JSB_glIsTexture)

// Arguments: GLfloat
// Ret value: void
static bool JSB_glLineWidth(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    float arg0;

    ok &= seval_to_float(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glLineWidth((GLfloat)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glLineWidth)

// Arguments: GLuint
// Ret value: void
static bool JSB_glLinkProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLProgram* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint id = arg0 != nullptr ? arg0->_id : 0;
    JSB_GL_CHECK(glLinkProgram(id));
    return true;
}
SE_BIND_FUNC(JSB_glLinkProgram)

// Arguments: GLenum, GLint
// Ret value: void
static bool JSB_glPixelStorei(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1;
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(!args[0].isNullOrUndefined(), false, GL_INVALID_ENUM);
#endif
    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_PACK_ALIGNMENT || arg0 == GL_UNPACK_ALIGNMENT || arg0 == GL_UNPACK_FLIP_Y_WEBGL ||
                             arg0 == GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL || arg0 == GL_UNPACK_COLORSPACE_CONVERSION_WEBGL,
                     false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(ccPixelStorei((GLenum)arg0 , (GLint)arg1));
    return true;
}
SE_BIND_FUNC(JSB_glPixelStorei)

// Arguments: GLfloat, GLfloat
// Ret value: void
static bool JSB_glPolygonOffset(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    float arg0; float arg1;

    ok &= seval_to_float(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glPolygonOffset((GLfloat)arg0 , (GLfloat)arg1  ));

    return true;
}
SE_BIND_FUNC(JSB_glPolygonOffset)

// Arguments: GLint, GLint, GLsizei, GLsizei, GLenum, GLenum, ArrayBufferView
// Ret value: void
static bool JSB_glReadPixels(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 7, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; int32_t arg2; int32_t arg3; uint32_t arg4; uint32_t arg5; void* arg6;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    ok &= seval_to_uint32(args[4], &arg4 );
    ok &= seval_to_uint32(args[5], &arg5 );
    GLsizei count;
    ok &= JSB_get_arraybufferview_dataptr(args[6], &count, &arg6);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg4 == GL_ALPHA || arg4 == GL_RGB || arg4 == GL_RGBA,false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(glReadPixels((GLint)arg0 , (GLint)arg1 , (GLsizei)arg2 , (GLsizei)arg3 , (GLenum)arg4 , (GLenum)arg5 , (GLvoid*)arg6  ));

    return true;
}
SE_BIND_FUNC(JSB_glReadPixels)

// Arguments:
// Ret value: void
static bool JSB_glReleaseShaderCompiler(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 0, false, "Invalid number of arguments" );
    JSB_GL_CHECK(glReleaseShaderCompiler( ));

    return true;
}
SE_BIND_FUNC(JSB_glReleaseShaderCompiler)

// Arguments: GLenum, GLenum, GLsizei, GLsizei
// Ret value: void
static bool JSB_glRenderbufferStorage(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; int32_t arg2; int32_t arg3;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(WEBGL_renderbufferStorage((GLenum)arg0 , (GLenum)arg1 , (GLsizei)arg2 , (GLsizei)arg3));

    return true;
}
SE_BIND_FUNC(JSB_glRenderbufferStorage)

// Arguments: GLclampf, GLboolean
// Ret value: void
static bool JSB_glSampleCoverage(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    float arg0; uint16_t arg1;

    ok &= seval_to_float(args[0], &arg0 );
    ok &= seval_to_uint16(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glSampleCoverage((GLclampf)arg0 , (GLboolean)arg1  ));

    return true;
}
SE_BIND_FUNC(JSB_glSampleCoverage)

// Arguments: GLint, GLint, GLsizei, GLsizei
// Ret value: void
static bool JSB_glScissor(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; int32_t arg2; int32_t arg3;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(ccScissor((GLint)arg0 , (GLint)arg1 , (GLsizei)arg2 , (GLsizei)arg3  ));

    return true;
}
SE_BIND_FUNC(JSB_glScissor)

// Arguments: GLenum, GLint, GLuint
// Ret value: void
static bool JSB_glStencilFunc(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; uint32_t arg2;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glStencilFunc((GLenum)arg0 , (GLint)arg1 , (GLuint)arg2  ));

    return true;
}
SE_BIND_FUNC(JSB_glStencilFunc)

// Arguments: GLenum, GLenum, GLint, GLuint
// Ret value: void
static bool JSB_glStencilFuncSeparate(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; int32_t arg2; uint32_t arg3;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_uint32(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glStencilFuncSeparate((GLenum)arg0 , (GLenum)arg1 , (GLint)arg2 , (GLuint)arg3  ));

    return true;
}
SE_BIND_FUNC(JSB_glStencilFuncSeparate)

// Arguments: GLuint
// Ret value: void
static bool JSB_glStencilMask(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glStencilMask((GLuint)arg0  ));

    return true;
}
SE_BIND_FUNC(JSB_glStencilMask)

// Arguments: GLenum, GLuint
// Ret value: void
static bool JSB_glStencilMaskSeparate(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glStencilMaskSeparate((GLenum)arg0 , (GLuint)arg1  ));

    return true;
}
SE_BIND_FUNC(JSB_glStencilMaskSeparate)

// Arguments: GLenum, GLenum, GLenum
// Ret value: void
static bool JSB_glStencilOp(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; uint32_t arg2;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glStencilOp((GLenum)arg0 , (GLenum)arg1 , (GLenum)arg2  ));

    return true;
}
SE_BIND_FUNC(JSB_glStencilOp)

// Arguments: GLenum, GLenum, GLenum, GLenum
// Ret value: void
static bool JSB_glStencilOpSeparate(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; uint32_t arg2; uint32_t arg3;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    ok &= seval_to_uint32(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glStencilOpSeparate((GLenum)arg0 , (GLenum)arg1 , (GLenum)arg2 , (GLenum)arg3  ));

    return true;
}
SE_BIND_FUNC(JSB_glStencilOpSeparate)

static void setUnpackAlignmentByWidthAndFormat(uint32_t width, GLenum format)
{
    int32_t bytesPerPixel = 0;
    if (format == GL_RGBA) {
        bytesPerPixel = 4;
    }
    else if (format == GL_RGB) {
        bytesPerPixel = 3;
    }
    else if (format == GL_LUMINANCE_ALPHA) {
        bytesPerPixel = 2;
    }

    int32_t factor;
    GLint alignment = 1;
    if (bytesPerPixel > 0) {
        factor = bytesPerPixel * width;
    }
    else {
        factor = width;
    }

    if (factor % 8 == 0)
        alignment = 8;
    else if (factor % 4 == 0)
        alignment = 4;
    else if (factor % 2 == 0)
        alignment = 2;

    ccPixelStorei(GL_UNPACK_ALIGNMENT, alignment);
}

// Arguments: GLenum, GLint, GLint, GLsizei, GLsizei, GLint, GLenum, GLenum, ArrayBufferView
// Ret value: void
static bool JSB_glTexImage2D(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 10, false, "Invalid number of arguments" );
    bool ok = true;

    uint32_t target; int32_t level; int32_t internalformat; int32_t width; int32_t height; int32_t border; uint32_t format; uint32_t type; void* pixels; uint32_t alignment;

    ok &= seval_to_uint32(args[0], &target );
    ok &= seval_to_int32(args[1], &level );
    ok &= seval_to_int32(args[2], &internalformat );
    ok &= seval_to_int32(args[3], &width );
    ok &= seval_to_int32(args[4], &height );
    ok &= seval_to_int32(args[5], &border );
    ok &= seval_to_uint32(args[6], &format );
    ok &= seval_to_uint32(args[7], &type );

    GLsizei count;
    ok &= JSB_get_arraybufferview_dataptr(args[8], &count, &pixels);
    ok &= seval_to_uint32(args[9], &alignment);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(format == GL_ALPHA || format == GL_RGB || format == GL_RGBA || format == GL_LUMINANCE || format == GL_LUMINANCE_ALPHA,
                     false, GL_INVALID_ENUM);
    SE_PRECONDITION4(type == GL_UNSIGNED_BYTE || type == GL_UNSIGNED_SHORT_5_6_5 || type == GL_UNSIGNED_SHORT_4_4_4_4 || type == GL_UNSIGNED_SHORT_5_5_5_1,
                     false, GL_INVALID_ENUM);
    SE_PRECONDITION4(internalformat == format, false, GL_INVALID_OPERATION);
    if (!args[8].isNullOrUndefined())
    {
        int bytes = 1;

        switch (format)
        {
            case GL_RGB:
                bytes = 3;
                break;
            case GL_RGBA:
                bytes = 4;
                break;
            default:
                break;
        }
        if (type != GL_UNSIGNED_BYTE) bytes = 2;
        SE_PRECONDITION4(count >= width * height * bytes, false, GL_INVALID_OPERATION);
    }
#endif
    ccFlipYOrPremultiptyAlphaIfNeeded(format, width, height, count, pixels);
    if (alignment > 0)
        ccPixelStorei(GL_UNPACK_ALIGNMENT, alignment);
    else
        setUnpackAlignmentByWidthAndFormat(width, format);
    
    JSB_GL_CHECK(glTexImage2D((GLenum)target , (GLint)level , (GLint)internalformat , (GLsizei)width , (GLsizei)height , (GLint)border , (GLenum)format , (GLenum)type , (GLvoid*)pixels));

    return true;
}
SE_BIND_FUNC(JSB_glTexImage2D)

// Arguments: GLenum, GLenum, GLfloat
// Ret value: void
static bool JSB_glTexParameterf(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; float arg2;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_float(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_TEXTURE_2D || arg0 == GL_TEXTURE_CUBE_MAP, false, GL_INVALID_ENUM);

    SE_PRECONDITION4(arg1 == GL_TEXTURE_MIN_FILTER || arg1 == GL_TEXTURE_MAG_FILTER ||
                     arg1 == GL_TEXTURE_WRAP_S || arg1 == GL_TEXTURE_WRAP_T, false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(glTexParameterf((GLenum)arg0 , (GLenum)arg1 , (GLfloat)arg2  ));

    return true;
}
SE_BIND_FUNC(JSB_glTexParameterf)

// Arguments: GLenum, GLenum, GLint
// Ret value: void
static bool JSB_glTexParameteri(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; int32_t arg2;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_TEXTURE_2D || arg0 == GL_TEXTURE_CUBE_MAP, false, GL_INVALID_ENUM);

    SE_PRECONDITION4(arg1 == GL_TEXTURE_MIN_FILTER || arg1 == GL_TEXTURE_MAG_FILTER ||
                             arg1 == GL_TEXTURE_WRAP_S || arg1 == GL_TEXTURE_WRAP_T, false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(glTexParameteri((GLenum)arg0 , (GLenum)arg1 , (GLint)arg2  ));
    return true;
}
SE_BIND_FUNC(JSB_glTexParameteri)

// Arguments: GLenum, GLint, GLint, GLint, GLsizei, GLsizei, GLenum, GLenum, ArrayBufferView
// Ret value: void
static bool JSB_glTexSubImage2D(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 10, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t target; int32_t level; int32_t xoffset; int32_t yoffset; int32_t width; int32_t height; uint32_t format; uint32_t type; void* pixels; uint32_t alignment;

    ok &= seval_to_uint32(args[0], &target );
    ok &= seval_to_int32(args[1], &level );
    ok &= seval_to_int32(args[2], &xoffset );
    ok &= seval_to_int32(args[3], &yoffset );
    ok &= seval_to_int32(args[4], &width );
    ok &= seval_to_int32(args[5], &height );
    ok &= seval_to_uint32(args[6], &format );
    ok &= seval_to_uint32(args[7], &type );
    GLsizei count;
    ok &= JSB_get_arraybufferview_dataptr(args[8], &count, &pixels);
    ok &= seval_to_uint32(args[9], &alignment);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(format == GL_ALPHA || format == GL_RGB || format == GL_RGBA || format == GL_LUMINANCE || format == GL_LUMINANCE_ALPHA,
                     false, GL_INVALID_ENUM);
    SE_PRECONDITION4(type == GL_UNSIGNED_BYTE || type == GL_UNSIGNED_SHORT_5_6_5 || type == GL_UNSIGNED_SHORT_4_4_4_4 || type == GL_UNSIGNED_SHORT_5_5_5_1,
                     false, GL_INVALID_ENUM);
    if (!args[8].isNullOrUndefined())
    {
        int bytes = 1;

        switch (format)
        {
            case GL_RGB:
                bytes = 3;
                break;
            case GL_RGBA:
                bytes = 4;
                break;
            default:
                break;
        }
        if (type != GL_UNSIGNED_BYTE) bytes = 2;
        SE_PRECONDITION4(count >= width * height * bytes, false, GL_INVALID_OPERATION);
    }
#endif
    ccFlipYOrPremultiptyAlphaIfNeeded(format, width, height, count, pixels);
    if (alignment > 0)
        ccPixelStorei(GL_UNPACK_ALIGNMENT, alignment);
    else
        setUnpackAlignmentByWidthAndFormat(width, format);

    JSB_GL_CHECK(glTexSubImage2D((GLenum)target , (GLint)level , (GLint)xoffset , (GLint)yoffset , (GLsizei)width , (GLsizei)height , (GLenum)format , (GLenum)type , (GLvoid*)pixels));

    return true;
}
SE_BIND_FUNC(JSB_glTexSubImage2D)

// Arguments: GLint, GLfloat
// Ret value: void
static bool JSB_glUniform1f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; float arg1;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform1f(arg0, arg1));

    return true;
}
SE_BIND_FUNC(JSB_glUniform1f)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
static bool JSB_glUniform1fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform1fv((GLint)arg0 , (GLsizei)data.count() , (GLfloat*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glUniform1fv)

// Arguments: GLint, GLint
// Ret value: void
static bool JSB_glUniform1i(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform1i((GLint)arg0 , (GLint)arg1  ));

    return true;
}
SE_BIND_FUNC(JSB_glUniform1i)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
static bool JSB_glUniform1iv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<int32_t> data;
    ok &= JSB_jsval_typedarray_to_data<int32_t>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform1iv((GLint)arg0 , (GLsizei)data.count() , (GLint*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glUniform1iv)

// Arguments: GLint, GLfloat, GLfloat
// Ret value: void
static bool JSB_glUniform2f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; float arg1; float arg2;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    ok &= seval_to_float(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform2f(arg0 , arg1 , arg2));

    return true;
}
SE_BIND_FUNC(JSB_glUniform2f)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
static bool JSB_glUniform2fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform2fv((GLint)arg0 , (GLsizei)(data.count()/2) , (GLfloat*)data.data() ));

    return true;
}
SE_BIND_FUNC(JSB_glUniform2fv)

// Arguments: GLint, GLint, GLint
// Ret value: void
static bool JSB_glUniform2i(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; int32_t arg2;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform2i((GLint)arg0 , (GLint)arg1 , (GLint)arg2  ));

    return true;
}
SE_BIND_FUNC(JSB_glUniform2i)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
static bool JSB_glUniform2iv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<int32_t> data;
    ok &= JSB_jsval_typedarray_to_data<int32_t>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform2iv((GLint)arg0 , (GLsizei)(data.count()/2) , (GLint*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glUniform2iv)

// Arguments: GLint, GLfloat, GLfloat, GLfloat
// Ret value: void
static bool JSB_glUniform3f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    GLint arg0; float arg1; float arg2; float arg3;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    ok &= seval_to_float(args[2], &arg2 );
    ok &= seval_to_float(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform3f(arg0 , arg1 , arg2 , arg3));

    return true;
}
SE_BIND_FUNC(JSB_glUniform3f)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
static bool JSB_glUniform3fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform3fv((GLint)arg0 , (GLsizei)(data.count()/3) , (GLfloat*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glUniform3fv)

// Arguments: GLint, GLint, GLint, GLint
// Ret value: void
static bool JSB_glUniform3i(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; int32_t arg2; int32_t arg3;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform3i((GLint)arg0 , (GLint)arg1 , (GLint)arg2 , (GLint)arg3  ));

    return true;
}
SE_BIND_FUNC(JSB_glUniform3i)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
static bool JSB_glUniform3iv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<int32_t> data;
    ok &= JSB_jsval_typedarray_to_data<int32_t>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform3iv((GLint)arg0 , (GLsizei)(data.count()/3) , (GLint*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glUniform3iv)

// Arguments: GLint, GLfloat, GLfloat, GLfloat, GLfloat
// Ret value: void
static bool JSB_glUniform4f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 5, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; float arg1; float arg2; float arg3; float arg4;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    ok &= seval_to_float(args[2], &arg2 );
    ok &= seval_to_float(args[3], &arg3 );
    ok &= seval_to_float(args[4], &arg4 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform4f((GLint)arg0 , (GLfloat)arg1 , (GLfloat)arg2 , (GLfloat)arg3 , (GLfloat)arg4));

    return true;
}
SE_BIND_FUNC(JSB_glUniform4f)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
static bool JSB_glUniform4fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform4fv((GLint)arg0 , (GLsizei)(data.count()/4) , (GLfloat*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glUniform4fv)

// Arguments: GLint, GLint, GLint, GLint, GLint
// Ret value: void
static bool JSB_glUniform4i(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 5, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; int32_t arg2; int32_t arg3; int32_t arg4;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform4i((GLint)arg0 , (GLint)arg1 , (GLint)arg2 , (GLint)arg3 , (GLint)arg4  ));

    return true;
}
SE_BIND_FUNC(JSB_glUniform4i)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
static bool JSB_glUniform4iv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<int32_t> data;
    ok &= JSB_jsval_typedarray_to_data<int32_t>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glUniform4iv((GLint)arg0 , (GLsizei)(data.count()/4) , (GLint*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glUniform4iv)

// Arguments: GLint, GLboolean, TypedArray/Sequence
// Ret value: void
static bool JSB_glUniformMatrix2fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; uint16_t arg1;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_uint16(args[1], &arg1 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[2], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg1 == GL_FALSE, false, GL_INVALID_VALUE);

    SE_PRECONDITION4(data.count() % 4 == 0, false, GL_INVALID_VALUE);
#endif
    JSB_GL_CHECK(glUniformMatrix2fv(arg0, (GLsizei)(data.count()/4), (GLboolean)arg1 , (GLfloat*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glUniformMatrix2fv)

// Arguments: GLint, GLboolean, TypedArray/Sequence
// Ret value: void
static bool JSB_glUniformMatrix3fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; uint16_t arg1;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_uint16(args[1], &arg1 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[2], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg1 == GL_FALSE, false, GL_INVALID_VALUE);

    SE_PRECONDITION4(data.count() % 9 == 0, false, GL_INVALID_VALUE);
#endif
    JSB_GL_CHECK(glUniformMatrix3fv(arg0, (GLsizei)(data.count()/9), (GLboolean)arg1 , (GLfloat*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glUniformMatrix3fv)

// Arguments: GLint, GLboolean, TypedArray/Sequence
// Ret value: void
static bool JSB_glUniformMatrix4fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; uint16_t arg1;;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_uint16(args[1], &arg1 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[2], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg1 == GL_FALSE, false, GL_INVALID_VALUE);

    SE_PRECONDITION4(data.count() % 16 == 0, false, GL_INVALID_VALUE);
#endif
    JSB_GL_CHECK(glUniformMatrix4fv(arg0, (GLsizei)(data.count()/16), (GLboolean)arg1 , (GLfloat*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glUniformMatrix4fv)

// Arguments: GLuint
// Ret value: void
static bool JSB_glUseProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLProgram* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint programId = arg0 != nullptr ? arg0->_id : 0;
    JSB_GL_CHECK(glUseProgram(programId));
    return true;
}
SE_BIND_FUNC(JSB_glUseProgram)

// Arguments: GLuint
// Ret value: void
static bool JSB_glValidateProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    WebGLProgram* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLuint id = arg0 != nullptr ? arg0->_id : 0;
    JSB_GL_CHECK(glValidateProgram(id));
    return true;
}
SE_BIND_FUNC(JSB_glValidateProgram)

// Arguments: GLuint, GLfloat
// Ret value: void
static bool JSB_glVertexAttrib1f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; float arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glVertexAttrib1f((GLuint)arg0 , (GLfloat)arg1  ));

    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib1f)

// Arguments: GLuint, TypedArray/Sequence
// Ret value: void
static bool JSB_glVertexAttrib1fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glVertexAttrib1fv((GLuint)arg0 , (GLfloat*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib1fv)

// Arguments: GLuint, GLfloat, GLfloat
// Ret value: void
static bool JSB_glVertexAttrib2f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; float arg1; float arg2;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    ok &= seval_to_float(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glVertexAttrib2f((GLuint)arg0 , (GLfloat)arg1 , (GLfloat)arg2  ));

    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib2f)

// Arguments: GLuint, TypedArray/Sequence
// Ret value: void
static bool JSB_glVertexAttrib2fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glVertexAttrib2fv((GLuint)arg0 , (GLfloat*)data.data()  ));

    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib2fv)

// Arguments: GLuint, GLfloat, GLfloat, GLfloat
// Ret value: void
static bool JSB_glVertexAttrib3f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; float arg1; float arg2; float arg3;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    ok &= seval_to_float(args[2], &arg2 );
    ok &= seval_to_float(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glVertexAttrib3f((GLuint)arg0 , (GLfloat)arg1 , (GLfloat)arg2 , (GLfloat)arg3  ));

    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib3f)

// Arguments: GLuint, TypedArray/Sequence
// Ret value: void
static bool JSB_glVertexAttrib3fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glVertexAttrib3fv((GLuint)arg0 , (GLfloat*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib3fv)

// Arguments: GLuint, GLfloat, GLfloat, GLfloat, GLfloat
// Ret value: void
static bool JSB_glVertexAttrib4f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 5, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; float arg1; float arg2; float arg3; float arg4;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_float(args[1], &arg1 );
    ok &= seval_to_float(args[2], &arg2 );
    ok &= seval_to_float(args[3], &arg3 );
    ok &= seval_to_float(args[4], &arg4 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glVertexAttrib4f((GLuint)arg0 , (GLfloat)arg1 , (GLfloat)arg2 , (GLfloat)arg3 , (GLfloat)arg4  ));

    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib4f)

// Arguments: GLuint, TypedArray/Sequence
// Ret value: void
static bool JSB_glVertexAttrib4fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glVertexAttrib4fv((GLuint)arg0 , (GLfloat*)data.data()));

    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib4fv)

// Arguments: GLuint, GLint, GLenum, GLboolean, GLsizei, GLvoid*
// Ret value: void
static bool JSB_glVertexAttribPointer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 6, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; uint32_t arg2; uint16_t arg3; int32_t arg4; int32_t arg5;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    ok &= seval_to_uint16(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    ok &= seval_to_int32(args[5], &arg5 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg2 == GL_BYTE || arg2 == GL_UNSIGNED_BYTE || arg2 == GL_SHORT ||
                             arg2 == GL_UNSIGNED_SHORT || arg2 == GL_FLOAT, false, GL_INVALID_ENUM);

    SE_PRECONDITION4(arg4 >= 0 && arg4 <= GL_MAX_STRIDE, false, GL_INVALID_VALUE);

    SE_PRECONDITION4(arg5 >= 0, false, GL_INVALID_VALUE);

    switch (arg2) {
        case GL_BYTE:
        case GL_UNSIGNED_BYTE:
            SE_PRECONDITION4(arg4 % sizeof(GLbyte) == 0 && arg5 % sizeof(GLbyte) == 0, false, GL_INVALID_OPERATION);
            break;
        case GL_SHORT:
        case GL_UNSIGNED_SHORT:
            SE_PRECONDITION4(arg4 % sizeof(GLshort) == 0 && arg5 % sizeof(GLshort) == 0, false, GL_INVALID_OPERATION);
            break;
        case GL_FLOAT:
            SE_PRECONDITION4(arg4 % sizeof(GLclampf) == 0 && arg5 % sizeof(GLclampf) == 0, false, GL_INVALID_OPERATION);
            break;
    }
#endif
    JSB_GL_CHECK(ccVertexAttribPointer((GLuint)arg0 , (GLint)arg1 , (GLenum)arg2 , (GLboolean)arg3 , (GLsizei)arg4 , (GLvoid*)(intptr_t)arg5  ));

    return true;
}
SE_BIND_FUNC(JSB_glVertexAttribPointer)

// (index, pname)
static bool JSB_glGetVertexAttrib(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t index; uint32_t pname;

    ok &= seval_to_uint32(args[0], &index );
    ok &= seval_to_uint32(args[1], &pname );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    if( pname == GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING ) {
        GLint buffer;
        JSB_GL_CHECK(glGetVertexAttribiv(index, pname, &buffer));
        auto iter = __webglBufferMap.find(buffer);
        if (iter != __webglBufferMap.end()) {
            WebGLBuffer* obj = static_cast<WebGLBuffer*>(iter->second);
            auto seObjIter = se::NativePtrToObjectMap::find(obj);
            if (seObjIter != se::NativePtrToObjectMap::end()) {
                s.rval().setObject(seObjIter->second);
            }
            else {
                s.rval().setNull();
            }
        }
        else {
            s.rval().setNull();
        }
    }
    else if( pname == GL_CURRENT_VERTEX_ATTRIB ) {
        float vertexAttrib[4] = {0.0f};
        JSB_GL_CHECK(glGetVertexAttribfv(index, pname, vertexAttrib));
        se::Object* arr = se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, vertexAttrib, sizeof(vertexAttrib));
        s.rval().setObject(arr);
    }
    else {
        GLint value;
        JSB_GL_CHECK(glGetVertexAttribiv(index, pname, &value));

        if (pname == GL_VERTEX_ATTRIB_ARRAY_ENABLED || pname == GL_VERTEX_ATTRIB_ARRAY_NORMALIZED) {
            s.rval().setBoolean(value == 0 ? false : true);
        }
        else if (pname == GL_VERTEX_ATTRIB_ARRAY_SIZE || GL_VERTEX_ATTRIB_ARRAY_STRIDE || GL_VERTEX_ATTRIB_ARRAY_TYPE) {
            s.rval().setNumber(value);
        }
        else {
            s.rval().setNull();
        }
    }
    return true;
}
SE_BIND_FUNC(JSB_glGetVertexAttrib)

// (index, pname)
static bool JSB_glGetVertexAttribOffset(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t index; uint32_t pname;

    ok &= seval_to_uint32(args[0], &index );
    ok &= seval_to_uint32(args[1], &pname );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    if( pname == GL_VERTEX_ATTRIB_ARRAY_POINTER ) {
        GLvoid* pointer;
        JSB_GL_CHECK(glGetVertexAttribPointerv(index, pname, &pointer));
        s.rval().setNumber((double)(intptr_t)pointer);
    }
    return true;
}
SE_BIND_FUNC(JSB_glGetVertexAttribOffset)

// Arguments: GLint, GLint, GLsizei, GLsizei
// Ret value: void
static bool JSB_glViewport(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; int32_t arg2; int32_t arg3;

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(ccViewport((GLint)arg0 , (GLint)arg1, (GLsizei)arg2 , (GLsizei)arg3));
    return true;
}
SE_BIND_FUNC(JSB_glViewport)


// Helper functions that link "glGenXXXs" (OpenGL ES 2.0 spec), with "gl.createXXX" (WebGL spec)
static bool JSB_glCreateTexture(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint texture;
    JSB_GL_CHECK(glGenTextures(1, &texture));

    auto obj = se::Object::createObjectWithClass(__jsb_WebGLTexture_class);
    s.rval().setObject(obj, true);
    obj->setProperty("_id", se::Value(texture));
    auto cobj = new (std::nothrow) WebGLTexture(texture);
    obj->setPrivateData(cobj);
    return true;
}
SE_BIND_FUNC(JSB_glCreateTexture)

static bool JSB_glTextureFinalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (WebGLTexture)", s.nativeThisObject());
    WebGLTexture* cobj = (WebGLTexture*) s.nativeThisObject();
    if (se::ScriptEngine::getInstance()->isInCleanup())
        cobj->release();
    else
        cobj->autorelease();
    return true;
}
SE_BIND_FINALIZE_FUNC(JSB_glTextureFinalize)

static bool JSB_glCreateBuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint buffer;
    JSB_GL_CHECK(glGenBuffers(1, &buffer));

    auto obj = se::Object::createObjectWithClass(__jsb_WebGLBuffer_class);
    s.rval().setObject(obj, true);
    obj->setProperty("_id", se::Value(buffer));
    auto cobj = new (std::nothrow) WebGLBuffer(buffer);
    obj->setPrivateData(cobj);
    return true;
}
SE_BIND_FUNC(JSB_glCreateBuffer)

static bool JSB_glBufferFinalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (WebGLBuffer)", s.nativeThisObject());
    WebGLBuffer* cobj = (WebGLBuffer*) s.nativeThisObject();
    if (se::ScriptEngine::getInstance()->isInCleanup())
        cobj->release();
    else
        cobj->autorelease();
    return true;
}
SE_BIND_FINALIZE_FUNC(JSB_glBufferFinalize)

static bool JSB_glCreateRenderbuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint renderbuffer;
    JSB_GL_CHECK(glGenRenderbuffers(1, &renderbuffer));
    auto obj = se::Object::createObjectWithClass(__jsb_WebGLRenderbuffer_class);
    s.rval().setObject(obj, true);
    obj->setProperty("_id", se::Value(renderbuffer));
    auto cobj = new (std::nothrow) WebGLRenderbuffer(renderbuffer);
    obj->setPrivateData(cobj);
    return true;
}
SE_BIND_FUNC(JSB_glCreateRenderbuffer)

static bool JSB_glRenderbufferFinalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (WebGLRenderBuffer)", s.nativeThisObject());
    WebGLRenderbuffer* cobj = (WebGLRenderbuffer*) s.nativeThisObject();
    if (se::ScriptEngine::getInstance()->isInCleanup())
        cobj->release();
    else
        cobj->autorelease();
    return true;
}
SE_BIND_FINALIZE_FUNC(JSB_glRenderbufferFinalize)

static bool JSB_glCreateFramebuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint framebuffer;
    JSB_GL_CHECK(glGenFramebuffers(1, &framebuffer));
    auto obj = se::Object::createObjectWithClass(__jsb_WebGLFramebuffer_class);
    s.rval().setObject(obj, true);
    obj->setProperty("_id", se::Value(framebuffer));
    auto cobj = new (std::nothrow) WebGLFramebuffer(framebuffer);
    obj->setPrivateData(cobj);
    return true;
}
SE_BIND_FUNC(JSB_glCreateFramebuffer)

static bool JSB_glFramebufferFinalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (WebGLFramebuffer)", s.nativeThisObject());
    WebGLFramebuffer* cobj = (WebGLFramebuffer*) s.nativeThisObject();
    if (se::ScriptEngine::getInstance()->isInCleanup())
        cobj->release();
    else
        cobj->autorelease();
    return true;
}
SE_BIND_FINALIZE_FUNC(JSB_glFramebufferFinalize)

static bool JSB_glDeleteTextures(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    WebGLTexture* arg0 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint id = arg0 != nullptr ? arg0->_id : 0;
    JSB_GL_CHECK(glDeleteTextures(1, &id));
    safeRemoveElementFromGLObjectMap(__webglTextureMap, id);
    if (arg0 != nullptr) arg0->_id = 0;
    return true;
}
SE_BIND_FUNC(JSB_glDeleteTextures)

static bool JSB_glDeleteBuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    WebGLBuffer* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint bufferId = arg0 != nullptr ? arg0->_id : 0;
    JSB_GL_CHECK(ccDeleteBuffers(1, &bufferId));
    safeRemoveElementFromGLObjectMap(__webglBufferMap, bufferId);
    if (arg0 != nullptr) arg0->_id = 0;
    return true;
}
SE_BIND_FUNC(JSB_glDeleteBuffer)

static bool JSB_glDeleteRenderbuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    WebGLRenderbuffer* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint renderBufferId = arg0 != nullptr ? arg0->_id : 0;
    JSB_GL_CHECK(glDeleteRenderbuffers(1, &renderBufferId));
    safeRemoveElementFromGLObjectMap(__webglRenderbufferMap, renderBufferId);
    if (arg0 != nullptr) arg0->_id = 0;
    return true;
}
SE_BIND_FUNC(JSB_glDeleteRenderbuffer)

static bool JSB_glDeleteFramebuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    WebGLFramebuffer* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint frameBufferId = arg0 != nullptr ? arg0->_id : __defaultFbo;
    JSB_GL_CHECK(glDeleteFramebuffers(1, &frameBufferId));
    safeRemoveElementFromGLObjectMap(__webglFramebufferMap, frameBufferId);
    arg0->_id = __defaultFbo;
    return true;
}
SE_BIND_FUNC(JSB_glDeleteFramebuffer)

static bool JSB_glShaderSource(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;
    WebGLShader* arg0;
    std::string shaderSource;

    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_std_string(args[1], &shaderSource);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLuint shaderId = arg0 != nullptr ? arg0->_id : 0;

#if CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32
    size_t firstLinePos = shaderSource.find("\n");
    if (firstLinePos != std::string::npos)
    {
        std::string firstLine = shaderSource.substr(0, firstLinePos);
        if (firstLine.find("#version") == std::string::npos)
        {
            shaderSource = "#version 120\n" + shaderSource;
        }
    }
    shaderSource = std::regex_replace(shaderSource, std::regex("precision\\s+(lowp|mediump|highp).*?;"), "");
    shaderSource = std::regex_replace(shaderSource, std::regex("\\s(lowp|mediump|highp)\\s"), " ");
#endif

    const GLchar* sources[] = { shaderSource.c_str() };
    JSB_GL_CHECK(glShaderSource(shaderId, 1, sources, nullptr));

    return true;
}
SE_BIND_FUNC(JSB_glShaderSource)

static bool JSB_glGetShaderParameter(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;
    WebGLShader* arg0;
    uint32_t arg1;

    s.rval().setNull();
    SE_PRECONDITION2(!args[0].isNullOrUndefined(), false, "Error processing arguments");
    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_uint32(args[1], &arg1);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint shaderId = arg0 != nullptr ? arg0->_id : 0;

    GLint ret = 0;
    JSB_GL_CHECK(glGetShaderiv(shaderId, arg1, &ret));

    if (arg1 == GL_DELETE_STATUS || arg1 == GL_COMPILE_STATUS)
    {
        s.rval().setBoolean(ret != 0);
    }
    else
    {
        s.rval().setInt32(ret);
    }
    return true;
}
SE_BIND_FUNC(JSB_glGetShaderParameter)

static bool JSB_glGetProgramParameter(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;
    WebGLProgram* arg0;
    uint32_t arg1;

    s.rval().setNull();
    SE_PRECONDITION2(!args[0].isNullOrUndefined(), false, "Error processing arguments");
    ok &= seval_to_native_ptr(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLuint programId = arg0 != nullptr ? arg0->_id : 0;
    GLint ret;
    JSB_GL_CHECK(glGetProgramiv(programId, arg1, &ret));
    if (arg1 == GL_ATTACHED_SHADERS || arg1 ==  GL_ACTIVE_ATTRIBUTES || arg1 == GL_ACTIVE_UNIFORMS) {
        s.rval().setInt32(ret);
    } else if (arg1 == GL_DELETE_STATUS || arg1 ==  GL_LINK_STATUS || arg1 == GL_VALIDATE_STATUS) {
        s.rval().setBoolean((ret > 0) ? true : false);
    } else{
        s.rval().setNull();
    }
    return true;
}
SE_BIND_FUNC(JSB_glGetProgramParameter)

static bool JSB_glGetProgramInfoLog(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    s.rval().setNull();
    bool ok = true;
    WebGLProgram* arg0;
    ok &= seval_to_native_ptr(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLuint programId = arg0 != nullptr ? arg0->_id : 0;
    GLsizei length;
    JSB_GL_CHECK(glGetProgramiv(programId, GL_INFO_LOG_LENGTH, &length));

    if (length > 0 && glGetError() == 0)
    {
        GLchar* src = new (std::nothrow) GLchar[length];
        JSB_GL_CHECK(glGetProgramInfoLog(programId, length, nullptr, src));
        s.rval().setString(src);
        CC_SAFE_DELETE_ARRAY(src);
    }
    else
    {
        s.rval().setString("");
    }
    return true;
}
SE_BIND_FUNC(JSB_glGetProgramInfoLog)

// DOMString? getShaderInfoLog(WebGLShader? shader);
static bool JSB_glGetShaderInfoLog(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    WebGLShader* arg0;
    s.rval().setNull();
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint shaderId = arg0 != nullptr ? arg0->_id : 0;

    GLsizei length;
    JSB_GL_CHECK(glGetShaderiv(shaderId, GL_INFO_LOG_LENGTH, &length));

    if (length > 0 && glGetError() == 0)
    {
        GLchar* src = new (std::nothrow) GLchar[length];
        JSB_GL_CHECK(glGetShaderInfoLog(shaderId, length, NULL, src));

        s.rval().setString(src);
        CC_SAFE_DELETE_ARRAY(src);
    }
    else
    {
        s.rval().setString("");
    }
    return true;
}
SE_BIND_FUNC(JSB_glGetShaderInfoLog)

// DOMString? getShaderSource(WebGLShader? shader);
static bool JSB_glGetShaderSource(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;

    WebGLShader* arg0;
    s.rval().setNull();
    ok &= seval_to_native_ptr(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint shaderId = arg0 != nullptr ? arg0->_id : 0;

    GLsizei length;
    JSB_GL_CHECK(glGetShaderiv(shaderId, GL_SHADER_SOURCE_LENGTH, &length));
    if (length > 0 && glGetError() == 0) {
        GLchar* src = new (std::nothrow) GLchar[length];
        JSB_GL_CHECK(glGetShaderSource(shaderId, length, NULL, src));

        s.rval().setString(src);
        CC_SAFE_DELETE_ARRAY(src);
    }
    else
    {
        s.rval().setString("");
    }
    return true;
}
SE_BIND_FUNC(JSB_glGetShaderSource)

//  interface WebGLActiveInfo {
//      readonly attribute GLint size;
//      readonly attribute GLenum type;
//      readonly attribute DOMString name;
// WebGLActiveInfo? getActiveAttrib(WebGLProgram? program, GLuint index);
static bool JSB_glGetActiveAttrib(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;
    WebGLProgram* arg0;
    int32_t arg1;

    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_int32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    s.rval().setNull();
    SE_PRECONDITION4(arg1 >= 0, false, GL_INVALID_VALUE);
#endif
    GLuint programId = arg0 != nullptr ? arg0->_id : 0;
    GLsizei length;
    JSB_GL_CHECK(glGetProgramiv(programId, GL_ACTIVE_ATTRIBUTE_MAX_LENGTH, &length));
    GLchar* buffer = new (std::nothrow) GLchar[length];
    GLint size = -1;
    GLenum type = -1;

    JSB_GL_CHECK(glGetActiveAttrib(programId, arg1, length, NULL, &size, &type, buffer));

    if (size == -1 || type == -1){
        s.rval().setNull();
    } else {
        se::Object* object = se::Object::createObjectWithClass(__jsb_WebGLActiveInfo_class);
        s.rval().setObject(object, true);
        object->decRef();

        object->setProperty("size", se::Value((int32_t)size));
        object->setProperty("type", se::Value((int32_t)type));
        object->setProperty("name", se::Value((char*)buffer));
    }

    CC_SAFE_DELETE_ARRAY(buffer);

    return true;
}
SE_BIND_FUNC(JSB_glGetActiveAttrib)


//  interface WebGLActiveInfo {
//      readonly attribute GLint size;
//      readonly attribute GLenum type;
//      readonly attribute DOMString name;
//  };
// WebGLActiveInfo? getActiveUniform(WebGLProgram? program, GLuint index);
static bool JSB_glGetActiveUniform(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;
    WebGLProgram* arg0;
    int32_t arg1;

    ok &= seval_to_native_ptr(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    s.rval().setNull();
    SE_PRECONDITION4(arg1 >= 0, false, GL_INVALID_VALUE);
#endif
    GLuint id = arg0 != nullptr ? arg0->_id : 0;
    GLsizei length;
    JSB_GL_CHECK(glGetProgramiv(id, GL_ACTIVE_UNIFORM_MAX_LENGTH, &length));
    GLchar* buffer = new (std::nothrow) GLchar[length];
    GLint size = -1;
    GLenum type = -1;

    JSB_GL_CHECK(glGetActiveUniform(id, arg1, length, NULL, &size, &type, buffer));

    if (size == -1 || type == -1) {
        s.rval().setNull();
    } else {
        se::Object* object = se::Object::createObjectWithClass(__jsb_WebGLActiveInfo_class);
        s.rval().setObject(object, true);
        object->decRef();
        object->setProperty("size", se::Value((int32_t)size));
        object->setProperty("type", se::Value((int32_t)type));
        object->setProperty("name", se::Value((char*)buffer));
    }

    CC_SAFE_DELETE_ARRAY(buffer);
    return true;
}
SE_BIND_FUNC(JSB_glGetActiveUniform)

// sequence<WebGLShader>? getAttachedShaders(WebGLProgram? program);
static bool JSB_glGetAttachedShaders(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    WebGLProgram* arg0;

    s.rval().setNull();
    ok &= seval_to_native_ptr(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint id = arg0 != nullptr ? arg0->_id : 0;

    GLsizei length;
    JSB_GL_CHECK(glGetProgramiv(id, GL_ATTACHED_SHADERS, &length));
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(glGetError() == 0, false, arg0 != nullptr ? GL_NO_ERROR : GL_INVALID_VALUE);
#endif
    GLuint* buffer = new (std::nothrow) GLuint[length];
    memset(buffer, 0, length * sizeof(GLuint));
    //Fix bug 2448, it seems that glGetAttachedShaders will crash if we send NULL to the third parameter (eg Windows), same as in lua binding
    GLsizei realShaderCount = 0;
    JSB_GL_CHECK(glGetAttachedShaders(id, length, &realShaderCount, buffer));

    se::HandleObject jsobj(se::Object::createArrayObject(length));

    for (int i=0, index = 0; i<length; ++i)
    {
        auto iter = __shaders.find(buffer[i]);
        if (iter != __shaders.end())
        {
            jsobj->setArrayElement(index, iter->second);
            ++index;
        }
    }

    s.rval().setObject(jsobj.get());
    CC_SAFE_DELETE_ARRAY(buffer);
    return true;

}
SE_BIND_FUNC(JSB_glGetAttachedShaders)

// sequence<DOMString>? getSupportedExtensions();
static bool JSB_glGetSupportedExtensions(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    const GLubyte *extensions = glGetString(GL_EXTENSIONS);

    se::HandleObject jsobj(se::Object::createArrayObject(1));

    // copy, to be able to add '\0'
    size_t len = strlen((char*)extensions);
    GLubyte* copy = new (std::nothrow) GLubyte[len+1];
    copy[len] = '\0';
    strncpy((char*)copy, (const char*)extensions, len );

    size_t start_extension = 0;
    uint32_t element = 0;
    for( size_t i=0; i<len+1; i++) {
        if( copy[i]==' ' || copy[i]==',' || i==len ) {
            copy[i] = 0;

            const char* extensionName = (const char*)&copy[start_extension];
            if (0 == strcmp(extensionName, "GL_EXT_texture_compression_s3tc"))
                extensionName = "WEBGL_compressed_texture_s3tc";
            else if (0 == strcmp(extensionName, "GL_OES_compressed_ETC1_RGB8_texture"))
                extensionName = "WEBGL_compressed_texture_etc1";
            else if (0 == strcmp(extensionName, "GL_IMG_texture_compression_pvrtc"))
                extensionName = "WEBGL_compressed_texture_pvrtc";

            jsobj->setArrayElement(element, se::Value(extensionName));

            start_extension = i+1;
            ++element;
            ++i;
        }
    }

    s.rval().setObject(jsobj.get());
    CC_SAFE_DELETE_ARRAY(copy);
    return true;

}
SE_BIND_FUNC(JSB_glGetSupportedExtensions)

// any getTexParameter(GLenum target, GLenum pname);
static bool JSB_glGetTexParameterfv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false,"JSB_glGetTexParameterfv: Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0, arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );

    SE_PRECONDITION2(ok, false, "JSB_glGetTexParameterfv: Error processing arguments");
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(arg0 == GL_TEXTURE_2D || arg0 == GL_TEXTURE_CUBE_MAP, false, GL_INVALID_ENUM);
    SE_PRECONDITION4(arg1 == GL_TEXTURE_MIN_FILTER || arg1 == GL_TEXTURE_MAG_FILTER ||
                     arg1 == GL_TEXTURE_WRAP_S || arg1 == GL_TEXTURE_WRAP_T, false, GL_INVALID_ENUM);
#endif
    GLfloat param;
    JSB_GL_CHECK(glGetTexParameterfv(arg0, arg1, &param));

    s.rval().setFloat(param);
    return true;
}
SE_BIND_FUNC(JSB_glGetTexParameterfv)

// GLenum target, GLenum attachment, GLenum pname
static bool JSB_glGetFramebufferAttachmentParameter(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 3, false,"Invalid number of arguments" );

    bool ok = true;
    uint32_t target, attachment, pname;

    ok &= seval_to_uint32(args[0], &target );
    ok &= seval_to_uint32(args[1], &attachment );
    ok &= seval_to_uint32(args[2], &pname );

    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLint param = 0;
#if OPENGL_PARAMETER_CHECK
    SE_PRECONDITION4(GL_FRAMEBUFFER == target, false, GL_INVALID_ENUM);
    SE_PRECONDITION4(pname == GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE || pname == GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME ||
                             pname == GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL|| pname == GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE, false, GL_INVALID_ENUM);
#endif
    JSB_GL_CHECK(glGetFramebufferAttachmentParameteriv(target, attachment, pname, &param));
    if( pname == GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME ) {
        GLint ptype;
        glGetFramebufferAttachmentParameteriv(target, attachment, GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE, &ptype);

        if( ptype == GL_RENDERBUFFER ) {
            auto iter = __webglRenderbufferMap.find(param);
            if (iter != __webglRenderbufferMap.end()) {
                auto objIter = se::NativePtrToObjectMap::find(iter->second);
                if (objIter != se::NativePtrToObjectMap::end()) {
                    s.rval().setObject(objIter->second);
                }
                else {
                    s.rval().setNull();
                }
                return true;
            }
        }
        else if( ptype == GL_TEXTURE ) {
            auto iter = __webglTextureMap.find(param);
            if (iter != __webglTextureMap.end()) {
                auto objIter = se::NativePtrToObjectMap::find(iter->second);
                if (objIter != se::NativePtrToObjectMap::end()) {
                    s.rval().setObject(objIter->second);
                }
                else {
                    s.rval().setNull();
                }
                return true;
            }
        }
        else {
            s.rval().setNull();
            return true;
        }
    }

    s.rval().setInt32(param);

    return true;
}
SE_BIND_FUNC(JSB_glGetFramebufferAttachmentParameter)

// any getUniform(WebGLProgram? program, WebGLUniformLocation? location);
static bool JSB_glGetUniformfv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false,"Invalid number of arguments" );

    bool ok = true;
    WebGLProgram* arg0;
    uint32_t arg1;

    s.rval().setNull();
    SE_PRECONDITION2(!args[0].isNullOrUndefined(), false, "Error processing arguments");
    SE_PRECONDITION2(!args[1].isNullOrUndefined(), false, "Error processing arguments");
    ok &= seval_to_native_ptr(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    SE_PRECONDITION2(arg0 != nullptr, false, "WebGLProgram is null!");

    GLuint id = arg0 != nullptr ? arg0->_id : 0;
    GLint activeUniforms;
    JSB_GL_CHECK(glGetProgramiv(id, GL_ACTIVE_UNIFORMS, &activeUniforms));

    GLsizei length;
    JSB_GL_CHECK(glGetProgramiv(id, GL_ACTIVE_UNIFORM_MAX_LENGTH, &length));
    GLchar* namebuffer = new (std::nothrow) GLchar[length+1];
    GLint size = -1;
    GLenum type = -1;

    bool isLocationFound = false;
    for (int i = 0; i  <  activeUniforms; ++i)
    {
        JSB_GL_CHECK(glGetActiveUniform(id, i, length, NULL, &size, &type, namebuffer));
        if(arg1 == glGetUniformLocation(id, namebuffer))
        {
            isLocationFound = true;
            break;
        }
    }

    if(!isLocationFound)
    {
        size = -1;
        type = -1;
    }
    CC_SAFE_DELETE_ARRAY(namebuffer);

    int usize = 0;
    int utype = 0;
    switch(type) {
            //boolean
        case GL_BOOL:
            usize = 1;
            utype = GL_BOOL;
            break;
        case GL_BOOL_VEC2:
            usize = 2;
            utype = GL_BOOL_ARRAY;
            break;
        case GL_BOOL_VEC3:
            usize = 3;
            utype = GL_BOOL_ARRAY;
            break;
        case GL_BOOL_VEC4:
            usize = 4;
            utype = GL_BOOL_ARRAY;
            break;

        // float
        case GL_FLOAT:
            usize = 1;
            utype = GL_FLOAT;
            break;
        case GL_FLOAT_MAT2:
            usize = 2 * 2;
            utype = GL_FLOAT_ARRAY;
            break;
        case GL_FLOAT_MAT3:
            usize = 3 * 3;
            utype = GL_FLOAT_ARRAY;
            break;
        case GL_FLOAT_MAT4:
            usize = 4 * 4;
            utype = GL_FLOAT_ARRAY;
            break;
        case GL_FLOAT_VEC2:
            usize = 2;
            utype = GL_FLOAT_ARRAY;
            break;
        case GL_FLOAT_VEC3:
            usize = 3;
            utype = GL_FLOAT_ARRAY;
            break;
        case GL_FLOAT_VEC4:
            usize = 4;
            utype = GL_FLOAT_ARRAY;
            break;

            // int
        case GL_INT:
        case GL_SAMPLER_2D:
        case GL_SAMPLER_CUBE:
            usize = 1;
            utype = GL_INT;
            break;
        case GL_INT_VEC2:
            usize = 2;
            utype = GL_INT_ARRAY;
            break;
        case GL_INT_VEC3:
            usize = 3;
            utype = GL_INT_ARRAY;
            break;
        case GL_INT_VEC4:
            usize = 4;
            utype = GL_INT_ARRAY;
            break;

        default:
            SE_REPORT_ERROR("glGetUniformfv: Uniform Type (%d) not supported", (int)type);
            return false;
    }

    if( utype == GL_BOOL_ARRAY)
    {
        std::vector<GLint> param(usize);
        JSB_GL_CHECK(glGetUniformiv(id, arg1, param.data()));
        se::HandleObject arrayObj(se::Object::createArrayObject((size_t)usize));
        for (int i = 0; i < usize; ++i)
        {
            arrayObj->setArrayElement(i, se::Value(param[i] != 0));
        }
        s.rval().setObject(arrayObj);
        return true;
    }
    else if( utype == GL_FLOAT_ARRAY)
    {
        std::vector<GLfloat> param(usize);
        JSB_GL_CHECK(glGetUniformfv(id, arg1, param.data()));
        se::HandleObject obj(se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, param.data(), usize * sizeof(GLfloat)));
        s.rval().setObject(obj);
        return true;
    }
    else if(utype == GL_INT_ARRAY)
    {
        std::vector<GLint> param(usize);
        JSB_GL_CHECK(glGetUniformiv(id, arg1, param.data()));
        se::HandleObject obj(se::Object::createTypedArray(se::Object::TypedArrayType::INT32, param.data(), usize * sizeof(GLint)));
        s.rval().setObject(obj);
        return true;
    }

    if( utype == GL_FLOAT)
    {
        GLfloat param = 0;
        JSB_GL_CHECK(glGetUniformfv(id, arg1, &param));

        s.rval().setFloat(param);
        return true;
    }
    else if( utype == GL_INT )
    {
        GLint param = 0;
        JSB_GL_CHECK(glGetUniformiv(id, arg1, &param));

        s.rval().setInt32(param);
        return true;
    }
    else if( utype == GL_BOOL )
    {
        GLint param = 0;
        JSB_GL_CHECK(glGetUniformiv(id, arg1, &param));

        s.rval().setBoolean(param != 0);
        return true;
    }

    SE_REPORT_ERROR("Supported type: %d", utype);
    return false;
}
SE_BIND_FUNC(JSB_glGetUniformfv)

static bool JSB_glGetParameter(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc < 1)
    {
        SE_REPORT_ERROR("Wrong argument count passed to gl.getParameter, expected: %d, get: %d", 1, argc);
        return false;
    }

    int pname = args[0].toInt32();

    int intbuffer[4];
    float floatvalue;

    auto& ret = s.rval();

    switch( pname ) {
            // Need to emulate MAX_FRAGMENT/VERTEX_UNIFORM_VECTORS and MAX_VARYING_VECTORS
            // because desktop GL's corresponding queries return the number of components
            // whereas GLES2 return the number of vectors (each vector has 4 components).
            // Therefore, the value returned by desktop GL needs to be divided by 4.
        case GL_MAX_FRAGMENT_UNIFORM_VECTORS:
        {
#if (CC_TARGET_PLATFORM == CC_PLATFORM_MAC) || (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
            GL_CHECK(glGetIntegerv(GL_MAX_FRAGMENT_UNIFORM_COMPONENTS, intbuffer));
            s.rval().setInt32(intbuffer[0] / 4);
#else
            GL_CHECK(glGetIntegerv(GL_MAX_FRAGMENT_UNIFORM_VECTORS, intbuffer));
            s.rval().setInt32(intbuffer[0]);
#endif
        }
            break;
        case GL_MAX_VERTEX_UNIFORM_VECTORS:
        {
#if (CC_TARGET_PLATFORM == CC_PLATFORM_MAC) || (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
            GL_CHECK(glGetIntegerv(GL_MAX_VERTEX_UNIFORM_COMPONENTS, intbuffer));
            s.rval().setInt32(intbuffer[0] / 4);
#else
            GL_CHECK(glGetIntegerv(GL_MAX_VERTEX_UNIFORM_VECTORS, intbuffer));
            s.rval().setInt32(intbuffer[0]);
#endif
        }
            break;
        case GL_MAX_VARYING_VECTORS:
        {
#if (CC_TARGET_PLATFORM == CC_PLATFORM_MAC) || (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
//            GL_CHECK(glGetIntegerv(GL_MAX_VARYING_COMPONENTS, intbuffer));
            s.rval().setInt32(8);//IDEA:: intbuffer[0] / 4);
#else
            GL_CHECK(glGetIntegerv(GL_MAX_VARYING_VECTORS, intbuffer));
            s.rval().setInt32(intbuffer[0]);
#endif
        }
            break;
            // Float32Array (with 0 elements)
        case GL_COMPRESSED_TEXTURE_FORMATS:
            ret.setObject(se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, nullptr, 0), true);
            break;

            // Float32Array (with 2 elements)
        case GL_ALIASED_LINE_WIDTH_RANGE:
        case GL_ALIASED_POINT_SIZE_RANGE:
        case GL_DEPTH_RANGE:
        {
            GLfloat params[2];
            JSB_GL_CHECK(glGetFloatv(pname, params));
            ret.setObject(se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, params, sizeof(params)), true);
        }
            break;

        case GL_STENCIL_TEST:
        case GL_SCISSOR_TEST:
        case GL_SAMPLE_COVERAGE_INVERT:
        case GL_POLYGON_OFFSET_FILL:
        case GL_DITHER:
        case GL_DEPTH_WRITEMASK:
        case GL_DEPTH_TEST:
        case GL_CULL_FACE:
        case GL_BLEND:
        {
            GLboolean data;
            JSB_GL_CHECK(glGetBooleanv(pname, &data));
            ret.setBoolean(data);
        }
            break;

            // Float32Array (with 4 values)
        case GL_BLEND_COLOR:
        case GL_COLOR_CLEAR_VALUE:
        {
            GLfloat params[4];
            JSB_GL_CHECK(glGetFloatv(pname, params));
            ret.setObject(se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, params, sizeof(params)), true);
        }
            break;

            // Int32Array (with 2 values)
        case GL_MAX_VIEWPORT_DIMS:
        {
            GLfloat params[2];
            JSB_GL_CHECK(glGetFloatv(pname, params));
            int intParams[2] = {(int)params[0], (int)params[1]};
            ret.setObject(se::Object::createTypedArray(se::Object::TypedArrayType::INT32, intParams, sizeof(intParams)), true);
        }
            break;

            // Int32Array (with 4 values)
        case GL_SCISSOR_BOX:
        case GL_VIEWPORT:
        {
            GLfloat params[4];
            JSB_GL_CHECK(glGetFloatv(pname, params));
            int intParams[4] = {(int)params[0], (int)params[1], (int)params[2], (int)params[3]};
            ret.setObject(se::Object::createTypedArray(se::Object::TypedArrayType::INT32, intParams, sizeof(intParams)), true);
        }
            break;

            // boolean[] (with 4 values)
        case GL_COLOR_WRITEMASK:
        {
            JSB_GL_CHECK(glGetIntegerv(pname, intbuffer));
            se::HandleObject arr(se::Object::createArrayObject(4));
            for(int i = 0; i < 4; i++ ) {
                arr->setArrayElement(i, se::Value(intbuffer[i] != 0));
            }
            ret.setObject(arr, true);
        }
            break;

            //IDEA:: WebGLBuffer
        case GL_ARRAY_BUFFER_BINDING:
        case GL_ELEMENT_ARRAY_BUFFER_BINDING:
        {
            JSB_GL_CHECK(glGetIntegerv(pname, intbuffer));
            if (intbuffer[0] > 0) {
                auto iter = __webglBufferMap.find(intbuffer[0]);
                if (iter != __webglBufferMap.end()) {
                    auto objIter = se::NativePtrToObjectMap::find(iter->second);
                    if (objIter != se::NativePtrToObjectMap::end()) {
                        s.rval().setObject(objIter->second);
                    }
                    else {
                        s.rval().setNull();
                    }
                }
            } else {
                ret.setNull();
            }
        }
            break;

            // WebGLProgram
        case GL_CURRENT_PROGRAM:
        {
            JSB_GL_CHECK(glGetIntegerv(pname, intbuffer));
            if (intbuffer[0] > 0) {
                auto iter = __webglProgramMap.find(intbuffer[0]);
                if (iter != __webglProgramMap.end()) {
                    auto objIter = se::NativePtrToObjectMap::find(iter->second);
                    if (objIter != se::NativePtrToObjectMap::end()) {
                        s.rval().setObject(objIter->second);
                    }
                    else {
                        s.rval().setNull();
                    }
                }
            } else {
                ret.setNull();
            }
        }
            break;

            // WebGLFramebuffer
        case GL_FRAMEBUFFER_BINDING:
        {
            JSB_GL_CHECK(glGetIntegerv(pname, intbuffer));
            if (intbuffer[0] > 0) {
                auto iter = __webglFramebufferMap.find(intbuffer[0]);
                if (iter != __webglFramebufferMap.end()) {
                    auto objIter = se::NativePtrToObjectMap::find(iter->second);
                    if (objIter != se::NativePtrToObjectMap::end()) {
                        s.rval().setObject(objIter->second);
                    }
                    else {
                        s.rval().setNull();
                    }
                }
            } else {
                ret.setNull();
            }
        }
            break;

            // WebGLRenderbuffer
        case GL_RENDERBUFFER_BINDING:
        {
            JSB_GL_CHECK(glGetIntegerv(pname, intbuffer));
            if (intbuffer[0] > 0) {
                auto iter = __webglRenderbufferMap.find(intbuffer[0]);
                if (iter != __webglRenderbufferMap.end()) {
                    auto objIter = se::NativePtrToObjectMap::find(iter->second);
                    if (objIter != se::NativePtrToObjectMap::end()) {
                        s.rval().setObject(objIter->second);
                    }
                    else {
                        s.rval().setNull();
                    }
                }
            } else {
                ret.setNull();
            }
        }
            break;

            // WebGLTexture
        case GL_TEXTURE_BINDING_2D:
        case GL_TEXTURE_BINDING_CUBE_MAP:
        {
            JSB_GL_CHECK(glGetIntegerv(pname, intbuffer));
            if (intbuffer[0] > 0) {
                auto iter = __webglTextureMap.find(intbuffer[0]);
                if (iter != __webglTextureMap.end()) {
                    auto objIter = se::NativePtrToObjectMap::find(iter->second);
                    if (objIter != se::NativePtrToObjectMap::end()) {
                        s.rval().setObject(objIter->second);
                    }
                    else {
                        s.rval().setNull();
                    }
                }
            } else {
                ret.setNull();
            }
        }
            break;

        case GL_UNPACK_FLIP_Y_WEBGL:
            ret.setBoolean(ccIsUnpackFlipY());
            break;

        case GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL:
            ret.setBoolean(ccIsPremultiplyAlpha());
            break;

        case GL_UNPACK_COLORSPACE_CONVERSION_WEBGL:
            ret.setBoolean(false);
            break;

            // string
        case GL_RENDERER:
        case GL_SHADING_LANGUAGE_VERSION:
        case GL_VENDOR:
        case GL_VERSION:
            ret.setString((char *)glGetString(pname));
            break;

            // single float
        case GL_DEPTH_CLEAR_VALUE:
        case GL_LINE_WIDTH:
        case GL_POLYGON_OFFSET_FACTOR:
        case GL_POLYGON_OFFSET_UNITS:
        case GL_SAMPLE_COVERAGE_VALUE:
            JSB_GL_CHECK(glGetFloatv(pname, &floatvalue));
            ret.setFloat(floatvalue);
            break;

        case GL_STENCIL_BACK_VALUE_MASK:
        case GL_STENCIL_BACK_WRITEMASK:
        case GL_STENCIL_VALUE_MASK:
        case GL_STENCIL_WRITEMASK:
            JSB_GL_CHECK(glGetIntegerv(pname, intbuffer));
            ret.setUint32((uint32_t)intbuffer[0]);
            break;

        case GL_STENCIL_BACK_REF:
        case GL_BLEND_DST_RGB:
        case GL_MAX_VERTEX_ATTRIBS:
        case GL_MAX_TEXTURE_SIZE:
        case GL_MAX_RENDERBUFFER_SIZE:
        case GL_MAX_CUBE_MAP_TEXTURE_SIZE:
        case GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS:
        case GL_NUM_COMPRESSED_TEXTURE_FORMATS:
        case GL_UNPACK_ALIGNMENT:
        case GL_STENCIL_REF:
        case GL_STENCIL_PASS_DEPTH_PASS:
        case GL_STENCIL_PASS_DEPTH_FAIL:
        case GL_STENCIL_FUNC:
        case GL_STENCIL_FAIL:
        case GL_STENCIL_CLEAR_VALUE:
        case GL_STENCIL_BACK_PASS_DEPTH_PASS:
        case GL_STENCIL_BACK_PASS_DEPTH_FAIL:
        case GL_STENCIL_BACK_FUNC:
        case GL_STENCIL_BACK_FAIL:
        case GL_STENCIL_BITS:
        case GL_GENERATE_MIPMAP_HINT:
        case GL_FRONT_FACE:
        case GL_DEPTH_FUNC:
        case GL_CULL_FACE_MODE:
        case GL_BLEND_SRC_RGB:
        case GL_BLEND_SRC_ALPHA:
        case GL_BLEND_EQUATION_RGB:
        case GL_BLEND_EQUATION_ALPHA:
        case GL_BLEND_DST_ALPHA:
        case GL_ACTIVE_TEXTURE:
        case GL_MAX_TEXTURE_IMAGE_UNITS:
            JSB_GL_CHECK(glGetIntegerv(pname, intbuffer));
            ret.setInt32(intbuffer[0]);
            break;
            // single int/long/bool - everything else
        default:
            SE_LOGD("glGetIntegerv: pname: 0x%x\n", pname);
            ret.setNull();
            break;
    }

    // That was fun!
    return true;
}
SE_BIND_FUNC(JSB_glGetParameter)

static bool JSB_glGetShaderPrecisionFormat(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc < 2)
    {
        SE_REPORT_ERROR("Wrong argument count passed to gl.getParameter, expected: %d, get: %d", 1, argc);
        return false;
    }

    uint32_t shadertype;
    uint32_t precisiontype;

    bool ok = seval_to_uint32(args[0], &shadertype);
    SE_PRECONDITION2(ok, false, "Convert shadertype failed!");
    ok = seval_to_uint32(args[1], &precisiontype);
    SE_PRECONDITION2(ok, false, "Convert precisiontype failed!");

    if( shadertype != GL_VERTEX_SHADER && shadertype != GL_FRAGMENT_SHADER ) {
        SE_REPORT_ERROR("Unsupported shadertype: %u", shadertype);
        return false;
    }

    GLint rangeMin = 0, rangeMax = 0, precision = 0;
#if CC_TARGET_PLATFORM != CC_PLATFORM_MAC && CC_TARGET_PLATFORM != CC_PLATFORM_WIN32
    switch( precisiontype ) {
        case GL_LOW_INT:
        case GL_MEDIUM_INT:
        case GL_HIGH_INT:
            // These values are for a 32-bit twos-complement integer format.
            rangeMin = 31;
            rangeMax = 30;
            precision = 0;
            break;
        case GL_LOW_FLOAT:
        case GL_MEDIUM_FLOAT:
        case GL_HIGH_FLOAT:
            // These values are for an IEEE single-precision floating-point format.
            rangeMin = 127;
            rangeMax = 127;
            precision = 23;
            break;
        default:
            SE_REPORT_ERROR("Unsupported precisiontype: %u", precisiontype);
            return false;
    }
#endif

    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("rangeMin", se::Value(rangeMin));
    obj->setProperty("rangeMax", se::Value(rangeMax));
    obj->setProperty("precision", se::Value(precision));
    s.rval().setObject(obj);
    return true;
}
SE_BIND_FUNC(JSB_glGetShaderPrecisionFormat)


static bool JSB_glGetBufferParameter(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;

    uint32_t target; int32_t pname;
    GLint ret = -1;

    ok &= seval_to_uint32(args[0], &target );
    ok &= seval_to_int32(args[1], &pname );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glGetBufferParameteriv((GLenum)target, (GLenum)pname, &ret));

    if (ret >= 0){
        s.rval().setInt32(ret);
    } else{
        s.rval().setNull();
    }

    return true;
}
SE_BIND_FUNC(JSB_glGetBufferParameter)

static bool JSB_glGetRenderbufferParameter(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;

    uint32_t target; int32_t pname;
    GLint ret = -1;

    ok &= seval_to_uint32(args[0], &target );
    ok &= seval_to_int32(args[1], &pname );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glGetRenderbufferParameteriv((GLenum)target, (GLenum)pname, &ret));

    if (ret >= 0){
        s.rval().setInt32(ret);
    } else{
        s.rval().setNull();
    }

    return true;
}
SE_BIND_FUNC(JSB_glGetRenderbufferParameter)

static bool JSB_glFlushCommand(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 3, false, "Invalid number of arguments" );

    bool ok = false;
    uint32_t floatValueCount = 0;
    ok = seval_to_uint32(args[0], &floatValueCount);
    SE_PRECONDITION2(ok, false, "arg0 isn't a number!");
    GLsizei count = 0;
    GLvoid* data = nullptr;
    ok = JSB_get_arraybufferview_dataptr(args[1], &count, &data);
    SE_PRECONDITION2(ok, false, "Convert arg1 as typed array failed!");

    uint32_t commandCount = 0;
    ok = seval_to_uint32(args[2], &commandCount);
    SE_PRECONDITION2(ok, false, "arg2 isn't a number!");

    float* p = (float*)data;
    float* end = p + floatValueCount;
    uint32_t handledCommandCount = 0;

    while (p < end) {
        uint32_t commandID = (uint32_t)p[0];
        ++handledCommandCount;
        switch(commandID) {
            case GL_COMMAND_ACTIVE_TEXTURE:
                LOG_GL_COMMAND("Flush: ACTIVE_TEXTURE\n");
                JSB_GL_CHECK_VOID(ccActiveTexture((GLenum)p[1]));
                p += 2;
                break;
            case GL_COMMAND_ATTACH_SHADER:
                LOG_GL_COMMAND("Flush: ATTACH_SHADER\n");
                JSB_GL_CHECK_VOID(glAttachShader((GLuint)p[1], (GLuint)p[2]));
                p += 3;
                break;
            case GL_COMMAND_BIND_BUFFER:
                LOG_GL_COMMAND("Flush: BIND_BUFFER, %u\n", (GLuint)p[2]);
                JSB_GL_CHECK_VOID(ccBindBuffer((GLenum)p[1], (GLuint)p[2]));
                p += 3;
                break;
            case GL_COMMAND_BIND_FRAME_BUFFER:
            {
                LOG_GL_COMMAND("Flush: BIND_FRAME_BUFFER\n");
                GLuint fbo = (GLuint)p[2];
                if (0 == fbo)
                    fbo = __defaultFbo;
#if OPENGL_PARAMETER_CHECK
                SE_PRECONDITION4((GLenum)p[1] == GL_FRAMEBUFFER, false, GL_INVALID_ENUM);
#endif
                JSB_GL_CHECK_VOID(ccBindFramebuffer((GLenum)p[1], fbo));
                p += 3;
                break;
            }
            case GL_COMMAND_BIND_RENDER_BUFFER:
                LOG_GL_COMMAND("Flush: BIND_RENDER_BUFFER\n");
                JSB_GL_CHECK_VOID(glBindRenderbuffer((GLenum)p[1], (GLuint)p[2]));
                p += 3;
                break;
            case GL_COMMAND_BIND_TEXTURE:
                LOG_GL_COMMAND("Flush: BIND_TEXTURE\n");
                JSB_GL_CHECK_VOID(ccBindTexture((GLenum)p[1], (GLuint)p[2]));
                p += 3;
                break;
            case GL_COMMAND_BLEND_COLOR:
                LOG_GL_COMMAND("Flush: BLEND_COLOR\n");
                JSB_GL_CHECK_VOID(glBlendColor((GLclampf)p[1], (GLclampf)p[2], (GLclampf)p[3], (GLclampf)p[4]));
                p += 5;
                break;
            case GL_COMMAND_BLEND_EQUATION:
                LOG_GL_COMMAND("Flush: BLEND_EQUATION\n");
                JSB_GL_CHECK_VOID(glBlendEquation((GLenum)p[1]));
                p += 2;
                break;
            case GL_COMMAND_BLEND_EQUATION_SEPARATE:
                LOG_GL_COMMAND("Flush: BLEND_EQUATION_SEPARATE\n");
                JSB_GL_CHECK_VOID(glBlendEquationSeparate((GLenum)p[1], (GLenum)p[2]));
                p += 3;
                break;
            case GL_COMMAND_BLEND_FUNC:
                LOG_GL_COMMAND("Flush: BLEND_FUNC\n");
                JSB_GL_CHECK_VOID(glBlendFunc((GLenum)p[1], (GLenum)p[2]));
                p += 3;
                break;
            case GL_COMMAND_BLEND_FUNC_SEPARATE:
                LOG_GL_COMMAND("Flush: BLEND_FUNC_SEPARATE\n");
                JSB_GL_CHECK_VOID(glBlendFuncSeparate((GLenum)p[1], (GLenum)p[2], (GLenum)p[3], (GLenum)p[4]));
                p += 5;
                break;
            case GL_COMMAND_CLEAR:
                LOG_GL_COMMAND("Flush: CLEAR\n");
                JSB_GL_CHECK_VOID(glClear((GLbitfield)p[1]));
                p += 2;
                break;
            case GL_COMMAND_CLEAR_COLOR:
                LOG_GL_COMMAND("Flush: CLEAR_COLOR\n");
                JSB_GL_CHECK_VOID(glClearColor((GLclampf)p[1], (GLclampf)p[2], (GLclampf)p[3], (GLclampf)p[4]));
                p += 5;
                break;
            case GL_COMMAND_CLEAR_DEPTH:
                LOG_GL_COMMAND("Flush: CLEAR_DEPTH\n");
                JSB_GL_CHECK_VOID(glClearDepthf(p[1]));
                p += 2;
                break;
            case GL_COMMAND_CLEAR_STENCIL:
                LOG_GL_COMMAND("Flush: CLEAR_STENCIL\n");
                JSB_GL_CHECK_VOID(glClearStencil((GLint)p[1]));
                p += 2;
                break;
            case GL_COMMAND_COLOR_MASK:
                LOG_GL_COMMAND("Flush: COLOR_MASK\n");
                JSB_GL_CHECK_VOID(glColorMask((GLboolean)p[1], (GLboolean)p[2], (GLboolean)p[3], (GLboolean)p[4]));
                p += 5;
                break;
            case GL_COMMAND_COMPILE_SHADER:
                LOG_GL_COMMAND("Flush: COMPILE_SHADER\n");
                JSB_GL_CHECK_VOID(glCompileShader((GLuint)p[1]));
                p += 2;
                break;
            case GL_COMMAND_COPY_TEX_IMAGE_2D:
                LOG_GL_COMMAND("Flush: COPY_TEX_IMAGE_2D\n");
                JSB_GL_CHECK_VOID(glCopyTexImage2D((GLenum)p[1], (GLint)p[2], (GLenum)p[3], (GLint)p[4], (GLint)p[5], (GLsizei)p[6], (GLsizei)p[7], (GLint)p[8]));
                p += 9;
                break;
            case GL_COMMAND_COPY_TEX_SUB_IMAGE_2D:
                LOG_GL_COMMAND("Flush: COPY_TEX_SUB_IMAGE_2D\n");
                JSB_GL_CHECK_VOID(glCopyTexSubImage2D((GLenum)p[1], (GLint)p[2], (GLint)p[3], (GLint)p[4], (GLint)p[5], (GLint)p[6], (GLsizei)p[7], (GLsizei)p[8]));
                p += 9;
                break;
            case GL_COMMAND_CULL_FACE:
                LOG_GL_COMMAND("Flush: CULL_FACE\n");
                JSB_GL_CHECK_VOID(glCullFace((GLenum)p[1]));
                p += 2;
                break;
            case GL_COMMAND_DELETE_BUFFER:
            {
                LOG_GL_COMMAND("Flush: DELETE_BUFFER\n");
                GLuint id = (GLuint)p[1];
                JSB_GL_CHECK_VOID(ccDeleteBuffers(1, &id));
                safeRemoveElementFromGLObjectMap(__webglBufferMap, id);
                p += 2;
                break;
            }
            case GL_COMMAND_DELETE_FRAME_BUFFER:
            {
                LOG_GL_COMMAND("Flush: DELETE_FRAME_BUFFER\n");
                GLuint id = (GLuint)p[1];
                JSB_GL_CHECK_VOID(glDeleteFramebuffers(1, &id));
                safeRemoveElementFromGLObjectMap(__webglFramebufferMap, id);
                p += 2;
                break;
            }
            case GL_COMMAND_DELETE_PROGRAM:
            {
                LOG_GL_COMMAND("Flush: DELETE_PROGRAM\n");
                GLuint id = (GLuint)p[1];
                JSB_GL_CHECK_VOID(glDeleteProgram(id));
                safeRemoveElementFromGLObjectMap(__webglProgramMap, id);
                p += 2;
                break;
            }
            case GL_COMMAND_DELETE_RENDER_BUFFER:
            {
                LOG_GL_COMMAND("Flush: DELETE_RENDER_BUFFER\n");
                GLuint id = (GLuint)p[1];
                JSB_GL_CHECK_VOID(glDeleteRenderbuffers(1, &id));
                safeRemoveElementFromGLObjectMap(__webglRenderbufferMap, id);
                p += 2;
                break;
            }
            case GL_COMMAND_DELETE_SHADER:
            {
                LOG_GL_COMMAND("Flush: DELETE_SHADER\n");
                GLuint id = (GLuint)p[1];
                JSB_GL_CHECK_VOID(glDeleteShader(id));
                safeRemoveElementFromGLObjectMap(__webglShaderMap, id);
                p += 2;
                break;
            }
            case GL_COMMAND_DELETE_TEXTURE:
            {
                LOG_GL_COMMAND("Flush: DELETE_TEXTURE\n");
                GLuint id = (GLuint)p[1];
                JSB_GL_CHECK_VOID(glDeleteTextures(1, &id));
                safeRemoveElementFromGLObjectMap(__webglTextureMap, id);
                p += 2;
                break;
            }
            case GL_COMMAND_DEPTH_FUNC:
                LOG_GL_COMMAND("Flush: DEPTH_FUNC\n");
                JSB_GL_CHECK_VOID(glDepthFunc((GLenum)p[1]));
                p += 2;
                break;
            case GL_COMMAND_DEPTH_MASK:
                LOG_GL_COMMAND("Flush: DEPTH_MASK\n");
                JSB_GL_CHECK_VOID(glDepthMask((GLboolean)p[1]));
                p += 2;
                break;
            case GL_COMMAND_DEPTH_RANGE:
                LOG_GL_COMMAND("Flush: DEPTH_RANGE\n");
                JSB_GL_CHECK_VOID(glDepthRangef(p[1], p[2]));
                p += 3;
                break;
            case GL_COMMAND_DETACH_SHADER:
                LOG_GL_COMMAND("Flush: DETACH_SHADER\n");
                JSB_GL_CHECK_VOID(glDetachShader((GLuint)p[1], (GLuint) p[2]));
                p += 3;
                break;
            case GL_COMMAND_DISABLE:
                LOG_GL_COMMAND("Flush: DISABLE\n");
                JSB_GL_CHECK_VOID(glDisable((GLenum)p[1]));
                p += 2;
                break;
            case GL_COMMAND_DISABLE_VERTEX_ATTRIB_ARRAY:
                LOG_GL_COMMAND("Flush: DISABLE_VERTEX_ATTRIB_ARRAY\n");
                JSB_GL_CHECK_VOID(ccDisableVertexAttribArray((GLuint)p[1]));
                p += 2;
                break;
            case GL_COMMAND_DRAW_ARRAYS:
                LOG_GL_COMMAND("Flush: DRAW_ARRAYS, %u, %d, %d\n", (GLenum)p[1], (GLint)p[2], (int)p[3]);
                JSB_GL_CHECK_VOID(glDrawArrays((GLenum)p[1], (GLint)p[2], (GLsizei)p[3]));
                p += 4;
                break;
            case GL_COMMAND_DRAW_ELEMENTS:
                LOG_GL_COMMAND("Flush: DRAW_ELEMENTS\n");
                JSB_GL_CHECK_VOID(glDrawElements((GLenum)p[1], (GLsizei)p[2], (GLenum)p[3], (const GLvoid*)(intptr_t)p[4]));
                p += 5;
                break;
            case GL_COMMAND_ENABLE:
                LOG_GL_COMMAND("Flush: ENABLE\n");
                JSB_GL_CHECK_VOID(glEnable((GLenum)p[1]));
                p += 2;
                break;
            case GL_COMMAND_ENABLE_VERTEX_ATTRIB_ARRAY:
                LOG_GL_COMMAND("Flush: ENABLE_VERTEX_ATTRIB_ARRAY, %u\n", (GLuint)p[1]);
                JSB_GL_CHECK_VOID(ccEnableVertexAttribArray((GLuint)p[1]));
                p += 2;
                break;
            case GL_COMMAND_FINISH:
                LOG_GL_COMMAND("Flush: FINISH\n");
                JSB_GL_CHECK_VOID(glFinish());
                p += 1;
                break;
            case GL_COMMAND_FLUSH:
                LOG_GL_COMMAND("Flush: FLUSH\n");
                JSB_GL_CHECK_VOID(glFlush());
                p += 1;
                break;
            case GL_COMMAND_FRAME_BUFFER_RENDER_BUFFER:
                LOG_GL_COMMAND("Flush: FRAME_BUFFER_RENDER_BUFFER\n");
                JSB_GL_CHECK_VOID(WEBGL_framebufferRenderbuffer((GLenum)p[1], (GLenum)p[2], (GLenum)p[3], (GLuint)p[4]));
                p += 5;
                break;
            case GL_COMMAND_FRAME_BUFFER_TEXTURE_2D:
                LOG_GL_COMMAND("Flush: FRAME_BUFFER_TEXTURE_2D\n");
                JSB_GL_CHECK_VOID(glFramebufferTexture2D((GLenum)p[1], (GLenum)p[2], (GLenum)p[3], (GLuint)p[4], (GLint)p[5]));
                p += 6;
                break;
            case GL_COMMAND_FRONT_FACE:
                LOG_GL_COMMAND("Flush: FRONT_FACE\n");
                JSB_GL_CHECK_VOID(glFrontFace((GLenum)p[1]));
                p += 2;
                break;
            case GL_COMMAND_GENERATE_MIPMAP:
                LOG_GL_COMMAND("Flush: GENERATE_MIPMAP\n");
                JSB_GL_CHECK_VOID(glGenerateMipmap((GLenum)p[1]));
                p += 2;
                break;
            case GL_COMMAND_HINT:
                LOG_GL_COMMAND("Flush: HINT\n");
                JSB_GL_CHECK_VOID(glHint((GLenum)p[1], (GLenum)p[2]));;
                p += 3;
                break;
            case GL_COMMAND_LINE_WIDTH:
            LOG_GL_COMMAND("Flush: LINE_WIDTH\n");
            JSB_GL_CHECK_VOID(glLineWidth(p[1]));
            p += 2;
                break;
            case GL_COMMAND_LINK_PROGRAM:
                LOG_GL_COMMAND("Flush: LINK_PROGRAM\n");
                JSB_GL_CHECK_VOID(glLinkProgram((GLuint)p[1]));
                p += 2;
                break;
            case GL_COMMAND_PIXEL_STOREI:
                LOG_GL_COMMAND("Flush: PIXEL_STOREI\n");
                JSB_GL_CHECK_VOID(ccPixelStorei((GLenum)p[1], (GLint)p[2]));
                p += 3;
                break;
            case GL_COMMAND_POLYGON_OFFSET:
                LOG_GL_COMMAND("Flush: POLYGON_OFFSET\n");
                JSB_GL_CHECK_VOID(glPolygonOffset(p[1], p[2]));
                p += 3;
                break;
            case GL_COMMAND_RENDER_BUFFER_STORAGE:
                LOG_GL_COMMAND("Flush: RENDER_BUFFER_STORAGE\n");
                JSB_GL_CHECK_VOID(WEBGL_renderbufferStorage((GLenum)p[1], (GLenum)p[2], (GLsizei)p[3], (GLsizei)p[4]));
                p += 5;
                break;
            case GL_COMMAND_SAMPLE_COVERAGE:
                LOG_GL_COMMAND("Flush: SAMPLE_COVERAGE\n");
                JSB_GL_CHECK_VOID(glSampleCoverage(p[1], (GLboolean)p[2]));
                p += 3;
                break;
            case GL_COMMAND_SCISSOR:
                LOG_GL_COMMAND("Flush: SCISSOR\n");
                JSB_GL_CHECK_VOID(ccScissor((GLint)p[1], (GLint)p[2], (GLsizei)p[3], (GLsizei)p[4]));
                p += 5;
                break;
            case GL_COMMAND_STENCIL_FUNC:
                LOG_GL_COMMAND("Flush: STENCIL_FUNC\n");
                JSB_GL_CHECK_VOID(glStencilFunc((GLenum)p[1], (GLint)p[2], (GLuint)p[3]));
                p += 4;
                break;
            case GL_COMMAND_STENCIL_FUNC_SEPARATE:
                LOG_GL_COMMAND("Flush: STENCIL_FUNC_SEPARATE\n");
                JSB_GL_CHECK_VOID(glStencilFuncSeparate((GLenum)p[1], (GLenum)p[2], (GLint)p[3], (GLuint)p[4]));
                p += 5;
                break;
            case GL_COMMAND_STENCIL_MASK:
                LOG_GL_COMMAND("Flush: STENCIL_MASK\n");
                JSB_GL_CHECK_VOID(glStencilMask((GLuint)p[1]));
                p += 2;
                break;
            case GL_COMMAND_STENCIL_MASK_SEPARATE:
                LOG_GL_COMMAND("Flush: STENCIL_MASK_SEPARATE\n");
                JSB_GL_CHECK_VOID(glStencilMaskSeparate((GLenum)p[1], (GLuint)p[2]));
                p += 3;
                break;
            case GL_COMMAND_STENCIL_OP:
                LOG_GL_COMMAND("Flush: STENCIL_OP\n");
                JSB_GL_CHECK_VOID(glStencilOp((GLenum)p[1], (GLenum)p[2], (GLenum)p[3]));
                p += 4;
                break;
            case GL_COMMAND_STENCIL_OP_SEPARATE:
                LOG_GL_COMMAND("Flush: STENCIL_OP_SEPARATE\n");
                JSB_GL_CHECK_VOID(glStencilOpSeparate((GLenum)p[1], (GLenum)p[2], (GLenum)p[3], (GLenum)p[4]));
                p += 5;
                break;
            case GL_COMMAND_TEX_PARAMETER_F:
                LOG_GL_COMMAND("Flush: TEX_PARAMETER_F\n");
                JSB_GL_CHECK_VOID(glTexParameterf((GLenum)p[1], (GLenum)p[2], p[3]));
                p += 4;
                break;
            case GL_COMMAND_TEX_PARAMETER_I:
                LOG_GL_COMMAND("Flush: TEX_PARAMETER_I\n");
                JSB_GL_CHECK_VOID(glTexParameteri((GLenum)p[1], (GLenum)p[2], (GLint)p[3]));
                p += 4;
                break;
            case GL_COMMAND_UNIFORM_1F:
                LOG_GL_COMMAND("Flush: UNIFORM_1F\n");
                JSB_GL_CHECK_VOID(glUniform1f((GLint)p[1], p[2]));
                p += 3;
                break;
            case GL_COMMAND_UNIFORM_2F:
                LOG_GL_COMMAND("Flush: UNIFORM_2F\n");
                JSB_GL_CHECK_VOID(glUniform2f((GLint)p[1], p[2], p[3]));
                p += 4;
                break;
            case GL_COMMAND_UNIFORM_3F:
                LOG_GL_COMMAND("Flush: UNIFORM_3F\n");
                JSB_GL_CHECK_VOID(glUniform3f((GLint)p[1], p[2], p[3], p[4]));
                p += 5;
                break;
            case GL_COMMAND_UNIFORM_4F:
                LOG_GL_COMMAND("Flush: UNIFORM_4F\n");
                JSB_GL_CHECK_VOID(glUniform4f((GLint)p[1], p[2], p[3], p[4], p[5]));
                p += 6;
                break;
            case GL_COMMAND_UNIFORM_1I:
                LOG_GL_COMMAND("Flush: UNIFORM_1I\n");
                JSB_GL_CHECK_VOID(glUniform1i((GLint)p[1], (GLint)p[2]));
                p += 3;
                break;
            case GL_COMMAND_UNIFORM_2I:
                LOG_GL_COMMAND("Flush: UNIFORM_2I\n");
                JSB_GL_CHECK_VOID(glUniform2i((GLint)p[1], (GLint)p[2], (GLint)p[3]));
                p += 4;
                break;
            case GL_COMMAND_UNIFORM_3I:
                LOG_GL_COMMAND("Flush: UNIFORM_3I\n");
                JSB_GL_CHECK_VOID(glUniform3i((GLint)p[1], (GLint)p[2], (GLint)p[3], (GLint)p[4]));
                p += 5;
                break;
            case GL_COMMAND_UNIFORM_4I:
                LOG_GL_COMMAND("Flush: UNIFORM_4I\n");
                JSB_GL_CHECK_VOID(glUniform4i((GLint)p[1], (GLint)p[2], (GLint)p[3], (GLint)p[4], (GLint)p[5]));
                p += 6;
                break;
            case GL_COMMAND_UNIFORM_1FV:
            {
                LOG_GL_COMMAND("Flush: UNIFORM_1FV\n");
                GLsizei elementCount = (GLsizei)p[2];
                JSB_GL_CHECK_VOID(glUniform1fv((GLint)p[1], elementCount, &p[3]));
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_UNIFORM_2FV:
            {
                LOG_GL_COMMAND("Flush: UNIFORM_2FV\n");
                GLsizei elementCount = (GLsizei)p[2];
                JSB_GL_CHECK_VOID(glUniform2fv((GLint)p[1], elementCount / 2, &p[3]));
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_UNIFORM_3FV:
            {
                LOG_GL_COMMAND("Flush: UNIFORM_3FV\n");
                GLsizei elementCount = (GLsizei)p[2];
                JSB_GL_CHECK_VOID(glUniform3fv((GLint)p[1], elementCount / 3, &p[3]));
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_UNIFORM_4FV:
            {
                LOG_GL_COMMAND("Flush: UNIFORM_4FV\n");
                GLsizei elementCount = (GLsizei)p[2];
                JSB_GL_CHECK_VOID(glUniform4fv((GLint)p[1], elementCount / 3, &p[3]));
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_UNIFORM_1IV:
            {
                LOG_GL_COMMAND("Flush: UNIFORM_1IV\n");
                GLsizei elementCount = (GLsizei)p[2];
                GLint* intBuf = (GLint*)malloc(elementCount * sizeof(GLint));
                for (GLsizei i = 0; i < elementCount; ++i)
                {
                    intBuf[i] = p[3+i];
                }
                JSB_GL_CHECK_VOID(glUniform1iv((GLint)p[1], elementCount, intBuf));
                free(intBuf);
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_UNIFORM_2IV:
            {
                LOG_GL_COMMAND("Flush: UNIFORM_2IV\n");
                GLsizei elementCount = (GLsizei)p[2];
                GLint* intBuf = (GLint*)malloc(elementCount * sizeof(GLint));
                for (GLsizei i = 0; i < elementCount; ++i)
                {
                    intBuf[i] = p[3+i];
                }
                JSB_GL_CHECK_VOID(glUniform2iv((GLint)p[1], elementCount / 2, intBuf));
                free(intBuf);
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_UNIFORM_3IV:
            {
                LOG_GL_COMMAND("Flush: UNIFORM_3IV\n");
                GLsizei elementCount = (GLsizei)p[2];
                GLint* intBuf = (GLint*)malloc(elementCount * sizeof(GLint));
                for (GLsizei i = 0; i < elementCount; ++i)
                {
                    intBuf[i] = p[3+i];
                }
                JSB_GL_CHECK_VOID(glUniform3iv((GLint)p[1], elementCount / 3, intBuf));
                free(intBuf);
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_UNIFORM_4IV:
            {
                LOG_GL_COMMAND("Flush: UNIFORM_4IV\n");
                GLsizei elementCount = (GLsizei)p[2];
                GLint* intBuf = (GLint*)malloc(elementCount * sizeof(GLint));
                for (GLsizei i = 0; i < elementCount; ++i)
                {
                    intBuf[i] = p[3+i];
                }
                JSB_GL_CHECK_VOID(glUniform4iv((GLint)p[1], elementCount / 4, intBuf));
                free(intBuf);
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_UNIFORM_MATRIX_2FV:
            {
                LOG_GL_COMMAND("Flush: UNIFORM_MATRIX_2FV\n");
                GLsizei elementCount = (GLsizei)p[3];
                JSB_GL_CHECK_VOID(glUniformMatrix2fv((GLint)p[1], elementCount / 4, (GLboolean)p[2], &p[4]));
                p += (elementCount + 4);
                break;
            }
            case GL_COMMAND_UNIFORM_MATRIX_3FV:
            {
                LOG_GL_COMMAND("Flush: UNIFORM_MATRIX_3FV\n");
                GLsizei elementCount = (GLsizei)p[3];
                JSB_GL_CHECK_VOID(glUniformMatrix3fv((GLint)p[1], elementCount / 9, (GLboolean)p[2], &p[4]));
                p += (elementCount + 4);
                break;
            }
            case GL_COMMAND_UNIFORM_MATRIX_4FV:
            {
                LOG_GL_COMMAND("Flush: UNIFORM_MATRIX_4FV\n");
                GLsizei elementCount = (GLsizei)p[3];
                JSB_GL_CHECK_VOID(glUniformMatrix4fv((GLint)p[1], elementCount / 16, (GLboolean)p[2], &p[4]));
                p += (elementCount + 4);
                break;
            }
            case GL_COMMAND_USE_PROGRAM:
                LOG_GL_COMMAND("Flush: USE_PROGRAM\n");
                JSB_GL_CHECK_VOID(glUseProgram((GLuint) p[1]));
                p += 2;
                break;
            case GL_COMMAND_VALIDATE_PROGRAM:
                LOG_GL_COMMAND("Flush: VALIDATE_PROGRAM\n");
                JSB_GL_CHECK_VOID(glValidateProgram((GLuint) p[1]));
                p += 2;
                break;
            case GL_COMMAND_VERTEX_ATTRIB_1F:
                LOG_GL_COMMAND("Flush: VERTEX_ATTRIB_1F\n");
                JSB_GL_CHECK_VOID(glVertexAttrib1f((GLuint)p[1], p[2]));
                p += 3;
                break;
            case GL_COMMAND_VERTEX_ATTRIB_2F:
                LOG_GL_COMMAND("Flush: VERTEX_ATTRIB_2F\n");
                JSB_GL_CHECK_VOID(glVertexAttrib2f((GLuint)p[1], p[2], p[3]));
                p += 4;
                break;
            case GL_COMMAND_VERTEX_ATTRIB_3F:
                LOG_GL_COMMAND("Flush: VERTEX_ATTRIB_3F\n");
                JSB_GL_CHECK_VOID(glVertexAttrib3f((GLuint)p[1], p[2], p[3], p[4]));
                p += 5;
                break;
            case GL_COMMAND_VERTEX_ATTRIB_4F:
                LOG_GL_COMMAND("Flush: VERTEX_ATTRIB_4F\n");
                JSB_GL_CHECK_VOID(glVertexAttrib4f((GLuint)p[1], p[2], p[3], p[4], p[5]));
                p += 6;
                break;
            case GL_COMMAND_VERTEX_ATTRIB_1FV:
            {
                LOG_GL_COMMAND("Flush: VERTEX_ATTRIB_1FV\n");
                GLsizei elementCount = (GLsizei)p[2];
                JSB_GL_CHECK_VOID(glVertexAttrib1fv((GLint)p[1], &p[3]));
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_VERTEX_ATTRIB_2FV:
            {
                LOG_GL_COMMAND("Flush: VERTEX_ATTRIB_2FV\n");
                GLsizei elementCount = (GLsizei)p[2];
                JSB_GL_CHECK_VOID(glVertexAttrib2fv((GLint)p[1], &p[3]));
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_VERTEX_ATTRIB_3FV:
            {
                LOG_GL_COMMAND("Flush: VERTEX_ATTRIB_3FV\n");
                GLsizei elementCount = (GLsizei)p[2];
                JSB_GL_CHECK_VOID(glVertexAttrib3fv((GLint)p[1], &p[3]));
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_VERTEX_ATTRIB_4FV:
            {
                LOG_GL_COMMAND("Flush: VERTEX_ATTRIB_4FV\n");
                GLsizei elementCount = (GLsizei)p[2];
                JSB_GL_CHECK_VOID(glVertexAttrib4fv((GLint)p[1], &p[3]));
                p += (elementCount + 3);
                break;
            }
            case GL_COMMAND_VERTEX_ATTRIB_POINTER:
                LOG_GL_COMMAND("Flush: VERTEX_ATTRIB_POINTER\n");
                JSB_GL_CHECK_VOID(ccVertexAttribPointer((GLuint)p[1], (GLint)p[2], (GLenum)p[3], (GLboolean)p[4], (GLsizei)p[5], (const GLvoid*)(GLintptr)p[6]));
                p += 7;
                break;
            case GL_COMMAND_VIEW_PORT:
                LOG_GL_COMMAND("Flush: VIEW_PORT\n");
                JSB_GL_CHECK_VOID(ccViewport((GLint)p[1], (GLint)p[2], (GLsizei)p[3], (GLsizei)p[4]));
                p += 5;
                break;
            default:
                assert(false);
        }
    }

    assert(handledCommandCount == commandCount);

    return true;
}
SE_BIND_FUNC(JSB_glFlushCommand)

bool JSB_register_opengl(se::Object* obj)
{
    glGetIntegerv(GL_FRAMEBUFFER_BINDING, &__defaultFbo);

    __jsb_WebGLObject_class = se::Class::create("WebGLObject", obj, nullptr, nullptr);
    __jsb_WebGLObject_class->install();

    se::Object* glObjectProto = __jsb_WebGLObject_class->getProto();

    __jsb_WebGLTexture_class = se::Class::create("WebGLTexture", obj, glObjectProto, nullptr);
    __jsb_WebGLTexture_class->defineFinalizeFunction(_SE(JSB_glTextureFinalize));
    __jsb_WebGLTexture_class->install();

    __jsb_WebGLProgram_class = se::Class::create("WebGLProgram", obj, glObjectProto, nullptr);
    __jsb_WebGLProgram_class->defineFinalizeFunction(_SE(JSB_glProgramFinalize));
    __jsb_WebGLProgram_class->install();

    __jsb_WebGLBuffer_class = se::Class::create("WebGLBuffer", obj, glObjectProto, nullptr);
    __jsb_WebGLBuffer_class->defineFinalizeFunction(_SE(JSB_glBufferFinalize));
    __jsb_WebGLBuffer_class->install();

    __jsb_WebGLRenderbuffer_class = se::Class::create("WebGLRenderbuffer", obj, glObjectProto, nullptr);
    __jsb_WebGLRenderbuffer_class->defineFinalizeFunction(_SE(JSB_glRenderbufferFinalize));
    __jsb_WebGLRenderbuffer_class->install();

    __jsb_WebGLFramebuffer_class = se::Class::create("WebGLFramebuffer", obj, glObjectProto, nullptr);
    __jsb_WebGLFramebuffer_class->defineFinalizeFunction(_SE(JSB_glFramebufferFinalize));
    __jsb_WebGLFramebuffer_class->install();

    __jsb_WebGLShader_class = se::Class::create("WebGLShader", obj, glObjectProto, nullptr);
    __jsb_WebGLShader_class->defineFinalizeFunction(_SE(JSB_glShaderFinalize));
    __jsb_WebGLShader_class->install();

    __jsb_WebGLActiveInfo_class = se::Class::create("WebGLActiveInfo", obj, nullptr, nullptr);
    __jsb_WebGLActiveInfo_class->install();

    // New WebGL functions, not present on OpenGL ES 2.0
    __glObj->defineFunction("getSupportedExtensions", _SE(JSB_glGetSupportedExtensions));
    __glObj->defineFunction("activeTexture", _SE(JSB_glActiveTexture));
    __glObj->defineFunction("attachShader", _SE(JSB_glAttachShader));
    __glObj->defineFunction("bindAttribLocation", _SE(JSB_glBindAttribLocation));
    __glObj->defineFunction("bindBuffer", _SE(JSB_glBindBuffer));
    __glObj->defineFunction("bindFramebuffer", _SE(JSB_glBindFramebuffer));
    __glObj->defineFunction("bindRenderbuffer", _SE(JSB_glBindRenderbuffer));
    __glObj->defineFunction("bindTexture", _SE(JSB_glBindTexture));
    __glObj->defineFunction("blendColor", _SE(JSB_glBlendColor));
    __glObj->defineFunction("blendEquation", _SE(JSB_glBlendEquation));
    __glObj->defineFunction("blendEquationSeparate", _SE(JSB_glBlendEquationSeparate));
    __glObj->defineFunction("blendFunc", _SE(JSB_glBlendFunc));
    __glObj->defineFunction("blendFuncSeparate", _SE(JSB_glBlendFuncSeparate));
    __glObj->defineFunction("bufferData", _SE(JSB_glBufferData));
    __glObj->defineFunction("bufferSubData", _SE(JSB_glBufferSubData));
    __glObj->defineFunction("checkFramebufferStatus", _SE(JSB_glCheckFramebufferStatus));
    __glObj->defineFunction("clear", _SE(JSB_glClear));
    __glObj->defineFunction("clearColor", _SE(JSB_glClearColor));
    __glObj->defineFunction("clearDepth", _SE(JSB_glClearDepthf));
    __glObj->defineFunction("clearStencil", _SE(JSB_glClearStencil));
    __glObj->defineFunction("colorMask", _SE(JSB_glColorMask));
    __glObj->defineFunction("compileShader", _SE(JSB_glCompileShader));
    __glObj->defineFunction("compressedTexImage2D", _SE(JSB_glCompressedTexImage2D));
    __glObj->defineFunction("compressedTexSubImage2D", _SE(JSB_glCompressedTexSubImage2D));
    __glObj->defineFunction("copyTexImage2D", _SE(JSB_glCopyTexImage2D));
    __glObj->defineFunction("copyTexSubImage2D", _SE(JSB_glCopyTexSubImage2D));
    __glObj->defineFunction("createProgram", _SE(JSB_glCreateProgram));
    __glObj->defineFunction("createShader", _SE(JSB_glCreateShader));
    __glObj->defineFunction("cullFace", _SE(JSB_glCullFace));
    __glObj->defineFunction("deleteBuffer", _SE(JSB_glDeleteBuffer));
    __glObj->defineFunction("deleteFramebuffer", _SE(JSB_glDeleteFramebuffer));
    __glObj->defineFunction("deleteProgram", _SE(JSB_glDeleteProgram));
    __glObj->defineFunction("deleteRenderbuffer", _SE(JSB_glDeleteRenderbuffer));
    __glObj->defineFunction("deleteShader", _SE(JSB_glDeleteShader));
    __glObj->defineFunction("deleteTexture", _SE(JSB_glDeleteTextures));
    __glObj->defineFunction("depthFunc", _SE(JSB_glDepthFunc));
    __glObj->defineFunction("depthMask", _SE(JSB_glDepthMask));
    __glObj->defineFunction("depthRange", _SE(JSB_glDepthRangef));
    __glObj->defineFunction("detachShader", _SE(JSB_glDetachShader));
    __glObj->defineFunction("disable", _SE(JSB_glDisable));
    __glObj->defineFunction("disableVertexAttribArray", _SE(JSB_glDisableVertexAttribArray));
    __glObj->defineFunction("drawArrays", _SE(JSB_glDrawArrays));
    __glObj->defineFunction("drawElements", _SE(JSB_glDrawElements));
    __glObj->defineFunction("enable", _SE(JSB_glEnable));
    __glObj->defineFunction("enableVertexAttribArray", _SE(JSB_glEnableVertexAttribArray));
    __glObj->defineFunction("finish", _SE(JSB_glFinish));
    __glObj->defineFunction("flush", _SE(JSB_glFlush));
    __glObj->defineFunction("framebufferRenderbuffer", _SE(JSB_glFramebufferRenderbuffer));
    __glObj->defineFunction("framebufferTexture2D", _SE(JSB_glFramebufferTexture2D));
    __glObj->defineFunction("frontFace", _SE(JSB_glFrontFace));
    __glObj->defineFunction("createBuffer", _SE(JSB_glCreateBuffer));
    __glObj->defineFunction("createFramebuffer", _SE(JSB_glCreateFramebuffer));
    __glObj->defineFunction("createRenderbuffer", _SE(JSB_glCreateRenderbuffer));
    __glObj->defineFunction("createTexture", _SE(JSB_glCreateTexture));
    __glObj->defineFunction("generateMipmap", _SE(JSB_glGenerateMipmap));
    __glObj->defineFunction("getActiveAttrib", _SE(JSB_glGetActiveAttrib));
    __glObj->defineFunction("getActiveUniform", _SE(JSB_glGetActiveUniform));
    __glObj->defineFunction("getAttachedShaders", _SE(JSB_glGetAttachedShaders));
    __glObj->defineFunction("getAttribLocation", _SE(JSB_glGetAttribLocation));
    __glObj->defineFunction("getError", _SE(JSB_glGetError));
    __glObj->defineFunction("getProgramInfoLog", _SE(JSB_glGetProgramInfoLog));
    __glObj->defineFunction("getProgramParameter", _SE(JSB_glGetProgramParameter));
    __glObj->defineFunction("getShaderInfoLog", _SE(JSB_glGetShaderInfoLog));
    __glObj->defineFunction("getShaderSource", _SE(JSB_glGetShaderSource));
    __glObj->defineFunction("getShaderParameter", _SE(JSB_glGetShaderParameter));
    __glObj->defineFunction("getTexParameter", _SE(JSB_glGetTexParameterfv));
    __glObj->defineFunction("getFramebufferAttachmentParameter", _SE(JSB_glGetFramebufferAttachmentParameter));
    __glObj->defineFunction("getUniformLocation", _SE(JSB_glGetUniformLocation));
    __glObj->defineFunction("getUniform", _SE(JSB_glGetUniformfv));
    __glObj->defineFunction("hint", _SE(JSB_glHint));
    __glObj->defineFunction("isBuffer", _SE(JSB_glIsBuffer));
    __glObj->defineFunction("isEnabled", _SE(JSB_glIsEnabled));
    __glObj->defineFunction("isFramebuffer", _SE(JSB_glIsFramebuffer));
    __glObj->defineFunction("isProgram", _SE(JSB_glIsProgram));
    __glObj->defineFunction("isRenderbuffer", _SE(JSB_glIsRenderbuffer));
    __glObj->defineFunction("isShader", _SE(JSB_glIsShader));
    __glObj->defineFunction("isTexture", _SE(JSB_glIsTexture));
    __glObj->defineFunction("lineWidth", _SE(JSB_glLineWidth));
    __glObj->defineFunction("linkProgram", _SE(JSB_glLinkProgram));
    __glObj->defineFunction("pixelStorei", _SE(JSB_glPixelStorei));
    __glObj->defineFunction("polygonOffset", _SE(JSB_glPolygonOffset));
    __glObj->defineFunction("readPixels", _SE(JSB_glReadPixels));
    __glObj->defineFunction("releaseShaderCompiler", _SE(JSB_glReleaseShaderCompiler));
    __glObj->defineFunction("renderbufferStorage", _SE(JSB_glRenderbufferStorage));
    __glObj->defineFunction("sampleCoverage", _SE(JSB_glSampleCoverage));
    __glObj->defineFunction("scissor", _SE(JSB_glScissor));
    __glObj->defineFunction("shaderSource", _SE(JSB_glShaderSource));
    __glObj->defineFunction("stencilFunc", _SE(JSB_glStencilFunc));
    __glObj->defineFunction("stencilFuncSeparate", _SE(JSB_glStencilFuncSeparate));
    __glObj->defineFunction("stencilMask", _SE(JSB_glStencilMask));
    __glObj->defineFunction("stencilMaskSeparate", _SE(JSB_glStencilMaskSeparate));
    __glObj->defineFunction("stencilOp", _SE(JSB_glStencilOp));
    __glObj->defineFunction("stencilOpSeparate", _SE(JSB_glStencilOpSeparate));
    __glObj->defineFunction("texImage2D", _SE(JSB_glTexImage2D));
    __glObj->defineFunction("texParameterf", _SE(JSB_glTexParameterf));
    __glObj->defineFunction("texParameteri", _SE(JSB_glTexParameteri));
    __glObj->defineFunction("texSubImage2D", _SE(JSB_glTexSubImage2D));
    __glObj->defineFunction("uniform1f", _SE(JSB_glUniform1f));
    __glObj->defineFunction("uniform1fv", _SE(JSB_glUniform1fv));
    __glObj->defineFunction("uniform1i", _SE(JSB_glUniform1i));
    __glObj->defineFunction("uniform1iv", _SE(JSB_glUniform1iv));
    __glObj->defineFunction("uniform2f", _SE(JSB_glUniform2f));
    __glObj->defineFunction("uniform2fv", _SE(JSB_glUniform2fv));
    __glObj->defineFunction("uniform2i", _SE(JSB_glUniform2i));
    __glObj->defineFunction("uniform2iv", _SE(JSB_glUniform2iv));
    __glObj->defineFunction("uniform3f", _SE(JSB_glUniform3f));
    __glObj->defineFunction("uniform3fv", _SE(JSB_glUniform3fv));
    __glObj->defineFunction("uniform3i", _SE(JSB_glUniform3i));
    __glObj->defineFunction("uniform3iv", _SE(JSB_glUniform3iv));
    __glObj->defineFunction("uniform4f", _SE(JSB_glUniform4f));
    __glObj->defineFunction("uniform4fv", _SE(JSB_glUniform4fv));
    __glObj->defineFunction("uniform4i", _SE(JSB_glUniform4i));
    __glObj->defineFunction("uniform4iv", _SE(JSB_glUniform4iv));
    __glObj->defineFunction("uniformMatrix2fv", _SE(JSB_glUniformMatrix2fv));
    __glObj->defineFunction("uniformMatrix3fv", _SE(JSB_glUniformMatrix3fv));
    __glObj->defineFunction("uniformMatrix4fv", _SE(JSB_glUniformMatrix4fv));
    __glObj->defineFunction("useProgram", _SE(JSB_glUseProgram));
    __glObj->defineFunction("validateProgram", _SE(JSB_glValidateProgram));
    __glObj->defineFunction("vertexAttrib1f", _SE(JSB_glVertexAttrib1f));
    __glObj->defineFunction("vertexAttrib1fv", _SE(JSB_glVertexAttrib1fv));
    __glObj->defineFunction("vertexAttrib2f", _SE(JSB_glVertexAttrib2f));
    __glObj->defineFunction("vertexAttrib2fv", _SE(JSB_glVertexAttrib2fv));
    __glObj->defineFunction("vertexAttrib3f", _SE(JSB_glVertexAttrib3f));
    __glObj->defineFunction("vertexAttrib3fv", _SE(JSB_glVertexAttrib3fv));
    __glObj->defineFunction("vertexAttrib4f", _SE(JSB_glVertexAttrib4f));
    __glObj->defineFunction("vertexAttrib4fv", _SE(JSB_glVertexAttrib4fv));
    __glObj->defineFunction("vertexAttribPointer", _SE(JSB_glVertexAttribPointer));
    __glObj->defineFunction("getVertexAttrib", _SE(JSB_glGetVertexAttrib));
    __glObj->defineFunction("getVertexAttribOffset", _SE(JSB_glGetVertexAttribOffset));
    __glObj->defineFunction("viewport", _SE(JSB_glViewport));
    __glObj->defineFunction("getParameter", _SE(JSB_glGetParameter));
    __glObj->defineFunction("getShaderPrecisionFormat", _SE(JSB_glGetShaderPrecisionFormat));
    __glObj->defineFunction("getBufferParameter", _SE(JSB_glGetBufferParameter));
    __glObj->defineFunction("getRenderbufferParameter", _SE(JSB_glGetRenderbufferParameter));

    // NOT WEBGL standard functions
    __glObj->defineFunction("_flushCommands", _SE(JSB_glFlushCommand));

    se::ScriptEngine::getInstance()->addBeforeCleanupHook([](){
        __shaders.clear();
    });

    return true;
    
}

