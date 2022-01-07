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

#include "base/Ptr.h"
#include "base/RefCounted.h"

namespace cc {

namespace scene {
class AmbientInfo;
class ShadowsInfo;
class SkyboxInfo;
class FogInfo;
class OctreeInfo;
} // namespace scene

class SceneGlobals : public RefCounted {
public:
    SceneGlobals();
    ~SceneGlobals() override = default;

    void activate();

    inline scene::AmbientInfo *getAmbientInfo() const { return _ambientInfo.get(); }
    inline scene::ShadowsInfo *getShadowsInfo() const { return _shadowInfo.get(); }
    inline scene::SkyboxInfo * getSkyboxInfo() const { return _skyboxInfo.get(); }
    inline scene::FogInfo *    getFogInfo() const { return _fogInfo.get(); }
    inline scene::OctreeInfo * getOctreeInfo() const { return _octreeInfo.get(); }

    inline void setAmbientInfo(scene::AmbientInfo *info) { _ambientInfo = info; }
    inline void setShadowsInfo(scene::ShadowsInfo *info) { _shadowInfo = info; }
    inline void setSkyboxInfo(scene::SkyboxInfo *info) { _skyboxInfo = info; }
    inline void setFogInfo(scene::FogInfo *info) { _fogInfo = info; }
    inline void setOctreeInfo(scene::OctreeInfo *info) { _octreeInfo = info; }

private:
    IntrusivePtr<scene::AmbientInfo> _ambientInfo;
    IntrusivePtr<scene::ShadowsInfo> _shadowInfo;
    IntrusivePtr<scene::SkyboxInfo>  _skyboxInfo;
    IntrusivePtr<scene::FogInfo>     _fogInfo;
    IntrusivePtr<scene::OctreeInfo>  _octreeInfo;
};

} // namespace cc
