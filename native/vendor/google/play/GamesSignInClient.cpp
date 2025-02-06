
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

PlayTask* GamesSignInClient::requestServerSideAccess(const std::string& var1, bool var2) {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_GAMES_SIGNIN_CLIENT, "requestServerSideAccess", var1, var2);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* GamesSignInClient::signIn() {
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_GAMES_SIGNIN_CLIENT, "signIn");
    return PlayTaskManager::getInstance()->addTask(taskId);
}

} // namespace cc