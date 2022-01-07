/****************************************************************************
 Copyright (c) 2018-2021 Xiamen Yaji Software Co., Ltd.

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

#include "JavaScriptObjCBridge.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"


#include <string>
#include <vector>
#include <iostream>

#import <Foundation/Foundation.h>

se::Value static objc_to_seval(id objcVal) {
    se::Value ret;
    if (objcVal == nil)
        return ret;

    if ([objcVal isKindOfClass:[NSNumber class]]) {
        NSNumber *number = (NSNumber *)objcVal;
        std::string numberType = [number objCType];
        if (numberType == @encode(BOOL) || numberType == @encode(bool)) {
            ret.setBoolean([number boolValue]);
        } else if (numberType == @encode(int) || numberType == @encode(long) || numberType == @encode(short) || numberType == @encode(unsigned int) || numberType == @encode(unsigned long) || numberType == @encode(unsigned short) || numberType == @encode(float) || numberType == @encode(double) || numberType == @encode(char) || numberType == @encode(unsigned char)) {
            ret.setDouble([number doubleValue]);
        } else {
            CC_LOG_ERROR("Unknown number type: %s", numberType.c_str());
        }
    } else if ([objcVal isKindOfClass:[NSString class]]) {
        const char *content = [objcVal cStringUsingEncoding:NSUTF8StringEncoding];
        ret.setString(content);
    } else if ([objcVal isKindOfClass:[NSDictionary class]]) {
        CC_LOG_ERROR("JavaScriptObjCBridge doesn't support to bind NSDictionary!");
    } else {
        const char *content = [[NSString stringWithFormat:@"%@", objcVal] cStringUsingEncoding:NSUTF8StringEncoding];
        ret.setString(content);
    }

    return ret;
}
#define JSO_ERR_OK                 (0)
#define JSO_ERR_TYPE_NOT_SUPPORT   (-1)
#define JSO_ERR_INVALID_ARGUMENTS  (-2)
#define JSO_ERR_METHOD_NOT_FOUND   (-3)
#define JSO_ERR_EXCEPTION_OCCURRED (-4)
#define JSO_ERR_CLASS_NOT_FOUND    (-5)
#define JSO_ERR_VM_FAILURE         (-6)

class JavaScriptObjCBridge {
public:
    class CallInfo {
    public:
        CallInfo(const char *className, const char *methodName)
                : _className(className),
                  _methodName(methodName) {}

        ~CallInfo() {}

        int getErrorCode() const {
            return _error;
        }

        bool execute(const se::ValueArray &argv, se::Value &rval);
    private:
        int _error{JSO_ERR_OK};
        std::string _className;
        std::string _methodName;
    };
};

using JsCallback = std::function<void(const std::string&, const std::string&)>;

class ScriptNativeBridge{
public:
    void callByNative(const std::string& arg0, const std::string& arg1);
    inline void setCallback(const JsCallback& cb){
        _callback = cb;
    }
    static ScriptNativeBridge* bridgeCxxInstance;
    se::Value jsCb;
private:
    JsCallback _callback{nullptr}; // NOLINT(readability-identifier-naming)
};
ScriptNativeBridge* ScriptNativeBridge::bridgeCxxInstance{nullptr};
bool JavaScriptObjCBridge::CallInfo::execute(const se::ValueArray &argv, se::Value &rval) {
    NSString *className  = [NSString stringWithCString:_className.c_str() encoding:NSUTF8StringEncoding];
    NSString *methodName = [NSString stringWithCString:_methodName.c_str() encoding:NSUTF8StringEncoding];

    if (!className || !methodName) {
        _error = JSO_ERR_INVALID_ARGUMENTS;
        return false;
    }

    Class targetClass = NSClassFromString(className);
    if (!targetClass) {
        _error = JSO_ERR_CLASS_NOT_FOUND;
        return false;
    }
    SEL methodSel;
    methodSel = NSSelectorFromString(methodName);
    if (!methodSel) {
        _error = JSO_ERR_METHOD_NOT_FOUND;
        return false;
    }
    methodSel                    = NSSelectorFromString(methodName);
    NSMethodSignature *methodSig = [targetClass methodSignatureForSelector:(SEL)methodSel];
    if (methodSig == nil) {
        _error = JSO_ERR_METHOD_NOT_FOUND;
        NSLog(@"%@.%@ method isn't found!", className, methodName);
        return false;
    }
    @try {
        int        argc          = (int)argv.size();
        NSUInteger argumentCount = [methodSig numberOfArguments];
        if (argumentCount != argc) {
            _error = JSO_ERR_INVALID_ARGUMENTS;
            return false;
        }

        NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:methodSig];
        [invocation setTarget:targetClass];
        [invocation setSelector:methodSel];

        for (int i = 2; i < argc; ++i) {
            std::string      argumentType = [methodSig getArgumentTypeAtIndex:i];
            const se::Value &arg          = argv[i];

            /* - (void)setArgument:(void *)argumentLocation atIndex:(NSInteger)idx;
             *
             * Refer to https://developer.apple.com/documentation/foundation/nsinvocation/1437834-setargument?language=objc
             *
             * This method copies the contents of buffer as the argument at index. The number of bytes copied is determined by the argument size.
             * When the argument value is an object, pass a pointer to the variable (or memory) from which the object should be copied:
             */

            if (arg.isString()) {
                NSString *str = [NSString stringWithCString:arg.toString().c_str() encoding:NSUTF8StringEncoding];
                [invocation setArgument:&str atIndex:i];
            } else if (arg.isNumber()) {
                if (argumentType == @encode(int)) {
                    int val = arg.toInt32();
                    [invocation setArgument:&val atIndex:i];
                } else if (argumentType == @encode(long)) {
                    long val = static_cast<long>(arg.toDouble());
                    [invocation setArgument:&val atIndex:i];
                } else if (argumentType == @encode(short)) {
                    short val = arg.toInt16();
                    [invocation setArgument:&val atIndex:i];
                } else if (argumentType == @encode(unsigned int)) {
                    unsigned int val = arg.toUint32();
                    [invocation setArgument:&val atIndex:i];
                } else if (argumentType == @encode(unsigned long)) {
                    unsigned long val = static_cast<unsigned long>(arg.toDouble());
                    [invocation setArgument:&val atIndex:i];
                } else if (argumentType == @encode(unsigned short)) {
                    unsigned short val = arg.toUint16();
                    [invocation setArgument:&val atIndex:i];
                } else if (argumentType == @encode(float)) {
                    float val = arg.toFloat();
                    [invocation setArgument:&val atIndex:i];
                } else if (argumentType == @encode(double)) {
                    double val = arg.toDouble();
                    [invocation setArgument:&val atIndex:i];
                } else if (argumentType == @encode(char)) {
                    char val = arg.toInt8();
                    [invocation setArgument:&val atIndex:i];
                } else if (argumentType == @encode(unsigned char)) {
                    unsigned char val = arg.toUint8();
                    [invocation setArgument:&val atIndex:i];
                } else if (argumentType == "@") { // NSNumber*
                    NSNumber *number = [NSNumber numberWithDouble:arg.toDouble()];
                    [invocation setArgument:&number atIndex:i];
                } else {
                    NSLog(@"Unsupported argument type: %s", argumentType.c_str());
                    _error = JSO_ERR_TYPE_NOT_SUPPORT;
                    return false;
                }
            } else if (arg.isBoolean()) {
                if (argumentType == @encode(BOOL)) {
                    BOOL val = arg.toBoolean() ? YES : NO;
                    [invocation setArgument:&val atIndex:i];
                } else if (argumentType == @encode(bool)) {
                    bool val = arg.toBoolean();
                    [invocation setArgument:&val atIndex:i];
                } else {
                    NSLog(@"Unsupported argument type: %s", argumentType.c_str());
                    _error = JSO_ERR_TYPE_NOT_SUPPORT;
                    return false;
                }
            } else if (arg.isNullOrUndefined()) {
                // Don't call [invocation setArgument] will pass nil to relevant Objective-C argument.
            } else {
                NSLog(@"Unsupported argument type, se::Value::Type: %d", (int)arg.getType());
                _error = JSO_ERR_TYPE_NOT_SUPPORT;
                return false;
            }
        }

        NSUInteger  returnLength = [methodSig methodReturnLength];
        std::string returnType   = [methodSig methodReturnType];
        [invocation invoke];

        if (returnLength > 0) {
            if (returnType == "@") {
                id ret;
                [invocation getReturnValue:&ret];
                rval = objc_to_seval(ret);
            } else if (returnType == @encode(BOOL) || returnType == @encode(bool)) {
                bool ret;
                [invocation getReturnValue:&ret];
                rval.setBoolean(ret);
            } else if (returnType == @encode(int)) {
                int ret;
                [invocation getReturnValue:&ret];
                rval.setInt32(ret);
            } else if (returnType == @encode(long)) {
                long ret;
                [invocation getReturnValue:&ret];
                rval.setDouble(static_cast<long>(ret));
            } else if (returnType == @encode(short)) {
                short ret;
                [invocation getReturnValue:&ret];
                rval.setInt16(ret);
            } else if (returnType == @encode(unsigned int)) {
                unsigned int ret;
                [invocation getReturnValue:&ret];
                rval.setUint32(ret);
            } else if (returnType == @encode(unsigned long)) {
                unsigned long ret;
                [invocation getReturnValue:&ret];
                rval.setDouble(static_cast<double>(ret));
            } else if (returnType == @encode(unsigned short)) {
                unsigned short ret;
                [invocation getReturnValue:&ret];
                rval.setUint16(ret);
            } else if (returnType == @encode(float)) {
                float ret;
                [invocation getReturnValue:&ret];
                rval.setFloat(ret);
            } else if (returnType == @encode(double)) {
                double ret;
                [invocation getReturnValue:&ret];
                rval.setDouble(ret);
            } else if (returnType == @encode(char)) {
                int8_t ret;
                [invocation getReturnValue:&ret];
                rval.setInt8(ret);
            } else if (returnType == @encode(unsigned char)) {
                uint8_t ret;
                [invocation getReturnValue:&ret];
                rval.setUint8(ret);
            } else {
                _error = JSO_ERR_TYPE_NOT_SUPPORT;
                NSLog(@"not support return type = %s", returnType.c_str());
                return false;
            }
        }
    } @catch (NSException *exception) {
        NSLog(@"EXCEPTION THROW: %@", exception);
        _error = JSO_ERR_EXCEPTION_OCCURRED;
        return false;
    }

    return true;
}


void ScriptNativeBridge::callByNative(const std::string& arg0, const std::string& arg1){
    _callback(arg0, arg1);
}

se::Class *__jsb_JavaScriptObjCBridge_class = nullptr;

static bool JavaScriptObjCBridge_finalize(se::State &s) {
    return true;
}
SE_BIND_FINALIZE_FUNC(JavaScriptObjCBridge_finalize)

static bool JavaScriptObjCBridge_constructor(se::State &s) {
    JavaScriptObjCBridge *cobj = new (std::nothrow) JavaScriptObjCBridge();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(JavaScriptObjCBridge_constructor, __jsb_JavaScriptObjCBridge_class, JavaScriptObjCBridge_finalize)

static bool JavaScriptObjCBridge_callStaticMethod(se::State &s) {
    const auto &args = s.args();
    int         argc = (int)args.size();

    if (argc >= 2) {
        bool        ok = false;
        std::string clsName, methodName;
        ok = sevalue_to_native(args[0], &clsName);
        SE_PRECONDITION2(ok, false, "Converting class name failed!");

        ok = sevalue_to_native(args[1], &methodName);
        SE_PRECONDITION2(ok, false, "Converting method name failed!");

        JavaScriptObjCBridge::CallInfo call(clsName.c_str(), methodName.c_str());
        ok = call.execute(args, s.rval());
        if (!ok) {
            s.rval().setUndefined();
            SE_REPORT_ERROR("call (%s.%s) failed, result code: %d", clsName.c_str(), methodName.c_str(), call.getErrorCode());
            return false;
        }

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting >=2", argc);
    return false;
}
SE_BIND_FUNC(JavaScriptObjCBridge_callStaticMethod)

static bool ScriptNativeBridge_getCallback(se::State &s){
    ScriptNativeBridge *cobj = (ScriptNativeBridge *)s.nativeThisObject();
    assert(cobj == ScriptNativeBridge::bridgeCxxInstance);
    s.rval() = cobj->jsCb;
    SE_HOLD_RETURN_VALUE(cobj->jsCb, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(ScriptNativeBridge_getCallback)

static bool ScriptNativeBridge_setCallback(se::State &s){ //NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<ScriptNativeBridge *>(s.nativeThisObject());
    assert(cobj == ScriptNativeBridge::bridgeCxxInstance);
    const auto &args = s.args();
    se::Value jsFunc = args[0];
    cobj->jsCb = jsFunc;
    if(jsFunc.isNullOrUndefined())
    {
        cobj->setCallback(nullptr);
    }
    else{
        assert(jsFunc.isObject() && jsFunc.toObject()->isFunction());
        s.thisObject()->attachObject(jsFunc.toObject());
        cobj->setCallback([jsFunc](const std::string& arg0, const std::string& arg1){
            se::AutoHandleScope hs;
            se::ValueArray args;
            args.push_back(se::Value(arg0));
            if(!arg1.empty()) {
                args.push_back(se::Value(arg1));
            }
            jsFunc.toObject()->call(args, nullptr);
        });
    }
    return true;
}SE_BIND_PROP_SET(ScriptNativeBridge_setCallback)

static bool ScriptNativeBridge_sendToNative(se::State &s) { //NOLINT
    const auto &args = s.args();
    int argc = (int)args.size();
    if (argc >= 1 && argc < 3) {
        bool        ok = false;
        std::string arg0;
        ok = sevalue_to_native(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "Converting first argument failed!");
        std::string arg1;
        if (argc == 2) {
            ok = sevalue_to_native(args[1], &arg1);
            SE_PRECONDITION2(ok, false, "Converting second argument failed!");
        }
        ok = callPlatformStringMethod(arg0, arg1);
        SE_PRECONDITION2(ok, false, "call platform event failed!");
        return ok;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting at least %d and less than %d", argc, 1, 3);
    return false;
}
SE_BIND_FUNC(ScriptNativeBridge_sendToNative)


bool register_javascript_objc_bridge(se::Object *obj) {
    se::Class *cls = se::Class::create("JavaScriptObjCBridge", obj, nullptr, _SE(JavaScriptObjCBridge_constructor));
    cls->defineFinalizeFunction(_SE(JavaScriptObjCBridge_finalize));

    cls->defineFunction("callStaticMethod", _SE(JavaScriptObjCBridge_callStaticMethod));
    cls->install();
    __jsb_JavaScriptObjCBridge_class = cls;

    se::ScriptEngine::getInstance()->clearException();

    return true;
}



se::Class *__jsb_ScriptNativeBridge_class = nullptr; // NOLINT

static bool ScriptNativeBridge_finalize(se::State &s) { //NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<ScriptNativeBridge *>(s.nativeThisObject());
    assert(cobj == ScriptNativeBridge::bridgeCxxInstance);
    delete cobj;
    ScriptNativeBridge::bridgeCxxInstance = nullptr;
    return true;
}
SE_BIND_FINALIZE_FUNC(ScriptNativeBridge_finalize)

static bool ScriptNativeBridge_constructor(se::State &s) { //NOLINT(readability-identifier-naming)
    auto *cobj = new (std::nothrow) ScriptNativeBridge();
    s.thisObject()->setPrivateData(cobj);
    ScriptNativeBridge::bridgeCxxInstance = cobj;
    return true;
}
SE_BIND_CTOR(ScriptNativeBridge_constructor, __jsb_ScriptNativeBridge_class, ScriptNativeBridge_finalize)
bool register_script_native_bridge(se::Object *obj) { //NOLINT(readability-identifier-naming)
    se::Class *cls = se::Class::create("ScriptNativeBridge", obj, nullptr, _SE(ScriptNativeBridge_constructor));
    cls->defineFinalizeFunction(_SE(ScriptNativeBridge_finalize));
    cls->defineFunction("sendToNative", _SE(ScriptNativeBridge_sendToNative));
    cls->defineProperty("onNative", _SE(ScriptNativeBridge_getCallback), _SE(ScriptNativeBridge_setCallback));

    cls->install();
    __jsb_ScriptNativeBridge_class = cls;

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
void callScript(const std::string& arg0, const std::string& arg1){
    ScriptNativeBridge::bridgeCxxInstance->callByNative(arg0, arg1);
}
