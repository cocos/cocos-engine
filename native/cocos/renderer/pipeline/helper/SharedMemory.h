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
class RenderPipeline;

struct CC_DLL ModelView {
    uint32_t subModelsID = 0; //array pool

    uint32_t nodeID = 0;
    uint32_t transformID = 0;

    uint32_t enabled = 0;
    uint32_t visFlags = 0;
    uint32_t castShadow = 0;

    uint32_t worldBoundsID = 0; //aabb

    //    InstancedAttributeBlock instancedAttributeBlock;

    const static se::PoolType type = se::PoolType::MODEL;
};

struct CC_DLL SubModelView {
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

    const static se::PoolType type = se::PoolType::SUBMODEL;
};

struct CC_DLL PassView {
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

    const static se::PoolType type = se::PoolType::PASS;
};

//
//struct CC_DLL InstancedAttributeBlock {
//    uint32_t bufferViewID = 0;
//    uint32_t bufferViewSize = 0;
//
//    uint32_t instancedAttributesID = 0; //array pool
//};

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

    const static se::PoolType type = se::PoolType::CAMERA;
};

struct CC_DLL AABB {
    cc::Vec3 halfExtents;
    cc::Vec3 center;

    const static se::PoolType type = se::PoolType::AABB;
};

struct CC_DLL Frustum {
    uint32_t planesID = 0; //array pool

    const static se::PoolType type = se::PoolType::UNKNOWN;
};

struct CC_DLL Plane {
    cc::Vec3 normal;
    float distance;

    const static se::PoolType type = se::PoolType::UNKNOWN;
};

struct CC_DLL Scene {
    uint32_t mainLightID = 0;
    uint32_t ambientID = 0;
    uint32_t fogID = 0;
    uint32_t skyboxID = 0;
    uint32_t planarShadowID = 0;
    uint32_t modelsID = 0; //array pool

    const static se::PoolType type = se::PoolType::SCENE;
};

struct CC_DLL MainLight {
    float useColorTemperature = 0;
    float illuminance = 0;
    cc::Vec3 direction;
    cc::Vec3 color;
    cc::Vec3 colorTemperatureRGB;

    uint32_t nodeID = 0;

    const static se::PoolType type = se::PoolType::UNKNOWN;
};

struct CC_DLL Ambient {
    float skyIllum = 0;
    cc::Vec4 skyColor;
    cc::Vec4 groundAlbedo;

    const static se::PoolType type = se::PoolType::UNKNOWN;
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

    const static se::PoolType type = se::PoolType::UNKNOWN;
};

struct CC_DLL InstancedAttribute {
    uint32_t nameID = 0;
    uint32_t format = 0;
    uint32_t isNormalized = 0;
    uint32_t viewID = 0;

    const static se::PoolType type = se::PoolType::UNKNOWN;
};

struct CC_DLL Skybox : public ModelView {
    uint32_t enabled = 0;
};

struct CC_DLL BufferView {
    uint8_t *data = nullptr;

    const static se::PoolType type = se::PoolType::UNKNOWN;
};

struct CC_DLL FlatBuffer {
    uint32_t stride = 0;
    uint32_t count = 0;
    uint32_t bufferViewID = 0;
    uint32_t bufferViewSize = 0;

    const static se::PoolType type = se::PoolType::UNKNOWN;
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

    const static se::PoolType type = se::PoolType::UNKNOWN;
};

struct CC_DLL Node {
    cc::Mat4 worldMatrix;
    cc::Vec3 worldPosition;
    cc::Vec4 worldRotation;
    cc::Vec3 worldScale;

    uint32_t layer = 0;

    const static se::PoolType type = se::PoolType::NODE;
};

struct CC_DLL Root {
    float cumulativeTime = 0;
    float frameTime = 0;

    const static se::PoolType type = se::PoolType::ROOT;
};

struct CC_DLL Director {
    float totalFrames = 0;

    const static se::PoolType type = se::PoolType::DIRECTOR;
};

struct CC_DLL RenderWindow {
    uint32_t framebufferID = 0;
    uint32_t hasOnScreenAttachments = 0;
    uint32_t hasOffScreenAttachments = 0;

    const static se::PoolType type = se::PoolType::RENDER_WINDOW;
};

//Get buffer pool data
#define GET_SUBMODEL(index) (SharedMemory::get<SubModelView>(index))
#define GET_PASS(index)     (SharedMemory::get<PassView>(index))
#define GET_MODEL(index)    (SharedMemory::get<ModelView>(index))

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
#define GET_WINDOW(index)                     (SharedMemory::get<RenderWindow>(index))

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
#define GET_FRAMEBUFFER(index)         (static_cast<gfx::Framebuffer *>(0))

//Get array pool data
#define GET_MODEL_ARRAY(index)    (static_cast<uint32_t *>(0))
#define GET_SUBMODEL_ARRAY(index) (static_cast<uint32_t *>(0))
#define GET_PLANE_ARRAY(index)    (static_cast<uint32_t *>(0))

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
    static se::BufferPoolType getBufferType() {
    }
};

} //namespace pipeline
} //namespace cc
