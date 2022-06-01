#include <2d/renderer/UIMeshBuffer.h>

namespace cc {
UIMeshBuffer::UIMeshBuffer(/* args */) {
}

UIMeshBuffer::~UIMeshBuffer() {
}
void UIMeshBuffer::setVData(float_t* vData) {
    this->_vData = vData;
}
void UIMeshBuffer::setIData(uint16_t* iData) {
    this->_iData = iData;
}
void UIMeshBuffer::initialize(gfx::Device* device, index_t vFloatCount, index_t iCount) {
}
void UIMeshBuffer::reset() {
}
void UIMeshBuffer::destroy() {
}
void UIMeshBuffer::setDirty() {
}
void UIMeshBuffer::recycleIA() {
}
void UIMeshBuffer::uploadBuffers() {
}
void UIMeshBuffer::syncSharedBufferToNative(index_t* buffer) {
    this->_sharedBuffer = buffer;
    parseLayout();
}
void UIMeshBuffer::parseLayout() {
    this->_meshBufferLayout = reinterpret_cast<MeshBufferLayout*>(this->_sharedBuffer);
}
} // namespace cc
