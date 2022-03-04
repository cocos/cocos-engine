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
#include "base/Macros.h"

namespace cc {

namespace core {

struct ISchedulable {
    std::string id;
    std::string uuid;
};

enum struct Priority : uint32_t {
    LOW       = 0,
    MEDIUM    = 100,
    HIGH      = 200,
    SCHEDULER = UINT32_MAX,
};

class System : public ISchedulable {
private:
    /* data */
protected:
    Priority _priority{Priority::LOW};
    bool     _executeInEditMode{false};

public:
    /**
     * @en Sorting between different systems.
     * @zh 不同系统间排序。
     * @param a System a
     * @param b System b
     */
    static int32_t sortByPriority(System *a, System *b) {
        if (a->_priority < b->_priority) return 1;
        if (a->_priority > b->_priority) return -1;
        return 0;
    }

    System()          = default;
    virtual ~System() = default;

    inline const std::string &getId() { return id; }
    inline void               setId(std::string &s) { id = s; }

    inline Priority getPriority() const { return _priority; }
    inline void     setPriority(Priority i) { _priority = i; }

    inline bool getExecuteInEditMode() const { return _executeInEditMode; }
    inline void setExecuteInEditMode(bool b) { _executeInEditMode = b; }

    /**
     * @en Init the system, will be invoked by [[Director]] when registered, should be implemented if needed.
     * @zh 系统初始化函数，会在注册时被 [[Director]] 调用，如果需要的话应该由子类实现
     */
    virtual void init() = 0;

    /**
     * @en Update function of the system, it will be invoked between all components update phase and late update phase.
     * @zh 系统的帧更新函数，它会在所有组件的 update 和 lateUpdate 之间被调用
     * @param dt Delta time after the last frame
     */
    virtual void update(float dt) = 0;

    /**
     * @en Post update function of the system, it will be invoked after all components late update phase and before the rendering process.
     * @zh 系统的帧后处理函数，它会在所有组件的 lateUpdate 之后以及渲染之前被调用
     * @param dt Delta time after the last frame
     */
    virtual void postUpdate(float dt) = 0;
};

} // namespace core

} // namespace cc
