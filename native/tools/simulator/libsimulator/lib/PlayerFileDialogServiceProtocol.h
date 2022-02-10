/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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


#ifndef __PLAYER_FILE_DIALOG_SERVICE_PROTOCOL_H_
#define __PLAYER_FILE_DIALOG_SERVICE_PROTOCOL_H_

#include <string>
#include <vector>

#include "PlayerMacros.h"
#include "PlayerServiceProtocol.h"

PLAYER_NS_BEGIN

class PlayerFileDialogServiceProtocol : public PlayerServiceProtocol
{
public:
    /**
     * extensions = "Lua Script File|*.lua;JSON File|*.json";
     */
    virtual std::string openFile(const std::string &title,
                                 const std::string &directory,
                                 const std::string &extensions) const = 0;
    virtual std::vector<std::string> openMultiple(const std::string &title,
                                                  const std::string &directory,
                                                  const std::string &extensions) const = 0;
    virtual std::string saveFile(const std::string &title,
                                 const std::string &path) const = 0;
    virtual std::string openDirectory(const std::string &title,
                                      const std::string &directory) const = 0;
};

PLAYER_NS_END

#endif // __PLAYER_FILE_DIALOG_SERVICE_PROTOCOL_H_
