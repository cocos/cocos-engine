/****************************************************************************
Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

http://www.cocos.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated engine source code (the "Software"), a limited,
worldwide, royalty-free, non-assignable, revocable and non-exclusive license
to use Cocos Creator solely to develop games on your target platforms. You shall
not use Cocos Creator software for developing other software or tools that's
used for developing games. You are not granted to publish, distribute,
sublicense, and/or sell copies of Cocos Creator.

The software or tools in this License Agreement are licensed, not sold.
Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/

#pragma once

#include <cstdint>
#include <base/Macros.h>
#include <base/std/container/vector.h>

namespace cc::gfx {

template <typename U>
struct LinkedData {
    U data;
    LinkedData *next = nullptr;
};

/**
 * @tparam T container's element type
 * @en Linear storage for elements.
 * Allocation order:
 * 1. allocate from freelist.
 * 2. append a new element to the end of the container.
 */
template <typename T>
class ObjectChunkPool {
public:
    explicit ObjectChunkPool(uint32_t objectPerChunk) : _numberPerChunk(objectPerChunk), _currentObjectNum(0), _capacity(0) {
    }

    ~ObjectChunkPool() = default;

    ObjectChunkPool(const ObjectChunkPool&) = delete;
    ObjectChunkPool &operator=(const ObjectChunkPool&) = delete;

    ObjectChunkPool(ObjectChunkPool&&) noexcept = default;
    ObjectChunkPool &operator=(ObjectChunkPool&&) noexcept = default;

    using Data = LinkedData<T>;

    /**
     * @en allocate an object with construct parameters.
     * @tparam Args argument types.
     * @param args arguments to forward to the constructor of the element.
     * @return allocation result
     */
    template <typename ...Args>
    T* allocate(Args && ...args) {
        T* ptr = nullptr;
        if (freeList != nullptr) {
            ptr = &freeList->data;
            freeList = freeList->next;
        } else {
            if (_currentObjectNum == _capacity) {
                allocateChunk();
            }
            uint32_t index = _currentObjectNum / _numberPerChunk;
            uint32_t offset = _currentObjectNum % _numberPerChunk;
            ++_currentObjectNum;

            ptr = reinterpret_cast<T*>(&_storages[index].data[offset * sizeof(Data)]);
        }
        new (ptr) T(std::forward<T>(args)...);
        return ptr;
    }

    /**
     * @en free an object. Appends to the end of freelist.
     * @param data Data to be freed.
     */
    void free(T *data) {
        if (data != nullptr) {
            data->~T();
            Data* ptr = reinterpret_cast<Data*>(data);
            ptr->next = freeList;
            freeList = ptr;
        }
    }

private:
    struct Chunk {
        ccstd::vector<uint8_t> data;
    };

    void allocateChunk() {
        auto &back = _storages.emplace_back();
        back.data.resize(_numberPerChunk * sizeof(Data));
        _capacity = static_cast<uint32_t>(_storages.size() * _numberPerChunk);
    }

    uint32_t _numberPerChunk;
    uint32_t _currentObjectNum;
    uint32_t _capacity;
    ccstd::vector<Chunk> _storages;
    Data *freeList = nullptr;
};

} // namespace cc::gfx
