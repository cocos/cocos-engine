/*
#import <Cocoa/Cocoa.h>
#import "SimulatorApp.h"

int main(int argc, const char * argv[]) {
    id delegate = [[AppController alloc] init];
    NSApplication.sharedApplication.delegate = delegate;
    return NSApplicationMain(argc, argv);
}
*/
#include <iostream>

#include "platform/BasePlatform.h"

int main(int argc, const char * argv[]) {
    START_PLATFORM(argc, (const char**)argv);
}

