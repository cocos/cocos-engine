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
#include "Font.h"

namespace cc {

/**
 * BitmapFontFace
 */
class BitmapFontFace : public FontFace {
public:
    explicit BitmapFontFace(Font *font);
    ~BitmapFontFace() override = default;
    BitmapFontFace(const BitmapFontFace &) = delete;
    BitmapFontFace(BitmapFontFace &&) = delete;
    BitmapFontFace &operator=(const BitmapFontFace &) = delete;
    BitmapFontFace &operator=(BitmapFontFace &&) = delete;

    const FontGlyph *getGlyph(uint32_t code) override;
    float getKerning(uint32_t prevCode, uint32_t nextCode) override;

private:
    void doInit(const FontFaceInfo &info) override;
    static gfx::Texture *loadTexture(const ccstd::string &path);

    friend class BitmapFont;
};

/**
 * BitmapFont
 */
class BitmapFont : public Font {
public:
    explicit BitmapFont(const ccstd::string &path);
    ~BitmapFont() override = default;
    BitmapFont(const BitmapFont &) = delete;
    BitmapFont(BitmapFont &&) = delete;
    BitmapFont &operator=(const BitmapFont &) = delete;
    BitmapFont &operator=(BitmapFont &&) = delete;

    FontFace *createFace(const FontFaceInfo &info) override;
};

} // namespace cc
