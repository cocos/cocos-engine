#pragma once

namespace se {
enum class PoolType {
    // objects
    RASTERIZER_STATE,
    DEPTH_STENCIL_STATE,
    BLEND_STATE,
    BINDING_LAYOUT,
    SHADER,
    INPUT_ASSEMBLER,
    
    // buffers
    PASS_INFO,
    PSOCI,
    MODEL_INFO,
    SUBMODEL_INFO,
    INSTANCED_ATTRIBUTE_INFO,
    CAMERA_INFO,
    RENDER_SUBMESH_INFO,
    BUFFER_VIEW,
};
}
