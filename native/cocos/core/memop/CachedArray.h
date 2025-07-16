/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include <string.h>
#include <climits>
#include "base/Object.h"
#include "base/TypeDef.h"
#include "base/memory/Memory.h"

namespace cc {

template <typename T>
class CachedArray final {
public:
    explicit CachedArray(uint size = 1U) {
        _size = 0;
        _capacity = std::max(size, 1U);
        _array = ccnew T[_capacity];
    }

    // The rule of five applies here
    ~CachedArray() {
        CC_SAFE_DELETE_ARRAY(_array);
    }

    CachedArray(const CachedArray &other)
    : _size(other._size), _capacity(other._capacity), _array(ccnew T[other._capacity]) {
        memcpy(_array, other._array, _size * sizeof(T));
    }

    CachedArray &operator=(const CachedArray &other) {
        if (this != &other) {
            delete[] _array;
            _size = other._size;
            _capacity = other._capacity;
            _array = ccnew T[_capacity];
            memcpy(_array, other._array, _size * sizeof(T));
        }
        return *this;
    }

    CachedArray(CachedArray &&other) noexcept : _size(other._size), _capacity(other._capacity), _array(other._array) {
        other._size = 0;
        other._capacity = 0;
        other._array = nullptr;
    }

    CachedArray &operator=(CachedArray &&other) noexcept {
        if (this != &other) {
            delete[] _array;
            _size = other._size;
            _capacity = other._capacity;
            _array = other._array;
            other._size = 0;
            other._capacity = 0;
            other._array = nullptr;
        }
        return *this;
    }

    // Subscription operators
    T &operator[](uint index) {
        return _array[index];
    }

    const T &operator[](uint index) const {
        return _array[index];
    }

    inline void clear() { _size = 0; }
    inline uint size() const { return _size; }
    inline T pop() { return _array[--_size]; }

    void reserve(uint size) {
        if (size > _capacity) {
            T *temp = _array;
            _array = ccnew T[size];
            memcpy(_array, temp, _capacity * sizeof(T));
            _capacity = size;
            delete[] temp;
        }
    }

    void push(T item) {
        if (_size >= _capacity) {
            T *temp = _array;
            _array = ccnew T[_capacity * 2];
            memcpy(_array, temp, _capacity * sizeof(T));
            _capacity *= 2;
            delete[] temp;
        }
        _array[_size++] = item;
    }

    void concat(const CachedArray<T> &array) {
        if (_size + array._size > _capacity) {
            T *temp = _array;
            uint size = std::max(_capacity * 2, _size + array._size);
            _array = ccnew T[size];
            memcpy(_array, temp, _size * sizeof(T));
            _capacity = size;
            delete[] temp;
        }
        memcpy(_array + _size, array._array, array._size * sizeof(T));
        _size += array._size;
    }

    void concat(T *array, uint count) {
        if (_size + count > _capacity) {
            T *temp = _array;
            uint size = std::max(_capacity * 2, _size + count);
            _array = ccnew T[size];
            memcpy(_array, temp, _size * sizeof(T));
            _capacity = size;
            delete[] temp;
        }
        memcpy(_array + _size, array, count * sizeof(T));
        _size += count;
    }

    void fastRemove(uint idx) {
        if (idx >= _size) {
            return;
        }
        _array[idx] = _array[--_size];
    }

    uint indexOf(T item) {
        for (uint i = 0; i < _size; ++i) {
            if (_array[i] == item) {
                return i;
            }
        }
        return UINT_MAX;
    }

private:
    uint _size = 0;
    uint _capacity = 0;
    T *_array = nullptr;
};

} // namespace cc
