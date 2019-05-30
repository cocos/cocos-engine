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

#include "spine-creator-support/SkeletonRenderer.h"
#include "spine-creator-support/AttachmentVertices.h"
#include "spine-creator-support/spine-cocos2dx.h"
#include <algorithm>
#include "platform/CCApplication.h"
#include "base/CCScheduler.h"
#include "MiddlewareMacro.h"
#include "MeshBuffer.h"
#include "SkeletonDataMgr.h"
#include "RenderInfoMgr.h"

USING_NS_CC;
USING_NS_MW;

using std::min;
using std::max;
using namespace spine;

static Cocos2dTextureLoader textureLoader;

enum DebugType {
    None = 0,
    Slots,
    Mesh,
    Bones
};

SkeletonRenderer* SkeletonRenderer::create () {
    SkeletonRenderer* skeleton = new SkeletonRenderer();
    skeleton->autorelease();
    return skeleton;
}

SkeletonRenderer* SkeletonRenderer::createWithSkeleton(Skeleton* skeleton, bool ownsSkeleton, bool ownsSkeletonData) {
    SkeletonRenderer* node = new SkeletonRenderer(skeleton, ownsSkeleton, ownsSkeletonData);
    node->autorelease();
    return node;
}

SkeletonRenderer* SkeletonRenderer::createWithData (SkeletonData* skeletonData, bool ownsSkeletonData) {
    SkeletonRenderer* node = new SkeletonRenderer(skeletonData, ownsSkeletonData);
    node->autorelease();
    return node;
}

SkeletonRenderer* SkeletonRenderer::createWithFile (const std::string& skeletonDataFile, Atlas* atlas, float scale) {
    SkeletonRenderer* node = new SkeletonRenderer(skeletonDataFile, atlas, scale);
    node->autorelease();
    return node;
}

SkeletonRenderer* SkeletonRenderer::createWithFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale) {
    SkeletonRenderer* node = new SkeletonRenderer(skeletonDataFile, atlasFile, scale);
    node->autorelease();
    return node;
}

void SkeletonRenderer::initialize () {
    if (_clipper == nullptr) {
        _clipper = new (__FILE__, __LINE__) SkeletonClipping();
    }
    
    if (_renderInfoOffset == nullptr) {
        // store global TypedArray begin and end offset
        _renderInfoOffset = new IOTypedArray(se::Object::TypedArrayType::UINT32, sizeof(uint32_t));
    }
    
    _skeleton->setToSetupPose();
    _skeleton->updateWorldTransform();
    beginSchedule();
}

void SkeletonRenderer::beginSchedule() {
    MiddlewareManager::getInstance()->addTimer(this);
}

void SkeletonRenderer::onEnable() {
    beginSchedule();
}

void SkeletonRenderer::onDisable() {
    stopSchedule();
}

void SkeletonRenderer::stopSchedule() {
    MiddlewareManager::getInstance()->removeTimer(this);
    if (_renderInfoOffset) {
        _renderInfoOffset->reset();
        _renderInfoOffset->clear();
    }
    
    if (_debugBuffer) {
        _debugBuffer->reset();
        _debugBuffer->clear();
    }
}

void SkeletonRenderer::setSkeletonData (SkeletonData *skeletonData, bool ownsSkeletonData) {
    _skeleton = new (__FILE__, __LINE__) Skeleton(skeletonData);
    _ownsSkeletonData = ownsSkeletonData;
}

SkeletonRenderer::SkeletonRenderer () {
}

SkeletonRenderer::SkeletonRenderer(Skeleton* skeleton, bool ownsSkeleton, bool ownsSkeletonData, bool ownsAtlas) {
    initWithSkeleton(skeleton, ownsSkeleton, ownsSkeletonData, ownsAtlas);
}

SkeletonRenderer::SkeletonRenderer (SkeletonData *skeletonData, bool ownsSkeletonData) {
    initWithData(skeletonData, ownsSkeletonData);
}

SkeletonRenderer::SkeletonRenderer (const std::string& skeletonDataFile, Atlas* atlas, float scale) {
    initWithJsonFile(skeletonDataFile, atlas, scale);
}

SkeletonRenderer::SkeletonRenderer (const std::string& skeletonDataFile, const std::string& atlasFile, float scale) {
    initWithJsonFile(skeletonDataFile, atlasFile, scale);
}

SkeletonRenderer::~SkeletonRenderer () {
    CC_SAFE_RELEASE(_effectDelegate);
    
    if (_ownsSkeletonData) delete _skeleton->getData();
    if (_ownsSkeleton) delete _skeleton;
    if (_ownsAtlas && _atlas) delete _atlas;
    if (_attachmentLoader) delete _attachmentLoader;
    if (_uuid != "") SkeletonDataMgr::getInstance()->releaseByUUID(_uuid);
    if (_clipper) delete _clipper;
    
    if (_renderInfoOffset) {
        delete _renderInfoOffset;
        _renderInfoOffset = nullptr;
    }
    
    if (_debugBuffer) {
        delete _debugBuffer;
        _debugBuffer = nullptr;
    }
    
    stopSchedule();
}

void SkeletonRenderer::initWithUUID(const std::string& uuid) {
    _ownsSkeleton = true;
    _uuid = uuid;
    SkeletonData* skeletonData = SkeletonDataMgr::getInstance()->retainByUUID(uuid);
    CCASSERT(skeletonData, "Skeleton data is is null");
    
    setSkeletonData(skeletonData, false);
    initialize();
}

void SkeletonRenderer::initWithSkeleton(Skeleton* skeleton, bool ownsSkeleton, bool ownsSkeletonData, bool ownsAtlas) {
    _skeleton = skeleton;
    _ownsSkeleton = ownsSkeleton;
    _ownsSkeletonData = ownsSkeletonData;
    _ownsAtlas = ownsAtlas;

    initialize();
}

void SkeletonRenderer::initWithData (SkeletonData* skeletonData, bool ownsSkeletonData) {
    _ownsSkeleton = true;
    setSkeletonData(skeletonData, ownsSkeletonData);
    initialize();
}

void SkeletonRenderer::initWithJsonFile (const std::string& skeletonDataFile, Atlas* atlas, float scale) {
    _atlas = atlas;
    _attachmentLoader = new (__FILE__, __LINE__) Cocos2dAtlasAttachmentLoader(_atlas);

    SkeletonJson* json = new (__FILE__, __LINE__) SkeletonJson(_attachmentLoader);
    json->setScale(scale);
    SkeletonData* skeletonData = json->readSkeletonDataFile(skeletonDataFile.c_str());
    CCASSERT(skeletonData, !json->getError().isEmpty() ? json->getError().buffer() : "Error reading skeleton data.");
    delete json;

    _ownsSkeleton = true;
    setSkeletonData(skeletonData, true);

    initialize();
}

void SkeletonRenderer::initWithJsonFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale) {
    _atlas = new (__FILE__, __LINE__) Atlas(atlasFile.c_str(), &textureLoader);
    CCASSERT(_atlas, "Error reading atlas file.");

    _attachmentLoader = new (__FILE__, __LINE__) Cocos2dAtlasAttachmentLoader(_atlas);

    SkeletonJson* json = new (__FILE__, __LINE__) SkeletonJson(_attachmentLoader);
    json->setScale(scale);
    SkeletonData* skeletonData = json->readSkeletonDataFile(skeletonDataFile.c_str());
    CCASSERT(skeletonData, !json->getError().isEmpty() ? json->getError().buffer() : "Error reading skeleton data.");
    delete json;

    _ownsSkeleton = true;
    _ownsAtlas = true;
    setSkeletonData(skeletonData, true);

    initialize();
}
    
void SkeletonRenderer::initWithBinaryFile (const std::string& skeletonDataFile, Atlas* atlas, float scale) {
    _atlas = atlas;
    _attachmentLoader = new (__FILE__, __LINE__) Cocos2dAtlasAttachmentLoader(_atlas);
    
    SkeletonBinary* binary = new (__FILE__, __LINE__) SkeletonBinary(_attachmentLoader);
    binary->setScale(scale);
    SkeletonData* skeletonData = binary->readSkeletonDataFile(skeletonDataFile.c_str());
    CCASSERT(skeletonData, !binary->getError().isEmpty() ? binary->getError().buffer() : "Error reading skeleton data.");
    delete binary;
    _ownsSkeleton = true;
    setSkeletonData(skeletonData, true);
    
    initialize();
}

void SkeletonRenderer::initWithBinaryFile (const std::string& skeletonDataFile, const std::string& atlasFile, float scale) {
    _atlas = new (__FILE__, __LINE__) Atlas(atlasFile.c_str(), &textureLoader);
    CCASSERT(_atlas, "Error reading atlas file.");
    
    _attachmentLoader = new (__FILE__, __LINE__) Cocos2dAtlasAttachmentLoader(_atlas);
    
    SkeletonBinary* binary = new (__FILE__, __LINE__) SkeletonBinary(_attachmentLoader);
    binary->setScale(scale);
    SkeletonData* skeletonData = binary->readSkeletonDataFile(skeletonDataFile.c_str());
    CCASSERT(skeletonData, !binary->getError().isEmpty() ? binary->getError().buffer() : "Error reading skeleton data.");
    delete binary;
    _ownsSkeleton = true;
    _ownsAtlas = true;
    setSkeletonData(skeletonData, true);
    
    initialize();
}

void SkeletonRenderer::update (float deltaTime) {
    
    if (!_skeleton) return;

    _renderInfoOffset->reset();
    _renderInfoOffset->clear();
    // avoid other place call update.
    auto mgr = MiddlewareManager::getInstance();
    if (!mgr->isUpdating) return;
    
    auto renderMgr = RenderInfoMgr::getInstance();
    auto renderInfo = renderMgr->getBuffer();
    if (!renderInfo) return;
    
    //  store renderInfo offset
    _renderInfoOffset->writeUint32((uint32_t)renderInfo->getCurPos() / sizeof(uint32_t));
    
    // check enough space
    renderInfo->checkSpace(sizeof(uint32_t) * 2, true);
    // write border
    renderInfo->writeUint32(0xffffffff);
    
    std::size_t materialLenOffset = renderInfo->getCurPos();
    //reserved space to save material len
    renderInfo->writeUint32(0);
    
    // If opacity is 0,then return.
    if (_skeleton->getColor().a == 0) {
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
    
    int preTextureIndex = -1;
    int preBlendMode = -1;
    int curBlendSrc = -1;
    int curBlendDst = -1;
    int curTextureIndex = -1;
    
    int preISegWritePos = -1;
    int curISegLen = 0;
    
    int materialLen = 0;
    Slot* slot = nullptr;
    int isFull = 0;
    
    if (_debugSlots || _debugBones || _debugMesh) {
        // If enable debug draw,then init debug buffer.
        if (_debugBuffer == nullptr) {
            _debugBuffer = new IOTypedArray(se::Object::TypedArrayType::FLOAT32, MAX_DEBUG_BUFFER_SIZE);
        }
        _debugBuffer->reset();
    }
    
    auto flush = [&]() {
        // fill pre segment count field
        if (preISegWritePos != -1) {
            renderInfo->writeUint32(preISegWritePos, curISegLen);
        }

        // prepare to fill new segment field
        switch (slot->getData().getBlendMode()) {
            case BlendMode_Additive:
                curBlendSrc = _premultipliedAlpha ? GL_ONE : GL_SRC_ALPHA;
                curBlendDst = GL_ONE;
                break;
            case BlendMode_Multiply:
                curBlendSrc = GL_DST_COLOR;
                curBlendDst = GL_ONE_MINUS_SRC_ALPHA;
                break;
            case BlendMode_Screen:
                curBlendSrc = GL_ONE;
                curBlendDst = GL_ONE_MINUS_SRC_COLOR;
                break;
            default:
                curBlendSrc = _premultipliedAlpha ? GL_ONE : GL_SRC_ALPHA;
                curBlendDst = GL_ONE_MINUS_SRC_ALPHA;
        }
        
        // check enough space
        renderInfo->checkSpace(sizeof(uint32_t) * 7, true);
        
        // fill new texture index
        renderInfo->writeUint32(curTextureIndex);
        // fill new blend src and dst
        renderInfo->writeUint32(curBlendSrc);
        renderInfo->writeUint32(curBlendDst);
        // fill new index and vertex buffer id
        auto glIB = mb->getGLIB();
        auto glVB = mb->getGLVB();
        renderInfo->writeUint32(glIB);
        renderInfo->writeUint32(glVB);
        // fill new index offset
        renderInfo->writeUint32((uint32_t)ib.getCurPos() / sizeof(unsigned short));

        // save new segment count pos field
        preISegWritePos = (int)renderInfo->getCurPos();
        // reserve indice segamentation count
        renderInfo->writeUint32(0);
        
        // reset pre blend mode to current
        preBlendMode = (int)slot->getData().getBlendMode();
        // reset pre texture index to current
        preTextureIndex = curTextureIndex;
        // reset index segmentation count
        curISegLen = 0;
        // material length increased
        materialLen++;
    };
    
    VertexEffect* effect = nullptr;
    if (_effectDelegate) {
        effect = _effectDelegate->getVertexEffect();
    }
    
    if (effect) {
        effect->begin(*_skeleton);
    }

    auto& drawOrder = _skeleton->getDrawOrder();
    for (size_t i = 0, n = drawOrder.size(); i < n; ++i) {
        isFull = 0;
        slot = drawOrder[i];
        if (_startSlotIndex >= 0 && _startSlotIndex == slot->getData().getIndex()) {
            inRange = true;
        }
        
        if (!inRange) {
            _clipper->clipEnd(*slot);
            continue;
        }
        
        if (_endSlotIndex >= 0 && _endSlotIndex == slot->getData().getIndex()) {
            inRange = false;
        }
        
        if (!slot->getAttachment()) {
            _clipper->clipEnd(*slot);
            continue;
        }
        
        // Early exit if slot is invisible
        if (slot->getColor().a == 0) {
            _clipper->clipEnd(*slot);
            continue;
        }
        
        if (!slot->getAttachment()) {
            continue;
        }
        
        Triangles triangles;
        TwoColorTriangles trianglesTwoColor;
        
        if (slot->getAttachment()->getRTTI().isExactly(RegionAttachment::rtti)) {
            RegionAttachment* attachment = (RegionAttachment*)slot->getAttachment();
            attachmentVertices = (AttachmentVertices*)attachment->getRendererObject();

            // Early exit if attachment is invisible
            if (attachment->getColor().a == 0) {
                _clipper->clipEnd(*slot);
                continue;
            }

            if (!_useTint) {
                triangles.vertCount = attachmentVertices->_triangles->vertCount;
                vbSize = triangles.vertCount * sizeof(V2F_T2F_C4B);
                isFull |= vb.checkSpace(vbSize, true);
                triangles.verts = (V2F_T2F_C4B*)vb.getCurBuffer();
                memcpy(triangles.verts, attachmentVertices->_triangles->verts, vbSize);
                attachment->computeWorldVertices(slot->getBone(), (float*)triangles.verts, 0, vs1);

                triangles.indexCount = attachmentVertices->_triangles->indexCount;
                ibSize = triangles.indexCount * sizeof(unsigned short);
                ib.checkSpace(ibSize, true);
                triangles.indices = (unsigned short*)ib.getCurBuffer();
                memcpy(triangles.indices, attachmentVertices->_triangles->indices, ibSize);
            } else {
                trianglesTwoColor.vertCount = attachmentVertices->_triangles->vertCount;
                vbSize = trianglesTwoColor.vertCount * sizeof(V2F_T2F_C4B_C4B);
                isFull |= vb.checkSpace(vbSize, true);
                trianglesTwoColor.verts = (V2F_T2F_C4B_C4B*)vb.getCurBuffer();
                for (int ii = 0; ii < trianglesTwoColor.vertCount; ii++) {
                    trianglesTwoColor.verts[ii].texCoord = attachmentVertices->_triangles->verts[ii].texCoord;
                }
                attachment->computeWorldVertices(slot->getBone(), (float*)trianglesTwoColor.verts, 0, vs2);
                
                trianglesTwoColor.indexCount = attachmentVertices->_triangles->indexCount;
                ibSize = trianglesTwoColor.indexCount * sizeof(unsigned short);
                ib.checkSpace(ibSize, true);
                trianglesTwoColor.indices = (unsigned short*)ib.getCurBuffer();
                memcpy(trianglesTwoColor.indices, attachmentVertices->_triangles->indices, ibSize);
            }

            color.r = attachment->getColor().r;
            color.g = attachment->getColor().g;
            color.b = attachment->getColor().b;
            color.a = attachment->getColor().a;
            
            if(_debugSlots) {
                _debugBuffer->writeFloat32(DebugType::Slots);
                _debugBuffer->writeFloat32(8);
                float* vertices = _useTint ? (float*)trianglesTwoColor.verts : (float*)triangles.verts;
                int stride = _useTint ? vs2 : vs1;
                // Quadrangle has 4 vertex.
                for (int ii = 0; ii < 4; ii ++) {
                    _debugBuffer->writeFloat32(vertices[0]);
                    _debugBuffer->writeFloat32(vertices[1]);
                    vertices += stride;
                }
            }
        } else if (slot->getAttachment()->getRTTI().isExactly(MeshAttachment::rtti)) {
            MeshAttachment* attachment = (MeshAttachment*)slot->getAttachment();
            attachmentVertices = (AttachmentVertices*)attachment->getRendererObject();
            
            // Early exit if attachment is invisible
            if (attachment->getColor().a == 0) {
                _clipper->clipEnd(*slot);
                continue;
            }
            
            if (!_useTint) {
                triangles.vertCount = attachmentVertices->_triangles->vertCount;
                vbSize = triangles.vertCount * sizeof(V2F_T2F_C4B);
                isFull |= vb.checkSpace(vbSize, true);
                triangles.verts = (V2F_T2F_C4B*)vb.getCurBuffer();
                memcpy(triangles.verts, attachmentVertices->_triangles->verts, vbSize);
                attachment->computeWorldVertices(*slot, 0, attachment->getWorldVerticesLength(), (float*)triangles.verts, 0, vs1);

                triangles.indexCount = attachmentVertices->_triangles->indexCount;
                ibSize = triangles.indexCount * sizeof(unsigned short);
                ib.checkSpace(ibSize, true);
                triangles.indices = (unsigned short*)ib.getCurBuffer();
                memcpy(triangles.indices, attachmentVertices->_triangles->indices, ibSize);
            } else {
                trianglesTwoColor.vertCount = attachmentVertices->_triangles->vertCount;
                vbSize = trianglesTwoColor.vertCount * sizeof(V2F_T2F_C4B_C4B);
                isFull |= vb.checkSpace(vbSize, true);
                trianglesTwoColor.verts = (V2F_T2F_C4B_C4B*)vb.getCurBuffer();
                for (int ii = 0; ii < trianglesTwoColor.vertCount; ii++) {
                    trianglesTwoColor.verts[ii].texCoord = attachmentVertices->_triangles->verts[ii].texCoord;
                }
                attachment->computeWorldVertices(*slot, 0,  attachment->getWorldVerticesLength(), (float*)trianglesTwoColor.verts, 0, vs2);
                
                trianglesTwoColor.indexCount = attachmentVertices->_triangles->indexCount;
                ibSize = trianglesTwoColor.indexCount * sizeof(unsigned short);
                ib.checkSpace(ibSize, true);
                trianglesTwoColor.indices = (unsigned short*)ib.getCurBuffer();
                memcpy(trianglesTwoColor.indices, attachmentVertices->_triangles->indices, ibSize);
            }
            
            color.r = attachment->getColor().r;
            color.g = attachment->getColor().g;
            color.b = attachment->getColor().b;
            color.a = attachment->getColor().a;
            
            if(_debugMesh) {
                int indexCount = _useTint ? trianglesTwoColor.indexCount : triangles.indexCount;
                unsigned short* indices = _useTint ? (unsigned short*)trianglesTwoColor.indices : (unsigned short*)triangles.indices;
                float* vertices = _useTint ? (float*)trianglesTwoColor.verts : (float*)triangles.verts;
                
                int stride = _useTint ? vs2 : vs1;
                _debugBuffer->writeFloat32(DebugType::Mesh);
                _debugBuffer->writeFloat32(indexCount * 2);
                for (int ii = 0; ii < indexCount; ii += 3) {
                    int v1 = indices[ii] * stride;
                    int v2 = indices[ii + 1] * stride;
                    int v3 = indices[ii + 2] * stride;
                    _debugBuffer->writeFloat32(vertices[v1]);
                    _debugBuffer->writeFloat32(vertices[v1 + 1]);
                    _debugBuffer->writeFloat32(vertices[v2]);
                    _debugBuffer->writeFloat32(vertices[v2 + 1]);
                    _debugBuffer->writeFloat32(vertices[v3]);
                    _debugBuffer->writeFloat32(vertices[v3 + 1]);
                }
            }
            
        } else if (slot->getAttachment()->getRTTI().isExactly(ClippingAttachment::rtti)) {
            ClippingAttachment* clip = (ClippingAttachment*)slot->getAttachment();
            _clipper->clipStart(*slot, clip);
            continue;
        } else {
            _clipper->clipEnd(*slot);
            continue;
        }
        
        color.a = _skeleton->getColor().a * slot->getColor().a * color.a * _nodeColor.a * 255;
        // skip rendering if the color of this attachment is 0
        if (color.a == 0) {
            _clipper->clipEnd(*slot);
            continue;
        }

        float multiplier = _premultipliedAlpha ? color.a : 255;
        float red = _nodeColor.r * _skeleton->getColor().r * color.r * multiplier;
        float green = _nodeColor.g * _skeleton->getColor().g * color.g * multiplier;
        float blue = _nodeColor.b * _skeleton->getColor().b * color.b * multiplier;
        
        color.r = red * slot->getColor().r;
        color.g = green * slot->getColor().g;
        color.b = blue * slot->getColor().b;
        
        if (slot->hasDarkColor()) {
            darkColor.r = red * slot->getDarkColor().r;
            darkColor.g = green * slot->getDarkColor().g;
            darkColor.b = blue * slot->getDarkColor().b;
        } else {
            darkColor.r = 0;
            darkColor.g = 0;
            darkColor.b = 0;
        }
        darkColor.a = _premultipliedAlpha ? 255 : 0;
        
        // One color tint logic
        if (!_useTint) {
            // Cliping logic
            if (_clipper->isClipping()) {
                _clipper->clipTriangles((float*)&triangles.verts[0].vertex, triangles.indices, triangles.indexCount, (float*)&triangles.verts[0].texCoord, vs1);
                
                if (_clipper->getClippedTriangles().size() == 0) {
                    _clipper->clipEnd(*slot);
                    continue;
                }
                
                triangles.vertCount = (int)_clipper->getClippedVertices().size() >> 1;
                vbSize = triangles.vertCount * sizeof(V2F_T2F_C4B);
                isFull |= vb.checkSpace(vbSize, true);
                triangles.verts = (V2F_T2F_C4B*)vb.getCurBuffer();
                
                triangles.indexCount = (int)_clipper->getClippedTriangles().size();
                ibSize = triangles.indexCount * sizeof(unsigned short);
                ib.checkSpace(ibSize, true);
                triangles.indices = (unsigned short*)ib.getCurBuffer();
                memcpy(triangles.indices, _clipper->getClippedTriangles().buffer(), sizeof(unsigned short) * _clipper->getClippedTriangles().size());
                
                float* verts = _clipper->getClippedVertices().buffer();
                float* uvs = _clipper->getClippedUVs().buffer();
                if (effect) {
                    Color light;
                    Color dark;
                    light.r = color.r / 255.0f;
                    light.g = color.g / 255.0f;
                    light.b = color.b / 255.0f;
                    light.a = color.a / 255.0f;
                    dark.r = dark.g = dark.b = dark.a = 0;
                    for (int v = 0, vn = triangles.vertCount, vv = 0; v < vn; ++v, vv+=2) {
                        V2F_T2F_C4B* vertex = triangles.verts + v;
                        Color lightCopy = light;
                        Color darkCopy = dark;
                        vertex->vertex.x = verts[vv];
                        vertex->vertex.y = verts[vv + 1];
                        vertex->texCoord.u = uvs[vv];
                        vertex->texCoord.v = uvs[vv + 1];
                        effect->transform(vertex->vertex.x, vertex->vertex.y, vertex->texCoord.u, vertex->texCoord.v, lightCopy, darkCopy);
                        vertex->color.r = (GLubyte)(lightCopy.r * 255);
                        vertex->color.g = (GLubyte)(lightCopy.g * 255);
                        vertex->color.b = (GLubyte)(lightCopy.b * 255);
                        vertex->color.a = (GLubyte)(lightCopy.a * 255);
                    }
                } else {
                    for (int v = 0, vn = triangles.vertCount, vv = 0; v < vn; ++v, vv+=2) {
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
                }
            // No cliping logic
            } else {
                if (effect) {
                    Color light;
                    Color dark;
                    light.r = color.r / 255.0f;
                    light.g = color.g / 255.0f;
                    light.b = color.b / 255.0f;
                    light.a = color.a / 255.0f;
                    dark.r = dark.g = dark.b = dark.a = 0;
                    for (int v = 0, vn = triangles.vertCount; v < vn; ++v) {
                        V2F_T2F_C4B* vertex = triangles.verts + v;
                        Color lightCopy = light;
                        Color darkCopy = dark;
                        effect->transform(vertex->vertex.x, vertex->vertex.y, vertex->texCoord.u, vertex->texCoord.v, lightCopy,  darkCopy);
                        vertex->color.r = (GLubyte)(lightCopy.r * 255);
                        vertex->color.g = (GLubyte)(lightCopy.g * 255);
                        vertex->color.b = (GLubyte)(lightCopy.b * 255);
                        vertex->color.a = (GLubyte)(lightCopy.a * 255);
                    }
                } else {
                    for (int v = 0, vn = triangles.vertCount; v < vn; ++v) {
                        V2F_T2F_C4B* vertex = triangles.verts + v;
                        vertex->color.r = (GLubyte)color.r;
                        vertex->color.g = (GLubyte)color.g;
                        vertex->color.b = (GLubyte)color.b;
                        vertex->color.a = (GLubyte)color.a;
                    }
                }
            }
        }
        // Two color tint logic
        else {
            if (_clipper->isClipping()) {
                _clipper->clipTriangles((float*)&trianglesTwoColor.verts[0].vertex, trianglesTwoColor.indices, trianglesTwoColor.indexCount, (float*)&trianglesTwoColor.verts[0].texCoord, vs2);
                
                if (_clipper->getClippedTriangles().size() == 0) {
                    _clipper->clipEnd(*slot);
                    continue;
                }
                
                trianglesTwoColor.vertCount = (int)_clipper->getClippedVertices().size() >> 1;
                vbSize = trianglesTwoColor.vertCount * sizeof(V2F_T2F_C4B_C4B);
                isFull |= vb.checkSpace(vbSize, true);
                trianglesTwoColor.verts = (V2F_T2F_C4B_C4B*)vb.getCurBuffer();
                
                trianglesTwoColor.indexCount = (int)_clipper->getClippedTriangles().size();
                ibSize = trianglesTwoColor.indexCount * sizeof(unsigned short);
                trianglesTwoColor.indices = (unsigned short*)ib.getCurBuffer();
                memcpy(trianglesTwoColor.indices, _clipper->getClippedTriangles().buffer(), sizeof(unsigned short) * _clipper->getClippedTriangles().size());
                
                float* verts = _clipper->getClippedVertices().buffer();
                float* uvs = _clipper->getClippedUVs().buffer();
                
                if (effect) {
                    Color light;
                    Color dark;
                    light.r = color.r / 255.0f;
                    light.g = color.g / 255.0f;
                    light.b = color.b / 255.0f;
                    light.a = color.a / 255.0f;
                    dark.r = darkColor.r / 255.0f;
                    dark.g = darkColor.g / 255.0f;
                    dark.b = darkColor.b / 255.0f;
                    dark.a = darkColor.a / 255.0f;
                    for (int v = 0, vn = trianglesTwoColor.vertCount, vv = 0; v < vn; ++v, vv += 2) {
                        V2F_T2F_C4B_C4B* vertex = trianglesTwoColor.verts + v;
                        Color lightCopy = light;
                        Color darkCopy = dark;
                        vertex->vertex.x = verts[vv];
                        vertex->vertex.y = verts[vv + 1];
                        vertex->texCoord.u = uvs[vv];
                        vertex->texCoord.v = uvs[vv + 1];
                        effect->transform(vertex->vertex.x, vertex->vertex.y, vertex->texCoord.u, vertex->texCoord.v, lightCopy, darkCopy);
                        vertex->color.r = (GLubyte)(lightCopy.r * 255);
                        vertex->color.g = (GLubyte)(lightCopy.g * 255);
                        vertex->color.b = (GLubyte)(lightCopy.b * 255);
                        vertex->color.a = (GLubyte)(lightCopy.a * 255);
                        vertex->color2.r = (GLubyte)(darkCopy.r * 255);
                        vertex->color2.g = (GLubyte)(darkCopy.g * 255);
                        vertex->color2.b = (GLubyte)(darkCopy.b * 255);
                        vertex->color2.a = (GLubyte)darkColor.a;
                    }
                } else {
                    for (int v = 0, vn = trianglesTwoColor.vertCount, vv = 0; v < vn; ++v, vv += 2) {
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
            } else {
                if (effect) {
                    Color light;
                    Color dark;
                    light.r = color.r / 255.0f;
                    light.g = color.g / 255.0f;
                    light.b = color.b / 255.0f;
                    light.a = color.a / 255.0f;
                    dark.r = darkColor.r / 255.0f;
                    dark.g = darkColor.g / 255.0f;
                    dark.b = darkColor.b / 255.0f;
                    dark.a = darkColor.a / 255.0f;
                    
                    for (int v = 0, vn = trianglesTwoColor.vertCount; v < vn; ++v) {
                        V2F_T2F_C4B_C4B* vertex = trianglesTwoColor.verts + v;
                        Color lightCopy = light;
                        Color darkCopy = dark;
                        effect->transform(vertex->vertex.x, vertex->vertex.y, vertex->texCoord.u, vertex->texCoord.v, lightCopy, darkCopy);
                        vertex->color.r = (GLubyte)(lightCopy.r * 255);
                        vertex->color.g = (GLubyte)(lightCopy.g * 255);
                        vertex->color.b = (GLubyte)(lightCopy.b * 255);
                        vertex->color.a = (GLubyte)(lightCopy.a * 255);
                        vertex->color2.r = (GLubyte)(darkCopy.r * 255);
                        vertex->color2.g = (GLubyte)(darkCopy.g * 255);
                        vertex->color2.b = (GLubyte)(darkCopy.b * 255);
                        vertex->color2.a = (GLubyte)darkColor.a;
                    }
                } else {
                    for (int v = 0, vn = trianglesTwoColor.vertCount; v < vn; ++v) {
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
        }
        
        curTextureIndex = attachmentVertices->_texture->getRealTextureIndex();
        // If texture or blendMode change,will change material.
        if (preTextureIndex != curTextureIndex || preBlendMode != slot->getData().getBlendMode() || isFull) {
            flush();
        }
        
        if (vbSize > 0 && ibSize > 0) {
            auto vertexOffset = vb.getCurPos() / sizeof(middleware::V2F_T2F_C4B);
            if (_useTint) {
                vertexOffset = vb.getCurPos() / sizeof(middleware::V2F_T2F_C4B_C4B);
            }
            
            if (vertexOffset > 0) {
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
        
        _clipper->clipEnd(*slot);
    } // End slot traverse
    
    _clipper->clipEnd();
    
    if (effect) effect->end();
    
    renderInfo->writeUint32(materialLenOffset, materialLen);
    if (preISegWritePos != -1) {
        renderInfo->writeUint32(preISegWritePos, curISegLen);
    }
    
    if (_debugBones) {
        auto& bones = _skeleton->getBones();
        size_t bonesCount = bones.size();
        _debugBuffer->writeFloat32(DebugType::Bones);
        _debugBuffer->writeFloat32(bonesCount * 4);
        for (size_t i = 0, n = bonesCount; i < n; i++) {
            Bone *bone = bones[i];
            float x = bone->getData().getLength() * bone->getA() + bone->getWorldX();
            float y = bone->getData().getLength() * bone->getC() + bone->getWorldY();
            _debugBuffer->writeFloat32(bone->getWorldX());
            _debugBuffer->writeFloat32(bone->getWorldY());
            _debugBuffer->writeFloat32(x);
            _debugBuffer->writeFloat32(y);
        }
    }
    
    // debug end
    if (_debugBuffer) {
        if (_debugBuffer->isOutRange()) {
            _debugBuffer->reset();
            cocos2d::log("Spine debug data is too large, debug buffer has no space to put in it!!!!!!!!!!");
            cocos2d::log("You can adjust MAX_DEBUG_BUFFER_SIZE macro");
        }
        _debugBuffer->writeFloat32(DebugType::None);
    }
}

cocos2d::Rect SkeletonRenderer::getBoundingBox () const {
    static IOBuffer buffer(1024);
    float* worldVertices = nullptr;
    float minX = FLT_MAX, minY = FLT_MAX, maxX = -FLT_MAX, maxY = -FLT_MAX;
    for (int i = 0; i < _skeleton->getSlots().size(); ++i) {
        Slot* slot = _skeleton->getSlots()[i];
        if (!slot->getAttachment()) continue;
        int verticesCount;
        if (slot->getAttachment()->getRTTI().isExactly(RegionAttachment::rtti)) {
            RegionAttachment* attachment = (RegionAttachment*)slot->getAttachment();
            buffer.checkSpace(8 * sizeof(float));
            worldVertices = (float*)buffer.getCurBuffer();
            attachment->computeWorldVertices(slot->getBone(), worldVertices, 0, 2);
            verticesCount = 8;
        } else if (slot->getAttachment()->getRTTI().isExactly(MeshAttachment::rtti)) {
            MeshAttachment* mesh = (MeshAttachment*)slot->getAttachment();
            buffer.checkSpace(mesh->getWorldVerticesLength() * sizeof(float));
            worldVertices = (float*)buffer.getCurBuffer();
            mesh->computeWorldVertices(*slot, 0, mesh->getWorldVerticesLength(), worldVertices, 0, 2);
            verticesCount = (int)mesh->getWorldVerticesLength();
        } else
            continue;
        for (int ii = 0; ii < verticesCount; ii += 2) {
            float x = worldVertices[ii], y = worldVertices[ii + 1];
            minX = min(minX, x);
            minY = min(minY, y);
            maxX = max(maxX, x);
            maxY = max(maxY, y);
        }
    }
    if (minX == FLT_MAX) minX = minY = maxX = maxY = 0;
    return cocos2d::Rect(minX, minY, maxX - minX, maxY - minY);
}

void SkeletonRenderer::updateWorldTransform () {
	if (_skeleton) {
    	_skeleton->updateWorldTransform();
	}
}

void SkeletonRenderer::setToSetupPose () {
	if (_skeleton) {
    	_skeleton->setToSetupPose();
	}
}

void SkeletonRenderer::setBonesToSetupPose () {
    if (_skeleton) {
    	_skeleton->setBonesToSetupPose();
	}
}

void SkeletonRenderer::setSlotsToSetupPose () {
	if (_skeleton) {
    	_skeleton->setSlotsToSetupPose();
	}
}

Bone* SkeletonRenderer::findBone (const std::string& boneName) const {
    if (_skeleton) {
    	return _skeleton->findBone(boneName.c_str());
	}
	return nullptr;
}

Slot* SkeletonRenderer::findSlot (const std::string& slotName) const {
    if (_skeleton) {
        return _skeleton->findSlot(slotName.c_str());
    }
    return nullptr;
}

void SkeletonRenderer::setSkin (const std::string& skinName) {
    if (_skeleton) {
    	_skeleton->setSkin(skinName.empty() ? 0 : skinName.c_str());
	}
}

void SkeletonRenderer::setSkin (const char* skinName) {
	if (_skeleton) {
	    _skeleton->setSkin(skinName);
	}
}

Attachment* SkeletonRenderer::getAttachment (const std::string& slotName, const std::string& attachmentName) const {
    if (_skeleton) {
        return _skeleton->getAttachment(slotName.c_str(), attachmentName.c_str());
    }
    return nullptr;
}

bool SkeletonRenderer::setAttachment (const std::string& slotName, const std::string& attachmentName) {
    if (_skeleton) {
        return _skeleton->getAttachment(slotName.c_str(), attachmentName.empty() ? 0 : attachmentName.c_str()) ? true : false;
    }
    return false;
}

bool SkeletonRenderer::setAttachment (const std::string& slotName, const char* attachmentName) {
    if (_skeleton) {
        return _skeleton->getAttachment(slotName.c_str(), attachmentName) ? true : false;
    }
    return false;
}

void SkeletonRenderer::setUseTint(bool enabled) {
    _useTint = enabled;
}

void SkeletonRenderer::setVertexEffectDelegate(VertexEffectDelegate *effectDelegate) {
    if (_effectDelegate == effectDelegate) {
        return;
    }
    CC_SAFE_RELEASE(_effectDelegate);
    _effectDelegate = effectDelegate;
    CC_SAFE_RETAIN(_effectDelegate);
}

void SkeletonRenderer::setSlotsRange(int startSlotIndex, int endSlotIndex) {
    this->_startSlotIndex = startSlotIndex;
    this->_endSlotIndex = endSlotIndex;
}

Skeleton* SkeletonRenderer::getSkeleton () const {
    return _skeleton;
}

void SkeletonRenderer::setTimeScale (float scale) {
    _timeScale = scale;
}

float SkeletonRenderer::getTimeScale () const {
    return _timeScale;
}

void SkeletonRenderer::paused(bool value) {
    _paused = value;
}

void SkeletonRenderer::setColor (cocos2d::Color4B& color) {
    _nodeColor.r = color.r / 255.0f;
    _nodeColor.g = color.g / 255.0f;
    _nodeColor.b = color.b / 255.0f;
    _nodeColor.a = color.a / 255.0f;
}

void SkeletonRenderer::setDebugBonesEnabled (bool enabled) {
    _debugBones = enabled;
}

void SkeletonRenderer::setDebugSlotsEnabled (bool enabled) {
    _debugSlots = enabled;
}

void SkeletonRenderer::setDebugMeshEnabled (bool enabled) {
    _debugMesh = enabled;
}

void SkeletonRenderer::setOpacityModifyRGB (bool value) {
    _premultipliedAlpha = value;
}

bool SkeletonRenderer::isOpacityModifyRGB () const {
    return _premultipliedAlpha;
}
