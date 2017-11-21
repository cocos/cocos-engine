#include "scripting/js-bindings/manual/jsb_opengl_manual.hpp"
#include "scripting/js-bindings/manual/jsb_opengl_functions.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "platform/CCGL.h"

// Helper functions that link "glGenXXXs" (OpenGL ES 2.0 spec), with "gl.createXXX" (WebGL spec)
bool JSB_glGenTextures(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint texture;
    glGenTextures(1, &texture);

    s.rval().setUint32(texture);
    return true;
}
SE_BIND_FUNC(JSB_glGenTextures)

bool JSB_glGenBuffers(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint buffer;
    glGenBuffers(1, &buffer);
    s.rval().setUint32(buffer);
    return true;
}
SE_BIND_FUNC(JSB_glGenBuffers)

bool JSB_glGenRenderbuffers(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint renderbuffers;
    glGenRenderbuffers(1, &renderbuffers);
    s.rval().setUint32(renderbuffers);
    return true;
}
SE_BIND_FUNC(JSB_glGenRenderbuffers)

bool JSB_glGenFramebuffers(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    SE_PRECONDITION2(argc == 0, false, "Invalid number of arguments" );

    GLuint framebuffers;
    glGenFramebuffers(1, &framebuffers);
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

    glDeleteTextures(1, &arg0);

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

    glDeleteBuffers(1, &arg0);

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

    glDeleteRenderbuffers(1, &arg0);

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

    glDeleteFramebuffers(1, &arg0);

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
    glShaderSource(arg0, 1, sources, nullptr);

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
    glGetShaderiv(arg0, arg1, &ret);
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
    glGetProgramiv(arg0, arg1, &ret);
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
    glGetProgramiv(arg0, GL_INFO_LOG_LENGTH, &length);
    GLchar* src = new (std::nothrow) GLchar[length];
    glGetProgramInfoLog(arg0, length, NULL, src);
    
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
    glGetShaderiv(arg0, GL_INFO_LOG_LENGTH, &length);
    GLchar* src = new (std::nothrow) GLchar[length];
    glGetShaderInfoLog(arg0, length, NULL, src);
    
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
    glGetShaderiv(arg0, GL_SHADER_SOURCE_LENGTH, &length);
    GLchar* src = new (std::nothrow) GLchar[length];
    glGetShaderSource(arg0, length, NULL, src);

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
    glGetProgramiv(arg0, GL_ACTIVE_ATTRIBUTE_MAX_LENGTH, &length);
    GLchar* buffer = new (std::nothrow) GLchar[length];
    GLint size = -1;
    GLenum type = -1;

    glGetActiveAttrib(arg0, arg1, length, NULL, &size, &type, buffer);

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
    glGetProgramiv(arg0, GL_ACTIVE_ATTRIBUTE_MAX_LENGTH, &length);
    GLchar* buffer = new (std::nothrow) GLchar[length];
    GLint size = -1;
    GLenum type = -1;

    glGetActiveUniform(arg0, arg1, length, NULL, &size, &type, buffer);

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
    glGetProgramiv(arg0, GL_ATTACHED_SHADERS, &length);
    GLuint* buffer = new (std::nothrow) GLuint[length];
    memset(buffer, 0, length * sizeof(GLuint));
    //Fix bug 2448, it seems that glGetAttachedShaders will crash if we send NULL to the third parameter (eg Windows), same as in lua binding
    GLsizei realShaderCount = 0;
    glGetAttachedShaders(arg0, length, &realShaderCount, buffer);

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
    glGetTexParameterfv(arg0, arg1, &param);

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
    glGetProgramiv(arg0, GL_ACTIVE_UNIFORMS, &activeUniforms);
    
    GLsizei length;
    glGetProgramiv(arg0, GL_ACTIVE_UNIFORM_MAX_LENGTH, &length);
    GLchar* namebuffer = new (std::nothrow) GLchar[length+1];
    GLint size = -1;
    GLenum type = -1;

    bool isLocationFound = false;
    for (int i = 0; i  <  activeUniforms; ++i)
    {
        glGetActiveUniform(arg0, i, length, NULL, &size, &type, namebuffer);
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
            SE_REPORT_ERROR("JSB_glGetUniformfv: Uniform Type (%d) not supported", (int)type);
            return false;
    }

    if( utype == GL_FLOAT)
    {
        GLfloat* param = new (std::nothrow) GLfloat[usize];
        glGetUniformfv(arg0, arg1, param);

        se::HandleObject obj(se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, param, usize * sizeof(GLfloat)));
        s.rval().setObject(obj);
        CC_SAFE_DELETE_ARRAY(param);
        return true;
    }
    else if( utype == GL_INT )
    {
        GLint* param = new (std::nothrow) GLint[usize];
        glGetUniformiv(arg0, arg1, param);

        se::HandleObject obj(se::Object::createTypedArray(se::Object::TypedArrayType::INT32, param, usize * sizeof(GLint)));
        s.rval().setObject(obj);
        CC_SAFE_DELETE_ARRAY(param);
        return true;
    }

    SE_REPORT_ERROR("Supported type: %d", utype);
    return false;
}
SE_BIND_FUNC(JSB_glGetUniformfv)

