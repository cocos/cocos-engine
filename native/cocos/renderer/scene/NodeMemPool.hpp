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

#include "MemPool.hpp"
#include "math/Mat4.h"

RENDERER_BEGIN

class NodeProxy;

struct TRS {
    float x;
    float y;
    float z;
    float qx;
    float qy;
    float qz;
    float qw;
    float sx;
    float sy;
    float sz;
};

#define PARENT_INVALID 0xffffffff
struct ParentInfo {
    uint32_t unitID;
    uint32_t index;
};

class UnitNode: public UnitBase {
public:
    UnitNode();
    virtual ~UnitNode();
    void setDirty(se::Object* jsData);
    void setTRS(se::Object* jsData);
    void setLocalMat(se::Object* jsData);
    void setWorldMat(se::Object* jsData);
    void setParent(se::Object* jsData);
    void setZOrder(se::Object* jsData);
    void setCullingMask(se::Object* jsData);
    void setOpacity(se::Object* jsData);
    void setIs3D(se::Object* jsData);
    void setNode(se::Object* jsData);
    void setLevel(se::Object* jsData);
    
    uint32_t* getDirty(std::size_t index)
    {
        return dirtyData + index;
    }
    
    TRS* getTRS(std::size_t index)
    {
        return (TRS*)trsData + index;
    }
    
    cocos2d::Mat4* getLocalMat(std::size_t index)
    {
        return (cocos2d::Mat4*)localMatData + index;
    }
    
    cocos2d::Mat4* getWorldMat(std::size_t index)
    {
        return (cocos2d::Mat4*)worldMatData + index;
    }
    
    ParentInfo* getParent(std::size_t index)
    {
        return (ParentInfo*)parentData + index;
    }
    
    int32_t* getZOrder(std::size_t index)
    {
        return zOrderData + index;
    }
    
    int32_t* getCullingMask(std::size_t index)
    {
        return cullingMaskData + index;
    }
    
    uint8_t* getOpacity(std::size_t index)
    {
        return opacityData + index;
    }
    
    uint8_t* getIs3D(std::size_t index)
    {
        return is3DData + index;
    }
    
    uint64_t* getNode(std::size_t index)
    {
        return nodeData + index;
    }
protected:
    se::Object* dirty = nullptr;
    uint32_t* dirtyData = nullptr;
    std::size_t dirtyLen = 0;
    
    se::Object* trs = nullptr;
    float_t* trsData = nullptr;
    std::size_t trsLen = 0;
    
    se::Object* localMat = nullptr;
    float_t* localMatData = nullptr;
    std::size_t localMatLen = 0;
    
    se::Object* worldMat = nullptr;
    float_t* worldMatData = nullptr;
    std::size_t worldMatLen = 0;
    
    se::Object* parent = nullptr;
    uint32_t* parentData = nullptr;
    std::size_t parentLen = 0;
    
    se::Object* zOrder = nullptr;
    int32_t* zOrderData = nullptr;
    std::size_t zOrderLen = 0;
    
    se::Object* cullingMask = nullptr;
    int32_t* cullingMaskData = nullptr;
    std::size_t cullingMaskLen = 0;
    
    se::Object* opacity = nullptr;
    uint8_t* opacityData = nullptr;
    std::size_t opacityLen = 0;
    
    se::Object* is3D = nullptr;
    uint8_t* is3DData = nullptr;
    std::size_t is3DLen = 0;
    
    se::Object* node = nullptr;
    uint64_t* nodeData = nullptr;
    std::size_t nodeLen = 0;
};

class NodeMemPool: public MemPool {
public:
    NodeMemPool();
    virtual ~NodeMemPool();
    
    static NodeMemPool* getInstance()
    {
        return _instance;
    }
    
    void removeNodeData(std::size_t unitID);

    void updateNodeData(std::size_t unitID, se_object_ptr dirty, se_object_ptr trs, se_object_ptr localMat, se_object_ptr worldMat, se_object_ptr parent, se_object_ptr zOrder, se_object_ptr cullingMask, se_object_ptr opacity, se_object_ptr is3D, se_object_ptr node);
    
    UnitNode* getUnit(std::size_t unitID) const;
    const std::vector<UnitNode*>& getNodePool() const;
private:
    static NodeMemPool* _instance;
    std::vector<UnitNode*> _nodePool;
};

RENDERER_END
