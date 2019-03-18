/******************************************************************************
 * Spine Runtimes Software License v2.5
 *
 * Copyright (c) 2013-2016, Esoteric Software
 * All rights reserved.
 *
 * You are granted a perpetual, non-exclusive, non-sublicensable, and
 * non-transferable license to use, install, execute, and perform the Spine
 * Runtimes software and derivative works solely for personal or internal
 * use. Without the written permission of Esoteric Software (see Section 2 of
 * the Spine Software License Agreement), you may not (a) modify, translate,
 * adapt, or develop new applications using the Spine Runtimes or otherwise
 * create derivative works or improvements of the Spine Runtimes or (b) remove,
 * delete, alter, or obscure any trademarks or any copyright, trademark, patent,
 * or other intellectual property or proprietary rights notices on or in the
 * Software, including any copy thereof. Redistributions in binary or source
 * form must include this license and terms.
 *
 * THIS SOFTWARE IS PROVIDED BY ESOTERIC SOFTWARE "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL ESOTERIC SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, BUSINESS INTERRUPTION, OR LOSS OF
 * USE, DATA, OR PROFITS) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/
#pragma once
#include "spine/spine.h"
#include "spine-creator-support/SpineRenderer.h"

namespace spine {

typedef std::function<void(spTrackEntry* entry)> StartListener;
typedef std::function<void(spTrackEntry* entry)> InterruptListener;
typedef std::function<void(spTrackEntry* entry)> EndListener;
typedef std::function<void(spTrackEntry* entry)> DisposeListener;
typedef std::function<void(spTrackEntry* entry)> CompleteListener;
typedef std::function<void(spTrackEntry* entry, spEvent* event)> EventListener;

/** Draws an animated skeleton, providing an AnimationState for applying one or
 *  more animations and queuing animations to be played later.
 */
class SpineAnimation: public SpineRenderer
{
public:
    static SpineAnimation* create();
    static SpineAnimation* createWithData (spSkeletonData* skeletonData, bool ownsSkeletonData = false);
    static SpineAnimation* createWithJsonFile (const std::string& skeletonJsonFile, spAtlas* atlas, float scale = 1);
    static SpineAnimation* createWithJsonFile (const std::string& skeletonJsonFile, const std::string& atlasFile, float scale = 1);
    static SpineAnimation* createWithBinaryFile (const std::string& skeletonBinaryFile, spAtlas* atlas, float scale = 1);
    static SpineAnimation* createWithBinaryFile (const std::string& skeletonBinaryFile, const std::string& atlasFile, float scale = 1);
    static void setGlobalTimeScale(float timeScale);
    
    // Use createWithJsonFile instead
    CC_DEPRECATED_ATTRIBUTE static SpineAnimation* createWithFile (const std::string& skeletonJsonFile, spAtlas* atlas, float scale = 1)
    {
        return SpineAnimation::createWithJsonFile(skeletonJsonFile, atlas, scale);
    }
    // Use createWithJsonFile instead
    CC_DEPRECATED_ATTRIBUTE static SpineAnimation* createWithile (const std::string& skeletonJsonFile, const std::string& atlasFile, float scale = 1)
    {
        return SpineAnimation::createWithJsonFile(skeletonJsonFile, atlasFile, scale);
    }

    virtual void update (float deltaTime) override;

    void setAnimationStateData (spAnimationStateData* stateData);
    void setMix (const std::string& fromAnimation, const std::string& toAnimation, float duration);

    spTrackEntry* setAnimation (int trackIndex, const std::string& name, bool loop);
    spTrackEntry* addAnimation (int trackIndex, const std::string& name, bool loop, float delay = 0);
    spTrackEntry* setEmptyAnimation (int trackIndex, float mixDuration);
    void setEmptyAnimations (float mixDuration);
    spTrackEntry* addEmptyAnimation (int trackIndex, float mixDuration, float delay = 0);
    spAnimation* findAnimation(const std::string& name) const;
    spTrackEntry* getCurrent (int trackIndex = 0);
    void clearTracks ();
    void clearTrack (int trackIndex = 0);

    void setStartListener (const StartListener& listener);
    void setInterruptListener (const InterruptListener& listener);
    void setEndListener (const EndListener& listener);
    void setDisposeListener (const DisposeListener& listener);
    void setCompleteListener (const CompleteListener& listener);
    void setEventListener (const EventListener& listener);

    void setTrackStartListener (spTrackEntry* entry, const StartListener& listener);
    void setTrackInterruptListener (spTrackEntry* entry, const InterruptListener& listener);
    void setTrackEndListener (spTrackEntry* entry, const EndListener& listener);
    void setTrackDisposeListener (spTrackEntry* entry, const DisposeListener& listener);
    void setTrackCompleteListener (spTrackEntry* entry, const CompleteListener& listener);
    void setTrackEventListener (spTrackEntry* entry, const EventListener& listener);

    virtual void onAnimationStateEvent (spTrackEntry* entry, spEventType type, spEvent* event);
    virtual void onTrackEntryEvent (spTrackEntry* entry, spEventType type, spEvent* event);

    spAnimationState* getState() const;
    
CC_CONSTRUCTOR_ACCESS:
    SpineAnimation ();
    SpineAnimation (spSkeletonData* skeletonData, bool ownsSkeletonData = false);
    SpineAnimation (const std::string&skeletonDataFile, spAtlas* atlas, float scale = 1);
    SpineAnimation (const std::string& skeletonDataFile, const std::string& atlasFile, float scale = 1);
    virtual ~SpineAnimation ();
    virtual void initialize () override;

protected:
    spAnimationState*       _state = nullptr;
    bool                    _ownsAnimationStateData = false;
    StartListener           _startListener = nullptr;
    InterruptListener       _interruptListener = nullptr;
    EndListener             _endListener = nullptr;
    DisposeListener         _disposeListener = nullptr;
    CompleteListener        _completeListener = nullptr;
    EventListener           _eventListener = nullptr;
private:
    typedef SpineRenderer super;
};

}
