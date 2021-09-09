/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "Define.h"
#include "scene/Define.h"
#include "scene/Light.h"
#include "scene/Sphere.h"

namespace cc {

namespace gfx {
class Framebuffer;
}

namespace pipeline {

class RenderPipeline;

class CC_DLL PipelineSceneData : public Object {
public:
    PipelineSceneData()           = default;
    ~PipelineSceneData() override = default;
    void activate(gfx::Device *device, RenderPipeline *pipeline);
    void setPipelineSharedSceneData(scene::PipelineSharedSceneData *data);
    void destroy();

    inline void                                                                setShadowFramebuffer(const scene::Light *light, gfx::Framebuffer *framebuffer) { _shadowFrameBufferMap.emplace(light, framebuffer); }
    inline const std::unordered_map<const scene::Light *, gfx::Framebuffer *> &getShadowFramebufferMap() const { return _shadowFrameBufferMap; }
    inline scene::PipelineSharedSceneData *                                    getSharedData() const { return _sharedSceneData; }
    inline const RenderObjectList &                                            getRenderObjects() const { return _renderObjects; }
    inline const RenderObjectList &                                            getShadowObjects() const { return _shadowObjects; }
    inline void                                                                setRenderObjects(RenderObjectList &&ro) { _renderObjects = std::forward<RenderObjectList>(ro); }
    inline void                                                                setShadowObjects(RenderObjectList &&ro) { _shadowObjects = std::forward<RenderObjectList>(ro); }
    inline float                                                               getShadowCameraFar() const { return _shadowCameraFar; }
    inline void                                                                setShadowCameraFar(float shadowDistance) { _shadowCameraFar = shadowDistance; }
    inline Mat4                                                                getMatShadowView() const { return _matShadowView; }
    inline void                                                                setMatShadowView(const Mat4 &matShadowView) { _matShadowView = matShadowView; }
    inline Mat4                                                                getMatShadowProj() const { return _matShadowProj; }
    inline void                                                                setMatShadowProj(const Mat4 &matShadowProj) { _matShadowProj = matShadowProj; }
    inline Mat4                                                                getMatShadowViewProj() const { return _matShadowViewProj; }
    inline void                                                                setMatShadowViewProj(const Mat4 &matShadowViewProj) { _matShadowViewProj = matShadowViewProj; }

private:
    RenderObjectList _renderObjects;
    RenderObjectList _shadowObjects;

    scene::PipelineSharedSceneData *_sharedSceneData      = nullptr;
    RenderPipeline *                _pipeline             = nullptr;
    gfx::Device *                   _device               = nullptr;
    float                           _shadowCameraFar       = 0.0F;
    Mat4                            _matShadowView;
    Mat4                            _matShadowProj;
    Mat4                            _matShadowViewProj;

    std::unordered_map<const scene::Light *, gfx::Framebuffer *> _shadowFrameBufferMap;
};

} // namespace pipeline
} // namespace cc
