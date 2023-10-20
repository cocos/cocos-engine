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

#include "core/assets/Material.h"
#include "core/geometry/Sphere.h"
#include "math/Color.h"
#include "math/Mat4.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "renderer/gfx-base/GFXShader.h"
#include "scene/Define.h"

namespace cc {

class Node;

namespace scene {

/**
 * @zh 阴影贴图分辨率。
 * @en The shadow map size.
 * @static
 * @enum Shadows.ShadowSize
 */
enum class ShadowSize {
    /**
     * @zh 分辨率 256 * 256。
     * @en shadow resolution 256 * 256.
     * @readonly
     */
    LOW_256X256 = 256,

    /**
     * @zh 分辨率 512 * 512。
     * @en shadow resolution 512 * 512.
     * @readonly
     */
    MEDIUM_512X512 = 512,

    /**
     * @zh 分辨率 1024 * 1024。
     * @en shadow resolution 1024 * 1024.
     * @readonly
     */
    HIGH_1024X1024 = 1024,

    /**
     * @zh 分辨率 2048 * 2048。
     * @en shadow resolution 2048 * 2048.
     * @readonly
     */
    ULTRA_2048X2048 = 2048
};

/**
 * @zh 阴影类型。
 * @en The shadow type
 * @enum Shadows.ShadowType
 */
enum class ShadowType {
    /**
     * @zh 平面阴影。
     * @en Planar shadow
     * @property Planar
     * @readonly
     */
    PLANAR = 0,

    /**
     * @zh 阴影贴图。
     * @en Shadow type
     * @property ShadowMap
     * @readonly
     */
    SHADOW_MAP = 1,
    NONE
};

/**
 * @zh pcf阴影等级。
 * @en The pcf type
 * @static
 * @enum Shadows.PCFType
 */
enum class PCFType {
    /**
     * @zh x1 次采样
     * @en x1 times
     * @readonly
     */
    HARD = 0,

    /**
     * @zh x4 次采样
     * @en x4 times
     * @readonly
     */
    SOFT = 1,

    /**
     * @zh x9 次采样
     * @en x9 times
     * @readonly
     */
    SOFT_2X = 2,

    /**
     * @zh x16 次采样
     * @en x16 times
     * @readonly
     */
    SOFT_4X = 3
};

/**
 * @zh 级联阴影贴图层级。
 * @en The CSM shadow level
 * @static
 * @enum Shadows.CSMLevel
 */
enum class CSMLevel {
    /**
     * @zh 1 个层级
     * @en level 1
     * @readonly
     */
    LEVEL_1 = 1,

    /**
     * @zh 2 个层级
     * @en level 2
     * @readonly
     */
    LEVEL_2 = 2,

    /**
     * @zh 3 个层级
     * @en level 3
     * @readonly
     */
    LEVEL_3 = 3,

    /**
     * @zh 4 个层级
     * @en level 4
     * @readonly
     */
    LEVEL_4 = 4
};

/**
 * @zh 级联阴影性能优化模式。
 * @en The CSM performance optimization mode
 * @static
 * @enum Shadows.CSMOptimizationMode
 */
enum class CSMOptimizationMode {
    /**
     * @zh 没有性能优化
     * @en has no performance optimization
     * @readonly
     */
    NONE = 1,

    /**
     * @zh 剔除层与层之间重复物体
     * @en Eliminate duplicate objects between layers
     * @readonly
     */
    REMOVE_DUPLICATES = 2,

    /**
     * @zh 取消稳抖
     * @en Disable rotation fix
     * @readonly
     */
    DISABLE_ROTATION_FIX = 3
};

class Shadows;

class ShadowsInfo : public RefCounted {
public:
    ShadowsInfo() = default;
    ~ShadowsInfo() override = default;
    /**
     * @en Whether activate planar shadow
     * @zh 是否启用平面阴影？
     */
    void setEnabled(bool val);
    inline bool isEnabled() const {
        return _enabled;
    }

    void setType(ShadowType val);
    inline ShadowType getType() const {
        return _type;
    }

    /**
     * @en Shadow color
     * @zh 阴影颜色
     */
    void setShadowColor(const Color &val);
    inline const Color &getShadowColor() const {
        return _shadowColor;
    }

    /**
     * @en The normal of the plane which receives shadow
     * @zh 阴影接收平面的法线
     */
    void setPlaneDirection(const Vec3 &val);
    inline const Vec3 &getPlaneDirection() const {
        return _normal;
    }

    /**
     * @en The distance from coordinate origin to the receiving plane.
     * @zh 阴影接收平面与原点的距离
     */
    void setPlaneHeight(float val);
    inline float getPlaneHeight() const {
        return _distance;
    }

    /**
     * @en Positional offset values in planar shading calculations.
     * @zh 平面阴影计算中的位置偏移值
     */
    void setPlaneBias(float val);
    inline float getPlaneBias() const {
        return _planeBias;
    }

    /**
     * @en get or set shadow max received
     * @zh 获取或者设置阴影接收的最大光源数量
     */
    void setMaxReceived(uint32_t val);
    inline uint32_t getMaxReceived() const {
        return _maxReceived;
    }

    /**
     * @en get or set shadow map size
     * @zh 获取或者设置阴影纹理大小
     */
    void setShadowMapSize(float value);
    inline float getShadowMapSize() const {
        return _size.x;
    }

    /**
     * @en Set plane which receives shadow with the given node's world transformation
     * @zh 根据指定节点的世界变换设置阴影接收平面的信息
     * @param node The node for setting up the plane
     */
    void setPlaneFromNode(const Node *node);

    void activate(Shadows *resource);

    bool _enabled{false};

    ShadowType _type{ShadowType::PLANAR};

    Shadows *_resource{nullptr};

    uint32_t _maxReceived{4};

    float _distance{0.F};
    float _planeBias{1.0F};

    Vec2 _size{1024.F, 1024.F};

    Vec3 _normal{0.F, 1.F, 0.F};

    Color _shadowColor{0, 0, 0, 76};
};

class Shadows final {
public:
    /**
     * @en MAX_FAR. This is shadow camera max far.
     * @zh 阴影相机的最远视距。
     */
    static constexpr float MAX_FAR{2000.F};

    /**
     * @en EXPANSION_RATIO. This is shadow boundingBox Coefficient of expansion.
     * @zh 阴影包围盒扩大系数。
     */
    static const float COEFFICIENT_OF_EXPANSION;

    Shadows() = default;
    ~Shadows() = default;

    void initialize(const ShadowsInfo &shadowsInfo);
    void destroy();
    gfx::Shader *getPlanarShader(const ccstd::vector<IMacroPatch> &patches);
    gfx::Shader *getPlanarInstanceShader(const ccstd::vector<IMacroPatch> &patches);
    void activate();

    /**
     * @en Whether activate shadow.
     * @zh 是否启用阴影？
     */
    inline bool isEnabled() const { return _enabled; }
    inline void setEnabled(bool val) {
        _enabled = val;
        activate();
    }

    /**
     * @en The normal of the plane which receives shadow.
     * @zh 阴影接收平面的法线。
     */
    inline const Vec3 &getNormal() const { return _normal; }
    inline void setNormal(const Vec3 &val) { _normal.set(val); }

    /**
     * @en The distance from coordinate origin to the receiving plane.
     * @zh 阴影接收平面与原点的距离。
     */
    inline float getDistance() const { return _distance; }
    inline void setDistance(float val) { _distance = val; }

    /**
     * @en Positional offset values in planar shading calculations.
     * @zh 平面阴影计算中的位置偏移值
     */
    inline float getPlaneBias() const { return _planeBias; }
    inline void setPlaneBias(float val) { _planeBias = val; }

    /**
     * @en Shadow color.
     * @zh 阴影颜色。
     */
    inline const Color &getShadowColor() const { return _shadowColor; }
    inline void setShadowColor(const Color &color) {
        _shadowColor.set(color);
        _shadowColor4f[0] = static_cast<float>(color.r) / 255.F;
        _shadowColor4f[1] = static_cast<float>(color.g) / 255.F;
        _shadowColor4f[2] = static_cast<float>(color.b) / 255.F;
        _shadowColor4f[3] = static_cast<float>(color.a) / 255.F;
    }
    inline const ccstd::array<float, 4> &getShadowColor4f() const { return _shadowColor4f; }

    /**
     * @en Shadow type.
     * @zh 阴影类型。
     */
    inline ShadowType getType() const { return _type; }
    inline void setType(ShadowType val) {
        _type = _enabled ? val : ShadowType::NONE;
        activate();
    }

    /**
     * @en get or set shadow camera orthoSize.
     * @zh 获取或者设置阴影纹理大小。
     */
    inline const Vec2 &getSize() const { return _size; }
    inline void setSize(const Vec2 &val) {
        _size.set(val);
        _shadowMapDirty = true;
    }
    inline void setShadowMapSize(float value) {
        _size.set(value, value);
        _shadowMapDirty = true;
    }
    inline float getShadowMapSize() const {
        return _size.x;
    }

    /**
     * @en shadow Map size has been modified.
     * @zh 阴影贴图大小是否被修改。
     */
    inline bool isShadowMapDirty() const { return _shadowMapDirty; }
    inline void setShadowMapDirty(bool val) { _shadowMapDirty = val; }

    inline const Mat4 &getMatLight() const { return _matLight; }
    inline Mat4 &getMatLight() { return _matLight; }

    inline Material *getMaterial() const { return _material.get(); }
    inline Material *getInstancingMaterial() const { return _instancingMaterial.get(); }

    /**
     * @en get or set shadow max received
     * @zh 获取或者设置阴影接收的最大光源数量
     */
    inline void setMaxReceived(uint32_t val) { _maxReceived = val; }
    inline uint32_t getMaxReceived() const { return _maxReceived; }

private:
    void updatePlanarInfo();
    void createInstanceMaterial();
    void createMaterial();

    bool _enabled{false};
    bool _shadowMapDirty{false};

    ShadowType _type{ShadowType::NONE};

    IntrusivePtr<Material> _material{nullptr};
    IntrusivePtr<Material> _instancingMaterial{nullptr};

    float _distance{0.F};
    float _planeBias{1.0F};

    /**
     * @en get or set shadow max received.
     * @zh 阴影接收的最大灯光数量。
     */
    uint32_t _maxReceived{4};

    /**
     * @en The bounding sphere of the shadow map.
     * @zh 用于计算固定区域阴影 Shadow map 的场景包围球.
     */
    geometry::Sphere _fixedSphere{0.0F, 0.0F, 0.0F, 0.01F};

    Vec2 _size{1024.F, 1024.F};

    // public properties of shadow
    Vec3 _normal{0.F, 1.F, 0.F};

    Color _shadowColor{0, 0, 0, 76};
    ccstd::array<float, 4> _shadowColor4f{0.F, 0.F, 0.F, 76.F / 255.F};

    Mat4 _matLight;
};

} // namespace scene
} // namespace cc
