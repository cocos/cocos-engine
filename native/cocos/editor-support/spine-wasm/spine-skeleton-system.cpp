#include "spine-skeleton-system.h"
#include "spine-skeleton-instance.h"
#include "spine-mesh-data.h"

using namespace spine;

std::vector<SpineSkeletonInstance*> SpineSkeletonSystem::vectorSpines;

void SpineSkeletonSystem::updateAnimation(float deltaTime) {
    auto count = static_cast<int>(vectorSpines.size());
    for (int i = count - 1; i >= 0; --i) {
        SpineSkeletonInstance* spineInstance = vectorSpines[i];
        if(!spineInstance->enable) continue;
        if (!spineInstance->isCache) {
            spineInstance->updateAnimation(deltaTime);
        }
    }
}

int SpineSkeletonSystem::getCount() {
   auto count = vectorSpines.size(); 
   return count;
}

void SpineSkeletonSystem::updateRenderData() {
    SpineMeshData::reset();
}

void SpineSkeletonSystem::addSpineInstance(SpineSkeletonInstance* instance) {
    if(vectorSpines.size() == vectorSpines.capacity()){
        vectorSpines.reserve(vectorSpines.size() + 20);
    }
    vectorSpines.push_back(instance);
}

void SpineSkeletonSystem::removeSpineInstance(SpineSkeletonInstance* instance) {
    auto it = std::find(vectorSpines.begin(), vectorSpines.end(), instance);
    if (it != vectorSpines.end()) {
        vectorSpines.erase(it);
        delete instance;
    }
}