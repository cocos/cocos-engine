/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "platform/ios/modules/Accelerometer.h"
#import <UIKit/UIKit.h>
// Accelerometer
#include <CoreFoundation/CoreFoundation.h>
#import <CoreMotion/CoreMotion.h>
#include <CoreText/CoreText.h>
#include "platform/interfaces/modules/IAccelerometer.h"

static const float g        = 9.80665;
static const float radToDeg = (180 / M_PI);

@interface CCMotionDispatcher : NSObject <UIAccelerometerDelegate> {
    CMMotionManager *               _motionManager;
    cc::IAccelerometer::MotionValue _motionValue;
    float                           _interval; // unit: seconds
    bool                            _enabled;
}

+ (id)sharedMotionDispatcher;
- (id)init;
- (void)setMotionEnabled:(bool)isEnabled;
- (void)setMotionInterval:(float)interval;

@end

@implementation CCMotionDispatcher

static CCMotionDispatcher *__motionDispatcher = nullptr;

+ (id)sharedMotionDispatcher {
    if (__motionDispatcher == nil) {
        __motionDispatcher = [[CCMotionDispatcher alloc] init];
    }

    return __motionDispatcher;
}

- (id)init {
    if ((self = [super init])) {
        _enabled       = false;
        _interval      = 1.0f / 60.0f;
        _motionManager = [[CMMotionManager alloc] init];
    }
    return self;
}

- (void)dealloc {
    __motionDispatcher = nullptr;
    [_motionManager release];
    [super dealloc];
}

- (void)setMotionEnabled:(bool)enabled {
    if (_enabled == enabled)
        return;

    bool isDeviceMotionAvailable = _motionManager.isDeviceMotionAvailable;
    if (enabled) {
        // Has Gyro? (iPhone4 and newer)
        if (isDeviceMotionAvailable) {
            [_motionManager startDeviceMotionUpdates];
            _motionManager.deviceMotionUpdateInterval = _interval;
        }
        // Only basic accelerometer data
        else {
            [_motionManager startAccelerometerUpdates];
            _motionManager.accelerometerUpdateInterval = _interval;
        }
    } else {
        // Has Gyro? (iPhone4 and newer)
        if (isDeviceMotionAvailable) {
            [_motionManager stopDeviceMotionUpdates];
        }
        // Only basic accelerometer data
        else {
            [_motionManager stopAccelerometerUpdates];
        }
    }
    _enabled = enabled;
}

- (void)setMotionInterval:(float)interval {
    _interval = interval;
    if (_enabled) {
        if (_motionManager.isDeviceMotionAvailable) {
            _motionManager.deviceMotionUpdateInterval = _interval;
        } else {
            _motionManager.accelerometerUpdateInterval = _interval;
        }
    }
}

- (const cc::IAccelerometer::MotionValue &)getMotionValue {
    if (_motionManager.isDeviceMotionAvailable) {
        CMDeviceMotion *motion     = _motionManager.deviceMotion;
        _motionValue.accelerationX = motion.userAcceleration.x * g;
        _motionValue.accelerationY = motion.userAcceleration.y * g;
        _motionValue.accelerationZ = motion.userAcceleration.z * g;

        _motionValue.accelerationIncludingGravityX = (motion.userAcceleration.x + motion.gravity.x) * g;
        _motionValue.accelerationIncludingGravityY = (motion.userAcceleration.y + motion.gravity.y) * g;
        _motionValue.accelerationIncludingGravityZ = (motion.userAcceleration.z + motion.gravity.z) * g;

        _motionValue.rotationRateAlpha = motion.rotationRate.x * radToDeg;
        _motionValue.rotationRateBeta  = motion.rotationRate.y * radToDeg;
        _motionValue.rotationRateGamma = motion.rotationRate.z * radToDeg;
    } else {
        CMAccelerometerData *acc                   = _motionManager.accelerometerData;
        _motionValue.accelerationIncludingGravityX = acc.acceleration.x * g;
        _motionValue.accelerationIncludingGravityY = acc.acceleration.y * g;
        _motionValue.accelerationIncludingGravityZ = acc.acceleration.z * g;
    }

    return _motionValue;
}

@end

//

namespace cc {
void Accelerometer::setAccelerometerEnabled(bool isEnabled) {
}

void Accelerometer::setAccelerometerInterval(float interval) {
}

const Accelerometer::MotionValue &Accelerometer::getDeviceMotionValue() {
#if !defined(CC_TARGET_OS_TVOS)
    return [[CCMotionDispatcher sharedMotionDispatcher] getMotionValue];
#else
    static Device::MotionValue ret;
    return ret;
#endif
}

} // namespace cc
