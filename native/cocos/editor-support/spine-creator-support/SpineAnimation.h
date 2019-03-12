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
