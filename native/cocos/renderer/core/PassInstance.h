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

#include "base/std/optional.h"
#include "scene/Pass.h"

namespace cc {
class MaterialInstance;
/**
 * @en A pass instance defines an variant version of the [[Pass]]
 * @zh 表示 [[Pass]] 的一种特殊实例
 */
class PassInstance final : public scene::Pass {
public:
    using Super = scene::Pass;

    PassInstance(scene::Pass *parent, MaterialInstance *owner);
    ~PassInstance() override;
    /**
     * @en The parent pass
     * @zh 相关联的原始 Pass
     */
    scene::Pass *getParent() const;

    /**
     * @en Override pipeline states with the given pass override info.
     * This won't affect the original pass
     * @zh 重载当前 Pass 的管线状态。这不会影响原始 Pass
     * @param original The original pass info
     * @param value The override pipeline state info
     */
    void overridePipelineStates(const IPassInfo &original, const PassOverrides &override) override;

    bool tryCompile(const ccstd::optional<MacroRecord> &defineOverrides) override;

    /**
     * @en Prepare to change states of the pass and do not notify the material to rebuild the pipeline state object
     * @zh 开始静默修改 Pass 相关状态，不会通知材质去重新构建管线状态对象。
     */
    void beginChangeStatesSilently() override;

    /**
     * @en End the silent states changing process, all state changes will be notified.
     * @zh 结束静默状态修改，所有修改将会开始通知材质。
     */
    void endChangeStatesSilently() override;

protected:
    void syncBatchingScheme() override;

    void onStateChange();

private:
    IntrusivePtr<scene::Pass> _parent;
    // Weak reference.
    MaterialInstance *_owner{nullptr};
    bool _dontNotify{false};
};

} // namespace cc
