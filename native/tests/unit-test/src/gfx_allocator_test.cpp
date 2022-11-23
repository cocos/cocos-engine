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

#include "gtest/gtest.h"
#include "gfx-base/memory/TLSFPool.h"

using namespace cc::gfx;

struct TesTData {
    uint32_t a;
    float b;
};

TEST(GfxAllocatorTest, ObjectChunkPoolTest) {
    ObjectChunkPool<TesTData> dataPool(4);

    auto *t1 = dataPool.allocate(TesTData{1U, 2.f});
    {
        ASSERT_EQ(t1->a, 1U);
        ASSERT_EQ(t1->b, 2.f);
    }

    auto *t2 = dataPool.allocate(TesTData{3U, 4.f});
    {
        ASSERT_EQ(t2->a, 3U);
        ASSERT_EQ(t2->b, 4.f);
    }
    dataPool.free(t2);

    auto *t3 = dataPool.allocate(TesTData{5U, 6.f});
    {
        ASSERT_EQ(t2, t3);
        ASSERT_EQ(t3->a, 5U);
        ASSERT_EQ(t3->b, 6.f);
    }
    auto *t4 = dataPool.allocate(TesTData{7U, 8.f});
    auto *t5 = dataPool.allocate(TesTData{7U, 8.f});

    // next chunk
    auto *t6 = dataPool.allocate(TesTData{9U, 10.f});
    {
        ASSERT_EQ(t6->a, 9U);
        ASSERT_EQ(t6->b, 10.f);
    }
    dataPool.free(t4);
    dataPool.free(t5);
    dataPool.free(t6);
    auto *t7 = dataPool.allocate(TesTData{1U, 2.f});
    {
        ASSERT_EQ(t7->a, 1U);
        ASSERT_EQ(t7->b, 2.f);
    }

    auto *t8 = dataPool.allocate(TesTData{3U, 4.f});
    {
        ASSERT_EQ(t8->a, 3U);
        ASSERT_EQ(t8->b, 4.f);
    }

    auto *t9 = dataPool.allocate(TesTData{5U, 6.f});
    {
        ASSERT_EQ(t9->a, 5U);
        ASSERT_EQ(t9->b, 6.f);
    }

    auto *t10 = dataPool.allocate(TesTData{7U, 8.f});
    {
        ASSERT_EQ(t10->a, 7U);
        ASSERT_EQ(t10->b, 8.f);
    }
}

TEST(GfxAllocatorTest, PoolTestMerge) {
    TLSFPool pool;
    pool.initialize({1024});

    auto *a1 = pool.allocate(128, 16);
    {
        ASSERT_EQ(a1->offset, 0);
        ASSERT_EQ(a1->size, 128);
    }

    auto *a2 = pool.allocate(144, 16);
    {
        ASSERT_EQ(a2->offset, 128);
        ASSERT_EQ(a2->size, 144);
    }

    auto *a3 = pool.allocate(512, 16);
    {
        ASSERT_EQ(a3->offset, 272);
        ASSERT_EQ(a3->size, 512);
    }

    pool.free(a2);
    a2 = pool.allocate(144, 16);
    {
        ASSERT_EQ(a2->offset, 128);
        ASSERT_EQ(a2->size, 144);
    }

    pool.free(a2);
    pool.free(a1);
    a1 = pool.allocate(512, 16);
    {
        ASSERT_EQ(a1, nullptr);
    }

    a1 = pool.allocate(272, 16);
    {
        ASSERT_EQ(a1->offset, 0);
        ASSERT_EQ(a1->size, 272);
    }
    pool.free(a1);
    pool.free(a3);

    auto *a4 = pool.allocate(512, 16);
    {
        ASSERT_EQ(a4->offset, 0);
        ASSERT_EQ(a4->size, 512);
    }

    auto *a5 = pool.allocate(512, 16);
    {
        ASSERT_EQ(a5->offset, 512);
        ASSERT_EQ(a5->size, 512);
    }

    auto *a6 = pool.allocate(1, 0);
    {
        ASSERT_EQ(a6, nullptr);
    }
}

TEST(GfxAllocatorTest, PoolTestPadding) {
    TLSFPool pool;
    pool.initialize({1024});

    auto *a1 = pool.allocate(16, 16);
    {
        ASSERT_EQ(a1->offset, 0);
        ASSERT_EQ(a1->size, 16);
    }

    auto *a2 = pool.allocate(512, 16);
    {
        ASSERT_EQ(a2->offset, 16);
        ASSERT_EQ(a2->size, 512);
    }
    pool.free(a2);

    a2 = pool.allocate(512, 256);
    {
        ASSERT_EQ(a2->offset, 256);
        ASSERT_EQ(a2->size, 512);
    }

    auto *a3 = pool.allocate(128, 16);
    {
        ASSERT_EQ(a3->offset, 16);
        ASSERT_EQ(a3->size, 128);
    }

    auto *a4 = pool.allocate(112, 16);
    {
        ASSERT_EQ(a4->offset, 144);
        ASSERT_EQ(a4->size, 112);
    }
    pool.free(a1);
    pool.free(a3);
    pool.free(a4);

    auto *a5 = pool.allocate(256, 256);
    {
        ASSERT_EQ(a5->offset, 0);
        ASSERT_EQ(a5->size, 256);
    }
}
