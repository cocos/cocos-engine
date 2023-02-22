#include "GLESCommandStorage.h"
#include "base/Utils.h"

namespace cc::gfx::gles {

uint8_t *CommandStorage::allocate(uint32_t size, uint32_t alignment) {
    uint32_t alignSize = utils::alignTo(size, alignment);
    if (!_storage) {
        _storage = std::make_unique<uint8_t[]>(_blockSize);
    }

    if (_offset + alignSize > _blockSize) {
        return nullptr;
    }
    uint8_t *res = _storage.get() + _offset;
    _offset += size;
    return res;
}

void CommandStorage::reset() {
    _offset = 0;
}

} // namespace cc::gfx::gles
