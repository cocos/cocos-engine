#include "jsb_opengl_functions.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"

namespace {

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
    }

    return false;
}

bool JSB_get_arraybufferview_dataptr(const se::Value& v, GLsizei *count, GLvoid **data)
{
    assert(count != nullptr && data != nullptr);

    if (v.isObject())
    {
        se::Object* obj = v.toObject();
        if (obj->isTypedArray())
        {
            uint8_t* ptr = nullptr;
            size_t length = 0;
            if (obj->getTypedArrayData(&ptr, &length) && ptr != nullptr && length > 0)
            {
                *data = ptr;
                *count = (GLsizei)length;
                return true;
            }
        }
    }
    return false;
}

// Arguments: GLenum
// Ret value: void
bool JSB_glActiveTexture(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glActiveTexture((GLenum)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glActiveTexture)

// Arguments: GLuint, GLuint
// Ret value: void
bool JSB_glAttachShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glAttachShader((GLuint)arg0 , (GLuint)arg1  );

    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glAttachShader)

// Arguments: GLuint, GLuint, char*
// Ret value: void
bool JSB_glBindAttribLocation(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; std::string arg2;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_std_string(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glBindAttribLocation((GLuint)arg0 , (GLuint)arg1 , arg2.c_str()  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBindAttribLocation)

// Arguments: GLenum, GLuint
// Ret value: void
bool JSB_glBindBuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glBindBuffer((GLenum)arg0 , (GLuint)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBindBuffer)

// Arguments: GLenum, GLuint
// Ret value: void
bool JSB_glBindFramebuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glBindFramebuffer((GLenum)arg0 , (GLuint)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBindFramebuffer)

// Arguments: GLenum, GLuint
// Ret value: void
bool JSB_glBindRenderbuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glBindRenderbuffer((GLenum)arg0 , (GLuint)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBindRenderbuffer)

// Arguments: GLenum, GLuint
// Ret value: void
bool JSB_glBindTexture(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glBindTexture((GLenum)arg0 , (GLuint)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBindTexture)

// Arguments: GLclampf, GLclampf, GLclampf, GLclampf
// Ret value: void
bool JSB_glBlendColor(se::State& s) {
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

    glBlendColor((GLclampf)arg0 , (GLclampf)arg1 , (GLclampf)arg2 , (GLclampf)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBlendColor)

// Arguments: GLenum
// Ret value: void
bool JSB_glBlendEquation(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glBlendEquation((GLenum)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBlendEquation)

// Arguments: GLenum, GLenum
// Ret value: void
bool JSB_glBlendEquationSeparate(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glBlendEquationSeparate((GLenum)arg0 , (GLenum)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBlendEquationSeparate)

// Arguments: GLenum, GLenum
// Ret value: void
bool JSB_glBlendFunc(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glBlendFunc((GLenum)arg0 , (GLenum)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBlendFunc)

// Arguments: GLenum, GLenum, GLenum, GLenum
// Ret value: void
bool JSB_glBlendFuncSeparate(se::State& s) {
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

    glBlendFuncSeparate((GLenum)arg0 , (GLenum)arg1 , (GLenum)arg2 , (GLenum)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBlendFuncSeparate)

// Arguments: GLenum, ArrayBufferView, GLenum
// Ret value: void
bool JSB_glBufferData(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; void* arg1; uint32_t arg2; 

    ok &= seval_to_uint32(args[0], &arg0 );
    GLsizei count;
    ok &= JSB_get_arraybufferview_dataptr(args[1], &count, &arg1);
    ok &= seval_to_uint32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glBufferData((GLenum)arg0 , count, (GLvoid*)arg1 , (GLenum)arg2  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBufferData)

// Arguments: GLenum, GLintptr, ArrayBufferView
// Ret value: void
bool JSB_glBufferSubData(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; void* arg2; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    GLsizei count;
    ok &= JSB_get_arraybufferview_dataptr(args[2], &count, &arg2);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glBufferSubData((GLenum)arg0 , (GLintptr)arg1 , count, (GLvoid*)arg2  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glBufferSubData)

// Arguments: GLenum
// Ret value: GLenum
bool JSB_glCheckFramebufferStatus(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLenum ret_val;

    ret_val = glCheckFramebufferStatus((GLenum)arg0  );
    s.rval().setUint32((uint32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glCheckFramebufferStatus)

// Arguments: GLbitfield
// Ret value: void
bool JSB_glClear(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glClear((GLbitfield)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glClear)

// Arguments: GLclampf, GLclampf, GLclampf, GLclampf
// Ret value: void
bool JSB_glClearColor(se::State& s) {
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

    glClearColor((GLclampf)arg0 , (GLclampf)arg1 , (GLclampf)arg2 , (GLclampf)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glClearColor)

// Arguments: GLclampf
// Ret value: void
bool JSB_glClearDepthf(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; 

    ok &= seval_to_int32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glClearDepthf((GLclampf)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glClearDepthf)

// Arguments: GLint
// Ret value: void
bool JSB_glClearStencil(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; 

    ok &= seval_to_int32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glClearStencil((GLint)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glClearStencil)

// Arguments: GLboolean, GLboolean, GLboolean, GLboolean
// Ret value: void
bool JSB_glColorMask(se::State& s) {
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

    glColorMask((GLboolean)arg0 , (GLboolean)arg1 , (GLboolean)arg2 , (GLboolean)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glColorMask)

// Arguments: GLuint
// Ret value: void
bool JSB_glCompileShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glCompileShader((GLuint)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glCompileShader)

// Arguments: GLenum, GLint, GLenum, GLsizei, GLsizei, GLint, GLsizei, ArrayBufferView
// Ret value: void
bool JSB_glCompressedTexImage2D(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 8, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; uint32_t arg2; int32_t arg3; int32_t arg4; int32_t arg5; int32_t arg6; void* arg7; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    ok &= seval_to_int32(args[5], &arg5 );
    ok &= seval_to_int32(args[6], &arg6 );
    GLsizei count;
    ok &= JSB_get_arraybufferview_dataptr(args[7], &count, &arg7);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glCompressedTexImage2D((GLenum)arg0 , (GLint)arg1 , (GLenum)arg2 , (GLsizei)arg3 , (GLsizei)arg4 , (GLint)arg5 , (GLsizei)arg6 , (GLvoid*)arg7  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glCompressedTexImage2D)

// Arguments: GLenum, GLint, GLint, GLint, GLsizei, GLsizei, GLenum, GLsizei, ArrayBufferView
// Ret value: void
bool JSB_glCompressedTexSubImage2D(se::State& s) {
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

    glCompressedTexSubImage2D((GLenum)arg0 , (GLint)arg1 , (GLint)arg2 , (GLint)arg3 , (GLsizei)arg4 , (GLsizei)arg5 , (GLenum)arg6 , (GLsizei)arg7 , (GLvoid*)arg8  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glCompressedTexSubImage2D)

// Arguments: GLenum, GLint, GLenum, GLint, GLint, GLsizei, GLsizei, GLint
// Ret value: void
bool JSB_glCopyTexImage2D(se::State& s) {
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

    glCopyTexImage2D((GLenum)arg0 , (GLint)arg1 , (GLenum)arg2 , (GLint)arg3 , (GLint)arg4 , (GLsizei)arg5 , (GLsizei)arg6 , (GLint)arg7  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glCopyTexImage2D)

// Arguments: GLenum, GLint, GLint, GLint, GLint, GLint, GLsizei, GLsizei
// Ret value: void
bool JSB_glCopyTexSubImage2D(se::State& s) {
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

    glCopyTexSubImage2D((GLenum)arg0 , (GLint)arg1 , (GLint)arg2 , (GLint)arg3 , (GLint)arg4 , (GLint)arg5 , (GLsizei)arg6 , (GLsizei)arg7  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glCopyTexSubImage2D)

// Arguments: 
// Ret value: GLuint
bool JSB_glCreateProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 0, false, "Invalid number of arguments" );
    GLuint ret_val;

    ret_val = glCreateProgram( );
    s.rval().setUint32((uint32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glCreateProgram)

// Arguments: GLenum
// Ret value: GLuint
bool JSB_glCreateShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLuint ret_val;

    ret_val = glCreateShader((GLenum)arg0  );
    s.rval().setUint32((uint32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glCreateShader)

// Arguments: GLenum
// Ret value: void
bool JSB_glCullFace(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glCullFace((GLenum)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glCullFace)

// Arguments: GLuint
// Ret value: void
bool JSB_glDeleteProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glDeleteProgram((GLuint)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glDeleteProgram)

// Arguments: GLuint
// Ret value: void
bool JSB_glDeleteShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glDeleteShader((GLuint)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glDeleteShader)

// Arguments: GLenum
// Ret value: void
bool JSB_glDepthFunc(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glDepthFunc((GLenum)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glDepthFunc)

// Arguments: GLboolean
// Ret value: void
bool JSB_glDepthMask(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint16_t arg0; 

    ok &= seval_to_uint16(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glDepthMask((GLboolean)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glDepthMask)

// Arguments: GLclampf, GLclampf
// Ret value: void
bool JSB_glDepthRangef(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; 

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glDepthRangef((GLclampf)arg0 , (GLclampf)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glDepthRangef)

// Arguments: GLuint, GLuint
// Ret value: void
bool JSB_glDetachShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glDetachShader((GLuint)arg0 , (GLuint)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glDetachShader)

// Arguments: GLenum
// Ret value: void
bool JSB_glDisable(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glDisable((GLenum)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glDisable)

// Arguments: GLuint
// Ret value: void
bool JSB_glDisableVertexAttribArray(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glDisableVertexAttribArray((GLuint)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glDisableVertexAttribArray)

// Arguments: GLenum, GLint, GLsizei
// Ret value: void
bool JSB_glDrawArrays(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; int32_t arg2; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glDrawArrays((GLenum)arg0 , (GLint)arg1 , (GLsizei)arg2  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glDrawArrays)

// Arguments: GLenum, GLsizei, GLenum, ArrayBufferView
// Ret value: void
bool JSB_glDrawElements(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; uint32_t arg2; void* arg3; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    GLsizei count;
    ok &= JSB_get_arraybufferview_dataptr(args[3], &count, &arg3);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glDrawElements((GLenum)arg0 , (GLsizei)arg1 , (GLenum)arg2 , (GLvoid*)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glDrawElements)

// Arguments: GLenum
// Ret value: void
bool JSB_glEnable(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glEnable((GLenum)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glEnable)

// Arguments: GLuint
// Ret value: void
bool JSB_glEnableVertexAttribArray(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glEnableVertexAttribArray((GLuint)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glEnableVertexAttribArray)

// Arguments: 
// Ret value: void
bool JSB_glFinish(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 0, false, "Invalid number of arguments" );
    glFinish( );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glFinish)

// Arguments: 
// Ret value: void
bool JSB_glFlush(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 0, false, "Invalid number of arguments" );
    glFlush( );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glFlush)

// Arguments: GLenum, GLenum, GLenum, GLuint
// Ret value: void
bool JSB_glFramebufferRenderbuffer(se::State& s) {
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

    glFramebufferRenderbuffer((GLenum)arg0 , (GLenum)arg1 , (GLenum)arg2 , (GLuint)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glFramebufferRenderbuffer)

// Arguments: GLenum, GLenum, GLenum, GLuint, GLint
// Ret value: void
bool JSB_glFramebufferTexture2D(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 5, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; uint32_t arg2; uint32_t arg3; int32_t arg4; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    ok &= seval_to_uint32(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glFramebufferTexture2D((GLenum)arg0 , (GLenum)arg1 , (GLenum)arg2 , (GLuint)arg3 , (GLint)arg4  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glFramebufferTexture2D)

// Arguments: GLenum
// Ret value: void
bool JSB_glFrontFace(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glFrontFace((GLenum)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glFrontFace)

// Arguments: GLenum
// Ret value: void
bool JSB_glGenerateMipmap(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glGenerateMipmap((GLenum)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glGenerateMipmap)

// Arguments: GLuint, char*
// Ret value: int
bool JSB_glGetAttribLocation(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; std::string arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_std_string(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    int ret_val;

    ret_val = glGetAttribLocation((GLuint)arg0 , arg1.c_str()  );
    s.rval().setInt32(ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glGetAttribLocation)

// Arguments: 
// Ret value: GLenum
bool JSB_glGetError(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 0, false, "Invalid number of arguments" );
    GLenum ret_val;

    ret_val = glGetError( );
    s.rval().setUint32((uint32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glGetError)

// Arguments: GLuint, char*
// Ret value: int
bool JSB_glGetUniformLocation(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; std::string arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_std_string(args[1], &arg1 );

    SE_PRECONDITION2(ok, false, "Error processing arguments");
    int ret_val;

    ret_val = glGetUniformLocation((GLuint)arg0 , arg1.c_str()  );
    s.rval().setInt32(ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glGetUniformLocation)

// Arguments: GLenum, GLenum
// Ret value: void
bool JSB_glHint(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glHint((GLenum)arg0 , (GLenum)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glHint)

// Arguments: GLuint
// Ret value: GLboolean
bool JSB_glIsBuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val;

    ret_val = glIsBuffer((GLuint)arg0  );
    s.rval().setInt32((int32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glIsBuffer)

// Arguments: GLenum
// Ret value: GLboolean
bool JSB_glIsEnabled(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val;

    ret_val = glIsEnabled((GLenum)arg0  );
    s.rval().setInt32((int32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glIsEnabled)

// Arguments: GLuint
// Ret value: GLboolean
bool JSB_glIsFramebuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val;

    ret_val = glIsFramebuffer((GLuint)arg0  );
    s.rval().setInt32((int32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glIsFramebuffer)

// Arguments: GLuint
// Ret value: GLboolean
bool JSB_glIsProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val;

    ret_val = glIsProgram((GLuint)arg0  );
    s.rval().setInt32((int32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glIsProgram)

// Arguments: GLuint
// Ret value: GLboolean
bool JSB_glIsRenderbuffer(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val;

    ret_val = glIsRenderbuffer((GLuint)arg0  );
    s.rval().setInt32((int32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glIsRenderbuffer)

// Arguments: GLuint
// Ret value: GLboolean
bool JSB_glIsShader(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val;

    ret_val = glIsShader((GLuint)arg0  );
    s.rval().setInt32((int32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glIsShader)

// Arguments: GLuint
// Ret value: GLboolean
bool JSB_glIsTexture(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    GLboolean ret_val;

    ret_val = glIsTexture((GLuint)arg0  );
    s.rval().setInt32((int32_t)ret_val);
    return true;
}
SE_BIND_FUNC(JSB_glIsTexture)

// Arguments: GLfloat
// Ret value: void
bool JSB_glLineWidth(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; 

    ok &= seval_to_int32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glLineWidth((GLfloat)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glLineWidth)

// Arguments: GLuint
// Ret value: void
bool JSB_glLinkProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glLinkProgram((GLuint)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glLinkProgram)

// Arguments: GLenum, GLint
// Ret value: void
bool JSB_glPixelStorei(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glPixelStorei((GLenum)arg0 , (GLint)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glPixelStorei)

// Arguments: GLfloat, GLfloat
// Ret value: void
bool JSB_glPolygonOffset(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; 

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glPolygonOffset((GLfloat)arg0 , (GLfloat)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glPolygonOffset)

// Arguments: GLint, GLint, GLsizei, GLsizei, GLenum, GLenum, ArrayBufferView
// Ret value: void
bool JSB_glReadPixels(se::State& s) {
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

    glReadPixels((GLint)arg0 , (GLint)arg1 , (GLsizei)arg2 , (GLsizei)arg3 , (GLenum)arg4 , (GLenum)arg5 , (GLvoid*)arg6  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glReadPixels)

// Arguments: 
// Ret value: void
bool JSB_glReleaseShaderCompiler(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 0, false, "Invalid number of arguments" );
    glReleaseShaderCompiler( );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glReleaseShaderCompiler)

// Arguments: GLenum, GLenum, GLsizei, GLsizei
// Ret value: void
bool JSB_glRenderbufferStorage(se::State& s) {
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

    glRenderbufferStorage((GLenum)arg0 , (GLenum)arg1 , (GLsizei)arg2 , (GLsizei)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glRenderbufferStorage)

// Arguments: GLclampf, GLboolean
// Ret value: void
bool JSB_glSampleCoverage(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; uint16_t arg1; 

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_uint16(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glSampleCoverage((GLclampf)arg0 , (GLboolean)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glSampleCoverage)

// Arguments: GLint, GLint, GLsizei, GLsizei
// Ret value: void
bool JSB_glScissor(se::State& s) {
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

    glScissor((GLint)arg0 , (GLint)arg1 , (GLsizei)arg2 , (GLsizei)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glScissor)

// Arguments: GLenum, GLint, GLuint
// Ret value: void
bool JSB_glStencilFunc(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; uint32_t arg2; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glStencilFunc((GLenum)arg0 , (GLint)arg1 , (GLuint)arg2  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glStencilFunc)

// Arguments: GLenum, GLenum, GLint, GLuint
// Ret value: void
bool JSB_glStencilFuncSeparate(se::State& s) {
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

    glStencilFuncSeparate((GLenum)arg0 , (GLenum)arg1 , (GLint)arg2 , (GLuint)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glStencilFuncSeparate)

// Arguments: GLuint
// Ret value: void
bool JSB_glStencilMask(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glStencilMask((GLuint)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glStencilMask)

// Arguments: GLenum, GLuint
// Ret value: void
bool JSB_glStencilMaskSeparate(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glStencilMaskSeparate((GLenum)arg0 , (GLuint)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glStencilMaskSeparate)

// Arguments: GLenum, GLenum, GLenum
// Ret value: void
bool JSB_glStencilOp(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; uint32_t arg2; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_uint32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glStencilOp((GLenum)arg0 , (GLenum)arg1 , (GLenum)arg2  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glStencilOp)

// Arguments: GLenum, GLenum, GLenum, GLenum
// Ret value: void
bool JSB_glStencilOpSeparate(se::State& s) {
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

    glStencilOpSeparate((GLenum)arg0 , (GLenum)arg1 , (GLenum)arg2 , (GLenum)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glStencilOpSeparate)

// Arguments: GLenum, GLint, GLint, GLsizei, GLsizei, GLint, GLenum, GLenum, ArrayBufferView
// Ret value: void
bool JSB_glTexImage2D(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 9, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; int32_t arg2; int32_t arg3; int32_t arg4; int32_t arg5; uint32_t arg6; uint32_t arg7; void* arg8; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    ok &= seval_to_int32(args[5], &arg5 );
    ok &= seval_to_uint32(args[6], &arg6 );
    ok &= seval_to_uint32(args[7], &arg7 );
    GLsizei count;
    ok &= JSB_get_arraybufferview_dataptr(args[8], &count, &arg8);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glTexImage2D((GLenum)arg0 , (GLint)arg1 , (GLint)arg2 , (GLsizei)arg3 , (GLsizei)arg4 , (GLint)arg5 , (GLenum)arg6 , (GLenum)arg7 , (GLvoid*)arg8  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glTexImage2D)

// Arguments: GLenum, GLenum, GLfloat
// Ret value: void
bool JSB_glTexParameterf(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; int32_t arg2; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glTexParameterf((GLenum)arg0 , (GLenum)arg1 , (GLfloat)arg2  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glTexParameterf)

// Arguments: GLenum, GLenum, GLint
// Ret value: void
bool JSB_glTexParameteri(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; uint32_t arg1; int32_t arg2; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glTexParameteri((GLenum)arg0 , (GLenum)arg1 , (GLint)arg2  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glTexParameteri)

// Arguments: GLenum, GLint, GLint, GLint, GLsizei, GLsizei, GLenum, GLenum, ArrayBufferView
// Ret value: void
bool JSB_glTexSubImage2D(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 9, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; int32_t arg2; int32_t arg3; int32_t arg4; int32_t arg5; uint32_t arg6; uint32_t arg7; void* arg8; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    ok &= seval_to_int32(args[5], &arg5 );
    ok &= seval_to_uint32(args[6], &arg6 );
    ok &= seval_to_uint32(args[7], &arg7 );
    GLsizei count;
    ok &= JSB_get_arraybufferview_dataptr(args[8], &count, &arg8);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glTexSubImage2D((GLenum)arg0 , (GLint)arg1 , (GLint)arg2 , (GLint)arg3 , (GLsizei)arg4 , (GLsizei)arg5 , (GLenum)arg6 , (GLenum)arg7 , (GLvoid*)arg8  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glTexSubImage2D)

// Arguments: GLint, GLfloat
// Ret value: void
bool JSB_glUniform1f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; 

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform1f((GLint)arg0 , (GLfloat)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform1f)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
bool JSB_glUniform1fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform1fv((GLint)arg0 , (GLsizei)data.count() , (GLfloat*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform1fv)

// Arguments: GLint, GLint
// Ret value: void
bool JSB_glUniform1i(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; 

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform1i((GLint)arg0 , (GLint)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform1i)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
bool JSB_glUniform1iv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<int32_t> data;
    ok &= JSB_jsval_typedarray_to_data<int32_t>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform1iv((GLint)arg0 , (GLsizei)data.count() , (GLint*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform1iv)

// Arguments: GLint, GLfloat, GLfloat
// Ret value: void
bool JSB_glUniform2f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; int32_t arg2; 

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform2f((GLint)arg0 , (GLfloat)arg1 , (GLfloat)arg2  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform2f)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
bool JSB_glUniform2fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform2fv((GLint)arg0 , (GLsizei)(data.count()/2) , (GLfloat*)data.data() );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform2fv)

// Arguments: GLint, GLint, GLint
// Ret value: void
bool JSB_glUniform2i(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0; int32_t arg1; int32_t arg2; 

    ok &= seval_to_int32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform2i((GLint)arg0 , (GLint)arg1 , (GLint)arg2  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform2i)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
bool JSB_glUniform2iv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<int32_t> data;
    ok &= JSB_jsval_typedarray_to_data<int32_t>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform2iv((GLint)arg0 , (GLsizei)(data.count()/2) , (GLint*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform2iv)

// Arguments: GLint, GLfloat, GLfloat, GLfloat
// Ret value: void
bool JSB_glUniform3f(se::State& s) {
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

    glUniform3f((GLint)arg0 , (GLfloat)arg1 , (GLfloat)arg2 , (GLfloat)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform3f)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
bool JSB_glUniform3fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform3fv((GLint)arg0 , (GLsizei)(data.count()/3) , (GLfloat*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform3fv)

// Arguments: GLint, GLint, GLint, GLint
// Ret value: void
bool JSB_glUniform3i(se::State& s) {
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

    glUniform3i((GLint)arg0 , (GLint)arg1 , (GLint)arg2 , (GLint)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform3i)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
bool JSB_glUniform3iv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<int32_t> data;
    ok &= JSB_jsval_typedarray_to_data<int32_t>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform3iv((GLint)arg0 , (GLsizei)(data.count()/3) , (GLint*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform3iv)

// Arguments: GLint, GLfloat, GLfloat, GLfloat, GLfloat
// Ret value: void
bool JSB_glUniform4f(se::State& s) {
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

    glUniform4f((GLint)arg0 , (GLfloat)arg1 , (GLfloat)arg2 , (GLfloat)arg3 , (GLfloat)arg4  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform4f)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
bool JSB_glUniform4fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform4fv((GLint)arg0 , (GLsizei)(data.count()/4) , (GLfloat*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform4fv)

// Arguments: GLint, GLint, GLint, GLint, GLint
// Ret value: void
bool JSB_glUniform4i(se::State& s) {
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

    glUniform4i((GLint)arg0 , (GLint)arg1 , (GLint)arg2 , (GLint)arg3 , (GLint)arg4  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform4i)

// Arguments: GLint, GLsizei, TypedArray/Sequence
// Ret value: void
bool JSB_glUniform4iv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    int32_t arg0;

    ok &= seval_to_int32(args[0], &arg0 );
    GLData<int32_t> data;
    ok &= JSB_jsval_typedarray_to_data<int32_t>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUniform4iv((GLint)arg0 , (GLsizei)(data.count()/4) , (GLint*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniform4iv)

// Arguments: GLint, GLboolean, TypedArray/Sequence
// Ret value: void
bool JSB_glUniformMatrix2fv(se::State& s) {
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

    glUniformMatrix2fv(arg0, (GLsizei)(data.count()/4), (GLboolean)arg1 , (GLfloat*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniformMatrix2fv)

// Arguments: GLint, GLboolean, TypedArray/Sequence
// Ret value: void
bool JSB_glUniformMatrix3fv(se::State& s) {
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

    glUniformMatrix3fv(arg0, (GLsizei)(data.count()/9), (GLboolean)arg1 , (GLfloat*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniformMatrix3fv)

// Arguments: GLint, GLboolean, TypedArray/Sequence
// Ret value: void
bool JSB_glUniformMatrix4fv(se::State& s) {
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

    glUniformMatrix4fv(arg0, (GLsizei)(data.count()/16), (GLboolean)arg1 , (GLfloat*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUniformMatrix4fv)

// Arguments: GLuint
// Ret value: void
bool JSB_glUseProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glUseProgram((GLuint)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glUseProgram)

// Arguments: GLuint
// Ret value: void
bool JSB_glValidateProgram(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 1, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; 

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glValidateProgram((GLuint)arg0  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glValidateProgram)

// Arguments: GLuint, GLfloat
// Ret value: void
bool JSB_glVertexAttrib1f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glVertexAttrib1f((GLuint)arg0 , (GLfloat)arg1  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib1f)

// Arguments: GLuint, TypedArray/Sequence
// Ret value: void
bool JSB_glVertexAttrib1fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glVertexAttrib1fv((GLuint)arg0 , (GLfloat*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib1fv)

// Arguments: GLuint, GLfloat, GLfloat
// Ret value: void
bool JSB_glVertexAttrib2f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 3, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; int32_t arg2; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glVertexAttrib2f((GLuint)arg0 , (GLfloat)arg1 , (GLfloat)arg2  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib2f)

// Arguments: GLuint, TypedArray/Sequence
// Ret value: void
bool JSB_glVertexAttrib2fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glVertexAttrib2fv((GLuint)arg0 , (GLfloat*)data.data()  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib2fv)

// Arguments: GLuint, GLfloat, GLfloat, GLfloat
// Ret value: void
bool JSB_glVertexAttrib3f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 4, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; int32_t arg2; int32_t arg3; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glVertexAttrib3f((GLuint)arg0 , (GLfloat)arg1 , (GLfloat)arg2 , (GLfloat)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib3f)

// Arguments: GLuint, TypedArray/Sequence
// Ret value: void
bool JSB_glVertexAttrib3fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glVertexAttrib3fv((GLuint)arg0 , (GLfloat*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib3fv)

// Arguments: GLuint, GLfloat, GLfloat, GLfloat, GLfloat
// Ret value: void
bool JSB_glVertexAttrib4f(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 5, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0; int32_t arg1; int32_t arg2; int32_t arg3; int32_t arg4; 

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_int32(args[1], &arg1 );
    ok &= seval_to_int32(args[2], &arg2 );
    ok &= seval_to_int32(args[3], &arg3 );
    ok &= seval_to_int32(args[4], &arg4 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glVertexAttrib4f((GLuint)arg0 , (GLfloat)arg1 , (GLfloat)arg2 , (GLfloat)arg3 , (GLfloat)arg4  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib4f)

// Arguments: GLuint, TypedArray/Sequence
// Ret value: void
bool JSB_glVertexAttrib4fv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2( argc == 2, false, "Invalid number of arguments" );
    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    GLData<float> data;
    ok &= JSB_jsval_typedarray_to_data<float>(args[1], data);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    glVertexAttrib4fv((GLuint)arg0 , (GLfloat*)data.data());
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glVertexAttrib4fv)

// Arguments: GLuint, GLint, GLenum, GLboolean, GLsizei, GLvoid*
// Ret value: void
bool JSB_glVertexAttribPointer(se::State& s) {
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

    glVertexAttribPointer((GLuint)arg0 , (GLint)arg1 , (GLenum)arg2 , (GLboolean)arg3 , (GLsizei)arg4 , (GLvoid*)arg5  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glVertexAttribPointer)

// Arguments: GLint, GLint, GLsizei, GLsizei
// Ret value: void
bool JSB_glViewport(se::State& s) {
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

    glViewport((GLint)arg0 , (GLint)arg1 , (GLsizei)arg2 , (GLsizei)arg3  );
    s.rval().setUndefined();
    return true;
}
SE_BIND_FUNC(JSB_glViewport)
