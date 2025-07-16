/****************************************************************************
 Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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

typedef void (^OnScriptEventListener)(NSString*);

@interface JsbBridgeWrapper : NSObject
/**
 * Get the instance of JsbBridgetWrapper
 */
+ (instancetype)sharedInstance;
/**
 * Add a listener to specified event, if the event does not exist, the wrapper will create one. Concurrent listener will be ignored
 */
- (void)addScriptEventListener:(NSString*)eventName listener:(OnScriptEventListener)listener;
/**
 * Remove listener for specified event, concurrent event will be deleted. Return false only if the event does not exist
 */
- (bool)removeScriptEventListener:(NSString*)eventName listener:(OnScriptEventListener)listener;
/**
 * Remove all listener for event specified.
 */
- (void)removeAllListenersForEvent:(NSString*)eventName;
/**
 * Remove all event registered. Use it carefully!
 */
- (void)removeAllListeners;
/**
 * Dispatch the event with argument, the event should be registered in javascript, or other script language in future.
 */
- (void)dispatchEventToScript:(NSString*)eventName arg:(NSString*)arg;
/**
 * Dispatch the event which is registered in javascript, or other script language in future.
 */
- (void)dispatchEventToScript:(NSString*)eventName;
@end
