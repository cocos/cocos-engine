#include <vector>
#include "spine-skeleton-instance.h"

using namespace spine;
class SpineSkeletonSystem
{
public:
    static void updateAnimation(float deltaTime);
    static void updateRenderData();
    static int getCount();
    static void addSpineInstance(SpineSkeletonInstance* instance);
    static void removeSpineInstance(SpineSkeletonInstance* instance);
private:
    static std::vector<SpineSkeletonInstance*> vectorSpines;
};