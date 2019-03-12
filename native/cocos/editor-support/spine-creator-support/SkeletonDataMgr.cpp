/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.
 
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
