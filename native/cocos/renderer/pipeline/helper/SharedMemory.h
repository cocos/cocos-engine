#pragma once
#include "renderer/core/CoreStd.h"

#include "bindings/dop/BufferAllocator.h"
#include "bindings/dop/BufferPool.h"
#include "bindings/dop/ObjectPool.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Vec4.h"

namespace cc {
namespace gfx {
class DescriptorSet;
}

namespace pipeline {

//Get buffer pool data
#define GET_SUBMODEL(index)           SharedMemory::getBuffer<SubModelView>(index)
#define GET_PASS(index)               SharedMemory::getBuffer<PassView>(index)
#define GET_MODEL(index)              SharedMemory::getBuffer<ModelView>(index)
#define GET_FLAT_BUFFER(index)        SharedMemory::getBuffer<FlatBufferView>(index)
#define GET_INSTANCE_ATTRIBUTE(index) SharedMemory::getBuffer<InstancedAttributeView>(index)
#define GET_RENDER_SUBMESH(index)     SharedMemory::getBuffer<RenderingSubMesh>(index)
#define GET_BUFFERVIEW(index)         SharedMemory::getBuffer<BufferView>(index)
#define GET_NODE(index)               SharedMemory::getBuffer<Node>(index)
#define GET_ROOT()                    SharedMemory::getBuffer<Root>(se::BufferPool::getPoolFlag())
#define GET_CAMERA(index)             SharedMemory::getBuffer<Camera>(index)
#define GET_SCENE(index)              SharedMemory::getBuffer<Scene>(index)
#define GET_LIGHT(index)              SharedMemory::getBuffer<Light>(index)
#define GET_AMBIENT(index)            SharedMemory::getBuffer<Ambient>(index)
#define GET_FOG(index)                SharedMemory::getBuffer<Fog>(index)
#define GET_SKYBOX(index)             SharedMemory::getBuffer<Skybox>(index)
#define GET_FRUSTUM(index)            SharedMemory::getBuffer<Frustum>(index)
#define GET_AABB(index)               SharedMemory::getBuffer<AABB>(index)
#define GET_WINDOW(index)             SharedMemory::getBuffer<RenderWindow>(index)
#define GET_SHADOWS(index)            SharedMemory::getBuffer<Shadows>(index)
#define GET_SPHERE(index)             SharedMemory::getBuffer<Sphere>(index)

//Get object pool data
#define GET_DESCRIPTOR_SET(index)      SharedMemory::getObject<gfx::DescriptorSet, se::PoolType::DESCRIPTOR_SETS>(index)
#define GET_IA(index)                  SharedMemory::getObject<gfx::InputAssembler, se::PoolType::INPUT_ASSEMBLER>(index)
#define GET_SHADER(index)              SharedMemory::getObject<gfx::Shader, se::PoolType::SHADER>(index)
#define GET_RASTERIZER_STATE(index)    SharedMemory::getObject<gfx::RasterizerState, se::PoolType::RASTERIZER_STATE>(index)
#define GET_DEPTH_STENCIL_STATE(index) SharedMemory::getObject<gfx::DepthStencilState, se::PoolType::DEPTH_STENCIL_STATE>(index)
#define GET_BLEND_STATE(index)         SharedMemory::getObject<gfx::BlendState, se::PoolType::BLEND_STATE>(index)
#define GET_ATTRIBUTE(index)           SharedMemory::getObject<gfx::Attribute, se::PoolType::ATTRIBUTE>(index)
#define GET_FRAMEBUFFER(index)         SharedMemory::getObject<gfx::Framebuffer, se::PoolType::FRAMEBUFFER>(index)
#define GET_PIPELINE_LAYOUT(index)     SharedMemory::getObject<gfx::PipelineLayout, se::PoolType::PIPELINE_LAYOUT>(index)

//Get array pool data
#define GET_MODEL_ARRAY(index)               SharedMemory::getHandleArray(se::PoolType::MODEL_ARRAY, index)
#define GET_SUBMODEL_ARRAY(index)            SharedMemory::getHandleArray(se::PoolType::SUB_MODEL_ARRAY, index)
#define GET_ATTRIBUTE_ARRAY(index)           SharedMemory::getHandleArray(se::PoolType::ATTRIBUTE_ARRAY, index)
#define GET_FLAT_BUFFER_ARRAY(index)         SharedMemory::getHandleArray(se::PoolType::FLAT_BUFFER_ARRAY, index)
#define GET_INSTANCED_ATTRIBUTE_ARRAY(index) SharedMemory::getHandleArray(se::PoolType::INSTANCED_ATTRIBUTE_ARRAY, index)
#define GET_LIGHT_ARRAY(index)               SharedMemory::getHandleArray(se::PoolType::LIGHT_ARRAY, index)

#define GET_RAW_BUFFER(index, size) SharedMemory::getRawBuffer<uint8_t>(se::PoolType::RAW_BUFFER, index, size)

class CC_DLL SharedMemory : public Object {
public:
    template <typename T>
    static T *getBuffer(uint index) {
        const auto &bufferMap = se::BufferPool::getPoolMap();
        if (bufferMap.count(T::type) != 0) {
            const se::BufferPool *bufferPool = bufferMap.at(T::type);
            return bufferPool->getTypedObject<T>(index);
        } else {
            return nullptr;
        }
    }

    template <typename T, se::PoolType p>
    static T *getObject(uint index) {
        const auto &poolMap = se::ObjectPool::getPoolMap();
        if (poolMap.count(p) != 0) {
            const se::ObjectPool *objectPool = poolMap.at(p);
            return objectPool->getTypedObject<T>(index);
        } else {
            return nullptr;
        }
    }

    static uint32_t *getHandleArray(se::PoolType type, uint index) {
        return se::BufferAllocator::getBuffer<uint32_t>(type, index);
    }

    template <typename T>
    static T *getRawBuffer(se::PoolType type, uint index, uint *size) {
        return se::BufferAllocator::getBuffer<T>(type, index, size);
    }
};

struct CC_DLL Node {
    uint32_t flagsChanged = 0;
    uint32_t layer = 0;
    cc::Vec3 worldScale;
    cc::Vec3 worldPosition;
    cc::Vec4 worldRotation;
    cc::Mat4 worldMatrix;

    const static se::PoolType type;
};

struct CC_DLL AABB {
    cc::Vec3 center;
    cc::Vec3 halfExtents;

    void getBoundary(cc::Vec3 &minPos, cc::Vec3 &maxPos) const;
    void merge(const AABB &aabb);

    const static se::PoolType type;
};
bool aabb_aabb(const AABB *, const AABB *);

struct CC_DLL Plane {
    cc::Vec3 normal;
    float distance;
};

constexpr uint PLANE_LENGTH = 6;
struct CC_DLL Frustum {
    cc::Vec3 vertices[8];
    Plane planes[PLANE_LENGTH];

    const static se::PoolType type;
};
bool aabb_frustum(const AABB *, const Frustum *);

enum class LightType {
    DIRECTIONAL,
    SPHERE,
    SPOT,
    UNKNOWN,
};
struct CC_DLL Light {
    uint32_t useColorTemperature = 0;
    float luminance = 0;
    uint32_t nodeID = 0;
    float range = 0;
    uint32_t lightType = 0;
    uint32_t aabbID = 0;
    uint32_t frustumID = 0;
    float size;
    float spotAngle;
    cc::Vec3 direction;
    cc::Vec3 color;
    cc::Vec3 colorTemperatureRGB;
    cc::Vec3 position;

    CC_INLINE const Node *getNode() const { return GET_NODE(nodeID); }
    CC_INLINE LightType getType() const { return static_cast<LightType>(lightType); }
    CC_INLINE const AABB *getAABB() const { return GET_AABB(aabbID); }
    CC_INLINE const Frustum *getFrustum() const { return GET_FRUSTUM(frustumID); }

    const static se::PoolType type;
};

struct CC_DLL FlatBufferView {
    uint32_t stride = 0;
    uint32_t count = 0;
    uint32_t bufferID = 0; // raw buffer id

    CC_INLINE uint8_t *getBuffer(uint *size) const { return GET_RAW_BUFFER(bufferID, size); }

    const static se::PoolType type;
};

struct CC_DLL InstancedAttributeView {
    uint32_t nameID = 0;
    uint32_t format = 0;
    uint32_t isNormalized = 0;
    uint32_t bufferID = 0;

    CC_INLINE const uint8_t *getBuffer(uint *size) const { return GET_RAW_BUFFER(bufferID, size); }

    const static se::PoolType type;
};

struct CC_DLL RenderingSubMesh {
    uint32_t flatBuffersID = 0; // array pool id

    CC_INLINE const uint *getFlatBufferArrayID() const { return GET_FLAT_BUFFER_ARRAY(flatBuffersID); }
    CC_INLINE const FlatBufferView *getFlatBuffer(uint idx) const { return GET_FLAT_BUFFER(idx); }

    const static se::PoolType type;
};

enum class CC_DLL BatchingSchemes {
    INSTANCING = 1,
    VB_MERGING = 2,
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

    CC_INLINE BatchingSchemes getBatchingScheme() const { return static_cast<BatchingSchemes>(batchingScheme); }
    CC_INLINE gfx::PrimitiveMode getPrimitive() const { return static_cast<gfx::PrimitiveMode>(primitive); }
    CC_INLINE gfx::DynamicStateFlags getDynamicState() const { return static_cast<gfx::DynamicStateFlags>(dynamicState); }
    CC_INLINE gfx::RasterizerState *getRasterizerState() const { return GET_RASTERIZER_STATE(rasterizerStateID); }
    CC_INLINE gfx::DepthStencilState *getDepthStencilState() const { return GET_DEPTH_STENCIL_STATE(depthStencilStateID); }
    CC_INLINE gfx::BlendState *getBlendState() const { return GET_BLEND_STATE(blendStateID); }
    CC_INLINE gfx::DescriptorSet *getDescriptorSet() const { return GET_DESCRIPTOR_SET(descriptorSetID); }
    CC_INLINE gfx::PipelineLayout *getPipelineLayout() const { return GET_PIPELINE_LAYOUT(pipelineLayoutID); }

    const static se::PoolType type;
};

struct CC_DLL SubModelView {
    uint32_t priority = 0;
    uint32_t passCount = 0;
    uint32_t passID[4] = {0, 0, 0, 0};
    uint32_t shaderID[4] = {0, 0, 0, 0};
    uint32_t descriptorSetID = 0;
    uint32_t inputAssemblerID = 0;
    uint32_t subMeshID = 0;

    CC_INLINE const PassView *getPassView(uint idx) const { return GET_PASS(passID[idx]); }
    CC_INLINE gfx::Shader *getShader(uint idx) const { return GET_SHADER(shaderID[idx]); }
    CC_INLINE gfx::DescriptorSet *getDescriptorSet() const { return GET_DESCRIPTOR_SET(descriptorSetID); }
    CC_INLINE gfx::InputAssembler *getInputAssembler() const { return GET_IA(inputAssemblerID); }
    CC_INLINE const RenderingSubMesh *getSubMesh() const { return GET_RENDER_SUBMESH(subMeshID); }

    const static se::PoolType type;
};

struct CC_DLL ModelView {
    uint32_t enabled = 0;
    uint32_t visFlags = 0;
    uint32_t castShadow = 0;
    uint32_t receiveShadow = 0;
    uint32_t worldBoundsID = 0; // aabb
    uint32_t nodeID = 0;
    uint32_t transformID = 0;
    uint32_t subModelsID = 0;       // array pool id
    uint32_t instancedBufferID = 0; // raw buffer id
    uint32_t instancedAttrsID = 0;  // array pool id

    CC_INLINE const AABB *getWorldBounds() const { return GET_AABB(worldBoundsID); }
    CC_INLINE const Node *getNode() const { return GET_NODE(nodeID); }
    CC_INLINE const Node *getTransform() const { return GET_NODE(transformID); }
    CC_INLINE const uint *getSubModelID() const { return GET_SUBMODEL_ARRAY(subModelsID); }
    CC_INLINE const SubModelView *getSubModelView(uint idx) const { return GET_SUBMODEL(idx); }
    CC_INLINE const uint8_t *getInstancedBuffer(uint *size) const { return GET_RAW_BUFFER(instancedBufferID, size); }
    CC_INLINE const uint *getInstancedAttributeID() const { return GET_ATTRIBUTE_ARRAY(instancedAttrsID); }
    CC_INLINE gfx::Attribute *getInstancedAttribute(uint idx) const { return GET_ATTRIBUTE(idx); }
    const static se::PoolType type;
};

struct CC_DLL Scene {
    uint32_t mainLightID = 0;
    uint32_t modelsID = 0; // array pool
    uint32_t sphereLights; // array pool
    uint32_t spotLights;   // array pool

    CC_INLINE const Light *getMainLight() const { return GET_LIGHT(mainLightID); }
    CC_INLINE const uint *getSphereLightArrayID() const { return GET_LIGHT_ARRAY(sphereLights); }
    CC_INLINE const Light *getSphereLight(uint idx) const { return GET_LIGHT(idx); }
    CC_INLINE const uint *getSpotLightArrayID() const { return GET_LIGHT_ARRAY(spotLights); }
    CC_INLINE const Light *getSpotLight(uint idx) const { return GET_LIGHT(idx); }
    CC_INLINE const uint *getModels() const { return GET_MODEL_ARRAY(modelsID); }
    CC_INLINE const ModelView *getModelView(uint idx) const { return GET_MODEL(idx); }

    const static se::PoolType type;
};

struct CC_DLL Camera {
    uint32_t width = 0;
    uint32_t height = 0;
    float exposure = 0;
    uint32_t clearFlag = 0;
    float clearDepth = 0;
    uint32_t clearStencil = 0;
    uint32_t nodeID = 0;
    uint32_t sceneID = 0;
    uint32_t frustumID = 0;
    cc::Vec3 forward;
    cc::Vec3 position;
    float viewportX = 0;
    float viewportY = 0;
    float viewportWidth = 0;
    float viewportHeight = 0;
    gfx::Color clearColor;
    cc::Mat4 matView;
    cc::Mat4 matViewProj;
    cc::Mat4 matViewProjInv;
    cc::Mat4 matProj;
    cc::Mat4 matProjInv;

    CC_INLINE const Node *getNode() const { return GET_NODE(nodeID); }
    CC_INLINE const Scene *getScene() const { return GET_SCENE(sceneID); }
    CC_INLINE const Frustum *getFrustum() const { return GET_FRUSTUM(frustumID); }

    const static se::PoolType type;
};

struct CC_DLL Ambient {
    uint32_t enabled = 0;
    float skyIllum = 0;
    cc::Vec4 skyColor;
    cc::Vec4 groundAlbedo;

    const static se::PoolType type;
};

struct CC_DLL Fog {
    uint32_t enabled = 0;
    uint32_t fogType = 0;
    float fogDensity = 0;
    float fogStart = 0;
    float fogEnd = 0;
    float fogAtten = 0;
    float fogTop = 0;
    float fogRange = 0;
    cc::Vec4 fogColor;

    const static se::PoolType type;
};

struct CC_DLL Sphere {
    float radius = 0;
    cc::Vec3 center;

    CC_INLINE void setCenter(const cc::Vec3 &val) { center = val; }
    CC_INLINE void setRadius(float val) { radius = val; }
    void define(const AABB &aabb);
    void mergeAABB(const AABB *aabb);
    void mergePoint(const cc::Vec3 &point);

    const static se::PoolType type;
};
bool sphere_frustum(const Sphere *sphere, const Frustum *frustum);

enum class CC_DLL ShadowType {
    PLANAR = 0,
    SHADOWMAP = 1
};

struct CC_DLL Shadows {
    uint32_t enabled = 0;
    uint32_t dirty = 0;
    uint32_t shadowType = 0;
    float distance = 0;
    float instancePass = 0;
    float planarPass = 0;
    float nearValue = 0;
    float farValue = 0;
    float aspect = 0;
    uint32_t pcfType = 0;
    float bias = 0;
    float orthoSize = 0;
    uint32_t autoAdapt = 0;

    cc::Vec4 color;
    cc::Vec2 size;
    cc::Vec3 normal;
    cc::Mat4 matLight;

    CC_INLINE ShadowType getShadowType() const { return static_cast<ShadowType>(shadowType); }

    const static se::PoolType type;
};

struct CC_DLL Skybox {
    uint32_t enabled = 0;
    uint32_t isRGBE = 0;
    uint32_t useIBL = 0;
    uint32_t modelID = 0;

    CC_INLINE const ModelView *getModel() const { return GET_MODEL(modelID); }

    const static se::PoolType type;
};

struct CC_DLL Root {
    float cumulativeTime = 0;
    float frameTime = 0;

    const static se::PoolType type;
};

struct CC_DLL RenderWindow {
    uint32_t hasOnScreenAttachments = 0;
    uint32_t hasOffScreenAttachments = 0;
    uint32_t framebufferID = 0;

    CC_INLINE gfx::Framebuffer *getFramebuffer() const { return GET_FRAMEBUFFER(framebufferID); }

    const static se::PoolType type;
};

} //namespace pipeline
} //namespace cc
