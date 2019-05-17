/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#include "RendererUtils.h"

#include "gfx/VertexFormat.h"
#include "gfx/VertexBuffer.h"
#include "gfx/IndexBuffer.h"

#include "InputAssembler.h"

RENDERER_BEGIN

InputAssembler* createIA(DeviceGraphics* device, const IAData& data)
{
    if (data.positions.empty())
    {
        RENDERER_LOGD("The data must have positions field!");
        return nullptr;
    }

    std::vector<float> verts;
    verts.reserve(data.positions.size() + data.normals.size() + data.uvs.size());
    size_t vcount = data.positions.size() / 3;

    for (size_t i = 0; i < vcount; ++i) {
        verts.push_back(data.positions[3 * i]);
        verts.push_back(data.positions[3 * i + 1]);
        verts.push_back(data.positions[3 * i + 2]);

        if (!data.normals.empty()) {
            verts.push_back(data.normals[3 * i]);
            verts.push_back(data.normals[3 * i + 1]);
            verts.push_back(data.normals[3 * i + 2]);
        }

        if (!data.uvs.empty()) {
            verts.push_back(data.uvs[2 * i]);
            verts.push_back(data.uvs[2 * i + 1]);
        }
    }

    std::vector<VertexFormat::Info> vfmt;
    vfmt.push_back({ ATTRIB_NAME_POSITION, AttribType::FLOAT32, 3});

    if (!data.normals.empty())
        vfmt.push_back({ ATTRIB_NAME_NORMAL, AttribType::FLOAT32, 3});

    if (!data.uvs.empty())
        vfmt.push_back({ ATTRIB_NAME_UV0, AttribType::FLOAT32, 2});

    VertexFormat* fmt = new VertexFormat(vfmt);
    auto vb = new VertexBuffer();
    vb->init(device, fmt, Usage::STATIC, verts.data(), verts.size() * sizeof(float), (uint32_t)vcount);
    fmt->release();

    IndexBuffer* ib = nullptr;

    if (!data.indices.empty())
    {
        ib = new IndexBuffer();
        ib->init(device, IndexFormat::UINT16, Usage::STATIC, data.indices.data(), data.indices.size() * sizeof(uint16_t), (uint32_t)data.indices.size());
    }

    auto ia = new InputAssembler();
    ia->init(vb, ib);
    return ia;
}

RENDERER_END
