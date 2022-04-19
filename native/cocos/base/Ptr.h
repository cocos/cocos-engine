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

// Originally the class is from WebRTC.
// https://chromium.googlesource.com/external/webrtc/+/master/api/scoped_refptr.h
//

// A smart pointer class for reference counted objects.  Use this class instead
// of calling addRef and Release manually on a reference counted object to
// avoid common memory leaks caused by forgetting to Release an object
// reference.  Sample usage:
//
//   class MyFoo : public RefCounted<MyFoo> {
//    ...
//   };
//
//   void some_function() {
//     IntrusivePtr<MyFoo> foo = new MyFoo();
//     foo->Method(param);
//     // `foo` is released when this function returns
//   }
//
//   void some_other_function() {
//     IntrusivePtr<MyFoo> foo = new MyFoo();
//     ...
//     foo = nullptr;  // explicitly releases `foo`
//     ...
//     if (foo)
//       foo->Method(param);
//   }
//
// The above examples show how IntrusivePtr<T> acts like a pointer to T.
// Given two IntrusivePtr<T> classes, it is also possible to exchange
// references between the two objects, like so:
//
//   {
//     IntrusivePtr<MyFoo> a = new MyFoo();
//     IntrusivePtr<MyFoo> b;
//
//     b.swap(a);
//     // now, `b` references the MyFoo object, and `a` references null.
//   }
//
// To make both `a` and `b` in the above example reference the same MyFoo
// object, simply use the assignment operator:
//
//   {
//     IntrusivePtr<MyFoo> a = new MyFoo();
//     IntrusivePtr<MyFoo> b;
//
//     b = a;
//     // now, `a` and `b` each own a reference to the same MyFoo object.
//   }
//

#pragma once

#include <utility>

namespace cc {

template <class T>
class IntrusivePtr {
public:
    using element_type = T;

    IntrusivePtr() {
    }

    IntrusivePtr(T *p) : _ptr(p) { // NOLINT
        if (_ptr) {
            _ptr->addRef();
        }
    }

    IntrusivePtr(const IntrusivePtr<T> &r) : _ptr(r._ptr) {
        if (_ptr) {
            _ptr->addRef();
        }
    }

    template <typename U>
    IntrusivePtr(const IntrusivePtr<U> &r) : _ptr(r.get()) { // NOLINT
        if (_ptr) {
            _ptr->addRef();
        }
    }

    // Move constructors.
    IntrusivePtr(IntrusivePtr<T> &&r) noexcept : _ptr(r.release()) {
    }

    template <typename U>
    IntrusivePtr(IntrusivePtr<U> &&r) noexcept : _ptr(r.release()) { // NOLINT
    }

    ~IntrusivePtr() {
        if (_ptr) {
            _ptr->release();
        }
    }

    T *get() const { return _ptr; }
       operator T *() const { return _ptr; } // NOLINT
    T &operator*() const { return *_ptr; }
    T *operator->() const { return _ptr; }

    // As reference count is 1 after creating a RefCounted object, so do not have to
    // invoke p->addRef();
    IntrusivePtr<T> &operator=(T *p) {
        // AddRef first so that self assignment should work
        if (p) {
            p->addRef();
        }
        if (_ptr) {
            _ptr->release();
        }
        _ptr = p;
        return *this;
    }

    IntrusivePtr<T> &operator=(const IntrusivePtr<T> &r) { // NOLINT
        return *this = r._ptr;                             // NOLINT
    }

    template <typename U>
    IntrusivePtr<T> &operator=(const IntrusivePtr<U> &r) {
        return *this = r.get(); // NOLINT
    }

    IntrusivePtr<T> &operator=(IntrusivePtr<T> &&r) noexcept {
        IntrusivePtr<T>(std::move(r)).swap(*this);
        return *this;
    }

    template <typename U>
    IntrusivePtr<T> &operator=(IntrusivePtr<U> &&r) noexcept {
        IntrusivePtr<T>(std::move(r)).swap(*this);
        return *this;
    }

    bool operator==(std::nullptr_t) {
        return _ptr == nullptr;
    }

    bool operator==(T *r) {
        return _ptr == r;
    }

    bool operator!=(std::nullptr_t) {
        return _ptr != nullptr;
    }

    bool operator!=(T *r) {
        return _ptr != r;
    }

    void swap(T **pp) noexcept {
        T *p = _ptr;
        _ptr = *pp;
        *pp  = p;
    }

    void swap(IntrusivePtr<T> &r) noexcept { swap(&r._ptr); }

private:
    // Returns the (possibly null) raw pointer, and makes the scoped_refptr hold a
    // null pointer, all without touching the reference count of the underlying
    // pointed-to object. The object is still reference counted, and the caller of
    // release() is now the proud owner of one reference, so it is responsible for
    // calling Release() once on the object when no longer using it.
    T *release() {
        T *retVal = _ptr;
        _ptr      = nullptr;
        return retVal;
    }

protected:
    T *_ptr{nullptr};
};

} // namespace cc
