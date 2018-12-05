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

#include "spine-creator-support/SpineRenderer.h"
#include "spine/extension.h"
#include "spine-creator-support/AttachmentVertices.h"
#include "spine-creator-support/CreatorAttachmentLoader.h"
#include <algorithm>
#include "platform/CCApplication.h"
#include "base/CCScheduler.h"
#include "MiddlewareMacro.h"

USING_NS_CC;
USING_NS_MW;

using std::min;
using std::max;

using namespace spine;

SpineRenderer* SpineRenderer::create ()
{
    SpineRenderer* skeleton = new SpineRenderer();
    skeleton->autorelease();
    return skeleton;
}

SpineRenderer* SpineRenderer::createWithData (spSkeletonData* skeletonData, bool ownsSkeletonData)
{
	SpineRenderer* node = new SpineRenderer(skeletonData, ownsSkeletonData);
	node->autorelease();
	return node;
}

SpineRenderer* SpineRenderer::createWithFile (const std::string& skeletonDataFile, spAtlas* atlas, float scale)
{
	SpineRenderer* node = new SpineRenderer(skeletonDataFile, atlas, scale);
	node->autorelease();
	return node;
}

SpineRenderer* SpineRenderer::createWithFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale)
{
	SpineRenderer* node = new SpineRenderer(skeletonDataFile, atlasFile, scale);
	node->autorelease();
	return node;
}

void SpineRenderer::initialize ()
{
    // SpineRenderer::initalize may be invoked twice, need to check whether _worldVertics is already allocated to avoid memory leak.
    if (_worldVertices == nullptr)
        _worldVertices = new float[1000]; // Max number of vertices per mesh.
    
    beginSchedule();
    
    if (_materialBuffer == nullptr)
    {
        _materialBuffer = new IOTypedArray(se::Object::TypedArrayType::UINT32, MAX_MATERIAL_BUFFER_SIZE);
    }
}

void SpineRenderer::beginSchedule()
{
    MiddlewareManager::getInstance()->addTimer(this);
}

void SpineRenderer::onEnable()
{
    beginSchedule();
}

void SpineRenderer::onDisable()
{
    stopSchedule();
}

void SpineRenderer::stopSchedule()
{
    MiddlewareManager::getInstance()->removeTimer(this);
}

void SpineRenderer::setSkeletonData (spSkeletonData *skeletonData, bool ownsSkeletonData)
{
	_skeleton = spSkeleton_create(skeletonData);
	_ownsSkeletonData = ownsSkeletonData;
}

SpineRenderer::SpineRenderer ()
{
}

SpineRenderer::SpineRenderer (spSkeletonData *skeletonData, bool ownsSkeletonData)
{
	initWithData(skeletonData, ownsSkeletonData);
}

SpineRenderer::SpineRenderer (const std::string& skeletonDataFile, spAtlas* atlas, float scale)
{
	initWithJsonFile(skeletonDataFile, atlas, scale);
}

SpineRenderer::SpineRenderer (const std::string& skeletonDataFile, const std::string& atlasFile, float scale)
{
	initWithJsonFile(skeletonDataFile, atlasFile, scale);
}

SpineRenderer::~SpineRenderer ()
{
	if (_ownsSkeletonData) spSkeletonData_dispose(_skeleton->data);
	spSkeleton_dispose(_skeleton);
	if (_atlas) spAtlas_dispose(_atlas);
	if (_attachmentLoader) spAttachmentLoader_dispose(_attachmentLoader);
	delete [] _worldVertices;
    
    if (_materialBuffer)
    {
        delete _materialBuffer;
        _materialBuffer = nullptr;
    }
    
    if (_debugBuffer)
    {
        delete _debugBuffer;
        _debugBuffer = nullptr;
    }
    
    stopSchedule();
}

void SpineRenderer::initWithData (spSkeletonData* skeletonData, bool ownsSkeletonData)
{
	setSkeletonData(skeletonData, ownsSkeletonData);
	initialize();
}

void SpineRenderer::initWithJsonFile (const std::string& skeletonDataFile, spAtlas* atlas, float scale)
{
    _atlas = atlas;
	_attachmentLoader = SUPER(CreatorAttachmentLoader_create(_atlas));

	spSkeletonJson* json = spSkeletonJson_createWithLoader(_attachmentLoader);
	json->scale = scale;
	spSkeletonData* skeletonData = spSkeletonJson_readSkeletonDataFile(json, skeletonDataFile.c_str());
	CCASSERT(skeletonData, json->error ? json->error : "Error reading skeleton data.");
	spSkeletonJson_dispose(json);

	setSkeletonData(skeletonData, true);
	initialize();
}

void SpineRenderer::initWithJsonFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale)
{
	_atlas = spAtlas_createFromFile(atlasFile.c_str(), 0);
	CCASSERT(_atlas, "Error reading atlas file.");

	_attachmentLoader = SUPER(CreatorAttachmentLoader_create(_atlas));

	spSkeletonJson* json = spSkeletonJson_createWithLoader(_attachmentLoader);
	json->scale = scale;
	spSkeletonData* skeletonData = spSkeletonJson_readSkeletonDataFile(json, skeletonDataFile.c_str());
	CCASSERT(skeletonData, json->error ? json->error : "Error reading skeleton data file.");
	spSkeletonJson_dispose(json);

	setSkeletonData(skeletonData, true);
	initialize();
}
    
void SpineRenderer::initWithBinaryFile (const std::string& skeletonDataFile, spAtlas* atlas, float scale)
{
    _atlas = atlas;
    _attachmentLoader = SUPER(CreatorAttachmentLoader_create(_atlas));
    
    spSkeletonBinary* binary = spSkeletonBinary_createWithLoader(_attachmentLoader);
    binary->scale = scale;
    spSkeletonData* skeletonData = spSkeletonBinary_readSkeletonDataFile(binary, skeletonDataFile.c_str());
    CCASSERT(skeletonData, binary->error ? binary->error : "Error reading skeleton data file.");
    spSkeletonBinary_dispose(binary);
    
    setSkeletonData(skeletonData, true);
    initialize();
}

void SpineRenderer::initWithBinaryFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale)
{
    _atlas = spAtlas_createFromFile(atlasFile.c_str(), 0);
    CCASSERT(_atlas, "Error reading atlas file.");
    
    _attachmentLoader = SUPER(CreatorAttachmentLoader_create(_atlas));
    
    spSkeletonBinary* binary = spSkeletonBinary_createWithLoader(_attachmentLoader);
    binary->scale = scale;
    spSkeletonData* skeletonData = spSkeletonBinary_readSkeletonDataFile(binary, skeletonDataFile.c_str());
    CCASSERT(skeletonData, binary->error ? binary->error : "Error reading skeleton data file.");
    spSkeletonBinary_dispose(binary);
    
    setSkeletonData(skeletonData, true);
    initialize();
}

void SpineRenderer::update (float deltaTime)
{
    if (_paused) return;
    
    // avoid other place call update.
    auto mgr = MiddlewareManager::getInstance();
    if (!mgr->isUpdating) return;
    
	spSkeleton_update(_skeleton, deltaTime * _timeScale);
    
    _skeleton->r = _nodeColor.r / (float)255;
    _skeleton->g = _nodeColor.g / (float)255;
    _skeleton->b = _nodeColor.b / (float)255;
    _skeleton->a = _nodeColor.a / (float)255;
    
    Color4F color;
    AttachmentVertices* attachmentVertices = nullptr;
    middleware::IOBuffer& vb = mgr->vb;
    middleware::IOBuffer& ib = mgr->ib;
    
    int preBlendSrc = -1;
    int preBlendDst = -1;
    int preTextureIndex = -1;
    int curBlendSrc = -1;
    int curBlendDst = -1;
    int curTextureIndex = -1;
    
    int preISegWritePos = -1;
    int curISegLen = 0;
    
    int debugSlotsLen = 0;
    int materialLen = 0;
    
    _materialBuffer->reset();
    
    if (_debugSlots || _debugBones)
    {
        // If enable debug draw,then init debug buffer.
        if (_debugBuffer == nullptr)
        {
            _debugBuffer = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, MAX_DEBUG_BUFFER_SIZE);
        }
        _debugBuffer->reset();
        
        if (_debugSlots)
        {
            //reserved 4 bytes to save debug slots len
            _debugBuffer->writeUint32(0);
        }
    }
    
    //reserved space to save material len
    _materialBuffer->writeUint32(0);
    //reserved space to save index offset
    _materialBuffer->writeUint32((uint32_t)ib.getCurPos()/sizeof(unsigned short));
    
    for (int i = 0, n = _skeleton->slotsCount; i < n; ++i)
    {
        spSlot* slot = _skeleton->drawOrder[i];
        if (!slot->attachment) continue;
        
        switch (slot->attachment->type)
        {
            case SP_ATTACHMENT_REGION:
            {
                spRegionAttachment* attachment = (spRegionAttachment*)slot->attachment;
                spRegionAttachment_computeWorldVertices(attachment, slot->bone, _worldVertices);
                attachmentVertices = getAttachmentVertices(attachment);
                color.r = attachment->r;
                color.g = attachment->g;
                color.b = attachment->b;
                color.a = attachment->a;
                
                if(_debugSlots)
                {
                    _debugBuffer->writeFloat32(_worldVertices[0]);
                    _debugBuffer->writeFloat32(_worldVertices[1]);
                    _debugBuffer->writeFloat32(_worldVertices[2]);
                    _debugBuffer->writeFloat32(_worldVertices[3]);
                    _debugBuffer->writeFloat32(_worldVertices[4]);
                    _debugBuffer->writeFloat32(_worldVertices[5]);
                    _debugBuffer->writeFloat32(_worldVertices[6]);
                    _debugBuffer->writeFloat32(_worldVertices[7]);
                    debugSlotsLen+=8;
                }
                
                break;
            }
            case SP_ATTACHMENT_MESH:
            {
                spMeshAttachment* attachment = (spMeshAttachment*)slot->attachment;
                spMeshAttachment_computeWorldVertices(attachment, slot, _worldVertices);
                attachmentVertices = getAttachmentVertices(attachment);
                color.r = attachment->r;
                color.g = attachment->g;
                color.b = attachment->b;
                color.a = attachment->a;
                break;
            }
            default:
                continue;
        }
        
        switch (slot->data->blendMode)
        {
            case SP_BLEND_MODE_ADDITIVE:
                curBlendSrc = _premultipliedAlpha ? GL_ONE : GL_SRC_ALPHA;
                curBlendDst = GL_ONE;
                break;
            case SP_BLEND_MODE_MULTIPLY:
                curBlendSrc = GL_DST_COLOR;
                curBlendDst = GL_ONE_MINUS_SRC_ALPHA;
                break;
            case SP_BLEND_MODE_SCREEN:
                curBlendSrc = GL_ONE;
                curBlendDst = GL_ONE_MINUS_SRC_COLOR;
                break;
            default:
                curBlendSrc = _premultipliedAlpha ? GL_ONE : GL_SRC_ALPHA;
                curBlendDst = GL_ONE_MINUS_SRC_ALPHA;
        }
        
        curTextureIndex = attachmentVertices->_texture->getRealTextureIndex();
        // If texture or blendMode change,will change material.
        if (preTextureIndex != curTextureIndex || preBlendDst != curBlendDst || preBlendSrc != curBlendSrc)
        {
            if (preISegWritePos != -1)
            {
                _materialBuffer->writeUint32(preISegWritePos, curISegLen);
            }
            
            _materialBuffer->writeUint32(curTextureIndex);
            _materialBuffer->writeUint32(curBlendSrc);
            _materialBuffer->writeUint32(curBlendDst);
            
           //Reserve indice segamentation count.
            preISegWritePos = (int)_materialBuffer->getCurPos();
            _materialBuffer->writeUint32(0);
            
            preTextureIndex = curTextureIndex;
            preBlendDst = curBlendDst;
            preBlendSrc = curBlendSrc;
            
            // Clear index segmentation count,prepare to next segmentation.
            curISegLen = 0;
            materialLen++;
        }
        
        // Calculation vertex color.
        color.a *= _skeleton->a * slot->a * 255;
        float multiplier = _premultipliedAlpha ? color.a : 255;
        color.r *= _skeleton->r * slot->r * multiplier;
        color.g *= _skeleton->g * slot->g * multiplier;
        color.b *= _skeleton->b * slot->b * multiplier;
        
        for (int v = 0, w = 0, vn = attachmentVertices->_triangles->vertCount; v < vn; ++v, w += 2)
        {
            V2F_T2F_C4B* vertex = attachmentVertices->_triangles->verts + v;
            vertex->vertices.x = _worldVertices[w];
            vertex->vertices.y = _worldVertices[w + 1];
            vertex->colors.r = (GLubyte)color.r;
            vertex->colors.g = (GLubyte)color.g;
            vertex->colors.b = (GLubyte)color.b;
            vertex->colors.a = (GLubyte)color.a;
        }
        
        // Fill MiddlewareManager vertex buffer
        auto vertexOffset = vb.getCurPos()/sizeof(middleware::V2F_T2F_C4B);
		auto vbSize = attachmentVertices->_triangles->vertCount * sizeof(middleware::V2F_T2F_C4B);
		vb.checkSpace(vbSize, true);
        vb.writeBytes((char*)attachmentVertices->_triangles->verts, vbSize);
        
		auto ibSize = attachmentVertices->_triangles->indexCount * sizeof(unsigned short);
		ib.checkSpace(ibSize, true);
        if (vertexOffset > 0)
        {
            for (int ii = 0, nn = attachmentVertices->_triangles->indexCount; ii < nn; ii++)
            {
                ib.writeUint16(attachmentVertices->_triangles->indices[ii] + vertexOffset);
            }
        }
        else
        {
            ib.writeBytes((char*)attachmentVertices->_triangles->indices, ibSize);
        }
        
        // Record this turn index segmentation count,it will store in material buffer in the end.
        curISegLen += attachmentVertices->_triangles->indexCount;
    }
    
    if (_debugSlots)
    {
        _debugBuffer->writeFloat32(0, debugSlotsLen);
    }
    
    bool isVBOutRange = vb.isOutRange();
    bool isIBOutRange = ib.isOutRange();
    bool isMatOutRange = _materialBuffer->isOutRange();
    
    // If vertex buffer or index buffer or material buffer out of range,then discard this time render
    // next time will enlarge vertex buffer or index buffer to fill the animation data.
    if (isVBOutRange || isIBOutRange || isMatOutRange)
    {
        _materialBuffer->writeUint32(0, 0);
    }
    else
    {
        _materialBuffer->writeUint32(0, materialLen);
        
        if (preISegWritePos != -1)
        {
            _materialBuffer->writeUint32(preISegWritePos, curISegLen);
        }
    }
    
    // If material buffer is out of range,it will no enlarge automatically,because the size which is 512 bytes is
    // enough large,exceed the size means call gl draw function too many times,you better to optimize resource.
    if (isMatOutRange)
    {
        cocos2d::log("Spine material data is too large,buffer has no space to put in it!!!!!!!!!!");
        cocos2d::log("You can adjust MAX_MATERIAL_BUFFER_SIZE in Macro");
        cocos2d::log("But It's better to optimize resource to avoid large material.Because it can advance performance");
    }
    
    if (_debugBones)
    {
        _debugBuffer->writeFloat32(_skeleton->bonesCount*4);
        for (int i = 0, n = _skeleton->bonesCount; i < n; i++)
        {
            spBone *bone = _skeleton->bones[i];
            float x = bone->data->length * bone->a + bone->worldX;
            float y = bone->data->length * bone->c + bone->worldY;
            _debugBuffer->writeFloat32(bone->worldX);
            _debugBuffer->writeFloat32(bone->worldY);
            _debugBuffer->writeFloat32(x);
            _debugBuffer->writeFloat32(y);
        }
    }
    
    if ((_debugSlots || _debugBones) &&  _debugBuffer->isOutRange())
    {
        _debugBuffer->writeFloat32(0, 0);
        _debugBuffer->writeFloat32(sizeof(float), 0);
        cocos2d::log("Spine debug data is too large,debug buffer has no space to put in it!!!!!!!!!!");
        cocos2d::log("You can adjust MAX_DEBUG_BUFFER_SIZE in Macro");
    }
}

AttachmentVertices* SpineRenderer::getAttachmentVertices (spRegionAttachment* attachment) const
{
    return (AttachmentVertices*)attachment->rendererObject;
}

AttachmentVertices* SpineRenderer::getAttachmentVertices (spMeshAttachment* attachment) const
{
    return (AttachmentVertices*)attachment->rendererObject;
}

void SpineRenderer::updateWorldTransform ()
{
	spSkeleton_updateWorldTransform(_skeleton);
}

void SpineRenderer::setToSetupPose ()
{
	spSkeleton_setToSetupPose(_skeleton);
}

void SpineRenderer::setBonesToSetupPose ()
{
	spSkeleton_setBonesToSetupPose(_skeleton);
}

void SpineRenderer::setSlotsToSetupPose ()
{
	spSkeleton_setSlotsToSetupPose(_skeleton);
}

spBone* SpineRenderer::findBone (const std::string& boneName) const
{
	return spSkeleton_findBone(_skeleton, boneName.c_str());
}

spSlot* SpineRenderer::findSlot (const std::string& slotName) const
{
	return spSkeleton_findSlot(_skeleton, slotName.c_str());
}

bool SpineRenderer::setSkin (const std::string& skinName)
{
	return spSkeleton_setSkinByName(_skeleton, skinName.empty() ? 0 : skinName.c_str()) ? true : false;
}

bool SpineRenderer::setSkin (const char* skinName)
{
	return spSkeleton_setSkinByName(_skeleton, skinName) ? true : false;
}

spAttachment* SpineRenderer::getAttachment (const std::string& slotName, const std::string& attachmentName) const
{
	return spSkeleton_getAttachmentForSlotName(_skeleton, slotName.c_str(), attachmentName.c_str());
}

bool SpineRenderer::setAttachment (const std::string& slotName, const std::string& attachmentName)
{
	return spSkeleton_setAttachment(_skeleton, slotName.c_str(), attachmentName.empty() ? 0 : attachmentName.c_str()) ? true : false;
}

bool SpineRenderer::setAttachment (const std::string& slotName, const char* attachmentName)
{
	return spSkeleton_setAttachment(_skeleton, slotName.c_str(), attachmentName) ? true : false;
}

spSkeleton* SpineRenderer::getSkeleton () const
{
	return _skeleton;
}

void SpineRenderer::setTimeScale (float scale)
{
	_timeScale = scale;
}

float SpineRenderer::getTimeScale () const
{
	return _timeScale;
}

void SpineRenderer::paused(bool value)
{
    _paused = value;
}

void SpineRenderer::setColor (cocos2d::Color4B& color)
{
    _nodeColor = color;
}

void SpineRenderer::setDebugBonesEnabled (bool enabled)
{
    _debugBones = enabled;
}

void SpineRenderer::setDebugSlotsEnabled (bool enabled)
{
    _debugSlots = enabled;
}
    
void SpineRenderer::setOpacityModifyRGB (bool value)
{
    _premultipliedAlpha = value;
}

bool SpineRenderer::isOpacityModifyRGB () const
{
    return _premultipliedAlpha;
}
