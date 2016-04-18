
#include "CocoStudio.h"
#include "Armature/CCArmatureDataManager.h"
#include "Armature/CCDataReaderHelper.h"
#include "Armature/CCSpriteFrameCacheHelper.h"
#include "CCActionManagerEx.h"
#include "DictionaryHelper.h"

namespace cocostudio
{
    void destroyCocosStudio()
    {
        ActionManagerEx::destroyInstance();
        SpriteFrameCacheHelper::purge();
        
        ArmatureDataManager::destroyInstance();
        DataReaderHelper::purge();
        DictionaryHelper::destroyInstance();
    }
}

