#include "InstancedBuffer.h"
#include "gfx/GFXBuffer.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXInputAssembler.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
map<const PassView *, std::shared_ptr<InstancedBuffer>> InstancedBuffer::_buffers;
std::shared_ptr<InstancedBuffer> &InstancedBuffer::get(const PassView *pass) {
    if (_buffers.find(pass) == _buffers.end()) {
        _buffers[pass] = std::shared_ptr<InstancedBuffer>(CC_NEW(InstancedBuffer(pass)), [](InstancedBuffer *ptr) { CC_SAFE_DELETE(ptr); });
    }
    return _buffers[pass];
}

InstancedBuffer::InstancedBuffer(const PassView *pass) {
}

InstancedBuffer::~InstancedBuffer() {
    destroy();
}

void InstancedBuffer::destroy() {
    for (auto &instance : _instancedItems) {
        instance.vb->destroy();
        instance.ia->destroy();
    }
    _instancedItems.clear();
}

void InstancedBuffer::merge(const SubModelView *subModel, const InstancedAttributeBlock &attrs, uint passIdx) {
    //    const auto stride = attrs.bufferViewSize;
    //    if (!stride) {
    //        return;
    //    } // we assume per-instance attributes are always present
    //
    //    const auto sourceIA = GET_IA(subModel->inputAssemblerID);
    //    const auto shader = GET_SHADER(subModel->shader0ID + passIdx);
    //    const auto descriptorSet = GET_DESCRIPTOR_SET(subModel->descriptorSetID);
    //    for (size_t i = 0; i < _instancedItems.size(); ++i) {
    //        auto &instance = _instancedItems[i];
    //        if (instance.ia->getIndexBuffer() != sourceIA->getIndexBuffer() || instance.count >= MAX_CAPACITY) {
    //            continue;
    //        }
    //        if (instance.stride != stride) {
    //            // console.error(`instanced buffer stride mismatch! ${stride}/${instance.stride}`);
    //            return;
    //        }
    //        if (instance.count >= instance.capacity) { // resize buffers
    //            instance.capacity = instance.capacity << 1;
    //            const auto newSize = instance.stride * instance.capacity;
    //            const auto *oldData = instance.data.get();
    //            const auto oldSize = instance.size;
    //            instance.data = std::shared_ptr<uint8_t>((uint8_t *)CC_MALLOC(newSize), [](uint8_t *ptr) { CC_SAFE_FREE(ptr); });
    //            memcpy(instance.data.get(), oldData, oldSize);
    //            instance.size = newSize;
    //            instance.vb->resize(newSize);
    //        }
    //        memcpy(instance.data.get() + instance.stride * instance.count++, GET_BUFFERVIEW(attrs.bufferViewID)->data, attrs.bufferViewSize);
    //        return;
    //    }
    //
    //    // Create a new instance
    //    auto device = gfx::Device::getInstance();
    //    auto vb = device->createBuffer({
    //        gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
    //        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
    //        stride * INITIAL_CAPACITY,
    //        stride,
    //    });
    //    auto dataSize = stride * INITIAL_CAPACITY;
    //    std::shared_ptr<uint8_t> data((uint8_t *)CC_MALLOC(dataSize), [&](uint8_t *ptr) { CC_FREE(ptr); });
    //    auto vertexBuffers = sourceIA->getVertexBuffers();
    //    auto attributes = sourceIA->getAttributes();
    //    auto indexBuffer = sourceIA->getIndexBuffer();
    //
    //    //TODO coulsonwang
    ////    for (size_t i = 0; i < attrs.instancedAttributesCount; i++) {
    ////        const auto *attr = GET_INSTANCE_ATTRIBUTE(attrs.instancedAttributesID, i);
    ////
    ////        gfx::Attribute newAttr = {
    ////            GET_NAME(attr->nameID),
    ////            static_cast<gfx::Format>(attr->format),
    ////            static_cast<bool>(attr->isNormalized),
    ////            static_cast<uint>(vertexBuffers.size()),
    ////            true};
    ////        attributes.emplace_back(newAttr);
    ////    }
    //    memcpy(data.get(), GET_BUFFERVIEW(attrs.bufferViewID)->data, attrs.bufferViewSize);
    //    vertexBuffers.emplace_back(vb);
    //
    //    auto ia = device->createInputAssembler({attributes, vertexBuffers, indexBuffer});
    //    InstancedItem item = {
    //        1,
    //        INITIAL_CAPACITY,
    //        vb,
    //        data,
    //        dataSize,
    //        ia,
    //        stride};
    //    _instancedItems.emplace_back(std::move(item));
}

void InstancedBuffer::uploadBuffers() {
    for (auto &instance : _instancedItems) {
        if (!instance.count) continue;

        instance.vb->update(instance.data.get(), 0, instance.vb->getSize());
        instance.ia->setInstanceCount(instance.count);
    }
}

void InstancedBuffer::clear() {
    for (auto &instance : _instancedItems) {
        instance.count = 0;
    }
}

} // namespace pipeline
} // namespace cc
