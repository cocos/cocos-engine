/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "scene/LODGroup.h"
#include <cmath>
#include "core/scene-graph/Node.h"
#include "scene/Camera.h"

namespace cc {
namespace scene {

void LODData::eraseModel(Model *model) {
    for (auto iter = _vecModels.begin(); iter != _vecModels.end(); iter++) {
        if (*iter == model) {
            _vecModels.erase(iter);
            break;
        }
    }
}

LODGroup::LODGroup() = default;

LODGroup::~LODGroup() = default;

void LODGroup::destroy() {
    for (auto &iter : _vecLOD) {
        iter->clearModels();
    }
    _vecLOD.clear();
    _node = nullptr;
}

int8_t LODGroup::getVisibleLOD(const Camera *camera) {
    auto screenUsagePercentage = getScreenUsagePercentage(camera);

    auto lodIndex = -1;
    for (auto i = 0; i < _vecLOD.size(); ++i) {
        auto &lod = _vecLOD[i];
        if (screenUsagePercentage >= lod->getScreenUsagePercentage()) {
            lodIndex = i;
            break;
        }
    }
    return lodIndex;
}

float LODGroup::getScreenUsagePercentage(const Camera *camera) {
    if (!_node.get()) {
        return 0;
    }

    auto distance = 0;
    if (camera->getProjectionType() == CameraProjection::PERSPECTIVE) {
        Vec3 tmp{_localBoundaryCenter};
        tmp.transformMat4(_node->getWorldMatrix());
        tmp.subtract(camera->getNode()->getPosition());
        distance = tmp.length();
    }

    return distanceToScreenUsagePercentage(camera, distance, getWorldSpaceSize());
}

float LODGroup::distanceToScreenUsagePercentage(const Camera *camera, float distance, float size) {
    if (camera->getProjectionType() == CameraProjection::PERSPECTIVE) {
        return (size * camera->getMatProj().m[5]) / (distance * 2.0); // note: matProj.m11 is 1 / tan(fov / 2.0)
    } else {
        return size * camera->getMatProj().m[5] * 0.5;
    }
}

float LODGroup::getWorldSpaceSize() {
    auto scale = _node->getScale();
    auto maxScale = fmaxf(fabs(scale.x), fabs(scale.y));
    maxScale = fmaxf(maxScale, fabs(scale.z));
    return maxScale * _objectSize;
}

void LODGroup::lockLODLevels(ccstd::vector<int> &levels) {
    _vecLockLevels.clear();
    _vecLockLevels.insert(_vecLockLevels.begin(), levels.begin(), levels.end());
}

void LODGroup::insertLOD(uint8_t index, LODData *data) {
    if (index >= _vecLOD.size()) {
        _vecLOD.push_back(data);
    } else {
        _vecLOD.insert(_vecLOD.begin() + index, data);
    }
}

void LODGroup::updateLOD(uint8_t index, LODData *data) {
    if (index >= _vecLOD.size()) {
        CC_LOG_WARNING("LODGroup updateLOD error, index out of range.");
        return;
    }
    _vecLOD[index] = data;
}

void LODGroup::eraseLOD(uint8_t index) {
    if (index >= _vecLOD.size()) {
        CC_LOG_WARNING("LODGroup eraseLOD error, index out of range.");
        return;
    }
    _vecLOD.erase(_vecLOD.begin() + index);
}

} // namespace scene
} // namespace cc
