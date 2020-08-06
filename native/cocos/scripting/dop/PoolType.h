#pragma once

namespace se {
enum class PoolType {
    // objects
    RASTERIZER_STATE,
    DEPTH_STENCIL_STATE,
    BLEND_STATE,
    BINDING_LAYOUT,
    SHADER,
    // buffers
    PASS_INFO,
    PSOCI,
    MODEL_INFO,
    SUBMODEL_INFO,
    INPUT_ASSEMBLER_INFO
};
}
