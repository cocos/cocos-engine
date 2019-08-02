/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
#include "JniImp.h"
#include <unordered_map>
#include <android/log.h>
#include <android/asset_manager_jni.h>
#include <jni.h>
#include <mutex>
#include "JniHelper.h"
#include "platform/CCApplication.h"
#include "scripting/js-bindings/jswrapper/SeApi.h"
#include "scripting/js-bindings/event/EventDispatcher.h"
#include "platform/android/CCFileUtils-android.h"
#include "base/CCScheduler.h"
#include "base/CCAutoreleasePool.h"
#include "base/CCGLUtils.h"

#define  JNI_IMP_LOG_TAG    "JniImp"
#define  LOGD(...)  __android_log_print(ANDROID_LOG_DEBUG,JNI_IMP_LOG_TAG,__VA_ARGS__)

#ifndef ORG_RENDER_CLASS_NAME
#define ORG_RENDER_CLASS_NAME org_cocos2dx_lib_Cocos2dxRenderer
#endif
#define JNI_RENDER(FUNC) JNI_METHOD1(ORG_RENDER_CLASS_NAME,FUNC)

#ifndef ORG_ACTIVITY_CLASS_NAME
#define ORG_ACTIVITY_CLASS_NAME org_cocos2dx_lib_Cocos2dxActivity
#endif
#define JNI_ACTIVITY(FUNC) JNI_METHOD1(ORG_ACTIVITY_CLASS_NAME,FUNC)

#ifndef ORG_ACCELEROMETER_CLASS_NAME
#define ORG_ACCELEROMETER_CLASS_NAME org_cocos2dx_lib_Cocos2dxAccelerometer
#endif
#define JNI_ACCELEROMETER(FUNC) JNI_METHOD1(ORG_ACCELEROMETER_CLASS_NAME,FUNC)

#ifndef ORG_HELPER_CLASS_NAME
#define ORG_HELPER_CLASS_NAME org_cocos2dx_lib_Cocos2dxHelper
#endif
#define JNI_HELPER(FUNC) JNI_METHOD1(ORG_HELPER_CLASS_NAME,FUNC)

#ifndef ORG_AUDIOFOCUS_CLASS_NAME
#define ORG_AUDIOFOCUS_CLASS_NAME org_cocos2dx_lib_Cocos2dxAudioFocusManager
#endif
#define JNI_AUDIO(FUNC) JNI_METHOD1(ORG_AUDIOFOCUS_CLASS_NAME,FUNC)

#ifndef JCLS_HELPER
#define JCLS_HELPER "org/cocos2dx/lib/Cocos2dxHelper"
#endif

#ifndef JCLS_RENDERER
#define JCLS_RENDERER "org/cocos2dx/lib/Cocos2dxRenderer"
#endif


#define KEYCODE_BACK 0x04
#define KEYCODE_MENU 0x52
#define KEYCODE_DPAD_UP 0x13
#define KEYCODE_DPAD_DOWN 0x14
#define KEYCODE_DPAD_LEFT 0x15
#define KEYCODE_DPAD_RIGHT 0x16
#define KEYCODE_ENTER 0x42
#define KEYCODE_DPAD_CENTER  0x17

using namespace cocos2d;

extern uint32_t __jsbInvocationCount;


namespace
{	
    bool __isOpenDebugView = false;
    bool __isGLOptModeEnabled = true;
    std::string g_apkPath;
    EditTextCallback s_editTextCallback = nullptr;
    void* s_ctx = nullptr;
    int g_deviceSampleRate = 44100;
    int g_deviceAudioBufferSizeInFrames = 192;
    int g_width = 0;
    int g_height = 0;
    bool g_isStarted = false;
    bool g_isGameFinished = false;
    int g_SDKInt = 0;

    cocos2d::Application* g_app = nullptr;

    bool setCanvasCallback(se::Object* global)
    {
        se::AutoHandleScope scope;
        se::ScriptEngine* se = se::ScriptEngine::getInstance();
        char commandBuf[200] = {0};
        uint8_t devicePixelRatio = Application::getInstance()->getDevicePixelRatio();
        sprintf(commandBuf, "window.innerWidth = %d; window.innerHeight = %d;",
                g_width / devicePixelRatio,
                g_height / devicePixelRatio);
        se->evalString(commandBuf);
        glViewport(0, 0, g_width / devicePixelRatio, g_height / devicePixelRatio);
        glDepthMask(GL_TRUE);
        
        return true;
    }
}

void cocos_jni_env_init (JNIEnv* env);

Application* cocos_android_app_init(JNIEnv* env, int width, int height);

extern "C"
{
    void getSDKInt(JNIEnv* env)
    {
        if (env && g_SDKInt == 0)
        {
            // VERSION is a nested class within android.os.Build (hence "$" rather than "/")
            jclass versionClass = env->FindClass("android/os/Build$VERSION");
            if (NULL == versionClass)
                return;

            jfieldID sdkIntFieldID = env->GetStaticFieldID(versionClass, "SDK_INT", "I");
            if (NULL == sdkIntFieldID)
                return;

            g_SDKInt = env->GetStaticIntField(versionClass, sdkIntFieldID);
        }
    }

    JNIEXPORT jint JNI_OnLoad(JavaVM *vm, void *reserved)
    {
        JniHelper::setJavaVM(vm);
        cocos_jni_env_init(JniHelper::getEnv());
        getSDKInt(JniHelper::getEnv());

        return JNI_VERSION_1_4;
    }

    /*****************************************************
     * Cocos2dxActivity native functions implementation.
     *****************************************************/

    JNIEXPORT jintArray JNICALL JNI_ACTIVITY(getGLContextAttrs)(JNIEnv*  env, jobject thiz)
    {
        //REFINE
        int tmp[7] = {8, 8, 8,
                      8, 0, 0, 0};
        jintArray glContextAttrsJava = env->NewIntArray(7);
        env->SetIntArrayRegion(glContextAttrsJava, 0, 7, tmp);

        return glContextAttrsJava;
    }

	/*****************************************************
	 * Cocos2dxRenderer native functions implementation.
	 *****************************************************/

    JNIEXPORT void JNICALL JNI_RENDER(nativeInit)(JNIEnv*  env, jobject thiz, jint w, jint h, jstring jDefaultResourcePath)
    {
        g_width = w;
        g_height = h;
        
        g_app = cocos_android_app_init(env, w, h);

        g_isGameFinished = false;
        ccInvalidateStateCache();
        std::string defaultResourcePath = JniHelper::jstring2string(jDefaultResourcePath);
        LOGD("nativeInit: %d, %d, %s", w, h, defaultResourcePath.c_str());
        

        if (!defaultResourcePath.empty())
            FileUtils::getInstance()->setDefaultResourceRootPath(defaultResourcePath);

        se::ScriptEngine* se = se::ScriptEngine::getInstance();
        se->addRegisterCallback(setCanvasCallback);

        EventDispatcher::init();

        g_app->start();
        g_isStarted = true;
    }

	JNIEXPORT void JNICALL JNI_RENDER(nativeRender)(JNIEnv* env)
	{
        if (g_isGameFinished)
        {
            // with Application destructor called, native resource will be released
            delete g_app;
            g_app = nullptr;

            JniHelper::callStaticVoidMethod(JCLS_HELPER, "endApplication");
            return;
        }


        if (!g_isStarted)
        {
            auto scheduler = Application::getInstance()->getScheduler();
            scheduler->removeAllFunctionsToBePerformedInCocosThread();
            scheduler->unscheduleAll();

            se::ScriptEngine::getInstance()->cleanup();
            cocos2d::PoolManager::getInstance()->getCurrentPool()->clear();

            //REFINE: Wait HttpClient, WebSocket, Audio thread to exit

            ccInvalidateStateCache();
          
            se::ScriptEngine* se = se::ScriptEngine::getInstance();
            se->addRegisterCallback(setCanvasCallback);

            EventDispatcher::init();

            if(!g_app->applicationDidFinishLaunching())
            {
                g_isGameFinished = true;
                return;
            }

            g_isStarted = true;
        }

        static std::chrono::steady_clock::time_point prevTime;
        static std::chrono::steady_clock::time_point now;
        static float dt = 0.f;
        static float dtSum = 0.f;
        static uint32_t jsbInvocationTotalCount = 0;
        static uint32_t jsbInvocationTotalFrames = 0;
        bool downsampleEnabled = g_app->isDownsampleEnabled();
        
        if (downsampleEnabled)
            g_app->getRenderTexture()->prepare();

        g_app->getScheduler()->update(dt);
        EventDispatcher::dispatchTickEvent(dt);
       
        if (downsampleEnabled)
            g_app->getRenderTexture()->draw();

        PoolManager::getInstance()->getCurrentPool()->clear();

        now = std::chrono::steady_clock::now();
        dt = std::chrono::duration_cast<std::chrono::microseconds>(now - prevTime).count() / 1000000.f;

        prevTime = std::chrono::steady_clock::now();

        if (__isOpenDebugView)
        {
            dtSum += dt;
            ++jsbInvocationTotalFrames;
            jsbInvocationTotalCount += __jsbInvocationCount;

            if (dtSum > 1.0f)
            {
                dtSum = 0.0f;
                setJSBInvocationCountJNI(jsbInvocationTotalCount / jsbInvocationTotalFrames);
                jsbInvocationTotalCount = 0;
                jsbInvocationTotalFrames = 0;
            }
        }
        __jsbInvocationCount = 0;
    }

    JNIEXPORT void JNICALL JNI_RENDER(nativeOnPause)()
    {
        if (g_isGameFinished) {
            return;
        }
        if (g_app)
            g_app->applicationDidEnterBackground();
    }

    JNIEXPORT void JNICALL JNI_RENDER(nativeOnResume)()
    {
        if (g_isGameFinished) {
            return;
        }
        if (g_app)
            g_app->applicationWillEnterForeground();
    }

    JNIEXPORT void JNICALL JNI_RENDER(nativeInsertText)(JNIEnv* env, jobject thiz, jstring text)
    {
        //REFINE
    }

    JNIEXPORT void JNICALL JNI_RENDER(nativeDeleteBackward)(JNIEnv* env, jobject thiz)
    {
        //REFINE
    }

    JNIEXPORT jstring JNICALL JNI_RENDER(nativeGetContentText)()
    {
        //REFINE
    }

    JNIEXPORT void JNICALL JNI_RENDER(nativeOnSurfaceChanged)(JNIEnv*  env, jobject thiz, jint w, jint h)
    {
        //REFINE
    }

    /***********************************************************
	 * Cocos2dxAccelerometer native functions implementation.
	 ***********************************************************/

    JNIEXPORT void JNICALL JNI_ACCELEROMETER(onSensorChanged)(JNIEnv*  env, jobject thiz, jfloat x, jfloat y, jfloat z, jlong timeStamp)
    {
        //REFINE
    }

    /***********************************************************
	 * Touches native functions implementation.
	 ***********************************************************/

    static void dispatchTouchEventWithOnePoint(JNIEnv* env, cocos2d::TouchEvent::Type type, jint id, jfloat x, jfloat y)
    {
        if (g_isGameFinished) {
            return;
        }
        cocos2d::TouchEvent touchEvent;
        touchEvent.type = type;

        uint8_t devicePixelRatio = Application::getInstance()->getDevicePixelRatio();
        cocos2d::TouchInfo touchInfo;
        touchInfo.index = id;
        touchInfo.x = x / devicePixelRatio;
        touchInfo.y = y / devicePixelRatio;
        touchEvent.touches.push_back(touchInfo);
        
        cocos2d::EventDispatcher::dispatchTouchEvent(touchEvent);
    }

    static void dispatchTouchEventWithPoints(JNIEnv* env, cocos2d::TouchEvent::Type type, jintArray ids, jfloatArray xs, jfloatArray ys)
    {
        if (g_isGameFinished) {
            return;
        }
        cocos2d::TouchEvent touchEvent;
        touchEvent.type = type;

        int size = env->GetArrayLength(ids);
        jint id[size];
        jfloat x[size];
        jfloat y[size];

        env->GetIntArrayRegion(ids, 0, size, id);
        env->GetFloatArrayRegion(xs, 0, size, x);
        env->GetFloatArrayRegion(ys, 0, size, y);

        uint8_t devicePixelRatio = Application::getInstance()->getDevicePixelRatio();
        for(int i = 0; i < size; i++)
        {
            cocos2d::TouchInfo touchInfo;
            touchInfo.index = id[i];
            touchInfo.x = x[i] / devicePixelRatio;
            touchInfo.y = y[i] / devicePixelRatio;
            touchEvent.touches.push_back(touchInfo);
        }

        cocos2d::EventDispatcher::dispatchTouchEvent(touchEvent);
    }

    JNIEXPORT void JNICALL JNI_RENDER(nativeTouchesBegin)(JNIEnv * env, jobject thiz, jint id, jfloat x, jfloat y)
    {
        if (g_isGameFinished) {
            return;
        }
        dispatchTouchEventWithOnePoint(env, cocos2d::TouchEvent::Type::BEGAN, id, x, y);
    }

    JNIEXPORT void JNICALL JNI_RENDER(nativeTouchesEnd)(JNIEnv * env, jobject thiz, jint id, jfloat x, jfloat y)
    {
        if (g_isGameFinished) {
            return;
        }
        dispatchTouchEventWithOnePoint(env, cocos2d::TouchEvent::Type::ENDED, id, x, y);
    }

    JNIEXPORT void JNICALL JNI_RENDER(nativeTouchesMove)(JNIEnv * env, jobject thiz, jintArray ids, jfloatArray xs, jfloatArray ys)
    {
        if (g_isGameFinished) {
            return;
        }
        dispatchTouchEventWithPoints(env, cocos2d::TouchEvent::Type::MOVED, ids, xs, ys);
    }

    JNIEXPORT void JNICALL JNI_RENDER(nativeTouchesCancel)(JNIEnv * env, jobject thiz, jintArray ids, jfloatArray xs, jfloatArray ys)
    {
        if (g_isGameFinished) {
            return;
        }
        dispatchTouchEventWithPoints(env, cocos2d::TouchEvent::Type::CANCELLED, ids, xs, ys);
    }

    JNIEXPORT jboolean JNICALL JNI_RENDER(nativeKeyEvent)(JNIEnv * env, jobject thiz, jint keyCode, jboolean isPressed)
    {
        if (g_isGameFinished) {
            return JNI_TRUE;
        }

        int keyInWeb = -1;
        // key values in web, refer to http://docs.cocos.com/creator/api/en/enums/KEY.html
        switch(keyCode)
        {
            case KEYCODE_BACK:
                keyInWeb = 6;
                break;
            case KEYCODE_ENTER:
                keyInWeb = 13;
                break;
            case KEYCODE_MENU:
                keyInWeb = 18;
                break;
            case KEYCODE_DPAD_UP:
                keyInWeb = 1003;
                break;
            case KEYCODE_DPAD_DOWN:
                keyInWeb = 1004;
                break;
            case KEYCODE_DPAD_LEFT:
                keyInWeb = 1000;
                break;
            case KEYCODE_DPAD_RIGHT:
                keyInWeb = 1001;
                break;
            case KEYCODE_DPAD_CENTER:
                keyInWeb = 1005;
                break;
            default:
                keyInWeb = 0; // If the key can't be identified, this value is 0
        }
        KeyboardEvent event;
        event.key = keyInWeb;
        event.action = isPressed ? KeyboardEvent::Action::PRESS : KeyboardEvent::Action::RELEASE;
        EventDispatcher::dispatchKeyboardEvent(event);

        return JNI_TRUE;
    }

    /***********************************************************
     * Cocos2dxHelper native functions implementation.
     ***********************************************************/

    JNIEXPORT void JNICALL JNI_HELPER(nativeSetApkPath)(JNIEnv* env, jobject thiz, jstring apkPath)
    {
        g_apkPath = JniHelper::jstring2string(apkPath);
    }

    JNIEXPORT void JNICALL JNI_HELPER(nativeSetContext)(JNIEnv*  env, jobject thiz, jobject context, jobject assetManager)
    {
        JniHelper::setClassLoaderFrom(context);
        FileUtilsAndroid::setassetmanager(AAssetManager_fromJava(env, assetManager));
    }

    JNIEXPORT void JNICALL JNI_HELPER(nativeSetAudioDeviceInfo)(JNIEnv*  env, jobject thiz, jboolean isSupportLowLatency, jint deviceSampleRate, jint deviceAudioBufferSizeInFrames)
    {
        g_deviceSampleRate = deviceSampleRate;
        g_deviceAudioBufferSizeInFrames = deviceAudioBufferSizeInFrames;
        LOGD("nativeSetAudioDeviceInfo: sampleRate: %d, bufferSizeInFrames: %d", g_deviceSampleRate, g_deviceAudioBufferSizeInFrames);
    }

    JNIEXPORT void JNICALL JNI_HELPER(nativeSetEditTextDialogResult)(JNIEnv* env, jobject obj, jbyteArray text)
    {
        jsize  size = env->GetArrayLength(text);

        if (size > 0) 
        {
            jbyte * data = (jbyte*)env->GetByteArrayElements(text, 0);
            char* buffer = (char*)malloc(size+1);
            if (buffer != nullptr) 
            {
                memcpy(buffer, data, size);
                buffer[size] = '\0';
                // pass data to edittext's delegate
                if (s_editTextCallback)
                    s_editTextCallback(buffer, s_ctx);
                free(buffer);
            }
            env->ReleaseByteArrayElements(text, data, 0);
        } 
        else 
        {
            if (s_editTextCallback)
                s_editTextCallback("", s_ctx);
        }
    }

    /***********************************************************
     * Cocos2dxAudioFocusManager native functions implementation.
     ***********************************************************/

    JNIEXPORT void JNICALL JNI_AUDIO(nativeOnAudioFocusChange)(JNIEnv* env, jobject thiz, jint focusChange)
    {
        // cocos_audioengine_focus_change(focusChange);
    }
} // end of extern "C"

void restartJSVM()
{
    g_isStarted = false;
}

/***********************************************************
 * Functions invoke from cpp to Java.
 ***********************************************************/

std::string getApkPathJNI() 
{
    return g_apkPath;
}

std::string getPackageNameJNI() 
{
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getPackageName");
}

int getObbAssetFileDescriptorJNI(const std::string& path, long* startOffset, long* size) 
{
    JniMethodInfo methodInfo;
    int fd = 0;
    
    if (JniHelper::getStaticMethodInfo(methodInfo, JCLS_HELPER, "getObbAssetFileDescriptor", "(Ljava/lang/String;)[J"))
    {
        jstring stringArg = methodInfo.env->NewStringUTF(path.c_str());
        jlongArray newArray = (jlongArray)methodInfo.env->CallStaticObjectMethod(methodInfo.classID, methodInfo.methodID, stringArg);
        jsize theArrayLen = methodInfo.env->GetArrayLength(newArray);
        
        if (3 == theArrayLen) 
        {
            jboolean copy = JNI_FALSE;
            jlong *array = methodInfo.env->GetLongArrayElements(newArray, &copy);
            fd = static_cast<int>(array[0]);
            *startOffset = array[1];
            *size = array[2];
            methodInfo.env->ReleaseLongArrayElements(newArray, array, 0);
        }
        
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
        methodInfo.env->DeleteLocalRef(stringArg);
    }
    
    return fd;
}

int getDeviceSampleRateJNI()
{
    return g_deviceSampleRate;
}

int getDeviceAudioBufferSizeInFramesJNI()
{
    return g_deviceAudioBufferSizeInFrames;
}

void convertEncodingJNI(const std::string& src, int byteSize, const std::string& fromCharset, std::string& dst, const std::string& newCharset)
{
    JniMethodInfo methodInfo;

    if (JniHelper::getStaticMethodInfo(methodInfo, JCLS_HELPER, "conversionEncoding", "([BLjava/lang/String;Ljava/lang/String;)[B"))
    {
        jbyteArray strArray = methodInfo.env->NewByteArray(byteSize);
        methodInfo.env->SetByteArrayRegion(strArray, 0, byteSize, reinterpret_cast<const jbyte*>(src.c_str()));

        jstring stringArg1 = methodInfo.env->NewStringUTF(fromCharset.c_str());
        jstring stringArg2 = methodInfo.env->NewStringUTF(newCharset.c_str());

        jbyteArray newArray = (jbyteArray)methodInfo.env->CallStaticObjectMethod(methodInfo.classID, methodInfo.methodID, strArray, stringArg1, stringArg2);
        jsize theArrayLen = methodInfo.env->GetArrayLength(newArray);
        methodInfo.env->GetByteArrayRegion(newArray, 0, theArrayLen, (jbyte*)dst.c_str());

        methodInfo.env->DeleteLocalRef(strArray);
        methodInfo.env->DeleteLocalRef(stringArg1);
        methodInfo.env->DeleteLocalRef(stringArg2);
        methodInfo.env->DeleteLocalRef(newArray);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    }
}

std::string getCurrentLanguageJNI()
{
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getCurrentLanguage");
}

std::string getCurrentLanguageCodeJNI()
{
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getCurrentLanguageCode");
}

std::string getSystemVersionJNI()
{
    return JniHelper::callStaticStringMethod(JCLS_HELPER, "getSystemVersion");
}

bool openURLJNI(const std::string& url)
{
    return JniHelper::callStaticBooleanMethod(JCLS_HELPER, "openURL", url);
}

void copyTextToClipboardJNI(const std::string& text)
{
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "copyTextToClipboard", text);
}

void setPreferredFramesPerSecondJNI(int fps)
{
    JniHelper::callStaticVoidMethod(JCLS_RENDERER, "setPreferredFramesPerSecond", fps);
}

void setGameInfoDebugViewTextJNI(int index, const std::string& text)
{
    if (!__isOpenDebugView)
        return;
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "setGameInfoDebugViewText", index, text);
}

void setJSBInvocationCountJNI(int count)
{
    if (!__isOpenDebugView)
        return;
    JniHelper::callStaticVoidMethod(JCLS_HELPER, "setJSBInvocationCount", count);
}

void openDebugViewJNI()
{
    if (!__isOpenDebugView)
    {
        LOGD("openDebugViewJNI ...");
        __isOpenDebugView = true;
        JniHelper::callStaticVoidMethod(JCLS_HELPER, "openDebugView");
        if (!__isGLOptModeEnabled)
        {
            JniHelper::callStaticVoidMethod(JCLS_HELPER, "disableBatchGLCommandsToNative");
        }
    }
}

void disableBatchGLCommandsToNativeJNI()
{
    __isGLOptModeEnabled = false;
    if (__isOpenDebugView)
    {
        JniHelper::callStaticVoidMethod(JCLS_HELPER, "disableBatchGLCommandsToNative");
    }
}

void exitApplication()
{
    g_isGameFinished = true;
}


bool getApplicationExited()
{
    return g_isGameFinished;
}

int getAndroidSDKInt()
{
    return g_SDKInt;
}


