#pragma once

namespace se {
enum class PoolType {
    // objects
    RASTERIZER_STATE,
    DEPTH_STENCIL_STATE,
    BLEND_STATE,
    BINDING_LAYOUT,
    DESCRIPTOR_SETS,
    SHADER,
    INPUT_ASSEMBLER,
    PIPELINE_LAYOUT,
    // buffers
    PASS_INFO,
    PSOCI,
    MODEL_INFO,
    SUBMODEL_INFO,
    INPUT_ASSEMBLER_INFO,
    // array
    SUBMODEL_ARRAY
};
}
