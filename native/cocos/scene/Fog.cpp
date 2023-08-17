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

#include "scene/Fog.h"
#include "core/Root.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
#include "renderer/pipeline/helper/Utils.h"

namespace cc {
namespace scene {

void FogInfo::setEnabled(bool val) const {
    if (_isEnabled == val) {
        return;
    }

    if (_resource != nullptr) {
        _resource->setEnabled(val);
        if (val) {
            _resource->setType(_type);
        }
    }
}

void FogInfo::setFogColor(const Color &val) {
    _fogColor.set(val);
    if (_resource != nullptr) {
        _resource->setFogColor(_fogColor);
    }
}

void FogInfo::setType(FogType val) {
    _type = val;
    if (_resource != nullptr) {
        _resource->setType(_type);
    }
}

void FogInfo::setFogDensity(float val) {
    _fogDensity = val;
    if (_resource) {
        _resource->setFogDensity(_fogDensity);
    }
}

void FogInfo::setFogStart(float val) {
    _fogStart = val;
    if (_resource != nullptr) {
        _resource->setFogStart(_fogStart);
    }
}

void FogInfo::setFogEnd(float val) {
    _fogEnd = val;
    if (_resource != nullptr) {
        _resource->setFogEnd(_fogEnd);
    }
}

void FogInfo::setFogAtten(float val) {
    _fogAtten = val;
    if (_resource != nullptr) {
        _resource->setFogAtten(_fogAtten);
    }
}

void FogInfo::setFogTop(float val) {
    _fogTop = val;
    if (_resource != nullptr) {
        _resource->setFogTop(_fogTop);
    }
}

void FogInfo::setFogRange(float val) {
    _fogRange = val;
    if (_resource != nullptr) {
        _resource->setFogRange(_fogRange);
    }
}

void FogInfo::activate(Fog *resource) {
    _resource = resource;
    _resource->initialize(*this);
    _resource->activate();
}

//
void Fog::initialize(const FogInfo &fogInfo) {
    _activated = false;
    setFogColor(fogInfo.getFogColor());
    _enabled = fogInfo.isEnabled();
    _accurate = fogInfo.isAccurate();
    _type = _enabled ? fogInfo.getType() : FogType::NONE;
    _fogDensity = fogInfo.getFogDensity();
    _fogStart = fogInfo.getFogStart();
    _fogEnd = fogInfo.getFogEnd();
    _fogAtten = fogInfo.getFogAtten();
    _fogTop = fogInfo.getFogTop();
    _fogRange = fogInfo.getFogRange();
}

void Fog::updatePipeline() {
    auto *root = Root::getInstance();
    const FogType value = _enabled ? _type : FogType::NONE;
    const int32_t accurateValue = isAccurate() ? 1 : 0;
    auto *pipeline = root->getPipeline();
    auto iterMacroFog = pipeline->getMacros().find("CC_USE_FOG");
    auto iterMacroAccurateFog = pipeline->getMacros().find("CC_USE_ACCURATE_FOG");
    if (iterMacroFog != pipeline->getMacros().end() && iterMacroAccurateFog != pipeline->getMacros().end()) {
        const MacroValue &macroFog = iterMacroFog->second;
        const MacroValue &macroAccurateFog = iterMacroAccurateFog->second;
        const int32_t *macroFogPtr = ccstd::get_if<int32_t>(&macroFog);
        const int32_t *macroAccurateFogPtr = ccstd::get_if<int32_t>(&macroAccurateFog);
        if (macroFogPtr != nullptr && *macroFogPtr == static_cast<int32_t>(value) && macroAccurateFogPtr != nullptr && *macroAccurateFogPtr == accurateValue) return;
    }

    pipeline->setValue("CC_USE_FOG", static_cast<int32_t>(value));
    pipeline->setValue("CC_USE_ACCURATE_FOG", accurateValue);
    if (_activated) {
        root->onGlobalPipelineStateChanged();
    }
}

void Fog::setFogColor(const Color &val) {
    _fogColor.set(val);
    Vec4 v4(static_cast<float>(val.r) / 255.F, static_cast<float>(val.g) / 255.F, static_cast<float>(val.b) / 255.F, static_cast<float>(val.a) / 255.F);
    pipeline::srgbToLinear(&_colorArray, v4);
}

} // namespace scene
} // namespace cc
