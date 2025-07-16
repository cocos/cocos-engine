/****************************************************************************
 Copyright (c) 2021-2024 Xiamen Yaji Software Co., Ltd.

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
#include <cocos/math/Mat4.h>
#include <cocos/renderer/gfx-base/GFXBuffer.h>
#include <cocos/base/Ptr.h>
#include <cocos/scene/raytracing/Description.h>
#include <cocos/scene/SubModel.h>
#include "cocos/scene/raytracing/Def.h"
namespace cc {
namespace scene {
    class RenderScene;
namespace raytracing {

class RayTracing : public RefCounted {
public:
    explicit RayTracing(RenderScene* scene);
    ~RayTracing() override = default;
    // getter
    inline const ccstd::vector<Mat4>& getTransforms() const  { return _description->transforms; }
    inline const ccstd::vector<Mat4>& getTransformPrev() const { return _description->transformPrev; }
    inline const ccstd::vector<uint32_t>& getOpaqueOrMaskInstanceIDs() const { return _description->opaqueOrMaskInstanceIDs; }
    inline const gfx::Buffer* getInstanceBuffer() const { return _description->instanceBuffer.get(); }
    inline const gfx::Buffer* getTransformBuffer() const { return _description->transformBuffer.get(); }
    inline const gfx::Buffer* getTransformPrevBuffer() const { return _description->transformPrevBuffer.get(); }
    inline const gfx::Buffer* getMeshPrimitiveBuffer() const { return _description->meshPrimitiveBuffer.get(); }
    inline const gfx::Buffer* getMaterialBuffer() const { return _description->materialBuffer.get(); }
    inline const gfx::Buffer* getOpaqueOrMaskInstanceIDsBuffer() const { return _description->opaqueOrMaskInstanceIDsBuffer.get(); }
    inline scene::RenderScene* getRenderScene() const { return _renderScene; }
    inline Description* getDescription() const { return _description; }
    // setter
    void setRenderScene(RenderScene* scene);

    void activate();

private:
    void beforeRender();
    MeshPrim buildRayTracingMeshPrimitive(const IntrusivePtr<SubModel>& subModel);
    IntrusivePtr<RenderScene> _renderScene;
    IntrusivePtr<Description> _description;
    uint32_t _instanceNum;
    void buildRayTracingInstanceData();
    void addTexture(const IntrusivePtr<Pass>& pass, const std::string& name, uint32_t binding);
    void addMaterial(const IntrusivePtr<Pass>& pass);
    static MaterialProperty getPassUniform(const IntrusivePtr<Pass>& pass, const std::string& name);
    static float getPassUniformAsFloat(const IntrusivePtr<Pass>& pass,  const std::string& name);
    
};
} // namespace raytracing
} // namespace scene
} // namespace cc
