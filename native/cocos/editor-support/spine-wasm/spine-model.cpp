#include "spine-model.h"

SpineModel::SpineModel() {
    SpineModel::data = new std::vector<uint32_t>(6, 0);
}

SpineModel::~SpineModel() {
    delete SpineModel::data; 
    SpineModel::data = nullptr;
}

/*
void SpineModel::addSlotMesh(SlotMesh& mesh, bool needMerge) {
    bool canMerge = false;
    auto count = meshArray.size();
    if (needMerge && count >= 1) {
        auto* lastMesh = &meshArray[count - 1];
        if (lastMesh->blendMode == mesh.blendMode && lastMesh->textureID == mesh.textureID) {
            canMerge = true;
            lastMesh->vCount += mesh.vCount;
            lastMesh->iCount += mesh.iCount;
        }
    }
    if (!canMerge) {
        auto mergeMesh = SlotMesh(mesh.vBuf, mesh.iBuf, mesh.vCount, mesh.iCount);
        mergeMesh.blendMode = mesh.blendMode;
        mergeMesh.textureID = mesh.textureID;
        meshArray.push_back(mergeMesh);
    }
    auto indexCount = mesh.iCount;
    uint16_t* iiPtr = mesh.iBuf;
    for (uint16_t i = 0; i < indexCount; i++) {
        iiPtr[i] += vCount;
    } 

    auto vertexCount = mesh.vCount;
    float* floatPtr = (float*)mesh.vBuf;
    int floatStride = this->byteStride / 4;
    for (int i = 0; i < vertexCount; i++) {
        floatPtr[floatStride * i + 2] = 0;
    }
    vCount += vertexCount;
    iCount += indexCount;
}
*/

void SpineModel::addSlotMesh(SlotMesh& mesh, bool needMerge) {
    bool canMerge = false;
    auto count = data->size();
    if (needMerge && count > 0) {
        if (data->at(count - 2) == mesh.blendMode && data->at(count - 1) == mesh.textureID) {
            canMerge = true;
            data->at(count-4) += mesh.vCount;
            data->at(count-3) += mesh.iCount;
        }
    }
    if (!canMerge) {
        data->resize(count + 6);
        data->at(count) = (uint32_t)mesh.vBuf;
        data->at(count + 1) = (uint32_t)mesh.iBuf;
        data->at(count + 2) = mesh.vCount;
        data->at(count + 3) = mesh.iCount;
        data->at(count + 4) = mesh.blendMode;
        data->at(count + 5) = mesh.textureID;
    }

    auto indexCount = mesh.iCount;
    uint16_t* iiPtr = mesh.iBuf;
    for (uint16_t i = 0; i < indexCount; i++) {
        iiPtr[i] += vCount;
    } 

    auto vertexCount = mesh.vCount;
    float* floatPtr = (float*)mesh.vBuf;
    int floatStride = this->byteStride / 4;
    for (int i = 0; i < vertexCount; i++) {
        floatPtr[floatStride * i + 2] = 0;
    }
    vCount += vertexCount;
    iCount += indexCount;
}

void SpineModel::clearMeshes() {
    //for (auto it = meshArray.begin(); it != meshArray.end(); ++it) {
    //    delete &(*it);
    //}
    //meshArray.clear();
    data->resize(0);
    vCount = 0;
    iCount = 0;
}

std::vector<uint32_t>* SpineModel::getData() {
    return data;
}

//std::vector<SlotMesh>* SpineModel::getMeshes() {
//    return &meshArray;
//}

void SpineModel::setBufferPtr(uint8_t* vp, uint16_t* ip) {
    vPtr = (uint32_t)vp;
    iPtr = (uint32_t)ip;
}
