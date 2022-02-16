// clang-format off
#pragma once
#include "renderer/gfx-base/GFXDef-common.h"
#include "renderer/pipeline/custom/RenderCommonTypes.h"
#include "renderer/pipeline/custom/RenderInterfaceFwd.h"

namespace cc {

namespace render {

class Setter {
public:
    Setter() noexcept = default;
    Setter(Setter&& rhs)      = delete;
    Setter(Setter const& rhs) = delete;
    Setter& operator=(Setter&& rhs) = delete;
    Setter& operator=(Setter const& rhs) = delete;

    virtual ~Setter() noexcept = 0;

    virtual void setCBuffer(const std::string& name, gfx::Buffer* buffer) = 0;
};

inline Setter::~Setter() noexcept = default;

class Pipeline {
public:
    Pipeline() noexcept = default;
    Pipeline(Pipeline&& rhs)      = delete;
    Pipeline(Pipeline const& rhs) = delete;
    Pipeline& operator=(Pipeline&& rhs) = delete;
    Pipeline& operator=(Pipeline const& rhs) = delete;

    virtual ~Pipeline() noexcept = 0;

    virtual uint32_t addRenderTexture(const std::string& name, gfx::Format format, uint32_t width, uint32_t height) = 0;
};

inline Pipeline::~Pipeline() noexcept = default;

} // namespace render

} // namespace cc
