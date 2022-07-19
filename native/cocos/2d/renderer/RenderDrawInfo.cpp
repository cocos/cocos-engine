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

#include "2d/renderer/RenderDrawInfo.h"
#include "2d/renderer/Batcher2d.h"
#include "base/TypeDef.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "core/Root.h"

namespace cc {

RenderDrawInfo::RenderDrawInfo() {
    _attrSharedBufferActor.initialize(&drawInfoAttrs, sizeof(DrawInfoAttrs));
}

RenderDrawInfo::~RenderDrawInfo() {
    destroy();
}

void RenderDrawInfo::changeMeshBuffer() {
    CC_ASSERT(Root::getInstance()->getBatcher2D());
    CC_ASSERT(drawInfoAttrs._drawInfoType == RenderDrawInfoType::COMP || drawInfoAttrs._drawInfoType == RenderDrawInfoType::IA);
    _compAttrs._meshBuffer = Root::getInstance()->getBatcher2D()->getMeshBuffer(drawInfoAttrs._accId, drawInfoAttrs._bufferId);
}

gfx::InputAssembler* RenderDrawInfo::requestIA(gfx::Device* device) {
    CC_ASSERT(drawInfoAttrs._drawInfoType == RenderDrawInfoType::IA);
    if (!_iaAttrs._iaPool) {
        _iaAttrs._iaPool = new ccstd::vector<gfx::InputAssembler*>{0};
    }
    if (_iaAttrs._nextFreeIAHandle >= _iaAttrs._iaPool -> size()) {
        initIAInfo(device);
    }
    auto* ia = _iaAttrs._iaPool->at(_iaAttrs._nextFreeIAHandle++); // 需要 reset
    ia->setFirstIndex(getIndexOffset());
    ia->setIndexCount(getIbCount());
    return ia;
}

void RenderDrawInfo::uploadBuffers() {
    CC_ASSERT(drawInfoAttrs._drawInfoType == RenderDrawInfoType::IA);
    if (drawInfoAttrs._vbCount == 0 || drawInfoAttrs._ibCount == 0) return;
    uint32_t size = drawInfoAttrs._vbCount * 9 * sizeof(float); // magic Number
    gfx::Buffer* vBuffer = _iaAttrs._iaInfo->vertexBuffers[0];
    vBuffer->resize(size);
    vBuffer->update(_vDataBuffer);
    gfx::Buffer* iBuffer = _iaAttrs._iaInfo->indexBuffer;
    uint32_t iSize = drawInfoAttrs._ibCount * 2;
    iBuffer->resize(iSize);
    iBuffer->update(_iDataBuffer);
}

void RenderDrawInfo::resetMeshIA() {
    CC_ASSERT(drawInfoAttrs._drawInfoType == RenderDrawInfoType::IA);
    _iaAttrs._nextFreeIAHandle = 0;
}

void RenderDrawInfo::destroy() {
    if (drawInfoAttrs._drawInfoType != RenderDrawInfoType::IA) return;
    _iaAttrs._nextFreeIAHandle = 0;

    //TODO(): Should use _iaPool to delete vb, ib.
    if (_iaAttrs._iaInfo != nullptr) {
        CC_SAFE_DELETE(_iaAttrs._iaInfo->indexBuffer);
        if (!_iaAttrs._iaInfo->vertexBuffers.empty()) {
            // only one vb
            CC_SAFE_DELETE(_iaAttrs._iaInfo->vertexBuffers[0]);
            _iaAttrs._iaInfo->vertexBuffers.clear();
        }
        CC_SAFE_DELETE(_iaAttrs._iaInfo);
    }

    for (auto* ia : *_iaAttrs._iaPool) {
        //TODO(): should use these codes to delete all ib, vb.
        //        delete ia->getIndexBuffer();
        //        // only one vertex buffer
        //        delete ia->getVertexBuffers()[0];
        CC_SAFE_DELETE(ia);
    }
    _iaAttrs._iaPool -> clear();
    CC_SAFE_DELETE(_iaAttrs._iaPool);
}

gfx::InputAssembler* RenderDrawInfo::initIAInfo(gfx::Device* device) {
    if (_iaAttrs._iaPool->empty()) {
        _iaAttrs._iaInfo = new gfx::InputAssemblerInfo();
        uint32_t vbStride = 9 * sizeof(float);// magic Number
        uint32_t ibStride = sizeof(uint16_t);
        auto* vertexBuffer = device->createBuffer({
            gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE | gfx::MemoryUsageBit::HOST,
            vbStride * 3,
            vbStride,
        });
        auto* indexBuffer = device->createBuffer({
            gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE | gfx::MemoryUsageBit::HOST,
            ibStride * 3,
            ibStride,
        });

        _iaAttrs._iaInfo->attributes = *(Root::getInstance()->getBatcher2D()->getDefaultAttribute());
        _iaAttrs._iaInfo->vertexBuffers.emplace_back(vertexBuffer);
        _iaAttrs._iaInfo->indexBuffer = indexBuffer;
    }
    auto* ia = device->createInputAssembler(*_iaAttrs._iaInfo);
    _iaAttrs._iaPool->emplace_back(ia);

    return ia;
}
} // namespace cc
