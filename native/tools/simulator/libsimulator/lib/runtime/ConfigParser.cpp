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

#include "ConfigParser.h"
#include "FileServer.h"
#include "cocos/base/Log.h"
#include "cocos/base/memory/Memory.h"
#include "cocos/platform/FileUtils.h"
#include "json/document.h"
#include "json/stringbuffer.h"
#include "json/writer.h"

// ConfigParser
ConfigParser *ConfigParser::s_sharedConfigParserInstance = NULL;
ConfigParser *ConfigParser::getInstance(void) {
    if (!s_sharedConfigParserInstance) {
        s_sharedConfigParserInstance = new ConfigParser();
        s_sharedConfigParserInstance->readConfig();
    }
    return s_sharedConfigParserInstance;
}

void ConfigParser::purge() {
    CC_SAFE_DELETE(s_sharedConfigParserInstance);
}

void ConfigParser::readConfig(const string &filepath) {
    string fullPathFile = filepath;

#if (CC_PLATFORM == CC_PLATFORM_IOS || CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_WINDOWS)
    // add writable path to search path temporarily for reading config file
    vector<std::string> searchPathArray = cc::FileUtils::getInstance()->getSearchPaths();
    searchPathArray.insert(searchPathArray.begin(), FileServer::getShareInstance()->getWritePath());
    cc::FileUtils::getInstance()->setSearchPaths(searchPathArray);
#endif

    // read config file
    if (fullPathFile.empty()) {
        fullPathFile = cc::FileUtils::getInstance()->fullPathForFilename(CONFIG_FILE);
    }
    string fileContent = cc::FileUtils::getInstance()->getStringFromFile(fullPathFile);

#if (CC_PLATFORM == CC_PLATFORM_IOS || CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_WINDOWS)
    // revert search path
    searchPathArray.erase(searchPathArray.begin());
    cc::FileUtils::getInstance()->setSearchPaths(searchPathArray);
#endif

    if (fileContent.empty())
        return;

    if (_docRootjson.Parse<0>(fileContent.c_str()).HasParseError()) {
        CC_LOG_DEBUG("read json file %s failed because of %d", fullPathFile.c_str(), _docRootjson.GetParseError());
        return;
    }

    const rapidjson::Value &objectInitView = _docRootjson;
    if (objectInitView.HasMember("width") && objectInitView.HasMember("height")) {
        _initViewSize.width = objectInitView["width"].GetUint();
        _initViewSize.height = objectInitView["height"].GetUint();
        if (_initViewSize.height > _initViewSize.width) {
            float tmpvalue = _initViewSize.height;
            _initViewSize.height = _initViewSize.width;
            _initViewSize.width = tmpvalue;
        }
    }
    if (objectInitView.HasMember("name") && objectInitView["name"].IsString()) {
        _viewName = objectInitView["name"].GetString();
    }
    if (objectInitView.HasMember("isLandscape") && objectInitView["isLandscape"].IsBool()) {
        _isLandscape = objectInitView["isLandscape"].GetBool();
    }
    if (objectInitView.HasMember("entry") && objectInitView["entry"].IsString()) {
        setEntryFile(objectInitView["entry"].GetString());
    }
    if (objectInitView.HasMember("consolePort")) {
        setConsolePort(objectInitView["consolePort"].GetUint());
    }
    if (objectInitView.HasMember("debugPort")) {
        setDebugPort(objectInitView["debugPort"].GetUint());
    }
    if (objectInitView.HasMember("uploadPort")) {
        setUploadPort(objectInitView["uploadPort"].GetUint());
    }
    if (objectInitView.HasMember("isWindowTop") && objectInitView["isWindowTop"].IsBool()) {
        _isWindowTop = objectInitView["isWindowTop"].GetBool();
    }
    if (objectInitView.HasMember("waitForConnect") && objectInitView["waitForConnect"].IsBool()) {
        _isWaitForConnect = objectInitView["waitForConnect"].GetBool();
    }
}

ConfigParser::ConfigParser(void) : _isLandscape(true),
                                   _isWindowTop(false),
                                   _consolePort(kProjectConfigConsolePort),
                                   _uploadPort(kProjectConfigUploadPort),
                                   _debugPort(kProjectConfigDebugger),
                                   _viewName("simulator"),
                                   _entryfile(""),
                                   _initViewSize(ProjectConfig::DEFAULT_HEIGHT, ProjectConfig::DEFAULT_WIDTH),
                                   _bindAddress("") {
}

rapidjson::Document &ConfigParser::getConfigJsonRoot() {
    return _docRootjson;
}

string ConfigParser::getInitViewName() {
    return _viewName;
}

string ConfigParser::getEntryFile() {
    return _entryfile;
}

cc::Size ConfigParser::getInitViewSize() {
    return _initViewSize;
}

bool ConfigParser::isLanscape() {
    return _isLandscape;
}

bool ConfigParser::isWindowTop() {
    return _isWindowTop;
}

bool ConfigParser::isWaitForConnect() {
    return _isWaitForConnect;
}

void ConfigParser::setConsolePort(int port) {
    if (port > 0) {
        _consolePort = port;
    }
}
void ConfigParser::setUploadPort(int port) {
    if (port > 0) {
        _uploadPort = port;
    }
}
void ConfigParser::setDebugPort(int port) {
    if (port > 0) {
        _debugPort = port;
    }
}
int ConfigParser::getConsolePort() {
    return _consolePort;
}
int ConfigParser::getUploadPort() {
    return _uploadPort;
}
int ConfigParser::getDebugPort() {
    return _debugPort;
}
int ConfigParser::getScreenSizeCount(void) {
    return (int)_screenSizeArray.size();
}

const SimulatorScreenSize ConfigParser::getScreenSize(int index) {
    return _screenSizeArray.at(index);
}

void ConfigParser::setEntryFile(const std::string &file) {
    _entryfile = file;
}

void ConfigParser::setInitViewSize(const cc::Size &size) {
    _initViewSize = size;
}

void ConfigParser::setBindAddress(const std::string &address) {
    _bindAddress = address;
}

const std::string &ConfigParser::getBindAddress() {
    return _bindAddress;
}
