/****************************************************************************
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#import "jsb_platform.h"

#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/platform/FileUtils.h"

#import <Foundation/Foundation.h>
#import <CoreText/CoreText.h>
#include <regex>

using namespace cc;

static ccstd::unordered_map<ccstd::string, ccstd::string> _fontFamilyNameMap;

const ccstd::unordered_map<ccstd::string, ccstd::string> &getFontFamilyNameMap() {
    return _fontFamilyNameMap;
}

static bool JSB_loadFont(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc >= 1) {
        s.rval().setNull();

        ccstd::string originalFamilyName;
        ok &= sevalue_to_native(args[0], &originalFamilyName);
        SE_PRECONDITION2(ok, false, "Error processing argument: originalFamilyName");

        // Don't reload font again to avoid memory leak.
        if (_fontFamilyNameMap.find(originalFamilyName) != _fontFamilyNameMap.end()) {
            s.rval().setString(_fontFamilyNameMap[originalFamilyName]);
            return true;
        }

        ccstd::string source;
        ok &= sevalue_to_native(args[1], &source);
        SE_PRECONDITION2(ok, false, "Error processing argument: source");

        ccstd::string fontFilePath;
        std::regex re("url\\(\\s*'\\s*(.*?)\\s*'\\s*\\)");
        std::match_results<ccstd::string::const_iterator> results;
        if (std::regex_search(source.cbegin(), source.cend(), results, re)) {
            fontFilePath = results[1].str();
        }

        fontFilePath = FileUtils::getInstance()->fullPathForFilename(fontFilePath);
        if (fontFilePath.empty()) {
            SE_LOGE("Font (%s) doesn't exist!", fontFilePath.c_str());
            return true;
        }

        NSData *dynamicFontData = [NSData dataWithContentsOfFile:[NSString stringWithUTF8String:fontFilePath.c_str()]];
        if (!dynamicFontData) {
            SE_LOGE("load font (%s) failed!", source.c_str());
            return true;
        }

        bool succeed = true;
        CFErrorRef error;
        CGDataProviderRef providerRef = CGDataProviderCreateWithCFData((CFDataRef)dynamicFontData);
        CGFontRef font = CGFontCreateWithDataProvider(providerRef);
        if (!CTFontManagerRegisterGraphicsFont(font, &error)) {
            CFStringRef errorDescription = CFErrorCopyDescription(error);
            const char *cErrorStr = CFStringGetCStringPtr(errorDescription, kCFStringEncodingUTF8);
            SE_LOGE("Failed to load font: %s", cErrorStr);
            CFRelease(errorDescription);
            succeed = false;
        }

        if (succeed) {
            CFStringRef fontName = CGFontCopyFullName(font);
            ccstd::string familyName([(NSString *)fontName UTF8String]);

            if (!familyName.empty()) {
                _fontFamilyNameMap.emplace(originalFamilyName, familyName);
                s.rval().setString(familyName);
            }
            CFRelease(fontName);
        }

        CFRelease(font);
        CFRelease(providerRef);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(JSB_loadFont)

bool register_platform_bindings(se::Object *obj) {
    __jsbObj->defineFunction("loadFont", _SE(JSB_loadFont));
    return true;
}
