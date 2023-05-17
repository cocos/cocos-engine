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

#include "scene/Light.h"
#include "core/scene-graph/Node.h"
#include "math/Math.h"

namespace cc {
namespace scene {

Light::Light() = default;

Light::~Light() = default;

void Light::destroy() {
    _name.clear();
    _node = nullptr;
}

void Light::setNode(Node *node) { _node = node; }

float Light::nt2lm(float size) {
    return 4 * math::PI * math::PI * size * size;
}

Vec3 Light::colorTemperatureToRGB(float kelvin) {
    if (kelvin < 1000.0) {
        kelvin = 1000.0;
    } else if (kelvin > 15000.0) {
        kelvin = 15000.0;
    }

    // Approximate Planckian locus in CIE 1960 UCS
    const float kSqr = kelvin * kelvin;
    const float u = (0.860117757 + 1.54118254e-4 * kelvin + 1.28641212e-7 * kSqr) / (1.0 + 8.42420235e-4 * kelvin + 7.08145163e-7 * kSqr);
    const float v = (0.317398726 + 4.22806245e-5 * kelvin + 4.20481691e-8 * kSqr) / (1.0 - 2.89741816e-5 * kelvin + 1.61456053e-7 * kSqr);

    const float d = (2.0 * u - 8.0 * v + 4.0);
    const float x = (3.0 * u) / d;
    const float y = (2.0 * v) / d;
    const float z = (1.0 - x) - y;

    const float X = (1.0 / y) * x;
    const float Z = (1.0 / y) * z;

    // XYZ to RGB with BT.709 primaries
    Vec3 colorWithTemperature;
    colorWithTemperature.x = 3.2404542 * X + -1.5371385 + -0.4985314 * Z;
    colorWithTemperature.y = -0.9692660 * X + 1.8760108 + 0.0415560 * Z;
    colorWithTemperature.z = 0.0556434 * X + -0.2040259 + 1.0572252 * Z;
    return colorWithTemperature;
}

} // namespace scene
} // namespace cc
