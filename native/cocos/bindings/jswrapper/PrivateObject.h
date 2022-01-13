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

#pragma once

#include <cassert>
#include <memory>
#include <type_traits>
#include <cmath>
#include "base/Ptr.h"
#include "base/RefCounted.h"

namespace se {

class Object;
class State;
class ScriptEngine;

template <typename T>
class TypedPrivateObject;

class PrivateObjectBase {
public:
    virtual ~PrivateObjectBase() = default;

    template <typename T>
    inline T *get() const {
        return reinterpret_cast<T *>(getRaw());
    }

    template <typename T>
    inline TypedPrivateObject<T> *typed() {
        return reinterpret_cast<TypedPrivateObject<T> *>(this);
    }
    virtual const char *getName() const = 0;
    virtual void *      getRaw() const  = 0;
    virtual void        allowDestroyInGC() const {
        assert(false);
    }
    virtual void tryAllowDestroyInGC() const {}

    virtual bool isSharedPtr() const { return false; }
    virtual bool isCCShared() const { return false; }

    friend se::Object;
    friend se::State;
    friend se::ScriptEngine;
};

template <typename T>
class TypedPrivateObject : public PrivateObjectBase {
public:
    inline std::shared_ptr<T>   share();
    inline cc::IntrusivePtr<T> &ccShared();
    inline const char *         getName() const override {
        static_assert(!std::is_base_of<PrivateObjectBase, T>::value, ""); // NOLINT // remove after using c++17
        return typeid(T).name();
    }
};

template <typename T>
class SharedPrivateObject final : public TypedPrivateObject<T> {
public:
    SharedPrivateObject() = default;
    explicit SharedPrivateObject(const std::shared_ptr<T> &ptr) : _data(ptr) {}
    explicit SharedPrivateObject(std::shared_ptr<T> &&ptr) : _data(std::move(ptr)) {}
    inline std::shared_ptr<T> getData() const {
        return _data;
    }

    constexpr bool isSharedPtr() const override { return true; }

    void *getRaw() const override { return _data.get(); }

private:
    std::shared_ptr<T> _data{nullptr};
};

template <typename T>
class CCSharedPtrPrivateObject final : public TypedPrivateObject<T> {
public:
    CCSharedPtrPrivateObject() = default;
    explicit CCSharedPtrPrivateObject(const cc::IntrusivePtr<T> &p) : _ptr(p) {}
    explicit CCSharedPtrPrivateObject(cc::IntrusivePtr<T> &&p) : _ptr(std::move(p)) {}
    ~CCSharedPtrPrivateObject() override = default;

    inline void *getRaw() const override {
        return _ptr.get();
    }
    inline bool isCCShared() const override { return true; }

private:
    cc::IntrusivePtr<T> _ptr;

    friend TypedPrivateObject<T>;
};

template <typename T>
class RawRefPrivateObject final : public TypedPrivateObject<T> {
public:
    RawRefPrivateObject() = default;
    explicit RawRefPrivateObject(T *p) : _ptr(p) {}
    ~RawRefPrivateObject() override {
        static_assert(!std::is_same<T, void>::value, "void is not allowed!");
        if (_allowGC) {
            delete _ptr;
        }
        _ptr = nullptr;
    }

    //bool *getValidAddr() { return &_validate; }

    void allowDestroyInGC() const override {
        _allowGC = true;
    }
    void tryAllowDestroyInGC() const override {
        allowDestroyInGC();
    }

    void *getRaw() const override {
        //assert(_validate);
        return _ptr;
    }

private:
    T *_ptr = nullptr;
    //bool         _validate = true;
    mutable bool _allowGC = false;
};

template <typename T>
inline std::shared_ptr<T> TypedPrivateObject<T>::share() {
    if (isSharedPtr()) {
        return reinterpret_cast<SharedPrivateObject<T> *>(this)->getData();
    }
    assert(false);
    return std::shared_ptr<T>(nullptr);
}
template <typename T>
inline cc::IntrusivePtr<T> &TypedPrivateObject<T>::ccShared() {
    assert(isCCShared());
    return reinterpret_cast<CCSharedPtrPrivateObject<T> *>(this)->_ptr;
}

#if CC_DEBUG
inline void inHeap(void *ptr) {
    constexpr size_t r = 4 * 1024; // 4K
    char             a;
    auto             anchor = reinterpret_cast<intptr_t>(&a);
    auto             p      = reinterpret_cast<intptr_t>(ptr);
    // must be in heaps
    assert(abs(anchor - p) > r);
}
#endif

template <typename T>
typename std::enable_if<std::is_base_of<cc::RefCounted, T>::value, PrivateObjectBase *>::type
cc_tmp_new_ptr(T *cobj) {
    return new CCSharedPtrPrivateObject<T>(cc::IntrusivePtr<T>(cobj));
}
template <typename T>
typename std::enable_if<!std::is_base_of<cc::RefCounted, T>::value, PrivateObjectBase *>::type
cc_tmp_new_ptr(T *cobj) {
    return new SharedPrivateObject<T>(std::shared_ptr<T>(cobj));
}

template <typename T>
inline PrivateObjectBase *make_shared_private_object(T *cobj) { // NOLINT
    static_assert(!std::is_same<T, void>::value, "void * is not allowed");
// static_assert(!std::is_pointer_v<T> && !std::is_null_pointer_v<decltype(cobj)>, "bad pointer");
#if CC_DEBUG
    inHeap(cobj);
#endif
    return cc_tmp_new_ptr(cobj);
}
template <typename T>
inline PrivateObjectBase *shared_private_object(std::shared_ptr<T> &&ptr) { // NOLINT
    static_assert(!std::is_base_of<cc::RefCounted, T>::value, "cc::RefCounted is not acceptable for shared_ptr");
    return new SharedPrivateObject<T>(std::forward<std::shared_ptr<T>>(ptr));
}

template <typename T>
inline PrivateObjectBase *shared_private_object(const std::shared_ptr<T> &ptr) { // NOLINT
    static_assert(!std::is_base_of<cc::RefCounted, T>::value, "cc::RefCounted is not acceptable for shared_ptr");
    return new SharedPrivateObject<T>(ptr);
}

template <typename T>
inline PrivateObjectBase *rawref_private_object(T *ptr) { // NOLINT
    // static_assert(false, "always fail");
    static_assert(!std::is_base_of<cc::RefCounted, T>::value, "cc::RefCounted is not acceptable for shared_ptr");
#if CC_DEBUG
    inHeap(ptr);
#endif
    return new RawRefPrivateObject<T>(ptr);
}

template <typename T>
inline PrivateObjectBase *ccshared_private_object(const cc::IntrusivePtr<T> &ptr) { // NOLINT
    static_assert(std::is_base_of<cc::RefCounted, T>::value, "cc::RefCounted expected!");
    return new CCSharedPtrPrivateObject<T>(ptr);
}
template <typename T>
inline PrivateObjectBase *ccshared_private_object(T *cobj) { // NOLINT
    static_assert(std::is_base_of<cc::RefCounted, T>::value, "cc::RefCounted expected!");
    return new CCSharedPtrPrivateObject<T>(cc::IntrusivePtr<T>(cobj));
}
} // namespace se
