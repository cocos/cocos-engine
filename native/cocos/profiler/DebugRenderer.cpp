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

#include "DebugRenderer.h"
#include <algorithm>
#include "Profiler.h"
#include "application/ApplicationManager.h"
#include "base/UTF8.h"
#include "base/memory/Memory.h"
#include "base/std/hash/hash.h"
#include "core/MaterialInstance.h"
#include "core/assets/BitmapFont.h"
#include "core/assets/FreeTypeFont.h"
#include "math/Vec2.h"
#include "scene/Pass.h"
#include "platform/interfaces/modules/Device.h"
#include "platform/interfaces/modules/ISystemWindow.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"
#include "renderer/gfx-base/GFXDescriptorSet.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/GlobalDescriptorSetManager.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/PipelineStateManager.h"
#include "renderer/pipeline/RenderPipeline.h"

namespace cc {
constexpr uint32_t DEBUG_FONT_SIZE = 10U;
constexpr uint32_t DEBUG_MAX_CHARACTERS = 10000U;
constexpr uint32_t DEBUG_VERTICES_PER_CHAR = 6U;

inline uint32_t getFontIndex(bool bold, bool italic) {
    /**
     * Regular
     * Bold
     * Italic
     * BoldItalic
     */
    uint32_t index = 0;
    index |= bold ? 1 : 0;
    index |= italic ? 2 : 0;

    return index;
}

inline ccstd::string getFontPath(uint32_t index) {
    static const ccstd::string UUIDS[DEBUG_FONT_COUNT] = {
        "OpenSans-Regular",    //"OpenSans-Regular",
        "OpenSans-Bold",       //"OpenSans-Bold",
        "OpenSans-Italic",     //"OpenSans-Italic",
        "OpenSans-BoldItalic", //"OpenSans-BoldItalic"
    };

    auto *asset = BuiltinResMgr::getInstance()->getAsset(UUIDS[index]);

    return asset->getNativeUrl();
}

struct DebugVertex {
    DebugVertex() = default;
    DebugVertex(const Vec2 &pos, const Vec2 &tuv, gfx::Color clr)
    : position(pos), uv(tuv), color(clr) {}

    Vec2 position;
    Vec2 uv;
    gfx::Color color;
};

struct DebugBatchUBOData {
    Vec4 surfaceTransform;
    Vec4 screenSize;
};

struct DebugBatch {
    DebugBatch(gfx::Device *device, bool bd, bool it, gfx::Texture *tex, MaterialInstance *mi)
    : bold(bd), italic(it), texture(tex), materialInstance(mi) {

        auto &passes = (*mi->getPasses());
        auto *sampler = device->getSampler({
            gfx::Filter::LINEAR,
            gfx::Filter::LINEAR,
            gfx::Filter::NONE,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
        });
        pass = passes[0];
        pass->tryCompile();
        pass->bindTexture(0, tex, 0);
        pass->bindSampler(0, sampler, 0);
        pass->update();
    }

    ~DebugBatch() = default;

    inline bool match(bool b, bool i, gfx::Texture *tex) const {
        return bold == b && italic == i && texture == tex;
    }

    std::vector<DebugVertex> vertices;
    bool bold{false};
    bool italic{false};
    IntrusivePtr<gfx::Texture> texture;
    IntrusivePtr<MaterialInstance> materialInstance;
    scene::Pass *pass = nullptr;
};

class DebugVertexBuffer {
public:
    inline void init(gfx::Device *device, uint32_t maxVertices, const gfx::AttributeList &attributes) {
        _maxVertices = maxVertices;
        _vertexBuffer = device->createBuffer({gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
                                        gfx::MemoryUsageBit::DEVICE,
                                        static_cast<uint32_t>(_maxVertices * sizeof(DebugVertex)),
                                        static_cast<uint32_t>(sizeof(DebugVertex))});

        gfx::InputAssemblerInfo info;
        info.attributes = attributes;
        info.vertexBuffers.push_back(_vertexBuffer);
        _inputAssembler = device->createInputAssembler(info);
        CC_PROFILE_MEMORY_INC(DebugVertexBuffer, static_cast<uint32_t>(_maxVertices * sizeof(DebugVertex)));
    }

    inline void update() {
        if (empty()) {
            return;
        }

        std::vector<DebugVertex> vertices;
        for (auto *batch : _batches) {
            vertices.insert(vertices.end(), batch->vertices.begin(), batch->vertices.end());
        }

        const auto count = std::min(static_cast<uint32_t>(vertices.size()), _maxVertices);
        const auto size = static_cast<uint32_t>(count * sizeof(DebugVertex));
        _vertexBuffer->update(vertices.data(), size);
    }

    inline void destroy() {
        for (auto *batch : _batches) {
            CC_SAFE_DELETE(batch);
        }

        _vertexBuffer = nullptr;
        _inputAssembler = nullptr;
        CC_PROFILE_MEMORY_DEC(DebugVertexBuffer, static_cast<uint32_t>(_maxVertices * sizeof(DebugVertex)));
    }

    DebugBatch &getOrCreateBatch(gfx::Device *device, bool bold, bool italic, gfx::Texture *texture, Material *material) {
        for (auto *batch : _batches) {
            if (batch->match(bold, italic, texture)) {
                return *batch;
            }
        }

        IMaterialInstanceInfo miInfo = {material};

        auto *batch = ccnew DebugBatch(device, bold, italic, texture, ccnew MaterialInstance(miInfo));
        _batches.push_back(batch);

        return *batch;
    }

    inline bool empty() const {
        return std::all_of(_batches.begin(),
                           _batches.end(),
                           [](const DebugBatch *batch) { return batch->vertices.empty(); });
    }
    inline void reset() {
        for (auto *batch : _batches) {
            batch->vertices.clear();
        }
    }

private:
    uint32_t _maxVertices{0U};
    std::vector<DebugBatch *> _batches;
    IntrusivePtr<gfx::Buffer> _vertexBuffer;
    IntrusivePtr<gfx::InputAssembler> _inputAssembler;
    friend class TextRenderer;
};

DebugRendererInfo::DebugRendererInfo()
: fontSize(DEBUG_FONT_SIZE), maxCharacters(DEBUG_MAX_CHARACTERS) {
}

namespace {
void addQuad(DebugBatch &batch, const Vec4 &rect, const Vec4 &uv, gfx::Color color) {
    DebugVertex const quad[4] = {
        {Vec2(rect.x, rect.y), Vec2(uv.x, uv.y), color},
        {Vec2(rect.x + rect.z, rect.y), Vec2(uv.x + uv.z, uv.y), color},
        {Vec2(rect.x, rect.y + rect.w), Vec2(uv.x, uv.y + uv.w), color},
        {Vec2(rect.x + rect.z, rect.y + rect.w), Vec2(uv.x + uv.z, uv.y + uv.w), color}};

    // first triangle
    batch.vertices.emplace_back(quad[0]);
    batch.vertices.emplace_back(quad[1]);
    batch.vertices.emplace_back(quad[2]);

    // second triangle
    batch.vertices.emplace_back(quad[1]);
    batch.vertices.emplace_back(quad[3]);
    batch.vertices.emplace_back(quad[2]);
}

const gfx::AttributeList ATTRIBUTES = {
    {"a_position", gfx::Format::RG32F},
    {"a_texCoord", gfx::Format::RG32F},
    {"a_color", gfx::Format::RGBA32F}
};

} // namespace

TextRenderer::~TextRenderer() {
    CC_SAFE_DESTROY_AND_DELETE(_buffer);

    for (auto &iter : _fonts) {
        CC_SAFE_DELETE(iter.font);
    }
}

void TextRenderer::initialize(gfx::Device *device, const DebugRendererInfo &info, uint32_t fontSize, const std::string &effect) {
    _device = device;

    _buffer = ccnew DebugVertexBuffer();
    _buffer->init(_device, info.maxCharacters * DEBUG_VERTICES_PER_CHAR, ATTRIBUTES);

    _ubo = device->createBuffer(gfx::BufferInfo {
        gfx::BufferUsageBit::UNIFORM,
        gfx::MemoryUsageBit::DEVICE | gfx::MemoryUsageBit::HOST,
        sizeof(DebugBatchUBOData),
        sizeof(DebugBatchUBOData),
        gfx::BufferFlagBit::ENABLE_STAGING_WRITE
    });

    IMaterialInfo matInfo = {};
    matInfo.effectName = effect;
    _material = ccnew Material();
    _material->setUuid("default-debug-renderer-material");
    _material->initialize(matInfo);
    auto &passes = *_material->getPasses();
    for (auto &pass : passes) {
        pass->tryCompile();
    }

    gfx::DescriptorSetLayoutInfo passLayout = {};
    passLayout.bindings.emplace_back(gfx::DescriptorSetLayoutBinding{0, gfx::DescriptorType::UNIFORM_BUFFER, 1, gfx::ShaderStageFlagBit::VERTEX});
    _passLayout = _device->createDescriptorSetLayout(passLayout);

    gfx::PipelineLayoutInfo pLayoutInfo = {};
    pLayoutInfo.setLayouts.emplace_back(_passLayout);
    pLayoutInfo.setLayouts.emplace_back(passes[0]->getPipelineLayout()->getSetLayouts()[1]);
    _pipelineLayout = _device->createPipelineLayout(pLayoutInfo);

    gfx::DescriptorSetInfo setInfo = {};
    setInfo.layout = _passLayout;
    _passSet = _device->createDescriptorSet(setInfo);
    _passSet->bindBuffer(0, _ubo);
    _passSet->update();

    CC_ASSERT(!passes.empty());
    for (auto i = 0U; i < _fonts.size(); i++) {
        _fonts[i].font = ccnew FreeTypeFont(getFontPath(i));
        _fonts[i].face = _fonts[i].font->createFace(FontFaceInfo(fontSize));
        _fonts[i].invTextureSize = {1.0F / static_cast<float>(_fonts[i].face->getTextureWidth()),
                                    1.0F / static_cast<float>(_fonts[i].face->getTextureHeight())};
    }
}

void TextRenderer::render(gfx::RenderPass *renderPass, uint32_t subPassId, gfx::CommandBuffer *cmdBuff) {
    if (!_buffer || _buffer->empty()) {
        return;
    }

    preparePso(_buffer->_inputAssembler, renderPass, subPassId, (*_material->getPasses())[0]);
    if (!_pso) {
        return;
    }

    cmdBuff->bindPipelineState(_pso);
    cmdBuff->bindInputAssembler(_buffer->_inputAssembler);
    cmdBuff->bindDescriptorSet(0, _passSet);

    uint32_t offset = 0U;
    for (auto *batch : _buffer->_batches) {
        auto count = std::min(static_cast<uint32_t>(batch->vertices.size()), _buffer->_maxVertices - offset);
        if (count == 0U) {
            break;
        }

        gfx::DrawInfo drawInfo;
        drawInfo.firstVertex = offset;
        drawInfo.vertexCount = count;

        cmdBuff->bindDescriptorSet(1, batch->pass->getDescriptorSet());
        cmdBuff->draw(drawInfo);

        offset += count;
    }

    // reset all debug data for next frame
    _buffer->reset();
}

void TextRenderer::updateTextData() {
    _buffer->update();
}

void TextRenderer::updateWindowSize(uint32_t width, uint32_t height, uint32_t screenTransform, float flip) {
    if (_windowWidth == width && _windowHeight == height) {
        return;
    }

    DebugBatchUBOData data = {};
    data.screenSize.x = static_cast<float>(width);
    data.screenSize.y = static_cast<float>(height);
    data.screenSize.z = 1.0F / static_cast<float>(width);
    data.screenSize.w = 1.0F / static_cast<float>(height);

    data.surfaceTransform.x = static_cast<float>(screenTransform);
    data.surfaceTransform.y = flip;
    _ubo->update(&data, sizeof(DebugBatchUBOData));

    _windowWidth = width;
    _windowHeight = height;
}

uint32_t TextRenderer::getLineHeight(bool bold, bool italic) const {
    uint32_t const index = getFontIndex(bold, italic);
    const auto &fontInfo = _fonts[index];

    if (fontInfo.face) {
        return fontInfo.face->getLineHeight();
    }

    return 0U;
}

void TextRenderer::preparePso(gfx::InputAssembler *ia, gfx::RenderPass *renderPass, uint32_t subPassId, scene::Pass *pass) {
    auto *shader = pass->getShaderVariant();
    const auto passHash = pass->getHash();
    const auto renderPassHash = renderPass->getHash();
    const auto iaHash = ia->getAttributesHash();
    const auto shaderID = shader->getTypedID();

    auto hash = passHash;
    ccstd::hash_combine(hash, renderPassHash);
    ccstd::hash_combine(hash, iaHash);
    ccstd::hash_combine(hash, shaderID);
    ccstd::hash_combine(hash, subPassId);

    if (hash != _psoHash) {
        _pso = gfx::Device::getInstance()->createPipelineState({shader,
                                                                _pipelineLayout,
                                                                renderPass,
                                                                ia->getAttributes(),
                                                                *(pass->getRasterizerState()),
                                                                *(pass->getDepthStencilState()),
                                                                *(pass->getBlendState()),
                                                                pass->getPrimitive(),
                                                                pass->getDynamicStates(),
                                                                gfx::PipelineBindPoint::GRAPHICS,
                                                                subPassId});
        _psoHash = hash;
    }
}

void TextRenderer::addText(const ccstd::string &text, const Vec2 &screenPos, const DebugTextInfo &info) {
    uint32_t const index = getFontIndex(info.bold, info.italic);
    auto &fontInfo = _fonts[index];
    auto *face = fontInfo.face;

    if (!_buffer || !face || text.empty()) {
        return;
    }

    std::u32string unicodeText;
    bool const success = StringUtils::UTF8ToUTF32(text, unicodeText);
    if (!success) {
        return;
    }

    auto offsetX = screenPos.x;
    auto offsetY = screenPos.y;
    const auto scale = info.scale;
    const auto lineHeight = static_cast<float>(face->getLineHeight()) * scale;
    const auto &invTextureSize = fontInfo.invTextureSize;

    for (char32_t const code : unicodeText) {
        if (code == '\r') {
            continue;
        }

        if (code == '\n') {
            offsetX = screenPos.x;
            offsetY += lineHeight;
            continue;
        }

        const auto *glyph = face->getGlyph(code);
        if (!glyph) {
            continue;
        }

        if (glyph->width > 0U && glyph->height > 0U) {
            auto &batch = _buffer->getOrCreateBatch(_device, info.bold, info.italic, face->getTexture(glyph->page), _material);

            Vec4 const rect{offsetX + static_cast<float>(glyph->bearingX) * scale,
                      offsetY - static_cast<float>(glyph->bearingY) * scale,
                      static_cast<float>(glyph->width) * scale,
                      static_cast<float>(glyph->height) * scale};
            Vec4 const uv{static_cast<float>(glyph->x) * invTextureSize.x,
                    static_cast<float>(glyph->y) * invTextureSize.y,
                    static_cast<float>(glyph->width) * invTextureSize.x,
                    static_cast<float>(glyph->height) * invTextureSize.y};

            if (info.shadow) {
                for (auto x = 1U; x <= info.shadowThickness; x++) {
                    for (auto y = 1U; y <= info.shadowThickness; y++) {
                        Vec4 const shadowRect(rect.x + static_cast<float>(x), rect.y + static_cast<float>(y), rect.z, rect.w);
                        addQuad(batch, shadowRect, uv, info.shadowColor);
                    }
                }
            }

            addQuad(batch, rect, uv, info.color);
        }

        offsetX += static_cast<float>(glyph->advance) * scale;

#ifdef USE_KERNING
        if (i < unicodeText.size() - 1) {
            offsetX += face->getKerning(code, unicodeText[i + 1]) * scale;
        }
#endif
    }
}

DebugRenderer *DebugRenderer::instance = nullptr;
DebugRenderer *DebugRenderer::getInstance() {
    return instance;
}

DebugRenderer::DebugRenderer() {
    DebugRenderer::instance = this;
}

DebugRenderer::~DebugRenderer() {
    DebugRenderer::instance = nullptr;
}

void DebugRenderer::activate(gfx::Device *device, const DebugRendererInfo &info) {
    const auto *window = CC_GET_MAIN_SYSTEM_WINDOW();
    const auto &ext = window->getViewSize();
    const auto width = ext.width * Device::getDevicePixelRatio();
    const auto height = ext.height * Device::getDevicePixelRatio();
    auto fontSize = static_cast<uint32_t>(width / 800.0F * static_cast<float>(info.fontSize));
    fontSize = fontSize < 10U ? 10U : (fontSize > 20U ? 20U : fontSize);

    _textRenderer = std::make_unique<TextRenderer>();
    _textRenderer->initialize(device, info, fontSize, "internal/builtin-debug-renderer");
    _textRenderer->updateWindowSize(static_cast<uint32_t>(width), static_cast<uint32_t>(height), 0, device->getCombineSignY());
}

void DebugRenderer::render(gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuff) {
    CC_PROFILE(DebugRendererRender);
    if (_textRenderer) {
        _textRenderer->render(renderPass, 0, cmdBuff);
    }
}

void DebugRenderer::destroy() {
    _textRenderer = nullptr;
}

void DebugRenderer::update() {
    if (_textRenderer) {
        _textRenderer->updateTextData();
    }
}

void DebugRenderer::addText(const ccstd::string &text, const Vec2 &screenPos) {
    addText(text, screenPos, DebugTextInfo());
}

void DebugRenderer::addText(const ccstd::string &text, const Vec2 &screenPos, const DebugTextInfo &info) {
    if (_textRenderer) {
        _textRenderer->addText(text, screenPos, info);
    }
}

uint32_t DebugRenderer::getLineHeight(bool bold, bool italic) {
    return _textRenderer ? _textRenderer->getLineHeight(bold, italic) : 0U;
}

} // namespace cc
