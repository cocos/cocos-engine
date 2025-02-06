
#include "cocos/platform/java/jni/JniHelper.h"
#include "vendor/google/play/PlayTaskManager.h"
#include "vendor/google/play/RecallClient.h"

namespace cc {

PlayTask* RecallClient::requestRecallAccess() {
    int taskId = JniHelper::callStaticIntMethod("google/play/RecallClientHelper", "requestRecallAccess");
    return PlayTaskManager::getInstance()->addTask(taskId);
}

} // namespace cc
