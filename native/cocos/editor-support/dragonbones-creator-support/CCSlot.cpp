/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
#include "dragonbones-creator-support/CCSlot.h"
#include "dragonbones-creator-support/CCTextureAtlasData.h"
#include "dragonbones-creator-support/CCArmatureDisplay.h"

USING_NS_CC;

DRAGONBONES_NAMESPACE_BEGIN

void CCSlot::_onClear()
{
    Slot::_onClear();
    disposeTriangles();
    _localMatrix.setIdentity();
    worldMatrix.setIdentity();
    _worldMatDirty = true;
}

void CCSlot::disposeTriangles()
{
    if (worldVerts){
        delete[] worldVerts;
        worldVerts = nullptr;
    }
    if (triangles.verts)
    {
        delete[] triangles.verts;
        triangles.verts = nullptr;
    }
    if (triangles.indices)
    {
        delete[] triangles.indices;
        triangles.indices = nullptr;
    }
    triangles.indexCount = 0;
    triangles.vertCount = 0;
}

void CCSlot::adjustTriangles(const unsigned vertexCount, const unsigned indicesCount)
{
    if (triangles.vertCount < vertexCount)
    {
        if (triangles.verts)
        {
            delete[] triangles.verts;
        }
        triangles.verts = new middleware::V2F_T2F_C4B[vertexCount];
        
        if (worldVerts)
        {
            delete[] worldVerts;
        }
        worldVerts = new middleware::V2F_T2F_C4B[vertexCount];
    }
    triangles.vertCount = vertexCount;
    
    if (triangles.indexCount < indicesCount)
    {
        if (triangles.indices)
        {
            delete[] triangles.indices;
        }
        triangles.indices = new unsigned short[indicesCount];
    }
    triangles.indexCount = indicesCount;
}

void CCSlot::_initDisplay(void* value, bool isRetain)
{
    
}

void CCSlot::_disposeDisplay(void* value, bool isRelease)
{
    
}

void CCSlot::_onUpdateDisplay()
{
    
}

void CCSlot::_addDisplay()
{
    _visible = true;
}

void CCSlot::_replaceDisplay(void* value, bool isArmatureDisplay)
{
    
}

void CCSlot::_removeDisplay()
{
    _visible = false;
}

void CCSlot::_updateZOrder()
{
    
}

void CCSlot::_updateVisible()
{
    _visible = _parent->getVisible();
}

middleware::Texture2D* CCSlot::getTexture() const
{
    const auto currentTextureData = static_cast<CCTextureData*>(_textureData);
    if (!currentTextureData || !currentTextureData->spriteFrame)
    {
        return nullptr;
    }
    return currentTextureData->spriteFrame->getTexture();
}

void CCSlot::_updateFrame()
{
    const auto currentVerticesData = (_deformVertices != nullptr && _display == _meshDisplay) ? _deformVertices->verticesData : nullptr;
    const auto currentTextureData = static_cast<CCTextureData*>(_textureData);

    if (_displayIndex >= 0 && _display != nullptr && currentTextureData != nullptr)
    {
        if (currentTextureData->spriteFrame != nullptr)
        {
            const auto& region = currentTextureData->region;
            const auto texture = currentTextureData->spriteFrame->getTexture();
            const auto textureWidth = texture->getPixelsWide();
            const auto textureHeight = texture->getPixelsHigh();
            
            if (currentVerticesData != nullptr) // Mesh.
            {
                const auto data = currentVerticesData->data;
                const auto intArray = data->intArray;
                const auto floatArray = data->floatArray;
                const unsigned vertexCount = intArray[currentVerticesData->offset + (unsigned)BinaryOffset::MeshVertexCount];
                const unsigned triangleCount = intArray[currentVerticesData->offset + (unsigned)BinaryOffset::MeshTriangleCount];
                int vertexOffset = intArray[currentVerticesData->offset + (unsigned)BinaryOffset::MeshFloatOffset];

                if (vertexOffset < 0)
                {
                    vertexOffset += 65536; // Fixed out of bouds bug.
                }

                const unsigned uvOffset = vertexOffset + vertexCount * 2;
                const unsigned indicesCount = triangleCount * 3;
                adjustTriangles(vertexCount, indicesCount);
                auto vertices = triangles.verts;
                auto vertexIndices = triangles.indices;
                
                boundsRect.origin.x = 999999.0f;
                boundsRect.origin.y = 999999.0f;
                boundsRect.size.width = -999999.0f;
                boundsRect.size.height = -999999.0f;

                for (std::size_t i = 0, l = vertexCount * 2; i < l; i += 2)
                {
                    const auto iH = i / 2;
                    const auto x = floatArray[vertexOffset + i];
                    const auto y = floatArray[vertexOffset + i + 1];
                    auto u = floatArray[uvOffset + i];
                    auto v = floatArray[uvOffset + i + 1];
                    middleware::V2F_T2F_C4B& vertexData = vertices[iH];
                    vertexData.vertex.x = x;
                    vertexData.vertex.y = -y;

                    if (currentTextureData->rotated)
                    {
                        vertexData.texCoord.u = (region.x + (1.0f - v) * region.width) / textureWidth;
                        vertexData.texCoord.v = (region.y + u * region.height) / textureHeight;
                    }
                    else
                    {
                        vertexData.texCoord.u = (region.x + u * region.width) / textureWidth;
                        vertexData.texCoord.v = (region.y + v * region.height) / textureHeight;
                    }

                    vertexData.color = cocos2d::Color4B::WHITE;

                    if (boundsRect.origin.x > x)
                    {
                        boundsRect.origin.x = x;
                    }

                    if (boundsRect.size.width < x)
                    {
                        boundsRect.size.width = x;
                    }

                    if (boundsRect.origin.y > -y)
                    {
                        boundsRect.origin.y = -y;
                    }

                    if (boundsRect.size.height < -y)
                    {
                        boundsRect.size.height = -y;
                    }
                }

                boundsRect.size.width -= boundsRect.origin.x;
                boundsRect.size.height -= boundsRect.origin.y;

                for (std::size_t i = 0; i < triangleCount * 3; ++i)
                {
                    vertexIndices[i] = intArray[currentVerticesData->offset + (unsigned)BinaryOffset::MeshVertexIndices + i];
                }

                const auto isSkinned = currentVerticesData->weight != nullptr;
                if (isSkinned)
                {
                    _identityTransform();
                }
            } else {
                adjustTriangles(4, 6);
                
                auto vertices = triangles.verts;
                auto vertexIndices = triangles.indices;
                
                float l = region.x / textureWidth;
                float b = (region.y + region.height) / textureHeight;
                float r = (region.x + region.width) / textureWidth;
                float t = region.y / textureHeight;
                
                vertices[0].texCoord.u = l; vertices[0].texCoord.v = b;
                vertices[1].texCoord.u = r; vertices[1].texCoord.v = b;
                vertices[2].texCoord.u = l; vertices[2].texCoord.v = t;
                vertices[3].texCoord.u = r; vertices[3].texCoord.v = t;
                
                vertices[0].vertex.x = vertices[2].vertex.x = 0;
                vertices[1].vertex.x = vertices[3].vertex.x = region.width;
                vertices[0].vertex.y = vertices[1].vertex.y = 0;
                vertices[2].vertex.y = vertices[3].vertex.y = region.height;
                
                vertexIndices[0] = 0;
                vertexIndices[1] = 1;
                vertexIndices[2] = 2;
                vertexIndices[3] = 1;
                vertexIndices[4] = 3;
                vertexIndices[5] = 2;
            }

            memcpy(worldVerts, triangles.verts, triangles.vertCount * sizeof(middleware::V2F_T2F_C4B));
            
            _visibleDirty = true;
            _blendModeDirty = true; // Relpace texture will override blendMode and color.
            _colorDirty = true;

            return;
        }
    }
}

void CCSlot::_updateMesh() 
{
    const auto scale = _armature->_armatureData->scale;
    const auto& deformVertices = _deformVertices->vertices;
    const auto& bones = _deformVertices->bones;
    const auto verticesData = _deformVertices->verticesData;
    const auto weightData = verticesData->weight;

    const auto hasFFD = !deformVertices.empty();
    const auto textureData = static_cast<CCTextureData*>(_textureData);
    const auto vertices = triangles.verts;
    
    boundsRect.origin.x = 999999.0f;
    boundsRect.origin.y = 999999.0f;
    boundsRect.size.width = -999999.0f;
    boundsRect.size.height = -999999.0f;

    if (!textureData)
    {
        return;
    }

    if (weightData != nullptr)
    {
        const auto data = verticesData->data;
        const auto intArray = data->intArray;
        const auto floatArray = data->floatArray;
        const auto vertexCount = (std::size_t)intArray[verticesData->offset + (unsigned)BinaryOffset::MeshVertexCount];
        int weightFloatOffset = intArray[weightData->offset + (unsigned)BinaryOffset::WeigthFloatOffset];

        if (vertexCount > triangles.vertCount) {
            return;
        }
        
        if (weightFloatOffset < 0)
        {
            weightFloatOffset += 65536; // Fixed out of bouds bug. 
        }

        for (
            std::size_t i = 0, iB = weightData->offset + (unsigned)BinaryOffset::WeigthBoneIndices + bones.size(), iV = (std::size_t)weightFloatOffset, iF = 0;
            i < vertexCount;
            ++i
        )
        {
            const auto boneCount = (std::size_t)intArray[iB++];
            auto xG = 0.0f, yG = 0.0f;
            for (std::size_t j = 0; j < boneCount; ++j)
            {
                const auto boneIndex = (unsigned)intArray[iB++];
                const auto bone = bones[boneIndex];
                if (bone != nullptr) 
                {
                    const auto& matrix = bone->globalTransformMatrix;
                    const auto weight = floatArray[iV++];
                    auto xL = floatArray[iV++] * scale;
                    auto yL = floatArray[iV++] * scale;

                    if (hasFFD) 
                    {
                        xL += deformVertices[iF++];
                        yL += deformVertices[iF++];
                    }

                    xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                    yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                }
            }

            auto& vertex = vertices[i];
            auto& vertexPosition = vertex.vertex;

            vertexPosition.x = xG;
            vertexPosition.y = -yG;

            if (boundsRect.origin.x > xG)
            {
                boundsRect.origin.x = xG;
            }

            if (boundsRect.size.width < xG)
            {
                boundsRect.size.width = xG;
            }

            if (boundsRect.origin.y > -yG)
            {
                boundsRect.origin.y = -yG;
            }

            if (boundsRect.size.height < -yG)
            {
                boundsRect.size.height = -yG;
            }
        }
    }
    else if (hasFFD)
    {
        const auto data = verticesData->data;
        const auto intArray = data->intArray;
        const auto floatArray = data->floatArray;
        const auto vertexCount = (std::size_t)intArray[verticesData->offset + (unsigned)BinaryOffset::MeshVertexCount];
        std::size_t vertexOffset = (std::size_t)intArray[verticesData->offset + (unsigned)BinaryOffset::MeshFloatOffset];

        if (vertexCount > triangles.vertCount) {
            return;
        }
        
        if (vertexOffset < 0)
        {
            vertexOffset += 65536; // Fixed out of bouds bug. 
        }

        for (std::size_t i = 0, l = vertexCount * 2; i < l; i += 2)
        {
            const auto iH = i / 2;
            const auto xG = floatArray[vertexOffset + i] * scale + deformVertices[i];
            const auto yG = floatArray[vertexOffset + i + 1] * scale + deformVertices[i + 1];

            auto& vertex = vertices[iH];
            auto& vertexPosition = vertex.vertex;
 
            vertexPosition.x = xG;
            vertexPosition.y = -yG;

            if (boundsRect.origin.x > xG)
            {
                boundsRect.origin.x = xG;
            }

            if (boundsRect.size.width < xG)
            {
                boundsRect.size.width = xG;
            }

            if (boundsRect.origin.y > -yG)
            {
                boundsRect.origin.y = -yG;
            }

            if (boundsRect.size.height < -yG)
            {
                boundsRect.size.height = -yG;
            }
        }
    }

    boundsRect.size.width -= boundsRect.origin.x;
    boundsRect.size.height -= boundsRect.origin.y;

    if (weightData != nullptr) 
    {
        _identityTransform();
    }
}

void CCSlot::_updateTransform()
{
    _localMatrix.m[0] = globalTransformMatrix.a;
    _localMatrix.m[1] = globalTransformMatrix.b;
    _localMatrix.m[4] = -globalTransformMatrix.c;
    _localMatrix.m[5] = -globalTransformMatrix.d;
    
    if (_childArmature)
    {
        _localMatrix.m[12] = globalTransformMatrix.tx;
        _localMatrix.m[13] = globalTransformMatrix.ty;
    }
    else 
    {
        _localMatrix.m[12] = globalTransformMatrix.tx - (globalTransformMatrix.a * _pivotX - globalTransformMatrix.c * _pivotY);
        _localMatrix.m[13] = globalTransformMatrix.ty - (globalTransformMatrix.b * _pivotX - globalTransformMatrix.d * _pivotY);
    }
    
    _worldMatDirty = true;
}

void CCSlot::updateWorldMatrix()
{
    if (!_armature)return;
    
    CCSlot* parent = (CCSlot*)_armature->getParent();
    if (parent)
    {
        parent->updateWorldMatrix();
    }
    
    if (_worldMatDirty)
    {
        calculWorldMatrix();
        
        Armature* childArmature = getChildArmature();
        if(!childArmature)return;
        
        auto& slots = childArmature->getSlots();
        for (int i = 0; i < slots.size(); i++)
        {
            CCSlot* slot = (CCSlot*)slots[i];
            slot->_worldMatDirty = true;
        }
    }
}

void CCSlot::calculWorldMatrix()
{
    CCSlot* parent = (CCSlot*)_armature->getParent();
    if (parent)
    {
        worldMatrix = parent->worldMatrix * _localMatrix;
    }
    else
    {
        worldMatrix = _localMatrix;
    }
    
    _worldMatDirty = false;
}

void CCSlot::_identityTransform()
{
    _localMatrix.m[0] = 1.0f;
    _localMatrix.m[1] = 0.0f;
    _localMatrix.m[4] = -0.0f;
    _localMatrix.m[5] = -1.0f;
    _localMatrix.m[12] = 0.0f;
    _localMatrix.m[13] = 0.0f;
    
    _worldMatDirty = true;
}

void CCSlot::_updateBlendMode()
{
    if (_childArmature != nullptr)
    {
        for (const auto slot : _childArmature->getSlots())
        {
            slot->_blendMode = _blendMode;
            slot->_updateBlendMode();
        }
    }
}

void CCSlot::_updateColor()
{
    color.r = _colorTransform.redMultiplier * 255.0f;
    color.g = _colorTransform.greenMultiplier * 255.0f;
    color.b = _colorTransform.blueMultiplier * 255.0f;
    color.a = _colorTransform.alphaMultiplier * 255.0f;
}

DRAGONBONES_NAMESPACE_END
