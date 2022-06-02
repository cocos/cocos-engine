#include <2d/renderer/Batcher2d.h>
#include <cocos/2d/assembler/Simple.h>
#include <cocos/base/TypeDef.h>
#include <cocos/core/Root.h>
#include <renderer/pipeline/Define.h>
#include <scene/Pass.h>
#include <iostream>

namespace cc {

gfx::AttributeList vfmtPosUvColor = {
    gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
    gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
    gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA32F},
};

Batcher2d::Batcher2d() : Batcher2d(nullptr) {
    _simple = new Simple(this);
}

Batcher2d::Batcher2d(Root* root) : _drawBatchPool([]() { return ccnew scene::DrawBatch2D(); }, 10U) {
    _root = root;
    _simple = new Simple(this);
}

Batcher2d::~Batcher2d() {
    CC_SAFE_DELETE(_simple);
}

void Batcher2d::syncMeshBuffersToNative(std::vector<UIMeshBuffer*>&& buffers, uint32_t length) {
    _meshBuffers = std::move(buffers);
    _meshBuffersLength = length;
}

void Batcher2d::syncRenderEntitiesToNative(std::vector<RenderEntity*>&& renderEntities) {
    _renderEntities = std::move(renderEntities);
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
    if (bufferId < this->_meshBuffers.size() || this->_meshBuffers[bufferId] == nullptr) {
        return nullptr;
    }
    return this->_meshBuffers[bufferId];
}

void Batcher2d::updateDescriptorSet() {
    //for this._descriptorSetCache.update()
}

void Batcher2d::fillBuffersAndMergeBatches() {
    //这里负责的是ts._render填充逻辑
    //这里不需要加assembler判断，因为ts的fillBuffers做了分层优化
    //，有多少顶点就传多少数据到RenderEntity
    for (index_t i = 0; i < _renderEntities.size(); i++) {
        RenderEntity* entity = _renderEntities[i];

        Node* node = entity->getNode();
        if (node == nullptr) {
            continue;
        }

        //判断是否能合批，不能合批则需要generateBatch
        int32_t dataHash = entity->getDataHash();
        if (_currHash != dataHash || dataHash == 0 || _currMaterial != entity->getMaterial()
            /* || stencilmanager */) { //这个暂时只有mask才考虑，后续补充
            generateBatch(entity);
            if (!entity->getIsMeshBuffer()) {
                //修改当前currbufferid和currindexStart（用当前的meshbuffer的indexOffset赋值）
                if (_currBID != entity->getBufferId()) {
                    UIMeshBuffer* buffer = getMeshBuffer(entity->getBufferId());
                    if (buffer!=nullptr) {
                        _currBID = entity->getBufferId();
                        _indexStart = buffer->getIndexOffset();
                    }
                }
            }

            _currHash = dataHash;
            _currMaterial = entity->getMaterial();
            // stencil stage
            _currLayer = entity->getNode()->getLayer();

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

        //暂时不修改vb和ib，验证下目前native的行为
        //最后调通时再把这里打开
        //_simple->fillBuffers(entity);
    }
}

void Batcher2d::generateBatch(RenderEntity* entity) {
    //这里主要负责的是ts.automergebatches
    //边循环，边判断当前entity是否能合批
    if (_currMaterial == nullptr) {
        return;
    }
    //if (entity->getIsMeshBuffer()) {
    //    // Todo MeshBuffer RenderData
    //} else {
    UIMeshBuffer* currMeshBuffer = getMeshBuffer(this->_currBID);
    auto* ia = currMeshBuffer == nullptr ? nullptr : currMeshBuffer->requireFreeIA(_device);
    //ia->setFirstIndex(); // count
    //ia->setIndexCount(); // count
    // need move index offset
    //}
    if (ia == nullptr) {
        return;
    }
    // Todo blendState & stencil State
    auto* curdrawBatch = _drawBatchPool.alloc();
    curdrawBatch->setVisFlags(_currLayer);
    curdrawBatch->setInputAssembler(ia);
    curdrawBatch->setUseLocalFlag(nullptr); // todo usLocal
    curdrawBatch->fillPass(_currMaterial, nullptr, 0, nullptr, 0);
    auto& _pass = curdrawBatch->getPasses().at(0);

    curdrawBatch->setDescriptorSet(getDescriptorSet(_currTexture, _currSampler, _pass->getLocalSetLayout()));
    _batches.push_back(curdrawBatch);
}

gfx::DescriptorSet* Batcher2d::getDescriptorSet(gfx::Texture* texture, gfx::Sampler* sampler, gfx::DescriptorSetLayout* _dsLayout) {
    ccstd::hash_t hash = 2;
    ccstd::hash_combine(hash, texture->getHash());
    ccstd::hash_combine(hash, sampler->getHash());
    auto iter = _descriptorSetCache.find(hash);
    if (iter != _descriptorSetCache.end()) {
        return iter->second;
    }
    _dsInfo.layout = _dsLayout;
    auto ds = _device->createDescriptorSet(_dsInfo);

    ds->bindTexture(static_cast<uint>(pipeline::ModelLocalBindings::SAMPLER_SPRITE), texture);
    ds->bindSampler(static_cast<uint>(pipeline::ModelLocalBindings::SAMPLER_SPRITE), sampler);
    ds->update();

    _descriptorSetCache.emplace(hash, ds);

    return ds;
}

bool Batcher2d::initialize() {
    return true;
}

void Batcher2d::update() {
    ItIsDebugFuncInBatcher2d();
    fillBuffersAndMergeBatches();
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
    //reset batches

    _currBID = -1;
    _indexStart = 0;
    _currHash = 0;
    _currLayer = 0;
    //_currMaterial = new Material();//会报错
    _currTexture = nullptr;
    _currSampler = nullptr;

    _batches.clear();
}

void Batcher2d::ItIsDebugFuncInBatcher2d() {
    std::cout << "It is debug func in Batcher2d.";
}
} // namespace cc
