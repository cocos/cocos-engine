/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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
*/

#pragma once
#include "base/TypeDef.h"

namespace cc {

namespace pipeline {

enum class RenderingDebugViewType {
    NONE,
    SINGLE,
    COMPOSITE_AND_MISC,
};

/**
 * @zh
 * 渲染单项调试模式
 * @en
 * Rendering single debug mode
 * @readonly
 */
enum class DebugViewSingleType {
    NONE,
    VERTEX_COLOR,
    VERTEX_NORMAL,
    VERTEX_TANGENT,
    WORLD_POS,
    VERTEX_MIRROR,
    FACE_SIDE,
    UV0,
    UV1,
    UV_LIGHTMAP,
    PROJ_DEPTH,
    LINEAR_DEPTH,

    FRAGMENT_NORMAL,
    FRAGMENT_TANGENT,
    FRAGMENT_BINORMAL,
    BASE_COLOR,
    DIFFUSE_COLOR,
    SPECULAR_COLOR,
    TRANSPARENCY,
    METALLIC,
    ROUGHNESS,
    SPECULAR_INTENSITY,
    IOR,

    DIRECT_DIFFUSE,
    DIRECT_SPECULAR,
    DIRECT_ALL,
    ENV_DIFFUSE,
    ENV_SPECULAR,
    ENV_ALL,
    EMISSIVE,
    LIGHT_MAP,
    SHADOW,
    AO,

    FRESNEL,
    DIRECT_TRANSMIT_DIFFUSE,
    DIRECT_TRANSMIT_SPECULAR,
    ENV_TRANSMIT_DIFFUSE,
    ENV_TRANSMIT_SPECULAR,
    TRANSMIT_ALL,
    DIRECT_TRT,
    ENV_TRT,
    TRT_ALL,

    FOG,
};

/**
 * @zh
 * 渲染组合调试模式
 * @en
 * Rendering composite debug mode
 * @readonly
 */
enum class DebugViewCompositeType {
    DIRECT_DIFFUSE = 0,
    DIRECT_SPECULAR,
    ENV_DIFFUSE,
    ENV_SPECULAR,
    EMISSIVE,
    LIGHT_MAP,
    SHADOW,
    AO,

    NORMAL_MAP,
    FOG,

    TONE_MAPPING,
    GAMMA_CORRECTION,

    FRESNEL,
    TRANSMIT_DIFFUSE,
    TRANSMIT_SPECULAR,
    TRT,

    MAX_BIT_COUNT
};

/**
 * @en Rendering debug view control class
 * @zh 渲染调试控制类
 */
// @ccclass('cc.DebugView')
// @help('i18n:cc.DebugView')
class DebugView final {
public:
    DebugView() {
        activate();
    }
    ~DebugView() = default;

    /**
     * @en Toggle rendering single debug mode.
     * @zh 设置渲染单项调试模式。
     */
    inline DebugViewSingleType getSingleMode() const { return _singleMode; }
    inline void setSingleMode(DebugViewSingleType val) {
        _singleMode = val;
        updatePipeline();
    }

    /**
     * @en Toggle normal / pure lighting mode.
     * @zh 切换正常光照和仅光照模式。
     */
    inline bool isLightingWithAlbedo() const { return _lightingWithAlbedo; }
    inline void setLightingWithAlbedo(bool val) {
        _lightingWithAlbedo = val;
        updatePipeline();
    }

    /**
     * @en Toggle CSM layer coloration mode.
     * @zh 切换级联阴影染色调试模式。
     */
    inline bool isCsmLayerColoration() const { return _csmLayerColoration; }
    inline void setCsmLayerColoration(bool val) {
        _csmLayerColoration = val;
        updatePipeline();
    }

    /**
     * @en Whether enabled with specified rendering composite debug mode.
     * @zh 获取指定的渲染组合调试模式是否开启。
     * @param Specified composite type.
     */
    inline bool isCompositeModeEnabled (uint32_t val) const {
        uint32_t mode = _compositeModeValue & (1 << val);
        return mode != 0;
    }
    /**
     * @en Toggle specified rendering composite debug mode.
     * @zh 开关指定的渲染组合调试模式。
     * @param Specified composite type, enable or disable.
     */
    inline void enableCompositeMode (DebugViewCompositeType val, bool enable) {
        enableCompositeModeValue(val, enable);
        updatePipeline();
    }

    /**
     * @en Toggle all rendering composite debug mode.
     * @zh 开关所有的渲染组合调试模式。
     */
    inline void enableAllCompositeMode (bool enable) {
        enableAllCompositeModeValue(enable);
        updatePipeline();
    }

    /**
     * @en Get rendering debug view on / off state.
     * @zh 查询当前是否开启了渲染调试模式。
     */
    inline bool isEnabled() const {
        return getType() != RenderingDebugViewType::NONE;
    }

    /**
     * @en Disable all debug view modes, reset to standard rendering mode.
     * @zh 关闭所有的渲染调试模式，恢复到正常渲染。
     */
    void reset () {
        activate();
        updatePipeline();
    }

protected:
    void activate();
    void updatePipeline();

private:
    inline void enableCompositeModeValue(DebugViewCompositeType val, bool enable) {
        if (enable) {
            _compositeModeValue |= (1 << static_cast<uint32_t>(val));
        } else {
            _compositeModeValue &= (~(1 << static_cast<uint32_t>(val)));
        }
    }

    inline void enableAllCompositeModeValue(bool enable) {
        for (int i = 0; i < static_cast<int>(DebugViewCompositeType::MAX_BIT_COUNT); ++i) {
            if (enable) {
                _compositeModeValue |= (1 << i);
            } else {
                _compositeModeValue &= (~(1 << i));
            }
        }
    }

    inline RenderingDebugViewType getType () const {
        if (_singleMode != DebugViewSingleType::NONE) {
            return RenderingDebugViewType::SINGLE;
        } else if (!_lightingWithAlbedo || _csmLayerColoration) {
            return RenderingDebugViewType::COMPOSITE_AND_MISC;
        } else {
            for (int i = 0; i < static_cast<int>(DebugViewCompositeType::MAX_BIT_COUNT); ++i) {
                if (!isCompositeModeEnabled(i)) {
                    return RenderingDebugViewType::COMPOSITE_AND_MISC;
                }
            }
        }
        return RenderingDebugViewType::NONE;
    }

private:
    DebugViewSingleType _singleMode{DebugViewSingleType::NONE};
    uint32_t _compositeModeValue{0};
    bool _lightingWithAlbedo{true};
    bool _csmLayerColoration{false};
};

} // namespace pipeline
} // namespace cc
