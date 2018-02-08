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

RENDERER_BEGIN

class FrameBuffer;
class Texture2D;
class RenderBuffer;
class DeviceGraphics;

class Light : public Ref
{
public:
    enum class LightType
    {
        DIRECTIONAL,
        POINT,
        SPOT
    };
    
    enum class ShadowType
    {
        NONE,
        HARD,
        SOFT
    };
    
    Light();
    
    void setColor(float r, float g, float b);
    inline Color3F getColor() const { return _color; }
    
    void setIntensity(float val);
    inline float getIntensity() const { return _intensity; }
    
    inline void setType(LightType type) { _type = type; }
    inline LightType getType() const { return _type; }
    
    void setSpotAngle(float val);
    inline float getSpotAngle() const { return _spotAngle; }
    
    void setSpotExp(float val);
    inline float getSpotExp() const { return _spotExp; }
    
    inline void setRange(float val) { _range = val; }
    inline float getRange() const { return _range; }
    
    void setShadowType(ShadowType val);
    inline ShadowType getShadowType() const { return _shadowType; }
    
    inline Texture2D* getShadowMap() const { return _shadowMap; }
    
    inline Mat4 getViewPorjMatrix() const { return _viewProjMatrix; }
    inline const Mat4& getViewProjMatrix() const { return _viewProjMatrix; }
    
    void setShadowResolution(uint32_t val);
    inline uint32_t getShadowResolution() const { return _shadowResolution; }
    
    inline void setShadowBias(float val) { _shadowBias = val; }
    inline float getShadowBias() const { return _shadowBias; }
    
    inline void setShadowDarkness(uint32_t val) { _shadowDarkness = val; }
    inline uint32_t getShadowDarkness() const { return _shadowDarkness; }
    
    inline void setShadowMinDepth(float val) { _shadowMinDepth = val; }
    float getShadowMinDepth() const;
    
    inline void setShadowMaxDepth(float val) { _shadowMaxDepth = val; }
    float getShadowMaxDepth() const;
    
    inline void setShadowScale(float val) { _shadowScale = val; }
    inline float getShadowScale() const { return _shadowScale; }
    
    inline void setFrustumEdgeFalloff(uint32_t val) { _frustumEdgeFalloff = val; }
    inline uint32_t getFrustumEdgeFalloff() const { return _frustumEdgeFalloff; }
    
    void setWorldMatrix(const Mat4& worldMatrix);
    inline const Mat4& getWorldMatrix() const { return _worldMatrix; }
    
    void extractView(View& out, const std::vector<std::string>& stages);
    
    void update(DeviceGraphics* device);
    
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
    float _shadowBias = 0.00005f;
    float _shadowDarkness = 1.f;
    float _shadowMinDepth = 1;
    float _shadowMaxDepth = 1000;
    float _shadowScale = 50; // maybe need to change it if the distance between shadowMaxDepth and shadowMinDepth is small.
    uint32_t _frustumEdgeFalloff = 0; // used by directional and spot light.
    Mat4 _viewProjMatrix;
    float _spotAngleScale = 1; // used for spot light.
    uint32_t _shadowFustumSize = 80; // used for directional light.
    
    Mat4 _worldMatrix;
    Mat4 _worldRT;
};

RENDERER_END
