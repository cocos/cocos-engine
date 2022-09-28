#include "GFXAccelerationStructure.h"

namespace cc {

namespace gfx {

AccelerationStructure::AccelerationStructure()
: GFXObject(ObjectType::ACCELERATION_STRUCTURE){

}

AccelerationStructure::~AccelerationStructure() = default;

void AccelerationStructure::initialize(const AccelerationStructureInfo &info){
    _info = info;
    //todo
    doInit(info);
}

void AccelerationStructure::build() {
    doBuild();
}

void AccelerationStructure::update(){
    //todo
    doUpdate();
}

void AccelerationStructure::destroy() {
    doDestroy();
    _info = AccelerationStructureInfo();
}

} // namespace gfx
} // namespace cc
