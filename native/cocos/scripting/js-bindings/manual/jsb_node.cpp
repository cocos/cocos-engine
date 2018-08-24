/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

//
//  jsb_node.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 4/26/17.
//
//

#include "jsb_node.hpp"
#include "jsb_global.h"
#include "jsb_conversions.hpp"
#include "ScriptingCore.h"

#include "cocos2d.h"

using namespace cocos2d;

#define STANDALONE_TEST 0

extern se::Object* __jsb_cocos2d_Node_proto;
extern se::Class* __jsb_cocos2d__Node_class;

extern se::Object* __jsb_cocos2d_Scheduler_proto;

se::Object* __jsb_Node_proto = nullptr;
se::Class* __jsb_Node_class = nullptr;

static bool Node_finalized(se::State& s)
{
    if (s.nativeThisObject())
    {
        Node* thiz = (Node*) s.nativeThisObject();
        SE_LOGD("Node_finalized %p ...\n", thiz->getUserData());
        CC_SAFE_RELEASE(thiz);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(Node_finalized)

static bool Node_constructor(se::State& s)
{
    SE_LOGD("Node_constructor ...\n");
    Node* obj = new Node();
    s.thisObject()->setPrivateData(obj);
    return true;
}
SE_BIND_CTOR(Node_constructor, __jsb_Node_class, Node_finalized)

static bool Node_ctor(se::State& s)
{
    SE_LOGD("Node_ctor ...\n");
    Node* obj = new Node();
    s.thisObject()->setPrivateData(obj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(Node_ctor, __jsb_Node_class, Node_finalized)

static bool Node_create(se::State& s)
{
    Node* node = Node::create();
    node->retain();
    auto obj = se::Object::createObjectWithClass(__jsb_Node_class);
    obj->setPrivateData(node);
    s.rval().setObject(obj);
    return true;
}
SE_BIND_FUNC(Node_create)

static bool Node_onEnter(se::State& s)
{
    ScriptingCore::getInstance()->setCalledFromScript(true);
    Node* thiz = (Node*)s.nativeThisObject();
    thiz->onEnter();
    return true;
}
SE_BIND_FUNC(Node_onEnter)

static bool Node_onExit(se::State& s)
{
    ScriptingCore::getInstance()->setCalledFromScript(true);
    Node* thiz = (Node*)s.nativeThisObject();
    thiz->onExit();
    return true;
}
SE_BIND_FUNC(Node_onExit)

static bool Node_onEnterTransitionDidFinish(se::State& s)
{
    ScriptingCore::getInstance()->setCalledFromScript(true);
    Node* thiz = (Node*)s.nativeThisObject();
    thiz->onEnterTransitionDidFinish();
    return true;
}
SE_BIND_FUNC(Node_onEnterTransitionDidFinish)

static bool Node_onExitTransitionDidStart(se::State& s)
{
    ScriptingCore::getInstance()->setCalledFromScript(true);
    Node* thiz = (Node*)s.nativeThisObject();
    thiz->onExitTransitionDidStart();
    return true;
}
SE_BIND_FUNC(Node_onExitTransitionDidStart)

static bool Node_cleanup(se::State& s)
{
    ScriptingCore::getInstance()->setCalledFromScript(true);
    Node* thiz = (Node*)s.nativeThisObject();
    thiz->cleanup();
    return true;
}
SE_BIND_FUNC(Node_cleanup)

static bool Node_addChild(se::State& s)
{
    const auto& args = s.args();
    Node* thiz = (Node*)s.nativeThisObject();
    Node* child = (Node*)args[0].toObject()->getPrivateData();
    thiz->addChild(child);
    return true;
}
SE_BIND_FUNC(Node_addChild)

class ScheduleElement
{
public:
    ScheduleElement(se::Object* target, se::Object* func, const std::string& key, uint32_t targetId, uint32_t funcId)
    : _target(target)
    , _func(func)
    , _key(key)
    , _targetId(targetId)
    , _funcId(funcId)
    {}

    ScheduleElement(ScheduleElement&& o)
    {
        *this = std::move(o);
    }

    ScheduleElement* operator=(ScheduleElement&& o)
    {
        if (this != &o)
        {
            _target = o._target;
            _func = o._func;
            _key = std::move(o._key);
            _targetId = o._targetId;
            _funcId = o._funcId;
        }
        return this;
    }

    inline se::Object* getTarget() const { return _target; }
    inline se::Object* getFunc() const { return _func; }
    inline const std::string& getKey() const { return _key; }
    inline uint32_t getTargetId() const { return _targetId; }
    inline uint32_t getFuncId() const { return _funcId; }

private:
    ScheduleElement(const ScheduleElement& o) { assert(false); }
    ScheduleElement* operator=(const ScheduleElement& o) { assert(false); return this; }

    se::Object* _target;
    se::Object* _func;
    std::string _key;
    uint32_t _targetId;
    uint32_t _funcId;
};

static uint32_t __scheduleTargetIdCounter = 0;
static uint32_t __scheduleFuncIdCounter = 0;

static const char* SCHEDULE_TARGET_ID_KEY = "__seScheTargetId";
static const char* SCHEDULE_FUNC_ID_KEY = "__seScheFuncId";

static std::unordered_map<uint32_t/*targetId*/, std::unordered_map<uint32_t/*funcId*/, ScheduleElement>> __js_target_schedulekey_map;
static std::unordered_map<uint32_t/*targetId*/, std::pair<int/*priority*/, se::Object*>> __js_target_schedule_update_map;

static bool isScheduleExist(uint32_t jsFuncId, uint32_t jsTargetId, const ScheduleElement** outElement)
{
    bool found = false;
    for (const auto& e : __js_target_schedulekey_map)
    {
        if (e.first == jsTargetId)
        {
            for (const auto& e2 : e.second)
            {
                if (e2.first == jsFuncId)
                {
                    *outElement = &e2.second;
                    found = true;
                    break;
                }
            }
        }
        if (found)
        {
            break;
        }
    }

    if (!found)
    {
        *outElement = nullptr;
    }

    return found;
}

static bool isScheduleExist(const std::string& key, uint32_t jsTargetId, const ScheduleElement** outElement)
{
    bool found = false;
    for (const auto& e : __js_target_schedulekey_map)
    {
        if (e.first == jsTargetId)
        {
            for (const auto& e2 : e.second)
            {
                if (e2.second.getKey() == key)
                {
                    *outElement = &e2.second;
                    found = true;
                    break;
                }
            }
        }
        if (found)
            break;
    }

    if (!found)
    {
        *outElement = nullptr;
    }
    return found;
}

static void removeSchedule(uint32_t jsFuncId, uint32_t jsTargetId, bool needDetachChild)
{
    auto funcObjKeyMapIter = __js_target_schedulekey_map.find(jsTargetId);
    if (funcObjKeyMapIter != __js_target_schedulekey_map.end())
    {
        auto& funcMap = funcObjKeyMapIter->second;

        auto iter = funcMap.find(jsFuncId);
        if (iter != funcMap.end())
        {
            se::Object* target = iter->second.getTarget();
            se::Object* func = iter->second.getFunc();
            if (needDetachChild)
            {
                target->detachObject(func);
            }

            func->decRef();
            target->decRef();

            funcMap.erase(iter);
        }

        if (funcMap.empty())
        {
            __js_target_schedulekey_map.erase(funcObjKeyMapIter);
        }
    }
}

static void removeScheduleForThis(uint32_t jsTargetId, bool needDetachChild)
{
    auto funcObjKeyMapIter = __js_target_schedulekey_map.find(jsTargetId);
    if (funcObjKeyMapIter != __js_target_schedulekey_map.end())
    {
        auto& funcMap = funcObjKeyMapIter->second;

        se::Object* target = nullptr;
        se::Object* func = nullptr;
        for (auto& e : funcMap)
        {
            target = e.second.getTarget();
            func = e.second.getFunc();
            if (needDetachChild)
            {
                target->detachObject(func);
            }

            func->decRef(); // Release jsFunc
            target->decRef(); // Release jsThis
        }

        funcMap.clear();
        __js_target_schedulekey_map.erase(funcObjKeyMapIter);
    }
}

static void removeAllSchedules(bool needDetachChild)
{
    CCLOG("Begin unschedule all callbacks");
    for (auto& e1 :__js_target_schedulekey_map)
    {
        auto& funcMap = e1.second;

        CCLOG(">> Found funcMap: %d", (int)funcMap.size());

        se::Object* target = nullptr;
        se::Object* func = nullptr;
        for (auto& e : funcMap)
        {
            target = e.second.getTarget();
            func = e.second.getFunc();
            if (needDetachChild)
            {
                CCLOG("detachObject: owner: %p, target: %p", target, func);
                target->detachObject(func);
            }
            target->decRef(); // Release jsThis
            func->decRef(); // Release jsFunc
        }
        funcMap.clear();
    }
    __js_target_schedulekey_map.clear();
}

static void removeAllScheduleUpdates()
{
    for (auto& e2 : __js_target_schedule_update_map)
    {
        e2.second.second->decRef();
    }
    __js_target_schedule_update_map.clear();
}

static void removeAllScheduleAndUpdate(bool needDetachChild)
{
    removeAllSchedules(needDetachChild);
    removeAllScheduleUpdates();
}

static bool isScheduleUpdateExist(uint32_t targetId)
{
    for (const auto& e : __js_target_schedule_update_map)
    {
        if (e.first == targetId)
        {
            return true;
        }
    }
    return false;
}

static void removeScheduleUpdate(uint32_t targetId)
{
    auto iter =  __js_target_schedule_update_map.find(targetId);
    if (iter != __js_target_schedule_update_map.end())
    {
        iter->second.second->decRef();
        __js_target_schedule_update_map.erase(iter);
    }
}

static void removeScheduleUpdatesForMinPriority(int minPriority)
{
    int foundPriority = 0;
    auto iter = __js_target_schedule_update_map.begin();
    while (iter != __js_target_schedule_update_map.end())
    {
        foundPriority = iter->second.first;
        if (foundPriority >= minPriority)
        {
            iter->second.second->decRef();
            iter = __js_target_schedule_update_map.erase(iter);
        }
        else
        {
            ++iter;
        }
    }
}

static void insertScheduleUpdate(uint32_t targetId, int priority, se::Object* targetObj)
{
    assert(__js_target_schedule_update_map.find(targetId) == __js_target_schedule_update_map.end());
    __js_target_schedule_update_map[targetId] = std::make_pair(priority, targetObj);
    targetObj->incRef();
}

static void insertSchedule(uint32_t funcId, uint32_t targetId, ScheduleElement&& element)
{
    auto& funcKeyMap = __js_target_schedulekey_map[targetId];
    assert(funcKeyMap.find(funcId) == funcKeyMap.end());
    element.getTarget()->incRef();
    element.getFunc()->incRef();

    funcKeyMap.emplace(funcId, std::move(element));
}

static bool isTargetExistInScheduler(uint32_t targetId)
{
    assert(targetId != 0);

    // Iterating the schedule func map
    for (const auto& e : __js_target_schedulekey_map)
    {
        if (e.first == targetId)
        {
            return true;
        }
    }

    // Iterating the schedule update map
    for (const auto& e : __js_target_schedule_update_map)
    {
        if (e.first == targetId)
        {
            return true;
        }
    }
    return false;
}

class UnscheduleNotifier
{
public:
    UnscheduleNotifier(uint32_t funcId, uint32_t targetId)
    : _funcId(funcId)
    , _targetId(targetId)
    {
    }
    ~UnscheduleNotifier()
    {
//        SE_LOGD("~UnscheduleNotifier, targetId: %u, funcId: %u\n", _targetId, _funcId);

        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        removeSchedule(_funcId, _targetId, false);
    }

private:
    uint32_t _funcId;
    uint32_t _targetId;
};

static uint32_t __idx = 0;

static bool Scheduler_scheduleCommon(Scheduler* scheduler, const se::Value& jsThis, const se::Value& jsFunc, float interval, unsigned int repeat, float delay, bool isPaused, bool toRootTarget, const std::string& callFromDebug)
{
    assert(jsThis.isObject());
    assert(jsFunc.isObject());
    assert(jsFunc.toObject()->isFunction());
    jsThis.toObject()->attachObject(jsFunc.toObject());

    std::string key;

    se::Value targetIdVal;
    se::Value funcIdVal;

    uint32_t targetId = 0;
    uint32_t funcId = 0;

    if (jsThis.toObject()->getProperty(SCHEDULE_TARGET_ID_KEY, &targetIdVal) && targetIdVal.isNumber())
    {
        targetId = targetIdVal.toUint32();
    }

    if (jsFunc.toObject()->getProperty(SCHEDULE_FUNC_ID_KEY, &funcIdVal) && funcIdVal.isNumber())
    {
        funcId = funcIdVal.toUint32();
    }

    if (targetIdVal.isNumber() && funcIdVal.isNumber())
    {
        const ScheduleElement* scheduleElem = nullptr;
        bool found = isScheduleExist(funcId, targetId, &scheduleElem);
        if (found)
            key = scheduleElem->getKey();

        if (found && !key.empty())
        {
            removeSchedule(funcId, targetId, true);
            scheduler->unschedule(key, reinterpret_cast<void*>(targetId));
        }
    }
    else
    {
        if (targetId == 0)
        {
            targetId = ++__scheduleTargetIdCounter;
            // counter is probably overfollow, it maybe 0 which is invalid id. Increase 1.
            if (targetId == 0)
            {
                targetId = ++__scheduleTargetIdCounter;
            }
            jsThis.toObject()->setProperty(SCHEDULE_TARGET_ID_KEY, se::Value(targetId));
        }

        if (funcId == 0)
        {
            funcId = ++__scheduleFuncIdCounter;
            // counter is probably overfollow, it maybe 0 which is invalid id. Increase 1.
            if (funcId == 0)
            {
                funcId = ++__scheduleFuncIdCounter;
            }
            jsFunc.toObject()->setProperty(SCHEDULE_FUNC_ID_KEY, se::Value(funcId));
        }
    }

    key = StringUtils::format("__node_schedule_key:%u", __idx++);

    se::Object* target = jsThis.toObject();
    insertSchedule(funcId, targetId, ScheduleElement(target, jsFunc.toObject(), key, targetId, funcId));
    std::shared_ptr<UnscheduleNotifier> unscheduleNotifier = std::make_shared<UnscheduleNotifier>(funcId, targetId);

    if (toRootTarget)
    {
        target->root();
    }

    scheduler->schedule([jsThis, jsFunc, unscheduleNotifier, callFromDebug](float dt){
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        se::Object* thisObj = jsThis.toObject();
        se::Object* funcObj = jsFunc.toObject();

        se::ValueArray args;
        args.push_back(se::Value((double)dt));
        bool ok = funcObj->call(args, thisObj);
        if (!ok)
        {
            CCLOGERROR("Invoking schedule callback failed, where: %s", callFromDebug.c_str());
        }
        
    }, reinterpret_cast<void*>(targetId), interval, repeat, delay, isPaused, key);

    return true;
}

static bool Node_schedule(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

#if 0//COCOS2D_DEBUG > 0
    SE_LOGD("--------------------------\nschedule target count: %d\n", (int)__js_target_schedulekey_map.size());
    int totalCount = 0;
    for (const auto& e1 : __js_target_schedulekey_map)
    {
        SE_LOGD("schedule target: %p, functions: %d\n", e1.first, (int)e1.second.size());
        totalCount += (int)e1.second.size();
    }
    SE_LOGD("total: %d-------------------------- \n", totalCount);
#endif

    if (argc >= 1)
    {
        Node* thiz = (Node*)s.nativeThisObject();
        se::Value jsThis(s.thisObject());
        se::Value jsFunc(args[0]);

        float interval = 0.0f;
        unsigned int repeat = CC_REPEAT_FOREVER;
        float delay = 0.0f;
        bool ok = false;

        if (argc >= 2)
        {
            ok = seval_to_float(args[1], &interval);
            SE_PRECONDITION2(ok, false, "Converting 'interval' argument failed");
        }

        if (argc >= 3)
        {
            ok = seval_to_uint32(args[2], &repeat);
            SE_PRECONDITION2(ok, false, "Converting 'interval' argument failed");
        }

        if (argc >= 4)
        {
            ok = seval_to_float(args[3], &delay);
            SE_PRECONDITION2(ok, false, "Converting 'delay' argument failed");
        }

        return Scheduler_scheduleCommon(thiz->getScheduler(), jsThis, jsFunc, interval, repeat, delay, !thiz->isRunning(), false, "cc.Node.schedule");
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, expected: %s", argc, ">=1");
    return false;
}
SE_BIND_FUNC(Node_schedule)

static bool Node_scheduleOnce(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
#if 0//COCOS2D_DEBUG > 0
    SE_LOGD("--------------------------\nschedule target count: %d\n", (int)__js_target_schedulekey_map.size());
    for (const auto& e1 : __js_target_schedulekey_map)
    {
        SE_LOGD("schedule target: %p, functions: %d\n", e1.first, (int)e1.second.size());
    }
    SE_LOGD("-------------------------- \n");
#endif

    Node* thiz = (Node*)s.nativeThisObject();
    se::Value jsThis(s.thisObject());
    se::Value jsFunc(args[0]);

    float delay = 0.0f;
    bool ok = false;

    if (argc >= 2)
    {
        ok = seval_to_float(args[1], &delay);
        SE_PRECONDITION2(ok, false, "Converting 'delay' argument failed");
    }

    return Scheduler_scheduleCommon(thiz->getScheduler(), jsThis, jsFunc, 0.0f, 0, delay, !thiz->isRunning(), false, "cc.Node.scheduleOnce");
}
SE_BIND_FUNC(Node_scheduleOnce)

class UnscheduleUpdateNotifier
{
public:
    UnscheduleUpdateNotifier(uint32_t targetId)
    : _targetId(targetId)
    {
    }

    ~UnscheduleUpdateNotifier()
    {
//        SE_LOGD("~UnscheduleUpdateNotifier: %p\n", _target);
        removeScheduleUpdate(_targetId);
    }

private:
    uint32_t _targetId;
};

static bool Scheduler_unscheduleUpdateCommon(Scheduler* scheduler, se::Object* jsTarget, uint32_t* foundTargetId = nullptr)
{
    assert(jsTarget != nullptr);

    se::Value targetIdVal;
    if (!jsTarget->getProperty(SCHEDULE_TARGET_ID_KEY, &targetIdVal) || !targetIdVal.isNumber())
    {
        if (foundTargetId != nullptr)
            *foundTargetId = 0;
        return false;
    }

    uint32_t targetId = targetIdVal.toUint32();
    if (foundTargetId != nullptr)
        *foundTargetId = targetId;

    bool found = isScheduleUpdateExist(targetId);
    if (found)
    {
        removeScheduleUpdate(targetId);
        scheduler->unscheduleUpdate(reinterpret_cast<void*>(targetId));
    }

    return found;
}

static bool Scheduler_scheduleUpdateCommon(Scheduler* scheduler, const se::Value& jsThis, int priority, bool isPaused)
{
    se::Object* jsTargetObj = jsThis.toObject();
    uint32_t targetId = 0;

    Scheduler_unscheduleUpdateCommon(scheduler, jsTargetObj, &targetId);

    if (targetId == 0)
    {
        targetId = ++__scheduleTargetIdCounter;
        // counter is probably overfollow, it maybe 0 which is invalid id. Increase 1.
        if (targetId == 0)
        {
            targetId = ++__scheduleTargetIdCounter;
        }
        jsTargetObj->setProperty(SCHEDULE_TARGET_ID_KEY, se::Value(targetId));
    }

    insertScheduleUpdate(targetId, priority, jsTargetObj);
    std::shared_ptr<UnscheduleUpdateNotifier> scheduleUpdateWrapper = std::make_shared<UnscheduleUpdateNotifier>(targetId);

    se::Value thisVal = jsThis;

    scheduler->schedulePerFrame([thisVal, scheduleUpdateWrapper](float dt){

        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        se::Value funcVal;
        if (thisVal.toObject()->getProperty("update", &funcVal) && funcVal.isObject() && funcVal.toObject()->isFunction())
        {
            se::ValueArray args;
            args.reserve(1);
            args.push_back(se::Value(dt));
            funcVal.toObject()->call(args, thisVal.toObject());
        }

    }, reinterpret_cast<void*>(targetId), priority, isPaused);

    return true;
}

static bool Node_scheduleUpdate(se::State& s)
{
#if COCOS2D_DEBUG > 1
    SE_LOGD("--------------------------\nscheduleUpdate target count: %d\n", (int)__js_target_schedule_update_map.size());
    for (const auto& e1 : __js_target_schedule_update_map)
    {
        SE_LOGD("target: %u, updated: priority: %d\n", e1.first, e1.second.first);
    }
    SE_LOGD("-------------------------- \n");
#endif

    Node* thiz = (Node*)s.nativeThisObject();
    se::Value jsThis(s.thisObject());

    return Scheduler_scheduleUpdateCommon(thiz->getScheduler(), jsThis, 0, !thiz->isRunning());
}
SE_BIND_FUNC(Node_scheduleUpdate)

static bool Node_scheduleUpdateWithPriority(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
#if COCOS2D_DEBUG > 1
    SE_LOGD("--------------------------\nscheduleUpdate target count: %d\n", (int)__js_target_schedule_update_map.size());
    for (const auto& e1 : __js_target_schedule_update_map)
    {
        SE_LOGD("target: %u, updated: priority: %d\n", e1.first, e1.second.first);
    }
    SE_LOGD("-------------------------- \n");
#endif

    Node* thiz = (Node*)s.nativeThisObject();
    se::Value jsThis(s.thisObject());

    int priority = 0;

    if (argc == 1)
    {
        bool ok = seval_to_int32(args[0], &priority);
        SE_PRECONDITION2(ok, false, "Converting priority failed!");
        return Scheduler_scheduleUpdateCommon(thiz->getScheduler(), jsThis, priority, !thiz->isRunning());
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(Node_scheduleUpdateWithPriority)

static bool Node_unscheduleUpdate(se::State& s)
{
    int argc = (int)s.args().size();
    if (argc == 0)
    {
        Node* node = (Node*)s.nativeThisObject();
        Scheduler_unscheduleUpdateCommon(node->getScheduler(), s.thisObject());
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(Node_unscheduleUpdate)

static bool Scheduler_unscheduleCommon(Scheduler* scheduler, const se::Value& jsThis, const se::Value& jsFuncOrKey)
{
    std::string key;

    bool found = false;

    se::Value targetIdVal;
    se::Value funcIdVal;

    jsThis.toObject()->getProperty(SCHEDULE_TARGET_ID_KEY, &targetIdVal);
    if (!targetIdVal.isNumber())
        return true;

    uint32_t targetId = targetIdVal.toUint32();
    uint32_t funcId = 0;

    if (jsFuncOrKey.isString() || jsFuncOrKey.isNumber())
    {
        key = jsFuncOrKey.toStringForce();
        const ScheduleElement* scheduleElem = nullptr;
        found = isScheduleExist(key, targetId, &scheduleElem);
        if (found)
            funcId = scheduleElem->getFuncId();
    }
    else if (jsFuncOrKey.isObject())
    {
        if (jsFuncOrKey.toObject()->getProperty(SCHEDULE_FUNC_ID_KEY, &funcIdVal) && funcIdVal.isNumber())
        {
            funcId = funcIdVal.toUint32();
            const ScheduleElement* scheduleElem = nullptr;
            found = isScheduleExist(funcId, targetId, &scheduleElem);
            if (found)
                key = scheduleElem->getKey();
        }
    }
    else
    {
        assert(false);
    }

    if (!targetIdVal.isNumber() || !funcIdVal.isNumber())
    {
        return true;
    }

    if (found && !key.empty())
    {
        removeSchedule(funcId, targetId, true);
        scheduler->unschedule(key, reinterpret_cast<void*>(targetId));
    }
    else
    {
        SE_LOGD("WARNING: %s not found\n", __FUNCTION__);
    }
    return true;
}

static bool Node_unschedule(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        Node* thiz = (Node*)s.nativeThisObject();
        se::Value jsThis(s.thisObject());
        se::Value jsFunc(args[0]);
        return Scheduler_unscheduleCommon(thiz->getScheduler(), jsThis, jsFunc);
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

SE_BIND_FUNC(Node_unschedule)

static bool Scheduler_isScheduled(Scheduler* scheduler, const se::Value& jsThis, const se::Value& jsFuncOrKey)
{
    se::Value targetIdVal;
    if (!jsThis.toObject()->getProperty(SCHEDULE_TARGET_ID_KEY, &targetIdVal) || !targetIdVal.isNumber())
        return false;

    uint32_t targetId = targetIdVal.toUint32();
    if (isTargetExistInScheduler(targetId))
    {
        if (jsFuncOrKey.isString() || jsFuncOrKey.isNumber())
        {
            return scheduler->isScheduled(jsFuncOrKey.toStringForce(), reinterpret_cast<void*>(targetId));
        }
        else if (jsFuncOrKey.isObject())
        {
            std::string key;
            se::Value funcIdVal;
            if (jsFuncOrKey.toObject()->getProperty(SCHEDULE_FUNC_ID_KEY, &funcIdVal) && funcIdVal.isNumber())
            {
                uint32_t funcId = funcIdVal.toUint32();
                const ScheduleElement* scheduleElem = nullptr;
                if (isScheduleExist(funcId, targetId, &scheduleElem))
                {
                    key = scheduleElem->getKey();
                    if (!key.empty())
                    {
                        return scheduler->isScheduled(key, reinterpret_cast<void*>(targetId));
                    }
                }
            }
        }
        else
        {
            assert(false);
        }

    }
    return false;
}

static bool Node_isScheduled(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        Node* thiz = (Node*)s.nativeThisObject();
        se::Value jsThis(s.thisObject());
        se::Value jsFuncOrKey(args[0]);
        bool isScheduled = Scheduler_isScheduled(thiz->getScheduler(), jsThis, jsFuncOrKey);
        s.rval().setBoolean(isScheduled);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(Node_isScheduled)

static bool Scheduler_unscheduleAllCallbacksCommon(Scheduler* scheduler, se::Object* jsThis, bool needDetachChild)
{
    se::Value targetIdVal;
    if (!jsThis->getProperty(SCHEDULE_TARGET_ID_KEY, &targetIdVal) || !targetIdVal.isNumber())
        return true;

    uint32_t targetId = targetIdVal.toUint32();

    if (isTargetExistInScheduler(targetId))
    {
        removeScheduleForThis(targetId, needDetachChild);
        removeScheduleUpdate(targetId);
        scheduler->unscheduleAllForTarget(reinterpret_cast<void*>(targetId));
    }
    return true;
}

static bool Node_unscheduleAllCallbacks(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    Node* thiz = (Node*)s.nativeThisObject();
    if (argc == 0)
    {
        return Scheduler_unscheduleAllCallbacksCommon(thiz->getScheduler(), s.thisObject(), true);
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(Node_unscheduleAllCallbacks)

static bool Node_getChildren(se::State& s)
{
    Node* thiz = (Node*)s.nativeThisObject();
    const auto& children = thiz->getChildren();
    bool ok = Vector_to_seval(children, &s.rval());
    return ok;
}
SE_BIND_FUNC(Node_getChildren)

static bool Node_foo(se::State& s)
{
    s.rval().setString("hello world");
    return true;
}
SE_BIND_FUNC(Node_foo)

static bool Node_set_x(se::State& s)
{
    const auto& args = s.args();
    Node* thiz = (Node*)s.nativeThisObject();
    float x = args[0].toNumber();
    SE_LOGD("cc.Node set_x (%f) native obj: %p\n", x, thiz);
    thiz->setPositionX(x);
    return true;
}
SE_BIND_PROP_SET(Node_set_x)

static bool Node_get_x(se::State& s)
{
    Node* thiz = (Node*)s.nativeThisObject();
    s.rval().setFloat(thiz->getPositionX());
    return true;
}
SE_BIND_PROP_GET(Node_get_x)

static bool Node_set_y(se::State& s)
{
    const auto& args = s.args();
    Node* thiz = (Node*)s.nativeThisObject();
    float y = args[0].toNumber();
    SE_LOGD("cc.Node set_y (%f) native obj: %p\n", y, thiz);
    thiz->setPositionY(y);
    return true;
}
SE_BIND_PROP_SET(Node_set_y)

static bool Node_get_y(se::State& s)
{
    Node* thiz = (Node*)s.nativeThisObject();
    s.rval().setFloat(thiz->getPositionY());
    return true;
}
SE_BIND_PROP_GET(Node_get_y)

static bool Node_setContentSize(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    Node* cobj = (Node*)s.nativeThisObject();
    bool ok = true;
    if (argc == 1)
    {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setContentSize(arg0);
        return true;
    }
    else if (argc == 2)
    {
        float width = 0.0f;
        float height = 0.0f;
        ok &= seval_to_float(args[0], &width);
        ok &= seval_to_float(args[1], &height);
        cobj->setContentSize(cocos2d::Size(width, height));
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(Node_setContentSize)

static bool Node_setAnchorPoint(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    Node* cobj = (Node*)s.nativeThisObject();
    bool ok = true;
    if (argc == 1)
    {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setAnchorPoint(arg0);
        return true;
    }
    else if (argc == 2)
    {
        float x = 0.0f;
        float y = 0.0f;
        ok &= seval_to_float(args[0], &x);
        ok &= seval_to_float(args[1], &y);
        cobj->setAnchorPoint(cocos2d::Vec2(x, y));
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(Node_setAnchorPoint)

static bool Node_setPosition(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    Node* cobj = (Node*)s.nativeThisObject();
    bool ok = true;
    if (argc == 1)
    {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setPosition(arg0);
        return true;
    }
    else if (argc == 2)
    {
        float x = 0.0f;
        float y = 0.0f;
        ok &= seval_to_float(args[0], &x);
        ok &= seval_to_float(args[1], &y);
        cobj->setPosition(x, y);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(Node_setPosition)

// Scheduler

static bool js_cocos2dx_Scheduler_scheduleUpdateForTarget(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc >= 1)
    {
        bool ok = true;

        se::Value jsTarget = args[0];
        int priority = 0;
        bool isPaused = false;

        if (argc >= 2)
        {
            ok = seval_to_int32(args[1], &priority);
            SE_PRECONDITION2(ok, false, "Error processing arguments");
        }

        if (argc >= 3)
        {
            ok = seval_to_boolean(args[2], &isPaused);
            SE_PRECONDITION2(ok, false, "Error processing arguments");
        }

        Scheduler* cobj = (Scheduler*)s.nativeThisObject();
        Scheduler_scheduleUpdateCommon(cobj, jsTarget, priority, isPaused);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, expected: %s", argc, ">=1");
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_scheduleUpdateForTarget)

static bool js_cocos2dx_Scheduler_unscheduleUpdate(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc >= 1)
    {
        Scheduler* cobj = (Scheduler*)s.nativeThisObject();
        se::Value jsTarget = args[0];
        Scheduler_unscheduleUpdateCommon(cobj, jsTarget.toObject());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, expected: %s", argc, "1");
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_unscheduleUpdate)

static bool js_cocos2dx_Scheduler_schedule(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
#if 0//COCOS2D_DEBUG > 0
    SE_LOGD("--------------------------\nschedule target count: %d\n", (int)__js_target_schedulekey_map.size());
    for (const auto& e1 : __js_target_schedulekey_map)
    {
        SE_LOGD("schedule target: %p, functions: %d\n", e1.first, (int)e1.second.size());
    }
    SE_LOGD("-------------------------- \n");
#endif

    //
    if (argc >= 4)
    {
        Scheduler* cobj = (Scheduler*)s.nativeThisObject();

        se::Value jsFunc;
        se::Value jsThis;

        if (args[0].isObject() && args[0].toObject()->isFunction())
        {
            jsFunc = args[0];
            jsThis = args[1];
        }
        else
        {
            jsFunc = args[1];
            jsThis = args[0];
        }


        bool isBindedObject = jsThis.toObject()->getPrivateData() != nullptr;
//        SE_LOGD("%s, is binded object: %s\n", __FUNCTION__, isBindedObject ? "true" : "false");

        assert(jsThis.isObject());
        assert(!jsThis.toObject()->isFunction());

        bool ok = false;
        float interval = 0.0f;
        unsigned int repeat = CC_REPEAT_FOREVER;
        float delay = 0.0f;
        bool isPaused = false;

        ok = seval_to_float(args[2], &interval);
        SE_PRECONDITION2(ok, false, "Converting 'interval' argument failed");

        if (argc == 4)
        {
            // callback, target, interval, paused
            ok = seval_to_boolean(args[3], &isPaused);
            SE_PRECONDITION2(ok, false, "Converting 'isPaused' argument failed");
        }
        else if (argc >= 6)
        {
            // callback, target, interval, repeat, delay, paused
            // repeat
            ok = seval_to_uint32(args[3], &repeat);
            SE_PRECONDITION2(ok, false, "Converting 'interval' argument failed");

            // delay
            ok = seval_to_float(args[4], &delay);
            SE_PRECONDITION2(ok, false, "Converting 'delay' argument failed");

            // isPaused
            ok = seval_to_boolean(args[5], &isPaused);
            SE_PRECONDITION2(ok, false, "Converting 'isPaused' argument failed");
        }

        return Scheduler_scheduleCommon(cobj, jsThis, jsFunc, interval, repeat, delay, isPaused, !isBindedObject, "cc.Scheduler.schedule");
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, expected: %s", argc, ">=2");
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_schedule)


static bool js_cocos2dx_Scheduler_unschedule(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc >= 2)
    {
        se::Value jsFuncOrKey;
        se::Value jsTarget;
        if (args[0].isString() || (args[0].isObject() && args[0].toObject()->isFunction()))
        {
            jsFuncOrKey = args[0];
            jsTarget = args[1];
        }
        else
        {
            jsFuncOrKey = args[1];
            jsTarget = args[0];
        }
        Scheduler* cobj = (Scheduler*)s.nativeThisObject();
        return Scheduler_unscheduleCommon(cobj, jsTarget, jsFuncOrKey);
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, expected: %s", argc, ">=2");
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_unschedule)


static bool js_cocos2dx_Scheduler_unscheduleAllForTarget(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    Scheduler* cobj = (Scheduler*)s.nativeThisObject();
    if (argc == 1)
    {
        se::Value target = args[0];
        return Scheduler_unscheduleAllCallbacksCommon(cobj, target.toObject(), true);
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_unscheduleAllForTarget)

static bool js_cocos2dx_Scheduler_unscheduleAllCallbacks(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 0)
    {
        removeAllScheduleAndUpdate(true);

        Scheduler* cobj = (Scheduler*)s.nativeThisObject();
        cobj->unscheduleAll();
        CCLOG("After unschedule all callbacks");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_unscheduleAllCallbacks)

static bool js_cocos2dx_Scheduler_unscheduleAllCallbacksWithMinPriority(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 1)
    {
        int minPriority = 0;
        bool ok = false;
        ok = seval_to_int32(args[0], &minPriority);
        SE_PRECONDITION2(ok, false, "Converting minPriority failed!");

        removeAllSchedules(true);
        removeScheduleUpdatesForMinPriority(minPriority);

        Scheduler* cobj = (Scheduler*)s.nativeThisObject();
        cobj->unscheduleAllWithMinPriority(minPriority);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_unscheduleAllCallbacksWithMinPriority)

static bool js_cocos2dx_Scheduler_isScheduled(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 2)
    {
        Scheduler* thiz = (Scheduler*)s.nativeThisObject();
        se::Value jsFuncOrKey(args[0]);
        se::Value jsThis(args[1]);
        bool isScheduled = Scheduler_isScheduled(thiz, jsThis, jsFuncOrKey);
        s.rval().setBoolean(isScheduled);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_isScheduled)

static bool js_cocos2dx_Scheduler_pauseTarget(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 1)
    {
        Scheduler* cobj = (Scheduler*)s.nativeThisObject();

        se::Value targetIdVal;
        if (args[0].toObject()->getProperty(SCHEDULE_TARGET_ID_KEY, &targetIdVal) && targetIdVal.isNumber())
        {
            uint32_t targetId = targetIdVal.toUint32();
            if (isTargetExistInScheduler(targetId))
            {
                cobj->pauseTarget(reinterpret_cast<void*>(targetId));
            }
        }
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_pauseTarget)

static bool js_cocos2dx_Scheduler_resumeTarget(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 1)
    {
        Scheduler* cobj = (Scheduler*)s.nativeThisObject();
        se::Value targetIdVal;
        if (args[0].toObject()->getProperty(SCHEDULE_TARGET_ID_KEY, &targetIdVal) && targetIdVal.isNumber())
        {
            uint32_t targetId = targetIdVal.toUint32();
            if (isTargetExistInScheduler(targetId))
            {
                cobj->resumeTarget(reinterpret_cast<void*>(targetId));
            }
        }

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_resumeTarget)

static bool js_cocos2dx_Scheduler_isTargetPaused(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 1)
    {
        Scheduler* cobj = (Scheduler*)s.nativeThisObject();
        se::Value targetIdVal;
        if (args[0].toObject()->getProperty(SCHEDULE_TARGET_ID_KEY, &targetIdVal) && targetIdVal.isNumber())
        {
            uint32_t targetId = targetIdVal.toUint32();
            if (isTargetExistInScheduler(targetId))
            {
                bool isPaused = cobj->isTargetPaused(reinterpret_cast<void*>(targetId));
                s.rval().setBoolean(isPaused);
                return true;
            }
        }

        s.rval().setBoolean(false);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_isTargetPaused)

static void resumeAllSchedulesForTarget(Node* node, se::Object* jsThis)
{
    node->getScheduler()->resumeTarget(jsThis);
}

static void pauseAllSchedulesForTarget(Node* node, se::Object* jsThis)
{
    node->getScheduler()->pauseTarget(jsThis);
}

static void cleanupAllSchedulesForTarget(Node* node, se::Object* jsThis)
{
    //IDEA: ?? Do we need this since we have already had a 'UnscheduleNotifier' and 'UnscheduleUpdateWrapper'.
    node->getScheduler()->unscheduleAllForTarget(jsThis);
}

static bool onReceiveNodeEvent(void* node, ScriptingCore::NodeEventType type)
{
    auto iter = se::NativePtrToObjectMap::find(node);
    if (iter  == se::NativePtrToObjectMap::end())
        return false;

    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    se::Object* target = iter->second;
    const char* funcName = nullptr;
    bool ret = false;

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
    JSNative func = nullptr;
#endif
    if (type == ScriptingCore::NodeEventType::ENTER)
    {
        funcName = "onEnter";
#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
        func = _SE(Node_onEnter);
#endif
    }
    else if (type == ScriptingCore::NodeEventType::EXIT)
    {
        funcName = "onExit";
#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
        func = _SE(Node_onExit);
#endif
    }
    else if (type == ScriptingCore::NodeEventType::ENTER_TRANSITION_DID_FINISH)
    {
        funcName = "onEnterTransitionDidFinish";
#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
        func = _SE(Node_onEnterTransitionDidFinish);
#endif
    }
    else if (type == ScriptingCore::NodeEventType::EXIT_TRANSITION_DID_START)
    {
        funcName = "onExitTransitionDidStart";
#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
        func = _SE(Node_onExitTransitionDidStart);
#endif
    }
    else if (type == ScriptingCore::NodeEventType::CLEANUP)
    {
        funcName = "cleanup";
#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
        func = _SE(Node_cleanup);
#endif
    }
    else
    {
        assert(false);
    }

    se::Value funcVal;
    bool ok = target->getProperty(funcName, &funcVal);
#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
    bool isNativeFunc = funcVal.toObject()->_isNativeFunction(func);
#else
    bool isNativeFunc = funcVal.toObject()->_isNativeFunction();
#endif

    if (ok && !isNativeFunc)
    {
        ret = funcVal.toObject()->call(se::EmptyValueArray, target);
    }

    // Handle schedule stuff
    if (type == ScriptingCore::NodeEventType::ENTER)
    {
        resumeAllSchedulesForTarget((Node*)node, target);
    }
    else if (type == ScriptingCore::NodeEventType::EXIT)
    {
        pauseAllSchedulesForTarget((Node*)node, target);
    }
    else if (type == ScriptingCore::NodeEventType::CLEANUP)
    {
        cleanupAllSchedulesForTarget((Node*)node, target);
    }

    return ret;
}

bool jsb_register_Node_manual(se::Object* global)
{
#if STANDALONE_TEST
    se::Object* ccObj = nullptr;
    getOrCreatePlainObject_r("cc", global, &ccObj);
    auto cls = se::Class::create("Node", ccObj, nullptr, _SE(Node_constructor));
    cls->defineStaticFunction("create", _SE(Node_create));
    cls->defineProperty("x", _SE(Node_get_x), _SE(Node_set_x));
    cls->defineProperty("y", _SE(Node_get_y), _SE(Node_set_y));
    cls->defineFunction("ctor", _SE(Node_ctor));

    se::ScriptEngine::getInstance()->addAfterCleanupHook([](){
        SAFE_DEC_REF(ccObj);
    });
#else
    auto cls = __jsb_cocos2d_Node_proto;
#endif

    cls->defineFunction("onEnter", _SE(Node_onEnter));
    cls->defineFunction("onExit", _SE(Node_onExit));
    cls->defineFunction("onEnterTransitionDidFinish", _SE(Node_onEnterTransitionDidFinish));
    cls->defineFunction("onExitTransitionDidStart", _SE(Node_onExitTransitionDidStart));
    cls->defineFunction("cleanup", _SE(Node_cleanup));
    cls->defineFunction("schedule", _SE(Node_schedule));
    cls->defineFunction("scheduleOnce", _SE(Node_scheduleOnce));
    cls->defineFunction("scheduleUpdateWithPriority", _SE(Node_scheduleUpdateWithPriority));
    cls->defineFunction("scheduleUpdate", _SE(Node_scheduleUpdate));
    cls->defineFunction("unscheduleUpdate", _SE(Node_unscheduleUpdate));
    cls->defineFunction("unschedule", _SE(Node_unschedule));
    cls->defineFunction("unscheduleAllCallbacks", _SE(Node_unscheduleAllCallbacks));
    cls->defineFunction("isScheduled", _SE(Node_isScheduled));
    cls->defineFunction("setContentSize", _SE(Node_setContentSize));
    cls->defineFunction("setAnchorPoint", _SE(Node_setAnchorPoint));
    cls->defineFunction("setPosition", _SE(Node_setPosition));

    auto schedulerProto = __jsb_cocos2d_Scheduler_proto;
    schedulerProto->defineFunction("scheduleUpdateForTarget", _SE(js_cocos2dx_Scheduler_scheduleUpdateForTarget));
    schedulerProto->defineFunction("scheduleUpdate", _SE(js_cocos2dx_Scheduler_scheduleUpdateForTarget));
    schedulerProto->defineFunction("unscheduleUpdate", _SE(js_cocos2dx_Scheduler_unscheduleUpdate));
    schedulerProto->defineFunction("schedule", _SE(js_cocos2dx_Scheduler_schedule));
    schedulerProto->defineFunction("scheduleCallbackForTarget", _SE(js_cocos2dx_Scheduler_schedule));
    schedulerProto->defineFunction("unschedule", _SE(js_cocos2dx_Scheduler_unschedule));
    schedulerProto->defineFunction("unscheduleCallbackForTarget", _SE(js_cocos2dx_Scheduler_unschedule));
    schedulerProto->defineFunction("unscheduleAllForTarget", _SE(js_cocos2dx_Scheduler_unscheduleAllForTarget));
    schedulerProto->defineFunction("unscheduleAllCallbacks", _SE(js_cocos2dx_Scheduler_unscheduleAllCallbacks));
    schedulerProto->defineFunction("unscheduleAllCallbacksWithMinPriority", _SE(js_cocos2dx_Scheduler_unscheduleAllCallbacksWithMinPriority));
    schedulerProto->defineFunction("isScheduled", _SE(js_cocos2dx_Scheduler_isScheduled));
    schedulerProto->defineFunction("pauseTarget", _SE(js_cocos2dx_Scheduler_pauseTarget));
    schedulerProto->defineFunction("resumeTarget", _SE(js_cocos2dx_Scheduler_resumeTarget));
    schedulerProto->defineFunction("isTargetPaused", _SE(js_cocos2dx_Scheduler_isTargetPaused));

#if STANDALONE_TEST
    cls->defineFunction("addChild", _SE(Node_addChild));
    cls->defineFunction("getChildren", _SE(Node_getChildren));
    cls->defineFinalizeFunction(_SE(Node_finalized));

    cls->install();

    __jsb_Node_proto = cls->getProto();
    __jsb_Node_class = cls;

    __jsb_Node_proto->defineFunction("foo", _SE(Node_foo));
    __jsb_Node_proto->setProperty("var1", se::Value("I'm var1"));
    __jsb_Node_proto->setProperty("var2", se::Value(10000.323));
#endif

    ScriptingCore::getInstance()->setNodeEventListener(onReceiveNodeEvent);
    se::ScriptEngine::getInstance()->clearException();

    return true;
}
