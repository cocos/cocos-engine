//
// Created by James Chen on 4/28/17.
//

#include "jsb_global.h"
#include "jsb_conversions.hpp"

using namespace cocos2d;

se::Object* __jscObj = nullptr;
se::Object* __ccObj = nullptr;
se::Object* __jsbObj = nullptr;

namespace {

    static bool require(se::State& s)
    {
        const auto& args = s.args();
        int argc = (int)args.size();
        assert(argc >= 1);
        assert(args[0].isString());

        Data data = FileUtils::getInstance()->getDataFromFile(args[0].toString());
        if (data.isNull())
            return false;

        return se::ScriptEngine::getInstance()->executeScriptBuffer((const char*)data.getBytes(), (size_t)data.getSize(), &s.rval(), args[0].toString().c_str());
    }
    SE_BIND_FUNC(require)

    static bool ccpAdd(se::State& s)
    {
        if (s.args().size() == 2)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt1, pt2;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt1);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            ok = seval_to_Vec2(args[1], &pt2);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            Vec2 result = pt1 + pt2;
            ok = Vec2_to_seval(result, &s.rval());
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 2);
        return false;
    }
    SE_BIND_FUNC(ccpAdd)

    static bool ccpDistanceSQ(se::State& s)
    {
        if (s.args().size()== 2)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt1, pt2;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt1);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            ok = seval_to_Vec2(args[1], &pt2);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            float result = pt1.getDistanceSq(pt2);
            s.rval().setFloat(result);
            return true;
        }
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 2);
        return false;
    }
    SE_BIND_FUNC(ccpDistanceSQ)

    static bool ccpDistance(se::State& s)
    {
        if (s.args().size()== 2)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt1, pt2;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt1);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            ok = seval_to_Vec2(args[1], &pt2);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            float result = pt1.getDistance(pt2);
            s.rval().setFloat(result);
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 2);
        return false;
    }
    SE_BIND_FUNC(ccpDistance)

    static bool ccpSub(se::State& s)
    {
        if (s.args().size()== 2)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt1, pt2;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt1);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            ok = seval_to_Vec2(args[1], &pt2);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            Vec2 result = pt1 - pt2;
            ok = Vec2_to_seval(result, &s.rval());
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 2);
        return false;
    }
    SE_BIND_FUNC(ccpSub)

    static bool ccpNeg(se::State& s)
    {
        if (s.args().size()== 1)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            pt = -pt;
            ok = Vec2_to_seval(pt, &s.rval());
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 1);
        return false;
    }
    SE_BIND_FUNC(ccpNeg)

    static bool ccpMult(se::State& s)
    {
        if (s.args().size()== 2)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            SE_ASSERT(args[1].isNumber(), "Error processing arguments");
            Vec2 result = pt * args[1].toFloat();
            ok = Vec2_to_seval(result, &s.rval());
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 2);
        return false;
    }
    SE_BIND_FUNC(ccpMult)

    static bool ccpMidpoint(se::State& s)
    {
        if (s.args().size()== 2)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt1, pt2;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt1);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            ok = seval_to_Vec2(args[1], &pt2);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            Vec2 result = pt1.getMidpoint(pt2);
            ok = Vec2_to_seval(result, &s.rval());
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 2);
        return false;
    }
    SE_BIND_FUNC(ccpMidpoint)

    static bool ccpDot(se::State& s)
    {
        if (s.args().size()== 2)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt1, pt2;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt1);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            ok = seval_to_Vec2(args[1], &pt2);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            float result = pt1.dot(pt2);
            s.rval().setFloat(result);
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 2);
        return false;
    }
    SE_BIND_FUNC(ccpDot)

    static bool ccpCross(se::State& s)
    {
        if (s.args().size()== 2)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt1, pt2;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt1);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            ok = seval_to_Vec2(args[1], &pt2);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            float result = pt1.cross(pt2);
            s.rval().setFloat(result);
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 2);
        return false;
    }
    SE_BIND_FUNC(ccpCross)

    static bool ccpPerp(se::State& s)
    {
        if (s.args().size()== 1)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            Vec2 result = pt.getPerp();
            ok = Vec2_to_seval(result, &s.rval());
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 1);
        return false;
    }
    SE_BIND_FUNC(ccpPerp)

    static bool ccpRPerp(se::State& s)
    {
        if (s.args().size()== 1)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            Vec2 result = pt.getRPerp();
            ok = Vec2_to_seval(result, &s.rval());
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 1);
        return false;
    }
    SE_BIND_FUNC(ccpRPerp)

    static bool ccpProject(se::State& s)
    {
        if (s.args().size()== 2)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt1, pt2;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt1);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            ok = seval_to_Vec2(args[1], &pt2);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            Vec2 result = pt1.project(pt2);
            ok = Vec2_to_seval(result, &s.rval());
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 2);
        return false;
    }
    SE_BIND_FUNC(ccpProject)

    static bool ccpRotate(se::State& s)
    {
        if (s.args().size()== 2)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt1, pt2;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt1);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            ok = seval_to_Vec2(args[1], &pt2);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            Vec2 result = pt1.rotate(pt2);
            ok = Vec2_to_seval(result, &s.rval());
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 2);
        return false;
    }
    SE_BIND_FUNC(ccpRotate)

    static bool ccpNormalize(se::State& s)
    {
        if (s.args().size()== 1)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            pt.normalize();
            ok = Vec2_to_seval(pt, &s.rval());
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 1);
        return false;
    }
    SE_BIND_FUNC(ccpNormalize)

    static bool ccpClamp(se::State& s)
    {
        if (s.args().size()== 3)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt1, pt2, pt3;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt1);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            ok = seval_to_Vec2(args[1], &pt2);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            ok = seval_to_Vec2(args[1], &pt3);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            Vec2 result = pt1.getClampPoint(pt2, pt3);
            ok = Vec2_to_seval(result, &s.rval());
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 3);
        return false;
    }
    SE_BIND_FUNC(ccpClamp)

    static bool ccpLengthSQ(se::State& s)
    {
        if (s.args().size()== 1)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            float result = pt.getLengthSq();
            s.rval().setFloat(result);
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 1);
        return false;
    }
    SE_BIND_FUNC(ccpLengthSQ)

    static bool ccpLength(se::State& s)
    {
        if (s.args().size()== 1)
        {
            const se::ValueArray& args = s.args();
            Vec2 pt;
            bool ok = false;
            ok = seval_to_Vec2(args[0], &pt);
            JSB_PRECONDITION2(ok, false, "Error processing arguments");
            float result = pt.getLength();
            s.rval().setFloat(result);
            return true;
        }
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 1);
        return false;
    }
    SE_BIND_FUNC(ccpLength)

    static bool ccassert(se::State& s)
    {
        const se::ValueArray& args = s.args();
        size_t argc = args.size();
        if (argc >= 1)
        {
            if (argc == 1)
            {
                SE_ASSERT(args[0].toBoolean(), "NO MESSAGE");
            }
            else
            {
                SE_ASSERT(args[0].toBoolean(), "%s", args[1].toString().c_str());
            }
            return true;
        }

        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)s.args().size(), 1);
        return false;
    }
    SE_BIND_FUNC(ccassert)

    bool jsb_register_var_under_cc()
    {
        // Vec2 Math
        __ccObj->defineFunction("pAdd", _SE(ccpAdd));
        __ccObj->defineFunction("pDistanceSQ", _SE(ccpDistanceSQ));
        __ccObj->defineFunction("pDistance", _SE(ccpDistance));
        __ccObj->defineFunction("pSub", _SE(ccpSub));
        __ccObj->defineFunction("pNeg", _SE(ccpNeg));
        __ccObj->defineFunction("pMult", _SE(ccpMult));
        __ccObj->defineFunction("pMidpoint", _SE(ccpMidpoint));
        __ccObj->defineFunction("pDot", _SE(ccpDot));
        __ccObj->defineFunction("pCross", _SE(ccpCross));
        __ccObj->defineFunction("pPerp", _SE(ccpPerp));
        __ccObj->defineFunction("pRPerp", _SE(ccpRPerp));
        __ccObj->defineFunction("pProject", _SE(ccpProject));
        __ccObj->defineFunction("pRotate", _SE(ccpRotate));
        __ccObj->defineFunction("pNormalize", _SE(ccpNormalize));
        __ccObj->defineFunction("pClamp", _SE(ccpClamp));
        __ccObj->defineFunction("pLengthSQ", _SE(ccpLengthSQ));
        __ccObj->defineFunction("pLength", _SE(ccpLength));

        //
        __ccObj->defineFunction("assert", _SE(ccassert));

        return true;
    }
}

static bool jsc_garbageCollect(se::State& s)
{
    se::ScriptEngine::getInstance()->gc();
    return true;
}
SE_BIND_FUNC(jsc_garbageCollect)

static bool jsc_dumpNativePtrToSeObjectMap(se::State& s)
{
    cocos2d::log(">>> total: %d, Dump (native -> jsobj) map begin", (int)se::__nativePtrToObjectMap.size());

    struct NamePtrStruct
    {
        const char* name;
        void* ptr;
    };

    std::vector<NamePtrStruct> namePtrArray;

    for (const auto& e : se::__nativePtrToObjectMap)
    {
        se::Object* jsobj = e.second;
        assert(jsobj->_getClass() != nullptr);
        NamePtrStruct tmp;
        tmp.name = jsobj->_getClass()->getName();
        tmp.ptr = e.first;
        namePtrArray.push_back(tmp);
    }

    std::sort(namePtrArray.begin(), namePtrArray.end(), [](const NamePtrStruct& a, const NamePtrStruct& b) -> bool {
        std::string left = a.name;
        std::string right = b.name;
        for( std::string::const_iterator lit = left.begin(), rit = right.begin(); lit != left.end() && rit != right.end(); ++lit, ++rit )
            if( ::tolower( *lit ) < ::tolower( *rit ) )
                return true;
            else if( ::tolower( *lit ) > ::tolower( *rit ) )
                return false;
        if( left.size() < right.size() )
            return true;
        return false;
    });

    for (const auto& e : namePtrArray)
    {
        cocos2d::log("%s: %p", e.name, e.ptr);
    }
    cocos2d::log(">>> total: %d, Dump (native -> jsobj) map end", (int)se::__nativePtrToObjectMap.size());
    return true;
}
SE_BIND_FUNC(jsc_dumpNativePtrToSeObjectMap)

static bool jsc_dumpRoot(se::State& s)
{
    assert(false);
    return true;
}
SE_BIND_FUNC(jsc_dumpRoot)

static bool JSBCore_platform(se::State& s)
{
    if (s.args().size() != 0)
    {
        SE_REPORT_ERROR("Invalid number of arguments in __getPlatform");
        return false;
    }

    Application::Platform platform;

    // config.deviceType: Device Type
    // 'mobile' for any kind of mobile devices, 'desktop' for PCs, 'browser' for Web Browsers
    // #if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32) || (CC_TARGET_PLATFORM == CC_PLATFORM_LINUX) || (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    //     platform = JS_InternString(_cx, "desktop");
    // #else
    platform = Application::Platform::OS_IPHONE; // FIXME:
//    platform = Application::getInstance()->getTargetPlatform();
    // #endif

    s.rval().setInt32((int32_t)platform);
    return true;
}
SE_BIND_FUNC(JSBCore_platform)

static bool JSBCore_version(se::State& s)
{
    if (s.args().size() != 0)
    {
        SE_REPORT_ERROR("Invalid number of arguments in __getVersion");
        return false;
    }

    char version[256];
    snprintf(version, sizeof(version)-1, "%s", cocos2dVersion());

    s.rval().setString(version);
    return true;
}
SE_BIND_FUNC(JSBCore_version)

static bool JSBCore_os(se::State& s)
{
    if (s.args().size() != 0)
    {
        SE_REPORT_ERROR("Invalid number of arguments in __getOS");
        return false;
    }

    se::Value os;

    // osx, ios, android, windows, linux, etc..
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    os.setString("iOS");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    os.setString("Android");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
    os.setString("Windows");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_MARMALADE)
    os.setString("Marmalade");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_LINUX)
    os.setString("Linux");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_BADA)
    os.setString("Bada");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_BLACKBERRY)
    os.setString("Blackberry");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    os.setString("OS X");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
    os.setString("WINRT");
#else
    os.setString("Unknown");
#endif

    s.rval() = os;
    return true;
}
SE_BIND_FUNC(JSBCore_os)

static bool JSB_cleanScript(se::State& s)
{
    assert(false);
    return true;
}
SE_BIND_FUNC(JSB_cleanScript)

static bool JSB_core_restartVM(se::State& s)
{
    Director::getInstance()->restart();
    return true;
}
SE_BIND_FUNC(JSB_core_restartVM)

static bool JSB_closeWindow(se::State& s)
{
//    assert(false);//FIXME: cjh
    se::ScriptEngine::getInstance()->gc();
    return true;
}
SE_BIND_FUNC(JSB_closeWindow)

static bool JSB_isObjectValid(se::State& s)
{
    s.rval().setBoolean(true);
    return true;
}
SE_BIND_FUNC(JSB_isObjectValid)

static bool getOrCreatePlainObject_r(const char* name, se::Object* parent, se::Object** outObj)
{
    assert(parent != nullptr);
    assert(outObj != nullptr);
    se::Value tmp;

    if (parent->getProperty(name, &tmp) && tmp.isObject())
    {
        *outObj = tmp.toObject();
        (*outObj)->addRef();
    }
    else
    {
        *outObj = se::Object::createPlainObject(false);
        parent->setProperty(name, se::Value(*outObj));
    }

    return true;
}

static bool js_performance_now(se::State& s)
{
    assert(false);
    //FIXME:
    return true;
}
SE_BIND_FUNC(js_performance_now)

bool jsb_register_global_variables(se::Object* global)
{
    global->defineFunction("require", _SE(require));

    getOrCreatePlainObject_r("cc", global, &__ccObj);

    jsb_register_var_under_cc();

    getOrCreatePlainObject_r("jsb", global, &__jsbObj);
    getOrCreatePlainObject_r("__jsc__", global, &__jscObj);

    __jscObj->defineFunction("garbageCollect", _SE(jsc_garbageCollect));
    __jscObj->defineFunction("dumpNativePtrToSeObjectMap", _SE(jsc_dumpNativePtrToSeObjectMap));

    global->defineFunction("__getPlatform", _SE(JSBCore_platform));
    global->defineFunction("__getOS", _SE(JSBCore_os));
    global->defineFunction("__getVersion", _SE(JSBCore_version));
    global->defineFunction("__restartVM", _SE(JSB_core_restartVM));
    global->defineFunction("__cleanScript", _SE(JSB_cleanScript));
    global->defineFunction("__isObjectValid", _SE(JSB_isObjectValid));
    global->defineFunction("close", _SE(JSB_closeWindow));

    se::Object* performanceObj = se::Object::createPlainObject(false);
    performanceObj->defineFunction("now", _SE(js_performance_now));
    global->setProperty("performance", se::Value(performanceObj));
    performanceObj->release();

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
