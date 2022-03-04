/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include <algorithm> // for std::find
#include <vector>

namespace cc {

/**
 * @example
 * ```
 * import { js } from 'cc';
 * var array = [0, 1, 2, 3, 4];
 * var iterator = new js.array.MutableForwardIterator(array);
 * for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
 *     var item = array[iterator.i];
 *     ...
 * }
 * ```
 */
template <typename T>
class MutableForwardIterator {
public:
    explicit MutableForwardIterator(std::vector<T> &array)
    : array(array) {}

    int32_t getLength() const {
        return static_cast<int32_t>(array.size());
    }

    void setLength(int32_t value) {
        if (value < 0) {
            return;
        }

        array.resize(value);
        if (this->i >= value) {
            this->i = value - 1;
        }
    }

    void remove(T value) {
        auto iter = std::find(array.cbegin(), array.cend(), value);
        if (iter != array.cend()) {
            removeAt(iter - array.cbegin());
        }
    }

    void removeAt(int32_t ii) {
        if (ii >= 0 && ii < static_cast<int32_t>(array.size())) {
            array.erase(array.begin() + ii);

            if (ii <= this->i) {
                --this->i;
            }
        }
    }

    void fastRemove(T value) {
        auto iter = std::find(array.cbegin(), array.cend(), value);
        if (iter != array.cend()) {
            fastRemoveAt(iter - array.cbegin());
        }
    }

    void fastRemoveAt(int32_t ii) {
        if (ii >= 0 && ii < static_cast<int32_t>(array.size())) {
            array[ii] = array[array.size() - 1];
            array.resize(array.size() - 1);

            if (ii <= this->i) {
                --this->i;
            }
        }
    }

    void push(T &&item) {
        array.emplace_back(std::forward<T>(item));
    }

    int32_t         i = 0;
    std::vector<T> &array;
};

} // namespace cc

//#define UNIT_TEST 1

#if UNIT_TEST
void MutableForwardIteratorTest();
#endif
