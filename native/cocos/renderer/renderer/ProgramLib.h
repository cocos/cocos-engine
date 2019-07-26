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

#include "../Macro.h"
#include "base/CCValue.h"

#include <string>
#include <vector>
#include <functional>

RENDERER_BEGIN

class DeviceGraphics;
class Program;

/**
 * @addtogroup renderer
 * @{
 */

/**
 *  @brief This class manages shader template and linked programs, material can customize shader by setting different defines.
 */
class ProgramLib final
{
public:
    /**
     *  @brief Program template
     */
    struct Template
    {
        uint32_t id = 0;
        std::string name;
        std::string vert;
        std::string frag;
        ValueVector defines;
    };

    /**
     *  @brief Constructor with device and all initial templates.
     */
    ProgramLib(DeviceGraphics* device, std::vector<Template>& templates);
    /**
     *  @brief The default destructor.
     */
    ~ProgramLib();
    
    /**
     *  @brief Define a new program with name, vertex shader name, fragement shader name and template define settings.
     */
    void define(const std::string& name, const std::string& vert, const std::string& frag, ValueVector& defines);

    /**
     *  @brief Gets program by template name, define settings and defines key.
     *  @note The return value needs to be released by its 'release' method.
     */
    Program* switchProgram(const size_t programNameHash, const size_t definesKeyHash, const std::vector<ValueMap*>& definesList);
    
    const Value* getValueFromDefineList(const std::string& name, const std::vector<ValueMap*>& definesList);

private:
    uint32_t getValueKey(const Value* v);
    
private:
    DeviceGraphics* _device = nullptr;
    const char* _precisionVert = "precision highp float;";
    const char* _precisionVertReplace = "#ifdef GL_ES\nprecision highp float;\n#endif\n";
    const char* _precisionFrag = "precision highp float;";
    const char* _precisionFragReplace = "#ifdef GL_ES\nprecision mediump float;\n#endif\n";
    const char* _mediumpReplace = "half";
    const char* _mediump = "mediump";
    const char* _lowpReplace = "fixed";
    const char* _lowp = "lowp";
    
    std::unordered_map<size_t, Template> _templates;
    std::unordered_map<uint64_t, Program*> _cache;
    
    Program* _current = nullptr;
};

// end of renderer group
/// @}

RENDERER_END
