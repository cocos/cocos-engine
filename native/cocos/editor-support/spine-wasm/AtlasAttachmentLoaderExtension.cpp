#include "AtlasAttachmentLoaderExtension.h"
#include "mesh-type-define.h"
//#include "LogUtil.h"
using namespace spine;

static uint16_t quadTriangles[6] = {0, 1, 2, 2, 3, 0};

AttachmentVertices::AttachmentVertices(int verticesCount, uint16_t *triangles, int trianglesCount) {
    _triangles = new Triangles();
    _triangles->verts = new V3F_T2F_C4B[verticesCount];
    _triangles->vertCount = verticesCount;
    _triangles->indices = triangles;
    _triangles->indexCount = trianglesCount;
}

AttachmentVertices::~AttachmentVertices() {
    delete[] _triangles->verts;
    delete _triangles;
}

static void deleteAttachmentVertices(void *vertices) {
    delete static_cast<AttachmentVertices *>(vertices);
}

static void setAttachmentVertices(RegionAttachment *attachment) {
    auto *region = static_cast<AtlasRegion *>(attachment->getRendererObject());
    auto *attachmentVertices = new AttachmentVertices(4, quadTriangles, 6);
    V3F_T2F_C4B *vertices = attachmentVertices->_triangles->verts;
    for (int i = 0, ii = 0; i < 4; ++i, ii += 2) {
        vertices[i].texCoord.u = attachment->getUVs()[ii];
        vertices[i].texCoord.v = attachment->getUVs()[ii + 1];
    }
    attachment->setRendererObject(attachmentVertices, deleteAttachmentVertices);
}

static void setAttachmentVertices(MeshAttachment *attachment) {
    auto *region = static_cast<AtlasRegion *>(attachment->getRendererObject());
    auto *attachmentVertices = new AttachmentVertices(
        static_cast<int32_t>(attachment->getWorldVerticesLength() >> 1), attachment->getTriangles().buffer(), static_cast<int32_t>(attachment->getTriangles().size()));
    V3F_T2F_C4B *vertices = attachmentVertices->_triangles->verts;
    for (size_t i = 0, ii = 0, nn = attachment->getWorldVerticesLength(); ii < nn; ++i, ii += 2) {
        vertices[i].texCoord.u = attachment->getUVs()[ii];
        vertices[i].texCoord.v = attachment->getUVs()[ii + 1];
    }
    attachment->setRendererObject(attachmentVertices, deleteAttachmentVertices);
}

AtlasAttachmentLoaderExtension::AtlasAttachmentLoaderExtension(Atlas *atlas) : AtlasAttachmentLoader(atlas) {
}

AtlasAttachmentLoaderExtension::~AtlasAttachmentLoaderExtension() = default;

void AtlasAttachmentLoaderExtension::configureAttachment(Attachment *attachment) {
    if (attachment->getRTTI().isExactly(RegionAttachment::rtti)) {
        setAttachmentVertices(static_cast<RegionAttachment *>(attachment));
    } else if (attachment->getRTTI().isExactly(MeshAttachment::rtti)) {
        setAttachmentVertices(static_cast<MeshAttachment *>(attachment));
    }
}