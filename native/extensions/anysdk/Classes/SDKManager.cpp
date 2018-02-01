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


