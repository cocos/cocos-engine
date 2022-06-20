#include <2d/renderer/Batcher2d.h>
#include <cocos/base/TypeDef.h>
#include <cocos/core/Root.h>
#include <renderer/pipeline/Define.h>
#include <scene/Pass.h>
#include <deque>
#include <iostream>

namespace cc {
Batcher2d::Batcher2d() : Batcher2d(nullptr) {
    _device = Root::getInstance()->getDevice();
}

Batcher2d::Batcher2d(Root* root) : _drawBatchPool([]() { return ccnew scene::DrawBatch2D(); }, 10U) {
    _root = root;
    _device = Root::getInstance()->getDevice();
}

Batcher2d::~Batcher2d() {
    _drawBatchPool.destroy();

    for (auto iter = _descriptorSetCache.begin(); iter != _descriptorSetCache.end(); iter++) {
        iter->second->destroy();
    }
    _descriptorSetCache.clear();
}

void Batcher2d::syncMeshBuffersToNative(std::vector<UIMeshBuffer*>&& buffers, uint32_t length) {
    _meshBuffers = std::move(buffers);
}

UIMeshBuffer* Batcher2d::getMeshBuffer(index_t bufferId) {
    assert(this->_meshBuffers[bufferId]);
    return this->_meshBuffers[bufferId];
}

gfx::Device* Batcher2d::getDevice() {
    if (_device == nullptr) {
        _device = Root::getInstance()->getDevice();
    }
    return _device;
}

void Batcher2d::updateDescriptorSet() {
    //for this._descriptorSetCache.update()
}

void Batcher2d::addRootNode(Node* node) {
    _rootNodeArr.push_back(node);
}

//对标ts的walk
void Batcher2d::fillBuffersAndMergeBatches() {
    for (index_t i = 0; i < _rootNodeArr.size(); i++) {
        walk(_rootNodeArr[i]);
        generateBatch(_currEntity);
    }
    _rootNodeArr.clear();
}

void Batcher2d::walk(Node* node) {
    static std::vector<Node*> nodeStack{1000000};
    nodeStack[0] = node;
    size_t length = 1;
    while (length > 0) {
        Node* curNode = nodeStack[--length];
        RenderEntity* entity = static_cast<RenderEntity*>(curNode->getUserData());
        if (entity) {
            // when filling buffers, we should distinguish commom components and other complex components like middlewares
            RenderDrawInfo* drawInfo = entity->getRenderDrawInfo();
            if (drawInfo && drawInfo->getEnabled()) {
                uint32_t dataHash = drawInfo->getDataHash();
                if (_currHash != dataHash || dataHash == 0 || _currMaterial != drawInfo->getMaterial()
                    /* || stencilmanager */) { //stencilStage for Mask component
                    // Generate a batch if not batching
                    generateBatch(_currEntity);
                    if (!drawInfo->getIsMeshBuffer()) {
                        if (_currBID != drawInfo->getBufferId()) {
                            UIMeshBuffer* buffer = drawInfo->getMeshBuffer();
                            _currBID = drawInfo->getBufferId();
                            _indexStart = buffer->getIndexOffset();
                        }
                    }

                    _currHash = dataHash;
                    _currMaterial = drawInfo->getMaterial();
                    // stencil stage
                    _currLayer = entity->getNode()->getLayer();
                    _currEntity = drawInfo;

                    //if(frame)
                    _currTexture = drawInfo->getTexture();
                    _currTextureHash = drawInfo->getTextureHash();
                    _currSampler = drawInfo->getSampler();
                    if (_currSampler == nullptr) {
                        _currSamplerHash = 0;
                    } else {
                        _currSamplerHash = _currSampler->getHash();
                    }
                }

                if (curNode->getChangedFlags() || drawInfo->getVertDirty()) {
                    fillVertexBuffers(entity, drawInfo);
                }
                fillIndexBuffers(drawInfo);
            }
        }

        auto& children = curNode->getChildren();
        for (index_t i = children.size() - 1; i >= 0; i--) {
            assert(length < 1000000);
            nodeStack[length++] = children[i];
        }
    }
}

void Batcher2d::generateBatch(RenderDrawInfo* entity) {

    if (entity == nullptr) {
        return;
    }
    //if (entity->getIsMeshBuffer()) {
    //    // Todo MeshBuffer RenderData
    //} else {
    UIMeshBuffer* currMeshBuffer = entity->getMeshBuffer();

    currMeshBuffer->setDirty(true);

    auto* ia = currMeshBuffer->requireFreeIA(getDevice());
    uint32_t indexCount = currMeshBuffer->getIndexOffset() - _indexStart;
    if (ia == nullptr) {
        return;
    }

    ia->setFirstIndex(_indexStart);
    ia->setIndexCount(indexCount);
    _indexStart = currMeshBuffer->getIndexOffset();
    //}

    this->_currBID = -1;

    //stencilstage

    // Todo blendState & stencil State
    auto* curdrawBatch = _drawBatchPool.alloc();
    curdrawBatch->setVisFlags(_currLayer);
    //curdrawBatch
    curdrawBatch->setInputAssembler(ia);
    curdrawBatch->setUseLocalFlag(nullptr); // todo usLocal
    curdrawBatch->fillPass(_currMaterial, nullptr, 0, nullptr, 0);
    auto& _pass = curdrawBatch->getPasses().at(0);

    curdrawBatch->setDescriptorSet(getDescriptorSet(_currTexture, _currSampler, _pass->getLocalSetLayout()));
    _batches.push_back(curdrawBatch);
}

void Batcher2d::resetRenderStates() {
    _currMaterial = new Material();
    _currTexture = nullptr;
    _currTextureHash = 0;
    _currSampler = nullptr;
    _currSamplerHash = 0;
    _currLayer = 0;
    _currEntity = nullptr;
}

gfx::DescriptorSet* Batcher2d::getDescriptorSet(gfx::Texture* texture, gfx::Sampler* sampler, gfx::DescriptorSetLayout* _dsLayout) {
    ccstd::hash_t hash = 2;
    if (texture != nullptr) {
        ccstd::hash_combine(hash, texture->getHash());
    }
    if (sampler != nullptr) {
        ccstd::hash_combine(hash, sampler->getHash());
    }
    auto iter = _descriptorSetCache.find(hash);
    if (iter != _descriptorSetCache.end()) {
        return iter->second;
    }
    _dsInfo.layout = _dsLayout;
    auto ds = getDevice()->createDescriptorSet(_dsInfo);

    ds->bindTexture(static_cast<uint>(pipeline::ModelLocalBindings::SAMPLER_SPRITE), texture);
    ds->bindSampler(static_cast<uint>(pipeline::ModelLocalBindings::SAMPLER_SPRITE), sampler);
    ds->update();

    _descriptorSetCache.emplace(hash, ds);

    return ds;
}

// update vertex code

bool Batcher2d::initialize() {
    return true;
}

void Batcher2d::update() {
    //updateVertDirtyRenderer();
    fillBuffersAndMergeBatches();
    resetRenderStates();

    for (const auto scene : Root::getInstance()->getScenes()) {
        for (const auto batch : _batches) {
            scene->addBatch(batch);
        }
    }
}

//void Batcher2d::updateVertDirtyRenderer() {
//    size_t size = _vertDirtyRenderers.size();
//    for (uint32_t i = 0; i < size; i++) {
//        RenderDrawInfo* drawInfo = _vertDirtyRenderers[i];
//
//        // @zhakesi if the comp is middleware，it should fill multi times
//        fillVertexBuffers(drawInfo);
//    }
//    _vertDirtyRenderers.clear();
//}

void Batcher2d::uploadBuffers() {
    if (_batches.size() > 0) {
        //_meshDataArray.forEach(),uploadBuffers

        for (index_t i = 0; i < _meshBuffers.size(); i++) {
            UIMeshBuffer* buffer = _meshBuffers[i];
            buffer->uploadBuffers();
            buffer->reset();
        }

        updateDescriptorSet();
    }
}

void Batcher2d::reset() {
    for (index_t i = 0; i < _batches.size(); i++) {
        scene::DrawBatch2D* batch = _batches[i];
        batch->clear();
        this->_drawBatchPool.free(batch);
    }

    //meshDataArray
    for (index_t i = 0; i < _meshBuffers.size(); i++) {
        UIMeshBuffer* buffer = _meshBuffers[i];
        if (buffer) {
            buffer->resetIA();
        }
    }

    _currBID = -1;
    _indexStart = 0;
    _currHash = 0;
    _currLayer = 0;
    _currMaterial = new Material();
    _currTexture = nullptr;
    _currSampler = nullptr;

    _batches.clear();

    //stencilManager
}

//void Batcher2d::addVertDirtyRenderer(RenderDrawInfo* drawInfo) {
//    _vertDirtyRenderers.push_back(drawInfo);
//}
} // namespace cc
