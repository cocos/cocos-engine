#include "jsb_dragonbones_manual.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/manual/jsb_helper.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_dragonbones_auto.hpp"
#include "cocos/editor-support/dragonbones/cocos2dx/CCDragonBonesHeaders.h"

#include "cocos2d.h"

using namespace cocos2d;

static bool js_cocos2dx_dragonbones_Armature_getAnimation(se::State& s)
{
    if (s.args().size() == 0)
    {
        dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
        dragonBones::Animation& ret = cobj->getAnimation();
        bool ok = native_ptr_to_rooted_seval<dragonBones::Animation>(&ret, __jsb_dragonBones_Animation_class, &s.rval());
        SE_PRECONDITION2(ok, false, "Convert dragonBones::Animation to se::Value failed!");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getAnimation)

static bool js_cocos2dx_dragonbones_Armature_getArmatureData(se::State& s)
{
    if (s.args().size() == 0)
    {
        dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
        const dragonBones::ArmatureData& ret = cobj->getArmatureData();
        bool ok = native_ptr_to_rooted_seval<dragonBones::ArmatureData>((dragonBones::ArmatureData*)&ret, __jsb_dragonBones_ArmatureData_class, &s.rval());
        SE_PRECONDITION2(ok, false, "Convert dragonBones::ArmatureData to se::Value failed!");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getArmatureData)

static bool js_cocos2dx_dragonbones_Armature_getDisplay(se::State& s)
{
    if (s.args().size() == 0)
    {
        dragonBones::Armature* cobj = (dragonBones::Armature*)s.nativeThisObject();
        dragonBones::CCArmatureDisplay* ret = dynamic_cast<dragonBones::CCArmatureDisplay*>(cobj->getDisplay());
        if (ret != nullptr)
        {
            bool ok = native_ptr_to_seval<dragonBones::CCArmatureDisplay>(ret, __jsb_dragonBones_CCArmatureDisplay_class, &s.rval());
            SE_PRECONDITION2(ok, false, "Convert dragonBones::Animation to se::Value failed!");
        }
        else
        {
            s.rval().setNull();
        }
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Armature_getDisplay)

static bool js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation(se::State& s)
{
    if (s.args().size() == 0)
    {
        dragonBones::CCArmatureDisplay* cobj = (dragonBones::CCArmatureDisplay*)s.nativeThisObject();
        dragonBones::Animation& ret = cobj->getAnimation();
        bool ok = native_ptr_to_rooted_seval<dragonBones::Animation>(&ret, __jsb_dragonBones_Animation_class, &s.rval());
        SE_PRECONDITION2(ok, false, "Convert dragonBones::Animation to se::Value failed!");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation)

static bool js_cocos2dx_dragonbones_AnimationState_getAnimationData(se::State& s)
{
    if (s.args().size() == 0)
    {
        dragonBones::AnimationState* cobj = (dragonBones::AnimationState*)s.nativeThisObject();
        const dragonBones::AnimationData& ret = cobj->getAnimationData();
        bool ok = native_ptr_to_rooted_seval<dragonBones::AnimationData>((dragonBones::AnimationData*)&ret, __jsb_dragonBones_AnimationData_class, &s.rval());
        SE_PRECONDITION2(ok, false, "Convert dragonBones::AnimationData to se::Value failed!");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_AnimationState_getAnimationData)

static bool js_cocos2dx_dragonbones_ArmatureData_get_animations(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    se::HandleObject retObj(se::Object::createPlainObject());
    bool ok = false;
    se::Value tmp;
    for (const auto& e : cobj->animations)
    {
        if (!e.first.empty())
        {
            ok = native_ptr_to_rooted_seval<dragonBones::AnimationData>(e.second, __jsb_dragonBones_AnimationData_class, &tmp);
            SE_PRECONDITION2(ok, false, "Convert dragonBones::AnimationData to se::Value failed!");
            retObj->setProperty(e.first.c_str(), tmp);
        }
    }
    s.rval().setObject(retObj);
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_ArmatureData_get_animations)

static bool js_cocos2dx_dragonbones_ArmatureData_get_bones(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    se::HandleObject retObj(se::Object::createPlainObject());
    bool ok = false;
    se::Value tmp;
    for (const auto& e : cobj->bones)
    {
        if (!e.first.empty())
        {
            ok = native_ptr_to_rooted_seval<dragonBones::BoneData>(e.second, __jsb_dragonBones_BoneData_class, &tmp);
            SE_PRECONDITION2(ok, false, "Convert dragonBones::AnimationData to se::Value failed!");
            retObj->setProperty(e.first.c_str(), tmp);
        }
    }
    s.rval().setObject(retObj);
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_ArmatureData_get_bones)

static bool js_cocos2dx_dragonbones_ArmatureData_get_skins(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    se::HandleObject retObj(se::Object::createPlainObject());
    bool ok = false;
    se::Value tmp;
    for (const auto& e : cobj->skins)
    {
        if (!e.first.empty())
        {
            ok = native_ptr_to_rooted_seval<dragonBones::SkinData>(e.second, __jsb_dragonBones_SkinData_class, &tmp);
            SE_PRECONDITION2(ok, false, "Convert dragonBones::AnimationData to se::Value failed!");
            retObj->setProperty(e.first.c_str(), tmp);
        }
    }
    s.rval().setObject(retObj);
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_ArmatureData_get_skins)

static bool js_cocos2dx_dragonbones_ArmatureData_get_slots(se::State& s)
{
    dragonBones::ArmatureData* cobj = (dragonBones::ArmatureData*)s.nativeThisObject();
    se::HandleObject retObj(se::Object::createPlainObject());
    bool ok = false;
    se::Value tmp;
    for (const auto& e : cobj->slots)
    {
        if (!e.first.empty())
        {
            ok = native_ptr_to_rooted_seval<dragonBones::SlotData>(e.second, __jsb_dragonBones_SlotData_class, &tmp);
            SE_PRECONDITION2(ok, false, "Convert dragonBones::AnimationData to se::Value failed!");
            retObj->setProperty(e.first.c_str(), tmp);
        }
    }
    s.rval().setObject(retObj);
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_ArmatureData_get_slots)

static bool js_cocos2dx_dragonbones_DragonBonesData_get_armatureNames(se::State& s)
{
    dragonBones::DragonBonesData* cobj = (dragonBones::DragonBonesData*)s.nativeThisObject();

    const auto& ret = cobj->getArmatureNames();
    bool ok = std_vector_string_to_seval(ret, &s.rval());
    SE_PRECONDITION2(ok, false, "Convert ArmatureNames to se::Value failed!");
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_DragonBonesData_get_armatureNames)

static bool js_cocos2dx_dragonbones_WorldClock_add(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 1)
    {
        dragonBones::WorldClock* cobj = (dragonBones::WorldClock *)s.nativeThisObject();
        const se::Value& arg0Val = args[0];
        if (!arg0Val.isNull())
        {
            dragonBones::IAnimateble* arg0 = nullptr;
            bool ok = arg0Val.isObject();
            SE_PRECONDITION2(ok, false, "WorldClock_add argument isn't object");

            void* animateable = nullptr;
            ok = seval_to_native_ptr(arg0Val, &animateable);
            SE_PRECONDITION2(ok, false, "WorldClock_add argument get native ptr failed!");

            auto armatureObj = static_cast<dragonBones::Armature*>(animateable);
            arg0 = dynamic_cast<dragonBones::Armature*>(armatureObj);
            if (arg0 == nullptr)
            {
                auto clockObj = static_cast<dragonBones::WorldClock*>(animateable);
                arg0 = dynamic_cast<dragonBones::WorldClock*>(clockObj);
            }

            cobj->add(arg0);
        }

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_WorldClock_add)

static bool js_cocos2dx_dragonbones_WorldClock_remove(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 1)
    {
        dragonBones::WorldClock* cobj = (dragonBones::WorldClock *)s.nativeThisObject();
        const se::Value& arg0Val = args[0];
        if (!arg0Val.isNull())
        {
            dragonBones::IAnimateble* arg0 = nullptr;
            bool ok = arg0Val.isObject();
            SE_PRECONDITION2(ok, false, "WorldClock_remove argument isn't object");

            void* animateable = nullptr;
            ok = seval_to_native_ptr(arg0Val, &animateable);
            SE_PRECONDITION2(ok, false, "WorldClock_remove argument get native ptr failed!");

            auto armatureObj = static_cast<dragonBones::Armature*>(animateable);
            arg0 = dynamic_cast<dragonBones::Armature*>(armatureObj);
            if (arg0 == nullptr)
            {
                auto clockObj = static_cast<dragonBones::WorldClock*>(animateable);
                arg0 = dynamic_cast<dragonBones::WorldClock*>(clockObj);
            }

            cobj->remove(arg0);
        }

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_WorldClock_remove)

static bool js_cocos2dx_dragonbones_CCFactory_getFactory(se::State& s)
{
    if (s.args().size() == 0)
    {
        auto ret = dragonBones::CCFactory::getInstance();
        bool ok = native_ptr_to_rooted_seval<dragonBones::CCFactory>(ret, __jsb_dragonBones_CCFactory_class, &s.rval());
        SE_PRECONDITION2(ok, false, "Convert dragonBones::CCFactory to se::Value failed!");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_CCFactory_getFactory)

static bool js_cocos2dx_dragonbones_TransformObject_getGlobal(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)s.nativeThisObject();
    bool isReturnCached = false;
    bool ok = native_ptr_to_rooted_seval<dragonBones::Transform>(&cobj->global, __jsb_dragonBones_Transform_class, &s.rval(), &isReturnCached);
    SE_PRECONDITION2(ok, false, "Convert dragonBones::Transform to se::Value failed!");
    if (!isReturnCached)
    {
        s.thisObject()->attachObject(s.rval().toObject());
    }
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_TransformObject_getGlobal)

static bool js_cocos2dx_dragonbones_TransformObject_getOrigin(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)s.nativeThisObject();
    bool isReturnCached = false;
    bool ok = native_ptr_to_rooted_seval<dragonBones::Transform>(&cobj->origin, __jsb_dragonBones_Transform_class, &s.rval(), &isReturnCached);
    SE_PRECONDITION2(ok, false, "Convert dragonBones::Transform to se::Value failed!");
    if (!isReturnCached)
    {
        s.thisObject()->attachObject(s.rval().toObject());
    }
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_TransformObject_getOrigin)

static bool js_cocos2dx_dragonbones_TransformObject_getOffset(se::State& s)
{
    dragonBones::TransformObject* cobj = (dragonBones::TransformObject *)s.nativeThisObject();
    bool isReturnCached = false;
    bool ok = native_ptr_to_rooted_seval<dragonBones::Transform>(&cobj->offset, __jsb_dragonBones_Transform_class, &s.rval(), &isReturnCached);
    SE_PRECONDITION2(ok, false, "Convert dragonBones::Transform to se::Value failed!");
    if (!isReturnCached)
    {
        s.thisObject()->attachObject(s.rval().toObject());
    }
    return true;
}
SE_BIND_PROP_GET(js_cocos2dx_dragonbones_TransformObject_getOffset)

static bool js_cocos2dx_dragonbones_Slot_getRawDisplay(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot *)s.nativeThisObject();
    dragonBones::DBCCSprite* ret = static_cast<dragonBones::DBCCSprite*>(cobj->getRawDisplay());
    bool ok = native_ptr_to_seval<dragonBones::DBCCSprite>(ret, __jsb_dragonBones_DBCCSprite_class, &s.rval());
    SE_PRECONDITION2(ok, false, "Convert dragonBones::DBCCSprite to se::Value failed!");
    return true;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_getRawDisplay)

static bool js_cocos2dx_dragonbones_Slot_getDisplay(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot *)s.nativeThisObject();
    dragonBones::DBCCSprite* ret = static_cast<dragonBones::DBCCSprite*>(cobj->getDisplay());
    bool ok = native_ptr_to_seval<dragonBones::DBCCSprite>(ret, __jsb_dragonBones_DBCCSprite_class, &s.rval());
    SE_PRECONDITION2(ok, false, "Convert dragonBones::DBCCSprite to se::Value failed!");
    return true;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_getDisplay)

static bool js_cocos2dx_dragonbones_Slot_getMeshDisplay(se::State& s)
{
    dragonBones::Slot* cobj = (dragonBones::Slot *)s.nativeThisObject();
    dragonBones::DBCCSprite* ret = static_cast<dragonBones::DBCCSprite*>(cobj->getMeshDisplay());
    bool ok = native_ptr_to_seval<dragonBones::DBCCSprite>(ret, __jsb_dragonBones_DBCCSprite_class, &s.rval());
    SE_PRECONDITION2(ok, false, "Convert dragonBones::DBCCSprite to se::Value failed!");
    return true;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_getMeshDisplay)

static bool js_cocos2dx_dragonbones_Slot_setDisplay(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 2)
    {
        dragonBones::Slot* cobj = (dragonBones::Slot *)s.nativeThisObject();
        dragonBones::DBCCSprite* dbSprite = nullptr;
        bool ok = seval_to_native_ptr(args[0], &dbSprite);
        SE_PRECONDITION2(ok, false, "Convert se::Value to dragonBones::DBCCSprite failed!");
        dragonBones::DisplayType type;
        ok = seval_to_int32(args[1], (int32_t *)&type);
        SE_PRECONDITION2(ok, false, "Convert se::Value to dragonBones::DisplayType failed!");
        cobj->setDisplay(dbSprite, type);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_dragonbones_Slot_setDisplay)

bool register_all_dragonbones_manual(se::Object* obj)
{
    __jsb_dragonBones_Armature_proto->defineFunction("getAnimation", _SE(js_cocos2dx_dragonbones_Armature_getAnimation));
    __jsb_dragonBones_Armature_proto->defineFunction("getArmatureData", _SE(js_cocos2dx_dragonbones_Armature_getArmatureData));
    __jsb_dragonBones_Armature_proto->defineFunction("getDisplay", _SE(js_cocos2dx_dragonbones_Armature_getDisplay));

    __jsb_dragonBones_CCArmatureDisplay_proto->defineFunction("getAnimation", _SE(js_cocos2dx_dragonbones_CCArmatureDisplay_getAnimation));
    __jsb_dragonBones_AnimationState_proto->defineFunction("getAnimationData", _SE(js_cocos2dx_dragonbones_AnimationState_getAnimationData));

    __jsb_dragonBones_ArmatureData_proto->defineProperty("animations", _SE(js_cocos2dx_dragonbones_ArmatureData_get_animations), nullptr);
    __jsb_dragonBones_ArmatureData_proto->defineProperty("bones", _SE(js_cocos2dx_dragonbones_ArmatureData_get_bones), nullptr);
    __jsb_dragonBones_ArmatureData_proto->defineProperty("skins", _SE(js_cocos2dx_dragonbones_ArmatureData_get_skins), nullptr);
    __jsb_dragonBones_ArmatureData_proto->defineProperty("slots", _SE(js_cocos2dx_dragonbones_ArmatureData_get_slots), nullptr);

    __jsb_dragonBones_DragonBonesData_proto->defineProperty("armatureNames", _SE(js_cocos2dx_dragonbones_DragonBonesData_get_armatureNames), nullptr);

    se::Object* global = se::ScriptEngine::getInstance()->getGlobalObject();
    se::Value dragonBonesVal, worldClockVal;
    global->getProperty("dragonBones", &dragonBonesVal);
    dragonBonesVal.toObject()->getProperty("WorldClock", &worldClockVal);

    se::Object* globalClock = se::Object::createObjectWithClass(__jsb_dragonBones_WorldClock_class);
    globalClock->setPrivateData(&dragonBones::WorldClock::clock);
    worldClockVal.toObject()->setProperty("clock", se::Value(globalClock));

    __jsb_dragonBones_WorldClock_proto->defineFunction("add", _SE(js_cocos2dx_dragonbones_WorldClock_add));
    __jsb_dragonBones_WorldClock_proto->defineFunction("remove", _SE(js_cocos2dx_dragonbones_WorldClock_remove));

    se::Value factoryVal;
    dragonBonesVal.toObject()->getProperty("CCFactory", &factoryVal);
    factoryVal.toObject()->defineFunction("getFactory", _SE(js_cocos2dx_dragonbones_CCFactory_getFactory));

    __jsb_dragonBones_TransformObject_proto->defineProperty("global", _SE(js_cocos2dx_dragonbones_TransformObject_getGlobal), nullptr);
    __jsb_dragonBones_TransformObject_proto->defineProperty("origin", _SE(js_cocos2dx_dragonbones_TransformObject_getOrigin), nullptr);
    __jsb_dragonBones_TransformObject_proto->defineProperty("offset", _SE(js_cocos2dx_dragonbones_TransformObject_getOffset), nullptr);

    __jsb_dragonBones_Slot_proto->defineFunction("getRawDisplay", _SE(js_cocos2dx_dragonbones_Slot_getRawDisplay));
    __jsb_dragonBones_Slot_proto->defineFunction("getDisplay", _SE(js_cocos2dx_dragonbones_Slot_getDisplay));
    __jsb_dragonBones_Slot_proto->defineFunction("getMeshDisplay", _SE(js_cocos2dx_dragonbones_Slot_getMeshDisplay));
    __jsb_dragonBones_Slot_proto->defineFunction("setDisplay", _SE(js_cocos2dx_dragonbones_Slot_setDisplay));

    dragonBones::BaseObject::setObjectRecycleOrDestroyCallback([](dragonBones::BaseObject* obj, int type){

        std::string typeName = typeid(*obj).name();

        se::Object* seObj = nullptr;

        auto iter = se::NativePtrToObjectMap::find(obj);
        if (iter != se::NativePtrToObjectMap::end())
        {
            // Save se::Object pointer for being used in cleanup method.
            seObj = iter->second;
            // Unmap native and js object since native object was destroyed.
            // Otherwise, it may trigger 'assertion' in se::Object::setPrivateData later
            // since native obj is already released and the new native object may be assigned with
            // the same address.
            se::NativePtrToObjectMap::erase(iter);
        }
        else
        {
            // CCLOG("Didn't find %s, %p in map", typeName, obj);
            // assert(false);
            return;
        }

        std::string typeNameStr = typeName;
        auto cleanup = [seObj, typeNameStr](){

            auto se = se::ScriptEngine::getInstance();
            if (!se->isValid() || se->isInCleanup())
                return;

            se::AutoHandleScope hs;
            se->clearException();

            // The mapping of native object & se::Object was cleared in above code.
            // The private data (native object) may be a different object associated with other se::Object.
            // Therefore, don't clear the mapping again.
            seObj->clearPrivateData(false);
            seObj->unroot();
            seObj->decRef();
        };

        if (!se::ScriptEngine::getInstance()->isGarbageCollecting())
        {
            cleanup();
        }
        else
        {
            CleanupTask::pushTaskToAutoReleasePool(cleanup);
        }
    });

    se::ScriptEngine::getInstance()->addAfterCleanupHook([](){

        // Destroy CCFactory singlton.
        dragonBones::CCFactory::destroyInstance();

        // World clock is a static variable and needs to be cleared and reset.
        dragonBones::WorldClock::clock.clear();
        dragonBones::WorldClock::clock.time = 0.0f;
        dragonBones::WorldClock::clock.timeScale = 1.0f;

        // Copy the dragonbones object vector since vector element will be deleted in BaseObject destructor.
        std::vector<dragonBones::BaseObject*> allDragonBonesObjects = dragonBones::BaseObject::getAllObjects();
        SE_LOGD("Starting to cleanup dragonbones object, count: %d\n", (int)allDragonBonesObjects.size());
        // Clear dragonBones::Armature objects those are not in the pool because
        // dragonBones::Armature controls life cycle for lots of other objects,
        // so it needs to be disposed first.
        for (auto dbObj : allDragonBonesObjects)
        {
            if (dynamic_cast<dragonBones::Armature*>(dbObj) != nullptr && !dbObj->isInPool())
            {
//                SE_LOGD("1. Force delete not in pool DragonBones Armature object: %s, %p\n", typeid(*dbObj).name(), dbObj);
                delete dbObj;
            }
        }

        // After disposing dragonBones::Armature objects, there will be lots of other kinds of objects returned to pool.
        // Therefore, we clean object pool here.
        dragonBones::BaseObject::clearPool(0);

        // Copy the dragonbones object vector again.
        allDragonBonesObjects = dragonBones::BaseObject::getAllObjects();
        SE_LOGD("After first cleanup, dragonbones object remained count: %d\n", (int)allDragonBonesObjects.size());
        // Check again whether there are some objects still in pool since the releationship of dragonbones objects is really complex.
        for (auto dbObj : allDragonBonesObjects)
        {
            if (!dbObj->isInPool())
            {
//                SE_LOGD("2. Force delete not in pool DragonBones object: %s, %p\n", typeid(*dbObj).name(), dbObj);
                delete dbObj;
            }
        }

        // Clear pool again.
        dragonBones::BaseObject::clearPool(0);

        // Don't need to use copy operator since we only print leak object below.
        auto& refAllDragonBonesObjects = dragonBones::BaseObject::getAllObjects();
        SE_LOGD("After second cleanup, dragonbones object remained count: %d\n", (int)refAllDragonBonesObjects.size());

        // Print leak objects
        for (auto dbObj : refAllDragonBonesObjects)
        {
            SE_LOGD("Leak dragonbones object: %s, %p\n", typeid(*dbObj).name(), dbObj);
        }

        // If there're leak objects, clear vector should be done for restarting game.
        refAllDragonBonesObjects.clear();
    });

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
