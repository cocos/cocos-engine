
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

#pragma once

#include "Delaunay.h"
#include "SH.h"
#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "base/std/container/vector.h"
#include "math/Vec3.h"
#include "math/Vec4.h"

namespace cc {
class Scene;
class Node;

namespace gi {

class LightProbeInfo;

class LightProbesData : public RefCounted {
public:
    LightProbesData() = default;

    inline ccstd::vector<Vertex> &getProbes() { return _probes; }
    inline void setProbes(const ccstd::vector<Vertex> &probes) { _probes = probes; }
    inline ccstd::vector<Tetrahedron> &getTetrahedrons() { return _tetrahedrons; }
    inline void setTetrahedrons(const ccstd::vector<Tetrahedron> &tetrahedrons) { _tetrahedrons = tetrahedrons; }

    inline bool empty() const { return _probes.empty() || _tetrahedrons.empty(); }
    inline void reset() {
        _probes.clear();
        _tetrahedrons.clear();
    }
    void updateProbes(ccstd::vector<Vec3> &points);
    void updateTetrahedrons();

    inline bool hasCoefficients() const { return !empty() && !_probes[0].coefficients.empty(); }
    bool getInterpolationSHCoefficients(int32_t tetIndex, const Vec4 &weights, ccstd::vector<Vec3> &coefficients) const;
    int32_t getInterpolationWeights(const Vec3 &position, int32_t tetIndex, Vec4 &weights) const;

private:
    static Vec3 getTriangleBarycentricCoord(const Vec3 &p0, const Vec3 &p1, const Vec3 &p2, const Vec3 &position);
    void getBarycentricCoord(const Vec3 &position, const Tetrahedron &tetrahedron, Vec4 &weights) const;
    void getTetrahedronBarycentricCoord(const Vec3 &position, const Tetrahedron &tetrahedron, Vec4 &weights) const;
    void getOuterCellBarycentricCoord(const Vec3 &position, const Tetrahedron &tetrahedron, Vec4 &weights) const;

public:
    ccstd::vector<Vertex> _probes;
    ccstd::vector<Tetrahedron> _tetrahedrons;
};

class LightProbes final {
public:
    LightProbes() = default;
    ~LightProbes() = default;

    void initialize(LightProbeInfo *info);

    inline bool empty() const {
        if (!_data) {
            return true;
        }

        return _data->empty();
    }

    inline void setGIScale(float val) { _giScale = val; }
    inline float getGIScale() const { return _giScale; }

    inline void setLightProbeSphereVolume(float val) { _lightProbeSphereVolume = val; }
    inline float getLightProbeSphereVolume() const { return _lightProbeSphereVolume; }

    inline void setGISamples(uint32_t val) { _giSamples = val; }
    inline uint32_t getGISamples() const { return _giSamples; }

    inline void setBounces(uint32_t val) { _bounces = val; }
    inline uint32_t getBounces() const { return _bounces; }

    inline void setReduceRinging(float val) { _reduceRinging = val; }
    inline float getReduceRinging() const { return _reduceRinging; }

    inline void setShowProbe(bool val) { _showProbe = val; }
    inline bool isShowProbe() const { return _showProbe; }

    inline void setShowWireframe(bool val) { _showWireframe = val; }
    inline bool isShowWireframe() const { return _showWireframe; }

    inline void setShowConvex(bool val) { _showConvex = val; }
    inline bool isShowConvex() const { return _showConvex; }

    inline void setData(LightProbesData *data) { _data = data; }
    inline LightProbesData *getData() const { return _data.get(); }

    float _giScale{1.0F};
    float _lightProbeSphereVolume{1.0F};
    uint32_t _giSamples{1024U};
    uint32_t _bounces{2U};
    float _reduceRinging{0.0F};
    bool _showProbe{true};
    bool _showWireframe{true};
    bool _showConvex{false};
    IntrusivePtr<LightProbesData> _data;
};

struct ILightProbeNode {
    Node *node{nullptr};
    ccstd::vector<Vec3> probes;

    explicit ILightProbeNode(Node *n)
    : node(n) {}
};

class LightProbeInfo : public RefCounted {
public:
    LightProbeInfo() = default;
    ~LightProbeInfo() override = default;

    void activate(Scene *scene, LightProbes *resource);
    void onProbeBakeFinished();
    void onProbeBakeCleared();
    void clearSHCoefficients();
    inline bool isUniqueNode() const { return _nodes.size() == 1; }
    bool addNode(Node *node);
    bool removeNode(Node *node);
    void syncData(Node *node, const ccstd::vector<Vec3> &probes);
    void update(bool updateTet = true);

    inline void setGIScale(float val) {
        if (_giScale == val) {
            return;
        }

        _giScale = val;
        if (_resource) {
            _resource->setGIScale(val);
        }
    }
    inline float getGIScale() const { return _giScale; }

    inline void setLightProbeSphereVolume(float val) {
        if (_lightProbeSphereVolume == val) {
            return;
        }

        _lightProbeSphereVolume = val;
        if (_resource) {
            _resource->setLightProbeSphereVolume(val);
        }
    }
    inline float getLightProbeSphereVolume() const { return _lightProbeSphereVolume; }

    inline void setGISamples(uint32_t val) {
        if (_giSamples == val) {
            return;
        }

        _giSamples = val;
        if (_resource) {
            _resource->setGISamples(val);
        }
    }
    inline uint32_t getGISamples() const { return _giSamples; }

    inline void setBounces(uint32_t val) {
        if (_bounces == val) {
            return;
        }

        _bounces = val;
        if (_resource) {
            _resource->setBounces(val);
        }
    }
    inline uint32_t getBounces() const { return _bounces; }

    inline void setReduceRinging(float val) {
        if (_reduceRinging == val) {
            return;
        }

        _reduceRinging = val;
        if (_resource) {
            _resource->setReduceRinging(val);
        }
    }
    inline float getReduceRinging() const { return _reduceRinging; }

    inline void setShowProbe(bool val) {
        if (_showProbe == val) {
            return;
        }

        _showProbe = val;
        if (_resource) {
            _resource->setShowProbe(val);
        }
    }
    inline bool isShowProbe() const { return _showProbe; }

    inline void setShowWireframe(bool val) {
        if (_showWireframe == val) {
            return;
        }

        _showWireframe = val;
        if (_resource) {
            _resource->setShowWireframe(val);
        }
    }
    inline bool isShowWireframe() const { return _showWireframe; }

    inline void setShowConvex(bool val) {
        if (_showConvex == val) {
            return;
        }

        _showConvex = val;
        if (_resource) {
            _resource->setShowConvex(val);
        }
    }
    inline bool isShowConvex() const { return _showConvex; }

    inline void setData(LightProbesData *data) {
        _data = data;
        if (_resource) {
            _resource->setData(data);
        }
    }

    inline LightProbesData *getData() const { return _data.get(); }

    //cjh JSB need to bind the property, so need to make it public
    float _giScale{1.0F};
    float _lightProbeSphereVolume{1.0F};
    uint32_t _giSamples{1024U};
    uint32_t _bounces{2U};
    float _reduceRinging{0.0F};
    bool _showProbe{true};
    bool _showWireframe{true};
    bool _showConvex{false};
    IntrusivePtr<LightProbesData> _data;

private:
    void onProbeBakingChanged(Node *node);
    void clearAllSHUBOs();
    void resetAllTetraIndices();

    Scene *_scene{nullptr};
    ccstd::vector<ILightProbeNode> _nodes;
    LightProbes *_resource{nullptr};
};

} // namespace gi
} // namespace cc
