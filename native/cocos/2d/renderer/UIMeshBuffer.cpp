#include <2d/renderer/UIMeshBuffer.h>
#include <gfx-base/GFXDevice.h>
#include <vector>

namespace cc {
UIMeshBuffer::UIMeshBuffer(/* args */) {
    gfx::AttributeList vfmtPosUvColor = {
        gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
        gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
        gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA32F},
    };

    for (index_t i = 0; i < vfmtPosUvColor.size(); i++) {
        _attributes.push_back(&vfmtPosUvColor[i]);
    }
}

UIMeshBuffer::~UIMeshBuffer() {
}

void UIMeshBuffer::setVData(float_t* vData) {
    _vData = vData;
}

void UIMeshBuffer::setIData(uint16_t* iData) {
    _iData = iData;
}

void UIMeshBuffer::initialize(gfx::Device* device, std::vector<gfx::Attribute*>&& attrs, index_t vFloatCount, index_t iCount) {
    //_initVDataCount = vFloatCount;
    //_initIDataCount = iCount;
    //_attributes = std::move(attrs);
    //if (!_vData || !_iData) {
    //    _vData = new float[_initVDataCount];
    //    _iData = new uint16_t[_initIDataCount];
    //    _needDeleteVData = true;
    //} else {
    //    _needDeleteVData = false;
    //}

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
    if (_meshBufferLayout == nullptr || getByteOffset() == 0 || !getDirty() || this->_iaPool.size() == 0) {
        return;
    }

    // copy from ts, to be considered
    //const iOS14 = sys.__isWebIOS14OrIPadOS14Env;
    //const submitCount = iOS14 ? this._nextFreeIAHandle : 1;

    index_t indexCount = this->getIndexOffset();
    index_t byteCount = this->getByteOffset();
    index_t dataCount = byteCount >> 2;

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
        uint32_t vbStride = _vertexFormatBytes = getFloatsPerVertex() * sizeof(float); //??
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

        std::vector<gfx::Attribute> temp;
        for (int i = 0; i < _attributes.size(); i++) {
            temp.push_back(*_attributes[i]);
        }
        _iaInfo.attributes = temp;

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

void UIMeshBuffer::setByteOffset(index_t byteOffset) {
    _meshBufferLayout->byteOffset = byteOffset;
}

void UIMeshBuffer::setVertexOffset(index_t vertexOffset) {
    _meshBufferLayout->vertexOffset = vertexOffset;
}

void UIMeshBuffer::setIndexOffset(index_t indexOffset) {
    _meshBufferLayout->indexOffset = indexOffset;
}

void UIMeshBuffer::setDirty(bool dirty) {
    _meshBufferLayout->dirtyMark = dirty ? 1 : 0;
}

void UIMeshBuffer::setFloatsPerVertex(index_t floatsPerVertex) {
    _meshBufferLayout->floatsPerVertex = floatsPerVertex;
}
} // namespace cc
