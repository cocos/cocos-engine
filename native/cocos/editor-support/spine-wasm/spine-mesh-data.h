#ifndef __SPINE_MESH_DATA_H__
#define __SPINE_MESH_DATA_H__
#include <stdint.h>

class SpineMeshData {
public:
    static void initMeshMemory();
    static void releaseMeshMemory();
    static void reset();
    static void moveVB(uint32_t count);
    static void moveIB(uint32_t count);
    static uint8_t *queryVBuffer(uint32_t count);
    static uint16_t *queryIBuffer(uint32_t count);
    static uint8_t *vb();
    static uint16_t *ib();

private:
    static uint8_t *vBuf;
    static uint16_t *iBuf;
    static uint8_t *vPtr;
    static uint16_t *iPtr;
    static uint8_t *vEnd;
    static uint16_t *iEnd;
};

#endif