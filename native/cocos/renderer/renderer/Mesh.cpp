
#include "Mesh.hpp"
#include "../gfx/DeviceGraphics.h"

RENDERER_BEGIN

Mesh::Mesh ()
{
    
};

Mesh::~Mesh ()
{
    clear();
};

void Mesh::updateMeshData(std::size_t index, VertexFormat* vfm, se_object_ptr vertices,  se_object_ptr indices)
{
    if (index >= _datas.size())
    {
        _datas.resize(index + 1);
        
        MeshData& md = _datas[index];
        
        if (md.data == nullptr)
        {
            md.data = new RenderData();
        }
        
        md.data->setVertices(vertices);
        md.data->setIndices(indices);
        
        uint32_t vertexCount = (uint32_t)md.data->getVBytes() / vfm->getBytes();
        
        auto vb = new VertexBuffer();
        vb->init(DeviceGraphics::getInstance(), vfm, Usage::DYNAMIC, md.data->getVertices(), md.data->getVBytes(), vertexCount);
        md.vb = std::move(vb);
        
        auto ib = new IndexBuffer();
        ib->init(DeviceGraphics::getInstance(), IndexFormat::UINT16, Usage::STATIC, md.data->getIndices(), md.data->getIBytes(), (uint32_t)md.data->getIBytes() / sizeof(unsigned short));
        md.ib = std::move(ib);
    }
    else
    {
        MeshData& md = _datas[index];
        md.data->setVertices(vertices);
        md.data->setIndices(indices);
    }
};

void Mesh::setVertexData(std::size_t index, VertexFormat* vfm, se_object_ptr vertices)
{
    if (index >= _datas.size())
    {
        _datas.resize(index + 1);
    }

    MeshData& md = _datas[index];
    
    if (md.data == nullptr)
    {
        md.data = new RenderData();
    }
    
    md.data->setVertices(vertices);
    md.vdirty = true;
    
    if (md.vb == nullptr)
    {
        uint32_t vertexCount = (uint32_t)md.data->getVBytes() / vfm->getBytes();
        
        auto vb = new VertexBuffer();
        vb->init(DeviceGraphics::getInstance(), vfm, Usage::DYNAMIC, md.data->getVertices(), md.data->getVBytes(), vertexCount);
        md.vb = std::move(vb);
    }
};

void Mesh::setIndiceData(std::size_t index, se_object_ptr indices)
{
    if (index >= _datas.size())
    {
        _datas.resize(index + 1);
    }
    
    MeshData& md = _datas[index];
    
    if (md.data == nullptr)
    {
        md.data = new RenderData();
    }
    
    md.data->setIndices(indices);
    md.idirty = true;
    
    if (md.ib == nullptr)
    {
        auto ib = new IndexBuffer();
        ib->init(DeviceGraphics::getInstance(), IndexFormat::UINT16, Usage::STATIC, md.data->getIndices(), md.data->getIBytes(), (uint32_t)md.data->getIBytes() / sizeof(unsigned short));
        md.ib = std::move(ib);
    }
}

void Mesh::uploadData()
{
    for (size_t i = 0, len = _datas.size(); i < len; ++i )
    {
        auto& md = _datas[i];
        if (md.vdirty) {
            md.vb->update(0, md.data->getVertices(), md.data->getVBytes());
            md.vdirty = false;
        }
        
        if (md.idirty) {
            md.ib->update(0, md.data->getIndices(), md.data->getIBytes());
            md.vdirty = false;
        }
    }
};

Mesh::MeshData* Mesh::getMeshData(size_t index)
{
    if (index >= _datas.size())
    {
        return nullptr;
    }
    return &_datas[index];
}

void Mesh::clear()
{
    for (auto it = _datas.begin(); it != _datas.end(); it++)
    {
        it->data->clear();
        it->data = nullptr;
        
        it->vb->destroy();
        it->vb->release();
        
        it->ib->destroy();
        it->ib->release();
    }
    
    _datas.clear();
}

RENDERER_END
