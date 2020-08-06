#include "BatchedBuffer.h"
#include "gfx/GFXBuffer.h"
#include "gfx/GFXInputAssembler.h"

namespace cc {
namespace pipeline {
map<const Pass *, std::shared_ptr<BatchedBuffer>> BatchedBuffer::_buffers;
std::shared_ptr<BatchedBuffer> &BatchedBuffer::get(const Pass *pass) {
    if (_buffers.find(pass) == _buffers.end()) {
        _buffers[pass] = std::shared_ptr<BatchedBuffer>(CC_NEW(BatchedBuffer(pass)), [](BatchedBuffer *ptr) { CC_SAFE_DELETE(ptr); });
    }
    return _buffers[pass];
}

BatchedBuffer::BatchedBuffer(const Pass *pass) {
}

BatchedBuffer::~BatchedBuffer() {
    destroy();
}

void BatchedBuffer::destroy() {
    for (auto &batch : _batchedItems) {
        for (auto vb : batch.vbs) {
            vb->destroy();
        }
        batch.vbIdx->destroy();
        batch.ia->destroy();
        batch.ubo->destroy();
    }
    _batchedItems.clear();
}

void BatchedBuffer::merge(const SubModel *, uint passIdx, const RenderObject *) {
}

void BatchedBuffer::clear() {
    for (auto &batch : _batchedItems) {
        batch.vbCount = 0;
        batch.mergCount = 0;
        batch.ia->setVertexCount(0);
    }
}

void BatchedBuffer::clearUBO() {
    for (auto &batch : _batchedItems) {
        //        batch.ubo->update(<#void *buffer#>)
    }
}
} // namespace pipeline
} // namespace cc
