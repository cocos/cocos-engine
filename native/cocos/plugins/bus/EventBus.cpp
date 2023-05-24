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
#include "plugins/bus/EventBus.h"
#include <cstring>
#include <unordered_map>
#include "base/Macros.h"

namespace cc {
namespace plugin {

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

void EventBus::addListener(Listener *listener) {
    CC_ASSERT(std::find(_listeners.begin(), _listeners.end(), listener) == _listeners.end());
    _listeners.emplace_back(listener);
}

void EventBus::removeListener(Listener *listener) {
    auto tgt = std::find(_listeners.begin(), _listeners.end(), listener);
    if (tgt != _listeners.end()) {
        _listeners.erase(tgt);
    }
}

void EventBus::dispatch(EventBase *event) {
    for (auto *listener : _listeners) {
        for (auto &handle : listener->_handles) {
            if (strcmp(handle->signature(), event->signature()) == 0) {
                handle->invoke(event);
            }
        }
    }
}

} // namespace plugin
} // namespace cc
