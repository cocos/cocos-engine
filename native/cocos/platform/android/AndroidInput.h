#pragma once

#include <cstdint>

namespace cc {

class AndroidPlatform;

/**
 * The maximum number of pointers returned inside a motion event.
 */
#define MAX_NUM_POINTERS_IN_MOTION_EVENT 8

/**
 * The maximum number of axes supported in an Android MotionEvent.
 * See https://developer.android.com/ndk/reference/group/input.
 */
#define POINTER_INFO_AXIS_COUNT 48

typedef struct AndroidPointerAxes {
    int32_t id;
    int32_t toolType;
    float axisValues[POINTER_INFO_AXIS_COUNT];
    float rawX;
    float rawY;
} AndroidPointerAxes;

using AndroidMotionEvent =  struct AndroidMotionEvent {
    int32_t windowId;
    int32_t deviceId;
    int32_t source;
    int32_t action;

    int64_t eventTime;
    int64_t downTime;

    int32_t flags;
    int32_t metaState;

    int32_t actionButton;
    int32_t buttonState;
    int32_t classification;
    int32_t edgeFlags;

    uint32_t pointerCount;
    AndroidPointerAxes
            pointers[MAX_NUM_POINTERS_IN_MOTION_EVENT];

    float precisionX;
    float precisionY;

    int historySize;
    int64_t* historicalEventTimesMillis;
    int64_t* historicalEventTimesNanos;
    float* historicalAxisValues;

};

using AndroidKeyEvent = struct AndroidKeyEvent {
    int32_t windowId;
    int32_t deviceId;
    int32_t source;
    int32_t action;

    int64_t eventTime;
    int64_t downTime;

    int32_t flags;
    int32_t metaState;

    int32_t modifiers;
    int32_t repeatCount;
    int32_t keyCode;
};


class AndroidInput {
    void processInput(AndroidPlatform* platform);
private:
    void processKeyEvent();
    void processMotionEvent();
    void processGameController();
};

} // namespace cc
