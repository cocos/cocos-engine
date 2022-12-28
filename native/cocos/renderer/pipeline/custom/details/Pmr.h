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
#include <boost/container/pmr/global_resource.hpp>
#include <boost/container/pmr/polymorphic_allocator.hpp>
#include <boost/container/pmr/unsynchronized_pool_resource.hpp>
#include <memory>

namespace cc {

namespace render {

template <class T>
struct PmrDeallocator {
    void operator()(T* ptr) noexcept {
        mAllocator.deallocate(ptr, 1);
    }
    boost::container::pmr::polymorphic_allocator<T> mAllocator;
};

template <class T, class... Args>
[[nodiscard]] T*
newPmr(boost::container::pmr::memory_resource* mr, Args&&... args) {
    boost::container::pmr::polymorphic_allocator<T> alloc(mr);

    std::unique_ptr<T, PmrDeallocator<T>> ptr{
        alloc.allocate(1), PmrDeallocator<T>{alloc}};

    // construct, might throw
    alloc.construct(ptr.get(), std::forward<Args>(args)...);

    return ptr.release();
}

struct PmrDeleter {
    template <class T>
    void operator()(T* ptr) const noexcept {
        if (ptr) {
            boost::container::pmr::polymorphic_allocator<T> alloc(ptr->get_allocator());
            ptr->~T();
            alloc.deallocate(ptr, 1);
        }
    }
};

template <class T>
using PmrUniquePtr = std::unique_ptr<T, PmrDeleter>;

template <class T, class... Args>
PmrUniquePtr<T>
allocatePmrUniquePtr(const boost::container::pmr::polymorphic_allocator<std::byte>& alloc, Args&&... args) {
    return PmrUniquePtr<T>(newPmr<T>(alloc.resource(), std::forward<Args>(args)...));
}

} // namespace render

} // namespace cc
