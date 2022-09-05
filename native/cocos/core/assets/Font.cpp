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

#include "Font.h"
#include <algorithm>
#include <cctype>
#include "base/Data.h"
#include "base/Log.h"
#include "base/Macros.h"
#include "base/memory/Memory.h"
#include "base/std/hash/hash.h"
#include "gfx-base/GFXTexture.h"
#include "math/Math.h"
#include "platform/FileUtils.h"
#include "profiler/Profiler.h"

namespace cc {

ccstd::hash_t KerningHash::operator()(const KerningPair &k) const {
    ccstd::hash_t seed = 2;
    ccstd::hash_combine(seed, k.prevCode);
    ccstd::hash_combine(seed, k.nextCode);
    return seed;
}

/**
 * FontFaceInfo
 */
FontFaceInfo::FontFaceInfo(uint32_t size)
: fontSize(size) {}

FontFaceInfo::FontFaceInfo(uint32_t size, uint32_t width, uint32_t height)
: fontSize(size), textureWidth(width), textureHeight(height) {
    CC_ASSERT(math::isPowerOfTwo(width) && math::isPowerOfTwo(height)); // Font texture size must be power of 2.

    // preload digit & alphabet characters by default
    for (auto i = 0U; i < 128; i++) {
        if (std::isdigit(i) || std::isalpha(i)) {
            preLoadedCharacters.emplace_back(i);
        }
    }
}

FontFaceInfo::FontFaceInfo(uint32_t size, uint32_t width, uint32_t height, ccstd::vector<uint32_t> chars)
: fontSize(size), textureWidth(width), textureHeight(height), preLoadedCharacters(std::move(chars)) {
    CC_ASSERT(math::isPowerOfTwo(width) && math::isPowerOfTwo(height)); // Font texture size must be power of 2.
}

/**
 * FontFace
 */
FontFace::FontFace(Font *font)
: _font(font) {
}

FontFace::~FontFace() {
    for (auto *texture : _textures) {
        CC_SAFE_DESTROY_AND_DELETE(texture);
    }
}

/**
 * Font
 */
Font::Font(FontType type, const ccstd::string &path)
: _type(type), _path(path) {
    load(path);
}

Font::~Font() {
    releaseFaces();
    CC_PROFILE_MEMORY_DEC(Font, _data.size());
}

void Font::load(const ccstd::string &path) {
    Data data = FileUtils::getInstance()->getDataFromFile(path);
    if (data.isNull()) {
        CC_LOG_WARNING("Font load failed, path: %s.", path.c_str());
        return;
    }

    _data.resize(data.getSize());
    memcpy(&_data[0], data.getBytes(), data.getSize());
    CC_PROFILE_MEMORY_INC(Font, _data.size());
}

void Font::releaseFaces() {
    for (auto &iter : _faces) {
        delete iter.second;
    }

    _faces.clear();
}

} // namespace cc
