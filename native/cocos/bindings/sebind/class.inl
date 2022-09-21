/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#include <utility>
#include "base/memory/Memory.h"
#include "bindings/jswrapper/SeApi.h"
#include "bindings/jswrapper/Value.h"


#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/jsb_global.h"
#include "intl/common.h"

namespace sebind {

/**
 * @brief Remove all cached data. Should be invoked before restart.
 * 
 */
inline void reset() {
    intl::ContextDB::reset();
}

/**
 * @brief Export C++ Class/Funtions to JS
 * 
 * @tparam T  C++ type
 */
template <typename T>
class class_ final { //NOLINT
public:
    using class_type = T;
    using Context = intl::ContextDB::Context;

    explicit class_(Context *ctx) : _ctx(ctx) {}

    /**
     * @brief Construct a new class_ object
     * 
     * @param name specify the class name in JS
     */
    explicit class_(const char *name);

    /**
     * @brief Construct a new class_ object
     * 
     * @param name Specify the class name in JS
     * @param parentProto The prototype object of the parent class
     */
    explicit class_(const char *name, se::Object *parentProto);

    ~class_() {
        assert(_installed); // procedure `class_::install` has not been invoked?
    }

    /**
     * @brief  Attach the function object to the namespace object, 
     * then the exported class can be accessed through the namespace object in JS.
     * And the namespace object is a global object in most cases.
     * 
     * @param nsObject the namespace object
     * @return true 
     */
    bool install(se::Object *nsObject);

    /**
     * @brief Define a constructor by argument type list
     * 
     * The parameter list must match a specific constructor.
     * 
     * @tparam ARGS parameter types for a constructor of class T 
     * @return class_& 
     */
    template <typename... ARGS>
    class_ &constructor();

    /**
     * @brief Define a constructor by a function
     *
     * The signature of the function pointer can be
     * - `bool(*)(se::State&)`
     * or
     * - `T*(*)(ARGS...)`
     *
     * @tparam F 
     * @param callback The function pointer 
     * @return class_& 
     */
    template <typename F>
    class_ &constructor(F callback);

    /**
     * @brief Register a callback when GC occurs
     * @param callback GC callback
     * @return class_& 
     */
    class_ &finalizer(void (*callback)(T *));

    /**
     * @brief Define a member function for js class
     * 
     * @tparam Method 
     * @param name The method name
     * @param method Member function pointer of class `T`, or normal function which the first argument is `T*`.
     * @return class_& 
     */
    template <typename Method>
    class_ &function(const char *name, Method method);

    /**
     * @brief Define a property for js class
     * 
     * @tparam Field 
     * @param name Field name
     * @param field Member data pointer of class `T`
     * @return class_& 
     */
    template <typename Field>
    class_ &property(const char *name, Field field);

    /**
     * @brief Define a property for JS class
     * 
     * The getter and setter can not be both null.
     * @tparam Getter Member function pointer or normal function pointer which first parameter is `T*`.
     * @tparam Setter Member function pointer or normal function pointer which first parameter is `T*`.
     * @param name  Property name
     * @param getter Getter function pointer
     * @param setter Setter function pointer
     * @return class_& 
     */
    template <typename Getter, typename Setter>
    class_ &property(const char *name, Getter getter, Setter setter);

    /**
     * @brief Define a static property for JS class
     * 
     * @tparam Method static function pointer or normal function pointer.
     * @param name property name
     * @param method function pointer
     * @return class_& 
     */
    template <typename Method>
    class_ &staticFunction(const char *name, Method method);

    /**
     * @brief Define a static property for JS class
     *
     * The getter and setter can not be both null.
     * 
     * @tparam Getter Static function pointer or normal function pointer.
     * @tparam Setter Static function pointer or normal function pointer.
     * @param name property name
     * @param getter function pointer
     * @param setter function pointer
     * @return class_& 
     */
    template <typename Getter, typename Setter>
    class_ &staticProperty(const char *name, Getter getter, Setter setter);

    /**
     * @brief Define a constructor with verbose callback.
     * 
     * @param callback function pointer
     * @return class_& 
     */
    class_ &constructor(SeCallbackFnPtr callback);

    /**
     * @brief Define a function with verbose callback.
     * 
     * @param name function name
     * @param callback function pointer
     * @return class_& 
     */
    class_ &function(const char *name, SeCallbackFnPtr callback);

    /**
     * @brief Define a property with verbose callback.
     * getter and setter can not be both null 
     * @param name property name
     * @param getter function pointer
     * @param setter function pointer
     * @return class_& 
     */
    class_ &property(const char *name, SeCallbackFnPtr getter, SeCallbackFnPtr setter);

    /**
     * @brief Define static function with verbose callback
     * 
     * @param name static function name
     * @param callback 
     * @return class_& 
     */
    class_ &staticFunction(const char *name, SeCallbackFnPtr callback);

    /**
     * @brief Define a property with verbose callback.
     * getter and setter can not be both null 
     * @param name property name
     * @param getter function pointer
     * @param setter function pointer
     * @return class_& 
     */
    class_ &staticProperty(const char *name, SeCallbackFnPtr getter, SeCallbackFnPtr setter);

    /**
     * @brief Prototype of JS class, only valid after invoke install.
     * 
     * @return se::Object* 
     */
    se::Object *prototype() {
        return _ctx->kls->getProto();
    }

private:
    bool _installed{false};
    Context *_ctx{nullptr};
    template <typename R>
    friend void genericConstructor(const v8::FunctionCallbackInfo<v8::Value> &);
};

// implements

template <typename T>
class_<T>::class_(const char *name) {
    _ctx = intl::ContextDB::instance()[name];
    _ctx->className = name;
}

template <typename T>
class_<T>::class_(const char *name, se::Object *parentProto) {
    _ctx = intl::ContextDB::instance()[name];
    _ctx->className = name;
    _ctx->parentProto = parentProto;
}

template <typename T>
template <typename... ARGS>
class_<T> &class_<T>::constructor() {
    using CTYPE = intl::Constructor<intl::TypeList<T, ARGS...>>;
    using MTYPE = intl::TypeMapping<intl::TypeList<ARGS...>>;
    static_assert(intl::IsConstructibleWithTypeList<T, typename MTYPE::result_types>::value, "No matched constructor found");
    auto *constructp = ccnew CTYPE();
    constructp->argCount = MTYPE::NEW_ARGN;
    _ctx->constructors.emplace_back(constructp);
    return *this;
}

template <typename T>
template <typename F>
class_<T> &class_<T>::constructor(F callback) {
    using FTYPE = intl::StaticFunctionWrapper<F>;
    static_assert(std::is_same<typename FTYPE::return_type, T *>::value, "Function should return a instance pointer");
    using CTYPE = intl::Constructor<typename FTYPE::type>;
    auto *constructp = ccnew CTYPE();
    constructp->argCount = FTYPE::ARG_N;
    constructp->func = callback;
    _ctx->constructors.emplace_back(constructp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::constructor(SeCallbackFnPtr callback) {
    auto *constructp = ccnew intl::ConstructorBase();
    constructp->argCount = -1;
    constructp->bfnPtr = callback;
    _ctx->constructors.emplace_back(constructp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::finalizer(void (*callback)(T *)) {
    auto *fin = ccnew intl::Finalizer<T>();
    fin->func = callback;
    _ctx->finalizeCallbacks.emplace_back(fin);
    return *this;
}

template <typename T>
template <typename Method>
class_<T> &class_<T>::function(const char *name, Method method) {
    using MTYPE = intl::InstanceMethod<Method>;
    static_assert(std::is_base_of<typename MTYPE::class_type, T>::value, "incorrect class type");
    auto *methodp = ccnew MTYPE();
    methodp->methodName = name;
    methodp->className = _ctx->className;
    methodp->argCount = MTYPE::ARG_N;
    methodp->func = method;
    _ctx->functions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::function(const char *name, SeCallbackFnPtr callback) {
    auto *methodp = ccnew intl::InstanceMethodBase();
    methodp->methodName = name;
    methodp->className = _ctx->className;
    methodp->argCount = -1;
    methodp->bfnPtr = callback;
    _ctx->functions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
template <typename Field>
class_<T> &class_<T>::property(const char *name, Field field) {
    static_assert(std::is_member_pointer<Field>::value, "2nd parameter should be a member pointer");
    using FTYPE = intl::InstanceField<Field>;
    static_assert(std::is_base_of<typename FTYPE::class_type, T>::value, "class_type incorrect");
    auto *fieldp = ccnew FTYPE();
    fieldp->func = field;
    fieldp->attrName = name;
    fieldp->className = _ctx->className;
    _ctx->fields.emplace_back(name, fieldp);
    return *this;
}

template <typename T>
template <typename Getter, typename Setter>
class_<T> &class_<T>::property(const char *name, Getter getter, Setter setter) {
    using ATYPE = intl::InstanceAttribute<intl::AttributeAccessor<T, Getter, Setter>>;
    auto *attrp = ccnew ATYPE();
    attrp->getterPtr = ATYPE::HAS_GETTER ? getter : nullptr;
    attrp->setterPtr = ATYPE::HAS_SETTER ? setter : nullptr;
    attrp->className = _ctx->className;
    attrp->attrName = name;
    _ctx->properties.emplace_back(name, attrp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::property(const char *name, SeCallbackFnPtr getter, SeCallbackFnPtr setter) {
    auto *attrp = ccnew intl::InstanceAttributeBase();
    attrp->bfnGetPtr = getter;
    attrp->bfnSetPtr = setter;
    attrp->className = _ctx->className;
    attrp->attrName = name;
    _ctx->properties.emplace_back(name, attrp);
    return *this;
}

template <typename T>
template <typename Method>
class_<T> &class_<T>::staticFunction(const char *name, Method method) {
    using MTYPE = intl::StaticMethod<Method>;
    auto *methodp = ccnew MTYPE();
    methodp->methodName = name;
    methodp->className = _ctx->className;
    methodp->argCount = MTYPE::ARG_N;
    methodp->func = method;
    _ctx->staticFunctions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::staticFunction(const char *name, SeCallbackFnPtr callback) {
    auto *methodp = ccnew intl::StaticMethodBase();
    methodp->methodName = name;
    methodp->className = _ctx->className;
    methodp->argCount = -1;
    methodp->bfnPtr = callback;
    _ctx->staticFunctions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
template <typename Getter, typename Setter>
class_<T> &class_<T>::staticProperty(const char *name, Getter getter, Setter setter) {
    using ATYPE = intl::StaticAttribute<intl::SAttributeAccessor<T, Getter, Setter>>;
    auto *attrp = ccnew ATYPE();
    attrp->getterPtr = ATYPE::HAS_GETTER ? getter : nullptr;
    attrp->setterPtr = ATYPE::HAS_SETTER ? setter : nullptr;
    attrp->className = _ctx->className;
    attrp->attrName = name;
    _ctx->staticProperties.emplace_back(name, attrp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::staticProperty(const char *name, SeCallbackFnPtr getter, SeCallbackFnPtr setter) {
    auto *attrp = ccnew intl::StaticAttributeBase();
    attrp->bfnGetPtr = getter;
    attrp->bfnSetPtr = setter;
    attrp->className = _ctx->className;
    attrp->attrName = name;
    _ctx->staticProperties.emplace_back(name, attrp);
    return *this;
}

} // namespace sebind
