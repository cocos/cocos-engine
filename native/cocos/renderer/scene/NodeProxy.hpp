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

#pragma once

#include <string>
#include <map>

#include "../Macro.h"
#include "base/CCRef.h"
#include "base/ccTypes.h"
#include "base/CCVector.h"
#include "base/CCMap.h"
#include "math/CCMath.h"
#include "assembler/AssemblerBase.hpp"

#include "MemPool.hpp"

namespace se {
    class Object;
}

RENDERER_BEGIN

class ModelBatcher;
class Scene;
struct TRS;
struct ParentInfo;

/**
 * @addtogroup scene
 * @{
 */

/**
 * @brief NodeProxy is a cpp delegator of js Node.\n
 * It synchronize the hierarchy from js node tree, update the transform each frame, and manages assembler which represent the render component.\n
 * JS API: renderer.NodeProxy
 @code
 let node = new cc.Node();
 // NodeProxy is automatically created by cc.Node
 let proxy = node._proxy;
 @endcode
 */
class NodeProxy : public Ref
{
public:
    /*
     * @brief The default constructor.
     */
    NodeProxy(std::size_t unitID, std::size_t index, const std::string& id, const std::string& name);
    /*
     * @brief The destructor.
     */
    ~NodeProxy();
    /*
     * @brief destroy node data immediately .
     */
    void destroyImmediately();
    
    /// @{
    /// @name Hierarchy

    /**
     *  @brief Adds child node proxy to the node proxy.
     *  @param[in] child A child node proxy pointer.
     */
    void addChild(NodeProxy * child);
    /**
     *  @brief Removes child node proxy from the node proxy.
     *  @param[in] child A child node proxy pointer.
     */
    void removeChild(NodeProxy* child);
    /**
     *  @brief Removes all child node proxies from the current one.
     */
    void removeAllChildren();
    /**
     *  @brief Update parent by parent unitId and index.
     */
    void notifyUpdateParent();
    
    /**
     *  @brief Sets the node proxy parent.
     *  @param[in] parent.
     */
    inline void setParent(NodeProxy* parent) { _parent = parent; };
    /**
     *  @brief Gets the node proxy parent.
     *  @return Parent.
     */
    inline NodeProxy* getParent() const { return _parent; };
    /**
     *  @brief Gets the node proxy all children.
     *  @return Children container.
     */
    inline const Vector<NodeProxy*>& getChildren() const { return _children; };
    /**
     *  @brief Gets the node proxy child count.
     *  @return Child count.
     */
    inline size_t getChildrenCount() const { return _children.size(); };
    /**
     *  @brief Gets a child node by name.
     *  @return Child node.
     */
    NodeProxy* getChildByName(std::string childName);
    /**
     *  @brief Gets a child node by runtime id.
     *  @return Child node.
     */
    NodeProxy* getChildByID(std::string id);
    /**
     *  @brief Sets the node proxy's local zorder.
     *  @param[in] zOrder The value of zorder.
     */
    void setLocalZOrder(int zOrder);

    /// @} end of Hierarchy
    
    /*
     *  @brief Gets the world matrix.
     *  @return World matrix.
     */
    inline const cocos2d::Mat4& getWorldMatrix() const { return *_worldMat; };
    /*
     *  @brief Gets the position.
     *  @param[out] out The position vector
     */
    void getPosition(cocos2d::Vec3* out) const;
    /*
     *  @brief Gets the rotation.
     *  @param[out] out The rotation quaternion.
     */
    void getRotation(cocos2d::Quaternion* out) const;
    /*
     *  @brief Gets the scale.
     *  @param[out] out The scale vector.
     */
    void getScale(cocos2d::Vec3* out) const;
    /*
     *  @brief Gets the position in world coordinates.
     *  @param[out] out The world position vector.
     */
    void getWorldPosition(cocos2d::Vec3* out) const;
    /*
     *  @brief Gets the matrix contains the world rotation and translation.
     *  @param[out] out The matrix to store datas.
     */
    void getWorldRT(cocos2d::Mat4* out) const;
    
    /**
     *  @brief Gets the node's opacity.
     */
    inline uint8_t getOpacity() const { return *_opacity; };
    /**
     *  @brief Sets the node's opacity.
     */
    void setOpacity(uint8_t opacity);
    /**
     *  @brief Updates opacity from parent.
     */
    void updateRealOpacity();
    /**
     *  @brief Gets the node's realOpacity.
     */
    inline const uint8_t getRealOpacity() const {return _realOpacity;};
    /**
     *  @brief Gets the node's group id, this controls which camera can see the node.
     */
    inline int getCullingMask() const { return *_cullingMask; };
    /**
     *  @brief Sets the node's group id.
     *  @param[in] groupID The group id
     */
    inline void setCullingMask(int cullingMask) { *_cullingMask = cullingMask; };
    
    /**
     *  @brief Gets the node's name.
     *  This equals to the one in JS node, helps to debug in cpp.
     *  @return name
     */
    inline const std::string& getName() const { return _name; };
    /**
     *  @brief Sets the node's name.
     *  The name should be updated once JS node's name changes.
     *  @param[in] name
     */
    inline void setName(const std::string& name) { _name = name; };
    
    /**
     *  @brief Sets the node's 3D state.
     *  @param[in] is3DNode
     */
    inline void set3DNode(bool is3DNode) { *_is3DNode = is3DNode ? 0x1 : 0x0; };
    
    /**
     *  @brief Sets a system handle to the node proxy, system handle will be invoked during node's visit process.
     *  @param[in] handle The system handle pointer.
     */
    void setAssembler(AssemblerBase* assembler);
    /**
     *  @brief Removes a system handle from node proxy by system id.
     *  @param[in] sysid The system id.
     */
    void clearAssembler();
    /**
     *  @brief Gets the system handle by system id.
     *  @param[in] sysid The system id.
     *  @return The system handle object or nullptr if not exist
     */
    AssemblerBase* getAssembler() const;
    /*
     *  @brief Visit the node as a ordinary node but not a root node.
     */
    void visit(ModelBatcher* batcher, Scene* scene);
    /*
     *  @brief Visit the node but do not transform position.
     */
    void render(ModelBatcher* batcher, Scene* scene);
    /*
     *  @brief Enables visit.
     */
    void enableVisit() { _needVisit = true; }
    
    /*
     *  @brief Disables visit.
     */
    void disableVisit() { _needVisit = false; }
    
    /*
     *  @brief Updates local matrix.
     */
    void updateLocalMatrix();
    /*
     *  @brief Updates world matrix.
     */
    void updateWorldMatrix();
    /*
     *  @brief Updates the world matrix with parent matrix.
     */
    void updateWorldMatrix(const cocos2d::Mat4& parentMatrix);
    /*
     *  @brief Enables calc world matrix.
     */
    void enableUpdateWorldMatrix() { _updateWorldMatrix = true; }
    /*
     *  @brief Disables calc world matrix.
     */
    void disaleUpdateWorldMatrix() { _updateWorldMatrix = false; }
    
    /*
     *  @brief Gets node runtime id
     */
    const std::string& getID() const { return _id; }
    
    /*
     *  @brief Gets node dirty
     */
    uint32_t* getDirty() const { return _dirty; }
    
    /*
     *  @brief Is node flag dirty
     */
    bool isDirty(uint32_t flag) const { return *_dirty & flag; }
protected:
    void updateLevel();
    void childrenAlloc();
    void detachChild(NodeProxy* child, ssize_t childIndex);
    void reorderChildren();
private:
    bool _needVisit = true;
    bool _updateWorldMatrix = true;
    bool _needRender = false;
    
    uint8_t _realOpacity = 255;
    std::string _id = "";
    std::string _name = "";
    std::size_t _level = 0;
    
    uint32_t* _dirty = nullptr;
    TRS* _trs = nullptr;
    cocos2d::Mat4* _localMat = nullptr;
    cocos2d::Mat4* _worldMat = nullptr;
    ParentInfo* _parentInfo = nullptr;
    int32_t* _localZOrder = nullptr;
    int32_t* _cullingMask = nullptr;
    uint8_t* _opacity = nullptr;
    uint8_t* _is3DNode = nullptr;
    std::size_t _unitID = 0;
    std::size_t _index = 0;
    
    Sign* _signData = nullptr;
    NodeProxy* _parent = nullptr;                  ///< weak reference to parent node
    cocos2d::Vector<NodeProxy*> _children;        ///< array of children nodes

    AssemblerBase* _assembler = nullptr;
};

// end of scene group
/// @}

RENDERER_END
