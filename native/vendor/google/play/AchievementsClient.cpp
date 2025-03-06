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
#include "vendor/google/play/AchievementsClient.h"

namespace cc {

namespace {
#ifndef JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT
    #define JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT "google/play/AchievementsClientHelper"
#endif
}; // namespace

void AchievementsClient::showAchievements() {
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "showAchievements");
}

PlayTask* AchievementsClient::load(bool var1) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "load", var1);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* AchievementsClient::incrementImmediate(const std::string& var1, int var2) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "incrementImmediate", var1, var2);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* AchievementsClient::revealImmediate(const std::string& var1) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "revealImmediate", var1);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* AchievementsClient::setStepsImmediate(const std::string& var1, int var2) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "setStepsImmediate", var1, var2);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* AchievementsClient::unlockImmediate(const std::string& var1) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "unlockImmediate", var1);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

void AchievementsClient::increment(const std::string& var1, int var2) {
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "increment", var1, var2);
}

void AchievementsClient::reveal(const std::string& var1) {
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "reveal", var1);
}

void AchievementsClient::setSteps(const std::string& var1, int var2) {
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "setSteps", var1, var2);
}

void AchievementsClient::unlock(const std::string& var1) {
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "unlock", var1);
}
} // namespace cc