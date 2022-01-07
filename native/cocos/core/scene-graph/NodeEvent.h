/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
 
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
#include <string>
#include "core/event/CallbacksInvoker.h"

namespace cc {

class NodeEventType {
public:
    static const CallbacksInvoker::KeyType TOUCH_START;
    static const CallbacksInvoker::KeyType TOUCH_MOVE;
    static const CallbacksInvoker::KeyType TOUCH_END;
    static const CallbacksInvoker::KeyType TOUCH_CANCEL;
    static const CallbacksInvoker::KeyType MOUSE_DOWN;
    static const CallbacksInvoker::KeyType MOUSE_MOVE;
    static const CallbacksInvoker::KeyType MOUSE_UP;
    static const CallbacksInvoker::KeyType MOUSE_WHEEL;
    static const CallbacksInvoker::KeyType MOUSE_ENTER;
    static const CallbacksInvoker::KeyType MOUSE_LEAVE;
    static const CallbacksInvoker::KeyType KEY_DOWN;
    static const CallbacksInvoker::KeyType KEY_UP;
    static const CallbacksInvoker::KeyType DEVICEMOTION;
    static const CallbacksInvoker::KeyType TRANSFORM_CHANGED;
    static const CallbacksInvoker::KeyType SCENE_CHANGED_FOR_PERSISTS;
    static const CallbacksInvoker::KeyType SIZE_CHANGED;
    static const CallbacksInvoker::KeyType ANCHOR_CHANGED;
    static const CallbacksInvoker::KeyType COLOR_CHANGED;
    static const CallbacksInvoker::KeyType CHILD_ADDED;
    static const CallbacksInvoker::KeyType CHILD_REMOVED;
    static const CallbacksInvoker::KeyType PARENT_CHANGED;
    static const CallbacksInvoker::KeyType NODE_DESTROYED;
    static const CallbacksInvoker::KeyType LAYER_CHANGED;
    static const CallbacksInvoker::KeyType SIBLING_ORDER_CHANGED;
    static const CallbacksInvoker::KeyType ACTIVE_IN_HIERARCHY_CHANGED;
};

} // namespace cc
