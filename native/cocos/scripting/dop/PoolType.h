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
    SUB_MODEL,
    MODEL,
    SCENE,
    CAMERA,
    NODE,
    ROOT,
    AABB,
    DIRECTOR,
    RENDER_WINDOW,
    FRUSTUM,
//    INSTANCED_ATTRIBUTE,
//    MAIN_LIGHT,
//    AMBIENT,
//    FOG,
//    RENDER_SUBMESH,
//    BUFFER_VIEW,
//    FLAT_BUFFER,
    
    // array
    SUB_MODEL_ARRAY,
    MODEL_ARRAY,
    UNKNOWN
};
}
