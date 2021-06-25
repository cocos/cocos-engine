/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
 
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
#include "renderer/gfx-base/GFXBuffer.h"
#include "renderer/gfx-base/GFXDef-common.h"
#include "scene/AABB.h"
#include "scene/Node.h"

namespace cc {
namespace scene {

enum class ModelType {
    DEFAULT,
    SKINNING,
    BAKED_SKINNING,
    BATCH_2D,
    PARTICLE_BATCH,
    LINE,
};

// SubModel.h -> Define.h -> Model.h, so do not include SubModel.h here.
class SubModel;

struct InstancedAttributeBlock {
    std::vector<uint8_t *> views{};
};

class Model {
public:
    Model()              = default;
    Model(const Model &) = delete;
    Model(Model &&)      = delete;
    virtual ~Model();
    Model &operator=(const Model &) = delete;
    Model &operator=(Model &&) = delete;

    virtual void updateTransform(uint32_t stamp);
    virtual void updateUBOs(uint32_t stamp);

    void addSubModel(SubModel *subModel);

    inline void setCastShadow(bool value) { _castShadow = value; }
    inline void setEnabled(bool value) { _enabled = value; }
    inline void setInstMatWorldIdx(int32_t idx) { _instMatWorldIdx = idx; }
    inline void setLocalBuffer(gfx::Buffer *buffer) { _localBuffer = buffer; }
    inline void setNode(Node *node) { _node = node; }
    inline void setReceiveShadow(bool value) { _receiveShadow = value; }
    inline void setTransform(Node *node) { _transform = node; }
    inline void seVisFlag(uint32_t flags) { _visFlags = flags; }
    inline void setWolrdBounds(const AABB &aabb) {
        if (!_worldBounds) {
            _worldBounds = new AABB();
        }
        *_worldBounds = aabb;
    }
    inline void setInstancedAttrBlock(uint8_t *buffer, uint32_t size, InstancedAttributeBlock &&block, const std::vector<gfx::Attribute> &attributes) {
        _instancedBuffer        = {buffer, size};
        _instanceAttributeBlock = std::move(block);
        _instanceAttributes     = attributes;
    }

    inline bool                               getCastShadow() const { return _castShadow; }
    inline bool                               getEnabled() const { return _enabled; }
    inline int32_t                            getInstMatWorldIdx() const { return _instMatWorldIdx; }
    inline const std::vector<gfx::Attribute> &getInstanceAttributes() const { return _instanceAttributes; }
    inline InstancedAttributeBlock *          getInstancedAttributeBlock() { return &_instanceAttributeBlock; }
    inline uint8_t *                          getInstancedBuffer() const { return std::get<0>(_instancedBuffer); }
    inline uint32_t                           getInstancedBufferSize() const { return std::get<1>(_instancedBuffer); }
    inline gfx::Buffer *                      getLocalBuffer() const { return _localBuffer; }
    inline float *                            getLocalData() const { return _localData; }
    inline const AABB &                       getModelBounds() const { return _modelBounds; }
    inline Node *                             getNode() const { return _node; }
    inline bool                               getReceiveShadow() const { return _receiveShadow; }
    inline const std::vector<SubModel *> &    getSubModels() const { return _subModels; }
    inline Node *                             getTransform() const { return _transform; }
    inline bool                               getTransformUpdated() const { return _transformUpdated; }
    inline int32_t                            getUpdatStamp() const { return _updateStamp; }
    inline uint32_t                           getVisFlags() const { return _visFlags; }
    inline const AABB *                       getWorldBounds() const { return _worldBounds; }
    inline ModelType                          getType() const { return _type; };

protected:
    ModelType _type{ModelType::DEFAULT};
    bool      _transformUpdated{false};
    AABB *    _worldBounds{nullptr};
    AABB      _modelBounds;

private:
    bool _enabled{false};
    bool _castShadow{false};
    bool _receiveShadow{false};

    int32_t                         _instMatWorldIdx{-1};
    uint32_t                        _visFlags;
    int32_t                         _updateStamp{-1};
    Node *                          _transform{nullptr};
    Node *                          _node{nullptr};
    float *                         _localData{nullptr};
    std::tuple<uint8_t *, uint32_t> _instancedBuffer{nullptr, 0};
    gfx::Buffer *                   _localBuffer{nullptr};
    InstancedAttributeBlock         _instanceAttributeBlock{};
    std::vector<SubModel *>         _subModels;
    std::vector<gfx::Attribute>     _instanceAttributes;
    static void                     uploadMat4AsVec4x3(const Mat4 &mat, float *v1, float *v2, float *v3);
};

} // namespace scene
} // namespace cc
