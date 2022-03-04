/****************************************************************************
 Copyright (c) 2012 Zynga Inc.
 Copyright (c) 2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologic Inc.
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

/*
 Local Storage support for the JS Bindings for iOS.
 Works on cocos2d-iphone and cocos2d-x.
 */

#include "base/Macros.h"
#include "storage/local-storage/LocalStorage.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)

    #include <cassert>
    #include <cstdio>
    #include <cstdlib>
    #include "jni.h"
    #include "platform/java/jni/JniHelper.h"

    #ifndef JCLS_LOCALSTORAGE
        #define JCLS_LOCALSTORAGE "com/cocos/lib/CocosLocalStorage"
    #endif

using namespace cc; //NOLINT
static int gInitialized = 0;

static void splitFilename(std::string &str) {
    size_t found = 0;
    found        = str.find_last_of("/\\");
    if (found != std::string::npos) {
        str = str.substr(found + 1);
    }
}

void localStorageInit(const std::string &fullpath) {
    if (fullpath.empty()) {
        return;
    }

    if (!gInitialized) {
        std::string strDBFilename = fullpath;
        splitFilename(strDBFilename);
        if (JniHelper::callStaticBooleanMethod(JCLS_LOCALSTORAGE, "init", strDBFilename, "data")) {
            gInitialized = 1;
        }
    }
}

void localStorageFree() {
    if (gInitialized) {
        JniHelper::callStaticVoidMethod(JCLS_LOCALSTORAGE, "destroy");
        gInitialized = 0;
    }
}

/** sets an item in the LS */
void localStorageSetItem(const std::string &key, const std::string &value) {
    assert(gInitialized);
    JniHelper::callStaticVoidMethod(JCLS_LOCALSTORAGE, "setItem", key, value);
}

/** gets an item from the LS */
bool localStorageGetItem(const std::string &key, std::string *outItem) {
    assert(gInitialized);
    JniMethodInfo t;

    if (JniHelper::getStaticMethodInfo(t, JCLS_LOCALSTORAGE, "getItem", "(Ljava/lang/String;)Ljava/lang/String;")) {
        jstring jkey = t.env->NewStringUTF(key.c_str());
        auto *  jret = static_cast<jstring>(t.env->CallStaticObjectMethod(t.classID, t.methodID, jkey));
        if (jret == nullptr) {
            ccDeleteLocalRef(t.env, jret);
            ccDeleteLocalRef(t.env, jkey);
            ccDeleteLocalRef(t.env, t.classID);
            return false;
        }
        outItem->assign(JniHelper::jstring2string(jret));
        ccDeleteLocalRef(t.env, jret);
        ccDeleteLocalRef(t.env, jkey);
        ccDeleteLocalRef(t.env, t.classID);
        return true;
    }
    return false;
}

/** removes an item from the LS */
void localStorageRemoveItem(const std::string &key) {
    assert(gInitialized);
    JniHelper::callStaticVoidMethod(JCLS_LOCALSTORAGE, "removeItem", key);
}

/** removes all items from the LS */
void localStorageClear() {
    assert(gInitialized);
    JniHelper::callStaticVoidMethod(JCLS_LOCALSTORAGE, "clear");
}

/** gets an key from the JS. */
void localStorageGetKey(const int nIndex, std::string *outKey) {
    assert(gInitialized);
    outKey->assign(JniHelper::callStaticStringMethod(JCLS_LOCALSTORAGE, "getKey", nIndex));
}

/** gets all items count in the JS. */
void localStorageGetLength(int &outLength) {
    assert(gInitialized);
    outLength = JniHelper::callStaticIntMethod(JCLS_LOCALSTORAGE, "getLength");
}

#endif // #if (CC_PLATFORM == CC_PLATFORM_ANDROID)
