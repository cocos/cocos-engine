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
#include "EventBus.h"
#include <algorithm>
#include "intl/List.h"

namespace cc {
namespace event {

bool BusEventListenerContainer::addListener(BusEventListenerBase *listener) {
    CC_ASSERT(!listener->entry);
    listener->entry = new BusEventListenerEntry;
    listener->entry->listener = listener;
    if (_isBroadcasting) {
        intl::listAppend(&_pendingNew, listener->entry);
        return true;
    }
    return intl::listAppend(&_arr, listener->entry);
}

bool BusEventListenerContainer::removeListener(BusEventListenerBase *listener) {
    if (_isBroadcasting) {
        _pendingDel.emplace_back(listener->entry);
        listener->entry->listener = nullptr;
        return true;
    }
    bool ret = intl::detachFromList(&_arr, listener->entry);
    delete listener->entry;
    return ret;
}

void BusEventListenerContainer::fixPendings() {
    for (auto &entry : _pendingDel) {
        intl::detachFromList(&_arr, entry);
        delete entry;
    }
    EVENT_LIST_LOOP_REV_BEGIN(curr, _pendingNew)
    intl::detachFromList(&_pendingNew, curr);
    intl::listAppend(&_arr, curr);
    EVENT_LIST_LOOP_REV_END(curr, _pendingNew)
    _pendingNew = nullptr;
    _pendingDel.clear();
}
} // namespace event
} // namespace cc
