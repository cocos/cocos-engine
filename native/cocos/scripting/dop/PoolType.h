#pragma once

namespace se {
enum class PoolType {
    // objects
    RASTERIZER_STATE,
    DEPTH_STENCIL_STATE,
    BLEND_STATE,
    DESCRIPTOR_SETS,
    SHADER,
    INPUT_ASSEMBLER,
    PIPELINE_LAYOUT,
    FRAMEBUFFER,

    // buffers
    PASS,
    MODEL,
    SUBMODEL,
    SCENE,
    CAMERA,
    NODE,
    ROOT,
    DIRECTOR,
    AABB,
    BUFFER_VIEW,
    RENDER_WINDOW,

    // array
    MODEL_ARRAY,
    SUBMODEL_ARRAY,
    UNKNOWN
};
}
