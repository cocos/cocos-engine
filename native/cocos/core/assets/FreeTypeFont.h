/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 Portions of this software are copyright ? <2022> The FreeType
 Project (www.freetype.org).  All rights reserved.

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
#include <memory>
#include "Font.h"
#include "base/std/container/string.h"

namespace cc {

struct FTLibrary;
struct FTFace;
class GlyphAllocator;

/**
 * FreeTypeFontFace
 */
class FreeTypeFontFace : public FontFace {
public:
    explicit FreeTypeFontFace(Font *font);
    ~FreeTypeFontFace() override = default;
    FreeTypeFontFace(const FreeTypeFontFace &) = delete;
    FreeTypeFontFace(FreeTypeFontFace &&) = delete;
    FreeTypeFontFace &operator=(const FreeTypeFontFace &) = delete;
    FreeTypeFontFace &operator=(FreeTypeFontFace &&) = delete;

    const FontGlyph *getGlyph(uint32_t code) override;
    float getKerning(uint32_t prevCode, uint32_t nextCode) override;
    static void destroyFreeType();

private:
    void doInit(const FontFaceInfo &info) override;
    const FontGlyph *loadGlyph(uint32_t code);
    void createTexture(uint32_t width, uint32_t height);
    void updateTexture(uint32_t page, uint32_t x, uint32_t y, uint32_t width, uint32_t height, const uint8_t *buffer);

    std::unique_ptr<GlyphAllocator> _allocator{nullptr};
    std::unique_ptr<FTFace> _face;
    static FTLibrary *library;

    friend class FreeTypeFont;
};

/**
 * FreeTypeFont
 */
class FreeTypeFont : public Font {
public:
    explicit FreeTypeFont(const ccstd::string &path);
    ~FreeTypeFont() override = default;
    FreeTypeFont(const FreeTypeFont &) = delete;
    FreeTypeFont(FreeTypeFont &&) = delete;
    FreeTypeFont &operator=(const FreeTypeFont &) = delete;
    FreeTypeFont &operator=(FreeTypeFont &&) = delete;

    FontFace *createFace(const FontFaceInfo &info) override;

private:
};

} // namespace cc
