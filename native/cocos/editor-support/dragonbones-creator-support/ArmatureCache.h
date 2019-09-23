/**
* The MIT License (MIT)
*
* Copyright (c) 2012-2018 DragonBones team and other contributors
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

#pragma once

#include "IOBuffer.h"
#include "CCArmatureDisplay.h"

DRAGONBONES_NAMESPACE_BEGIN

class ArmatureCache : public cocos2d::Ref {
public:
    struct SegmentData {
        friend class ArmatureCache;

        SegmentData();
        ~SegmentData();

        void setTexture(cocos2d::middleware::Texture2D* value);
        cocos2d::middleware::Texture2D* getTexture() const;
    public:
        int blendMode = 0;
        std::size_t indexCount = 0;
        std::size_t vertexFloatCount = 0;
    private:
        cocos2d::middleware::Texture2D* _texture = nullptr;
    };

    struct ColorData {
        cocos2d::Color4F color;
        std::size_t vertexFloatOffset = 0;
    };

    struct FrameData {
        friend class ArmatureCache;

        FrameData();
        ~FrameData();

        const std::vector<ColorData*>& getColors() const 
        {
            return _colors;
        }
        std::size_t getColorCount() const;

        const std::vector<SegmentData*>& getSegments() const 
        {
            return _segments;
        }
        std::size_t getSegmentCount() const;
    private:
        // if segment data is empty, it will build new one.
        SegmentData* buildSegmentData(std::size_t index);
        // if color data is empty, it will build new one.
        ColorData* buildColorData(std::size_t index);

        std::vector<ColorData*> _colors;
        std::vector<SegmentData*> _segments;
    public:
        cocos2d::middleware::IOBuffer ib;
        cocos2d::middleware::IOBuffer vb;
    };

    struct AnimationData {
        friend class ArmatureCache;

        AnimationData();
        ~AnimationData();
        void reset();

        FrameData* getFrameData(std::size_t frameIdx) const;
        std::size_t getFrameCount() const;

        bool isComplete() const { return _isComplete; }
        bool needUpdate(int toFrameIdx) const;
    private:
        // if frame is empty, it will build new one.
        FrameData* buildFrameData(std::size_t frameIdx);
    private:
        std::string _animationName = "";
        bool _isComplete = false;
        float _totalTime = 0.0f;
        std::vector<FrameData*> _frames;
    };

    ArmatureCache(const std::string& armatureName, const std::string& armatureKey, const std::string& atlasUUID);
    virtual ~ArmatureCache();

    void updateToFrame(const std::string& animationName, int toFrameIdx = -1);
    // if animation data is empty, it will build new one.
    AnimationData* buildAnimationData(const std::string& animationName);
    AnimationData* getAnimationData(const std::string& animationName);
    CCArmatureDisplay* getArmatureDisplay();
    
    void resetAllAnimationData();
    void resetAnimationData(const std::string& animationName);
private:
    void renderAnimationFrame(AnimationData* animationData);
    void traverseArmature(Armature* armature, float parentOpacity = 1.0f);
public:
    static float FrameTime;
    static float MaxCacheTime;
private:
    FrameData* _frameData = nullptr;
    cocos2d::Color4F _preColor = cocos2d::Color4F(-1.0f, -1.0f, -1.0f, -1.0f);
    cocos2d::Color4F _color = cocos2d::Color4F(1.0f, 1.0f, 1.0f, 1.0f);
    CCArmatureDisplay* _armatureDisplay = nullptr;
    int _preBlendMode = -1;
    GLuint _preTextureIndex = -1;
    GLuint _curTextureIndex = -1;
    int _preISegWritePos = -1;
    int _curISegLen = 0;
    int _curVSegLen = 0;
    int _materialLen = 0;
    cocos2d::renderer::BlendFactor _curBlendSrc;
    cocos2d::renderer::BlendFactor _curBlendDst;
    std::string _curAnimationName = "";
    std::map<std::string, AnimationData*> _animationCaches;
};

DRAGONBONES_NAMESPACE_END
