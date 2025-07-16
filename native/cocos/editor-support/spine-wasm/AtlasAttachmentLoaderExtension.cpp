#include "AtlasAttachmentLoaderExtension.h"
#include "mesh-type-define.h"
//#include "LogUtil.h"
using namespace spine;

AttachmentVertices::AttachmentVertices(int verticesCount, uint16_t *triangles, int trianglesCount, const spine::String& textureName) {
    _triangles = new Triangles();
    _triangles->verts = new V3F_T2F_C4B[verticesCount];
    _triangles->vertCount = verticesCount;
    _triangles->indices = triangles;
    _triangles->indexCount = trianglesCount;
    _textureName = textureName;
}

AttachmentVertices::~AttachmentVertices() {
    delete[] _triangles->verts;
    delete _triangles;
}

AttachmentVertices *AttachmentVertices::copy() {
    AttachmentVertices *atv = new AttachmentVertices(_triangles->vertCount, _triangles->indices, _triangles->indexCount, _textureName);
    atv->_textureUUID = _textureUUID;
    memcpy(static_cast<void *>(atv->_triangles->verts), static_cast<void *>(_triangles->verts), sizeof(V3F_T2F_C4B) * _triangles->vertCount);
    return atv;
}

AtlasAttachmentLoaderExtension::AtlasAttachmentLoaderExtension(Atlas *atlas) : AtlasAttachmentLoader(atlas), _atlasCache(atlas) {
}

AtlasAttachmentLoaderExtension::~AtlasAttachmentLoaderExtension() = default;

void AtlasAttachmentLoaderExtension::configureAttachment(Attachment *attachment) {
}