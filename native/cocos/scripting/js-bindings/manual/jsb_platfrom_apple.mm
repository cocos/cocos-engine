#import "jsb_platform.h"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/platform/CCFileUtils.h"

#import <Foundation/Foundation.h>
#import <CoreText/CoreText.h>
#include <regex>

using namespace cocos2d;

static std::unordered_map<std::string, std::string> _fontFamilyNameMap;

const std::unordered_map<std::string, std::string>& getFontFamilyNameMap()
{
    return _fontFamilyNameMap;
}

static std::vector<std::string> getAvailableFontFamilyNames()
{
    std::vector<std::string> ret;

#if CC_TARGET_PLATFORM == CC_PLATFORM_MAC
    CFArrayRef allFamilyNames = CTFontManagerCopyAvailableFontFamilyNames();
#else
    CFArrayRef allFamilyNames = (CFArrayRef) [[UIFont familyNames] retain];
#endif

    char buf[256] = {0};
    for(CFIndex i = 0; i < CFArrayGetCount(allFamilyNames); i++)
    {
        CFStringRef fontName = (CFStringRef)CFArrayGetValueAtIndex(allFamilyNames, i);
        if (CFStringGetCString(fontName, buf, sizeof(buf), kCFStringEncodingUTF8) != 0)
        {
            ret.push_back(buf);
        }
    }

    CFRelease(allFamilyNames);
    return ret;
}

static std::string getFontFamilyByCompareAvailableFontFamilyNames(const std::vector<std::string>& before, const std::vector<std::string>& after)
{
    std::string ret;
    size_t beforeLen = before.size();
    size_t afterLen = after.size();
    if (afterLen > beforeLen)
    {
        for (size_t i = 0; i < beforeLen; ++i)
        {
            if (before[i] != after[i])
            {
                ret = after[i];
                break;
            }
        }

        if (ret.empty())
            ret = after.back();
    }

    return ret;
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

        NSURL* url = [NSURL fileURLWithPath: [NSString stringWithUTF8String:fontFilePath.c_str()]];
        NSData* dynamicFontData = [NSData dataWithContentsOfURL:url];
        if (!dynamicFontData)
        {
            SE_LOGE("load font (%s) failed!", source.c_str());
            return true;
        }

        const auto& familyNamesBeforeRegister = getAvailableFontFamilyNames();

        bool succeed = true;
        CFErrorRef error;
        CGDataProviderRef providerRef = CGDataProviderCreateWithCFData((CFDataRef)dynamicFontData);
        CGFontRef font = CGFontCreateWithDataProvider(providerRef);
        if (!CTFontManagerRegisterGraphicsFont(font, &error))
        {
            CFStringRef errorDescription = CFErrorCopyDescription(error);
            const char* cErrorStr = CFStringGetCStringPtr(errorDescription, kCFStringEncodingUTF8);
            SE_LOGE("Failed to load font: %s", cErrorStr);
            CFRelease(errorDescription);
            succeed = false;
        }

        if (succeed)
        {
            const auto& familyNamesAfterRegister = getAvailableFontFamilyNames();
            std::string familyName = getFontFamilyByCompareAvailableFontFamilyNames(familyNamesBeforeRegister, familyNamesAfterRegister);
            if (!familyName.empty())
            {
                _fontFamilyNameMap.emplace(originalFamilyName, familyName);
                s.rval().setString(familyName);
            }
        }

        CFRelease(font);
        CFRelease(providerRef);
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
