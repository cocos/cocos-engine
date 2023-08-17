/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 Portions of this software are copyright ? <2022> The FreeType
 Project (www.freetype.org).  All rights reserved.

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

#include "FreeTypeFont.h"
#include <freetype/ft2build.h>
#include FT_FREETYPE_H
#include <cstdint>
#include "base/Log.h"
#include "gfx-base/GFXDevice.h"

namespace cc {

/**
 * FTLibrary
 */
struct FTLibrary {
    FTLibrary() {
        FT_Error error = FT_Init_FreeType(&lib);
        if (error) {
            CC_LOG_ERROR("FreeType init failed, error code: %d.", error);
        }
    }

    ~FTLibrary() {
        if (lib) {
            FT_Error error = FT_Done_FreeType(lib);
            if (error) {
                CC_LOG_ERROR("FreeType exit failed, error code: %d.", error);
            }

            lib = nullptr;
        }
    }

    FT_Library lib{nullptr};
};

/**
 * FTFace
 */
struct FTFace {
    explicit FTFace(FT_Face f)
    : face(f) {
    }

    ~FTFace() {
        if (face) {
            FT_Done_Face(face);
            face = nullptr;
        }
    }

    FT_Face face{nullptr};
};

/**
 * GlyphAllocator: allocate space for glyph from top to down, from left to right.
 */
class GlyphAllocator {
public:
    GlyphAllocator(uint32_t maxWidth, uint32_t maxHeight)
    : _maxWidth(maxWidth), _maxHeight(maxHeight) {}

    inline void reset() {
        _nextX = 0U;
        _nextY = 0U;
        _maxLineHeight = 0U;
    }

    bool allocate(uint32_t width, uint32_t height, uint32_t &x, uint32_t &y) {
        // try current line
        if (_nextX + width <= _maxWidth && _nextY + height <= _maxHeight) {
            x = _nextX;
            y = _nextY;

            _nextX += width;
            _maxLineHeight = std::max(_maxLineHeight, height);

            return true;
        }

        // try next line
        uint32_t nextY = _nextY + _maxLineHeight;
        if (width <= _maxWidth && nextY + height <= _maxHeight) {
            x = 0U;
            y = nextY;

            _nextX = width;
            _nextY = nextY;
            _maxLineHeight = height;

            return true;
        }

        return false;
    }

private:
    // texture resolution
    const uint32_t _maxWidth{0U};
    const uint32_t _maxHeight{0U};

    // next space
    uint32_t _nextX{0U};
    uint32_t _nextY{0U};

    // max height of current line
    uint32_t _maxLineHeight{0U};
};

/**
 * FreeTypeFontFace
 */
FTLibrary *FreeTypeFontFace::library = nullptr;
FreeTypeFontFace::FreeTypeFontFace(Font *font)
: FontFace(font) {
    if (!library) {
        library = ccnew FTLibrary();
    }
}

void FreeTypeFontFace::doInit(const FontFaceInfo &info) {
    const auto &fontData = _font->getData();
    if (fontData.empty()) {
        CC_LOG_ERROR("FreeTypeFontFace doInit failed: empty font data.");
        return;
    }

    _fontSize = info.fontSize < MIN_FONT_SIZE ? MIN_FONT_SIZE : (info.fontSize > MAX_FONT_SIZE ? MAX_FONT_SIZE : info.fontSize);
    _textureWidth = info.textureWidth;
    _textureHeight = info.textureHeight;
    _allocator = std::make_unique<GlyphAllocator>(_textureWidth, _textureHeight);

    FT_Face face{nullptr};
    FT_Error error = FT_New_Memory_Face(library->lib, fontData.data(), static_cast<FT_Long>(fontData.size()), 0, &face);
    if (error) {
        CC_LOG_ERROR("FT_New_Memory_Face failed, error code: %d.", error);
        return;
    }

    error = FT_Set_Pixel_Sizes(face, 0, _fontSize);
    if (error) {
        CC_LOG_ERROR("FT_Set_Pixel_Sizes failed, error code: %d.", error);
        return;
    }

    _face = std::make_unique<FTFace>(face);
    _lineHeight = static_cast<uint32_t>(face->size->metrics.height >> 6);

    for (const auto &code : info.preLoadedCharacters) {
        loadGlyph(code);
    }
}

const FontGlyph *FreeTypeFontFace::getGlyph(uint32_t code) {
    auto iter = _glyphs.find(code);
    if (iter != _glyphs.end()) {
        return &iter->second;
    }

    return loadGlyph(code);
}

float FreeTypeFontFace::getKerning(uint32_t prevCode, uint32_t nextCode) {
    FT_Face face = _face->face;
    if (!FT_HAS_KERNING(face)) {
        return 0.0F;
    }

    const auto &iter = _kernings.find({prevCode, nextCode});
    if (iter != _kernings.end()) {
        return iter->second;
    }

    FT_Vector kerning;
    FT_UInt prevIndex = FT_Get_Char_Index(face, prevCode);
    FT_UInt nextIndex = FT_Get_Char_Index(face, nextCode);
    FT_Error error = FT_Get_Kerning(face, prevIndex, nextIndex, FT_KERNING_DEFAULT, &kerning);

    if (error) {
        CC_LOG_WARNING("FT_Get_Kerning failed, error code: %d, prevCode: %d, nextCode: %d", error, prevCode, nextCode);
        return 0.0F;
    }

    auto result = static_cast<float>(kerning.x >> 6);
    _kernings[{prevCode, nextCode}] = result;

    return result;
}

const FontGlyph *FreeTypeFontFace::loadGlyph(uint32_t code) {
    FT_Face face = _face->face;
    FT_Error error = FT_Load_Char(face, code, FT_LOAD_RENDER);
    if (error) {
        CC_LOG_WARNING("FT_Load_Char failed, error code: %d, character: %u.", error, code);
        return nullptr;
    }

    FontGlyph glyph;
    glyph.width = face->glyph->bitmap.width;
    glyph.height = face->glyph->bitmap.rows;
    glyph.bearingX = face->glyph->bitmap_left;
    glyph.bearingY = face->glyph->bitmap_top;
    glyph.advance = static_cast<int32_t>(face->glyph->advance.x >> 6); // advance.x's unit is 1/64 pixels

    uint32_t x = 0U;
    uint32_t y = 0U;

    if (_textures.empty()) {
        createTexture(_textureWidth, _textureHeight);
    }

    if (glyph.width > 0U && glyph.height > 0U) {
        // try current texture
        if (!_allocator->allocate(glyph.width + 1, glyph.height + 1, x, y)) {
            createTexture(_textureWidth, _textureHeight);

            // try new empty texture
            _allocator->reset();
            if (!_allocator->allocate(glyph.width + 1, glyph.height + 1, x, y)) {
                CC_LOG_WARNING("Glyph allocate failed, character: %u.", code);
                return nullptr;
            }
        }

        auto page = static_cast<uint32_t>(_textures.size() - 1);
        updateTexture(page, x, y, glyph.width, glyph.height, face->glyph->bitmap.buffer);

        glyph.x = x;
        glyph.y = y;
        glyph.page = page;
    }

    _glyphs[code] = glyph;

    return &_glyphs[code];
}

void FreeTypeFontFace::createTexture(uint32_t width, uint32_t height) {
    auto *device = gfx::Device::getInstance();
    auto *texture = device->createTexture({gfx::TextureType::TEX2D,
                                           gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_DST,
                                           gfx::Format::R8,
                                           width,
                                           height});

    _textures.push_back(texture);

    std::vector<uint8_t> empty(width * height, 0);
    auto page = static_cast<uint32_t>(_textures.size() - 1);
    updateTexture(page, 0U, 0U, width, height, empty.data());
}

void FreeTypeFontFace::updateTexture(uint32_t page, uint32_t x, uint32_t y, uint32_t width, uint32_t height, const uint8_t *buffer) {
    auto *texture = getTexture(page);
    gfx::BufferDataList buffers{buffer};
    gfx::BufferTextureCopyList regions = {{0U,
                                           0U,
                                           0U,
                                           {static_cast<int32_t>(x), static_cast<int32_t>(y), 0U},
                                           {width, height, 1U},
                                           {0U, 0U, 1U}}};

    auto *device = gfx::Device::getInstance();
    device->copyBuffersToTexture(buffers, texture, regions);
}

void FreeTypeFontFace::destroyFreeType() {
    if (library) {
        delete library;
        library = nullptr;
    }
}

/**
 * FreeTypeFont
 */
FreeTypeFont::FreeTypeFont(const ccstd::string &path)
: Font(FontType::FREETYPE, path) {
}

FontFace *FreeTypeFont::createFace(const FontFaceInfo &info) {
    auto *face = ccnew FreeTypeFontFace(this);
    face->doInit(info);

    uint32_t fontSize = face->getFontSize();
    _faces[fontSize] = face;

    return face;
}

} // namespace cc
