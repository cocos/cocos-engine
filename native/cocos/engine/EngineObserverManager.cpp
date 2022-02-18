/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "engine/EngineObserverManager.h"

namespace cc {

void EngineObserverManager::onEngineInit() {
    for (auto &it : _observers) {
        it->onEngineInit();
    }
}

void EngineObserverManager::onEngineStart() {
    for (auto &it : _observers) {
        it->onEngineStart();
    }
}

void EngineObserverManager::onEnginePause() {
    for (auto &it : _observers) {
        it->onEnginePause();
    }
}

void EngineObserverManager::onEngineResume() {
    for (auto &it : _observers) {
        it->onEngineResume();
    }
}

void EngineObserverManager::onEngineClose() {
    for (auto &it : _observers) {
        it->onEngineClose();
    }
}

void EngineObserverManager::registrObserver(EngineObserver *observer) {
    _observers.push_back(observer);
}

void EngineObserverManager::unregistrObserver(EngineObserver *observer) {
    auto it = std::find(_observers.begin(), _observers.end(), observer);
    if (it != _observers.end()) {
        _observers.erase(it);
    }
}

} // namespace cc
