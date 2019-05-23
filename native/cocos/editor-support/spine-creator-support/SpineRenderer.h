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
#include "base/CCRef.h"
#include "base/ccTypes.h"
#include <vector>
#include "scripting/js-bindings/jswrapper/Object.hpp"
#include "IOTypedArray.h"
#include "MiddlewareManager.h"

namespace spine {

    class AttachmentVertices;

    /** Draws a skeleton.
     */
    class SpineRenderer: public cocos2d::middleware::IMiddleware, public cocos2d::Ref
    {
    public:
        static SpineRenderer* create ();
        static SpineRenderer* createWithSkeleton(spSkeleton* skeleton, bool ownsSkeleton = false, bool ownsSkeletonData = false);
        static SpineRenderer* createWithData (spSkeletonData* skeletonData, bool ownsSkeletonData = false);
        static SpineRenderer* createWithFile (const std::string& skeletonDataFile, spAtlas* atlas, float scale = 1);
        static SpineRenderer* createWithFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale = 1);
        
        virtual void update (float deltaTime);

        spSkeleton* getSkeleton() const;

        void setTimeScale (float scale);
        float getTimeScale () const;

        void updateWorldTransform ();

        void setToSetupPose ();
        void setBonesToSetupPose ();
        void setSlotsToSetupPose ();
        void paused (bool value);
        
        /* Returns 0 if the bone was not found. */
        spBone* findBone (const std::string& boneName) const;
        /* Returns 0 if the slot was not found. */
        spSlot* findSlot (const std::string& slotName) const;
        
        /* Sets the skin used to look up attachments not found in the SkeletonData defaultSkin. Attachments from the new skin are
         * attached if the corresponding attachment from the old skin was attached. Returns false if the skin was not found.
         * @param skin May be empty string ("") for no skin.*/
        bool setSkin (const std::string& skinName);
        /** @param skin May be 0 for no skin.*/
        bool setSkin (const char* skinName);
        
        /* Returns 0 if the slot or attachment was not found. */
        spAttachment* getAttachment (const std::string& slotName, const std::string& attachmentName) const;
        /* Returns false if the slot or attachment was not found.
         * @param attachmentName May be empty string ("") for no attachment. */
        bool setAttachment (const std::string& slotName, const std::string& attachmentName);
        /* @param attachmentName May be 0 for no attachment. */
        bool setAttachment (const std::string& slotName, const char* attachmentName);
        
        /* Enables/disables two color tinting for this instance. May break batching */
        void setUseTint(bool enabled);
        
        /* Sets the range of slots that should be rendered. Use -1, -1 to clear the range */
        void setSlotsRange(int startSlotIndex, int endSlotIndex);

        /**
         * @return debug data,it's a Float32Array,
         * format |debug bones length|[beginX|beginY|toX|toY|...loop...]
         */
        se_object_ptr getDebugData() const
        {
            if (_debugBuffer)
            {
                return _debugBuffer->getTypeArray();
            }
            return nullptr;
        }
        
        /**
         * @return render info offset,it's a Uint32Array,
         * format |render info offset|
         */
        se_object_ptr getRenderInfoOffset() const
        {
            if (_renderInfoOffset)
            {
                return _renderInfoOffset->getTypeArray();
            }
            return nullptr;
        }

        void setColor (cocos2d::Color4B& color);
        void setDebugBonesEnabled (bool enabled);
        void setDebugSlotsEnabled (bool enabled);
        
        void setOpacityModifyRGB (bool value);
        bool isOpacityModifyRGB () const;
        
        void beginSchedule();
        void stopSchedule();
        void onEnable();
        void onDisable();
        
    CC_CONSTRUCTOR_ACCESS:
        SpineRenderer ();
        SpineRenderer(spSkeleton* skeleton, bool ownsSkeleton = false, bool ownsSkeletonData = false);
        SpineRenderer (spSkeletonData* skeletonData, bool ownsSkeletonData = false);
        SpineRenderer (const std::string& skeletonDataFile, spAtlas* atlas, float scale = 1);
        SpineRenderer (const std::string& skeletonDataFile, const std::string& atlasFile, float scale = 1);

        virtual ~SpineRenderer ();

        void initWithUUID(const std::string& uuid);
        void initWithSkeleton(spSkeleton* skeleton, bool ownsSkeleton = false, bool ownsSkeletonData = false);
        void initWithData (spSkeletonData* skeletonData, bool ownsSkeletonData = false);
        void initWithJsonFile (const std::string& skeletonDataFile, spAtlas* atlas, float scale = 1);
        void initWithJsonFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale = 1);
        void initWithBinaryFile (const std::string& skeletonDataFile, spAtlas* atlas, float scale = 1);
        void initWithBinaryFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale = 1);

        virtual void initialize ();
        
    protected:
        void setSkeletonData (spSkeletonData* skeletonData, bool ownsSkeletonData);
        virtual AttachmentVertices* getAttachmentVertices (spRegionAttachment* attachment) const;
        virtual AttachmentVertices* getAttachmentVertices (spMeshAttachment* attachment) const;

        bool                _ownsSkeletonData = false;
        bool                _ownsSkeleton = false;
        spAtlas*            _atlas = nullptr;
        spAttachmentLoader* _attachmentLoader = nullptr;
        spSkeleton*         _skeleton = nullptr;
        float               _timeScale = 1;
        bool                _paused = false;
        
        bool                _debugSlots = false;
        bool                _debugBones = false;
        cocos2d::Color4F    _nodeColor = cocos2d::Color4F::WHITE;
        bool                _premultipliedAlpha = false;
        spSkeletonClipping* _clipper = nullptr;
        bool                _useTint = false;
        std::string         _uuid = "";
        
        int                 _startSlotIndex = -1;
        int                 _endSlotIndex = -1;
        
        cocos2d::middleware::IOTypedArray*  _renderInfoOffset = nullptr;
        cocos2d::middleware::IOTypedArray*  _debugBuffer = nullptr;
    };

}
