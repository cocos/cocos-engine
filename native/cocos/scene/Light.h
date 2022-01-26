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

#include <string>
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "core/scene-graph/Node.h"
#include "math/Vec3.h"

namespace cc {
namespace scene {

class RenderScene;

enum class LightType {
    DIRECTIONAL,
    SPHERE,
    SPOT,
    UNKNOWN,
};

class Light : public RefCounted {
public:
    Light()           = default;
    ~Light() override = default;

    inline void attachToScene(RenderScene *scene) { _scene = scene; }
    inline void detachFromScene() { _scene = nullptr; }

    inline void destroy() {
        _name.clear();
        _node = nullptr;
    }

    virtual void initialize() {
        _color     = Vec3(1, 1, 1);
        _colorTemp = 6550.F;
    }

    virtual void update(){};

    inline bool isBaked() const { return _baked; }
    inline void setBaked(bool val) { _baked = val; }

    inline const Vec3 &getColor() const { return _color; }
    inline void        setColor(const Vec3 &color) { _color = color; }

    inline bool isUseColorTemperature() const { return _useColorTemperature; }
    inline void setUseColorTemperature(bool value) { _useColorTemperature = value; }

    inline float getColorTemperature() const { return _colorTemp; }
    inline void  setColorTemperature(float val) { _colorTemp = val; }

    inline Node *getNode() const { return _node.get(); }
    inline void  setNode(Node *node) { _node = node; }

    inline LightType getType() const { return _type; }
    inline void      setType(LightType type) { _type = type; }

    inline const std::string &getName() const { return _name; }
    inline void               setName(const std::string &name) { _name = name; }

    inline RenderScene *getScene() const { return _scene; }

    inline const Vec3 &getColorTemperatureRGB() const { return _colorTemperatureRGB; }
    inline void        setColorTemperatureRGB(const Vec3 &value) { _colorTemperatureRGB = value; }

    static float nt2lm(float size);

protected:
    bool               _useColorTemperature{false};
    bool               _baked{false};
    IntrusivePtr<Node> _node;
    float              _colorTemp{6550.F};
    LightType          _type{LightType::UNKNOWN};
    std::string        _name;
    RenderScene *      _scene{nullptr};
    Vec3               _color{1, 1, 1};
    Vec3               _colorTemperatureRGB;
    Vec3               _forward{0, 0, -1};

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(Light);
};

} // namespace scene
} // namespace cc
