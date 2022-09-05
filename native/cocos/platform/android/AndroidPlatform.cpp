/****************************************************************************
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include <thread>

#include "base/Log.h"
#include "base/memory/Memory.h"
#include "bindings/event/CustomEventTypes.h"
#include "game-activity/native_app_glue/android_native_app_glue.h"
#include "java/jni/JniHelper.h"
#include "modules/Screen.h"
#include "modules/System.h"
#include "platform/BasePlatform.h"
#include "platform/android/AndroidPlatform.h"
#include "platform/android/FileUtils-android.h"
#include "platform/java/jni/JniImp.h"
#include "platform/java/jni/glue/JniNativeGlue.h"
#include "platform/java/modules/Accelerometer.h"
#include "platform/java/modules/Battery.h"
#include "platform/java/modules/Network.h"
#include "platform/java/modules/SystemWindow.h"
#include "platform/java/modules/Vibrator.h"

#include "bindings/event/EventDispatcher.h"

#include "paddleboat.h"

#define ABORT_GAME                          \
    {                                       \
        CC_LOG_ERROR("*** GAME ABORTING."); \
        *((volatile char *)0) = 'a';        \
    }

#define ABORT_IF(cond)                                   \
    {                                                    \
        if (!(cond)) {                                   \
            CC_LOG_ERROR("ASSERTION FAILED: %s", #cond); \
            ABORT_GAME;                                  \
        }                                                \
    }

#define INPUT_ACTION_COUNT 6

//Interval time per frame, in milliseconds
#define LOW_FREQUENCY_TIME_INTERVAL 50

//Maximum runtime of game threads while in the background, in seconds
#define LOW_FREQUENCY_EXPIRED_DURATION_SECONDS 60

#define CC_ENABLE_SUSPEND_GAME_THREAD true

extern int cocos_main(int argc, const char **argv); // NOLINT(readability-identifier-naming)

namespace cc {

struct cc::TouchEvent touchEvent;
struct cc::KeyboardEvent keyboardEvent;
static uint32_t prevButtonsDown = 0;

struct InputAction {
    uint32_t buttonMask{0};
    int32_t actionCode{-1};
};

static const InputAction PADDLEBOAT_ACTIONS[INPUT_ACTION_COUNT] = {
    {PADDLEBOAT_BUTTON_A, static_cast<int>(KeyCode::ENTER)},
    {PADDLEBOAT_BUTTON_B, static_cast<int>(KeyCode::ESCAPE)},
    {PADDLEBOAT_BUTTON_DPAD_UP, static_cast<int>(KeyCode::DPAD_UP)},
    {PADDLEBOAT_BUTTON_DPAD_LEFT, static_cast<int>(KeyCode::DPAD_LEFT)},
    {PADDLEBOAT_BUTTON_DPAD_DOWN, static_cast<int>(KeyCode::DPAD_DOWN)},
    {PADDLEBOAT_BUTTON_DPAD_RIGHT, static_cast<int>(KeyCode::DPAD_RIGHT)}};
static bool keyState[INPUT_ACTION_COUNT] = {false};

extern void gameControllerStatusCallback(int32_t controllerIndex,
                                         Paddleboat_ControllerStatus status,
                                         void *userData);

class GameInputProxy {
public:
    explicit GameInputProxy(AndroidPlatform *platform) {
        _androidPlatform = platform;
        if (0 != platform->_app->activity->vm->AttachCurrentThread(&_jniEnv, nullptr)) {
            CC_LOG_FATAL("*** FATAL ERROR: Failed to attach thread to JNI.");
            ABORT_GAME
        }
        ABORT_IF(_jniEnv != nullptr)

        Paddleboat_init(_jniEnv, platform->_app->activity->javaGameActivity);
        Paddleboat_setControllerStatusCallback(gameControllerStatusCallback, this);
        // This is needed to allow controller events through to us.
        // By default, only touch-screen events are passed through, to match the
        // behaviour of NativeActivity.
        android_app_set_motion_event_filter(platform->_app, nullptr);

        // Flags to control how the IME behaves.
        static constexpr int INPUTTYPE_DOT_TYPE_CLASS_TEXT = 1;
        static constexpr int IME_ACTION_NONE = 1;
        static constexpr int IME_FLAG_NO_FULLSCREEN = 33554432;

        GameActivity_setImeEditorInfo(platform->_app->activity, INPUTTYPE_DOT_TYPE_CLASS_TEXT,
                                      IME_ACTION_NONE, IME_FLAG_NO_FULLSCREEN);
    }

    ~GameInputProxy() {
        Paddleboat_setControllerStatusCallback(nullptr, nullptr);
        Paddleboat_destroy(_jniEnv);
        if (_jniEnv) {
            CC_LOG_INFO("Detaching current thread from JNI.");
            _androidPlatform->_app->activity->vm->DetachCurrentThread();
            CC_LOG_INFO("Current thread detached from JNI.");
            _jniEnv = nullptr;
        }
    }

    void handleInput() {
        Paddleboat_update(_jniEnv);
        // If we get any key or motion events that were handled by a game controller,
        // read controller data and cook it into an event
        bool controllerEvent = false;

        // Swap input buffers so we don't miss any events while processing inputBuffer.
        android_input_buffer *inputBuffer = android_app_swap_input_buffers(
            _androidPlatform->_app);
        // Early exit if no events.
        if (inputBuffer == nullptr) return;

        if (inputBuffer->keyEventsCount != 0) {
            for (uint64_t i = 0; i < inputBuffer->keyEventsCount; ++i) {
                GameActivityKeyEvent *keyEvent = &inputBuffer->keyEvents[i];
                if (Paddleboat_processGameActivityKeyInputEvent(keyEvent,
                                                                sizeof(GameActivityKeyEvent))) {
                    controllerEvent = true;
                } else {
                    cookGameActivityKeyEvent(keyEvent);
                }
            }
            android_app_clear_key_events(inputBuffer);
        }
        if (inputBuffer->motionEventsCount != 0) {
            for (uint64_t i = 0; i < inputBuffer->motionEventsCount; ++i) {
                GameActivityMotionEvent *motionEvent = &inputBuffer->motionEvents[i];

                if (Paddleboat_processGameActivityMotionInputEvent(motionEvent,
                                                                   sizeof(GameActivityMotionEvent))) {
                    controllerEvent = true;
                } else {
                    // Didn't belong to a game controller, process it ourselves if it is a touch event
                    cookGameActivityMotionEvent(motionEvent);
                }
            }
            android_app_clear_motion_events(inputBuffer);
        }

        if (controllerEvent) {
            cookGameControllerEvent(_gameControllerIndex);
        }
    }

    bool cookGameControllerEvent(const int32_t gameControllerIndex) {
        int addedControllerEvent = 0;
        if (gameControllerIndex >= 0) {
            Paddleboat_Controller_Data controllerData;
            if (Paddleboat_getControllerData(gameControllerIndex, &controllerData) ==
                PADDLEBOAT_NO_ERROR) {
                // Generate events from buttons
                for (auto inputAction : PADDLEBOAT_ACTIONS) {
                    if (controllerData.buttonsDown & inputAction.buttonMask) {
                        reportKeyState(inputAction.actionCode, true);
                        addedControllerEvent = 1;
                    } else if (prevButtonsDown & inputAction.buttonMask) {
                        reportKeyState(inputAction.actionCode, false);
                        addedControllerEvent = 1;
                    }
                }

                // Update our prev variable so we can detect delta changes from down to up
                prevButtonsDown = controllerData.buttonsDown;
            }
        }
        return (addedControllerEvent != 0);
    }

    bool cookGameActivityMotionEvent(GameActivityMotionEvent *motionEvent) {
        if (motionEvent->pointerCount > 0) {
            int action = motionEvent->action;
            int actionMasked = action & AMOTION_EVENT_ACTION_MASK;
            int eventChangedIndex = -1;

            if (actionMasked == AMOTION_EVENT_ACTION_DOWN ||
                actionMasked == AMOTION_EVENT_ACTION_POINTER_DOWN) {
                if (actionMasked == AMOTION_EVENT_ACTION_POINTER_DOWN) {
                    eventChangedIndex = action >> AMOTION_EVENT_ACTION_POINTER_INDEX_SHIFT;
                } else {
                    eventChangedIndex = 0;
                }
                touchEvent.type = cc::TouchEvent::Type::BEGAN;
            } else if (actionMasked == AMOTION_EVENT_ACTION_UP ||
                       actionMasked == AMOTION_EVENT_ACTION_POINTER_UP) {
                touchEvent.type = cc::TouchEvent::Type::ENDED;
                if (actionMasked == AMOTION_EVENT_ACTION_POINTER_UP) {
                    eventChangedIndex = action >> AMOTION_EVENT_ACTION_POINTER_INDEX_SHIFT;
                } else {
                    eventChangedIndex = 0;
                }
            } else if (actionMasked == AMOTION_EVENT_ACTION_CANCEL) {
                touchEvent.type = cc::TouchEvent::Type::CANCELLED;
            } else if (actionMasked == AMOTION_EVENT_ACTION_MOVE) {
                touchEvent.type = cc::TouchEvent::Type::MOVED;
            } else {
                return false;
            }

            if (eventChangedIndex >= 0) {
                addTouchEvent(eventChangedIndex, motionEvent);
            } else {
                for (int i = 0; i < motionEvent->pointerCount; i++) {
                    addTouchEvent(i, motionEvent);
                }
            }

            _androidPlatform->dispatchEvent(touchEvent);
            touchEvent.touches.clear();
            return true;
        }
        return false;
    }

    bool cookGameActivityKeyEvent(GameActivityKeyEvent *keyEvent) {
        if (keyEvent->keyCode == AKEYCODE_BACK && 0 == keyEvent->action) {
            // back key was pressed
            keyboardEvent.action = cc::KeyboardEvent::Action::PRESS;
            keyboardEvent.key = static_cast<int>(KeyCode::MOBILE_BACK);
            _androidPlatform->dispatchEvent(keyboardEvent);
            return true;
        }
        return false;
    }

    void reportKeyState(int keyCode, bool state) {
        bool wentDown = !keyState[keyCode] && state;
        bool wentUp = keyState[keyCode] && !state;
        keyState[keyCode] = state;

        if (wentUp) {
            keyboardEvent.key = keyCode;
            keyboardEvent.action = cc::KeyboardEvent::Action::RELEASE;
            _androidPlatform->dispatchEvent(keyboardEvent);
        } else if (wentDown) {
            keyboardEvent.key = keyCode;
            keyboardEvent.action = cc::KeyboardEvent::Action::PRESS;
            _androidPlatform->dispatchEvent(keyboardEvent);
        }
    }

    int32_t getActiveGameControllerIndex() const {
        return _gameControllerIndex;
    }

    void setActiveGameControllerIndex(const int32_t controllerIndex) {
        _gameControllerIndex = controllerIndex;
    }

    void handleAppCommand(int32_t cmd) {
        switch (cmd) {
            case APP_CMD_SAVE_STATE:
                // The system has asked us to save our current state.
                CC_LOG_DEBUG("AndroidPlatform: APP_CMD_SAVE_STATE");
                break;
            case APP_CMD_INIT_WINDOW: {
                _hasWindow = true;
                auto *systemWindow = _androidPlatform->getInterface<SystemWindow>();
                systemWindow->setWindowHandle(_androidPlatform->_app->window);
                // We have a window!
                CC_LOG_DEBUG("AndroidPlatform: APP_CMD_INIT_WINDOW");
                if (!_launched) {
                    _launched = true;
                    if (cocos_main(0, nullptr) != 0) {
                        CC_LOG_ERROR("AndroidPlatform: Launch game failed!");
                    }
                } else {
                    cc::CustomEvent event;
                    event.name = EVENT_RECREATE_WINDOW;
                    event.args->ptrVal = reinterpret_cast<void *>(_androidPlatform->_app->window);
                    _androidPlatform->dispatchEvent(event);
                }
                break;
            }
            case APP_CMD_TERM_WINDOW: {
                _hasWindow = false;
                // The window is going away -- kill the surface
                CC_LOG_DEBUG("AndroidPlatform: APP_CMD_TERM_WINDOW");
                cc::CustomEvent event;
                event.name = EVENT_DESTROY_WINDOW;
                event.args->ptrVal = reinterpret_cast<void *>(_androidPlatform->_app->window);
                _androidPlatform->dispatchEvent(event);
                break;
            }
            case APP_CMD_GAINED_FOCUS:
                _isActive = true;
                CC_LOG_INFO("AndroidPlatform: APP_CMD_GAINED_FOCUS");
                break;
            case APP_CMD_LOST_FOCUS:
                _isActive = false;
                CC_LOG_INFO("AndroidPlatform: APP_CMD_LOST_FOCUS");
                break;
            case APP_CMD_PAUSE:
                _isActive = false;
                CC_LOG_INFO("AndroidPlatform: APP_CMD_PAUSE");
                break;
            case APP_CMD_RESUME: {
                _isActive = true;
                CC_LOG_INFO("AndroidPlatform: APP_CMD_RESUME");
                break;
            }
            case APP_CMD_DESTROY: {
                CC_LOG_INFO("AndroidPlatform: APP_CMD_DESTROY");
                WindowEvent ev;
                ev.type = WindowEvent::Type::CLOSE;
                _androidPlatform->dispatchEvent(ev);
                _androidPlatform->onDestroy();
                break;
            }
            case APP_CMD_STOP: {
                CC_LOG_INFO("AndroidPlatform: APP_CMD_STOP");
                _isVisible = false;
                Paddleboat_onStop(_jniEnv);
                WindowEvent ev;
                ev.type = WindowEvent::Type::HIDDEN;
                _androidPlatform->dispatchEvent(ev);
                break;
            }
            case APP_CMD_START: {
                CC_LOG_INFO("AndroidPlatform: APP_CMD_START");
                _isVisible = true;
                Paddleboat_onStart(_jniEnv);
                WindowEvent ev;
                ev.type = WindowEvent::Type::SHOW;
                _androidPlatform->dispatchEvent(ev);
                break;
            }
            case APP_CMD_WINDOW_RESIZED: {
                CC_LOG_INFO("AndroidPlatform: APP_CMD_WINDOW_RESIZED");
                cc::WindowEvent ev;
                ev.type = cc::WindowEvent::Type::SIZE_CHANGED;
                ev.width = ANativeWindow_getWidth(_androidPlatform->_app->window);
                ev.height = ANativeWindow_getHeight(_androidPlatform->_app->window);
                _androidPlatform->dispatchEvent(ev);
                break;
            }
            case APP_CMD_CONFIG_CHANGED:
                CC_LOG_INFO("AndroidPlatform: APP_CMD_CONFIG_CHANGED");
                // Window was resized or some other configuration changed.
                // Note: we don't handle this event because we check the surface dimensions
                // every frame, so that's how we know it was resized. If you are NOT doing that,
                // then you need to handle this event!
                break;
            case APP_CMD_LOW_MEMORY: {
                // system told us we have low memory. So if we are not visible, let's
                // cooperate by deallocating all of our graphic resources.
                CC_LOG_INFO("AndroidPlatform: APP_CMD_LOW_MEMORY");
                DeviceEvent ev;
                ev.type = DeviceEvent::Type::MEMORY;
                _androidPlatform->dispatchEvent(ev);
                break;
            }
            case APP_CMD_CONTENT_RECT_CHANGED:
                CC_LOG_DEBUG("AndroidPlatform: APP_CMD_CONTENT_RECT_CHANGED");
                break;
            case APP_CMD_WINDOW_REDRAW_NEEDED:
                CC_LOG_INFO("AndroidPlatform: APP_CMD_WINDOW_REDRAW_NEEDED");
                break;
            case APP_CMD_WINDOW_INSETS_CHANGED:
                CC_LOG_DEBUG("AndroidPlatform: APP_CMD_WINDOW_INSETS_CHANGED");
                //            ARect insets;
                //            // Log all the insets types
                //            for (int type = 0; type < GAMECOMMON_INSETS_TYPE_COUNT; ++type) {
                //                GameActivity_getWindowInsets(_app->activity, (GameCommonInsetsType)type, &insets);
                //            }
                break;
            default:
                CC_LOG_INFO("AndroidPlatform: (unknown command).");
                break;
        }
        if (_eventCallback) {
            _eventCallback(cmd);
        }
    }

    using AppEventCallback = std::function<void(int32_t)>;
    void registerAppEventCallback(AppEventCallback callback) {
        _eventCallback = std::move(callback);
    }

    inline bool isAnimating() const {
        return _isVisible && _hasWindow;
    }

    inline bool isActive() const {
        return _isActive;
    }

private:

    static void addTouchEvent(int index, GameActivityMotionEvent *motionEvent) {
        if (index < 0 || index >= motionEvent->pointerCount) {
            ABORT_IF(false);
        }
        int id = motionEvent->pointers[index].id;
        float x = GameActivityPointerAxes_getX(&motionEvent->pointers[index]);
        float y = GameActivityPointerAxes_getY(&motionEvent->pointers[index]);
        touchEvent.touches.emplace_back(x, y, id);
    }

    AppEventCallback _eventCallback{nullptr};
    AndroidPlatform *_androidPlatform{nullptr};
    JNIEnv *_jniEnv{nullptr};         // JNI environment
    int32_t _gameControllerIndex{-1}; // Most recently connected game controller index
    bool _launched{false};
    bool _isVisible{false};
    bool _hasWindow{false};
    bool _isActive{false};
};

static void handleCmdProxy(struct android_app *app, int32_t cmd) {
    auto *proxy = static_cast<GameInputProxy *>(app->userData);
    proxy->handleAppCommand(cmd);
}

void gameControllerStatusCallback(const int32_t controllerIndex,
                                  const Paddleboat_ControllerStatus status,
                                  void *userData) {
    auto *inputProxy = static_cast<GameInputProxy *>(userData);
    if (inputProxy) {
        // Always make the most recently connected controller the active one
        if (status == PADDLEBOAT_CONTROLLER_JUST_CONNECTED) {
            inputProxy->setActiveGameControllerIndex(controllerIndex);
        } else if (status == PADDLEBOAT_CONTROLLER_JUST_DISCONNECTED) {
            // We only care if the controller that disconnected was the one
            // we are currently using
            if (controllerIndex == inputProxy->getActiveGameControllerIndex()) {
                // Default to no fallback controller, loop and look for another connected
                // one
                int32_t newControllerIndex = -1;

                for (int32_t i = 0; i < PADDLEBOAT_MAX_CONTROLLERS; ++i) {
                    if (i != controllerIndex &&
                        Paddleboat_getControllerStatus(i) == PADDLEBOAT_CONTROLLER_ACTIVE) {
                        newControllerIndex = i;
                        break;
                    }
                }
                inputProxy->setActiveGameControllerIndex(newControllerIndex);
            }
        }
    }
}

AndroidPlatform::~AndroidPlatform() = default;

int AndroidPlatform::init() {
    cc::FileUtilsAndroid::setassetmanager(_app->activity->assetManager);
    _inputProxy = ccnew GameInputProxy(this);
    _inputProxy->registerAppEventCallback([this](int32_t cmd) {
        if (APP_CMD_START == cmd || APP_CMD_INIT_WINDOW == cmd) {
            if (_inputProxy->isAnimating()) {
                _isLowFrequencyLoopEnabled = false;
                _loopTimeOut = 0;
            }
        } else if(APP_CMD_STOP == cmd) {
            _lowFrequencyTimer.reset();
            _loopTimeOut = LOW_FREQUENCY_TIME_INTERVAL;
            _isLowFrequencyLoopEnabled = true;
        }
    });
    _app->userData = _inputProxy;
    _app->onAppCmd = handleCmdProxy;

    registerInterface(std::make_shared<Accelerometer>());
    registerInterface(std::make_shared<Battery>());
    registerInterface(std::make_shared<Network>());
    registerInterface(std::make_shared<Screen>());
    registerInterface(std::make_shared<System>());
    registerInterface(std::make_shared<SystemWindow>());
    registerInterface(std::make_shared<Vibrator>());

    return 0;
}

void AndroidPlatform::onDestroy() {
    UniversalPlatform::onDestroy();
    unregisterAllInterfaces();
    CC_SAFE_DELETE(_inputProxy)
}

int AndroidPlatform::getSdkVersion() const {
    return AConfiguration_getSdkVersion(_app->config);
}

int32_t AndroidPlatform::run(int  /*argc*/, const char **/*argv*/) {
    loop();
    return 0;
}

int32_t AndroidPlatform::loop() {

    while (true) {
        int events;
        struct android_poll_source *source;

        // suspend thread while _loopTimeOut set to -1
        while ((ALooper_pollAll(_loopTimeOut, nullptr, &events,
                                reinterpret_cast<void **>(&source))) >= 0) {
            // process event
            if (source != nullptr) {
                source->process(_app, source);
            }

            // Exit the game loop when the Activity is destroyed
            if (_app->destroyRequested) {
                return 0;
            }
        }
        _inputProxy->handleInput();
        if (_inputProxy->isAnimating()) {
            runTask();
            if (_inputProxy->isActive()) {
                flushTasksOnGameThreadAtForegroundJNI();
            }
        }
        flushTasksOnGameThreadJNI();

#if CC_ENABLE_SUSPEND_GAME_THREAD
        if (_isLowFrequencyLoopEnabled) {
            //Suspend a game thread after it has been running in the background for a specified amount of time
            if (_lowFrequencyTimer.getSeconds() > LOW_FREQUENCY_EXPIRED_DURATION_SECONDS) {
                _isLowFrequencyLoopEnabled = false;
                _loopTimeOut = -1;
            }
        }
#endif
    }
}

void AndroidPlatform::pollEvent() {
    //
}

void *AndroidPlatform::getActivity() { // Dangerous
    return _app->activity->javaGameActivity;
}

void *AndroidPlatform::getEnv() {
    return JniHelper::getEnv();
}

} // namespace cc
