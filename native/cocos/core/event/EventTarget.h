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

#include <array>
#include <cstring>
#include <memory>
#include "base/Log.h"
#include "base/Macros.h"
#include "base/memory/Memory.h"
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
struct Event final : TgtEventInfo {
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

    virtual const char *getEventName() const { return nullptr; }

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
class TargetEventListener final : public TargetEventListenerBase {
public:
    using _emitter_type = typename TgtEvent::_emitter_type;
    using EventType = typename TgtEvent::EventType;
    using _persist_function_type = typename TgtEvent::_persist_function_type;

    explicit TargetEventListener(_persist_function_type func) : _func(func) {
        _eventTypeID = TgtEvent::TYPE_ID;
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

    const char *getEventName() const override {
        return TgtEvent::EVENT_NAME;
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

template <size_t N>
struct TargetListenerContainer final {
    std::array<TargetEventListenerBase *, N> data{nullptr};

    inline TargetEventListenerBase *&operator[](size_t index) { return data[index]; }

    void clear() {
        for (size_t i = 0; i < N; i++) {
            auto &handlers = data[i];
            EVENT_LIST_LOOP_REV_BEGIN(handle, handlers)
            delete handle;
            EVENT_LIST_LOOP_REV_END(handle, handlers)
            data[i] = nullptr;
        }
    }

    ~TargetListenerContainer() {
        clear();
    }
};

template <typename Self, size_t EventCount, bool hasParent>
class EventTargetImpl final {
public:
    constexpr static bool HAS_PARENT = hasParent;

protected:
    template <typename TgtEvent, typename Fn>
    TargetEventID<TgtEvent> addEventListener(Fn &&func, bool useCapture, bool once) {
        /* CC_ASSERT(!_emittingEvent); */
        using func_type = std::conditional_t<intl::FunctionTrait<Fn>::IS_LAMBDA,
                                             typename intl::lambda_without_class_t<Fn>, Fn>;
        using wrap_type = intl::TgtEvtFnTrait<func_type>;
        auto stdfn = wrap_type::template wrap<TgtEvent>(intl::convertLambda(std::forward<Fn>(func)));
        auto *newHandler = new TargetEventListener<TgtEvent>(stdfn);
        auto newId = ++_handlerId;
        newHandler->id = newId;
        if (once) {
            newHandler->setOnce();
        }
        if constexpr (wrap_type::IS_MEMBER_FUNC) {
            newHandler->setMemberFuncAddr(std::forward<Fn>(func), nullptr);
        }
        if (useCapture) {
            intl::listAppend<TargetEventListenerBase>(&_capturingHandlers[TgtEvent::TYPE_ID], newHandler);
        } else {
            intl::listAppend<TargetEventListenerBase>(&_bubblingHandlers[TgtEvent::TYPE_ID], newHandler);
        }
        return TargetEventID<TgtEvent>(newId);
    }

    template <typename TgtEvent, typename Fn, typename O>
    TargetEventID<TgtEvent> addEventListener(Fn &&func, O *ctx, bool useCapture, bool once) {
        /* CC_ASSERT(!_emittingEvent);*/
        using wrap_type = intl::TgtEvtFnTrait<Fn>;
        auto stdfn = wrap_type::template wrapWithContext<TgtEvent>(std::forward<Fn>(func), ctx);
        auto *newHandler = new TargetEventListener<TgtEvent>(stdfn);
        auto newId = ++_handlerId;
        newHandler->id = newId;
        if (once) {
            newHandler->setOnce();
        }
        if constexpr (wrap_type::IS_MEMBER_FUNC) {
            newHandler->setMemberFuncAddr(std::forward<Fn>(func), ctx);
        }
        if (useCapture) {
            intl::listAppend<TargetEventListenerBase>(&_capturingHandlers[TgtEvent::TYPE_ID], newHandler);
        } else {
            intl::listAppend<TargetEventListenerBase>(&_bubblingHandlers[TgtEvent::TYPE_ID], newHandler);
        }
        return TargetEventID<TgtEvent>(newId);
    }

public:
    template <typename TgtEvent, typename Fn>
    TargetEventID<TgtEvent> once(Fn &&func, bool useCapture) {
        return this->template addEventListener(std::forward<Fn>(func), useCapture, true);
    }

    template <typename TgtEvent, typename Fn, typename O>
    TargetEventID<TgtEvent> once(Fn &&func, O *ctx) {
        return this->template addEventListener(std::forward<Fn>(func), ctx, true);
    }

    template <typename TgtEvent, typename Fn>
    TargetEventID<TgtEvent> on(Fn &&func, bool useCapture = false) {
        static_assert(std::is_base_of<typename TgtEvent::_emitter_type, Self>::value, "mismatch target type");
        return this->template addEventListener<TgtEvent, Fn>(std::forward<Fn>(func), useCapture, false);
    }

    template <typename TgtEvent, typename Fn, typename O>
    TargetEventID<TgtEvent> on(Fn &&func, O *ctx, bool useCapture = false) {
        return this->template addEventListener<TgtEvent, Fn, O>(std::forward<Fn>(func), ctx, useCapture, false);
    }

    template <typename TgtEvent>
    bool off(TargetEventID<TgtEvent> eventId) {
        CC_ASSERT(!_emittingEvent[TgtEvent::TYPE_ID]);

        TargetEventListenerBase *&bubblingHandlers = _bubblingHandlers[TgtEvent::TYPE_ID];

        EVENT_LIST_LOOP_REV_BEGIN(handle, bubblingHandlers)
        if (handle && handle->id == eventId.value()) {
            CC_ASSERT(handle->getEventTypeID() == TgtEvent::TYPE_ID);
            intl::detachFromList(&bubblingHandlers, handle);
            delete handle;
            return true;
        }
        EVENT_LIST_LOOP_REV_END(handle, bubblingHandlers)
        TargetEventListenerBase *&capturingHandlers = _capturingHandlers[TgtEvent::TYPE_ID];
        EVENT_LIST_LOOP_REV_BEGIN(handle, capturingHandlers)
        if (handle && handle->id == eventId.value()) {
            CC_ASSERT(handle->getEventTypeID() == TgtEvent::TYPE_ID);
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
            CC_ASSERT(!itr);
        }
#endif
        _bubblingHandlers.clear();
        _capturingHandlers.clear();
    }

    template <typename TgtEvent>
    void off() {
        static_assert(std::is_base_of_v<TgtEventTraitClass, TgtEvent>, "incorrect template argument");
        CC_ASSERT(!_emittingEvent[TgtEvent::TYPE_ID]);
        TargetEventListenerBase *&bubblingHandlers = _bubblingHandlers[TgtEvent::TYPE_ID];

        EVENT_LIST_LOOP_REV_BEGIN(handle, bubblingHandlers)
        if (handle) {
            intl::detachFromList(&bubblingHandlers, handle);
            delete handle;
        }
        EVENT_LIST_LOOP_REV_END(handle, bubblingHandlers)

        TargetEventListenerBase *&capturingHandlers = _capturingHandlers[TgtEvent::TYPE_ID];
        EVENT_LIST_LOOP_REV_BEGIN(handle, capturingHandlers)
        if (handle) {
            intl::detachFromList(&capturingHandlers, handle);
            delete handle;
        }
        EVENT_LIST_LOOP_REV_END(handle, capturingHandlers)
    }

    template <typename TgtEvent, typename... ARGS>
    void emit(Self *self, ARGS &&...args) { /* TODO() : statistics */
        using _handler_function_type = TargetEventListener<TgtEvent>;
        using EventType = typename TgtEvent::EventType;
        static_assert(sizeof...(ARGS) == TgtEvent::ARG_COUNT, "Parameter count incorrect for function EventTarget::emit");
        if (_bubblingHandlers[TgtEvent::TYPE_ID] == nullptr) return;
        intl::validateParameters<0, TgtEvent, ARGS...>(std::forward<ARGS>(args)...);
        EventType eventObj(std::make_tuple<ARGS...>(std::forward<ARGS>(args)...));
        eventObj.target = self;
        eventObj.currentTarget = self;

        emitEvtObj<false, TgtEvent>(self, &eventObj);
    }

    template <bool useCapture, typename TgtEvent, typename EvtObj>
    void emitEvtObj(Self *self, EvtObj *eventObj) {
        using EventType = typename TgtEvent::EventType;
        using _handler_function_type = TargetEventListener<TgtEvent>;
        static_assert(std::is_same_v<EventType, EvtObj>, "Event type mismatch");
        _emittingEvent[TgtEvent::TYPE_ID]++;
        if constexpr (useCapture) {
            TargetEventListenerBase *&handlers = _capturingHandlers[TgtEvent::TYPE_ID];
            EVENT_LIST_LOOP_BEGIN(handle, handlers)
            if (handle->isEnabled()) {
#if CC_DEBUG
                bool sameAddr = handle->getEventName() == TgtEvent::EVENT_NAME;
                if (!sameAddr && strcmp(handle->getEventName(), TgtEvent::EVENT_NAME)) {
                    // different event should not shared a same typeid.
                    CC_LOG_ERROR("Event '%s' and '%s' shared the same TypeID(), for event declaration of subclasses, please use DECLARE_TARGET_EVENT_BEGIN_OFFSET()", TgtEvent::EVENT_NAME, handle->getEventName());
                    CC_ABORT();
                }
#endif
                static_cast<_handler_function_type *>(handle)->apply(self, eventObj);
            }
            EVENT_LIST_LOOP_END(handle, handlers);
        } else {
            TargetEventListenerBase *&handlers = _bubblingHandlers[TgtEvent::TYPE_ID];
            EVENT_LIST_LOOP_BEGIN(handle, handlers)
            if (handle->isEnabled()) {
#if CC_DEBUG
                bool sameAddr = handle->getEventName() == TgtEvent::EVENT_NAME;
                if (!sameAddr && strcmp(handle->getEventName(), TgtEvent::EVENT_NAME)) {
                    // different event should not shared a same typeid.
                    CC_LOG_ERROR("Event '%s' and '%s' shared the same TypeID(), for event declaration of subclasses, please use DECLARE_TARGET_EVENT_BEGIN_OFFSET()", TgtEvent::EVENT_NAME, handle->getEventName());
                    CC_ABORT();
                }
#endif
                static_cast<_handler_function_type *>(handle)->apply(self, eventObj);
            }
            EVENT_LIST_LOOP_END(handle, handlers);
        }
        _emittingEvent[TgtEvent::TYPE_ID]--;
    }

    template <typename TgtEvent, typename EvtType>
    std::enable_if_t<std::is_same_v<typename TgtEvent::EventType, std::decay_t<EvtType>>, void>
    dispatchEvent(Self *self, EvtType &eventObj) {
        if constexpr (HAS_PARENT) {
            std::vector<Self *> parents;
            Self *curr = self->evGetParent();
            while (curr) {
                if (curr->getEventTarget().template hasEventHandler<TgtEvent>()) {
                    parents.emplace_back(curr);
                }
                curr = curr->evGetParent();
            }
            for (auto itr = parents.rbegin(); itr != parents.rend(); itr++) {
                eventObj.currentTarget = *itr;
                (*itr)->getEventTarget().template emitEvtObj<true, TgtEvent>(*itr, &eventObj);
                if (eventObj.propagationStopped) {
                    return;
                }
            }
        }

        eventObj.eventPhase = EventPhaseType::AT_TARGET;
        eventObj.currentTarget = self;

        emitEvtObj<true, TgtEvent>(self, &eventObj);
        if (!eventObj.propagationStopped) {
            emitEvtObj<false, TgtEvent>(self, &eventObj);
        }

        if constexpr (HAS_PARENT) {
            if (!eventObj.propagationStopped && eventObj.bubbles) {
                auto *curr = self->evGetParent();
                std::vector<Self *> parents;

                while (curr) {
                    if (curr->getEventTarget().template hasEventHandler<TgtEvent>()) {
                        parents.emplace_back(curr);
                    }
                    curr = curr->evGetParent();
                }
                for (auto itr = parents.begin(); itr != parents.end(); itr++) {
                    eventObj.currentTarget = *itr;
                    (*itr)->getEventTarget().template emitEvtObj<false, TgtEvent>(*itr, &eventObj);
                    if (eventObj.propagationStopped) {
                        return;
                    }
                }
            }
        }
    }

    template <typename TgtEvent, typename... ARGS>
    std::enable_if_t<sizeof...(ARGS) != 1 ||
                         (sizeof...(ARGS) == 1 &&
                          !std::is_same_v<typename TgtEvent::EventType,
                                          std::remove_pointer_t<typename intl::HeadType<ARGS...>::head>>),
                     void>
    dispatchEvent(Self *self, ARGS &&...args) {
        using _handler_function_type = TargetEventListener<TgtEvent>;
        using EventType = typename TgtEvent::EventType;
        static_assert(sizeof...(ARGS) == TgtEvent::ARG_COUNT, "Parameter count incorrect for function EventTarget::emit");
        intl::validateParameters<0, TgtEvent, ARGS...>(std::forward<ARGS>(args)...);
        EventType eventObj(std::make_tuple<ARGS...>(std::forward<ARGS>(args)...));
        eventObj.target = self;
        eventObj.currentTarget = self;
        eventObj.eventPhase = EventPhaseType::CAPTUREING_PHASE;
        dispatchEvent<TgtEvent, EventType>(self, eventObj);
    }

    template <typename TgtEvent>
    void dispatchEvent(Self *self) {
        using _handler_function_type = TargetEventListener<TgtEvent>;
        using EventType = typename TgtEvent::EventType;
        static_assert(0 == TgtEvent::ARG_COUNT, "Parameter count incorrect for function EventTarget::emit");
        EventType eventObj;
        eventObj.target = self;
        eventObj.currentTarget = self;
        eventObj.eventPhase = EventPhaseType::CAPTUREING_PHASE;
        dispatchEvent<TgtEvent, EventType>(self, eventObj);
    }

    template <typename TgtEvent>
    bool hasEventHandler() {
        TargetEventListenerBase *&bubblingHandlers = _bubblingHandlers[TgtEvent::TYPE_ID];
        EVENT_LIST_LOOP_BEGIN(handle, bubblingHandlers)
        if (handle->isEnabled()) {
            return true;
        }
        EVENT_LIST_LOOP_END(handle, bubblingHandlers);
        TargetEventListenerBase *&capturingHandlers = _capturingHandlers[TgtEvent::TYPE_ID];
        EVENT_LIST_LOOP_BEGIN(handle, capturingHandlers)
        if (handle->isEnabled()) {
            return true;
        }
        EVENT_LIST_LOOP_END(handle, capturingHandlers);
        return false;
    }

    template <typename TgtEvent, typename Fn, typename C>
    bool hasEventHandler(Fn func, C *target) {
        using wrap_type = intl::TgtEvtFnTrait<Fn>;
        using _handler_function_type = event::TargetEventListener<TgtEvent>;
        static_assert(std::is_same<typename wrap_type::target_type, C>::value, "member function type mismatch");

        TargetEventListenerBase *&bubblingHandlers = _bubblingHandlers[TgtEvent::TYPE_ID];
        EVENT_LIST_LOOP_BEGIN(handle, bubblingHandlers)
        if (handle->isEnabled() && handle->getContext() == target) {
            auto *ptr = static_cast<_handler_function_type *>(handle);
            return ptr->getMemberFuncAddr() == func;
        }
        EVENT_LIST_LOOP_END(handle, bubblingHandlers);
        TargetEventListenerBase *&capturingHandlers = _capturingHandlers[TgtEvent::TYPE_ID];
        EVENT_LIST_LOOP_BEGIN(handle, capturingHandlers)
        if (handle->isEnabled() && handle->getContext() == target) {
            auto *ptr = static_cast<_handler_function_type *>(handle);
            return ptr->getMemberFuncAddr() == func;
        }
        EVENT_LIST_LOOP_END(handle, capturingHandlers);

        return false;
    }

protected:
    TargetListenerContainer<EventCount> _bubblingHandlers;
    TargetListenerContainer<EventCount> _capturingHandlers;
    TargetEventIdType _handlerId{1};
    std::array<int, EventCount> _emittingEvent{0};
};

template <typename T>
class HeapObject final {
public:
    HeapObject() {
        _data = ccnew T;
    }

    ~HeapObject() {
        delete _data;
    }

    inline T &get() {
        return *_data;
    }

private:
    T *_data{nullptr};
};

template <typename Self, size_t EventCnt, bool HAS_PARENT>
using EventTargetGuard = HeapObject<EventTargetImpl<Self, EventCnt, HAS_PARENT>>;

} // namespace event
} // namespace cc

#define TARGET_EVENT_ARG0(EventTypeClass)                                                           \
    class EventTypeClass final : public cc::event::TgtEventTrait<Self> {                            \
    public:                                                                                         \
        using BaseType = cc::event::TgtEventTrait<Self>;                                            \
        using EventType = cc::event::Event<EventTypeClass>;                                         \
        using EventID = cc::event::TargetEventID<EventTypeClass>;                                   \
        using _persist_function_type = std::function<void(Self *, EventType *)>;                    \
        using _handler_function_type = std::function<void(EventType *)>;                            \
        constexpr static const char *EVENT_NAME = #EventTypeClass;                                  \
        constexpr static size_t TYPE_ID = __COUNTER__ - __counter_start__ - 1 + __counter_offset__; \
        constexpr static size_t TypeHash() {                                                        \
            return cc::event::intl::hash(#EventTypeClass);                                          \
        }                                                                                           \
    };

// NOLINTNEXTLINE
#define _DECLARE_TARGET_EVENT_INTER(EventTypeClass, ...)                                            \
    class EventTypeClass final : public cc::event::TgtEventTrait<Self, __VA_ARGS__> {               \
    public:                                                                                         \
        using BaseType = cc::event::TgtEventTrait<Self, __VA_ARGS__>;                               \
        using EventType = cc::event::Event<EventTypeClass>;                                         \
        using EventID = cc::event::TargetEventID<EventTypeClass>;                                   \
        using _persist_function_type = std::function<void(Self *, EventType *)>;                    \
        using _handler_function_type = std::function<void(EventType *)>;                            \
        constexpr static const char *EVENT_NAME = #EventTypeClass;                                  \
        constexpr static size_t TYPE_ID = __COUNTER__ - __counter_start__ - 1 + __counter_offset__; \
        constexpr static size_t TypeHash() {                                                        \
            return cc::event::intl::hash(#EventTypeClass);                                          \
        }                                                                                           \
    };

// NOLINTNEXTLINE
#define _IMPL_EVENT_TARGET_(Self)                                                                              \
public:                                                                                                        \
    template <typename TgtEvent, typename Fn>                                                                  \
    cc::event::TargetEventID<TgtEvent> once(Fn &&func, bool useCapture) {                                      \
        return _eventTargetImpl.get().once<TgtEvent>(std::forward<Fn>(func), useCapture);                      \
    }                                                                                                          \
                                                                                                               \
    template <typename TgtEvent, typename Fn, typename O>                                                      \
    cc::event::TargetEventID<TgtEvent> once(Fn &&func, O *ctx) {                                               \
        return _eventTargetImpl.get().once<TgtEvent>(std::forward<Fn>(func), ctx);                             \
    }                                                                                                          \
    template <typename TgtEvent, typename Fn>                                                                  \
    cc::event::TargetEventID<TgtEvent> on(Fn &&func, bool useCapture = false) {                                \
        static_assert(std::is_base_of<typename TgtEvent::_emitter_type, Self>::value, "mismatch target type"); \
        return _eventTargetImpl.get().on<TgtEvent, Fn>(std::forward<Fn>(func), useCapture);                    \
    }                                                                                                          \
    template <typename TgtEvent, typename Fn, typename O>                                                      \
    cc::event::TargetEventID<TgtEvent> on(Fn &&func, O *ctx, bool useCapture = false) {                        \
        return _eventTargetImpl.get().on<TgtEvent, Fn, O>(std::forward<Fn>(func), ctx, useCapture);            \
    }                                                                                                          \
    template <typename TgtEvent>                                                                               \
    bool off(cc::event::TargetEventID<TgtEvent> eventId) {                                                     \
        return _eventTargetImpl.get().off(eventId);                                                            \
    }                                                                                                          \
    void offAll() {                                                                                            \
        _eventTargetImpl.get().offAll();                                                                       \
    }                                                                                                          \
    template <typename TgtEvent>                                                                               \
    void off() {                                                                                               \
        _eventTargetImpl.get().off<TgtEvent>();                                                                \
    }                                                                                                          \
    template <typename TgtEvent, typename... ARGS>                                                             \
    void emit(ARGS &&...args) {                                                                                \
        _eventTargetImpl.get().emit<TgtEvent>(this, std::forward<ARGS>(args)...);                              \
    }                                                                                                          \
    template <typename TgtEvent, typename... ARGS>                                                             \
    void dispatchEvent(ARGS &&...args) {                                                                       \
        _eventTargetImpl.get().dispatchEvent<TgtEvent, ARGS...>(this, std::forward<ARGS>(args)...);            \
    }

#define IMPL_EVENT_TARGET(TargetClass)                    \
public:                                                   \
    static constexpr bool HAS_PARENT = false;             \
    inline TargetClass *evGetParent() { return nullptr; } \
    _IMPL_EVENT_TARGET_(TargetClass)

#define IMPL_EVENT_TARGET_WITH_PARENT(TargetClass, getParentMethod) \
public:                                                             \
    static constexpr bool HAS_PARENT = true;                        \
    inline auto evGetParent() {                                     \
        return getParentMethod();                                   \
    }                                                               \
    _IMPL_EVENT_TARGET_(TargetClass)

// NOLINTNEXTLINE
#define _DECLARE_TARGET_EVENT_BEGIN(TargetClass)          \
    using Self = TargetClass;                             \
                                                          \
private:                                                  \
    constexpr static int __counter_start__ = __COUNTER__; \
                                                          \
public:

#define DECLARE_TARGET_EVENT_BEGIN(TargetClass)  \
    constexpr static int __counter_offset__ = 0; \
    _DECLARE_TARGET_EVENT_BEGIN(TargetClass)

#define DECLARE_TARGET_EVENT_BEGIN_WITH_PARENTS(TargetClass, ...)                        \
    constexpr static int __counter_offset__ = cc::event::intl::TotalEvents<__VA_ARGS__>; \
    _DECLARE_TARGET_EVENT_BEGIN(TargetClass)

#define DECLARE_TARGET_EVENT_END()                                                                    \
private:                                                                                              \
    constexpr static int __counter_stop__ = __COUNTER__;                                              \
    constexpr static int __event_count__ = __counter_stop__ - __counter_start__ + __counter_offset__; \
    cc::event::EventTargetGuard<Self, __event_count__, HAS_PARENT> _eventTargetImpl;                  \
                                                                                                      \
public:                                                                                               \
    constexpr static int getEventCount() { return __event_count__; }                                  \
    auto &getEventTarget() { return _eventTargetImpl.get(); }

#include "intl/EventTargetMacros.h"
