/****************************************************************************
Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
#include "GFXDeviceManager.h"
#include "gfx-base/GFXDynamicBuffer.h"


class GFXTest : public ::testing::Test {
public:
    static cc::gfx::Device *device;

    static void SetUpTestSuite()
    {
        device = cc::gfx::DeviceManager::create();
    }

    static void TearDownTestSuite()
    {
        CC_SAFE_DESTROY_AND_DELETE(device);
    }
};

cc::gfx::Device *GFXTest::device = nullptr;

struct TestUBO {
    float a;
    int b;
};

TEST_F(GFXTest, DynamicBufferTest) {

    cc::gfx::DynamicBufferInfo info = {};
    info.usage = cc::gfx::BufferUsageBit::NONE;
    info.size = 128;

    cc::IntrusivePtr<cc::gfx::DynamicBuffer> dynamicBuffer = device->createDynamicBuffer(info);
    const TestUBO *uboData = reinterpret_cast<const TestUBO*>(dynamicBuffer->getData());

    dynamicBuffer->write(1.f, offsetof(TestUBO, a));
    dynamicBuffer->write(2, offsetof(TestUBO, b));

    ASSERT_EQ(uboData[dynamicBuffer->getCurrentIndex()].a, 1.f);
    ASSERT_EQ(uboData[dynamicBuffer->getCurrentIndex()].b, 2);

    dynamicBuffer->swapBuffer();
    dynamicBuffer->write(3.f, offsetof(TestUBO, a));
    dynamicBuffer->write(4, offsetof(TestUBO, b));

    ASSERT_EQ(uboData[dynamicBuffer->getCurrentIndex()].a, 3.f);
    ASSERT_EQ(uboData[dynamicBuffer->getCurrentIndex()].b, 4);

    dynamicBuffer->flush();
}
