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

#include "2d/renderer/RenderDrawInfo.h"
#include "2d/renderer/Batcher2d.h"
#include "base/TypeDef.h"
#include "core/Root.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {

static gfx::DescriptorSetInfo gDsInfo;
static float matrixData[pipeline::UBOLocal::COUNT] = {0.F};
void mat4ToFloatArray(const cc::Mat4& mat, float* out, index_t ofs = 0) {
    memcpy(out + ofs, mat.m, 16 * sizeof(float));
}

RenderDrawInfo::RenderDrawInfo() {
    _attrSharedBufferActor.initialize(&_drawInfoAttrs, sizeof(_drawInfoAttrs));
}

RenderDrawInfo::~RenderDrawInfo() {
    destroy();
}

void RenderDrawInfo::changeMeshBuffer() {
    CC_ASSERT(Root::getInstance()->getBatcher2D());
    _meshBuffer = Root::getInstance()->getBatcher2D()->getMeshBuffer(_drawInfoAttrs._accId, _drawInfoAttrs._bufferId);
}

gfx::InputAssembler* RenderDrawInfo::requestIA(gfx::Device* device) {
    CC_ASSERT(_drawInfoAttrs._isMeshBuffer && _drawInfoAttrs._drawInfoType == RenderDrawInfoType::COMP);
    if (!_iaPool) {
        _iaPool = ccnew ccstd::vector<gfx::InputAssembler*>;
    }
    if (_nextFreeIAHandle >= _iaPool->size()) {
        initIAInfo(device);
    }
    auto* ia = (*_iaPool)[_nextFreeIAHandle++];
    ia->setFirstIndex(getIndexOffset());
    ia->setIndexCount(getIbCount());
    return ia;
}

void RenderDrawInfo::uploadBuffers() {
    CC_ASSERT(_drawInfoAttrs._isMeshBuffer && _drawInfoAttrs._drawInfoType == RenderDrawInfoType::COMP);
    if (_drawInfoAttrs._vbCount == 0 || _drawInfoAttrs._ibCount == 0) return;
    uint32_t size = _drawInfoAttrs._vbCount * 9 * sizeof(float); // magic Number
    gfx::Buffer* vBuffer = _iaInfo->vertexBuffers[0];
    vBuffer->resize(size);
    vBuffer->update(_vDataBuffer);
    gfx::Buffer* iBuffer = _iaInfo->indexBuffer;
    uint32_t iSize = _drawInfoAttrs._ibCount * 2;
    iBuffer->resize(iSize);
    iBuffer->update(_iDataBuffer);
}

void RenderDrawInfo::resetMeshIA() {
    CC_ASSERT(_drawInfoAttrs._isMeshBuffer && _drawInfoAttrs._drawInfoType == RenderDrawInfoType::COMP);
    _nextFreeIAHandle = 0;
}

void RenderDrawInfo::destroy() {
    _nextFreeIAHandle = 0;
    if (_iaInfo) {
        CC_SAFE_DELETE(_iaInfo->indexBuffer);
        if (!_iaInfo->vertexBuffers.empty()) {
            // only one vb
            CC_SAFE_DELETE(_iaInfo->vertexBuffers[0]);
            _iaInfo->vertexBuffers.clear();
        }
        CC_SAFE_DELETE(_iaInfo);
    }

    if (_iaPool) {
        for (auto* ia : *_iaPool) {
            CC_SAFE_DELETE(ia);
        }
        _iaPool->clear();
        CC_SAFE_DELETE(_iaPool);
    }

    if (_localDSBF) {
        CC_SAFE_DELETE(_localDSBF->ds);
        CC_SAFE_DELETE(_localDSBF->uboBuf);
        CC_SAFE_DELETE(_localDSBF);
    }
}

gfx::InputAssembler* RenderDrawInfo::initIAInfo(gfx::Device* device) {
    if (_iaPool->empty()) {
        _iaInfo = ccnew gfx::InputAssemblerInfo();
        uint32_t vbStride = 9 * sizeof(float); // magic Number
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

        _iaInfo->attributes = *(Root::getInstance()->getBatcher2D()->getDefaultAttribute());
        _iaInfo->vertexBuffers.emplace_back(vertexBuffer);
        _iaInfo->indexBuffer = indexBuffer;
    }
    auto* ia = device->createInputAssembler(*_iaInfo);
    _iaPool->emplace_back(ia);

    return ia;
}

void RenderDrawInfo::updateLocalDescriptorSet(Node* transform, const gfx::DescriptorSetLayout* dsLayout) {
    if (_localDSBF == nullptr) {
        _localDSBF = new LocalDSBF();
        auto* device = Root::getInstance()->getDevice();
        gDsInfo.layout = dsLayout;
        _localDSBF->ds = device->createDescriptorSet(gDsInfo);
        _localDSBF->uboBuf = device->createBuffer({
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
            pipeline::UBOLocal::SIZE,
            pipeline::UBOLocal::SIZE,
        });
    }
    if (_texture != nullptr && _sampler != nullptr) {
        _localDSBF->ds->bindTexture(static_cast<uint32_t>(pipeline::ModelLocalBindings::SAMPLER_SPRITE), _texture);
        _localDSBF->ds->bindSampler(static_cast<uint32_t>(pipeline::ModelLocalBindings::SAMPLER_SPRITE), _sampler);
    }
    _localDSBF->ds->bindBuffer(pipeline::UBOLocal::BINDING, _localDSBF->uboBuf);
    _localDSBF->ds->update();
    const auto& worldMatrix = transform->getWorldMatrix();
    mat4ToFloatArray(worldMatrix, matrixData, pipeline::UBOLocal::MAT_WORLD_OFFSET);
    _localDSBF->uboBuf->update(matrixData);
}

} // namespace cc
