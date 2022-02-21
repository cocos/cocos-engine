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

#include "CSMLayers.h"
#include "../base/Log.h"

namespace cc {
namespace pipeline {

CSMLayers::~CSMLayers() {
    _dirLight = nullptr;
    for (const auto *shadowCSMLayer : _shadowCSMLayers) {
        if (shadowCSMLayer) {
            delete shadowCSMLayer;
            shadowCSMLayer = nullptr;
        }
    }

    _shadowCSMLayers.clear();
}

void CSMLayers::update(scene::DirectionalLight* dirLight) {
    _dirLight = dirLight;
    _shadowCSMLevelCount = static_cast<uint>(dirLight->getShadowCSMLevel());

    bool isRecalculate = false;
    if (_shadowCSMLayers.size() < _shadowCSMLevelCount) {
        for (uint i = static_cast<uint>(_shadowCSMLayers.size()); i < _shadowCSMLevelCount; ++i) {
            _shadowCSMLayers.emplace_back(new CSMLayerInfo(i));
        }
        isRecalculate = true;
    }

    if (dirLight->getShadowCSMValueDirty() || isRecalculate) {
        splitFrustumLevels();
    }
}

void CSMLayers::shadowFrustumItemToString() {
    for (uint i = 0; i < _shadowCSMLevelCount; ++i) {
        CC_LOG_INFO("CSMLayers._shadowCSMLayers[",
                    i, "] = (", _shadowCSMLayers.at(i)->_shadowCameraNear, ", ", _shadowCSMLayers.at(i)->_shadowCameraNear, ")");
    }
}

void CSMLayers::splitFrustumLevels() {
    GP_ASSERT(_dirLight);

    constexpr float nd = 0.1F;
    const float fd = _dirLight->getShadowDistance();
    const float ratio = fd / nd;
    const uint  level = static_cast<uint>(_dirLight->getShadowCSMLevel());
    _shadowCSMLayers.at(0)->_shadowCameraNear = nd;
    for (uint i = 1; i < level; ++i) {
        // i ÷ numbers of level
        const float si = static_cast<float>(i) / static_cast<float>(level);
        const float preNear = SHADOW_CSM_LAMBDA * (nd * powf(ratio, si)) + (1.0F - SHADOW_CSM_LAMBDA) * (nd + (fd - nd) * si);
        // Slightly increase the overlap to avoid fracture
        const float nextFar = preNear * 1.005F;
        _shadowCSMLayers.at(i)->_shadowCameraNear = preNear;
        _shadowCSMLayers.at(i - 1)->_shadowCameraFar = nextFar;
    }
    // numbers of level - 1
    _shadowCSMLayers.at(level - 1)->_shadowCameraFar = fd;

    _dirLight->setShadowCSMValueDirty(false);
}

} // namespace pipeline
} // namespace cc
