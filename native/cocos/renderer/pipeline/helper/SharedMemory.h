#pragma once
#include "core/CoreStd.h"
#include "math/Vec3.h"
#include "scripting/dop/BufferPool.h"

namespace cc {
namespace gfx {
class DescriptorSet;
}

namespace pipeline {
struct RenderingSubMesh;
struct FlatBuffer;
struct PlanarShadow;

template <typename TYPE, TYPE value>
struct PoolType {
    using type = TYPE;
    static TYPE getType() { return value; }
};

struct CC_DLL PassView : public PoolType<se::BufferPoolType, se::BufferPoolType::PASS> {
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
    uint32_t descriptorSetID = 0;
    uint32_t pipelineLayoutID = 0;
    uint32_t count = 0;
};

struct CC_DLL SubModelView : public PoolType<se::BufferPoolType, se::BufferPoolType::SUBMODEL> {
    uint32_t priority = 0;
    uint32_t passCount = 0;
    uint32_t pass0ID = 0;
    uint32_t pass1ID = 0;
    uint32_t pass2ID = 0;
    uint32_t pass3ID = 0;
    uint32_t shader0ID = 0;
    uint32_t shadere1ID = 0;
    uint32_t shader2ID = 0;
    uint32_t shader3ID = 0;
    uint32_t descriptorSetID = 0;
    uint32_t inputAssemblerID = 0;
    uint32_t COUNT = 0;
};

enum class CC_DLL BatchingSchemes {
    INSTANCING = 1,
    VB_MERGING = 2,
};

struct CC_DLL InstancedAttributeBlock {
    uint32_t bufferViewID = 0;
    uint32_t bufferViewSize = 0;

    uint32_t instancedAttributesID = 0;
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

    cc::Mat4 matView;
    cc::Mat4 matProj;
    cc::Mat4 matProjInv;
    cc::Mat4 matViewProj;
    cc::Mat4 matViewProjInv;
    cc::Vec3 position;
    cc::Vec3 forward;

    uint32_t nodeID = 0;
    uint32_t sceneID = 0;
    uint32_t frustumID = 0;
};

struct CC_DLL AABB : public PoolType<se::BufferPoolType, se::BufferPoolType::UNKNOWN> {
    cc::Vec3 halfExtents;
    cc::Vec3 center;
};

struct CC_DLL Frustum : public PoolType<se::BufferPoolType, se::BufferPoolType::UNKNOWN> {
    uint32_t planesID = 0; //array pool
};

struct CC_DLL Plane : public PoolType<se::BufferPoolType, se::BufferPoolType::UNKNOWN> {
    cc::Vec3 normal;
    float distance;
};

struct CC_DLL Scene {
    uint32_t mainLightID = 0;
    uint32_t ambientID = 0;
    uint32_t fogID = 0;
    uint32_t skyboxID = 0;
    uint32_t planarShadowID = 0;
    uint32_t modelsID = 0; //array pool
};

struct CC_DLL MainLight {
    float useColorTemperature = 0;
    float illuminance = 0;
    cc::Vec3 direction;
    cc::Vec3 color;
    cc::Vec3 colorTemperatureRGB;

    uint32_t nodeID = 0;
};

struct CC_DLL Ambient {
    float skyIllum = 0;
    cc::Vec4 skyColor;
    cc::Vec4 groundAlbedo;
    const static se::PoolType type = se::PoolType::AMBIENT_DATA;
};

struct CC_DLL Fog {
    float enabled = 0;
    float fogStart = 0;
    float fogEnd = 0;
    float fogDensity = 0;
    float fogTop = 0;
    float fogRange = 0;
    float fogAtten = 0;
    cc::Vec4 fogColor;
    const static se::PoolType type = se::PoolType::FOG_DATA;
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

struct CC_DLL Node : public PoolType<se::BufferPoolType, se::BufferPoolType::UNKNOWN> {
    cc::Mat4 worldMatrix;
    cc::Vec3 worldPosition;
    cc::Vec3 worldRotation;
    cc::Vec3 worldScale;

    uint32_t layer = 0;
};

struct CC_DLL Model : public PoolType<se::BufferPoolType, se::BufferPoolType::MODEL> {
    uint32_t subModelsID = 0; //array pool

    uint32_t nodeID = 0;
    uint32_t transformID = 0;

    uint32_t enabled = 0;
    uint32_t visFlags = 0;
    uint32_t castShadow = 0;

    uint32_t worldBoundsID = 0; //aabb

    InstancedAttributeBlock instancedAttributeBlock;

    const static se::PoolType type = se::PoolType::MODEL_INFO;
};

struct CC_DLL Skybox : public Model {
    uint32_t enabled = 0;
};

struct CC_DLL PSOInfo : public PoolType<se::BufferPoolType, se::BufferPoolType::UNKNOWN> {
    uint32_t passID = 0;
    uint32_t bindingLayoutID = 0;
    uint32_t shaderID = 0;

    const static se::PoolType type = se::PoolType::PSOCI;
};

struct CC_DLL BufferView {
    uint8_t *data = nullptr;
    const static se::PoolType type = se::PoolType::BUFFER_VIEW;
};

struct CC_DLL FlatBuffer {
    uint32_t stride = 0;
    uint32_t count = 0;
    uint32_t bufferViewID = 0;
    uint32_t bufferViewSize = 0;

    const static se::PoolType type = se::PoolType::FLAT_BUFFER_INFO;
};

struct CC_DLL RenderingSubMesh {
    uint32_t vertexBuffersID = 0;

    uint32_t attributesID = 0;

    uint32_t flatBuffersID = 0;

    uint32_t primitiveMode = 0;
    uint32_t indexBufferID = 0;
    uint32_t indirectBufferID = 0;
    uint32_t meshID = 0;
    uint32_t subMeshIndex = 0;

    const static se::PoolType type = se::PoolType::RENDER_SUBMESH_INFO;
};

struct CC_DLL Root {
    float cumulativeTime = 0;
    float frameTime = 0;
    const static se::PoolType type = se::PoolType::ROOT_DATA;
};

struct CC_DLL Director : public PoolType<se::BufferPoolType, se::BufferPoolType::UNKNOWN> {
    float totalFrames = 0;
};

//Get buffer pool data
#define GET_SUBMODEL(index, offset) (SharedMemory::get<SubModelView>(index) + offset)
#define GET_PASS(index)             (SharedMemory::get<PassView>(index))

#define GET_INSTANCE_ATTRIBUTE(index, offset) (SharedMemory::get<InstancedAttribute>(index) + offset)
#define GET_RENDER_SUBMESH(index)             (SharedMemory::get<RenderingSubMesh>(index))
#define GET_FLAT_BUFFER(index, offset)        (SharedMemory::get<FlatBuffer>(index) + offset)
#define GET_BUFFERVIEW(index)                 (SharedMemory::get<BufferView>(index))
#define GET_NODE(index)                       (SharedMemory::get<Node>(index))
#define GET_ROOT(index)                       (SharedMemory::get<Root>(index))
#define GET_CAMERA(index)                     (SharedMemory::get<Camera>(index))
#define GET_SCENE(index)                      (SharedMemory::get<Scene>(index))
#define GET_MAIN_LIGHT(index)                 (SharedMemory::get<MainLight>(index))
#define GET_AMBIENT(index)                    (SharedMemory::get<Ambient>(index))
#define GET_FOG(index)                        (SharedMemory::get<Fog>(index))
#define GET_DIRECTOR(index)                   (SharedMemory::get<Director>(index))
#define GET_PLANAR_SHADOW(index)              (static_cast<PlanarShadow *>(0))
#define GET_SKYBOX(index)                     (SharedMemory::get<Skybox>(index))
#define GET_FRUSTUM(index)                    (SharedMemory::get<Frustum>(index))
#define GET_AABB(index)                       (SharedMemory::get<AABB>(index))

//TODO
#define GET_NAME(index) (String(0))

//Get object pool data
#define GET_DESCRIPTOR_SET(index)      (static_cast<gfx::DescriptorSet *>(0))
#define GET_IA(index)                  (static_cast<gfx::InputAssembler *>(0))
#define GET_SHADER(index)              (static_cast<gfx::Shader *>(0))
#define GET_RASTERIZER_STATE(index)    (static_cast<gfx::RasterizerState *>(0))
#define GET_DEPTH_STENCIL_STATE(index) (static_cast<gfx::DepthStencilState *>(0))
#define GET_BLEND_STATE(index)         (static_cast<gfx::BlendState *>(0))
#define GET_BINDING_LAYOUT(index)      (static_cast<gfx::BindingLayout *>(0))

//Get array pool data
struct CC_DLL ModelArray {
    uint32_t viewID;
};

struct CC_DLL PlaneArray {
    uint32_t viewID;
};
#define GET_MODEL(index) (static_cast<ModelArray *>(0))
#define GET_PLANE(index) (static_cast<PlaneArray *>(0))

#define ENABLE_IF_BUFFER_POOL_RET typename std::enable_if_t<std::is_same<se::BufferPoolType, typename T::type>::value, T>
class CC_DLL SharedMemory : public Object {
public:
    template <typename T>
    static ENABLE_IF_BUFFER_POOL_RET
        *
        get(uint index) {
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
