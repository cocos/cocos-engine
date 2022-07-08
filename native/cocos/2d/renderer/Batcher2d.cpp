/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "2d/renderer/Batcher2d.h"
#include "application/ApplicationManager.h"
#include "base/TypeDef.h"
#include "core/Root.h"
#include "renderer/pipeline/Define.h"
#include "scene/Pass.h"

namespace cc {
Batcher2d::Batcher2d() : Batcher2d(nullptr) {
    _device = Root::getInstance()->getDevice();
    _stencilManager = StencilManager::getInstance();
}

Batcher2d::Batcher2d(Root* root) : _drawBatchPool([]() { return ccnew scene::DrawBatch2D(); }, 10U) {
    _root = root;
    _device = Root::getInstance()->getDevice();
    _stencilManager = StencilManager::getInstance();
}

Batcher2d::~Batcher2d() {
    _drawBatchPool.destroy();

    for (auto iter : _descriptorSetCache) {
        delete iter.second;
    }

    for (auto* drawBatch : _batches) {
        delete drawBatch;
    }
}

void Batcher2d::syncMeshBuffersToNative(uint32_t accId, ccstd::vector<UIMeshBuffer*>&& buffers) {
    _meshBuffersMap[accId] = std::move(buffers);
}

UIMeshBuffer* Batcher2d::getMeshBuffer(uint32_t accId, uint32_t bufferId) { // NOLINT(bugprone-easily-swappable-parameters)
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
}

void Batcher2d::addRootNode(Node* node) {
    _rootNodeArr.push_back(node);
}

void Batcher2d::fillBuffersAndMergeBatches() {
    for (auto* rootNode : _rootNodeArr) {
        walk(rootNode);
        generateBatch(_currEntity, _currDrawInfo);
    }
    _rootNodeArr.clear();
}

void Batcher2d::walk(Node* node) { // NOLINT(misc-no-recursion)
    if (!node->isActiveInHierarchy()) {
        return;
    }

    auto* entity = static_cast<RenderEntity*>(node->getUserData());
    if (entity && entity->isEnabled()) {
        RenderEntityType entityType = entity->getRenderEntityType();

        // when filling buffers, we should distinguish common components and other complex components like middleware
        if (entityType == RenderEntityType::STATIC) {
            std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY>& drawInfos = entity->getStaticRenderDrawInfos();
            for (uint32_t i = 0; i < entity->getStaticDrawInfoSize(); i++) {
                handleStaticDrawInfo(entity, &(drawInfos[i]), node);
            }
        } else if (entityType == RenderEntityType::DYNAMIC) {
            ccstd::vector<RenderDrawInfo*>& drawInfos = entity->getDynamicRenderDrawInfos();
            for (auto* drawInfo : drawInfos) {
                handleDynamicDrawInfo(entity, drawInfo);
            }
        }
    }

    const auto& children = node->getChildren();
    for (const auto& child : children) {
        if (entity) {
            child->setParentOpacity(entity->getOpacity());
        }
        walk(child);
    }

    // post assembler
    if (_stencilManager->getMaskStackSize() > 0 && entity && entity->isEnabled()) {
        handlePostRender(entity);
    }
}

void Batcher2d::handlePostRender(RenderEntity* entity) {
    bool isMask = entity->getIsMask();
    bool isSubMask = entity->getIsSubMask();
    if (isMask) {
        //generate batch
        generateBatch(_currEntity, _currDrawInfo);
        resetRenderStates();

        _stencilManager->exitMask();
    } else if (isSubMask) {
        _stencilManager->enableMask();
    }
}

void Batcher2d::handleStaticDrawInfo(RenderEntity* entity, RenderDrawInfo* drawInfo, Node* curNode) {
    if (drawInfo) {
        ccstd::hash_t dataHash = drawInfo->getDataHash();
        if (drawInfo->getIsMeshBuffer()) {
            dataHash = 0;
        }

        entity->setEnumStencilStage(_stencilManager->getStencilStage());
        auto tempStage = static_cast<StencilStage>(entity->getStencilStage());

        if (_currHash != dataHash || dataHash == 0 || _currMaterial != drawInfo->getMaterial() || _currStencilStage != tempStage) {
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

void Batcher2d::handleDynamicDrawInfo(RenderEntity* entity, RenderDrawInfo* drawInfo) {
    if (!entity || !drawInfo) {
        return;
    }
    // CommitModel
    if (drawInfo->getIsMeshBuffer()) {
        generateBatch(_currEntity, _currDrawInfo);
        resetRenderStates();

        // stencil stage
        gfx::DepthStencilState* depthStencil = nullptr;
        ccstd::hash_t dssHash = 0;
        Material* commitModelMat = entity->getCommitModelMaterial();
        Material* finalMat = drawInfo->getMaterial();

        bool isMask = entity->getIsMask();
        bool isSubMask = entity->getIsSubMask();
        bool isMaskInverted = entity->getIsMaskInverted();
        if (isMask) {
            //Mask node
            _stencilManager->pushMask();
            _stencilManager->clear(entity);
            finalMat = commitModelMat;

        } else if (isSubMask) {
            //Mask graphics
            _stencilManager->enterLevel(entity);

        } else {
            //other comps
        }
        _currStencilStage = _stencilManager->getStencilStage();

        if (commitModelMat) {
            StencilStage entityStage = entity->getEnumStencilStage();
            if (entityStage == StencilStage::ENABLED || entityStage == StencilStage::DISABLED) {
                entity->setEnumStencilStage(_stencilManager->getStencilStage());
            }
            depthStencil = _stencilManager->getDepthStencilState(entityStage, commitModelMat);
            dssHash = _stencilManager->getStencilHash(entityStage);
        }

        // Model
        auto* model = drawInfo->getModel();
        if (model == nullptr) return;
        auto stamp = CC_CURRENT_ENGINE()->getTotalFrames();
        model->updateTransform(stamp);
        model->updateUBOs(stamp);

        const auto& subModelList = model->getSubModels();
        for (const auto& submodel : subModelList) {
            auto* curdrawBatch = _drawBatchPool.alloc();
            curdrawBatch->setVisFlags(entity->getNode()->getLayer());
            curdrawBatch->setModel(model);
            curdrawBatch->setInputAssembler(submodel->getInputAssembler());
            curdrawBatch->setDescriptorSet(submodel->getDescriptorSet());
            curdrawBatch->setUseLocalFlag(nullptr);

            curdrawBatch->fillPass(finalMat, depthStencil, dssHash, nullptr, 0, &(submodel->getPatches()));
            _batches.push_back(curdrawBatch);
        }
    } else {
        generateBatch(_currEntity, _currDrawInfo);
        uint32_t dataHash = drawInfo->getDataHash();
        entity->setEnumStencilStage(_stencilManager->getStencilStage());
        StencilStage tempStage = static_cast<StencilStage>(entity->getStencilStage());
        _currHash = dataHash;
        _currMaterial = drawInfo->getMaterial();
        _currStencilStage = tempStage;
        _currLayer = entity->getNode()->getLayer();

        // make sure next generateBatch return.
        _currEntity = nullptr;
        _currDrawInfo = nullptr;
        _currMeshBuffer = nullptr;

        // if(frame)
        _currTexture = drawInfo->getTexture();
        _currTextureHash = drawInfo->getTextureHash();
        _currSampler = drawInfo->getSampler();
        _currSamplerHash = _currSampler->getHash();
        setIndexRange(drawInfo);

        UIMeshBuffer* currMeshBuffer = drawInfo->getMeshBuffer();
        currMeshBuffer->setDirty(true);
        gfx::InputAssembler* ia = currMeshBuffer->requireFreeIA(getDevice());
        ia->setFirstIndex(drawInfo->getIndexOffset());
        ia->setIndexCount(drawInfo->getIbCount());

        // stencilstage
        gfx::DepthStencilState* depthStencil = nullptr;
        ccstd::hash_t dssHash = 0;
        StencilStage entityStage = entity->getEnumStencilStage();
        if (entity->getCustomMaterial() != nullptr) {
            depthStencil = _stencilManager->getDepthStencilState(entityStage, _currMaterial);
        } else {
            depthStencil = _stencilManager->getDepthStencilState(entityStage);
        }
        dssHash = _stencilManager->getStencilHash(entityStage);

        auto* curdrawBatch = _drawBatchPool.alloc();
        curdrawBatch->setVisFlags(_currLayer);
        curdrawBatch->setInputAssembler(ia);
        curdrawBatch->setUseLocalFlag(nullptr); // todo usLocal
        curdrawBatch->fillPass(_currMaterial, depthStencil, dssHash, nullptr, 0);
        const auto& pass = curdrawBatch->getPasses().at(0);

        curdrawBatch->setDescriptorSet(getDescriptorSet(_currTexture, _currSampler, pass->getLocalSetLayout()));
        _batches.push_back(curdrawBatch);
    }
}

void Batcher2d::handleColor(RenderEntity* entity, RenderDrawInfo* drawInfo, Node* node) {
    if (entity->getColorDirty()) {
        float parentOpacity = node->getParentOpacity();
        float localOpacity = entity->getLocalOpacity();
        float localColorAlpha = entity->getColorAlpha();
        entity->setOpacity(parentOpacity * localOpacity * localColorAlpha);
        fillColors(entity, drawInfo);
        entity->setColorDirty(false);
    }
}

void Batcher2d::generateBatch(RenderEntity* entity, RenderDrawInfo* drawInfo) {
    if (drawInfo == nullptr || _currMaterial == nullptr) {
        return;
    }

    gfx::InputAssembler* ia = nullptr;
    if (drawInfo->getIsMeshBuffer()) {
        // Todo MeshBuffer RenderData
        ia = drawInfo->requestIA(getDevice());
        _meshRenderDrawInfo.emplace_back(drawInfo);
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

    // stencilStage
    gfx::DepthStencilState* depthStencil = nullptr;
    ccstd::hash_t dssHash = 0;
    StencilStage entityStage = entity->getEnumStencilStage();
    if (entity->getCustomMaterial() != nullptr) {
        depthStencil = _stencilManager->getDepthStencilState(entityStage, _currMaterial);
    } else {
        depthStencil = _stencilManager->getDepthStencilState(entityStage);
    }
    dssHash = _stencilManager->getStencilHash(entityStage);

    auto* curdrawBatch = _drawBatchPool.alloc();
    curdrawBatch->setVisFlags(_currLayer);
    curdrawBatch->setInputAssembler(ia);
    curdrawBatch->setUseLocalFlag(nullptr); // todo usLocal
    curdrawBatch->fillPass(_currMaterial, depthStencil, dssHash, nullptr, 0);
    const auto& pass = curdrawBatch->getPasses().at(0);

    curdrawBatch->setDescriptorSet(getDescriptorSet(_currTexture, _currSampler, pass->getLocalSetLayout()));
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

gfx::DescriptorSet* Batcher2d::getDescriptorSet(gfx::Texture* texture, gfx::Sampler* sampler, gfx::DescriptorSetLayout* dsLayout) {
    ccstd::hash_t hash = 2;
    size_t textureHash;
    if (texture != nullptr) {
        textureHash = boost::hash_value(texture);
        ccstd::hash_combine(hash, textureHash);
    }
    if (sampler != nullptr) {
        ccstd::hash_combine(hash, sampler->getHash());
    }
    auto iter = _descriptorSetCache.find(hash);
    if (iter != _descriptorSetCache.end()) {
        if (texture != nullptr && sampler != nullptr) {
            iter->second->bindTexture(static_cast<uint32_t>(pipeline::ModelLocalBindings::SAMPLER_SPRITE), texture);
            iter->second->bindSampler(static_cast<uint32_t>(pipeline::ModelLocalBindings::SAMPLER_SPRITE), sampler);
        }
        iter->second->forceUpdate();
        return iter->second;
    }
    _dsInfo.layout = dsLayout;
    auto* ds = getDevice()->createDescriptorSet(_dsInfo);

    if (texture != nullptr && sampler != nullptr) {
        ds->bindTexture(static_cast<uint32_t>(pipeline::ModelLocalBindings::SAMPLER_SPRITE), texture);
        ds->bindSampler(static_cast<uint32_t>(pipeline::ModelLocalBindings::SAMPLER_SPRITE), sampler);
    }
    ds->update();
    _descriptorSetCache.emplace(hash, ds);

    return ds;
}

void Batcher2d::releaseDescriptorSetCache(gfx::Texture* texture, gfx::Sampler* sampler) {
    ccstd::hash_t hash = 2;
    size_t textureHash;
    if (texture != nullptr) {
        textureHash = boost::hash_value(texture);
        ccstd::hash_combine(hash, textureHash);
    }
    if (sampler != nullptr) {
        ccstd::hash_combine(hash, sampler->getHash());
    }
    auto iter = _descriptorSetCache.find(hash);
    if (iter != _descriptorSetCache.end()) {
        delete iter->second;
        _descriptorSetCache.erase(hash);
    }
}

bool Batcher2d::initialize() {
    _isInit = true;
    return _isInit;
}

void Batcher2d::update() {
    fillBuffersAndMergeBatches();
    resetRenderStates();

    for (const auto& scene : Root::getInstance()->getScenes()) {
        for (auto* batch : _batches) {
            scene->addBatch(batch);
        }
    }
}

void Batcher2d::uploadBuffers() {
    if (_batches.empty()) {
        return;
    }

    for (auto& meshRenderData : _meshRenderDrawInfo) {
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

void Batcher2d::reset() {
    for (auto& batch : _batches) {
        batch->clear();
        _drawBatchPool.free(batch);
    }
    _batches.clear();

    for (auto& meshRenderData : _meshRenderDrawInfo) {
        meshRenderData->resetMeshIA();
    }
    _meshRenderDrawInfo.clear();

    // meshDataArray
    for (auto& map : _meshBuffersMap) {
        for (auto& buffer : map.second) {
            if (buffer) {
                buffer->resetIA();
            }
        }
    }
    //meshBuffer cannot clear because it is not transported at every frame.

    _currMeshBuffer = nullptr;
    _indexStart = 0;
    _currHash = 0;
    _currLayer = 0;
    _currMaterial = nullptr;
    _currTexture = nullptr;
    _currSampler = nullptr;

    // stencilManager
}
} // namespace cc
