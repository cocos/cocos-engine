#include <2d/renderer/UIMeshBuffer.h>
#include <gfx-base/GFXDevice.h>
#include <vector>

namespace cc {

UIMeshBuffer::~UIMeshBuffer() {
    destroy();
}

void UIMeshBuffer::setVData(float_t* vData) {
    _vData = vData;
}

void UIMeshBuffer::setIData(uint16_t* iData) {
    _iData = iData;
}

void UIMeshBuffer::initialize(gfx::Device* device, ccstd::vector<gfx::Attribute*>&& attrs, uint32_t vFloatCount, uint32_t iCount) {
    if (attrs.size() == 4) {
        _attributes.push_back(gfx::Attribute{gfx::ATTR_NAME_COLOR2, gfx::Format::RGBA32F});
    }
}

void UIMeshBuffer::reset() {
    setIndexOffset(0);
    _nextFreeIAHandle = 0;
    _dirty = false;
}

void UIMeshBuffer::resetIA() {
    for (auto* ia : _iaPool) {
        ia->setFirstIndex(0);
        ia->setIndexCount(0);
    }
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
    for (uint32_t i = 0; i < _iaPool.size();i++) {
        gfx::InputAssembler* ia = _iaPool[i];
        ia->destroy();
        delete ia;
    }
    _iaPool.clear();
}

void UIMeshBuffer::setDirty() {
    _dirty = true;
}

gfx::InputAssembler* UIMeshBuffer::requireFreeIA(gfx::Device* device) {
    if (_nextFreeIAHandle >= _iaPool.size()) {
        createNewIA(device);
    }
    return _iaPool[_nextFreeIAHandle++];
}

void UIMeshBuffer::uploadBuffers() {
    uint32_t byteOffset = getByteOffset();
    bool dirty = getDirty();
    if (_meshBufferLayout == nullptr || byteOffset == 0 || !dirty || this->_iaPool.size() == 0) {
        return;
    }

    // copy from ts, to be considered
    //const iOS14 = sys.__isWebIOS14OrIPadOS14Env;
    //const submitCount = iOS14 ? this._nextFreeIAHandle : 1;

    uint32_t indexCount = this->getIndexOffset();
    uint32_t byteCount = this->getByteOffset();
    uint32_t dataCount = byteCount >> 2;

    gfx::InputAssembler* ia = this->_iaPool[0];
    gfx::BufferList vBuffers = ia->getVertexBuffers();
    if (vBuffers.size() > 0) {
        gfx::Buffer* vBuffer = vBuffers[0];
        if (byteCount > vBuffer->getSize()) {
            vBuffer->resize(byteCount);
        }
        vBuffer->update(_vData);
    }
    gfx::Buffer* iBuffer = ia->getIndexBuffer();
    if (indexCount * 2 > iBuffer->getSize()) {
        iBuffer->resize(indexCount * 2);
    }
    iBuffer->update(_iData);

    setDirty(false);
}

// use less
void UIMeshBuffer::recycleIA(gfx::InputAssembler* ia) {
}

gfx::InputAssembler* UIMeshBuffer::createNewIA(gfx::Device* device) {
    if (_iaPool.empty()) {
        uint32_t vbStride = _vertexFormatBytes = getFloatsPerVertex() * sizeof(float);
        uint32_t ibStride = sizeof(uint16_t);

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
    }
    auto* ia = device->createInputAssembler(_iaInfo);
    _iaPool.emplace_back(ia);

    return ia;
}

void UIMeshBuffer::syncSharedBufferToNative(uint32_t* buffer) {
    _sharedBuffer = buffer;
    parseLayout();
}

void UIMeshBuffer::parseLayout() {
    _meshBufferLayout = reinterpret_cast<MeshBufferLayout*>(_sharedBuffer);
}

void UIMeshBuffer::setByteOffset(uint32_t byteOffset) {
    _meshBufferLayout->byteOffset = byteOffset;
}

void UIMeshBuffer::setVertexOffset(uint32_t vertexOffset) {
    _meshBufferLayout->vertexOffset = vertexOffset;
}

void UIMeshBuffer::setIndexOffset(uint32_t indexOffset) {
    _meshBufferLayout->indexOffset = indexOffset;
}

void UIMeshBuffer::setDirty(bool dirty) const {
    _meshBufferLayout->dirtyMark = dirty ? 1 : 0;
}

void UIMeshBuffer::setFloatsPerVertex(uint32_t floatsPerVertex) {
    _meshBufferLayout->floatsPerVertex = floatsPerVertex;
}
} // namespace cc
