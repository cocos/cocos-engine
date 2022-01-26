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
#include <vector>
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
    Uint8Array                  buffer;
    std::vector<TypedArray>     views;
    std::vector<gfx::Attribute> attributes;
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
    ~Model() override = default;

    void                              initialize();
    virtual void                      destroy();
    void                              updateWorldBound();
    void                              updateWorldBoundsForJSSkinningModel(const Vec3 &min, const Vec3 &max);
    void                              updateWorldBoundsForJSBakedSkinningModel(geometry::AABB *aabb);
    void                              createBoundingShape(const cc::optional<Vec3> &minPos, const cc::optional<Vec3> &maxPos);
    virtual void                      initSubModel(index_t idx, RenderingSubMesh *subMeshData, Material *mat);
    void                              setSubModelMesh(index_t idx, RenderingSubMesh *subMesh) const;
    virtual void                      setSubModelMaterial(index_t idx, Material *mat);
    void                              onGlobalPipelineStateChanged() const;
    void                              onMacroPatchesStateChanged();
    void                              updateLightingmap(Texture2D *texture, const Vec4 &uvParam);
    virtual std::vector<IMacroPatch> &getMacroPatches(index_t subModelIndex);
    virtual void                      updateInstancedAttributes(const std::vector<gfx::Attribute> &attributes, Pass *pass);

    virtual void updateTransform(uint32_t stamp);
    virtual void updateUBOs(uint32_t stamp);
    void         updateWorldBoundUBOs();

    inline void attachToScene(RenderScene *scene) {
        _scene            = scene;
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
    inline void setTransform(Node *node) { _transform = node; }
    inline void setVisFlags(Layers::Enum flags) { _visFlags = flags; }
    inline void setBounds(geometry::AABB *world) {
        _worldBounds = world;
        _modelBounds->set(_worldBounds->getCenter(), _worldBounds->getHalfExtents());
    }
    inline void setInstancedAttributeBlock(const InstancedAttributeBlock &val) {
        _instanceAttributeBlock = val;
        _localDataUpdated       = true;
    }
    inline void setOctreeNode(OctreeNode *node) { _octreeNode = node; }
    inline void setScene(RenderScene *scene) {
        _scene = scene;
        if (scene) _localDataUpdated = true;
    }

    inline bool                                       isInited() const { return _inited; };
    inline bool                                       isCastShadow() const { return _castShadow; }
    inline bool                                       isEnabled() const { return _enabled; }
    inline bool                                       isInstancingEnabled() const { return _instMatWorldIdx >= 0; };
    inline int32_t                                    getInstMatWorldIdx() const { return _instMatWorldIdx; }
    inline const std::vector<gfx::Attribute> &        getInstanceAttributes() const { return _instanceAttributeBlock.attributes; }
    inline InstancedAttributeBlock *                  getInstancedAttributeBlock() { return &_instanceAttributeBlock; }
    inline const uint8_t *                            getInstancedBuffer() const { return _instanceAttributeBlock.buffer.buffer()->getData(); }
    inline uint32_t                                   getInstancedBufferSize() const { return _instanceAttributeBlock.buffer.length(); }
    inline gfx::Buffer *                              getLocalBuffer() const { return _localBuffer.get(); }
    inline gfx::Buffer *                              getWorldBoundBuffer() const { return _worldBoundBuffer.get(); }
    inline Float32Array                               getLocalData() const { return _localData; }
    inline geometry::AABB *                           getModelBounds() const { return _modelBounds; }
    inline Node *                                     getNode() const { return _node.get(); }
    inline bool                                       isReceiveShadow() const { return _receiveShadow; }
    inline const std::vector<IntrusivePtr<SubModel>> &getSubModels() const { return _subModels; }
    inline Node *                                     getTransform() const { return _transform.get(); }
    inline bool                                       isLocalDataUpdated() const { return _localDataUpdated; }
    inline uint32_t                                   getUpdateStamp() const { return _updateStamp; }
    inline Layers::Enum                               getVisFlags() const { return _visFlags; }
    inline geometry::AABB *                           getWorldBounds() const { return _worldBounds; }
    inline Type                                       getType() const { return _type; };
    inline void                                       setType(Type type) { _type = type; }
    inline OctreeNode *                               getOctreeNode() const { return _octreeNode; }
    inline RenderScene *                              getScene() const { return _scene; }
    inline void                                       setDynamicBatching(bool val) { _isDynamicBatching = val; }
    inline bool                                       isDynamicBatching() const { return _isDynamicBatching; }

    void initLocalDescriptors(index_t subModelIndex);
    void initWorldBoundDescriptors(index_t subModelIndex);

    virtual void updateLocalDescriptors(index_t subModelIndex, gfx::DescriptorSet *descriptorSet);
    virtual void updateWorldBoundDescriptors(index_t subModelIndex, gfx::DescriptorSet *descriptorSet);

    int32_t getInstancedAttributeIndex(const std::string &name) const;

    // For JS
    inline void              setCalledFromJS(bool v) { _isCalledFromJS = v; }
    inline CallbacksInvoker &getEventProcessor() { return _eventProcessor; }
    void                     setInstancedAttributesViewData(index_t viewIdx, index_t arrIdx, float value);
    inline void              setLocalDataUpdated(bool v) { _localDataUpdated = v; }
    inline void              setWorldBounds(geometry::AABB *bounds) { _worldBounds = bounds; }
    inline void              setModelBounds(geometry::AABB *bounds) { _modelBounds = bounds; }
    inline bool              isModelImplementedInJS() const { return (_type != Type::DEFAULT && _type != Type::SKINNING && _type != Type::BAKED_SKINNING); };

protected:
    static void uploadMat4AsVec4x3(const Mat4 &mat, Float32Array &v1, Float32Array &v2, Float32Array &v3);

    void updateAttributesAndBinding(index_t subModelIndex);

    static SubModel *createSubModel();

    Type                         _type{Type::DEFAULT};
    bool                         _localDataUpdated{false};
    IntrusivePtr<geometry::AABB> _worldBounds;
    IntrusivePtr<geometry::AABB> _modelBounds;
    OctreeNode *                 _octreeNode{nullptr};
    RenderScene *                _scene{nullptr};
    gfx::Device *                _device{nullptr};
    bool                         _inited{false};
    uint32_t                     _descriptorSetCount{1};

    bool _enabled{false};
    bool _castShadow{false};
    bool _receiveShadow{false};
    bool _isDynamicBatching{false};

    int32_t                             _instMatWorldIdx{-1};
    Layers::Enum                        _visFlags{Layers::Enum::NONE};
    uint32_t                            _updateStamp{0};
    IntrusivePtr<Node>                  _transform;
    IntrusivePtr<Node>                  _node;
    Float32Array                        _localData;
    std::tuple<uint8_t *, uint32_t>     _instancedBuffer{nullptr, 0};
    IntrusivePtr<gfx::Buffer>           _localBuffer;
    IntrusivePtr<gfx::Buffer>           _worldBoundBuffer;
    InstancedAttributeBlock             _instanceAttributeBlock{};
    std::vector<IntrusivePtr<SubModel>> _subModels;

    IntrusivePtr<Texture2D> _lightmap;
    Vec4                    _lightmapUVParam;

    std::vector<IMacroPatch> _macroPatches;

    // For JS
    CallbacksInvoker _eventProcessor;
    bool             _isCalledFromJS{false};
    //

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(Model);
};

} // namespace scene
} // namespace cc
