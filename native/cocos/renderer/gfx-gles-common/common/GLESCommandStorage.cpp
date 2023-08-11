#include "GLESCommandStorage.h"
#include "base/Utils.h"

namespace cc::gfx {

GLESCommandStorage::GLESCommandStorage() {
    allocateStorage();
}

uint8_t *GLESCommandStorage::BlockStorage::allocate(uint32_t size) {
    if (!storage) {
        storage = std::make_unique<uint8_t[]>(blockSize);
    }

    if (offset + size > blockSize) {
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
    _tmpBuffers.clear();
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
    auto alignSize = utils::alignTo(size, alignment);
    if (alignSize > DEFAULT_BLOCK_SIZE) {
        _tmpBuffers.emplace_back(std::make_unique<uint8_t[]>(alignSize));
        return _tmpBuffers.back().get();
    }

    uint8_t *ptr = (*_iterator)->allocate(alignSize);
    if (ptr == nullptr) {
        _iterator++;
        if (_iterator == _storages.end()) {
            allocateStorage();
        }
        ptr = (*_iterator)->allocate(alignSize);
        CC_ASSERT(ptr != nullptr);
    }
    return ptr;
}

} // namespace cc::gfx
