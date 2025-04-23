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

#include <vector>
#include "IOTypedArray.h"
#include "MiddlewareManager.h"
#include "Object.h"
#include "base/Macros.h"
#include "base/RefCounted.h"
#include "base/RefMap.h"
#include "core/assets/Texture2D.h"
#include "middleware-adapter.h"
#if CC_USE_SPINE_3_8
#include "spine-creator-support/VertexEffectDelegate.h"
#endif
#include "spine/spine.h"

namespace cc {
class RenderEntity;
class RenderDrawInfo;
class Material;

class AttachmentVertices;

struct SlotCacheInfo {
    bool isOwner{false};
    spine::Attachment* attachment{nullptr};
};

/** Draws a skeleton.
     */
class SkeletonRenderer : public cc::RefCounted, public cc::middleware::IMiddleware {
public:
    static SkeletonRenderer *create();
    static SkeletonRenderer *createWithSkeleton(spine::Skeleton *skeleton, bool ownsSkeleton = false, bool ownsSkeletonData = false);
    static SkeletonRenderer *createWithData(spine::SkeletonData *skeletonData, bool ownsSkeletonData = false);
    static SkeletonRenderer *createWithFile(const std::string &skeletonDataFile, const std::string &atlasFile, float scale = 1);

    void update(float deltaTime) override {}
    void render(float deltaTime) override;
    virtual cc::Rect getBoundingBox() const;

    spine::Skeleton *getSkeleton() const;

    void setTimeScale(float scale);
    float getTimeScale() const;

    void updateWorldTransform();

    void setToSetupPose();
    void setBonesToSetupPose();
    void setSlotsToSetupPose();
    void paused(bool value);

    /* Returns 0 if the bone was not found. */
    spine::Bone *findBone(const std::string &boneName) const;
    /* Returns 0 if the slot was not found. */
    spine::Slot *findSlot(const std::string &slotName) const;

    /* Sets the skin used to look up attachments not found in the SkeletonData defaultSkin. Attachments from the new skin are
         * attached if the corresponding attachment from the old skin was attached.
         * @param skin May be empty string ("") for no skin.*/
    void setSkin(const std::string &skinName);
    /** @param skin May be 0 for no skin.*/
    void setSkin(const char *skinName);

    /* Returns 0 if the slot or attachment was not found. */
    spine::Attachment *getAttachment(const std::string &slotName, const std::string &attachmentName) const;
    /* Returns false if the slot or attachment was not found.
         * @param attachmentName May be empty string ("") for no attachment. */
    bool setAttachment(const std::string &slotName, const std::string &attachmentName);
    /* @param attachmentName May be 0 for no attachment. */
    bool setAttachment(const std::string &slotName, const char *attachmentName);

    /* Enables/disables two color tinting for this instance. May break batching */
    void setUseTint(bool enabled);
#if CC_USE_SPINE_3_8
    /* Sets the vertex effect to be used, set to 0 to disable vertex effects */
    void setVertexEffectDelegate(VertexEffectDelegate *effectDelegate);
#endif
    /* Sets the range of slots that should be rendered. Use -1, -1 to clear the range */
    void setSlotsRange(int startSlotIndex, int endSlotIndex);

    /**
         * @return debug data, it's a Float32Array,
         * format |debug bones length|[beginX|beginY|toX|toY|...loop...]
         */
    se_object_ptr getDebugData() const;
    /**
         * @return shared buffer offset, it's a Uint32Array
		 * format |render info offset|attach info offset|
         */
    se_object_ptr getSharedBufferOffset() const;

    void setColor(float r, float g, float b, float a);
    void setBatchEnabled(bool enabled);
    void setDebugBonesEnabled(bool enabled);
    void setDebugSlotsEnabled(bool enabled);
    void setDebugMeshEnabled(bool enabled);
    void setAttachEnabled(bool enabled);

    void setOpacityModifyRGB(bool value);
    bool isOpacityModifyRGB() const;

    virtual void beginSchedule();
    virtual void stopSchedule();
    void onEnable();
    void onDisable();

    SkeletonRenderer();
    explicit SkeletonRenderer(spine::Skeleton *skeleton, bool ownsSkeleton = false, bool ownsSkeletonData = false, bool ownsAtlas = false);
    explicit SkeletonRenderer(spine::SkeletonData *skeletonData, bool ownsSkeletonData = false);
    SkeletonRenderer(const std::string &skeletonDataFile, const std::string &atlasFile, float scale = 1);

    ~SkeletonRenderer() override;

    void initWithUUID(const std::string &uuid);
    void initWithSkeleton(spine::Skeleton *skeleton, bool ownsSkeleton = false, bool ownsSkeletonData = false, bool ownsAtlas = false);
    void initWithData(spine::SkeletonData *skeletonData, bool ownsSkeletonData = false);
    void initWithJsonFile(const std::string &skeletonDataFile, spine::Atlas *atlas, float scale = 1);
    void initWithJsonFile(const std::string &skeletonDataFile, const std::string &atlasFile, float scale = 1);
    void initWithBinaryFile(const std::string &skeletonDataFile, spine::Atlas *atlas, float scale = 1);
    void initWithBinaryFile(const std::string &skeletonDataFile, const std::string &atlasFile, float scale = 1);

    virtual void initialize();

    cc::RenderDrawInfo *requestDrawInfo(int idx);
    cc::Material *requestMaterial(uint16_t blendSrc, uint16_t blendDst);
    void setMaterial(cc::Material *material);
    void setRenderEntity(cc::RenderEntity *entity);
    void setSlotTexture(const std::string &slotName, cc::Texture2D *tex2d, bool createAttachment);

protected:
    void setSkeletonData(spine::SkeletonData *skeletonData, bool ownsSkeletonData);

    bool _ownsSkeletonData = false;
    bool _ownsSkeleton = false;
    bool _ownsAtlas = false;
    spine::Atlas *_atlas = nullptr;
    spine::AttachmentLoader *_attachmentLoader = nullptr;
    spine::Skeleton *_skeleton = nullptr;
#if CC_USE_SPINE_3_8
    VertexEffectDelegate *_effectDelegate = nullptr;
#endif
    float _timeScale = 1;
    bool _paused = false;

    bool _useAttach = false;
    bool _debugMesh = false;
    bool _debugSlots = false;
    bool _debugBones = false;
    cc::middleware::Color4F _nodeColor = cc::middleware::Color4F::WHITE;
    bool _premultipliedAlpha = false;
    spine::SkeletonClipping *_clipper = nullptr;
    bool _useTint = false;
    bool _enableBatch = false;
    std::string _uuid;

    int _startSlotIndex = -1;
    int _endSlotIndex = -1;

    cc::middleware::IOTypedArray *_sharedBufferOffset = nullptr;
    cc::middleware::IOTypedArray *_debugBuffer = nullptr;

    cc::RenderEntity *_entity = nullptr;
    cc::Material *_material = nullptr;
    ccstd::vector<cc::RenderDrawInfo *> _drawInfoArray;
    ccstd::unordered_map<uint32_t, cc::Material *> _materialCaches;
    /**
     * The slot's attachment may be modified when calling AnimationState::apply(), which can cause custom attachments to malfunction. 
     * To prevent this, we need to cache the original attachment.
     */
    ccstd::unordered_map<spine::Slot *, SlotCacheInfo> _slotTextureSet;
    bool _needClearMaterialCaches = false;
};
}; // namespace cc
