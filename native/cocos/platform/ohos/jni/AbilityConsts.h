/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include <cstdint>

namespace cc {
namespace ohos {
enum {
    ABILITY_CMD_INPUT_CHANGED,
    ABILITY_CMD_INIT_WINDOW,
    ABILITY_CMD_TERM_WINDOW,
    ABILITY_CMD_WINDOW_RESIZED,
    ABILITY_CMD_WINDOW_REDRAW_NEEDED,
    ABILITY_CMD_CONTENT_RECT_CHANGED,
    ABILITY_CMD_GAINED_FOCUS,
    ABILITY_CMD_LOST_FOCUS,
    ABILITY_CMD_CONFIG_CHANGED,
    ABILITY_CMD_LOW_MEMORY,
    ABILITY_CMD_START,
    ABILITY_CMD_RESUME,
    ABILITY_CMD_SAVE_STATE,
    ABILITY_CMD_PAUSE,
    ABILITY_CMD_STOP,
    ABILITY_CMD_DESTROY,
};
} // namespace ohos
} // namespace cc