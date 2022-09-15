/****************************************************************************
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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
#import "SDKWrapper.h"

@interface SDKWrapper ()

@property (nonatomic, strong) NSArray *serviceInstances;

@end

@implementation SDKWrapper

#pragma mark -
#pragma mark Singleton

static SDKWrapper *mInstace = nil;

+ (instancetype)shared {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        mInstace = [[super allocWithZone:NULL] init];
        [mInstace initSDKWrapper];
    });
    return mInstace;
}
+ (id)allocWithZone:(struct _NSZone *)zone {
    return [SDKWrapper shared];
}

+ (id)copyWithZone:(struct _NSZone *)zone {
    return [SDKWrapper shared];
}

#pragma mark -
#pragma mark private methods
- (void)initSDKWrapper {
    [self loadSDKClass];
}

- (void)loadSDKClass {
    NSMutableArray *sdks = [NSMutableArray array];
    @try {
        NSString *path = [NSString stringWithFormat:@"%@/service.json", [[NSBundle mainBundle] resourcePath]];
        NSData *data = [NSData dataWithContentsOfFile:path options:NSDataReadingMappedIfSafe error:nil];
        id obj = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        id dic = obj[@"serviceClasses"];
        if (dic == nil) @throw [[NSException alloc] initWithName:@"JSON Exception" reason:@"serviceClasses not found" userInfo:nil];
        for (NSString *str in dic) {
            NSString *className = [[str componentsSeparatedByString:@"."] lastObject];
            Class clazz = NSClassFromString(className);
            if (clazz == nil) @throw [[NSException alloc] initWithName:@"Cass Exception"
                                                            reason:[NSString stringWithFormat:@"class '%@' not found", className]
                                                          userInfo:nil];
            id sdk = [[clazz alloc] init];
            [sdks addObject:sdk];
        }
    } @catch (NSException *e) {
    }
    self.serviceInstances = [NSArray arrayWithArray:sdks];
}

#pragma mark -
#pragma mark Application lifecycle
- (void)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    for (id <SDKDelegate> sdk in self.serviceInstances) {
        if ([sdk respondsToSelector:@selector(application:didFinishLaunchingWithOptions:)]) {
            [sdk application:application didFinishLaunchingWithOptions:launchOptions];
        }
    }
    
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    for (id sdk in self.serviceInstances) {
        if ([sdk respondsToSelector:@selector(applicationDidBecomeActive:)]) {
            [sdk applicationDidBecomeActive:application];
        }
    }
}

- (void)applicationWillResignActive:(UIApplication *)application {
    for (id sdk in self.serviceInstances) {
        if ([sdk respondsToSelector:@selector(applicationWillResignActive:)]) {
            [sdk applicationWillResignActive:application];
        }
    }
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    for (id sdk in self.serviceInstances) {
        if ([sdk respondsToSelector:@selector(applicationDidEnterBackground:)]) {
            [sdk applicationDidEnterBackground:application];
        }
    }
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    for (id sdk in self.serviceInstances) {
        if ([sdk respondsToSelector:@selector(applicationWillEnterForeground:)]) {
            [sdk applicationWillEnterForeground:application];
        }
    }
}

- (void)applicationWillTerminate:(UIApplication *)application {
    for (id sdk in self.serviceInstances) {
        if ([sdk respondsToSelector:@selector(applicationWillTerminate:)]) {
            [sdk applicationWillTerminate:application];
        }
    }
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    for (id sdk in self.serviceInstances) {
        if ([sdk respondsToSelector:@selector(applicationDidReceiveMemoryWarning:)]) {
            [sdk applicationDidReceiveMemoryWarning:application];
        }
    }
}

@end
