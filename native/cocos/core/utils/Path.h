/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include <string>
#include <vector>

namespace cc {

/**
 * @en Join strings to be a path.
 * @zh 拼接字符串为路径。
 * @example {@link cocos/core/utils/CCPath/join.js}
 */
std::string join(const std::vector<std::string> &segments);

/**
 * @en Get the ext name of a path including '.', like '.png'.
 * @zh 返回 Path 的扩展名，包括 '.'，例如 '.png'。
 * @example {@link cocos/core/utils/CCPath/extname.js}
 */
std::string extname(const std::string &path);

/**
 * @en Get the main name of a file name.
 * @zh 获取文件名的主名称。
 * @deprecated
 */
std::string mainFileName(const std::string &fileName);

/**
 * @en Get the file name of a file path.
 * @zh 获取文件路径的文件名。
 * @example {@link cocos/core/utils/CCPath/basename.js}
 */
std::string basename(const std::string &path, const std::string &extName = "");

/**
 * @en Get dirname of a file path.
 * @zh 获取文件路径的目录名。
 * @example {@link cocos/core/utils/CCPath/dirname.js}
 */
std::string dirname(const std::string &path);

/**
 * @en Change extname of a file path.
 * @zh 更改文件路径的扩展名。
 * @example {@link cocos/core/utils/CCPath/changeExtname.js}
 */
std::string changeExtname(const std::string &path, const std::string &extName = "");

/**
 * @en Change file name of a file path.
 * @zh 更改文件路径的文件名。
 * @example {@link cocos/core/utils/CCPath/changeBasename.js}
 */
std::string changeBasename(const std::string &path, const std::string &baseName, bool isSameExt = false);

std::string normalize(const std::string &url);

std::string stripSep(const std::string &path);

char getSeperator();

} // namespace cc
