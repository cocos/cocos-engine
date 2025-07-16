/****************************************************************************
 Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/Macros.h"
#include "base/std/container/string.h"

namespace cc {

class EditBox {
public:
    enum TextAlignment {
        LEFT,
        CENTER,
        RIGHT
    };
    struct ShowInfo {
        ccstd::string defaultValue;
        ccstd::string confirmType;
        ccstd::string inputType;
        int maxLength = 0;
        int x = 0;
        int y = 0;
        int width = 0;
        int height = 0;
        bool confirmHold = false;
        bool isMultiline = false;
        //NEW PROPERTIES
        uint32_t fontSize = 20;
        uint32_t fontColor = 0x00000000;
        uint32_t backColor = 0x00000000; //font back color
        uint32_t backgroundColor = 0x00000000;
        bool isBold = false;
        bool isItalic = false;
        bool isUnderline = false;
        uint32_t underlineColor = 0x00000000;
        uint32_t textAlignment = LEFT; //By default, override with left, center or right
    };

    static void show(const ShowInfo &showInfo);
    static void hide();

    // It is internally to send a complete message to JS.
    // Don't call it by yourself untile you know the effect.
    static bool complete();

private:
    static bool _isShown; //NOLINT(readability-identifier-naming)
};

} // namespace cc
