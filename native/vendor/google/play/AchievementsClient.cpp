
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