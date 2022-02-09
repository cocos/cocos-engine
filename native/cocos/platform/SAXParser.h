/****************************************************************************
 Copyright (c) 2010 cocos2d-x.org
 Copyright (c) 2010 Максим Аксенов
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

#ifndef __CCSAXPARSER_H__
#define __CCSAXPARSER_H__
/// @cond DO_NOT_SHOW

#include <string>
#include "base/Macros.h"

namespace cc {

/**
 * @addtogroup platform
 * @{
 */

typedef unsigned char CC_XML_CHAR;

class CC_DLL SAXDelegator {
public:
    virtual ~SAXDelegator() {}

    /**
     * @js NA
     * @lua NA
     */
    virtual void startElement(void *ctx, const char *name, const char **atts) = 0;
    /**
     * @js NA
     * @lua NA
     */
    virtual void endElement(void *ctx, const char *name) = 0;
    /**
     * @js NA
     * @lua NA
     */
    virtual void textHandler(void *ctx, const char *s, int len) = 0;
};

class CC_DLL SAXParser {
    SAXDelegator *_delegator;

public:
    /**
     * @js NA
     * @lua NA
     */
    SAXParser();
    /**
     * @js NA
     * @lua NA
     */
    ~SAXParser(void);
    /**
     * @js NA
     * @lua NA
     */
    bool init(const char *encoding);
    /**
     * @js NA
     * @lua NA
     */
    bool parse(const char *xmlData, size_t dataLength);
    /**
     * @js NA
     * @lua NA
     */
    bool parse(const std::string &filename);
    /**
     * @js NA
     * @lua NA
     */
    void setDelegator(SAXDelegator *delegator);
    /**
     * @js NA
     * @lua NA
     */
    static void startElement(void *ctx, const CC_XML_CHAR *name, const CC_XML_CHAR **atts);
    /**
     * @js NA
     * @lua NA
     */
    static void endElement(void *ctx, const CC_XML_CHAR *name);
    /**
     * @js NA
     * @lua NA
     */
    static void textHandler(void *ctx, const CC_XML_CHAR *name, int len);
};

// end of platform group
/// @}

} // namespace cc

/// @endcond
#endif //__CCSAXPARSER_H__
