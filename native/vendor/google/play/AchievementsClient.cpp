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

PlayTask* AchievementsClient::load(bool forceReload) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "load", forceReload);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* AchievementsClient::incrementImmediate(const std::string& id, int numSteps) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "incrementImmediate", id, numSteps);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* AchievementsClient::revealImmediate(const std::string& id) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "revealImmediate", id);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* AchievementsClient::setStepsImmediate(const std::string& id, int numSteps) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "setStepsImmediate", id, numSteps);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* AchievementsClient::unlockImmediate(const std::string& id) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "unlockImmediate", id);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

void AchievementsClient::increment(const std::string& id, int numSteps) {
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "increment", id, numSteps);
}

void AchievementsClient::reveal(const std::string& id) {
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "reveal", id);
}

void AchievementsClient::setSteps(const std::string& id, int numSteps) {
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "setSteps", id, numSteps);
}

void AchievementsClient::unlock(const std::string& id) {
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_ACHIEVEMENTS_CLIENT, "unlock", id);
}
} // namespace cc