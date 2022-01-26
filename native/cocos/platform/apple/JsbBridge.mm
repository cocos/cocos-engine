/****************************************************************************
 Copyright (c) 2018-2022 Xiamen Yaji Software Co., Ltd.

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

#include "JsbBridge.h"
#import <Foundation/Foundation.h>
#include <string>
#include "cocos/bindings/manual/JavaScriptObjCBridge.h"

bool callPlatformStringMethod(const std::string &arg0, const std::string &arg1) {
    NSString  *oc_arg0 = [NSString stringWithCString:arg0.c_str() encoding:NSUTF8StringEncoding];
    NSString  *oc_arg1 = [NSString stringWithCString:arg1.c_str() encoding:NSUTF8StringEncoding];
    JsbBridge *m       = [JsbBridge sharedInstance];
    [m callByScript:oc_arg0 arg1:oc_arg1];
    return true;
}

@implementation JsbBridge {
    ICallback callback;
}

static JsbBridge *instance = nil;

+ (instancetype)sharedInstance {
    static dispatch_once_t pred = 0;
    dispatch_once(&pred, ^{
        instance = [[super allocWithZone:NULL] init];
    });
    return instance;
}

+ (id)allocWithZone:(struct _NSZone *)zone {
    return [JsbBridge sharedInstance];
}

- (id)copyWithZone:(struct _NSZone *)zone {
    return [JsbBridge sharedInstance];
}

- (id)init {
    self = [super init];
    return self;
}

- (void)setCallback:(ICallback)cb {
    callback = cb;
}

- (bool)callByScript:(NSString *)arg0 arg1:(NSString *)arg1 {
    if (callback != nil) {
        callback(arg0, arg1);
        return true;
    }
    return false;
}

- (void)sendToScript:(NSString *)arg0 arg1:(NSString *)arg1 {
    const std::string c_arg0{[arg0 UTF8String]};
    const std::string c_arg1{[arg1 UTF8String]};
    callScript(c_arg0, c_arg1);
}

- (void)sendToScript:(NSString *)arg0 {
    const std::string c_arg0{[arg0 UTF8String]};
    callScript(c_arg0, "");
}

@end
