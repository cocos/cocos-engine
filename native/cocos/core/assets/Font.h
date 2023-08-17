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
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"
#include "core/assets/Asset.h"

namespace cc {

namespace gfx {
class Texture;
}

class Font;

constexpr uint32_t DEFAULT_FREETYPE_TEXTURE_SIZE = 512U;
constexpr uint32_t MIN_FONT_SIZE = 1U;
constexpr uint32_t MAX_FONT_SIZE = 128U;

enum class FontType {
    INVALID,
    FREETYPE,
    BITMAP,
};

struct FontGlyph {
    int16_t x{0};
    int16_t y{0};
    uint16_t width{0U};
    uint16_t height{0U};
    int16_t bearingX{0};
    int16_t bearingY{0};
    int32_t advance{0};
    uint32_t page{0U}; // index of textures
};

struct KerningPair {
    uint32_t prevCode{0U};
    uint32_t nextCode{0U};

    inline bool operator==(const KerningPair &k) const noexcept {
        return prevCode == k.prevCode && nextCode == k.nextCode;
    }

    inline bool operator!=(const KerningPair &k) const noexcept {
        return !(*this == k);
    }
};

struct KerningHash {
    ccstd::hash_t operator()(const KerningPair &k) const;
};

/**
 * FontFaceInfo
 */
struct FontFaceInfo {
    explicit FontFaceInfo(uint32_t size);
    FontFaceInfo(uint32_t size, uint32_t width, uint32_t height);
    FontFaceInfo(uint32_t size, uint32_t width, uint32_t height, ccstd::vector<uint32_t> chars);

    // only used in freetype, for bitmap font, fontSize is determined by file.
    uint32_t fontSize{1U};
    uint32_t textureWidth{DEFAULT_FREETYPE_TEXTURE_SIZE};
    uint32_t textureHeight{DEFAULT_FREETYPE_TEXTURE_SIZE};
    ccstd::vector<uint32_t> preLoadedCharacters;
    //~
};

/**
 * FontFace
 */
class FontFace {
public:
    explicit FontFace(Font *font);
    virtual ~FontFace();
    FontFace(const FontFace &) = delete;
    FontFace(FontFace &&) = delete;
    FontFace &operator=(const FontFace &) = delete;
    FontFace &operator=(FontFace &&) = delete;

    virtual const FontGlyph *getGlyph(uint32_t code) = 0;
    virtual float getKerning(uint32_t prevCode, uint32_t nextCode) = 0;

    inline Font *getFont() const { return _font; }
    inline uint32_t getFontSize() const { return _fontSize; }
    inline uint32_t getLineHeight() const { return _lineHeight; }
    inline const ccstd::vector<gfx::Texture *> &getTextures() const { return _textures; }
    inline gfx::Texture *getTexture(uint32_t page) const { return _textures[page]; }
    inline uint32_t getTextureWidth() const { return _textureWidth; }
    inline uint32_t getTextureHeight() const { return _textureHeight; }

protected:
    virtual void doInit(const FontFaceInfo &info) = 0;

    Font *_font{nullptr};
    uint32_t _fontSize{1U};
    uint32_t _lineHeight{0U};
    ccstd::unordered_map<uint32_t, FontGlyph> _glyphs;
    ccstd::unordered_map<KerningPair, float, KerningHash> _kernings;
    ccstd::vector<gfx::Texture *> _textures;
    uint32_t _textureWidth{0U};
    uint32_t _textureHeight{0U};
};

/**
 * Font
 */
class Font : public Asset {
public:
    Font(FontType type, const ccstd::string &path);
    ~Font() override;
    Font(const Font &) = delete;
    Font(Font &&) = delete;
    Font &operator=(const Font &) = delete;
    Font &operator=(Font &&) = delete;

    virtual FontFace *createFace(const FontFaceInfo &info) = 0;

    inline FontType getType() const { return _type; }
    inline const ccstd::string &getPath() const { return _path; }
    inline const ccstd::vector<uint8_t> &getData() const { return _data; }
    inline FontFace *getFace(uint32_t fontSize) { return _faces[fontSize]; }
    void releaseFaces();

protected:
    void load(const ccstd::string &path);

    FontType _type{FontType::INVALID};
    ccstd::string _path;
    ccstd::vector<uint8_t> _data;
    ccstd::unordered_map<uint32_t, FontFace *> _faces;
};

} // namespace cc
