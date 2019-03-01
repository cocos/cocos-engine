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
#include "MeshBuffer.h"

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

SpineRenderer* SpineRenderer::createWithSkeleton(spSkeleton* skeleton, bool ownsSkeleton, bool ownsSkeletonData)
{
    SpineRenderer* node = new SpineRenderer(skeleton, ownsSkeleton, ownsSkeletonData);
    node->autorelease();
    return node;
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
    if (_clipper == nullptr)
    {
        _clipper = spSkeletonClipping_create();
    }
    
    if (_materialBuffer == nullptr)
    {
        _materialBuffer = new IOTypedArray(se::Object::TypedArrayType::UINT32, MAX_MATERIAL_BUFFER_SIZE);
    }
    
    beginSchedule();
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
    if (_materialBuffer)
    {
        _materialBuffer->reset();
        _materialBuffer->writeUint32(0, 0);
    }
    
    if (_debugBuffer)
    {
        _debugBuffer->reset();
        _debugBuffer->writeFloat32(0, 0);
    }
}

void SpineRenderer::setSkeletonData (spSkeletonData *skeletonData, bool ownsSkeletonData)
{
	_skeleton = spSkeleton_create(skeletonData);
	_ownsSkeletonData = ownsSkeletonData;
}

SpineRenderer::SpineRenderer ()
{
}

SpineRenderer::SpineRenderer(spSkeleton* skeleton, bool ownsSkeleton, bool ownsSkeletonData)
{
    initWithSkeleton(skeleton, ownsSkeleton, ownsSkeletonData);
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
	if (_ownsSkeleton) spSkeleton_dispose(_skeleton);
	if (_atlas) spAtlas_dispose(_atlas);
	if (_attachmentLoader) spAttachmentLoader_dispose(_attachmentLoader);
	if (_clipper) spSkeletonClipping_dispose(_clipper);
    
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

void SpineRenderer::initWithSkeleton(spSkeleton* skeleton, bool ownsSkeleton, bool ownsSkeletonData) 
{
    _skeleton = skeleton;
    _ownsSkeleton = ownsSkeleton;
    _ownsSkeletonData = ownsSkeletonData;
    
    initialize();
}

void SpineRenderer::initWithData (spSkeletonData* skeletonData, bool ownsSkeletonData)
{
    _ownsSkeleton = true;
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
    _ownsSkeleton = true;
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
    _ownsSkeleton = true;
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
    _ownsSkeleton = true;
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
    _ownsSkeleton = true;
    setSkeletonData(skeletonData, true);
    initialize();
}

void SpineRenderer::update (float deltaTime)
{
    // avoid other place call update.
    auto mgr = MiddlewareManager::getInstance();
    if (!mgr->isUpdating) return;
    
    Color4F nodeColor;
    nodeColor.r = _nodeColor.r / (float)255;
    nodeColor.g = _nodeColor.g / (float)255;
    nodeColor.b = _nodeColor.b / (float)255;
    nodeColor.a = _nodeColor.a / (float)255;
    
    _materialBuffer->reset();
    // If opacity is 0,then return.
    if (_skeleton->color.a == 0) 
    {
        _materialBuffer->writeUint32(0, 0);
        return;
    }
    
    Color4F color;
    Color4F darkColor;
    AttachmentVertices* attachmentVertices = nullptr;
    bool inRange = _startSlotIndex != -1 || _endSlotIndex != -1 ? false : true;
    auto vertexFormat = _useTint? VF_XYUVCC : VF_XYUVC;
    MeshBuffer* mb = mgr->getMeshBuffer(vertexFormat);
    middleware::IOBuffer& vb = mb->getVB();
    middleware::IOBuffer& ib = mb->getIB();
    
    // vertex size in floats with one color
    int vs1 = sizeof(V2F_T2F_C4B) / sizeof(float);
    // verex size in floats with two color
    int vs2 = sizeof(V2F_T2F_C4B_C4B) / sizeof(float);
    
    int vbSize = 0;
    int ibSize = 0;
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
    int isFull = 0;
    
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
        // Reset isFull flag.
        isFull = 0;
        spSlot* slot = _skeleton->drawOrder[i];
        if (_startSlotIndex >= 0 && _startSlotIndex == slot->data->index)
        {
            inRange = true;
        }
        
        if (!inRange) {
            spSkeletonClipping_clipEnd(_clipper, slot);
            continue;
        }
        
        if (_endSlotIndex >= 0 && _endSlotIndex == slot->data->index)
        {
            inRange = false;
        }
        
        if (!slot->attachment)
        {
            spSkeletonClipping_clipEnd(_clipper, slot);
            continue;
        }
        
        // Early exit if slot is invisible
        if (slot->color.a == 0)
        {
            spSkeletonClipping_clipEnd(_clipper, slot);
            continue;
        }
        
        if (!slot->attachment)
        {
            continue;
        }
        
        Triangles triangles;
        TwoColorTriangles trianglesTwoColor;
        
        switch (slot->attachment->type)
        {
            case SP_ATTACHMENT_REGION:
            {
                spRegionAttachment* attachment = (spRegionAttachment*)slot->attachment;
                attachmentVertices = getAttachmentVertices(attachment);

                // Early exit if attachment is invisible
                if (attachment->color.a == 0)
                {
                    spSkeletonClipping_clipEnd(_clipper, slot);
                    continue;
                }

                if (!_useTint)
                {
                    triangles.indexCount = attachmentVertices->_triangles->indexCount;
                    ibSize = triangles.indexCount * sizeof(unsigned short);
                    ib.checkSpace(ibSize);
                    triangles.indices = (unsigned short*)ib.getCurBuffer();
                    memcpy(triangles.indices, attachmentVertices->_triangles->indices, ibSize);
                    
                    triangles.vertCount = attachmentVertices->_triangles->vertCount;
                    vbSize = triangles.vertCount * sizeof(V2F_T2F_C4B);
                    isFull |= vb.checkSpace(vbSize);
                    triangles.verts = (V2F_T2F_C4B*)vb.getCurBuffer();
                    memcpy(triangles.verts, attachmentVertices->_triangles->verts, vbSize);
                    spRegionAttachment_computeWorldVertices(attachment, slot->bone, (float*)triangles.verts, 0, vs1);
                    
                }
                else
                {
                    trianglesTwoColor.indexCount = attachmentVertices->_triangles->indexCount;
                    ibSize = trianglesTwoColor.indexCount * sizeof(unsigned short);
                    ib.checkSpace(ibSize);
                    trianglesTwoColor.indices = (unsigned short*)ib.getCurBuffer();
                    memcpy(trianglesTwoColor.indices, attachmentVertices->_triangles->indices, ibSize);
                    
                    trianglesTwoColor.vertCount = attachmentVertices->_triangles->vertCount;
                    vbSize = trianglesTwoColor.vertCount * sizeof(V2F_T2F_C4B_C4B);
                    isFull |= vb.checkSpace(vbSize);
                    trianglesTwoColor.verts = (V2F_T2F_C4B_C4B*)vb.getCurBuffer();
                    for (int ii = 0; ii < trianglesTwoColor.vertCount; ii++)
                    {
                        trianglesTwoColor.verts[ii].texCoord = attachmentVertices->_triangles->verts[ii].texCoord;
                    }
                    spRegionAttachment_computeWorldVertices(attachment, slot->bone, (float*)trianglesTwoColor.verts, 0, vs2);
                }

                color.r = attachment->color.r;
                color.g = attachment->color.g;
                color.b = attachment->color.b;
                color.a = attachment->color.a;
                
                if(_debugSlots)
                {
                    float* vertices = _useTint ? (float*)trianglesTwoColor.verts : (float*)triangles.verts;
                    int stride = _useTint ? vs2 : vs1;
                    // Quadrangle has 4 vertex.
                    for (int ii = 0; ii < 4; ii ++)
                    {
                        _debugBuffer->writeFloat32(vertices[0]);
                        _debugBuffer->writeFloat32(vertices[1]);
                        vertices += stride;
                    }
                    debugSlotsLen+=8;
                }
                
                break;
            }
            case SP_ATTACHMENT_MESH:
            {
                spMeshAttachment* attachment = (spMeshAttachment*)slot->attachment;
                attachmentVertices = getAttachmentVertices(attachment);
                
                // Early exit if attachment is invisible
                if (attachment->color.a == 0)
                {
                    spSkeletonClipping_clipEnd(_clipper, slot);
                    continue;
                }
                
                if (!_useTint)
                {
                    triangles.indexCount = attachmentVertices->_triangles->indexCount;
                    ibSize = triangles.indexCount * sizeof(unsigned short);
                    ib.checkSpace(ibSize);
                    triangles.indices = (unsigned short*)ib.getCurBuffer();
                    memcpy(triangles.indices, attachmentVertices->_triangles->indices, ibSize);
                    
                    triangles.vertCount = attachmentVertices->_triangles->vertCount;
                    vbSize = triangles.vertCount * sizeof(V2F_T2F_C4B);
                    isFull |= vb.checkSpace(vbSize);
                    triangles.verts = (V2F_T2F_C4B*)vb.getCurBuffer();
                    memcpy(triangles.verts, attachmentVertices->_triangles->verts, vbSize);
                    spVertexAttachment_computeWorldVertices(SUPER(attachment), slot, 0, attachment->super.worldVerticesLength, (float*)triangles.verts, 0, vs1);
                    
                }
                else
                {
                    trianglesTwoColor.indexCount = attachmentVertices->_triangles->indexCount;
                    ibSize = trianglesTwoColor.indexCount * sizeof(unsigned short);
                    ib.checkSpace(ibSize);
                    trianglesTwoColor.indices = (unsigned short*)ib.getCurBuffer();
                    memcpy(trianglesTwoColor.indices, attachmentVertices->_triangles->indices, ibSize);
                    
                    trianglesTwoColor.vertCount = attachmentVertices->_triangles->vertCount;
                    vbSize = trianglesTwoColor.vertCount * sizeof(V2F_T2F_C4B_C4B);
                    isFull |= vb.checkSpace(vbSize);
                    trianglesTwoColor.verts = (V2F_T2F_C4B_C4B*)vb.getCurBuffer();
                    for (int ii = 0; ii < trianglesTwoColor.vertCount; ii++)
                    {
                        trianglesTwoColor.verts[ii].texCoord = attachmentVertices->_triangles->verts[ii].texCoord;
                    }
                    spVertexAttachment_computeWorldVertices(SUPER(attachment), slot, 0, attachment->super.worldVerticesLength, (float*)trianglesTwoColor.verts, 0, vs2);
                }
                
                color.r = attachment->color.r;
                color.g = attachment->color.g;
                color.b = attachment->color.b;
                color.a = attachment->color.a;
                break;
            }
            case SP_ATTACHMENT_CLIPPING:
            {
                spClippingAttachment* clip = (spClippingAttachment*)slot->attachment;
                spSkeletonClipping_clipStart(_clipper, slot, clip);
                continue;
            }
            default:
                spSkeletonClipping_clipEnd(_clipper, slot);
                continue;
        }
        
        float alpha = _skeleton->color.a * slot->color.a * color.a * 255;
        // skip rendering if the color of this attachment is 0
        if (alpha == 0)
        {
            spSkeletonClipping_clipEnd(_clipper, slot);
            continue;
        }
        float multiplier = _premultipliedAlpha ? alpha : 255;
        
        float red = nodeColor.r * _skeleton->color.r * color.r * multiplier;
        float green = nodeColor.g * _skeleton->color.g * color.g * multiplier;
        float blue = nodeColor.b * _skeleton->color.b * color.b * multiplier;
        
        color.r = red * slot->color.r;
        color.g = green * slot->color.g;
        color.b = blue * slot->color.b;
        color.a = alpha * nodeColor.a;
        
        if (slot->darkColor)
        {
            darkColor.r = red * slot->darkColor->r;
            darkColor.g = green * slot->darkColor->g;
            darkColor.b = blue * slot->darkColor->b;
        }
        else
        {
            darkColor.r = 0;
            darkColor.g = 0;
            darkColor.b = 0;
        }
        darkColor.a = _premultipliedAlpha ? 255 : 0;
        
        // One color tint logic
        if (!_useTint)
        {
            // Cliping logic
            if (spSkeletonClipping_isClipping(_clipper))
            {
                spSkeletonClipping_clipTriangles(_clipper, (float*)&triangles.verts[0].vertex, triangles.vertCount * vs1, triangles.indices, triangles.indexCount, (float*)&triangles.verts[0].texCoord, vs1);
                
                if (_clipper->clippedTriangles->size == 0)
                {
                    spSkeletonClipping_clipEnd(_clipper, slot);
                    continue;
                }
                
                triangles.vertCount = _clipper->clippedVertices->size >> 1;
                vbSize = triangles.vertCount * sizeof(V2F_T2F_C4B);
                isFull |= vb.checkSpace(vbSize);
                triangles.verts = (V2F_T2F_C4B*)vb.getCurBuffer();
                
                triangles.indexCount = _clipper->clippedTriangles->size;
                ibSize = triangles.indexCount * sizeof(unsigned short);
                ib.checkSpace(ibSize);
                triangles.indices = (unsigned short*)ib.getCurBuffer();
                memcpy(triangles.indices, _clipper->clippedTriangles->items, sizeof(unsigned short) * _clipper->clippedTriangles->size);
                
                float* verts = _clipper->clippedVertices->items;
                float* uvs = _clipper->clippedUVs->items;
                for (int v = 0, vn = triangles.vertCount, vv = 0; v < vn; ++v, vv+=2)
                {
                    V2F_T2F_C4B* vertex = triangles.verts + v;
                    vertex->vertex.x = verts[vv];
                    vertex->vertex.y = verts[vv + 1];
                    vertex->texCoord.u = uvs[vv];
                    vertex->texCoord.v = uvs[vv + 1];
                    vertex->color.r = (GLubyte)color.r;
                    vertex->color.g = (GLubyte)color.g;
                    vertex->color.b = (GLubyte)color.b;
                    vertex->color.a = (GLubyte)color.a;
                }
            // No cliping logic
            }
            else
            {
                for (int v = 0, vn = triangles.vertCount; v < vn; ++v)
                {
                    V2F_T2F_C4B* vertex = triangles.verts + v;
                    vertex->color.r = (GLubyte)color.r;
                    vertex->color.g = (GLubyte)color.g;
                    vertex->color.b = (GLubyte)color.b;
                    vertex->color.a = (GLubyte)color.a;
                }
            }
        }
        // Two color tint logic
        else
        {
            if (spSkeletonClipping_isClipping(_clipper))
            {
                spSkeletonClipping_clipTriangles(_clipper, (float*)&trianglesTwoColor.verts[0].vertex, trianglesTwoColor.vertCount * vs2, trianglesTwoColor.indices, trianglesTwoColor.indexCount, (float*)&trianglesTwoColor.verts[0].texCoord, vs2);
                
                if (_clipper->clippedTriangles->size == 0)
                {
                    spSkeletonClipping_clipEnd(_clipper, slot);
                    continue;
                }
                
                trianglesTwoColor.vertCount = _clipper->clippedVertices->size >> 1;
                vbSize = trianglesTwoColor.vertCount * sizeof(V2F_T2F_C4B_C4B);
                isFull |= vb.checkSpace(vbSize);
                trianglesTwoColor.verts = (V2F_T2F_C4B_C4B*)vb.getCurBuffer();
                
                trianglesTwoColor.indexCount = _clipper->clippedTriangles->size;
                ibSize = trianglesTwoColor.indexCount * sizeof(unsigned short);
                trianglesTwoColor.indices = (unsigned short*)ib.getCurBuffer();
                memcpy(trianglesTwoColor.indices, _clipper->clippedTriangles->items, sizeof(unsigned short) * _clipper->clippedTriangles->size);
                
                float* verts = _clipper->clippedVertices->items;
                float* uvs = _clipper->clippedUVs->items;
                
                for (int v = 0, vn = trianglesTwoColor.vertCount, vv = 0; v < vn; ++v, vv += 2)
                {
                    V2F_T2F_C4B_C4B* vertex = trianglesTwoColor.verts + v;
                    vertex->vertex.x = verts[vv];
                    vertex->vertex.y = verts[vv + 1];
                    vertex->texCoord.u = uvs[vv];
                    vertex->texCoord.v = uvs[vv + 1];
                    vertex->color.r = (GLubyte)color.r;
                    vertex->color.g = (GLubyte)color.g;
                    vertex->color.b = (GLubyte)color.b;
                    vertex->color.a = (GLubyte)color.a;
                    vertex->color2.r = (GLubyte)darkColor.r;
                    vertex->color2.g = (GLubyte)darkColor.g;
                    vertex->color2.b = (GLubyte)darkColor.b;
                    vertex->color2.a = (GLubyte)darkColor.a;
                }
                
            }
            else
            {
                for (int v = 0, vn = trianglesTwoColor.vertCount; v < vn; ++v)
                {
                    V2F_T2F_C4B_C4B* vertex = trianglesTwoColor.verts + v;
                    vertex->color.r = (GLubyte)color.r;
                    vertex->color.g = (GLubyte)color.g;
                    vertex->color.b = (GLubyte)color.b;
                    vertex->color.a = (GLubyte)color.a;
                    vertex->color2.r = (GLubyte)darkColor.r;
                    vertex->color2.g = (GLubyte)darkColor.g;
                    vertex->color2.b = (GLubyte)darkColor.b;
                    vertex->color2.a = (GLubyte)darkColor.a;
                }
            }
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
        if (preTextureIndex != curTextureIndex || preBlendDst != curBlendDst || preBlendSrc != curBlendSrc || isFull)
        {
            if (preISegWritePos != -1)
            {
                _materialBuffer->writeUint32(preISegWritePos, curISegLen);
            }
            
            _materialBuffer->writeUint32(curTextureIndex);
            _materialBuffer->writeUint32(curBlendSrc);
            _materialBuffer->writeUint32(curBlendDst);
            auto glIB = mb->getGLIB();
            auto glVB = mb->getGLVB();
            _materialBuffer->writeUint32(glIB);
            _materialBuffer->writeUint32(glVB);
            
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
        
        if (vbSize > 0 && ibSize > 0)
        {
            auto vertexOffset = vb.getCurPos() / sizeof(middleware::V2F_T2F_C4B);
            if (_useTint)
            {
                vertexOffset = vb.getCurPos() / sizeof(middleware::V2F_T2F_C4B_C4B);
            }
            
            if (vertexOffset > 0)
            {
                unsigned short* ibBuffer = (unsigned short*)ib.getCurBuffer();
                for (int ii = 0, nn = ibSize / sizeof(unsigned short); ii < nn; ii++)
                {
                    ibBuffer[ii] += vertexOffset;
                }
            }
            vb.move(vbSize);
            ib.move(ibSize);
            
            // Record this turn index segmentation count,it will store in material buffer in the end.
            curISegLen += ibSize / sizeof(unsigned short);
        }
        
        spSkeletonClipping_clipEnd(_clipper, slot);
    } // End slot traverse
    
    spSkeletonClipping_clipEnd2(_clipper);
    
    if (_debugSlots)
    {
        _debugBuffer->writeFloat32(0, debugSlotsLen);
    }
    
    bool isMatOutRange = _materialBuffer->isOutRange();
    
    // If vertex buffer or index buffer or material buffer out of range,then discard this time render
    // next time will enlarge vertex buffer or index buffer to fill the animation data.
    if (isMatOutRange)
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

void SpineRenderer::setUseTint(bool enabled) {
    _useTint = enabled;
}

void SpineRenderer::setSlotsRange(int startSlotIndex, int endSlotIndex)
{
    this->_startSlotIndex = startSlotIndex;
    this->_endSlotIndex = endSlotIndex;
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
