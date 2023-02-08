#pragma once

#include <memory>

namespace cc::gfx::gles {

class CommandStorage {
public:
    CommandStorage(uint32_t size) : _blockSize(size) {}
    ~CommandStorage() = default;

    uint8_t *allocate(uint32_t size, uint32_t alignment);
    void reset();

private:
    uint32_t _blockSize;
    uint32_t _offset = 0;
    std::unique_ptr<uint8_t[]> _storage;
};

} // namespace cc::gfx::gles
