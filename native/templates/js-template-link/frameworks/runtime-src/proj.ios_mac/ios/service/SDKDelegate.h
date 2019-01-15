//
//  SDKWrapperDelegate.h
//  polish_project-mobile
//
//  Created by 杨欣 on 2018/10/22.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol SDKDelegate <NSObject>

@optional
- (void) optionalFunction;
- (void)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
- (void)applicationDidBecomeActive:(UIApplication *)application;
- (void)applicationWillResignActive:(UIApplication *)application;
- (void)applicationDidEnterBackground:(UIApplication *)application;
- (void)applicationWillEnterForeground:(UIApplication *)application;
- (void)applicationWillTerminate:(UIApplication *)application;

@end

NS_ASSUME_NONNULL_END
