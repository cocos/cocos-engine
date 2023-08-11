#pragma once

#include "gfx-base/states/GFXGeneralBarrier.h"
#include "gfx-gles-common/common/GLESBase.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESGeneralBarrier : public GeneralBarrier {
public:
    explicit GLESGeneralBarrier(const GeneralBarrierInfo &info);
    ~GLESGeneralBarrier() override;

    inline const GLESGPUGeneralBarrier *gpuBarrier() const { return _gpuBarrier; }

protected:
    GLESGPUGeneralBarrier *_gpuBarrier = nullptr;
};

} // namespace cc::gfx
