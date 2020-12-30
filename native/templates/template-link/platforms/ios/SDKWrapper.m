//
//  SDKWrapper.m
//  polish_project-mobile
//
//  Created by 杨欣 on 2018/10/20.
//

#import "SDKWrapper.h"
#import "SDKDelegate.h"

@interface SDKWrapper ()

@property (nonatomic, strong) NSArray *sdkClasses;

@end

@implementation SDKWrapper

#pragma mark -
#pragma mark Singleton

static SDKWrapper *mInstace = nil;

+ (instancetype)getInstance {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        mInstace = [[super allocWithZone:NULL] init];
        [mInstace initSDKWrapper];
    });
    return mInstace;
}
+ (id)allocWithZone:(struct _NSZone *)zone {
    return [SDKWrapper getInstance];
}

+ (id)copyWithZone:(struct _NSZone *)zone {
    return [SDKWrapper getInstance];
}

#pragma mark -
#pragma mark Application lifecycle
- (void)initSDKWrapper {
    [self loadSDKClass];
}

- (void)loadSDKClass {
    NSString *path = [NSString stringWithFormat:@"%@/project.json",
                      [[NSBundle mainBundle] resourcePath]];
    NSData *data = [NSData dataWithContentsOfFile:path options:NSDataReadingMappedIfSafe error:nil];
    id obj = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    id dic = obj[@"serviceClassPath"];
    NSLog(@"%@",dic);
    NSMutableArray *sdks = [NSMutableArray array];
    for (NSString *str in dic) {
        @try {
            NSString *className = [[str componentsSeparatedByString:@"."] lastObject];
            NSLog(@"%@",className);
            Class c = NSClassFromString(className);
            id sdk = [[c alloc] init];
            [sdks addObject:sdk];
            NSLog(@"%@",sdk);
        } @catch (NSException *e) {
            NSLog(@"%@",@"NSException");
            NSLog(@"%@",e);
        }
    }
    self.sdkClasses = [NSArray arrayWithArray:sdks];
}

/**
 app显示给用户之前执行最后的初始化操作
 */
- (void)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    for (id <SDKDelegate> sdk in self.sdkClasses) {
        if ([sdk respondsToSelector:@selector(application:didFinishLaunchingWithOptions:)]) {
            [sdk application:application didFinishLaunchingWithOptions:launchOptions];
        }
    }
    
}

/**
 app已经切换到active状态后需要执行的操作
 */
- (void)applicationDidBecomeActive:(UIApplication *)application {
    for (id sdk in self.sdkClasses) {
        if ([sdk respondsToSelector:@selector(applicationDidBecomeActive:)]) {
            [sdk applicationDidBecomeActive:application];
        }
    }
}
/**
 app将要从前台切换到后台时需要执行的操作
 */
- (void)applicationWillResignActive:(UIApplication *)application {
    for (id sdk in self.sdkClasses) {
        if ([sdk respondsToSelector:@selector(applicationWillResignActive:)]) {
            [sdk applicationWillResignActive:application];
        }
    }
}
/**
 app已经进入后台后需要执行的操作
 */
- (void)applicationDidEnterBackground:(UIApplication *)application {
    for (id sdk in self.sdkClasses) {
        if ([sdk respondsToSelector:@selector(applicationDidEnterBackground:)]) {
            [sdk applicationDidEnterBackground:application];
        }
    }
}
/**
 app将要从后台切换到前台需要执行的操作，但app还不是active状态
 */
- (void)applicationWillEnterForeground:(UIApplication *)application {
    for (id sdk in self.sdkClasses) {
        if ([sdk respondsToSelector:@selector(applicationWillEnterForeground:)]) {
            [sdk applicationWillEnterForeground:application];
        }
    }
}
/**
 app将要结束时需要执行的操作
 */
- (void)applicationWillTerminate:(UIApplication *)application {
    for (id sdk in self.sdkClasses) {
        if ([sdk respondsToSelector:@selector(applicationWillTerminate:)]) {
            [sdk applicationWillTerminate:application];
        }
    }
}

@end
