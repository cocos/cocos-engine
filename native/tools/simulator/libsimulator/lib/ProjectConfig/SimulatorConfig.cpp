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


#include "SimulatorConfig.h"
#include <sstream>

SimulatorConfig *SimulatorConfig::_instance = NULL;

SimulatorConfig *SimulatorConfig::getInstance()
{
    if (!_instance)
    {
        _instance = new SimulatorConfig();
    }
    return _instance;
}

SimulatorConfig::SimulatorConfig()
{
    _screenSizeArray.push_back(SimulatorScreenSize("Apple iPhone 5 (640x1136)", 640, 1136));
    _screenSizeArray.push_back(SimulatorScreenSize("Apple iPhone 6 (750x1334)", 750, 1334));
    _screenSizeArray.push_back(SimulatorScreenSize("Apple iPhone 6Plus (1242x2208)", 1242, 2208));
    _screenSizeArray.push_back(SimulatorScreenSize("Apple iPhone 7 (750x1334)", 750, 1334));
    _screenSizeArray.push_back(SimulatorScreenSize("Apple iPhone 7Plus (1242x2208)", 1242, 2208));
    _screenSizeArray.push_back(SimulatorScreenSize("Apple iPhone X (750x2436)", 750, 2436));

    _screenSizeArray.push_back(SimulatorScreenSize("Apple iPad (2048x1536)", 2048, 1536));
    _screenSizeArray.push_back(SimulatorScreenSize("Apple iPad Air 2 (1536x2048)", 1536, 2048));
    _screenSizeArray.push_back(SimulatorScreenSize("Apple iPad Pro 10.5-inch (1668x2224)", 1668, 2224));
    _screenSizeArray.push_back(SimulatorScreenSize("Apple iPad Pro 12.9-inch (2048x2732)", 2048, 2732));

    _screenSizeArray.push_back(SimulatorScreenSize("Huawei P9 (1080x1920)", 1080, 1920));
    _screenSizeArray.push_back(SimulatorScreenSize("Huawei Mate9 Pro (1440x2560)", 1440, 2560));

    _screenSizeArray.push_back(SimulatorScreenSize("Goolge Nexus 5 (1080x2880)", 1080, 2880));
    _screenSizeArray.push_back(SimulatorScreenSize("Goolge Nexus 5X (1079x1919)", 1079, 1919));
    _screenSizeArray.push_back(SimulatorScreenSize("Goolge Nexus 6 (1442x2562)", 1442, 2562));
    _screenSizeArray.push_back(SimulatorScreenSize("Goolge Nexus 7 (1920x1200)", 1920, 1200));
}

int SimulatorConfig::getScreenSizeCount() const
{
    return (int)_screenSizeArray.size();
}

SimulatorScreenSize SimulatorConfig::getScreenSize(int index) const
{
    return _screenSizeArray.at(index);
}

int SimulatorConfig::checkScreenSize(const cc::Size &size) const
{
    int width = size.width;
    int height = size.height;

    if (width > height)
    {
        int w = width;
        width = height;
        height = w;
    }

    int count = (int)_screenSizeArray.size();
    for (int i = 0; i < count; ++i)
    {
        const SimulatorScreenSize &size = _screenSizeArray[i];
        if (size.width == width && size.height == height)
        {
            return i;
        }
    }

    return -1;
}

// helper

void SimulatorConfig::makeNormalizePath(string *path, const char *directorySeparator/* = NULL*/)
{
    if (!directorySeparator) directorySeparator = DIRECTORY_SEPARATOR;
    size_t pos = std::string::npos;
    while ((pos = path->find_first_of("/\\", pos + 1)) != std::string::npos)
    {
        path->replace(pos, 1, directorySeparator);
    }
}
