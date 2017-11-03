#import "jsb_platform_ios.h"

@implementation JSB_PlatformIOS

+ (NSString*) getChannelID
{
    NSString* File = [[NSBundle mainBundle] pathForResource:@"Info" ofType:@"plist"];
    NSMutableDictionary* dict = [NSMutableDictionary dictionaryWithContentsOfFile:File];
    id channelId = [dict objectForKey:@"ASC_ChannelID"];
    if (nil != channelId) {
        return channelId;
    }
    return @"";
}

@end
