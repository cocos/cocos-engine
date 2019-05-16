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

#pragma once

#include <string>
#include <vector>
#include <unordered_map>
#include "../Macro.h"

RENDERER_BEGIN

/**
 * @addtogroup renderer
 * @{
 */

/**
 *  @brief Stage config which use to store stageID.
 */
class Config
{
public:
    /**
     *  @brief Adds stage id by name.
     *  @param[in] name Stage name.
     */
    static void addStage(const std::string& name);
    /**
     *  @brief Gets stage id by name.
     *  @param[in] name Stage name.
     *  @return Stage id.
     */
    static int getStageID(const std::string& name);
    /**
     *  @brief Gets all stage id by a list of names and store in uint32 value by AND operation.
     *  @param[in] nameList Stage name list.
     *  @return A uint32 represents all stages.
     */
    static unsigned int getStageIDs(const std::vector<std::string>& nameList);
    
private:
    static unsigned int _stageOffset;
    static std::unordered_map<std::string, unsigned int> _name2stageID;
};

// end of renderer group
/// @}

RENDERER_END
