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

#include <cstddef>
#include <iostream>
#include <memory>
#include <type_traits>

#include "base/Log.h"
#include "base/std/container/vector.h"
#include "core/memop/Pool.h"
#include "intl/EventIntl.h"
#include "intl/List.h"

namespace cc {
namespace event {
class BusEventListenerBase;

template <typename EHandler>
class BusEventListenerDB;

template <typename EHandler, typename... ARGS>
class BusEventBroadcaster;

class BusEventListenerContainer;
struct BusEventListenerEntry {
    BusEventListenerEntry *next{nullptr};
    BusEventListenerEntry *prev{nullptr};
    BusEventListenerBase *listener{nullptr};
};
class BusEventListenerBase {
protected:
    BusEventListenerEntry *entry{nullptr}; // NOLINT
    friend class BusEventListenerContainer;
};

class BusEventListenerContainer {
public:
    template <typename EHandler, typename... ARGS>
    bool broadcast(ARGS &&...args);

protected:
    BusEventListenerContainer() = default;
    virtual ~BusEventListenerContainer() = default;
    void addListener(BusEventListenerBase *);
    void removeListener(BusEventListenerBase *);

    bool hasPendingListeners() const {
        return !_listenersToRemove.empty() || _listenersToAdd;
    }
    void addOrRemovePendingListeners();
    // fields
    BusEventListenerEntry *_listenerList{nullptr};
    BusEventListenerEntry *_listenersToAdd{nullptr};
    ccstd::vector<BusEventListenerEntry *> _listenersToRemove;
    int _isBroadcasting = 0;

    template <typename T>
    friend class BusEventListenerDB;

    template <typename EHandler, typename... ARGS>
    friend class BusEventBroadcaster;

    friend class BusEventListenerBase;
    template <typename E>
    friend class Listener;
};

template <typename EHandler, typename... ARGS>
class BusEventBroadcaster final : public BusEventListenerContainer {
public:
    bool doBroadcast(ARGS &&...args);
};

template <typename EHandler, typename... ARGS>
bool BusEventListenerContainer::broadcast(ARGS &&...args) {
    using BusType = BusEventBroadcaster<EHandler, ARGS...>;
    _isBroadcasting++;
    auto ret = static_cast<BusType *>(this)->doBroadcast(std::forward<ARGS>(args)...);
    _isBroadcasting--;
    if (!_isBroadcasting && hasPendingListeners()) {
        addOrRemovePendingListeners();
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
    using _bus_type = BusType;
    using _return_type = R;
    using _argument_tuple_types = std::tuple<ARGS...>;
    constexpr static int ARG_COUNT = sizeof...(ARGS);
};
/**
 * Bus Event Listener
 */
template <typename EHandler>
class Listener : public BusEventListenerBase {
public:
    using _agurment_tuple_types = typename EHandler::_argument_tuple_types;
    using _argument_wrapper = typename intl::TupleExtractor<_agurment_tuple_types>;
    // using func_type = typename _argument_wrapper::func_type;
    using _std_func_type = typename _argument_wrapper::std_func_type;

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
            CC_LOG_DEBUG("EventBus[%s] has no listener found!", BUS_NAME);
        }
    }

    const char *getBusName() const { return BUS_NAME; }
    const char *getHandlerName() const { return HANDLE_CLASS; }

private:
    bool _enabled{true};
    _std_func_type _callback;

    friend class BusEventListenerContainer;
};

template <typename EHandler>
Listener<EHandler>::Listener() {
    entry = new BusEventListenerEntry;
    entry->listener = this;
    BusEventListenerDB<EHandler>::container()->addListener(this);
}

template <typename EHandler>
Listener<EHandler>::~Listener() {
    BusEventListenerDB<EHandler>::container()->removeListener(this);
}

template <typename EHandler, typename... ARGS>
bool BusEventBroadcaster<EHandler, ARGS...>::doBroadcast(ARGS &&...args) {
    // broadcast events to all listeners
    EVENT_LIST_LOOP_BEGIN(curr, _listenerList)
    if (curr->listener) {
        static_cast<Listener<EHandler> *>(curr->listener)->invoke(std::forward<ARGS>(args)...);
    }
    EVENT_LIST_LOOP_END(curr, _listenerList)
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
        using BusType = EventBusName_(EventBusClass);                                                        \
        using Listener = cc::event::Listener<BusEventClass>;                                                 \
        constexpr static const char *BUS_NAME = BusType::BUS_NAME;                                           \
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
