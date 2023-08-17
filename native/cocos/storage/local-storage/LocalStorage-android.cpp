/****************************************************************************
 Copyright (c) 2012 Zynga Inc.
 Copyright (c) 2013 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologic Inc.
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include <cstdio>
#include <cstdlib>
#include "base/Macros.h"
#include "jni.h"
#include "platform/java/jni/JniHelper.h"
#include "storage/local-storage/LocalStorage.h"

#ifndef JCLS_LOCALSTORAGE
    #define JCLS_LOCALSTORAGE "com/cocos/lib/CocosLocalStorage"
#endif

using namespace cc; //NOLINT
static int gInitialized = 0;

static void splitFilename(ccstd::string &str) {
    size_t found = 0;
    found = str.find_last_of("/\\");
    if (found != ccstd::string::npos) {
        str = str.substr(found + 1);
    }
}

void localStorageInit(const ccstd::string &fullpath) {
    if (fullpath.empty()) {
        return;
    }

    if (!gInitialized) {
        ccstd::string strDBFilename = fullpath;
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
void localStorageSetItem(const ccstd::string &key, const ccstd::string &value) {
    CC_ASSERT(gInitialized);
    JniHelper::callStaticVoidMethod(JCLS_LOCALSTORAGE, "setItem", key, value);
}

/** gets an item from the LS */
bool localStorageGetItem(const ccstd::string &key, ccstd::string *outItem) {
    CC_ASSERT(gInitialized);
    JniMethodInfo t;

    if (JniHelper::getStaticMethodInfo(t, JCLS_LOCALSTORAGE, "getItem", "(Ljava/lang/String;)Ljava/lang/String;")) {
        jstring jkey = t.env->NewStringUTF(key.c_str());
        auto *jret = static_cast<jstring>(t.env->CallStaticObjectMethod(t.classID, t.methodID, jkey));
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
void localStorageRemoveItem(const ccstd::string &key) {
    CC_ASSERT(gInitialized);
    JniHelper::callStaticVoidMethod(JCLS_LOCALSTORAGE, "removeItem", key);
}

/** removes all items from the LS */
void localStorageClear() {
    CC_ASSERT(gInitialized);
    JniHelper::callStaticVoidMethod(JCLS_LOCALSTORAGE, "clear");
}

/** gets an key from the JS. */
void localStorageGetKey(const int nIndex, ccstd::string *outKey) {
    CC_ASSERT(gInitialized);
    outKey->assign(JniHelper::callStaticStringMethod(JCLS_LOCALSTORAGE, "getKey", nIndex));
}

/** gets all items count in the JS. */
void localStorageGetLength(int &outLength) {
    CC_ASSERT(gInitialized);
    outLength = JniHelper::callStaticIntMethod(JCLS_LOCALSTORAGE, "getLength");
}
