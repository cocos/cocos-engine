/******************************************************************************
 * Spine Runtimes Software License v2.5
 *
 * Copyright (c) 2013-2016, Esoteric Software
 * All rights reserved.
 *
 * You are granted a perpetual, non-exclusive, non-sublicensable, and
 * non-transferable license to use, install, execute, and perform the Spine
 * Runtimes software and derivative works solely for personal or internal
 * use. Without the written permission of Esoteric Software (see Section 2 of
 * the Spine Software License Agreement), you may not (a) modify, translate,
 * adapt, or develop new applications using the Spine Runtimes or otherwise
 * create derivative works or improvements of the Spine Runtimes or (b) remove,
 * delete, alter, or obscure any trademarks or any copyright, trademark, patent,
 * or other intellectual property or proprietary rights notices on or in the
 * Software, including any copy thereof. Redistributions in binary or source
 * form must include this license and terms.
 *
 * THIS SOFTWARE IS PROVIDED BY ESOTERIC SOFTWARE "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL ESOTERIC SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, BUSINESS INTERRUPTION, OR LOSS OF
 * USE, DATA, OR PROFITS) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#include "SkeletonDataMgr.h"
#include <algorithm>

using namespace spine;

class SkeletonDataInfo;
static std::map<std::string, SkeletonDataInfo*> _dataMap;

class SkeletonDataInfo : public cocos2d::Ref{
public:
    SkeletonDataInfo (const std::string& uuid)
    {
        _uuid = uuid;
    }
    
    ~SkeletonDataInfo ()
    {
        if (data)
        {
            spSkeletonData_dispose(data);
            data = nullptr;
        }
        
        if (atlas)
        {
            spAtlas_dispose(atlas);
            atlas = nullptr;
        }
        
        if (attachmentLoader)
        {
            spAttachmentLoader_dispose(attachmentLoader);
            attachmentLoader = nullptr;
        }
    }
    
    spSkeletonData* data = nullptr;
    spAtlas* atlas = nullptr;
    spAttachmentLoader* attachmentLoader = nullptr;
    std::string _uuid;
};

SkeletonDataMgr* SkeletonDataMgr::_instance = nullptr;

bool SkeletonDataMgr::hasSkeletonData (const std::string& uuid)
{
    auto it = _dataMap.find(uuid);
    return it != _dataMap.end();
}

void SkeletonDataMgr::setSkeletonData (const std::string& uuid, spSkeletonData* data, spAtlas* atlas, spAttachmentLoader* attachmentLoader)
{
    auto it = _dataMap.find(uuid);
    if (it != _dataMap.end())
    {
        releaseByUUID(uuid);
    }
    SkeletonDataInfo* info = new SkeletonDataInfo(uuid);
    info->data = data;
    info->atlas = atlas;
    info->attachmentLoader = attachmentLoader;
    _dataMap[uuid] = info;
}

spSkeletonData* SkeletonDataMgr::retainByUUID (const std::string& uuid)
{
    auto dataIt = _dataMap.find(uuid);
    if (dataIt == _dataMap.end())
    {
        return nullptr;
    }
    dataIt->second->retain();
    return dataIt->second->data;
}

void SkeletonDataMgr::releaseByUUID (const std::string& uuid)
{
    auto dataIt = _dataMap.find(uuid);
    if (dataIt == _dataMap.end())
    {
        return;
    }
    SkeletonDataInfo* info = dataIt->second;
    // If info reference count is 1, then info will be destroy.
    if (info->getReferenceCount() == 1)
    {
        _dataMap.erase(dataIt);
    }
    info->release();
}
