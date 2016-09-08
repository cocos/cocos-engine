
#include "editor-support/cocostudio/CocoStudio.h"


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

