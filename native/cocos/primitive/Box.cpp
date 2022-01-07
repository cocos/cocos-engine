/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "primitive/Box.h"
#include "cocos/base/Optional.h"

namespace cc {
namespace {
const std::vector<std::vector<uint32_t>> FACE_AXES{
    {2, 3, 1}, // FRONT
    {4, 5, 7}, // BACK
    {7, 6, 2}, // TOP
    {1, 0, 4}, // BOTTOM
    {1, 4, 2}, // RIGHT
    {5, 0, 6}  // LEFT
};

const std::vector<std::vector<float>> FACE_NORMALS{
    {0, 0, 1},  // FRONT
    {0, 0, -1}, // BACK
    {0, 1, 0},  // TOP
    {0, -1, 0}, // BOTTOM
    {1, 0, 0},  // RIGHT
    {-1, 0, 0}  // LEFT
};

const std::vector<std::vector<float>> FACE_TANGENTS{
    {-1, 0, 0, 1}, // FRONT
    {-1, 0, 0, 1}, // BACK
    {-1, 0, 0, 1}, // TOP
    {-1, 0, 0, 1}, // BOTTOM
    {0, 0, -1, 1}, // RIGHT
    {0, 0, 1, 1}   // LEFT
};
} // namespace

IGeometry box(const cc::optional<IBoxOptions> &options) {
    const uint32_t ws = options->widthSegments.has_value() ? options->widthSegments.value() : 1;
    const uint32_t hs = options->heightSegments.has_value() ? options->heightSegments.value() : 1;
    const uint32_t ls = options->lengthSegments.has_value() ? options->lengthSegments.value() : 1;

    const float hw = options->width.has_value() ? options->width.value() / 2 : 1.0F / 2;
    const float hh = options->height.has_value() ? options->height.value() / 2 : 1.0F / 2;
    const float hl = options->length.has_value() ? options->length.value() / 2 : 1.0F / 2;

    std::vector<Vec3> corners{Vec3{-hw, -hh, hl}, Vec3{hw, -hh, hl}, Vec3{hw, hh, hl}, Vec3{-hw, hh, hl}, Vec3{hw, -hh, -hl}, Vec3{-hw, -hh, -hl}, Vec3{-hw, hh, -hl}, Vec3{hw, hh, -hl}};

    std::vector<float>    positions;
    std::vector<float>    normals;
    std::vector<float>    uvs;
    std::vector<float>    tangents;
    std::vector<uint32_t> indices;
    const Vec3            minPos(-hw, -hh, -hl);
    const Vec3            maxPos(hw, hh, hl);
    float                 boundingRadius{sqrt(hw * hw + hh * hh + hl * hl)};

    auto buildPlane = [&](uint32_t side, uint32_t uSegments, uint32_t vSegments) {
        float                  u           = 0;
        float                  v           = 0;
        const auto             offset      = static_cast<uint32_t>(positions.size() / 3);
        const vector<uint32_t> faceAxe     = FACE_AXES[side];
        const vector<float>    faceNormal  = FACE_NORMALS[side];
        const vector<float>    faceTangent = FACE_TANGENTS[side];

        for (index_t iy = 0; iy <= vSegments; ++iy) {
            for (index_t ix = 0; ix <= uSegments; ++ix) {
                u          = static_cast<float>(ix) / static_cast<float>(uSegments);
                v          = static_cast<float>(iy) / static_cast<float>(vSegments);
                Vec3 temp1 = corners[faceAxe[0]].lerp(corners[faceAxe[1]], u);
                Vec3 temp2 = corners[faceAxe[0]].lerp(corners[faceAxe[2]], v);
                temp2.subtract(corners[faceAxe[0]]);
                temp1.add(temp2);
                positions.emplace_back(temp1.x);
                positions.emplace_back(temp1.y);
                positions.emplace_back(temp1.z);

                normals.emplace_back(faceNormal[0]);
                normals.emplace_back(faceNormal[1]);
                normals.emplace_back(faceNormal[2]);

                uvs.emplace_back(u);
                uvs.emplace_back(v);
                tangents.emplace_back(faceTangent[0]);
                tangents.emplace_back(faceTangent[1]);
                tangents.emplace_back(faceTangent[2]);
                tangents.emplace_back(faceTangent[3]);

                if ((ix < uSegments) && (iy < vSegments)) {
                    auto       uSeg1 = uSegments + 1;
                    const auto a     = ix + iy * uSeg1;
                    const auto b     = ix + (iy + 1) * uSeg1;
                    const auto c     = (ix + 1) + (iy + 1) * uSeg1;
                    const auto d     = (ix + 1) + iy * uSeg1;

                    indices.emplace_back(offset + a);
                    indices.emplace_back(offset + d);
                    indices.emplace_back(offset + b);

                    indices.emplace_back(offset + b);
                    indices.emplace_back(offset + d);
                    indices.emplace_back(offset + c);
                }
            }
        }
    };

    buildPlane(0, ws, hs); // FRONT
    buildPlane(4, ls, hs); // RIGHT
    buildPlane(1, ws, hs); // BACK
    buildPlane(5, ls, hs); // LEFT
    buildPlane(3, ws, ls); // BOTTOM
    buildPlane(2, ws, ls); // TOP

    IGeometry info;
    info.positions      = positions;
    info.normals        = normals;
    info.uvs            = uvs;
    info.tangents       = tangents;
    info.boundingRadius = boundingRadius;
    info.minPos         = minPos;
    info.maxPos         = maxPos;
    info.indices        = indices;
    return info;
}

} // namespace cc