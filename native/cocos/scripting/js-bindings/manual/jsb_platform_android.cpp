#include "jsb_platform.h"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/platform/CCFileUtils.h"

#include <regex>

using namespace cocos2d;

static std::unordered_map<std::string, std::string> _fontFamilyNameMap;

const std::unordered_map<std::string, std::string>& getFontFamilyNameMap()
{
    return _fontFamilyNameMap;
}

static bool JSB_loadFont(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc >= 1) {
        s.rval().setNull();

        std::string originalFamilyName;
        ok &= seval_to_std_string(args[0], &originalFamilyName);
        SE_PRECONDITION2(ok, false, "JSB_loadFont : Error processing argument: originalFamilyName");

        std::string source;
        ok &= seval_to_std_string(args[1], &source);
        SE_PRECONDITION2(ok, false, "JSB_loadFont : Error processing argument: source");

        std::string fontFilePath;
        std::regex re("url\\(\\s*'\\s*(.*?)\\s*'\\s*\\)");
        std::match_results<std::string::const_iterator> results;
        if (std::regex_search(source.cbegin(), source.cend(), results, re))
        {
            fontFilePath = results[1].str();
        }

        fontFilePath = FileUtils::getInstance()->fullPathForFilename(fontFilePath);
        if (fontFilePath.empty())
        {
            SE_LOGE("Font (%s) doesn't exist!", fontFilePath.c_str());
            return true;
        }

        JniHelper::callStaticVoidMethod("org/cocos2dx/lib/CanvasRenderingContext2DImpl", "loadTypeface", originalFamilyName, fontFilePath);

        s.rval().setString(originalFamilyName);
        
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(JSB_loadFont)

bool register_platform_bindings(se::Object* obj)
{
    __jsbObj->defineFunction("loadFont", _SE(JSB_loadFont));
    return true;
}