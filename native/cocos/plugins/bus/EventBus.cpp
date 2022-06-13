#include "plugins/bus/EventBus.h"
#include <cassert>
#include <unordered_map>

namespace cc {
namespace plugin {
using ListenerEntry = ListEntry<Listener>;

Listener::Listener(BusType type) : Listener(EventBus::accquire(type)) {}

Listener::Listener(BusType type, const char *name) : Listener(type) {
#if CC_DEBUG
    this->_name = name;
#endif
}

Listener::Listener(EventBus *bus) : _bus(bus) {
    bus->addListener(this);
}

Listener::~Listener() {
    _bus->removeListener(this);
}

EventBus *EventBus::accquire(BusType type) {
    static std::unordered_map<BusType, EventBus> cache;
    return &cache[type];
}

EventBus::EventBus() {
    _list.first = _list.last = &_entry;
}

void EventBus::addListener(Listener *listener) {
    assert(listener->nextEntry == nullptr && listener->prevEntry == nullptr);
    listener->prevEntry = _list.last;
    listener->nextEntry = &_entry;
    _list.first = _list.first == _list.last ? listener : _list.first;
    _list.last = listener;
}

void EventBus::removeListener(Listener *listener) {
    if (listener->nextEntry == nullptr || listener->prevEntry == nullptr) {
        return;
    }
    _list.first = listener->prevEntry;
    _list.last = listener->nextEntry;
    listener->nextEntry = listener->prevEntry = nullptr;
}

void EventBus::dispatch(EventBase *event) {
    static_assert(offsetof(Listener, prevEntry) == 0, "Listener should inherit ListEntry");
    static_assert(offsetof(EventBus, _list) == 0, "EventBus should contains ListEntry");
    static_assert(sizeof(_list) == sizeof(_entry), "ListEntry size should match");
    auto *curr = _list.first;
    while (curr != &_entry) {
        auto *listener = reinterpret_cast<Listener *>(curr);
        for (auto &handle : listener->_handles) {
            if (strcmp(handle->signature(), event->signature()) == 0) {
                handle->invoke(event);
            }
        }
        curr = curr->nextEntry;
    }
}

} // namespace bus
} // namespace cc
