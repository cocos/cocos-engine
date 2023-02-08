#include "GLESShader.h"
#include "GLESConversion.h"
#include "GLESDevice.h"
#include "base/StringUtil.h"

namespace cc::gfx::gles {

static GLuint compileShader(GLenum stage, const ccstd::string &source) {
    GLuint shaderId = 0;
    GL_CHECK(shaderId = glCreateShader(stage));
    ccstd::string shaderSource = StringUtil::format("#version %u es\n", 310u) + source;
    const char *ptr = shaderSource.c_str();
    GL_CHECK(glShaderSource(shaderId, 1, (const GLchar **)&ptr, nullptr));
    GL_CHECK(glCompileShader(shaderId));

    GLint status = 0;
    GL_CHECK(glGetShaderiv(shaderId, GL_COMPILE_STATUS, &status));
    if (status != GL_TRUE) {
        GLint logSize = 0;
        GL_CHECK(glGetShaderiv(shaderId, GL_INFO_LOG_LENGTH, &logSize));

        ++logSize;
        auto *logs = static_cast<GLchar *>(CC_MALLOC(logSize));
        GL_CHECK(glGetShaderInfoLog(shaderId, logSize, nullptr, logs));

        CC_LOG_ERROR("shader %u compilation failed.", stage);
        CC_LOG_ERROR(logs);
        CC_FREE(logs);
        GL_CHECK(glDeleteShader(shaderId));
        shaderId = 0;
    }
    return shaderId;
}

static void checkProgram(GLuint program, const ccstd::string &name) {
    GLint status = 0;
    GL_CHECK(glGetProgramiv(program, GL_LINK_STATUS, &status));
    if (status != 1) {
        CC_LOG_ERROR("Failed to link Shader [%s].", name.c_str());
        GLint logSize = 0;
        GL_CHECK(glGetProgramiv(program, GL_INFO_LOG_LENGTH, &logSize));
        if (logSize) {
            ++logSize;
            auto *logs = static_cast<GLchar *>(CC_MALLOC(logSize));
            GL_CHECK(glGetProgramInfoLog(program, logSize, nullptr, logs));

            CC_LOG_ERROR(logs);
            CC_FREE(logs);
            return;
        }
    }

    CC_LOG_INFO("Shader '%s' compilation succeeded.", name.c_str());
}

Shader::Shader() {
    _typedID = generateObjectID<decltype(this)>();
}

Shader::~Shader() {
    destroy();
}

void Shader::doInit(const ShaderInfo &info) {
    std::ignore = info;

    _shader = ccnew GPUShader();
    _shader->name = _name;
    _shader->stages.reserve(_stages.size());
    for (auto &stage : _stages) {
        _shader->stages.emplace_back();
        auto &back = _shader->stages.back();
        back.stage = getShaderStage(stage.stage);
        back.source.swap(stage.source);
    }
}

void Shader::doDestroy() {
    _shader = nullptr;
}

GPUShader::~GPUShader() noexcept {
    if (program != 0) {
        glDeleteProgram(program);
    }
}

void GPUShader::initShader() {
    if (program != 0) {
        return;
    }
    GL_CHECK(program = glCreateProgram());
    for (auto &stage : stages) {
        stage.shader = compileShader(stage.stage, stage.source);
        GL_CHECK(glAttachShader(program, stage.shader));
    }
    GL_CHECK(glLinkProgram(program));
    checkProgram(program, name);

    for (auto &stage : stages) {
        GL_CHECK(glDetachShader(program, stage.shader));
        GL_CHECK(glDeleteShader(stage.shader));
    }
    stages.clear();
}

} // namespace cc::gfx::gles
