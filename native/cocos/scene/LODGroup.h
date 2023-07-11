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

#pragma once

#include "Model.h"
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "base/TypeDef.h"
#include "base/std/container/string.h"
#include "math/Vec3.h"

namespace cc {
class Node;

namespace scene {

class RenderScene;
class Camera;
class Model;

class LODData final : public RefCounted {
public:
    inline float getScreenUsagePercentage() const { return _screenUsagePercentage; }
    inline void setScreenUsagePercentage(float val) { _screenUsagePercentage = val; }

    inline const ccstd::vector<IntrusivePtr<Model>> &getModels() const { return _vecModels; }

    inline void addModel(Model *model) { _vecModels.emplace_back(model); }
    inline void clearModels() { _vecModels.clear(); }
    void eraseModel(Model *model);

private:
    float _screenUsagePercentage{1.F};
    ccstd::vector<IntrusivePtr<Model>> _vecModels;
};

class LODGroup final : public RefCounted {
public:
    LODGroup();
    ~LODGroup() override;

    inline void attachToScene(RenderScene *scene) { _scene = scene; }
    inline void detachFromScene() { _scene = nullptr; }

    inline bool isEnabled() const { return _enabled; }
    inline void setEnabled(bool val) { _enabled = val; }

    inline float getObjectSize() const { return _objectSize; }
    inline void setObjectSize(float val) { _objectSize = val; }

    inline Node *getNode() const { return _node.get(); }
    void setNode(Node *node) { _node = node; }

    inline RenderScene *getScene() const { return _scene; }

    inline const Vec3 &getLocalBoundaryCenter() const { return _localBoundaryCenter; }
    inline void setLocalBoundaryCenter(const Vec3 &value) { _localBoundaryCenter = value; }

    inline const ccstd::vector<IntrusivePtr<LODData>> &getLodDataArray() const { return _vecLODData; }

    int8_t getVisibleLODLevel(const Camera *camera) const;

    inline const ccstd::vector<uint8_t> &getLockedLODLevels() const { return _vecLockedLevels; }
    void lockLODLevels(ccstd::vector<int> &levels);
    inline bool isLockLevelChanged() const { return _isLockLevelChanged; }
    inline void resetLockChangeFlag() { _isLockLevelChanged = false; }

    inline uint8_t getLodCount() const { return _vecLODData.size(); }
    inline void clearLODs() { _vecLODData.clear(); }
    void insertLOD(uint8_t index, LODData *data);
    void updateLOD(uint8_t index, LODData *data);
    void eraseLOD(uint8_t index);

private:
    float getScreenUsagePercentage(const Camera *camera) const;
    static float distanceToScreenUsagePercentage(const Camera *camera, float distance, float size);
    float getWorldSpaceSize() const;

    ccstd::vector<IntrusivePtr<LODData>> _vecLODData;
    ccstd::vector<uint8_t> _vecLockedLevels;
    IntrusivePtr<Node> _node;
    RenderScene *_scene{nullptr};
    Vec3 _localBoundaryCenter;
    float _objectSize{1.F};
    bool _enabled{true};
    bool _isLockLevelChanged{false};

    CC_DISALLOW_COPY_MOVE_ASSIGN(LODGroup);
};

} // namespace scene
} // namespace cc
