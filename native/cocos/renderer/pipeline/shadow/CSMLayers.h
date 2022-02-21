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

#pragma once

#include "../base/TypeDef.h"
#include "../math/Mat4.h"
#include "scene/DirectionalLight.h"

namespace cc {
namespace pipeline {

struct CSMLayerInfo {
    uint  _level;
    float _shadowCameraNear;
    float _shadowCameraFar;

    Mat4 _matShadowView;
    Mat4 _matShadowProj;
    Mat4 _matShadowViewProj;

    explicit CSMLayerInfo(uint level) {
        _level            = level;
        _shadowCameraNear = 0.0F;
        _shadowCameraFar  = 0.0F;
        _matShadowView.setZero();
        _matShadowProj.setZero();
        _matShadowViewProj.setZero();
    }
};

class CSMLayers {
public:
    /**
     * @en MAX_FAR. This is shadow camera max far.
     * @zh 阴影相机的最远视距。
     */
    static constexpr float SHADOW_CSM_LAMBDA{0.75F};

    CSMLayers() = default;
    ~CSMLayers();

    vector<CSMLayerInfo *> getShadowCSMLayers() const { return _shadowCSMLayers; }

    void update(scene::DirectionalLight *dirLight);

    void shadowFrustumItemToString();

private:
    void splitFrustumLevels();

    uint                     _shadowCSMLevelCount{0};
    scene::DirectionalLight *_dirLight{nullptr};
    vector<CSMLayerInfo *>   _shadowCSMLayers;
};
} // namespace pipeline
} // namespace cc
