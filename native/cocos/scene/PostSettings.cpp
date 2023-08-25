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

#include "scene/PostSettings.h"
#include "core/Root.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
namespace cc {
namespace scene {

void PostSettingsInfo::activate(PostSettings *resource) {
    _resource = resource;
    if (_resource != nullptr) {
        _resource->initialize(*this);
        _resource->activate();
    }
}
void PostSettingsInfo::setToneMappingType(ToneMappingType toneMappingType) {
    _toneMappingType = toneMappingType;

    if (_resource != nullptr) {
        _resource->setToneMappingType(toneMappingType);
    }
}

void PostSettings::activate() {
    _activated = true;
    updatePipeline();
}

void PostSettings::initialize(const PostSettingsInfo &postSettingsInfo) {
    _activated = false;
    _toneMappingType = postSettingsInfo.getToneMappingType();
}

void PostSettings::setToneMappingType(ToneMappingType toneMappingType) {
    _toneMappingType = toneMappingType;
    updatePipeline();
}

void PostSettings::updatePipeline() const {
    
    Root *root = Root::getInstance();
    auto *pipeline = root->getPipeline();

    pipeline->setValue("CC_TONE_MAPPING_TYPE", static_cast<int32_t>(_toneMappingType));

    if (_activated)
    {
        root->onGlobalPipelineStateChanged();
    }
}

} // namespace scene
} // namespace cc
