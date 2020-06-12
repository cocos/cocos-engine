#pragma once

#include "core/CoreStd.h"

NS_CC_BEGIN
class PSOCreateInfo;
NS_CC_END

NS_PP_BEGIN

class RenderStage;
class RenderFlow;

struct CC_DLL RenderObject {
    //TODO
};
typedef cocos2d::vector<struct RenderObject>::type RenderObjectList;

struct CC_DLL RenderPipelineInfo {
    //TODO
};

struct CC_DLL RenderStageInfo {
    cocos2d::String name;
    int priority = 0;
    cocos2d::String framebuffer;
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
    cocos2d::GFXBuffer *vb = nullptr;
    uint8_t *data = nullptr;
    cocos2d::GFXInputAssembler *ia = nullptr;
    uint count = 0;
    uint capacity = 0;
    uint stride = 0;
};
typedef cocos2d::vector<InstancedItem>::type InstancedItemList;

struct BatchedItem {
    cocos2d::GFXBufferList vbs;
    uint8_t *vbDatas = nullptr;
    cocos2d::GFXBuffer *vbIdx = nullptr;
    float *vbIdxData = nullptr;
    uint mergCount = 0;
    cocos2d::GFXInputAssembler *ia = nullptr;
    cocos2d::GFXBuffer *ubo = nullptr;
    cocos2d::PSOCreateInfo *psoCreatedInfo = nullptr;
};
typedef cocos2d::vector<BatchedItem>::type BatchedItemList;

typedef cocos2d::vector<RenderStage *>::type RenderStageList;
typedef cocos2d::vector<RenderFlow *>::type RenderFlowList;

//TODO
const uint CAMERA_DEFAULT_MASK = 1;
//constexpr CAMERA_DEFAULT_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
//                                                           Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER]);

NS_PP_END
