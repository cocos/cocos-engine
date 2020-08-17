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
    PASS,
    MODEL,
    SUBMODEL,
    INSTANCED_ATTRIBUTE,
    CAMERA,
    SCENE,
    MAIN_LIGHT,
    AMBIENT,
    FOG,
    RENDER_SUBMESH,
    BUFFER_VIEW,
    FLAT_BUFFER,
    NODE,
    ROOT,
    // array
    SUBMODEL_ARRAY,
    UNKNOWN
};
}
