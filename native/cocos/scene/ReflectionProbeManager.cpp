/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "ReflectionProbeManager.h"
#include "scene/ReflectionProbe.h"
namespace cc {

namespace scene {
namespace {
ReflectionProbeManager* instance = nullptr;
}

ReflectionProbeManager* ReflectionProbeManager::getInstance() {
    if (instance == nullptr) {
        instance = new ReflectionProbeManager();
    }
    return instance;
}

ReflectionProbeManager::ReflectionProbeManager() = default;
void ReflectionProbeManager::registerProbe(scene::ReflectionProbe* probe) {
    _probes.emplace_back(probe);
}
void ReflectionProbeManager::unRegisterProbe(scene::ReflectionProbe* probe) {
    const auto iter = std::find(_probes.begin(), _probes.end(), probe);
    if (iter != _probes.end()) {
        _probes.erase(iter);
    }
}

ReflectionProbe* ReflectionProbeManager::getReflectionProbeById(int32_t probeId) {
    for (const auto& probe : _probes) {
        if (probe->getProbeId() == probeId) {
            return probe;
        }
    }
    return nullptr;
}

int32_t ReflectionProbeManager::getMaxProbeId() {
    if (_probes.empty()) {
        return -1;
    }
    if (_probes.size() == 1) {
        return _probes[0]->getProbeId();
    }

    std::sort(_probes.begin(), _probes.end(), [](const ReflectionProbe* p1, const ReflectionProbe* p2) {
        return p1->getProbeId() < p2->getProbeId();
    });
    return _probes[_probes.size() - 1]->getProbeId();
}

} // namespace scene
} // namespace cc
