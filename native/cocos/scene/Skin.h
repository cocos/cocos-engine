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

#pragma once

#include "base/RefCounted.h"

namespace cc {
namespace scene {
class Skin;

class SkinInfo : public RefCounted {
public:
    SkinInfo() = default;
    ~SkinInfo() override = default;

    /**
     * @en Enable skip.
     * @zh 是否开启皮肤后效。
     */
    void setEnabled(bool val);
    inline bool isEnabled() const {
        return _enabled;
    }

    /**
     * @en Getter/Setter sampler width.
     * @zh 设置或者获取采样宽度。
     */
    void setBlurRadius(float val);
    inline float getBlurRadius() const {
        return _blurRadius;
    }

    /**
     * @en Getter/Setter depth unit scale.
     * @zh 设置或者获取深度单位比例。
     */
    void setSSSIntensity(float val);
    inline float getSSSIntensity() const {
        return _sssIntensity;
    }

    void activate(Skin *resource);

    bool _enabled{true};

    Skin *_resource{nullptr};

    float _blurRadius{0.01F};
    float _sssIntensity{3.F};
};

class Skin final {
public:
    Skin() = default;
    ~Skin() = default;

    void initialize(const SkinInfo &skinInfo);

    /**
     * @en Enable skip.
     * @zh 是否开启皮肤后效。
     */
    inline bool isEnabled() const { return _enabled; }
    inline void setEnabled(bool val) {
        _enabled = val;
    }

    /**
     * @en Getter/Setter sampler width.
     * @zh 设置或者获取采样宽度。
     */
    inline float getBlurRadius() const {
        return _blurRadius;
    }
    inline void setBlurRadius(float val) {
        _blurRadius = val;
    }

    /**
     * @en Getter/Setter depth unit scale.
     * @zh 设置或者获取深度单位比例。
     */
    inline float getSSSIntensity() const {
        return _sssIntensity;
    }
    inline void setSSSIntensity(float val) {
        _sssIntensity = val;
    }

private:
    bool _enabled{true};

    float _blurRadius{0.01F};
    float _sssIntensity{3.F};
};

} // namespace scene
} // namespace cc
