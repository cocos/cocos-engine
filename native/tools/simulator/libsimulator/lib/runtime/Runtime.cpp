/****************************************************************************
Copyright (c) 2013 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#include "Runtime.h"
#include "ConfigParser.h"
#include "FileServer.h"
#include "RuntimeProtocol.h"

#include "cocos/base/Log.h"
#include "cocos/platform/FileUtils.h"
#include "cocos/base/memory/Memory.h"

#if ((CC_PLATFORM == CC_PLATFORM_WINDOWS) || (CC_PLATFORM == CC_PLATFORM_MAC_OSX))
    #include "DeviceEx.h"
    #include "network/CCHTTPRequest.h"
    #include "xxhash/xxhash.h"
#endif

std::string g_projectPath;

void recvBuf(int fd, char *pbuf, unsigned long bufsize) {
    unsigned long leftLength = bufsize;
    while (leftLength != 0) {
        size_t recvlen = recv(fd, pbuf + bufsize - leftLength, leftLength, 0);
        if (recvlen <= 0) {
            usleep(1);
            continue;
        }
        leftLength -= recvlen;
    }
}

void sendBuf(int fd, const char *pbuf, unsigned long bufsize) {
    unsigned long leftLength = bufsize;
    while (leftLength != 0) {
        size_t sendlen = send(fd, pbuf + bufsize - leftLength, leftLength, 0);
        if (sendlen <= 0) {
            usleep(1);
            continue;
        }
        leftLength -= sendlen;
    }
}

std::string &replaceAll(std::string &str, const std::string &old_value, const std::string &new_value) {
    size_t start = 0;
    while (true) {
        size_t pos = 0;
        if ((pos = str.find(old_value, start)) != std::string::npos) {
            str.replace(pos, old_value.length(), new_value);
            start = pos + new_value.length();
        } else
            break;
    }
    return str;
}

const char *getRuntimeVersion() {
    return "2.0";
}

//////////////////////// Loader ////////////////////

void resetDesignResolution() {
    cc::Size size = ConfigParser::getInstance()->getInitViewSize();
    if (!ConfigParser::getInstance()->isLanscape()) {
        if (size.width > size.height)
            std::swap(size.width, size.height);
    } else {
        if (size.width < size.height)
            std::swap(size.width, size.height);
    }
    //    cc::Director::getInstance()->getOpenGLView()->setDesignResolutionSize(size.width, size.height, ResolutionPolicy::EXACT_FIT);
    CC_LOG_DEBUG("resetDesignResolution request");
}

//
// RuntimeEngine
//

RuntimeEngine::RuntimeEngine()
: _runtime(nullptr),
  _eventTrackingEnable(false),
  _launchEvent("empty") {
}

RuntimeEngine *RuntimeEngine::getInstance() {
    static RuntimeEngine *instance = nullptr;
    if (!instance) {
        instance = new RuntimeEngine();
    }
    return instance;
}

void RuntimeEngine::setupRuntime() {
    // get project type fron config.json
    updateConfigParser();
    auto entryFile = ConfigParser::getInstance()->getEntryFile();
#if (CC_PLATFORM != CC_PLATFORM_WINDOWS) && (CC_PLATFORM != CC_PLATFORM_MAC_OSX)
    ConfigParser::getInstance()->readConfig();
    entryFile = ConfigParser::getInstance()->getEntryFile();
#endif
    _launchEvent = "js";
    _runtime     = _runtimes[kRuntimeEngineJs];
}

void RuntimeEngine::setProjectConfig(const ProjectConfig &config) {
    _project = config;
    setProjectPath(_project.getProjectDir());
}

const ProjectConfig &RuntimeEngine::getProjectConfig() {
    return _project;
}

void RuntimeEngine::setProjectPath(const std::string &workPath) {
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    vector<std::string> searchPathArray = cc::FileUtils::getInstance()->getSearchPaths();

    if (workPath.empty()) {
        std::string appPath = std::string("");
    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        TCHAR szAppDir[MAX_PATH] = {0};
        if (GetModuleFileName(NULL, szAppDir, MAX_PATH)) {
            int nEnd = 0;
            for (int i = 0; szAppDir[i]; i++) {
                if (szAppDir[i] == '\\')
                    nEnd = i;
            }
            szAppDir[nEnd] = 0;
            int   iLen     = 2 * wcslen((wchar_t *)szAppDir);
            char *chRtn    = new char[iLen + 1];
            wcstombs(chRtn, (wchar_t *)szAppDir, iLen + 1);
            std::string strPath = chRtn;
            delete[] chRtn;
            chRtn                 = NULL;
            char fuldir[MAX_PATH] = {0};
            _fullpath(fuldir, strPath.c_str(), MAX_PATH);
            appPath = fuldir;
        }
    #elif (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
        appPath.append("/../../../");
    #endif
        appPath       = replaceAll(appPath, "\\", "/");
        g_projectPath = appPath;
    } else {
        g_projectPath = workPath;
    }

    // add project's root directory to search path
    searchPathArray.insert(searchPathArray.begin(), g_projectPath);

    // add writable path to search path
    searchPathArray.insert(searchPathArray.begin(), FileServer::getShareInstance()->getWritePath());
    cc::FileUtils::getInstance()->setSearchPaths(searchPathArray);
#endif
}

void RuntimeEngine::startScript(const std::string &args) {
    resetDesignResolution();

    if (_runtime) {
        _runtime->startScript(args);
    }

    trackLaunchEvent();
}

void RuntimeEngine::start() {
#if (CC_PLATFORM != CC_PLATFORM_WINDOWS) && (CC_PLATFORM != CC_PLATFORM_MAC_OSX)
    _project.setDebuggerType(kCCRuntimeDebuggerCodeIDE);
#endif

    // set search path
    string path = cc::FileUtils::getInstance()->fullPathForFilename(_project.getScriptFileRealPath().c_str());
    size_t pos;
    while ((pos = path.find_first_of("\\")) != std::string::npos) {
        path.replace(pos, 1, "/");
    }
    size_t p = path.find_last_of("/");
    string workdir;
    if (p != path.npos) {
        workdir = path.substr(0, p);
        cc::FileUtils::getInstance()->addSearchPath(workdir);
    }

    // update search pathes
    cc::FileUtils::getInstance()->addSearchPath(_project.getProjectDir());
    auto &customizedPathes = _project.getSearchPath();
    for (auto &path : customizedPathes) {
        cc::FileUtils::getInstance()->addSearchPath(path);
    }

    setupRuntime();
    //startScript("jsb-adapter/jsb-builtin.js");
    //startScript("");
}

void RuntimeEngine::end() {
    if (_runtime) {
        _runtime->end();
    }
    // delete all runtimes
    for (auto it = _runtimes.begin(); it != _runtimes.end(); it++) {
        CC_SAFE_DELETE(it->second);
    }
    FileServer::getShareInstance()->stop();
    ConfigParser::purge();
    FileServer::purge();
}

void RuntimeEngine::setEventTrackingEnable(bool enable) {
    _eventTrackingEnable = enable;
}

void RuntimeEngine::addRuntime(RuntimeProtocol *runtime, int type) {
    if (_runtimes.find(type) == _runtimes.end()) {
        _runtimes.insert(std::make_pair(type, runtime));
    } else {
        CC_LOG_DEBUG("RuntimeEngine already has Runtime type %d.", type);
    }
}

RuntimeProtocol *RuntimeEngine::getRuntime() {
    return _runtime;
}

void RuntimeEngine::updateConfigParser() {
    // set entry file
    auto   parser = ConfigParser::getInstance();
    string entryFile(_project.getScriptFileRealPath());
    if (entryFile.find(_project.getProjectDir()) != string::npos) {
        entryFile.erase(0, _project.getProjectDir().length());
    }
    std::replace(entryFile.begin(), entryFile.end(), '\\', '/');

    parser->setEntryFile(entryFile);
    parser->setBindAddress(_project.getBindAddress());
}

//
// NOTE: track event on windows / mac platform
//
void RuntimeEngine::trackEvent(const std::string &eventName) {
    if (!_eventTrackingEnable) {
        return;
    }

#if ((CC_PLATFORM == CC_PLATFORM_WINDOWS) || (CC_PLATFORM == CC_PLATFORM_MAC_OSX))

    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    const char *platform = "win";
    #elif (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    const char *platform = "mac";
    #else
    const char *platform = "UNKNOWN";
    #endif
    /*
    char cidBuf[64] = {0};
    auto guid = player::DeviceEx::getInstance()->getUserGUID();
    snprintf(cidBuf, sizeof(cidBuf), "%x", XXH32(guid.c_str(), (int)guid.length(), 0));
    IntrusivePtr<HTTPRequest> request = cc::extra::HTTPRequest::createWithUrl(NULL,
                                                     "http://www.google-analytics.com/collect",
                                                     kCCHTTPRequestMethodPOST);
    request->addPOSTValue("v", "1");
    request->addPOSTValue("tid", "UA-58200293-1");
    request->addPOSTValue("cid", cidBuf);
    request->addPOSTValue("t", "event");

    request->addPOSTValue("an", "simulator");
    request->addPOSTValue("av", cc::cocos2dVersion());

    request->addPOSTValue("ec", platform);
    request->addPOSTValue("ea", eventName.c_str());

    request->start();
    */
#endif // ((CC_PLATFORM == CC_PLATFORM_WINDOWS) || (CC_PLATFORM == CC_PLATFORM_MAC_OSX))
}

void RuntimeEngine::trackLaunchEvent() {
    trackEvent(_launchEvent);
}
