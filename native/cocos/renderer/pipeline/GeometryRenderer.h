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

// NOTE: Still need to wrap all code in CC_USE_GEOMETRY_RENDERER block
// since auto-generated binding code will include GeometryRenderer.h
#if CC_USE_GEOMETRY_RENDERER

    #include "base/Macros.h"
    #include "base/RefCounted.h"
    #include "gfx-base/GFXDef-common.h"
    #include "math/Vec2.h"
    #include "math/Vec3.h"
    #include "math/Vec4.h"

namespace cc {

class Mat4;
namespace gfx {
class Device;
class RenderPass;
class CommandBuffer;
} // namespace gfx

namespace geometry {
class AABB;
class Frustum;
class Spline;
} // namespace geometry

namespace scene {
class Pass;
} // namespace scene

namespace pipeline {
class PipelineSceneData;
struct GeometryVertexBuffers;

struct GeometryRendererInfo {
    GeometryRendererInfo();

    uint32_t maxLines{0U};
    uint32_t maxDashedLines{0U};
    uint32_t maxTriangles{0U};
};

class GeometryRenderer : public RefCounted {
public:
    GeometryRenderer();
    ~GeometryRenderer() override;
    GeometryRenderer(const GeometryRenderer &) = delete;
    GeometryRenderer(GeometryRenderer &&) = delete;
    GeometryRenderer &operator=(const GeometryRenderer &) = delete;
    GeometryRenderer &operator=(GeometryRenderer &&) = delete;

    void activate(gfx::Device *device, const GeometryRendererInfo &info = GeometryRendererInfo());
    void render(gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff, PipelineSceneData *sceneData);
    void destroy();
    bool empty() const;
    void update();

    void addDashedLine(const Vec3 &v0, const Vec3 &v1, gfx::Color color, bool depthTest = true);
    void addLine(const Vec3 &v0, const Vec3 &v1, gfx::Color color, bool depthTest = true);
    void addTriangle(const Vec3 &v0, const Vec3 &v1, const Vec3 &v2, gfx::Color color, bool wireframe = true, bool depthTest = true, bool unlit = false);             // counterclockwise
    void addQuad(const Vec3 &v0, const Vec3 &v1, const Vec3 &v2, const Vec3 &v3, gfx::Color color, bool wireframe = true, bool depthTest = true, bool unlit = false); // counterclockwise
    void addBoundingBox(const geometry::AABB &aabb, gfx::Color color, bool wireframe = true, bool depthTest = true, bool unlit = false, bool useTransform = false, const Mat4 &transform = Mat4());
    void addCross(const Vec3 &center, float size, gfx::Color color, bool depthTest = true);
    void addFrustum(const geometry::Frustum &frustum, gfx::Color color, bool depthTest = true);
    void addCapsule(const Vec3 &center, float radius, float height, gfx::Color color, uint32_t segmentsU = 32U, uint32_t hemiSegmentsV = 8U, bool wireframe = true, bool depthTest = true, bool unlit = false, bool useTransform = false, const Mat4 &transform = Mat4());
    void addCylinder(const Vec3 &center, float radius, float height, gfx::Color color, uint32_t segments = 32U, bool wireframe = true, bool depthTest = true, bool unlit = false, bool useTransform = false, const Mat4 &transform = Mat4());
    void addCone(const Vec3 &center, float radius, float height, gfx::Color color, uint32_t segments = 32U, bool wireframe = true, bool depthTest = true, bool unlit = false, bool useTransform = false, const Mat4 &transform = Mat4());
    void addCircle(const Vec3 &center, float radius, gfx::Color color, uint32_t segments = 32U, bool depthTest = true, bool useTransform = false, const Mat4 &transform = Mat4());
    void addArc(const Vec3 &center, float radius, gfx::Color color, float startAngle, float endAngle, uint32_t segments = 32U, bool depthTest = true, bool useTransform = false, const Mat4 &transform = Mat4());
    void addPolygon(const Vec3 &center, float radius, gfx::Color color, uint32_t segments = 6U, bool wireframe = true, bool depthTest = true, bool unlit = false, bool useTransform = false, const Mat4 &transform = Mat4());
    void addDisc(const Vec3 &center, float radius, gfx::Color color, uint32_t segments = 32U, bool wireframe = true, bool depthTest = true, bool unlit = false, bool useTransform = false, const Mat4 &transform = Mat4());
    void addSector(const Vec3 &center, float radius, gfx::Color color, float startAngle, float endAngle, uint32_t segments = 32U, bool wireframe = true, bool depthTest = true, bool unlit = false, bool useTransform = false, const Mat4 &transform = Mat4());
    void addSphere(const Vec3 &center, float radius, gfx::Color color, uint32_t segmentsU = 32U, uint32_t segmentsV = 16U, bool wireframe = true, bool depthTest = true, bool unlit = false, bool useTransform = false, const Mat4 &transform = Mat4());
    void addTorus(const Vec3 &center, float bigRadius, float radius, gfx::Color color, uint32_t segmentsU = 32U, uint32_t segmentsV = 32U, bool wireframe = true, bool depthTest = true, bool unlit = false, bool useTransform = false, const Mat4 &transform = Mat4());
    void addOctahedron(const Vec3 &center, float radius, gfx::Color color, bool wireframe = true, bool depthTest = true, bool unlit = false, bool useTransform = false, const Mat4 &transform = Mat4());
    void addBezier(const Vec3 &v0, const Vec3 &v1, const Vec3 &v2, const Vec3 &v3, gfx::Color color, uint32_t segments = 32U, bool depthTest = true, bool useTransform = false, const Mat4 &transform = Mat4());
    void addSpline(const geometry::Spline &spline, gfx::Color color, uint32_t index = 0xffffffff, float knotSize = 0.5F, uint32_t segments = 32U, bool depthTest = true);
    void addMesh(const Vec3 &center, const ccstd::vector<Vec3> &vertices, gfx::Color color, bool depthTest = true, bool useTransform = false, const Mat4 &transform = Mat4());
    void addIndexedMesh(const Vec3 &center, const ccstd::vector<Vec3> &vertices, const ccstd::vector<uint32_t> &indices, gfx::Color color, bool depthTest = true, bool useTransform = false, const Mat4 &transform = Mat4());

private:
    void reset();

    gfx::Device *_device{nullptr};
    GeometryVertexBuffers *_buffers{nullptr};
};

} // namespace pipeline
} // namespace cc

#endif // #if CC_USE_GEOMETRY_RENDERER
