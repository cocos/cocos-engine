/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "scene/LODGroup.h"
#include <cmath>
#include "core/scene-graph/Node.h"
#include "scene/Camera.h"

namespace cc {
namespace scene {

void LODData::eraseModel(Model *model) {
    auto iter = std::find(_vecModels.begin(), _vecModels.end(), model);
    if (iter != _vecModels.end()) {
        _vecModels.erase(iter);
    }
}

LODGroup::LODGroup() = default;

LODGroup::~LODGroup() = default;

int8_t LODGroup::getVisibleLODLevel(const Camera *camera) const {
    float screenUsagePercentage = getScreenUsagePercentage(camera);

    int8_t lodIndex = -1;
    for (auto i = 0; i < _vecLODData.size(); ++i) {
        const auto &lod = _vecLODData[i];
        if (screenUsagePercentage >= lod->getScreenUsagePercentage()) {
            lodIndex = i;
            break;
        }
    }
    return lodIndex;
}

float LODGroup::getScreenUsagePercentage(const Camera *camera) const {
    if (!_node.get()) {
        return 0;
    }

    auto distance = 0;
    if (camera->getProjectionType() == CameraProjection::PERSPECTIVE) {
        Vec3 tmp{_localBoundaryCenter};
        tmp.transformMat4(_node->getWorldMatrix());
        tmp.subtract(camera->getNode()->getWorldPosition());
        distance = tmp.length();
    }

    return distanceToScreenUsagePercentage(camera, distance, getWorldSpaceSize());
}

float LODGroup::distanceToScreenUsagePercentage(const Camera *camera, float distance, float size) {
    if (camera->getProjectionType() == CameraProjection::PERSPECTIVE) {
        return static_cast<float>((size * fabs(camera->getMatProj().m[5])) / (distance * 2.0)); // note: matProj.m11 is 1 / tan(fov / 2.0)
    }
    return static_cast<float>(size * fabs(camera->getMatProj().m[5]) * 0.5);
}

float LODGroup::getWorldSpaceSize() const {
    auto scale = _node->getScale();
    auto maxScale = fmaxf(fabs(scale.x), fabs(scale.y));
    maxScale = fmaxf(maxScale, fabs(scale.z));
    return maxScale * _objectSize;
}

void LODGroup::lockLODLevels(ccstd::vector<int> &levels) {
    if (levels.size() != _vecLockedLevels.size()) {
        _isLockLevelChanged = true;
    } else {
        auto size = levels.size();
        for (int index = 0; index < size; index++) {
            if (levels[index] != _vecLockedLevels[index]) {
                _isLockLevelChanged = true;
                break;
            }
        }
    }
    _vecLockedLevels.clear();
    _vecLockedLevels.insert(_vecLockedLevels.begin(), levels.begin(), levels.end());
}

void LODGroup::insertLOD(uint8_t index, LODData *data) {
    if (index >= _vecLODData.size()) {
        _vecLODData.emplace_back(data);
    } else {
        _vecLODData.insert(_vecLODData.begin() + index, data);
    }
}

void LODGroup::updateLOD(uint8_t index, LODData *data) {
    if (index >= _vecLODData.size()) {
        CC_LOG_WARNING("LODGroup updateLOD error, index out of range.");
        return;
    }
    _vecLODData[index] = data;
}

void LODGroup::eraseLOD(uint8_t index) {
    if (index >= _vecLODData.size()) {
        CC_LOG_WARNING("LODGroup eraseLOD error, index out of range.");
        return;
    }
    _vecLODData.erase(_vecLODData.begin() + index);
}

} // namespace scene
} // namespace cc
