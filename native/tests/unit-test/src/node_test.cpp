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
/*
#include "core/Director.h"
#include "core/Root.h"
#include "core/platform/event-manager/Events.h"
#include "core/scene-graph/SceneGraphModuleHeader.h"
#include "gtest/gtest.h"
#include "renderer/GFXDeviceManager.h"
#include "renderer/gfx-base/GFXDef.h"
#include "utils.h"

using namespace cc;
using namespace cc::event;
using namespace cc::gfx;

namespace {

class MyCallbackTarget {
public:
};

TEST(NodeTest, inverseTransformPoint) {
    initCocos(100, 100);

    auto *director = Director::getInstance();
    auto *scene    = director->getScene();

    auto *parentNode = new Node("");
    auto *subNode    = new Node("");
    parentNode->setPosition(20.F, -30.F, 100.F);
    subNode->setPosition(55, 35, 22);
    parentNode->setParent(scene);
    subNode->setParent(parentNode);
    auto p = Vec3(100.F, 200.F, 0.F);
    subNode->inverseTransformPoint(p, p);

    EXPECT_EQ(p, Vec3(25.F, 195.F, -122.F));

    //xwx FIXME: gfx-validator Assert
    destroyCocos();
}

TEST(NodeTest, activeInHierarchyChanged) {
    // TODO(xwx): need fix Director usage in setActive()
    initCocos(100, 100);
    static CallbackInfoBase::ID id{0};
    static CallbackInfoBase::ID id1{0};
    static CallbackInfoBase::ID id2{0};
    auto *                      director = Director::getInstance();
    auto *                      scene    = director->getScene();
    auto *                      node     = new Node();
    auto                        cb       = [](Node *node) {
        EXPECT_TRUE(node->isActiveInHierarchy());
    };

    node->once(NodeEventType::ACTIVE_IN_HIERARCHY_CHANGED, cb, id);
    scene->addChild(node);
    auto cb1 = [](Node *node) {
        EXPECT_FALSE(node->isActiveInHierarchy());
    };
    node->once(NodeEventType::ACTIVE_IN_HIERARCHY_CHANGED, cb1, id1);
    node->setActive(false);
    node->once(NodeEventType::ACTIVE_IN_HIERARCHY_CHANGED, cb, id);
    node->setActive(true);

    auto *node2 = new Node();
    scene->addChild(node2);
    node2->setActive(false);
    node->once(NodeEventType::ACTIVE_IN_HIERARCHY_CHANGED, cb1, id1);
    node2->addChild(node);

    node->once(NodeEventType::ACTIVE_IN_HIERARCHY_CHANGED, cb, id);
    node->setParent(scene);
    // xwx FIXME: gfx-validator Assert
    destroyCocos();
}
} // namespace
*/
