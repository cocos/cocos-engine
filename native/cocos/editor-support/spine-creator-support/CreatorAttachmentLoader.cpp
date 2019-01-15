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

#include "spine-creator-support/CreatorAttachmentLoader.h"
#include "spine/extension.h"
#include "spine-creator-support/AttachmentVertices.h"

USING_NS_CC;
USING_NS_MW;
using namespace spine;

static unsigned short quadTriangles[6] = {0, 1, 2, 2, 3, 0};

spAttachment* _CreatorAttachmentLoader_createAttachment (spAttachmentLoader* loader, spSkin* skin, spAttachmentType type,
                                                         const char* name, const char* path)
{
    CreatorAttachmentLoader* self = SUB_CAST(CreatorAttachmentLoader, loader);
    return spAttachmentLoader_createAttachment(SUPER(self->atlasAttachmentLoader), skin, type, name, path);
}

void _CreatorAttachmentLoader_configureAttachment (spAttachmentLoader* loader, spAttachment* attachment)
{
    attachment->attachmentLoader = loader;
    
    switch (attachment->type)
    {
        case SP_ATTACHMENT_REGION:
        {
            spRegionAttachment* regionAttachment = SUB_CAST(spRegionAttachment, attachment);
            spAtlasRegion* region = (spAtlasRegion*)regionAttachment->rendererObject;
            AttachmentVertices* attachmentVertices = new AttachmentVertices((Texture2D*)region->page->rendererObject, 4, quadTriangles, 6);
            V2F_T2F_C4B* vertices = attachmentVertices->_triangles->verts;
            for (int i = 0, ii = 0; i < 4; ++i, ii += 2)
            {
                vertices[i].texCoord.u = regionAttachment->uvs[ii];
                vertices[i].texCoord.v = regionAttachment->uvs[ii + 1];
            }
            regionAttachment->rendererObject = attachmentVertices;
            break;
        }
        case SP_ATTACHMENT_MESH:
        {
            spMeshAttachment* meshAttachment = SUB_CAST(spMeshAttachment, attachment);
            spAtlasRegion* region = (spAtlasRegion*)meshAttachment->rendererObject;
            AttachmentVertices* attachmentVertices = new AttachmentVertices((Texture2D*)region->page->rendererObject,
                                                                            meshAttachment->super.worldVerticesLength >> 1, meshAttachment->triangles, meshAttachment->trianglesCount);
            V2F_T2F_C4B* vertices = attachmentVertices->_triangles->verts;
            for (int i = 0, ii = 0, nn = meshAttachment->super.worldVerticesLength; ii < nn; ++i, ii += 2)
            {
                vertices[i].texCoord.u = meshAttachment->uvs[ii];
                vertices[i].texCoord.v = meshAttachment->uvs[ii + 1];
            }
            meshAttachment->rendererObject = attachmentVertices;
            break;
        }
        default: ;
    }
}

void _CreatorAttachmentLoader_disposeAttachment (spAttachmentLoader* loader, spAttachment* attachment)
{
    switch (attachment->type)
    {
        case SP_ATTACHMENT_REGION:
        {
            spRegionAttachment* regionAttachment = SUB_CAST(spRegionAttachment, attachment);
            delete (AttachmentVertices*)regionAttachment->rendererObject;
            break;
        }
        case SP_ATTACHMENT_MESH:
        {
            spMeshAttachment* meshAttachment = SUB_CAST(spMeshAttachment, attachment);
            delete (AttachmentVertices*)meshAttachment->rendererObject;
            break;
        }
        default: ;
    }
}

void _CreatorAttachmentLoader_dispose (spAttachmentLoader* loader)
{
    CreatorAttachmentLoader* self = SUB_CAST(CreatorAttachmentLoader, loader);
    spAttachmentLoader_dispose(SUPER_CAST(spAttachmentLoader, self->atlasAttachmentLoader));
    _spAttachmentLoader_deinit(loader);
}

CreatorAttachmentLoader* CreatorAttachmentLoader_create (spAtlas* atlas)
{
    CreatorAttachmentLoader* self = NEW(CreatorAttachmentLoader);
    _spAttachmentLoader_init(SUPER(self), _CreatorAttachmentLoader_dispose, _CreatorAttachmentLoader_createAttachment,
                             _CreatorAttachmentLoader_configureAttachment, _CreatorAttachmentLoader_disposeAttachment);
    self->atlasAttachmentLoader = spAtlasAttachmentLoader_create(atlas);
    return self;
}
