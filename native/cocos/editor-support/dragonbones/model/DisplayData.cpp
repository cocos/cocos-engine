//
// Created by liangshuochen on 08/06/2017.
//

#include "DisplayData.h"
#include "BoundingBoxData.h"
#include "UserData.h"

DRAGONBONES_NAMESPACE_BEGIN

void VerticesData::clear() {
    if (!isShared && weight != nullptr) {
        weight->returnToPool();
    }

    isShared = false;
    inheritDeform = false;
    offset = 0;
    data = nullptr;
    weight = nullptr;
}

void VerticesData::shareFrom(const VerticesData& value) {
    isShared = true;
    offset = value.offset;
    weight = value.weight;
}

void DisplayData::_onClear() {
    name = "";
    path = "";
    transform.identity();
    parent = nullptr;
}

void ImageDisplayData::_onClear() {
    DisplayData::_onClear();

    type = DisplayType::Image;
    pivot.clear();
    texture = nullptr;
}

void ArmatureDisplayData::_onClear() {
    DisplayData::_onClear();

    for (const auto action : actions) {
        action->returnToPool();
    }

    type = DisplayType::Armature;
    inheritAnimation = false;
    actions.clear();
    armature = nullptr;
}

void ArmatureDisplayData::addAction(ActionData* value) {
    actions.push_back(value);
}

void MeshDisplayData::_onClear() {
    DisplayData::_onClear();

    type = DisplayType::Mesh;
    vertices.clear();
    texture = nullptr;
}

void BoundingBoxDisplayData::_onClear() {
    DisplayData::_onClear();

    if (boundingBox != nullptr) {
        boundingBox->returnToPool();
    }

    type = DisplayType::BoundingBox;
    boundingBox = nullptr;
}

void WeightData::_onClear() {
    count = 0;
    offset = 0;
    bones.clear();
}

void WeightData::addBone(BoneData* value) {
    bones.push_back(value);
}

DRAGONBONES_NAMESPACE_END
