/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include <map>
#include <vector>
#include "MeshBuffer.h"
#include "MiddlewareMacro.h"
#include "SharedBufferManager.h"
#include "base/RefCounted.h"

MIDDLEWARE_BEGIN

/**
 * All middleware must implement IMiddleware interface.
 */
class IMiddleware {
public:
    IMiddleware() = default;
    virtual ~IMiddleware() = default;
    virtual void update(float dt) = 0;
    virtual void render(float dt) = 0;
    virtual uint32_t getRenderOrder() const = 0;
};

/**
 * Update all middleware,and fill vertex and index into buffer,
 * and then upload vertex buffer,index buffer to opengl.
 */
class MiddlewareManager {
public:
    static MiddlewareManager *getInstance() {
        if (instance == nullptr) {
            instance = new MiddlewareManager;
        }

        return instance;
    }

    static void destroyInstance() {
        if (instance) {
            delete instance;
            instance = nullptr;
        }
    }

    static uint8_t generateModuleID() {
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
    void addTimer(IMiddleware *editor);

    /**
     * @brief Third party module remove from _updateMap,it will stop update.
     * @param[in] editor Module must implement IMiddleware interface.
     */
    void removeTimer(IMiddleware *editor);

    MeshBuffer *getMeshBuffer(int format);

    se_object_ptr getVBTypedArray(int format, int bufferPos);
    se_object_ptr getIBTypedArray(int format, int bufferPos);
    std::size_t   getBufferCount(int format);
    std::size_t   getVBTypedArrayLength(int format, std::size_t bufferPos);
    std::size_t   getIBTypedArrayLength(int format, std::size_t bufferPos);

    SharedBufferManager *getRenderInfoMgr();
    SharedBufferManager *getAttachInfoMgr();

    MiddlewareManager();
    ~MiddlewareManager();

    // If manager is traversing _updateMap, will set the flag untill traverse is finished.
    bool isRendering = false;
    bool isUpdating  = false;

private:
    void clearRemoveList();

    std::vector<IMiddleware *> _updateList;
    std::vector<IMiddleware *> _removeList;
    std::map<int, MeshBuffer *> _mbMap;

    SharedBufferManager _renderInfo;
    SharedBufferManager _attachInfo;

    static MiddlewareManager *instance;
};
MIDDLEWARE_END
