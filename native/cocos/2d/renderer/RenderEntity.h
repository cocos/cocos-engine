#pragma once
#include <cocos/2d/renderer/RenderDrawInfo.h>
#include <vector>

namespace cc {
class RenderEntity
{

public:
    RenderEntity(/* args */);
    ~RenderEntity();
    
private:
    /* data */
    ccstd::vector<RenderDrawInfo*> drawInfos;
};
}
