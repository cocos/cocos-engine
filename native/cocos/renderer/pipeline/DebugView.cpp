/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#include "DebugView.h"
#include "custom/RenderInterfaceTypes.h"
#include "RenderPipeline.h"
#include "core/Root.h"

namespace cc {

namespace pipeline {

void DebugView::activate() {
    _singleMode = DebugViewSingleType::NONE;
    enableAllCompositeModeValue(true);
    _lightingWithAlbedo = true;
    _csmLayerColoration = false;
}

void DebugView::updatePipeline() {
    Root *root = Root::getInstance();
    auto *pipeline = root->getPipeline();

    auto useDebugViewValue = static_cast<int32_t>(getType());

    bool valueChanged = false;
    auto iter = pipeline->getMacros().find("CC_USE_DEBUG_VIEW");
    if (iter != pipeline->getMacros().end()) {
        const MacroValue &macroValue = iter->second;
        const int32_t *macroPtr = ccstd::get_if<int32_t>(&macroValue);
        if (macroPtr != nullptr && (*macroPtr != useDebugViewValue)) {
            pipeline->setValue("CC_USE_DEBUG_VIEW", useDebugViewValue);
            valueChanged = true;
        }
    } else {
        pipeline->setValue("CC_USE_DEBUG_VIEW", useDebugViewValue);
        valueChanged = true;
    }

    if (valueChanged) {
        root->onGlobalPipelineStateChanged();
    }
}

} // namespace pipeline
} // namespace cc
