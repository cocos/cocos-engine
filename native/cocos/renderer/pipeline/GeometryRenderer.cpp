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

#include "GeometryRenderer.h"
#include <algorithm>
#include <array>
#include <cmath>
#include "Define.h"
#include "PipelineStateManager.h"
#include "RenderPipeline.h"
#include "base/Log.h"
#include "math/Mat4.h"
#include "math/Math.h"
#include "core/geometry/AABB.h"
#include "core/geometry/Frustum.h"

namespace cc {
namespace pipeline {

/**
 * GEOMETRY_DEPTH_TYPE_COUNT:
 * [0]: no depthTest
 * [1]: depthTest 
 */
constexpr uint32_t GEOMETRY_DEPTH_TYPE_COUNT       = 2U;
constexpr uint32_t GEOMETRY_NO_DEPTH_TEST_PASS_NUM = 1U;
constexpr uint32_t GEOMETRY_DEPTH_TEST_PASS_NUM    = 2U;
constexpr uint32_t GEOMETRY_VERTICES_PER_LINE      = 2U;
constexpr uint32_t GEOMETRY_VERTICES_PER_TRIANGLE  = 3U;
constexpr uint32_t GEOMETRY_MAX_LINES              = 100000U;
constexpr uint32_t GEOMETRY_MAX_DASHED_LINES       = 10000U;
constexpr uint32_t GEOMETRY_MAX_TRIANGLES          = 10000U;

enum class GeometryType {
    LINE        = 0,
    DASHED_LINE = 1,
    TRIANGLE    = 2,
};

struct PosColorVertex {
    PosColorVertex() = default;
    PosColorVertex(const Vec3& pos, gfx::Color clr)
    : position(pos), color(clr) {}

    Vec3       position;
    gfx::Color color;
};

struct PosNormColorVertex {
    PosNormColorVertex() = default;
    PosNormColorVertex(const Vec3& pos, const Vec4& norm, gfx::Color clr)
    : position(pos), normal(norm), color(clr) {}

    Vec3       position;
    Vec4       normal; // xyz: normal, w:unlit
    gfx::Color color;
};

template <typename T>
class GeometryVertexBuffer {
private:
    inline void init(gfx::Device* device, uint32_t maxVertices, const gfx::AttributeList& attributes) {
        _maxVertices = maxVertices;
        _buffer      = device->createBuffer({gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
                                        gfx::MemoryUsageBit::DEVICE,
                                        static_cast<uint32_t>(maxVertices * sizeof(T)),
                                        static_cast<uint32_t>(sizeof(T))});

        gfx::InputAssemblerInfo info;
        info.attributes = attributes;
        info.vertexBuffers.push_back(_buffer);
        _inputAssembler = device->createInputAssembler(info);
    }

    inline bool empty() const { return _vertices.empty(); }
    inline void reset() { _vertices.clear(); }

    inline void update() {
        if (!empty()) {
            auto vcount = static_cast<uint32_t>(_vertices.size());
            if (vcount > _maxVertices) {
                CC_LOG_WARNING("GeometryRenderer: too many vertices.");
            }
            const auto count = std::min(vcount, _maxVertices);
            const auto size  = static_cast<uint32_t>(count * sizeof(T));
            _buffer->update(&_vertices[0], size);
        }
    }

    inline void destroy() {
        _vertices.clear();
        CC_SAFE_DESTROY(_buffer);
        CC_SAFE_DESTROY(_inputAssembler);
    }

    uint32_t             _maxVertices{0};
    std::vector<T>       _vertices;
    gfx::Buffer*         _buffer{nullptr};
    gfx::InputAssembler* _inputAssembler{nullptr};

    friend class GeometryRenderer;
};

struct GeometryVertexBuffers {
    std::array<GeometryVertexBuffer<PosColorVertex>, GEOMETRY_DEPTH_TYPE_COUNT>     lines;
    std::array<GeometryVertexBuffer<PosColorVertex>, GEOMETRY_DEPTH_TYPE_COUNT>     dashedLines;
    std::array<GeometryVertexBuffer<PosNormColorVertex>, GEOMETRY_DEPTH_TYPE_COUNT> triangles;
};

GeometryConfig::GeometryConfig()
: maxLines{GEOMETRY_MAX_LINES}, maxDashedLines{GEOMETRY_MAX_DASHED_LINES}, maxTriangles{GEOMETRY_MAX_TRIANGLES} {
}

GeometryRenderer::GeometryRenderer() {
    _buffers = new GeometryVertexBuffers();
}

GeometryRenderer::~GeometryRenderer() {
    CC_SAFE_DELETE(_buffers);
}

void GeometryRenderer::activate(gfx::Device* device, RenderPipeline* pipeline, const GeometryConfig& config) {
    _device   = device;
    _pipeline = pipeline;

    static const gfx::AttributeList POS_COLOR_ATTRIBUTES = {
        {"a_position", gfx::Format::RGB32F},
        {"a_color", gfx::Format::RGBA32F}};

    static const gfx::AttributeList POS_NORM_COLOR_ATTRIBUTES = {
        {"a_position", gfx::Format::RGB32F},
        {"a_normal", gfx::Format::RGBA32F},
        {"a_color", gfx::Format::RGBA32F}};

    for (auto i = 0U; i < GEOMETRY_DEPTH_TYPE_COUNT; i++) {
        _buffers->lines[i].init(_device, config.maxLines * GEOMETRY_VERTICES_PER_LINE, POS_COLOR_ATTRIBUTES);
        _buffers->dashedLines[i].init(_device, config.maxDashedLines * GEOMETRY_VERTICES_PER_LINE, POS_COLOR_ATTRIBUTES);
        _buffers->triangles[i].init(_device, config.maxTriangles * GEOMETRY_VERTICES_PER_TRIANGLE, POS_NORM_COLOR_ATTRIBUTES);
    }
}

void GeometryRenderer::flushFromJSB(uint32_t type, uint32_t index, void* vb, uint32_t vertexCount) {
    auto geometryType = static_cast<GeometryType>(type);
    switch (geometryType) {
        case GeometryType::LINE: {
            auto& lines = _buffers->lines[index];

            for (auto i = 0U; i < vertexCount; i++) {
                auto* vertex = static_cast<PosColorVertex*>(vb) + i;
                lines._vertices.push_back(*vertex);
            }
            break;
        }
        case GeometryType::DASHED_LINE: {
            auto& dashedLines = _buffers->dashedLines[index];

            for (auto i = 0U; i < vertexCount; i++) {
                auto* vertex = static_cast<PosColorVertex*>(vb) + i;
                dashedLines._vertices.push_back(*vertex);
            }
            break;
        }
        case GeometryType::TRIANGLE: {
            auto& triangles = _buffers->triangles[index];

            for (auto i = 0U; i < vertexCount; i++) {
                auto* vertex = static_cast<PosNormColorVertex*>(vb) + i;
                triangles._vertices.push_back(*vertex);
            }
            break;
        }
        default:
            break;
    }
}

void GeometryRenderer::render(gfx::RenderPass* renderPass, gfx::CommandBuffer* cmdBuff) {
    update();

    const auto* sceneData  = _pipeline->getPipelineSceneData();
    const auto& passes     = sceneData->getGeometryRendererPasses();
    const auto& shaders    = sceneData->getGeometryRendererShaders();

    uint32_t       offset                               = 0U;
    const uint32_t passCount[GEOMETRY_DEPTH_TYPE_COUNT] = {GEOMETRY_NO_DEPTH_TEST_PASS_NUM, GEOMETRY_DEPTH_TEST_PASS_NUM};

    /**
     * passes:
     * 0  : no depthTest line pass
     * 1,2: depthTest line pass
     * 3  : no depthTest dashed line pass
     * 4,5: depthTest dashed line pass
     * 6  : no depthTest triangle pass
     * 7,8: depthTest triangle pass
     */

    for (auto i = 0U; i < GEOMETRY_DEPTH_TYPE_COUNT; i++) {
        auto& lines = _buffers->lines[i];
        if (!lines.empty()) {
            gfx::DrawInfo drawInfo;
            drawInfo.vertexCount = static_cast<uint32_t>(lines._vertices.size());

            for (auto p = 0U; p < passCount[i]; p++) {
                auto* pass   = passes[offset + p];
                auto* shader = shaders[offset + p];
                auto* pso    = PipelineStateManager::getOrCreatePipelineState(pass, shader, lines._inputAssembler, renderPass);
                cmdBuff->bindPipelineState(pso);
                cmdBuff->bindDescriptorSet(materialSet, pass->getDescriptorSet());
                cmdBuff->bindInputAssembler(lines._inputAssembler);
                cmdBuff->draw(drawInfo);
            }
        }

        offset += passCount[i];
    }

    for (auto i = 0U; i < GEOMETRY_DEPTH_TYPE_COUNT; i++) {
        auto& dashedLines = _buffers->dashedLines[i];
        if (!dashedLines.empty()) {
            gfx::DrawInfo drawInfo;
            drawInfo.vertexCount = static_cast<uint32_t>(dashedLines._vertices.size());

            for (auto p = 0U; p < passCount[i]; p++) {
                auto* pass   = passes[offset + p];
                auto* shader = shaders[offset + p];
                auto* pso    = PipelineStateManager::getOrCreatePipelineState(pass, shader, dashedLines._inputAssembler, renderPass);
                cmdBuff->bindPipelineState(pso);
                cmdBuff->bindDescriptorSet(materialSet, pass->getDescriptorSet());
                cmdBuff->bindInputAssembler(dashedLines._inputAssembler);
                cmdBuff->draw(drawInfo);
            }
        }

        offset += passCount[i];
    }

    for (auto i = 0U; i < GEOMETRY_DEPTH_TYPE_COUNT; i++) {
        auto& triangles = _buffers->triangles[i];
        if (!triangles.empty()) {
            gfx::DrawInfo drawInfo;
            drawInfo.vertexCount = static_cast<uint32_t>(triangles._vertices.size());

            for (auto p = 0U; p < passCount[i]; p++) {
                auto* pass   = passes[offset + p];
                auto* shader = shaders[offset + p];
                auto* pso    = PipelineStateManager::getOrCreatePipelineState(pass, shader, triangles._inputAssembler, renderPass);
                cmdBuff->bindPipelineState(pso);
                cmdBuff->bindDescriptorSet(materialSet, pass->getDescriptorSet());
                cmdBuff->bindInputAssembler(triangles._inputAssembler);
                cmdBuff->draw(drawInfo);
            }
        }

        offset += passCount[i];
    }

    // reset all geometry data for next frame
    reset();
}

void GeometryRenderer::destroy() {
    for (auto i = 0U; i < GEOMETRY_DEPTH_TYPE_COUNT; i++) {
        _buffers->lines[i].destroy();
        _buffers->dashedLines[i].destroy();
        _buffers->triangles[i].destroy();
    }
}

void GeometryRenderer::update() {
    for (auto i = 0U; i < GEOMETRY_DEPTH_TYPE_COUNT; i++) {
        _buffers->lines[i].update();
        _buffers->dashedLines[i].update();
        _buffers->triangles[i].update();
    }
}

void GeometryRenderer::reset() {
    for (auto i = 0U; i < GEOMETRY_DEPTH_TYPE_COUNT; i++) {
        _buffers->lines[i].reset();
        _buffers->dashedLines[i].reset();
        _buffers->triangles[i].reset();
    }
}

void GeometryRenderer::addDashedLine(const Vec3& v0, const Vec3& v1, gfx::Color color, bool depthTest) {
    auto& dashedLines = _buffers->dashedLines[depthTest ? 1 : 0];
    if (dashedLines._vertices.size() + GEOMETRY_VERTICES_PER_LINE > dashedLines._maxVertices) {
        CC_LOG_WARNING("GeometryRenderer: too many lines.");
        return;
    }

    dashedLines._vertices.emplace_back(v0, color);
    dashedLines._vertices.emplace_back(v1, color);
}

void GeometryRenderer::addLine(const Vec3& v0, const Vec3& v1, gfx::Color color, bool depthTest) {
    auto& lines = _buffers->lines[depthTest ? 1 : 0];
    if (lines._vertices.size() + GEOMETRY_VERTICES_PER_LINE > lines._maxVertices) {
        CC_LOG_WARNING("GeometryRenderer: too many lines.");
        return;
    }

    lines._vertices.emplace_back(v0, color);
    lines._vertices.emplace_back(v1, color);
}

void GeometryRenderer::addTriangle(const Vec3& v0, const Vec3& v1, const Vec3& v2, gfx::Color color, bool wireframe, bool depthTest, bool unlit) {
    if (wireframe) {
        addLine(v0, v1, color, depthTest);
        addLine(v1, v2, color, depthTest);
        addLine(v2, v0, color, depthTest);
        return;
    }

    auto& triangles = _buffers->triangles[depthTest ? 1 : 0];
    if (triangles._vertices.size() + GEOMETRY_VERTICES_PER_TRIANGLE > triangles._maxVertices) {
        CC_LOG_WARNING("GeometryRenderer: too many triangles.");
        return;
    }

    Vec4 normal{0.0F, 0.0F, 0.0F, 0.0F};
    if (!unlit) {
        const Vec3 dist1 = v1 - v0;
        const Vec3 dist2 = v2 - v0;
        Vec3       norm;
        Vec3::crossProduct(dist1, dist2, &norm);
        norm.normalize();
        normal.set(norm.x, norm.y, norm.z, 1.0F);
    }

    triangles._vertices.emplace_back(v0, normal, color);
    triangles._vertices.emplace_back(v1, normal, color);
    triangles._vertices.emplace_back(v2, normal, color);
}

void GeometryRenderer::addQuad(const Vec3& v0, const Vec3& v1, const Vec3& v2, const Vec3& v3, gfx::Color color, bool wireframe, bool depthTest, bool unlit) {
    /**
    *  3---2
    *  |   |   
    *  0---1
    */
    if (wireframe) {
        addLine(v0, v1, color, depthTest);
        addLine(v1, v2, color, depthTest);
        addLine(v2, v3, color, depthTest);
        addLine(v3, v0, color, depthTest);
    } else {
        addTriangle(v0, v1, v2, color, wireframe, depthTest, unlit);
        addTriangle(v0, v2, v3, color, wireframe, depthTest, unlit);
    }
}

void GeometryRenderer::addBoundingBox(const geometry::AABB* aabb, gfx::Color color, bool wireframe, bool depthTest, bool unlit, bool useTransform, const Mat4& transform) {
    /**
    *     2---3
    *    /   /
    *   6---7
    *     0---1
    *    /   /
    *   4---5
    * 
    */
    const Vec3 min = aabb->getCenter() - aabb->getHalfExtents();
    const Vec3 max = aabb->getCenter() + aabb->getHalfExtents();

    Vec3 v0{min.x, min.y, min.z};
    Vec3 v1{max.x, min.y, min.z};
    Vec3 v2{min.x, max.y, min.z};
    Vec3 v3{max.x, max.y, min.z};
    Vec3 v4{min.x, min.y, max.z};
    Vec3 v5{max.x, min.y, max.z};
    Vec3 v6{min.x, max.y, max.z};
    Vec3 v7{max.x, max.y, max.z};

    if (useTransform) {
        transform.transformPoint(&v0);
        transform.transformPoint(&v1);
        transform.transformPoint(&v2);
        transform.transformPoint(&v3);
        transform.transformPoint(&v4);
        transform.transformPoint(&v5);
        transform.transformPoint(&v6);
        transform.transformPoint(&v7);
    }

    if (wireframe) {
        addLine(v6, v7, color, depthTest);
        addLine(v7, v3, color, depthTest);
        addLine(v3, v2, color, depthTest);
        addLine(v2, v6, color, depthTest);

        addLine(v4, v5, color, depthTest);
        addLine(v5, v1, color, depthTest);
        addLine(v1, v0, color, depthTest);
        addLine(v0, v4, color, depthTest);

        addLine(v6, v4, color, depthTest);
        addLine(v7, v5, color, depthTest);
        addLine(v3, v1, color, depthTest);
        addLine(v2, v0, color, depthTest);
    } else {
        addQuad(v4, v5, v7, v6, color, wireframe, depthTest, unlit);
        addQuad(v5, v1, v3, v7, color, wireframe, depthTest, unlit);
        addQuad(v1, v0, v2, v3, color, wireframe, depthTest, unlit);
        addQuad(v0, v4, v6, v2, color, wireframe, depthTest, unlit);
        addQuad(v6, v7, v3, v2, color, wireframe, depthTest, unlit);
        addQuad(v0, v1, v5, v4, color, wireframe, depthTest, unlit);
    }
}

void GeometryRenderer::addCross(const Vec3& center, float size, gfx::Color color, bool depthTest) {
    float halfSize = size * 0.5F;

    addLine(Vec3(center.x - halfSize, center.y, center.z), Vec3(center.x + halfSize, center.y, center.z), color, depthTest);
    addLine(Vec3(center.x, center.y - halfSize, center.z), Vec3(center.x, center.y + halfSize, center.z), color, depthTest);
    addLine(Vec3(center.x, center.y, center.z - halfSize), Vec3(center.x, center.y, center.z + halfSize), color, depthTest);
}

void GeometryRenderer::addFrustum(const geometry::Frustum* frustum, gfx::Color color, bool depthTest) {
    const auto& vertices = frustum->vertices;

    addLine(vertices[0], vertices[1], color, depthTest);
    addLine(vertices[1], vertices[2], color, depthTest);
    addLine(vertices[2], vertices[3], color, depthTest);
    addLine(vertices[3], vertices[0], color, depthTest);

    addLine(vertices[4], vertices[5], color, depthTest);
    addLine(vertices[5], vertices[6], color, depthTest);
    addLine(vertices[6], vertices[7], color, depthTest);
    addLine(vertices[7], vertices[4], color, depthTest);

    addLine(vertices[0], vertices[4], color, depthTest);
    addLine(vertices[1], vertices[5], color, depthTest);
    addLine(vertices[2], vertices[6], color, depthTest);
    addLine(vertices[3], vertices[7], color, depthTest);
}

void GeometryRenderer::addCapsule(const Vec3& center, float radius, float height, gfx::Color color, uint32_t segmentsU, uint32_t hemiSegmentsV, bool wireframe, bool depthTest, bool unlit, bool useTransform, const Mat4& transform) {
    const auto deltaPhi   = math::PI_2 / segmentsU;
    const auto deltaTheta = math::PI_DIV2 / hemiSegmentsV;
    Vec3       bottomCenter{center.x, center.y - height / 2.0F, center.z};
    Vec3       topCenter{center.x, center.y + height / 2.0F, center.z};

    using CircleList = std::vector<Vec3>;
    std::vector<CircleList> bottomPoints;
    std::vector<CircleList> topPoints;

    for (auto i = 0U; i < hemiSegmentsV + 1; i++) {
        CircleList bottomList;
        CircleList topList;

        float theta    = i * deltaTheta;
        float sinTheta = sinf(theta);
        float cosTheta = cosf(theta);

        for (auto j = 0U; j < segmentsU + 1; j++) {
            float phi    = j * deltaPhi;
            float sinPhi = sinf(phi);
            float cosPhi = cosf(phi);
            Vec3  p{radius * sinTheta * cosPhi, radius * cosTheta, radius * sinTheta * sinPhi};

            bottomList.emplace_back(bottomCenter + Vec3(p.x, -p.y, p.z));
            topList.emplace_back(topCenter + p);
        }

        bottomPoints.emplace_back(bottomList);
        topPoints.emplace_back(topList);
    }

    if (useTransform) {
        for (auto i = 0U; i < hemiSegmentsV + 1; i++) {
            for (auto j = 0U; j < segmentsU + 1; j++) {
                transform.transformPoint(&bottomPoints[i][j]);
                transform.transformPoint(&topPoints[i][j]);
            }
        }
    }

    for (auto i = 0U; i < hemiSegmentsV; i++) {
        for (auto j = 0U; j < segmentsU; j++) {
            addTriangle(bottomPoints[i + 1][j], bottomPoints[i][j + 1], bottomPoints[i][j], color, wireframe, depthTest, unlit);
            addTriangle(bottomPoints[i + 1][j], bottomPoints[i + 1][j + 1], bottomPoints[i][j + 1], color, wireframe, depthTest, unlit);

            addTriangle(topPoints[i][j], topPoints[i + 1][j + 1], topPoints[i + 1][j], color, wireframe, depthTest, unlit);
            addTriangle(topPoints[i][j], topPoints[i][j + 1], topPoints[i + 1][j + 1], color, wireframe, depthTest, unlit);
        }
    }

    CircleList& bottomCircle = bottomPoints[hemiSegmentsV];
    CircleList& topCircle    = topPoints[hemiSegmentsV];
    for (auto j = 0U; j < segmentsU; j++) {
        addTriangle(topCircle[j], bottomCircle[j + 1], bottomCircle[j], color, wireframe, depthTest, unlit);
        addTriangle(topCircle[j], topCircle[j + 1], bottomCircle[j + 1], color, wireframe, depthTest, unlit);
    }
}

void GeometryRenderer::addCylinder(const Vec3& center, float radius, float height, gfx::Color color, uint32_t segments, bool wireframe, bool depthTest, bool unlit, bool useTransform, const Mat4& transform) {
    const auto        deltaPhi = math::PI_2 / segments;
    Vec3              bottomCenter{center.x, center.y - height / 2.0F, center.z};
    Vec3              topCenter{center.x, center.y + height / 2.0F, center.z};
    std::vector<Vec3> bottomPoints;
    std::vector<Vec3> topPoints;

    for (auto i = 0U; i < segments + 1; i++) {
        float phi = i * deltaPhi;
        Vec3  p{radius * cosf(phi), 0.0F, radius * sinf(phi)};
        bottomPoints.emplace_back(p + bottomCenter);
        topPoints.emplace_back(p + topCenter);
    }

    if (useTransform) {
        transform.transformPoint(&bottomCenter);
        transform.transformPoint(&topCenter);

        for (auto i = 0U; i < segments + 1; i++) {
            transform.transformPoint(&bottomPoints[i]);
            transform.transformPoint(&topPoints[i]);
        }
    }

    for (auto i = 0U; i < segments; i++) {
        addTriangle(topCenter, topPoints[i + 1], topPoints[i], color, wireframe, depthTest, unlit);
        addTriangle(bottomCenter, bottomPoints[i], bottomPoints[i + 1], color, wireframe, depthTest, unlit);

        addTriangle(topPoints[i], bottomPoints[i + 1], bottomPoints[i], color, wireframe, depthTest, unlit);
        addTriangle(topPoints[i], topPoints[i + 1], bottomPoints[i + 1], color, wireframe, depthTest, unlit);
    }
}

void GeometryRenderer::addCone(const Vec3& center, float radius, float height, gfx::Color color, uint32_t segments, bool wireframe, bool depthTest, bool unlit, bool useTransform, const Mat4& transform) {
    const auto        deltaPhi = math::PI_2 / segments;
    Vec3              bottomCenter{center.x, center.y - height / 2.0F, center.z};
    Vec3              topCenter{center.x, center.y + height / 2.0F, center.z};
    std::vector<Vec3> bottomPoints;

    for (auto i = 0U; i < segments + 1; i++) {
        Vec3 point{radius * cosf(i * deltaPhi), 0.0F, radius * sinf(i * deltaPhi)};
        bottomPoints.emplace_back(point + bottomCenter);
    }

    if (useTransform) {
        transform.transformPoint(&bottomCenter);
        transform.transformPoint(&topCenter);

        for (auto i = 0U; i < segments + 1; i++) {
            transform.transformPoint(&bottomPoints[i]);
        }
    }

    for (auto i = 0U; i < segments; i++) {
        addTriangle(topCenter, bottomPoints[i + 1], bottomPoints[i], color, wireframe, depthTest, unlit);
        addTriangle(bottomCenter, bottomPoints[i], bottomPoints[i + 1], color, wireframe, depthTest, unlit);
    }
}

void GeometryRenderer::addCircle(const Vec3& center, float radius, gfx::Color color, uint32_t segments, bool depthTest, bool useTransform, const Mat4& transform) {
    const auto        deltaPhi = math::PI_2 / segments;
    std::vector<Vec3> points;

    for (auto i = 0U; i < segments + 1; i++) {
        Vec3 point{radius * cosf(i * deltaPhi), 0.0F, radius * sinf(i * deltaPhi)};
        points.emplace_back(point + center);
    }

    if (useTransform) {
        for (auto i = 0U; i < segments + 1; i++) {
            transform.transformPoint(&points[i]);
        }
    }

    for (auto i = 0U; i < segments; i++) {
        addLine(points[i], points[i + 1], color, depthTest);
    }
}

void GeometryRenderer::addArc(const Vec3& center, float radius, gfx::Color color, float startAngle, float endAngle, uint32_t segments, bool depthTest, bool useTransform, const Mat4& transform) {
    float             startRadian = math::DEG_TO_RAD * startAngle;
    float             endRadian   = math::DEG_TO_RAD * endAngle;
    const auto        deltaPhi    = (endRadian - startRadian) / segments;
    std::vector<Vec3> points;

    for (auto i = 0U; i < segments + 1; i++) {
        Vec3 point{radius * cosf(i * deltaPhi + startRadian), 0.0F, radius * sinf(i * deltaPhi + startRadian)};
        points.emplace_back(point + center);
    }

    if (useTransform) {
        for (auto i = 0U; i < segments + 1; i++) {
            transform.transformPoint(&points[i]);
        }
    }

    for (auto i = 0U; i < segments; i++) {
        addLine(points[i], points[i + 1], color, depthTest);
    }
}

void GeometryRenderer::addPolygon(const Vec3& center, float radius, gfx::Color color, uint32_t segments, bool wireframe, bool depthTest, bool unlit, bool useTransform, const Mat4& transform) {
    if (wireframe) {
        addCircle(center, radius, color, segments, depthTest, useTransform, transform);
    } else {
        addDisc(center, radius, color, segments, wireframe, depthTest, unlit, useTransform, transform);
    }
}

void GeometryRenderer::addDisc(const Vec3& center, float radius, gfx::Color color, uint32_t segments, bool wireframe, bool depthTest, bool unlit, bool useTransform, const Mat4& transform) {
    const auto        deltaPhi = math::PI_2 / segments;
    std::vector<Vec3> points;
    Vec3              newCenter = center;

    for (auto i = 0U; i < segments + 1; i++) {
        Vec3 point{radius * cosf(i * deltaPhi), 0.0F, radius * sinf(i * deltaPhi)};
        points.emplace_back(point + newCenter);
    }

    if (useTransform) {
        transform.transformPoint(&newCenter);

        for (auto i = 0U; i < segments + 1; i++) {
            transform.transformPoint(&points[i]);
        }
    }

    for (auto i = 0U; i < segments; i++) {
        addTriangle(newCenter, points[i], points[i + 1], color, wireframe, depthTest, unlit);
    }

    // two sides
    if (!wireframe) {
        for (auto i = 0U; i < segments; i++) {
            addTriangle(newCenter, points[i + 1], points[i], color, wireframe, depthTest, unlit);
        }
    }
}

void GeometryRenderer::addSector(const Vec3& center, float radius, gfx::Color color, float startAngle, float endAngle, uint32_t segments, bool wireframe, bool depthTest, bool unlit, bool useTransform, const Mat4& transform) {
    float             startRadian = math::DEG_TO_RAD * startAngle;
    float             endRadian   = math::DEG_TO_RAD * endAngle;
    const auto        deltaPhi    = (endRadian - startRadian) / segments;
    std::vector<Vec3> points;
    Vec3              newCenter = center;

    for (auto i = 0U; i < segments + 1; i++) {
        Vec3 point{radius * cosf(i * deltaPhi), 0.0F, radius * sinf(i * deltaPhi)};
        points.emplace_back(point + newCenter);
    }

    if (useTransform) {
        transform.transformPoint(&newCenter);

        for (auto i = 0U; i < segments + 1; i++) {
            transform.transformPoint(&points[i]);
        }
    }

    for (auto i = 0U; i < segments; i++) {
        addTriangle(newCenter, points[i], points[i + 1], color, wireframe, depthTest, unlit);
    }

    // two sides
    if (!wireframe) {
        for (auto i = 0U; i < segments; i++) {
            addTriangle(newCenter, points[i + 1], points[i], color, wireframe, depthTest, unlit);
        }
    }
}

void GeometryRenderer::addSphere(const Vec3& center, float radius, gfx::Color color, uint32_t segmentsU, uint32_t segmentsV, bool wireframe, bool depthTest, bool unlit, bool useTransform, const Mat4& transform) {
    const auto deltaPhi   = math::PI_2 / segmentsU;
    const auto deltaTheta = math::PI / segmentsV;

    using CircleList = std::vector<Vec3>;
    std::vector<CircleList> points;

    for (auto i = 0U; i < segmentsV + 1; i++) {
        CircleList list;
        float      theta    = i * deltaTheta;
        float      sinTheta = sinf(theta);
        float      cosTheta = cosf(theta);

        for (auto j = 0U; j < segmentsU + 1; j++) {
            float phi    = j * deltaPhi;
            float sinPhi = sinf(phi);
            float cosPhi = cosf(phi);
            Vec3  p{radius * sinTheta * cosPhi, radius * cosTheta, radius * sinTheta * sinPhi};

            list.emplace_back(center + p);
        }

        points.emplace_back(list);
    }

    if (useTransform) {
        for (auto i = 0U; i < segmentsV + 1; i++) {
            for (auto j = 0U; j < segmentsU + 1; j++) {
                transform.transformPoint(&points[i][j]);
            }
        }
    }

    for (auto i = 0U; i < segmentsV; i++) {
        for (auto j = 0U; j < segmentsU; j++) {
            addTriangle(points[i][j], points[i + 1][j + 1], points[i + 1][j], color, wireframe, depthTest, unlit);
            addTriangle(points[i][j], points[i][j + 1], points[i + 1][j + 1], color, wireframe, depthTest, unlit);
        }
    }
}

void GeometryRenderer::addTorus(const Vec3& center, float bigRadius, float radius, gfx::Color color, uint32_t segmentsU, uint32_t segmentsV, bool wireframe, bool depthTest, bool unlit, bool useTransform, const Mat4& transform) {
    const auto deltaPhi   = math::PI_2 / segmentsU;
    const auto deltaTheta = math::PI_2 / segmentsV;

    using CircleList = std::vector<Vec3>;
    std::vector<CircleList> points;

    for (auto i = 0U; i < segmentsU + 1; i++) {
        CircleList list;
        float      phi    = i * deltaPhi;
        float      sinPhi = sinf(phi);
        float      cosPhi = cosf(phi);

        for (auto j = 0U; j < segmentsV + 1; j++) {
            float theta    = j * deltaTheta;
            float sinTheta = sinf(theta);
            float cosTheta = cosf(theta);
            Vec3  p{(bigRadius + radius * cosTheta) * cosPhi, radius * sinTheta, (bigRadius + radius * cosTheta) * sinPhi};

            list.emplace_back(center + p);
        }

        points.emplace_back(list);
    }

    if (useTransform) {
        for (auto i = 0U; i < segmentsU + 1; i++) {
            for (auto j = 0U; j < segmentsV + 1; j++) {
                transform.transformPoint(&points[i][j]);
            }
        }
    }

    for (auto i = 0U; i < segmentsU; i++) {
        for (auto j = 0U; j < segmentsV; j++) {
            addTriangle(points[i][j + 1], points[i + 1][j], points[i][j], color, wireframe, depthTest, unlit);
            addTriangle(points[i][j + 1], points[i + 1][j + 1], points[i + 1][j], color, wireframe, depthTest, unlit);
        }
    }
}

void GeometryRenderer::addOctahedron(const Vec3& center, float radius, gfx::Color color, bool wireframe, bool depthTest, bool unlit, bool useTransform, const Mat4& transform) {
    std::vector<Vec3> points;

    points.emplace_back(Vec3(radius, 0.0F, 0.0F) + center);
    points.emplace_back(Vec3(0.0F, 0.0F, -radius) + center);
    points.emplace_back(Vec3(-radius, 0.0F, 0.0F) + center);
    points.emplace_back(Vec3(0.0F, 0.0F, radius) + center);
    points.emplace_back(Vec3(0.0F, radius, 0.0F) + center);
    points.emplace_back(Vec3(0.0F, -radius, 0.0F) + center);

    if (useTransform) {
        for (auto& point : points) {
            transform.transformPoint(&point);
        }
    }

    if (wireframe) {
        addLine(points[0], points[1], color, depthTest);
        addLine(points[1], points[2], color, depthTest);
        addLine(points[2], points[3], color, depthTest);
        addLine(points[3], points[0], color, depthTest);

        addLine(points[0], points[4], color, depthTest);
        addLine(points[1], points[4], color, depthTest);
        addLine(points[2], points[4], color, depthTest);
        addLine(points[3], points[4], color, depthTest);

        addLine(points[0], points[5], color, depthTest);
        addLine(points[1], points[5], color, depthTest);
        addLine(points[2], points[5], color, depthTest);
        addLine(points[3], points[5], color, depthTest);
    } else {
        addTriangle(points[0], points[1], points[4], color, wireframe, depthTest, unlit);
        addTriangle(points[1], points[2], points[4], color, wireframe, depthTest, unlit);
        addTriangle(points[2], points[3], points[4], color, wireframe, depthTest, unlit);
        addTriangle(points[3], points[0], points[4], color, wireframe, depthTest, unlit);
        addTriangle(points[0], points[3], points[5], color, wireframe, depthTest, unlit);
        addTriangle(points[3], points[2], points[5], color, wireframe, depthTest, unlit);
        addTriangle(points[2], points[1], points[5], color, wireframe, depthTest, unlit);
        addTriangle(points[1], points[0], points[5], color, wireframe, depthTest, unlit);
    }
}

void GeometryRenderer::addBezier(const Vec3& v0, const Vec3& v1, const Vec3& v2, const Vec3& v3, gfx::Color color, uint32_t segments, bool depthTest, bool useTransform, const Mat4& transform) {
    const auto        deltaT = 1.0F / segments;
    std::vector<Vec3> points;

    Vec3 newV0 = v0;
    Vec3 newV1 = v1;
    Vec3 newV2 = v2;
    Vec3 newV3 = v3;

    if (useTransform) {
        transform.transformPoint(&newV0);
        transform.transformPoint(&newV1);
        transform.transformPoint(&newV2);
        transform.transformPoint(&newV3);
    }

    for (auto i = 0U; i < segments + 1; i++) {
        float t = i * deltaT;
        float a = (1.0F - t) * (1.0F - t) * (1.0F - t);
        float b = 3.0F * t * (1.0F - t) * (1.0F - t);
        float c = 3.0F * t * t * (1.0F - t);
        float d = t * t * t;

        points.emplace_back(a * newV0 + b * newV1 + c * newV2 + d * newV3);
    }

    for (auto i = 0U; i < segments; i++) {
        addLine(points[i], points[i + 1], color, depthTest);
    }
}

void GeometryRenderer::addMesh(const Vec3& center, const std::vector<Vec3>& vertices, gfx::Color color, bool depthTest, bool useTransform, const Mat4& transform) {
    for (auto i = 0U; i < vertices.size(); i += 3) {
        Vec3 v0 = center + vertices[i];
        Vec3 v1 = center + vertices[i + 1];
        Vec3 v2 = center + vertices[i + 2];

        if (useTransform) {
            transform.transformPoint(&v0);
            transform.transformPoint(&v1);
            transform.transformPoint(&v2);
        }

        addLine(v0, v1, color, depthTest);
        addLine(v1, v2, color, depthTest);
        addLine(v2, v0, color, depthTest);
    }
}

void GeometryRenderer::addIndexedMesh(const Vec3& center, const std::vector<Vec3>& vertices, const std::vector<uint32_t>& indices, gfx::Color color, bool depthTest, bool useTransform, const Mat4& transform) {
    for (auto i = 0U; i < indices.size(); i += 3) {
        Vec3 v0 = center + vertices[indices[i]];
        Vec3 v1 = center + vertices[indices[i + 1]];
        Vec3 v2 = center + vertices[indices[i + 2]];

        if (useTransform) {
            transform.transformPoint(&v0);
            transform.transformPoint(&v1);
            transform.transformPoint(&v2);
        }

        addLine(v0, v1, color, depthTest);
        addLine(v1, v2, color, depthTest);
        addLine(v2, v0, color, depthTest);
    }
}

} // namespace pipeline
} // namespace cc
