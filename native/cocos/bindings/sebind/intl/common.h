/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include <cstdint>
#include <tuple>
#include <type_traits>
#include <utility>

#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/jsb_global.h"

#include "base/std/container/array.h"
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"

namespace sebind {

struct ThisObject {};
using SeCallbackType = bool(se::State &);
using SeCallbackFnPtr = bool (*)(se::State &);

namespace intl {

template <typename T>
struct FunctionExactor;

template <typename R, typename... ARGS>
struct FunctionExactor<R(ARGS...)> {
    using type = R(ARGS...);
    using return_type = R;
    static std::function<R(ARGS...)> bind(const se::Value &fnVal) {
        std::function<R(ARGS...)> func = [=](ARGS... args) {
            se::AutoHandleScope scope;
            se::ValueArray jsArgs;
            jsArgs.resize(sizeof...(ARGS));
            nativevalue_to_se_args_v(jsArgs, std::forward<ARGS>(args)...);
            se::Value rval;
            bool succ = fnVal.toObject()->call(jsArgs, nullptr, &rval);
            if constexpr (!std::is_void_v<R>) {
                R result;
                sevalue_to_native(rval, &result, nullptr);
                return result;
            }
        };
        return func;
    }
    static R call(se::Object *jsThisObject, const se::Value &fnVal, ARGS &&...args) {
        se::AutoHandleScope scope;
        se::ValueArray jsArgs;
        jsArgs.resize(sizeof...(ARGS));
        nativevalue_to_se_args_v(jsArgs, std::forward<ARGS>(args)...);
        se::Value rval;
        bool succ = fnVal.toObject()->call(jsArgs, jsThisObject, &rval);
        if constexpr (!std::is_void_v<R>) {
            R result;
            sevalue_to_native(rval, &result, jsThisObject);
            return result;
        }
    }
};

template <typename... ARGS>
struct TypeList;

template <typename T, typename... OTHERS>
struct TypeList<T, OTHERS...> {
    constexpr static size_t COUNT = 1 + sizeof...(OTHERS);
    using head = T;
    using tail = TypeList<OTHERS...>;
    using tuple_type = std::tuple<T, OTHERS...>;
    using tuple_type_mutable = std::tuple<typename std::remove_reference<typename std::remove_const<T>::type>::type,
                                          typename std::remove_reference<typename std::remove_const<OTHERS>::type>::type...>;
};

template <>
struct TypeList<> {
    constexpr static size_t COUNT = 0;
    using head = void;
    using tail = TypeList<>;
    using tuple_type = std::tuple<>;
    using tuple_type_mutable = std::tuple<>;
};

template <typename T, typename O>
struct Cons;

template <typename T, typename... OTHERS>
struct Cons<T, TypeList<OTHERS...>> {
    using type = TypeList<T, OTHERS...>;
};

template <typename T>
struct FunctionWrapper;

template <typename R, typename C, typename... ARGS>
struct FunctionWrapper<R (*)(C *, ARGS...)> {
    using type = R (*)(C *, ARGS...);
    using return_type = R;
    using arg_list = TypeList<ARGS...>;
    static constexpr size_t ARG_N = sizeof...(ARGS);
    template <typename... ARGS2>
    inline static R invoke(type func, C *self, ARGS2 &&...args) {
        return (*func)(self, std::forward<ARGS2>(args)...);
    }
};

template <typename R, typename C, typename... ARGS>
struct FunctionWrapper<R (C::*)(ARGS...)> {
    using type = R (C::*)(ARGS...);
    using return_type = R;
    using arg_list = TypeList<ARGS...>;
    static constexpr size_t ARG_N = sizeof...(ARGS);
    template <typename... ARGS2>
    inline static R invoke(type func, C *self, ARGS2 &&...args) {
        return (self->*func)(std::forward<ARGS2>(args)...);
    }
};

template <typename R, typename C, typename... ARGS>
struct FunctionWrapper<R (C::*)(ARGS...) const> {
    using type = R (C::*)(ARGS...) const;
    using return_type = R;
    using arg_list = TypeList<ARGS...>;
    static constexpr size_t ARG_N = sizeof...(ARGS);
    template <typename... ARGS2>
    inline static R invoke(type func, C *self, ARGS2 &&...args) {
        return (self->*func)(std::forward<ARGS2>(args)...);
    }
};

template <>
struct FunctionWrapper<std::nullptr_t> {
    using type = std::nullptr_t;
    using return_type = std::nullptr_t;
    using arg_list = TypeList<>;
    static constexpr size_t ARG_N = 0;
    template <typename C, typename... ARGS>
    static void invoke(type /*func*/, C * /*self*/, ARGS &&.../*args*/) {
    }
};

template <typename T>
struct StaticFunctionWrapper;

template <typename R, typename... ARGS>
struct StaticFunctionWrapper<R (*)(ARGS...)> {
    using type = R (*)(ARGS...);
    using return_type = R;
    using arg_list = TypeList<ARGS...>;
    static constexpr size_t ARG_N = sizeof...(ARGS);
    template <typename... ARGS2>
    inline static R invoke(type func, ARGS2 &&...args) {
        return (*func)(std::forward<ARGS2>(args)...);
    }
};

template <>
struct StaticFunctionWrapper<std::nullptr_t> {
    using type = std::nullptr_t;
    using return_type = void;
    using arg_list = TypeList<>;
    static constexpr size_t ARG_N = 0;
    template <typename... ARGS>
    static void invoke(type /*func*/, ARGS &&.../*args*/) {
    }
};

template <typename T, typename S>
struct IsConstructibleWithTypeList;

template <typename T, typename... ARGS>
struct IsConstructibleWithTypeList<T, TypeList<ARGS...>> {
    // NOLINTNEXTLINE
    constexpr static bool value = std::is_constructible<T, ARGS...>::value;
};

template <typename List>
struct MapTypeListToTuple;

template <typename... OTHERS>
struct MapTypeListToTuple<TypeList<OTHERS...>> {
    using tuple = std::tuple<HolderType<OTHERS, std::is_reference<OTHERS>::value>...>;
};

template <typename T>
struct IsThisObject {
    // NOLINTNEXTLINE
    constexpr static bool value = std::is_same<ThisObject,
                                               typename std::remove_cv<
                                                   typename std::remove_reference<
                                                       typename std::remove_pointer<T>::type>::type>::type>::value;
};

template <typename... Ts>
struct FilterThisObject;

template <typename T, typename... OTHERS>
struct FilterThisObject<T, OTHERS...> {
    using filtered_types = std::conditional_t<IsThisObject<T>::value,
                                              typename FilterThisObject<OTHERS...>::filtered_types,
                                              typename Cons<T, typename FilterThisObject<OTHERS...>::filtered_types>::type>;
    using mapped_types = typename Cons<std::conditional_t<IsThisObject<T>::value, se::Object *, T>,
                                       typename FilterThisObject<OTHERS...>::mapped_types>::type;
};

template <>
struct FilterThisObject<> {
    using filtered_types = TypeList<>;
    using mapped_types = TypeList<>;
};

template <size_t From, size_t To, bool Skip>
struct MapArg {
    constexpr static size_t FROM = From;
    constexpr static size_t TO = To; // NOLINT
    constexpr static bool SKIP = Skip;
};

template <size_t From, size_t Remain>
struct GenMapArgImpl {
    using list = typename Cons<MapArg<From, 0, true>, typename GenMapArgImpl<From + 1, Remain - 1>::list>::type;
};

template <size_t From>
struct GenMapArgImpl<From, 0> {
    using list = TypeList<>;
};

template <size_t N>
struct GenMapArg {
    using list = typename GenMapArgImpl<0, N>::list;
};

template <int FullIdx, int IncompleteIdx, int FullRemain, int IncompleteRemain, typename FullTypeList, typename IncompleteTypeList>
struct TypeListMapImpl {
    constexpr static bool SHOULD_SKIP = IsThisObject<typename FullTypeList::head>::value;
    constexpr static int NEXT_INCOMPLETE = SHOULD_SKIP ? IncompleteIdx : IncompleteIdx + 1;
    constexpr static int NEXT_INCOMPLETE_REMAIN = SHOULD_SKIP ? IncompleteRemain : IncompleteRemain - 1;
    using full_tail = typename FullTypeList::tail;
    using incomplete_tail = std::conditional_t<SHOULD_SKIP, IncompleteTypeList, typename IncompleteTypeList::tail>;
    using map_value = MapArg<FullIdx, IncompleteIdx, SHOULD_SKIP>;
    using map_list = typename Cons<map_value, typename TypeListMapImpl<FullIdx + 1, NEXT_INCOMPLETE, FullRemain - 1, NEXT_INCOMPLETE_REMAIN, full_tail, incomplete_tail>::map_list>::type;
};

template <int FullIdx, int IncompleteIdx, typename FullTypeList, typename IncompleteTypeList>
struct TypeListMapImpl<FullIdx, IncompleteIdx, 0, 0, FullTypeList, IncompleteTypeList> {
    using map_list = TypeList<>;
};

template <int FullIdx, int IncompleteIdx, int FullRemain, typename FullTypeList, typename IncompleteTypeList>
struct TypeListMapImpl<FullIdx, IncompleteIdx, FullRemain, 0, FullTypeList, IncompleteTypeList> {
    static_assert(FullRemain == FullTypeList::COUNT, "Parameter count incorrect!");
    using map_list = typename GenMapArg<FullRemain>::list;
};

template <typename FullTypeList, typename IncompleteTypeList>
struct TypeListMap {
    using map_list = typename TypeListMapImpl<0, 0, FullTypeList::COUNT, IncompleteTypeList::COUNT, FullTypeList, IncompleteTypeList>::map_list;
};

template <typename T>
struct TypeMapping;

template <typename... ARGS>
struct TypeMapping<TypeList<ARGS...>> {
    using declare_types = TypeList<ARGS...>;
    using input_types = typename FilterThisObject<ARGS...>::filtered_types;
    using result_types = typename FilterThisObject<ARGS...>::mapped_types;
    using result_types_tuple = typename result_types::tuple_type;
    using result_types_tuple_mutable = typename result_types::tuple_type_mutable;
    using input_types_tuple = typename input_types::tuple_type;
    using mapping_list = typename TypeListMap<declare_types, input_types>::map_list;
    static constexpr size_t FULL_ARGN = sizeof...(ARGS);
    static constexpr size_t NEW_ARGN = input_types::COUNT;
    static constexpr bool NEED_REMAP = FULL_ARGN != NEW_ARGN;
};
template <bool, size_t>
struct TypeMapReturnSwitch;

template <size_t To>
struct TypeMapReturnSwitch<true, To> {
    template <typename V>
    static se::Object *select(se::Object *self, V & /*unused*/) {
        return self;
    }
};

template <size_t To>
struct TypeMapReturnSwitch<false, To> {
    template <typename V>
    static auto select(se::Object * /*unused*/, V &tuple) {
        return std::get<To>(tuple).value();
    }
};

struct ArgumentFilter {
    template <typename MapTuple, typename Tuple, size_t index>
    static auto forward(se::Object *self, Tuple &tuple) {
        constexpr static MapTuple TUPLE_VAL;
        using map_arg = std::remove_reference_t<decltype(std::get<index>(TUPLE_VAL))>;
        return TypeMapReturnSwitch<map_arg::SKIP, map_arg::TO>::select(self, tuple);
    }
};

template <typename ResultType, typename Mapping, typename TupleIn, size_t... indexes>
ResultType mapTupleArguments(se::Object *self, TupleIn &input, std::index_sequence<indexes...> /*args*/) {
    using map_tuple = typename Mapping::mapping_list::tuple_type;
    using result_type = typename Mapping::result_types_tuple_mutable;
    static_assert(std::is_same<ResultType, result_type>::value, "result_type mismatch");
    // if constexpr (std::tuple_size<result_type>::value > 0) {
    return result_type(ArgumentFilter::forward<map_tuple, TupleIn, indexes>(self, input)...);
    //}
    // return result_type();
}

template <size_t M, size_t N>
struct BoolArrayAndAll {
    static constexpr bool cal(const ccstd::array<bool, N> &bools) {
        return bools[M - 1] && BoolArrayAndAll<M - 1, N>::cal(bools);
    }
};

template <size_t N>
struct BoolArrayAndAll<0, N> {
    static constexpr bool cal(const ccstd::array<bool, N> & /*unused*/) {
        return true;
    }
};

template <typename... ARGS, size_t... indexes>
// NOLINTNEXTLINE
bool convert_js_args_to_tuple(const se::ValueArray &jsArgs, std::tuple<ARGS...> &args, se::Object *thisObj, std::index_sequence<indexes...>) {
    constexpr static size_t ARG_N = sizeof...(ARGS);
    ccstd::array<bool, ARG_N> all = {sevalue_to_native(jsArgs[indexes], &std::get<indexes>(args).data, thisObj)...};
    return BoolArrayAndAll<ARG_N, ARG_N>::cal(all);
}
template <size_t... indexes>
// NOLINTNEXTLINE
bool convert_js_args_to_tuple(const se::ValueArray &jsArgs, std::tuple<> &args, se::Object *ctx, std::index_sequence<indexes...>) {
    return true;
}

struct ConstructorBase {
    size_t argCount = 0;
    SeCallbackFnPtr bfnPtr{nullptr};
    virtual bool construct(se::State &state) {
        if (bfnPtr) {
            return (*bfnPtr)(state);
        }
        return false;
    }
};
struct InstanceMethodBase {
    ccstd::string className;
    ccstd::string methodName;
    size_t argCount = 0;
    SeCallbackFnPtr bfnPtr{nullptr};
    virtual bool invoke(se::State &state) const {
        if (bfnPtr) {
            return (*bfnPtr)(state);
        }
        return false;
    }
};
struct FinalizerBase {
    virtual void finalize(void * /*unused*/) {}
};

struct InstanceFieldBase {
    ccstd::string className;
    ccstd::string attrName;
    SeCallbackFnPtr bfnSetPtr{nullptr};
    SeCallbackFnPtr bfnGetPtr{nullptr};
    virtual bool get(se::State &state) const {
        if (bfnGetPtr) return (*bfnGetPtr)(state);
        return false;
    }
    virtual bool set(se::State &state) const {
        if (bfnSetPtr) return (*bfnSetPtr)(state);
        return false;
    }
};

struct InstanceAttributeBase {
    ccstd::string className;
    ccstd::string attrName;
    SeCallbackFnPtr bfnSetPtr{nullptr};
    SeCallbackFnPtr bfnGetPtr{nullptr};
    virtual bool get(se::State &state) const {
        if (bfnGetPtr) return (*bfnGetPtr)(state);
        return false;
    }
    virtual bool set(se::State &state) const {
        if (bfnSetPtr) return (*bfnSetPtr)(state);
        return false;
    }
};

struct StaticMethodBase {
    ccstd::string className;
    ccstd::string methodName;
    size_t argCount = 0;
    SeCallbackFnPtr bfnPtr{nullptr};
    virtual bool invoke(se::State &state) const {
        if (bfnPtr) return (*bfnPtr)(state);
        return false;
    }
};
struct StaticAttributeBase {
    ccstd::string className;
    ccstd::string attrName;
    SeCallbackFnPtr bfnSetPtr{nullptr};
    SeCallbackFnPtr bfnGetPtr{nullptr};
    virtual bool get(se::State &state) const {
        if (bfnGetPtr) return (*bfnGetPtr)(state);
        return false;
    }
    virtual bool set(se::State &state) const {
        if (bfnSetPtr) return (*bfnSetPtr)(state);
        return false;
    }
};

template <typename T>
struct Constructor;

template <typename T>
struct InstanceField;

template <typename T>
struct InstanceMethod;

template <typename T>
struct InstanceAttribute;

template <typename T>
struct StaticMethod;

template <typename T>
struct StaticAttribute;

template <typename T, typename... ARGS>
struct Constructor<TypeList<T, ARGS...>> : ConstructorBase {
    // no `if constexpr`, more code is needed...
    bool construct(se::State &state) override {
        using type_mapping = TypeMapping<TypeList<ARGS...>>;
        using args_holder_type = typename MapTypeListToTuple<typename type_mapping::input_types>::tuple;
        constexpr auto indexes = std::make_index_sequence<type_mapping::FULL_ARGN>{};
        se::PrivateObjectBase *self{nullptr};
        se::Object *thisObj = state.thisObject();
        args_holder_type args{};
        const auto &jsArgs = state.args();
        convert_js_args_to_tuple(jsArgs, args, thisObj, std::make_index_sequence<type_mapping::NEW_ARGN>());
        if constexpr (type_mapping::NEED_REMAP) {
            using type_mapping = TypeMapping<TypeList<ARGS...>>;
            using map_list_type = typename type_mapping::mapping_list;
            using map_tuple_type = typename type_mapping::result_types_tuple_mutable;
            static_assert(map_list_type::COUNT == sizeof...(ARGS), "type mapping incorrect");

            map_tuple_type remapArgs = mapTupleArguments<map_tuple_type, type_mapping>(thisObj, args, std::make_index_sequence<type_mapping::FULL_ARGN>{});
            self = constructWithTuple(remapArgs, indexes);
        } else {
            self = constructWithTupleValue(args, indexes);
        }
        state.thisObject()->setPrivateObject(self);
        return true;
    }

    template <typename... ARGS_HT, size_t... indexes>
    se::PrivateObjectBase *constructWithTuple(std::tuple<ARGS_HT...> &args, std::index_sequence<indexes...> /*unused*/) {
        return JSB_MAKE_PRIVATE_OBJECT(T, std::get<indexes>(args)...);
    }

    template <typename... ARGS_HT, size_t... indexes>
    se::PrivateObjectBase *constructWithTupleValue(std::tuple<ARGS_HT...> &args, std::index_sequence<indexes...> /*unused*/) {
        return JSB_MAKE_PRIVATE_OBJECT(T, std::get<indexes>(args).value()...);
    }
};

template <typename T, typename... ARGS>
struct Constructor<T *(*)(ARGS...)> : ConstructorBase {
    using type = T *(*)(ARGS...);
    type func{nullptr};
    bool construct(se::State &state) override {
        if ((sizeof...(ARGS)) != state.args().size()) {
            return false;
        }
        std::tuple<HolderType<ARGS, std::is_reference<ARGS>::value>...> args{};
        const auto &jsArgs = state.args();
        se::Object *thisObj = state.thisObject();
        convert_js_args_to_tuple(jsArgs, args, thisObj, std::make_index_sequence<sizeof...(ARGS)>());
        T *ptr = constructWithTuple(args, std::make_index_sequence<sizeof...(ARGS)>());
        state.thisObject()->setPrivateData(ptr);
        return true;
    }

    template <typename... ARGS_HT, size_t... indexes>
    T *constructWithTuple(std::tuple<ARGS_HT...> &args, std::index_sequence<indexes...> /*unused*/) {
        return (*func)(std::get<indexes>(args).value()...);
    }
};

template <typename T>
struct Finalizer : FinalizerBase {
    using type = void (*)(T *);
    using arg_type = T;
    type func{nullptr};
    void finalize(void *ptr) override {
        (*func)(reinterpret_cast<T *>(ptr));
    }
};

template <typename T, typename R, typename... ARGS>
struct InstanceMethod<R (T::*)(ARGS...)> : InstanceMethodBase {
    using type = R (T::*)(ARGS...);
    using return_type = R;
    using class_type = std::remove_cv_t<T>;
    constexpr static size_t ARG_N = sizeof...(ARGS);
    constexpr static bool RETURN_VOID = std::is_same<void, R>::value;

    type func{nullptr};

    template <typename... ARGS_HT, size_t... indexes>
    R callWithTuple(T *self, std::tuple<ARGS_HT...> &args, std::index_sequence<indexes...> /*unused*/) const {
        return ((reinterpret_cast<T *>(self))->*func)(std::get<indexes>(args).value()...);
    }

    bool invoke(se::State &state) const override {
        constexpr auto indexes{std::make_index_sequence<sizeof...(ARGS)>()};
        T *self = reinterpret_cast<T *>(state.nativeThisObject());
        se::Object *thisObject = state.thisObject();
        const auto &jsArgs = state.args();
        if (ARG_N != jsArgs.size()) {
            SE_LOGE("incorret argument size %d, expect %d\n", static_cast<int>(jsArgs.size()), static_cast<int>(ARG_N));
            return false;
        }
        std::tuple<HolderType<ARGS, std::is_reference<ARGS>::value>...> args{};
        convert_js_args_to_tuple(jsArgs, args, thisObject, indexes);
        if constexpr (RETURN_VOID) {
            callWithTuple(self, args, indexes);
        } else {
            nativevalue_to_se(callWithTuple(self, args, indexes), state.rval(), state.thisObject());
        }
        return true;
    }
};

template <typename T, typename R, typename... ARGS>
struct InstanceMethod<R (T::*)(ARGS...) const> : InstanceMethodBase {
    using type = R (T::*)(ARGS...) const;
    using return_type = R;
    using class_type = std::remove_cv_t<T>;
    constexpr static size_t ARG_N = sizeof...(ARGS);
    constexpr static bool RETURN_VOID = std::is_same<void, R>::value;

    type func{nullptr};

    template <typename... ARGS_HT, size_t... indexes>
    R callWithTuple(T *self, std::tuple<ARGS_HT...> &args, std::index_sequence<indexes...> /*unused*/) const {
        return ((reinterpret_cast<T *>(self))->*func)(std::get<indexes>(args).value()...);
    }

    bool invoke(se::State &state) const override {
        constexpr auto indexes{std::make_index_sequence<sizeof...(ARGS)>()};
        T *self = reinterpret_cast<T *>(state.nativeThisObject());
        se::Object *thisObject = state.thisObject();
        const auto &jsArgs = state.args();
        if (ARG_N != jsArgs.size()) {
            SE_LOGE("incorret argument size %d, expect %d\n", static_cast<int>(jsArgs.size()), static_cast<int>(ARG_N));
            return false;
        }
        std::tuple<HolderType<ARGS, std::is_reference<ARGS>::value>...> args{};
        convert_js_args_to_tuple(jsArgs, args, thisObject, indexes);
        if constexpr (RETURN_VOID) {
            callWithTuple(self, args, indexes);
        } else {
            nativevalue_to_se(callWithTuple(self, args, indexes), state.rval(), state.thisObject());
        }
        return true;
    }
};

template <typename T, typename R, typename... ARGS>
struct InstanceMethod<R (*)(T *, ARGS...)> : InstanceMethodBase {
    using type = R (*)(T *, ARGS...);
    using return_type = R;
    using class_type = std::remove_cv_t<T>;
    constexpr static size_t ARG_N = sizeof...(ARGS);
    constexpr static bool RETURN_VOID = std::is_same<void, R>::value;

    type func{nullptr};

    template <typename... ARGS_HT, size_t... indexes>
    R callWithTuple(T *self, std::tuple<ARGS_HT...> &args, std::index_sequence<indexes...> /*unused*/) const {
        return (*func)(reinterpret_cast<T *>(self), std::get<indexes>(args).value()...);
    }

    bool invoke(se::State &state) const override {
        constexpr auto indexes{std::make_index_sequence<sizeof...(ARGS)>()};
        T *self = reinterpret_cast<T *>(state.nativeThisObject());
        se::Object *thisObject = state.thisObject();
        const auto &jsArgs = state.args();
        if (ARG_N != jsArgs.size()) {
            SE_LOGE("incorret argument size %d, expect %d\n", static_cast<int>(jsArgs.size()), static_cast<int>(ARG_N));
            return false;
        }
        std::tuple<HolderType<ARGS, std::is_reference<ARGS>::value>...> args{};
        convert_js_args_to_tuple(jsArgs, args, thisObject, indexes);
        if constexpr (RETURN_VOID) {
            callWithTuple(self, args, indexes);
        } else {
            nativevalue_to_se(callWithTuple(self, args, indexes), state.rval(), state.thisObject());
        }
        return true;
    }
};

struct InstanceMethodOverloaded : InstanceMethodBase {
    ccstd::vector<InstanceMethodBase *> functions;
    bool invoke(se::State &state) const override {
        bool ret = false;
        auto argCount = state.args().size();
        for (auto *method : functions) {
            if (method->argCount == -1 || method->argCount == argCount) {
                ret = method->invoke(state);
                if (ret) return true;
            }
        }
        return false;
    }
};

template <typename T, typename F>
struct InstanceField<F(T::*)> : InstanceFieldBase {
    using type = F(T::*);
    using class_type = T;
    using return_type = std::remove_cv_t<F>;

    type func{nullptr};

    bool get(se::State &state) const override {
        T *self = reinterpret_cast<T *>(state.nativeThisObject());
        se::Object *thisObject = state.thisObject();
        return nativevalue_to_se((self->*func), state.rval(), thisObject);
    }

    bool set(se::State &state) const override {
        T *self = reinterpret_cast<T *>(state.nativeThisObject());
        se::Object *thisObject = state.thisObject();
        const auto &args = state.args();
        return sevalue_to_native(args[0], &(self->*func), thisObject);
    }
};

template <typename T, typename G, typename S>
struct AttributeAccessor;

template <typename T>
struct AccessorGet {
};

template <typename T>
struct AccessorSet {
};

template <>
struct AccessorGet<std::nullptr_t> {
    using class_type = std::nullptr_t;
    using type = std::nullptr_t;
    using return_type = std::nullptr_t;
};

template <>
struct AccessorSet<std::nullptr_t> {
    using class_type = std::nullptr_t;
    using type = std::nullptr_t;
    using value_type = std::nullptr_t;
};

template <typename T, typename R>
struct AccessorGet<R (T::*)()> {
    using class_type = T;
    using type = R (T::*)();
    using return_type = R;
    static_assert(!std::is_void<R>::value, "Getter should return a value!");
};

template <typename T, typename R, typename F>
struct AccessorSet<R (T::*)(F)> {
    using class_type = T;
    using type = R (T::*)(F);
    using value_type = F;
    using ignored_return_type = R;
};

template <typename T, typename R>
struct AccessorGet<R (T::*)() const> {
    using class_type = T;
    using type = R (T::*)() const;
    using return_type = R;
    static_assert(!std::is_void<R>::value, "Getter should return a value");
};

template <typename T, typename R, typename F>
struct AccessorSet<R (*)(T *, F)> {
    using class_type = T;
    using type = R (*)(T *, F);
    using value_type = F;
    using ignored_return_type = R;
};
template <typename T, typename R>
struct AccessorGet<R (*)(T *)> {
    using class_type = T;
    using type = R (*)(T *);
    using return_type = R;
    static_assert(!std::is_void<R>::value, "Getter should return a value");
};

template <typename T, typename Getter, typename Setter>
struct InstanceAttribute<AttributeAccessor<T, Getter, Setter>> : InstanceAttributeBase {
    using type = T;
    using get_accessor = AccessorGet<Getter>;
    using set_accessor = AccessorSet<Setter>;
    using getter_type = typename get_accessor::type;
    using setter_type = typename set_accessor::type;
    using set_value_type = std::remove_reference_t<std::remove_cv_t<typename set_accessor::value_type>>;
    using get_value_type = std::remove_reference_t<std::remove_cv_t<typename get_accessor::return_type>>;
    using getter_class_type = typename get_accessor::class_type;
    using setter_class_type = typename set_accessor::class_type;

    constexpr static bool HAS_GETTER = !std::is_null_pointer<getter_type>::value;
    constexpr static bool HAS_SETTER = !std::is_null_pointer<setter_type>::value;
    constexpr static bool GETTER_IS_MEMBER_FN = HAS_GETTER && std::is_member_function_pointer<Getter>::value;
    constexpr static bool SETTER_IS_MEMBER_FN = HAS_SETTER && std::is_member_function_pointer<Setter>::value;

    static_assert(!HAS_GETTER || std::is_base_of<getter_class_type, T>::value, "Getter class type is not valid!");
    static_assert(!HAS_SETTER || std::is_base_of<setter_class_type, T>::value, "Setter class type is not valid!");

    setter_type setterPtr;
    getter_type getterPtr;

    bool get(se::State &state) const override {
        if constexpr (HAS_GETTER) {
            T *self = reinterpret_cast<T *>(state.nativeThisObject());
            se::Object *thisObject = state.thisObject();
            using func_type = FunctionWrapper<getter_type>;
            static_assert(!std::is_void<typename func_type::return_type>::value, "should return a value");
            return nativevalue_to_se(func_type::invoke(getterPtr, self), state.rval(), thisObject);
        }
        return false;
    }

    bool set(se::State &state) const override {
        if constexpr (HAS_SETTER) {
            T *self = reinterpret_cast<T *>(state.nativeThisObject());
            se::Object *thisObject = state.thisObject();
            const auto &args = state.args();
            HolderType<set_value_type, std::is_reference<set_value_type>::value> temp;
            sevalue_to_native(args[0], &(temp.data), thisObject);

            using func_type = FunctionWrapper<setter_type>;
            func_type::invoke(setterPtr, self, temp.value());
            return true;
        }
        return false;
    }
};

template <typename R, typename... ARGS>
struct StaticMethod<R (*)(ARGS...)> : StaticMethodBase {
    using type = R (*)(ARGS...);
    using return_type = R;
    constexpr static size_t ARG_N = sizeof...(ARGS);
    constexpr static bool RETURN_VOID = std::is_same<void, R>::value;

    type func{nullptr};

    template <typename... ARGS_HT, size_t... indexes>
    R callWithTuple(std::tuple<ARGS_HT...> &args, std::index_sequence<indexes...> /*unused*/) const {
        return (*func)(std::get<indexes>(args).value()...);
    }

    bool invoke(se::State &state) const override {
        constexpr auto indexes{std::make_index_sequence<sizeof...(ARGS)>()};
        const auto &jsArgs = state.args();
        if (ARG_N != jsArgs.size()) {
            SE_LOGE("incorret argument size %d, expect %d\n", static_cast<int>(jsArgs.size()), static_cast<int>(ARG_N));
            return false;
        }
        std::tuple<HolderType<ARGS, std::is_reference<ARGS>::value>...> args{};
        convert_js_args_to_tuple(jsArgs, args, nullptr, indexes);
        if constexpr (RETURN_VOID) {
            callWithTuple(args, indexes);
        } else {
            nativevalue_to_se(callWithTuple(args, indexes), state.rval(), nullptr);
        }
        return true;
    }
};

struct StaticMethodOverloaded : StaticMethodBase {
    ccstd::vector<StaticMethodBase *> functions;
    bool invoke(se::State &state) const override {
        bool ret = false;
        auto argCount = state.args().size();
        for (auto *method : functions) {
            if (method->argCount == -1 || method->argCount == argCount) {
                ret = method->invoke(state);
                if (ret) return true;
            }
        }
        return false;
    }
};

template <typename T, typename G, typename S>
struct SAttributeAccessor;

template <typename T>
struct SAccessorGet {
    using type = void;
    using return_type = void;
};

template <typename T>
struct SAccessorSet {
    using type = void;
    using value_type = void;
};

template <>
struct SAccessorGet<std::nullptr_t> {
    using type = std::nullptr_t;
    using return_type = std::nullptr_t;
};

template <>
struct SAccessorSet<std::nullptr_t> {
    using type = std::nullptr_t;
    using value_type = std::nullptr_t;
};

template <typename R>
struct SAccessorGet<R(*)> {
    using type = R(*);
    using return_type = R;
    static_assert(!std::is_void<R>::value, "Getter should return value");
};

template <typename R, typename F>
struct SAccessorSet<R (*)(F)> {
    using type = R (*)(F);
    using value_type = F;
    using ignored_return_type = R;
};

template <typename T, typename Getter, typename Setter>
struct StaticAttribute<SAttributeAccessor<T, Getter, Setter>> : StaticAttributeBase {
    using type = T;
    using get_accessor = SAccessorGet<Getter>;
    using set_accessor = SAccessorSet<Setter>;
    using getter_type = typename get_accessor::type;
    using setter_type = typename set_accessor::type;
    using set_value_type = std::remove_reference_t<std::remove_cv_t<typename set_accessor::value_type>>;
    using get_value_type = std::remove_reference_t<std::remove_cv_t<typename get_accessor::return_type>>;

    constexpr static bool HAS_GETTER = !std::is_null_pointer<getter_type>::value;
    constexpr static bool HAS_SETTER = !std::is_null_pointer<setter_type>::value;

    static_assert(HAS_GETTER || HAS_SETTER, "Either getter or setter should be set");

    setter_type setterPtr;
    getter_type getterPtr;

    bool get(se::State &state) const override {
        if constexpr (HAS_GETTER) {
            using func_type = StaticFunctionWrapper<getter_type>;
            static_assert(!std::is_void<typename func_type::return_type>::value, "should return a value");
            return nativevalue_to_se(func_type::invoke(getterPtr), state.rval(), nullptr);
        }
        return false;
    }

    bool set(se::State &state) const override {
        if constexpr (HAS_SETTER) {
            const auto &args = state.args();
            HolderType<set_value_type, std::is_reference<set_value_type>::value> temp;
            sevalue_to_native(args[0], &(temp.data), nullptr);
            using func_type = StaticFunctionWrapper<setter_type>;
            func_type::invoke(setterPtr, temp.value());
            return true;
        }
        return false;
    }
};

// NOLINTNEXTLINE
class ContextDB {
public:
    // NOLINTNEXTLINE
    struct Context {
        ccstd::vector<std::tuple<ccstd::string, std::unique_ptr<InstanceAttributeBase>>> properties;
        ccstd::vector<std::tuple<ccstd::string, std::unique_ptr<InstanceFieldBase>>> fields;
        ccstd::vector<std::tuple<ccstd::string, std::unique_ptr<InstanceMethodBase>>> functions;
        ccstd::vector<std::tuple<ccstd::string, std::unique_ptr<StaticMethodBase>>> staticFunctions;
        ccstd::vector<std::tuple<ccstd::string, std::unique_ptr<StaticAttributeBase>>> staticProperties;
        ccstd::vector<std::unique_ptr<ConstructorBase>> constructors;
        ccstd::vector<std::unique_ptr<FinalizerBase>> finalizeCallbacks;
        ccstd::string className;
        se::Class *kls = nullptr;
        // se::Object *                                                  nsObject    = nullptr;
        se::Object *parentProto = nullptr;
    };
    Context *operator[](const char *key);
    static ContextDB &instance();
    static void reset();

private:
    ccstd::unordered_map<ccstd::string, std::unique_ptr<Context>> _contexts;
};

} // namespace intl
template <typename T>
auto bindFunction(const se::Value &fnVal) {
    assert(fnVal.isObject() && fnVal.toObject()->isFunction());
    return intl::FunctionExactor<T>::bind(fnVal);
}

template <typename R, typename... ARGS>
R callFunction(se::Object *jsThisObject, const se::Value &fnVal, ARGS... args) {
    using T = R(ARGS...);
    assert(fnVal.isObject() && fnVal.toObject()->isFunction());
    if constexpr (!std::is_void_v<R>) {
        return intl::FunctionExactor<T>::call(jsThisObject, fnVal, std::forward<ARGS>(args)...);
    } else {
        intl::FunctionExactor<T>::call(jsThisObject, fnVal, std::forward<ARGS>(args)...);
    }
}
template <typename R, typename... ARGS>
R callFunction(const se::Value &fnVal, ARGS... args) {
    return callFunction<R, ARGS...>(nullptr, fnVal, args...);
}
} // namespace sebind
