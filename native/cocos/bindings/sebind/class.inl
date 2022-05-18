#pragma once

#include <string>
#include <tuple>
#include <utility>
#include <vector>
#include "bindings/jswrapper/SeApi.h"
#include "bindings/jswrapper/Value.h"
#include "base/memory/Memory.h"

#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/jsb_global.h"
#include "intl/common.h"

namespace sebind {


template <typename T>
class class_ { //NOLINT
public:
    using class_type = T;
    using Context   = intl::ContextDB::Context;

    explicit class_(Context *ctx) : _ctx(ctx) {}
    explicit class_(const char *name);
    explicit class_(const char *name, se::Object *parentProto);

    ~class_() {
        assert(_installed); // procedure `class_::install` has not been invoked?
    }

    bool install(se::Object *nsObject);

    template <typename... ARGS>
    class_ &constructor();

    template <typename F>
    class_ &constructor(F callback);

    template <typename F>
    class_ &finalizer(F callback);

    template <typename Method>
    class_ &function(const char *name, Method method);

    template <typename Field>
    class_ &property(const char *name, Field field);

    template <typename Getter, typename Setter>
    class_ &property(const char *name, Getter getter, Setter setter);

    template <typename Method>
    class_ &staticFunction(const char *name, Method method);

    template <typename Getter, typename Setter>
    class_ &staticProperty(const char *name, Getter getter, Setter setter);

    class_ &constructor(SeCallbackFnPtr callback);

    class_ &function(const char *name, SeCallbackFnPtr callback);

    class_ &property(const char *name, SeCallbackFnPtr getter, SeCallbackFnPtr setter);

    class_ &staticFunction(const char *name, SeCallbackFnPtr callback);

    class_ &staticProperty(const char *name, SeCallbackFnPtr getter, SeCallbackFnPtr setter);

    se::Object *prototype() {
        return _ctx->kls->getProto();
    }

private:
    bool      _installed{false};
    Context *_ctx{nullptr};
    template <typename R>
    friend void genericConstructor(const v8::FunctionCallbackInfo<v8::Value> &);
};


// implements

template <typename T>
class_<T>::class_(const char *name) {
    _ctx            = intl::ContextDB::instance()[name];
    _ctx->className = name;
}

template <typename T>
class_<T>::class_(const char *name, se::Object *parentProto) {
    _ctx              = intl::ContextDB::instance()[name];
    _ctx->className   = name;
    _ctx->parentProto = parentProto;
}

template <typename T>
template <typename... ARGS>
class_<T> &class_<T>::constructor() {
    using CTYPE = intl::Constructor<intl::TypeList<T, ARGS...>>;
    using MTYPE = intl::TypeMapping<intl::TypeList<ARGS...>>;
    static_assert(intl::IsConstructibleWithTypeList<T, typename MTYPE::result_types>::value, "No matched constructor found");
    auto *constructp      = ccnew CTYPE();
    constructp->arg_count = MTYPE::NEW_ARGN;
    _ctx->constructors.emplace_back(constructp);
    return *this;
}

template <typename T>
template <typename F>
class_<T> &class_<T>::constructor(F callback) {
    using FTYPE           = intl::FunctionWrapper<F>;
    static_assert(std::is_same<typename FTYPE::return_type, T*>::value, "Function should return a instance pointer");
    using CTYPE           = intl::Constructor<typename FTYPE::type>;
    auto *constructp      = ccnew CTYPE();
    constructp->arg_count = FTYPE::ARG_N;
    constructp->func      = callback;
    _ctx->constructors.emplace_back(constructp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::constructor(SeCallbackFnPtr callback) {
    auto *constructp      = ccnew intl::ConstructorBase();
    constructp->arg_count = -1;
    constructp->bfnPtr    = callback;
    _ctx->constructors.emplace_back(constructp);
    return *this;
}

template <typename T>
template <typename F>
class_<T> &class_<T>::finalizer(F callback) {
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
    auto *methodp        = ccnew MTYPE();
    methodp->method_name = name;
    methodp->class_name  = _ctx->className;
    methodp->arg_count   = MTYPE::ARG_N;
    methodp->func        = method;
    _ctx->functions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::function(const char *name, SeCallbackFnPtr callback) {
    auto *methodp        = ccnew intl::InstanceMethodBase();
    methodp->method_name = name;
    methodp->class_name  = _ctx->className;
    methodp->arg_count   = -1;
    methodp->bfnPtr      = callback;
    _ctx->functions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
template <typename Field>
class_<T> &class_<T>::property(const char *name, Field field) {
    static_assert(std::is_member_pointer<Field>::value, "2nd parameter should be a member pointer");
    using FTYPE = intl::InstanceField<Field>;
    static_assert(std::is_base_of<typename FTYPE::class_type, T>::value, "class_type incorrect");
    auto *fieldp       = ccnew FTYPE();
    fieldp->func       = field;
    fieldp->attr_name  = name;
    fieldp->class_name = _ctx->className;
    _ctx->fields.emplace_back(name, fieldp);
    return *this;
}

template <typename T>
template <typename Getter, typename Setter>
class_<T> &class_<T>::property(const char *name, Getter getter, Setter setter) {
    using ATYPE       = intl::InstanceAttribute<intl::AttributeAccessor<T, Getter, Setter>>;
    auto *attrp       = ccnew ATYPE();
    attrp->getterPtr  = ATYPE::HAS_GETTER ? getter : nullptr;
    attrp->setterPtr  = ATYPE::HAS_SETTER ? setter : nullptr;
    attrp->class_name = _ctx->className;
    attrp->attr_name  = name;
    _ctx->properties.emplace_back(name, attrp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::property(const char *name, SeCallbackFnPtr getter, SeCallbackFnPtr setter) {
    auto *attrp       = ccnew intl::InstanceAttributeBase();
    attrp->bfnGetPtr  = getter;
    attrp->bfnSetPtr  = setter;
    attrp->class_name = _ctx->className;
    attrp->attr_name  = name;
    _ctx->properties.emplace_back(name, attrp);
    return *this;
}

template <typename T>
template <typename Method>
class_<T> &class_<T>::staticFunction(const char *name, Method method) {
    using MTYPE          = intl::StaticMethod<Method>;
    auto *methodp        = ccnew MTYPE();
    methodp->method_name = name;
    methodp->class_name  = _ctx->className;
    methodp->arg_count   = MTYPE::ARG_N;
    methodp->func        = method;
    _ctx->staticFunctions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::staticFunction(const char *name, SeCallbackFnPtr callback) {
    auto *methodp        = ccnew intl::StaticMethodBase();
    methodp->method_name = name;
    methodp->class_name  = _ctx->className;
    methodp->arg_count   = -1;
    methodp->bfnPtr      = callback;
    _ctx->staticFunctions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
template <typename Getter, typename Setter>
class_<T> &class_<T>::staticProperty(const char *name, Getter getter, Setter setter) {
    using ATYPE       = intl::StaticAttribute<intl::SAttributeAccessor<T, Getter, Setter>>;
    auto *attrp       = ccnew ATYPE();
    attrp->getterPtr  = ATYPE::HAS_GETTER ? getter : nullptr;
    attrp->setterPtr  = ATYPE::HAS_SETTER ? setter : nullptr;
    attrp->class_name = _ctx->className;
    attrp->attr_name  = name;
    _ctx->staticProperties.emplace_back(name, attrp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::staticProperty(const char *name, SeCallbackFnPtr getter, SeCallbackFnPtr setter) {
    auto *attrp       = ccnew intl::StaticAttributeBase();
    attrp->bfnGetPtr  = getter;
    attrp->bfnSetPtr  = setter;
    attrp->class_name = _ctx->className;
    attrp->attr_name  = name;
    _ctx->staticProperties.emplace_back(name, attrp);
    return *this;
}


} // namespace sebind
