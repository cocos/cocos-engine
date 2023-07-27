#include "GLESCommandStorage.h"
#include "base/Utils.h"

namespace cc::gfx {

uint8_t *GLESCommandStorage::BlockStorage::allocate(uint32_t size, uint32_t alignment) {
    auto alignSize = utils::alignTo(size, alignment);
    if (!storage) {
        storage = std::make_unique<uint8_t[]>(blockSize);
    }

    if (offset + alignSize > blockSize) {
        return nullptr;
    }
    uint8_t *res = storage.get() + offset;
    offset += size;
    return res;
}

void GLESCommandStorage::BlockStorage::reset() {
    offset = 0;
}

void GLESCommandStorage::allocateStorage() {
    auto storage = std::make_unique<BlockStorage>();
    storage->offset = 0;
    storage->blockSize = DEFAULT_BLOCK_SIZE;
    _iterator = _storages.emplace(_iterator, std::move(storage));
}

void GLESCommandStorage::reset() {
    for (auto &storage : _storages) {
        storage->reset();
    }
    _iterator = _storages.begin();
    _head = nullptr;
    _current = &_head;
}

void GLESCommandStorage::execute() {
    while (_head != nullptr) {
        auto *ptr = _head->next;
        _head->execute();
        _head->~CmdBase();
        _head = ptr;
    }
}

uint8_t* GLESCommandStorage::allocate(uint32_t size, uint32_t alignment) {
    uint8_t *ptr = (*_iterator)->allocate(size, alignment);
    if (ptr == nullptr) {
        _iterator++;
        if (_iterator == _storages.end()) {
            allocateStorage();
        }
        ptr = (*_iterator)->allocate(size, alignment);
    }
    return ptr;
}

} // namespace cc::gfx
