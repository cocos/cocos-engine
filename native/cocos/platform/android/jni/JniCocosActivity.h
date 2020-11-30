#pragma once

#include <string>
#include <android/native_window.h>
#include <android/asset_manager.h>
#include <mutex>
#include <condition_variable>

namespace cc {

struct CocosApp {
	AAssetManager *assetManager = nullptr;
	ANativeWindow *window = nullptr;
	std::string obbPath;
	int sdkVersion = 0;

    std::mutex mutex;
    std::condition_variable cond;
	ANativeWindow* pendingWindow = nullptr;
	bool destroyRequested = false;
	bool animating = true;
	bool running = false;

	// Current state of the app's activity.  May be either APP_CMD_RESUME, APP_CMD_PAUSE.
    int activityState = 0;
};

extern CocosApp cocosApp;

}
