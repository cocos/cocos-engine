#pragma once
#include <vector>
#include <stdint.h>
#include "bindings/utils/BindingUtils.h"
namespace spine {

struct SpineMeshBlendInfo {
    uint32_t blendMode;
    uint32_t indexOffset;
    uint32_t indexCount;
};

class SpineSkeletonMeshData {
public:
    SpineSkeletonMeshData();
    SpineSkeletonMeshData(uint32_t vc, uint32_t ic, uint32_t byteStride);
    SpineSkeletonMeshData(uint32_t slot, uint8_t* vBuf, uint16_t* iBuf,
        uint32_t vc, uint32_t ic, uint32_t byteStride, uint32_t blend);
    ~SpineSkeletonMeshData();
    void Release();
    void allocData(uint32_t vc, uint32_t ic, uint32_t byteStride);
public:
    uint8_t  *vBuf;
    uint16_t *iBuf;
    uint32_t vCount;
    uint32_t iCount;
    uint32_t byteStride;
    uint32_t slotIndex;
    uint32_t blendMode;
};

class SpineSkeletonModelData {
public:
    SpineSkeletonModelData();
    ~SpineSkeletonModelData();
    void allocData(uint32_t vc, uint32_t ic, uint32_t byteStride);
public:
    std::vector<uint8_t> vBuf;
    std::vector<uint16_t> iBuf;
    uint32_t vCount;
    uint32_t iCount;
    uint32_t byteStride;
    uint32_t slotIndex;
    std::vector<SpineMeshBlendInfo> blendList;
};
}
