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

#include <cstddef>
#include <iostream>
#include <type_traits>

#include "intl/EventIntl.h"
#include "intl/List.h"

namespace cc {
namespace event {

class BusEventListenerBase {
public:
    BusEventListenerBase *next{nullptr};
    BusEventListenerBase *prev{nullptr};
};

class BusEventListenerContainer {
public:
    BusEventListenerContainer() = default;
    virtual ~BusEventListenerContainer() = default;
    bool addListener(BusEventListenerBase *);
    bool removeListener(BusEventListenerBase *);

    template <typename EHandler, typename... ARGS>
    bool broadcast(ARGS &&...args);

private:
    bool doAddListener(BusEventListenerBase *listener) {
        return intl::listAppend(&_arr, listener);
    }
    bool doRemoveListener(BusEventListenerBase *listener) {
        return intl::detachFromList(&_arr, listener);
    }
    bool hasPending() const {
        return _pendingDel || _pendingNew;
    }
    void fixPendings();

protected:
    BusEventListenerBase *_arr{nullptr};
    BusEventListenerBase *_pendingNew{nullptr};
    BusEventListenerBase *_pendingDel{nullptr};
    int _isBroadcasting = 0;
};

template <typename EHandler, typename... ARGS>
class BusEventBroadcaster : public BusEventListenerContainer {
public:
    bool doBroadcast(ARGS &&...args);
};

template <typename EHandler, typename... ARGS>
bool BusEventListenerContainer::broadcast(ARGS &&...args) {
    using BusType = BusEventBroadcaster<EHandler, ARGS...>;
    _isBroadcasting++;
    auto ret = static_cast<BusType *>(this)->doBroadcast(std::forward<ARGS>(args)...);
    _isBroadcasting--;
    if (!_isBroadcasting && hasPending()) {
        fixPendings();
    }
    return false;
}

template <typename EHandler>
class BusEventListenerDB final {
public:
    static BusEventListenerContainer *container() {
        if (ctn == nullptr) {
            ctn = new BusEventListenerContainer;
        }
        return ctn;
    }

private:
    static BusEventListenerContainer *ctn;
};

template <typename EHandler>
BusEventListenerContainer *BusEventListenerDB<EHandler>::ctn = nullptr;

template <typename BusType, typename R, typename... ARGS>
struct BusEventTrait {
    using bus_type = BusType;
    using return_type = R;
    using argument_tuple_types = std::tuple<ARGS...>;
    constexpr static int ARG_COUNT = sizeof...(ARGS);
};
/**
 * Bus Event Listener
 */
template <typename EHandler>
class Listener : public BusEventListenerBase {
public:
    using bus_type = typename EHandler::bus_type;
    using return_type = typename EHandler::return_type;
    using argument_tuple_types = typename EHandler::argument_tuple_types;
    using _argument_wrapper = typename intl::TupleExtractor<argument_tuple_types>;
    // using func_type = typename _argument_wrapper::func_type;
    using std_func_type = typename _argument_wrapper::std_func_type;

    constexpr static const char *BUS_NAME = EHandler::BUS_NAME;
    constexpr static const char *HANDLE_CLASS = EHandler::HANDLE_CLASS;

    Listener();
    ~Listener();

    inline bool isEnabled() const { return _enabled; }
    inline void enable() { _enabled = true; }
    inline void disable() { _enabled = false; }
    inline void reset() { _callback = nullptr; }

    template <typename Fn>
    bool bind(Fn &&func) {
        _callback = intl::convertLambda(std::forward<Fn>(func));
        return true;
    }

    template <typename... ARGS>
    void invoke(ARGS &&...args) {
        if (_callback && _enabled) {
            _callback(std::forward<ARGS>(args)...);
        } else {
            std::cerr << "[ERROR] listener has no bound function or disabled!" << std::endl;
        }
    }

    const char *getBusName() const { return BUS_NAME; }
    const char *getHanlderName() const { return HANDLE_CLASS; }

private:
    bool _enabled{true};
    std_func_type _callback;
};

template <typename EHandler>
Listener<EHandler>::Listener() {
    BusEventListenerDB<EHandler>::container()->addListener(this);
}

template <typename EHandler>
Listener<EHandler>::~Listener() {
    BusEventListenerDB<EHandler>::container()->removeListener(this);
}

template <typename EHandler, typename... ARGS>
bool BusEventBroadcaster<EHandler, ARGS...>::doBroadcast(ARGS &&...args) {
    // broadcast events to all listeners
    EVENT_LIST_LOOP_BEGIN(curr, _arr)
    static_cast<Listener<EHandler> *>(curr)->invoke(std::forward<ARGS>(args)...);
    EVENT_LIST_LOOP_END(curr, _arr)
    return true;
}

template <typename EHandler, typename... ARGS>
void broadcast(ARGS &&...args) {
    static_assert(sizeof...(ARGS) == EHandler::ARG_COUNT, "parameter count incorrect");
    event::intl::validateParameters<0, EHandler, ARGS...>(std::forward<ARGS>(args)...);
    auto *listenerSet = BusEventListenerDB<EHandler>::container();
    listenerSet->template broadcast<EHandler, ARGS...>(std::forward<ARGS>(args)...);
}

} // namespace event
} // namespace cc

// NOLINTNEXTLINE
#define EventBusName_(n) n##_ebus

#define DECLARE_EVENT_BUS(EventBusClass)                        \
    struct EventBusClass##_ebus {                               \
        constexpr static const char *BUS_NAME = #EventBusClass; \
    };

// NOLINTNEXTLINE
#define _DECLARE_BUS_EVENT_VA(BusEventClass, EventBusClass, ...)                                             \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, __VA_ARGS__> { \
        using bus_type = EventBusName_(EventBusClass);                                                       \
        using Listener = cc::event::Listener<BusEventClass>;                                                 \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                      \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                          \
        constexpr static size_t TypeID() {                                                                   \
            return cc::event::intl::hash(#BusEventClass);                                                    \
        }                                                                                                    \
        template <typename... ARGS>                                                                          \
        static inline void emit(ARGS &&...args) {                                                            \
            cc::event::emit<BusEventClass>(std::forward<ARGS>(args)...);                                     \
        }                                                                                                    \
    };

#include "intl/EventBusMacros.h"
