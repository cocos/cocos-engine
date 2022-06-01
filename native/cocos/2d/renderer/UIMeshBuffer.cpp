#include <2d/renderer/UIMeshBuffer.h>
#include <gfx-base/GFXDevice.h>

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

void UIMeshBuffer::initialize(gfx::Device* device, gfx::AttributeList* attrs, index_t vFloatCount, index_t iCount) {
    this->_initVDataCount = vFloatCount;
    this->_initIDataCount = iCount;
    this->_attributes = *attrs;
    // if (!this.vData || !this.iData) {
    //     this.vData = new Float32Array(this._initVDataCount);
    //     this.iData = new Uint16Array(this._initIDataCount);
    // }
    this->_iaPool.push_back(this->createNewIA(device));
}

void UIMeshBuffer::reset() {
    this->_nextFreeIAHandle = 0;
    this->_dirty = false;
}

void UIMeshBuffer::destroy() {
    this->reset();
    this->_attributes = {};
    this->_iaInfo = {};
    this->_vData = nullptr;
    this->_iData = nullptr;
    // Destroy InputAssemblers
    for each (auto ia in this->_iaPool) {
        delete ia;
    }
}

void UIMeshBuffer::setDirty() {
    this->_dirty = true;
}

gfx::InputAssembler* UIMeshBuffer::requireFreeIA(gfx::Device* device) {
    if (this->_nextFreeIAHandle >= this->_iaPool.size()) {
        this->_iaPool.push_back(this->createNewIA(device));
    }
    auto ia = this->_iaPool[this->_nextFreeIAHandle];
    this->_nextFreeIAHandle++;
    return ia;
    return nullptr;
}

void UIMeshBuffer::uploadBuffers() {
}

// use less
void UIMeshBuffer::recycleIA(gfx::InputAssembler* ia) {
}


gfx::InputAssembler* UIMeshBuffer::createNewIA(gfx::Device* device) {
    if (this->_iaPool.size() == 0)
    {
        auto vbStride = this->_vertexFormatBytes = this->_floatsPerVertex * 4; //??
        auto ibStride = 2;//??
        auto vertexBuffer = device->createBuffer({gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
                                                  gfx::MemoryUsageBit::DEVICE, vbStride, vbStride});
        auto indexBuffer = device->createBuffer({gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
                                                 gfx::MemoryUsageBit::DEVICE, ibStride, ibStride});
        this->_iaInfo.attributes = this->_attributes;
        this->_iaInfo.vertexBuffers.push_back(vertexBuffer);
        this->_iaInfo.indexBuffer = indexBuffer;

        auto ia = device->createInputAssembler(this->_iaInfo);
        return ia;
    } else {
        auto ia = device->createInputAssembler(this->_iaInfo);
        return ia;
    }
}

void UIMeshBuffer::syncSharedBufferToNative(index_t* buffer) {
    this->_sharedBuffer = buffer;
    parseLayout();
}
void UIMeshBuffer::parseLayout() {
    this->_meshBufferLayout = reinterpret_cast<MeshBufferLayout*>(this->_sharedBuffer);
}
} // namespace cc
