/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "base/HasMemberFunction.h"
#include "core/scene-graph/Node.h"
#include "gtest/gtest.h"

using namespace cc;

namespace {

class BaseWithoutGetScriptObject {};

class BaseWithGetScriptObjectButDifferentSignature {
public:
    int getScriptObject(bool) const { return false; }
    float getScriptObject(int) const { return 1.F; }
    inline Node* getScriptObject() { return _node; }
    inline const Node* getScriptObject() const { return _node; }

private:
    Node* _node{nullptr};
};

class BaseWithCorrectGetScriptObjectSignature {
public:
    se::Object* getScriptObject() const { return nullptr; }
    se::Object* getScriptObject() { return nullptr; }
};

static const unsigned long fakeAddr = 100;

class Base0 {
public:
    Base0() {
        _seObj = reinterpret_cast<se::Object*>(reinterpret_cast<uintptr_t>(&fakeAddr));
    }

    se::Object* getScriptObject() const { return _seObj; }
    se::Object* getScriptObject() { return _seObj; }

private:
    se::Object* _seObj{nullptr};
};

class Base1 {
public:
};

class Sub0 : public Base0 {
};

class Sub1 : public Base0, public Base1 {
};

class Sub2 : public Base1, public Base0 {
};

class BaseVirtual {
public:
    virtual ~BaseVirtual() = default;
    virtual se::Object* getScriptObject() const = 0;
    virtual se::Object* getScriptObject() = 0;
};

class BaseVirtualOverride : public BaseVirtual {
public:
    se::Object* getScriptObject() const override { return nullptr; }
    se::Object* getScriptObject() override { return nullptr; }
};

class SubVirtualOverride : public BaseVirtualOverride {
public:
    SubVirtualOverride() {
        _seObj = reinterpret_cast<se::Object*>(reinterpret_cast<uintptr_t>(&fakeAddr));
    }
    se::Object* getScriptObject() const override { return _seObj; }
    se::Object* getScriptObject() override { return _seObj; }
    int getScriptObject(int) { return 100; }
    float getScriptObject(float) { return 200.F; }

private:
    se::Object* _seObj{nullptr};
};

} // namespace

TEST(HasMemberFunction, test01) {
    static_assert(!cc::has_getScriptObject<BaseWithoutGetScriptObject, se::Object*()>::value);
    static_assert(!cc::has_getScriptObject<BaseWithGetScriptObjectButDifferentSignature, se::Object*()>::value);
    static_assert(cc::has_getScriptObject<BaseWithCorrectGetScriptObjectSignature, se::Object*()>::value);
    static_assert(cc::has_getScriptObject<Base0, se::Object*()>::value);
    static_assert(cc::has_getScriptObject<Sub0, se::Object*()>::value);
    static_assert(cc::has_getScriptObject<Sub1, se::Object*()>::value);
    static_assert(cc::has_getScriptObject<BaseVirtual, se::Object*()>::value);
    static_assert(cc::has_getScriptObject<BaseVirtualOverride, se::Object*()>::value);
    static_assert(cc::has_getScriptObject<SubVirtualOverride, se::Object*()>::value);
}

TEST(HasMemberFunction, test02) {
    if constexpr (cc::has_getScriptObject<Sub0, se::Object*()>::value) {
        Sub0 a;
        Base0* b = &a;
        EXPECT_EQ(b->getScriptObject(), reinterpret_cast<se::Object*>(reinterpret_cast<uintptr_t>(&fakeAddr)));
    }
}

TEST(HasMemberFunction, test03) {
    if constexpr (cc::has_getScriptObject<Sub1, se::Object*()>::value) {
        Sub1 a;
        Base0* b = &a;
        EXPECT_EQ(b->getScriptObject(), reinterpret_cast<se::Object*>(reinterpret_cast<uintptr_t>(&fakeAddr)));
    }
}

TEST(HasMemberFunction, test04) {
    if constexpr (cc::has_getScriptObject<Sub2, se::Object*()>::value) {
        Sub2 a;
        Base0* b = &a;
        EXPECT_EQ(b->getScriptObject(), reinterpret_cast<se::Object*>(reinterpret_cast<uintptr_t>(&fakeAddr)));
    }
}

TEST(HasMemberFunction, test05) {
    if constexpr (cc::has_getScriptObject<BaseVirtualOverride, se::Object*()>::value) {
        BaseVirtualOverride a;
        BaseVirtual* b = &a;
        EXPECT_EQ(b->getScriptObject(), nullptr);
    }
}

TEST(HasMemberFunction, test06) {
    if constexpr (cc::has_getScriptObject<SubVirtualOverride, se::Object*()>::value) {
        SubVirtualOverride a;
        BaseVirtual* b = &a;
        EXPECT_EQ(b->getScriptObject(), reinterpret_cast<se::Object*>(reinterpret_cast<uintptr_t>(&fakeAddr)));
    }
}
