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

#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "base/std/container/string.h"
#include "math/Vec3.h"
#include "pipeline/Define.h"

namespace cc {
class Node;
namespace scene {

class RenderScene;

enum class LightType {
    DIRECTIONAL,
    SPHERE,
    SPOT,
    POINT,
    RANGED_DIRECTIONAL,
    UNKNOWN,
};

class Light : public RefCounted {
public:
    Light();
    ~Light() override;

    inline void attachToScene(RenderScene *scene) { _scene = scene; }
    inline void detachFromScene() { _scene = nullptr; }

    void destroy();

    virtual void initialize() {
        _color = Vec3(1, 1, 1);
        _colorTemp = 6550.F;
    }

    virtual void update(){};

    inline bool isBaked() const { return _baked; }
    inline void setBaked(bool val) { _baked = val; }

    inline const Vec3 &getColor() const { return _color; }
    inline void setColor(const Vec3 &color) { _color = color; }

    inline bool isUseColorTemperature() const { return _useColorTemperature; }
    inline void setUseColorTemperature(bool value) { _useColorTemperature = value; }

    inline float getColorTemperature() const { return _colorTemp; }
    inline void setColorTemperature(float val) {
        _colorTemp = val;
        setColorTemperatureRGB(colorTemperatureToRGB(val));
    }

    inline uint32_t getVisibility() const { return _visibility; }
    inline void setVisibility(uint32_t visibility) { _visibility = visibility; }

    inline Node *getNode() const { return _node.get(); }
    void setNode(Node *node);

    inline LightType getType() const { return _type; }
    inline void setType(LightType type) { _type = type; }

    inline const ccstd::string &getName() const { return _name; }
    inline void setName(const ccstd::string &name) { _name = name; }

    inline RenderScene *getScene() const { return _scene; }

    inline const Vec3 &getColorTemperatureRGB() const { return _colorTemperatureRGB; }
    inline void setColorTemperatureRGB(const Vec3 &value) { _colorTemperatureRGB = value; }

    static float nt2lm(float size);
    static Vec3 colorTemperatureToRGB(float kelvin);

protected:
    bool _useColorTemperature{false};
    bool _baked{false};

    LightType _type{LightType::UNKNOWN};

    uint32_t _visibility = pipeline::CAMERA_DEFAULT_MASK;

    IntrusivePtr<Node> _node;
    RenderScene *_scene{nullptr};

    float _colorTemp{6550.F};

    Vec3 _color{1, 1, 1};
    Vec3 _colorTemperatureRGB;
    Vec3 _forward{0, 0, -1};

    ccstd::string _name;

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(Light);
};

} // namespace scene
} // namespace cc
