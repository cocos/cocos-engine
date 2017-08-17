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
        printf("Node_finalized %p ...\n", thiz->getUserData());
        SAFE_RELEASE(thiz);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(Node_finalized)

static bool Node_constructor(se::State& s)
{
    printf("Node_constructor ...\n");
    Node* obj = new Node();
    s.thisObject()->setPrivateData(obj);
    return true;
}
SE_BIND_CTOR(Node_constructor, __jsb_Node_class, Node_finalized)

static bool Node_ctor(se::State& s)
{
    printf("Node_ctor ...\n");
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

static std::unordered_map<se::Object*, std::unordered_map<se::Object*, std::string>> __jsthis_schedulekey_map;
static std::unordered_map<se::Object*, int/*priority*/> __jsthis_schedule_update_map;

static bool isScheduleExist(se::Object* jsFunc, se::Object* jsThis, se::Object** outJsFunc, se::Object** outJsThis, std::string* outKey)
{
    bool found = false;
    for (const auto& e : __jsthis_schedulekey_map)
    {
        if (e.first->isSame(jsThis))
        {
            for (const auto& e2 : e.second)
            {
                if (e2.first->isSame(jsFunc))
                {
                    *outJsThis = e.first;
                    *outJsFunc = e2.first;
                    *outKey = e2.second;
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
        (*outKey).clear();
        (*outJsThis) = nullptr;
        (*outJsFunc) = nullptr;
    }

    return found;
}

static bool isScheduleExist(const std::string& key, se::Object* jsThis, se::Object** outJsFunc, se::Object** outJsThis)
{
    bool found = false;
    for (const auto& e : __jsthis_schedulekey_map)
    {
        if (e.first->isSame(jsThis))
        {
            for (const auto& e2 : e.second)
            {
                if (e2.second == key)
                {
                    *outJsThis = e.first;
                    *outJsFunc = e2.first;
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
        (*outJsThis) = nullptr;
        (*outJsFunc) = nullptr;
    }

    return found;
}

static void removeSchedule(se::Object* jsFunc, se::Object* jsThis, bool needDetachChild)
{
    auto funcObjKeyMapIter = __jsthis_schedulekey_map.find(jsThis);
    if (funcObjKeyMapIter != __jsthis_schedulekey_map.end())
    {
        if (needDetachChild)
            jsThis->detachChild(jsFunc);
        funcObjKeyMapIter->second.erase(jsFunc);
        if (funcObjKeyMapIter->second.empty())
            __jsthis_schedulekey_map.erase(funcObjKeyMapIter);

        jsFunc->release();
        jsThis->release();
    }
}

static void removeScheduleForThis(se::Object* jsThis, bool needDetachChild)
{
    auto funcObjKeyMapIter = __jsthis_schedulekey_map.find(jsThis);
    if (funcObjKeyMapIter != __jsthis_schedulekey_map.end())
    {
        auto& funcMap = funcObjKeyMapIter->second;

        for (auto& e : funcMap)
        {
            if (needDetachChild)
                jsThis->detachChild(e.first);

            e.first->release(); // Release jsFunc
            jsThis->release(); // Release jsThis
        }

        funcMap.clear();
        __jsthis_schedulekey_map.erase(funcObjKeyMapIter);
    }
}

static void removeScheduleForKey(const std::string& key, bool needDetachChild)
{
    se::Object* jsFunc = nullptr;
    se::Object* jsThis = nullptr;
    bool found = false;

    for (const auto& e : __jsthis_schedulekey_map)
    {
        for (const auto& e2 : e.second)
        {
            if (e2.second == key)
            {
                jsThis = e.first;
                jsFunc = e2.first;
                found = true;
                break;
            }
        }

        if (found)
            break;
    }

    if (found)
    {
        removeSchedule(jsFunc, jsThis, needDetachChild);
    }
}

static void removeAllSchedules(bool needDetachChild)
{
    CCLOG("Begin unschedule all callbacks");
    for (auto& e1 :__jsthis_schedulekey_map)
    {
        auto& funcMap = e1.second;

        CCLOG(">> Found funcMap: %d", (int)funcMap.size());
        for (auto& e : funcMap)
        {
            if (needDetachChild)
            {
                CCLOG("detachChild: owner: %p, target: %p", e1.first, e.first);
                e1.first->detachChild(e.first);
            }
            e1.first->release(); // Release jsThis
            e.first->release(); // Release jsFunc
        }
        funcMap.clear();
    }
    __jsthis_schedulekey_map.clear();
}

static void removeAllScheduleUpdates()
{
    for (auto& e2 : __jsthis_schedule_update_map)
    {
        e2.first->release();
    }
    __jsthis_schedule_update_map.clear();
}

static void removeAllScheduleAndUpdate(bool needDetachChild)
{
    removeAllSchedules(needDetachChild);
    removeAllScheduleUpdates();
}

static bool isScheduleUpdateExist(se::Object* jsThis, se::Object** foundJsThis)
{
    assert(foundJsThis != nullptr);
    for (const auto& e : __jsthis_schedule_update_map)
    {
        if (e.first->isSame(jsThis))
        {
            *foundJsThis = e.first;
            return true;
        }
    }
    *foundJsThis = nullptr;
    return false;
}

static void removeScheduleUpdate(se::Object* jsThis)
{
    auto iter =  __jsthis_schedule_update_map.find(jsThis);
    if (iter != __jsthis_schedule_update_map.end())
    {
        __jsthis_schedule_update_map.erase(iter);
        jsThis->release();
    }
}

static void removeScheduleUpdatesForMinPriority(int minPriority)
{
    int foundPriority = 0;
    auto iter = __jsthis_schedule_update_map.begin();
    while (iter != __jsthis_schedule_update_map.end())
    {
        foundPriority = iter->second;
        if (foundPriority >= minPriority)
        {
            iter->first->release();
            iter = __jsthis_schedule_update_map.erase(iter);
        }
        else
        {
            ++iter;
        }
    }
}

static void insertScheduleUpdate(se::Object* jsThis, int priority)
{
    __jsthis_schedule_update_map[jsThis] = priority;
    jsThis->addRef();
}

static void insertSchedule(se::Object* jsFunc, se::Object* jsThis, const std::string& key)
{
    auto& funcKeyMap = __jsthis_schedulekey_map[jsThis];
    funcKeyMap.emplace(jsFunc, key);
    jsFunc->addRef();
    jsThis->addRef();
}

static bool isTargetExistInScheduler(se::Object* target, se::Object** foundTarget)
{
    assert(target != nullptr);
    assert(foundTarget != nullptr);

    // Iterating the schedule func map
    for (const auto& e : __jsthis_schedulekey_map)
    {
        if (e.first->isSame(target))
        {
            *foundTarget = e.first;
            return true;
        }
    }

    // Iterating the schedule update map
    for (const auto& e : __jsthis_schedule_update_map)
    {
        if (e.first->isSame(target))
        {
            *foundTarget = e.first;
            return true;
        }
    }

    *foundTarget = nullptr;
    return false;
}

class UnscheduleNotifier
{
public:
    UnscheduleNotifier(void* target, const std::string& key)
    : _target(target)
    , _key(key)
    {
    }
    ~UnscheduleNotifier()
    {
        LOGD("~UnscheduleNotifier, target: %p, key: %s\n", _target, _key.c_str());

        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        removeScheduleForKey(_key, false);
    }

private:
    void* _target;
    std::string _key;
};

static uint32_t __idx = 0;

static bool Scheduler_scheduleCommon(Scheduler* scheduler, const se::Value& jsThis, const se::Value& jsFunc, float interval, unsigned int repeat, float delay, bool isPaused, const std::string& aKey, bool toRootTarget, const std::string& callFromDebug)
{
    assert(jsThis.isObject());
    assert(jsFunc.isObject());
    assert(jsFunc.toObject()->isFunction());
    jsThis.toObject()->attachChild(jsFunc.toObject());

    se::Object* foundThisObj = nullptr;
    se::Object* foundFuncObj = nullptr;
    std::string key;

    bool found = false;
    if (!aKey.empty())
    {
        key = aKey;
        found = isScheduleExist(key, jsThis.toObject(), &foundFuncObj, &foundThisObj);
    }
    else
    {
        found = isScheduleExist(jsFunc.toObject(), jsThis.toObject(), &foundFuncObj, &foundThisObj, &key);
    }

    if (found && !key.empty())
    {
        removeSchedule(foundFuncObj, foundThisObj, true);
        scheduler->unschedule(key, foundThisObj);
    }

    if (!aKey.empty())
        key = aKey;
    else
        key = StringUtils::format("__node_schedule_key:%u", __idx++);

    se::Object* target = jsThis.toObject();
    insertSchedule(jsFunc.toObject(), target, key);
    std::shared_ptr<UnscheduleNotifier> unscheduleNotifier = std::make_shared<UnscheduleNotifier>(target, key);

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
        
    }, target, interval, repeat, delay, isPaused, key);

    return true;
}

static bool Node_schedule(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

#if COCOS2D_DEBUG > 0
    printf("--------------------------\nschedule target count: %d\n", (int)__jsthis_schedulekey_map.size());
    int totalCount = 0;
    for (const auto& e1 : __jsthis_schedulekey_map)
    {
        printf("schedule target: %p, functions: %d\n", e1.first, (int)e1.second.size());
        totalCount += (int)e1.second.size();
    }
    printf("total: %d-------------------------- \n", totalCount);
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
        std::string key;

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

        if (argc >= 5 && !args[4].isNullOrUndefined())
        {
            if (args[4].isString() || args[4].isNumber())
            {
                key = args[4].toStringForce();
                ok = true;
            }
            else
            {
                ok = false;
            }
            SE_PRECONDITION2(ok, false, "Converting 'key' argument failed");
        }

        return Scheduler_scheduleCommon(thiz->getScheduler(), jsThis, jsFunc, interval, repeat, delay, !thiz->isRunning(), key, false, "cc.Node.schedule");
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, expected: %s", argc, ">=1");
    return false;
}
SE_BIND_FUNC(Node_schedule)

static bool Node_scheduleOnce(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
#if COCOS2D_DEBUG > 0
    printf("--------------------------\nschedule target count: %d\n", (int)__jsthis_schedulekey_map.size());
    for (const auto& e1 : __jsthis_schedulekey_map)
    {
        printf("schedule target: %p, functions: %d\n", e1.first, (int)e1.second.size());
    }
    printf("-------------------------- \n");
#endif

    Node* thiz = (Node*)s.nativeThisObject();
    se::Value jsThis(s.thisObject());
    se::Value jsFunc(args[0]);

    float delay = 0.0f;
    std::string key;
    bool ok = false;

    if (argc >= 2)
    {
        ok = seval_to_float(args[1], &delay);
        SE_PRECONDITION2(ok, false, "Converting 'delay' argument failed");
    }

    if (argc >= 3 && !args[2].isNullOrUndefined())
    {
        if (args[2].isString() || args[2].isNumber())
        {
            key = args[2].toStringForce();
            ok = true;
        }
        else
        {
            ok = false;
        }
        SE_PRECONDITION2(ok, false, "Converting 'key' argument failed");
    }

    return Scheduler_scheduleCommon(thiz->getScheduler(), jsThis, jsFunc, 0.0f, 0, delay, !thiz->isRunning(), key, false, "cc.Node.scheduleOnce");
}
SE_BIND_FUNC(Node_scheduleOnce)

class UnscheduleUpdateNotifier
{
public:
    UnscheduleUpdateNotifier(se::Object* target)
    : _target(target) //FIXME: need retain?
    {
    }

    ~UnscheduleUpdateNotifier()
    {
        printf("~ScheduleUpdateWrapper: %p\n", _target);
        removeScheduleUpdate(_target);
    }

private:
    se::Object* _target; // weak ref
};

static bool Scheduler_unscheduleUpdateCommon(Scheduler* scheduler, se::Object* jsThis)
{
    se::Object* foundJsThis = nullptr;
    bool found = isScheduleUpdateExist(jsThis, &foundJsThis);
    if (found && foundJsThis != nullptr)
    {
        removeScheduleUpdate(foundJsThis);
        scheduler->unscheduleUpdate(foundJsThis);
    }

    return true;
}

static bool Scheduler_scheduleUpdateCommon(Scheduler* scheduler, const se::Value& jsThis, int priority, bool isPaused)
{
    se::Object* jsThisObj = jsThis.toObject();
    Scheduler_unscheduleUpdateCommon(scheduler, jsThisObj);

    insertScheduleUpdate(jsThisObj, priority);
    std::shared_ptr<UnscheduleUpdateNotifier> scheduleUpdateWrapper = std::make_shared<UnscheduleUpdateNotifier>(jsThisObj);

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

    }, jsThisObj, priority, isPaused);

    return true;
}

static bool Node_scheduleUpdate(se::State& s)
{
#if COCOS2D_DEBUG > 0
    printf("--------------------------\nscheduleUpdate target count: %d\n", (int)__jsthis_schedule_update_map.size());
    for (const auto& e1 : __jsthis_schedule_update_map)
    {
        printf("target: %p, updated: %d\n", e1.first, (int)e1.second);
    }
    printf("-------------------------- \n");
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
#if COCOS2D_DEBUG
    printf("--------------------------\nscheduleUpdate target count: %d\n", (int)__jsthis_schedule_update_map.size());
    for (const auto& e1 : __jsthis_schedule_update_map)
    {
        printf("target: %p, updated: %d\n", e1.first, (int)e1.second);
    }
    printf("-------------------------- \n");
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
        return Scheduler_unscheduleUpdateCommon(node->getScheduler(), s.thisObject());
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(Node_unscheduleUpdate)

static bool Scheduler_unscheduleCommon(Scheduler* scheduler, const se::Value& jsThis, const se::Value& jsFuncOrKey)
{
    se::Object* foundThisObj = nullptr;
    se::Object* foundFuncObj = nullptr;
    std::string key;

    bool found = false;

    if (jsFuncOrKey.isString() || jsFuncOrKey.isNumber())
    {
        key = jsFuncOrKey.toStringForce();
        found = isScheduleExist(key, jsThis.toObject(), &foundFuncObj, &foundThisObj);
    }
    else if (jsFuncOrKey.isObject())
    {
        found = isScheduleExist(jsFuncOrKey.toObject(), jsThis.toObject(), &foundFuncObj, &foundThisObj, &key);
    }
    else
    {
        assert(false);
    }

    if (found && !key.empty())
    {
        removeSchedule(foundFuncObj, foundThisObj, true);
        scheduler->unschedule(key, foundThisObj);
    }
    else
    {
        LOGD("WARNING: %s not found\n", __FUNCTION__);
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
    se::Object* foundTarget = nullptr;
    if (isTargetExistInScheduler(jsThis.toObject(), &foundTarget) && foundTarget != nullptr)
    {
        if (jsFuncOrKey.isString() || jsFuncOrKey.isNumber())
        {
            return scheduler->isScheduled(jsFuncOrKey.toStringForce(), foundTarget);
        }
        else if (jsFuncOrKey.isObject())
        {
            se::Object* foundJsFunc = nullptr;
            std::string key;
            if (isScheduleExist(jsFuncOrKey.toObject(), jsThis.toObject(), &foundJsFunc, &foundTarget, &key) && foundTarget != nullptr && foundJsFunc != nullptr && !key.empty())
            {
                return scheduler->isScheduled(key, foundTarget);
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
    se::Object* foundTarget = nullptr;
    if (isTargetExistInScheduler(jsThis, &foundTarget) && foundTarget != nullptr)
    {
        removeScheduleForThis(foundTarget, needDetachChild);
        removeScheduleUpdate(foundTarget);
        scheduler->unscheduleAllForTarget(foundTarget);
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
    printf("cc.Node set_x (%f) native obj: %p\n", x, thiz);
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
    printf("cc.Node set_y (%f) native obj: %p\n", y, thiz);
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
        cobj->setPosition(cocos2d::Vec2(x, y));
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
#if COCOS2D_DEBUG > 0
    printf("--------------------------\nschedule target count: %d\n", (int)__jsthis_schedulekey_map.size());
    for (const auto& e1 : __jsthis_schedulekey_map)
    {
        printf("schedule target: %p, functions: %d\n", e1.first, (int)e1.second.size());
    }
    printf("-------------------------- \n");
#endif

    if (argc >= 2)
    {
        Scheduler* cobj = (Scheduler*)s.nativeThisObject();
        se::Value jsFunc(args[0]);
        se::Value jsThis(args[1]);

        bool isBindedObject = jsThis.toObject()->getPrivateData() != nullptr;
//        printf("%s, is binded object: %s\n", __FUNCTION__, isBindedObject ? "true" : "false");

        assert(jsThis.isObject());
        assert(!jsThis.toObject()->isFunction());

        bool ok = false;
        float interval = 0.0f;
        unsigned int repeat = CC_REPEAT_FOREVER;
        float delay = 0.0f;
        bool isPaused = false;
        std::string key;

        if (argc >= 3)
        {
            ok = seval_to_float(args[2], &interval);
            SE_PRECONDITION2(ok, false, "Converting 'interval' argument failed");
        }

        if (argc >= 4)
        {
            ok = seval_to_uint32(args[3], &repeat);
            SE_PRECONDITION2(ok, false, "Converting 'interval' argument failed");
        }

        if (argc >= 5)
        {
            ok = seval_to_float(args[4], &delay);
            SE_PRECONDITION2(ok, false, "Converting 'delay' argument failed");
        }

        if (argc >= 6)
        {
            ok = seval_to_boolean(args[5], &isPaused);
            SE_PRECONDITION2(ok, false, "Converting 'isPaused' argument failed");
        }

        if (argc >= 7 && !args[6].isNullOrUndefined())
        {
            if (args[6].isString() || args[6].isNumber())
            {
                key = args[6].toStringForce();
                ok = true;
            }
            else
            {
                ok = false;
            }
            SE_PRECONDITION2(ok, false, "Converting 'key' argument failed");
        }

        return Scheduler_scheduleCommon(cobj, jsThis, jsFunc, interval, repeat, delay, isPaused, key, !isBindedObject, "cc.Scheduler.schedule");
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
        se::Value jsFuncOrKey = args[0];
        se::Value jsTarget = args[1];
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
        se::Object* foundTarget = nullptr;
        if (isTargetExistInScheduler(args[0].toObject(), &foundTarget) && foundTarget != nullptr)
        {
            cobj->pauseTarget(foundTarget);
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
        se::Object* foundTarget = nullptr;
        if (isTargetExistInScheduler(args[0].toObject(), &foundTarget) && foundTarget != nullptr)
        {
            cobj->resumeTarget(foundTarget);
        }
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Scheduler_resumeTarget)

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
    //FIXME: ?? Do we need this since we have already had a 'UnscheduleNotifier' and 'UnscheduleUpdateWrapper'.
    node->getScheduler()->unscheduleAllForTarget(jsThis);
}

static bool onReceiveNodeEvent(void* node, se::ScriptEngine::NodeEventType type)
{
    auto iter = se::__nativePtrToObjectMap.find(node);
    if (iter  == se::__nativePtrToObjectMap.end())
        return false;

    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    se::Object* target = iter->second;
    const char* funcName = nullptr;
    bool ret = false;

#ifdef SCRIPT_ENGINE_SM
    JSNative func = nullptr;
#endif
    if (type == se::ScriptEngine::NodeEventType::ENTER)
    {
        funcName = "onEnter";
#ifdef SCRIPT_ENGINE_SM
        func = _SE(Node_onEnter);
#endif
    }
    else if (type == se::ScriptEngine::NodeEventType::EXIT)
    {
        funcName = "onExit";
#ifdef SCRIPT_ENGINE_SM
        func = _SE(Node_onExit);
#endif
    }
    else if (type == se::ScriptEngine::NodeEventType::ENTER_TRANSITION_DID_FINISH)
    {
        funcName = "onEnterTransitionDidFinish";
#ifdef SCRIPT_ENGINE_SM
        func = _SE(Node_onEnterTransitionDidFinish);
#endif
    }
    else if (type == se::ScriptEngine::NodeEventType::EXIT_TRANSITION_DID_START)
    {
        funcName = "onExitTransitionDidStart";
#ifdef SCRIPT_ENGINE_SM
        func = _SE(Node_onExitTransitionDidStart);
#endif
    }
    else if (type == se::ScriptEngine::NodeEventType::CLEANUP)
    {
        funcName = "cleanup";
#ifdef SCRIPT_ENGINE_SM
        func = _SE(Node_cleanup);
#endif
    }
    else
    {
        assert(false);
    }

    se::Value funcVal;
    bool ok = target->getProperty(funcName, &funcVal);
#ifdef SCRIPT_ENGINE_SM
    bool isNativeFunc = funcVal.toObject()->_isNativeFunction(func);
#else
    bool isNativeFunc = funcVal.toObject()->_isNativeFunction();
#endif

    if (ok && !isNativeFunc)
    {
        ret = funcVal.toObject()->call(se::EmptyValueArray, target);
    }

    // Handle schedule stuff
    if (type == se::ScriptEngine::NodeEventType::ENTER)
    {
        resumeAllSchedulesForTarget((Node*)node, target);
    }
    else if (type == se::ScriptEngine::NodeEventType::EXIT)
    {
        pauseAllSchedulesForTarget((Node*)node, target);
    }
    else if (type == se::ScriptEngine::NodeEventType::CLEANUP)
    {
        cleanupAllSchedulesForTarget((Node*)node, target);
    }

    return ret;
}

bool jsb_register_Node_manual(se::Object* global)
{
#if STANDALONE_TEST
    auto cls = se::Class::create("Node", __ccObj, nullptr, _SE(Node_constructor));
    cls->defineStaticFunction("create", _SE(Node_create));
    cls->defineProperty("x", _SE(Node_get_x), _SE(Node_set_x));
    cls->defineProperty("y", _SE(Node_get_y), _SE(Node_set_y));
    cls->defineFunction("ctor", _SE(Node_ctor));
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

    se::ScriptEngine::getInstance()->_setNodeEventListener(onReceiveNodeEvent);
    se::ScriptEngine::getInstance()->clearException();

    return true;
}
