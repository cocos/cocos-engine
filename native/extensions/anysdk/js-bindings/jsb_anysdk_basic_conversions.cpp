#include "jsb_anysdk_basic_conversions.h"
#include <math.h>

#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include <sstream>

namespace anysdk { namespace framework {

bool jsval_to_TProductInfo(JSContext *cx, JS::HandleValue v, TProductInfo* ret)
{
    JS::RootedObject tmp(cx, v.toObjectOrNull());
    if (!tmp) {
        CCLOG("jsval_to_TProductInfo: the jsval is not an object.");
        return false;
    }

    JS::RootedObject it(cx, JS_NewPropertyIterator(cx, tmp));

    while (true)
    {
        jsid idp;
        JS::RootedValue key(cx);
        if (! JS_NextProperty(cx, it, &idp) || ! JS_IdToValue(cx, idp, &key))
            return false; // error
        if (key.isNullOrUndefined())
            break; // end of iteration
        if (! key.isString())
            continue; // ignore integer properties
        JS::RootedValue value(cx);
        JS_GetPropertyById(cx, tmp, JS::RootedId(cx, idp), &value);
        if (! value.isString())
            continue; // ignore integer properties

        JSStringWrapper strWrapper(key.toString(), cx);
        JSStringWrapper strWrapper2(value.toString(), cx);

        (*ret)[strWrapper.get()] = strWrapper2.get();
        CCLOG("iterate object: key = %s, value = %s", strWrapper.get(), strWrapper2.get());
    }

    return true;
}

bool jsval_to_FBInfo(JSContext *cx, JS::HandleValue v, StringMap* ret)
{
    JS::RootedObject tmp(cx, v.toObjectOrNull());
	if (!tmp) {
		CCLOG("jsval_to_TProductInfo: the jsval is not an object.");
		return false;
	}

    JS::RootedObject it(cx, JS_NewPropertyIterator(cx, tmp));

	while (true)
	{
		jsid idp;
        JS::RootedValue key(cx);
		if (! JS_NextProperty(cx, it, &idp) || ! JS_IdToValue(cx, idp, &key))
			return false; // error
		if (key.isNullOrUndefined())
			break; // end of iteration
		if (! key.isString())
			continue; // ignore integer properties
		JS::RootedValue value(cx);
        JS_GetPropertyById(cx, tmp, JS::RootedId(cx, idp), &value);

//		if (! JSVAL_IS_STRING(value))
//			continue; // ignore integer properties
		if(value.isString())
		{

			JSStringWrapper strWrapper(key.toString(), cx);
			JSStringWrapper strWrapper2(value.toString(), cx);

			ret->insert(std::map<std::string, std::string>::value_type(strWrapper.get(), strWrapper2.get()));
		}
		else if(value.isNumber())
		{
			double number = 0.0;
			JS::ToNumber(cx, value, &number);

			std::stringstream ss;
			ss << number;

			JSStringWrapper strWrapper(key.toString(), cx);
			//JSStringWrapper strWrapper2(JSVAL_TO_STRING(value), cx);

			ret->insert(std::map<std::string, std::string>::value_type(strWrapper.get(), ss.str()));
		}
		else if(value.isBoolean())
		{
			bool boolVal = JS::ToBoolean(value);
			JSStringWrapper strWrapper(key.toString(), cx);
			//JSStringWrapper strWrapper2(JSVAL_TO_STRING(value), cx);
			std::string boolstring = boolVal ? "true" : "false";
			ret->insert(std::map<std::string, std::string>::value_type(strWrapper.get(), boolstring));
		}
	}

	return true;
}

bool jsval_array_to_string(JSContext *cx, JS::HandleValue v, std::string* ret)
{
	JS::RootedObject jsobj(cx);
	bool ok = v.isObject() && JS_ValueToObject( cx, JS::RootedValue(cx, v), &jsobj );
	JSB_PRECONDITION2( ok, cx, false, "Error converting value to object");
	JSB_PRECONDITION2( jsobj && JS_IsArrayObject( cx, jsobj), cx, false, "Object must be an array");

	uint32_t len;
	JS_GetArrayLength(cx, jsobj, &len);

	for( uint32_t i=0; i< len;i++ ) {
		JS::RootedValue valarg(cx);
		JS_GetElement(cx, jsobj, i, &valarg);

		std::string temp;
		ok = jsval_to_std_string(cx, valarg, &temp);
		JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
		if(i != len -1)
			ret->append(temp + ",");
		else
			ret->append(temp);
	}

	return true;
}

bool jsval_to_TIAPDeveloperInfo(JSContext *cx, JS::HandleValue v, TIAPDeveloperInfo* ret)
{
    return jsval_to_TProductInfo(cx, v, ret);
}

bool jsval_to_TAdsDeveloperInfo(JSContext *cx, JS::HandleValue v, TAdsDeveloperInfo* ret)
{
    return jsval_to_TProductInfo(cx, v, ret);
}

bool jsval_to_TAdsInfo(JSContext *cx, JS::HandleValue v, TAdsInfo* ret)
{
    return jsval_to_TProductInfo(cx, v, ret);
}

bool jsval_to_TShareDeveloperInfo(JSContext *cx, JS::HandleValue v, TShareDeveloperInfo* ret)
{
    return jsval_to_TProductInfo(cx, v, ret);
}

bool jsval_to_TShareInfo(JSContext *cx, JS::HandleValue v, TShareInfo* ret)
{
    return jsval_to_TProductInfo(cx, v, ret);
}

bool jsval_to_TVideoInfo(JSContext *cx, JS::HandleValue v, TVideoInfo* ret)
{
    return jsval_to_TProductInfo(cx, v, ret);
}

bool jsval_to_TPaymentInfo(JSContext *cx, JS::HandleValue v, std::map<std::string, std::string>* ret)
{
    return jsval_to_TProductInfo(cx, v, ret);
}

bool jsval_to_TSocialDeveloperInfo(JSContext *cx, JS::HandleValue v, TSocialDeveloperInfo* ret)
{
    return jsval_to_TProductInfo(cx, v, ret);
}

bool jsval_to_TAchievementInfo(JSContext *cx, JS::HandleValue v, TAchievementInfo* ret)
{
    return jsval_to_TProductInfo(cx, v, ret);
}

bool jsval_to_TUserDeveloperInfo(JSContext *cx, JS::HandleValue v, TUserDeveloperInfo* ret)
{
    return jsval_to_TProductInfo(cx, v, ret);
}

bool jsval_to_LogEventParamMap(JSContext *cx, JS::HandleValue v, LogEventParamMap** ret)
{
    bool jsret = false;
    if (v.isObject())
    {
        LogEventParamMap* tmp = new LogEventParamMap();
        jsret = jsval_to_TProductInfo(cx, v, tmp);
        if (jsret) {
            *ret = tmp;
        }
    }

    return jsret;
}

bool jsval_to_StringMap(JSContext *cx, JS::HandleValue v, StringMap* ret)
{
    return jsval_to_TProductInfo(cx, v, ret);
}
    
//bool jsval_to_std_map_string_string(JSContext *cx, JS::HandleValue v, std::map<std::string, std::string>* ret)
//{
//    if (v.isNullOrUndefined())
//    {
//        return true;
//    }
//    
//    JS::RootedObject tmp(cx, v.toObjectOrNull());
//    if (!tmp) {
//        CCLOG("%s", "jsval_to_ccvaluemap: the jsval is not an object.");
//        return false;
//    }
//    
//    JS::RootedObject it(cx, JS_NewPropertyIterator(cx, tmp));
//    
//    while (true)
//    {
//        jsid idp;
//        JS::RootedValue key(cx);
//        if (! JS_NextProperty(cx, it, &idp) || ! JS_IdToValue(cx, idp, &key)) {
//            return false; // error
//        }
//        
//        if (key.isNullOrUndefined()) {
//            break; // end of iteration
//        }
//        
//        if (!key.isString()) {
//            continue; // ignore integer properties
//        }
//        
//        JSStringWrapper keyWrapper(key.toString(), cx);
//        
//        JS::RootedValue value(cx);
//        JS_GetPropertyById(cx, tmp, JS::RootedId(cx, idp), &value);
//        if (value.isString())
//        {
//            JSStringWrapper valueWapper(value.toString(), cx);
//            ret->insert(std::make_pair(keyWrapper.get(), valueWapper.get()));
//        }
//        else
//        {
//            CCASSERT(false, "not a string");
//        }
//    }
//        
//    return true;
//}

jsval TProductInfo_to_jsval(JSContext *cx, TProductInfo& ret)
{
    JS::RootedObject tmp(cx, JS_NewObject(cx, nullptr, JS::NullPtr(), JS::NullPtr()));
    if (!tmp) return JSVAL_NULL;

    for (TProductInfo::iterator it = ret.begin(); it != ret.end(); ++it)
    {
        JS_DefineProperty(cx, tmp, it->first.c_str(), JS::RootedValue(cx, std_string_to_jsval(cx, it->second)), JSPROP_ENUMERATE | JSPROP_PERMANENT);
    }

    return OBJECT_TO_JSVAL(tmp);
}

//jsval TProductList_to_jsval(JSContext *cx,TProductList list){
//    JS::RootedObject tmp(cx, JS_NewArrayObject(cx, 0));
//	int i = 0;
//	for(TProductList::iterator it = list.begin();it!=list.end();++it){
//		JS::RootedValue arrElement(cx);
//
//		arrElement = TProductInfo_to_jsval(cx, *it);
//		JS_SetElement(cx, tmp, i, arrElement);
//		++i;
//	}
//	return OBJECT_TO_JSVAL(tmp);
//}
    
jsval LogEventParamMap_to_jsval(JSContext *cx, LogEventParamMap*& ret)
{// TODO:
    return JSVAL_NULL;
}

} }// namespace anysdk { namespace framework {

