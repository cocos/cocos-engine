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
         * @return material data,it's a Uint32Array,
         * format |material length|index offset|[texture index|blend src|blend dst|indice length|...loop...]
         */
        se_object_ptr getMaterialData() const
        {
            if (_materialBuffer)
            {
                return _materialBuffer->getTypeArray();
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

        bool                _ownsSkeletonData = true;
        bool                _ownsSkeleton = true;
        spAtlas*            _atlas = nullptr;
        spAttachmentLoader* _attachmentLoader = nullptr;
        spSkeleton*         _skeleton = nullptr;
        float               _timeScale = 1;
        bool                _paused = false;
        
        bool                _debugSlots = false;
        bool                _debugBones = false;
        cocos2d::Color4B    _nodeColor = cocos2d::Color4B::WHITE;
        bool                _premultipliedAlpha = false;
        spSkeletonClipping* _clipper = nullptr;
        bool                _useTint = false;
        
        int                 _startSlotIndex = -1;
        int                 _endSlotIndex = -1;
        
        cocos2d::middleware::IOTypedArray*  _materialBuffer = nullptr;
        cocos2d::middleware::IOTypedArray*  _debugBuffer = nullptr;
    };

}
