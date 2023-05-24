/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "base/Macros.h"
#include "base/std/container/string.h"

namespace cc {

namespace core {

struct ISchedulable {
    ccstd::string id;
    ccstd::string uuid;
};

enum struct Priority : uint32_t {
    LOW = 0,
    MEDIUM = 100,
    HIGH = 200,
    SCHEDULER = UINT32_MAX,
};

class System : public ISchedulable {
private:
    /* data */
protected:
    Priority _priority{Priority::LOW};
    bool _executeInEditMode{false};

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

    System() = default;
    virtual ~System() = default;

    inline const ccstd::string &getId() { return id; }
    inline void setId(ccstd::string &s) { id = s; }

    inline Priority getPriority() const { return _priority; }
    inline void setPriority(Priority i) { _priority = i; }

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
