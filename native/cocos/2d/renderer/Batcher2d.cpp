#include <2d/renderer/Batcher2d.h>
#include <cocos/base/TypeDef.h>
#include <cocos/core/Root.h>
#include <renderer/pipeline/Define.h>
#include <scene/Pass.h>
#include <iostream>

namespace cc {
//batcher2d是从ts调JSB过来的的，所以不会走构造
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

void Batcher2d::syncRenderEntitiesToNative(std::vector<RenderEntity*>&& renderEntities) {
    //_renderEntities = std::move(renderEntities);
}

//void Batcher2d::syncMeshBufferAttrToNative(uint32_t* buffer, uint8_t stride, uint32_t size) {
//    _attrSize = size;
//    _attrStride = stride;
//    _attrBuffer = buffer;
//    parseAttr();
//}

//void Batcher2d::parseAttr() {
//    index_t group = _attrSize / _attrStride;
//    _meshBufferAttrArr.clear();
//    for (index_t i = 0; i < _attrSize; i += _attrStride) {
//        MeshBufferAttr* temp = reinterpret_cast<MeshBufferAttr*>(_attrBuffer + i);
//        _meshBufferAttrArr.push_back(temp);
//    }
//}

//MeshBufferAttr* Batcher2d::getMeshBufferAttr(index_t bufferId) {
//    for (index_t i = 0; i < _meshBufferAttrArr.size(); i++) {
//        if (_meshBufferAttrArr[i]->bufferId == bufferId) {
//            return _meshBufferAttrArr[i];
//        }
//    }
//    return nullptr;
//}

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

void Batcher2d::setRootNode(Node* node) {
    _rootNode = node;
}

//bool compareEntitySortingOrder(const RenderEntity* entity1, const RenderEntity* entity2) {
//    return entity1->getCurrIndex() < entity2->getCurrIndex();
//}

//对标ts的walk
void Batcher2d::fillBuffersAndMergeBatches() {
    _mapEnd = _nodeEntityMap.end();
    walk(_rootNode);
    generateBatch(_currEntity);
}

void Batcher2d::walk(Node* node) {
    RenderEntity* entity = static_cast<RenderEntity*>(node->getUserData());
    if (entity) {

        //判断是否为第一个
        if (_currBID == -1) {
            _currBID = entity->getBufferId();
            _indexStart = entity->getIndexOffset();
            _currHash = entity->getDataHash();
            _currMaterial = entity->getMaterial();
            _currLayer = entity->getNode()->getLayer();
            _currEntity = entity;

            //if(frame)
            _currTexture = entity->getTexture();
            _currTextureHash = entity->getTextureHash();
            _currSampler = entity->getSampler();
        } else {
            //判断是否能合批，不能合批则需要generateBatch
            uint32_t dataHash = entity->getDataHash();
            if (_currHash != dataHash || dataHash == 0 || _currMaterial != entity->getMaterial()
                /* || stencilmanager */) { //这个暂时只有mask才考虑，后续补充
                generateBatch(_currEntity);
                if (!entity->getIsMeshBuffer()) {
                    //修改当前currbufferid和currindexStart（用当前的meshbuffer的indexOffset赋值）
                    if (_currBID != entity->getBufferId()) {
                        UIMeshBuffer* buffer = entity->getMeshBuffer();
                        _currBID = entity->getBufferId();
                        _indexStart = buffer->getIndexOffset();
                    }
                }

                _currHash = dataHash;
                _currMaterial = entity->getMaterial();
                // stencil stage
                _currLayer = entity->getNode()->getLayer();
                _currEntity = entity;

                //if(frame)
                _currTexture = entity->getTexture();
                _currTextureHash = entity->getTextureHash();
                _currSampler = entity->getSampler();
                if (_currSampler == nullptr) {
                    _currSamplerHash = 0;
                } else {
                    _currSamplerHash = _currSampler->getHash();
                }
            }
        }

        fillBuffers(entity);
    }
    //递归调用
    auto& children = node->getChildren();
    const size_t size = children.size();
    for (index_t i = 0; i < size; i++) {
        walk(children[i]);
    }
}

//如果不传参数，说明是最后一个组件结束，直接合批
void Batcher2d::generateBatch(RenderEntity* entity) {
    //这里主要负责的是ts.automergebatches
    //边循环，边判断当前entity是否能合批
    if (_currMaterial == nullptr) {
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

void Batcher2d::updateWorldVerts(RenderEntity* entity) {
    if (entity == nullptr) {
        return;
    }

    // ccstd::vector<Render2dLayout*>& dataList = entity->getRenderDataArr();
    Node* node = entity->getNode();
    const Mat4& matrix = node->getWorldMatrix();
    uint8_t stride = entity->getStride();
    uint32_t size = entity->getVbCount() * stride;
    float_t* vbBuffer = entity->getVbBuffer();

    Vec3 temp;
    uint8_t offset = 0;
    for (int i = 0; i < size; i += stride) {
        // Render2dLayout* curLayout = dataList[i];
        Render2dLayout* curLayout = entity->getRender2dLayout(i);
        temp.transformMat4(curLayout->position, matrix);

        offset = i;
        vbBuffer[offset++] = temp.x;
        vbBuffer[offset++] = temp.y;
        vbBuffer[offset++] = temp.z;
    }
}

void Batcher2d::fillBuffers(RenderEntity* entity) {
    Node* node = entity->getNode();
    if (node->getChangedFlags()) {
        this->updateWorldVerts(entity);
    }

    index_t vertexOffset = entity->getVertexOffset();
    uint16_t* ib = entity->getIDataBuffer();

    UIMeshBuffer* buffer = entity->getMeshBuffer();
    index_t indexOffset = buffer->getIndexOffset();

    uint16_t* indexb = entity->getIbBuffer();
    index_t indexCount = entity->getIbCount();

    memcpy(&ib[indexOffset], indexb, indexCount * sizeof(uint16_t));
    indexOffset += indexCount;

    // set index offset back
    buffer->setIndexOffset(indexOffset);
}

bool Batcher2d::initialize() {
    return true;
}

void Batcher2d::update() {
    updateVertDirtyRenderer();
    fillBuffersAndMergeBatches();
    resetRenderStates();

    for (const auto scene : Root::getInstance()->getScenes()) {
        for (const auto batch : _batches) {
            scene->addBatch(batch);
        }
    }
}

void Batcher2d::updateVertDirtyRenderer() {
    size_t size = _vertDirtyRenderers.size();
    for (uint32_t i = 0; i < size; i++) {
        updateWorldVerts(_vertDirtyRenderers[i]);
    }
    _vertDirtyRenderers.clear();
}

void Batcher2d::uploadBuffers() {
    if (_batches.size() > 0) {
        //_meshDataArray.forEach(),uploadBuffers

        //当前只考虑一个accessor
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

//void Batcher2d::addNewRenderEntity(RenderEntity* entity) {
//    entity->setCurrIndex(_newRenderEntities.size());
//    _newRenderEntities.push_back(entity);
//}

void Batcher2d::addVertDirtyRenderer(RenderEntity* entity) {
    _vertDirtyRenderers.push_back(entity);
}

void Batcher2d::ItIsDebugFuncInBatcher2d() {
    std::cout << "It is debug func in Batcher2d.";
}
} // namespace cc
