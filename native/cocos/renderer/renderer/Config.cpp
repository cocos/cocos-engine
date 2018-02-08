/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
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

#include "Config.h"

RENDERER_BEGIN

unsigned int Config::_stageOffset = 0;
std::unordered_map<std::string, unsigned int> Config::_name2stageID;

void Config::addStage(const std::string& name)
{
    if (Config::_name2stageID.end() != Config::_name2stageID.find(name))
        return;
    
    unsigned int stageID = 1 << Config::_stageOffset;
    Config::_name2stageID[name] = stageID;
    
    ++Config::_stageOffset;
}

int Config::getStageID(const std::string &name)
{
    auto foundIter = Config::_name2stageID.find(name);
    if (Config::_name2stageID.end() == foundIter)
        return -1;
    
    return (int)foundIter->second;
}

unsigned int Config::getStageIDs(const std::vector<std::string>& nameList)
{
    unsigned int ret = 0;
    
    std::unordered_map<std::string, unsigned int>::iterator foundIter;
    std::unordered_map<std::string, unsigned int>::iterator endIter = Config::_name2stageID.end();
    for (const auto& name : nameList)
    {
        foundIter = Config::_name2stageID.find(name);
        if (endIter != foundIter)
            ret |= foundIter->second;
    }
    
    return ret;
}

RENDERER_END
