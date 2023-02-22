/****************************************************************************
Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#include "gtest/gtest.h"
#include "gfx-base/allocator/Allocator.h"

TEST(GFXAllocatorTest, TestAllocateLimitExceeded) {

    cc::gfx::AllocatorInfo info;
    info.blockSize = 256;

    cc::gfx::Allocator allocator(info);
    auto handle1 = allocator.allocate(512, 4);
    ASSERT_EQ(handle1, cc::gfx::Allocator::INVALID_HANDLE);
}

TEST(GFXAllocatorTest, TestAllocateFree) {

    cc::gfx::AllocatorInfo info;
    info.blockSize = 256;

    cc::gfx::Allocator allocator(info);
    auto handle1 = allocator.allocate(1, 128);
    {
        auto *allocation = allocator.getAllocation(handle1);
        ASSERT_EQ(allocation->blockIndex, 0);
        ASSERT_EQ(allocation->offset, 0);
        ASSERT_EQ(allocation->size, 128);
    }

    auto handle2 = allocator.allocate(2, 128);
    {
        auto *allocation = allocator.getAllocation(handle2);
        ASSERT_EQ(allocation->blockIndex, 0);
        ASSERT_EQ(allocation->offset, 128);
        ASSERT_EQ(allocation->size, 128);
    }

    auto handle3 = allocator.allocate(3, 128);
    {
        auto *allocation = allocator.getAllocation(handle3);
        ASSERT_EQ(allocation->blockIndex, 1);
        ASSERT_EQ(allocation->offset, 0);
        ASSERT_EQ(allocation->size, 128);
    }

    allocator.free(handle2);
    auto handle4 = allocator.allocate(4, 128);
    {
        auto *allocation = allocator.getAllocation(handle4);
        ASSERT_EQ(allocation->blockIndex, 0);
        ASSERT_EQ(allocation->offset, 128);
        ASSERT_EQ(allocation->size, 128);
    }

    auto handle5 = allocator.allocate(256, 4);
    {
        auto *allocation = allocator.getAllocation(handle5);
        ASSERT_EQ(allocation->blockIndex, 2);
        ASSERT_EQ(allocation->offset, 0);
        ASSERT_EQ(allocation->size, 256);
    }

    auto handle6 = allocator.allocate(64, 4);
    {
        auto *allocation = allocator.getAllocation(handle6);
        ASSERT_EQ(allocation->blockIndex, 1);
        ASSERT_EQ(allocation->offset, 128);
        ASSERT_EQ(allocation->size, 64);
    }

    allocator.free(handle3);
    auto handle7 = allocator.allocate(64, 4);
    {
        auto *allocation = allocator.getAllocation(handle7);
        ASSERT_EQ(allocation->blockIndex, 1);
        ASSERT_EQ(allocation->offset, 0);
        ASSERT_EQ(allocation->size, 128);
    }
}
