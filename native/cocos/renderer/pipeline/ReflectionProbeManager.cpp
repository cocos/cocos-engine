/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "ReflectionProbeManager.h"
#include "scene/ReflectionProbe.h"
namespace cc {

namespace pipeline {
namespace {
ReflectionProbeManager* instance = nullptr;
}

ReflectionProbeManager* ReflectionProbeManager::getInstance() {
    if (instance == nullptr) {
        instance = new ReflectionProbeManager();
    }
    return instance;
}

ReflectionProbeManager::ReflectionProbeManager() {
}
void ReflectionProbeManager::registerProbe(scene::ReflectionProbe* probe) {
    _probes.push_back(probe);
}
scene::ReflectionProbe* ReflectionProbeManager::createReflectionProbe(int32_t id) {
    return ccnew scene::ReflectionProbe(id);
}

const scene::ReflectionProbe* ReflectionProbeManager::getProbeByCamera(const scene::Camera* camera) {
    for (const auto& probe : _probes) {
        if (probe->getCamera() == camera) {
            return probe;
        }
    }
    return nullptr;
}

} // namespace pipeline
} // namespace cc
