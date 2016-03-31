/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2015 Chukong Technologies Inc.

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
#include "base/CCUserDefault.h"
#include "platform/CCPlatformConfig.h"
#include "base/ccUtils.h"
#include "platform/CCCommon.h"
#include "base/base64.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "platform/android/jni/JniHelper.h"

// root name of xml
#define USERDEFAULT_ROOT_NAME    "userDefaultRoot"

#define helperClassName "org/cocos2dx/lib/Cocos2dxHelper"
using namespace std;

NS_CC_BEGIN

/**
 * implements of UserDefault
 */

UserDefault* UserDefault::_userDefault = nullptr;
string UserDefault::_filePath = "";
bool UserDefault::_isFilePathInitialized = false;

UserDefault::~UserDefault()
{
}

UserDefault::UserDefault()
{
}

void UserDefault::destroyInstance()
{
   CC_SAFE_DELETE(_userDefault);
}

bool UserDefault::getBoolForKey(const char* pKey)
{
    return getBoolForKey(pKey, false);
}

bool UserDefault::getBoolForKey(const char* pKey, bool defaultValue)
{
    return JniHelper::callStaticBooleanMethod(helperClassName, "getBoolForKey", pKey, defaultValue);
}

int UserDefault::getIntegerForKey(const char* pKey)
{
    return getIntegerForKey(pKey, 0);
}

int UserDefault::getIntegerForKey(const char* pKey, int defaultValue)
{
    return JniHelper::callStaticIntMethod(helperClassName, "getIntegerForKey", pKey, defaultValue);
}

float UserDefault::getFloatForKey(const char* pKey)
{
    return getFloatForKey(pKey, 0.0f);
}

float UserDefault::getFloatForKey(const char* pKey, float defaultValue)
{
    return JniHelper::callStaticFloatMethod(helperClassName, "getFloatForKey", pKey, defaultValue);
}

double  UserDefault::getDoubleForKey(const char* pKey)
{
    return getDoubleForKey(pKey, 0.0);
}

double UserDefault::getDoubleForKey(const char* pKey, double defaultValue)
{
    return JniHelper::callStaticDoubleMethod(helperClassName, "getDoubleForKey", pKey, defaultValue);
}

std::string UserDefault::getStringForKey(const char* pKey)
{
    return getStringForKey(pKey, "");
}

string UserDefault::getStringForKey(const char* pKey, const std::string & defaultValue)
{
    return JniHelper::callStaticStringMethod(helperClassName, "getStringForKey", pKey, defaultValue);
}

Data UserDefault::getDataForKey(const char* pKey)
{
    return getDataForKey(pKey, Data::Null);
}

Data UserDefault::getDataForKey(const char* pKey, const Data& defaultValue)
{
    char * encodedDefaultData = NULL;
    unsigned int encodedDefaultDataLen = !defaultValue.isNull() ? base64Encode(defaultValue.getBytes(), defaultValue.getSize(), &encodedDefaultData) : 0;

    string encodedStr = JniHelper::callStaticStringMethod(helperClassName, "getStringForKey", pKey, (const char*)encodedDefaultData);

    if (encodedDefaultData)
        free(encodedDefaultData);

    CCLOG("ENCODED STRING: --%s--%d", encodedStr.c_str(), encodedStr.length());

    unsigned char * decodedData = NULL;
    int decodedDataLen = base64Decode((unsigned char*)encodedStr.c_str(), (unsigned int)encodedStr.length(), &decodedData);

    CCLOG("DECODED DATA: %s %d", decodedData, decodedDataLen);

    if (decodedData && decodedDataLen) {
        Data ret;
        ret.fastSet(decodedData, decodedDataLen);
        return ret;
    }

    return defaultValue;
}


void UserDefault::setBoolForKey(const char* pKey, bool value)
{
    JniHelper::callStaticVoidMethod(helperClassName, "setBoolForKey", pKey, value);
}

void UserDefault::setIntegerForKey(const char* pKey, int value)
{
    JniHelper::callStaticVoidMethod(helperClassName, "setIntegerForKey", pKey, value);
}

void UserDefault::setFloatForKey(const char* pKey, float value)
{
    JniHelper::callStaticVoidMethod(helperClassName, "setFloatForKey", pKey, value);
}

void UserDefault::setDoubleForKey(const char* pKey, double value)
{
    JniHelper::callStaticVoidMethod(helperClassName, "setDoubleForKey", pKey, value);
}

void UserDefault::setStringForKey(const char* pKey, const std::string & value)
{
    JniHelper::callStaticVoidMethod(helperClassName, "setStringForKey", pKey, value);
}

void UserDefault::setDataForKey(const char* pKey, const Data& value)
{
    CCLOG("SET DATA FOR KEY: --%s--%d", value.getBytes(), (int)(value.getSize()));
    char * encodedData = nullptr;
    unsigned int encodedDataLen = base64Encode(value.getBytes(), value.getSize(), &encodedData);

    CCLOG("SET DATA ENCODED: --%s", encodedData);

    JniHelper::callStaticVoidMethod(helperClassName, "setStringForKey", pKey, (const char*)encodedData);

    if (encodedData)
        free(encodedData);
}

UserDefault* UserDefault::getInstance()
{
    if (! _userDefault)
    {
        _userDefault = new (std::nothrow) UserDefault();
    }

    return _userDefault;
}

bool UserDefault::isXMLFileExist()
{
    return false;
}

void UserDefault::initXMLFilePath()
{
}

// create new xml file
bool UserDefault::createXMLFile()
{
    return false;
}

const string& UserDefault::getXMLFilePath()
{
    return _filePath;
}

void UserDefault::flush()
{
}

void UserDefault::deleteValueForKey(const char* key)
{
    // check the params
    if (!key)
    {
        CCLOG("the key is invalid");
    }

    JniHelper::callStaticVoidMethod(helperClassName, "deleteValueForKey", key);

    flush();
}
NS_CC_END

#endif // (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

