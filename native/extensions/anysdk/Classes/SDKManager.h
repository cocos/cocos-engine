#ifndef __SDK_MANAGER_H__
#define __SDK_MANAGER_H__

#include "AgentManager.h"
using namespace anysdk::framework;
using namespace std;
class SDKManager
{
public:
    static SDKManager* getInstance();
    static void purge();

    void loadAllPlugins();

private:
    SDKManager();
    virtual ~SDKManager();

    static SDKManager* _pInstance;

	  AgentManager* _pAgent;
};

#endif
