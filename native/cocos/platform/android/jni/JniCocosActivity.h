#pragma once

#include <string>
#include <android/native_window.h>
#include <android/asset_manager.h>

namespace cc {

struct CocosApp {
	AAssetManager *assetManager = nullptr;
	ANativeWindow *window = nullptr;
	std::string obbPath;
	int sdkVersion = 0;
};

extern CocosApp cocosApp;

}
