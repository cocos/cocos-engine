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

#include "Allocator.h"

namespace cc::gfx {

Allocator::Allocator(const AllocatorInfo& info) : _info(info) {
}

MemoryView * Allocator::allocate(uint64_t size, uint64_t alignment) {
    for (uint32_t i = 0; i < _pools.size(); ++i) {
        if (auto *view = _pools[i].allocate(size, alignment); view != nullptr) {
            view->memoryIndex = i;
            return view;
        }
    }
    allocateMemory();
    auto *view = _pools.back().allocate(size, alignment);
    if (view != nullptr) {
        view->memoryIndex = static_cast<uint32_t>(_pools.size()) - 1;
    }
    return view;
}

void Allocator::free(MemoryView *view) {
    if (view == nullptr || view->memoryIndex >= static_cast<uint32_t>(_pools.size())) {
        return;
    }
    _pools[view->memoryIndex].free(static_cast<TLSFPool::Block*>(view));
}

void Allocator::setMemoryImpl(IMemory *impl) {
    _impl = impl;
}

void Allocator::allocateMemory() {
    if (_impl != nullptr) {
        _impl->allocate();
    }
    TLSFPool pool;
    pool.initialize({_info.chunkSize});

    _pools.emplace_back(std::move(pool));
}

} // namespace cc::gfx