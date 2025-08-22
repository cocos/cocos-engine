/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated January 1, 2020. Replaces all prior versions.
 *
 * Copyright (c) 2013-2020, Esoteric Software LLC
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
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#include "SkeletonDataMgr.h"
#include <algorithm>
#include <vector>
#include "AttachmentVertices.h"

using namespace spine; //NOLINT
using namespace cc; //NOLINT


static uint16_t quadTriangles[6] = {0, 1, 2, 2, 3, 0};

extern "C" AttachmentVertices *generateAttachmentVertices(Attachment *attachment) {
    AttachmentVertices *attachmentVertices = nullptr;
    if (attachment->getRTTI().isExactly(RegionAttachment::rtti)) {
        auto *regionAttachMent = static_cast<RegionAttachment *>(attachment);
#if CC_USE_SPINE_3_8
        auto *region = static_cast<AtlasRegion *>(regionAttachMent->getRendererObject());
        attachmentVertices = new AttachmentVertices(static_cast<middleware::Texture2D *>(region->page->getRendererObject()), 4, quadTriangles, 6);
#else
        auto *region = static_cast<AtlasRegion *>(regionAttachMent->getRegion());
        if (!region) return nullptr;
        attachmentVertices = new AttachmentVertices(static_cast<middleware::Texture2D *>(region->page->texture), 4, quadTriangles, 6);
#endif
        auto *vertices = attachmentVertices->_triangles->verts;
        for (int i = 0, ii = 0; i < 4; ++i, ii += 2) {
            vertices[i].texCoord.u = regionAttachMent->getUVs()[ii];
            vertices[i].texCoord.v = regionAttachMent->getUVs()[ii + 1];
        }
    } else if (attachment->getRTTI().isExactly(MeshAttachment::rtti)) {
        auto *meshAttachMent = static_cast<MeshAttachment *>(attachment);
#if CC_USE_SPINE_3_8
        auto *region = static_cast<AtlasRegion *>(meshAttachMent->getRendererObject());
        attachmentVertices = new AttachmentVertices(static_cast<middleware::Texture2D *>(region->page->getRendererObject()),
                                                    static_cast<int32_t>(meshAttachMent->getWorldVerticesLength() >> 1), meshAttachMent->getTriangles().buffer(), static_cast<int32_t>(meshAttachMent->getTriangles().size()));
#else
        auto *region = static_cast<AtlasRegion *>(meshAttachMent->getRegion());
        if (!region) return nullptr;
        attachmentVertices = new AttachmentVertices(static_cast<middleware::Texture2D *>(region->page->texture),
                                                    static_cast<int32_t>(meshAttachMent->getWorldVerticesLength() >> 1), meshAttachMent->getTriangles().buffer(), static_cast<int32_t>(meshAttachMent->getTriangles().size()));
#endif
        auto *vertices = attachmentVertices->_triangles->verts;
        for (size_t i = 0, ii = 0, nn = meshAttachMent->getWorldVerticesLength(); ii < nn; ++i, ii += 2) {
            vertices[i].texCoord.u = meshAttachMent->getUVs()[ii];
            vertices[i].texCoord.v = meshAttachMent->getUVs()[ii + 1];
        }
    }
    return attachmentVertices;
}

namespace cc {
SkeletonDataInfo::~SkeletonDataInfo() {
    if (data) {
        delete data;
        data = nullptr;
    }

    if (atlas) {
        delete atlas;
        atlas = nullptr;
    }

    if (attachmentLoader) {
        delete attachmentLoader;
        attachmentLoader = nullptr;
    }

    for (const auto &pair : attachmentVerticesMap) {
        delete pair.second;
    }
}

void saveAttachmentVertices(SkeletonDataInfo *info) {
    auto &attachmentVerticesMap = info->attachmentVerticesMap;
    auto &skins = info->data->getSkins();
    auto skinSize = skins.size();
    for (int i = 0; i < skinSize; ++i) {
        auto *skin = skins[i];
        auto entries = skin->getAttachments();
        while (entries.hasNext()) {
            Skin::AttachmentMap::Entry &entry = entries.next();
            auto *attachment = entry._attachment;
            if (attachmentVerticesMap.count(attachment) < 1) {
                auto *attachmentVertices = generateAttachmentVertices(attachment);
                if (attachmentVertices) {
                    attachmentVerticesMap[attachment] = attachmentVertices;
                }
            }
        }
    }
}

} // namespace cc

SkeletonDataMgr *SkeletonDataMgr::instance = nullptr;

SkeletonDataMgr::~SkeletonDataMgr() {
    _destroyCallback = nullptr;
    for (auto &e : _dataMap) {
        delete e.second;
    }
    _dataMap.clear();
}

bool SkeletonDataMgr::hasSkeletonData(const std::string &uuid) {
    auto it = _dataMap.find(uuid);
    return it != _dataMap.end();
}

void SkeletonDataMgr::setSkeletonData(const std::string &uuid, SkeletonData *data, Atlas *atlas, AttachmentLoader *attachmentLoader, const std::vector<int> &texturesIndex) {
    auto it = _dataMap.find(uuid);
    if (it != _dataMap.end()) {
        releaseByUUID(uuid);
    }
    auto *info = new SkeletonDataInfo();
    info->data = data;
    info->atlas = atlas;
    info->attachmentLoader = attachmentLoader;
    info->texturesIndex = texturesIndex;
    _dataMap[uuid] = info;

    saveAttachmentVertices(info);
}

SkeletonDataInfo *SkeletonDataMgr::getSkeletonDataInfo(const std::string &uuid) {
    auto dataIt = _dataMap.find(uuid);
    if (dataIt == _dataMap.end()) {
        return nullptr;
    }
    return dataIt->second;
}

std::vector<SkeletonDataInfo *> SkeletonDataMgr::getSkeletonDataInfos() const {
    std::vector<SkeletonDataInfo *> infos;
    infos.reserve(_dataMap.size());
    for (const auto &pair : _dataMap) {
        infos.push_back(pair.second);
    }
    return infos;
}

SkeletonData *SkeletonDataMgr::retainByUUID(const std::string &uuid) {
    auto dataIt = _dataMap.find(uuid);
    if (dataIt == _dataMap.end()) {
        return nullptr;
    }
    return dataIt->second->data;
}

void SkeletonDataMgr::releaseByUUID(const std::string &uuid) {
    auto dataIt = _dataMap.find(uuid);
    if (dataIt == _dataMap.end()) {
        return;
    }
    SkeletonDataInfo *info = dataIt->second;
    _dataMap.erase(dataIt);
    if (_destroyCallback) {
        for (auto &item : info->texturesIndex) {
            _destroyCallback(item);
        }
    }
    delete info;
}
