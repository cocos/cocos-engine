#import "ViewController.h"
#import "platform/mac/View.h"

@implementation ViewController
{
    View* _view;
}

- (instancetype)initWithSize:(NSRect)rect {
    if (self = [super init]) {
        _view = [[View alloc] initWithFrame:rect];
        self.view = _view;
    }
    return self;
}

@end
