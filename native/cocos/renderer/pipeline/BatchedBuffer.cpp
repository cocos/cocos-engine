#include "BatchedBuffer.h"

namespace cc {
namespace pipeline {
map<const Pass*, std::shared_ptr<BatchedBuffer>> BatchedBuffer::_buffers;
BatchedBuffer* BatchedBuffer::get(const Pass *pass) {
    if(_buffers.find(pass) == _buffers.end()) {
        _buffers[pass] = std::shared_ptr<BatchedBuffer>(CC_NEW(BatchedBuffer(pass)), [](BatchedBuffer *ptr){CC_SAFE_DELETE(ptr);});
    }
    return _buffers[pass].get();
}

BatchedBuffer::BatchedBuffer(const Pass *pass) {
    
}

BatchedBuffer::~BatchedBuffer() {
    destroy();
}

void BatchedBuffer::destroy() {
    
}

void BatchedBuffer::merge(const SubModel *, uint passIdx, const RenderObject *) {
    
}

void BatchedBuffer::clear() {
    
}

void BatchedBuffer::clearUBO() {
    
}
} // namespace pipeline
} // namespace cc
