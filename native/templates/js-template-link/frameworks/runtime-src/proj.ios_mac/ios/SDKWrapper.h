//
//  SDKWrapper.h
//  polish_project-mobile
//
//  Created by 杨欣 on 2018/10/20.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface SDKWrapper : NSObject
@property(nonatomic,strong) NSString *name;
+ (instancetype)getInstance;
// iOS应用生命周期
- (void)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
- (void)applicationDidBecomeActive:(UIApplication *)application;
- (void)applicationWillResignActive:(UIApplication *)application;
- (void)applicationDidEnterBackground:(UIApplication *)application;
- (void)applicationWillEnterForeground:(UIApplication *)application;
- (void)applicationWillTerminate:(UIApplication *)application;
@end

NS_ASSUME_NONNULL_END
