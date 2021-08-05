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


#pragma comment(lib, "comctl32.lib")
#pragma comment(linker, "\"/manifestdependency:type='Win32' name='Microsoft.Windows.Common-Controls' version='6.0.0.0' processorArchitecture='X86' publicKeyToken='6595b64144ccf1df' language='*'\"")

#include "cocos/base/UTF8.h"
#include "stdafx.h"
#include <io.h>
#include <stdlib.h>
#include <malloc.h>
#include <stdio.h>
#include <fcntl.h>
#include <Commdlg.h>
#include <Shlobj.h>
#include <winnls.h>
#include <shobjidl.h>
#include <objbase.h>
#include <objidl.h>
#include <shlguid.h>
#include <shellapi.h>
#include <Winuser.h>
#include <shellapi.h>
#include <MMSystem.h>
#include <sstream>

#include "SimulatorWin.h"

#include "AppEvent.h"
#include "AppLang.h"
#include "runtime/ConfigParser.h"
#include "runtime/Runtime.h"

#include "platform/Application.h"
#include "platform/win32/PlayerWin.h"
#include "platform/win32/PlayerMenuServiceWin.h"
#include "platform/FileUtils.h"

#include "platform/StdC.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "resource.h"

namespace
{
    std::weak_ptr<cc::View> gView;
    /**
    @brief  This function changes the PVRFrame show/hide setting in register.
    @param  bEnable If true show the PVRFrame window, otherwise hide.
    */
    void PVRFrameEnableControlWindow(bool bEnable)
    {
        HKEY hKey = 0;

        // Open PVRFrame control key, if not exist create it.
        if (ERROR_SUCCESS != RegCreateKeyExW(HKEY_CURRENT_USER,
            L"Software\\Imagination Technologies\\PVRVFRame\\STARTUP\\",
            0,
            0,
            REG_OPTION_NON_VOLATILE,
            KEY_ALL_ACCESS,
            0,
            &hKey,
            nullptr))
        {
            return;
        }

        const WCHAR* wszValue = L"hide_gui";
        const WCHAR* wszNewData = (bEnable) ? L"NO" : L"YES";
        WCHAR wszOldData[256] = { 0 };
        DWORD   dwSize = sizeof(wszOldData);
        LSTATUS status = RegQueryValueExW(hKey, wszValue, 0, nullptr, (LPBYTE)wszOldData, &dwSize);
        if (ERROR_FILE_NOT_FOUND == status              // the key not exist
            || (ERROR_SUCCESS == status                 // or the hide_gui value is exist
                && 0 != wcscmp(wszNewData, wszOldData)))    // but new data and old data not equal
        {
            dwSize = sizeof(WCHAR) * (wcslen(wszNewData) + 1);
            RegSetValueEx(hKey, wszValue, 0, REG_SZ, (const BYTE*)wszNewData, dwSize);
        }

        RegCloseKey(hKey);
    }

    bool setCanvasCallback(se::Object* global)
    {
        std::stringstream ss;
        se::ScriptEngine* se = se::ScriptEngine::getInstance();
        auto view = gView.lock();
        auto handler = view->getWindowHandler();
        auto viewSize = view->getViewSize();
        char commandBuf[200] = { 0 };
        ss << "window.innerWidth = " << viewSize[0] << "; "
            << "window.innerHeight = " << viewSize[1] << "; "
            << "window.windowHandler = "
            << reinterpret_cast<intptr_t>(handler)
            << ";";

        se->evalString(ss.str().c_str());
        return true;
    }
}

//exported function
std::shared_ptr<cc::View> cc_get_application_view() {
    return gView.lock();
}


using namespace cc;

static WNDPROC g_oldWindowProc = NULL;
INT_PTR CALLBACK AboutDialogCallback(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{
    LOGFONT lf;
    HFONT hFont;

    UNREFERENCED_PARAMETER(lParam);
    switch (message)
    {
    case WM_INITDIALOG:
        ZeroMemory(&lf, sizeof(LOGFONT));
        lf.lfHeight = 24;
        lf.lfWeight = 200;
        _tcscpy(lf.lfFaceName, _T("Arial"));

        hFont = CreateFontIndirect(&lf);
        if ((HFONT)0 != hFont)
        {
            SendMessage(GetDlgItem(hDlg, IDC_ABOUT_TITLE), WM_SETFONT, (WPARAM)hFont, (LPARAM)TRUE);
        }
        return (INT_PTR)TRUE;

    case WM_COMMAND:
        if (LOWORD(wParam) == IDOK || LOWORD(wParam) == IDCANCEL)
        {
            EndDialog(hDlg, LOWORD(wParam));
            return (INT_PTR)TRUE;
        }
        break;
    }
    return (INT_PTR)FALSE;
}


void onHelpAbout()
{
    DialogBox(GetModuleHandle(NULL),
              MAKEINTRESOURCE(IDD_DIALOG_ABOUT),
              cc_get_application_view()->getWindowHandler(),
              AboutDialogCallback);
}


void shutDownApp()
{
    
    ::SendMessage(cc_get_application_view()->getWindowHandler(), WM_CLOSE, NULL, NULL);
}

std::string getCurAppPath(void)
{
    TCHAR szAppDir[MAX_PATH] = {0};
    if (!GetModuleFileName(NULL, szAppDir, MAX_PATH))
        return "";
    int nEnd = 0;
    for (int i = 0; szAppDir[i]; i++)
    {
        if (szAppDir[i] == '\\')
            nEnd = i;
    }
    szAppDir[nEnd] = 0;
    int iLen = 2 * wcslen(szAppDir);
    char* chRtn = new char[iLen + 1];
    wcstombs(chRtn, szAppDir, iLen + 1);
    std::string strPath = chRtn;
    delete[] chRtn;
    chRtn = NULL;
    char fuldir[MAX_PATH] = {0};
    _fullpath(fuldir, strPath.c_str(), MAX_PATH);
    return fuldir;
}

static bool stringEndWith(const std::string str, const std::string needle)
{
    if (str.length() >= needle.length())
    {
        return (0 == str.compare(str.length() - needle.length(), needle.length(), needle));
    }
    return false;
}

SimulatorWin *SimulatorWin::_instance = nullptr;

SimulatorWin *SimulatorWin::getInstance()
{
    if (!_instance)
    {
        _instance = new SimulatorWin();
    }
    return _instance;
}

SimulatorWin::SimulatorWin()
    : _hwnd(NULL)
    , _hwndConsole(NULL)
    , _writeDebugLogFile(nullptr)
{
}

SimulatorWin::~SimulatorWin()
{
    if (_writeDebugLogFile)
    {
        fclose(_writeDebugLogFile);
    }
}

void SimulatorWin::quit()
{
    _quit = true;
}

void SimulatorWin::relaunch()
{
    _project.setWindowOffset(cc::Vec2(getPositionX(), getPositionY()));
	openProjectWithProjectConfig(_project);
}

void SimulatorWin::openNewPlayer()
{
    openNewPlayerWithProjectConfig(_project);
}

void SimulatorWin::openNewPlayerWithProjectConfig(const ProjectConfig &config)
{
    static long taskid = 100;
    stringstream buf;
    buf << taskid++;

    string commandLine;
    commandLine.append(getApplicationExePath());
    commandLine.append(" ");
    commandLine.append(config.makeCommandLine());

    CC_LOG_DEBUG("SimulatorWin::openNewPlayerWithProjectConfig(): %s", commandLine.c_str());

    // http://msdn.microsoft.com/en-us/library/windows/desktop/ms682499(v=vs.85).aspx
    SECURITY_ATTRIBUTES sa = {0};
    sa.nLength = sizeof(sa);

    PROCESS_INFORMATION pi = {0};
    STARTUPINFO si = {0};
    si.cb = sizeof(STARTUPINFO);

#define MAX_COMMAND 1024 // lenth of commandLine is always beyond MAX_PATH

    WCHAR command[MAX_COMMAND];
    memset(command, 0, sizeof(command));
    MultiByteToWideChar(CP_UTF8, 0, commandLine.c_str(), -1, command, MAX_COMMAND);

    BOOL success = CreateProcess(NULL,
                                 command,   // command line
                                 NULL,      // process security attributes
                                 NULL,      // primary thread security attributes
                                 FALSE,     // handles are inherited
                                 0,         // creation flags
                                 NULL,      // use parent's environment
                                 NULL,      // use parent's current directory
                                 &si,       // STARTUPINFO pointer
                                 &pi);      // receives PROCESS_INFORMATION

    if (!success)
    {
        CC_LOG_DEBUG("PlayerTaskWin::run() - create process failed, for execute %s", commandLine.c_str());
    }
}

void SimulatorWin::openProjectWithProjectConfig(const ProjectConfig &config)
{
    quit();
    openNewPlayerWithProjectConfig(config);
}

int SimulatorWin::getPositionX()
{
    RECT rect;
    GetWindowRect(_hwnd, &rect);
    return rect.left;
}

int SimulatorWin::getPositionY()
{
    RECT rect;
    GetWindowRect(_hwnd, &rect);
    return rect.top;
}

int SimulatorWin::run()
{
    INITCOMMONCONTROLSEX InitCtrls;
    InitCtrls.dwSize = sizeof(InitCtrls);
    InitCtrls.dwICC = ICC_WIN95_CLASSES;
    InitCommonControlsEx(&InitCtrls);

    parseCocosProjectConfig(_project);

    // load project config from command line args
    std::vector<string> args;
    for (int i = 0; i < __argc; ++i)
    {
        wstring ws(__wargv[i]);
        string s;
        s.assign(ws.begin(), ws.end());
        args.push_back(s);
    }
    _project.parseCommandLine(args);

    if (_project.getProjectDir().empty())
    {
        if (args.size() == 2)
        {
            // for Code IDE before RC2
            _project.setProjectDir(args.at(1));
            _project.setDebuggerType(kCCRuntimeDebuggerCodeIDE);
        }
    }

    // create the application instance
    RuntimeEngine::getInstance()->setProjectConfig(_project);

    // create console window
    if (_project.isShowConsole())
    {
        AllocConsole();
        _hwndConsole = GetConsoleWindow();
        if (_hwndConsole != NULL)
        {
            ShowWindow(_hwndConsole, SW_SHOW);
            BringWindowToTop(_hwndConsole);
            freopen("CONOUT$", "wt", stdout);
            freopen("CONOUT$", "wt", stderr);

            HMENU hmenu = GetSystemMenu(_hwndConsole, FALSE);
            if (hmenu != NULL)
            {
                DeleteMenu(hmenu, SC_CLOSE, MF_BYCOMMAND);
            }
        }
    }

    // log file
    if (_project.isWriteDebugLogToFile())
    {
        const string debugLogFilePath = _project.getDebugLogFilePath();
        _writeDebugLogFile = fopen(debugLogFilePath.c_str(), "w");
        if (!_writeDebugLogFile)
        {
            CC_LOG_DEBUG("Cannot create debug log file %s", debugLogFilePath.c_str());
        }
    }

    // set environments
    SetCurrentDirectoryA(_project.getProjectDir().c_str());
    FileUtils::getInstance()->setDefaultResourceRootPath(_project.getProjectDir());
    FileUtils::getInstance()->setWritablePath(_project.getWritableRealPath().c_str());

    // check screen DPI
    HDC screen = GetDC(0);
    int dpi = GetDeviceCaps(screen, LOGPIXELSX);
    ReleaseDC(0, screen);

    // set scale with DPI
    //  96 DPI = 100 % scaling
    // 120 DPI = 125 % scaling
    // 144 DPI = 150 % scaling
    // 192 DPI = 200 % scaling
    // http://msdn.microsoft.com/en-us/library/windows/desktop/dn469266%28v=vs.85%29.aspx#dpi_and_the_desktop_scaling_factor
    //
    // enable DPI-Aware with DeclareDPIAware.manifest
    // http://msdn.microsoft.com/en-us/library/windows/desktop/dn469266%28v=vs.85%29.aspx#declaring_dpi_awareness
    float screenScale = 1.0f;
    if (dpi >= 120 && dpi < 144)
    {
        screenScale = 1.25f;
    }
    else if (dpi >= 144 && dpi < 192)
    {
        screenScale = 1.5f;
    }
    else if (dpi >= 192)
    {
        screenScale = 2.0f;
    }
    CC_LOG_DEBUG("SCREEN DPI = %d, SCREEN SCALE = %0.2f", dpi, screenScale);

    // check scale
    cc::Size frameSize = _project.getFrameSize();
    float frameScale = _project.getFrameScale();
    if (_project.isRetinaDisplay())
    {
        frameSize.width *= screenScale;
        frameSize.height *= screenScale;
    }
    else
    {
        frameScale *= screenScale;
    }

    // check screen workarea
    RECT workareaSize;
    if (SystemParametersInfo(SPI_GETWORKAREA, NULL, &workareaSize, NULL))
    {
        float workareaWidth = fabsf(workareaSize.right - workareaSize.left);
        float workareaHeight = fabsf(workareaSize.bottom - workareaSize.top);
        float frameBorderCX = GetSystemMetrics(SM_CXSIZEFRAME);
        float frameBorderCY = GetSystemMetrics(SM_CYSIZEFRAME);
        workareaWidth -= frameBorderCX * 2;
        workareaHeight -= (frameBorderCY * 2 + GetSystemMetrics(SM_CYCAPTION) + GetSystemMetrics(SM_CYMENU));
        CC_LOG_DEBUG("WORKAREA WIDTH %0.2f, HEIGHT %0.2f", workareaWidth, workareaHeight);
        while (true && frameScale > 0.25f)
        {
            if (frameSize.width * frameScale > workareaWidth || frameSize.height * frameScale > workareaHeight)
            {
                frameScale = frameScale - 0.25f;
            }
            else
            {
                break;
            }
        }

        if (frameScale < 0.25f) frameScale = 0.25f;
    }
    _project.setFrameScale(frameScale);
    CC_LOG_DEBUG("FRAME SCALE = %0.2f", frameScale);

    // create opengl view
    const Rect frameRect = Rect(0, 0, frameSize.width, frameSize.height);
    ConfigParser::getInstance()->setInitViewSize(frameSize);
    const bool isResize = _project.isResizeWindow();
    std::stringstream title;
    title << "Cocos Simulator (" << _project.getFrameScale() * 100 << "%)";
    
    auto frameWidth = (int) (_project.getFrameScale() * frameSize.width);
    auto frameHeight = (int) (_project.getFrameScale() * frameSize.height);

    _view = std::make_shared<cc::View>(title.str(), frameWidth, frameHeight);

    // create opengl view, and init app
    _app.reset(new Game(frameWidth, frameHeight));

    // path for looking Lang file, Studio Default images
    FileUtils::getInstance()->addSearchPath(getApplicationPath().c_str());

    if (!_view->init()) return 1;

    gView = _view;

    _hwnd = _view->getWindowHandler();
    player::PlayerWin::createWithHwnd(_hwnd);
    DragAcceptFiles(_hwnd, TRUE);
    // SendMessage(_hwnd, WM_SETICON, ICON_BIG, (LPARAM)icon);
    // SendMessage(_hwnd, WM_SETICON, ICON_SMALL, (LPARAM)icon);
    // FreeResource(icon);

    // path for looking Lang file, Studio Default images
    FileUtils::getInstance()->addSearchPath(getApplicationPath().c_str());

    // set window position
    if (_project.getProjectDir().length())
    {
        setZoom(_project.getFrameScale());
    }
    Vec2 pos = _project.getWindowOffset();
    if (pos.x != 0 && pos.y != 0)
    {
        RECT rect;
        GetWindowRect(_hwnd, &rect);
        if (pos.x < 0)
            pos.x = 0;
        if (pos.y < 0)
            pos.y = 0;
        MoveWindow(_hwnd, pos.x, pos.y, rect.right - rect.left, rect.bottom - rect.top, FALSE);
    }

    // init player services
    // the UI workflow is migrated into the Cocos Creator Editor
    // setupUI();
    // DrawMenuBar(_hwnd);

    // prepare
    _project.dump();

    g_oldWindowProc = (WNDPROC)SetWindowLong(_hwnd, GWLP_WNDPROC, (LONG)SimulatorWin::windowProc);

    // update window title
    updateWindowTitle();

    bool resume, pause, close;
    se::ScriptEngine::getInstance()->addRegisterCallback(setCanvasCallback);

    if (!_app->init()) return 1;
    _quit = false;

    PVRFrameEnableControlWindow(false);

    ///////////////////////////////////////////////////////////////////////////
    /////////////// changing timer resolution
    ///////////////////////////////////////////////////////////////////////////
    UINT TARGET_RESOLUTION = 1; // 1 millisecond target resolution
    TIMECAPS tc;
    UINT wTimerRes = 0;
    if (TIMERR_NOERROR == timeGetDevCaps(&tc, sizeof(TIMECAPS)))
    {
        wTimerRes = std::min(std::max(tc.wPeriodMin, TARGET_RESOLUTION), tc.wPeriodMax);
        timeBeginPeriod(wTimerRes);
    }

    float dt = 0.f;
    const DWORD _16ms = 16;

    // Main message loop:
    LARGE_INTEGER nFreq;
    LARGE_INTEGER nLast;
    LARGE_INTEGER nNow;

    LONGLONG actualInterval = 0LL; // actual frame internal
    LONGLONG desiredInterval = 0LL; // desired frame internal, 1 / fps
    LONG waitMS = 0L;

    QueryPerformanceCounter(&nLast);
    QueryPerformanceFrequency(&nFreq);
    se::ScriptEngine* se = se::ScriptEngine::getInstance();


    _app->onResume();

    while (!_quit)
    {
        desiredInterval = (LONGLONG)(1.0 / _app->getPreferredFramesPerSecond() * nFreq.QuadPart);

        resume = false;
        pause = false;
        close = false;
        while (_view->pollEvent(&_quit, &resume, &pause, &close)) {}

        if (pause) _app->onPause();
        if (resume) _app->onResume();
        if (close) _app->onClose();

        QueryPerformanceCounter(&nNow);
        actualInterval = nNow.QuadPart - nLast.QuadPart;
        if (actualInterval >= desiredInterval)
        {
            nLast.QuadPart = nNow.QuadPart;
            _app->tick();
            _view->swapbuffer();
        }
        else
        {
            // The precision of timer on Windows is set to highest (1ms) by 'timeBeginPeriod' from above code,
            // but it's still not precise enough. For example, if the precision of timer is 1ms,
            // Sleep(3) may make a sleep of 2ms or 4ms. Therefore, we subtract 1ms here to make Sleep time shorter.
            // If 'waitMS' is equal or less than 1ms, don't sleep and run into next loop to
            // boost CPU to next frame accurately.
            waitMS = (desiredInterval - actualInterval) * 1000LL / nFreq.QuadPart - 1L;
            if (waitMS > 1L)
                Sleep(waitMS);
        }
    }


    if (wTimerRes != 0)
        timeEndPeriod(wTimerRes);

    return 0;
}

// services

void SimulatorWin::setupUI()
{
    auto menuBar = player::PlayerProtocol::getInstance()->getMenuService();

    // FILE
    menuBar->addItem("FILE_MENU", tr("File"));
    menuBar->addItem("EXIT_MENU", tr("Exit"), "FILE_MENU");

    // VIEW
    menuBar->addItem("VIEW_MENU", tr("View"));
    SimulatorConfig *config = SimulatorConfig::getInstance();
    int current = config->checkScreenSize(_project.getFrameSize());
    for (int i = 0; i < config->getScreenSizeCount(); i++)
    {
        SimulatorScreenSize size = config->getScreenSize(i);
        std::stringstream menuId;
        menuId << "VIEWSIZE_ITEM_MENU_" << i;
        auto menuItem = menuBar->addItem(menuId.str(), size.title.c_str(), "VIEW_MENU");

        if (i == current)
        {
            menuItem->setChecked(true);
        }
    }

    // show FPs 
    bool displayStats = true; // asume creator default show FPS
    string fpsItemName = displayStats ? tr("Hide FPS") : tr("Show FPS");
    menuBar->addItem("FPS_MENU", fpsItemName);

    // About
    menuBar->addItem("HELP_MENU", tr("Help"));
    menuBar->addItem("ABOUT_MENUITEM", tr("About"), "HELP_MENU");

    menuBar->addItem("DIRECTION_MENU_SEP", "-", "VIEW_MENU");
    menuBar->addItem("DIRECTION_PORTRAIT_MENU", tr("Portrait"), "VIEW_MENU")
        ->setChecked(_project.isPortraitFrame());
    menuBar->addItem("DIRECTION_LANDSCAPE_MENU", tr("Landscape"), "VIEW_MENU")
        ->setChecked(_project.isLandscapeFrame());

    menuBar->addItem("VIEW_SCALE_MENU_SEP", "-", "VIEW_MENU");
    std::vector<player::PlayerMenuItem*> scaleMenuVector;
    auto scale100Menu = menuBar->addItem("VIEW_SCALE_MENU_100", tr("Zoom Out").append(" (100%)"), "VIEW_MENU");
    auto scale75Menu = menuBar->addItem("VIEW_SCALE_MENU_75", tr("Zoom Out").append(" (75%)"), "VIEW_MENU");
    auto scale50Menu = menuBar->addItem("VIEW_SCALE_MENU_50", tr("Zoom Out").append(" (50%)"), "VIEW_MENU");
    auto scale25Menu = menuBar->addItem("VIEW_SCALE_MENU_25", tr("Zoom Out").append(" (25%)"), "VIEW_MENU");
    int frameScale = int(_project.getFrameScale() * 100);

    if (frameScale == 100)
    {
        scale100Menu->setChecked(true);
    }
    else if (frameScale == 75)
    {
        scale75Menu->setChecked(true);
    }
    else if (frameScale == 50)
    {
        scale50Menu->setChecked(true);
    }
    else if (frameScale == 25)
    {
        scale25Menu->setChecked(true);
    }
    else
    {
        scale100Menu->setChecked(true);
    }

    scaleMenuVector.push_back(scale100Menu);
    scaleMenuVector.push_back(scale75Menu);
    scaleMenuVector.push_back(scale50Menu);
    scaleMenuVector.push_back(scale25Menu);

    menuBar->addItem("REFRESH_MENU_SEP", "-", "VIEW_MENU");
    menuBar->addItem("REFRESH_MENU", tr("Refresh"), "VIEW_MENU");

    HWND &hwnd = _hwnd;
    ProjectConfig &project = _project;
    EventDispatcher::CustomEventListener listener = [this, &hwnd, &project, scaleMenuVector](const CustomEvent& event) {
        auto menuEvent = dynamic_cast<const AppEvent&>(event);
            rapidjson::Document dArgParse;
            dArgParse.Parse<0>(menuEvent.getDataString().c_str());
            if (dArgParse.HasMember("name"))
            {
                string strcmd = dArgParse["name"].GetString();

                if (strcmd == "menuClicked")
                {
                    player::PlayerMenuItem *menuItem = static_cast<player::PlayerMenuItem*>(menuEvent.args[0].ptrVal);
                    if (menuItem)
                    {
                        if (menuItem->isChecked())
                        {
                            return;
                        }

                        string data = dArgParse["data"].GetString();

                        if ((data == "CLOSE_MENU") || (data == "EXIT_MENU"))
                        {
                            _instance->quit();
                        }
                        else if (data == "REFRESH_MENU")
                        {
                            _instance->relaunch();
                        }
                        else if (data.find("VIEW_SCALE_MENU_") == 0) // begin with VIEW_SCALE_MENU_
                        {
                            string tmp = data.erase(0, strlen("VIEW_SCALE_MENU_"));
                            float scale = atof(tmp.c_str()) / 100.0f;
                            project.setFrameScale(scale);

                            _instance->openProjectWithProjectConfig(project);
                        }
                        else if (data.find("VIEWSIZE_ITEM_MENU_") == 0) // begin with VIEWSIZE_ITEM_MENU_
                        {
                            string tmp = data.erase(0, strlen("VIEWSIZE_ITEM_MENU_"));
                            int index = atoi(tmp.c_str());
                            SimulatorScreenSize size = SimulatorConfig::getInstance()->getScreenSize(index);

                            if (project.isLandscapeFrame())
                            {
                                std::swap(size.width, size.height);
                            }

                            project.setFrameSize(cc::Size(size.width, size.height));
                            project.setWindowOffset(cc::Vec2(_instance->getPositionX(), _instance->getPositionY()));
                            _instance->openProjectWithProjectConfig(project);
                        }
                        else if (data == "DIRECTION_PORTRAIT_MENU")
                        {
                            project.changeFrameOrientationToPortait();
                            _instance->openProjectWithProjectConfig(project);
                        }
                        else if (data == "DIRECTION_LANDSCAPE_MENU")
                        {
                            project.changeFrameOrientationToLandscape();
                            _instance->openProjectWithProjectConfig(project);
                        }
                        else if (data == "ABOUT_MENUITEM")
                        {
                            onHelpAbout();
                        }
                        else if (data == "FPS_MENU")
                        {
                            bool displayStats = !_app->isDisplayStats();
                            _app->setDisplayStats(displayStats);
                            menuItem->setTitle(displayStats ? tr("Hide FPS") : tr("Show FPS"));
                        }
                    }
                }
            }
    };
    EventDispatcher::addCustomEventListener(kAppEventName, listener);
}

void SimulatorWin::setZoom(float frameScale)
{
    _project.setFrameScale(frameScale);
}

void SimulatorWin::updateWindowTitle()
{
    std::stringstream title;
    title << "Cocos " << tr("Simulator") << " (" << _project.getFrameScale() * 100 << "%)";
    std::u16string u16title;
    cc::StringUtils::UTF8ToUTF16(title.str(), u16title);
    SetWindowText(_hwnd, (LPCTSTR)u16title.c_str());
}

// debug log
void SimulatorWin::writeDebugLog(const char *log)
{
    if (!_writeDebugLogFile) return;

    fputs(log, _writeDebugLogFile);
    fputc('\n', _writeDebugLogFile);
    fflush(_writeDebugLogFile);
}

void SimulatorWin::parseCocosProjectConfig(ProjectConfig &config)
{
    // get project directory
    ProjectConfig tmpConfig;
    // load project config from command line args
    std::vector<string> args;
    for (int i = 0; i < __argc; ++i)
    {
        wstring ws(__wargv[i]);
        string s;
        s.assign(ws.begin(), ws.end());
        args.push_back(s);
    }

    if (args.size() >= 2)
    {
        if (args.size() && args.at(1).at(0) == '/')
        {
            // IDEA:
            // for Code IDE before RC2
            tmpConfig.setProjectDir(args.at(1));
        }

        tmpConfig.parseCommandLine(args);
    }

    // set project directory as search root path
    string solutionDir = tmpConfig.getProjectDir();
    if (!solutionDir.empty())
    {
        for (int i = 0; i < solutionDir.size(); ++i)
        {
            if (solutionDir[i] == '\\')
            {
                solutionDir[i] = '/';
            }
        }
        int nPos = -1;
        if (solutionDir[solutionDir.length() - 1] == '/')
            nPos = solutionDir.rfind('/', solutionDir.length() - 2);
        else
            nPos = solutionDir.rfind('/');
        if (nPos > 0)
            solutionDir = solutionDir.substr(0, nPos + 1);
        FileUtils::getInstance()->setDefaultResourceRootPath(solutionDir);
        FileUtils::getInstance()->addSearchPath(solutionDir);
        FileUtils::getInstance()->addSearchPath(tmpConfig.getProjectDir().c_str());
    }
    else
    {
        FileUtils::getInstance()->setDefaultResourceRootPath(tmpConfig.getProjectDir().c_str());
    }

    // parse config.json when firstly init ConfigParser single instance
    auto parser = ConfigParser::getInstance();

    // set information
    config.setConsolePort(parser->getConsolePort());
    config.setFileUploadPort(parser->getUploadPort());
    config.setFrameSize(parser->getInitViewSize());
    if (parser->isLanscape())
    {
        config.changeFrameOrientationToLandscape();
    }
    else
    {
        config.changeFrameOrientationToPortait();
    }
    config.setScriptFile(parser->getEntryFile());
}

//
// D:\aaa\bbb\ccc\ddd\abc.txt --> D:/aaa/bbb/ccc/ddd/abc.txt
//
std::string SimulatorWin::convertPathFormatToUnixStyle(const std::string& path)
{
    std::string ret = path;
    int len = ret.length();
    for (int i = 0; i < len; ++i)
    {
        if (ret[i] == '\\')
        {
            ret[i] = '/';
        }
    }
    return ret;
}

//
// @return: C:/Users/win8/Documents/
//
std::string SimulatorWin::getUserDocumentPath()
{
    TCHAR filePath[MAX_PATH];
    SHGetSpecialFolderPath(NULL, filePath, CSIDL_PERSONAL, FALSE);
    int length = 2 * wcslen(filePath);
    char* tempstring = new char[length + 1];
    wcstombs(tempstring, filePath, length + 1);
    string userDocumentPath(tempstring);
    delete [] tempstring;

    userDocumentPath = convertPathFormatToUnixStyle(userDocumentPath);
    userDocumentPath.append("/");

    return userDocumentPath;
}

//
// convert Unicode/LocalCode TCHAR to Utf8 char
//
char* SimulatorWin::convertTCharToUtf8(const TCHAR* src)
{
#ifdef UNICODE
    WCHAR* tmp = (WCHAR*)src;
    size_t size = wcslen(src) * 3 + 1;
    char* dest = new char[size];
    memset(dest, 0, size);
    WideCharToMultiByte(CP_UTF8, 0, tmp, -1, dest, size, NULL, NULL);
    return dest;
#else
    char* tmp = (char*)src;
    uint32 size = strlen(tmp) + 1;
    WCHAR* dest = new WCHAR[size];
    memset(dest, 0, sizeof(WCHAR)*size);
    MultiByteToWideChar(CP_ACP, 0, src, -1, dest, (int)size); // convert local code to unicode.

    size = wcslen(dest) * 3 + 1;
    char* dest2 = new char[size];
    memset(dest2, 0, size);
    WideCharToMultiByte(CP_UTF8, 0, dest, -1, dest2, size, NULL, NULL); // convert unicode to utf8.
    delete[] dest;
    return dest2;
#endif
}

//
std::string SimulatorWin::getApplicationExePath()
{
    TCHAR szFileName[MAX_PATH];
    GetModuleFileName(NULL, szFileName, MAX_PATH);
    std::u16string u16ApplicationName;
    char *applicationExePath = convertTCharToUtf8(szFileName);
    std::string path(applicationExePath);
    CC_SAFE_FREE(applicationExePath);

    return path;
}

std::string SimulatorWin::getApplicationPath()
{
    std::string path = getApplicationExePath();
    size_t pos;
    while ((pos = path.find_first_of("\\")) != std::string::npos)
    {
        path.replace(pos, 1, "/");
    }
    size_t p = path.find_last_of("/");
    string workdir;
    if (p != path.npos)
    {
        workdir = path.substr(0, p);
    }

    return workdir;
}

LRESULT CALLBACK SimulatorWin::windowProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    if (!_instance) return 0;

    switch (uMsg)
    {
    case WM_SYSCOMMAND:
    case WM_COMMAND:
    {
        if (HIWORD(wParam) == 0)
        {
            // menu
            WORD menuId = LOWORD(wParam);
            auto menuService = dynamic_cast<player::PlayerMenuServiceWin*> (player::PlayerProtocol::getInstance()->getMenuService());
            auto menuItem = menuService->getItemByCommandId(menuId);
            if (menuItem)
            {
                AppEvent event(kAppEventName, APP_EVENT_MENU);

                std::stringstream buf;
                buf << "{\"data\":\"" << menuItem->getMenuId().c_str() << "\"";
                buf << ",\"name\":" << "\"menuClicked\"" << "}";
                event.setDataString(buf.str());
                event.args[0].ptrVal = (void*)menuItem;
                cc::EventDispatcher::dispatchCustomEvent(event);
            }

            if (menuId == ID_HELP_ABOUT)
            {
                onHelpAbout();
            }
        }
        break;
    }
    case WM_KEYDOWN:
    {
        if (wParam == VK_F5)
        {
            _instance->relaunch();
        }
        break;
    }

    case WM_COPYDATA:
    {
        PCOPYDATASTRUCT pMyCDS = (PCOPYDATASTRUCT)lParam;
        if (pMyCDS->dwData == 1)
        {
            const char *szBuf = (const char*)(pMyCDS->lpData);
            SimulatorWin::getInstance()->writeDebugLog(szBuf);
            break;
        }
    }

    case WM_DESTROY:
    {
        DragAcceptFiles(hWnd, FALSE);
        break;
    }

    }
    return g_oldWindowProc(hWnd, uMsg, wParam, lParam);
}

void SimulatorWin::onOpenFile(const std::string &filePath)
{
    string entry = filePath;
    if (entry.empty()) return;

    if (stringEndWith(entry, "config.json") || stringEndWith(entry, ".csb") || stringEndWith(entry, ".csd"))
    {
        replaceAll(entry, "\\", "/");
        size_t p = entry.find_last_of("/");
        if (p != entry.npos)
        {
            string workdir = entry.substr(0, p);
            _project.setProjectDir(workdir);
        }

        _project.setScriptFile(entry);
        if (stringEndWith(entry, CONFIG_FILE))
        {
            ConfigParser::getInstance()->readConfig(entry);
            _project.setScriptFile(ConfigParser::getInstance()->getEntryFile());
        }
        openProjectWithProjectConfig(_project);
    }
    else
    {
        auto title = tr("Open File") + tr("Error");
        auto msg = tr("Only support") + " config.json;*.csb;*.csd";
        auto msgBox = player::PlayerProtocol::getInstance()->getMessageBoxService();
        msgBox->showMessageBox(title, msg);
    }
}

