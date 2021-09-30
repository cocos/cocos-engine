/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
 
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
#include "scene/BakedSkinningModel.h"
#include "scene/RenderScene.h"

namespace cc {
namespace scene {
void BakedSkinningModel::updateTransform(uint32_t stamp) {
    Model::updateTransform(stamp);
    if (!_isUploadAnim) {
        return;
    }
    BakedAnimInfo& animInfo  = _jointMedium.animInfo;
    AABB*          skelBound = !_jointMedium.boundsInfo.empty() ? _jointMedium.boundsInfo[*animInfo.data] : nullptr;
    if (_worldBounds && skelBound) {
        Node* node = getTransform();
        skelBound->transform(node->getWorldMatrix(), _worldBounds);
    }

    // Fix me: update twice
    if (_scene) {
        _scene->updateOctree(this);
    }
}

void BakedSkinningModel::updateUBOs(uint32_t stamp) {
    Model::updateUBOs(stamp);
    BakedAnimInfo& info = _jointMedium.animInfo;
    int            idx  = _instAnimInfoIdx;
    if (idx >= 0) {
        std::vector<uint8_t*>& views        = getInstancedAttributeBlock()->views;
        *reinterpret_cast<float*>(views[0]) = *reinterpret_cast<float*>(info.data);
    } else if (info.getDirty()) {
        info.buffer->update(info.data, info.buffer->getSize());
        *info.dirty = 0;
    }
}

} // namespace scene
} // namespace cc
