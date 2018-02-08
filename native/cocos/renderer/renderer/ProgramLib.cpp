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

#include "ProgramLib.h"
#include "../gfx/Program.h"
#include "gfx/DeviceGraphics.h"

#include <regex>
#include <string>
#include <sstream>
#include <iostream>

namespace {
    uint32_t _shdID = 0;

    std::string generateDefines(const cocos2d::ValueMap& defMap)
    {
        std::string ret;
        for (const auto& def : defMap)
        {
            if (def.second.asBool())
            {
                ret += "#define "  + def.first + "\n";
            }
        }
        return ret;
    }

    std::string replaceMacroNums(const std::string str, const cocos2d::ValueMap& defMap)
    {
        cocos2d::ValueMap cache;
        std::string tmp = str;
        for (const auto& def : defMap)
        {
            if (def.second.getType() == cocos2d::Value::Type::INTEGER || def.second.getType() == cocos2d::Value::Type::UNSIGNED)
            {
                cache.emplace(def.first, def.second);
            }
        }

        for (const auto& def : cache)
        {
            std::regex pattern(def.first);
            tmp = std::regex_replace(tmp, pattern, def.second.asString());
        }
        return tmp;
    }

    using RegexReplaceCallback = std::function<std::string(const std::match_results<std::string::const_iterator>&)>;

    static std::string regexReplaceString(const std::string& text, const std::string& pattern, const RegexReplaceCallback& replaceCallback)
    {
        std::string ret = text;
        std::regex re(pattern);

        std::string::const_iterator text_iter = text.cbegin();
        std::match_results<std::string::const_iterator> results;

        size_t start = 0;
        size_t offset = 0;
        while (std::regex_search(text_iter, text.end(), results, re))
        {
            offset = start + results.position();
            std::string replacement = replaceCallback(results);
            ret = ret.replace(offset, results.length(), replacement);
            start = offset + replacement.length();

            text_iter = results[0].second;
        }

        return ret;
    }

    std::string unrollLoops(const std::string& text)
    {
        auto func = [](const std::match_results<std::string::const_iterator>& results) -> std::string {
            assert(results.size() == 5);
            std::string snippet = results[4].str();
            std::string replacePatternStr = "\\{" + results[1].str() + "\\}";
            std::regex replacePattern(replacePatternStr);

            int32_t parsedBegin = atoi(results[2].str().c_str());
            int32_t parsedEnd = atoi(results[3].str().c_str());
            if (parsedBegin < 0 || parsedEnd < 0)
            {
                RENDERER_LOGE("Unroll For Loops Error: begin and end of range must be an int num.");
            }

            std::string unroll;
            char tmp[256] = {0};
            for (int32_t i = parsedBegin; i < parsedEnd; ++i)
            {
                snprintf(tmp, 256, "%d", i);
                std::string replaceFormat(tmp);
                unroll += std::regex_replace(snippet, replacePattern, replaceFormat);
            }
            return unroll;
        };

        return regexReplaceString(text, "#pragma for (\\w+) in range\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)([\\s\\S]+?)#pragma endFor", func);
    }
}

std::string test_unrollLoops(const std::string& text)
{
    return unrollLoops(text);
}

RENDERER_BEGIN

ProgramLib::ProgramLib(DeviceGraphics* device, std::vector<Template>& templates)
: _device(device)
{
    RENDERER_SAFE_RETAIN(_device);
    
    for (auto& templ : templates)
        define(templ.name, templ.vert, templ.frag, templ.defines);
}

ProgramLib::~ProgramLib()
{
    RENDERER_SAFE_RELEASE(_device);
    _device = nullptr;
}

void ProgramLib::define(const std::string& name, const std::string& vert, const std::string& frag, ValueVector& defines)
{
    auto iter = _templates.find(name);
    if (iter != _templates.end())
    {
        RENDERER_LOGW("Failed to define shader %s: already exists.", name.c_str());
        return;
    }

    uint32_t id = ++_shdID;

    // calculate option mask offset
    uint32_t offset = 0;
    for (auto& def : defines)
    {
        ValueMap& oneDefMap = def.asValueMap();
        uint32_t cnt = 1;

        //FIXME: currently we don't use min, max.
//        if (def.min != -1 && def.max != -1) {
//            cnt = (uint32_t)std::ceil((def.max - def.min) * 0.5);
//
//            def._map = std::bind(&Option::_map_1, def, std::placeholders::_1);
//        }
//        else
//        {
//            def._map = std::bind(&Option::_map_2, def, std::placeholders::_1);
//        }

        offset += cnt;

        oneDefMap["_offset"] = offset;
    }

    std::string newVert = _precision + vert;
    std::string newFrag = _precision + frag;

    // store it
    auto& templ = _templates[name];
    templ.id = id;
    templ.name = name;
    templ.vert = newVert;
    templ.frag = newFrag;
    templ.defines = defines;
}

uint32_t ProgramLib::getKey(const std::string& name, const ValueMap& defines)
{
    auto iter = _templates.find(name);
    assert(iter != _templates.end());

    auto& tmpl = iter->second;
    int32_t key = 0;
    for (auto& tmplDefs : tmpl.defines) {
        auto& tmplDefMap = tmplDefs.asValueMap();
        std::string tempName = tmplDefMap["name"].asString();
        auto iter2 = defines.find(tempName);
        if (iter2 == defines.end()) {
            continue;
        }
//        const auto& value = iter2->second;
//        key |= tmplDefs._map(100); //FIXME:
        uint32_t offset = tmplDefMap["_offset"].asUnsignedInt();
        key |= 1 << offset;
    }

    return key << 8 | tmpl.id;
}

Program* ProgramLib::getProgram(const std::string& name, const ValueMap& defines)
{
    uint32_t key = getKey(name, defines);
    auto iter = _cache.find(key);
    if (iter != _cache.end()) {
        iter->second->retain();
        return iter->second;
    }

    Program* program = nullptr;
    // get template
    auto templIter = _templates.find(name);
    if (templIter != _templates.end())
    {
        const auto& tmpl = templIter->second;
        std::string customDef = generateDefines(defines) + "\n";
        std::string vert = replaceMacroNums(tmpl.vert, defines);
        vert = customDef + unrollLoops(vert);
        std::string frag = replaceMacroNums(tmpl.frag, defines);
        frag = customDef + unrollLoops(frag);

        program = new Program();
        program->init(_device, vert.c_str(), frag.c_str());
        program->link();
        _cache.emplace(key, program);
    }

    return program;
}

RENDERER_END
