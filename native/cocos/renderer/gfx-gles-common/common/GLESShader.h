#pragma once

#include "gfx-base/GFXShader.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESShader final : public Shader {
public:
    GLESShader();
    ~GLESShader() override;

    GLESGPUShader *gpuShader() const { return _gpuShader; }

protected:
    void doInit(const ShaderInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GLESGPUShader> _gpuShader;
};

} // namespace cc::gfx
