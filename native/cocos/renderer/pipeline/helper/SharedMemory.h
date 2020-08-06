#pragma once
#include "core/CoreStd.h"
#include "scripting/dop/BufferPool.h"

namespace cc {
namespace gfx {
class InputAssembler;
class Shader;
struct RasterizerState;
struct DepthStencilState;
struct BlendState;
class BindingLayout;
} // namespace gfx

namespace pipeline {
struct RenderingSubMesh;

enum class CC_DLL BatchingSchemes {
    INSTANCING = 1,
    VB_MERGING = 2,
};

struct CC_DLL InstancedAttributeBlock {
    uint32_t bufferViewID = 0;
    uint32_t bufferViewSize = 0;

    uint32_t instancedAttributesID = 0;
    uint32_t instancedAttributesCount = 0;
};
constexpr uint SKYBOX_FLAG = static_cast<uint>(gfx::ClearFlagBit::STENCIL) << 1;

struct CC_DLL Camera {
    gfx::Rect viewport;
    gfx::Color clearColor;
    float width = 0;
    float height = 0;
    float exposure = 0;
    uint32_t clearFlag = 0;
    float clearDepth = 0;
    uint32_t clearStencil = 0;

    const static se::PoolType type = se::PoolType::CAMERA_INFO;
};

struct CC_DLL SubModel {
    uint32_t priority = 0;
    uint32_t materialID = 0;
    uint32_t psociID = 0;
    uint32_t iaID = 0;

    uint32_t passesID = 0;
    uint32_t passesCount = 0;

    uint32_t renderSubMeshID = 0;

    const static se::PoolType type = se::PoolType::SUBMODEL_INFO;
};

struct CC_DLL InstancedAttribute {
    uint32_t nameID = 0;
    uint32_t format = 0;
    uint32_t isNormalized = 0;
    uint32_t viewID = 0;

    const static se::PoolType type = se::PoolType::INSTANCED_ATTRIBUTE_INFO;
};

struct CC_DLL Model {
    uint32_t isDynamicBatching = 0;

    uint32_t subModelsCount = 0;
    uint32_t subModelsID = 0;

    InstancedAttributeBlock instancedAttributeBlock;

    const static se::PoolType type = se::PoolType::MODEL_INFO;
};

struct CC_DLL Pass {
    uint32_t priority = 0;
    uint32_t stage = 0;
    uint32_t phase = 0;
    uint32_t batchingScheme = 0;
    uint32_t primitive = 0;
    uint32_t dynamicState = 0;
    uint32_t hash = 0;
    uint32_t rasterizerStateID = 0;
    uint32_t depthStencilStateID = 0;
    uint32_t blendStateID = 0;

    const static se::PoolType type = se::PoolType::PASS_INFO;
};

struct CC_DLL PSOInfo {
    uint32_t passID = 0;
    uint32_t bindingLayoutID = 0;
    uint32_t shaderID = 0;

    const static se::PoolType type = se::PoolType::PSOCI;
};

struct CC_DLL BufferView {
    uint8_t *data = nullptr;
    const static se::PoolType type = se::PoolType::BUFFER_VIEW;
};

#define GET_SUBMODLE(index, offset)           (SharedMemory::get<SubModel>(index) + offset)
#define GET_PASS(index, offset)               (SharedMemory::get<Pass>(index) + offset) //get pass from material
#define GET_PSOCI(index, offset)              (SharedMemory::get<PSOInfo>(index) + offset)
#define GET_INSTANCE_ATTRIBUTE(index, offset) (SharedMemory::get<InstancedAttribute>(index) + offset)
#define GET_RENDER_SUBMESH(index)             (SharedMemory::get<RenderingSubMesh>(index))
#define GET_BUFFERVIEW(index)                 (SharedMemory::get<BufferView>(index))

//TODO
#define GET_NAME(index) (String(0))

#define GET_IA(index)                  (static_cast<gfx::InputAssembler *>(0))
#define GET_SHADER(index)              (static_cast<gfx::Shader *>(0))
#define GET_RASTERIZER_STATE(index)    (static_cast<gfx::RasterizerState *>(0))
#define GET_DEPTH_STENCIL_STATE(index) (static_cast<gfx::DepthStencilState *>(0))
#define GET_BLEND_STATE(index)         (static_cast<gfx::BlendState *>(0))
#define GET_BINDING_LAYOUT(index)      (static_cast<gfx::BindingLayout *>(0))

class CC_DLL SharedMemory : public Object {
public:
    template <typename T>
    static T *get(uint index) {
        const auto &bufferMap = se::BufferPool::getPoolMap();
        if (bufferMap.count(T::type) != 0) {
            se::BufferPool *bufferPool = bufferMap.at(T::type);
            return bufferPool->getTypedObject<T>(index);
        } else {
            return nullptr;
        }
    }

private:
    template <typename T>
    static se::PoolType getBufferType() {
    }
};

} //namespace pipeline
} //namespace cc
