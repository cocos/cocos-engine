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
#include <math/Vec2.h>
#include <math/Vec4.h>
#include "base/std/container/array.h"
#include "base/std/container/string.h"
#include "renderer/gfx-base/GFXDef-common.h"

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
    bool bold{false};
    bool italic{false};
    bool shadow{false};
    uint32_t shadowThickness{1U};
    gfx::Color shadowColor{0.0F, 0.0F, 0.0F, 1.0F};
    float scale{1.0F};
};

struct DebugFontInfo {
    Font *font{nullptr};
    FontFace *face{nullptr};
    Vec2 invTextureSize{0.0F, 0.0F};
};

constexpr uint32_t DEBUG_FONT_COUNT = 4U;
using DebugFontArray = ccstd::array<DebugFontInfo, DEBUG_FONT_COUNT>;

class DebugRenderer {
public:
    static DebugRenderer *getInstance();

    DebugRenderer();
    DebugRenderer(const DebugRenderer &) = delete;
    DebugRenderer(DebugRenderer &&) = delete;
    DebugRenderer &operator=(const DebugRenderer &) = delete;
    DebugRenderer &operator=(DebugRenderer &&) = delete;
    ~DebugRenderer();

    void activate(gfx::Device *device, const DebugRendererInfo &info = DebugRendererInfo());
    void render(gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff, pipeline::PipelineSceneData *sceneData);
    void destroy();
    void update();

    void addText(const ccstd::string &text, const Vec2 &screenPos);
    void addText(const ccstd::string &text, const Vec2 &screenPos, const DebugTextInfo &info);

private:
    static void addQuad(DebugBatch &batch, const Vec4 &rect, const Vec4 &uv, gfx::Color color);
    uint32_t getLineHeight(bool bold = false, bool italic = false);

    static DebugRenderer *instance;
    gfx::Device *_device{nullptr};
    DebugVertexBuffer *_buffer{nullptr};
    DebugFontArray _fonts;

    friend class Profiler;
};

} // namespace cc

#define CC_DEBUG_RENDERER cc::DebugRenderer::getInstance()
