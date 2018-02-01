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

#pragma once

#include "stdafx.h"
#include "Resource.h"
#include "cocos2d.h"
#include "AppDelegate.h"
#include "ProjectConfig/ProjectConfig.h"
#include "ProjectConfig/SimulatorConfig.h"

class SimulatorWin
{
public:
    static SimulatorWin *getInstance();
    virtual ~SimulatorWin();
    int run();

    virtual void quit();
    virtual void relaunch();
    virtual void openNewPlayer();
    virtual void openNewPlayerWithProjectConfig(const ProjectConfig &config);
    virtual void openProjectWithProjectConfig(const ProjectConfig &config);

    virtual int getPositionX();
    virtual int getPositionY();
protected:
    SimulatorWin();

    static SimulatorWin *_instance;
    ProjectConfig _project;
    HWND _hwnd;
    HWND _hwndConsole;
    AppDelegate *_app;
    FILE *_writeDebugLogFile;

    // 
    void setupUI();
    void setZoom(float frameScale);
    void updateWindowTitle();

    // debug log
    void writeDebugLog(const char *log);
    void parseCocosProjectConfig(ProjectConfig &config);

    //
    void onOpenFile(const std::string &filePath);
    void onOpenProjectFolder(const std::string &folderPath);
    void onDrop(const std::string &path);

    // helper
    std::string convertPathFormatToUnixStyle(const std::string& path);
    std::string getUserDocumentPath();
    std::string getApplicationExePath();
    std::string getApplicationPath();
    static char* convertTCharToUtf8(const TCHAR* src);

    static LRESULT CALLBACK windowProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
};

