#include "main.h"
#include "AppDelegate.h"

#if _MSC_VER > 1800
#pragma comment(lib,"libcocos2d_2015.lib")
#pragma comment(lib,"libSpine_2015.lib")
#pragma comment(lib,"libDragonBones_2015.lib")
#pragma comment(lib,"libjscocos2d_2015")
#pragma comment(lib,"libBox2D_2015")
#else
#pragma comment(lib,"libcocos2d_2013.lib")
#pragma comment(lib,"libSpine_2013.lib")
#pragma comment(lib,"libDragonBones_2013.lib")
#pragma comment(lib,"libjscocos2d_2013")
#pragma comment(lib,"libBox2D_2013")
#endif

USING_NS_CC;

// uncomment below line, open debug console
// #define USE_WIN32_CONSOLE

int APIENTRY _tWinMain(HINSTANCE hInstance,
	HINSTANCE hPrevInstance,
	LPTSTR    lpCmdLine,
	int       nCmdShow)
{
	UNREFERENCED_PARAMETER(hPrevInstance);
	UNREFERENCED_PARAMETER(lpCmdLine);

#ifdef USE_WIN32_CONSOLE
	AllocConsole();
	freopen("CONIN$", "r", stdin);
	freopen("CONOUT$", "w", stdout);
	freopen("CONOUT$", "w", stderr);
#endif

	// create the application instance
	AppDelegate app;
	int ret = Application::getInstance()->run();

#ifdef USE_WIN32_CONSOLE
	FreeConsole();
#endif

	return ret;
}
