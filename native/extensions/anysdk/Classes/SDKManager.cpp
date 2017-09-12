#include "SDKManager.h"

using namespace anysdk::framework;

SDKManager* SDKManager::_pInstance = NULL;

SDKManager::SDKManager()
{
}

SDKManager::~SDKManager()
{
	if (_pAgent)
    {
        _pAgent->unloadAllPlugins();
    }
}

SDKManager* SDKManager::getInstance()
{
    if (_pInstance == NULL) {
        _pInstance = new SDKManager();
    }
    return _pInstance;
}

void SDKManager::purge()
{
    if (_pInstance)
    {
        delete _pInstance;
        _pInstance = NULL;
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
    
    _pAgent = AgentManager::getInstance();
    _pAgent->init(appKey,appSecret,privateKey,oauthLoginServer);
    
    //Initialize plug-ins, including SDKs.
    _pAgent->loadAllPlugins();
}


