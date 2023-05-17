
/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "LightProbe.h"
#include "PolynomialSolver.h"
#include "core/Root.h"
#include "core/scene-graph/Node.h"
#include "core/scene-graph/Scene.h"
#include "math/Math.h"
#include "math/Utils.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"

namespace cc {
namespace gi {

void LightProbesData::updateProbes(ccstd::vector<Vec3> &points) {
    _probes.clear();

    auto pointCount = points.size();
    _probes.reserve(pointCount);
    for (auto i = 0; i < pointCount; i++) {
        _probes.emplace_back(points[i]);
    }
}

void LightProbesData::updateTetrahedrons() {
    Delaunay delaunay(_probes);
    _tetrahedrons = delaunay.build();
}

bool LightProbesData::getInterpolationSHCoefficients(int32_t tetIndex, const Vec4 &weights, ccstd::vector<Vec3> &coefficients) const {
    if (!hasCoefficients()) {
        return false;
    }

    const auto length = SH::getBasisCount();
    coefficients.resize(length);

    const auto &tetrahedron = _tetrahedrons[tetIndex];
    const auto &c0 = _probes[tetrahedron.vertex0].coefficients;
    const auto &c1 = _probes[tetrahedron.vertex1].coefficients;
    const auto &c2 = _probes[tetrahedron.vertex2].coefficients;

    if (tetrahedron.vertex3 >= 0) {
        const auto &c3 = _probes[tetrahedron.vertex3].coefficients;

        for (auto i = 0; i < length; i++) {
            coefficients[i] = c0[i] * weights.x + c1[i] * weights.y + c2[i] * weights.z + c3[i] * weights.w;
        }
    } else {
        for (auto i = 0; i < length; i++) {
            coefficients[i] = c0[i] * weights.x + c1[i] * weights.y + c2[i] * weights.z;
        }
    }

    return true;
}

int32_t LightProbesData::getInterpolationWeights(const Vec3 &position, int32_t tetIndex, Vec4 &weights) const {
    const auto tetrahedronCount = _tetrahedrons.size();
    if (tetIndex < 0 || tetIndex >= tetrahedronCount) {
        tetIndex = 0;
    }

    int32_t lastIndex = -1;
    int32_t nextIndex = -1;

    for (auto i = 0; i < tetrahedronCount; i++) {
        const auto &tetrahedron = _tetrahedrons[tetIndex];
        getBarycentricCoord(position, tetrahedron, weights);
        if (weights.x >= 0.0F && weights.y >= 0.0F && weights.z >= 0.0F && weights.w >= 0.0F) {
            break;
        }

        if (weights.x < weights.y && weights.x < weights.z && weights.x < weights.w) {
            nextIndex = tetrahedron.neighbours[0];
        } else if (weights.y < weights.z && weights.y < weights.w) {
            nextIndex = tetrahedron.neighbours[1];
        } else if (weights.z < weights.w) {
            nextIndex = tetrahedron.neighbours[2];
        } else {
            nextIndex = tetrahedron.neighbours[3];
        }

        // return directly due to numerical precision error
        if (lastIndex == nextIndex) {
            break;
        }

        lastIndex = tetIndex;
        tetIndex = nextIndex;
    }

    return tetIndex;
}

Vec3 LightProbesData::getTriangleBarycentricCoord(const Vec3 &p0, const Vec3 &p1, const Vec3 &p2, const Vec3 &position) {
    Vec3 normal;
    Vec3::cross(p1 - p0, p2 - p0, &normal);

    if (normal.lengthSquared() <= mathutils::EPSILON) {
        return Vec3(0.0F, 0.0F, 0.0F);
    }

    const Vec3 n = normal.getNormalized();
    const float area012Inv = 1.0F / (n.dot(normal));

    Vec3 crossP12;
    Vec3::cross(p1 - position, p2 - position, &crossP12);
    const float areaP12 = n.dot(crossP12);
    const float alpha = areaP12 * area012Inv;

    Vec3 crossP20;
    Vec3::cross(p2 - position, p0 - position, &crossP20);
    const float areaP20 = n.dot(crossP20);
    const float beta = areaP20 * area012Inv;

    return Vec3(alpha, beta, 1.0F - alpha - beta);
}

void LightProbesData::getBarycentricCoord(const Vec3 &position, const Tetrahedron &tetrahedron, Vec4 &weights) const {
    if (tetrahedron.vertex3 >= 0) {
        getTetrahedronBarycentricCoord(position, tetrahedron, weights);
    } else {
        getOuterCellBarycentricCoord(position, tetrahedron, weights);
    }
}

void LightProbesData::getTetrahedronBarycentricCoord(const Vec3 &position, const Tetrahedron &tetrahedron, Vec4 &weights) const {
    Vec3 result = position - _probes[tetrahedron.vertex3].position;
    result.transformMat3(result, tetrahedron.matrix);

    weights.set(result.x, result.y, result.z, 1.0F - result.x - result.y - result.z);
}

void LightProbesData::getOuterCellBarycentricCoord(const Vec3 &position, const Tetrahedron &tetrahedron, Vec4 &weights) const {
    const auto &p0 = _probes[tetrahedron.vertex0].position;
    const auto &p1 = _probes[tetrahedron.vertex1].position;
    const auto &p2 = _probes[tetrahedron.vertex2].position;

    Vec3 normal;
    const auto edge1 = p1 - p0;
    const auto edge2 = p2 - p0;
    Vec3::cross(edge1, edge2, &normal);
    float t = Vec3::dot(position - p0, normal);
    if (t < 0.0F) {
        // test tetrahedron in next iterator
        weights.set(0.0F, 0.0F, 0.0F, -1.0F);
        return;
    }

    Vec3 coefficients;
    coefficients.transformMat3(position, tetrahedron.matrix);
    coefficients += tetrahedron.offset;

    if (tetrahedron.vertex3 == -1) {
        t = PolynomialSolver::getCubicUniqueRoot(coefficients.x, coefficients.y, coefficients.z);
    } else {
        t = PolynomialSolver::getQuadraticUniqueRoot(coefficients.x, coefficients.y, coefficients.z);
    }

    const auto v0 = p0 + _probes[tetrahedron.vertex0].normal * t;
    const auto v1 = p1 + _probes[tetrahedron.vertex1].normal * t;
    const auto v2 = p2 + _probes[tetrahedron.vertex2].normal * t;
    const auto result = getTriangleBarycentricCoord(v0, v1, v2, position);

    weights.set(result.x, result.y, result.z, 0.0F);
}

void LightProbes::initialize(LightProbeInfo *info) {
    _giScale = info->getGIScale();
    _giSamples = info->getGISamples();
    _bounces = info->getBounces();
    _reduceRinging = info->getReduceRinging();
    _showProbe = info->isShowProbe();
    _showWireframe = info->isShowWireframe();
    _lightProbeSphereVolume = info->getLightProbeSphereVolume();
    _showConvex = info->isShowConvex();
    _data = info->getData();
}

void LightProbeInfo::activate(Scene *scene, LightProbes *resource) {
    _scene = scene;
    _resource = resource;
    _resource->initialize(this);
}

void LightProbeInfo::onProbeBakeFinished() {
    onProbeBakingChanged(_scene);
}

void LightProbeInfo::onProbeBakeCleared() {
    clearSHCoefficients();
    onProbeBakingChanged(_scene);
}

void LightProbeInfo::clearSHCoefficients() {
    if (!_data) {
        return;
    }

    auto &probes = _data->getProbes();
    for (auto &probe : probes) {
        probe.coefficients.clear();
    }

    clearAllSHUBOs();
}

bool LightProbeInfo::addNode(Node *node) {
    if (!node) {
        return false;
    }

    for (auto &item : _nodes) {
        if (item.node == node) {
            return false;
        }
    }

    _nodes.emplace_back(node);

    return true;
}

bool LightProbeInfo::removeNode(Node *node) {
    if (!node) {
        return false;
    }

    for (auto iter = _nodes.begin(); iter != _nodes.end(); ++iter) {
        if (iter->node == node) {
            _nodes.erase(iter);
            return true;
        }
    }

    return false;
}

void LightProbeInfo::syncData(Node *node, const ccstd::vector<Vec3> &probes) {
    for (auto &item : _nodes) {
        if (item.node == node) {
            item.probes = probes;
            return;
        }
    }
}

void LightProbeInfo::update(bool updateTet) {
    if (!_data) {
        _data = new LightProbesData();
        if (_resource) {
            _resource->setData(_data);
        }
    }

    ccstd::vector<Vec3> points;

    for (auto &item : _nodes) {
        auto *node = item.node;
        auto &probes = item.probes;
        const auto &worldPosition = node->getWorldPosition();

        for (auto &probe : probes) {
            points.push_back(probe + worldPosition);
        }
    }

    auto pointCount = points.size();
    if (pointCount < 4) {
        resetAllTetraIndices();
        _data->reset();
        return;
    }

    _data->updateProbes(points);

    if (updateTet) {
        resetAllTetraIndices();
        _data->updateTetrahedrons();
    }
}

void LightProbeInfo::onProbeBakingChanged(Node *node) { // NOLINT(misc-no-recursion)
    if (!node) {
        return;
    }

    node->emit<Node::LightProbeBakingChanged>();

    const auto &children = node->getChildren();
    for (const auto &child: children) {
        onProbeBakingChanged(child);
    }
}

void LightProbeInfo::clearAllSHUBOs() {
    if (!_scene) {
        return;
    }

    auto *renderScene = _scene->getRenderScene();
    if (!renderScene) {
        return;
    }

    for (const auto &model : renderScene->getModels()) {
        model->clearSHUBOs();
    }
}

void LightProbeInfo::resetAllTetraIndices() {
    if (!_scene) {
        return;
    }

    auto *renderScene = _scene->getRenderScene();
    if (!renderScene) {
        return;
    }

    for (const auto &model : renderScene->getModels()) {
        model->setTetrahedronIndex(-1);
    }
}

} // namespace gi
} // namespace cc
