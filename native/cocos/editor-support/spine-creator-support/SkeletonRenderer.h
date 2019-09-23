/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated May 1, 2019. Replaces all prior versions.
 *
 * Copyright (c) 2013-2019, Esoteric Software LLC
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
 * THIS SOFTWARE IS PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 * NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, BUSINESS
 * INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#pragma once

#include "spine/spine.h"
#include "base/CCRef.h"
#include "base/ccTypes.h"
#include <vector>
#include "scripting/js-bindings/jswrapper/Object.hpp"
#include "IOTypedArray.h"
#include "MiddlewareManager.h"
#include "spine-creator-support/VertexEffectDelegate.h"
#include "renderer/scene/NodeProxy.hpp"
#include "base/CCMap.h"
#include "middleware-adapter.h"
#include "base/ccMacros.h"

namespace spine {

    class AttachmentVertices;

    /** Draws a skeleton.
     */
    class SkeletonRenderer: public cocos2d::middleware::IMiddleware, public cocos2d::Ref {
    public:
        static SkeletonRenderer* create ();
        static SkeletonRenderer* createWithSkeleton(Skeleton* skeleton, bool ownsSkeleton = false, bool ownsSkeletonData = false);
        static SkeletonRenderer* createWithData (SkeletonData* skeletonData, bool ownsSkeletonData = false);
        static SkeletonRenderer* createWithFile (const std::string& skeletonDataFile, Atlas* atlas, float scale = 1);
        static SkeletonRenderer* createWithFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale = 1);
        
        virtual void update (float deltaTime) override {}
        virtual void render (float deltaTime) override;
        virtual cocos2d::Rect getBoundingBox () const;
        
        Skeleton* getSkeleton() const;

        void setTimeScale (float scale);
        float getTimeScale () const;

        void updateWorldTransform ();

        void setToSetupPose ();
        void setBonesToSetupPose ();
        void setSlotsToSetupPose ();
        void paused (bool value);
        
        /* Returns 0 if the bone was not found. */
        Bone* findBone (const std::string& boneName) const;
        /* Returns 0 if the slot was not found. */
        Slot* findSlot (const std::string& slotName) const;
        
        /* Sets the skin used to look up attachments not found in the SkeletonData defaultSkin. Attachments from the new skin are
         * attached if the corresponding attachment from the old skin was attached.
         * @param skin May be empty string ("") for no skin.*/
        void setSkin (const std::string& skinName);
        /** @param skin May be 0 for no skin.*/
        void setSkin (const char* skinName);
        
        /* Returns 0 if the slot or attachment was not found. */
        Attachment* getAttachment (const std::string& slotName, const std::string& attachmentName) const;
        /* Returns false if the slot or attachment was not found.
         * @param attachmentName May be empty string ("") for no attachment. */
        bool setAttachment (const std::string& slotName, const std::string& attachmentName);
        /* @param attachmentName May be 0 for no attachment. */
        bool setAttachment (const std::string& slotName, const char* attachmentName);
        
        /* Enables/disables two color tinting for this instance. May break batching */
        void setUseTint(bool enabled);
        
        /* Sets the vertex effect to be used, set to 0 to disable vertex effects */
        void setVertexEffectDelegate(VertexEffectDelegate* effectDelegate);
        /* Sets the range of slots that should be rendered. Use -1, -1 to clear the range */
        void setSlotsRange(int startSlotIndex, int endSlotIndex);

        /**
         * @return debug data,it's a Float32Array,
         * format |debug bones length|[beginX|beginY|toX|toY|...loop...]
         */
        se_object_ptr getDebugData() const {
            if (_debugBuffer) {
                return _debugBuffer->getTypeArray();
            }
            return nullptr;
        }
        
        void bindNodeProxy(cocos2d::renderer::NodeProxy* node) {
            if (node == _nodeProxy) return;
            CC_SAFE_RELEASE(_nodeProxy);
            _nodeProxy = node;
            CC_SAFE_RETAIN(_nodeProxy);
        }
        
        void setEffect(cocos2d::renderer::Effect* effect) {
            if (effect == _effect) return;
            CC_SAFE_RELEASE(_effect);
            _effect = effect;
            CC_SAFE_RETAIN(_effect);
        }
        
        void setColor (cocos2d::Color4B& color);
        void setBatchEnabled (bool enabled);
        void setDebugBonesEnabled (bool enabled);
        void setDebugSlotsEnabled (bool enabled);
        void setDebugMeshEnabled (bool enabled);
        
        void setOpacityModifyRGB (bool value);
        bool isOpacityModifyRGB () const;
        
        virtual void beginSchedule();
        virtual void stopSchedule();
        void onEnable();
        void onDisable();
        
    CC_CONSTRUCTOR_ACCESS:
        SkeletonRenderer ();
        SkeletonRenderer(Skeleton* skeleton, bool ownsSkeleton = false, bool ownsSkeletonData = false, bool ownsAtlas = false);
        SkeletonRenderer (SkeletonData* skeletonData, bool ownsSkeletonData = false);
        SkeletonRenderer (const std::string& skeletonDataFile, Atlas* atlas, float scale = 1);
        SkeletonRenderer (const std::string& skeletonDataFile, const std::string& atlasFile, float scale = 1);

        virtual ~SkeletonRenderer ();

        void initWithUUID(const std::string& uuid);
        void initWithSkeleton(Skeleton* skeleton, bool ownsSkeleton = false, bool ownsSkeletonData = false, bool ownsAtlas = false);
        void initWithData (SkeletonData* skeletonData, bool ownsSkeletonData = false);
        void initWithJsonFile (const std::string& skeletonDataFile, Atlas* atlas, float scale = 1);
        void initWithJsonFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale = 1);
        void initWithBinaryFile (const std::string& skeletonDataFile, Atlas* atlas, float scale = 1);
        void initWithBinaryFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale = 1);

        virtual void initialize ();
    protected:
        void setSkeletonData (SkeletonData* skeletonData, bool ownsSkeletonData);
        
        bool                _ownsSkeletonData = false;
        bool                _ownsSkeleton = false;
        bool                _ownsAtlas = false;
        Atlas*              _atlas = nullptr;
        AttachmentLoader*   _attachmentLoader = nullptr;
        Skeleton*           _skeleton = nullptr;
        VertexEffectDelegate* _effectDelegate = nullptr;
        float               _timeScale = 1;
        bool                _paused = false;
        
        bool                _batch = false;
        bool                _debugMesh = false;
        bool                _debugSlots = false;
        bool                _debugBones = false;
        cocos2d::Color4F    _nodeColor = cocos2d::Color4F::WHITE;
        bool                _premultipliedAlpha = false;
        SkeletonClipping*   _clipper = nullptr;
        bool                _useTint = false;
        std::string         _uuid = "";
        
        int                 _startSlotIndex = -1;
        int                 _endSlotIndex = -1;
        
        cocos2d::middleware::IOTypedArray* _debugBuffer = nullptr;
        cocos2d::renderer::NodeProxy* _nodeProxy = nullptr;
        cocos2d::renderer::Effect* _effect = nullptr;
    };

}
