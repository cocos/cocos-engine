/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
 
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
#include "core/event/CallbacksInvoker.h"
#include "base/Log.h"

namespace cc {

CallbackInfoBase::ID CallbacksInvoker::cbIDCounter{0};

void CallbackList::removeByCallbackID(CallbackInfoBase::ID cbID) {
    for (int32_t i = 0; i < _callbackInfos.size(); ++i) {
        auto &info = _callbackInfos[i];
        if (info->_id == cbID) {
            utils::array::fastRemoveAt(_callbackInfos, i);
            --i;
        }
    }
}

void CallbackList::removeByTarget(void *target) {
    for (int32_t i = 0; i < _callbackInfos.size(); ++i) {
        auto &info = _callbackInfos[i];
        if (info->_target == target) {
            utils::array::fastRemoveAt(_callbackInfos, i);
            --i;
        }
    }
}

void CallbackList::cancel(index_t index) {
    std::shared_ptr<CallbackInfoBase> *info = nullptr;
    if (index >= 0 && index < _callbackInfos.size()) {
        info = &_callbackInfos[index];
    }

    if (info) {
        if (_isInvoking) {
            _callbackInfos[index] = nullptr;
        } else {
            utils::array::fastRemoveAt(_callbackInfos, index);
        }
    }
    _containCanceled = true;
}

void CallbackList::cancelAll() {
    for (auto &callbackInfo : _callbackInfos) {
        callbackInfo = nullptr;
    }
    _containCanceled = true;
}

void CallbackList::purgeCanceled() {
    for (index_t i = static_cast<index_t>(_callbackInfos.size()) - 1; i >= 0; --i) {
        const auto &info = _callbackInfos[i];
        if (!info) {
            utils::array::fastRemoveAt(_callbackInfos, i);
        }
    }
    _containCanceled = false;
}

void CallbackList::clear() {
    cancelAll();
    _callbackInfos.clear();
    _isInvoking      = false;
    _containCanceled = false;
}

bool CallbacksInvoker::hasEventListener(const KeyType &key) const {
    auto iter = _callbackTable.find(key);
    if (iter == _callbackTable.end()) {
        return false;
    }

    const auto &list = iter->second;
    // check any valid callback
    const auto &infos = list._callbackInfos;
    // Make sure no cancelled callbacks
    if (list._isInvoking) {
        for (const auto &info : infos) { // NOLINT(readability-use-anyofallof)
            if (info != nullptr) {
                return true;
            }
        }
        return false;
    }

    return !infos.empty();
}

bool CallbacksInvoker::hasEventListener(const KeyType &key, CallbackInfoBase::ID cbID) const {
    auto iter = _callbackTable.find(key);
    if (iter == _callbackTable.end()) {
        return false;
    }

    const auto &list = iter->second;
    // check any valid callback
    const auto &infos = list._callbackInfos;

    for (const auto &info : infos) { // NOLINT(readability-use-anyofallof)
        if (info != nullptr && info->check() && info->_id == cbID) {
            return true;
        }
    }

    return false;
}

bool CallbacksInvoker::hasEventListener(const KeyType &key, void *target) {
    auto iter = _callbackTable.find(key);
    if (iter == _callbackTable.end()) {
        return false;
    }

    const auto &list = iter->second;
    // check any valid callback
    const auto &infos = list._callbackInfos;

    for (const auto &info : infos) { // NOLINT(readability-use-anyofallof)
        if (info != nullptr && info->check() && info->_target == target) {
            return true;
        }
    }

    return false;
}

bool CallbacksInvoker::hasEventListener(const KeyType &key, void *target, CallbackInfoBase::ID cbID) const {
    auto iter = _callbackTable.find(key);
    if (iter == _callbackTable.end()) {
        return false;
    }

    const auto &list = iter->second;
    // check any valid callback
    const auto &infos = list._callbackInfos;

    for (const auto &info : infos) { // NOLINT(readability-use-anyofallof)
        if (info != nullptr && info->check() && info->_target == target && info->_id == cbID) {
            return true;
        }
    }

    return false;
}

void CallbacksInvoker::offAll(const KeyType &key) {
    auto iter = _callbackTable.find(key);
    if (iter != _callbackTable.end()) {
        auto &list = iter->second;
        if (list._isInvoking) {
            list.cancelAll();
        } else {
            list.clear();
            _callbackTable.erase(iter);
        }
    }
}

void CallbacksInvoker::offAll(void *target) {
    for (auto &e : _callbackTable) {
        auto &      list  = e.second;
        const auto &infos = list._callbackInfos;
        if (list._isInvoking) {
            index_t i = 0;
            for (const auto &info : infos) {
                if (info != nullptr && info->_target == target) {
                    list.cancel(i);
                }
                ++i;
            }
        } else {
            list.removeByTarget(target);
        }
    }
}

void CallbacksInvoker::offAll() {
    for (auto iter = _callbackTable.begin(); iter != _callbackTable.end();) {
        auto &list = iter->second;
        if (list._isInvoking) {
            list.cancelAll();
            ++iter;
        } else {
            list.clear();
            iter = _callbackTable.erase(iter);
        }
    }
}

void CallbacksInvoker::off(const KeyType &key, CallbackInfoBase::ID cbID) {
    auto iter = _callbackTable.find(key);
    if (iter != _callbackTable.end()) {
        auto &      list  = iter->second;
        const auto &infos = list._callbackInfos;
        index_t     i     = 0;
        for (const auto &info : infos) {
            if (info != nullptr && info->_id == cbID) {
                list.cancel(i);
                break;
            }
            ++i;
        }
    }
}

void CallbacksInvoker::offAll(const KeyType &key, void *target) {
    auto iter = _callbackTable.find(key);
    if (iter != _callbackTable.end()) {
        auto &      list  = iter->second;
        const auto &infos = list._callbackInfos;
        index_t     i     = 0;
        if (list._isInvoking) {
            for (const auto &info : infos) {
                if (info != nullptr && info->_target == target) {
                    list.cancel(i);
                }
                ++i;
            }
        } else {
            list.removeByTarget(target);
        }
    }
}

void CallbacksInvoker::off(CallbackInfoBase::ID cbID) {
    for (auto &cbInfo : _callbackTable) {
        auto &      list  = cbInfo.second;
        const auto &infos = list._callbackInfos;
        index_t     i     = 0;
        for (const auto &info : infos) {
            if (info != nullptr && info->_id == cbID) {
                list.cancel(i);
                break;
            }
            ++i;
        }
    }
}

} // namespace cc
