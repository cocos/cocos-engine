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
#include "core/event/CallbacksInvoker.h"
#include "core/scene-graph/SceneGraphModuleHeader.h"
#include "gtest/gtest.h"
#include "renderer/GFXDeviceManager.h"
#include "renderer/gfx-base/GFXDef.h"
#include "utils.h"

using namespace cc;
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

    //    TestFunctor(const TestFunctor&) {
    //        CC_LOG_DEBUG("copy consturctor");
    //    }
    //
    //    TestFunctor& operator=(const TestFunctor&) {
    //        CC_LOG_DEBUG("copy operator");
    //    }
    //
    //    TestFunctor(TestFunctor&&) {
    //        CC_LOG_DEBUG("move consturctor");
    //    }
    //
    //    TestFunctor& operator=(TestFunctor&&) {
    //        CC_LOG_DEBUG("move operator");
    //    }

private:
    Fn                        _cb;
    std::shared_ptr<uint32_t> _calledCount{std::make_shared<uint32_t>(0)};
};

class MyCallbackTarget {
public:
};

TEST(CoreEventCallbacksInvoker, output_log) {
    static CallbackInfoBase::ID id1{0};
    static CallbackInfoBase::ID id2{0};
    static CallbackInfoBase::ID id3{0};
    static CallbackInfoBase::ID id4{0};
    static CallbackInfoBase::ID id5{0};
    static CallbackInfoBase::ID id6{0};

    CallbacksInvoker ci;

    class MyTarget {
    public:
        MyTarget(CallbacksInvoker &ci)
        : _ci(ci) {}
        void foo() {
            CC_LOG_DEBUG("magic: %d, foo", magic);
        }

        void haha1(int a) {
            CC_LOG_DEBUG("magic: %d, haha1", magic);
            _ci.off("memberfunction0", id5);
        }

        void haha2(int a) {
            CC_LOG_DEBUG("magic: %d, haha2", magic);
        }

        void haha3(int a) {
            CC_LOG_DEBUG("magic: %d, haha3", magic);
        }

        void haha4(int a) {
            CC_LOG_DEBUG("magic: %d, haha4", magic);
        }

        void haha5(int a) {
            CC_LOG_DEBUG("magic: %d, haha5", magic);
        }

        void foo1(int a) {
            CC_LOG_DEBUG("magic: %d, foo1, a: %d", magic, a);
        }

        void foo2(int a, float b) {
            CC_LOG_DEBUG("magic: %d, foo2, a: %d, b: %f", magic, a, b);
        }
        void foo3(int a, float b, bool c) {
            CC_LOG_DEBUG("magic: %d, foo3, a: %d, b: %f, c: %d", magic, a, b, c);
        }

        void xxx() {
            CC_LOG_DEBUG("magic: %d, xxx", magic);
        }

        void xxx1(int a) {
            CC_LOG_DEBUG("magic: %d, xxx1, a: %d", magic, a);
        }

        void xxx2(int a, float b) {
            CC_LOG_DEBUG("magic: %d, xxx2, a: %d, b: %f", magic, a, b);
        }
        void xxx3(int a, float b, bool c) {
            CC_LOG_DEBUG("magic: %d, xxx3, a: %d, b: %f, c: %d", magic, a, b, c);
        }

        int               magic = 12334;
        CallbacksInvoker &_ci;
    };
    MyTarget target{ci};

    ci.on("hello", [](int a) {
        CC_LOG_DEBUG("hello callback, a: %d", a);
    });

    ci.emit("hello", 100);

    auto ret = ci.hasEventListener("xxx");
    ret      = ci.hasEventListener("hello");

    ci.on("memberfunction0", CC_CALLBACK_INVOKE_1(MyTarget::haha1, &target, int), id3);
    ci.on("memberfunction0", CC_CALLBACK_INVOKE_1(MyTarget::haha2, &target, int), id4);
    ci.on("memberfunction0", CC_CALLBACK_INVOKE_1(MyTarget::haha3, &target, int), id5);
    ci.on("memberfunction0", CC_CALLBACK_INVOKE_1(MyTarget::haha4, &target, int), id6);
    ci.on("memberfunction0", CC_CALLBACK_INVOKE_1(MyTarget::foo1, &target, int), id1);
    ci.on("memberfunction0", CC_CALLBACK_INVOKE_1(MyTarget::xxx1, &target, int), id2);

    ci.emit("memberfunction0", 100);
    CC_LOG_DEBUG("--------------------------");
    ci.emit("memberfunction0", 100);
    CC_LOG_DEBUG("--------------------------");
    ci.off("memberfunction0", id1);
    ci.emit("memberfunction0", 100);
    CC_LOG_DEBUG("--------------------------");
    ci.on("memberfunction1", CC_CALLBACK_INVOKE_1(MyTarget::foo1, &target, int));
    ci.emit("memberfunction1", 123);
    CC_LOG_DEBUG("--------------------------");
    ci.on("memberfunction2", CC_CALLBACK_INVOKE_2(MyTarget::foo2, &target, int, float));
    ci.emit("memberfunction2", 234, 345.3F);
    CC_LOG_DEBUG("--------------------------");
    ci.on("memberfunction3", CC_CALLBACK_INVOKE_3(MyTarget::foo3, &target, int, float, bool));
    ci.emit("memberfunction3", 323, 34.3F, true);
    CC_LOG_DEBUG("--------------------------");
}

TEST(CoreEventCallbacksInvoker, member_function_target) {
    CallbacksInvoker ci;

    static int ccc = 123344;
    class MyFoo : public CCObject {
    public:
        void foo(int a, float b, int *c) {
            EXPECT_EQ(a, 1);
            EXPECT_TRUE(IsEqualF(b, 2.3F));
            EXPECT_EQ(c, &ccc);
            EXPECT_EQ(magic, 1234);
        }

    private:
        int magic = 1234;
    };

    MyFoo foo;
    ci.on("hello", &MyFoo::foo, &foo);
    ci.emit("hello", 1, 2.3F, &ccc);
}

TEST(CoreEventCallbacksInvoker, member_function_target_remove) {
    static CallbacksInvoker ci;

    static int fooCount = 0, fooCountA = 0, fooCountB = 0, fooCountC = 0;
    fooCount = fooCountA = fooCountB = fooCountC = 0;

    static int ccc = 0;
    class MyFoo : public CCObject {
    public:
        void foo(int a, float b, int *c) {
            EXPECT_EQ(a, 1);
            EXPECT_TRUE(IsEqualF(b, 2.3F));
            EXPECT_EQ(c, &ccc);
            EXPECT_EQ(magic, 1234);
            ++fooCount;
        }

        void fooA() {
            ++fooCountA;
        }

        void fooB(bool cancelSelf) {
            ++fooCountB;
            if (cancelSelf) {
                ci.off("hello3", &MyFoo::fooB, this);
            }
        }
        void fooC() {
            ++fooCountC;
        }

    private:
        int magic = 1234;
    };

    MyFoo foo;
    ci.on("hello", &MyFoo::foo, &foo);
    ci.on("hello2", &MyFoo::fooA, &foo);
    ci.on("hello3", &MyFoo::fooB, &foo);
    ci.on("hello4", &MyFoo::fooC, &foo);
    ci.emit("hello", 1, 2.3F, &ccc);
    ci.emit("hello2");
    ci.emit("hello3", false);
    ci.emit("hello4");

    EXPECT_EQ(fooCount, 1);
    EXPECT_EQ(fooCountA, 1);
    EXPECT_EQ(fooCountB, 1);
    EXPECT_EQ(fooCountC, 1);

    ci.off("hello", &MyFoo::foo, &foo);
    ci.emit("hello", 1, 2.3F, &ccc);
    ci.emit("hello2");
    ci.emit("hello3", false);
    ci.emit("hello4");

    EXPECT_EQ(fooCount, 1);
    EXPECT_EQ(fooCountA, 2);
    EXPECT_EQ(fooCountB, 2);
    EXPECT_EQ(fooCountC, 2);

    ci.emit("hello3", true);
    EXPECT_EQ(fooCountB, 3);
    ci.emit("hello3", false);
    EXPECT_EQ(fooCountB, 3);

    ci.offAll();
}

TEST(CoreEventCallbacksInvoker, test) {
    CallbacksInvoker     ci;
    CallbackInfoBase::ID id1{0}, id2{0}, id3{0};

    TestFunctor<> cb1{[]() {}};
    TestFunctor<> cb2{[]() {}};
    TestFunctor<> cb3{[]() {}};

    ci.on("a", cb1, id1);
    EXPECT_FALSE(ci.hasEventListener("a", 12334));
    EXPECT_TRUE(ci.hasEventListener("a", id1));
    ci.on("a", cb2, id2);
    ci.on("b", cb3, id3);

    ci.emit("a");
    EXPECT_EQ(cb1.getCalledCount(), 1);
    EXPECT_EQ(cb2.getCalledCount(), 1);

    ci.emit("b");
    EXPECT_EQ(cb3.getCalledCount(), 1);

    ci.off("a", id2);
    ci.emit("a");
    EXPECT_EQ(cb1.getCalledCount(), 2);
    EXPECT_EQ(cb2.getCalledCount(), 1);

    ci.on("a", cb2);
    EXPECT_TRUE(ci.hasEventListener("a"));
    ci.offAll("a");
    EXPECT_FALSE(ci.hasEventListener("a"));

    ci.emit("a");
    EXPECT_EQ(cb1.getCalledCount(), 2);
    EXPECT_EQ(cb2.getCalledCount(), 1);
}

TEST(CoreEventCallbacksInvoker, remove_self_during_invoking) {
    CallbacksInvoker ci;

    CallbackInfoBase::ID id1{0};
    TestFunctor<>        cb1{[&ci, &id1]() {
        ci.off("eve", id1);
    }};
    TestFunctor<>        cb2{[]() {}};

    ci.on("eve", cb1, id1);
    ci.on("eve", cb2);
    ci.emit("eve");
    EXPECT_EQ(cb2.getCalledCount(), 1);
    ci.emit("eve");
    EXPECT_EQ(cb1.getCalledCount(), 1);
    EXPECT_EQ(cb2.getCalledCount(), 2);
}

TEST(CoreEventCallbacksInvoker, remove_self_with_target_during_invoking) {
    CallbacksInvoker     ci;
    MyCallbackTarget     target;
    CallbackInfoBase::ID id1{0};

    TestFunctor<> cb1{[&]() {
        ci.off("eve", id1);
    }};

    TestFunctor<> cb2{[]() {}};

    ci.on("eve", cb1, id1, &target);
    ci.on("eve", cb2, &target);
    ci.emit("eve");
    EXPECT_EQ(cb1.getCalledCount(), 1);
    EXPECT_EQ(cb2.getCalledCount(), 1);

    ci.emit("eve");
    EXPECT_EQ(cb1.getCalledCount(), 1);
    EXPECT_EQ(cb2.getCalledCount(), 2);
}

TEST(CoreEventCallbacksInvoker, remove_previous_during_invoking) {
    CallbacksInvoker     ci;
    CallbackInfoBase::ID id1{0}, id2{0};

    TestFunctor<> cb1{[]() {}};
    TestFunctor<> cb2{[&]() {
        ci.off("eve", id1);
    }};

    ci.on("eve", cb1, id1);
    ci.on("eve", cb2, id2);
    ci.emit("eve");

    EXPECT_FALSE(ci.hasEventListener("eve", id1));
    EXPECT_TRUE(ci.hasEventListener("eve", id2));
}

TEST(CoreEventCallbacksInvoker, remove_previous_with_target_during_invoking) {
    CallbacksInvoker     ci;
    MyCallbackTarget     target;
    CallbackInfoBase::ID id1{0}, id2{0};

    TestFunctor<> cb1{[]() {}};
    TestFunctor<> cb2{[&]() {
        ci.off("eve", id1);
    }};

    ci.on("eve", cb1, &target, id1);
    ci.on("eve", cb2, &target, id2);
    ci.emit("eve");

    EXPECT_FALSE(ci.hasEventListener("eve", &target, id1));
    EXPECT_TRUE(ci.hasEventListener("eve", &target, id2));
}

TEST(CoreEventCallbacksInvoker, remove_last_during_invoking) {
    CallbacksInvoker     ci;
    CallbackInfoBase::ID id1{0}, id2{0};

    TestFunctor<> cb1{[]() {}};
    TestFunctor<> cb2{[&]() {
        ci.off("eve", id2);
    }};

    ci.on("eve", cb1, id1);
    ci.on("eve", cb2, id2);
    ci.emit("eve");

    EXPECT_TRUE(ci.hasEventListener("eve", id1));
    EXPECT_FALSE(ci.hasEventListener("eve", id2));
}

TEST(CoreEventCallbacksInvoker, remove_last_with_target_during_invoking) {
    CallbacksInvoker     ci;
    MyCallbackTarget     target;
    CallbackInfoBase::ID id1{0}, id2{0};

    TestFunctor<> cb1{[]() {}};
    TestFunctor<> cb2{[&]() {
        ci.off("eve", id2);
    }};

    ci.on("eve", cb1, &target, id1);
    ci.on("eve", cb2, &target, id2);
    ci.emit("eve");

    EXPECT_TRUE(ci.hasEventListener("eve", &target, id1));
    EXPECT_FALSE(ci.hasEventListener("eve", &target, id2));
}

TEST(CoreEventCallbacksInvoker, remove_multiple_callbacks_during_invoking) {
    CallbacksInvoker     ci;
    MyCallbackTarget     target;
    CallbackInfoBase::ID id1{0}, id11{0}, id2{0}, id3{0}, id31{0};

    TestFunctor<> cb1{[]() {}};
    TestFunctor<> cb2{[&]() {
        ci.off("eve", id1);
        ci.off("eve", id31);
    }};
    TestFunctor<> cb3{[&]() {
        ci.off("eve", id2);
    }};

    ci.on("eve", cb1, id1);
    ci.on("eve", cb1, &target, id11);
    ci.on("eve", cb2, &target, id2);
    ci.on("eve", cb3, id3);
    ci.on("eve", cb3, &target, id31);
    ci.emit("eve");

    EXPECT_EQ(cb1.getCalledCount(), 2);
    EXPECT_EQ(cb2.getCalledCount(), 1);
    EXPECT_EQ(cb3.getCalledCount(), 1);

    EXPECT_TRUE(ci.hasEventListener("eve", &target, id11));
    EXPECT_FALSE(ci.hasEventListener("eve", id1));

    EXPECT_FALSE(ci.hasEventListener("eve", &target, id2));
    EXPECT_FALSE(ci.hasEventListener("eve", &target, id31));
}

TEST(CoreEventCallbacksInvoker, remove_all_callbacks_during_invoking) {
    CallbacksInvoker     ci;
    MyCallbackTarget     target;
    CallbackInfoBase::ID id1{0}, id11{0}, id2{0}, id3{0}, id31{0};

    TestFunctor<> cb1{[]() {}};
    TestFunctor<> cb2{[&]() {
        ci.offAll("eve");
    }};
    TestFunctor<> cb3{[&]() {
        ci.off("eve", id2);
    }};

    ci.on("eve", cb1, id1);
    ci.on("eve", cb1, &target, id11);
    ci.on("eve", cb2, &target, id2);
    ci.on("eve", cb3, id3);
    ci.on("eve", cb3, &target, id31);
    ci.emit("eve");

    EXPECT_EQ(cb1.getCalledCount(), 2);
    EXPECT_EQ(cb2.getCalledCount(), 1);
    EXPECT_EQ(cb3.getCalledCount(), 0);

    EXPECT_FALSE(ci.hasEventListener("eve"));
}

TEST(CoreEventCallbacksInvoker, CallbacksInvoker_support_target) {
    CallbacksInvoker     ci;
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

    TestFunctor<> cb2{[]() {}};
    TestFunctor<> cb3{[]() {}};

    ci.on("a", cb1, id1_not_target1);
    ci.on("a", cb1_target11, &target11, id1_target11);
    ci.on("a", cb1, id1_not_target2);
    ci.on("a", cb1_target22, &target22, id1_target22);
    ci.on("a", cb2, &target22, id21);
    ci.on("a", cb2, &target11, id22);
    ci.on("a", cb3, id3);
    ci.on("a", cb3, &target11, id31);
    ci.on("b", cb1_target11, &target11, id1_b1);

    EXPECT_FALSE(ci.hasEventListener("a", nullptr, id21));
    EXPECT_FALSE(ci.hasEventListener("a", nullptr, id22));

    EXPECT_TRUE(ci.hasEventListener("a", &target11, id22));
    EXPECT_TRUE(ci.hasEventListener("a", nullptr, id3));

    ci.emit("a");
    EXPECT_EQ(myTargetFooCalledCount, 4); //cjh TODO: ts is 3
    EXPECT_EQ(target11.count, 1);
    EXPECT_EQ(target22.count, 1);

    EXPECT_EQ(cb2.getCalledCount(), 2);
    EXPECT_EQ(cb3.getCalledCount(), 2);

    ci.off("b", id1_not_target1);
    ci.off("b", id1_target22);
    EXPECT_TRUE(ci.hasEventListener("b", &target11, id1_b1));
    ci.off("b", id1_b1);
    EXPECT_FALSE(ci.hasEventListener("b", &target11, id1_b1));

    target11.count         = 0;
    target22.count         = 0;
    myTargetFooCalledCount = 0;
    cb2.clear();
    cb3.clear();

    ci.off("a", id1_target22);
    ci.off("a", id1_target11);
    ci.off("a", id21);
    ci.emit("a");

    EXPECT_EQ(myTargetFooCalledCount, 2);
    EXPECT_EQ(target11.count, 0);
    EXPECT_EQ(target22.count, 0);

    EXPECT_EQ(cb2.getCalledCount(), 1);
    EXPECT_EQ(cb3.getCalledCount(), 2);
}

TEST(CoreEventCallbacksInvoker, pointer_args) {
    CallbacksInvoker ci;
    class Sender {};
    static Sender sender;

    ci.on("hello", [&](Sender *s) {
        EXPECT_EQ(s, &sender);
    });

    ci.emit("hello", &sender);

    //
    class Foo {
    public:
        void foo(Sender *s, int arg1) {
            EXPECT_EQ(s, &sender);
            EXPECT_EQ(_magic, 1234);
            EXPECT_EQ(arg1, 222333);
        }

    private:
        int _magic{1234};
    };
    Foo myFoo;
    ci.on("world", CC_CALLBACK_INVOKE_2(Foo::foo, &myFoo, Sender *, int));
    ci.emit("world", &sender, 222333);
}

TEST(CoreEventCallbacksInvoker, reference_args) {
    CallbacksInvoker ci;
    class Sender {};
    static Sender sender;

    ci.on("hello", [&](Sender &s) {
        EXPECT_EQ(&s, &sender);
    });

    ci.emit("hello", sender);
    //
    class Foo {
    public:
        void foo(Sender &s) {
            EXPECT_EQ(&s, &sender);
            EXPECT_EQ(_magic, 1234);
        }

    private:
        int _magic{1234};
    };
    Foo myFoo;
    ci.on("world", CC_CALLBACK_INVOKE_1(Foo::foo, &myFoo, Sender &));
    ci.emit("world", sender);
}

TEST(CoreEventCallbacksInvoker, const_pointer_args) {
    CallbacksInvoker ci;
    class Sender {};
    static const Sender sender;

    ci.on("hello", [&](const Sender *s) {
        EXPECT_EQ(s, &sender);
    });

    ci.emit("hello", &sender);

    //
    class Foo {
    public:
        void foo(const Sender *s, int arg1) {
            EXPECT_EQ(s, &sender);
            EXPECT_EQ(_magic, 1234);
            EXPECT_EQ(arg1, 222333);
        }

    private:
        int _magic{1234};
    };
    Foo myFoo;
    ci.on("world", CC_CALLBACK_INVOKE_2(Foo::foo, &myFoo, const Sender *, int));
    ci.emit("world", &sender, 222333);
}

TEST(CoreEventCallbacksInvoker, const_reference_args) {
    CallbacksInvoker ci;
    class Sender {};
    static const Sender sender;

    ci.on("hello", [&](const Sender &s) {
        EXPECT_EQ(&s, &sender);
    });

    ci.emit("hello", sender);
    //
    class Foo {
    public:
        void foo(const Sender &s) {
            EXPECT_EQ(&s, &sender);
            EXPECT_EQ(_magic, 1234);
        }

    private:
        int _magic{1234};
    };
    Foo myFoo;
    ci.on("world", CC_CALLBACK_INVOKE_1(Foo::foo, &myFoo, const Sender &));
    ci.emit("world", sender);
}

TEST(CoreEventCallbacksInvoker, remove_target) {
    CallbacksInvoker     ci;
    CallbackInfoBase::ID id1_not_target1{0}, id1_not_target2{0}, id1_target11{0}, id1_target22{0}, id1_b1{0}, id2{0}, id21{0}, id22{0}, id3{0}, id31{0}, id32{0};
    static uint32_t      myTargetFooCalledCount = 0;
    myTargetFooCalledCount                      = 0;

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

    MyTarget target1;
    MyTarget target11{"CallbackTarget1"};
    MyTarget target22{"CallbackTarget2"};

    std::function<void()> cb1          = target1;
    std::function<void()> cb1_target11 = std::bind(&MyTarget::foo, &target11);
    std::function<void()> cb1_target22 = std::bind(&MyTarget::foo, &target22);

    TestFunctor<> cb2{[]() {}};
    TestFunctor<> cb3{[]() {}};

    ci.on("a", cb1, id1_not_target1);
    ci.on("a", cb1_target11, &target11, id1_target11);
    ci.on("a", cb1, id1_not_target2);
    ci.on("a", cb1_target22, &target22, id1_target22);
    ci.on("a", cb2, &target22, id21);
    ci.on("a", cb2, &target11, id22);
    ci.on("a", cb3, id3);
    ci.on("a", cb3, &target11, id31);

    ci.emit("a");
    EXPECT_EQ(myTargetFooCalledCount, 4);
    EXPECT_EQ(cb2.getCalledCount(), 2);
    EXPECT_EQ(cb3.getCalledCount(), 2);

    ci.offAll(&target11);
    myTargetFooCalledCount = 0;
    target1.count          = 0;
    cb2.clear();
    cb3.clear();

    ci.emit("a");
    EXPECT_EQ(myTargetFooCalledCount, 3);
    EXPECT_EQ(cb2.getCalledCount(), 1);
    EXPECT_EQ(cb3.getCalledCount(), 1);

    ci.offAll(&target22);
    myTargetFooCalledCount = 0;
    target1.count          = 0;
    cb2.clear();
    cb3.clear();

    ci.emit("a");
    EXPECT_EQ(myTargetFooCalledCount, 2);
    EXPECT_EQ(cb2.getCalledCount(), 0);
    EXPECT_EQ(cb3.getCalledCount(), 1);
}

TEST(CoreEventCallbacksInvoker, nest_invoke) {
    CallbacksInvoker ci;

    std::vector<int> actualSequence;
    bool             isParentLoop{true};

    auto cb1 = [&]() {
        actualSequence.emplace_back(1);
        if (isParentLoop) {
            isParentLoop = false;
            ci.emit("visit");
        }
    };
    auto cb2 = [&]() {
        actualSequence.emplace_back(2);
    };

    ci.on("visit", cb1);
    ci.on("visit", cb2);
    ci.emit("visit");
    EXPECT_EQ(actualSequence.size(), 4);
    EXPECT_EQ(actualSequence[0], 1);
    EXPECT_EQ(actualSequence[1], 1);
    EXPECT_EQ(actualSequence[2], 2);
    EXPECT_EQ(actualSequence[3], 2);
}

TEST(CoreEventCallbacksInvoker, remove_during_nest_invoke) {
    CallbacksInvoker ci;

    std::vector<int>     actualSequence;
    bool                 isParentLoop{true};
    CallbackInfoBase::ID id1{0};

    auto cb1 = [&]() {
        actualSequence.emplace_back(1);
        if (isParentLoop) {
            isParentLoop = false;
            ci.emit("visit");
        } else {
            ci.off("visit", id1);
            EXPECT_FALSE(ci.hasEventListener("visit"));
        }
    };

    ci.on("visit", cb1, id1);
    ci.emit("visit");

    EXPECT_EQ(actualSequence.size(), 2);
    EXPECT_EQ(actualSequence[0], 1);
    EXPECT_EQ(actualSequence[1], 1);
}

TEST(CoreEventCallbacksInvoker, remove_many_during_nest_invoke) {
    CallbacksInvoker ci;

    std::vector<int>     actualSequence;
    bool                 isParentLoop{true};
    CallbackInfoBase::ID id1{0}, id2{0};

    auto cb1 = [&]() {
        actualSequence.emplace_back(1);
    };
    auto cb2 = [&]() {
        actualSequence.emplace_back(2);
        if (isParentLoop) {
            isParentLoop = false;
            ci.emit("visit");
        } else {
            ci.off("visit", id1);
            ci.off("visit", id2);
        }
    };
    auto cb3 = [&]() {
        actualSequence.emplace_back(3);
    };

    ci.on("visit", cb1, id1);
    ci.on("visit", cb2, id2);
    ci.on("visit", cb3);
    ci.emit("visit");
    EXPECT_EQ(actualSequence.size(), 6);
    EXPECT_EQ(actualSequence[0], 1);
    EXPECT_EQ(actualSequence[1], 2);
    EXPECT_EQ(actualSequence[2], 1);
    EXPECT_EQ(actualSequence[3], 2);
    EXPECT_EQ(actualSequence[4], 3);
    EXPECT_EQ(actualSequence[5], 3);
}

*/
