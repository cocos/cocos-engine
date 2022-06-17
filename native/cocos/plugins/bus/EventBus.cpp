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
#include "plugins/bus/EventBus.h"
#include <cassert>
#include <cstring>
#include <unordered_map>


namespace cc {
namespace plugin {
using ListenerEntry = ListEntry<Listener>;

Listener::Listener(BusType type) : Listener(EventBus::acquire(type)) {}

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

EventBus *EventBus::acquire(BusType type) {
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

} // namespace plugin
} // namespace cc
