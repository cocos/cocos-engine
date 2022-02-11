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

#include "spine-creator-support/spine-cocos2dx.h"
#include "base/Data.h"
#include "middleware-adapter.h"
#include "platform/FileUtils.h"
#include "spine-creator-support/AttachmentVertices.h"

namespace spine {
static CustomTextureLoader _customTextureLoader = nullptr;
void spAtlasPage_setCustomTextureLoader(CustomTextureLoader texLoader) {
    _customTextureLoader = texLoader;
}

static SpineObjectDisposeCallback _spineObjectDisposeCallback = 0;
void setSpineObjectDisposeCallback(SpineObjectDisposeCallback callback) {
    _spineObjectDisposeCallback = callback;
}
} // namespace spine

USING_NS_MW;
using namespace cc;
using namespace spine;

static void deleteAttachmentVertices(void *vertices) {
    delete (AttachmentVertices *)vertices;
}

static unsigned short quadTriangles[6] = {0, 1, 2, 2, 3, 0};

static void setAttachmentVertices(RegionAttachment *attachment) {
    AtlasRegion *region = (AtlasRegion *)attachment->getRendererObject();
    AttachmentVertices *attachmentVertices = new AttachmentVertices((Texture2D *)region->page->getRendererObject(), 4, quadTriangles, 6);
    V2F_T2F_C4F *vertices = attachmentVertices->_triangles->verts;
    for (int i = 0, ii = 0; i < 4; ++i, ii += 2) {
        vertices[i].texCoord.u = attachment->getUVs()[ii];
        vertices[i].texCoord.v = attachment->getUVs()[ii + 1];
    }
    attachment->setRendererObject(attachmentVertices, deleteAttachmentVertices);
}

static void setAttachmentVertices(MeshAttachment *attachment) {
    AtlasRegion *region = (AtlasRegion *)attachment->getRendererObject();
    AttachmentVertices *attachmentVertices = new AttachmentVertices((Texture2D *)region->page->getRendererObject(),
                                                                    attachment->getWorldVerticesLength() >> 1, attachment->getTriangles().buffer(), attachment->getTriangles().size());
    V2F_T2F_C4F *vertices = attachmentVertices->_triangles->verts;
    for (size_t i = 0, ii = 0, nn = attachment->getWorldVerticesLength(); ii < nn; ++i, ii += 2) {
        vertices[i].texCoord.u = attachment->getUVs()[ii];
        vertices[i].texCoord.v = attachment->getUVs()[ii + 1];
    }
    attachment->setRendererObject(attachmentVertices, deleteAttachmentVertices);
}

Cocos2dAtlasAttachmentLoader::Cocos2dAtlasAttachmentLoader(Atlas *atlas) : AtlasAttachmentLoader(atlas) {
}

Cocos2dAtlasAttachmentLoader::~Cocos2dAtlasAttachmentLoader() {}

void Cocos2dAtlasAttachmentLoader::configureAttachment(Attachment *attachment) {
    if (attachment->getRTTI().isExactly(RegionAttachment::rtti)) {
        setAttachmentVertices((RegionAttachment *)attachment);
    } else if (attachment->getRTTI().isExactly(MeshAttachment::rtti)) {
        setAttachmentVertices((MeshAttachment *)attachment);
    }
}

uint32_t wrap(TextureWrap _wrap) {
    return (uint32_t)_wrap;
}

uint32_t filter(TextureFilter _filter) {
    return (uint32_t)_filter;
}

Cocos2dTextureLoader::Cocos2dTextureLoader() : TextureLoader() {}
Cocos2dTextureLoader::~Cocos2dTextureLoader() {}

void Cocos2dTextureLoader::load(AtlasPage &page, const spine::String &path) {
    Texture2D *texture = nullptr;
    if (spine::_customTextureLoader) {
        texture = spine::_customTextureLoader(path.buffer());
    }
    CCASSERT(texture != nullptr, "Invalid image");

    if (texture) {
        texture->retain();

        Texture2D::TexParams textureParams = {filter(page.minFilter), filter(page.magFilter), wrap(page.uWrap), wrap(page.vWrap)};
        texture->setTexParameters(textureParams);

        page.setRendererObject(texture);
        page.width = texture->getPixelsWide();
        page.height = texture->getPixelsHigh();
    }
}

void Cocos2dTextureLoader::unload(void *texture) {
    if (texture) {
        ((Texture2D *)texture)->release();
    }
}

Cocos2dExtension::Cocos2dExtension() : DefaultSpineExtension() {}

Cocos2dExtension::~Cocos2dExtension() {}

char *Cocos2dExtension::_readFile(const spine::String &path, int *length) {
    *length = 0;
    Data data = FileUtils::getInstance()->getDataFromFile(FileUtils::getInstance()->fullPathForFilename(path.buffer()));
    if (data.isNull()) return 0;

    char *ret = (char *)malloc(sizeof(unsigned char) * data.getSize());
    memcpy(ret, (char *)data.getBytes(), data.getSize());
    *length = (int)data.getSize();
    return ret;
}

SpineExtension *spine::getDefaultExtension() {
    return new Cocos2dExtension();
}

void Cocos2dExtension::_free(void *mem, const char *file, int line) {
    _spineObjectDisposeCallback(mem);
    DefaultSpineExtension::_free(mem, file, line);
}
