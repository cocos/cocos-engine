#pragma once

#include "base/Value.h"
#include "core/CoreStd.h"

namespace cc {
namespace pipeline {

class RenderStage;
class RenderFlow;
struct SubModelView;
struct Light;
struct ModelView;
struct AABB;
struct Frustum;

struct CC_DLL RenderObject {
    uint depth = 0;
    ModelView *model = nullptr;
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
    SubModelView *subModel = nullptr;
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
    gfx::DescriptorType type;
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
        if (phases.find(phaseName) == phases.end()) {
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

CC_INLINE int transparentCompareFn(const RenderPass &a, const RenderPass &b) {
    return (a.hash - b.hash) || (b.depth - a.depth) || (a.shaderID - b.shaderID);
}

#define MAX_BINDING_SUPPORTED (24)
enum class CC_DLL UniformBinding : uint8_t {
    // UBOs
    UBO_GLOBAL = MAX_BINDING_SUPPORTED - 1,
    UBO_SHADOW = MAX_BINDING_SUPPORTED - 2,

    UBO_LOCAL = MAX_BINDING_SUPPORTED - 3,
    UBO_FORWARD_LIGHTS = MAX_BINDING_SUPPORTED - 4,
    UBO_SKINNING_ANIMATION = MAX_BINDING_SUPPORTED - 5,
    UBO_SKINNING_TEXTURE = MAX_BINDING_SUPPORTED - 6,
    UBO_UI = MAX_BINDING_SUPPORTED - 7,
    UBO_MORPH = MAX_BINDING_SUPPORTED - 8,
    UBO_PCF_SHADOW = MAX_BINDING_SUPPORTED - 9,
    UBO_BUILTIN_BINDING_END = MAX_BINDING_SUPPORTED - 10,

    // samplers
    SAMPLER_JOINTS = MAX_BINDING_SUPPORTED + 1,
    SAMPLER_ENVIRONMENT = MAX_BINDING_SUPPORTED + 2,
    SAMPLER_MORPH_POSITION = MAX_BINDING_SUPPORTED + 3,
    SAMPLER_MORPH_NORMAL = MAX_BINDING_SUPPORTED + 4,
    SAMPLER_MORPH_TANGENT = MAX_BINDING_SUPPORTED + 5,
    SAMPLER_LIGHTING_MAP = MAX_BINDING_SUPPORTED + 6,
    SAMPLER_SHADOWMAP = MAX_BINDING_SUPPORTED + 7,

    // rooms left for custom bindings
    // effect importer prepares bindings according to this
    CUSTUM_UBO_BINDING_END_POINT = UBO_BUILTIN_BINDING_END,
    CUSTOM_SAMPLER_BINDING_START_POINT = MAX_BINDING_SUPPORTED + 8,
};

struct CC_DLL UBOLocalBatched {
    static const uint BATCHING_COUNT = 10;
    static const uint MAT_WORLDS_OFFSET = 0;
    static const uint COUNT = 16 * BATCHING_COUNT;
    static const uint SIZE = COUNT * 4;

    static gfx::UniformBlock BLOCK;
    std::array<float, COUNT> view;
};

enum class CC_DLL ForwardStagePriority : uint8_t {
    FORWARD = 10,
    UI = 20
};

enum class CC_DLL ForwardFlowPriority : uint8_t {
    SHADOW = 0,
    FORWARD = 1,
    UI = 10,
};

enum class CC_DLL RenderFlowTag : uint8_t {
    SCENE,
    POSTPROCESS,
    UI,
};

struct CC_DLL UBOGlobal : public Object {
    static const uint TIME_OFFSET = 0;
    static const uint SCREEN_SIZE_OFFSET = UBOGlobal::TIME_OFFSET + 4;
    static const uint SCREEN_SCALE_OFFSET = UBOGlobal::SCREEN_SIZE_OFFSET + 4;
    static const uint NATIVE_SIZE_OFFSET = UBOGlobal::SCREEN_SCALE_OFFSET + 4;
    static const uint MAT_VIEW_OFFSET = UBOGlobal::NATIVE_SIZE_OFFSET + 4;
    static const uint MAT_VIEW_INV_OFFSET = UBOGlobal::MAT_VIEW_OFFSET + 16;
    static const uint MAT_PROJ_OFFSET = UBOGlobal::MAT_VIEW_INV_OFFSET + 16;
    static const uint MAT_PROJ_INV_OFFSET = UBOGlobal::MAT_PROJ_OFFSET + 16;
    static const uint MAT_VIEW_PROJ_OFFSET = UBOGlobal::MAT_PROJ_INV_OFFSET + 16;
    static const uint MAT_VIEW_PROJ_INV_OFFSET = UBOGlobal::MAT_VIEW_PROJ_OFFSET + 16;
    static const uint CAMERA_POS_OFFSET = UBOGlobal::MAT_VIEW_PROJ_INV_OFFSET + 16;
    static const uint EXPOSURE_OFFSET = UBOGlobal::CAMERA_POS_OFFSET + 4;
    static const uint MAIN_LIT_DIR_OFFSET = UBOGlobal::EXPOSURE_OFFSET + 4;
    static const uint MAIN_LIT_COLOR_OFFSET = UBOGlobal::MAIN_LIT_DIR_OFFSET + 4;
    static const uint MAIN_SHADOW_MATRIX_OFFSET = UBOGlobal::MAIN_LIT_COLOR_OFFSET + 4;
    static const uint AMBIENT_SKY_OFFSET = UBOGlobal::MAIN_SHADOW_MATRIX_OFFSET + 16;
    static const uint AMBIENT_GROUND_OFFSET = UBOGlobal::AMBIENT_SKY_OFFSET + 4;
    static const uint GLOBAL_FOG_COLOR_OFFSET = UBOGlobal::AMBIENT_GROUND_OFFSET + 4;
    static const uint GLOBAL_FOG_BASE_OFFSET = UBOGlobal::GLOBAL_FOG_COLOR_OFFSET + 4;
    static const uint GLOBAL_FOG_ADD_OFFSET = UBOGlobal::GLOBAL_FOG_BASE_OFFSET + 4;
    static const uint COUNT = UBOGlobal::GLOBAL_FOG_ADD_OFFSET + 4;
    static const uint SIZE = UBOGlobal::COUNT * 4;
    static gfx::UniformBlock BLOCK; //TODO
};

struct  CC_DLL UBOShadow : public Object {
    static const uint MAT_LIGHT_PLANE_PROJ_OFFSET = 0;
    static const uint SHADOW_COLOR_OFFSET = UBOShadow::MAT_LIGHT_PLANE_PROJ_OFFSET + 16;
    static const uint COUNT = UBOShadow::SHADOW_COLOR_OFFSET + 4;
    static const uint SIZE = UBOShadow::COUNT * 4;
    static gfx::UniformBlock BLOCK; //TODO
};

class CC_DLL SamplerLib : public Object {
public:
    gfx::Sampler *getSampler(uint hash);
};

struct CC_DLL DescriptorSetLayoutInfo {
    //    bindings: GFXDescriptorSetLayoutBinding[];
    //    record: Record<string, IBlockInfo | ISamplerInfo>;
};

uint genSamplerHash(const gfx::SamplerInfo &);
gfx::Sampler *getSampler(uint hash);

enum class LayerList : uint {
    NONE = 0,
    IGNORE_RAYCAST = (1 << 20),
    GIZMOS = (1 << 21),
    EDITOR = (1 << 22),
    UI_3D = (1 << 23),
    SCENE_GIZMO = (1 << 24),
    UI_2D = (1 << 25),

    PROFILER = (1 << 28),
    DEFAULT = (1 << 30),
    ALL = 0xffffffff,
};

bool aabb_frustum(const AABB *, const Frustum *);

enum class CC_DLL BatchingSchemes {
    INSTANCING = 1,
    VB_MERGING = 2,
};

extern CC_DLL uint SKYBOX_FLAG;
extern CC_DLL DescriptorSetLayoutInfo globalDescriptorSetLayout;
extern CC_DLL DescriptorSetLayoutInfo localDescriptorSetLayout;

} // namespace pipeline
} // namespace cc
