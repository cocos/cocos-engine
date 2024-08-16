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
#include "base/Log.h"
#include "core/Director.h"
#include "core/Root.h"
#include "core/scene-graph/SceneGraphModuleHeader.h"
#include "gtest/gtest.h"
#include "renderer/GFXDeviceManager.h"
#include "renderer/gfx-base/GFXDef.h"
#include "utils.h"

using namespace cc;
using namespace cc::gfx;

class MyComponent : public Component {
public:
    void onLoad() override {
        CC_LOG_INFO("MyComponent.onLoad");
    }
};

TEST(ComponentTest, isOnLoadCalled) {
    initCocos(100, 100);

    auto *director = Director::getInstance();
    auto *scene    = director->getScene();

    auto *node = new Node();
    auto *comp = node->addComponent<MyComponent>();
    director->getScene()->addChild(node);
    EXPECT_TRUE(comp->isEnabledInHierarchy());
    EXPECT_TRUE(comp->isOnLoadCalled());

    //xwx FIXME: gfx-validator Assert
    destroyCocos();
}
*/
