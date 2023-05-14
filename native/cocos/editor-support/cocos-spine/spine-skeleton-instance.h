#pragma once
#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/TypeDef.h"
#include <vector>
#include "bindings/utils/BindingUtils.h"
#include "base/std/container/string.h"
#include "cocos/editor-support/spine/spine.h"
#include "middleware-adapter.h"
#include "cocos-spine/spine-mesh-data.h"
#include "editor-support/middleware-adapter.h"

namespace spine {

class SpineSkeletonInstance {
struct UserData {
    bool doScale = false;
    bool doFillZ = true;
    float scale = 1.0F;
    bool premultipliedAlpha = true;
    cc::middleware::Color4F color = cc::middleware::Color4F(1.0F, 1.0F, 1.0F, 1.0F);
};

public:
    SpineSkeletonInstance();
    ~SpineSkeletonInstance();

    void     setSkin(ccstd::string &name);
    bool     setAnimation(uint32_t trackIndex, ccstd::string &name, bool loop);
    void     updateAnimation(float dltTime);
    void     setTimeScale(float scale);
    void     setDefaultScale(float scale);
    void     clearTrack(uint32_t trackIndex);
    void     clearTracks();
    void     setToSetupPose();
    void     setMix(ccstd::string &fromAnimation, ccstd::string &toAnimation, float duration);
    void     setColor(float r, float g, float b, float a);
    void     setSlotsToSetupPose();
    void     setBonesToSetupPose();
    void     setAttachment(ccstd::string &slotName, ccstd::string &attachmentName);

    void     initSkeletonData(ccstd::string &jsonStr, ccstd::string &atlasText);
    void     initSkeletonDataBinary(ccstd::string &datPath, ccstd::string &atlasText);
    SpineSkeletonModelData* updateRenderData();

private:
    void collectMeshData(std::vector<SpineSkeletonMeshData> &meshArray);
    void processVertices(std::vector<SpineSkeletonMeshData> &meshes);
    void mergeMeshes(std::vector<SpineSkeletonMeshData> &meshArray);

private:
    SpineSkeletonModelData* _model = nullptr;
    spine::SkeletonData *_skelData = nullptr;
    spine::Skeleton *_skeleton = nullptr;
    spine::AnimationStateData *_animStateData = nullptr;
    spine::AnimationState *_animState = nullptr;
    spine::SkeletonClipping *_clipper = nullptr;
    spine::VertexEffect *_effect = nullptr;
    UserData _userData;
}; // class 

} // namespace spine
