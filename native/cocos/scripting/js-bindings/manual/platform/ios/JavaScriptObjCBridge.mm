/*
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

#import <Foundation/Foundation.h>

#import "scripting/js-bindings/manual/platform/ios/JavaScriptObjCBridge.h"
#include "scripting/js-bindings/manual/spidermonkey_specifics.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/js_manual_conversions.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"

JavaScriptObjCBridge::CallInfo::~CallInfo(void)
{
    if (m_returnType == TypeString)
    {
        delete m_ret.stringValue;
    }
}
JS::Value JavaScriptObjCBridge::convertReturnValue(JSContext *cx, ReturnValue retValue, ValueType type)
{
    JS::RootedValue ret(cx);

    switch (type)
    {
        case TypeInteger:
            ret = JS::Int32Value(retValue.intValue);
            break;
        case TypeFloat:
            ret = JS::DoubleValue((double)retValue.floatValue);
            break;
        case TypeBoolean:
            ret = JS::BooleanValue(retValue.boolValue);
            break;
        case TypeString:
            c_string_to_jsval(cx, retValue.stringValue->c_str(), &ret, retValue.stringValue->size());
            break;
        case TypeVoid:
            break;
        default:
            break;
    }

    return ret;
}

bool JavaScriptObjCBridge::CallInfo::execute(JSContext *cx,JS::Value *argv,unsigned argc)
{

    NSString *className =[NSString stringWithCString: m_className.c_str() encoding:NSUTF8StringEncoding];
    NSString *methodName = [NSString stringWithCString: m_methodName.c_str() encoding:NSUTF8StringEncoding];

    NSMutableDictionary *m_dic = [NSMutableDictionary dictionary];
    JS::RootedValue arg(cx);
    for(int i = 2; i<argc; i++){
        arg = argv[i];
        NSString *key = [NSString stringWithFormat:@"argument%d" ,i-2];

        if(arg.isObject() || arg.isObject()){
            m_dic = NULL;
            m_error = JSO_ERR_TYPE_NOT_SUPPORT;
            return false;
        }else if(arg.isString()){
            JS::RootedString valuestr(cx, arg.toString());
            JSStringWrapper valueWapper(valuestr, cx);
            [m_dic setObject:[NSString stringWithCString:valueWapper.get() encoding:NSUTF8StringEncoding] forKey:key];
        }else if(arg.isNumber()){
            double a = arg.toNumber();
            [m_dic setObject:[NSNumber numberWithFloat:a] forKey:key];
        }else if(arg.isBoolean()){
            bool a = arg.toBoolean();
            [m_dic setObject:[NSNumber numberWithBool:a] forKey:key];
        }
    }
    if(!className || !methodName){
        m_error = JSO_ERR_INVALID_AEGUMENTS;
        return false;
    }
    Class targetClass = NSClassFromString(className);
    if(!targetClass){
        m_error = JSO_ERR_CLASS_NOT_FOUND;
        return false;
    }
    SEL methodSel;
    methodSel = NSSelectorFromString(methodName);
    if(!methodSel){
        m_error = JSO_ERR_METHOD_NOT_FOUND;
        return false;
    }
    methodSel = NSSelectorFromString(methodName);
    NSMethodSignature *methodSig = [targetClass methodSignatureForSelector:(SEL)methodSel];
    if(methodSig == nil){
        m_error =  JSO_ERR_METHOD_NOT_FOUND;
        return false;
    }
    @try {
        NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:methodSig];
        [invocation setTarget:targetClass];
        [invocation setSelector:methodSel];
        if(m_dic != nil){
            for(int i = 2;i<m_dic.count+2;i++){
                id obj = [m_dic objectForKey:[NSString stringWithFormat:@"argument%d",i-2] ];

                if ([obj isKindOfClass:[NSNumber class]] &&
                    ((strcmp([obj objCType], "c") == 0 || strcmp([obj objCType], "B") == 0))) //BOOL
                {
                    bool b = [obj boolValue];
                    [invocation setArgument:&b atIndex:i];
                }
                else
                {
                    [invocation setArgument:&obj atIndex:i];
                }
            }
        }
        NSUInteger returnLength = [methodSig methodReturnLength];
        const char *returnType = [methodSig methodReturnType];
        [invocation invoke];

        if(returnLength >0){
            if (strcmp(returnType, "@") == 0)
            {
                id ret;
                [invocation getReturnValue:&ret];
                pushValue(ret);
            }
            else if (strcmp(returnType, "c") == 0 || strcmp(returnType, "B") == 0) // BOOL
            {
                char ret;
                [invocation getReturnValue:&ret];
                m_ret.boolValue = ret;
                m_returnType = TypeBoolean;
            }
            else if (strcmp(returnType, "i") == 0) // int
            {
                int ret;
                [invocation getReturnValue:&ret];
                m_ret.intValue = ret;
                m_returnType = TypeInteger;
            }
            else if (strcmp(returnType, "f") == 0) // float
            {
                float ret;
                [invocation getReturnValue:&ret];
                m_ret.floatValue = ret;
                m_returnType = TypeFloat;
            }
            else
            {
                m_error = JSO_ERR_TYPE_NOT_SUPPORT;
                NSLog(@"not support return type = %s", returnType);
                return false;
            }
        }else{
            m_returnType = TypeVoid;
        }
    }@catch(NSException *exception){
        NSLog(@"EXCEPTION THROW: %@", exception);
        m_error = JSO_ERR_EXCEPTION_OCCURRED;
        return false;
    }

    return true;
}
void JavaScriptObjCBridge::CallInfo::pushValue(void *val){
    id oval = (id)val;
    if (oval == nil)
    {
        return;
    }
    else if ([oval isKindOfClass:[NSNumber class]])
    {
        NSNumber *number = (NSNumber *)oval;
        const char *numberType = [number objCType];
        if (strcmp(numberType, @encode(BOOL)) == 0)
        {
            m_ret.boolValue = [number boolValue];
            m_returnType = TypeBoolean;
        }
        else if (strcmp(numberType, @encode(int)) == 0)
        {
            m_ret.intValue = [number intValue];
            m_returnType = TypeInteger;
        }
        else
        {
            m_ret.floatValue = [number floatValue];
            m_returnType = TypeFloat;
        }
    }
    else if ([oval isKindOfClass:[NSString class]])
    {
        const char *content = [oval cStringUsingEncoding:NSUTF8StringEncoding];
        m_ret.stringValue = new (std::nothrow) string(content);
        m_returnType = TypeString;
    }
    else if ([oval isKindOfClass:[NSDictionary class]])
    {

    }
    else
    {
        const char *content = [[NSString stringWithFormat:@"%@", oval] cStringUsingEncoding:NSUTF8StringEncoding];
        m_ret.stringValue =  new string(content);
        m_returnType = TypeString;
    }
}
/**
 *  @brief Initialize Object and needed properties.
 *
 */
JS_BINDED_CLASS_GLUE_IMPL(JavaScriptObjCBridge);

/**
 *  @brief Implementation for the Javascript Constructor
 *
 */
JS_BINDED_CONSTRUCTOR_IMPL(JavaScriptObjCBridge)
{
    JavaScriptObjCBridge* jsj = new (std::nothrow) JavaScriptObjCBridge();

    JS::RootedValue ret(cx);

    JS::RootedObject proto(cx, JavaScriptObjCBridge::js_proto);
    ret.set(JS::ObjectOrNullValue(proto));
    JS::RootedObject obj(cx, JS_NewObjectWithGivenProto(cx, JavaScriptObjCBridge::js_class, proto));
    ret.set(JS::ObjectOrNullValue(obj));
    js_add_FinalizeHook(cx, obj, false);
    jsb_new_proxy(cx, jsj, obj);
    
    if (obj) {
        JS_SetPrivate(obj.get(), jsj);
        ret = JS::ObjectOrNullValue(obj);
    }

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().set(ret);
    return true;
}

/**
 *  @brief destructor for Javascript
 *
 */
static void JavaScriptObjCBridge_finalize(JSFreeOp *freeOp, JSObject *obj)
{
    CCLOG("JavaScriptObjCBridge_finalize %p ...", obj);
    JavaScriptObjCBridge *nobj = static_cast<JavaScriptObjCBridge *>(JS_GetPrivate(obj));
    if (nobj) {
        CC_SAFE_DELETE(nobj);
    }
}

JS_BINDED_FUNC_IMPL(JavaScriptObjCBridge, callStaticMethod){
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc >= 2) {
        JS::RootedString valuestr0(cx, args.get(0).toString());
        JSStringWrapper arg0(valuestr0, cx);
        JS::RootedString valuestr1(cx, args.get(1).toString());
        JSStringWrapper arg1(valuestr1, cx);
        CallInfo call(arg0.get(),arg1.get());
        bool ok = call.execute(cx,args.array(),argc);
        if(!ok){
            JS_ReportErrorUTF8(cx, "js_cocos2dx_JSObjCBridge : call result code: %d", call.getErrorCode());
            return false;
        }
        args.rval().set(convertReturnValue(cx, call.getReturnValue(), call.getReturnValueType()));
        return ok;
    }
    else {
        JS_ReportErrorUTF8(cx, "js_cocos2dx_JSObjCBridge : require at least the class name and the static method name");
        return false;
    }
}

/**
 *  @brief register JavascriptJavaBridge to be usable in js
 *
 */
void JavaScriptObjCBridge::_js_register(JSContext *cx, JS::HandleObject global)
{
    static const JSClassOps jsclassOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        JavaScriptObjCBridge_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass ObjCBridge_Class = {
        "JavaScriptObjCBridge",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &jsclassOps
    };
    JavaScriptObjCBridge::js_class = &ObjCBridge_Class;
    
    static JSFunctionSpec funcs[] = {
        JS_BINDED_FUNC_FOR_DEF(JavaScriptObjCBridge, callStaticMethod),
        JS_FS_END
    };
    
    JS::RootedObject parent_proto(cx, nullptr);
    JavaScriptObjCBridge::js_proto = JS_InitClass(cx, global, parent_proto, JavaScriptObjCBridge::js_class, JavaScriptObjCBridge::_js_constructor, 0, nullptr, funcs, nullptr, nullptr);
    JS::RootedObject proto(cx, JavaScriptObjCBridge::js_proto);
    jsb_register_class<JavaScriptObjCBridge>(cx, JavaScriptObjCBridge::js_class, proto);
    
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "JavaScriptObjCBridge", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
}

