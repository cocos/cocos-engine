#pragma once
#include "renderer/core/CoreStd.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "scripting/dop/ArrayPool.h"
#include "scripting/dop/BufferPool.h"
#include "scripting/dop/ObjectPool.h"

namespace cc {
namespace gfx {
class DescriptorSet;
}

namespace pipeline {
struct RenderingSubMesh;
struct FlatBuffer;
class RenderPipeline;

struct CC_DLL ModelView {
    uint32_t enabled = 0;
    uint32_t visFlags = 0;
    uint32_t castShadow = 0;
    uint32_t worldBoundsID = 0; // aabb
    uint32_t nodeID = 0;
    uint32_t transformID = 0;
    uint32_t subModelsID = 0; // array pool id
    //    InstancedAttributeBlock instancedAttributeBlock;

    const static se::PoolType type;
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

    const static se::PoolType type;
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

    const static se::PoolType type;
};

//
//struct CC_DLL InstancedAttributeBlock {
//    uint32_t bufferViewID = 0;
//    uint32_t bufferViewSize = 0;
//
//    uint32_t instancedAttributesID = 0; //array pool
//};

class CC_DLL Camera {
private:
    float width = 0;
    float height = 0;
    float exposure = 0;
    float clearFlag = 0;
    float clearDepth = 0;
    float clearStencil = 0;
    float nodeID = 0;
    float sceneID = 0;
    float frustumID = 0;
    cc::Vec3 forward;
    cc::Vec3 position;
    float viewportX;
    float viewportY;
    float viewportWidth;
    float viewportHeight;
    gfx::Color clearColor;
    cc::Mat4 matView;
    cc::Mat4 matViewProj;
    cc::Mat4 matViewProjInv;
    cc::Mat4 matProj;
    cc::Mat4 matProjInv;

public:
    float getWidth() const { return width;}
    float getHeight() const { return height;}
    float getExposure() const { return exposure;}
    float getClearDepth() const { return clearDepth;}
    uint getClearFlag() const { return static_cast<uint>(clearFlag);}
    uint getClearStencil() const { return static_cast<uint>(clearStencil);}
    uint getNodeID() const { return static_cast<uint>(nodeID);}
    uint getSceneID() const { return static_cast<uint>(sceneID);}
    uint getFrustumID() const { return static_cast<uint>(frustumID);}
    uint getViewportX() const { return static_cast<uint>(viewportX);}
    uint getViewportY() const { return static_cast<uint>(viewportY);}
    uint getViewportWidth() const { return static_cast<uint>(viewportWidth);}
    uint getViewportHeight() const { return static_cast<uint>(viewportHeight);}
    const cc::Vec3 &getForward() const { return forward;}
    const cc::Vec3 &getPosition() const { return position;}
    const gfx::Color &getClearColor() const { return clearColor; }
    const cc::Mat4 &getMatView() const { return matView; }
    const cc::Mat4 &getMatViewProj() const { return matViewProj; }
    const cc::Mat4 &getMatViewProjInv() const { return matViewProjInv; }
    const cc::Mat4 &getMatProj() const { return matProj; }
    const cc::Mat4 &getMatProjInv() const { return matProjInv; }

    const static se::PoolType type;
};

struct CC_DLL AABB {
    cc::Vec3 center;
    cc::Vec3 halfExtents;

    const static se::PoolType type;
};

struct CC_DLL Plane {
    float distance;
    cc::Vec3 normal;
};

struct CC_DLL Frustum {
    cc::Vec3 vertices[8];
    Plane planes[6];

    const static se::PoolType type;
};

struct CC_DLL Scene {
    uint32_t mainLightID = 0;
    uint32_t ambientID = 0;
    uint32_t fogID = 0;
    uint32_t skyboxID = 0;
    uint32_t planarShadowID = 0;
    uint32_t modelsID = 0; //array pool

    const static se::PoolType type;
};

struct CC_DLL MainLight {
    float useColorTemperature = 0;
    float illuminance = 0;
    cc::Vec3 direction;
    cc::Vec3 color;
    cc::Vec3 colorTemperatureRGB;

    float nodeID = 0;

    const static se::PoolType type;
};

struct CC_DLL Ambient {
    float skyIllum = 0;
    cc::Vec4 skyColor;
    cc::Vec4 groundAlbedo;

    const static se::PoolType type;
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

    const static se::PoolType type;
};

struct CC_DLL ShadowMap {
    float enabled = 0;
    float nearValue = 0;
    float farValue = 0;
    float aspect = 0;
    float orthoSize = 0;
    cc::Vec2 size;

    const static se::PoolType type;
};

struct CC_DLL PlanarShadow {
    uint32_t enabled = 0;

    const static se::PoolType type;
};

struct CC_DLL InstancedAttribute {
    uint32_t nameID = 0;
    uint32_t format = 0;
    uint32_t isNormalized = 0;
    uint32_t viewID = 0;

    const static se::PoolType type;
};

struct CC_DLL Skybox : public ModelView {
    uint32_t enabled = 0;
};

struct CC_DLL BufferView {
    uint8_t *data = nullptr;

    const static se::PoolType type;
};

struct CC_DLL FlatBuffer {
    uint32_t stride = 0;
    uint32_t count = 0;
    uint32_t bufferViewID = 0;
    uint32_t bufferViewSize = 0;

    const static se::PoolType type;
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

    const static se::PoolType type;
};

class CC_DLL Node {
private:
    float layer = 0;
    cc::Vec3 worldScale;
    cc::Vec3 worldPosition;
    cc::Vec4 worldRotation;
    cc::Mat4 worldMatrix;

public:
    uint getLayer() const { return static_cast<uint>(layer); }
    const cc::Vec3 &getWorldScale() const { return worldScale;}
    const cc::Vec3 &getWorldPosition() const { return worldPosition;}
    const cc::Vec4 &getWorldRotation() const { return worldRotation;}
    const cc::Mat4 &getWorldMatrix() const { return worldMatrix;}
    
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

    const static se::PoolType type;
};


//Get buffer pool data
#define GET_SUBMODEL(index) SharedMemory::getBuffer<SubModelView>(index)
#define GET_PASS(index)     SharedMemory::getBuffer<PassView>(index)
#define GET_MODEL(index)    SharedMemory::getBuffer<ModelView>(index)

#define GET_INSTANCE_ATTRIBUTE(index, offset) (SharedMemory::getBuffer<InstancedAttribute>(index) + offset)
#define GET_RENDER_SUBMESH(index)             SharedMemory::getBuffer<RenderingSubMesh>(index)
#define GET_FLAT_BUFFER(index, offset)        (SharedMemory::getBuffer<FlatBuffer>(index) + offset)
#define GET_BUFFERVIEW(index)                 SharedMemory::getBuffer<BufferView>(index)
#define GET_NODE(index)                       SharedMemory::getBuffer<Node>(index)
#define GET_ROOT(index)                       SharedMemory::getBuffer<Root>(index)
#define GET_CAMERA(index)                     SharedMemory::getBuffer<Camera>(index)
#define GET_SCENE(index)                      SharedMemory::getBuffer<Scene>(index)
#define GET_MAIN_LIGHT(index)                 SharedMemory::getBuffer<MainLight>(index)
#define GET_AMBIENT(index)                    SharedMemory::getBuffer<Ambient>(index)
#define GET_FOG(index)                        SharedMemory::getBuffer<Fog>(index)
#define GET_PLANAR_SHADOW(index)              SharedMemory::getBuffer<PlanarShadow>(index)
#define GET_SKYBOX(index)                     SharedMemory::getBuffer<Skybox>(index)
#define GET_FRUSTUM(index)                    SharedMemory::getBuffer<Frustum>(index)
#define GET_AABB(index)                       SharedMemory::getBuffer<AABB>(index)
#define GET_WINDOW(index)                     SharedMemory::getBuffer<RenderWindow>(index)
#define GET_SHADOWMAP(index)                  SharedMemory::getBuffer<ShadowMap>(index)

//TODO
#define GET_NAME(index) (String(0))

//Get object pool data
#define GET_DESCRIPTOR_SET(index)      SharedMemory::getObject<gfx::DescriptorSet, se::PoolType::DESCRIPTOR_SETS>(index)
#define GET_IA(index)                  SharedMemory::getObject<gfx::InputAssembler, se::PoolType::INPUT_ASSEMBLER>(index)
#define GET_SHADER(index)              SharedMemory::getObject<gfx::Shader, se::PoolType::SHADER>(index)
#define GET_RASTERIZER_STATE(index)    SharedMemory::getObject<gfx::RasterizerState, se::PoolType::RASTERIZER_STATE>(index)
#define GET_DEPTH_STENCIL_STATE(index) SharedMemory::getObject<gfx::DepthStencilState, se::PoolType::DEPTH_STENCIL_STATE>(index)
#define GET_BLEND_STATE(index)         SharedMemory::getObject<gfx::BlendState, se::PoolType::BLEND_STATE>(index)
#define GET_FRAMEBUFFER(index)         SharedMemory::getObject<gfx::Framebuffer, se::PoolType::FRAMEBUFFER>(index)

//Get array pool data
#define GET_MODEL_ARRAY(index)    SharedMemory::getArray(se::PoolType::MODEL_ARRAY, index)
#define GET_SUBMODEL_ARRAY(index) SharedMemory::getArray(se::PoolType::SUB_MODEL_ARRAY, index)
#define GET_PLANE_ARRAY(index)    (static_cast<uint32_t *>(0))

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

    static uint32_t *getArray(se::PoolType type, uint index) {
        return se::ArrayPool::getArray(type, index);
    }
};

} //namespace pipeline
} //namespace cc
