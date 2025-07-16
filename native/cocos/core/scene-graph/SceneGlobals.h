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

#include "base/Ptr.h"
#include "base/RefCounted.h"

namespace cc {
class Scene;
namespace scene {
class AmbientInfo;
class ShadowsInfo;
class SkyboxInfo;
class FogInfo;
class OctreeInfo;
class SkinInfo;
class PostSettingsInfo;
} // namespace scene

namespace gi {
class LightProbeInfo;
}

class SceneGlobals : public RefCounted {
public:
    SceneGlobals();
    ~SceneGlobals() override = default;

    void activate(Scene *scene);

    inline scene::AmbientInfo *getAmbientInfo() const { return _ambientInfo.get(); }
    inline scene::ShadowsInfo *getShadowsInfo() const { return _shadowInfo.get(); }
    inline scene::SkyboxInfo *getSkyboxInfo() const { return _skyboxInfo.get(); }
    inline scene::FogInfo *getFogInfo() const { return _fogInfo.get(); }
    inline scene::OctreeInfo *getOctreeInfo() const { return _octreeInfo.get(); }
    inline gi::LightProbeInfo *getLightProbeInfo() const { return _lightProbeInfo.get(); }
    inline bool getBakedWithStationaryMainLight() const { return _bakedWithStationaryMainLight; }
    inline bool getBakedWithHighpLightmap() const { return _bakedWithHighpLightmap; }
    inline scene::SkinInfo *getSkinInfo() const { return _skinInfo.get(); }
    inline scene::PostSettingsInfo *getPostSettingsInfo() const { return _postSettingsInfo.get(); }

    void setAmbientInfo(scene::AmbientInfo *info);
    void setShadowsInfo(scene::ShadowsInfo *info);
    void setSkyboxInfo(scene::SkyboxInfo *info);
    void setFogInfo(scene::FogInfo *info);
    void setOctreeInfo(scene::OctreeInfo *info);
    void setLightProbeInfo(gi::LightProbeInfo *info);
    void setBakedWithStationaryMainLight(bool value);
    void setBakedWithHighpLightmap(bool value);
    void setSkinInfo(scene::SkinInfo *info);
    void setPostSettingsInfo(scene::PostSettingsInfo *info);

private:
    IntrusivePtr<scene::AmbientInfo> _ambientInfo;
    IntrusivePtr<scene::ShadowsInfo> _shadowInfo;
    IntrusivePtr<scene::SkyboxInfo> _skyboxInfo;
    IntrusivePtr<scene::FogInfo> _fogInfo;
    IntrusivePtr<scene::OctreeInfo> _octreeInfo;
    IntrusivePtr<gi::LightProbeInfo> _lightProbeInfo;
    IntrusivePtr<scene::SkinInfo> _skinInfo;
    IntrusivePtr<scene::PostSettingsInfo> _postSettingsInfo;
    bool _bakedWithStationaryMainLight;
    bool _bakedWithHighpLightmap;
};

} // namespace cc
