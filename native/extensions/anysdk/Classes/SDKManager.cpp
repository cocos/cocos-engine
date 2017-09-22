#include "SDKManager.h"

using namespace anysdk::framework;

SDKManager* SDKManager::_pInstance = nullptr;

SDKManager::SDKManager()
{
}

SDKManager::~SDKManager()
{
    AgentManager::getInstance()->unloadAllPlugins();
    AgentManager::end();
}

SDKManager* SDKManager::getInstance()
{
    if (_pInstance == nullptr) {
        _pInstance = new SDKManager();
    }
    return _pInstance;
}

void SDKManager::purge()
{
    if (_pInstance != nullptr)
    {
        delete _pInstance;
        _pInstance = nullptr;
    }
}

void SDKManager::loadAllPlugins()
{
    /**
     * appKey, appSecret and privateKey are the only three parameters generated 
     * after the packing tool client finishes creating the game.
     * The oauthLoginServer parameter is the API address provided by the game service
     * to login verification
     */
    std::string oauthLoginServer = "OAUTH_LOGIN_SERVER";
    std::string appKey = "APP_KEY";
    std::string appSecret = "APP_SERCRET";
    std::string privateKey = "PRIVATE_KEY";
    
    AgentManager* pAgent = AgentManager::getInstance();
    pAgent->init(appKey,appSecret,privateKey,oauthLoginServer);
    
    //Initialize plug-ins, including SDKs.
    pAgent->loadAllPlugins();
}


