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

//
//  RuntimeJsImpl.h
//  Simulator
//
//

#ifndef __Simulator__RuntimeJsImpl__
#define __Simulator__RuntimeJsImpl__

#include "ide-support/CodeIDESupport.h"

#if (CC_CODE_IDE_DEBUG_SUPPORT > 0)
#include "runtime/RuntimeProtocol.h"

class RuntimeJsImpl : public RuntimeProtocol
{
public:
    static RuntimeJsImpl* create();
    
    void startScript(const std::string& file);
    void onStartDebuger(const rapidjson::Document& dArgParse, rapidjson::Document& dReplyParse);
    void onClearCompile(const rapidjson::Document& dArgParse, rapidjson::Document& dReplyParse);
    void onPrecompile(const rapidjson::Document& dArgParse, rapidjson::Document& dReplyParse);
    void onReload(const rapidjson::Document& dArgParse, rapidjson::Document& dReplyParse);
    void onRemove(const std::string &filename);
    void end();
    
    bool startWithDebugger();
private:
    RuntimeJsImpl();
    bool initJsEnv();
    bool loadScriptFile(const std::string& file);
};

#endif // (COCOS2D_DEBUG > 0) && (CC_CODE_IDE_DEBUG_SUPPORT > 0)

#endif /* defined(__Simulator__RuntimeLua__) */
