#pragma once

#include "base/CCValue.h"
#include "core/CoreStd.h"

namespace cc {
namespace pipeline {

class RenderStage;
class RenderFlow;
struct SubModel;
struct Light;
struct Model;

struct CC_DLL RenderObject {
    uint depth = 0;
    Model *modle = nullptr;
};
typedef vector<struct RenderObject> RenderObjectList;

struct CC_DLL RenderTargetInfo {
    uint width = 0;
    uint height = 0;
};

struct CC_DLL RenderPass {
    uint hash = 0;
    uint depth = 0;
    uint shaderID = 0;
    uint passIndex = 0;
    SubModel *subModel = nullptr;
};
typedef vector<RenderPass> RenderPassList;

typedef gfx::ColorAttachment ColorDesc;
typedef vector<ColorDesc> ColorDescList;

typedef gfx::DepthStencilAttachment DepthStencilDesc;

struct CC_DLL RenderPassDesc {
    uint index = 0;
    ColorDescList colorAttachments;
    DepthStencilDesc depthStencilAttachment;
};
typedef vector<RenderPassDesc> RenderPassDescList;

struct CC_DLL RenderTextureDesc {
    String name;
    gfx::TextureType type = gfx::TextureType::TEX2D;
    gfx::TextureUsage usage = gfx::TextureUsage::COLOR_ATTACHMENT;
    gfx::Format format = gfx::Format::UNKNOWN;
    int width = -1;
    int height = -1;
};
typedef vector<RenderTextureDesc> RenderTextureDescList;

struct CC_DLL FrameBufferDesc {
    String name;
    uint renderPass = 0;
    vector<String> colorTextures;
    String depthStencilTexture;
};
typedef vector<FrameBufferDesc> FrameBufferDescList;

enum class RenderFlowType : uint8_t {
    SCENE,
    POSTPROCESS,
    UI,
};

typedef vector<RenderStage *> RenderStageList;
typedef vector<RenderFlow *> RenderFlowList;
typedef vector<Light *> LightList;
typedef vector<uint> UintList;

enum class CC_DLL RenderPassStage {
    DEFAULT = 100,
    UI = 200,
};

struct CC_DLL InternalBindingDesc {
    gfx::BindingType type;
    gfx::UniformBlock blockInfo;
    gfx::UniformSampler samplerInfo;
    Value defaultValue;
};

struct CC_DLL InternalBindingInst : public InternalBindingDesc {
    gfx::Buffer *buffer = nullptr;
    gfx::Sampler *sampler = nullptr;
    gfx::Texture *texture = nullptr;
};

//TODO
const uint CAMERA_DEFAULT_MASK = 1;
//constexpr CAMERA_DEFAULT_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
//                                                           Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER]);

struct CC_DLL RenderQueueCreateInfo {
    bool isTransparent = false;
    uint phases = 0;
    std::function<int(const RenderPass &a, const RenderPass &b)> sortFunc;
};

enum class CC_DLL RenderPriority {
    MIN = 0,
    MAX = 0xff,
    DEFAULT = 0x80,
};

enum class CC_DLL RenderQueueSortMode {
    FRONT_TO_BACK,
    BACK_TO_FRONT,
};

struct CC_DLL RenderQueueDesc {
    bool isTransparent = false;
    RenderQueueSortMode sortMode = RenderQueueSortMode::FRONT_TO_BACK;
    vector<String> stages;
};
typedef vector<RenderQueueDesc> RenderQueueDescList;

class CC_DLL PassPhase {
public:
    static uint getPhaseID(const String &phaseName) {
        if(phases.find(phaseName) == phases.end()) {
            phases[phaseName] = 1 << phaseNum++;
        }
        return phases[phaseName];
    }

private:
    static map<String, uint> phases;
    static uint phaseNum;
};
map<String, uint> PassPhase::phases;
uint PassPhase::phaseNum = 0;

CC_INLINE int opaqueCompareFn(const RenderPass &a, const RenderPass &b) {
    return (a.hash - b.hash) || (a.depth - b.depth) || (a.shaderID - b.shaderID);
}

CC_INLINE int transparentCompareFn(const RenderPass& a, const RenderPass& b) {
    return (a.hash - b.hash) || (b.depth - a.depth) || (a.shaderID - b.shaderID);
}

} // namespace pipeline
} // namespace cc
