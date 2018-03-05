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

#include "scripting/js-bindings/manual/jsb_opengl_manual.hpp"
#include "scripting/js-bindings/manual/jsb_opengl_functions.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_opengl_utils.hpp"
#include "platform/CCGL.h"

#define GL_UNPACK_FLIP_Y_WEBGL 0x9240
#define GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL 0x9241
#define GL_CONTEXT_LOST_WEBGL 0x9242
#define GL_UNPACK_COLORSPACE_CONVERSION_WEBGL 0x9243
#define GL_BROWSER_DEFAULT_WEBGL 0x9244

#define GL_DEPTH_STENCIL_ATTACHMENT 0x821A

// Helper functions that link "glGenXXXs" (OpenGL ES 2.0 spec), with "gl.createXXX" (WebGL spec)
bool JSB_glGenTextures(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint texture;
    JSB_GL_CHECK(glGenTextures(1, &texture));

    s.rval().setUint32(texture);
    return true;
}
SE_BIND_FUNC(JSB_glGenTextures)

bool JSB_glGenBuffers(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint buffer;
    JSB_GL_CHECK(glGenBuffers(1, &buffer));
    s.rval().setUint32(buffer);
    return true;
}
SE_BIND_FUNC(JSB_glGenBuffers)

bool JSB_glGenRenderbuffers(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint renderbuffers;
    JSB_GL_CHECK(glGenRenderbuffers(1, &renderbuffers));
    s.rval().setUint32(renderbuffers);
    return true;
}
SE_BIND_FUNC(JSB_glGenRenderbuffers)

bool JSB_glGenFramebuffers(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint framebuffers;
    JSB_GL_CHECK(glGenFramebuffers(1, &framebuffers));
    s.rval().setUint32(framebuffers);
    return true;
}
SE_BIND_FUNC(JSB_glGenFramebuffers)

bool JSB_glDeleteTextures(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glDeleteTextures(1, &arg0));

    return true;
}
SE_BIND_FUNC(JSB_glDeleteTextures)

bool JSB_glDeleteBuffers(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glDeleteBuffers(1, &arg0));

    return true;
}
SE_BIND_FUNC(JSB_glDeleteBuffers)

bool JSB_glDeleteRenderbuffers(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glDeleteRenderbuffers(1, &arg0));

    return true;
}
SE_BIND_FUNC(JSB_glDeleteRenderbuffers)

bool JSB_glDeleteFramebuffers(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    JSB_GL_CHECK(glDeleteFramebuffers(1, &arg0));

    return true;
}
SE_BIND_FUNC(JSB_glDeleteFramebuffers)

bool JSB_glShaderSource(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0; std::string arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_std_string(args[1], &arg1);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    const GLchar* sources[] = { arg1.c_str() };
    JSB_GL_CHECK(glShaderSource(arg0, 1, sources, nullptr));

    return true;
}
SE_BIND_FUNC(JSB_glShaderSource)

bool JSB_glGetShaderiv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0, arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLint ret;
    JSB_GL_CHECK(glGetShaderiv(arg0, arg1, &ret));
    s.rval().setInt32(ret);
    return true;
}
SE_BIND_FUNC(JSB_glGetShaderiv)

bool JSB_glGetProgramiv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0, arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLint ret;
    JSB_GL_CHECK(glGetProgramiv(arg0, arg1, &ret));
    s.rval().setInt32(ret);
    return true;
}
SE_BIND_FUNC(JSB_glGetProgramiv)

bool JSB_glGetProgramInfoLog(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLsizei length;
    JSB_GL_CHECK(glGetProgramiv(arg0, GL_INFO_LOG_LENGTH, &length));
    GLchar* src = new (std::nothrow) GLchar[length];
    JSB_GL_CHECK(glGetProgramInfoLog(arg0, length, NULL, src));
    
    s.rval().setString(src);
    CC_SAFE_DELETE_ARRAY(src);
    return true;
}
SE_BIND_FUNC(JSB_glGetProgramInfoLog)

// DOMString? getShaderInfoLog(WebGLShader? shader);
bool JSB_glGetShaderInfoLog(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLsizei length;
    JSB_GL_CHECK(glGetShaderiv(arg0, GL_INFO_LOG_LENGTH, &length));
    GLchar* src = new (std::nothrow) GLchar[length];
    JSB_GL_CHECK(glGetShaderInfoLog(arg0, length, NULL, src));
    
    s.rval().setString(src);
    CC_SAFE_DELETE_ARRAY(src);
    return true;
}
SE_BIND_FUNC(JSB_glGetShaderInfoLog)

// DOMString? getShaderSource(WebGLShader? shader);
bool JSB_glGetShaderSource(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLsizei length;
    JSB_GL_CHECK(glGetShaderiv(arg0, GL_SHADER_SOURCE_LENGTH, &length));
    GLchar* src = new (std::nothrow) GLchar[length];
    JSB_GL_CHECK(glGetShaderSource(arg0, length, NULL, src));

    s.rval().setString(src);
    CC_SAFE_DELETE_ARRAY(src);
    return true;
}
SE_BIND_FUNC(JSB_glGetShaderSource)

//  interface WebGLActiveInfo {
//      readonly attribute GLint size;
//      readonly attribute GLenum type;
//      readonly attribute DOMString name;
// WebGLActiveInfo? getActiveAttrib(WebGLProgram? program, GLuint index);
bool JSB_glGetActiveAttrib(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0, arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLsizei length;
    JSB_GL_CHECK(glGetProgramiv(arg0, GL_ACTIVE_ATTRIBUTE_MAX_LENGTH, &length));
    GLchar* buffer = new (std::nothrow) GLchar[length];
    GLint size = -1;
    GLenum type = -1;

    JSB_GL_CHECK(glGetActiveAttrib(arg0, arg1, length, NULL, &size, &type, buffer));

    se::HandleObject object(se::Object::createPlainObject());
    object->setProperty("size", se::Value((int32_t)size));
    object->setProperty("type", se::Value((int32_t)type));
    object->setProperty("name", se::Value((char*)buffer));
    s.rval().setObject(object.get());

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
bool JSB_glGetActiveUniform(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0, arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLsizei length;
    JSB_GL_CHECK(glGetProgramiv(arg0, GL_ACTIVE_ATTRIBUTE_MAX_LENGTH, &length));
    GLchar* buffer = new (std::nothrow) GLchar[length];
    GLint size = -1;
    GLenum type = -1;

    JSB_GL_CHECK(glGetActiveUniform(arg0, arg1, length, NULL, &size, &type, buffer));

    se::HandleObject object(se::Object::createPlainObject());
    object->setProperty("size", se::Value((int32_t)size));
    object->setProperty("type", se::Value((int32_t)type));
    object->setProperty("name", se::Value((char*)buffer));
    s.rval().setObject(object.get());

    CC_SAFE_DELETE_ARRAY(buffer);
    return true;
}
SE_BIND_FUNC(JSB_glGetActiveUniform)

// sequence<WebGLShader>? getAttachedShaders(WebGLProgram? program);
bool JSB_glGetAttachedShaders(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0;

    ok &= seval_to_uint32(args[0], &arg0 );
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    GLsizei length;
    JSB_GL_CHECK(glGetProgramiv(arg0, GL_ATTACHED_SHADERS, &length));
    GLuint* buffer = new (std::nothrow) GLuint[length];
    memset(buffer, 0, length * sizeof(GLuint));
    //Fix bug 2448, it seems that glGetAttachedShaders will crash if we send NULL to the third parameter (eg Windows), same as in lua binding
    GLsizei realShaderCount = 0;
    JSB_GL_CHECK(glGetAttachedShaders(arg0, length, &realShaderCount, buffer));

    se::HandleObject jsobj(se::Object::createArrayObject(length));
    for( int i=0; i<length; i++)
    {
        jsobj->setArrayElement(i, se::Value(buffer[i]));
    }

    s.rval().setObject(jsobj.get());
    CC_SAFE_DELETE_ARRAY(buffer);
    return true;

}
SE_BIND_FUNC(JSB_glGetAttachedShaders)

// sequence<DOMString>? getSupportedExtensions();
bool JSB_glGetSupportedExtensions(se::State& s) {
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

            jsobj->setArrayElement(element, se::Value((const char*)&copy[start_extension]));

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
bool JSB_glGetTexParameterfv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false,"JSB_glGetTexParameterfv: Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0, arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );

    SE_PRECONDITION2(ok, false, "JSB_glGetTexParameterfv: Error processing arguments");

    GLfloat param;
    JSB_GL_CHECK(glGetTexParameterfv(arg0, arg1, &param));

    s.rval().setFloat(param);
    return true;
}
SE_BIND_FUNC(JSB_glGetTexParameterfv)

// any getUniform(WebGLProgram? program, WebGLUniformLocation? location);
bool JSB_glGetUniformfv(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 2, false,"JSB_glGetUniformfv: Invalid number of arguments" );

    bool ok = true;
    uint32_t arg0, arg1;

    ok &= seval_to_uint32(args[0], &arg0 );
    ok &= seval_to_uint32(args[1], &arg1 );

    SE_PRECONDITION2(ok, false, "JSB_glGetUniformfv: Error processing arguments");

    GLint activeUniforms;
    JSB_GL_CHECK(glGetProgramiv(arg0, GL_ACTIVE_UNIFORMS, &activeUniforms));
    
    GLsizei length;
    JSB_GL_CHECK(glGetProgramiv(arg0, GL_ACTIVE_UNIFORM_MAX_LENGTH, &length));
    GLchar* namebuffer = new (std::nothrow) GLchar[length+1];
    GLint size = -1;
    GLenum type = -1;

    bool isLocationFound = false;
    for (int i = 0; i  <  activeUniforms; ++i)
    {
        JSB_GL_CHECK(glGetActiveUniform(arg0, i, length, NULL, &size, &type, namebuffer));
        if(arg1 == glGetUniformLocation(arg0, namebuffer))
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

        // float
        case GL_FLOAT:
            usize = 1;
            utype = GL_FLOAT;
            break;
        case GL_FLOAT_MAT2:
            usize = 2 * 2;
            utype = GL_FLOAT;
            break;
        case GL_FLOAT_MAT3:
            usize = 3 * 3;
            utype = GL_FLOAT;
            break;
        case GL_FLOAT_MAT4:
            usize = 4 * 4;
            utype = GL_FLOAT;
            break;
        case GL_FLOAT_VEC2:
            usize = 2;
            utype = GL_FLOAT;
            break;
        case GL_FLOAT_VEC3:
            usize = 3;
            utype = GL_FLOAT;
            break;
        case GL_FLOAT_VEC4:
            usize = 4;
            utype = GL_FLOAT;           
            break;

        // int
        case GL_INT:
            usize = 1;
            utype = GL_INT;
            break;
        case GL_INT_VEC2:
            usize = 2;
            utype = GL_INT;
            break;
        case GL_INT_VEC3:
            usize = 3;
            utype = GL_INT;
            break;
        case GL_INT_VEC4:
            usize = 4;
            utype = GL_INT;
            break;

        default:
            SE_REPORT_ERROR("glGetUniformfv: Uniform Type (%d) not supported", (int)type);
            return false;
    }

    if( utype == GL_FLOAT)
    {
        GLfloat* param = new (std::nothrow) GLfloat[usize];
        JSB_GL_CHECK(glGetUniformfv(arg0, arg1, param));

        se::HandleObject obj(se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, param, usize * sizeof(GLfloat)));
        s.rval().setObject(obj);
        CC_SAFE_DELETE_ARRAY(param);
        return true;
    }
    else if( utype == GL_INT )
    {
        GLint* param = new (std::nothrow) GLint[usize];
        JSB_GL_CHECK(glGetUniformiv(arg0, arg1, param));

        se::HandleObject obj(se::Object::createTypedArray(se::Object::TypedArrayType::INT32, param, usize * sizeof(GLint)));
        s.rval().setObject(obj);
        CC_SAFE_DELETE_ARRAY(param);
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
        SE_REPORT_ERROR("Wrong argument count passed to gl.getParameter");
        return false;
    }

    int pname = args[0].toInt8();

    int intbuffer[4];
    float floatvalue;

    auto& ret = s.rval();

    switch( pname ) {
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
            glGetFloatv(pname, params);
            ret.setObject(se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, params, sizeof(params)), true);
        }
        break;

        // Float32Array (with 4 values)
        case GL_BLEND_COLOR:
        case GL_COLOR_CLEAR_VALUE:
        {
            GLfloat params[4];
            glGetFloatv(pname, params);
            ret.setObject(se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, params, sizeof(params)), true);
        }
        break;

        // Int32Array (with 2 values)
        case GL_MAX_VIEWPORT_DIMS:
        {
            GLfloat params[2];
            glGetFloatv(pname, params);
            int intParams[2] = {(int)params[0], (int)params[1]};
            ret.setObject(se::Object::createTypedArray(se::Object::TypedArrayType::INT32, intParams, sizeof(intParams)), true);
        }
        break;

        // Int32Array (with 4 values)
        case GL_SCISSOR_BOX:
        case GL_VIEWPORT:
        {
            GLfloat params[4];
            glGetFloatv(pname, params);
            int intParams[4] = {(int)params[0], (int)params[1], (int)params[2], (int)params[3]};
            ret.setObject(se::Object::createTypedArray(se::Object::TypedArrayType::INT32, intParams, sizeof(intParams)), true);
        }
        break;

        // boolean[] (with 4 values)
        case GL_COLOR_WRITEMASK:
        {
            glGetIntegerv(pname, intbuffer);
            se::HandleObject arr(se::Object::createArrayObject(4));
            for(int i = 0; i < 4; i++ ) {
                arr->setArrayElement(i, se::Value(intbuffer[i]));
            }
            ret.setObject(arr, true);
        }
        break;

        // WebGLBuffer
        case GL_ARRAY_BUFFER_BINDING:
        case GL_ELEMENT_ARRAY_BUFFER_BINDING:
//        glGetIntegerv(pname, intbuffer);
//        ret = [buffers[@(intbuffer[0])] pointerValue];
        break;

        // WebGLProgram
        case GL_CURRENT_PROGRAM:
//        glGetIntegerv(pname, intbuffer);
//        ret = [programs[@(intbuffer[0])] pointerValue];
        break;

        // WebGLFramebuffer
        case GL_FRAMEBUFFER_BINDING:
//        glGetIntegerv(pname, intbuffer);
//        ret = [framebuffers[@(intbuffer[0])] pointerValue];
        break;

        // WebGLRenderbuffer
        case GL_RENDERBUFFER_BINDING:
//        glGetIntegerv(pname, intbuffer);
//        ret = [renderbuffers[@(intbuffer[0])] pointerValue];
        break;

        // WebGLTexture
        case GL_TEXTURE_BINDING_2D:
        case GL_TEXTURE_BINDING_CUBE_MAP:
//        glGetIntegerv(pname, intbuffer);
//        ret = [textures[@(intbuffer[0])] pointerValue];
        break;

        // Ejecta/WebGL specific
        case GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS:
        // device may support more, but we only map 8 here
//        ret = JSValueMakeNumber(ctx, EJ_CANVAS_MAX_TEXTURE_UNITS);
        break;

        case GL_UNPACK_FLIP_Y_WEBGL:
//        ret = JSValueMakeBoolean(ctx, unpackFlipY);
        break;

        case GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL:
//        ret = JSValueMakeBoolean(ctx, premultiplyAlpha);
        break;

        case GL_UNPACK_COLORSPACE_CONVERSION_WEBGL:
//        ret = JSValueMakeBoolean(ctx, false);
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
        glGetFloatv(pname, &floatvalue);
        ret.setFloat(floatvalue);
        break;

        // single int/long/bool - everything else
        default:
        glGetIntegerv(pname, intbuffer);
        ret.setInt32(intbuffer[0]);
        break;
    }

    // That was fun!
    return true;
}

SE_BIND_FUNC(JSB_glGetParameter)

