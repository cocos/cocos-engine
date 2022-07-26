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

using namespace spine; //NOLINT

namespace spine {

class SkeletonDataInfo {
public:
    SkeletonDataInfo() = default;

    ~SkeletonDataInfo() {
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
    }

    SkeletonData *data = nullptr;
    Atlas *atlas = nullptr;
    AttachmentLoader *attachmentLoader = nullptr;
    std::vector<int> texturesIndex;
};

} // namespace spine

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
