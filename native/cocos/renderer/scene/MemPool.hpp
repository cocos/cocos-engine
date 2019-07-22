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

#pragma once

#include "../Macro.h"
#include <vector>
#include "scripting/js-bindings/jswrapper/Object.hpp"

RENDERER_BEGIN

class UnitBase
{
public:
    UnitBase();
    virtual ~UnitBase();
    
    void set(se::Object** dataObj, uint8_t** data, std::size_t* dataLen, se::Object* jsData);
    void unset(se::Object** dataObj, uint8_t** data, std::size_t* dataLen);
    
    std::size_t unitID = 0;
};

struct Sign
{
    uint16_t nextFreeIndex;
    uint16_t freeFlag;
};

class UnitCommon: public UnitBase
{
public:
    UnitCommon();
    virtual ~UnitCommon();
    
    void setData(se::Object* jsData);
    void setSignData(se::Object* jsSignData);
    
    uint16_t getUsingNum()
    {
        return data[1];
    }
    
    Sign* getSignData(std::size_t index)
    {
        return (Sign*)signData + index;
    }
    
    std::size_t getContentNum()
    {
        return signDataLen / (sizeof(uint16_t) * 2);
    }
protected:
    se::Object* dataObj = nullptr;
    uint16_t* data = nullptr;
    std::size_t dataLen = 0;
    
    se::Object* signDataObj = nullptr;
    uint16_t* signData = nullptr;
    std::size_t signDataLen = 0;
};

class MemPool {
public:
    MemPool();
    virtual ~MemPool();
    
    void removeCommonData(std::size_t unitID);
    void updateCommonData(std::size_t unitID, se_object_ptr dataObj, se_object_ptr signDataObj);
    UnitCommon* getCommonUnit(std::size_t unitID);
    const std::vector<UnitCommon*>& getCommonPool() const;
    const std::vector<UnitCommon*>& getCommonList() const;
private:
    std::vector<UnitCommon*> _commonPool;
    std::vector<UnitCommon*> _commonList;
};

RENDERER_END
