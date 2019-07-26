/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
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

#include <vector>
#include <string>
#include "base/ccTypes.h"
#include "math/Mat4.h"
#include "../Macro.h"
#include "../Types.h"
#include "View.h"
#include "../scene/NodeProxy.hpp"

RENDERER_BEGIN

class FrameBuffer;
class Texture2D;
class RenderBuffer;
class DeviceGraphics;

/**
 * @addtogroup renderer
 * @{
 */

/**
 *  @brief Manage scene light.
 */
class Light : public Ref
{
public:
    /**
     *  @brief Light type.
     */
    enum class LightType
    {
        /**
         * Directional light
         */
        DIRECTIONAL,
        /**
         * Point light
         */
        POINT,
        /**
         * Spot light
         */
        SPOT,
        /**
         * Ambient light
         */
        AMBIENT
    };
    
    /**
     *  @brief Shadow type.
     */
    enum class ShadowType
    {
        /**
         * No shadow
         */
        NONE,
        /**
         * Hard shadow
         */
        HARD,
        /**
         * Soft shadow
         */
        SOFT
    };
    
    /**
     *  @brief The default constructor.
     */
    Light();
    ~Light();
    
    /**
     *  @brief Sets the light color.
     */
    void setColor(float r, float g, float b);
    /**
     *  @brief Gets the light color.
     */
    inline Color3F getColor() const { return _color; }
    /**
     *  @brief Sets the light intensity.
     */
    void setIntensity(float val);
    /**
     *  @brief Gets the light intensity.
     */
    inline float getIntensity() const { return _intensity; }
    /**
     *  @brief Sets the light type.
     */
    inline void setType(LightType type) { _type = type; }
    /**
     *  @brief Gets the light type.
     */
    inline LightType getType() const { return _type; }
    /**
     *  @brief Sets the spot light angle.
     */
    void setSpotAngle(float val);
    /**
     *  @brief Gets the spot light angle.
     */
    inline float getSpotAngle() const { return _spotAngle; }
    
    /**
     *  @brief Sets the light attenuation exponent.
     */
    void setSpotExp(float val);
    /**
     *  @brief Gets the light attenuation exponent.
     */
    inline float getSpotExp() const { return _spotExp; }
    /**
     *  @brief Sets spot or point light range.
     */
    inline void setRange(float val) { _range = val; }
    /**
     *  @brief Gets spot or point light range.
     */
    inline float getRange() const { return _range; }
    /**
     *  @brief Gets the shadow type.
     */
    void setShadowType(ShadowType val);
    /**
     *  @brief Gets the shadow type.
     */
    inline ShadowType getShadowType() const { return _shadowType; }
    /**
     *  @brief Gets the shadow map texture.
     */
    inline Texture2D* getShadowMap() const { return _shadowMap; }
    /**
     *  @brief Gets the view projection matrix.
     */
    inline Mat4 getViewPorjMatrix() const { return _viewProjMatrix; }
    /**
     *  @brief Gets the view projection matrix.
     */
    inline const Mat4& getViewProjMatrix() const { return _viewProjMatrix; }
    /**
     *  @brief Gets the direction uniform.
     */
    inline const Vec3& getDirectionUniform() const { return _directionUniform; }
    /**
     *  @brief Gets the color uniform.
     */
    inline const Vec3& getColorUniform() const { return _colorUniform; }
    /**
     *  @brief Gets the position uniform.
     */
    inline const Vec3& getPositionUniform() const { return _positionUniform; }
    /**
     *  @brief Sets the resolution of shadow
     */
    void setShadowResolution(uint32_t val);
    /**
     *  @brief Gets the resolution of shadow
     */
    inline uint32_t getShadowResolution() const { return _shadowResolution; }
    
    /**
     *  @brief Sets the shadow bias setting.
     */
    inline void setShadowBias(float val) { _shadowBias = val; }
    /**
     *  @brief Gets the shadow bias setting.
     */
    inline float getShadowBias() const { return _shadowBias; }
    /**
     *  @brief Sets the shadow darkness setting.
     */
    inline void setShadowDarkness(float val) { _shadowDarkness = val; }
    /**
     *  @brief Gets the shadow darkness setting.
     */
    inline float getShadowDarkness() const { return _shadowDarkness; }
    
    /**
     *  @brief Sets the min depth of shadow.
     */
    inline void setShadowMinDepth(float val) { _shadowMinDepth = val; }
    /**
     *  @brief Gets the min depth of shadow.
     */
    float getShadowMinDepth() const;
    /**
     *  @brief Sets the max depth of shadow.
     */
    inline void setShadowMaxDepth(float val) { _shadowMaxDepth = val; }
    /**
     *  @brief Gets the max depth of shadow.
     */
    float getShadowMaxDepth() const;
    /**
     *  @brief Sets the shadow scale.
     */
    inline void setShadowDepthScale(float val) { _shadowScale = val; }
    /**
     *  @brief Gets the shadow scale.
     */
    inline float getShadowDepthScale() const { return _shadowScale; }
    /**
     *  @brief Sets the frustum edge fall off.
     */
    inline void setFrustumEdgeFalloff(uint32_t val) { _frustumEdgeFalloff = val; }
    /**
     *  @brief Gets the frustum edge fall off.
     */
    inline uint32_t getFrustumEdgeFalloff() const { return _frustumEdgeFalloff; }
    /**
     *  @brief Sets the world matrix.
     */
    void setWorldMatrix(const Mat4& worldMatrix);
    /**
     *  @brief Gets the world matrix.
     */
    inline const Mat4& getWorldMatrix() const { return _node->getWorldMatrix(); }
    /**
     *  @brief Extract light informations to view.
     */
    void extractView(View& out, const std::vector<std::string>& stages);
    /**
     *  @brief Update light and generate new shadow map.
     */
    void update(DeviceGraphics* device);
    /**
     *  @brief Sets the shadow frustum size.
     */
    inline void setShadowFrustumSize(float val) {_shadowFustumSize = val;};
    /**
     *  @brief Sets the related node proxy which provids model matrix for light.
     */
    void setNode(NodeProxy* node);
private:
    void updateLightPositionAndDirection();
    void generateShadowMap(DeviceGraphics* device);
    void destroyShadowMap();
    void computeSpotLightViewProjMatrix(Mat4& matView, Mat4& matProj) const;
    void computeDirectionalLightViewProjMatrix(Mat4& matView, Mat4& matProj) const;
    void computePointLightViewProjMatrix(Mat4& matView, Mat4& matProj) const;
    
    LightType _type = LightType::DIRECTIONAL;
    Color3F _color = {1.f, 1.f, 1.f};
    float _intensity = 1.f;
    
    // used for spot and point light
    float _range = 1.f;
    // used for spot light, default to 60 degrees
    float _spotAngle = RENDERER_PI / 3;
    float _spotExp = 1.f;
    // cached for uniform
    Vec3 _directionUniform;
    Vec3 _positionUniform;
    Vec3 _colorUniform = {_color.r * _intensity, _color.g * _intensity, _color.b * _intensity};
    float _spotUniform[2] = { std::cos(_spotAngle) * 0.5f, _spotExp};
    
    // shadow params
    ShadowType _shadowType = ShadowType::NONE;
    FrameBuffer* _shadowFrameBuffer = nullptr;
    Texture2D* _shadowMap = nullptr;
    bool _shadowMapDirty = false;
    RenderBuffer* _shadowDepthBuffer = nullptr;
    uint32_t _shadowResolution = 1024;
    float _shadowBias = 0.0005f;
    float _shadowDarkness = 1.f;
    float _shadowMinDepth = 1;
    float _shadowMaxDepth = 1000;
    float _shadowScale = 50; // maybe need to change it if the distance between shadowMaxDepth and shadowMinDepth is small.
    uint32_t _frustumEdgeFalloff = 0; // used by directional and spot light.
    Mat4 _viewProjMatrix;
    float _spotAngleScale = 1; // used for spot light.
    float _shadowFustumSize = 50; // used for directional light.
    
    Mat4 _worldMatrix;
    Mat4 _worldRT;
    
    NodeProxy* _node = nullptr;

    Vec3 _forward = Vec3(0, 0, -1.f);
};

// end of renderer group
/// @}

RENDERER_END
