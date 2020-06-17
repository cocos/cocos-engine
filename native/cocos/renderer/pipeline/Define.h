#pragma once

#include "core/CoreStd.h"

namespace cc {
struct PSOCreateInfo;
}

namespace cc {
namespace pipeline {

class RenderStage;
class RenderFlow;

struct CC_DLL RenderObject {
    //TODO
};
typedef gfx::vector<struct RenderObject> RenderObjectList;

struct CC_DLL RenderPipelineInfo {
    //TODO
};

struct CC_DLL RenderStageInfo {
    gfx::String name;
    int priority = 0;
    gfx::String framebuffer;
    // renderQueues?: RenderQueueDesc[];
};

struct CC_DLL RenderFlowInfo {
    //TODO
};

struct CC_DLL RenderViewInfo {
    //TODO
};

struct CC_DLL RenderTargetInfo {
    uint width = 0;
    uint height = 0;
};

struct CC_DLL InstancedItem {
    gfx::GFXBuffer *vb = nullptr;
    uint8_t *data = nullptr;
    gfx::GFXInputAssembler *ia = nullptr;
    uint count = 0;
    uint capacity = 0;
    uint stride = 0;
};
typedef gfx::vector<InstancedItem> InstancedItemList;

struct BatchedItem {
    gfx::GFXBufferList vbs;
    uint8_t *vbDatas = nullptr;
    gfx::GFXBuffer *vbIdx = nullptr;
    float *vbIdxData = nullptr;
    uint mergCount = 0;
    gfx::GFXInputAssembler *ia = nullptr;
    gfx::GFXBuffer *ubo = nullptr;
    cc::PSOCreateInfo *psoCreatedInfo = nullptr;
};
typedef gfx::vector<BatchedItem> BatchedItemList;

typedef gfx::vector<RenderStage *> RenderStageList;
typedef gfx::vector<RenderFlow *> RenderFlowList;

//TODO
const uint CAMERA_DEFAULT_MASK = 1;
//constexpr CAMERA_DEFAULT_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
//                                                           Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER]);

} // namespace pipeline
} // namespace cc
