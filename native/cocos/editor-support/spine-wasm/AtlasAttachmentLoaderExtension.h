#ifndef __SPINE_ATLAS_ATTACHMENT_LOADER_EXT_H
#define __SPINE_ATLAS_ATTACHMENT_LOADER_EXT_H

#include "mesh-type-define.h"
#include "spine/spine.h"

class AttachmentVertices {
public:
    AttachmentVertices(int verticesCount, uint16_t *triangles, int trianglesCount);
    virtual ~AttachmentVertices();
    Triangles *_triangles = nullptr;
};

class AtlasAttachmentLoaderExtension : public spine::AtlasAttachmentLoader {
public:
    AtlasAttachmentLoaderExtension(spine::Atlas *atlas);
    virtual ~AtlasAttachmentLoaderExtension();
    virtual void configureAttachment(spine::Attachment *attachment);
};

#endif