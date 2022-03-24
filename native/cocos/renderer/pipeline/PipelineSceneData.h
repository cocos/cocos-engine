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

#include "Define.h"
#include "scene/Define.h"
#include "scene/Light.h"
#include "shadow/CSMLayers.h"

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
    inline void                                                                setRenderObjects(RenderObjectList &&ro) { _renderObjects = std::forward<RenderObjectList>(ro); }
    inline const vector<const scene::Light *> &                                getValidPunctualLights() const { return _validPunctualLights; }
    inline void                                                                setValidPunctualLights(vector<const scene::Light *> &&validPunctualLights) { _validPunctualLights = std::forward<vector<const scene::Light *>>(validPunctualLights); }
    inline void                                                                addRenderObject(RenderObject &&obj) { _renderObjects.emplace_back(obj); }
    inline void                                                                clearRenderObjects() { _renderObjects.clear(); }
    inline void                                                                addValidPunctualLight(scene::Light *light) { _validPunctualLights.emplace_back(light); }
    inline void                                                                clearValidPunctualLights() { _validPunctualLights.clear(); }
    inline CSMLayers *                                                         getCSMLayers() const { return _csmLayers; }

private:
    RenderObjectList             _renderObjects;
    vector<const scene::Light *> _validPunctualLights;

    scene::PipelineSharedSceneData *_sharedSceneData = nullptr;
    RenderPipeline *                _pipeline        = nullptr;
    gfx::Device *                   _device          = nullptr;
    CSMLayers *                     _csmLayers       = nullptr;

    std::unordered_map<const scene::Light *, gfx::Framebuffer *> _shadowFrameBufferMap;
};

} // namespace pipeline
} // namespace cc
