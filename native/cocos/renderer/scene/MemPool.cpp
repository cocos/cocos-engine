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

#include "MemPool.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "base/ccMacros.h"

RENDERER_BEGIN

UnitBase::UnitBase()
{
    
}

UnitBase::~UnitBase()
{
    
}

void UnitBase::set(se::Object** dataObj, uint8_t** data, std::size_t* dataLen, se::Object* jsData)
{
    if (*dataObj == jsData) return;
    
    if (*dataObj)
    {
        (*dataObj)->unroot();
        (*dataObj)->decRef();
        *dataObj = nullptr;
    }
    
    if (jsData == nullptr) return;
    
    *dataObj = jsData;
    (*dataObj)->root();
    (*dataObj)->incRef();
    *data = nullptr;
    *dataLen = 0;
    (*dataObj)->getTypedArrayData(data, dataLen);
}

void UnitBase::unset(se::Object** dataObj, uint8_t** data, std::size_t* dataLen)
{
    if (*dataObj)
    {
        (*dataObj)->unroot();
        (*dataObj)->decRef();
        *dataObj = nullptr;
    }
    
    *data = nullptr;
    *dataLen = 0;
}

UnitCommon::UnitCommon()
{
    
}

UnitCommon::~UnitCommon()
{
    unset(&dataObj, (uint8_t**)&data, &dataLen);
    unset(&signDataObj, (uint8_t**)&signData, &signDataLen);
}

void UnitCommon::setData(se::Object* jsData)
{
    set(&dataObj, (uint8_t**)&data, &dataLen, jsData);
}

void UnitCommon::setSignData(se::Object* jsSignData)
{
    set(&signDataObj, (uint8_t**)&signData, &signDataLen, jsSignData);
}

MemPool::MemPool()
{
    
}

MemPool::~MemPool()
{
    for(auto it = _commonPool.begin(); it != _commonPool.end(); it++)
    {
        if (*it)
        {
            delete (*it);
        }
    }
    _commonPool.clear();
}

void MemPool::removeCommonData(std::size_t unitID)
{
    CCASSERT(unitID < _commonPool.size(), "MemPool removeCommonData unitID can not be rather than pool size");
    auto unit = _commonPool[unitID];
    if (unit) 
    {
        for (auto it = _commonList.begin(); it != _commonList.end(); it++)
        {
            if ((*it)->unitID == unitID)
            {
                _commonList.erase(it);
                break;
            }
        }
        delete unit;
        _commonPool[unitID] = nullptr;
    }
}

void MemPool::updateCommonData(std::size_t unitID, se_object_ptr dataObj, se_object_ptr signDataObj)
{
    CCASSERT(unitID <= _commonPool.size(), "MemPool updateData unitID can not be rather than pool size");
    
    UnitCommon* unit = nullptr;
    if (unitID == _commonPool.size())
    {
        unit = new UnitCommon;
        _commonPool.push_back(unit);
        _commonList.push_back(unit);
    }
    else if (unitID < _commonPool.size())
    {
        unit = _commonPool[unitID];
        if (!unit) 
        {
            unit = new UnitCommon;
            _commonPool[unitID] = unit;
            _commonList.push_back(unit);
        }
    }
    else
    {
        return;
    }
    
    unit->unitID = unitID;
    unit->setData(dataObj);
    unit->setSignData(signDataObj);
}

const std::vector<UnitCommon*>& MemPool::getCommonPool() const
{
    return _commonPool;
}

const std::vector<UnitCommon*>& MemPool::getCommonList() const
{
    return _commonList;
}

UnitCommon* MemPool::getCommonUnit(std::size_t unitID)
{
    CCASSERT(unitID < _commonPool.size(), "MemPool getCommonUnit unitID can not be rather than pool size");
    return _commonPool[unitID];
}

RENDERER_END
