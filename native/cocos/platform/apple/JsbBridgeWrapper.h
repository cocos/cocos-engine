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
#pragma once
#import <Foundation/Foundation.h>

typedef void (^eventCallback)(NSString*);

@interface JsbBridgeWrapper : NSObject
/**
 * Get the instance of JsbBridgetWrapper
 */
+ (instancetype)sharedInstance;
/**
 * add a callback to specified event, if the event does not exist, the wrapper will create one
 */
- (void)addCallback:(NSString*)event callback:(eventCallback)callback;
/**
 * remove callback for specified event, concurrent event will be deleted.
 */
- (bool)removeCallback:(NSString*)event callback:(eventCallback)callback;
/**
 * Return true if successfully remove the callback, false if event does not exist
 */
- (void)removeEvent:(NSString*)event;
/**
 * Dispatch the event with argument, the event should be regiestered in javascript, or other script language in future.
 */
- (void)dispatchScriptEvent:(NSString*)name arg:(NSString*)arg;
/**
 * Dispatch the event which is regiestered in javascript, or other script language in future.
 */
- (void)dispatchScriptEvent:(NSString*)name;
@end
