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
#include "gfx-base/GFXBuffer.h"


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

    cc::gfx::BufferInfo info = {};
    info.usage = cc::gfx::BufferUsageBit::UNIFORM;
    info.memUsage = cc::gfx::MemoryUsageBit::HOST | cc::gfx::MemoryUsageBit::DEVICE;
    info.size = 128;
    info.flags = cc::gfx::BufferFlagBit::ENABLE_STAGING_WRITE;

    cc::IntrusivePtr<cc::gfx::Buffer> dynamicBuffer = device->createBuffer(info);

    auto writer = dynamicBuffer->createWriter<TestUBO>();
    writer->a = 1.f;
    writer->b = 2;

    const TestUBO *uboData = reinterpret_cast<const TestUBO*>(dynamicBuffer->getStagingAddress());
    ASSERT_NE(uboData, nullptr);
    ASSERT_EQ(uboData->a, 1.f);
    ASSERT_EQ(uboData->b, 2);

    dynamicBuffer->update();
}
