/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include <vector>
#include "base/Macros.h"
#include "base/RefCounted.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDevice.h"
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
} // namespace geometry

namespace scene {
class Pass;
} // namespace scene

namespace pipeline {

class RenderPipeline;
struct GeometryVertexBuffers;

struct GeometryConfig {
    GeometryConfig();

    uint32_t maxLines{0U};
    uint32_t maxDashedLines{0U};
    uint32_t maxTriangles{0U};
};

class GeometryRenderer : public RefCounted {
public:
    GeometryRenderer();
    ~GeometryRenderer() override;
    GeometryRenderer(const GeometryRenderer &) = delete;
    GeometryRenderer(GeometryRenderer &&)      = delete;
    GeometryRenderer &operator=(const GeometryRenderer &) = delete;
    GeometryRenderer &operator=(GeometryRenderer &&) = delete;

    void activate(gfx::Device *device, RenderPipeline *pipeline, const GeometryConfig &config = GeometryConfig());
    void flushFromJSB(uint32_t type, uint32_t index, void *vb, uint32_t vertexCount);
    void render(gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff);
    void destroy();

    void addDashedLine(const Vec3 &v0, const Vec3 &v1, gfx::Color color, bool depthTest = true);
    void addLine(const Vec3 &v0, const Vec3 &v1, gfx::Color color, bool depthTest = true);
    void addTriangle(const Vec3 &v0, const Vec3 &v1, const Vec3 &v2, gfx::Color color, bool wireframe = true, bool depthTest = true, bool unlit = false);             // counterclockwise
    void addQuad(const Vec3 &v0, const Vec3 &v1, const Vec3 &v2, const Vec3 &v3, gfx::Color color, bool wireframe = true, bool depthTest = true, bool unlit = false); // counterclockwise
    void addBoundingBox(const geometry::AABB *aabb, gfx::Color color, bool wireframe = true, bool depthTest = true, bool unlit = false, bool useTransform = false, const Mat4 &transform = Mat4());
    void addCross(const Vec3 &center, float size, gfx::Color color, bool depthTest = true);
    void addFrustum(const geometry::Frustum *frustum, gfx::Color color, bool depthTest = true);
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
    void addMesh(const Vec3 &center, const std::vector<Vec3> &vertices, gfx::Color color, bool depthTest = true, bool useTransform = false, const Mat4 &transform = Mat4());
    void addIndexedMesh(const Vec3 &center, const std::vector<Vec3> &vertices, const std::vector<uint32_t> &indices, gfx::Color color, bool depthTest = true, bool useTransform = false, const Mat4 &transform = Mat4());

private:
    void update();
    void reset();

    gfx::Device *          _device{nullptr};
    RenderPipeline *       _pipeline{nullptr};
    GeometryVertexBuffers *_buffers{nullptr};
};

} // namespace pipeline
} // namespace cc
