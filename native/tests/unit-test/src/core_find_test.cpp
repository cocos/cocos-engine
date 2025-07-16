/****************************************************************************
Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

http://www.cocos.com

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
/*
#include "core/Director.h"
#include "core/Root.h"
#include "core/scene-graph/SceneGraphModuleHeader.h"
#include "gtest/gtest.h"
#include "renderer/GFXDeviceManager.h"
#include "renderer/gfx-base/GFXDef.h"
#include "utils.h"

using namespace cc;
using namespace cc::gfx;

TEST(CoreFindTest, test0) {
    initCocos(100, 100);

    auto *director = Director::getInstance();
    auto *scene    = director->getScene();

    auto *node = new Node("test");
    scene->addChild(node);

    EXPECT_EQ(find("/test"), node);
    EXPECT_EQ(find("test"), node);

    auto *node2 = new Node(".赞");
    scene->addChild(node2);

    EXPECT_EQ(find("/.赞"), node2);
    EXPECT_EQ(find(".赞"), node2);

    auto *nodenode = new Node("");
    scene->addChild(nodenode);

    //cjh TODO: Creator 2.x return node or nullptr but 3.x return scene, which one is correct?
    EXPECT_EQ(find("/"), scene);
    EXPECT_EQ(find(""), scene);

    auto *node2node2 = new Node("Jare Guo");
    node2->addChild(node2node2);

    EXPECT_EQ(find("/.赞/Jare Guo"), node2node2);
    EXPECT_EQ(find(".赞/Jare Guo"), node2node2);
    EXPECT_EQ(find("Jare Guo", node2), node2node2);

    auto *ent2ent2ent2 = new Node("FOO");
    node2node2->addChild(ent2ent2ent2);
    EXPECT_EQ(find("Jare Guo/FOO", node2), ent2ent2ent2);

    //cjh FIXME: crash if invoke
    destroyCocos();
}
*/
