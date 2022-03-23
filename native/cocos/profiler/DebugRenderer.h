/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.
 
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
#include <math/Vec2.h>
#include <math/Vec4.h>
#include <array>
#include "base/std/container/string.h"
#include "gfx-base/GFXDef-common.h"

namespace cc {

namespace pipeline {
class PipelineSceneData;
}

namespace gfx {
class Device;
class RenderPass;
class CommandBuffer;
} // namespace gfx

class Font;
class FontFace;
class DebugVertexBuffer;
struct DebugBatch;

struct DebugRendererInfo {
    DebugRendererInfo();

    uint32_t fontSize{0U};
    uint32_t maxCharacters{0U};
};

struct DebugTextInfo {
    DebugTextInfo() = default;

    gfx::Color color{1.0F, 1.0F, 1.0F, 1.0F};
    bool       bold{false};
    bool       italic{false};
    bool       shadow{false};
    uint32_t   shadowThickness{1U};
    gfx::Color shadowColor{0.0F, 0.0F, 0.0F, 1.0F};
    float      scale{1.0F};
};

struct DebugFontInfo {
    Font *    font{nullptr};
    FontFace *face{nullptr};
    Vec2      invTextureSize{0.0F, 0.0F};
};

constexpr uint32_t DEBUG_FONT_COUNT = 4U;
using DebugFontArray                = std::array<DebugFontInfo, DEBUG_FONT_COUNT>;

class DebugRenderer {
public:
    DebugRenderer(const DebugRenderer &) = delete;
    DebugRenderer(DebugRenderer &&)      = delete;
    DebugRenderer &operator=(const DebugRenderer &) = delete;
    DebugRenderer &operator=(DebugRenderer &&) = delete;

    static DebugRenderer *getInstance();
    static void           destroyInstance();

    void activate(gfx::Device *device, const DebugRendererInfo &info = DebugRendererInfo());
    void render(gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff, pipeline::PipelineSceneData *sceneData);
    void destroy();

    void addText(const ccstd::string &text, const Vec2 &screenPos, const DebugTextInfo &info = DebugTextInfo());

private:
    DebugRenderer()  = default;
    ~DebugRenderer() = default;

    static void addQuad(DebugBatch &batch, const Vec4 &rect, const Vec4 &uv, gfx::Color color);
    uint32_t    getLineHeight(bool bold = false, bool italic = false);

    static DebugRenderer *instance;
    gfx::Device *         _device{nullptr};
    DebugVertexBuffer *   _buffer{nullptr};
    DebugFontArray        _fonts;

    friend class Profiler;
};

} // namespace cc

#define CC_DEBUG_RENDERER cc::DebugRenderer::getInstance()
