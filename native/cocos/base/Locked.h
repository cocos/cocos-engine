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

#include <memory>

namespace cc {

template <class T, class LK>
class UniqueLockedRef {
public:
    UniqueLockedRef(T *t, LK *mtx) : _data(t), _mtx(mtx) {
        _mtx->lock();
    }
    UniqueLockedRef(UniqueLockedRef &&t) noexcept {
        _data   = t._data;
        _mtx    = t._mtx;
        t._data = nullptr;
        t._mtx  = nullptr;
    }

    UniqueLockedRef &operator=(UniqueLockedRef &&t) noexcept {
        _data   = t._data;
        _mtx    = t._mtx;
        t._data = nullptr;
        t._mtx  = nullptr;
        return *this;
    }

    UniqueLockedRef(const T &t) = delete;
    UniqueLockedRef &operator=(const UniqueLockedRef &) = delete;

    ~UniqueLockedRef() {
        if (_mtx) {
            _mtx->unlock();
        }
    }

    T *operator->() {
        return _data;
    }
    T &operator*() {
        return *_data;
    }

private:
    T * _data{};
    LK *_mtx{};
};

template <class T, class LK>
class Locked {
public:
    Locked()                       = default;
    Locked(const Locked &)         = delete;
    Locked(Locked &&)              = delete;
    Locked &               operator=(const Locked &) = delete;
    Locked &               operator=(Locked &&) = delete;
    UniqueLockedRef<T, LK> lock() {
        UniqueLockedRef<T, LK> ref(&_data, &_mutex);
        return std::move(ref);
    }

private:
    LK _mutex{};
    T  _data{};
};

} // namespace cc