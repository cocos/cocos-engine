
/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#include "Delaunay.h"
#include "SH.h"
#include "base/Macros.h"
#include "base/RefCounted.h"
#include "base/std/container/vector.h"
#include "math/Vec3.h"
#include "math/Vec4.h"

namespace cc {
namespace gi {

class LightProbeInfo;

class LightProbesData {
public:
    LightProbesData() = default;

    inline ccstd::vector<Vertex> &getProbes() { return _probes; }
    inline void setProbes(const ccstd::vector<Vertex> &probes) { _probes = probes; }
    inline ccstd::vector<Tetrahedron> &getTetrahedrons() { return _tetrahedrons; }
    inline void setTetrahedrons(const ccstd::vector<Tetrahedron> &tetrahedrons) { _tetrahedrons = tetrahedrons; }

    inline bool empty() const { return _probes.empty() || _tetrahedrons.empty(); }
    inline bool available() const { return !empty() && !_probes[0].coefficients.empty(); }
    void build(const ccstd::vector<Vec3> &points);
    int32_t getInterpolationSHCoefficients(const Vec3 &position, int32_t tetIndex, ccstd::vector<Vec3> &coefficients) const;

private:
    int32_t getInterpolationWeights(const Vec3 &position, int32_t tetIndex, Vec4 &weights) const;
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

    inline bool available() const {
        if (!_enabled) {
            return false;
        }

        return _data.available();
    }

    inline void setEnabled(bool val) {
        if (_enabled == val) {
            return;
        }

        _enabled = val;
        updatePipeline();
    }
    inline bool isEnabled() const { return _enabled; }

    inline void setReduceRinging(float val) { _reduceRinging = val; }
    inline float getReduceRinging() const { return _reduceRinging; }

    inline void setShowProbe(bool val) { _showProbe = val; }
    inline bool isShowProbe() const { return _showProbe; }

    inline void setShowWireframe(bool val) { _showWireframe = val; }
    inline bool isShowWireframe() const { return _showWireframe; }

    inline void setShowConvex(bool val) { _showConvex = val; }
    inline bool isShowConvex() const { return _showConvex; }

    inline void setData(const LightProbesData &data) { _data = data; }
    inline const LightProbesData &getData() const { return _data; }

    bool _enabled{true};
    float _reduceRinging{0.0F};
    bool _showProbe{true};
    bool _showWireframe{true};
    bool _showConvex{false};
    LightProbesData _data;

private:
    void updatePipeline() const;
};

class LightProbeInfo : public RefCounted {
public:
    LightProbeInfo() = default;
    ~LightProbeInfo() override = default;

    void activate(LightProbes *resource);

    inline void setEnabled(bool val) {
        if (_enabled == val) {
            return;
        }

        _enabled = val;
        if (_resource) {
            _resource->setEnabled(val);
        }
    }
    inline bool isEnabled() const { return _enabled; }

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

    inline void setData(const LightProbesData &data) {
        _data = data;
        if (_resource) {
            _resource->setData(data);
        }
    }

    inline const LightProbesData &getData() const { return _data; }

    // add addGroup, removeGroup, update after the component module is ported to cpp

    //cjh JSB need to bind the property, so need to make it public
    bool _enabled{false};
    float _reduceRinging{0.0F};
    bool _showProbe{true};
    bool _showWireframe{true};
    bool _showConvex{false};
    LightProbesData _data;

private:
    LightProbes *_resource{nullptr};
};

} // namespace gi
} // namespace cc
