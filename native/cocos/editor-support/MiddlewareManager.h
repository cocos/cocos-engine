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

#include "MeshBuffer.h"
#include <map>
#include <vector>
#include "base/CCRef.h"
#include "MiddlewareMacro.h"

MIDDLEWARE_BEGIN

/**
 * All middleware must implement IMiddleware interface.
 */
class IMiddleware {
public:
    IMiddleware() {}
    virtual ~IMiddleware() {}
    virtual void update(float dt) = 0;
    virtual void render(float dt) = 0;
};

/**
 * Update all middleware,and fill vertex and index into buffer,
 * and then upload vertex buffer,index buffer to opengl.
 */
class MiddlewareManager {
public:
    static MiddlewareManager* getInstance()
    {
        if (_instance == nullptr)
        {
            _instance = new MiddlewareManager;
        }
        
        return _instance;
    }
    
    static void destroyInstance()
    {
        if (_instance)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
    
    static uint8_t generateModuleID()
    {
        static uint8_t uniqueId = 0;
        uniqueId++;
        return uniqueId;
    }
    
    /**
     * @brief update all elements
     * @param[in] dt Delta time.
     */
    void update(float dt);
    
    /**
     * @brief render all elements
     */
    void render(float dt);
    
    /**
     * @brief Third party module add in _updateMap,it will update perframe.
     * @param[in] editor Module must implement IMiddleware interface.
     */
    void addTimer(IMiddleware* editor);
    
    /**
     * @brief Third party module remove from _updateMap,it will stop update.
     * @param[in] editor Module must implement IMiddleware interface.
     */
    void removeTimer(IMiddleware* editor);
    
    MeshBuffer* getMeshBuffer(int format);
    
    MiddlewareManager();
    ~MiddlewareManager();
    
    // If manager is traversing _updateMap, will set the flag untill traverse is finished.
    bool isRendering = false;
    bool isUpdating = false;
private:
    void _clearRemoveList();
private:

    std::vector<IMiddleware*> _updateList;
    std::vector<IMiddleware*> _removeList;
    std::map<int, MeshBuffer*> _mbMap;
    
    static MiddlewareManager* _instance;
};
MIDDLEWARE_END
