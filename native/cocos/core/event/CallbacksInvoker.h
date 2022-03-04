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
#pragma once

#include <functional>
#include <memory>
#include <string>
#include <typeinfo>
#include <unordered_map>
#include <vector>

#include "base/Log.h"
#include "base/Macros.h"
#include "base/Utils.h"
#include "core/data/Object.h"
#include "core/memop/Pool.h"

namespace cc {

#define CC_CALLBACK_INVOKE_0(__selector__, __target__, ...)                   std::function<void()>(std::bind(&__selector__, __target__, ##__VA_ARGS__)), __target__
#define CC_CALLBACK_INVOKE_1(__selector__, __target__, Arg0, ...)             std::function<void(Arg0)>(std::bind(&__selector__, __target__, std::placeholders::_1, ##__VA_ARGS__)), __target__
#define CC_CALLBACK_INVOKE_2(__selector__, __target__, Arg0, Arg1, ...)       std::function<void(Arg0, Arg1)>(std::bind(&__selector__, __target__, std::placeholders::_1, std::placeholders::_2, ##__VA_ARGS__)), __target__
#define CC_CALLBACK_INVOKE_3(__selector__, __target__, Arg0, Arg1, Arg2, ...) std::function<void(Arg0, Arg1, Arg2)>(std::bind(&__selector__, __target__, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3, ##__VA_ARGS__)), __target__

struct CallbackInfoBase {
    using ID                   = uint32_t;
    using FakeCallbackMemberFn = void (CCObject::*)();

    CallbackInfoBase()          = default;
    virtual ~CallbackInfoBase() = default;

    virtual bool                 check() const       = 0;
    virtual void                 reset()             = 0;
    virtual FakeCallbackMemberFn getMemberFn() const = 0;

    void *_target{nullptr};
    ID    _id{0};
    bool  _once{false};
    bool  _isCCObject{false};
#if CC_DEBUG
    std::vector<std::string> _argTypes;
#endif
};

template <typename... Args>
struct CallbackInfo final : public CallbackInfoBase {
    using CallbackFn       = std::function<void(Args...)>;
    using CallbackMemberFn = void (CCObject::*)(Args...);

    CallbackFn       _callback{nullptr};
    CallbackMemberFn _memberFn{nullptr};

    template <typename Target>
    void set(CallbackFn &&callback, Target *target, bool once) {
        _callback   = std::forward<CallbackFn>(callback);
        _target     = target;
        _once       = once;
        _isCCObject = std::is_base_of<CCObject, Target>::value;
#if CC_DEBUG
        _argTypes = {(typeid(Args).name())...};
#endif
    }

    template <typename Target, typename = std::enable_if_t<std::is_base_of<CCObject, Target>::value>>
    void set(CallbackMemberFn memberFn, Target *target, bool once) {
        _memberFn   = memberFn;
        _target     = target;
        _once       = once;
        _isCCObject = true;
#if CC_DEBUG
        _argTypes = {(typeid(Args).name())...};
#endif
    }

    void reset() override {
        _callback   = nullptr;
        _memberFn   = nullptr;
        _target     = nullptr;
        _once       = false;
        _isCCObject = false;
#if CC_DEBUG
        _argTypes.clear();
#endif
    }

    bool check() const override {
        // Validation
        if (_isCCObject) {
            if (!isObjectValid(reinterpret_cast<CCObject *>(_target), true)) {
                return false;
            }
        }
        return true;
    }

    FakeCallbackMemberFn getMemberFn() const override {
        return reinterpret_cast<FakeCallbackMemberFn>(_memberFn);
    }
};

/**
 * @zh 事件监听器列表的简单封装。
 * @en A simple list of event callbacks
 */
class CallbackList final {
public:
    std::vector<std::shared_ptr<CallbackInfoBase>> _callbackInfos;
    bool                                           _isInvoking{false};
    bool                                           _containCanceled{false};

    /**
     * @zh 从列表中移除与指定目标相同回调函数的事件。
     * @en Remove the event listeners with the given callback from the list
     *
     * @param cbID - The callback id to be removed
     */
    void removeByCallbackID(CallbackInfoBase::ID cbID);

    /**
     * @zh 从列表中移除与指定目标相同调用者的事件。
     * @en Remove the event listeners with the given target from the list
     * @param target
     */
    void removeByTarget(void *target);

    /**
     * @zh 移除指定编号事件。
     * @en Remove the event listener at the given index
     * @param index
     */
    void cancel(index_t index);

    /**
     * @zh 注销所有事件。
     * @en Cancel all event listeners
     */
    void cancelAll();

    /**
     * @zh 立即删除所有取消的回调。（在移除过程中会更加紧凑的排列数组）
     * @en Delete all canceled callbacks and compact array
     */
    void purgeCanceled();

    /**
     * @zh 清除并重置所有数据。
     * @en Clear all data
     */
    void clear();
};

/**
 * @zh CallbacksInvoker 用来根据事件名（Key）管理事件监听器列表并调用回调方法。
 * @en CallbacksInvoker is used to manager and invoke event listeners with different event keys,
 * each key is mapped to a CallbackList.
 */
class CallbacksInvoker {
public:
    using KeyType               = uint32_t;
    CallbacksInvoker()          = default;
    virtual ~CallbacksInvoker() = default;
    /**
     * @zh 向一个事件名注册一个新的事件监听器，包含回调函数和调用者
     * @en Register an event listener to a given event key with callback and target.
     *
     * @param key - Event type
     * @param callback - Callback function when event triggered
     * @param target - Callback callee
     * @param once - Whether invoke the callback only once (and remove it)
     */
    template <typename Target, typename... Args>
    void on(const KeyType &key, void (Target::*memberFn)(Args...), Target *target, bool once = false);

    template <typename Target, typename... Args>
    void on(const KeyType &key, std::function<void(Args...)> &&callback, Target *target, bool once = false);

    template <typename... Args>
    void on(const KeyType &key, std::function<void(Args...)> &&callback, bool once = false);

    template <typename Target, typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    on(const KeyType &key, LambdaType &&callback, Target *target, bool once = false);

    template <typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    on(const KeyType &key, LambdaType &&callback, bool once = false);

    //
    template <typename Target, typename... Args>
    void on(const KeyType &key, std::function<void(Args...)> &&callback, Target *target, CallbackInfoBase::ID &outCallbackID, bool once = false);

    template <typename... Args>
    void on(const KeyType &key, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &outCallbackID, bool once = false);

    template <typename Target, typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    on(const KeyType &key, LambdaType &&callback, Target *target, CallbackInfoBase::ID &outCallbackID, bool once = false);

    template <typename LambdaType>
    std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
    on(const KeyType &key, LambdaType &&callback, CallbackInfoBase::ID &outCallbackID, bool once = false);

    /**
     * @zh 检查指定事件是否已注册回调。
     * @en Checks whether there is correspond event listener registered on the given event
     * @param key - Event type
     * @param cbID - Callback ID
     */
    bool hasEventListener(const KeyType &key) const;
    bool hasEventListener(const KeyType &key, CallbackInfoBase::ID cbID) const;
    bool hasEventListener(const KeyType &key, void *target);
    bool hasEventListener(const KeyType &key, void *target, CallbackInfoBase::ID cbID) const;
    template <typename Target, typename... Args>
    bool hasEventListener(const KeyType &key, void (Target::*memberFn)(Args...), Target *target) const;
    /**
     * @zh 移除在特定事件类型中注册的所有回调或在某个目标中注册的所有回调。
     * @en Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
     * @param key - The event type or target with which the listeners will be removed
     */
    void offAll(const KeyType &key, void *target);
    void offAll(const KeyType &key);
    void offAll(void *target);
    void offAll();

    /**
     * @zh 删除以指定事件，回调函数，目标注册的回调。
     * @en Remove event listeners registered with the given event key, callback and target
     * @param key - Event type
     * @param target callback Target
     * @param cbID - The callback ID of the event listener, if absent all event listeners for the given type will be removed
     */
    void off(const KeyType &key, CallbackInfoBase::ID cbID);
    void off(CallbackInfoBase::ID cbID);
    template <typename Target, typename... Args>
    void off(const KeyType &key, void (Target::*memberFn)(Args...), Target *target);

    /**
     * @zh 派发一个指定事件，并传递需要的参数
     * @en Trigger an event directly with the event name and necessary arguments.
     * @param key - event type
     * @param args - The  arguments to be passed to the callback
     */
    template <typename... Args>
    void emit(const KeyType &key, Args &&...args);

    template <typename T>
    struct FunctionTraits
    : public FunctionTraits<decltype(&T::operator())> {
    };

    template <typename ClassType, typename ReturnType, typename... Args>
    struct FunctionTraits<ReturnType (ClassType::*)(Args...) const> {
        using type = std::function<ReturnType(Args...)>;
    };

    template <typename ClassType, typename ReturnType, typename... Args>
    struct FunctionTraits<ReturnType (ClassType::*)(Args...)> {
        using type = std::function<ReturnType(Args...)>;
    };

    template <typename T>
    static typename FunctionTraits<std::remove_reference_t<T>>::type toFunction(T &&l) {
        return typename FunctionTraits<std::remove_reference_t<T>>::type{std::forward<T>(l)};
    }

private:
    std::unordered_map<KeyType, CallbackList> _callbackTable;
    static CallbackInfoBase::ID               cbIDCounter;
};

template <typename Target, typename... Args>
void CallbacksInvoker::on(const KeyType &key, void (Target::*memberFn)(Args...), Target *target, bool once) {
    static_assert(std::is_base_of<CCObject, Target>::value, "Target must be the subclass of CCObject");
    using CallbackInfoType    = CallbackInfo<Args...>;
    auto &list                = _callbackTable[key];
    auto  info                = std::make_shared<CallbackInfoType>();
    info->_id                 = ++cbIDCounter;
    CallbackInfoBase::ID cbID = info->_id;
    info->set(static_cast<typename CallbackInfoType::CallbackMemberFn>(memberFn), target, once);
    list._callbackInfos.emplace_back(std::move(info));
}

template <typename Target, typename... Args>
void CallbacksInvoker::on(const KeyType &key, std::function<void(Args...)> &&callback, Target *target, CallbackInfoBase::ID &outCallbackID, bool once) {
    auto &list                = _callbackTable[key];
    auto  info                = std::make_shared<CallbackInfo<Args...>>();
    info->_id                 = ++cbIDCounter;
    CallbackInfoBase::ID cbID = info->_id;
    info->set(std::forward<std::function<void(Args...)>>(callback), target, once);
    list._callbackInfos.emplace_back(std::move(info));
    outCallbackID = cbID;
}

template <typename... Args>
void CallbacksInvoker::on(const KeyType &key, std::function<void(Args...)> &&callback, CallbackInfoBase::ID &outCallbackID, bool once) {
    on<std::nullptr_t>(key, std::forward<std::function<void(Args...)>>(callback), nullptr, outCallbackID, once);
}

template <typename Target, typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
CallbacksInvoker::on(const KeyType &key, LambdaType &&callback, Target *target, CallbackInfoBase::ID &outCallbackID, bool once) {
    on(key, toFunction(std::forward<LambdaType>(callback)), target, outCallbackID, once);
}

template <typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
CallbacksInvoker::on(const KeyType &key, LambdaType &&callback, CallbackInfoBase::ID &outCallbackID, bool once) {
    on(key, toFunction(std::forward<LambdaType>(callback)), outCallbackID, once);
}

template <typename Target, typename... Args>
void CallbacksInvoker::on(const KeyType &key, std::function<void(Args...)> &&callback, Target *target, bool once) {
    CallbackInfoBase::ID unusedID{0};
    on(key, callback, target, unusedID, once);
}

template <typename... Args>
void CallbacksInvoker::on(const KeyType &key, std::function<void(Args...)> &&callback, bool once) {
    CallbackInfoBase::ID unusedID{0};
    on<std::nullptr_t>(key, std::forward<std::function<void(Args...)>>(callback), nullptr, unusedID, once);
}

template <typename Target, typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
CallbacksInvoker::on(const KeyType &key, LambdaType &&callback, Target *target, bool once) {
    CallbackInfoBase::ID unusedID{0};
    on(key, toFunction(std::forward<LambdaType>(callback)), target, unusedID, once);
}

template <typename LambdaType>
std::enable_if_t<!std::is_member_function_pointer<LambdaType>::value, void>
CallbacksInvoker::on(const KeyType &key, LambdaType &&callback, bool once) {
    CallbackInfoBase::ID unusedID{0};
    on(key, toFunction(std::forward<LambdaType>(callback)), unusedID, once);
}

template <typename Target, typename... Args>
void CallbacksInvoker::off(const KeyType &key, void (Target::*memberFn)(Args...), Target *target) {
    static_assert(std::is_base_of<CCObject, Target>::value, "Target must be the subclass of CCObject");
    using CallbackFn = void (CCObject::*)(Args...);
    auto iter        = _callbackTable.find(key);
    if (iter != _callbackTable.end()) {
        auto &      list  = iter->second;
        const auto &infos = list._callbackInfos;
        size_t      i     = 0;
        for (const auto &info : infos) {
            if (info != nullptr && reinterpret_cast<CallbackFn>(info->getMemberFn()) == memberFn && info->_target == target) {
                list.cancel(static_cast<int32_t>(i));
                break;
            }
            ++i;
        }
    }
}

template <typename... Args>
void CallbacksInvoker::emit(const KeyType &key, Args &&...args) {
#if CC_DEBUG
    std::vector<std::string> argTypes{(typeid(Args).name())...};
#endif
    auto iter = _callbackTable.find(key);
    if (iter != _callbackTable.end()) {
        auto &list        = iter->second;
        bool  rootInvoker = !list._isInvoking;
        list._isInvoking  = true;

        auto &infos = list._callbackInfos;
        for (auto &i : infos) {
            auto &baseInfo = i;
            if (baseInfo == nullptr) {
                continue;
            }

#if CC_DEBUG
            CC_ASSERT(baseInfo->_argTypes.size() == argTypes.size());
            for (size_t i = 0, len = argTypes.size(); i < len; ++i) {
                if (baseInfo->_argTypes[i] != argTypes[i]) {
                    CC_LOG_ERROR("Wrong argument type! baseInfo->_argTypes[%d]=%s, argTypes[%d]=%s", i, baseInfo->_argTypes[i].c_str(), i, argTypes[i].c_str());
                    CC_ASSERT(false);
                }
            }
#endif
            using CallbackInfoType = CallbackInfo<Args...>;
            auto info              = std::static_pointer_cast<CallbackInfoType>(i);
            if (info != nullptr) {
                if (info->_memberFn != nullptr && info->_target != nullptr) {
                    auto  memberFn = info->_memberFn;
                    auto *target   = reinterpret_cast<CCObject *>(info->_target);

                    // Pre off once callbacks to avoid influence on logic in callback
                    if (info->_once) {
                        off(key, memberFn, target);
                    }
                    // Lazy check validity of callback target,
                    // if target is CCObject and is no longer valid, then remove the callback info directly
                    if (!info->check()) {
                        off(key, memberFn, target);
                    } else {
                        (target->*memberFn)(std::forward<Args>(args)...);
                    }
                } else {
                    const auto &         callback = info->_callback;
                    CallbackInfoBase::ID cbID     = info->_id;
                    // Pre off once callbacks to avoid influence on logic in callback
                    if (info->_once) {
                        off(key, cbID);
                    }
                    // Lazy check validity of callback target,
                    // if target is CCObject and is no longer valid, then remove the callback info directly
                    if (!info->check()) {
                        off(key, cbID);
                    } else {
                        callback(std::forward<Args>(args)...);
                    }
                }
            } else {
                CC_ASSERT(false);
            }
        }

        if (rootInvoker) {
            list._isInvoking = false;
            if (list._containCanceled) {
                list.purgeCanceled();
            }
        }
    }
}

template <typename Target, typename... Args>
bool CallbacksInvoker::hasEventListener(const KeyType &key, void (Target::*memberFn)(Args...), Target *target) const {
    using CallbackFn = void (CCObject::*)(Args...);
    auto iter        = _callbackTable.find(key);
    if (iter == _callbackTable.end()) {
        return false;
    }

    const auto &list = iter->second;
    // check any valid callback
    const auto &infos = list._callbackInfos;

    for (const auto &info : infos) {
        if (info != nullptr && info->check() && reinterpret_cast<CallbackFn>(info->getMemberFn()) == memberFn && info->_target == target) {
            return true;
        }
    }

    return false;
}

using EventTarget = CallbacksInvoker;

} // namespace cc
