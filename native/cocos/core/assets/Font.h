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
#include <unordered_map>
#include <vector>
#include "core/assets/Asset.h"

namespace cc {

namespace gfx {
class Texture;
}

class Font;

constexpr uint32_t DEFAULT_FREETYPE_TEXTURE_SIZE = 512U;
constexpr uint32_t MIN_FONT_SIZE                 = 1U;
constexpr uint32_t MAX_FONT_SIZE                 = 128U;

enum class FontType {
    Invalid,
    FreeType,
    Bitmap,
};

struct FontGlyph {
    int16_t  x{0};
    int16_t  y{0};
    uint16_t width{0U};
    uint16_t height{0U};
    int16_t  bearingX{0};
    int16_t  bearingY{0};
    int32_t  advance{0};
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
    std::size_t operator()(const KerningPair &k) const;
};

/**
 * FontFaceInfo
 */
struct FontFaceInfo {
    explicit FontFaceInfo(uint32_t size);
    FontFaceInfo(uint32_t size, uint32_t width, uint32_t height);
    FontFaceInfo(uint32_t size, uint32_t width, uint32_t height, std::vector<uint32_t> chars);

    // only used in freetype, for bitmap font, fontSize is determined by file.
    uint32_t              fontSize{1U};
    uint32_t              textureWidth{DEFAULT_FREETYPE_TEXTURE_SIZE};
    uint32_t              textureHeight{DEFAULT_FREETYPE_TEXTURE_SIZE};
    std::vector<uint32_t> preLoadedCharacters;
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
    FontFace(FontFace &&)      = delete;
    FontFace &operator=(const FontFace &) = delete;
    FontFace &operator=(FontFace &&) = delete;

    virtual const FontGlyph *getGlyph(uint32_t code)                          = 0;
    virtual float            getKerning(uint32_t prevCode, uint32_t nextCode) = 0;

    inline Font *                             getFont() const { return _font; }
    inline uint32_t                           getFontSize() const { return _fontSize; }
    inline uint32_t                           getLineHeight() const { return _lineHeight; }
    inline const std::vector<gfx::Texture *> &getTextures() const { return _textures; }
    inline gfx::Texture *                     getTexture(uint32_t page) const { return _textures[page]; }
    inline uint32_t                           getTextureWidth() const { return _textureWidth; }
    inline uint32_t                           getTextureHeight() const { return _textureHeight; }

protected:
    virtual void doInit(const FontFaceInfo &info) = 0;

    Font *                                              _font{nullptr};
    uint32_t                                            _fontSize{1U};
    uint32_t                                            _lineHeight{0U};
    std::unordered_map<uint32_t, FontGlyph>             _glyphs;
    std::unordered_map<KerningPair, float, KerningHash> _kernings;
    std::vector<gfx::Texture *>                         _textures;
    uint32_t                                            _textureWidth{0U};
    uint32_t                                            _textureHeight{0U};
};

/**
 * Font
 */
class Font : public Asset {
public:
    Font(FontType type, const std::string &path);
    ~Font() override;
    Font(const Font &) = delete;
    Font(Font &&)      = delete;
    Font &operator=(const Font &) = delete;
    Font &operator=(Font &&) = delete;

    virtual FontFace *createFace(const FontFaceInfo &info) = 0;

    inline FontType                    getType() const { return _type; }
    inline const std::string &         getPath() const { return _path; }
    inline const std::vector<uint8_t> &getData() const { return _data; }
    inline FontFace *                  getFace(uint32_t fontSize) { return _faces[fontSize]; }
    void                               releaseFaces();

protected:
    void load(const std::string &path);

    FontType                                 _type{FontType::Invalid};
    std::string                              _path;
    std::vector<uint8_t>                     _data;
    std::unordered_map<uint32_t, FontFace *> _faces;
};

} // namespace cc
