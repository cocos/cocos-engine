
#include "vendor/google/play/PlayGames.h"
#include "platform/java/jni/JniHelper.h"

namespace cc {
GamesSignInClient PlayGames::_signinClient;
AchievementsClient PlayGames::_achievementsClient;
RecallClient PlayGames::_recallClient;


void PlayGamesSdk::initialize() {
    JniHelper::callStaticVoidMethod("google/play/PlayGamesSdkHelper", "initialize");
}

} // namespace cc