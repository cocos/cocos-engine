/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "InstancedBuffer.h"
#include "Define.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXInputAssembler.h"

namespace cc {
namespace pipeline {

InstancedBuffer::InstancedBuffer(const scene::Pass *pass)
: _pass(pass),
  _device(gfx::Device::getInstance()) {
}

InstancedBuffer::~InstancedBuffer() {
    destroy();
}

void InstancedBuffer::destroy() {
    for (auto &instance : _instances) {
        CC_SAFE_DESTROY_AND_DELETE(instance.vb);
        CC_SAFE_DESTROY_AND_DELETE(instance.ia);
        CC_FREE(instance.data);
    }
    _instances.clear();
}

void InstancedBuffer::merge(scene::SubModel *subModel, uint32_t passIdx) {
    merge(subModel, passIdx, nullptr);
}

void InstancedBuffer::merge(scene::SubModel *subModel, uint32_t passIdx, gfx::Shader *shaderImplant) {
    auto &attrs = subModel->getInstancedAttributeBlock();

    const auto stride = attrs.buffer.length();
    if (!stride) return; // we assume per-instance attributes are always present

    auto *sourceIA = subModel->getInputAssembler();
    auto *descriptorSet = subModel->getDescriptorSet();
    auto *lightingMap = descriptorSet->getTexture(LIGHTMAPTEXTURE::BINDING);
    auto *reflectionProbeCubemap = descriptorSet->getTexture(REFLECTIONPROBECUBEMAP::BINDING);
    auto *reflectionProbePlanarMap = descriptorSet->getTexture(REFLECTIONPROBEPLANARMAP::BINDING);
    auto *reflectionProbeBlendCubemap = descriptorSet->getTexture(REFLECTIONPROBEBLENDCUBEMAP::BINDING);
    uint32_t reflectionProbeType = subModel->getReflectionProbeType();
    auto *shader = shaderImplant;
    if (!shader) {
        shader = subModel->getShader(passIdx);
    }

    for (auto &instance : _instances) {
        if (instance.ia->getIndexBuffer() != sourceIA->getIndexBuffer() || instance.drawInfo.instanceCount >= MAX_CAPACITY) {
            continue;
        }

        // check same binding
        if (instance.lightingMap != lightingMap) {
            continue;
        }

        if (instance.reflectionProbeType != reflectionProbeType) {
            continue;
        }
        if (instance.reflectionProbeCubemap != reflectionProbeCubemap) {
            continue;
        }
        if (instance.reflectionProbePlanarMap != reflectionProbePlanarMap) {
            continue;
        }
        if (instance.reflectionProbeBlendCubemap != reflectionProbeBlendCubemap) {
            continue;
        }

        if (instance.stride != stride) {
            continue;
        }
        if (instance.drawInfo.instanceCount >= instance.capacity) { // resize buffers
            instance.capacity <<= 1;
            const auto newSize = instance.stride * instance.capacity;
            instance.data = static_cast<uint8_t *>(CC_REALLOC(instance.data, newSize));
            instance.vb->resize(newSize);
        }
        if (instance.shader != shader) {
            instance.shader = shader;
        }
        if (instance.descriptorSet != descriptorSet) {
            instance.descriptorSet = descriptorSet;
        }
        memcpy(instance.data + instance.stride * instance.drawInfo.instanceCount++, attrs.buffer.buffer()->getData(), stride);
        _hasPendingModels = true;
        return;
    }

    // Create a new instance
    const auto newSize = stride * INITIAL_CAPACITY;
    auto *vb = _device->createBuffer({
        gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::DEVICE,
        static_cast<uint32_t>(newSize),
        static_cast<uint32_t>(stride),
    });

    auto vertexBuffers = sourceIA->getVertexBuffers();
    auto attributes = sourceIA->getAttributes();
    auto *indexBuffer = sourceIA->getIndexBuffer();

    for (const auto &attribute : attrs.attributes) {
        attributes.emplace_back(gfx::Attribute{
            attribute.name,
            attribute.format,
            attribute.isNormalized,
            static_cast<uint32_t>(vertexBuffers.size()), // stream
            true,
            attribute.location});
    }

    auto *data = static_cast<uint8_t *>(CC_MALLOC(newSize));
    memcpy(data, attrs.buffer.buffer()->getData(), stride);
    vertexBuffers.emplace_back(vb);
    const gfx::InputAssemblerInfo iaInfo = {attributes, vertexBuffers, indexBuffer};
    auto *ia = _device->createInputAssembler(iaInfo);
    InstancedItem item = {INITIAL_CAPACITY, vb, data, ia, stride, shader, descriptorSet,
                          lightingMap, reflectionProbeCubemap, reflectionProbePlanarMap, reflectionProbeType, reflectionProbeBlendCubemap,
                          ia->getDrawInfo()};
    item.drawInfo.instanceCount = 1;
    _instances.emplace_back(item);
    _hasPendingModels = true;
}

void InstancedBuffer::uploadBuffers(gfx::CommandBuffer *cmdBuff) const {
    for (const auto &instance : _instances) {
        if (!instance.drawInfo.instanceCount) continue;

        cmdBuff->updateBuffer(instance.vb, instance.data, instance.vb->getSize());
        instance.ia->setInstanceCount(instance.drawInfo.instanceCount);
    }
}

void InstancedBuffer::clear() {
    for (auto &instance : _instances) {
        instance.drawInfo.instanceCount = 0;
    }
    _hasPendingModels = false;
}

void InstancedBuffer::setDynamicOffset(uint32_t idx, uint32_t value) {
    if (_dynamicOffsets.size() <= idx) _dynamicOffsets.resize(1 + idx);
    _dynamicOffsets[idx] = value;
}
} // namespace pipeline
} // namespace cc
