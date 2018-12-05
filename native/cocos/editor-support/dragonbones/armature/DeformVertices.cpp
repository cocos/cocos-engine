#include "DeformVertices.h"
#include "../model/DragonBonesData.h"
#include "../model/DisplayData.h"
#include "../armature/Armature.h"
#include "../armature/Bone.h"

DRAGONBONES_NAMESPACE_BEGIN

void DeformVertices::_onClear()
{
    verticesDirty = false;
    vertices.clear();
    bones.clear();
    verticesData = nullptr;
}

void DeformVertices::init(const VerticesData* verticesDataValue, Armature* armature)
{
    verticesData = verticesDataValue;

    if (verticesData != nullptr)
    {
        unsigned vertexCount = 0;
        if (verticesData->weight != nullptr) 
        {
            vertexCount = verticesData->weight->count * 2;
        }
        else {
            vertexCount = verticesData->data->intArray[verticesData->offset + (unsigned)BinaryOffset::MeshVertexCount] * 2;
        }

        verticesDirty = true;
        vertices.resize(vertexCount);
        bones.clear();
        //
        for (std::size_t i = 0, l = vertices.size(); i < l; ++i)
        {
            vertices[i] = 0.0f;
        }

        if (verticesData->weight != nullptr)
        {
            for (std::size_t i = 0, l = verticesData->weight->bones.size(); i < l; ++i)
            {
                const auto bone = armature->getBone(verticesData->weight->bones[i]->name);
                if (bone != nullptr)
                {
                    bones.push_back(bone);
                }
            }
        }
    }
    else 
    {
        verticesDirty = false;
        vertices.clear();
        bones.clear();
        verticesData = nullptr;
    }
}

bool DeformVertices::isBonesUpdate() const
{
    for (const auto bone : bones) 
    {
        if (bone != nullptr && bone->_childrenTransformDirty) 
        {
            return true;
        }
    }

    return false;
}

DRAGONBONES_NAMESPACE_END