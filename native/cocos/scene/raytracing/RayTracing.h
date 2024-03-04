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
    inline const ccstd::vector<Mat4>& getTransforms() const { return _transforms; }
    inline const ccstd::vector<Mat4>& getTransformPrevs() const { return _transformPrevs; }
    inline const ccstd::vector<uint32_t>& getOpaqueOrMaskInstanceIDs() const { return _opaqueOrMaskInstanceIDs; }
    inline const gfx::Buffer* getInstanceBuffer() const { return _instanceBuffer.get(); }
    inline const gfx::Buffer* getTransformBuffer() const { return _transformBuffer.get(); }
    inline const gfx::Buffer* getTransformPrevBuffer() const { return _transformPrevBuffer.get(); }
    inline const gfx::Buffer* getMeshPrimitiveBuffer() const { return _meshPrimitiveBuffer.get(); }
    inline const gfx::Buffer* getMaterialBuffer() const { return _materialBuffer.get(); }
    inline const gfx::Buffer* getOpaqueOrMaskInstanceIDsBuffer() const { return _opaqueOrMaskInstanceIDsBuffer.get(); }
    inline scene::RenderScene* getRenderScene() const { return _renderScene; }
    inline Description* getDescription() const { return _description; }
    // setter
    void setRenderScene(RenderScene* scene);

    void activate();

private:
    ccstd::vector<Mat4> _transforms;
    ccstd::vector<Mat4> _transformPrevs;
    ccstd::vector<uint32_t> _opaqueOrMaskInstanceIDs;
    ccstd::vector<InstanceInfo> _instances;
    ccstd::vector<RaytracingInstance> _raytracingInstances;
    ccstd::vector<RaytracingPrimitive> _raytracingPrimitives;
    ccstd::vector<Material> _materials;
    IntrusivePtr<gfx::Buffer> _instanceBuffer;
    IntrusivePtr<gfx::Buffer> _transformBuffer;
    IntrusivePtr<gfx::Buffer> _transformPrevBuffer;
    IntrusivePtr<gfx::Buffer> _meshPrimitiveBuffer;
    IntrusivePtr<gfx::Buffer> _materialBuffer;
    IntrusivePtr<gfx::Buffer> _opaqueOrMaskInstanceIDsBuffer;
    IntrusivePtr<RenderScene> _renderScene;
    IntrusivePtr<Description> _description;
    uint32_t _instanceNum{0};
    void _beforeRender();
    MeshPrim _buildRaytracingMeshPrimitive(const IntrusivePtr<SubModel>& submodel);
    void _buildRaytracingInstanceData();
    MaterialProperty _getPassUniform(const IntrusivePtr<Pass>& pass, std::string name);
    float _getPassUniformAsFloat(const IntrusivePtr<Pass>& pass, std::string name);
    void _addTexture(const IntrusivePtr<Pass>& pass, std::string name, uint32_t binding);
    void _addMaterial(const IntrusivePtr<Pass>& pass);
};
} // namespace raytracing
} // namespace scene
} // namespace cc
