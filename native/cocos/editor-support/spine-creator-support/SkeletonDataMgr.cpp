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

#include "SkeletonDataMgr.h"
#include <algorithm>

using namespace spine;

class SkeletonDataInfo;
static std::map<std::string, SkeletonDataInfo*> _dataMap;

class SkeletonDataInfo : public cocos2d::Ref {
public:
    SkeletonDataInfo (const std::string& uuid) {
        _uuid = uuid;
    }
    
    ~SkeletonDataInfo () {
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
    
    SkeletonData* data = nullptr;
    Atlas* atlas = nullptr;
    AttachmentLoader* attachmentLoader = nullptr;
    std::string _uuid;
};

SkeletonDataMgr* SkeletonDataMgr::_instance = nullptr;

bool SkeletonDataMgr::hasSkeletonData (const std::string& uuid) {
    auto it = _dataMap.find(uuid);
    return it != _dataMap.end();
}

void SkeletonDataMgr::setSkeletonData (const std::string& uuid, SkeletonData* data, Atlas* atlas, AttachmentLoader* attachmentLoader) {
    auto it = _dataMap.find(uuid);
    if (it != _dataMap.end()) {
        releaseByUUID(uuid);
    }
    SkeletonDataInfo* info = new SkeletonDataInfo(uuid);
    info->data = data;
    info->atlas = atlas;
    info->attachmentLoader = attachmentLoader;
    _dataMap[uuid] = info;
}

SkeletonData* SkeletonDataMgr::retainByUUID (const std::string& uuid) {
    auto dataIt = _dataMap.find(uuid);
    if (dataIt == _dataMap.end())
    {
        return nullptr;
    }
    dataIt->second->retain();
    return dataIt->second->data;
}

void SkeletonDataMgr::releaseByUUID (const std::string& uuid) {
    auto dataIt = _dataMap.find(uuid);
    if (dataIt == _dataMap.end()) {
        return;
    }
    SkeletonDataInfo* info = dataIt->second;
    // If info reference count is 1, then info will be destroy.
    if (info->getReferenceCount() == 1) {
        _dataMap.erase(dataIt);
    }
    info->release();
}
