#include <2d/renderer/UIMeshBuffer.h>
#include <gfx-base/GFXDevice.h>

namespace cc {
UIMeshBuffer::UIMeshBuffer(/* args */) {
}

UIMeshBuffer::~UIMeshBuffer() {
}
void UIMeshBuffer::setVData(float* vData) {
    _vData = vData;
}
void UIMeshBuffer::setIData(uint16_t* iData) {
    _iData = iData;
}

void UIMeshBuffer::initialize(gfx::Device* device, gfx::AttributeList* attrs, index_t vFloatCount, index_t iCount) {
    _initVDataCount = vFloatCount;
    _initIDataCount = iCount;
    _attributes = *attrs;
    if (!_vData || !_iData) {
        _vData = new float[_initVDataCount];
        _iData = new uint16_t[_initIDataCount];
        _needDeleteVData = true;
    } else {
        _needDeleteVData = false;
    }
    _iaPool.push_back(createNewIA(device));
}

void UIMeshBuffer::reset() {
    _nextFreeIAHandle = 0;
    _dirty = false;
}

void UIMeshBuffer::destroy() {
    reset();
    _attributes.clear();
    for (auto* vb : _iaInfo.vertexBuffers) {
        delete vb;
    }
    _iaInfo.vertexBuffers.clear();
    CC_SAFE_DELETE(_iaInfo.indexBuffer);
    if (_needDeleteVData) {
        delete _vData;
        delete _iData;
    }
    _vData = nullptr;
    _iData = nullptr;
    // Destroy InputAssemblers
    for each (auto ia in _iaPool) {
        delete ia;
    }
    _iaPool.clear();
}

void UIMeshBuffer::setDirty() {
    _dirty = true;
}

gfx::InputAssembler* UIMeshBuffer::requireFreeIA(gfx::Device* device) {
    if (_nextFreeIAHandle >= _iaPool.size()) {
        _iaPool.push_back(createNewIA(device));
    }
    auto ia = _iaPool[_nextFreeIAHandle];
    _nextFreeIAHandle++;
    return ia;
}

void UIMeshBuffer::uploadBuffers() {
}

// use less
void UIMeshBuffer::recycleIA(gfx::InputAssembler* ia) {
}

gfx::InputAssembler* UIMeshBuffer::createNewIA(gfx::Device* device) {
    if (_iaPool.empty()) {
        uint32_t vbStride = _vertexFormatBytes = _floatsPerVertex * sizeof(float); //??
        uint32_t ibStride = sizeof(uint16_t);                                      //??

        auto* vertexBuffer = device->createBuffer({
            gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE,
            vbStride * 3,
            vbStride,
        });
        auto* indexBuffer = device->createBuffer({
            gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE,
            ibStride * 3,
            ibStride,
        });
        _iaInfo.attributes = _attributes;
        _iaInfo.vertexBuffers.emplace_back(vertexBuffer);
        _iaInfo.indexBuffer = indexBuffer;

        auto* ia = device->createInputAssembler(_iaInfo);
        _iaPool.push_back(ia);

        return ia;
    }
    return _iaPool.back();
}

void UIMeshBuffer::syncSharedBufferToNative(index_t* buffer) {
    _sharedBuffer = buffer;
    parseLayout();
}
void UIMeshBuffer::parseLayout() {
    _meshBufferLayout = reinterpret_cast<MeshBufferLayout*>(_sharedBuffer);
}
} // namespace cc
