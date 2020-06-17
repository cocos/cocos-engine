#pragma once

#include "core/CoreStd.h"

namespace cc {
struct PSOCreateInfo;
class SubModel;

namespace pipeline {

class RenderStage;
class RenderFlow;

struct CC_DLL RenderObject {
    //TODO
};
typedef gfx::vector<struct RenderObject> RenderObjectList;

struct CC_DLL RenderTargetInfo {
    uint width = 0;
    uint height = 0;
};

struct CC_DLL RenderPass {
    uint hash = 0;
    uint depth = 0;
    uint shaderID = 0;
    uint passIdx = 0;
    SubModel *subModel = nullptr;
};
typedef gfx::vector<RenderPass> RenderPassList;

struct RenderPassDesc {
    // sortFunc
    uint phase = 0;
    bool isTransparent = false;
};

typedef gfx::vector<RenderStage *> RenderStageList;
typedef gfx::vector<RenderFlow *> RenderFlowList;

//TODO
const uint CAMERA_DEFAULT_MASK = 1;
//constexpr CAMERA_DEFAULT_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
//                                                           Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER]);

} // namespace pipeline
} // namespace cc
