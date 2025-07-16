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

#include <cassert>
#include <functional>
#include <memory>
#include <string>
#include <tuple>
#include <typeinfo>
#include <utility>

#include <unordered_map>
#include <vector>

#include "plugins/bus/BusTypes.h"

namespace cc {

namespace plugin {

struct EventBase {
    const char *eventName;
    virtual const char *signature() = 0;
};

template <typename T>
struct EventParam : std::conditional<std::is_enum<T>::value, std::true_type, std::false_type>::type {
    constexpr static bool IS_ENUM = std::is_enum<T>::value;
    using type = typename std::conditional<IS_ENUM, T, void>::type;
};

template <bool>
struct Char;
template <>
struct Char<true> {
    static constexpr char VALUE{'E'};
};
template <>
struct Char<false> {
    static constexpr char VALUE{'?'};
};

template <typename T>
struct Signature {
    constexpr static char name() { return Char<std::is_enum<T>::value>::VALUE; }
};

#define USE_EVENT_PARAMETER_TYPE(tp, sig_name) \
    template <>                                \
    struct EventParam<tp> : std::true_type {   \
        using type = tp;                       \
    };                                         \
    template <>                                \
    struct Signature<tp> {                     \
        constexpr static char name() {         \
            return (#sig_name)[0];             \
        }                                      \
    }

#define PARAMETER_TYPES(F) \
    F(char, c);            \
    F(int8_t, b);          \
    F(uint8_t, B);         \
    F(uint16_t, S);        \
    F(int16_t, s);         \
    F(uint32_t, I);        \
    F(int32_t, i);         \
    F(uint64_t, J);        \
    F(int64_t, j);         \
    F(float, f);           \
    F(double, d);          \
    F(const char *, s);    \
    F(void *, v);

PARAMETER_TYPES(USE_EVENT_PARAMETER_TYPE)

template <typename T>
struct ExactSignature;

template <typename... ARGS>
struct ExactSignature<std::tuple<ARGS...>> {
    constexpr static char SIGNATURE[sizeof...(ARGS) + 1] = {Signature<ARGS>::name()..., '\0'};
};

template <typename T>
struct Event : EventBase {
    T info;
    explicit Event(const T &info) : info(info) {}
    explicit Event(T &&event) : info(std::move(event)) {}
    const char *signature() override {
        return ExactSignature<T>::SIGNATURE;
    }
};

template <typename T>
constexpr bool validateParameterType() {
    static_assert(EventParam<T>::value, "invalidate parameter type");
    return true;
}

template <typename... ARGS>
constexpr void validateParameterTypes(const std::tuple<ARGS...> * /*unused*/) {
    std::array<bool, sizeof...(ARGS)> result = {
        validateParameterType<ARGS>()...};
}

class EventBus;
struct EventCallbackBase;

class Listener {
public:
    explicit Listener(BusType type);
    Listener(BusType type, const char *name);
    ~Listener();

    template <typename C>
    void receive(C callback);

    Listener(const Listener &) = delete;
    Listener &operator=(const Listener &) = delete;

private:
    explicit Listener(EventBus *bus);

    EventBus *_bus{nullptr};
    std::vector<std::shared_ptr<EventCallbackBase>> _handles;
    friend class EventBus;
#if CC_DEBUG
    bool _callbackAdded{false};
    std::string _name;
#endif
};

class EventBus {
public:
    static EventBus *acquire(BusType type);

    EventBus() = default;

    template <typename... ARGS>
    void send(ARGS &&...args);

private:
    void dispatch(EventBase *event);
    void addListener(Listener *);
    void removeListener(Listener *);
    std::vector<Listener *> _listeners;

    friend class Listener;
};

template <typename... ARGS>
void EventBus::send(ARGS &&...args) {
    using arg_type = std::tuple<typename std::remove_cv<typename EventParam<ARGS>::type>::type...>;
    constexpr static arg_type TMP;
    validateParameterTypes(&TMP);
    Event<arg_type> event(std::make_tuple<typename std::remove_cv<typename EventParam<ARGS>::type>::type...>(std::forward<ARGS>(args)...));
    dispatch(&event);
}

template <typename T>
struct EventCallbackImpl;

template <typename... ARGS>
struct EventCallbackImpl<void (*)(ARGS...)> {
    using arg_tuple_type = std::tuple<ARGS...>;
    using func_type = std::function<void(ARGS...)>;
    static constexpr size_t ARG_N = sizeof...(ARGS);
    static constexpr char SIGNATURE[ARG_N + 1] = {Signature<ARGS>::name()..., '\0'};
};

template <typename... ARGS>
struct EventCallbackImpl<std::function<void(ARGS...)>> {
    using arg_tuple_type = std::tuple<ARGS...>;
    using func_type = std::function<void(ARGS...)>;
    static constexpr size_t ARG_N = sizeof...(ARGS);
    static constexpr char SIGNATURE[ARG_N + 1] = {Signature<ARGS>::name()..., '\0'};
};

template <typename C, typename... ARGS>
struct EventCallbackImpl<void (C::*)(ARGS...)> {
    using arg_tuple_type = std::tuple<ARGS...>;
    using func_type = std::function<void(ARGS...)>;
    static constexpr size_t ARG_N = sizeof...(ARGS);
    static constexpr char SIGNATURE[ARG_N + 1] = {Signature<ARGS>::name()..., '\0'};
};

template <typename C, typename... ARGS>
struct EventCallbackImpl<void (C::*)(ARGS...) const> {
    using arg_tuple_type = std::tuple<ARGS...>;
    using func_type = std::function<void(ARGS...)>;
    static constexpr size_t ARG_N = sizeof...(ARGS);
    static constexpr char SIGNATURE[ARG_N + 1] = {Signature<ARGS>::name()..., '\0'};
};
template <typename T>
struct FunctionSignature {
    using type = decltype(&T::operator());
};

template <typename R, typename... ARGS>
struct FunctionSignature<R (*)(ARGS...)> {
    using type = R (*)(ARGS...);
};

template <typename R, typename C, typename... ARGS>
struct FunctionSignature<R (C::*)(ARGS...)> {
    using type = R (C::*)(ARGS...);
};

template <typename R, typename C, typename... ARGS>
struct FunctionSignature<R (C::*)(ARGS...) const> {
    using type = R (C::*)(ARGS...) const;
};

struct EventCallbackBase {
    virtual void invoke(EventBase *) = 0;
    virtual const char *signature() = 0;
};

template <typename L>
struct EventCallback : EventCallbackBase {
    using impl = EventCallbackImpl<typename FunctionSignature<L>::type>;
    using fn_type = typename impl::func_type;
    using arg_tuple_type = typename impl::arg_tuple_type;
    using wrap_fn_type = std::function<void(const arg_tuple_type &)>;
    static constexpr size_t ARG_N = impl::ARG_N;

    wrap_fn_type fun;
    void invoke(EventBase *base) override {
        using event_type = Event<arg_tuple_type>;
        auto *event = reinterpret_cast<event_type *>(base);
        fun(event->info);
    }

    const char *signature() override {
        //return typeid(arg_tuple_type).name();
        return impl::SIGNATURE;
    }
};

template <typename F, typename... ARGS, size_t... indexs>
void callWithTuple(F func, const std::tuple<ARGS...> &args, const std::index_sequence<indexs...> & /*unused*/) {
    func(std::get<indexs>(args)...);
}

template <typename C>
void Listener::receive(C callback) {
    using CallbackType = EventCallback<C>;
    using tuple_arg_type = typename CallbackType::arg_tuple_type;
    typename CallbackType::fn_type func = callback;

#if CC_DEBUG
    assert(!_callbackAdded); // callback should be add only once!
    _callbackAdded = true;
#endif
    auto wrap = [=](const tuple_arg_type &arg) {
        callWithTuple(func, arg, std::make_index_sequence<CallbackType::ARG_N>{});
    };

    auto context = std::make_shared<CallbackType>();
    context->fun = wrap;
    _handles.emplace_back(std::move(context));
}

template <typename... ARGS>
void send(cc::plugin::BusType bus, ARGS &&...args) {
    cc::plugin::EventBus::acquire(bus)->send(std::forward<ARGS>(args)...);
}

} // namespace plugin
} // namespace cc
