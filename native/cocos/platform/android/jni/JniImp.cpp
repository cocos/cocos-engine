/****************************************************************************
 Copyright (c) 2018-2020 Xiamen Yaji Software Co., Ltd.

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
#include <android/log.h>
#include <jni.h>
#include "JniHelper.h"

#define  JNI_IMP_LOG_TAG    "JniImp"
#define  LOGD(...)  __android_log_print(ANDROID_LOG_DEBUG,JNI_IMP_LOG_TAG,__VA_ARGS__)

#ifndef ORG_ACTIVITY_CLASS_NAME
#define ORG_ACTIVITY_CLASS_NAME org_cocos2dx_lib_Cocos2dxActivity
#endif
#define JNI_ACTIVITY(FUNC) JNI_METHOD1(ORG_ACTIVITY_CLASS_NAME,FUNC)

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

using namespace cocos2d;

namespace
{
    std::string g_apkPath;
    int g_width = 0;
    int g_height = 0;
    int g_SDKInt = 0;
}

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

    /*****************************************************
     * Cocos2dxActivity native functions implementation.
     *****************************************************/


    /***********************************************************
     * Cocos2dxHelper native functions implementation.
     ***********************************************************/

    JNIEXPORT void JNICALL JNI_HELPER(nativeSetApkPath)(JNIEnv* env, jobject thiz, jstring apkPath)
    {
        g_apkPath = JniHelper::jstring2string(apkPath);
    }
} // end of extern "C"

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

int getAndroidSDKInt()
{
    return g_SDKInt;
}


