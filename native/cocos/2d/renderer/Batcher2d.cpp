#include <2d/renderer/Batcher2d.h>
#include <cocos/base/TypeDef.h>
#include <cocos/core/Root.h>
#include <renderer/pipeline/Define.h>
#include <scene/Pass.h>
#include <deque>
#include <iostream>
#include "application/ApplicationManager.h"

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

void Batcher2d::syncMeshBuffersToNative(uint32_t accId, std::vector<UIMeshBuffer*>&& buffers, uint32_t length) {
    _meshBuffersMap[accId] = std::move(buffers);
}

UIMeshBuffer* Batcher2d::getMeshBuffer(uint32_t accId, uint32_t bufferId) {
    auto map = _meshBuffersMap[accId];
    return map[bufferId];
}

gfx::Device* Batcher2d::getDevice() {
    if (_device == nullptr) {
        _device = Root::getInstance()->getDevice();
    }
    return _device;
}

void Batcher2d::updateDescriptorSet() {
    // for this._descriptorSetCache.update()
}

void Batcher2d::addRootNode(Node* node) {
    _rootNodeArr.push_back(node);
}

//对标ts的walk
void Batcher2d::fillBuffersAndMergeBatches() {
    for (uint32_t i = 0; i < _rootNodeArr.size(); i++) {
        walk(_rootNodeArr[i]);
        generateBatch(_currEntity, _currDrawInfo);
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
        if (entity && entity->getEnabled()) {
            RenderEntityType entityType = entity->getRenderEntityType();

            // when filling buffers, we should distinguish commom components and other complex components like middlewares
            if (entityType == RenderEntityType::STATIC) {
                std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY>& drawInfos = entity->getStaticRenderDrawInfos();
                for (uint32_t i = 0; i < entity->getStaticDrawInfoSize(); i++) {
                    handleStaticDrawInfo(entity, &(drawInfos[i]), curNode);
                }
            } else if (entityType == RenderEntityType::DYNAMIC) {
                ccstd::vector<RenderDrawInfo*>& drawInfos = entity->getDynamicRenderDrawInfos();
                for (uint32_t i = 0; i < drawInfos.size(); i++) {
                    handleDynamicDrawInfo(entity, drawInfos[i], curNode);
                }
            }
        }

        auto& children = curNode->getChildren();
        for (index_t i = children.size() - 1; i >= 0; i--) {
            assert(length < 1000000);
            nodeStack[length++] = children[i];

            if (entity) {
                children[i]->setParentOpacity(entity->getOpacity());
            }
        }
    }
}

void Batcher2d::handleStaticDrawInfo(RenderEntity* entity, RenderDrawInfo* drawInfo, Node* curNode) {
    if (drawInfo) {
        // commit Comp 的 meshBuffer 分支
        uint32_t dataHash = drawInfo->getDataHash();
        if (drawInfo->getIsMeshBuffer()) {
            dataHash = 0;
        }

        entity->setEnumStencilStage(StencilManager::getInstance()->getStencilStage());
        StencilStage tempStage = static_cast<StencilStage>(entity->getStencilStage());

        if (_currHash != dataHash || dataHash == 0 || _currMaterial != drawInfo->getMaterial() || _currTexture != drawInfo->getTexture() || _currStencilStage != tempStage) {
            // Generate a batch if not batching
            generateBatch(_currEntity, _currDrawInfo);
            if (!drawInfo->getIsMeshBuffer()) {
                UIMeshBuffer* buffer = drawInfo->getMeshBuffer();
                if (_currMeshBuffer != buffer) {
                    _currMeshBuffer = buffer;
                    _indexStart = _currMeshBuffer->getIndexOffset();
                }
            }

            _currHash = dataHash;
            _currMaterial = drawInfo->getMaterial();
            _currStencilStage = tempStage;
            _currLayer = entity->getNode()->getLayer();
            _currEntity = entity;
            _currDrawInfo = drawInfo;

            // if(frame)
            _currTexture = drawInfo->getTexture();
            _currTextureHash = drawInfo->getTextureHash();
            _currSampler = drawInfo->getSampler();
            if (_currSampler == nullptr) {
                _currSamplerHash = 0;
            } else {
                _currSamplerHash = _currSampler->getHash();
            }
        }

        if (!drawInfo->getIsMeshBuffer()) {
            if (curNode->getChangedFlags() || drawInfo->getVertDirty()) {
                fillVertexBuffers(entity, drawInfo);
                drawInfo->setVertDirty(false);
            }
            handleColor(entity, drawInfo, curNode);
            fillIndexBuffers(drawInfo);
        }
    }
}

void Batcher2d::handleDynamicDrawInfo(RenderEntity* entity, RenderDrawInfo* drawInfo, Node* curNode) {
    if (!entity || !drawInfo) {
        return;
    }
    // CommitModel
    if (drawInfo->getIsMeshBuffer()) {
        generateBatch(_currEntity, _currDrawInfo);
        resetRenderStates();

        // stencil stage
        Material* commitModelMat = entity->getCommitModelMaterial();
        if (commitModelMat) {
            StencilStage entityStage = entity->getEnumStencilStage();
            if (entityStage == StencilStage::ENABLED || entityStage == StencilStage::DISABLED) {
                entity->setEnumStencilStage(StencilManager::getInstance()->getStencilStage());
            }
            gfx::DepthStencilState* depthStencil;
            uint32_t dssHash = 0;
            depthStencil = StencilManager::getInstance()->getDepthStencilState(entityStage, commitModelMat);
            dssHash = StencilManager::getInstance()->getStencilHash(entityStage);
        }

        auto model = drawInfo->getModel();
        if (model == nullptr) return;
        // need stamp
        auto stamp = CC_CURRENT_ENGINE()->getTotalFrames();
        model->updateTransform(stamp);
        model->updateUBOs(stamp);

        auto subModelList = model->getSubModels();
        for (size_t i = 0; i < subModelList.size(); i++) {
            auto* curdrawBatch = _drawBatchPool.alloc();
            auto submodel = subModelList[i];
            curdrawBatch->setVisFlags(entity->getNode()->getLayer());
            curdrawBatch->setModel(model);
            curdrawBatch->setInputAssembler(submodel->getInputAssembler());
            curdrawBatch->setDescriptorSet(submodel->getDescriptorSet());
            curdrawBatch->setUseLocalFlag(nullptr);

            curdrawBatch->fillPass(drawInfo->getMaterial(), nullptr, 0, nullptr, 0, &(submodel->getPatches()));
            _batches.push_back(curdrawBatch);
        }
    }
}

void Batcher2d::handleColor(RenderEntity* entity, RenderDrawInfo* drawInfo, Node* node) {
    if (entity->getColorDirty()) {
        float_t parentOpacity = node->getParentOpacity();
        float_t localOpacity = entity->getLocalOpacity();
        float_t localColorAlpha = entity->getColorAlpha();
        entity->setOpacity(parentOpacity * localOpacity * localColorAlpha);
        fillColors(entity, drawInfo);
        entity->setColorDirty(false);
    }
}

void Batcher2d::generateBatch(RenderEntity* entity, RenderDrawInfo* drawInfo) {
    if (drawInfo == nullptr) {
        return;
    }

    gfx::InputAssembler* ia = nullptr;
    if (drawInfo->getIsMeshBuffer()) {
        // Todo MeshBuffer RenderData
        ia = drawInfo->requestIA(getDevice());
        meshRenderDrawInfo.emplace_back(drawInfo);
    } else {
        UIMeshBuffer* currMeshBuffer = drawInfo->getMeshBuffer();

        currMeshBuffer->setDirty(true);

        ia = currMeshBuffer->requireFreeIA(getDevice());
        uint32_t indexCount = currMeshBuffer->getIndexOffset() - _indexStart;
        if (ia == nullptr) {
            return;
        }

        ia->setFirstIndex(_indexStart);
        ia->setIndexCount(indexCount);
        _indexStart = currMeshBuffer->getIndexOffset();
    }

    _currMeshBuffer = nullptr;

    // stencilstage
    gfx::DepthStencilState* depthStencil;
    uint32_t dssHash = 0;
    StencilStage entityStage = entity->getEnumStencilStage();
    if (entity->getCustomMaterial() != nullptr) {
        depthStencil = StencilManager::getInstance()->getDepthStencilState(entityStage, _currMaterial);
    } else {
        depthStencil = StencilManager::getInstance()->getDepthStencilState(entityStage);
    }
    dssHash = StencilManager::getInstance()->getStencilHash(entityStage);

    auto* curdrawBatch = _drawBatchPool.alloc();
    curdrawBatch->setVisFlags(_currLayer);
    curdrawBatch->setInputAssembler(ia);
    curdrawBatch->setUseLocalFlag(nullptr); // todo usLocal
    curdrawBatch->fillPass(_currMaterial, nullptr, 0, nullptr, 0);
    auto& _pass = curdrawBatch->getPasses().at(0);

    curdrawBatch->setDescriptorSet(getDescriptorSet(_currTexture, _currSampler, _pass->getLocalSetLayout()));
    _batches.push_back(curdrawBatch);
}

void Batcher2d::resetRenderStates() {
    _currMaterial = nullptr;
    _currTexture = nullptr;
    _currTextureHash = 0;
    _currSampler = nullptr;
    _currSamplerHash = 0;
    _currLayer = 0;
    _currEntity = nullptr;
    _currDrawInfo = nullptr;
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
    // updateVertDirtyRenderer();
    fillBuffersAndMergeBatches();
    resetRenderStates();

    for (const auto scene : Root::getInstance()->getScenes()) {
        for (const auto batch : _batches) {
            scene->addBatch(batch);
        }
    }
}

// void Batcher2d::updateVertDirtyRenderer() {
//     size_t size = _vertDirtyRenderers.size();
//     for (uint32_t i = 0; i < size; i++) {
//         RenderDrawInfo* drawInfo = _vertDirtyRenderers[i];
//
//         // @zhakesi if the comp is middleware，it should fill multi times
//         fillVertexBuffers(drawInfo);
//     }
//     _vertDirtyRenderers.clear();
// }

void Batcher2d::uploadBuffers() {
    if (_batches.size() > 0) {
        //_meshDataArray.forEach(),uploadBuffers
        for (uint32_t i = 0; i < meshRenderDrawInfo.size(); i++) {
            RenderDrawInfo* meshRenderData = meshRenderDrawInfo[i];
            meshRenderData->uploadBuffers();
        }

        for (auto& map : _meshBuffersMap) {
            for (auto& buffer : map.second) {
                buffer->uploadBuffers();
                buffer->reset();
            }
        }
        updateDescriptorSet();
    }
}

void Batcher2d::reset() {
    for (uint32_t i = 0; i < _batches.size(); i++) {
        scene::DrawBatch2D* batch = _batches[i];
        batch->clear();
        this->_drawBatchPool.free(batch);
    }

    for (uint32_t i = 0; i < meshRenderDrawInfo.size(); i++) {
        RenderDrawInfo* meshRenderData = meshRenderDrawInfo[i];
        meshRenderData->resetMeshIA();
    }
    meshRenderDrawInfo.clear();

    // meshDataArray
    for (auto& map : _meshBuffersMap) {
        for (auto& buffer : map.second) {
            if (buffer) {
                buffer->resetIA();
            }
        }
    }

    _currMeshBuffer = nullptr;
    _indexStart = 0;
    _currHash = 0;
    _currLayer = 0;
    _currMaterial = nullptr;
    _currTexture = nullptr;
    _currSampler = nullptr;

    _batches.clear();

    // stencilManager
}

// void Batcher2d::addVertDirtyRenderer(RenderDrawInfo* drawInfo) {
//     _vertDirtyRenderers.push_back(drawInfo);
// }
} // namespace cc
