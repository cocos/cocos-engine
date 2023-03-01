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

#pragma once

#include <cmath>
#include <memory>
#include <type_traits>
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "base/memory/Memory.h"
#include "base/HasMemberFunction.h"

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
    virtual void *getRaw() const = 0;
    virtual void allowDestroyInGC() const {
        CC_ABORT();
    }
    virtual void tryAllowDestroyInGC() const {}

    virtual bool isSharedPtr() const { return false; }
    virtual bool isCCIntrusivePtr() const { return false; }

    friend se::Object;
    friend se::State;
    friend se::ScriptEngine;

    void *finalizerData{nullptr};
};

template <typename T>
class TypedPrivateObject : public PrivateObjectBase {
public:
    inline std::shared_ptr<T> share();
    inline cc::IntrusivePtr<T> &ccShared();
    inline const char *getName() const override {
        static_assert(!std::is_base_of<PrivateObjectBase, T>::value, ""); // NOLINT // remove after using c++17
        return typeid(T).name();
    }
};

template <typename T>
class SharedPtrPrivateObject final : public TypedPrivateObject<T> {
public:
    SharedPtrPrivateObject() = default;
    explicit SharedPtrPrivateObject(const std::shared_ptr<T> &ptr) : _data(ptr) {}
    explicit SharedPtrPrivateObject(std::shared_ptr<T> &&ptr) : _data(std::move(ptr)) {}
    inline const std::shared_ptr<T> &getData() const {
        return _data;
    }

    inline std::shared_ptr<T> &getData() {
        return _data;
    }
    constexpr bool isSharedPtr() const override { return true; }

    void *getRaw() const override {
        if constexpr (std::is_const_v<T>) {
            return reinterpret_cast<void *>(const_cast<std::remove_const_t<T> *>(_data.get()));
        } else {
            return reinterpret_cast<void *>(_data.get());
        }
    }

private:
    std::shared_ptr<T> _data{nullptr};
};

template <typename T>
class CCIntrusivePtrPrivateObject final : public TypedPrivateObject<T> {
public:
    CCIntrusivePtrPrivateObject() = default;
    explicit CCIntrusivePtrPrivateObject(const cc::IntrusivePtr<T> &p) : _ptr(p) {}
    explicit CCIntrusivePtrPrivateObject(cc::IntrusivePtr<T> &&p) : _ptr(std::move(p)) {}
    ~CCIntrusivePtrPrivateObject() override {
        if constexpr (cc::has_setScriptObject<T,void(se::Object *)>::value) {
            _ptr->setScriptObject(nullptr);
        }
    }

    inline const cc::IntrusivePtr<T> &getData() const { return _ptr; }
    inline cc::IntrusivePtr<T> &getData() { return _ptr; }

    inline void *getRaw() const override {
        if constexpr (std::is_const_v<T>) {
            return reinterpret_cast<void *>(const_cast<std::remove_const_t<T> *>(_ptr.get()));
        } else {
            return reinterpret_cast<void *>(_ptr.get());
        }
    }
    inline bool isCCIntrusivePtr() const override { return true; }

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
        if constexpr (std::is_destructible<T>::value) {
            if (_allowGC) {
                delete _ptr;
            }
        }
        _ptr = nullptr;
    }

    void allowDestroyInGC() const override {
        _allowGC = true;
    }
    void tryAllowDestroyInGC() const override {
        allowDestroyInGC();
    }

    void *getRaw() const override {
        // CC_ASSERT(_validate);
        if constexpr (std::is_const_v<T>) {
            return reinterpret_cast<void *>(const_cast<std::remove_const_t<T> *>(_ptr));
        } else {
            return reinterpret_cast<void *>(_ptr);
        }
    }

private:
    T *_ptr = nullptr;
    // bool         _validate = true;
    mutable bool _allowGC = false;
};

template <typename T>
inline std::shared_ptr<T> TypedPrivateObject<T>::share() {
    if (isSharedPtr()) {
        return reinterpret_cast<SharedPtrPrivateObject<T> *>(this)->getData();
    }
    CC_ABORT();
    return std::shared_ptr<T>(nullptr);
}
template <typename T>
inline cc::IntrusivePtr<T> &TypedPrivateObject<T>::ccShared() {
    CC_ASSERT(isCCIntrusivePtr());
    return reinterpret_cast<CCIntrusivePtrPrivateObject<T> *>(this)->_ptr;
}

#if CC_DEBUG
inline void inHeap(void *ptr) {
    constexpr size_t r = 4 * 1024; // 4K
    char a;
    auto anchor = reinterpret_cast<intptr_t>(&a);
    auto p = reinterpret_cast<intptr_t>(ptr);
    // must be in heaps
    CC_ASSERT(std::abs(anchor - p) > r);
}
#endif

template <typename T>
inline auto *make_shared_private_object(T *cobj) { // NOLINT
    static_assert(!std::is_same<T, void>::value, "void * is not allowed");
// static_assert(!std::is_pointer_v<T> && !std::is_null_pointer_v<decltype(cobj)>, "bad pointer");
#if CC_DEBUG
    inHeap(cobj);
#endif
    if constexpr (std::is_base_of<cc::RefCounted, T>::value) {
        return ccnew CCIntrusivePtrPrivateObject<T>(cc::IntrusivePtr<T>(cobj));
    } else {
        return ccnew SharedPtrPrivateObject<T>(std::shared_ptr<T>(cobj));
    }
}
template <typename T>
inline auto *shared_ptr_private_object(std::shared_ptr<T> &&ptr) { // NOLINT
    static_assert(!std::is_base_of<cc::RefCounted, T>::value, "cc::RefCounted is not acceptable for shared_ptr");
    return ccnew SharedPtrPrivateObject<T>(std::forward<std::shared_ptr<T>>(ptr));
}

template <typename T>
inline auto *shared_ptr_private_object(const std::shared_ptr<T> &ptr) { // NOLINT
    static_assert(!std::is_base_of<cc::RefCounted, T>::value, "cc::RefCounted is not acceptable for shared_ptr");
    return ccnew SharedPtrPrivateObject<T>(ptr);
}

template <typename T>
inline auto *rawref_private_object(T *ptr) { // NOLINT
    // static_assert(false, "always fail");
//    static_assert(!std::is_base_of<cc::RefCounted, T>::value, "cc::RefCounted is not acceptable for shared_ptr");
#if CC_DEBUG
    inHeap(ptr);
#endif
    return ccnew RawRefPrivateObject<T>(ptr);
}

template <typename T>
inline auto *ccintrusive_ptr_private_object(const cc::IntrusivePtr<T> &ptr) { // NOLINT
    static_assert(std::is_base_of<cc::RefCounted, T>::value, "cc::RefCounted expected!");
    return ccnew CCIntrusivePtrPrivateObject<T>(ptr);
}
template <typename T>
inline auto *ccintrusive_ptr_private_object(T *cobj) { // NOLINT
    static_assert(std::is_base_of<cc::RefCounted, T>::value, "cc::RefCounted expected!");
    return ccnew CCIntrusivePtrPrivateObject<T>(cc::IntrusivePtr<T>(cobj));
}
} // namespace se
