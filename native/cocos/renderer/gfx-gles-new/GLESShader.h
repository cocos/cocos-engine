#pragma once

#include "gfx-base/GFXShader.h"
#include "gfx-base/GFXDeviceObject.h"
#include "gfx-gles-new/GLESCore.h"
#include "base/std/container/string.h"

namespace cc::gfx::gles {

struct GPUShader : public GFXDeviceObject<DefaultDeleter> {
    GPUShader() noexcept = default;
    ~GPUShader() noexcept override;
    void initShader();

    struct Stage {
        GLuint shader    = 0;
        GLenum stage     = 0;
        ccstd::string source;
    };

    GLuint program = 0;
    ccstd::string name;
    ccstd::vector<Stage> stages;
};

class Shader : public gfx::Shader {
public:
    Shader();
    ~Shader() override;

    GPUShader *getGPUShader() const { return _shader.get(); }

protected:
    void doInit(const ShaderInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GPUShader> _shader;
};

} // namespace cc::gfx::gles
