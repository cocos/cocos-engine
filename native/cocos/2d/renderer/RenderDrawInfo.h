/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once
#include "2d/renderer/UIMeshBuffer.h"
#include "base/Ptr.h"
#include "base/Macros.h"
#include "base/TypeDef.h"
#include "bindings/utils/BindingUtils.h"
#include "core/ArrayBuffer.h"
#include "core/assets/Material.h"
#include "core/scene-graph/Node.h"
#include "math/Color.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Vec4.h"
#include "renderer/gfx-base/states/GFXSampler.h"
#include "scene/Model.h"

namespace cc {
struct Render2dLayout {
    Vec3 position;
    Vec2 uv;
    Vec4 color;
};

enum class RenderDrawInfoType : uint8_t {
    COMP,
    MODEL,
    MIDDLEWARE,
    SUB_NODE,
};

struct LocalDSBF {
    gfx::DescriptorSet* ds;
    gfx::Buffer* uboBuf;
};

class Batcher2d;

class RenderDrawInfo final {
public:
    RenderDrawInfo();
    ~RenderDrawInfo();

    inline uint32_t getDrawInfoType() const { return static_cast<uint32_t>(_drawInfoAttrs._drawInfoType); }
    inline void setDrawInfoType(uint32_t type) {
        _drawInfoAttrs._drawInfoType = static_cast<RenderDrawInfoType>(type);
    }

    inline uint16_t getAccId() const { return _drawInfoAttrs._accId; }
    inline void setAccId(uint16_t id) {
        _drawInfoAttrs._accId = id;
    }

    inline uint16_t getBufferId() const { return _drawInfoAttrs._bufferId; }
    inline void setBufferId(uint16_t bufferId) {
        _drawInfoAttrs._bufferId = bufferId;
    }

    inline uint32_t getVertexOffset() const { return _drawInfoAttrs._vertexOffset; }
    inline void setVertexOffset(uint32_t vertexOffset) {
        _drawInfoAttrs._vertexOffset = vertexOffset;
    }

    inline uint32_t getIndexOffset() const { return _drawInfoAttrs._indexOffset; }
    inline void setIndexOffset(uint32_t indexOffset) {
        _drawInfoAttrs._indexOffset = indexOffset;
    }

    inline uint32_t getVbCount() const { return _drawInfoAttrs._vbCount; }
    inline void setVbCount(uint32_t vbCount) {
        _drawInfoAttrs._vbCount = vbCount;
    }

    inline uint32_t getIbCount() const { return _drawInfoAttrs._ibCount; }
    inline void setIbCount(uint32_t ibCount) {
        _drawInfoAttrs._ibCount = ibCount;
    }

    inline bool getVertDirty() const { return _drawInfoAttrs._vertDirty; }
    inline void setVertDirty(bool val) {
        _drawInfoAttrs._vertDirty = val;
    }

    inline ccstd::hash_t getDataHash() const { return _drawInfoAttrs._dataHash; }
    inline void setDataHash(ccstd::hash_t dataHash) {
        _drawInfoAttrs._dataHash = dataHash;
    }

    inline bool getIsMeshBuffer() const { return _drawInfoAttrs._isMeshBuffer; }
    inline void setIsMeshBuffer(bool isMeshBuffer) {
        _drawInfoAttrs._isMeshBuffer = isMeshBuffer;
    }

    inline uint8_t getStride() const { return _drawInfoAttrs._stride; }
    inline void setStride(uint8_t stride) {
        _drawInfoAttrs._stride = stride;
    }

    inline Material* getMaterial() const { return _material; }
    inline void setMaterial(Material* material) {
        _material = material;
    }

    inline void setMeshBuffer(UIMeshBuffer* meshBuffer) {
        _meshBuffer = meshBuffer;
    }
    inline UIMeshBuffer* getMeshBuffer() const {
        return _meshBuffer;
    }

    inline float* getVDataBuffer() const {
        return _vDataBuffer;
    }
    inline void setVDataBuffer(float* vDataBuffer) {
        _vDataBuffer = vDataBuffer;
    }
    inline uint16_t* getIDataBuffer() const {
        return _iDataBuffer;
    }

    inline void setIDataBuffer(uint16_t* iDataBuffer) {
        _iDataBuffer = iDataBuffer;
    }

    inline gfx::Texture* getTexture() const {
        return _texture;
    }

    inline void setTexture(gfx::Texture* texture) {
        _texture = texture;
    }

    inline gfx::Sampler* getSampler() const {
        return _sampler;
    }

    inline void setSampler(gfx::Sampler* sampler) {
        _sampler = sampler;
    }

    inline float* getVbBuffer() const {
        return _vbBuffer;
    }

    inline void setVbBuffer(float* vbBuffer) {
        _vbBuffer = vbBuffer;
    }

    inline uint16_t* getIbBuffer() const {
        return _ibBuffer;
    }

    inline void setIbBuffer(uint16_t* ibBuffer) {
        _ibBuffer = ibBuffer;
    }

    inline scene::Model* getModel() const {
        CC_ASSERT_EQ(_drawInfoAttrs._drawInfoType, RenderDrawInfoType::MODEL);
        return _model;
    }

    inline void setModel(scene::Model* model) {
        CC_ASSERT_EQ(_drawInfoAttrs._drawInfoType, RenderDrawInfoType::MODEL);
        if (_drawInfoAttrs._drawInfoType == RenderDrawInfoType::MODEL) {
            _model = model;
        }
    }

    inline Node* getSubNode() const {
        CC_ASSERT_EQ(_drawInfoAttrs._drawInfoType, RenderDrawInfoType::SUB_NODE);
        return _subNode;
    }
    inline void setSubNode(Node* node) {
        CC_ASSERT_EQ(_drawInfoAttrs._drawInfoType, RenderDrawInfoType::SUB_NODE);
        _subNode = node;
    }

    void changeMeshBuffer();

    inline RenderDrawInfoType getEnumDrawInfoType() const { return _drawInfoAttrs._drawInfoType; }

    inline void setRender2dBufferToNative(uint8_t* buffer) { // NOLINT(bugprone-easily-swappable-parameters)
        CC_ASSERT(_drawInfoAttrs._drawInfoType == RenderDrawInfoType::COMP && !_drawInfoAttrs._isMeshBuffer);
        _sharedBuffer = buffer;
    }

    inline Render2dLayout* getRender2dLayout(uint32_t dataOffset) const {
        CC_ASSERT(_drawInfoAttrs._drawInfoType == RenderDrawInfoType::COMP && !_drawInfoAttrs._isMeshBuffer);
        return reinterpret_cast<Render2dLayout*>(_sharedBuffer + dataOffset * sizeof(float));
    }

    inline se::Object* getAttrSharedBufferForJS() const { return _attrSharedBufferActor.getSharedArrayBufferObject(); }

    gfx::InputAssembler* requestIA(gfx::Device* device);
    void uploadBuffers();
    void resetMeshIA();

    inline gfx::DescriptorSet* getLocalDes() { return _localDSBF->ds; }
    void updateLocalDescriptorSet(Node* transform, const gfx::DescriptorSetLayout* dsLayout);

    inline void resetDrawInfo() {
        destroy();

        _drawInfoAttrs._bufferId = 0;
        _drawInfoAttrs._accId = 0;
        _drawInfoAttrs._vertexOffset = 0;
        _drawInfoAttrs._indexOffset = 0;
        _drawInfoAttrs._vbCount = 0;
        _drawInfoAttrs._ibCount = 0;
        _drawInfoAttrs._stride = 0;
        _drawInfoAttrs._dataHash = 0;
        _drawInfoAttrs._vertDirty = false;
        _drawInfoAttrs._isMeshBuffer = false;

        _vbBuffer = nullptr;
        _ibBuffer = nullptr;
        _vDataBuffer = nullptr;
        _iDataBuffer = nullptr;
        _material = nullptr;
        _texture = nullptr;
        _sampler = nullptr;
        _subNode = nullptr;
        _model = nullptr;
        _sharedBuffer = nullptr;
    }

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderDrawInfo);
    void destroy();

    gfx::InputAssembler* initIAInfo(gfx::Device* device);

    struct DrawInfoAttrs {
        RenderDrawInfoType _drawInfoType{RenderDrawInfoType::COMP};
        bool _vertDirty{false};
        bool _isMeshBuffer{false};
        uint8_t _stride{0};
        uint16_t _bufferId{0};
        uint16_t _accId{0};
        uint32_t _vertexOffset{0};
        uint32_t _indexOffset{0};
        uint32_t _vbCount{0};
        uint32_t _ibCount{0};
        ccstd::hash_t _dataHash{0};
    } _drawInfoAttrs{};

    bindings::NativeMemorySharedToScriptActor _attrSharedBufferActor;
    // weak reference
    Material* _material{nullptr};
    // weak reference
    float* _vDataBuffer{nullptr};
    // weak reference
    uint16_t* _iDataBuffer{nullptr};
    // weak reference
    UIMeshBuffer* _meshBuffer{nullptr};
    // weak reference
    gfx::Texture* _texture{nullptr};
    // weak reference
    gfx::Sampler* _sampler{nullptr};
    // weak reference
    float* _vbBuffer{nullptr};
    // weak reference
    uint16_t* _ibBuffer{nullptr};

    union {
        Node* _subNode{nullptr};
        scene::Model* _model;
        uint8_t* _sharedBuffer;
    };
    LocalDSBF* _localDSBF{nullptr};

    // ia
    IntrusivePtr<gfx::InputAssembler> _ia;
    IntrusivePtr<gfx::Buffer> _vb;
    IntrusivePtr<gfx::Buffer> _ib;
};
} // namespace cc
