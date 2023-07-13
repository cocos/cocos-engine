#ifndef _SPINE_SKELETON_INSTANCE_H_
#define _SPINE_SKELETON_INSTANCE_H_
#include <spine/spine.h>
#include <functional>
#include <map>
#include <memory>
#include <string>
#include "mesh-type-define.h"
#include "spine-model.h"
using namespace spine;

typedef std::function<void(TrackEntry *entry)> StartListener;
typedef std::function<void(TrackEntry *entry)> InterruptListener;
typedef std::function<void(TrackEntry *entry)> EndListener;
typedef std::function<void(TrackEntry *entry)> DisposeListener;
typedef std::function<void(TrackEntry *entry)> CompleteListener;
typedef std::function<void(TrackEntry *entry, Event *event)> EventListener;

enum DEBUG_SHAPE_TYPE {
    DEBUG_REGION = 0,
    DEBUG_MESH = 1
};
class SpineDebugShape {
public:
    SpineDebugShape() {}
    ~SpineDebugShape() {}
    uint32_t type = 0;
    uint32_t vOffset = 0;
    uint32_t vCount = 0;
    uint32_t iOffset = 0;
    uint32_t iCount = 0;
};

class SpineSkeletonInstance {
    struct UserData {
        bool useTint = false;
        bool premultipliedAlpha = false;
        bool debugMode = false;
        bool useSlotTexture = false;
        Color4F color = Color4F(1.0F, 1.0F, 1.0F, 1.0F);
    };

public:
    SpineSkeletonInstance();
    ~SpineSkeletonInstance();
    Skeleton *initSkeleton(SkeletonData *data);
    TrackEntry *setAnimation(float trackIndex, const std::string &name, bool loop);
    void setSkin(const std::string &name);
    void updateAnimation(float dltTime);
    SpineModel *updateRenderData();
    void setPremultipliedAlpha(bool val);
    void setUseTint(bool useTint);
    void setDebugMode(bool debug);
    void setColor(float r, float g, float b, float a);
    void setJitterEffect(JitterVertexEffect *effect);
    void setSwirlEffect(SwirlVertexEffect *effect);
    void clearEffect();
    AnimationState *getAnimationState();
    void setMix(const std::string &from, const std::string &to, float duration);
    void setListener(uint32_t listenerID, uint32_t type);
    void onAnimationStateEvent(TrackEntry *entry, EventType type, Event *event);
    std::vector<SpineDebugShape> &getDebugShapes();
    void resizeSlotRegion(const std::string &slotName, uint32_t width, uint32_t height, bool createNew = false);
    void setSlotTexture(const std::string &slotName, uint32_t index);

private:
    void collectMeshData();

private:
    Skeleton *_skeleton = nullptr;
    SkeletonData *_skeletonData = nullptr;
    AnimationStateData *_animStateData = nullptr;
    AnimationState *_animState = nullptr;
    SkeletonClipping *_clipper = nullptr;
    VertexEffect *_effect = nullptr;
    SpineModel *_model = nullptr;
    uint32_t _startListenerID = 0;
    uint32_t _interruptListenerID = 0;
    uint32_t _endListenerID = 0;
    uint32_t _disposeListenerID = 0;
    uint32_t _completeListenerID = 0;
    uint32_t _eventListenerID = 0;
    UserData _userData;
    std::vector<SpineDebugShape> _debugShapes{};
    std::map<Slot *, uint32_t> slotTextureSet{};
};

#endif