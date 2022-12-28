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

#include "BitmapFont.h"
#include "base/Log.h"
#include "gfx-base/GFXDevice.h"
#include "platform/Image.h"
#include "tinyxml2/tinyxml2.h"

namespace cc {

/**
 * BitmapFontFace
 */

BitmapFontFace::BitmapFontFace(Font *font)
: FontFace(font) {
}
void BitmapFontFace::doInit(const FontFaceInfo & /*info*/) {
    const auto &fontPath = _font->getPath();
    const auto &fontData = _font->getData();
    if (fontData.empty()) {
        CC_LOG_ERROR("BitmapFontFace doInit failed: empty font data.");
        return;
    }

    tinyxml2::XMLDocument doc;

    auto error = doc.Parse(reinterpret_cast<const char *>(fontData.data()), fontData.size());
    if (error) {
        CC_LOG_ERROR("BitmapFontFace parse failed.");
        return;
    }

    auto *fontNode = doc.RootElement();
    auto *infoNode = fontNode->FirstChildElement("info");
    _fontSize = infoNode->UnsignedAttribute("size");

    auto *commonNode = fontNode->FirstChildElement("common");
    _lineHeight = commonNode->UnsignedAttribute("lineHeight");
    _textureWidth = commonNode->UnsignedAttribute("scaleW");
    _textureHeight = commonNode->UnsignedAttribute("scaleH");
    uint32_t pages = commonNode->UnsignedAttribute("pages");
    int base = commonNode->IntAttribute("base");

    // load glyphs
    auto *charsNode = fontNode->FirstChildElement("chars");
    auto *charNode = charsNode->FirstChildElement("char");
    while (charNode) {
        FontGlyph glyph;
        uint32_t value{0U};

        uint32_t code = charNode->UnsignedAttribute("id");
        glyph.x = static_cast<int16_t>(charNode->IntAttribute("x"));
        glyph.y = static_cast<int16_t>(charNode->IntAttribute("y"));
        glyph.width = static_cast<uint16_t>(charNode->UnsignedAttribute("width"));
        glyph.height = static_cast<uint16_t>(charNode->UnsignedAttribute("height"));
        glyph.bearingX = static_cast<int16_t>(charNode->IntAttribute("xoffset"));
        glyph.bearingY = static_cast<int16_t>(base - charNode->IntAttribute("yoffset"));
        glyph.advance = static_cast<int16_t>(charNode->IntAttribute("xadvance"));
        glyph.page = charNode->UnsignedAttribute("page");

        _glyphs[code] = glyph;
        charNode = charNode->NextSiblingElement();
    }

    // load textures
    auto *pagesNode = fontNode->FirstChildElement("pages");
    auto *pageNode = pagesNode->FirstChildElement("page");
    _textures.resize(pages, nullptr);

    ccstd::string path = fontPath;
    auto pos = fontPath.rfind('/');

    if (pos == ccstd::string::npos) {
        pos = fontPath.rfind('\\');
    }

    if (pos != ccstd::string::npos) {
        path = fontPath.substr(0, pos + 1);
    }

    while (pageNode) {
        uint32_t id = pageNode->UnsignedAttribute("id");
        ccstd::string file = pageNode->Attribute("file");
        _textures[id] = loadTexture(path + file);

        pageNode = pageNode->NextSiblingElement();
    }

    // load kernings
    auto *kerningsNode = fontNode->FirstChildElement("kernings");
    auto *kerningNode = kerningsNode->FirstChildElement("kerning");
    while (kerningNode) {
        KerningPair pair;
        pair.prevCode = kerningNode->UnsignedAttribute("first");
        pair.nextCode = kerningNode->UnsignedAttribute("second");
        _kernings[pair] = static_cast<float>(kerningNode->IntAttribute("amount"));

        kerningNode = kerningNode->NextSiblingElement();
    }
}

const FontGlyph *BitmapFontFace::getGlyph(uint32_t code) {
    auto iter = _glyphs.find(code);
    if (iter != _glyphs.end()) {
        return &iter->second;
    }

    CC_LOG_WARNING("BitmapFontFace getGlyph failed, character: %u.", code);

    return nullptr;
}

float BitmapFontFace::getKerning(uint32_t prevCode, uint32_t nextCode) {
    if (_kernings.empty()) {
        return 0.0F;
    }

    const auto &iter = _kernings.find({prevCode, nextCode});
    if (iter != _kernings.end()) {
        return iter->second;
    }

    return 0.0F;
}

gfx::Texture *BitmapFontFace::loadTexture(const ccstd::string &path) {
    auto *image = ccnew Image();
    bool success = image->initWithImageFile(path);
    if (!success) {
        CC_LOG_WARNING("BitmapFontFace initWithImageFile failed, path: %s.", path.c_str());
        delete image;
        return nullptr;
    }

    if (image->getRenderFormat() != gfx::Format::R8 && image->getRenderFormat() != gfx::Format::L8) {
        CC_LOG_WARNING("BitmapFontFace loadTexture with invalid format, path: %s.", path.c_str());
        delete image;
        return nullptr;
    }

    auto width = static_cast<uint32_t>(image->getWidth());
    auto height = static_cast<uint32_t>(image->getHeight());

    auto *device = gfx::Device::getInstance();
    auto *texture = device->createTexture({gfx::TextureType::TEX2D,
                                           gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_DST,
                                           gfx::Format::R8,
                                           width,
                                           height});

    gfx::BufferDataList buffers{image->getData()};
    gfx::BufferTextureCopyList regions = {{0U,
                                           0U,
                                           0U,
                                           {0U, 0U, 0U},
                                           {width, height, 1U},
                                           {0U, 0U, 1U}}};

    device->copyBuffersToTexture(buffers, texture, regions);
    delete image;

    return texture;
}

/**
 * BitmapFont
 */
BitmapFont::BitmapFont(const ccstd::string &path)
: Font(FontType::BITMAP, path) {
}

FontFace *BitmapFont::createFace(const FontFaceInfo &info) {
    auto *face = ccnew BitmapFontFace(this);
    face->doInit(info);

    uint32_t fontSize = face->getFontSize();
    _faces[fontSize] = face;

    return face;
}

} // namespace cc
