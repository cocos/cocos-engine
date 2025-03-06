
/****************************************************************************
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

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
#include "cocos/platform/java/jni/JniHelper.h"
#include "vendor/google/play/PlayTaskManager.h"
#include "vendor/google/play/GamesSignInClient.h"

namespace cc {

namespace {
#ifndef JCLS_GOOGLE_PLAY_GAMES_SIGNIN_CLIENT
    #define JCLS_GOOGLE_PLAY_GAMES_SIGNIN_CLIENT "google/play/GamesSignInClientHelper"
#endif
}; // namespace

PlayTask* GamesSignInClient::isAuthenticated() {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_GAMES_SIGNIN_CLIENT, "isAuthenticated");
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* GamesSignInClient::requestServerSideAccess(const std::string& serverClientId, bool forceRefreshToken) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_GAMES_SIGNIN_CLIENT, "requestServerSideAccess", serverClientId, forceRefreshToken);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* GamesSignInClient::signIn() {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_GAMES_SIGNIN_CLIENT, "signIn");
    return PlayTaskManager::getInstance()->addTask(taskId);
}

} // namespace cc