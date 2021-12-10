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

#pragma once

#include <cstdint>
#include "math/Mat4.h"
#include "math/Vec3.h"
#include "math/Vec4.h"
#include "renderer/gfx-base/GFXDef-common.h"
#include "scene/Frustum.h"
#include "scene/Node.h"
#include "scene/RenderWindow.h"

namespace cc {
namespace scene {

// As RenderScene includes Camera.h, so use forward declaration here.
class RenderScene;

struct Camera final {
    uint32_t      width{0};
    uint32_t      height{0};
    uint32_t      nearClip{0};
    uint32_t      farClip{0};
    uint32_t      clearFlag{0};
    float         exposure{0.0F};
    float         clearDepth{0.0F};
    float         fov{0.0F};
    float         aspect{0.0F};
    Vec4          viewPort;
    uint32_t      clearStencil{0};
    int32_t       visibility{0};
    Node *        node{nullptr};
    RenderScene * scene{nullptr};
    RenderWindow *window{nullptr};
    Frustum       frustum;
    Vec3          forward;
    Vec3          position;
    gfx::Color    clearColor;
    Mat4          matView;
    Mat4          matViewProj;
    Mat4          matViewProjInv;
    Mat4          matProj;
    Mat4          matProjInv;
    Mat4          matViewProjOffscreen;
    Mat4          matViewProjInvOffscreen;
    Mat4          matProjOffscreen;
    Mat4          matProjInvOffscreen;
};

} // namespace scene
} // namespace cc
