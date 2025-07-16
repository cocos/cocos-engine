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

#ifndef __CONFIG_PARSER_H__
#define __CONFIG_PARSER_H__

#include <string>
#include <vector>
#include "json/document.h"
#include "ProjectConfig/SimulatorConfig.h"
#include "ProjectConfig/ProjectConfig.h"
#include "SimulatorExport.h"

using namespace std;

#define CONFIG_FILE "config.json"

typedef vector<SimulatorScreenSize> ScreenSizeArray;
class CC_LIBSIM_DLL ConfigParser
{
public:
    static ConfigParser *getInstance(void);
    static void purge();

    void readConfig(const string &filepath = "");

    // predefined screen size
    int getScreenSizeCount(void);
    cc::Size getInitViewSize();
    string getInitViewName();
    string getEntryFile();
    rapidjson::Document& getConfigJsonRoot();
    const SimulatorScreenSize getScreenSize(int index);
    void setConsolePort(int port);
    void setUploadPort(int port);
    int getConsolePort();
    int getUploadPort();
    int getDebugPort();
    bool isLanscape();
    bool isWindowTop();
    bool isWaitForConnect();
    
    void setEntryFile(const std::string &file);
    void setInitViewSize(const cc::Size &size);
    void setBindAddress(const std::string &address);
    const std::string &getBindAddress();
    
private:
    ConfigParser(void);
    void setDebugPort(int port);
    static ConfigParser *s_sharedConfigParserInstance;
    ScreenSizeArray _screenSizeArray;
    cc::Size _initViewSize;
    string _viewName;
    string _entryfile;
    bool _isLandscape;
    bool _isWindowTop;
    bool _isWaitForConnect;
    int _consolePort;
    int _uploadPort;
    int _debugPort;
    string _bindAddress;
    
    rapidjson::Document _docRootjson;
};

#endif  // __CONFIG_PARSER_H__

