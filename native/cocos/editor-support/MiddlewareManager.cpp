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

#include "MiddlewareManager.h"
#include "SeApi.h"
#include <algorithm>

MIDDLEWARE_BEGIN

MiddlewareManager *MiddlewareManager::instance = nullptr;

MiddlewareManager::MiddlewareManager() : _renderInfo(se::Object::TypedArrayType::UINT32),
                                         _attachInfo(se::Object::TypedArrayType::FLOAT32) {
}

MiddlewareManager::~MiddlewareManager() {
    for (auto it : _mbMap) {
        auto *buffer = it.second;
        
            delete buffer;
        
    }
    _mbMap.clear();
}

MeshBuffer *MiddlewareManager::getMeshBuffer(int format) {
    MeshBuffer *mb = _mbMap[format];
    if (!mb) {
        mb = new MeshBuffer(format);
        _mbMap[format] = mb;
    }
    return mb;
}

void MiddlewareManager::clearRemoveList() {
    for (auto *editor : _removeList) {
        auto it = std::find(_updateList.begin(), _updateList.end(), editor);
        if (it != _updateList.end()) {
            _updateList.erase(it);
        }
    }

    _removeList.clear();
}

void MiddlewareManager::update(float dt) {
    isUpdating = true;

    _renderInfo.reset();
    auto *renderBuffer = _renderInfo.getBuffer();
    if (renderBuffer) {
        renderBuffer->writeUint32(0);
    }

    _attachInfo.reset();
    auto *attachBuffer = _attachInfo.getBuffer();
    if (attachBuffer) {
        attachBuffer->writeUint32(0);
    }

    auto isOrderDirty = false;
    uint32_t maxRenderOrder = 0;
    for (auto *editor : _updateList) {
        uint32_t renderOrder = maxRenderOrder;
        if (!_removeList.empty()) {
            auto removeIt = std::find(_removeList.begin(), _removeList.end(), editor);
            if (removeIt == _removeList.end()) {
                editor->update(dt);
                renderOrder = editor->getRenderOrder();
            }
        } else {
            editor->update(dt);
            renderOrder = editor->getRenderOrder();
        }

        if (maxRenderOrder > renderOrder) {
            isOrderDirty = true;
        } else {
            maxRenderOrder = renderOrder;
        }
    }

    isUpdating = false;

    clearRemoveList();

    if (isOrderDirty) {
        std::sort(_updateList.begin(), _updateList.end(), [](IMiddleware *it1, IMiddleware *it2) {
            return it1->getRenderOrder() < it2->getRenderOrder();
        });
    }
}

void MiddlewareManager::render(float dt) {
    for (auto it : _mbMap) {
        auto *buffer = it.second;
        if (buffer) {
            buffer->reset();
        }
    }

    isRendering = true;

    for (auto *editor : _updateList) {
        if (!_removeList.empty()) {
            auto removeIt = std::find(_removeList.begin(), _removeList.end(), editor);
            if (removeIt == _removeList.end()) {
                editor->render(dt);
            }
        } else {
            editor->render(dt);
        }
    }

    isRendering = false;

    for (auto it : _mbMap) {
        auto *buffer = it.second;
        if (buffer) {
            buffer->uploadIB();
            buffer->uploadVB();
        }
    }

    clearRemoveList();
}

void MiddlewareManager::addTimer(IMiddleware *editor) {
    auto it0 = std::find(_updateList.begin(), _updateList.end(), editor);
    if (it0 != _updateList.end()) {
        return;
    }

    auto it1 = std::find(_removeList.begin(), _removeList.end(), editor);
    if (it1 != _removeList.end()) {
        _removeList.erase(it1);
    }
    _updateList.push_back(editor);
}

void MiddlewareManager::removeTimer(IMiddleware *editor) {
    if (isUpdating || isRendering) {
        _removeList.push_back(editor);
    } else {
        auto it = std::find(_updateList.begin(), _updateList.end(), editor);
        if (it != _updateList.end()) {
            _updateList.erase(it);
        }
    }
}

se_object_ptr MiddlewareManager::getVBTypedArray(int format, int bufferPos) {
    MeshBuffer *mb = _mbMap[format];
    if (!mb) return nullptr;
    return mb->getVBTypedArray(bufferPos);
}

se_object_ptr MiddlewareManager::getIBTypedArray(int format, int bufferPos) {
    MeshBuffer *mb = _mbMap[format];
    if (!mb) return nullptr;
    return mb->getIBTypedArray(bufferPos);
}

SharedBufferManager *MiddlewareManager::getRenderInfoMgr() {
    return &_renderInfo;
}

SharedBufferManager *MiddlewareManager::getAttachInfoMgr() {
    return &_attachInfo;
}

std::size_t MiddlewareManager::getVBTypedArrayLength(int format, std::size_t bufferPos) {
    MeshBuffer *mb = _mbMap[format];
    if (!mb) return 0;
    return mb->getVBTypedArrayLength(bufferPos);
}

std::size_t MiddlewareManager::getIBTypedArrayLength(int format, std::size_t bufferPos) {
    MeshBuffer *mb = _mbMap[format];
    if (!mb) return 0;
    return mb->getIBTypedArrayLength(bufferPos);
}

std::size_t MiddlewareManager::getBufferCount(int format) {
    MeshBuffer *mb = getMeshBuffer(format);
    if (!mb) return 0;
    return mb->getBufferCount();
}

MIDDLEWARE_END
