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
}

Batcher2d::Batcher2d(Root* root)
: _drawBatchPool([]() { return ccnew scene::DrawBatch2D(); }, [](auto* obj) { delete obj; }, 10U) {
    if (root == nullptr) {
        root = Root::getInstance();
    }
    _root = root;
    _device = _root->getDevice();
    _stencilManager = StencilManager::getInstance();
}

Batcher2d::~Batcher2d() { // NOLINT
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
    const auto& map = _meshBuffersMap[accId];
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

void Batcher2d::syncRootNodesToNative(ccstd::vector<Node*>&& rootNodes) {
    _rootNodeArr = std::move(rootNodes);
}

void Batcher2d::fillBuffersAndMergeBatches() {
    for (auto* rootNode : _rootNodeArr) {
        walk(rootNode, 1);
        generateBatch(_currEntity, _currDrawInfo);
    }
}

void Batcher2d::walk(Node* node, float parentOpacity) { // NOLINT(misc-no-recursion)
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
                handleDrawInfo(entity, &(drawInfos[i]), node, parentOpacity);
            }
        } else if (entityType == RenderEntityType::DYNAMIC) {
            ccstd::vector<RenderDrawInfo*>& drawInfos = entity->getDynamicRenderDrawInfos();
            for (auto* drawInfo : drawInfos) {
                handleDrawInfo(entity, drawInfo, node, parentOpacity);
            }
        }
    }

    const auto& children = node->getChildren();
    for (const auto& child : children) {
        float thisOpacity = entity ? entity->getOpacity() : 1;
        walk(child, thisOpacity);
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

CC_FORCE_INLINE void Batcher2d::handleDrawInfo(RenderEntity* entity, RenderDrawInfo* drawInfo, Node* node, float parentOpacity) {
    CC_ASSERT(entity);
    CC_ASSERT(drawInfo);
    RenderDrawInfoType drawInfoType = drawInfo->getEnumDrawInfoType();

    if (drawInfoType == RenderDrawInfoType::COMP) {
        ccstd::hash_t dataHash = drawInfo->getDataHash();
        if (drawInfo->getIsMeshBuffer()) {
            dataHash = 0;
        }

        entity->setEnumStencilStage(_stencilManager->getStencilStage());
        auto tempStage = static_cast<StencilStage>(entity->getStencilStage());

        if (_currHash != dataHash || dataHash == 0 || _currMaterial != drawInfo->getMaterial() || _currStencilStage != tempStage) {
            // Generate a batch if not batching
            generateBatch(_currEntity, _currDrawInfo);

            bool isSubMask = entity->getIsSubMask();
            if (isSubMask) {
                // Mask subComp
                _stencilManager->enterLevel(entity);
            }
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
            if (node->getChangedFlags() || drawInfo->getVertDirty()) {
                fillVertexBuffers(entity, drawInfo);
                drawInfo->setVertDirty(false);
            }
            handleColor(entity, drawInfo, parentOpacity);
            fillIndexBuffers(drawInfo);
        }

    } else if (drawInfoType == RenderDrawInfoType::MODEL) {
        generateBatch(_currEntity, _currDrawInfo);
        resetRenderStates();

        // stencil stage
        gfx::DepthStencilState* depthStencil = nullptr;
        ccstd::hash_t dssHash = 0;
        Material* renderMat = drawInfo->getMaterial();

        bool isMask = entity->getIsMask();
        bool isSubMask = entity->getIsSubMask();
        if (isMask) {
            //Mask node
            _stencilManager->pushMask();
            _stencilManager->clear(entity);
        } else if (isSubMask) {
            //Mask Comp
            _stencilManager->enterLevel(entity);
        }
        _currStencilStage = _stencilManager->getStencilStage();

        StencilStage entityStage = entity->getEnumStencilStage();
        if (entityStage == StencilStage::ENABLED || entityStage == StencilStage::DISABLED) {
            entity->setEnumStencilStage(_stencilManager->getStencilStage());
        }
        depthStencil = _stencilManager->getDepthStencilState(entityStage, renderMat);
        dssHash = _stencilManager->getStencilHash(entityStage);

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

            curdrawBatch->fillPass(renderMat, depthStencil, dssHash, nullptr, 0, &(submodel->getPatches()));
            _batches.push_back(curdrawBatch);
        }
    } else if (drawInfoType == RenderDrawInfoType::IA) {
        generateBatch(_currEntity, _currDrawInfo);
        uint32_t dataHash = drawInfo->getDataHash();
        entity->setEnumStencilStage(_stencilManager->getStencilStage());
        auto tempStage = static_cast<StencilStage>(entity->getStencilStage());
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
        depthStencil = _stencilManager->getDepthStencilState(entityStage, drawInfo->getMaterial());
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

void Batcher2d::handleColor(RenderEntity* entity, RenderDrawInfo* drawInfo, float parentOpacity) {
    if (entity->getColorDirty()) {
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
    depthStencil = _stencilManager->getDepthStencilState(entityStage, _currMaterial);
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
