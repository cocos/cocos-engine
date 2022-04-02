/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

#ifdef __cplusplus
extern "C" {
#endif

NSString * JSValueToNSString(JSContextRef ctx, JSValueRef v);
JSValueRef NSStringToJSValue(JSContextRef ctx, NSString *string);
double     JSValueToNumberFast(JSContextRef ctx, JSValueRef v);
void       JSValueUnprotectSafe(JSContextRef ctx, JSValueRef v);
JSValueRef NSObjectToJSValue(JSContextRef ctx, NSObject *obj);
NSObject * JSValueToNSObject(JSContextRef ctx, JSValueRef value);

static inline void *JSValueGetPrivate(JSValueRef v) {
    // On 64bit systems we can not safely call JSObjectGetPrivate with any
    // JSValueRef. Doing so with immediate values (numbers, null, bool,
    // undefined) will crash the app. So we check for these first.

#if __LP64__
    return !((int64_t)v & 0xffff000000000002ll)
               ? JSObjectGetPrivate((JSObjectRef)v)
               : NULL;
#else
    return JSObjectGetPrivate((JSObjectRef)v);
#endif
}

#ifdef __cplusplus
}
#endif
