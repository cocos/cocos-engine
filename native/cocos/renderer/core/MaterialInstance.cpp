/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
***************************************************************************/

#include "renderer/core/MaterialInstance.h"
// #include "core/components/RenderableComponent.h"
#include "renderer/core/PassInstance.h"

namespace cc {

MaterialInstance::MaterialInstance(const IMaterialInstanceInfo &info) {
    _parent = info.parent;
    //    _owner       = info.owner;
    _subModelIdx = info.subModelIdx;
    copy(_parent);
}

void MaterialInstance::recompileShaders(const MacroRecord &overrides, index_t passIdx /* = CC_INVALID_INDEX */) {
    auto &passes = *_passes;
    if (passes.empty() || _effectAsset == nullptr) {
        return;
    }

    if (passIdx == CC_INVALID_INDEX) {
        for (const auto &pass : passes) {
            pass->tryCompile(overrides);
        }
    } else {
        if (passIdx < passes.size()) {
            auto *pass = passes[passIdx].get();
            pass->tryCompile(overrides);
        }
    }
}

void MaterialInstance::overridePipelineStates(const PassOverrides &overrides, index_t passIdx /* = CC_INVALID_INDEX */) {
    auto &passes = *_passes;
    if (passes.empty() || _effectAsset == nullptr) {
        return;
    }

    ccstd::vector<IPassInfoFull> &passInfos = _effectAsset->_techniques[getTechniqueIndex()].passes;
    if (passIdx == CC_INVALID_INDEX) {
        for (size_t i = 0, len = passes.size(); i < len; i++) {
            auto *pass = passes[i].get();
            if (i >= _states.size()) {
                _states.resize(i + 1);
            }
            auto &state = _states[i];
            state.overrides(IPassInfoFull(overrides));
            pass->overridePipelineStates(passInfos[pass->getPassIndex()], state);
        }
    } else {
        if (passIdx >= _states.size()) {
            _states.resize(passIdx + 1);
        }
        auto &state = _states[passIdx];
        state.overrides(IPassInfoFull(overrides));
        passes[passIdx]->overridePipelineStates(passInfos[passIdx], state);
    }
}

bool MaterialInstance::destroy() {
    doDestroy();
    return true;
}

ccstd::vector<IntrusivePtr<scene::Pass>> MaterialInstance::createPasses() {
    ccstd::vector<IntrusivePtr<scene::Pass>> passes;
    auto &parentPasses = _parent->getPasses();

    passes.reserve(parentPasses->size());
    for (auto &parentPass : *parentPasses) {
        passes.emplace_back(ccnew PassInstance(parentPass, this));
    }
    return passes;
}

void MaterialInstance::onPassStateChange(bool dontNotify) {
    _hash = Material::getHashForMaterial(this);
    if (!dontNotify) {
        if (_rebuildPSOCallback != nullptr) {
            _rebuildPSOCallback(_subModelIdx, this);
        }

        //        if (_owner != nullptr) {
        //            _owner->onRebuildPSO(_subModelIdx, this);
        //        }
    }
}

void MaterialInstance::setRebuildPSOCallback(const RebuildPSOCallback &cb) {
    _rebuildPSOCallback = cb;
}

} // namespace cc
