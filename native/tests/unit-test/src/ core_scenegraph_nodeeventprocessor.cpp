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

template <typename T>
struct FunctionTraits
: public FunctionTraits<decltype(&T::operator())> {};

template <typename ClassType, typename ReturnType, typename... Args>
struct FunctionTraits<ReturnType (ClassType::*)(Args...) const> {
    typedef std::function<ReturnType(Args...)> type;
};

template <typename ClassType, typename ReturnType, typename... Args>
struct FunctionTraits<ReturnType (ClassType::*)(Args...)> {
    typedef std::function<ReturnType(Args...)> type;
};

template <typename T>
typename FunctionTraits<T>::type toFunction(T l) {
    return static_cast<typename FunctionTraits<T>::type>(l);
}

} // namespace

template <typename... Args>
class TestFunctor final {
public:
    using Fn = std::function<void(Args...)>;

    TestFunctor(Fn &&cb)
    : _cb(std::forward<Fn>(cb)) {
    }

    template <typename Lambda>
    TestFunctor(const Lambda &cb) {
        _cb = toFunction(cb);
    }

    void operator()(Args &&...args) {
        _cb(std::forward<Args>(args)...);
        *_calledCount = *_calledCount + 1;
    }

    uint32_t getCalledCount() const {
        return *_calledCount;
    }

    void clear() {
        *_calledCount = 0;
    }

private:
    Fn                        _cb;
    std::shared_ptr<uint32_t> _calledCount{std::make_shared<uint32_t>(0)};
};

TEST(CoreNodeEventProcessor, remove_and_add_again_during_invoking) {
    auto *      node            = new Node();
    static bool callbackInvoked = false;
    callbackInvoked             = false;
    class MyTarget : public CCObject {
    public:
        MyTarget(Node *node) : _node{node} {}
        void onEvent(cc::event::Event *event) {
            _node->off("eve", &MyTarget::onEvent, this);
            EXPECT_FALSE(_node->hasEventListener("eve", &MyTarget::onEvent, this));
            _node->on("eve", &MyTarget::onEvent, this);
            callbackInvoked = true;
        }

    private:
        Node *_node;
    };

    MyTarget target{node};

    node->on("eve", &MyTarget::onEvent, &target);
    EXPECT_TRUE(node->hasEventListener("eve", &MyTarget::onEvent, &target));

    EventCustom event{"eve"};
    node->dispatchEvent(&event);

    EXPECT_TRUE(callbackInvoked);
    EXPECT_TRUE(node->hasEventListener("eve", &MyTarget::onEvent, &target));

    delete node;
}

TEST(CoreNodeEventProcessor, remove_twice_and_add_again_during_invoking) {
    auto *      node            = new Node();
    static bool callbackInvoked = false;
    callbackInvoked             = false;
    class MyTarget : public CCObject {
    public:
        MyTarget(Node *node) : _node{node} {}
        void onEvent(cc::event::Event *event) {
            _node->off("eve", &MyTarget::onEvent, this);
            EXPECT_FALSE(_node->hasEventListener("eve", &MyTarget::onEvent, this));
            _node->off("eve", &MyTarget::onEvent, this);
            EXPECT_FALSE(_node->hasEventListener("eve", &MyTarget::onEvent, this));
            _node->on("eve", &MyTarget::onEvent, this);
            EXPECT_TRUE(_node->hasEventListener("eve", &MyTarget::onEvent, this));
            callbackInvoked = true;
        }

    private:
        Node *_node;
    };

    MyTarget target{node};

    node->on("eve", &MyTarget::onEvent, &target);
    EXPECT_TRUE(node->hasEventListener("eve", &MyTarget::onEvent, &target));

    EventCustom event{"eve"};
    node->dispatchEvent(&event);

    EXPECT_TRUE(callbackInvoked);
    EXPECT_TRUE(node->hasEventListener("eve", &MyTarget::onEvent, &target));

    delete node;
}

TEST(CoreNodeEventProcessor, remove_and_check_has_during_invoking) {
    auto *node = new Node();
    class MyTarget : public CCObject {
    public:
        MyTarget(Node *node) : _node{node} {}
        void onEvent(cc::event::Event *event) {
            _node->off("eve", &MyTarget::onEvent, this);
            EXPECT_FALSE(_node->hasEventListener("eve", &MyTarget::onEvent, this));
        }

    private:
        Node *_node;
    };

    MyTarget target{node};

    node->on("eve", &MyTarget::onEvent, &target);
    EXPECT_TRUE(node->hasEventListener("eve", &MyTarget::onEvent, &target));
    EventCustom event{"eve"};
    node->dispatchEvent(&event);
    EXPECT_FALSE(node->hasEventListener("eve", &MyTarget::onEvent, &target));

    delete node;
}

TEST(CoreNodeEventProcessor, remove_self_during_invoking_node) {
    static CallbackInfoBase::ID id1{0};
    static CallbackInfoBase::ID id2{0};

    auto *        node = new Node();
    TestFunctor<> cb1{[&node]() {
        node->off("LambdaType", id1);
        CC_LOG_DEBUG("Test remove_self_during_invoking_node");
    }};
    TestFunctor<> cb2{[]() {}};
    node->on("LambdaType", cb1, id1);
    node->on("LambdaType", cb2, id2);
    node->emit("LambdaType");
    EXPECT_EQ(cb2.getCalledCount(), 1);
    EXPECT_EQ(cb1.getCalledCount(), 1);
    node->emit("LambdaType");
    EXPECT_EQ(cb1.getCalledCount(), 1);
    EXPECT_EQ(cb2.getCalledCount(), 2);

    delete node;
}

//////// test LambdaType
TEST(CoreNodeEventProcessor, test_lambda) {
    static CallbackInfoBase::ID id1{0};
    static CallbackInfoBase::ID id2{0};

    auto *node = new Node();
    // test on
    node->on(
        "hello", [](int a) {
            CC_LOG_DEBUG("hello callback, a: %d", a);
        },
        id1);
    EXPECT_TRUE(node->hasEventListener("hello", id1));

    // test emit
    node->emit("hello", 1);
    node->emit("hello", 2);
    // test off
    node->off("hello", id1);
    EXPECT_FALSE(node->hasEventListener("hello", id1));

    // test once
    node->once(
        "helloOnce", [](int b) {
            CC_LOG_DEBUG("hello callback only once, b: %d", b);
        },
        id2);

    EXPECT_TRUE(node->hasEventListener("helloOnce", id2));
    node->emit("helloOnce", 1);
    EXPECT_FALSE(node->hasEventListener("helloOnce", id2));

    delete node;
}

//////// test memberFunction
TEST(CoreNodeEventProcessor, test_memberFunction) {
    auto *node = new Node();

    static int ccc;
    class MyTarget : public CCObject {
    public:
        MyTarget(Node *node) : _node{node} {}

        void foo(int a, float b, int *c) {
            EXPECT_EQ(a, 1);
            EXPECT_TRUE(IsEqualF(b, 2.3F));
            EXPECT_EQ(c, &ccc);
            EXPECT_EQ(magic, 1234);
            CC_LOG_DEBUG("test memberFunction MyTarget::foo");
        }

    private:
        Node *_node;
        int   magic = 1234;
    };
    // test on
    MyTarget target{node};
    node->on("hello", &MyTarget::foo, &target);
    EXPECT_TRUE(node->hasEventListener("hello", &MyTarget::foo, &target));

    node->emit("hello", 1, 2.3F, &ccc);

    //off
    node->off("hello", &MyTarget::foo, &target);
    EXPECT_FALSE(node->hasEventListener("hello", &MyTarget::foo, &target));

    //once
    node->once("helloOnce", &MyTarget::foo, &target);
    EXPECT_TRUE(node->hasEventListener("helloOnce", &MyTarget::foo, &target));
    node->emit("helloOnce", 1, 2.3F, &ccc);
    EXPECT_FALSE(node->hasEventListener("helloOnce", &MyTarget::foo, &target));

    delete node;
}

//////// test std::function<void(Args...)>
TEST(CoreNodeEventProcessor, test_function_args) {
    //   CallbacksInvoker     ci;
    auto *               node = new Node();
    CallbackInfoBase::ID id1_not_target1{0}, id1_not_target2{0}, id1_target11{0}, id1_target22{0}, id1_b1{0}, id2{0}, id21{0}, id22{0}, id3{0}, id31{0}, id32{0};

    static uint32_t myTargetFooCalledCount = 0;
    myTargetFooCalledCount                 = 0;

    class MyTarget {
    public:
        MyTarget(const std::string &name_ = "")
        : name(name_) {}
        void foo() {
            if (!name.empty()) {
                ++count;
            }

            ++myTargetFooCalledCount;
        }

        void operator()() {
            foo();
        }

        std::string name;
        uint32_t    count{0};
    };

    MyTarget target11{"CallbackTarget1"};
    MyTarget target1;
    MyTarget target22{"CallbackTarget2"};

    std::function<void()> cb1          = target1;
    std::function<void()> cb1_target11 = std::bind(&MyTarget::foo, &target11);
    std::function<void()> cb1_target22 = std::bind(&MyTarget::foo, &target22);

    // test on
    node->on("a", cb1, id1_not_target1);
    node->on("a", cb1, id1_not_target2);
    EXPECT_TRUE(node->hasEventListener("a", id1_not_target1));
    EXPECT_TRUE(node->hasEventListener("a", id1_not_target2));

    node->on("a", cb1_target11, &target11, id1_target11);
    node->on("a", cb1_target22, &target22, id1_target22);
    EXPECT_TRUE(node->hasEventListener("a", &target11, id1_target11));
    EXPECT_TRUE(node->hasEventListener("a", &target22, id1_target22));

    // test emit
    node->emit("a");
    EXPECT_EQ(myTargetFooCalledCount, 4);

    // test off
    node->off("a", id1_not_target1);
    node->off("a", id1_not_target2);
    EXPECT_FALSE(node->hasEventListener("a", id1_not_target1));
    EXPECT_FALSE(node->hasEventListener("a", id1_not_target2));

    node->off("a", id1_target11);
    node->off("a", id1_target22);
    EXPECT_FALSE(node->hasEventListener("a", &target11, id1_target11));
    EXPECT_FALSE(node->hasEventListener("a", &target22, id1_target22));

    //once
    node->once("b", cb1, id1_not_target1);
    node->once("b", cb1, id1_not_target2);
    node->once("b", cb1_target11, &target11, id1_target11);
    node->once("b", cb1_target22, &target22, id1_target22);
    EXPECT_TRUE(node->hasEventListener("b", id1_not_target1));
    EXPECT_TRUE(node->hasEventListener("b", id1_not_target2));
    EXPECT_TRUE(node->hasEventListener("b", &target11, id1_target11));
    EXPECT_TRUE(node->hasEventListener("b", &target22, id1_target22));
    node->emit("b");
    EXPECT_FALSE(node->hasEventListener("b", id1_not_target1));
    EXPECT_FALSE(node->hasEventListener("b", id1_not_target2));
    EXPECT_FALSE(node->hasEventListener("b", id1_not_target1));
    EXPECT_FALSE(node->hasEventListener("b", id1_not_target2));

    delete node;
}
*/
