#include <2d/renderer/Batcher2d.h>
#include <cocos/base/TypeDef.h>
#include <iostream>
#include <cocos/2d/assembler/Simple.h>
#include <cocos/core/Root.h>

namespace cc {
Batcher2d::Batcher2d() {
    this->_simple = new Simple(this);
}

Batcher2d::Batcher2d(Root* root) {
    this->_root = root;
    this->_simple = new Simple(this);
}

Batcher2d::~Batcher2d() {
    CC_SAFE_DELETE(this->_simple);
}

void Batcher2d::syncRenderEntitiesToNative(std::vector<RenderEntity*>&& renderEntities) {
    this->_renderEntities = std::move(renderEntities);
}

void Batcher2d::syncMeshBufferAttrToNative(uint32_t* buffer, uint8_t stride, uint32_t size) {    this->_attrSize = size;
    this->_attrStride = stride;
    this->_attrBuffer = buffer;
    parseAttr();
}

void Batcher2d::parseAttr() {
    index_t group = this->_attrSize / this->_attrStride;
    this->_meshBufferAttrArr.clear();
    for (index_t i = 0; i < this->_attrSize; i += this->_attrStride) {
        MeshBufferAttr* temp = reinterpret_cast<MeshBufferAttr*>(this->_attrBuffer+i);
        this->_meshBufferAttrArr.push_back(temp);
    }
}

MeshBufferAttr* Batcher2d::getMeshBufferAttr(index_t bufferId) {
    for (index_t i = 0; i < this->_meshBufferAttrArr.size(); i++) {
        if (this->_meshBufferAttrArr[i]->bufferId == bufferId) {
            return this->_meshBufferAttrArr[i];
        }
    }
    return nullptr;
}

void Batcher2d::fillBuffersAndMergeBatches() {
    //这里负责的是ts._render填充逻辑
    //这里不需要加assembler判断，因为ts的fillBuffers做了分层优化
    //，有多少顶点就传多少数据到RenderEntity
    for (index_t i = 0; i < this->_renderEntities.size(); i++) {
        RenderEntity* entity = this->_renderEntities[i];

        Node* node = entity->getNode();
        if (node == nullptr) {
            continue;
        }

        //判断是否能合批，不能合批则需要generateBatch
        int32_t dataHash = entity->getDataHash();
        if (this->_currHash != dataHash || dataHash == 0
            || this->_currMaterial != entity->getMaterial()
            /* || stencilmanager */) {
            generateBatch(entity);
            if (!entity->getIsMeshBuffer()) {
                //updateBuffer：切换accessor，设置indexStart
            }

            this->_currHash = dataHash;
            this->_currMaterial = entity->getMaterial();
            //stencialstage
            this->_currLayer = entity->getNode()->getLayer();


            //if(frame)
            this->_currTexture = entity->getTexture();
            this->_currTextureHash = entity->getTextureHash();
            this->_currSampler = entity->getSampler();
            if (this->_currSampler == nullptr) {
                this->_currSamplerHash = 0;
            } else {
                this->_currSamplerHash = this->_currSampler->getHash();
            }
        }

        this->_simple->fillBuffers(entity);
    }
}

void Batcher2d::generateBatch(RenderEntity* entity) {
    //这里主要负责的是ts.automergebatches
    //边循环，边判断当前entity是否能合批
    //
}

bool Batcher2d::initialize() {
    return true;
}

void Batcher2d::update() {
    ItIsDebugFuncInBatcher2d();
    fillBuffersAndMergeBatches();
}

void Batcher2d::uploadBuffers() {
    ItIsDebugFuncInBatcher2d();

}

void Batcher2d::reset() {
    //reset batches

    this->_currBID = -1;
    this->_indexStart = 0;
    this->_currHash = 0;
    this->_currLayer = 0;
    //this->_currMaterial = new Material();//会报错
    this->_currTexture = nullptr;
    this->_currSampler = nullptr;

    this->_batches.clear();
}

void Batcher2d::ItIsDebugFuncInBatcher2d() {
    std::cout << "It is debug func in Batcher2d.";


    //暂时不能修改indexOffset，目前ts中有修改，不能另外再修改了
    //// test code
    //Simple* simple = new Simple(this);
    //for (int i = 0; i < this->_renderEntities.size(); i++) {
    //    RenderEntity* temp = this->_renderEntities[i];
    //    //暂时先用顶点数量判断是否为有效数据
    //    if (temp->getRenderDataArr().size() > 0) {
    //        simple->fillBuffers(temp);
    //    }
    //}
}

} // namespace cc
