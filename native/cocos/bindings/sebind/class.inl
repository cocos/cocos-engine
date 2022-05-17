#pragma once

#include <string>
#include <tuple>
#include <utility>
#include <vector>
#include "bindings/jswrapper/SeApi.h"
#include "bindings/jswrapper/Value.h"

#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/jsb_global.h"
#include "intl/common.h"

namespace sebind {


template <typename T>
class class_ { //NOLINT
public:
    using class_type = T;
    using context_   = intl::context_db_::context_;

    explicit class_(context_ *ctx) : _ctx(ctx) {}
    explicit class_(const std::string &name);
    explicit class_(const std::string &name, se::Object *parentProto);

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
    class_ &function(const std::string &name, Method method);

    template <typename Field>
    class_ &property(const std::string &name, Field field);

    template <typename Getter, typename Setter>
    class_ &property(const std::string &name, Getter getter, Setter setter);

    template <typename Method>
    class_ &staticFunction(const std::string &name, Method method);

    template <typename Getter, typename Setter>
    class_ &staticProperty(const std::string &name, Getter getter, Setter setter);

    class_ &constructor(SeCallbackFnPtr callback);

    class_ &function(const std::string &name, SeCallbackFnPtr callback);

    class_ &property(const std::string &name, SeCallbackFnPtr getter, SeCallbackFnPtr setter);

    class_ &staticFunction(const std::string &name, SeCallbackFnPtr callback);

    class_ &staticProperty(const std::string &name, SeCallbackFnPtr getter, SeCallbackFnPtr setter);

    se::Object *prototype() {
        return _ctx->kls->getProto();
    }

private:
    bool      _installed{false};
    context_ *_ctx{nullptr};
    template <typename R>
    friend void genericConstructor(const v8::FunctionCallbackInfo<v8::Value> &);
};


// implements

template <typename T>
class_<T>::class_(const std::string &name) {
    _ctx            = intl::context_db_::instance()[name];
    _ctx->className = name;
}

template <typename T>
class_<T>::class_(const std::string &name, se::Object *parentProto) {
    _ctx              = intl::context_db_::instance()[name];
    _ctx->className   = name;
    _ctx->parentProto = parentProto;
}

template <typename T>
template <typename... ARGS>
class_<T> &class_<T>::constructor() {
    using CTYPE = intl::Constructor<intl::TypeList<T, ARGS...>>;
    using MTYPE = intl::TypeMapping<intl::TypeList<ARGS...>>;
    static_assert(intl::IsConstructibleWithTypeList<T, typename MTYPE::result_types>::value, "No matched constructor found");
    auto *constructp      = new CTYPE();
    constructp->arg_count = MTYPE::NEW_ARGN;
    _ctx->constructors.emplace_back(constructp);
    return *this;
}

template <typename T>
template <typename F>
class_<T> &class_<T>::constructor(F callback) {
    using FTYPE           = intl::FunctionWrapper<F>;
    static_assert(std::is_same<typename FTYPE::return_type, T*>::value);
    using CTYPE           = intl::Constructor<typename FTYPE::type>;
    auto *constructp      = new CTYPE();
    constructp->arg_count = FTYPE::ARG_N;
    constructp->func      = callback;
    _ctx->constructors.emplace_back(constructp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::constructor(SeCallbackFnPtr callback) {
    auto *constructp      = new intl::ConstructorBase();
    constructp->arg_count = -1;
    constructp->bfnPtr    = callback;
    _ctx->constructors.emplace_back(constructp);
    return *this;
}

template <typename T>
template <typename F>
class_<T> &class_<T>::finalizer(F callback) {
    auto *fin = new intl::Finalizer<T>();
    fin->func = callback;
    _ctx->finalizeCallbacks.emplace_back(fin);
    return *this;
}

template <typename T>
template <typename Method>
class_<T> &class_<T>::function(const std::string &name, Method method) {
    using MTYPE = intl::InstanceMethod<Method>;
    static_assert(std::is_base_of<typename MTYPE::class_type, T>::value, "incorrect class type");
    auto *methodp        = new MTYPE();
    methodp->method_name = name;
    methodp->class_name  = _ctx->className;
    methodp->arg_count   = MTYPE::ARG_N;
    methodp->func        = method;
    _ctx->functions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::function(const std::string &name, SeCallbackFnPtr callback) {
    auto *methodp        = new intl::InstanceMethodBase();
    methodp->method_name = name;
    methodp->class_name  = _ctx->className;
    methodp->arg_count   = -1;
    methodp->bfnPtr      = callback;
    _ctx->functions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
template <typename Field>
class_<T> &class_<T>::property(const std::string &name, Field field) {
    static_assert(std::is_member_pointer<Field>::value, "2nd parameter should be a member pointer");
    using FTYPE = intl::InstanceField<Field>;
    static_assert(std::is_base_of<typename FTYPE::class_type, T>::value, "class_type incorrect");
    auto *fieldp       = new FTYPE();
    fieldp->func       = field;
    fieldp->attr_name  = name;
    fieldp->class_name = _ctx->className;
    _ctx->fields.emplace_back(name, fieldp);
    return *this;
}

template <typename T>
template <typename Getter, typename Setter>
class_<T> &class_<T>::property(const std::string &name, Getter getter, Setter setter) {
    using ATYPE       = intl::InstanceAttribute<intl::AttributeAccessor<T, Getter, Setter>>;
    auto *attrp       = new ATYPE();
    attrp->getterPtr  = ATYPE::HAS_GETTER ? getter : nullptr;
    attrp->setterPtr  = ATYPE::HAS_SETTER ? setter : nullptr;
    attrp->class_name = _ctx->className;
    attrp->attr_name  = name;
    _ctx->properties.emplace_back(name, attrp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::property(const std::string &name, SeCallbackFnPtr getter, SeCallbackFnPtr setter) {
    auto *attrp       = new intl::InstanceAttributeBase();
    attrp->bfnGetPtr  = getter;
    attrp->bfnSetPtr  = setter;
    attrp->class_name = _ctx->className;
    attrp->attr_name  = name;
    _ctx->properties.emplace_back(name, attrp);
    return *this;
}

template <typename T>
template <typename Method>
class_<T> &class_<T>::staticFunction(const std::string &name, Method method) {
    using MTYPE          = intl::StaticMethod<Method>;
    auto *methodp        = new MTYPE();
    methodp->method_name = name;
    methodp->class_name  = _ctx->className;
    methodp->arg_count   = MTYPE::ARG_N;
    methodp->func        = method;
    _ctx->staticFunctions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::staticFunction(const std::string &name, SeCallbackFnPtr callback) {
    auto *methodp        = new intl::StaticMethodBase();
    methodp->method_name = name;
    methodp->class_name  = _ctx->className;
    methodp->arg_count   = -1;
    methodp->bfnPtr      = callback;
    _ctx->staticFunctions.emplace_back(name, methodp);
    return *this;
}

template <typename T>
template <typename Getter, typename Setter>
class_<T> &class_<T>::staticProperty(const std::string &name, Getter getter, Setter setter) {
    using ATYPE       = intl::StaticAttribute<intl::SAttributeAccessor<T, Getter, Setter>>;
    auto *attrp       = new ATYPE();
    attrp->getterPtr  = ATYPE::HAS_GETTER ? getter : nullptr;
    attrp->setterPtr  = ATYPE::HAS_SETTER ? setter : nullptr;
    attrp->class_name = _ctx->className;
    attrp->attr_name  = name;
    _ctx->staticProperties.emplace_back(name, attrp);
    return *this;
}

template <typename T>
class_<T> &class_<T>::staticProperty(const std::string &name, SeCallbackFnPtr getter, SeCallbackFnPtr setter) {
    auto *attrp       = new intl::StaticAttributeBase();
    attrp->bfnGetPtr  = getter;
    attrp->bfnSetPtr  = setter;
    attrp->class_name = _ctx->className;
    attrp->attr_name  = name;
    _ctx->staticProperties.emplace_back(name, attrp);
    return *this;
}


} // namespace sebind
