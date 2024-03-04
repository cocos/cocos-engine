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
    static inline const ccstd::vector<Mat4>& getTransforms()  { return description->transforms; }
    static inline const ccstd::vector<Mat4>& getTransformPrev() { return description->transformPrev; }
    static inline const ccstd::vector<uint32_t>& getOpaqueOrMaskInstanceIDs() { return description->opaqueOrMaskInstanceIDs; }
    static inline const gfx::Buffer* getInstanceBuffer()  { return description->instanceBuffer.get(); }
    static inline const gfx::Buffer* getTransformBuffer()  { return description->transformBuffer.get(); }
    static inline const gfx::Buffer* getTransformPrevBuffer() { return description->transformPrevBuffer.get(); }
    static inline const gfx::Buffer* getMeshPrimitiveBuffer() { return description->meshPrimitiveBuffer.get(); }
    static inline const gfx::Buffer* getMaterialBuffer() { return description->materialBuffer.get(); }
    static inline const gfx::Buffer* getOpaqueOrMaskInstanceIDsBuffer() { return description->opaqueOrMaskInstanceIDsBuffer.get(); }
    static inline scene::RenderScene* getRenderScene() { return renderScene; }
    static inline Description* getDescription() { return description; }
    // setter
    static void setRenderScene(RenderScene* scene);

    void activate();

private:
    static void beforeRender();
    static MeshPrim buildRayTracingMeshPrimitive(const IntrusivePtr<SubModel>& subModel);
    static IntrusivePtr<RenderScene> renderScene;
    static IntrusivePtr<Description> description;
    static uint32_t instanceNum;
    static void buildRayTracingInstanceData();
    static MaterialProperty getPassUniform(const IntrusivePtr<Pass>& pass, const std::string& name);
    static float getPassUniformAsFloat(const IntrusivePtr<Pass>& pass,  const std::string& name);
    static void addTexture(const IntrusivePtr<Pass>& pass, const std::string& name, uint32_t binding);
    static void addMaterial(const IntrusivePtr<Pass>& pass);
};
} // namespace raytracing
} // namespace scene
} // namespace cc
