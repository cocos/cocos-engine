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

#include "core/scene-graph/Node.h"
#include "gtest/gtest.h"
#include "utils.h"

using namespace cc;

namespace {

TEST(NodeTest, setSliblingIndex) {
    IntrusivePtr<Node> parent = new Node("");
    IntrusivePtr<Node> child0 = new Node("child0");
    IntrusivePtr<Node> child1 = new Node("child1");
    IntrusivePtr<Node> child2 = new Node("child2");
    parent->addChild(child0);
    parent->addChild(child1);
    parent->addChild(child2);

    child0->setSiblingIndex(1);
    ExpectEq(child0->getSiblingIndex() == 1, true);
    ExpectEq(child1->getSiblingIndex() == 0, true);
    ExpectEq(child2->getSiblingIndex() == 2, true);

    child0->setSiblingIndex(-1);
    ExpectEq(child0->getSiblingIndex() == 2, true);
    ExpectEq(child1->getSiblingIndex() == 0, true);
    ExpectEq(child2->getSiblingIndex() == 1, true);

    child0->setSiblingIndex(5);
    ExpectEq(child0->getSiblingIndex() == 2, true);
    ExpectEq(child1->getSiblingIndex() == 0, true);
    ExpectEq(child2->getSiblingIndex() == 1, true);
}

} // namespace
