#ifndef __SDK_MANAGER_H__
#define __SDK_MANAGER_H__

#include "AgentManager.h"

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
};

#endif
