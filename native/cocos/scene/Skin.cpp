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

#include "scene/Skin.h"

namespace cc {
namespace scene {
void SkinInfo::setEnabled(bool val) {
    if (_enabled == val) {
        return;
    }

    _enabled = val;
    if (_resource != nullptr) {
        _resource->setEnabled(val);
    }
}

void SkinInfo::setBlurRadius(float val) {
    _blurRadius = val;
    if (_resource != nullptr) {
        _resource->setBlurRadius(val);
    }
}

void SkinInfo::setSSSIntensity(float val) {
    _sssIntensity = val;

    if (_resource != nullptr) {
        _resource->setSSSIntensity(val);
    }
}

void SkinInfo::activate(Skin *resource) {
    _resource = resource;
    _resource->initialize(*this);
}

void Skin::initialize(const SkinInfo &skinInfo) {
    setEnabled(skinInfo.isEnabled());
    setBlurRadius(skinInfo.getBlurRadius());
    setSSSIntensity(skinInfo.getSSSIntensity());
}

} // namespace scene
} // namespace cc
