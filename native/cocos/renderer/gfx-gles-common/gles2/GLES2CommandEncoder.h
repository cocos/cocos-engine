#pragma once

#include "gfx-gles-common/common/GLESCommandEncoder.h"

namespace cc::gfx {

class GLES2CommandEncoder : public GLESCommandEncoder {
public:
    GLES2CommandEncoder() = default;
    ~GLES2CommandEncoder() override = default;
};
} // namespace cc::gfx