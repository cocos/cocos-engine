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

#include <memory>
#include <unordered_map>
#include "base/Macros.h"
#include "intl/EventIntl.h"
#include "intl/List.h"

namespace cc {
namespace event {

class TgtEventTraitClass {};

enum class EventPhaseType {
    CAPTUREING_PHASE = 1,
    AT_TARGET = 2,
    BUBBLING_PHASE = 3,
    UNKNOWN = 4,
};

struct TgtEventInfo {
    EventPhaseType eventPhase{EventPhaseType::UNKNOWN};
    bool bubbles{true};
    bool cancelable{true};
    void stopPropagation() {
        propagationStopped = true;
    }
    void preventDefault() { /* TODO: */
    }
    bool propagationStopped{false};
};

template <typename TgtEvent>
struct Event : TgtEventInfo {
    using EmitterType = typename TgtEvent::_emitter_type;
    using _argument_tuple_types = typename TgtEvent::_argument_tuple_types;
    using _argument_local_types = typename TgtEvent::_argument_local_types;
    EmitterType *target{nullptr};
    EmitterType *currentTarget{nullptr};
    _argument_local_types args;

    Event() = default;

    explicit Event(const _argument_local_types &argsIn) : args(argsIn) {
    }

    template <size_t N>
    auto get() const {
        return std::get<N>(args);
    }
    template <size_t N>
    auto get() {
        return std::get<N>(args);
    }

    template <size_t N, typename A>
    void set(A &&value) {
        std::get<N>(args) = value;
    }
    void initEvent(bool canBubbleArg, bool cancelableArg) {
        // TODO()
    }

    template <typename... ARGS>
    void update(ARGS &&...values) {
        args = std::make_tuple<>(std::forward<ARGS>(values)...);
    }
};

template <typename EmitterType, typename... ARGS>
class TgtEventTrait : public TgtEventTraitClass {
public:
    using _emitter_type = EmitterType;
    using _argument_tuple_types = std::tuple<ARGS...>;
    using _argument_local_types = std::tuple<std::remove_reference_t<std::remove_cv_t<ARGS>>...>;
    constexpr static int ARG_COUNT = sizeof...(ARGS);
};

class TgtMemberFnCmp {
public:
    virtual ~TgtMemberFnCmp() = default;
    virtual void *getContext() = 0;
    virtual bool equals(TgtMemberFnCmp *) const = 0;
};

template <typename Fn>
class TgtMemberHandleFn final : public TgtMemberFnCmp {
public:
    ~TgtMemberHandleFn() override = default;
    void *getContext() override { return context; }
    bool equals(TgtMemberFnCmp *other) const override {
        auto *fake = reinterpret_cast<TgtMemberHandleFn *>(other);
        return context == fake->context && func == fake->func;
    }
    Fn func;
    void *context;
};

class TargetEventListenerBase {
public:
    enum class RunState {
        NORMAL,
        PENDING_ONCE,
        ONCE_DONE,
    };
    virtual ~TargetEventListenerBase() = default;
    virtual void *getContext() const = 0;
    virtual const char *getEventType() const { return nullptr; }

    bool isEnabled() const { return _enabled; }
    void setOnce() { _state = RunState::PENDING_ONCE; }
    inline size_t getEventTypeID() const { return _eventTypeID; }

    int32_t id{-1};

    TargetEventListenerBase *next{nullptr};
    TargetEventListenerBase *prev{nullptr};

protected:
    bool _enabled = true;
    RunState _state{RunState::NORMAL};
    size_t _eventTypeID;
};

template <typename TgtEvent>
class TargetEventListener : public TargetEventListenerBase {
public:
    using _emitter_type = typename TgtEvent::_emitter_type;
    using EventType = typename TgtEvent::EventType;
    using _persist_function_type = typename TgtEvent::_persist_function_type;
    explicit TargetEventListener(_persist_function_type func) : _func(func) {
        _eventTypeID = TgtEvent::TypeID();
    }

    ~TargetEventListener() override {
        delete _fnCmptor;
    }

    template <typename Fn>
    void setMemberFuncAddr(Fn func, void *context) {
        auto fctx = new TgtMemberHandleFn<Fn>;
        fctx->func = func;
        fctx->context = context;
        _fnCmptor = fctx;
    }

    void *getContext() const override {
        if (_fnCmptor) return _fnCmptor->getContext();
        return nullptr;
    }

    void apply(_emitter_type *self, EventType *evobj) {
        switch (_state) {
            case RunState::ONCE_DONE:
                return;
            case RunState::PENDING_ONCE:
                _state = RunState::ONCE_DONE;
                break;
            default:
                break;
        }
        _func(self, evobj);
    }

protected:
    _persist_function_type _func;
    TgtMemberFnCmp *_fnCmptor{nullptr};
};

using TargetEventIdType = int32_t;

template <typename TgtEvent>
class TargetEventID final {
public:
    using HandleType = TgtEvent;
    using IdType = TargetEventIdType;
    TargetEventID() = default;
    TargetEventID(IdType eventId) : _eventId(eventId) {} // NOLINT

    TargetEventID(const TargetEventID &) = default;
    TargetEventID(TargetEventID &&) noexcept = default;

    TargetEventID &operator=(const TargetEventID &) = default;
    TargetEventID &operator=(TargetEventID &&) noexcept = default;

    IdType value() { return _eventId; }

private:
    IdType _eventId{};
};

class EventTarget {
public:
    static constexpr bool HAS_PARENT = false;

    template <typename TgtEvent, typename Fn>
    TargetEventID<TgtEvent> addEventListener(Fn &&func, bool useCapture, bool once) {
        // CC_ASSERT(!_emittingEvent);
        using func_type = std::conditional_t<intl::FunctionTrait<Fn>::IS_LAMBDA,
                                             typename intl::lambda_without_class_t<Fn>, Fn>;
        using wrap_type = intl::TgtEvtFnTrait<func_type>;
        auto stdfn = wrap_type::template wrap<TgtEvent>(intl::convertLambda(std::forward<Fn>(func)));
        auto *newHandler = new event::TargetEventListener<TgtEvent>(stdfn);
        auto newId = ++_handlerId;
        newHandler->id = newId;
        if (once) {
            newHandler->setOnce();
        }
        if constexpr (wrap_type::IS_MEMBER_FUNC) {
            newHandler->setMemberFuncAddr(std::forward<Fn>(func), nullptr);
        }
        if (useCapture) {
            intl::listAppend<TargetEventListenerBase>(&_capturingHandlersMap[TgtEvent::TypeID()], newHandler);
        } else {
            intl::listAppend<TargetEventListenerBase>(&_bubblingHandlersMap[TgtEvent::TypeID()], newHandler);
        }
        return TargetEventID<TgtEvent>(newId);
    }

    template <typename TgtEvent, typename Fn>
    TargetEventID<TgtEvent> once(Fn &&func, bool useCapture) {
        return this->template addEventListener(std::forward<Fn>(func), useCapture, true);
    }

    template <typename TgtEvent, typename Fn, typename O>
    TargetEventID<TgtEvent> addEventListener(Fn &&func, O *ctx, bool useCapture, bool once) {
        // CC_ASSERT(!_emittingEvent);
        using wrap_type = event::intl::TgtEvtFnTrait<Fn>;
        auto stdfn = wrap_type::template wrapWithContext<TgtEvent>(std::forward<Fn>(func), ctx);
        auto *newHandler = new event::TargetEventListener<TgtEvent>(stdfn);
        auto newId = ++_handlerId;
        newHandler->id = newId;
        if (once) {
            newHandler->setOnce();
        }
        if constexpr (wrap_type::IS_MEMBER_FUNC) {
            newHandler->setMemberFuncAddr(std::forward<Fn>(func), ctx);
        }
        if (useCapture) {
            intl::listAppend<TargetEventListenerBase>(&_capturingHandlersMap[TgtEvent::TypeID()], newHandler);
        } else {
            intl::listAppend<TargetEventListenerBase>(&_bubblingHandlersMap[TgtEvent::TypeID()], newHandler);
        }
        return TargetEventID<TgtEvent>(newId);
    }

    template <typename TgtEvent, typename Fn, typename O>
    TargetEventID<TgtEvent> once(Fn &&func, O *ctx) {
        return this->template addEventListener(std::forward<Fn>(func), ctx, true);
    }

    template <typename TgtEvent>
    bool off(TargetEventID<TgtEvent> eventId) {
        CC_ASSERT(!_emittingEvent[TgtEvent::TypeID()]);

        TargetEventListenerBase *&bubblingHandlers = _bubblingHandlersMap[TgtEvent::TypeID()];

        EVENT_LIST_LOOP_REV_BEGIN(handle, bubblingHandlers)
        if (handle && handle->id == eventId.value()) {
            CC_ASSERT(handle->getEventTypeID() == TgtEvent::TypeID());
            intl::detachFromList(&bubblingHandlers, handle);
            delete handle;
            return true;
        }
        EVENT_LIST_LOOP_REV_END(handle, bubblingHandlers)
        TargetEventListenerBase *&capturingHandlers = _capturingHandlersMap[TgtEvent::TypeID()];
        EVENT_LIST_LOOP_REV_BEGIN(handle, capturingHandlers)
        if (handle && handle->id == eventId.value()) {
            CC_ASSERT(handle->getEventTypeID() == TgtEvent::TypeID());
            intl::detachFromList(&capturingHandlers, handle);
            delete handle;
            return true;
        }
        EVENT_LIST_LOOP_REV_END(handle, capturingHandlers)
        return false;
    }

    void offAll() {
#if CC_DEBUG
        for (auto &itr : _emittingEvent) {
            CC_ASSERT(!itr.second);
        }
#endif
        for (auto &itr : _bubblingHandlersMap) {
            TargetEventListenerBase *&handlers = itr.second;
            EVENT_LIST_LOOP_REV_BEGIN(handle, handlers)
            delete handle;
            EVENT_LIST_LOOP_REV_END(handle, handlers)
        }

        for (auto &itr : _capturingHandlersMap) {
            TargetEventListenerBase *&handlers = itr.second;
            EVENT_LIST_LOOP_REV_BEGIN(handle, handlers)
            delete handle;
            EVENT_LIST_LOOP_REV_END(handle, handlers)
        }

        _bubblingHandlersMap.clear();
        _capturingHandlersMap.clear();
    }

    template <typename TgtEvent>
    void off() {
        static_assert(std::is_base_of_v<TgtEventTraitClass, TgtEvent>, "incorrect template argument");
        CC_ASSERT(!_emittingEvent[TgtEvent::TypeID()]);
        TargetEventListenerBase *&bubblingHandlers = _bubblingHandlersMap[TgtEvent::TypeID()];

        EVENT_LIST_LOOP_REV_BEGIN(handle, bubblingHandlers)
        if (handle) {
            intl::detachFromList(&bubblingHandlers, handle);
            delete handle;
        }
        EVENT_LIST_LOOP_REV_END(handle, bubblingHandlers)

        TargetEventListenerBase *&capturingHandlers = _capturingHandlersMap[TgtEvent::TypeID()];
        EVENT_LIST_LOOP_REV_BEGIN(handle, capturingHandlers)
        if (handle) {
            intl::detachFromList(&capturingHandlers, handle);
            delete handle;
        }
        EVENT_LIST_LOOP_REV_END(handle, capturingHandlers)
    }

    template <typename TgtEvent, typename Self, typename... ARGS>
    void emit(ARGS &&...args) {
        // TODO(): statistics
        using _handler_function_type = event::TargetEventListener<TgtEvent>;
        using EventType = typename TgtEvent::EventType;
        static_assert(sizeof...(ARGS) == TgtEvent::ARG_COUNT, "Parameter count incorrect for function EventTarget::emit");
        event::intl::validateParameters<0, TgtEvent, ARGS...>(std::forward<ARGS>(args)...);
        EventType eventObj(std::make_tuple<ARGS...>(std::forward<ARGS>(args)...));
        eventObj.target = static_cast<Self *>(this);
        eventObj.currentTarget = static_cast<Self *>(this);

        emitEvtObj<false, Self, TgtEvent>(&eventObj);
    }
    template <bool useCapture, typename Self, typename TgtEvent, typename EvtObj>
    void emitEvtObj(EvtObj *eventObj) {
        using EventType = typename TgtEvent::EventType;
        using _handler_function_type = event::TargetEventListener<TgtEvent>;
        static_assert(std::is_same_v<EventType, EvtObj>, "Event type mismatch");
        _emittingEvent[TgtEvent::TypeID()]++;
        if constexpr (useCapture) {
            TargetEventListenerBase *&handlers = _capturingHandlersMap[TgtEvent::TypeID()];
            EVENT_LIST_LOOP_BEGIN(handle, handlers)
            if (handle && handle->isEnabled()) {
                static_cast<_handler_function_type *>(handle)->apply(static_cast<Self *>(this), eventObj);
            }
            EVENT_LIST_LOOP_END(handle, handlers);
        } else {
            TargetEventListenerBase *&handlers = _bubblingHandlersMap[TgtEvent::TypeID()];
            EVENT_LIST_LOOP_BEGIN(handle, handlers)
            if (handle && handle->isEnabled()) {
                static_cast<_handler_function_type *>(handle)->apply(static_cast<Self *>(this), eventObj);
            }
            EVENT_LIST_LOOP_END(handle, handlers);
        }
        _emittingEvent[TgtEvent::TypeID()]--;
    }
    template <typename TgtEvent, typename Self, typename EvtType>
    std::enable_if_t<std::is_same_v<typename TgtEvent::EventType, std::decay_t<EvtType>>, void>
    dispatchEvent(EvtType &eventObj) {
        if constexpr (Self::HAS_PARENT) {
            std::vector<Self *> parents;
            Self *curr = static_cast<Self *>(this)->Self::evGetParent();
            while (curr) {
                if (curr->template hasEventHandler<TgtEvent>()) {
                    parents.emplace_back(curr);
                }
                curr = curr->evGetParent();
            }
            for (auto itr = parents.rbegin(); itr != parents.rend(); itr++) {
                eventObj.currentTarget = *itr;
                (*itr)->template emitEvtObj<true, Self, TgtEvent>(&eventObj);
                if (eventObj.propagationStopped) {
                    return;
                }
            }
        }

        eventObj.eventPhase = EventPhaseType::AT_TARGET;
        eventObj.currentTarget = static_cast<Self *>(this);

        emitEvtObj<true, Self, TgtEvent>(&eventObj);
        if (!eventObj.propagationStopped) {
            emitEvtObj<false, Self, TgtEvent>(&eventObj);
        }

        if constexpr (Self::HAS_PARENT) {
            if (!eventObj.propagationStopped && eventObj.bubbles) {
                auto *curr = static_cast<Self *>(this)->Self::evGetParent();
                std::vector<Self *> parents;

                while (curr) {
                    if (curr->template hasEventHandler<TgtEvent>()) {
                        parents.emplace_back(curr);
                    }
                    curr = curr->evGetParent();
                }
                for (auto itr = parents.begin(); itr != parents.end(); itr++) {
                    eventObj.currentTarget = *itr;
                    (*itr)->template emitEvtObj<false, Self, TgtEvent>(&eventObj);
                    if (eventObj.propagationStopped) {
                        return;
                    }
                }
            }
        }
    }

    template <typename TgtEvent, typename Self, typename... ARGS>
    std::enable_if_t<sizeof...(ARGS) != 1 || (sizeof...(ARGS) == 1 && !std::is_same_v<typename TgtEvent::EventType, std::remove_pointer_t<typename intl::HeadType<ARGS...>::head>>), void>
    dispatchEvent(ARGS &&...args) {
        using _handler_function_type = event::TargetEventListener<TgtEvent>;
        using EventType = typename TgtEvent::EventType;
        static_assert(sizeof...(ARGS) == TgtEvent::ARG_COUNT, "Parameter count incorrect for function EventTarget::emit");
        event::intl::validateParameters<0, TgtEvent, ARGS...>(std::forward<ARGS>(args)...);
        EventType eventObj(std::make_tuple<ARGS...>(std::forward<ARGS>(args)...));
        eventObj.target = static_cast<Self *>(this);
        eventObj.currentTarget = static_cast<Self *>(this);
        eventObj.eventPhase = EventPhaseType::CAPTUREING_PHASE;
        dispatchEvent<TgtEvent, Self, EventType>(eventObj);
    }

    template <typename TgtEvent, typename Self>
    void dispatchEvent() {
        using _handler_function_type = event::TargetEventListener<TgtEvent>;
        using EventType = typename TgtEvent::EventType;
        static_assert(0 == TgtEvent::ARG_COUNT, "Parameter count incorrect for function EventTarget::emit");
        EventType eventObj;
        eventObj.target = static_cast<Self *>(this);
        eventObj.currentTarget = static_cast<Self *>(this);
        eventObj.eventPhase = EventPhaseType::CAPTUREING_PHASE;
        dispatchEvent<TgtEvent, Self, EventType>(eventObj);
    }

    template <typename TgtEvent>
    bool hasEventHandler() {
        TargetEventListenerBase *&bubblingHandlers = _bubblingHandlersMap[TgtEvent::TypeID()];
        EVENT_LIST_LOOP_BEGIN(handle, bubblingHandlers)
        if (handle && handle->isEnabled()) {
            return true;
        }
        EVENT_LIST_LOOP_END(handle, bubblingHandlers);
        TargetEventListenerBase *&capturingHandlers = _capturingHandlersMap[TgtEvent::TypeID()];
        EVENT_LIST_LOOP_BEGIN(handle, capturingHandlers)
        if (handle && handle->isEnabled()) {
            return true;
        }
        EVENT_LIST_LOOP_END(handle, capturingHandlers);
        return false;
    }

    template <typename TgtEvent, typename Fn, typename C>
    bool hasEventHandler(Fn func, C *target) {
        using wrap_type = event::intl::TgtEvtFnTrait<Fn>;
        using _handler_function_type = event::TargetEventListener<TgtEvent>;
        static_assert(std::is_same<typename wrap_type::target_type, C>::value, "member function type mismatch");

        TargetEventListenerBase *&bubblingHandlers = _bubblingHandlersMap[TgtEvent::TypeID()];
        EVENT_LIST_LOOP_BEGIN(handle, bubblingHandlers)
        if (handle && handle->isEnabled() && handle->getContext() == target) {
            auto *ptr = static_cast<_handler_function_type *>(handle);
            return ptr->getMemberFuncAddr() == func;
        }
        EVENT_LIST_LOOP_END(handle, bubblingHandlers);
        TargetEventListenerBase *&capturingHandlers = _capturingHandlersMap[TgtEvent::TypeID()];
        EVENT_LIST_LOOP_BEGIN(handle, capturingHandlers)
        if (handle && handle->isEnabled() && handle->getContext() == target) {
            auto *ptr = static_cast<_handler_function_type *>(handle);
            return ptr->getMemberFuncAddr() == func;
        }
        EVENT_LIST_LOOP_END(handle, capturingHandlers);

        return false;
    }
    virtual ~EventTarget() { offAll(); }

protected:
    std::unordered_map<size_t, TargetEventListenerBase *> _bubblingHandlersMap;
    std::unordered_map<size_t, TargetEventListenerBase *> _capturingHandlersMap;

    TargetEventIdType _handlerId{1};
    std::unordered_map<size_t, int> _emittingEvent;
};

} // namespace event
} // namespace cc

#define TARGET_EVENT_ARG0(EventTypeClass)                                                 \
    class EventTypeClass final : public cc::event::TgtEventTrait<_emitter_type> {         \
    public:                                                                               \
        using BaseType = cc::event::TgtEventTrait<_emitter_type>;                         \
        using EventType = cc::event::Event<EventTypeClass>;                               \
        using EventID = cc::event::TargetEventID<EventTypeClass>;                         \
        using _persist_function_type = std::function<void(_emitter_type *, EventType *)>; \
        using _handler_function_type = std::function<void(EventType *)>;                  \
        constexpr static const char *EVENT_NAME = #EventTypeClass;                        \
        constexpr static size_t TypeID() {                                                \
            return cc::event::intl::hash(#EventTypeClass);                                \
        }                                                                                 \
    };

// NOLINTNEXTLINE
#define _DECLARE_TARGET_EVENT_INTER(EventTypeClass, ...)                                       \
    class EventTypeClass final : public cc::event::TgtEventTrait<_emitter_type, __VA_ARGS__> { \
    public:                                                                                    \
        using BaseType = cc::event::TgtEventTrait<_emitter_type, __VA_ARGS__>;                 \
        using EventType = cc::event::Event<EventTypeClass>;                                    \
        using EventID = cc::event::TargetEventID<EventTypeClass>;                              \
        using _persist_function_type = std::function<void(_emitter_type *, EventType *)>;      \
        using _handler_function_type = std::function<void(EventType *)>;                       \
        constexpr static const char *EVENT_NAME = #EventTypeClass;                             \
        constexpr static size_t TypeID() {                                                     \
            return cc::event::intl::hash(#EventTypeClass);                                     \
        }                                                                                      \
    };

// NOLINTNEXTLINE
#define _IMPL_EVENT_TARGET_(TargetClass)                                                                                \
    template <typename TgtEvent, typename Fn>                                                                           \
    cc::event::TargetEventID<TgtEvent> on(Fn &&func, bool useCapture = false) {                                         \
        static_assert(std::is_base_of<typename TgtEvent::_emitter_type, TargetClass>::value, "mismatch target type");   \
        return EventTarget::template addEventListener<TgtEvent, Fn>(std::forward<Fn>(func), useCapture, false);         \
    }                                                                                                                   \
    template <typename TgtEvent, typename Fn, typename O>                                                               \
    cc::event::TargetEventID<TgtEvent> on(Fn &&func, O *ctx, bool useCapture = false) {                                 \
        return EventTarget::template addEventListener<TgtEvent, Fn, O>(std::forward<Fn>(func), ctx, useCapture, false); \
    }                                                                                                                   \
    template <typename TgtEvent, typename Fn>                                                                           \
    cc::event::TargetEventID<TgtEvent> once(Fn &&func, bool useCapture = false) {                                       \
        static_assert(std::is_base_of<typename TgtEvent::_emitter_type, TargetClass>::value, "mismatch target type");   \
        return EventTarget::template addEventListener<TgtEvent, Fn>(std::forward<Fn>(func), useCapture, true);          \
    }                                                                                                                   \
    template <typename TgtEvent, typename Fn, typename O>                                                               \
    cc::event::TargetEventID<TgtEvent> once(Fn func, O *ctx, bool useCapture = false) {                                 \
        return EventTarget::template addEventListener<TgtEvent, Fn, O>(std::forward<Fn>(func), ctx, useCapture, true);  \
    }                                                                                                                   \
    template <typename TgtEvent>                                                                                        \
    void off() {                                                                                                        \
        static_assert(std::is_base_of<typename TgtEvent::_emitter_type, TargetClass>::value, "mismatch target type");   \
        EventTarget::template off<TgtEvent>();                                                                          \
    }                                                                                                                   \
                                                                                                                        \
    template <typename TgtEvent>                                                                                        \
    bool off(cc::event::TargetEventID<TgtEvent> eventID) {                                                              \
        return EventTarget::off(eventID);                                                                               \
    }                                                                                                                   \
                                                                                                                        \
    template <typename TgtEvent, typename... ARGS>                                                                      \
    void emit(ARGS &&...args) {                                                                                         \
        static_assert(std::is_base_of<typename TgtEvent::_emitter_type, TargetClass>::value, "mismatch target type");   \
        EventTarget::template emit<TgtEvent, TargetClass, ARGS...>(std::forward<ARGS>(args)...);                        \
    }                                                                                                                   \
    template <typename TgtEvent, typename... ARGS>                                                                      \
    void dispatchEvent(ARGS &&...args) {                                                                                \
        EventTarget::template dispatchEvent<TgtEvent, TargetClass, ARGS...>(std::forward<ARGS>(args)...);               \
    }

#define IMPL_EVENT_TARGET(TargetClass)        \
public:                                       \
    static constexpr bool HAS_PARENT = false; \
    _IMPL_EVENT_TARGET_(TargetClass)

#define IMPL_EVENT_TARGET_WITH_PARENT(TargetClass, getParentMethod) \
public:                                                             \
    static constexpr bool HAS_PARENT = true;                        \
    TargetClass *evGetParent() {                                    \
        if constexpr (HAS_PARENT) {                                 \
            return getParentMethod();                               \
        } else {                                                    \
            return nullptr;                                         \
        }                                                           \
    }                                                               \
    _IMPL_EVENT_TARGET_(TargetClass)

#define DECLARE_TARGET_EVENT_BEGIN(TargetClass) \
    using _emitter_type = TargetClass;

#define DECLARE_TARGET_EVENT_END()

#include "intl/EventTargetMacros.h"
