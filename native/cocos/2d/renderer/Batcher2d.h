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
#include "2d/renderer/RenderDrawInfo.h"
#include "2d/renderer/RenderEntity.h"
#include "2d/renderer/UIMeshBuffer.h"
#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/TypeDef.h"
#include "core/assets/Material.h"
#include "core/memop/Pool.h"
#include "renderer/gfx-base/GFXTexture.h"
#include "renderer/gfx-base/states/GFXSampler.h"
#include "scene/DrawBatch2D.h"

namespace cc {
class Root;
using UIMeshBufferArray = ccstd::vector<UIMeshBuffer*>;
using UIMeshBufferMap = ccstd::unordered_map<uint16_t, UIMeshBufferArray>;

struct RecordedRendererInfo {
    RenderEntity *renderEntity{nullptr};
};

class Batcher2d final {
public:
    static void setSorting2DCount(int32_t v);
    
    Batcher2d();
    explicit Batcher2d(Root* root);
    ~Batcher2d();

    void syncMeshBuffersToNative(uint16_t accId, ccstd::vector<UIMeshBuffer*>&& buffers);

    bool initialize();
    void update();
    void uploadBuffers();
    void reset();

    void syncRootNodesToNative(ccstd::vector<Node*>&& rootNodes);
    void releaseDescriptorSetCache(gfx::Texture* texture, gfx::Sampler* sampler);

    UIMeshBuffer* getMeshBuffer(uint16_t accId, uint16_t bufferId);
    gfx::Device* getDevice();
    inline ccstd::vector<gfx::Attribute>* getDefaultAttribute() { return &_attributes; }

    void updateDescriptorSet();

    void fillBuffersAndMergeBatches();
    void walk(Node* node, float parentOpacity, bool parentColorDirty);
    void handlePostRender(RenderEntity* entity);
    void handleDrawInfo(RenderEntity* entity, RenderDrawInfo* drawInfo, Node* node);
    void handleComponentDraw(RenderEntity* entity, RenderDrawInfo* drawInfo, Node* node);
    void handleModelDraw(RenderEntity* entity, RenderDrawInfo* drawInfo);
    void handleMiddlewareDraw(RenderEntity* entity, RenderDrawInfo* drawInfo);
    void handleSubNode(RenderEntity* entity, RenderDrawInfo* drawInfo);
    void generateBatch(RenderEntity* entity, RenderDrawInfo* drawInfo);
    void generateBatchForMiddleware(RenderEntity* entity, RenderDrawInfo* drawInfo);
    void resetRenderStates();

private:
    bool _isInit = false;

    void insertMaskBatch(RenderEntity* entity);
    void createClearModel();

    gfx::DescriptorSet* getDescriptorSet(gfx::Texture* texture, gfx::Sampler* sampler, const gfx::DescriptorSetLayout* dsLayout);
    
    ccstd::vector<RecordedRendererInfo> &getRecordedRendererInfoQueue();
    void handleUIRenderer(RenderEntity *entity);
    int32_t recordUIRenderer(RenderEntity *entity);
    void flushRecordedUIRenderers();

    StencilManager* _stencilManager{nullptr};

    // weak reference
    Root* _root{nullptr};
    // weak reference
    ccstd::vector<Node*> _rootNodeArr;

    // manage memory manually
    ccstd::vector<scene::DrawBatch2D*> _batches;
    memop::Pool<scene::DrawBatch2D> _drawBatchPool;
    
    ccstd::vector<RecordedRendererInfo> _recordedRendererInfoQueue;

    // weak reference
    gfx::Device* _device{nullptr}; // use getDevice()

    // weak reference
    RenderEntity* _currEntity{nullptr};
    // weak reference
    RenderDrawInfo* _currDrawInfo{nullptr};
    // weak reference
    UIMeshBuffer* _currMeshBuffer{nullptr};
    uint32_t _indexStart{0};
    uint32_t _currMiddlewareIbCount{0};
    ccstd::hash_t _currHash{0};
    uint32_t _currLayer{0};
    StencilStage _currStencilStage{StencilStage::DISABLED};

    // weak reference
    Material* _currMaterial{nullptr};
    // weak reference
    gfx::Texture* _currTexture{nullptr};
    // weak reference
    gfx::Sampler* _currSampler{nullptr};
    ccstd::hash_t _currSamplerHash{0};

    // weak reference
    ccstd::vector<RenderDrawInfo*> _meshRenderDrawInfo;

    // manage memory manually
    ccstd::unordered_map<ccstd::hash_t, gfx::DescriptorSet*> _descriptorSetCache;
    gfx::DescriptorSetInfo _dsInfo;

    UIMeshBufferMap _meshBuffersMap;

    // DefaultAttribute
    ccstd::vector<gfx::Attribute> _attributes{
        gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
        gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
        gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA32F},
    };

    // Mask use
    IntrusivePtr<scene::Model> _maskClearModel;
    IntrusivePtr<Material> _maskClearMtl;
    IntrusivePtr<RenderingSubMesh> _maskModelMesh;
    ccstd::vector<gfx::Attribute> _maskAttributes{
        gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
    };
    gfx::PrimitiveMode _primitiveMode{gfx::PrimitiveMode::TRIANGLE_LIST};

    CC_DISALLOW_COPY_MOVE_ASSIGN(Batcher2d);
};
} // namespace cc
