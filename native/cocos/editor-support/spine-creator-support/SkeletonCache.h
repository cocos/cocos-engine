/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated January 1, 2020. Replaces all prior versions.
 *
 * Copyright (c) 2013-2020, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software
 * or otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#pragma once

#include "IOBuffer.h"
#include "SkeletonAnimation.h"
#include "middleware-adapter.h"
#include <vector>

namespace spine {
class SkeletonCache : public SkeletonAnimation {
public:
    struct SegmentData {
        friend class SkeletonCache;

        SegmentData();
        ~SegmentData();

        void setTexture(cc::middleware::Texture2D *value);
        cc::middleware::Texture2D *getTexture() const;

    public:
        int indexCount = 0;
        int vertexFloatCount = 0;
        int blendMode = 0;

    private:
        cc::middleware::Texture2D *_texture = nullptr;
    };

    struct BoneData {
        cc::Mat4 globalTransformMatrix;
    };

    struct ColorData {
        cc::middleware::Color4F finalColor;
        cc::middleware::Color4F darkColor;
        int vertexFloatOffset = 0;
    };

    struct FrameData {
        friend class SkeletonCache;

        FrameData();
        ~FrameData();

        const std::vector<BoneData *> &getBones() const {
            return _bones;
        }
        std::size_t getBoneCount() const;

        const std::vector<ColorData *> &getColors() const {
            return _colors;
        }
        std::size_t getColorCount() const;

        const std::vector<SegmentData *> &getSegments() const {
            return _segments;
        }
        std::size_t getSegmentCount() const;

    private:
        // if segment data is empty, it will build new one.
        SegmentData *buildSegmentData(std::size_t index);
        // if color data is empty, it will build new one.
        ColorData *buildColorData(std::size_t index);
        // if bone data is empty, it will build new one.
        BoneData *buildBoneData(std::size_t index);

        std::vector<BoneData *> _bones;
        std::vector<ColorData *> _colors;
        std::vector<SegmentData *> _segments;

    public:
        cc::middleware::IOBuffer ib;
        cc::middleware::IOBuffer vb;
    };

    struct AnimationData {
        friend class SkeletonCache;

        AnimationData();
        ~AnimationData();
        void reset();

        FrameData *getFrameData(std::size_t frameIdx) const;
        std::size_t getFrameCount() const;

        bool isComplete() const { return _isComplete; }
        bool needUpdate(int toFrameIdx) const;

    private:
        // if frame is empty, it will build new one.
        FrameData *buildFrameData(std::size_t frameIdx);

    private:
        std::string _animationName = "";
        bool _isComplete = false;
        float _totalTime = 0.0f;
        std::vector<FrameData *> _frames;
    };

    SkeletonCache();
    virtual ~SkeletonCache();

    virtual void beginSchedule() override {}
    virtual void stopSchedule() override {}
    virtual void update(float deltaTime) override;
    virtual void render(float deltaTime) override {}
    virtual void onAnimationStateEvent(TrackEntry *entry, EventType type, Event *event) override;

    void updateToFrame(const std::string &animationName, int toFrameIdx = -1);
    // if animation data is empty, it will build new one.
    AnimationData *buildAnimationData(const std::string &animationName);
    AnimationData *getAnimationData(const std::string &animationName);
    void resetAllAnimationData();
    void resetAnimationData(const std::string &animationName);

private:
    void renderAnimationFrame(AnimationData *animationData);

public:
    static float FrameTime;
    static float MaxCacheTime;

private:
    std::string _curAnimationName = "";
    std::map<std::string, AnimationData *> _animationCaches;
};
} // namespace spine
