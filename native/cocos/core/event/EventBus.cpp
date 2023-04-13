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
#include "EventBus.h"
#include <algorithm>
#include "intl/List.h"

namespace cc {
namespace event {

void BusEventListenerContainer::addListener(BusEventListenerBase *listener) {
    if (_isBroadcasting) {
        intl::listAppend(&_listenersToAdd, listener->entry);
        return;
    }
    intl::listAppend(&_listenerList, listener->entry);
}

void BusEventListenerContainer::removeListener(BusEventListenerBase *listener) {
    if (_isBroadcasting) {
        _listenersToRemove.emplace_back(listener->entry);
        listener->entry->listener = nullptr;
        return;
    }
    intl::detachFromList(&_listenerList, listener->entry);
    delete listener->entry;
}

void BusEventListenerContainer::addOrRemovePendingListeners() {
    for (auto &entry : _listenersToRemove) {
        intl::detachFromList(&_listenerList, entry);
        delete entry;
    }
    EVENT_LIST_LOOP_REV_BEGIN(curr, _listenersToAdd)
    intl::detachFromList(&_listenersToAdd, curr);
    intl::listAppend(&_listenerList, curr);
    EVENT_LIST_LOOP_REV_END(curr, _listenersToAdd)
    _listenersToAdd = nullptr;
    _listenersToRemove.clear();
}
} // namespace event
} // namespace cc
