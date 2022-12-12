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

#include "base/Macros.h"

namespace {
bool compile_assertions(bool returns) {
    if (returns) return true;

    CC_ASSERT(true);
    CC_ASSERT(1 == 1);
    CC_ASSERT_TRUE(true);
    CC_ASSERT_FALSE(false);
    CC_ASSERT_EQ(1, 3 / 3);
    CC_ASSERT_NE(1, 4);

    CC_ASSERTF(true, "hello");
    CC_ASSERTF(true, "hello %s", "world");
    CC_ASSERTF_EQ(1, 1, "hello");
    CC_ASSERTF_EQ(1, 1, "hello %s", "world");

    CC_ASSERTF_NE(1, 1, "hello");
    CC_ASSERTF_NE(1, 1, "hello %s", "world");
    CC_ASSERTF_NULL(nullptr, "hello");
    CC_ASSERTF_NOT_NULL(nullptr, "hello");
    CC_ASSERTF_EQ(1, 1, "hello %s", "world");
    CC_ASSERTF_NE(1, 1, "hello %s", "world");

    CC_ABORT();
    CC_ABORTF("hello");
    CC_ABORTF("hello %s", "world");

    return false;
}
} // namespace

TEST(CC_ASSERT, test_compile) {
    EXPECT_EQ(compile_assertions(true), true);
}