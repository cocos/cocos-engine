#include "manualanysdkbindings.hpp"

//#define ANYSDK_FOR_APPSTORE

#include "jsb_anysdk_protocols_auto.hpp"

#include "scripting/js-bindings/manual/jsb_classtype.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "jsb_anysdk_basic_conversions.h"
#include "AgentManager.h"
#include "PluginProtocol.h"
#include "ProtocolPush.h"
#include "PluginFactory.h"
#include "ProtocolAds.h"
#include "PluginManager.h"
#include "ProtocolAnalytics.h"
#include "ProtocolSocial.h"
#ifdef ANYSDK_FOR_APPSTORE
#include "ProtocolYAP.h"
#else
#include "ProtocolIAP.h"
#endif
#include "ProtocolUser.h"
#include "ProtocolREC.h"
#include "ProtocolAdTracking.h"
#include "ProtocolCustom.h"
#include "JSBRelation.h"

#ifdef ANYSDK_FOR_APPSTORE
#define jsb_funcName_getIAPPlugin "getYAPPlugin"
#define jsb_funcName_payForProduct "yapForProduct"
#else
#define jsb_funcName_getIAPPlugin "getIAPPlugin"
#define jsb_funcName_payForProduct "payForProduct"
#define ProtocolYAP        ProtocolIAP
#define getYAPPlugin       getIAPPlugin
#define YapResultCode      PayResultCode
#define YapResultListener  PayResultListener
#define onYapResult        onPayResult
#define yapForProduct      payForProduct
#define __jsb_anysdk_framework_ProtocolYAP_class   __jsb_anysdk_framework_ProtocolIAP_class
#define __jsb_anysdk_framework_ProtocolYAP_proto   __jsb_anysdk_framework_ProtocolIAP_proto
#endif

using namespace anysdk::framework;

se::Class* __jsb_anysdk_framework_PluginParam_class = nullptr;
se::Object* __jsb_anysdk_framework_PluginParam_proto = nullptr;

static bool js_anysdk_PluginParam_finalize(se::State& s)
{
    PluginParam* cobj = (PluginParam*)s.nativeThisObject();
    CCLOGINFO("js_anysdk_PluginParam_finalize: %p", cobj);
    delete cobj;
    return true;
}
SE_BIND_FINALIZE_FUNC(js_anysdk_PluginParam_finalize)

//
static bool js_anysdk_PluginParam_constructor(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    bool ok = true;
    
    PluginParam* cobj = nullptr;
    
    do {
        if (argc == 2) {
            int arg0;
            ok &= seval_to_int32(args[0], &arg0);
            if (!ok) { ok = true; break; }
            
            switch (arg0)
            {
                case PluginParam::kParamTypeInt:
                {
                    int arg1 = 0;
                    ok &= seval_to_int32(args[1], &arg1);
                    if (ok) { cobj = new PluginParam(arg1); }
                }
                    break;
                case PluginParam::kParamTypeFloat:
                {
                   	float arg1 = 0.0f;
                    ok &= seval_to_float(args[1], &arg1);
                    if (ok) {
                        cobj = new PluginParam(arg1);
                    }
                }
                    break;
                case PluginParam::kParamTypeBool:
                {
                    bool arg1 = false;
                    ok &= seval_to_boolean(args[1], &arg1);
                    if (ok) {
                        cobj = new PluginParam(arg1);
                    }
                }
                    break;
                case PluginParam::kParamTypeString:
                {
                    std::string arg1;
                    ok &= seval_to_std_string(args[1], &arg1);
                    if (ok) { cobj = new PluginParam(arg1.c_str()); }
                }
                    break;
                case PluginParam::kParamTypeStringMap:
                {
           	        StringMap arg1;
                    ok &= seval_to_std_map_string_string(args[1], &arg1);
                    if (ok) { cobj = new PluginParam(arg1); }
                }
                    break;
                default:
                    break;
            }
            if (!ok || NULL == cobj) { ok = true; break; }

            se::Object* obj = se::Object::createObjectWithClass(__jsb_anysdk_framework_PluginParam_class);
            obj->setPrivateData(cobj);
            s.rval().setObject(obj);

            return true;
        }
    } while (0);
    
    SE_REPORT_ERROR("wrong number of arguments");
    return false;
}

SE_BIND_CTOR(js_anysdk_PluginParam_constructor, __jsb_anysdk_framework_PluginParam_class, js_anysdk_PluginParam_finalize)

//
static bool jsb_anysdk_PluginParam_getStringValue(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
	if (argc == 0) {
        PluginParam* cobj = (PluginParam*)s.nativeThisObject();
		std::string ret = cobj->getStringValue();
        s.rval().setString(ret);
		return true;
	}

	SE_REPORT_ERROR("jsb_anysdk_PluginParam_getStringValue : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}
SE_BIND_FUNC(jsb_anysdk_PluginParam_getStringValue)

//
static bool jsb_anysdk_PluginParam_getCurrentType(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 0) {
        PluginParam* cobj = (PluginParam*)s.nativeThisObject();
		int ret = cobj->getCurrentType();
        s.rval().setInt32(ret);
		return true;
	}

	SE_REPORT_ERROR("jsb_anysdk_PluginParam_getCurrentType : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}
SE_BIND_FUNC(jsb_anysdk_PluginParam_getCurrentType)

static bool jsb_anysdk_PluginParam_getIntValue(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 0) {
        PluginParam* cobj = (PluginParam*)s.nativeThisObject();
		int ret = cobj->getIntValue();
        s.rval().setInt32(ret);
		return true;
	}

	SE_REPORT_ERROR("jsb_anysdk_PluginParam_getIntValue : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}
SE_BIND_FUNC(jsb_anysdk_PluginParam_getIntValue)

static bool jsb_anysdk_PluginParam_getFloatValue(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 0) {
        PluginParam* cobj = (PluginParam*)s.nativeThisObject();
		float ret = cobj->getFloatValue();
        s.rval().setFloat(ret);
		return true;
	}

	SE_REPORT_ERROR("jsb_anysdk_PluginParam_getFloatValue : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}
SE_BIND_FUNC(jsb_anysdk_PluginParam_getFloatValue)

static bool jsb_anysdk_PluginParam_getBoolValue(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 0) {
        PluginParam* cobj = (PluginParam*)s.nativeThisObject();
		bool ret = cobj->getBoolValue();
        s.rval().setBoolean(ret);
		return true;
	}

	SE_REPORT_ERROR("jsb_anysdk_PluginParam_getBoolValue : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}
SE_BIND_FUNC(jsb_anysdk_PluginParam_getBoolValue)

static bool jsb_anysdk_PluginParam_getMapValue(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 0) {
        PluginParam* cobj = (PluginParam*)s.nativeThisObject();
		auto values = cobj->getMapValue();
        se::HandleObject tmp(se::Object::createPlainObject());

    	bool ok = true;
        for (const auto& e : values)
    	{
            se::Value paramVal;
            ok = native_ptr_to_seval<PluginParam>(e.second, __jsb_anysdk_framework_PluginParam_class, &paramVal);
            if (ok)
            {
                tmp->setProperty(e.first.c_str(), paramVal);
            }
    	}

        s.rval().setObject(tmp);
        return true;
	}

	SE_REPORT_ERROR("jsb_anysdk_PluginParam_getMapValue : wrong number of arguments: %d, was expecting %d", argc, 0);
	return true;
}
SE_BIND_FUNC(jsb_anysdk_PluginParam_getMapValue)

static bool jsb_anysdk_PluginParam_getStrMapValue(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 0) {
        PluginParam* cobj = (PluginParam*)s.nativeThisObject();
        StringMap values = cobj->getStrMapValue();
        se::HandleObject tmp(se::Object::createPlainObject());

        for (const auto& e : values)
        {
            tmp->setProperty(e.first.c_str(), se::Value(e.second));
        }
        s.rval().setObject(tmp);
		return true;
	}

	SE_REPORT_ERROR("jsb_anysdk_PluginParam_getStrMapValue : wrong number of arguments: %d, was expecting %d", argc, 0);
	return false;
}
SE_BIND_FUNC(jsb_anysdk_PluginParam_getStrMapValue)
//
bool js_cocos2dx_PluginParam_create(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    PluginParam* ret = nullptr;
    if (argc == 0)
    {
        ret = new PluginParam();
    }
    else if (argc == 1)
    {
        if (args[0].isObject())
        {
            StringMap arg;
            seval_to_std_map_string_string(args[0], &arg);
            ret = new PluginParam(arg);
        }
        else if (args[0].isBoolean())
        {
            ret = new PluginParam(args[0].toBoolean());
        }
        else if(args[0].isNumber())
        {
            double number = args[0].toNumber();
            double iptr = 0.0;
            double frac = std::modf(number, &iptr);
            if (frac > 0.0 || frac < 0.0)
            {
                ret = new PluginParam((float)number);
            }
            else
            {
                ret = new PluginParam(args[0].toInt32());
            }
        }
        else if(args[0].isString())
        {
            ret = new PluginParam(args[0].toString().c_str());
        }
        else // undefined or null
        {
            ret = new PluginParam();
        }
    }
    else
    {
        SE_REPORT_ERROR("js_cocos2dx_PluginParam_create : wrong number of arguments: %d, was expecting %d", argc, 0);
        return false;
    }

    se::Object* jsret = se::Object::createObjectWithClass(__jsb_anysdk_framework_PluginParam_class);
    jsret->setPrivateData(ret);
    s.rval().setObject(jsret);

    return true;
}
SE_BIND_FUNC(js_cocos2dx_PluginParam_create)

void js_register_anysdkbindings_PluginParam(se::Object* global)
{
    auto cls = se::Class::create("PluginParam", global, nullptr, _SE(js_anysdk_PluginParam_constructor));

    cls->defineFunction("getCurrentType", _SE(jsb_anysdk_PluginParam_getCurrentType));
    cls->defineFunction("getIntValue", _SE(jsb_anysdk_PluginParam_getIntValue));
    cls->defineFunction("getFloatValue", _SE(jsb_anysdk_PluginParam_getFloatValue));
    cls->defineFunction("getBoolValue", _SE(jsb_anysdk_PluginParam_getBoolValue));
    cls->defineFunction("getStringValue", _SE(jsb_anysdk_PluginParam_getStringValue));
    cls->defineFunction("getMapValue", _SE(jsb_anysdk_PluginParam_getMapValue));
    cls->defineFunction("getStrMapValue", _SE(jsb_anysdk_PluginParam_getStrMapValue));

    cls->defineStaticFunction("create", _SE(js_cocos2dx_PluginParam_create));
    cls->defineFinalizeFunction(_SE(js_anysdk_PluginParam_finalize));

    cls->install();
    JSBClassType::registerClass<anysdk::framework::PluginParam>(cls);

    __jsb_anysdk_framework_PluginParam_class = cls;
    __jsb_anysdk_framework_PluginParam_proto = cls->getProto();

    se::ScriptEngine::getInstance()->clearException();
}

class ProtocolShareResultListener : public ShareResultListener
{
public:
    ProtocolShareResultListener(const se::Value& jsThis, const se::Value& jsFunc)
    : _jsThis(jsThis)
    , _jsFunc(jsFunc)
    {
        assert(_jsThis.isObject());
        assert(_jsFunc.isObject() && _jsFunc.toObject()->isFunction());

        _jsThis.toObject()->attachObject(_jsFunc.toObject());
    }

    virtual ~ProtocolShareResultListener()
    {
        CCLOG("on share result ~listener");
    }

    virtual void onShareResult(ShareResultCode code, const char* msg) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;
        CCLOG("on action result: %d, msg: %s.", code, msg);
        
        se::ValueArray args;
        args.push_back(se::Value((int)code));
        msg = msg != nullptr ? msg : "";
        args.push_back(se::Value(msg));

        _jsFunc.toObject()->call(args, _jsThis.toObject());
    }
private:
    se::Value _jsThis;
    se::Value _jsFunc;
};

static bool jsb_anysdk_ProtocolShare_setResultListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolShare_setResultListener, argc:%d.", argc);
    ProtocolShare* cobj = (ProtocolShare *)s.nativeThisObject();
    if (argc != 2)
    {
		SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    	return false;
    }

    ProtocolShareResultListener* listener = new ProtocolShareResultListener(args[1], args[0]);
    cobj->setResultListener(listener);
	return true;
}
SE_BIND_FUNC(jsb_anysdk_ProtocolShare_setResultListener)

static bool jsb_anysdk_ProtocolShare_share(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolShare_share, argc:%d.", argc);
    ProtocolShare* cobj = (ProtocolShare *)s.nativeThisObject();
    if (argc != 1)
    {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
        return false;
    }

    if (args[0].isObject())
    {
        TShareInfo info;
        bool ok = seval_to_std_map_string_string(args[0], &info);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        
	    cobj->share(info);
        return true;
	}

    SE_REPORT_ERROR("args[0] isn't an object!");
	return false;
}
SE_BIND_FUNC(jsb_anysdk_ProtocolShare_share)

se::Class* __jsb_anysdk_framework_ProtocolShare_class = nullptr;
se::Object* __jsb_anysdk_framework_ProtocolShare_proto = nullptr;

static bool js_anysdk_framework_ProtocolShare_finalize(se::State& s)
{
    ProtocolShare* cobj = (ProtocolShare*)s.nativeThisObject();
    CCLOGINFO("jsbindings: finalizing JS object %p (ProtocolShare)", cobj);
    return true;
}
SE_BIND_FINALIZE_FUNC(js_anysdk_framework_ProtocolShare_finalize)

bool js_register_anysdkbindings_ProtocolShare(se::Object* global)
{
    se::Class* cls = se::Class::create("ProtocolShare", global, __jsb_anysdk_framework_PluginProtocol_proto, nullptr);
    cls->defineFunction("share", _SE(jsb_anysdk_ProtocolShare_share));
    cls->defineFunction("setResultListener", _SE(jsb_anysdk_ProtocolShare_setResultListener));

    cls->install();

    JSBClassType::registerClass<anysdk::framework::ProtocolShare>(cls);

    __jsb_anysdk_framework_ProtocolShare_class = cls;
    __jsb_anysdk_framework_ProtocolShare_proto = cls->getProto();

    se::ScriptEngine::getInstance()->clearException();

    return true;
}

static bool JSB_anysdk_callFuncWithParam(se::State& s, const std::function<void(se::State&, const std::string&, const std::vector<PluginParam*>&)>& cb)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    std::vector<PluginParam*> params;
    if(argc == 1)
    {
        if (!args[0].isString())
        {
            SE_REPORT_ERROR("args[0] isn't string value!");
            return false;
        }
    	CCLOG("arg0: %s\n", args[0].toString().c_str());

        cb(s, args[0].toString(), params);
        return true;
    }
    else if (argc == 0)
    {
    	SE_REPORT_ERROR("Invalid number of arguments");
        return false;
    }
    else
    {
        if (!args[0].isString())
        {
            SE_REPORT_ERROR("args[0] isn't string value!");
            return false;
        }
        CCLOG("arg0: %s\n", args[0].toString().c_str());

        if (args[1].isObject() && args[1].toObject()->isArray())
        {
            se::Object* arrObj = args[1].toObject();
            uint32_t len = 0;
            arrObj->getArrayLength(&len);
            for (uint32_t i = 0; i < len; ++i)
            {
                se::Value v;
                if (arrObj->getArrayElement(i, &v) && v.isObject())
                {
                    PluginParam* p = nullptr;
                    if (seval_to_native_ptr(v, &p) && p != nullptr)
                    {
                        params.push_back(p);
                    }
                }
            }
        }
        else
        {
            for (int i = 1; i < argc; i++)
            {
                PluginParam* p = nullptr;
                if (seval_to_native_ptr(args[i], &p) && p != nullptr)
                {
                    params.push_back(p);
                }
            }
		}

        cb(s, args[0].toString(), params);
    	return true;
    }
}

static bool jsb_anysdk_framework_PluginProtocol_callFuncWithParam(se::State& s)
{
    return JSB_anysdk_callFuncWithParam(s, [](se::State& s, const std::string& funcName, const std::vector<PluginParam*>& params){
        PluginProtocol* cobj = (PluginProtocol*)s.nativeThisObject();
        cobj->callFuncWithParam(funcName.c_str(), params);
    });
}
SE_BIND_FUNC(jsb_anysdk_framework_PluginProtocol_callFuncWithParam)

static bool jsb_anysdk_framework_PluginProtocol_callStringFuncWithParam(se::State& s)
{
    return JSB_anysdk_callFuncWithParam(s, [](se::State& s, const std::string& funcName, const std::vector<PluginParam*>& params){
        PluginProtocol* cobj = (PluginProtocol*)s.nativeThisObject();
        std::string ret = cobj->callStringFuncWithParam(funcName.c_str(), params);
        s.rval().setString(ret);
    });
}
SE_BIND_FUNC(jsb_anysdk_framework_PluginProtocol_callStringFuncWithParam)

static bool jsb_anysdk_framework_PluginProtocol_callIntFuncWithParam(se::State& s)
{
    return JSB_anysdk_callFuncWithParam(s, [](se::State& s, const std::string& funcName, const std::vector<PluginParam*>& params){
        PluginProtocol* cobj = (PluginProtocol*)s.nativeThisObject();
        int ret = cobj->callIntFuncWithParam(funcName.c_str(), params);
        s.rval().setInt32(ret);
    });
}
SE_BIND_FUNC(jsb_anysdk_framework_PluginProtocol_callIntFuncWithParam)

static bool jsb_anysdk_framework_PluginProtocol_callBoolFuncWithParam(se::State& s)
{
    return JSB_anysdk_callFuncWithParam(s, [](se::State& s, const std::string& funcName, const std::vector<PluginParam*>& params){
        PluginProtocol* cobj = (PluginProtocol*)s.nativeThisObject();
        bool ret = cobj->callBoolFuncWithParam(funcName.c_str(), params);
        s.rval().setBoolean(ret);
    });
}
SE_BIND_FUNC(jsb_anysdk_framework_PluginProtocol_callBoolFuncWithParam)

static bool jsb_anysdk_framework_PluginProtocol_callFloatFuncWithParam(se::State& s)
{
    return JSB_anysdk_callFuncWithParam(s, [](se::State& s, const std::string& funcName, const std::vector<PluginParam*>& params){
        PluginProtocol* cobj = (PluginProtocol*)s.nativeThisObject();
        float ret = cobj->callFloatFuncWithParam(funcName.c_str(), params);
        s.rval().setFloat(ret);
    });
}
SE_BIND_FUNC(jsb_anysdk_framework_PluginProtocol_callFloatFuncWithParam)

static bool jsb_anysdk_framework_AgentManager_getYAPPlugin(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    AgentManager* cobj = (AgentManager*)s.nativeThisObject();

    if (argc != 0)
    {
		SE_REPORT_ERROR("AgentManager_getYAPPlugin param number is wrong.");
		return false;
    }
    std::map<std::string , ProtocolYAP*>* plugins = cobj->getYAPPlugin();
    if (plugins == nullptr)
    {
        s.rval().setNull();
        return true;
    }

    se::HandleObject jsretArr(se::Object::createArrayObject(plugins->size()));

    for (const auto& e : (*plugins))
    {
        se::Value iapVal;
        if (native_ptr_to_seval<ProtocolYAP>(e.second, __jsb_anysdk_framework_ProtocolYAP_class, &iapVal))
        {
            jsretArr->setProperty(e.first.c_str(), iapVal);
        }
    }

    s.rval().setObject(jsretArr);
	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_AgentManager_getYAPPlugin)

static bool jsb_anysdk_framework_AgentManager_getFrameworkVersion(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    AgentManager* cobj = (AgentManager*)s.nativeThisObject();

    if (argc != 0)
    {
        SE_REPORT_ERROR("jsb_anysdk_framework_AgentManager_getFrameworkVersion param number is wrong.");
        return false;
    }

    s.rval().setString(cobj->getFrameworkVersion());
    return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_AgentManager_getFrameworkVersion)

class ProtocolAdsResultListener : public AdsListener
{
public:
    ProtocolAdsResultListener(const se::Value& jsThis, const se::Value& jsFunc)
    : _jsThis(jsThis)
    , _jsFunc(jsFunc)
    {
        assert(_jsThis.isObject());
        assert(_jsFunc.isObject() && _jsFunc.toObject()->isFunction());

        _jsThis.toObject()->attachObject(_jsFunc.toObject());
    }
    
    virtual ~ProtocolAdsResultListener()
    {
        CCLOG("on ads result ~listener");
    }

    virtual void onAdsResult(AdsResultCode code, const char* msg) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;
        CCLOG("on ads result: %d, msg: %s.", code, msg);

        se::ValueArray args;
        args.push_back(se::Value((int)code));
        msg = msg != nullptr ? msg : "";
        args.push_back(se::Value(msg));

        _jsFunc.toObject()->call(args, _jsThis.toObject());
    }

//    virtual void onPlayerGetPoints(ProtocolAds* pAdsPlugin, int points) 
//    {
//        CCLOG("on player get points: %d.", points);
//        JS::RootedObject paramObj(_ctx);
//        js_get_or_create_jsobject<ProtocolAds>(_ctx, pAdsPlugin, &paramObj);
//        
//        JS::RootedValue retval(_ctx);
//        JS::AutoValueVector valArr(_ctx);
//        valArr.append( JS::ObjectOrNullValue(paramObj) );
//        valArr.append( JS::Int32Value(points) );
//        JS::HandleValueArray args(valArr);
//        
//        invoke(args, &retval);
//    }

    static ProtocolAdsResultListener* _instance;
    static ProtocolAdsResultListener* getInstance(const se::Value& jsThis, const se::Value& jsFunc)
    {
        if (_instance == nullptr)
        {
            _instance = new ProtocolAdsResultListener(jsThis, jsFunc);
        }
        return _instance;
    }
    static void purge()
    {
        if (_instance != nullptr)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
private:
    se::Value _jsThis;
    se::Value _jsFunc;
};

ProtocolAdsResultListener* ProtocolAdsResultListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolAds_setAdsListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolAds_setAdsListener, argc:%d.", argc);
    ProtocolAds* cobj = (ProtocolAds*)s.nativeThisObject();

    if (argc != 2)
    {
		SE_REPORT_ERROR("jsb_anysdk_framework_ProtocolAds_setAdsListener : wrong number of arguments: %d, was expecting %d", argc, 0);
    	return false;
    }

    ProtocolAdsResultListener* listener = ProtocolAdsResultListener::getInstance(args[1], args[0]);
    cobj->setAdsListener(listener);
	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolAds_setAdsListener)

static bool jsb_anysdk_framework_ProtocolAds_removeListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolAds_removeListener, argc:%d.", argc);
    if(argc != 0)
    {
        SE_REPORT_ERROR("ProtocolAds_removeListener has wrong number of arguments.");
        return false;
    }

    if (ProtocolAdsResultListener::_instance != nullptr)
    {
        ProtocolAdsResultListener::purge();
    }

	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolAds_removeListener)

static bool jsb_anysdk_framework_ProtocolAnalytics_logEvent(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    ProtocolAnalytics* cobj = (ProtocolAnalytics*)s.nativeThisObject();

    std::string arg;
    bool ok = seval_to_std_string(args[0], &arg);
    CCLOG("logevent, argc: %d, str: %s.", argc, arg.c_str());
	if (!ok)
	{
		SE_REPORT_ERROR("ProtocolAnalytics_logEvent param type is wrong.");
		return false;
	}

    if (argc == 1)
    {
    	cobj->logEvent(arg.c_str());
    	return true;
    }
    else if(argc == 2)
    {
        if (!args[1].isObject() || args[1].isNullOrUndefined())
        {
            SE_REPORT_ERROR("%s", "jsval is not an object.");
            return false;
        }

    	LogEventParamMap params;
        bool ok = seval_to_std_map_string_string(args[1], &params);
        SE_PRECONDITION2(ok, false, "jsb_anysdk_framework_ProtocolAnalytics_logEvent : Error processing arguments");
	    
	    cobj->logEvent(arg.c_str(), &params);

    	return true;
    }
	SE_REPORT_ERROR("jsb_anysdk_framework_ProtocolAnalytics_logEvent : wrong number of arguments: %d, was expecting %d", argc, 0);
	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolAnalytics_logEvent)

class ProtocolYAPResultListener : public YapResultListener
{
public:
    ProtocolYAPResultListener(const se::Value& jsThis, const se::Value& jsFunc)
    : _jsThis(jsThis)
    , _jsFunc(jsFunc)
    {
        assert(_jsThis.isObject());
        assert(_jsFunc.isObject() && _jsFunc.toObject()->isFunction());

        _jsThis.toObject()->attachObject(_jsFunc.toObject());
    }
    virtual ~ProtocolYAPResultListener()
    {
        CCLOG("~ProtocolYAPResultListener");
    }

    virtual void onYapResult(YapResultCode code, const char* msg, TProductInfo info) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        CCLOG("on yap result: %d, msg: %s.", code, msg);
        
        std::string vec="{";
        for (auto iter = info.begin(); iter != info.end(); ++iter)
        {
            std::string key = std::string(iter->first);
            std::string value = (std::string)(iter->second);
            // CCLOG("productInfo key: %s, value: %s.", key.c_str(), value.c_str());
            vec += key + ":" +value+ ",";
        }
        vec.replace(vec.length() - 1, 1, "}");

        se::ValueArray args;
        args.push_back(se::Value((int)code));
        msg = msg != nullptr ? msg : "";
        args.push_back(se::Value(msg));
        args.push_back(se::Value(vec));

        _jsFunc.toObject()->call(args, _jsThis.toObject());
    }
    
    
    virtual void onRequestResult(RequestResultCode code, const char* msg, AllProductsInfo info) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        CCLOG("on request result: %d, msg: %s.", code, msg);
        
        string value = "{";
        map<string, TProductInfo >::iterator iterParent;
        iterParent = info.begin();
        while(iterParent != info.end())
        {
            value.append(iterParent->first);
            value.append("={");
            map<string, string> infoChild = iterParent->second;
            map<string, string >::iterator iterChild;
            iterChild = infoChild.begin();
            while(iterChild != infoChild.end())
            {
                value.append(iterChild->first);
                value.append("=");
                value.append(iterChild->second);
                iterChild++;
                if(iterChild != infoChild.end())
                value.append(", ");
            }
            iterParent++;
            if(iterParent != info.end())
            value.append("}, ");
        }
        value.append("}");
        
        
        se::ValueArray args;
        args.push_back(se::Value((int)code));
        msg = msg != nullptr ? msg : "";
        args.push_back(se::Value(msg));
        args.push_back(se::Value(value));

        _jsFunc.toObject()->call(args, _jsThis.toObject());
    }

	typedef std::map<std::string, ProtocolYAPResultListener*> STD_MAP;
    static STD_MAP std_map;

    static ProtocolYAPResultListener* getListenerByKey(std::string key, const se::Value& jsThis, const se::Value& jsFunc)
    {
        ProtocolYAPResultListener* ret = nullptr;
        auto iter = std_map.find(key);
        if (iter == std_map.end())
        {
            ret = new ProtocolYAPResultListener(jsThis, jsFunc);
            std_map.emplace(key, ret);
        }
        return ret;
    }

    static void purge(const std::string& key)
    {
        auto iter = std_map.find(key);
        if (iter != std_map.end())
        {
            delete iter->second;
            std_map.erase(iter);
        }
    }
private:
    se::Value _jsThis;
    se::Value _jsFunc;
};
ProtocolYAPResultListener::STD_MAP ProtocolYAPResultListener::std_map;

static bool jsb_anysdk_framework_ProtocolYAP_setResultListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    ProtocolYAP* cobj = (ProtocolYAP*)s.nativeThisObject();

    if (argc != 2)
    {
		SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    	return true;
    }

	std::string p_id = cobj->getPluginId();
    if (p_id.length() < 1)
    {
        p_id = "no_plugin";
    }

    auto iter = ProtocolYAPResultListener::std_map.find(p_id);
    if (iter == ProtocolYAPResultListener::std_map.end())
    {
        CCLOG("will set listener:");
        
        ProtocolYAPResultListener* listener = ProtocolYAPResultListener::getListenerByKey(p_id, args[1], args[0]);
	    cobj->setResultListener(listener);
    }

	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolYAP_setResultListener)

static bool jsb_anysdk_framework_ProtocolYAP_removeListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if(argc != 0)
    {
        SE_REPORT_ERROR("ProtocolYAP_removeListener has wrong number of arguments.");
        return false;
    }

    ProtocolYAP* cobj = (ProtocolYAP*)s.nativeThisObject();
    CCLOG("in ProtocolYAP_removeListener, argc:%d.", argc);
    std::string p_id = cobj->getPluginId();
    if (p_id.length() < 1)
    {
        p_id = "no_plugin";
    }

    ProtocolYAPResultListener::purge(p_id);
	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolYAP_removeListener)

static bool jsb_anysdk_framework_ProtocolYAP_yapForProduct(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolYAP_yapForProduct, argc:%d.", argc);

    if (argc != 1)
    {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
        return true;
    }

    if (args[0].isObject())
    {
        ProtocolYAP* cobj = (ProtocolYAP*)s.nativeThisObject();
        TProductInfo arg;
        bool ok = seval_to_std_map_string_string(args[0], &arg);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
	    cobj->yapForProduct(arg);
        return true;
	}

    SE_REPORT_ERROR("args[0] isn't an object!");
	return false;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolYAP_yapForProduct)

class ProtocolPushActionListener : public PushActionListener
{
public:
    ProtocolPushActionListener(const se::Value& jsThis, const se::Value& jsFunc)
    : _jsThis(jsThis)
    , _jsFunc(jsFunc)
    {
        assert(_jsThis.isObject());
        assert(_jsFunc.isObject() && _jsFunc.toObject()->isFunction());

        _jsThis.toObject()->attachObject(_jsFunc.toObject());
    }

    virtual ~ProtocolPushActionListener()
    {
        CCLOG("on Push result ~listener");
    }

    virtual void onActionResult(ProtocolPush* pPlugin, PushActionResultCode code, const char* msg) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        CCLOG("on push result: %d, msg: %s.", code, msg);

        se::Value pluginVal;
        bool ok = native_ptr_to_seval<ProtocolPush>(pPlugin, &pluginVal);
        if (!ok)
        {
            CCLOGERROR("Converting ProtocolPush failed!");
            return;
        }

        se::ValueArray args;
        args.push_back(pluginVal);
        args.push_back(se::Value((int)code));
        msg = msg != nullptr ? msg : "";
        args.push_back(se::Value(msg));

        _jsFunc.toObject()->call(args, _jsThis.toObject());
    }

    static ProtocolPushActionListener* _instance;
    static ProtocolPushActionListener* getInstance(const se::Value& jsThis, const se::Value& jsFunc)
    {
        if (_instance == nullptr)
        {
            _instance = new ProtocolPushActionListener(jsThis, jsFunc);
        }
        return _instance;
    }
    static void purge()
    {
        if (_instance != nullptr)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
private:
    se::Value _jsThis;
    se::Value _jsFunc;
};
ProtocolPushActionListener* ProtocolPushActionListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolPush_setActionListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolPush_setActionListener, argc:%d.", argc);
    if (argc != 2)
    {
		SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    	return false;
    }

    ProtocolPush* cobj = (ProtocolPush*)s.nativeThisObject();
    ProtocolPushActionListener* listener = ProtocolPushActionListener::getInstance(args[1], args[0]);
    cobj->setActionListener(listener);
	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolPush_setActionListener)

static bool jsb_anysdk_framework_ProtocolPush_removeListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolPush_removeListener, argc:%d.", argc);
    if(argc != 0)
    {
        SE_REPORT_ERROR("ProtocolPush_removeListener has wrong number of arguments.");
        return false;
    }

    ProtocolPushActionListener::purge();
	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolPush_removeListener)

static bool jsb_anysdk_framework_ProtocolPush_setTags(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolPush_setActionListener, argc:%d.", argc);
    ProtocolPush* cobj = (ProtocolPush *)s.nativeThisObject();
    if (argc != 1)
    {
		SE_REPORT_ERROR("jsb_anysdk_framework_ProtocolPush_setTags : wrong number of arguments: %d, was expecting %d", argc, 1);
    	return false;
    }

	if (args[0].isObject())
    {
        std::list<std::string> arg;
        se::Object* jsobj = args[0].toObject();
	    SE_PRECONDITION2(jsobj && jsobj->isArray(), false, "Object must be an array");

	    uint32_t len = 0;
        jsobj->getArrayLength(&len);

	    for(uint32_t i = 0; i < len; ++i)
        {
            se::Value v;
            jsobj->getArrayElement(i, &v);
	        if (v.isString() )
	        {
	        	CCLOG("value is string;");
	        	std::string key;
	        	bool ok = seval_to_std_string(v, &key);
	        	if (ok)
	        	{
	        		CCLOG("key: %s.", key.c_str());
	        		arg.push_back( key );
	        	}
	        }
	    }
	    cobj->setTags(arg);
        return true;
	}

    SE_REPORT_ERROR("setTags: args[0] is not an object.");
	return false;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolPush_setTags)

static bool jsb_anysdk_framework_ProtocolPush_delTags(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolPush_setActionListener, argc:%d.", argc);
    ProtocolPush* cobj = (ProtocolPush *)s.nativeThisObject();
    if (argc != 1)
    {
		SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    	return false;
    }
    if (args[0].isObject())
    {
        std::list<std::string> arg;
        se::Object* jsobj = args[0].toObject();
        SE_PRECONDITION2(jsobj && jsobj->isArray(), false, "Object must be an array");

        uint32_t len = 0;
        jsobj->getArrayLength(&len);

        for(uint32_t i = 0; i < len; ++i)
        {
            se::Value v;
            jsobj->getArrayElement(i, &v);
            if (v.isString() )
            {
                CCLOG("value is string;");
                std::string key;
                bool ok = seval_to_std_string(v, &key);
                if (ok)
                {
                    CCLOG("key: %s.", key.c_str());
                    arg.push_back( key );
                }
            }
        }
        cobj->delTags(arg);
        return true;
    }
    
    SE_REPORT_ERROR("delTags: args[0] is not an object.");
    return false;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolPush_delTags)

class ProtocolUserActionListener : public UserActionListener
{
public:
    ProtocolUserActionListener(const se::Value& jsThis, const se::Value& jsFunc)
    : _jsThis(jsThis)
    , _jsFunc(jsFunc)
    {
        assert(_jsThis.isObject());
        assert(_jsFunc.isObject() && _jsFunc.toObject()->isFunction());

        _jsThis.toObject()->attachObject(_jsFunc.toObject());
    }

    virtual ~ProtocolUserActionListener()
    {
        CCLOG("on user action result ~listener");
    }

    virtual void onActionResult(ProtocolUser* pPlugin, UserActionResultCode code, const char* msg) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        CCLOG("on user action result: %d, msg: %s.", code, msg);

        se::Value pluginVal;
        bool ok = native_ptr_to_seval<ProtocolUser>(pPlugin, &pluginVal);
        if (!ok)
        {
            CCLOGERROR("Converting ProtocolUser failed!");
            return;
        }

        se::ValueArray args;
        args.push_back(pluginVal);
        args.push_back(se::Value((int)code));
        msg = msg != nullptr ? msg : "";
        args.push_back(se::Value(msg));

        _jsFunc.toObject()->call(args, _jsThis.toObject());
    }

    static ProtocolUserActionListener* _instance;
    static ProtocolUserActionListener* getInstance(const se::Value& jsThis, const se::Value& jsFunc)
    {
        if (_instance == nullptr)
        {
            _instance = new ProtocolUserActionListener(jsThis, jsFunc);
        }
        return _instance;
    }

    static void purge()
    {
        if (_instance)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
private:
    se::Value _jsThis;
    se::Value _jsFunc;
};
ProtocolUserActionListener* ProtocolUserActionListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolUser_setActionListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolUser_setActionListener, argc:%d.", argc);
    if (argc != 2)
    {
		SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    	return false;
    }
    ProtocolUser* cobj = (ProtocolUser *)s.nativeThisObject();
    ProtocolUserActionListener* listener = ProtocolUserActionListener::getInstance(args[1], args[0]);
    cobj->setActionListener(listener);
	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolUser_setActionListener)

static bool jsb_anysdk_framework_ProtocolUser_removeListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolUser_removeListener, argc:%d.", argc);
    if(argc != 0)
    {
        SE_REPORT_ERROR("ProtocolUser_removeListener has wrong number of arguments.");
        return false;
    }

    ProtocolUserActionListener::purge();
	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolUser_removeListener)

class ProtocolSocialListener : public SocialListener
{
public:
    ProtocolSocialListener(const se::Value& jsThis, const se::Value& jsFunc)
    : _jsThis(jsThis)
    , _jsFunc(jsFunc)
    {
        assert(_jsThis.isObject());
        assert(_jsFunc.isObject() && _jsFunc.toObject()->isFunction());

        _jsThis.toObject()->attachObject(_jsFunc.toObject());
    }

    virtual ~ProtocolSocialListener()
    {
        CCLOG("on social result ~listener");
    }

    virtual void onSocialResult(SocialRetCode code, const char* msg) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        CCLOG("onSocialResult: %d, msg: %s.", code, msg);

        se::ValueArray args;
        args.push_back(se::Value((int)code));
        msg = msg != nullptr ? msg : "";
        args.push_back(se::Value(msg));

        _jsFunc.toObject()->call(args, _jsThis.toObject());
    }

    static ProtocolSocialListener* _instance;
    static ProtocolSocialListener* getInstance(const se::Value& jsThis, const se::Value& jsFunc)
    {
        if (_instance == nullptr)
        {
            _instance = new ProtocolSocialListener(jsThis, jsFunc);
        }
        return _instance;
    }
    static void purge()
    {
        if (_instance != nullptr)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
private:
    se::Value _jsThis;
    se::Value _jsFunc;
};
ProtocolSocialListener* ProtocolSocialListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolSocial_setListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolSocial_setListener, argc:%d.", argc);
    ProtocolSocial* cobj = (ProtocolSocial *)s.nativeThisObject();
    if (argc != 2)
    {
		SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    	return false;
    }
    ProtocolSocialListener* listener = ProtocolSocialListener::getInstance(args[1], args[0]);
    cobj->setListener(listener);
	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolSocial_setListener)

static bool jsb_anysdk_framework_ProtocolSocial_removeListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolSocial_removeListener, argc:%d.", argc);
    if(argc != 0)
    {
        SE_REPORT_ERROR("ProtocolSocial_removeListener has wrong number of arguments.");
        return false;
    }

    ProtocolSocialListener::purge();
	return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolSocial_removeListener)

static bool jsb_anysdk_framework_ProtocolSocial_unlockAchievement(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolSocial_unlockAchievement, argc:%d.", argc);
    ProtocolSocial* cobj = (ProtocolSocial *)s.nativeThisObject();
    if (argc != 1)
    {
		SE_REPORT_ERROR("jsb_anysdk_framework_ProtocolSocial_unlockAchievement : wrong number of arguments: %d, was expecting %d", argc, 0);
    	return false;
    }

    if (args[0].isObject())
    {
        TAchievementInfo arg;
        bool ok = seval_to_std_map_string_string(args[0], &arg);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
	    cobj->unlockAchievement( arg );
        return true;
	}

    SE_REPORT_ERROR("args[0] isn't an object!");
	return false;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolSocial_unlockAchievement)

class ProtocolRECListener : public RECResultListener
{
public:
    ProtocolRECListener(const se::Value& jsThis, const se::Value& jsFunc)
    : _jsThis(jsThis)
    , _jsFunc(jsFunc)
    {
        assert(_jsThis.isObject());
        assert(_jsFunc.isObject() && _jsFunc.toObject()->isFunction());

        _jsThis.toObject()->attachObject(_jsFunc.toObject());
    }

    virtual ~ProtocolRECListener()
    {
        CCLOG("on REC result ~listener");
    }
    
    virtual void onRECResult(RECResultCode code, const char* msg) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        CCLOG("onRECResult: %d, msg: %s.", code, msg);

        se::ValueArray args;
        args.push_back(se::Value((int)code));
        msg = msg != nullptr ? msg : "";
        args.push_back(se::Value(msg));

        _jsFunc.toObject()->call(args, _jsThis.toObject());
    }
    
    static ProtocolRECListener* _instance;
    static ProtocolRECListener* getInstance(const se::Value& jsThis, const se::Value& jsFunc)
    {
        if (_instance == nullptr)
        {
            _instance = new ProtocolRECListener(jsThis, jsFunc);
        }
        return _instance;
    }
    static void purge()
    {
        if (_instance != nullptr)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
private:
    se::Value _jsThis;
    se::Value _jsFunc;
};
ProtocolRECListener* ProtocolRECListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolREC_setResultListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolREC_setListener, argc:%d.", argc);
    ProtocolREC* cobj = (ProtocolREC *)s.nativeThisObject();
    if (argc != 2)
    {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
        return false;
    }
    ProtocolRECListener* listener = ProtocolRECListener::getInstance(args[1], args[0]);
    cobj->setResultListener(listener);
    return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolREC_setResultListener)

static bool jsb_anysdk_framework_ProtocolREC_removeListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolREC_removeListener, argc:%d.", argc);
    if (argc != 0)
    {
        SE_REPORT_ERROR("ProtocolREC_removeListener has wrong number of arguments.");
        return false;
    }
    ProtocolRECListener::purge();
    return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolREC_removeListener)

class ProtocolCustomListener : public CustomResultListener
{
public:
    ProtocolCustomListener(const se::Value& jsThis, const se::Value& jsFunc)
    : _jsThis(jsThis)
    , _jsFunc(jsFunc)
    {
        assert(_jsThis.isObject());
        assert(_jsFunc.isObject() && _jsFunc.toObject()->isFunction());

        _jsThis.toObject()->attachObject(_jsFunc.toObject());
    }

    virtual ~ProtocolCustomListener()
    {
        CCLOG("on Custom result ~listener");
    }
    
    virtual void onCustomResult(CustomResultCode code, const char* msg)
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        CCLOG("onCustomResult: %d, msg: %s.", code, msg);

        se::ValueArray args;
        args.push_back(se::Value((int)code));
        msg = msg != nullptr ? msg : "";
        args.push_back(se::Value(msg));

        _jsFunc.toObject()->call(args, _jsThis.toObject());
    }
    
    static ProtocolCustomListener* _instance;
    static ProtocolCustomListener* getInstance(const se::Value& jsThis, const se::Value& jsFunc)
    {
        if (_instance == nullptr)
        {
            _instance = new ProtocolCustomListener(jsThis, jsFunc);
        }
        return _instance;
    }
    static void purge()
    {
        if (_instance != nullptr)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
private:
    se::Value _jsThis;
    se::Value _jsFunc;
};
ProtocolCustomListener* ProtocolCustomListener::_instance = nullptr;

static bool jsb_anysdk_framework_ProtocolCustom_setResultListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolCustom_setListener, argc:%d.", argc);
    ProtocolCustom* cobj = (ProtocolCustom *)s.nativeThisObject();
    if (argc != 2)
    {
        SE_REPORT_ERROR("jsb_anysdk_framework_ProtocolCustom_setListener : wrong number of arguments: %d, was expecting %d", argc, 2);
        return false;
    }
    ProtocolCustomListener* listener = ProtocolCustomListener::getInstance(args[1], args[0]);
    cobj->setResultListener(listener);
    return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolCustom_setResultListener)

static bool jsb_anysdk_framework_ProtocolCustom_removeListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    CCLOG("in ProtocolCustom_removeListener, argc:%d.", argc);

    if(argc != 0)
    {
        SE_REPORT_ERROR("ProtocolCustom_removeListener has wrong number of arguments.");
        return false;
    }

    ProtocolCustomListener::purge();
    return true;
}
SE_BIND_FUNC(jsb_anysdk_framework_ProtocolCustom_removeListener)

bool register_all_anysdk_manual(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("anysdk", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("anysdk", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_anysdkbindings_PluginParam(ns);
    js_register_anysdkbindings_ProtocolShare(ns);

	//PluginProtocol
    __jsb_anysdk_framework_PluginProtocol_proto->defineFunction("callFuncWithParam", _SE(jsb_anysdk_framework_PluginProtocol_callFuncWithParam));
    __jsb_anysdk_framework_PluginProtocol_proto->defineFunction("callStringFuncWithParam", _SE(jsb_anysdk_framework_PluginProtocol_callStringFuncWithParam));
    __jsb_anysdk_framework_PluginProtocol_proto->defineFunction("callIntFuncWithParam", _SE(jsb_anysdk_framework_PluginProtocol_callIntFuncWithParam));
    __jsb_anysdk_framework_PluginProtocol_proto->defineFunction("callBoolFuncWithParam", _SE(jsb_anysdk_framework_PluginProtocol_callBoolFuncWithParam));
    __jsb_anysdk_framework_PluginProtocol_proto->defineFunction("callFloatFuncWithParam", _SE(jsb_anysdk_framework_PluginProtocol_callFloatFuncWithParam));

    //AgentManager
    __jsb_anysdk_framework_AgentManager_proto->defineFunction(jsb_funcName_getIAPPlugin, _SE(jsb_anysdk_framework_AgentManager_getYAPPlugin));
    __jsb_anysdk_framework_AgentManager_proto->defineFunction("getFrameworkVersion", _SE(jsb_anysdk_framework_AgentManager_getFrameworkVersion));

    //ProtocolAds
    __jsb_anysdk_framework_ProtocolAds_proto->defineFunction("setAdsListener", _SE(jsb_anysdk_framework_ProtocolAds_setAdsListener));
    __jsb_anysdk_framework_ProtocolAds_proto->defineFunction("removeListener", _SE(jsb_anysdk_framework_ProtocolAds_removeListener));

    //ProtocolAnalytics
    __jsb_anysdk_framework_ProtocolAnalytics_proto->defineFunction("logEvent", _SE(jsb_anysdk_framework_ProtocolAnalytics_logEvent));

    //ProtocolYAP
    __jsb_anysdk_framework_ProtocolYAP_proto->defineFunction("setResultListener", _SE(jsb_anysdk_framework_ProtocolYAP_setResultListener));
    __jsb_anysdk_framework_ProtocolYAP_proto->defineFunction("removeListener", _SE(jsb_anysdk_framework_ProtocolYAP_removeListener));
    __jsb_anysdk_framework_ProtocolYAP_proto->defineFunction(jsb_funcName_payForProduct, _SE(jsb_anysdk_framework_ProtocolYAP_yapForProduct));

    //ProtocolSocial
    __jsb_anysdk_framework_ProtocolSocial_proto->defineFunction("setListener", _SE(jsb_anysdk_framework_ProtocolSocial_setListener));
    __jsb_anysdk_framework_ProtocolSocial_proto->defineFunction("removeListener", _SE(jsb_anysdk_framework_ProtocolSocial_removeListener));
    __jsb_anysdk_framework_ProtocolSocial_proto->defineFunction("unlockAchievement", _SE(jsb_anysdk_framework_ProtocolSocial_unlockAchievement));

    //ProtocolPush
    __jsb_anysdk_framework_ProtocolPush_proto->defineFunction("setActionListener", _SE(jsb_anysdk_framework_ProtocolPush_setActionListener));
    __jsb_anysdk_framework_ProtocolPush_proto->defineFunction("removeListener", _SE(jsb_anysdk_framework_ProtocolPush_removeListener));
    __jsb_anysdk_framework_ProtocolPush_proto->defineFunction("setTags", _SE(jsb_anysdk_framework_ProtocolPush_setTags));
    __jsb_anysdk_framework_ProtocolPush_proto->defineFunction("delTags", _SE(jsb_anysdk_framework_ProtocolPush_delTags));

    //ProtocolUser
    __jsb_anysdk_framework_ProtocolUser_proto->defineFunction("setActionListener", _SE(jsb_anysdk_framework_ProtocolUser_setActionListener));
    __jsb_anysdk_framework_ProtocolUser_proto->defineFunction("removeListener", _SE(jsb_anysdk_framework_ProtocolUser_removeListener));

    //ProtocolCustom
    __jsb_anysdk_framework_ProtocolCustom_proto->defineFunction("setResultListener", _SE(jsb_anysdk_framework_ProtocolCustom_setResultListener));
    __jsb_anysdk_framework_ProtocolCustom_proto->defineFunction("removeListener", _SE(jsb_anysdk_framework_ProtocolCustom_removeListener));

    //ProtocolREC
    __jsb_anysdk_framework_ProtocolREC_proto->defineFunction("setResultListener", _SE(jsb_anysdk_framework_ProtocolREC_setResultListener));
    __jsb_anysdk_framework_ProtocolREC_proto->defineFunction("removeListener", _SE(jsb_anysdk_framework_ProtocolREC_removeListener));

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
