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
#include "cocos/audio/graph_based/AudioContext.h"
#include "cocos/audio/graph_based/AudioBuffer.h"
#include "cocos/audio/graph_based/SourceNode.h"
#include "cocos/platform/FileUtils.h"

#include "cocos/base/std/container/string.h"
#include "utils.h"
#include "cocos/base/Ptr.h"
#include "gtest/gtest.h"
#include <iostream>

TEST(audioTest, source_node_basic_test) {
    logLabel = "Testing AudioContext establishment";
    cc::IntrusivePtr<cc::AudioContext> ctx = new cc::AudioContext();
    ExpectEq(ctx->isValid(), true);
    logLabel = "Testing AudioContext decode audio functionnality";
    
    cc::createFileUtils();

    // // Boundary test, should be an invalid buffer but should not throw the error. Should uncommont the code and see assertion failed
    // cc::IntrusivePtr<cc::AudioBuffer> emptyBuffer = ctx->decodeAudioDataFromUrl("");
    // bool bufferIsNull = (emptyBuffer == nullptr);
    // ExpectEq(bufferIsNull, true);

    ccstd::string audioPath = "effect.mp3";
    auto fullPath = cc::FileUtils::getInstance()->fullPathForFilename(audioPath);
    cc::AudioBuffer* buffer = ctx->decodeAudioDataFromUrl(audioPath);
    bool busIsValid = (buffer->getBus() != nullptr);
    ExpectEq(busIsValid, true);
    std::cout << "context refcount should be 2, which is " << ctx->getRefCount() << std::endl; // test area, destination node
    ExpectEq(IsEqualF(ctx->getRefCount(), 2), true); 
    
    {
        // Boundary test, soure node with an empty buffer should not be played, and print error log.
        cc::IntrusivePtr<cc::SourceNode> node = new cc::SourceNode(ctx);
        node->connect(ctx->getDestination());
        bool ret = node->start(0);
        ExpectEq(ret, false);
        node->setBuffer(buffer);
        ret = node->start(0);
        ExpectEq(ret, true);
        // Expect buffer and node in use has a ref count more than 1.
        std::cout << "context refcount should be 3, which is " << ctx->getRefCount() << std::endl; // test area, destination node
        ExpectEq(IsEqualF(ctx->getRefCount(), 3), true); //  test area, destination node, source node
        std::cout << "buffer refcount should be 1, which is " << buffer->getRefCount() << std::endl; // test area, destination node
        ExpectEq(IsEqualF(buffer->getRefCount(), 1), true);
    }
    // Memory test, out of area, the context ref count should back to 1.
    std::cout << "context refcount should be 2, which is " << ctx->getRefCount() << std::endl; // test area, destination node
    ExpectEq(IsEqualF(ctx->getRefCount(), 2), true);
    ctx->close();
    std::cout << "context refcount should be 1, which is " << ctx->getRefCount() << std::endl; // test area, destination node
    ExpectEq(IsEqualF(ctx->getRefCount(), 1), true);
}