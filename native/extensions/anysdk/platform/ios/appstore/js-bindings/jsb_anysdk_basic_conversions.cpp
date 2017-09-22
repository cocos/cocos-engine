#include "jsb_anysdk_basic_conversions.h"
#include <math.h>

#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/manual/js_manual_conversions.h"
#include <sstream>

namespace anysdk { namespace framework {
    
    bool jsval_to_LogEventParamMap(JSContext *cx, JS::HandleValue v, LogEventParamMap** ret)
    {
        bool jsret = false;
        if (v.isObject())
        {
            LogEventParamMap* tmp = new LogEventParamMap();
            jsret = jsval_to_std_map_string_string(cx, v, tmp);
            if (jsret) {
                *ret = tmp;
            }
        }
        
        return jsret;
    }
    
    bool jsval_to_StringMap(JSContext *cx, JS::HandleValue v, StringMap* ret)
    {
        return jsval_to_std_map_string_string(cx, v, ret);
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
    
    bool LogEventParamMap_to_jsval(JSContext *cx, LogEventParamMap*& map, JS::MutableHandleValue ret)
    {// TODO:
        ret.set(JS::NullHandleValue);
        return true;
    }
    
} }// namespace anysdk { namespace framework {

