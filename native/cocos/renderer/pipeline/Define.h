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
typedef cc::vector<struct RenderObject>::type RenderObjectList;

struct CC_DLL RenderPipelineInfo {
    //TODO
};

struct CC_DLL RenderStageInfo {
    cc::String name;
    int priority = 0;
    cc::String framebuffer;
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
    cc::GFXBuffer *vb = nullptr;
    uint8_t *data = nullptr;
    cc::GFXInputAssembler *ia = nullptr;
    uint count = 0;
    uint capacity = 0;
    uint stride = 0;
};
typedef cc::vector<InstancedItem>::type InstancedItemList;

struct BatchedItem {
    cc::GFXBufferList vbs;
    uint8_t *vbDatas = nullptr;
    cc::GFXBuffer *vbIdx = nullptr;
    float *vbIdxData = nullptr;
    uint mergCount = 0;
    cc::GFXInputAssembler *ia = nullptr;
    cc::GFXBuffer *ubo = nullptr;
    cc::PSOCreateInfo *psoCreatedInfo = nullptr;
};
typedef cc::vector<BatchedItem>::type BatchedItemList;

typedef cc::vector<RenderStage *>::type RenderStageList;
typedef cc::vector<RenderFlow *>::type RenderFlowList;

//TODO
const uint CAMERA_DEFAULT_MASK = 1;
//constexpr CAMERA_DEFAULT_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
//                                                           Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER]);

} // namespace pipeline
} // namespace cc
