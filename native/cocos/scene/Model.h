/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.
 
 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include <tuple>
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "core/TypedArray.h"
#include "core/assets/RenderingSubMesh.h"
#include "core/assets/Texture2D.h"
#include "core/builtin/BuiltinResMgr.h"
#include "core/event/CallbacksInvoker.h"
#include "core/geometry/AABB.h"
#include "core/scene-graph/Layers.h"
#include "core/scene-graph/Node.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "renderer/gfx-base/GFXDef-common.h"
#include "renderer/gfx-base/GFXTexture.h"
#include "scene/SubModel.h"

namespace cc {

class Material;

namespace scene {

// SubModel.h -> Define.h -> Model.h, so do not include SubModel.h here.
class SubModel;
// RenderScene.h <-> Model.h, so do not include RenderScene.h here.
class RenderScene;
class OctreeNode;
class Octree;
class Pass;
struct IMacroPatch;
struct InstancedAttributeBlock {
    Uint8Array buffer;
    ccstd::vector<TypedArray> views;
    ccstd::vector<gfx::Attribute> attributes;
};

class Model : public RefCounted {
public:
    friend class Skybox;

    enum class Type {
        DEFAULT,
        SKINNING,
        BAKED_SKINNING,
        BATCH_2D,
        PARTICLE_BATCH,
        LINE,
    };

    Model();
    ~Model() override;

    virtual void destroy();
    virtual void initSubModel(index_t idx, RenderingSubMesh *subMeshData, Material *mat);
    virtual ccstd::vector<IMacroPatch> getMacroPatches(index_t subModelIndex);
    virtual void setSubModelMaterial(index_t idx, Material *mat);
    virtual void updateInstancedAttributes(const ccstd::vector<gfx::Attribute> &attributes, Pass *pass);
    virtual void updateTransform(uint32_t stamp);
    virtual void updateUBOs(uint32_t stamp);
    virtual void updateLocalDescriptors(index_t subModelIndex, gfx::DescriptorSet *descriptorSet);
    virtual void updateWorldBoundDescriptors(index_t subModelIndex, gfx::DescriptorSet *descriptorSet);

    void createBoundingShape(const ccstd::optional<Vec3> &minPos, const ccstd::optional<Vec3> &maxPos);
    int32_t getInstancedAttributeIndex(const ccstd::string &name) const;
    void initialize();
    void initLightingmap(Texture2D *texture, const Vec4 &uvParam);
    void initLocalDescriptors(index_t subModelIndex);
    void initWorldBoundDescriptors(index_t subModelIndex);
    void onGlobalPipelineStateChanged() const;
    void onMacroPatchesStateChanged();
    void onGeometryChanged();
    void setSubModelMesh(index_t idx, RenderingSubMesh *subMesh) const;
    void setInstancedAttribute(const ccstd::string &name, const float *value, uint32_t byteLength);
    void updateWorldBound();
    void updateWorldBoundsForJSSkinningModel(const Vec3 &min, const Vec3 &max);
    void updateWorldBoundsForJSBakedSkinningModel(geometry::AABB *aabb);
    void updateLightingmap(Texture2D *texture, const Vec4 &uvParam);
    void updateOctree();
    void updateWorldBoundUBOs();
    void updateLocalShadowBias();

    inline void attachToScene(RenderScene *scene) {
        _scene = scene;
        _localDataUpdated = true;
    };
    inline void detachFromScene() { _scene = nullptr; };
    inline void setCastShadow(bool value) { _castShadow = value; }
    inline void setEnabled(bool value) { _enabled = value; }
    inline void setInstMatWorldIdx(int32_t idx) { _instMatWorldIdx = idx; }
    inline void setLocalBuffer(gfx::Buffer *buffer) { _localBuffer = buffer; }
    inline void setWorldBoundBuffer(gfx::Buffer *buffer) { _worldBoundBuffer = buffer; }

    inline void setNode(Node *node) { _node = node; }
    inline void setReceiveShadow(bool value) {
        _receiveShadow = value;
        onMacroPatchesStateChanged();
    }
    inline void setShadowBias(float bias) { _shadowBias = bias; }
    inline void setShadowNormalBias(float normalBias) { _shadowNormalBias = normalBias; }
    inline void setTransform(Node *node) { _transform = node; }
    inline void setVisFlags(Layers::Enum flags) { _visFlags = flags; }
    inline void setBounds(geometry::AABB *world) {
        _worldBounds = world;
        _modelBounds->set(_worldBounds->getCenter(), _worldBounds->getHalfExtents());
        _worldBoundsDirty = true;
    }
    inline void setInstancedAttributeBlock(const InstancedAttributeBlock &val) {
        _instanceAttributeBlock = val;
        _localDataUpdated = true;
    }
    inline void setOctreeNode(OctreeNode *node) { _octreeNode = node; }
    inline void setScene(RenderScene *scene) {
        _scene = scene;
        if (scene) _localDataUpdated = true;
    }

    inline bool isInited() const { return _inited; };
    inline bool isCastShadow() const { return _castShadow; }
    inline bool isEnabled() const { return _enabled; }
    inline bool isInstancingEnabled() const { return _instMatWorldIdx >= 0; };
    inline int32_t getInstMatWorldIdx() const { return _instMatWorldIdx; }
    inline const ccstd::vector<gfx::Attribute> &getInstanceAttributes() const { return _instanceAttributeBlock.attributes; }
    inline InstancedAttributeBlock &getInstancedAttributeBlock() { return _instanceAttributeBlock; }
    inline const uint8_t *getInstancedBuffer() const { return _instanceAttributeBlock.buffer.buffer()->getData(); }
    inline uint32_t getInstancedBufferSize() const { return _instanceAttributeBlock.buffer.length(); }
    inline gfx::Buffer *getLocalBuffer() const { return _localBuffer.get(); }
    inline gfx::Buffer *getWorldBoundBuffer() const { return _worldBoundBuffer.get(); }
    inline Float32Array getLocalData() const { return _localData; }
    inline geometry::AABB *getModelBounds() const { return _modelBounds; }
    inline Node *getNode() const { return _node.get(); }
    inline bool isReceiveShadow() const { return _receiveShadow; }
    inline const ccstd::vector<IntrusivePtr<SubModel>> &getSubModels() const { return _subModels; }
    inline Node *getTransform() const { return _transform.get(); }
    inline bool isLocalDataUpdated() const { return _localDataUpdated; }
    inline uint32_t getUpdateStamp() const { return _updateStamp; }
    inline Layers::Enum getVisFlags() const { return _visFlags; }
    inline geometry::AABB *getWorldBounds() const { return _worldBounds; }
    inline Type getType() const { return _type; };
    inline void setType(Type type) { _type = type; }
    inline OctreeNode *getOctreeNode() const { return _octreeNode; }
    inline RenderScene *getScene() const { return _scene; }
    inline void setDynamicBatching(bool val) { _isDynamicBatching = val; }
    inline bool isDynamicBatching() const { return _isDynamicBatching; }
    inline float getShadowBias() const { return _shadowBias; }
    inline float getShadowNormalBias() const { return _shadowNormalBias; }
    inline uint32_t getPriority() const { return _priority; }
    inline void setPriority(uint32_t value) { _priority = value; }

    // For JS
    inline void setCalledFromJS(bool v) { _isCalledFromJS = v; }
    inline CallbacksInvoker &getEventProcessor() { return _eventProcessor; }
    void setInstancedAttributesViewData(index_t viewIdx, index_t arrIdx, float value);
    inline void setLocalDataUpdated(bool v) { _localDataUpdated = v; }
    inline void setWorldBounds(geometry::AABB *bounds) {
        _worldBounds = bounds;
        _worldBoundsDirty = true;
    }
    inline void setModelBounds(geometry::AABB *bounds) { _modelBounds = bounds; }
    inline bool isModelImplementedInJS() const { return (_type != Type::DEFAULT && _type != Type::SKINNING && _type != Type::BAKED_SKINNING); };

protected:
    static SubModel *createSubModel();
    static void uploadMat4AsVec4x3(const Mat4 &mat, Float32Array &v1, Float32Array &v2, Float32Array &v3);
    void updateAttributesAndBinding(index_t subModelIndex);

    // Please declare variables in descending order of memory size occupied by variables.

    InstancedAttributeBlock _instanceAttributeBlock;
    Float32Array _localData;
    ccstd::vector<IntrusivePtr<SubModel>> _subModels;
    std::tuple<uint8_t *, uint32_t> _instancedBuffer{nullptr, 0};

    // For JS
    CallbacksInvoker _eventProcessor;

    Vec4 _lightmapUVParam;
    float _shadowBias{0.0F};
    float _shadowNormalBias{0.0F};

    OctreeNode *_octreeNode{nullptr};
    RenderScene *_scene{nullptr};
    gfx::Device *_device{nullptr};

    IntrusivePtr<Node> _transform;
    IntrusivePtr<Node> _node;
    IntrusivePtr<gfx::Buffer> _localBuffer;
    IntrusivePtr<gfx::Buffer> _worldBoundBuffer;
    IntrusivePtr<geometry::AABB> _worldBounds;
    IntrusivePtr<geometry::AABB> _modelBounds;
    IntrusivePtr<Texture2D> _lightmap;

    Type _type{Type::DEFAULT};
    Layers::Enum _visFlags{Layers::Enum::NONE};

    uint32_t _descriptorSetCount{1};
    uint32_t _priority{0};
    uint32_t _updateStamp{0};
    int32_t _instMatWorldIdx{-1};

    bool _enabled{false};
    bool _castShadow{false};
    bool _receiveShadow{false};
    bool _isDynamicBatching{false};
    bool _inited{false};
    bool _localDataUpdated{false};
    bool _worldBoundsDirty{true};
    // For JS
    bool _isCalledFromJS{false};

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(Model);
};

} // namespace scene
} // namespace cc
